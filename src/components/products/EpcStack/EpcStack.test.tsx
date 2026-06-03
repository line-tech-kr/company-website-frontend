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

vi.mock("@/sanity/imageUrl", () => ({
  urlFor: () => ({ width: () => ({ url: () => "" }) }),
}));

import { EpcStack } from "./EpcStack";
import { makeProduct } from "@/test/fixtures/products";

const headers = {
  model: "Model",
  description: "Features",
  pressureRange: "Pressure range",
  accuracy: "Accuracy",
  maxPressure: "Max pressure",
  fitting: "Fitting",
};

const lepcFixture = makeProduct({
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

describe("EpcStack", () => {
  it("renders EPC column headers and a row per product", () => {
    const { container, getByText } = render(
      <EpcStack
        title="Electronic Pressure Controllers · EPC"
        subtitle="Pressure controllers"
        products={[lepcFixture]}
        category="lepc"
        locale="en"
        emptyLabel="No products"
        headers={headers}
      />,
    );
    expect(getByText("Pressure range")).toBeTruthy();
    expect(getByText("Max pressure")).toBeTruthy();
    expect(getByText("Fitting")).toBeTruthy();
    expect(container.querySelectorAll("tbody tr").length).toBe(1);
    expect(
      container.querySelector(".lt-epc-row__cell--pressure")?.textContent,
    ).toBe("0.1–6 barA");
    expect(
      container.querySelector(".lt-epc-row__cell--max-pressure")?.textContent,
    ).toBe("50 bar");
  });

  it("renders the empty state when products is empty", () => {
    const { container, getByText } = render(
      <EpcStack
        title="Electronic Pressure Controllers · EPC"
        subtitle="Pressure controllers"
        products={[]}
        category="lepc"
        locale="en"
        emptyLabel="No EPC products yet"
        headers={headers}
      />,
    );
    expect(container.querySelector("tbody")).toBeNull();
    expect(getByText("No EPC products yet")).toBeTruthy();
  });
});
