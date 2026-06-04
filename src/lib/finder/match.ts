import type { Product } from "@/lib/types/product";
import {
  GAS_FACTORS,
  REFERENCE_GAS_ID,
  getGasFactor,
  type GasFactor,
} from "./gas-factors";
import { catalogValueToBar } from "./pressure";

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
  /**
   * When set, overrides the K-factor that would otherwise be resolved from
   * `gasId`. Used for custom gas mixtures: callers compute the harmonic-mean
   * factor (see `mixture.ts`) and pass it through here. `gasId` becomes a
   * label/back-compat token only when this is provided.
   */
  mixture?: {
    factor: number;
    specialty: boolean;
  };
  /**
   * Operating pressure the user will run at, normalized to bar.
   * EPC: must fall inside the product's `pressureRange`.
   * MFC/MFM: must be ≤ the product's `maxPressure` value.
   * When undefined, pressure is not used to filter.
   */
  pressureBar?: number;
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

type FitPosition = "in" | "top-edge" | "bottom-edge";

// Boundary comparisons use a small relative epsilon so K-factor float drift
// (e.g. a non-N₂ gas conversion landing at 1500.0000000000002 instead of
// 1500.0) doesn't bypass seam handling or fall just outside an in-range check.
const SEAM_EPSILON = 1e-9;
function approxEqual(value: number, boundary: number): boolean {
  return (
    Math.abs(value - boundary) <= SEAM_EPSILON * Math.max(1, Math.abs(boundary))
  );
}

// Reports position so `findProducts` can suppress bottom-edge losers when
// another product covers V more squarely within the same (function, series).
function fitScoreForRange(
  value: number,
  min: number,
  max: number,
): { score: number; position: FitPosition } {
  if (max <= min) return { score: 0, position: "in" };
  if (value < min && !approxEqual(value, min))
    return { score: 0, position: "in" };
  if (value > max && !approxEqual(value, max))
    return { score: 0, position: "in" };
  if (approxEqual(value, min)) return { score: 0.3, position: "bottom-edge" };
  if (approxEqual(value, max)) return { score: 0.5, position: "top-edge" };
  const pct = (value - min) / (max - min);
  if (pct >= 0.25 && pct <= 0.75) return { score: 1, position: "in" };
  if (pct >= 0.1 && pct <= 0.9) return { score: 0.7, position: "in" };
  if (pct > 0.9) return { score: 0.5, position: "top-edge" };
  // pct < 0.1 — interior, not a seam loser (only at-min triggers that).
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

export function findProducts(
  products: readonly Product[],
  input: FinderInput,
): FinderResult {
  const gas = getGasFactor(input.gasId);
  const flowSlpm = toSlpm(input.flow, input.unit);

  // EPC products use pressureRange, not flowRange, and the gas factor is only
  // used for flow conversion. Filter by user pressure when provided.
  if (input.function === "EPC") {
    const matches: FinderMatch[] = [];
    for (const product of products) {
      if (product.function !== "EPC") continue;
      if (!seriesMatches(product, input.series)) continue;
      let score = 1;
      if (input.pressureBar != null) {
        const range = product.massFlowSpecs?.pressureRange;
        if (
          !range ||
          range.min == null ||
          range.max == null ||
          !product.massFlowSpecs
        ) {
          continue;
        }
        const minBar = catalogValueToBar(range.min, range.unit);
        const maxBar = catalogValueToBar(range.max, range.unit);
        if (minBar == null || maxBar == null) continue;
        score = fitScore(input.pressureBar, minBar, maxBar);
        if (score === 0) continue;
      }
      matches.push({ product, n2EquivalentSlpm: flowSlpm, fitScore: score });
    }
    matches.sort((a, b) => {
      if (b.fitScore !== a.fitScore) return b.fitScore - a.fitScore;
      return a.product.model.localeCompare(b.product.model);
    });
    return {
      matches,
      n2EquivalentSlpm: flowSlpm,
      gas: gas ?? undefined,
      warning:
        gas?.category === "specialty" ? ("specialty-gas" as const) : undefined,
    };
  }

  // Mixture overrides the K-factor lookup. The caller pre-computed the
  // harmonic-mean factor for the blend; we apply it like a normal gas.
  let effectiveFactor: number;
  let mixtureSpecialty = false;
  if (input.mixture) {
    effectiveFactor = input.mixture.factor;
    mixtureSpecialty = input.mixture.specialty;
  } else {
    if (!gas) {
      return { matches: [], n2EquivalentSlpm: flowSlpm };
    }
    effectiveFactor = gas.factor;
  }
  const reference = getGasFactor(REFERENCE_GAS_ID);
  if (!reference) throw new Error("Reference gas (N₂) missing from gas table");
  const n2EquivalentSlpm =
    effectiveFactor > 0 ? flowSlpm * (reference.factor / effectiveFactor) : 0;

  const normalMatches: FinderMatch[] = [];
  const bottomEdgeMatches: FinderMatch[] = [];

  for (const product of products) {
    if (!functionMatches(product, input.function)) continue;
    if (!seriesMatches(product, input.series)) continue;
    if (!product.massFlowSpecs) continue;
    const range = product.massFlowSpecs.flowRange;
    if (!range) continue;
    if (range.min == null || range.max == null) continue;

    const fit = fitScoreForRange(n2EquivalentSlpm, range.min, range.max);
    if (fit.score === 0) continue;

    if (input.pressureBar != null) {
      const max = product.massFlowSpecs.maxPressure;
      if (max?.value == null) continue;
      const maxBar = catalogValueToBar(max.value, max.unit);
      if (maxBar == null || input.pressureBar > maxBar) continue;
    }

    const match: FinderMatch = {
      product,
      n2EquivalentSlpm,
      fitScore: fit.score,
    };
    if (fit.position === "bottom-edge") bottomEdgeMatches.push(match);
    else normalMatches.push(match);
  }

  // Drop bottom-edge hits when another match in the same (function, series)
  // already covers V — keep cross-series twins as intentional cross-sells.
  const normalScopes = new Set(
    normalMatches.map((m) => `${m.product.function}|${m.product.series}`),
  );
  const matches: FinderMatch[] = [...normalMatches];
  for (const m of bottomEdgeMatches) {
    const key = `${m.product.function}|${m.product.series}`;
    if (!normalScopes.has(key)) matches.push(m);
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
    gas: input.mixture ? undefined : gas,
    warning:
      mixtureSpecialty || gas?.category === "specialty"
        ? "specialty-gas"
        : undefined,
  };
}

export { GAS_FACTORS };
