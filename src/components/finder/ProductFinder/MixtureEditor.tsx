"use client";

import type { GasComponent } from "@/lib/finder/mixture";
import { isMixturePercentValid } from "@/lib/finder/mixture";
import { GasSelect } from "./GasSelect";

export type MixtureEditorLabels = {
  gasLegend: string;
  gasPlaceholder: string;
  gasCommon: string;
  gasAll: string;
  gasEmpty: string;
  percentAria: string;
  addComponent: string;
  removeComponent: string;
  totalLabel: string;
};

type Props = {
  components: GasComponent[];
  onChange: (next: GasComponent[]) => void;
  labels: MixtureEditorLabels;
};

const DEFAULT_GAS = "nitrogen";

/** Two empty seed rows — the QuoteFields convention. */
export function defaultMixtureComponents(): GasComponent[] {
  return [
    { gasId: DEFAULT_GAS, percent: 0 },
    { gasId: DEFAULT_GAS, percent: 0 },
  ];
}

export function MixtureEditor({ components, onChange, labels }: Props) {
  const totalPercent = components.reduce(
    (sum, c) => sum + (Number.isFinite(c.percent) ? c.percent : 0),
    0,
  );
  const totalValid = isMixturePercentValid(totalPercent);
  const minRows = 2;
  const canRemove = components.length > minRows;

  function updateAt(index: number, patch: Partial<GasComponent>) {
    onChange(components.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function add() {
    onChange([...components, { gasId: DEFAULT_GAS, percent: 0 }]);
  }

  function removeAt(index: number) {
    if (components.length <= minRows) return;
    onChange(components.filter((_, i) => i !== index));
  }

  return (
    <div className="lt-mix">
      <ul
        className={`lt-mix__rows${canRemove ? " lt-mix__rows--removable" : ""}`}
      >
        {components.map((component, index) => (
          <li key={index} className="lt-mix__row">
            <div className="lt-mix__row-gas">
              <GasSelect
                value={component.gasId}
                onChange={(gasId) => updateAt(index, { gasId })}
                hideLabel
                labels={{
                  legend: labels.gasLegend,
                  placeholder: labels.gasPlaceholder,
                  common: labels.gasCommon,
                  all: labels.gasAll,
                  empty: labels.gasEmpty,
                }}
              />
            </div>
            <label className="lt-mix__row-percent">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step="any"
                className="lt-finder__num"
                value={component.percent === 0 ? "" : component.percent}
                placeholder="0"
                onChange={(e) =>
                  updateAt(index, {
                    percent: e.target.value === "" ? 0 : Number(e.target.value),
                  })
                }
                aria-label={`${labels.percentAria} ${index + 1}`}
              />
              <span aria-hidden="true">%</span>
            </label>
            {canRemove && (
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="lt-mix__row-remove"
                aria-label={labels.removeComponent}
              >
                ×
              </button>
            )}
          </li>
        ))}
      </ul>
      <div className="lt-mix__actions">
        <button type="button" className="lt-mix__add" onClick={add}>
          + {labels.addComponent}
        </button>
        <span
          className={`lt-mix__total ${totalValid ? "lt-mix__total--ok" : "lt-mix__total--bad"}`}
          role="status"
          aria-live="polite"
        >
          {labels.totalLabel}: {formatTotal(totalPercent)}%
        </span>
      </div>
    </div>
  );
}

function formatTotal(value: number): string {
  return Number.isInteger(value)
    ? String(value)
    : Number(value.toFixed(4)).toString();
}
