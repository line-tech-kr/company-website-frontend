import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ProductFinder } from "./ProductFinder";
import { makeProduct } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";

const replace = vi.fn();

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
  usePathname: () => "/products/finder",
  useRouter: () => ({ replace, push: vi.fn() }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, vars?: Record<string, unknown>) => {
    if (vars && "count" in vars) return `${key}:${vars.count}`;
    if (vars && "n2" in vars) return `${key}:${vars.n2}`;
    return key;
  },
}));

function withRange(
  model: string,
  min: number,
  max: number,
  overrides: Partial<Product> = {},
): Product {
  return makeProduct({
    model,
    slug: { current: model.toLowerCase() },
    massFlowSpecs: {
      ...makeProduct().massFlowSpecs!,
      flowRange: { display: `${min}-${max} slpm`, min, max, unit: "slpm" },
    },
    ...overrides,
  });
}

/** Resolve the flow number input by walking down from its fieldset legend. */
function flowSpin(): HTMLElement {
  return within(screen.getByRole("group", { name: "flow.label" })).getByRole(
    "spinbutton",
  );
}

/** Resolve the pressure number input by walking down from its fieldset legend. */
function pressureSpin(): HTMLElement {
  return within(
    screen.getByRole("group", { name: "pressure.label" }),
  ).getByRole("spinbutton");
}

const PRODUCTS: Product[] = [
  withRange("M3030VA", 0.01, 300, { series: "analogue", function: "MFC" }),
  withRange("M3200VA", 100, 300, { series: "analogue", function: "MFC" }),
  withRange("EX1000", 70, 1000, { series: "specialized", function: "MFC" }),
];

beforeEach(() => {
  replace.mockClear();
});

