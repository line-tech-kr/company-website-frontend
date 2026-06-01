import { describe, expect, it } from "vitest";
import {
  buildJsonLdDescription,
  buildJsonLdProperties,
  buildOverviewRows,
  buildSpecGroups,
} from "./specShape";
import {
  makeProduct,
  productFixture,
  rouProductFixture,
} from "@/test/fixtures/products";

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
    expect(rows[0].values).toContain("±1% F.S.");
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

  it("filters out rows whose feature label is empty", () => {
    const rows = buildOverviewRows(productFixture, "en", ["A", "", "C"]);
    expect(rows.map((r) => r.feature)).toEqual(["A", "C"]);
  });

  it("returns [] when a massFlow product has no headline range", () => {
    const broken = makeProduct({ massFlowSpecs: undefined });
    expect(buildOverviewRows(broken, "en", ["A", "B", "C"])).toEqual([]);
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
  it("emits PropertyValue rows for the fixture's massFlow specs", () => {
    const props = buildJsonLdProperties(productFixture);
    expect(props.find((p) => p.name === "Flow Range")?.value).toBe(
      "0–1000 sccm",
    );
    expect(props.find((p) => p.name === "Accuracy")?.value).toBe("±1% F.S.");
    expect(props.find((p) => p.name === "Max Pressure")).toBeUndefined();
  });

  it("emits every present spec in canonical order for a full MFC product", () => {
    const full = makeProduct({
      massFlowSpecs: {
        flowRange: { display: "0–1000 sccm" },
        pressureRange: { display: "0.1–6 barA" },
        accuracy: { display: "±1% F.S." },
        repeatability: { display: "±0.2% F.S." },
        responseTime: { display: "<1s" },
        ioSignal: { display: "0–5 VDC" },
        supplyPower: { display: "±15 VDC" },
        maxPressure: { display: "100 psi" },
        tempRange: { display: "0–50 °C" },
        leakRate: { display: "1e-9" },
        controlRange: { display: "2–100% F.S." },
      },
    });
    const names = buildJsonLdProperties(full).map((p) => p.name);
    expect(names).toEqual([
      "Flow Range",
      "Pressure Range",
      "Accuracy",
      "Repeatability",
      "Response Time",
      "Max Pressure",
      "I/O Signal",
      "Supply Power",
      "Temperature Range",
      "Leak Rate",
    ]);
  });

  it("returns [] when a massFlow product has no massFlowSpecs", () => {
    const broken = makeProduct({ massFlowSpecs: undefined });
    expect(buildJsonLdProperties(broken)).toEqual([]);
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

describe("buildJsonLdDescription", () => {
  it("uses headline range + accuracy for massFlow products", () => {
    expect(buildJsonLdDescription(productFixture, "Test Controller")).toBe(
      "Test Controller — 0–1000 sccm flow range, ±1% F.S. accuracy",
    );
  });

  it("uses pressure-range wording when pressureRange is present", () => {
    const epc = makeProduct({
      function: "EPC",
      massFlowSpecs: {
        ...productFixture.massFlowSpecs!,
        flowRange: undefined,
        pressureRange: { display: "0.1–6 barA" },
      },
    });
    expect(buildJsonLdDescription(epc, "Test EPC")).toBe(
      "Test EPC — 0.1–6 barA pressure range, ±1% F.S. accuracy",
    );
  });

  it("returns plain productLabel for ROU products", () => {
    expect(buildJsonLdDescription(rouProductFixture, "Test Read-Out")).toBe(
      "Test Read-Out",
    );
  });

  it("returns plain productLabel when massFlow data is missing", () => {
    const broken = makeProduct({ massFlowSpecs: undefined });
    expect(buildJsonLdDescription(broken, "Broken")).toBe("Broken");
  });
});
