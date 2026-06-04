"use client";

import type { FinderUnit } from "@/lib/finder/match";

type Props = {
  flow: number | "";
  unit: FinderUnit;
  onFlowChange: (next: number | "") => void;
  onUnitChange: (next: FinderUnit) => void;
  labels: { legend: string; unit: { slpm: string; sccm: string } };
};

export function FlowInput({
  flow,
  unit,
  onFlowChange,
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
          value={flow}
          onChange={(e) => {
            const v = e.target.value;
            if (v === "") onFlowChange("");
            else {
              const n = Number(v);
              if (Number.isFinite(n)) onFlowChange(n);
            }
          }}
        />
        <select
          className="lt-finder__unit"
          value={unit}
          onChange={(e) => onUnitChange(e.target.value as FinderUnit)}
        >
          <option value="slpm">{labels.unit.slpm}</option>
          <option value="sccm">{labels.unit.sccm}</option>
        </select>
      </div>
    </fieldset>
  );
}
