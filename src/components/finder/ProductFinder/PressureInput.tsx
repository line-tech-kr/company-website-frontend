"use client";

import { PRESSURE_UNITS, type PressureUnit } from "@/lib/finder/pressure";

type Props = {
  value: number | "";
  unit: PressureUnit;
  onValueChange: (next: number | "") => void;
  onUnitChange: (next: PressureUnit) => void;
  labels: { legend: string; placeholder: string };
};

export function PressureInput({
  value,
  unit,
  onValueChange,
  onUnitChange,
  labels,
}: Props) {
  return (
    <fieldset className="lt-finder__group">
      <legend className="lt-finder__label">{labels.legend}</legend>
      <div className="lt-finder__flow">
        <input
          type="number"
          inputMode="decimal"
          min={0}
          step="any"
          className="lt-finder__num"
          placeholder={labels.placeholder}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onValueChange("");
            else {
              const n = Number(v);
              if (Number.isFinite(n)) onValueChange(n);
            }
          }}
        />
        <select
          className="lt-finder__unit"
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
