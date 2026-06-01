import { describe, expect, it } from "vitest";
import {
  buildJsonLdDescription,
  buildJsonLdProperties,
  buildOverviewRows,
  buildSpecGroups,
  getHeadlineRange,
} from "./specShape";
import { makeProduct, productFixture, rouProductFixture } from "@/test/fixtures/products";

const labelers = {
  spec: (k: string) => `label:${k}`,
  group: (id: string) => `group:${id}`,
  instrument: "Instrument",
};

describe("buildSpecGroups", () => {
  it("returns three massFlow groups for MFC products", () => {
    const groups = buildSpecGroups(productFixture, "en", labelers);
    expect(groups.map((g) => g.id)).toEqual([
      "performance",
      "signal",
      "environment",
    ]);
    expect(groups[0].label).toBe("group:performance");
    const performanceRow = groups[0].rows.find((r) => r.key === "flowRange");
    expect(performanceRow?.label).toBe("label:flowRange");
    expect(performanceRow?.value).toBe("0–1000 sccm");
  });

  it("uses pressureRange for EPC products that lack flowRange", () => {
    const epc = makeProduct({
      function: "EPC",
      massFlowSpecs: {
        ...productFixture.massFlowSpecs!,
        flowRange: undefined,
        pressureRange: { display: "0.1–6 barA", min: 0.1, max: 6, unit: "barA" },
      },
    });
    const groups = buildSpecGroups(epc, "en", labelers);
    const performance = groups.find((g) => g.id === "performance");
    expect(performance?.rows.find((r) => r.key === "pressureRange")?.value).toBe(
      "0.1–6 barA",
    );
    expect(performance?.rows.find((r) => r.key === "flowRange")).toBeUndefined();
  });

  it("returns a single instrument group from instrumentSpecs for ROU products", () => {
    const groups = buildSpecGroups(rouProductFixture, "en", labelers);
    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({ id: "instrument", num: "01", label: "Instrument" });
    expect(groups[0].rows).toEqual([
      { key: "Input Power", label: "Input Power", value: "220VAC (50–60 Hz)" },
      { key: "Output Signal", label: "Output Signal", value: "0–5 Vdc or 4–20 mA" },
      { key: "Communication", label: "Communication", value: "RS-232, RS-485" },
    ]);
  });
});

describe("buildOverviewRows", () => {
  it("returns up to 3 feature/spec rows for massFlow products", () => {
    const rows = buildOverviewRows(productFixture, "en", [
      "Feature A",
      "Feature B",
      "Feature C",
    ]);
    expect(rows[0].feature).toBe("Feature A");
    expect(rows[0].values).toContain("0–1000 sccm");
  });

  it("drops trailing rows when the matching massFlow spec is absent", () => {
    const noResponse = makeProduct({
      massFlowSpecs: {
        ...productFixture.massFlowSpecs!,
        responseTime: undefined,
        maxPressure: undefined,
      },
    });
    const rows = buildOverviewRows(noResponse, "en", ["A", "B", "C"]);
    expect(rows[1].values).toEqual([]);
    expect(rows[2].values).toEqual([]);
  });

  it("maps ROU instrumentSpecs to feature/value rows", () => {
    const rows = buildOverviewRows(rouProductFixture, "en", []);
    expect(rows).toEqual([
      { feature: "Input Power", values: ["220VAC (50–60 Hz)"] },
      { feature: "Output Signal", values: ["0–5 Vdc or 4–20 mA"] },
      { feature: "Communication", values: ["RS-232, RS-485"] },
    ]);
  });
});

describe("buildJsonLdProperties", () => {
  it("emits PropertyValue rows for each massFlow spec present", () => {
    const props = buildJsonLdProperties(productFixture);
    expect(props.find((p) => p.name === "Flow Range")?.value).toBe(
      "0–1000 sccm",
    );
    expect(props.find((p) => p.name === "Accuracy")?.value).toBe("±1% F.S.");
    expect(props.find((p) => p.name === "Max Pressure")).toBeUndefined();
  });

  it("maps each instrumentSpec to a PropertyValue for ROU products", () => {
    const props = buildJsonLdProperties(rouProductFixture);
    expect(props).toHaveLength(3);
    expect(props[0]).toEqual({
      "@type": "PropertyValue",
      name: "Input Power",
      value: "220VAC (50–60 Hz)",
    });
  });
});

describe("getHeadlineRange", () => {
  it("prefers flowRange when present", () => {
    expect(getHeadlineRange(productFixture)?.display).toBe("0–1000 sccm");
  });

  it("falls back to pressureRange when flowRange is absent", () => {
    const epc = makeProduct({
      massFlowSpecs: {
        ...productFixture.massFlowSpecs!,
        flowRange: undefined,
        pressureRange: { display: "0.1–6 barA" },
      },
    });
    expect(getHeadlineRange(epc)?.display).toBe("0.1–6 barA");
  });

  it("returns null for ROU products", () => {
    expect(getHeadlineRange(rouProductFixture)).toBeNull();
  });
});

describe("buildJsonLdDescription", () => {
  it("uses headline range + accuracy for massFlow products", () => {
    expect(buildJsonLdDescription(productFixture, "Test Controller")).toBe(
      "Test Controller — 0–1000 sccm flow range, ±1% F.S. accuracy",
    );
  });

  it("returns plain productLabel for ROU products", () => {
    expect(buildJsonLdDescription(rouProductFixture, "Test Read-Out")).toBe(
      "Test Read-Out",
    );
  });
});
