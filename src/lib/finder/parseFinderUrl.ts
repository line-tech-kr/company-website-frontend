import type { ProductFinderInitial } from "@/components/finder/ProductFinder";
import {
  type FinderFunction,
  type FinderSeries,
  type FinderUnit,
} from "./match";
import { PRESSURE_UNITS, type PressureUnit } from "./pressure";

const FUNCTIONS: ReadonlySet<FinderFunction> = new Set([
  "any",
  "MFC",
  "MFM",
  "EPC",
]);
const SERIES: ReadonlySet<FinderSeries> = new Set([
  "any",
  "analogue",
  "digital",
  "specialized",
  "lepc",
]);
const UNITS: ReadonlySet<FinderUnit> = new Set(["slpm", "sccm"]);
const PRESSURE_UNIT_SET: ReadonlySet<PressureUnit> = new Set(PRESSURE_UNITS);

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseFinderUrl(
  raw: Record<string, string | string[] | undefined>,
): ProductFinderInitial {
  const initial: ProductFinderInitial = {};
  const fn = pickString(raw.fn);
  if (fn && FUNCTIONS.has(fn as FinderFunction)) {
    initial.fn = fn as FinderFunction;
  }
  const gas = pickString(raw.gas);
  if (gas) initial.gas = gas;
  const flow = pickString(raw.flow);
  if (flow) {
    const n = Number(flow);
    if (Number.isFinite(n) && n > 0) initial.flow = n;
  }
  const unit = pickString(raw.unit);
  if (unit && UNITS.has(unit as FinderUnit)) {
    initial.unit = unit as FinderUnit;
  }
  const series = pickString(raw.series);
  if (series && SERIES.has(series as FinderSeries)) {
    initial.series = series as FinderSeries;
  }
  const pressure = pickString(raw.p);
  if (pressure) {
    const n = Number(pressure);
    if (Number.isFinite(n) && n > 0) initial.pressure = n;
  }
  const pressureUnit = pickString(raw.pu);
  if (pressureUnit && PRESSURE_UNIT_SET.has(pressureUnit as PressureUnit)) {
    initial.pressureUnit = pressureUnit as PressureUnit;
  }
  // `gasMix=silane:5,nitrogen:95` — comma-separated gasId:percent pairs.
  const gasMix = pickString(raw.gasMix);
  if (gasMix) {
    const components = gasMix.split(",").flatMap((entry) => {
      const [gasId, percentRaw] = entry.split(":");
      if (!gasId) return [];
      const percent = Number(percentRaw);
      if (!Number.isFinite(percent) || percent <= 0) return [];
      return [{ gasId: gasId.trim(), percent }];
    });
    if (components.length > 0) {
      initial.gasMode = "mixture";
      initial.components = components;
    }
  }
  return initial;
}
