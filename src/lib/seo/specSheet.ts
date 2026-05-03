import { categoryForSeries } from "@/lib/categories";
import type { Product, MassFlowSpecs } from "@/lib/types/product";

const SPEC_LABELS: Record<keyof MassFlowSpecs, string> = {
  flowRange: "Flow range",
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

export type SpecJsonPayload = {
  model: string;
  slug: string;
  series: Product["series"];
  function: Product["function"];
  productLabel: { ko: string; en: string; zh: string };
  features: { en?: string; ko?: string; zh?: string }[];
  connections: { type: string; length: string }[];
  specifications: Partial<Record<keyof MassFlowSpecs, Record<string, unknown>>>;
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
    const spec = product.massFlowSpecs[key];
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
    connections: product.connections.map(({ type, length }) => ({
      type,
      length,
    })),
    specifications,
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

  const lines: string[] = [
    `# ${product.model} — ${seriesLabel} Mass Flow ${product.function === "MFC" ? "Controller" : "Meter"}`,
    "",
    `**Series:** ${seriesLabel} · **Function:** ${product.function === "MFC" ? "Mass Flow Controller (MFC)" : "Mass Flow Meter (MFM)"}`,
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
  for (const key of SPEC_ORDER) {
    const spec = product.massFlowSpecs[key];
    if (spec) {
      lines.push(`| ${SPEC_LABELS[key]} | ${spec.display} |`);
    }
  }
  lines.push("");

  if (product.connections.length > 0) {
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
    `*Source: line-tech.co · English spec sheet for AI agents. Korean: ${koUrl} · Chinese: ${zhUrl}*`,
  );

  return lines.join("\n");
}
