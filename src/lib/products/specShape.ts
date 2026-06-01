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
  const loc = (s: string) => localizeSpecValue(s, locale);
  const m = product.massFlowSpecs;
  const headlineRange = m?.flowRange ?? m?.pressureRange;
  const rows: OverviewRow[] = [
    {
      feature: features[0] ?? "",
      values:
        headlineRange && m
          ? [loc(headlineRange.display), loc(m.accuracy.display)]
          : [],
    },
    {
      feature: features[1] ?? "",
      values: m?.responseTime ? [loc(m.responseTime.display)] : [],
    },
    {
      feature: features[2] ?? "",
      values: m?.maxPressure ? [loc(m.maxPressure.display)] : [],
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
  const props: JsonLdProperty[] = [];
  if (m.flowRange) {
    props.push({
      "@type": "PropertyValue",
      name: "Flow Range",
      value: m.flowRange.display,
    });
  }
  if (m.pressureRange) {
    props.push({
      "@type": "PropertyValue",
      name: "Pressure Range",
      value: m.pressureRange.display,
    });
  }
  props.push({
    "@type": "PropertyValue",
    name: "Accuracy",
    value: m.accuracy.display,
  });
  props.push({
    "@type": "PropertyValue",
    name: "Repeatability",
    value: m.repeatability.display,
  });
  if (m.responseTime) {
    props.push({
      "@type": "PropertyValue",
      name: "Response Time",
      value: m.responseTime.display,
    });
  }
  if (m.maxPressure) {
    props.push({
      "@type": "PropertyValue",
      name: "Max Pressure",
      value: m.maxPressure.display,
    });
  }
  props.push({
    "@type": "PropertyValue",
    name: "I/O Signal",
    value: m.ioSignal.display,
  });
  props.push({
    "@type": "PropertyValue",
    name: "Supply Power",
    value: m.supplyPower.display,
  });
  props.push({
    "@type": "PropertyValue",
    name: "Temperature Range",
    value: m.tempRange.display,
  });
  props.push({
    "@type": "PropertyValue",
    name: "Leak Rate",
    value: m.leakRate.display,
  });
  return props;
}

export function getHeadlineRange(product: Product) {
  return (
    product.massFlowSpecs?.flowRange ??
    product.massFlowSpecs?.pressureRange ??
    null
  );
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
