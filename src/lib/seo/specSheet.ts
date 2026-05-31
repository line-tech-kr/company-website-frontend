import { categoryForSeries } from "@/lib/categories";
import type { Product, MassFlowSpecs } from "@/lib/types/product";

const SPEC_LABELS: Record<keyof MassFlowSpecs, string> = {
  flowRange: "Flow range",
  pressureRange: "Pressure range",
  responseTime: "Response time",
  accuracy: "Accuracy",
  repeatability: "Repeatability",
  ioSignal: "I/O signal",
  supplyPower: "Supply power",
  maxPressure: "Max pressure",
  tempRange: "Temperature range",
  leakRate: "Leak rate",
  controlRange: "Control range",
};

const SPEC_ORDER: Array<keyof MassFlowSpecs> = [
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

const SERIES_LABELS: Record<Product["series"], string> = {
  analogue: "Analogue",
  digital: "Digital",
  specialized: "Specialized",
};

const FUNCTION_LABELS: Record<
  Product["function"],
  { short: string; long: string }
> = {
  MFC: { short: "Mass Flow Controller", long: "Mass Flow Controller (MFC)" },
  MFM: { short: "Mass Flow Meter", long: "Mass Flow Meter (MFM)" },
  EPC: {
    short: "Electronic Pressure Controller",
    long: "Electronic Pressure Controller (EPC)",
  },
  ROU: { short: "Read-Out Unit", long: "Read-Out Unit (ROU)" },
};

export type SpecJsonPayload = {
  model: string;
  slug: string;
  series: Product["series"];
  function: Product["function"];
  productLabel: { ko: string; en: string; zh: string };
  features: { en?: string; ko?: string; zh?: string }[];
  connections: { type: string; length: string }[];
  specifications: Partial<Record<keyof MassFlowSpecs, Record<string, unknown>>>;
  instrumentSpecs?: Array<{ label: string; value: string }>;
  digitalCommunication?: Product["digitalCommunication"];
  canonicalUrl: string;
  alternates: { ko: string; zh: string };
};

export function buildSpecJson(
  product: Product,
  siteUrl: string,
): SpecJsonPayload {
  const category = categoryForSeries(product.series);
  const slug = product.slug.current;

  const specifications: SpecJsonPayload["specifications"] = {};
  for (const key of SPEC_ORDER) {
    const spec = product.massFlowSpecs?.[key];
    if (spec) {
      specifications[key] = spec as Record<string, unknown>;
    }
  }

  return {
    model: product.model,
    slug,
    series: product.series,
    function: product.function,
    productLabel: product.productLabel,
    features: product.features.map(
      (f: { en?: string; ko?: string; zh?: string }) => ({
        en: f.en,
        ko: f.ko,
        zh: f.zh,
      }),
    ),
    connections: (product.connections ?? []).map(({ type, length }) => ({
      type,
      length,
    })),
    specifications,
    ...(product.instrumentSpecs?.length
      ? { instrumentSpecs: product.instrumentSpecs }
      : {}),
    digitalCommunication: product.digitalCommunication ?? undefined,
    canonicalUrl: `${siteUrl}/en/products/${category}/${slug}`,
    alternates: {
      ko: `${siteUrl}/ko/products/${category}/${slug}`,
      zh: `${siteUrl}/zh/products/${category}/${slug}`,
    },
  };
}

export function buildSpecMarkdown(product: Product, siteUrl: string): string {
  const category = categoryForSeries(product.series);
  const slug = product.slug.current;
  const seriesLabel = SERIES_LABELS[product.series];
  const canonicalUrl = `${siteUrl}/en/products/${category}/${slug}`;
  const koUrl = `${siteUrl}/ko/products/${category}/${slug}`;
  const zhUrl = `${siteUrl}/zh/products/${category}/${slug}`;

  const fn = FUNCTION_LABELS[product.function];

  const lines: string[] = [
    `# ${product.model} — ${seriesLabel} ${fn.short}`,
    "",
    `**Series:** ${seriesLabel} · **Function:** ${fn.long}`,
    `**Product name:** ${product.productLabel.en}`,
    `**Canonical page:** ${canonicalUrl}`,
    "",
  ];

  const features = product.features
    .map((f: { en?: string }) => f.en)
    .filter(Boolean) as string[];
  if (features.length > 0) {
    lines.push("## Features", "");
    for (const f of features) lines.push(`- ${f}`);
    lines.push("");
  }

  lines.push("## Specifications", "");
  lines.push("| Spec | Value |");
  lines.push("|---|---|");
  if (product.instrumentSpecs?.length) {
    for (const r of product.instrumentSpecs) {
      lines.push(`| ${r.label} | ${r.value} |`);
    }
  } else {
    for (const key of SPEC_ORDER) {
      const spec = product.massFlowSpecs?.[key];
      if (spec) {
        lines.push(`| ${SPEC_LABELS[key]} | ${spec.display} |`);
      }
    }
  }
  lines.push("");

  if (product.connections && product.connections.length > 0) {
    lines.push("## Connections", "");
    for (const c of product.connections) {
      lines.push(`- ${c.type} — body length ${c.length}`);
    }
    lines.push("");
  }

  const dc = product.digitalCommunication;
  if (dc?.protocol) {
    lines.push("## Digital communication", "");
    lines.push(`- Protocol: ${dc.protocol}`);
    if (dc.baudRate) lines.push(`- Baud rate: ${dc.baudRate}`);
    if (dc.dataBits) lines.push(`- Data bits: ${dc.dataBits}`);
    if (dc.stopBits) lines.push(`- Stop bits: ${dc.stopBits}`);
    if (dc.parity) lines.push(`- Parity: ${dc.parity}`);
    lines.push("");
  }

  lines.push("---");
  lines.push(
    `*Source: line-tech.co.kr · English spec sheet for AI agents. Korean: ${koUrl} · Chinese: ${zhUrl}*`,
  );

  return lines.join("\n");
}
