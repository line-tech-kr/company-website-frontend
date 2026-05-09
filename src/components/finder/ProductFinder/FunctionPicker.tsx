"use client";

import type { FinderFunction } from "@/lib/finder/match";

const ORDER: readonly FinderFunction[] = ["any", "MFC", "MFM", "EPC"] as const;

type Props = {
  value: FinderFunction;
  onChange: (next: FinderFunction) => void;
  labels: Record<FinderFunction, string>;
  legend: string;
};

export function FunctionPicker({ value, onChange, labels, legend }: Props) {
  return (
    <fieldset className="lt-finder__group">
      <legend className="lt-finder__label">{legend}</legend>
      <div className="lt-finder__chips" role="radiogroup">
        {ORDER.map((fn) => {
          const active = value === fn;
          return (
            <button
              key={fn}
              type="button"
              role="radio"
              aria-checked={active}
              className={`lt-finder__chip${active ? " lt-finder__chip--on" : ""}`}
              onClick={() => onChange(fn)}
            >
              {labels[fn]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
