import { describe, expect, it } from "vitest";
import { makeProduct } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";
import { findProducts, fitScore, toN2Equivalent } from "./match";
import { getGasFactor } from "./gas-factors";

const N2 = getGasFactor("nitrogen")!;
const CO2 = getGasFactor("carbon-dioxide")!;

function withRange(
  model: string,
  min: number,
  max: number,
  overrides: Partial<Product> = {},
): Product {
  return makeProduct({
    model,
    slug: { current: model.toLowerCase() },
    massFlowSpecs: {
      ...makeProduct().massFlowSpecs!,
      flowRange: { display: `${min}–${max} slpm`, min, max, unit: "slpm" },
    },
    ...overrides,
  });
}

describe("toN2Equivalent", () => {
  it("returns the same flow when the chosen gas is N₂", () => {
    expect(toN2Equivalent(100, N2)).toBe(100);
  });

  it("converts CO₂ flow to a higher N₂-equivalent reading", () => {
    // Catalogue example: 100 sccm of CO₂ shows ~135 sccm on an N₂-calibrated MFC.
    // factor(N₂)/factor(CO₂) = 1.000 / 0.740 ≈ 1.351
    const result = toN2Equivalent(100, CO2);
    expect(result).toBeCloseTo(135.135, 2);
  });

  it("converts argon to a lower N₂-equivalent reading", () => {
    const Ar = getGasFactor("argon")!;
    const result = toN2Equivalent(100, Ar);
    // factor(N₂)/factor(Ar) = 1.000 / 1.395
    expect(result).toBeCloseTo(71.685, 2);
  });
});

describe("fitScore", () => {
  it("returns 1.0 for sweet-spot mid-range", () => {
    expect(fitScore(50, 0, 100)).toBe(1);
    expect(fitScore(75, 0, 100)).toBe(1);
    expect(fitScore(25, 0, 100)).toBe(1);
  });

  it("returns 0.7 for okay-but-not-ideal range", () => {
    expect(fitScore(90, 0, 100)).toBe(0.7);
    expect(fitScore(10, 0, 100)).toBe(0.7);
  });

  it("returns 0.5 for top-edge (above 90% of range or at max)", () => {
    expect(fitScore(91, 0, 100)).toBe(0.5);
    expect(fitScore(95, 0, 100)).toBe(0.5);
    expect(fitScore(100, 0, 100)).toBe(0.5);
  });

  it("returns 0.3 for bottom-edge (below 10% of range or at min)", () => {
    expect(fitScore(0, 0, 100)).toBe(0.3);
    expect(fitScore(5, 0, 100)).toBe(0.3);
    expect(fitScore(9, 0, 100)).toBe(0.3);
  });

  it("returns 0 when out of range entirely", () => {
    expect(fitScore(150, 0, 100)).toBe(0);
    expect(fitScore(-5, 0, 100)).toBe(0);
  });
});

