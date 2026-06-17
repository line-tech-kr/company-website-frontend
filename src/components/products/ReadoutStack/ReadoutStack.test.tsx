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

import { ReadoutStack } from "./ReadoutStack";
import { rouProductFixture } from "@/test/fixtures/products";

const headers = {
  model: "Model",
  description: "Features",
  display: "Display",
  power: "Input power",
  communication: "Communication",
  connector: "Connector",
};

describe("ReadoutStack", () => {
  it("renders readout column headers and a row per product", () => {
    const { container, getByText } = render(
      <ReadoutStack
        title="Read-Out Units"
        subtitle="Instruments"
        products={[rouProductFixture]}
        category="explosion-proof"
        locale="en"
        emptyLabel="No products"
        headers={headers}
      />,
    );
    expect(getByText("Display")).toBeTruthy();
    expect(getByText("Input power")).toBeTruthy();
    expect(getByText("Communication")).toBeTruthy();
    expect(getByText("Connector")).toBeTruthy();
    expect(container.querySelectorAll("tbody tr").length).toBe(1);
    // Verifies the row pulled the display slot, not an em-dash.
    expect(
      container.querySelector(".lt-readout-row__cell--display")?.textContent,
    ).toBe("256×64 OLED");
  });

  it("renders the empty state when products is empty", () => {
    const { container, getByText } = render(
      <ReadoutStack
        title="Read-Out Units"
        subtitle="Instruments"
        products={[]}
        category="explosion-proof"
        locale="en"
        emptyLabel="No products yet"
        headers={headers}
      />,
    );
    expect(container.querySelector("tbody")).toBeNull();
    expect(container.querySelector(".lt-prod-row")).toBeNull();
    expect(getByText("No products yet")).toBeTruthy();
  });
});
