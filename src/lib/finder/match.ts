import type { Product } from "@/lib/types/product";
import {
  GAS_FACTORS,
  REFERENCE_GAS_ID,
  getGasFactor,
  type GasFactor,
} from "./gas-factors";

export type FinderFunction = "MFC" | "MFM" | "EPC" | "any";
export type FinderSeries =
  | "analogue"
  | "digital"
  | "specialized"
  | "lepc"
  | "any";
export type FinderUnit = "slpm" | "sccm";

export type FinderInput = {
  function: FinderFunction;
  gasId: string;
  flow: number;
  unit: FinderUnit;
  series?: FinderSeries;
};

export type FinderMatch = {
  product: Product;
  /** N₂-equivalent flow in slpm — the value used to filter against the catalogue. */
  n2EquivalentSlpm: number;
  /** 0..1, higher = better fit. ~25–75% of full scale = 1.0 (sweet spot). */
  fitScore: number;
};

export type FinderResult = {
  matches: FinderMatch[];
  /** The user's input, converted into N₂-equivalent slpm. */
  n2EquivalentSlpm: number;
  /** Set when the chosen gas needs a specialty seal. */
  warning?: "specialty-gas";
  /** Resolved gas record. Undefined if `gasId` is unknown. */
  gas?: GasFactor;
};

const SCCM_PER_SLPM = 1000;

function toSlpm(flow: number, unit: FinderUnit): number {
  return unit === "slpm" ? flow : flow / SCCM_PER_SLPM;
}

/**
 * Convert a flow expressed in the user's chosen gas to its N₂-equivalent reading
 * (the unit our catalogue's flow ranges are listed in).
 *
 * From the 2020 catalogue appendix:
 *   actualGasFlow = displayedReading × (gasFactor / referenceFactor)
 * Solving for displayedReading (the N₂-equivalent the MFC's scale shows):
 *   displayedReading = actualGasFlow × (referenceFactor / gasFactor)
 *
 * Reference is N₂ (factor 1.000), so this simplifies to `actualGasFlow / gasFactor`.
 */
export function toN2Equivalent(flowSlpm: number, gas: GasFactor): number {
  const reference = getGasFactor(REFERENCE_GAS_ID);
  if (!reference) throw new Error("Reference gas (N₂) missing from gas table");
  return flowSlpm * (reference.factor / gas.factor);
}

export function fitScore(value: number, min: number, max: number): number {
  if (value < min || value > max) return 0;
  if (max <= min) return 0;
  const pct = (value - min) / (max - min);
  if (pct >= 0.25 && pct <= 0.75) return 1;
  if (pct >= 0.1 && pct <= 0.9) return 0.7;
  return 0.4;
}

function functionMatches(product: Product, target: FinderFunction): boolean {
  if (target === "any") return true;
  return product.function === target;
}

function seriesMatches(
  product: Product,
  target: FinderSeries | undefined,
): boolean {
  if (!target || target === "any") return true;
  return product.series === target;
}

export function findProducts(
  products: readonly Product[],
  input: FinderInput,
): FinderResult {
  const gas = getGasFactor(input.gasId);
  const flowSlpm = toSlpm(input.flow, input.unit);
  if (!gas) {
    return { matches: [], n2EquivalentSlpm: flowSlpm };
  }
  const n2EquivalentSlpm = toN2Equivalent(flowSlpm, gas);

  // EPC products use pressureRange, not flowRange — the flow input is
  // meaningless here. Surface every EPC product matching the series filter.
  if (input.function === "EPC") {
    const matches: FinderMatch[] = [];
    for (const product of products) {
      if (product.function !== "EPC") continue;
      if (!seriesMatches(product, input.series)) continue;
      matches.push({ product, n2EquivalentSlpm, fitScore: 1 });
    }
    matches.sort((a, b) => a.product.model.localeCompare(b.product.model));
    return {
      matches,
      n2EquivalentSlpm,
      gas,
      warning: gas.category === "specialty" ? "specialty-gas" : undefined,
    };
  }

  const matches: FinderMatch[] = [];
  for (const product of products) {
    if (!functionMatches(product, input.function)) continue;
    if (!seriesMatches(product, input.series)) continue;
    if (!product.massFlowSpecs) continue;
    const range = product.massFlowSpecs.flowRange;
    if (!range) continue;
    if (range.min == null || range.max == null) continue;
    const score = fitScore(n2EquivalentSlpm, range.min, range.max);
    if (score === 0) continue;
    matches.push({ product, n2EquivalentSlpm, fitScore: score });
  }

  // Sort: fit score (desc) → series (analogue, digital, specialized, lepc) → model.
  const SERIES_RANK: Record<NonNullable<Product["series"]>, number> = {
    analogue: 0,
    digital: 1,
    specialized: 2,
    lepc: 3,
  };
  matches.sort((a, b) => {
    if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
    const seriesDelta =
      SERIES_RANK[a.product.series] - SERIES_RANK[b.product.series];
    if (seriesDelta !== 0) return seriesDelta;
    return a.product.model.localeCompare(b.product.model);
  });

  return {
    matches,
    n2EquivalentSlpm,
    gas,
    warning: gas.category === "specialty" ? "specialty-gas" : undefined,
  };
}

export { GAS_FACTORS };
