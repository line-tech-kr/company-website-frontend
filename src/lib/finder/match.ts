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

type FitPosition = "in" | "top-edge" | "bottom-seam";

/**
 * Score a value against a flow range and report its position. The position
 * lets the caller suppress bottom-seam hits (V === product's lower bound)
 * when another product in the same scope covers V more squarely — see
 * `findProducts`.
 *
 *   value === max → top-edge 0.5  (operating at full scale — preferred at a seam)
 *   value === min → bottom-seam 0.3 (sensor noise floor — suppress if competing)
 *   pct 25–75%    → sweet 1.0
 *   pct 10–90%    → okay 0.7
 *   pct > 90%     → top-edge 0.5
 *   pct < 10%     → bottom 0.3
 */
function fitScoreForRange(
  value: number,
  min: number,
  max: number,
): { score: number; position: FitPosition } {
  if (max <= min) return { score: 0, position: "in" };
  if (value < min || value > max) return { score: 0, position: "in" };
  if (value === min) return { score: 0.3, position: "bottom-seam" };
  if (value === max) return { score: 0.5, position: "top-edge" };
  const pct = (value - min) / (max - min);
  if (pct >= 0.25 && pct <= 0.75) return { score: 1, position: "in" };
  if (pct >= 0.1 && pct <= 0.9) return { score: 0.7, position: "in" };
  if (pct > 0.9) return { score: 0.5, position: "top-edge" };
  return { score: 0.3, position: "in" };
}

export function fitScore(value: number, min: number, max: number): number {
  return fitScoreForRange(value, min, max).score;
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

type ScopeKey = `${string}|${string}`;
function scopeKey(p: Product): ScopeKey {
  return `${p.function}|${p.series}`;
}

export function findProducts(
  products: readonly Product[],
  input: FinderInput,
): FinderResult {
  const gas = getGasFactor(input.gasId);
  const flowSlpm = toSlpm(input.flow, input.unit);

  // EPC products use pressureRange, not flowRange, and the gas factor is only
  // used for flow conversion. Surface every EPC match regardless of gas/flow.
  if (input.function === "EPC") {
    const matches: FinderMatch[] = [];
    for (const product of products) {
      if (product.function !== "EPC") continue;
      if (!seriesMatches(product, input.series)) continue;
      matches.push({ product, n2EquivalentSlpm: flowSlpm, fitScore: 1 });
    }
    matches.sort((a, b) => a.product.model.localeCompare(b.product.model));
    return {
      matches,
      n2EquivalentSlpm: flowSlpm,
      gas: gas ?? undefined,
      warning:
        gas?.category === "specialty" ? ("specialty-gas" as const) : undefined,
    };
  }

  if (!gas) {
    return { matches: [], n2EquivalentSlpm: flowSlpm };
  }
  const n2EquivalentSlpm = toN2Equivalent(flowSlpm, gas);

  const normalMatches: FinderMatch[] = [];
  const bottomSeam: FinderMatch[] = [];

  for (const product of products) {
    if (!functionMatches(product, input.function)) continue;
    if (!seriesMatches(product, input.series)) continue;
    if (!product.massFlowSpecs) continue;
    const range = product.massFlowSpecs.flowRange;
    if (!range) continue;
    if (range.min == null || range.max == null) continue;

    const fit = fitScoreForRange(n2EquivalentSlpm, range.min, range.max);
    if (fit.score === 0) continue;

    const match: FinderMatch = {
      product,
      n2EquivalentSlpm,
      fitScore: fit.score,
    };
    if (fit.position === "bottom-seam") bottomSeam.push(match);
    else normalMatches.push(match);
  }

  // A bottom-seam hit (V at exactly this product's lower bound) is dropped
  // when another normal match in the same (function, series) scope already
  // covers V — overlapping ranges are deliberate, but the product where V
  // sits at the top of its range should win the seam. Cross-series twins
  // (e.g. analogue + digital with the same range) stay as intentional
  // cross-sells.
  const normalScopes = new Set(normalMatches.map((m) => scopeKey(m.product)));
  const matches: FinderMatch[] = [...normalMatches];
  for (const m of bottomSeam) {
    if (!normalScopes.has(scopeKey(m.product))) matches.push(m);
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
