import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { categoryForSeries } from "../src/lib/categories";
import type { Product } from "../src/lib/types/product";
import type { SearchEntry } from "../src/lib/search/types";

function loadEnv(path: string) {
  try {
    for (const line of readFileSync(path, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {
    // no .env.local — fine in CI/Vercel where env vars are injected directly
  }
}

loadEnv(".env.local");

const LOCALES = ["ko", "en", "zh"] as const;
type Locale = (typeof LOCALES)[number];

const CATEGORY_LABELS: Record<"analogue" | "digital" | "specialized", Record<Locale, string>> = {
  analogue: { ko: "아날로그", en: "Analogue", zh: "模拟" },
  digital: { ko: "디지털", en: "Digital", zh: "数字" },
  specialized: { ko: "특수", en: "Specialized", zh: "特殊" },
};

function productToEntries(p: Product): Record<Locale, SearchEntry> | null {
  const category = categoryForSeries(p.series);
  if (!category) {
    console.warn(`  skipping ${p.model}: unknown series "${p.series}"`);
    return null;
  }
  const url = `/products/${category}/${p.slug.current}`;
  const productType = p.function.toLowerCase() as "mfc" | "mfm";
  const signal = p.series;
  const catLabel = CATEGORY_LABELS[category];

  return {
    ko: {
      id: `product-${p.slug.current}`,
      type: "product",
      title: `${p.model} — ${p.productLabel.ko}`,
      model: p.model,
      productType,
      signal,
      url,
      breadcrumb: `제품 › ${catLabel.ko}`,
    },
    en: {
      id: `product-${p.slug.current}`,
      type: "product",
      title: `${p.model} — ${p.productLabel.en}`,
      model: p.model,
      productType,
      signal,
      url,
      breadcrumb: `Products › ${catLabel.en}`,
    },
    zh: {
      id: `product-${p.slug.current}`,
      type: "product",
      title: `${p.model} — ${p.productLabel.zh}`,
      model: p.model,
      productType,
      signal,
      url,
      breadcrumb: `产品 › ${catLabel.zh}`,
    },
  };
}

const STATIC_ENTRIES: Record<Locale, SearchEntry[]> = {
  ko: [
    { id: "page-products", type: "page", title: "제품 전체", model: "", url: "/products", breadcrumb: "제품" },
    { id: "cat-analogue", type: "category", title: "아날로그 질량 유량계", model: "", signal: "analogue", url: "/products/analogue", breadcrumb: "제품 › 아날로그" },
    { id: "cat-digital", type: "category", title: "디지털 질량 유량계", model: "", signal: "digital", url: "/products/digital", breadcrumb: "제품 › 디지털" },
    { id: "cat-specialized", type: "category", title: "특수 사양 유량계", model: "", signal: "specialized", url: "/products/specialized", breadcrumb: "제품 › 특수" },
    { id: "page-company", type: "page", title: "회사 소개", model: "", url: "/company", breadcrumb: "회사" },
    { id: "page-certifications", type: "page", title: "인증서", model: "", url: "/company#certifications", breadcrumb: "회사 › 인증서" },
    { id: "page-contact", type: "page", title: "문의", model: "", url: "/contact", breadcrumb: "문의" },
  ],
  en: [
    { id: "page-products", type: "page", title: "All Products", model: "", url: "/products", breadcrumb: "Products" },
    { id: "cat-analogue", type: "category", title: "Analogue Mass Flow Controllers", model: "", signal: "analogue", url: "/products/analogue", breadcrumb: "Products › Analogue" },
    { id: "cat-digital", type: "category", title: "Digital Mass Flow Controllers", model: "", signal: "digital", url: "/products/digital", breadcrumb: "Products › Digital" },
    { id: "cat-specialized", type: "category", title: "Specialized Flow Controllers", model: "", signal: "specialized", url: "/products/specialized", breadcrumb: "Products › Specialized" },
    { id: "page-company", type: "page", title: "About Line Tech", model: "", url: "/company", breadcrumb: "Company" },
    { id: "page-certifications", type: "page", title: "Certifications", model: "", url: "/company#certifications", breadcrumb: "Company › Certifications" },
    { id: "page-contact", type: "page", title: "Contact", model: "", url: "/contact", breadcrumb: "Contact" },
  ],
  zh: [
    { id: "page-products", type: "page", title: "全部产品", model: "", url: "/products", breadcrumb: "产品" },
    { id: "cat-analogue", type: "category", title: "模拟质量流量控制器", model: "", signal: "analogue", url: "/products/analogue", breadcrumb: "产品 › 模拟" },
    { id: "cat-digital", type: "category", title: "数字质量流量控制器", model: "", signal: "digital", url: "/products/digital", breadcrumb: "产品 › 数字" },
    { id: "cat-specialized", type: "category", title: "特殊规格流量控制器", model: "", signal: "specialized", url: "/products/specialized", breadcrumb: "产品 › 特殊" },
    { id: "page-company", type: "page", title: "关于莱因泰克", model: "", url: "/company", breadcrumb: "公司" },
    { id: "page-certifications", type: "page", title: "认证文件", model: "", url: "/company#certifications", breadcrumb: "公司 › 认证文件" },
    { id: "page-contact", type: "page", title: "联系我们", model: "", url: "/contact", breadcrumb: "联系" },
  ],
};

async function fetchProducts(): Promise<Product[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (projectId && dataset) {
    console.log("  source: Sanity");
    const client = createClient({
      projectId,
      dataset,
      apiVersion: "2026-01-01",
      useCdn: false,
    });
    return client.fetch<Product[]>(`
      *[_type == "product"] | order(series asc, function asc, model asc) {
        model, slug, series, "function": function,
        "productLabel": {
          "ko": coalesce(productLabel[language == "ko"][0].value, productLabel[language == "en"][0].value),
          "en": coalesce(productLabel[language == "en"][0].value, productLabel[language == "ko"][0].value),
          "zh": coalesce(productLabel[language == "zh"][0].value, productLabel[language == "en"][0].value)
        }
      }
    `);
  }

  console.log("  source: fixtures (no Sanity env vars)");
  const { ALL_PRODUCTS } = await import("../src/lib/fixtures/products.js");
  return ALL_PRODUCTS;
}

async function main() {
  console.log("Building search index...");
  const products = await fetchProducts();
  console.log(`  ${products.length} products`);

  mkdirSync("public/search", { recursive: true });

  for (const locale of LOCALES) {
    const entries: SearchEntry[] = [
      ...STATIC_ENTRIES[locale],
      ...products.flatMap((p) => {
        const entry = productToEntries(p);
        return entry ? [entry[locale]] : [];
      }),
    ];
    writeFileSync(
      `public/search/index.${locale}.json`,
      JSON.stringify(entries),
    );
    console.log(`  wrote public/search/index.${locale}.json (${entries.length} entries)`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
