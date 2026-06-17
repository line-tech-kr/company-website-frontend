import type { Product } from "./types/product";

export const CATEGORY_SLUGS = [
  "analogue",
  "digital",
  "explosion-proof",
  "lepc",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: Record<
  CategorySlug,
  { code: string; series: Product["series"] }
> = {
  analogue: { code: "M·MS", series: "analogue" },
  digital: { code: "MD", series: "digital" },
  "explosion-proof": { code: "EX", series: "specialized" },
  lepc: { code: "LEPC", series: "lepc" },
};

// Note: the Sanity `series` value stays "specialized" (no CMS migration); only
// the URL-facing CategorySlug is "explosion-proof". This map bridges the two.
const SERIES_TO_CATEGORY: Record<Product["series"], CategorySlug> = {
  analogue: "analogue",
  digital: "digital",
  specialized: "explosion-proof",
  lepc: "lepc",
};

export function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}

export function categoryForSeries(series: Product["series"]): CategorySlug {
  return SERIES_TO_CATEGORY[series];
}
