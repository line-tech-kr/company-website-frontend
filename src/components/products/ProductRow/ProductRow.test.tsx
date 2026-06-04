import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";

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
  useRouter: () => ({ push: vi.fn() }),
}));

import { ProductRow } from "./ProductRow";
import { makeProduct } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";

function renderRow(product: Product) {
  return render(
    <table>
      <tbody>
        <ProductRow
          product={product}
          imageSrc={null}
          category="specialized"
          locale="en"
        />
      </tbody>
    </table>,
  );
}

describe("ProductRow fitting cell", () => {
  it("dedupes connection-type suffixes (DO400's three SW fittings → 'SW')", () => {
    const do400 = makeProduct({
      model: "DO400",
      slug: { current: "do400" },
      connections: [
        { type: '1/2" SW', length: "208.5 mm", _key: "c1" },
        { type: '3/4" SW', length: "208.5 mm", _key: "c2" },
        { type: '1" SW', length: "217.2 mm", _key: "c3" },
      ],
    });
    const { container } = renderRow(do400);
    expect(
      container.querySelector(".lt-prod-row__cell--fit")?.textContent,
    ).toBe("SW");
  });

  it("joins distinct suffixes with ' · '", () => {
    const mixed = makeProduct({
      connections: [
        { type: '1/4" SWG', length: "131.3 mm", _key: "c1" },
        { type: '1/4" VCR', length: "127.8 mm", _key: "c2" },
      ],
    });
    const { container } = renderRow(mixed);
    expect(
      container.querySelector(".lt-prod-row__cell--fit")?.textContent,
    ).toBe("SWG · VCR");
  });

  it("renders an empty fitting cell when connections is empty", () => {
    // Documents the current behaviour: no em-dash fallback (PR #207 closed
    // as superseded by the data restoration). If a defensive empty-state
    // is added later for LTI-1000/LTI-2000, update this assertion.
    const empty = makeProduct({ connections: [] });
    const { container } = renderRow(empty);
    expect(
      container.querySelector(".lt-prod-row__cell--fit")?.textContent,
    ).toBe("");
  });
});
