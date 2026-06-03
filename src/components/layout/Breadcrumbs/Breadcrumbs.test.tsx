import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("next-intl/server", () => ({
  getLocale: async () => "en",
  getTranslations: async () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
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
  getPathname: ({ href }: { href: string }) => href,
}));

import { Breadcrumbs, type BreadcrumbItem } from "./Breadcrumbs";

const FULL_CRUMBS: BreadcrumbItem[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "M3030VA" },
];

async function renderAsync(items: BreadcrumbItem[]) {
  const tree = await Breadcrumbs({ items });
  return render(tree);
}

function readJsonLd(container: HTMLElement) {
  const script = container.querySelector('script[type="application/ld+json"]');
  expect(script).not.toBeNull();
  return JSON.parse(script!.innerHTML);
}

describe("Breadcrumbs", () => {
  it("renders the last item as plain text with aria-current=page", async () => {
    const { container } = await renderAsync(FULL_CRUMBS);

    const items = container.querySelectorAll(".lt-breadcrumbs__item");
    expect(items).toHaveLength(3);
    expect(items[2]).toHaveAttribute("aria-current", "page");
    expect(items[2]).toHaveClass("lt-breadcrumbs__item--current");
    expect(items[2].querySelector("a")).toBeNull();
    expect(items[2].textContent).toBe("M3030VA");
  });

  it("renders earlier items with hrefs as Link anchors", async () => {
    const { container } = await renderAsync(FULL_CRUMBS);

    const links = container.querySelectorAll(".lt-breadcrumbs__link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/products");
  });

  it("renders items without href as plain text even when not last", async () => {
    const { container } = await renderAsync([
      { label: "Catalogue" },
      { label: "M3030VA" },
    ]);

    const items = container.querySelectorAll(".lt-breadcrumbs__item");
    expect(items[0].querySelector("a")).toBeNull();
    expect(items[0].textContent).toBe("Catalogue");
  });

  it("renders the last item as plain text even when it has an href", async () => {
    // Guards the `!isLast` half of `item.href && !isLast` — a regression that
    // dropped the isLast check would still render the last crumb as a link.
    const { container } = await renderAsync([{ label: "Detail", href: "/x" }]);

    expect(container.querySelector(".lt-breadcrumbs__link")).toBeNull();
    const current = container.querySelector(".lt-breadcrumbs__item--current");
    expect(current).not.toBeNull();
    expect(current?.textContent).toBe("Detail");
  });

  it("emits a BreadcrumbList JsonLD with one ListItem per crumb", async () => {
    const { container } = await renderAsync(FULL_CRUMBS);

    const ld = readJsonLd(container);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
      name: "Home",
    });
    expect(ld.itemListElement[0].item).toMatch(/\/$/);
    expect(ld.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Products",
    });
    expect(ld.itemListElement[1].item).toMatch(/\/products$/);
  });

  it("omits the `item` URL for crumbs without an href", async () => {
    const { container } = await renderAsync([
      { label: "Home", href: "/" },
      { label: "M3030VA" },
    ]);
    const ld = readJsonLd(container);
    expect(ld.itemListElement[1]).toEqual({
      "@type": "ListItem",
      position: 2,
      name: "M3030VA",
    });
    expect(ld.itemListElement[1].item).toBeUndefined();
  });
});