describe("findProducts", () => {
  const products: Product[] = [
    withRange("M2030VA", 0.01, 30, { series: "analogue", function: "MFC" }),
    withRange("M3030VA", 0.01, 300, { series: "analogue", function: "MFC" }),
    withRange("M3200VA", 100, 300, { series: "analogue", function: "MFC" }),
    withRange("EX1000", 70, 1000, { series: "specialized", function: "MFC" }),
    withRange("M3500VA", 1500, 2500, { series: "analogue", function: "MFC" }),
    withRange("MD150M", 100, 500, { series: "digital", function: "MFM" }),
  ];

  it("returns products covering the N₂-equivalent flow", () => {
    const result = findProducts(products, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
    });
    expect(result.n2EquivalentSlpm).toBe(200);
    const models = result.matches.map((m) => m.product.model);
    expect(models).toContain("M3200VA");
    expect(models).toContain("EX1000");
    expect(models).not.toContain("M3500VA"); // out of range
    expect(models).not.toContain("M2030VA"); // out of range
    expect(models).not.toContain("MD150M"); // wrong function
  });

  it("ranks sweet-spot matches above edge matches", () => {
    const result = findProducts(products, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
    });
    // M3200VA: 200 in [100,300] = 50% → 1.0 (sweet spot)
    // M3030VA: 200 in [0.01,300] = ~67% → 1.0 (sweet spot)
    // EX1000: 200 in [70,1000] = 14% → 0.7
    expect(result.matches[0].fitScore).toBe(1);
    const lastEx = result.matches.findIndex(
      (m) => m.product.model === "EX1000",
    );
    expect(result.matches[lastEx].fitScore).toBe(0.7);
  });

  it("filters by series when not 'any'", () => {
    const result = findProducts(products, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
      series: "specialized",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["EX1000"]);
  });

  it("converts sccm to slpm before matching", () => {
    const result = findProducts(products, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 200000, // 200 slpm in sccm
      unit: "sccm",
    });
    expect(result.n2EquivalentSlpm).toBe(200);
    expect(result.matches.length).toBeGreaterThan(0);
  });

  it("applies the K-factor when gas is not N₂", () => {
    // 100 sccm CO₂ → ~135 sccm N₂-equivalent → 0.135 slpm
    const result = findProducts(products, {
      function: "MFC",
      gasId: "carbon-dioxide",
      flow: 100,
      unit: "sccm",
    });
    expect(result.n2EquivalentSlpm).toBeCloseTo(0.135, 3);
    // Both M2030VA (0.01–30) and M3030VA (0.01–300) cover 0.135 slpm.
    expect(result.matches.map((m) => m.product.model)).toContain("M2030VA");
  });

  it("returns specialty-gas warning for HF", () => {
    const result = findProducts(products, {
      function: "any",
      gasId: "hydrogen-fluoride",
      flow: 200,
      unit: "slpm",
    });
    expect(result.warning).toBe("specialty-gas");
    expect(result.gas?.sealNote).toBe("kalrez");
  });

  it("returns no warning for common gases", () => {
    const result = findProducts(products, {
      function: "any",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
    });
    expect(result.warning).toBeUndefined();
  });

  it("returns empty matches when nothing fits", () => {
    const result = findProducts(products, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 50000, // way beyond any product's range
      unit: "slpm",
    });
    expect(result.matches).toEqual([]);
  });

  it("returns empty matches but no error when gasId is unknown", () => {
    const result = findProducts(products, {
      function: "any",
      gasId: "made-up-gas",
      flow: 100,
      unit: "slpm",
    });
    expect(result.matches).toEqual([]);
    expect(result.gas).toBeUndefined();
  });

  it("orders matches with the same fit by series: analogue → digital → specialized", () => {
    // Three products that all cover 200 slpm at the same fit score (50% — ideal).
    const sameFitProducts: Product[] = [
      withRange("MX-DIG", 100, 300, { series: "digital", function: "MFC" }),
      withRange("MX-SPC", 100, 300, { series: "specialized", function: "MFC" }),
      withRange("MX-ANA", 100, 300, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(sameFitProducts, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual([
      "MX-ANA",
      "MX-DIG",
      "MX-SPC",
    ]);
    // All three should have the same fit score.
    expect(new Set(result.matches.map((m) => m.fitScore)).size).toBe(1);
  });

  it("respects function filter for MFM products", () => {
    const result = findProducts(products, {
      function: "MFM",
      gasId: "nitrogen",
      flow: 200,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["MD150M"]);
  });

  describe("EPC products (no flowRange)", () => {
    const lepc = makeProduct({
      model: "LEPC",
      slug: { current: "lepc" },
      series: "lepc",
      function: "EPC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: undefined,
        pressureRange: {
          display: "0.1–6 barA",
          min: 0.1,
          max: 6,
          unit: "barA",
        },
      },
    });
    const productsWithEpc = [...products, lepc];

    it("returns LEPC when function is EPC, regardless of flow", () => {
      const result = findProducts(productsWithEpc, {
        function: "EPC",
        gasId: "nitrogen",
        flow: 0,
        unit: "slpm",
      });
      expect(result.matches.map((m) => m.product.model)).toEqual(["LEPC"]);
      expect(result.matches[0].fitScore).toBe(1);
    });

    it("excludes LEPC when function is MFC", () => {
      const result = findProducts(productsWithEpc, {
        function: "MFC",
        gasId: "nitrogen",
        flow: 200,
        unit: "slpm",
      });
      expect(result.matches.map((m) => m.product.model)).not.toContain("LEPC");
    });

    it("excludes LEPC when function is 'any' (no flowRange to match)", () => {
      const result = findProducts(productsWithEpc, {
        function: "any",
        gasId: "nitrogen",
        flow: 200,
        unit: "slpm",
      });
      expect(result.matches.map((m) => m.product.model)).not.toContain("LEPC");
    });
  });

  describe("custom gas mixture", () => {
    it("uses the supplied K-factor instead of looking up gasId", () => {
      // 5% SiH₄ + 95% N₂ harmonic-mean K ≈ 0.9709 → 100 slpm @ K=0.9709
      // converts to ~103 slpm N₂-equivalent.
      const result = findProducts(products, {
        function: "MFC",
        gasId: "nitrogen",
        flow: 100,
        unit: "slpm",
        mixture: { factor: 0.9709, specialty: true },
      });
      expect(result.n2EquivalentSlpm).toBeCloseTo(103, 0);
      expect(result.warning).toBe("specialty-gas");
      // gas record is suppressed when matching via mixture.
      expect(result.gas).toBeUndefined();
    });

    it("flags non-specialty mixtures correctly", () => {
      const result = findProducts(products, {
        function: "MFC",
        gasId: "nitrogen",
        flow: 100,
        unit: "slpm",
        mixture: { factor: 1.3398, specialty: false },
      });
      expect(result.warning).toBeUndefined();
    });

    it("returns empty matches when the mixture factor is zero", () => {
      const result = findProducts(products, {
        function: "MFC",
        gasId: "nitrogen",
        flow: 100,
        unit: "slpm",
        mixture: { factor: 0, specialty: false },
      });
      expect(result.matches).toEqual([]);
      expect(result.n2EquivalentSlpm).toBe(0);
    });
  });

  describe("operating pressure filter", () => {
    const lepc = makeProduct({
      model: "LEPC",
      slug: { current: "lepc" },
      series: "lepc",
      function: "EPC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: undefined,
        pressureRange: {
          display: "0.1–6 barA",
          min: 0.1,
          max: 6,
          unit: "barA",
        },
      },
    });
    const mfcWithMax = withRange("M2030VA-CAP", 0.01, 30, {
      series: "analogue",
      function: "MFC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: {
          display: "0.01–30 slpm",
          min: 0.01,
          max: 30,
          unit: "slpm",
        },
        maxPressure: {
          display: "<3 bar",
          value: 3,
          unit: "bar",
          comparator: "lt",
        },
      },
    });
    const mfcHighMax = withRange("M2030VA-HIGH", 0.01, 30, {
      series: "analogue",
      function: "MFC",
      massFlowSpecs: {
        ...makeProduct().massFlowSpecs!,
        flowRange: {
          display: "0.01–30 slpm",
          min: 0.01,
          max: 30,
          unit: "slpm",
        },
        maxPressure: {
          display: "<10 bar",
          value: 10,
          unit: "bar",
          comparator: "lt",
        },
      },
    });

    it("EPC: matches when pressure falls inside pressureRange", () => {
      const result = findProducts([lepc], {
        function: "EPC",
        gasId: "nitrogen",
        flow: 0,
        unit: "slpm",
        pressureBar: 2,
      });
      expect(result.matches.map((m) => m.product.model)).toEqual(["LEPC"]);
    });

    it("EPC: filters out when pressure outside pressureRange", () => {
      const result = findProducts([lepc], {
        function: "EPC",
        gasId: "nitrogen",
        flow: 0,
        unit: "slpm",
        pressureBar: 50,
      });
      expect(result.matches).toEqual([]);
    });

    it("MFC: matches when pressure ≤ maxPressure", () => {
      const result = findProducts([mfcWithMax, mfcHighMax], {
        function: "MFC",
        gasId: "nitrogen",
        flow: 10,
        unit: "slpm",
        pressureBar: 2,
      });
      expect(result.matches.map((m) => m.product.model).sort()).toEqual([
        "M2030VA-CAP",
        "M2030VA-HIGH",
      ]);
    });

    it("MFC: filters out when pressure > maxPressure", () => {
      const result = findProducts([mfcWithMax, mfcHighMax], {
        function: "MFC",
        gasId: "nitrogen",
        flow: 10,
        unit: "slpm",
        pressureBar: 5,
      });
      expect(result.matches.map((m) => m.product.model)).toEqual([
        "M2030VA-HIGH",
      ]);
    });

    it("no pressure filter when pressureBar undefined", () => {
      const result = findProducts([mfcWithMax], {
        function: "MFC",
        gasId: "nitrogen",
        flow: 10,
        unit: "slpm",
      });
      expect(result.matches.map((m) => m.product.model)).toEqual([
        "M2030VA-CAP",
      ]);
    });

    it("MFC: honours 'lt' comparator (pressure equal to maxPressure rejected)", () => {
      // mfcWithMax has maxPressure {value: 3, comparator: "lt"} — "<3 bar".
      // A user running at exactly 3.0 bar must be rejected.
      const result = findProducts([mfcWithMax, mfcHighMax], {
        function: "MFC",
        gasId: "nitrogen",
        flow: 10,
        unit: "slpm",
        pressureBar: 3,
      });
      expect(result.matches.map((m) => m.product.model)).toEqual([
        "M2030VA-HIGH",
      ]);
    });

    it("MFC: treats unknown maxPressure unit as a pass (don't disappear products)", () => {
      const mfcUnknownUnit = withRange("MFC-UNK", 0.01, 30, {
        series: "analogue",
        function: "MFC",
        massFlowSpecs: {
          ...makeProduct().massFlowSpecs!,
          flowRange: {
            display: "0.01–30 slpm",
            min: 0.01,
            max: 30,
            unit: "slpm",
          },
          maxPressure: {
            display: "?",
            value: 1,
            unit: "atm",
            comparator: "lt",
          },
        },
      });
      const result = findProducts([mfcUnknownUnit], {
        function: "MFC",
        gasId: "nitrogen",
        flow: 10,
        unit: "slpm",
        pressureBar: 999,
      });
      expect(result.matches.map((m) => m.product.model)).toEqual(["MFC-UNK"]);
    });

    it("EPC: assigns neutral fit when pressureRange unit can't be normalized", () => {
      const lepcWeird = makeProduct({
        model: "LEPC-WEIRD",
        slug: { current: "lepc-weird" },
        series: "lepc",
        function: "EPC",
        massFlowSpecs: {
          ...makeProduct().massFlowSpecs!,
          flowRange: undefined,
          pressureRange: { display: "?", min: 0.1, max: 6, unit: "atm" },
        },
      });
      const result = findProducts([lepcWeird], {
        function: "EPC",
        gasId: "nitrogen",
        flow: 0,
        unit: "slpm",
        pressureBar: 2,
      });
      expect(result.matches.map((m) => m.product.model)).toEqual([
        "LEPC-WEIRD",
      ]);
      expect(result.matches[0].fitScore).toBeCloseTo(0.7, 6);
    });
  });
});

