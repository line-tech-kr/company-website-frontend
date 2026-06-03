import React, { createRef } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
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

// Mock Fuse so we control the result set without exercising fuzzy-search ranking.
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

function mockFetchOk() {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ json: () => Promise.resolve(INDEX) });
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

function mockFetchReject() {
  const fetchMock = vi.fn().mockRejectedValue(new Error("offline"));
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  return fetchMock;
}

beforeEach(() => {
  routerPush.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SearchPanel", () => {
  it("renders inert while closed and does not fetch the search index", () => {
    const fetchMock = mockFetchOk();
    const { container } = renderPanel(false);
    const root = container.querySelector(".pd-search") as HTMLElement;
    expect(root).not.toHaveClass("is-open");
    expect(root.hasAttribute("inert")).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fetches the locale-aware index when opened", async () => {
    const fetchMock = mockFetchOk();
    renderPanel(true);
    expect(fetchMock).toHaveBeenCalledWith("/search/index.en.json");
    // Let the index load.
    await act(async () => {
      await Promise.resolve();
    });
  });

  it("typing a query renders one result row per hit", async () => {
    mockFetchOk();
    const { container, getByPlaceholderText } = renderPanel(true);
    await act(async () => {
      await Promise.resolve();
    });

    const input = getByPlaceholderText("Search products…") as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: "MS" } });
    });

    const results = container.querySelectorAll(".pd-search__result");
    expect(results).toHaveLength(1);
    expect(results[0]).toHaveAttribute("href", "/products/analogue/ms3150va");
    expect(results[0]).toHaveTextContent("MS3150VA");
  });

  it("renders the empty state with the interpolated query when there are no matches", async () => {
    mockFetchOk();
    const { container, getByPlaceholderText } = renderPanel(true);
    await act(async () => {
      await Promise.resolve();
    });

    const input = getByPlaceholderText("Search products…") as HTMLInputElement;
    await act(async () => {
      fireEvent.change(input, { target: { value: "nothingmatches" } });
    });

    const empty = container.querySelector(".pd-search__empty");
    expect(empty).not.toBeNull();
    expect(empty).toHaveTextContent("No results for nothingmatches.");
  });

  it("falls back to the unavailable message when the index fetch rejects", async () => {
    mockFetchReject();
    const { container } = renderPanel(true);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.querySelector(".pd-search__unavailable")).not.toBeNull();
  });

  it("clicking a chip with a known URL closes the panel and pushes the route", async () => {
    mockFetchOk();
    const onClose = vi.fn();
    const { getByText } = renderPanel(true, onClose);
    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.click(getByText("M3030VA"));
    expect(routerPush).toHaveBeenCalledWith("/products/analogue/m3030va");
    expect(onClose).toHaveBeenCalled();
  });

  it("pressing Escape calls onClose via the dialog hook", async () => {
    mockFetchOk();
    const onClose = vi.fn();
    renderPanel(true, onClose);
    await act(async () => {
      await Promise.resolve();
    });

    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
});
