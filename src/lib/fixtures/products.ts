import type { Product } from "../types/product";
import data from "./products.json";

const products = data as unknown as Product[];

export const ALL_PRODUCTS: Product[] = products.map((p) => ({
  ...p,
  datasheets: p.datasheets ?? [],
  manuals: p.manuals ?? [],
  drawings: p.drawings ?? [],
  certifications: p.certifications ?? [],
}));

const bySlug = new Map(ALL_PRODUCTS.map((p) => [p.slug.current, p]));
const byModel = new Map(ALL_PRODUCTS.map((p) => [p.model, p]));

export function productBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function productByModel(model: string): Product | undefined {
  return byModel.get(model);
}