describe("<ProductFinder />", () => {
  it("renders all form groups", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    expect(screen.getByText("fn.label")).toBeInTheDocument();
    expect(screen.getByText("gas.label")).toBeInTheDocument();
    expect(screen.getByText("flow.label")).toBeInTheDocument();
    expect(screen.getByText("series.label")).toBeInTheDocument();
  });

  it("shows the prompt before any flow rate is entered", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    expect(screen.getByText("results.prompt")).toBeInTheDocument();
  });

  it("computes matches once a flow rate is entered", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(flowSpin(), { target: { value: "200" } });
    expect(screen.getByText(/results\.heading:/)).toBeInTheDocument();
    expect(screen.getByText("M3030VA")).toBeInTheDocument();
    expect(screen.getByText("M3200VA")).toBeInTheDocument();
  });

  it("respects the function filter chips", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(flowSpin(), { target: { value: "200" } });
    fireEvent.click(screen.getByRole("radio", { name: "fn.mfc" }));
    expect(screen.getByText("M3030VA")).toBeInTheDocument();
  });

  it("filters out products outside the requested range", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(flowSpin(), { target: { value: "10000" } });
    expect(screen.getByText("results.empty")).toBeInTheDocument();
  });

  it("syncs state to the URL via router.replace", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(flowSpin(), { target: { value: "250" } });
    expect(replace).toHaveBeenCalled();
    const lastCall = replace.mock.calls.at(-1)![0];
    expect(lastCall.query.flow).toBe("250");
  });

  it("shows specialty-gas warning when a specialty gas is picked", () => {
    render(
      <ProductFinder
        products={PRODUCTS}
        locale="en"
        initial={{ gas: "hydrogen-fluoride", flow: 100, unit: "slpm" }}
      />,
    );
    expect(screen.getByText("results.specialtyWarning")).toBeInTheDocument();
  });

  it("does not show specialty-gas warning for common gases", () => {
    render(
      <ProductFinder
        products={PRODUCTS}
        locale="en"
        initial={{ gas: "nitrogen", flow: 100, unit: "slpm" }}
      />,
    );
    expect(
      screen.queryByText("results.specialtyWarning"),
    ).not.toBeInTheDocument();
  });

  it("opens the gas combobox and lists pinned common gases", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    const combo = screen.getByPlaceholderText("gas.placeholder");
    fireEvent.focus(combo);
    expect(screen.getByText("gas.commonLabel")).toBeInTheDocument();
    const list = screen.getByRole("listbox");
    expect(within(list).getByText("Nitrogen")).toBeInTheDocument();
    expect(within(list).getByText("Helium")).toBeInTheDocument();
  });

  it("matches gases by ASCII formula like 'CO2' (not just the subscripted 'CO₂')", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    const combo = screen.getByPlaceholderText("gas.placeholder");
    fireEvent.focus(combo);
    fireEvent.change(combo, { target: { value: "CO2" } });
    const list = screen.getByRole("listbox");
    expect(within(list).getByText("Carbon Dioxide")).toBeInTheDocument();
    expect(within(list).queryByText("Nitrogen")).not.toBeInTheDocument();
  });

  it("matches gases by ASCII formula 'SF6' and 'NH3'", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    const combo = screen.getByPlaceholderText("gas.placeholder");
    fireEvent.focus(combo);
    fireEvent.change(combo, { target: { value: "SF6" } });
    expect(
      within(screen.getByRole("listbox")).getByText("Sulfur Hexafluoride"),
    ).toBeInTheDocument();
    fireEvent.change(combo, { target: { value: "NH3" } });
    expect(
      within(screen.getByRole("listbox")).getByText("Ammonia"),
    ).toBeInTheDocument();
  });

  it("supports keyboard navigation in the gas combobox", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    const combo = screen.getByPlaceholderText(
      "gas.placeholder",
    ) as HTMLInputElement;
    fireEvent.focus(combo);
    fireEvent.keyDown(combo, { key: "ArrowDown" });
    fireEvent.keyDown(combo, { key: "Enter" });
    fireEvent.change(flowSpin(), { target: { value: "100" } });
    expect(screen.getByDisplayValue(/O₂/)).toBeInTheDocument();
  });

  describe("gas mixture mode", () => {
    it("renders the mixture editor when the user toggles to Mixture", () => {
      render(<ProductFinder products={PRODUCTS} locale="en" />);
      // Mixture editor is hidden in pure mode.
      expect(
        screen.queryByRole("button", { name: "+ gas.addComponent" }),
      ).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("radio", { name: "gas.modeMixture" }));
      expect(
        screen.getByRole("button", { name: "+ gas.addComponent" }),
      ).toBeInTheDocument();
    });

    it("emits ?gasMix to the URL (and drops ?gas) when filled in", () => {
      render(<ProductFinder products={PRODUCTS} locale="en" />);
      fireEvent.click(screen.getByRole("radio", { name: "gas.modeMixture" }));
      const percentInputs = within(
        screen.getByRole("group", { name: "gas.label" }),
      ).getAllByRole("spinbutton");
      fireEvent.change(percentInputs[0], { target: { value: "5" } });
      fireEvent.change(percentInputs[1], { target: { value: "95" } });
      fireEvent.change(flowSpin(), { target: { value: "100" } });
      const lastCall = replace.mock.calls.at(-1)![0];
      expect(lastCall.query.gasMix).toBe("nitrogen:5,nitrogen:95");
      expect(lastCall.query.gas).toBeUndefined();
    });

    it("hides the Mixture toggle when EPC is selected (no flow → no K-factor)", () => {
      render(<ProductFinder products={PRODUCTS} locale="en" />);
      // Visible in pure-mode default.
      expect(
        screen.getByRole("radio", { name: "gas.modeMixture" }),
      ).toBeInTheDocument();
      fireEvent.click(screen.getByRole("radio", { name: "fn.epc" }));
      expect(
        screen.queryByRole("radio", { name: "gas.modeMixture" }),
      ).not.toBeInTheDocument();
    });

    it("pre-fills the mixture editor from initial state", () => {
      render(
        <ProductFinder
          products={PRODUCTS}
          locale="en"
          initial={{
            gasMode: "mixture",
            components: [
              { gasId: "silane", percent: 5 },
              { gasId: "nitrogen", percent: 95 },
            ],
            flow: 100,
            unit: "slpm",
          }}
        />,
      );
      const percentInputs = within(
        screen.getByRole("group", { name: "gas.label" }),
      ).getAllByRole("spinbutton");
      expect(percentInputs[0]).toHaveValue(5);
      expect(percentInputs[1]).toHaveValue(95);
    });
  });

  describe("pressure input", () => {
    const lowPressureMfc = withRange("MFC-LOW", 0.01, 300, {
      series: "analogue",
      function: "MFC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: {
          display: "0.01-300 slpm",
          min: 0.01,
          max: 300,
          unit: "slpm",
        },
        maxPressure: {
          display: "<3 bar",
          value: 3,
          unit: "bar",
          comparator: "lt",
        },
      },
    });
    const highPressureMfc = withRange("MFC-HIGH", 0.01, 300, {
      series: "analogue",
      function: "MFC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: {
          display: "0.01-300 slpm",
          min: 0.01,
          max: 300,
          unit: "slpm",
        },
        maxPressure: {
          display: "<10 bar",
          value: 10,
          unit: "bar",
          comparator: "lt",
        },
      },
    });
    const PRESSURE_PRODUCTS: Product[] = [lowPressureMfc, highPressureMfc];

    it("syncs the pressure value to the URL as ?p", () => {
      render(<ProductFinder products={PRESSURE_PRODUCTS} locale="en" />);
      fireEvent.change(flowSpin(), { target: { value: "100" } });
      fireEvent.change(pressureSpin(), { target: { value: "2" } });
      const lastCall = replace.mock.calls.at(-1)![0];
      expect(lastCall.query.p).toBe("2");
    });

    it("appends ?pu when the unit differs from bar default", () => {
      render(<ProductFinder products={PRESSURE_PRODUCTS} locale="en" />);
      fireEvent.change(flowSpin(), { target: { value: "100" } });
      fireEvent.change(pressureSpin(), { target: { value: "200" } });
      fireEvent.change(
        screen.getByRole("combobox", { name: "pressure.unitAria" }),
        { target: { value: "kPa" } },
      );
      const lastCall = replace.mock.calls.at(-1)![0];
      expect(lastCall.query.p).toBe("200");
      expect(lastCall.query.pu).toBe("kPa");
    });

    it("filters matches by maxPressure when a pressure is entered", () => {
      render(<ProductFinder products={PRESSURE_PRODUCTS} locale="en" />);
      fireEvent.change(flowSpin(), { target: { value: "100" } });
      expect(screen.getByText("MFC-LOW")).toBeInTheDocument();
      expect(screen.getByText("MFC-HIGH")).toBeInTheDocument();
      fireEvent.change(pressureSpin(), { target: { value: "5" } });
      expect(screen.queryByText("MFC-LOW")).not.toBeInTheDocument();
      expect(screen.getByText("MFC-HIGH")).toBeInTheDocument();
    });

    it("pre-fills pressure value + unit from initial props", () => {
      render(
        <ProductFinder
          products={PRESSURE_PRODUCTS}
          locale="en"
          initial={{
            flow: 100,
            unit: "slpm",
            pressure: 200,
            pressureUnit: "kPa",
          }}
        />,
      );
      // 200 kPa = 2 bar → MFC-LOW (max 3 bar) should still match.
      expect(screen.getByText("MFC-LOW")).toBeInTheDocument();
      expect(screen.getByDisplayValue("200")).toBeInTheDocument();
    });
  });
});
