import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PressureInput } from "./PressureInput";

const LABELS = {
  legend: "Operating pressure",
  placeholder: "e.g. 2",
  unitAria: "Pressure unit",
};

function setup(
  initial: { pressure: number | ""; unit?: "bar" | "kPa" } = {
    pressure: "",
  },
) {
  const onPressureChange = vi.fn();
  const onUnitChange = vi.fn();
  render(
    <PressureInput
      pressure={initial.pressure}
      unit={initial.unit ?? "bar"}
      onPressureChange={onPressureChange}
      onUnitChange={onUnitChange}
      labels={LABELS}
    />,
  );
  return { onPressureChange, onUnitChange };
}

describe("<PressureInput />", () => {
  it("emits the numeric value when the user types a number", () => {
    const { onPressureChange } = setup();
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "5" },
    });
    expect(onPressureChange).toHaveBeenCalledWith(5);
  });

  it("emits empty-string when the user clears the field", () => {
    const { onPressureChange } = setup({ pressure: 5 });
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
    expect(onPressureChange).toHaveBeenCalledWith("");
  });

  it("does not emit when the user types non-numeric garbage", () => {
    const { onPressureChange } = setup();
    // Native number inputs strip non-numeric text via the browser; jsdom
    // delivers an empty value here. Either way, the handler must not invoke
    // with NaN — its `Number.isFinite` guard owns that contract.
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "abc" },
    });
    for (const call of onPressureChange.mock.calls) {
      expect(call[0] === "" || Number.isFinite(call[0])).toBe(true);
    }
  });

  it("emits the unit change without touching the value", () => {
    const { onPressureChange, onUnitChange } = setup({ pressure: 2 });
    fireEvent.change(screen.getByRole("combobox", { name: LABELS.unitAria }), {
      target: { value: "kPa" },
    });
    expect(onUnitChange).toHaveBeenCalledWith("kPa");
    expect(onPressureChange).not.toHaveBeenCalled();
  });

  it("renders the accessible legend and placeholder", () => {
    setup();
    expect(screen.getByText(LABELS.legend)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(LABELS.placeholder)).toBeInTheDocument();
  });
});
