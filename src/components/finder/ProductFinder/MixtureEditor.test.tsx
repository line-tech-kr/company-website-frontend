import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import type { GasComponent } from "@/lib/finder/mixture";
import { MixtureEditor, defaultMixtureComponents } from "./MixtureEditor";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

const LABELS = {
  gasLegend: "Gas",
  gasPlaceholder: "Pick a gas",
  gasCommon: "Common",
  gasAll: "All",
  gasEmpty: "No matches",
  percentAria: "Component percent",
  addComponent: "Add component",
  removeComponent: "Remove component",
  totalLabel: "Total",
};

function setup(initial: GasComponent[] = defaultMixtureComponents()) {
  const onChange = vi.fn();
  let value = initial;
  const { rerender } = render(
    <MixtureEditor
      components={value}
      onChange={(next) => {
        value = next;
        onChange(next);
        rerender(
          <MixtureEditor
            components={next}
            onChange={onChange}
            labels={LABELS}
          />,
        );
      }}
      labels={LABELS}
    />,
  );
  return { onChange, get: () => value };
}

describe("<MixtureEditor />", () => {
  it("renders two seed rows by default and hides the remove buttons", () => {
    setup();
    const removeButtons = screen.queryAllByRole("button", {
      name: "Remove component",
    });
    expect(removeButtons).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: /Add component/ }),
    ).toBeInTheDocument();
  });

  it("adds a row when '+ Add component' is clicked, exposing remove buttons", () => {
    const { get } = setup();
    fireEvent.click(screen.getByRole("button", { name: /Add component/ }));
    expect(get()).toHaveLength(3);
    expect(
      screen.getAllByRole("button", { name: "Remove component" }),
    ).toHaveLength(3);
  });

  it("updates a component percent on input", () => {
    const { get } = setup();
    const inputs = screen.getAllByRole("spinbutton");
    fireEvent.change(inputs[0], { target: { value: "90" } });
    expect(get()[0].percent).toBe(90);
  });

  it("removes a row when × clicked (only available with 3+ rows)", () => {
    const { get } = setup([
      { gasId: "nitrogen", percent: 80 },
      { gasId: "oxygen", percent: 10 },
      { gasId: "argon", percent: 10 },
    ]);
    const removes = screen.getAllByRole("button", {
      name: "Remove component",
    });
    expect(removes).toHaveLength(3);
    fireEvent.click(removes[2]);
    expect(get()).toHaveLength(2);
  });

  it("marks the total data-state=ok when components sum to 100", () => {
    setup([
      { gasId: "nitrogen", percent: 95 },
      { gasId: "silane", percent: 5 },
    ]);
    const total = screen.getByRole("status");
    expect(total).toHaveAttribute("data-state", "ok");
    expect(total).toHaveTextContent(/100/);
  });

  it("marks the total data-state=bad when components do not sum to 100", () => {
    setup([
      { gasId: "nitrogen", percent: 80 },
      { gasId: "silane", percent: 5 },
    ]);
    const total = screen.getByRole("status");
    expect(total).toHaveAttribute("data-state", "bad");
    expect(total).toHaveTextContent(/85/);
  });

  it("gives each percent input a distinct row-numbered aria-label", () => {
    setup();
    expect(screen.getByLabelText("Component percent 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Component percent 2")).toBeInTheDocument();
  });

  it("hides the % glyph from assistive tech (aria-hidden)", () => {
    const { container } = render(
      <MixtureEditor
        components={defaultMixtureComponents()}
        onChange={vi.fn()}
        labels={LABELS}
      />,
    );
    const glyphs = container.querySelectorAll('[aria-hidden="true"]');
    // One per row: the visual "%" glyph next to each number input.
    expect(glyphs.length).toBeGreaterThanOrEqual(2);
    for (const g of glyphs) expect(g.textContent).toBe("%");
  });
});
