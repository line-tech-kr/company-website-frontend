import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { QuoteFields } from "./QuoteFields";
import type { ContactFormCopy } from "@/lib/content/contact";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const form: ContactFormCopy["quoteFields"] = {
  heading: "Process conditions",
  helper: "Fill in.",
  gas: {
    label: "Gas",
    placeholder: "e.g. N2",
    suggestions: ["N2", "Ar", "SiH4"],
    pureLabel: "Pure gas",
    mixtureLabel: "Mixture",
    componentLabel: "Gas",
    percentLabel: "Percent",
    addComponentLabel: "Add component",
    removeComponentLabel: "Remove",
    totalLabel: "Total",
  },
  flow: {
    label: "Flow rate",
    valuePlaceholder: "500",
    units: [
      { value: "sccm", label: "sccm" },
      { value: "slm", label: "slm" },
    ],
  },
  pressure: {
    label: "Pressure",
    valuePlaceholder: "2",
    units: [
      { value: "bar", label: "bar" },
      { value: "psi", label: "psi" },
    ],
  },
  fitting: {
    typeLabel: "Fitting type",
    typePlaceholder: "Select",
    sizeLabel: "Fitting size",
    sizePlaceholder: '1/4"',
    types: [
      { value: "VCR", label: "VCR" },
      { value: "Swagelok", label: "Swagelok" },
    ],
  },
};

function renderQuote(invalid: ReadonlySet<string> = new Set()) {
  return render(
    <form>
      <QuoteFields
        form={form}
        requiredLabel="Required"
        invalidFields={invalid}
        fieldErrId={(name) => `ct-${name}-err`}
      />
    </form>,
  );
}

describe("QuoteFields", () => {
  it("starts in pure mode with a single gas input", () => {
    renderQuote();
    expect(screen.getByLabelText(/Pure gas/)).toBeChecked();
    expect(document.getElementById("ct-gas")).not.toBeNull();
    expect(document.querySelector('[name="gasComponents"]')).toBeNull();
    const modeInput = document.querySelector(
      'input[type="hidden"][name="gasMode"]',
    );
    expect(modeInput?.getAttribute("value")).toBe("pure");
  });

  it("switches to mixture mode and renders two component rows by default", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));

    const components = document.querySelectorAll(".ct-form__gas-component");
    expect(components.length).toBe(2);
    expect(document.getElementById("ct-gas")).toBeNull();
    const modeInput = document.querySelector(
      'input[type="hidden"][name="gasMode"]',
    );
    expect(modeInput?.getAttribute("value")).toBe("mixture");
  });

  it("disables the Remove button when only 2 components remain", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));
    const removes = screen.getAllByRole("button", { name: "Remove" });
    expect(removes).toHaveLength(2);
    removes.forEach((btn) => expect(btn).toBeDisabled());
  });

  it("adds a third component on demand and re-enables Remove on the first two", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));
    fireEvent.click(screen.getByRole("button", { name: /Add component/ }));

    const components = document.querySelectorAll(".ct-form__gas-component");
    expect(components.length).toBe(3);

    const removes = screen.getAllByRole("button", { name: "Remove" });
    expect(removes).toHaveLength(3);
    removes.forEach((btn) => expect(btn).not.toBeDisabled());

    // Removing one drops back to two, and the remaining buttons re-disable.
    fireEvent.click(removes[2]);
    expect(document.querySelectorAll(".ct-form__gas-component").length).toBe(2);
    screen
      .getAllByRole("button", { name: "Remove" })
      .forEach((btn) => expect(btn).toBeDisabled());
  });

  it("updates the hidden gasComponents JSON as the user types", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));

    const components = document.querySelectorAll(".ct-form__gas-component");
    const row1 = components[0] as HTMLElement;
    const row2 = components[1] as HTMLElement;

    fireEvent.change(within(row1).getByLabelText("Gas 1") as HTMLInputElement, {
      target: { value: "SiH4" },
    });
    fireEvent.change(
      within(row1).getByLabelText("Percent 1") as HTMLInputElement,
      { target: { value: "5" } },
    );
    fireEvent.change(within(row2).getByLabelText("Gas 2") as HTMLInputElement, {
      target: { value: "N2" },
    });
    fireEvent.change(
      within(row2).getByLabelText("Percent 2") as HTMLInputElement,
      { target: { value: "95" } },
    );

    const hidden = document.querySelector(
      '[data-testid="ct-gas-components"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe(
      '[{"gas":"SiH4","percent":5},{"gas":"N2","percent":95}]',
    );
  });

  it("flips the total badge between --bad and --ok at sum-to-100", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));

    const total = document.querySelector(
      '[data-testid="ct-gas-total"]',
    ) as HTMLElement;
    expect(total.className).toMatch(/--bad/);

    const components = document.querySelectorAll(".ct-form__gas-component");
    fireEvent.change(
      within(components[0] as HTMLElement).getByLabelText(
        "Percent 1",
      ) as HTMLInputElement,
      { target: { value: "30" } },
    );
    fireEvent.change(
      within(components[1] as HTMLElement).getByLabelText(
        "Percent 2",
      ) as HTMLInputElement,
      { target: { value: "70" } },
    );

    expect(total.className).toMatch(/--ok/);
  });

  it("encodes blank percent inputs as null (not NaN) in the wire format", () => {
    renderQuote();
    fireEvent.click(screen.getByLabelText(/Mixture/));

    const hidden = document.querySelector(
      '[data-testid="ct-gas-components"]',
    ) as HTMLInputElement;
    expect(hidden.value).toBe(
      '[{"gas":"","percent":null},{"gas":"","percent":null}]',
    );
  });

  it("surfaces the gasComponents field error when the schema rejects", () => {
    renderQuote(new Set(["gasComponents"]));
    fireEvent.click(screen.getByLabelText(/Mixture/));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "fieldErrors.gasComponents",
    );
  });
});
