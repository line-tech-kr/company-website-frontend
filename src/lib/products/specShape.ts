import type { Locale } from "@/i18n/routing";
import type { MassFlowSpecs, Product } from "@/lib/types/product";
import { localizeSpecValue } from "./localizeSpecValue";

export type SpecRow = { key: string; label: string; value: string };

export type SpecGroup = {
  id: string;
  num: string;
  label: string;
  rows: SpecRow[];
};

export type OverviewRow = { feature: string; values: string[] };

export type JsonLdProperty = {
  "@type": "PropertyValue";
  name: string;
  value: string;
};

const MASS_FLOW_GROUPS = [
  {
    id: "performance",
    num: "01",
    keys: [
      "flowRange",
      "pressureRange",
      "responseTime",
      "accuracy",
      "repeatability",
      "controlRange",
    ],
  },
  { id: "signal", num: "02", keys: ["ioSignal", "supplyPower"] },
  {
    id: "environment",
    num: "03",
    keys: ["maxPressure", "tempRange", "leakRate"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  num: string;
  keys: ReadonlyArray<keyof MassFlowSpecs>;
}>;

export type MassFlowGroupId = (typeof MASS_FLOW_GROUPS)[number]["id"];

export const MASS_FLOW_SPEC_ORDER: ReadonlyArray<keyof MassFlowSpecs> = [
  "flowRange",
  "pressureRange",
  "accuracy",
  "repeatability",
  "responseTime",
  "controlRange",
  "ioSignal",
  "supplyPower",
  "maxPressure",
  "tempRange",
  "leakRate",
];

// JSON-LD PropertyValue rows for the product detail page. Order matters
// for schema.org consumers — keep flow/pressure first, end with
// environment.
const MASS_FLOW_JSONLD_KEYS: ReadonlyArray<{
  key: keyof MassFlowSpecs;
  name: string;
}> = [
  { key: "flowRange", name: "Flow Range" },
  { key: "pressureRange", name: "Pressure Range" },
  { key: "accuracy", name: "Accuracy" },
  { key: "repeatability", name: "Repeatability" },
  { key: "responseTime", name: "Response Time" },
  { key: "maxPressure", name: "Max Pressure" },
  { key: "ioSignal", name: "I/O Signal" },
  { key: "supplyPower", name: "Supply Power" },
  { key: "tempRange", name: "Temperature Range" },
  { key: "leakRate", name: "Leak Rate" },
];

export type SpecLabelers = {
  spec: (key: keyof MassFlowSpecs) => string;
  group: (id: MassFlowGroupId) => string;
  instrument: string;
};

export function buildSpecGroups(
  product: Product,
  locale: Locale,
  labelers: SpecLabelers,
): SpecGroup[] {
  if (product.function === "ROU") {
    return [
      {
        id: "instrument",
        num: "01",
        label: labelers.instrument,
        rows: (product.instrumentSpecs ?? []).map((r) => ({
          key: r.label,
          label: r.label,
          value: r.value,
        })),
      },
    ];
  }
  return MASS_FLOW_GROUPS.map((g) => ({
    id: g.id,
    num: g.num,
    label: labelers.group(g.id),
    rows: g.keys.flatMap<SpecRow>((k) => {
      const spec = product.massFlowSpecs?.[k];
      return spec
        ? [
            {
              key: k,
              label: labelers.spec(k),
              value: localizeSpecValue(spec.display, locale),
            },
          ]
        : [];
    }),
  }));
}

export function buildOverviewRows(
  product: Product,
  locale: Locale,
  features: ReadonlyArray<string | undefined>,
): OverviewRow[] {
  if (product.function === "ROU") {
    return (product.instrumentSpecs ?? []).slice(0, 3).map((r) => ({
      feature: r.label,
      values: [r.value],
    }));
  }
  const m = product.massFlowSpecs;
  const headlineRange = m?.flowRange ?? m?.pressureRange;
  // No mass-flow data at all → drop the section entirely rather than
  // emitting feature labels with empty value arrays (which the original
  // inline code crashed on; this is the cleanly-skipped equivalent).
  if (!m || !headlineRange) return [];
  const loc = (s: string) => localizeSpecValue(s, locale);
  const rows: OverviewRow[] = [
    {
      feature: features[0] ?? "",
      values: [loc(headlineRange.display), loc(m.accuracy.display)],
    },
    {
      feature: features[1] ?? "",
      values: m.responseTime ? [loc(m.responseTime.display)] : [],
    },
    {
      feature: features[2] ?? "",
      values: m.maxPressure ? [loc(m.maxPressure.display)] : [],
    },
  ];
  return rows.filter((r) => r.feature);
}

export function buildJsonLdProperties(product: Product): JsonLdProperty[] {
  if (product.function === "ROU") {
    return (product.instrumentSpecs ?? []).map((r) => ({
      "@type": "PropertyValue",
      name: r.label,
      value: r.value,
    }));
  }
  const m = product.massFlowSpecs;
  if (!m) return [];
  return MASS_FLOW_JSONLD_KEYS.flatMap(({ key, name }) => {
    const spec = m[key];
    return spec
      ? [{ "@type": "PropertyValue" as const, name, value: spec.display }]
      : [];
  });
}

export function buildJsonLdDescription(
  product: Product,
  productLabel: string,
): string {
  if (product.function === "ROU") return productLabel;
  const m = product.massFlowSpecs;
  const headline = m?.flowRange ?? m?.pressureRange;
  if (!headline || !m) return productLabel;
  const rangeKind = m.pressureRange ? "pressure range" : "flow range";
  return `${productLabel} — ${headline.display} ${rangeKind}, ${m.accuracy.display} accuracy`;
}
