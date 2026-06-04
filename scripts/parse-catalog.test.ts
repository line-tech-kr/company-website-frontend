import { describe, it, expect } from "vitest";
import { buildInstrumentSpecs, validate } from "./parse-catalog";
import { makeProduct, rouProductFixture } from "../src/test/fixtures/products";

describe("validate", () => {
  const baseMfc = () =>
    makeProduct({
      connections: [{ type: "1/4 inch VCR", length: "60 mm", _key: "c1" }],
      massFlowSpecs: {
        flowRange: { display: "0–1000 sccm", min: 0, max: 1000, unit: "sccm" },
        accuracy: { display: "±1% F.S.", value: 1, unit: "% F.S." },
        repeatability: { display: "±0.2% F.S.", value: 0.2, unit: "% F.S." },
        ioSignal: { display: "0–5 VDC", outputs: ["0-5VDC"] },
        supplyPower: { display: "±15 VDC", voltages: [15, -15] },
        tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
        leakRate: {
          display: "1 × 10⁻⁹ atm·cc/sec He",
          value: 1e-9,
          unit: "atm·cc/sec",
        },
        controlRange: {
          display: "2–100% F.S.",
          min: 2,
          max: 100,
          unit: "% F.S.",
        },
        responseTime: {
          display: "<1 sec",
          value: 1,
          unit: "sec",
          comparator: "lt",
        },
      },
    });

  it("passes a normal MFC product with at least one connection", () => {
    expect(() => validate(baseMfc())).not.toThrow();
  });

  it("throws when a non-ROU product has empty connections", () => {
    const empty = makeProduct({ connections: [] });
    expect(() => validate(empty)).toThrowError(/no connections parsed/);
  });

  it("throws on DO400 too — no allow-list any more", () => {
    // Regression guard: a stale comment in this file used to skip DO400.
    // After 2026-06-03 the allow-list was removed; DO400's connection
    // table now comes from patch-eng-corrections.ts.
    const do400 = makeProduct({
      model: "DO400",
      slug: { current: "do400" },
      connections: [],
    });
    expect(() => validate(do400)).toThrowError(/DO400: no connections parsed/);
  });

  it("skips the connections check for ROU instruments", () => {
    expect(() => validate(rouProductFixture)).not.toThrow();
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
