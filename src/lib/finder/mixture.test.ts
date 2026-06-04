import { describe, expect, it } from "vitest";
import {
  computeMixtureFactor,
  formatMixtureLabel,
  isMixturePercentValid,
  type MixtureError,
  type MixtureResult,
} from "./mixture";

function asResult(
  value: ReturnType<typeof computeMixtureFactor>,
): MixtureResult {
  if (!value || "missingGas" in value) {
    throw new Error("expected MixtureResult, got " + JSON.stringify(value));
  }
  return value;
}

function asError(value: ReturnType<typeof computeMixtureFactor>): MixtureError {
  if (!value || !("missingGas" in value)) {
    throw new Error("expected MixtureError, got " + JSON.stringify(value));
  }
  return value;
}

describe("computeMixtureFactor", () => {
  it("returns null for an empty list", () => {
    expect(computeMixtureFactor([])).toBeNull();
  });

  it("returns null when every row is blank", () => {
    expect(
      computeMixtureFactor([
        { gasId: "", percent: 0 },
        { gasId: "", percent: 0 },
      ]),
    ).toBeNull();
  });

  it("returns missingGas for an unknown component", () => {
    const result = computeMixtureFactor([
      { gasId: "nitrogen", percent: 50 },
      { gasId: "not-a-real-gas", percent: 50 },
    ]);
    expect(asError(result).missingGas).toBe("not-a-real-gas");
  });

  it("degenerates to the single component's factor", () => {
    const result = asResult(
      computeMixtureFactor([{ gasId: "argon", percent: 100 }]),
    );
    expect(result.factor).toBeCloseTo(1.395, 3);
    expect(result.totalPercent).toBe(100);
    expect(result.category).toBe("common");
  });

  it("computes 5% SiH₄ + 95% N₂ via the harmonic-mean formula", () => {
    // 1/K = 0.05/0.625 + 0.95/1.000 = 0.08 + 0.95 = 1.03 → K ≈ 0.9709
    const result = asResult(
      computeMixtureFactor([
        { gasId: "silane", percent: 5 },
        { gasId: "nitrogen", percent: 95 },
      ]),
    );
    expect(result.factor).toBeCloseTo(0.9709, 4);
    expect(result.totalPercent).toBe(100);
    expect(result.category).toBe("specialty");
    expect(result.sealNote).toBe("kalrez");
  });

  it("computes 10% O₂ + 90% Ar (common-only mixture)", () => {
    const result = asResult(
      computeMixtureFactor([
        { gasId: "oxygen", percent: 10 },
        { gasId: "argon", percent: 90 },
      ]),
    );
    expect(result.factor).toBeCloseTo(1.3398, 3);
    expect(result.category).toBe("common");
    expect(result.sealNote).toBeUndefined();
  });

  it("propagates the most-restrictive seal recommendation", () => {
    // disilane: teflon, silane: kalrez → kalrez wins (higher rank).
    const result = asResult(
      computeMixtureFactor([
        { gasId: "disilane", percent: 50 },
        { gasId: "silane", percent: 50 },
      ]),
    );
    expect(result.sealNote).toBe("kalrez");
  });

  it("ignores blank component rows and computes from the rest", () => {
    const result = asResult(
      computeMixtureFactor([
        { gasId: "nitrogen", percent: 100 },
        { gasId: "", percent: 0 },
      ]),
    );
    expect(result.factor).toBeCloseTo(1, 6);
    expect(result.totalPercent).toBe(100);
  });

  it("reports total percent for sums outside 100", () => {
    const low = asResult(
      computeMixtureFactor([
        { gasId: "silane", percent: 4.95 },
        { gasId: "nitrogen", percent: 94.95 },
      ]),
    );
    expect(low.totalPercent).toBeCloseTo(99.9, 3);
    expect(isMixturePercentValid(low.totalPercent)).toBe(true);

    const off = asResult(
      computeMixtureFactor([
        { gasId: "silane", percent: 10 },
        { gasId: "nitrogen", percent: 80 },
      ]),
    );
    expect(off.totalPercent).toBe(90);
    expect(isMixturePercentValid(off.totalPercent)).toBe(false);
  });

  it("treats NaN percent as a blank row (filtered out of the math)", () => {
    const result = computeMixtureFactor([
      { gasId: "silane", percent: Number.NaN },
      { gasId: "nitrogen", percent: 95 },
    ]);
    const r = asResult(result);
    // NaN row dropped; only N₂ at 95% survives. UI flags totalPercent ≠ 100.
    expect(r.totalPercent).toBe(95);
    expect(Number.isFinite(r.factor)).toBe(true);
    expect(r.factor).toBeGreaterThan(0);
  });

  it("treats negative percent as a blank row", () => {
    const result = computeMixtureFactor([
      { gasId: "silane", percent: -5 },
      { gasId: "nitrogen", percent: 100 },
    ]);
    const r = asResult(result);
    expect(r.totalPercent).toBe(100);
  });

  it("returns null when all rows have NaN/Infinity/zero percent", () => {
    expect(
      computeMixtureFactor([
        { gasId: "silane", percent: Number.NaN },
        { gasId: "nitrogen", percent: Number.POSITIVE_INFINITY },
        { gasId: "argon", percent: 0 },
      ]),
    ).toBeNull();
  });
});

describe("formatMixtureLabel", () => {
  it("uses each gas's typeset formula", () => {
    expect(
      formatMixtureLabel([
        { gasId: "silane", percent: 5 },
        { gasId: "nitrogen", percent: 95 },
      ]),
    ).toBe("5% SiH₄ + 95% N₂");
  });

  it("renders fractional percentages with one decimal", () => {
    expect(
      formatMixtureLabel([
        { gasId: "silane", percent: 5.5 },
        { gasId: "nitrogen", percent: 94.5 },
      ]),
    ).toBe("5.5% SiH₄ + 94.5% N₂");
  });

  it("skips blank rows", () => {
    expect(
      formatMixtureLabel([
        { gasId: "silane", percent: 5 },
        { gasId: "", percent: 0 },
        { gasId: "nitrogen", percent: 95 },
      ]),
    ).toBe("5% SiH₄ + 95% N₂");
  });
});
