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

import { EpcRow } from "./EpcRow";
import { makeProduct } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";

function renderRow(product: Product) {
  return render(
    <table>
      <tbody>
        <EpcRow product={product} imageSrc={null} category="lepc" locale="en" />
      </tbody>
    </table>,
  );
}

const baseEpc = makeProduct({
  model: "LEPC",
  slug: { current: "lepc" },
  series: "lepc",
  function: "EPC",
  connections: [{ type: '1/4" VCR', length: "60mm", _key: "c1" }],
  massFlowSpecs: {
    ...makeProduct().massFlowSpecs!,
    flowRange: undefined,
    pressureRange: {
      display: "0.1–6 barA",
      min: 0.1,
      max: 6,
      unit: "barA",
    },
    accuracy: { display: "±0.5% F.S.", value: 0.5, unit: "% F.S." },
    maxPressure: { display: "50 bar", value: 50, unit: "bar" },
  },
});

describe("EpcRow", () => {
  it("renders pressure range, accuracy, max pressure, and fitting", () => {
    const { container } = renderRow(baseEpc);
    expect(
      container.querySelector(".lt-epc-row__cell--pressure")?.textContent,
    ).toBe("0.1–6 barA");
    expect(
      container.querySelector(".lt-epc-row__cell--accuracy")?.textContent,
    ).toBe("±0.5% F.S.");
    expect(
      container.querySelector(".lt-epc-row__cell--max-pressure")?.textContent,
    ).toBe("50 bar");
    expect(
      container.querySelector(".lt-epc-row__cell--fitting")?.textContent,
    ).toBe("VCR");
  });

  it("falls back to em-dash when maxPressure or fitting is missing", () => {
    const product = makeProduct({
      ...baseEpc,
      connections: [],
      massFlowSpecs: {
        ...baseEpc.massFlowSpecs!,
        maxPressure: undefined,
      },
    });
    const { container } = renderRow(product);
    expect(
      container.querySelector(".lt-epc-row__cell--max-pressure")?.textContent,
    ).toBe("—");
    expect(
      container.querySelector(".lt-epc-row__cell--fitting")?.textContent,
    ).toBe("—");
  });
});
