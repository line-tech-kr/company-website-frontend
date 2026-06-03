import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ResultCard } from "./ResultCard";
import { makeProduct } from "@/test/fixtures/products";

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: { href: unknown; children: React.ReactNode } & Record<
    string,
    unknown
  >) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ResultCard range label", () => {
  it("uses the flow-range label when flowRange is present", () => {
    const product = makeProduct({
      model: "TEST-FLOW",
      slug: { current: "test-flow" },
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: { display: "0-100 slpm", min: 0, max: 100, unit: "slpm" },
        pressureRange: undefined,
      },
    });
    render(
      <ResultCard
        match={{ product, n2EquivalentSlpm: 50, fitScore: 1 }}
        locale="en"
      />,
    );
    expect(screen.getByText("flowRange")).toBeInTheDocument();
    expect(screen.queryByText("pressureRange")).toBeNull();
    expect(screen.getByText("0-100 slpm")).toBeInTheDocument();
  });

  it("falls back to the pressure-range label when only pressureRange is present", () => {
    const baseSpecs = makeProduct().massFlowSpecs!;
    const product = makeProduct({
      model: "TEST-EPC",
      slug: { current: "test-epc" },
      function: "EPC",
      series: "lepc",
      massFlowSpecs: {
        ...baseSpecs,
        flowRange: undefined,
        pressureRange: {
          display: "0.1-6 barA",
          min: 0.1,
          max: 6,
          unit: "barA",
        },
      },
    });
    render(
      <ResultCard
        match={{ product, n2EquivalentSlpm: 0, fitScore: 1 }}
        locale="en"
      />,
    );
    expect(screen.getByText("pressureRange")).toBeInTheDocument();
    expect(screen.queryByText("flowRange")).toBeNull();
    expect(screen.getByText("0.1-6 barA")).toBeInTheDocument();
  });
});
