import { describe, it, expect } from "vitest";
import { buildInstrumentSpecs, parseSupplyPower } from "./parse-catalog";

describe("parseSupplyPower", () => {
  // Every documented raw form normalises to the same "~" range display —
  // never the word "or" (which localizeSpecValue would render as 또는/或,
  // reading as a false either/or rather than a continuous range). See #268.
  it.each(["+15 ~ 24", "+15 ~ +24 Vdc", "+15 or +24 Vdc, 350 mA"])(
    "normalises %j to the +15 ~ +24 range form",
    (raw) => {
      const result = parseSupplyPower(raw);
      expect(result.display).toBe("+15 ~ +24 Vdc, 350 mA");
      expect(result.display).not.toContain(" or ");
      expect(result.voltages).toEqual([15, 24]);
    },
  );

  it("parses interleaved units (DO400: +15Vdc ~ +26Vdc)", () => {
    const result = parseSupplyPower("+15Vdc ~ +26Vdc , 350㎃");
    expect(result.display).toBe("+15 ~ +26 Vdc, 350 mA");
    expect(result.voltages).toEqual([15, 26]);
  });

  it("throws on an unparseable supply string", () => {
    expect(() => parseSupplyPower("n/a")).toThrow(/Cannot parse supply power/);
  });
});

describe("buildInstrumentSpecs", () => {
  it("returns a flat row array parsed from a Spec/Value table", () => {
    const body = [
      "Some intro prose",
      "",
      "| Spec | Value |",
      "|---|---|",
      "| Input Power | 220VAC |",
      "| Output Signal | 0–5 Vdc |",
      "",
      "Trailing notes",
    ];

    expect(buildInstrumentSpecs(body)).toEqual([
      { label: "Input Power", value: "220VAC" },
      { label: "Output Signal", value: "0–5 Vdc" },
    ]);
  });

  it("returns an empty array when no Spec/Value table is present", () => {
    expect(buildInstrumentSpecs(["just prose", "no table here"])).toEqual([]);
  });

  it("drops rows that are missing label or value", () => {
    const body = [
      "| Spec | Value |",
      "|---|---|",
      "| Good Row | yes |",
      "|  | orphan-value |",
      "| orphan-label |  |",
    ];

    expect(buildInstrumentSpecs(body)).toEqual([
      { label: "Good Row", value: "yes" },
    ]);
  });
});
