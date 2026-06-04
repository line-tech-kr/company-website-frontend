import { describe, expect, it } from "vitest";
import { parseFinderUrl } from "./parseFinderUrl";

describe("parseFinderUrl", () => {
  it("returns an empty initial for an empty query", () => {
    expect(parseFinderUrl({})).toEqual({});
  });

  it("parses canonical scalar params", () => {
    expect(
      parseFinderUrl({
        fn: "MFC",
        gas: "nitrogen",
        flow: "100",
        unit: "slpm",
        series: "analogue",
      }),
    ).toEqual({
      fn: "MFC",
      gas: "nitrogen",
      flow: 100,
      unit: "slpm",
      series: "analogue",
    });
  });

  it("ignores unknown enum values", () => {
    expect(
      parseFinderUrl({ fn: "ROU", unit: "kg", series: "vintage" }),
    ).toEqual({});
  });

  it("ignores non-positive flow", () => {
    expect(parseFinderUrl({ flow: "0" })).toEqual({});
    expect(parseFinderUrl({ flow: "-5" })).toEqual({});
    expect(parseFinderUrl({ flow: "not-a-number" })).toEqual({});
  });

  it("parses pressure value + unit", () => {
    expect(parseFinderUrl({ p: "2", pu: "bar" })).toEqual({
      pressure: 2,
      pressureUnit: "bar",
    });
    expect(parseFinderUrl({ p: "200", pu: "kPa" })).toEqual({
      pressure: 200,
      pressureUnit: "kPa",
    });
  });

  it("rejects pressure entirely when unit is unknown (avoids misinterpreting as bar)", () => {
    expect(parseFinderUrl({ p: "2", pu: "atm" })).toEqual({});
  });

  it("keeps pressure when unit is omitted (UI default applies)", () => {
    expect(parseFinderUrl({ p: "2" })).toEqual({ pressure: 2 });
  });

  it("parses gasMix into mixture mode + components", () => {
    expect(parseFinderUrl({ gasMix: "silane:5,nitrogen:95" })).toEqual({
      gasMode: "mixture",
      components: [
        { gasId: "silane", percent: 5 },
        { gasId: "nitrogen", percent: 95 },
      ],
    });
  });

  it("drops malformed gasMix entries but keeps valid ones", () => {
    expect(
      parseFinderUrl({ gasMix: "silane:5,bad,nitrogen:0,argon:10" }),
    ).toEqual({
      gasMode: "mixture",
      components: [
        { gasId: "silane", percent: 5 },
        { gasId: "argon", percent: 10 },
      ],
    });
  });

  it("returns no mixture when every gasMix entry is invalid", () => {
    expect(parseFinderUrl({ gasMix: "bad,worse:nope" })).toEqual({});
  });

  it("collapses array-shaped query params to the first value", () => {
    expect(parseFinderUrl({ fn: ["MFC", "EPC"], flow: ["50", "100"] })).toEqual(
      { fn: "MFC", flow: 50 },
    );
  });

  it("validates `gas` against the gas table (drops unknown ids)", () => {
    expect(parseFinderUrl({ gas: "made-up-gas" })).toEqual({});
    expect(parseFinderUrl({ gas: "argon" })).toEqual({ gas: "argon" });
  });

  it("keeps both `gas` and `gasMix` when both are present (consumer picks)", () => {
    // Mixture mode is the active state, but pure-gas seed is preserved so the
    // user can toggle back without losing their last single-gas choice.
    const result = parseFinderUrl({
      gas: "argon",
      gasMix: "silane:5,nitrogen:95",
    });
    expect(result.gasMode).toBe("mixture");
    expect(result.gas).toBe("argon");
    expect(result.components).toHaveLength(2);
  });

  it("accepts gasMix percentages whose sum > 100 (UI flags it; parser doesn't)", () => {
    expect(parseFinderUrl({ gasMix: "silane:150,nitrogen:50" })).toEqual({
      gasMode: "mixture",
      components: [
        { gasId: "silane", percent: 150 },
        { gasId: "nitrogen", percent: 50 },
      ],
    });
  });

  it("caps gasMix component count to prevent DoS via a huge URL", () => {
    const huge = Array.from({ length: 500 }, () => "argon:1").join(",");
    const result = parseFinderUrl({ gasMix: huge });
    expect(result.components?.length ?? 0).toBeLessThanOrEqual(20);
  });
});
