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

  it("ignores unknown pressure unit", () => {
    expect(parseFinderUrl({ p: "2", pu: "atm" })).toEqual({ pressure: 2 });
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
});
