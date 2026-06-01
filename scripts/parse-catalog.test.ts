import { describe, it, expect } from "vitest";
import { buildInstrumentSpecs } from "./parse-catalog";

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