describe("seam handling", () => {
  it("at V === max of LOW (== min of HIGH), only LOW surfaces with top-edge score", () => {
    const adjacent: Product[] = [
      withRange("LOW", 1000, 1500, { series: "analogue", function: "MFC" }),
      withRange("HIGH", 1500, 2500, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(adjacent, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 1500,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["LOW"]);
    expect(result.matches[0].fitScore).toBe(0.5);
  });

  it("value just above min at a seam is not suppressed", () => {
    const adjacent: Product[] = [
      withRange("LOW", 1000, 1500, { series: "analogue", function: "MFC" }),
      withRange("HIGH", 1500, 2500, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(adjacent, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 1500.001,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["HIGH"]);
    expect(result.matches[0].fitScore).toBe(0.3);
  });

  it("sole bottom-edge match (no competitor in scope) still surfaces", () => {
    const sole: Product[] = [
      withRange("SOLO", 100, 500, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(sole, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 100,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["SOLO"]);
    expect(result.matches[0].fitScore).toBe(0.3);
  });

  it("suppresses only within (function, series) scope — digital twin still surfaces", () => {
    const mixed: Product[] = [
      withRange("ALOW", 1000, 1500, { series: "analogue", function: "MFC" }),
      withRange("AHIGH", 1500, 2500, { series: "analogue", function: "MFC" }),
      withRange("DHIGH", 1500, 2500, { series: "digital", function: "MFC" }),
    ];
    const result = findProducts(mixed, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 1500,
      unit: "slpm",
    });
    const models = result.matches.map((m) => m.product.model);
    expect(models).toContain("ALOW");
    expect(models).toContain("DHIGH");
    expect(models).not.toContain("AHIGH");
  });

  it("cross-function under fn=any: MFC top-edge does not suppress MFM bottom-edge in same series", () => {
    // Under `function: "any"`, an MFC at V=max and an MFM at V=min are in
    // separate scopes (MFC|analogue vs MFM|analogue) and both surface as a
    // deliberate cross-sell across function families.
    const mixed: Product[] = [
      withRange("MFC-LOW", 1000, 1500, {
        series: "analogue",
        function: "MFC",
      }),
      withRange("MFM-HIGH", 1500, 2500, {
        series: "analogue",
        function: "MFM",
      }),
    ];
    const result = findProducts(mixed, {
      function: "any",
      gasId: "nitrogen",
      flow: 1500,
      unit: "slpm",
    });
    const models = result.matches.map((m) => m.product.model);
    expect(models).toContain("MFC-LOW");
    expect(models).toContain("MFM-HIGH");
  });

  it("identical-range twins at V === max — both surface as top-edge", () => {
    const twins: Product[] = [
      withRange("TWIN-A", 1000, 2000, { series: "analogue", function: "MFC" }),
      withRange("TWIN-B", 1000, 2000, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(twins, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 2000,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual([
      "TWIN-A",
      "TWIN-B",
    ]);
    expect(result.matches.every((m) => m.fitScore === 0.5)).toBe(true);
  });

  it("identical-range twins at V === min — no normal match in scope, fallback keeps both", () => {
    const twins: Product[] = [
      withRange("TWIN-A", 1000, 2000, { series: "analogue", function: "MFC" }),
      withRange("TWIN-B", 1000, 2000, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(twins, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 1000,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual([
      "TWIN-A",
      "TWIN-B",
    ]);
    expect(result.matches.every((m) => m.fitScore === 0.3)).toBe(true);
  });

  it("tolerates float drift at a seam (e.g. K-factor conversion landing at 1500 + ε)", () => {
    // Without epsilon-tolerant comparison, value > 1500 would drop LOW from
    // the in-range set entirely and HIGH would score 0.3 with position "in"
    // instead of "bottom-edge" — the suppression would silently fail.
    const adjacent: Product[] = [
      withRange("LOW", 1000, 1500, { series: "analogue", function: "MFC" }),
      withRange("HIGH", 1500, 2500, { series: "analogue", function: "MFC" }),
    ];
    const result = findProducts(adjacent, {
      function: "MFC",
      gasId: "nitrogen",
      flow: 1500 + 1e-10,
      unit: "slpm",
    });
    expect(result.matches.map((m) => m.product.model)).toEqual(["LOW"]);
    expect(result.matches[0].fitScore).toBe(0.5);
  });
});
