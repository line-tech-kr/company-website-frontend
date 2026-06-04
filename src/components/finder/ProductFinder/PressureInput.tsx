"use client";

import { PRESSURE_UNITS, type PressureUnit } from "@/lib/finder/pressure";

type Props = {
  pressure: number | "";
  unit: PressureUnit;
  onPressureChange: (next: number | "") => void;
  onUnitChange: (next: PressureUnit) => void;
  labels: { legend: string; placeholder: string; unitAria: string };
};

export function PressureInput({
  pressure,
  unit,
  onPressureChange,
  onUnitChange,
  labels,
}: Props) {
  return (
    <fieldset className="lt-finder__group">
      <legend className="lt-finder__label">{labels.legend}</legend>
      <div className="lt-finder__input-row">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          className="lt-finder__num"
          placeholder={labels.placeholder}
          value={pressure}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onPressureChange("");
            else {
              const n = Number(v);
              if (Number.isFinite(n)) onPressureChange(n);
            }
          }}
        />
        <select
          className="lt-finder__unit"
          aria-label={labels.unitAria}
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as PressureUnit)}
        >
          {PRESSURE_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
