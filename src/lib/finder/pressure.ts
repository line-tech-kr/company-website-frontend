export type PressureUnit = "bar" | "kPa" | "psi" | "MPa";

export const PRESSURE_UNITS: readonly PressureUnit[] = [
  "bar",
  "kPa",
  "psi",
  "MPa",
] as const;

const TO_BAR: Record<PressureUnit, number> = {
  bar: 1,
  kPa: 0.01,
  psi: 0.0689475729,
  MPa: 10,
};

export function toBar(value: number, unit: PressureUnit): number {
  return value * TO_BAR[unit];
}

/**
 * Normalize a catalogue-side pressure unit string (e.g. "bar", "barA", "barG",
 * "kPa", "MPa", "psi") to bar. Treats absolute/gauge variants as bar — the
 * atmospheric offset is in the noise for finder ranking.
 */
export function catalogValueToBar(
  value: number,
  unit: string | undefined,
): number | null {
  if (!Number.isFinite(value)) return null;
  if (!unit) return value;
  const normalized = unit.trim().toLowerCase();
  if (normalized.startsWith("bar")) return value;
  if (normalized === "kpa") return value * TO_BAR.kPa;
  if (normalized === "mpa") return value * TO_BAR.MPa;
  if (normalized === "psi" || normalized === "psig" || normalized === "psia") {
    return value * TO_BAR.psi;
  }
  return null;
}
