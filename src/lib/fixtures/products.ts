import type { Product } from "../types/product";
import data from "./products.json";

export const ALL_PRODUCTS: Product[] = data as Product[];

const bySlug = new Map(ALL_PRODUCTS.map((p) => [p.slug.current, p]));
const byModel = new Map(ALL_PRODUCTS.map((p) => [p.model, p]));

export function productBySlug(slug: string): Product | undefined {
  return bySlug.get(slug);
}

export function productByModel(model: string): Product | undefined {
  return byModel.get(model);
}
