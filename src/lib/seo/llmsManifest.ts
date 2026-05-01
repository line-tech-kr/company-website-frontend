import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { allProductsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { categoryForSeries } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

const CATEGORY_META: Record<
  "analogue" | "digital" | "specialized",
  { heading: string; code: string; description: string }
> = {
  analogue: {
    heading: "Analogue series (M / MS)",
    code: "M·MS",
    description:
      "Workhorse MFCs and MFMs for standard lab and industrial lines. Simple 0–5 V or 4–20 mA signal. 20+ years field-proven. Best choice when no digital bus is required.",
  },
  digital: {
    heading: "Digital series (MD)",
    code: "MD",
    description:
      "When you need ±0.25% FS accuracy, 8-point linearization, or RS-485 / Modbus RTU for bus integration. Sub-second response. Preferred for semiconductor process lines.",
  },
  specialized: {
    heading: "Specialized series (LD / LM)",
    code: "LD·LM",
    description:
      "Hazardous locations, display-integrated units, MEMS sensors. Choose when standard variants don't fit the environment.",
  },
};

function productLine(product: Product, siteUrl: string): string {
  const category = categoryForSeries(product.series);
  const slug = product.slug.current;
  const pageUrl = `${siteUrl}/en/products/${category}/${slug}`;
  const jsonUrl = `${siteUrl}/products/${slug}/spec.json`;
  const mdUrl = `${siteUrl}/products/${slug}/spec.md`;

  const fnLabel =
    product.function === "MFC" ? "Mass Flow Controller" : "Mass Flow Meter";
  const flowRange = product.massFlowSpecs.flowRange?.display;
  const accuracy = product.massFlowSpecs.accuracy?.display;

  const features = product.features
    .map((f: { en?: string }) => f.en)
    .filter(Boolean)
    .slice(0, 3)
    .join("; ");

  const detail = [
    `${fnLabel}`,
    flowRange && `flow range ${flowRange}`,
    accuracy && `accuracy ${accuracy}`,
    features,
  ]
    .filter(Boolean)
    .join(". ");

  return `- [${product.model}](${pageUrl}) — ${detail}. [Spec JSON](${jsonUrl}) · [Spec sheet](${mdUrl})`;
}

export async function buildLlmsManifest(siteUrl: string): Promise<string> {
  const raw = await fetchSanity(() => sanityClient.fetch(allProductsQuery), {
    name: "llmsManifest",
  });

  const products = (Array.isArray(raw) ? raw : [])
    .map((p) => {
      try {
        return SanityProductSchema.parse(p);
      } catch {
        return null;
      }
    })
    .filter((p): p is Product => p !== null);

  const byCategory = {
    analogue: products.filter((p) => p.series === "analogue"),
    digital: products.filter((p) => p.series === "digital"),
    specialized: products.filter((p) => p.series === "specialized"),
  };

  const lines: string[] = [
    "# Line Tech",
    "",
    "> Korean manufacturer of Mass Flow Controllers (MFC) and Mass Flow Meters (MFM).",
    "> Precision flow instrumentation for semiconductor, biotech, fuel-cell, and",
    "> process-industry applications. Headquartered in Daejeon, South Korea since 1997.",
    "> ISO-certified. 13 product certifications. Direct sales with application engineering support.",
    "",
    "## Company",
    "",
    `- [Company overview](${siteUrl}/en/company): History, capabilities, certifications, and team`,
    `- [Contact & inquiry](${siteUrl}/en/contact): Sales inquiry form and direct contact`,
    "",
    "## Products",
    "",
  ];

  for (const series of ["analogue", "digital", "specialized"] as const) {
    const list = byCategory[series];
    if (list.length === 0) continue;
    const meta = CATEGORY_META[series];
    lines.push(`### ${meta.heading}`, "");
    lines.push(meta.description, "");

    const mfcs = list.filter((p) => p.function === "MFC");
    const mfms = list.filter((p) => p.function === "MFM");

    if (mfcs.length > 0) {
      lines.push("**Mass Flow Controllers**", "");
      for (const p of mfcs) lines.push(productLine(p, siteUrl));
      lines.push("");
    }
    if (mfms.length > 0) {
      lines.push("**Mass Flow Meters**", "");
      for (const p of mfms) lines.push(productLine(p, siteUrl));
      lines.push("");
    }
  }

  lines.push("## Optional", "");
  lines.push(`- [Korean site](${siteUrl}/ko): 한국어 제품 카탈로그`);
  lines.push(`- [Chinese site](${siteUrl}/zh): 中文产品目录`);
  lines.push("");

  return lines.join("\n");
}
