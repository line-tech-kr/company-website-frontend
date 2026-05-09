"use client";

import type { FinderSeries } from "@/lib/finder/match";

const ORDER: readonly FinderSeries[] = [
  "any",
  "analogue",
  "digital",
  "specialized",
] as const;

type Props = {
  value: FinderSeries;
  onChange: (next: FinderSeries) => void;
  labels: Record<FinderSeries, string>;
  legend: string;
};

export function SeriesPicker({ value, onChange, labels, legend }: Props) {
  return (
    <fieldset className="lt-finder__group">
      <legend className="lt-finder__label">{legend}</legend>
      <div className="lt-finder__chips" role="radiogroup">
        {ORDER.map((s) => {
          const active = value === s;
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={active}
              className={`lt-finder__chip${active ? " lt-finder__chip--on" : ""}`}
              onClick={() => onChange(s)}
            >
              {labels[s]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
