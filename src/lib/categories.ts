import type { Product } from "./types/product";

export const CATEGORY_SLUGS = ["analogue", "digital", "specialized"] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: Record<
  CategorySlug,
  { code: string; series: Product["series"] }
> = {
  analogue: { code: "M·MS", series: "analogue" },
  digital: { code: "MD", series: "digital" },
  specialized: { code: "LD·LM", series: "specialized" },
};

const SERIES_TO_CATEGORY: Record<Product["series"], CategorySlug> = {
  analogue: "analogue",
  digital: "digital",
  specialized: "specialized",
};

export function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}

export function categoryForSeries(series: Product["series"]): CategorySlug {
  return SERIES_TO_CATEGORY[series];
}
