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

const PRODUCTS: Product[] = [
  withRange("M3030VA", 0.01, 300, { series: "analogue", function: "MFC" }),
  withRange("M3200VA", 100, 300, { series: "analogue", function: "MFC" }),
  withRange("EX1000C", 70, 1000, { series: "specialized", function: "MFC" }),
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
    const flowInput = screen.getAllByRole("spinbutton")[0];
    fireEvent.change(flowInput, { target: { value: "200" } });
    expect(screen.getByText(/results\.heading:/)).toBeInTheDocument();
    expect(screen.getByText("M3030VA")).toBeInTheDocument();
    expect(screen.getByText("M3200VA")).toBeInTheDocument();
  });

  it("respects the function filter chips", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(screen.getAllByRole("spinbutton")[0], {
      target: { value: "200" },
    });
    // Only "MFC" — no MFM/EPC products in our fixture, but function chip should still work
    fireEvent.click(screen.getByRole("radio", { name: "fn.mfc" }));
    expect(screen.getByText("M3030VA")).toBeInTheDocument();
  });

  it("filters out products outside the requested range", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(screen.getAllByRole("spinbutton")[0], {
      target: { value: "10000" },
    });
    expect(screen.getByText("results.empty")).toBeInTheDocument();
  });

  it("syncs state to the URL via router.replace", () => {
    render(<ProductFinder products={PRODUCTS} locale="en" />);
    fireEvent.change(screen.getAllByRole("spinbutton")[0], {
      target: { value: "250" },
    });
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
    // Other CO₂-typed entries (e.g. CO₂ shouldn't pull in unrelated gases) — sanity check
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
    // First pinned gas after Nitrogen (default) is Oxygen — but ArrowDown from index 0 lands on index 1 = Oxygen
    fireEvent.change(screen.getAllByRole("spinbutton")[0], {
      target: { value: "100" },
    });
    expect(screen.getByDisplayValue(/O₂/)).toBeInTheDocument();
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
      const [flow, pressure] = screen.getAllByRole("spinbutton");
      fireEvent.change(flow, { target: { value: "100" } });
      fireEvent.change(pressure, { target: { value: "2" } });
      const lastCall = replace.mock.calls.at(-1)![0];
      expect(lastCall.query.p).toBe("2");
    });

    it("appends ?pu when the unit differs from bar default", () => {
      render(<ProductFinder products={PRESSURE_PRODUCTS} locale="en" />);
      const [flow, pressure] = screen.getAllByRole("spinbutton");
      fireEvent.change(flow, { target: { value: "100" } });
      fireEvent.change(pressure, { target: { value: "200" } });
      const unitSelects = screen.getAllByRole("combobox");
      // The first combobox is the gas combobox; the unit <select>s come after.
      // Pressure unit is the last <select> on the form.
      const selects = unitSelects.filter((el) => el.tagName === "SELECT");
      fireEvent.change(selects[selects.length - 1], {
        target: { value: "kPa" },
      });
      const lastCall = replace.mock.calls.at(-1)![0];
      expect(lastCall.query.p).toBe("200");
      expect(lastCall.query.pu).toBe("kPa");
    });

    it("filters matches by maxPressure when a pressure is entered", () => {
      render(<ProductFinder products={PRESSURE_PRODUCTS} locale="en" />);
      const [flow, pressure] = screen.getAllByRole("spinbutton");
      // Without pressure: both MFCs surface.
      fireEvent.change(flow, { target: { value: "100" } });
      expect(screen.getByText("MFC-LOW")).toBeInTheDocument();
      expect(screen.getByText("MFC-HIGH")).toBeInTheDocument();
      // With pressure 5 bar: MFC-LOW (max 3 bar) drops out.
      fireEvent.change(pressure, { target: { value: "5" } });
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
