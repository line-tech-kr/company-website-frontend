import type { CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

export type SearchEntry = {
  id: string;
  type: "product" | "category" | "page";
  title: string;
  model: string;
  productType?: Lowercase<Product["function"]>;
  signal?: CategorySlug;
  url: string;
  breadcrumb: string;
};
