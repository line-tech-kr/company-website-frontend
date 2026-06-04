import {
  type GasCategory,
  type GasFactor,
  type GasSealNote,
  getGasFactor,
} from "./gas-factors";

export type GasComponent = {
  gasId: string;
  /** Mole/volume fraction as a percentage (0..100). */
  percent: number;
};

export type MixtureResult = {
  /** Effective K-factor for the blend, relative to N₂. */
  factor: number;
  /** "specialty" if any component is specialty. */
  category: GasCategory;
  /** Sum of component percentages — caller validates against 100. */
  totalPercent: number;
  /** Most restrictive seal recommendation across specialty components, if any. */
  sealNote?: GasSealNote;
};

export type MixtureError = {
  /** gasId of the first component not found in the gas table. */
  missingGas: string;
};

const PERCENT_TOLERANCE = 0.1;

/**
 * Mixture K-factor via the FAQ-documented harmonic mean:
 *   1/K_mix = Σ (pᵢ/100) / Kᵢ
 *
 * Returns null for an empty or all-blank list, an error when any component
 * references an unknown gasId, otherwise the computed factor. Components
 * summing outside 100 ± 0.1% still produce a factor — the caller decides
 * whether to treat the sum as valid.
 */
export function computeMixtureFactor(
  components: readonly GasComponent[],
): MixtureResult | MixtureError | null {
  const usable = components.filter(
    (c) => c.gasId.trim() !== "" && Number.isFinite(c.percent) && c.percent > 0,
  );
  if (usable.length === 0) return null;

  const resolved: { component: GasComponent; gas: GasFactor }[] = [];
  for (const component of usable) {
    const gas = getGasFactor(component.gasId);
    if (!gas) return { missingGas: component.gasId };
    resolved.push({ component, gas });
  }

  let denominator = 0;
  let totalPercent = 0;
  let category: GasCategory = "common";
  let sealNote: GasSealNote | undefined;
  for (const { component, gas } of resolved) {
    const fraction = component.percent / 100;
    denominator += fraction / gas.factor;
    totalPercent += component.percent;
    if (gas.category === "specialty") category = "specialty";
    sealNote = pickWorstSeal(sealNote, gas.sealNote);
  }

  return {
    factor: denominator > 0 ? 1 / denominator : 0,
    category,
    totalPercent,
    sealNote,
  };
}

/** Whether the totalPercent is within 0.1% of 100 — used for UI validation only. */
export function isMixturePercentValid(totalPercent: number): boolean {
  return Math.abs(totalPercent - 100) <= PERCENT_TOLERANCE;
}

/**
 * "5% SiH₄ + 95% N₂" — uses each gas's typeset formula; unknown ids fall back
 * to the raw id so the label stays informative for partial entries.
 */
export function formatMixtureLabel(
  components: readonly GasComponent[],
): string {
  const usable = components.filter(
    (c) => c.gasId.trim() !== "" && Number.isFinite(c.percent) && c.percent > 0,
  );
  return usable
    .map((c) => {
      const gas = getGasFactor(c.gasId);
      const symbol = gas?.formula ?? c.gasId;
      return `${formatPercent(c.percent)}% ${symbol}`;
    })
    .join(" + ");
}

function formatPercent(percent: number): string {
  return Number.isInteger(percent) ? String(percent) : percent.toFixed(1);
}

const SEAL_RANK: Record<GasSealNote, number> = {
  teflon: 1,
  kalrez: 2,
  metal: 3,
};

function pickWorstSeal(
  current: GasSealNote | undefined,
  next: GasSealNote | undefined,
): GasSealNote | undefined {
  if (!next) return current;
  if (!current) return next;
  return SEAL_RANK[next] > SEAL_RANK[current] ? next : current;
}
