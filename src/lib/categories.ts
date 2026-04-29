import type { Product } from "./types/product";

export const CATEGORY_SLUGS = ["analogue", "digital", "specialized"] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const CATEGORIES: Record<
  CategorySlug,
  { kickerNum: string; code: string; series: Product["series"] }
> = {
  analogue: { kickerNum: "01", code: "M / MS", series: "analogue" },
  digital: { kickerNum: "02", code: "MD", series: "digital" },
  specialized: { kickerNum: "03", code: "LD / LM", series: "specialized" },
};

export function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}
