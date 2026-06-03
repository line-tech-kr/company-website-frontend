import React, { createRef } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import {
  stubFetchJson,
  stubFetchReject,
  restoreFetch,
} from "@/test/helpers/fetch";
import type { ShellSearch } from "@/lib/content/shell";
import type { SearchEntry } from "@/lib/search/types";

vi.mock("next-intl", () => ({
  useLocale: () => "en",
}));

const routerPush = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  useRouter: () => ({ push: routerPush }),
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: unknown;
    children: React.ReactNode;
  } & Record<string, unknown>) =>
    React.createElement(
      "a",
      { href: typeof href === "string" ? href : "#", ...rest },
      children,
    ),
}));

// Deterministic substring match keeps result assertions stable across Fuse upgrades.
vi.mock("fuse.js", () => {
  class FakeFuse {
    constructor(private entries: SearchEntry[]) {}
    search(query: string) {
      const q = query.toLowerCase();
      return this.entries
        .filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.model?.toLowerCase().includes(q),
        )
        .map((item) => ({ item }));
    }
  }
  return { default: FakeFuse };
});

import { SearchPanel } from "./SearchPanel";

const CONTENT: ShellSearch = {
  openLabel: "Open search",
  heading: "Search",
  inputLabel: "Search input",
  inputPlaceholder: "Search products…",
  quickChips: [
    { id: "m3030va", label: "M3030VA" },
    { id: "digital-mfc", label: "Digital MFC" },
    { id: "free-search", label: "MS3150" },
  ],
  noResults: "No results for {q}.",
  searchUnavailable: "Search is unavailable.",
  browseProducts: "Browse products",
};

const INDEX: SearchEntry[] = [
  {
    id: "p:m3030va",
    type: "product",
    title: "M3030VA",
    model: "M3030VA",
    url: "/products/analogue/m3030va",
    breadcrumb: "Products › Analogue",
  },
  {
    id: "p:ms3150va",
    type: "product",
    title: "MS3150VA",
    model: "MS3150VA",
    url: "/products/analogue/ms3150va",
    breadcrumb: "Products › Analogue",
  },
];

function renderPanel(
  open: boolean,
  onClose: () => void = vi.fn(),
  triggerRef = createRef<HTMLButtonElement | null>(),
) {
  return render(
    <SearchPanel
      content={CONTENT}
      open={open}
      onClose={onClose}
      triggerRef={triggerRef}
    />,
  );
}

// The index load chains `fetch().then(r => r.json()).then(entries => …)` —
// two awaited microtasks before `setIndexReady`. One flush isn't enough.
async function flushIndexLoad() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

describe("SearchPanel", () => {
  beforeEach(() => {
    routerPush.mockReset();
  });

  afterEach(() => {
    restoreFetch();
    vi.restoreAllMocks();
  });

  it("renders inert while closed and does not fetch the search index", () => {
    const fetchMock = stubFetchJson(INDEX);
    const { container } = renderPanel(false);
    const root = container.querySelector(".pd-search") as HTMLElement;
    expect(root).not.toHaveClass("is-open");
    expect(root.hasAttribute("inert")).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches the locale-aware index when opened", async () => {
    const fetchMock = stubFetchJson(INDEX);
    renderPanel(true);
    expect(fetchMock).toHaveBeenCalledWith("/search/index.en.json");
    await flushIndexLoad();
  });

  it("typing a query renders one result row per hit", async () => {
    stubFetchJson(INDEX);
    const { container, getByPlaceholderText } = renderPanel(true);
    await flushIndexLoad();

    const input = getByPlaceholderText("Search products…");
    await act(async () => {
      fireEvent.change(input, { target: { value: "MS" } });
    });

    const results = container.querySelectorAll(".pd-search__result");
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveAttribute("href", "/products/analogue/ms3150va");
    expect(results[0]).toHaveTextContent("MS3150VA");
  });

  it("renders the empty state with the interpolated query when there are no matches", async () => {
    stubFetchJson(INDEX);
    const { container, getByPlaceholderText } = renderPanel(true);
    await flushIndexLoad();

    const input = getByPlaceholderText("Search products…");
    await act(async () => {
      fireEvent.change(input, { target: { value: "nothingmatches" } });
    });

    const empty = container.querySelector(".pd-search__empty");
    expect(empty).not.toBeNull();
    expect(empty).toHaveTextContent("No results for nothingmatches.");
  });

  it("clearing the input dismisses the results region", async () => {
    stubFetchJson(INDEX);
    const { container, getByPlaceholderText } = renderPanel(true);
    await flushIndexLoad();

    const input = getByPlaceholderText("Search products…");
    await act(async () => {
      fireEvent.change(input, { target: { value: "M" } });
    });
    expect(
      container.querySelectorAll(".pd-search__result").length,
    ).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.change(input, { target: { value: "" } });
    });
    expect(container.querySelector(".pd-search__results")).toBeNull();
  });

  it("falls back to the unavailable message when the index fetch rejects", async () => {
    stubFetchReject(new Error("offline"));
    const { container } = renderPanel(true);
    await flushIndexLoad();

    expect(container.querySelector(".pd-search__unavailable")).not.toBeNull();
  });

  it("clicking a chip with a known URL closes the panel and pushes the route", async () => {
    stubFetchJson(INDEX);
    const onClose = vi.fn();
    const { getByText } = renderPanel(true, onClose);
    await flushIndexLoad();

    fireEvent.click(getByText("M3030VA"));
    expect(routerPush).toHaveBeenCalledWith("/products/analogue/m3030va");
    expect(onClose).toHaveBeenCalled();
  });

  it("clicking a free-search chip seeds the input and runs Fuse without leaving the panel", async () => {
    stubFetchJson(INDEX);
    const onClose = vi.fn();
    const { container, getByPlaceholderText, getByText } = renderPanel(
      true,
      onClose,
    );
    await flushIndexLoad();

    // The "disabled until index ready" branch should have flipped.
    const chip = getByText("MS3150") as HTMLButtonElement;
    expect(chip.disabled).toBe(false);

    await act(async () => {
      fireEvent.click(chip);
    });

    expect(
      (getByPlaceholderText("Search products…") as HTMLInputElement).value,
    ).toBe("MS3150");
    const results = container.querySelectorAll(".pd-search__result");
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveTextContent("MS3150VA");
    expect(routerPush).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("pressing Escape calls onClose and resets the input + results via close()", async () => {
    stubFetchJson(INDEX);
    const onClose = vi.fn();
    const { container, getByPlaceholderText } = renderPanel(true, onClose);
    await flushIndexLoad();

    const input = getByPlaceholderText("Search products…") as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: "MS" } });
    });
    expect(
      container.querySelectorAll(".pd-search__result").length,
    ).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(onClose).toHaveBeenCalled();
    expect(input.value).toBe("");
    expect(container.querySelector(".pd-search__results")).toBeNull();
  });

  it("ArrowDown from the input moves focus to the first result; ArrowUp returns it", async () => {
    stubFetchJson(INDEX);
    const { container, getByPlaceholderText } = renderPanel(true);
    await flushIndexLoad();

    const input = getByPlaceholderText("Search products…") as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: "M" } });
    });
    const results =
      container.querySelectorAll<HTMLAnchorElement>(".pd-search__result");
    expect(results.length).toBeGreaterThanOrEqual(1);

    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(document.activeElement).toBe(results[0]);

    fireEvent.keyDown(results[0], { key: "ArrowUp" });
    expect(document.activeElement).toBe(input);
  });
});
