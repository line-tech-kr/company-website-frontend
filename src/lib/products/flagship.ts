import { urlFor } from "@/sanity/imageUrl";
import { categoryForSeries, type CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

export const FLAGSHIP_IMAGE_PLACEHOLDER = "/products/lti/placeholder.svg";

export const FLAGSHIP_MODEL: Partial<Record<CategorySlug, string>> = {
  analogue: "M3030VA",
  digital: "MD800C",
  specialized: "LD030C",
};

export function pickFlagship(
  products: Product[],
  slug: CategorySlug,
): Product | undefined {
  const preferred = FLAGSHIP_MODEL[slug];
  if (preferred) {
    const match = products.find(
      (p) =>
        categoryForSeries(p.series) === slug &&
        p.model.toLowerCase() === preferred.toLowerCase(),
    );
    if (match) return match;
  }
  return products.find((p) => categoryForSeries(p.series) === slug);
}

export function flagshipImageUrl(flagship: Product): string {
  const image = flagship.images?.[0];
  if (!image?.asset) {
    console.warn(
      `[products rotator] No image for flagship ${flagship.model} — showing placeholder`,
    );
    return FLAGSHIP_IMAGE_PLACEHOLDER;
  }
  return urlFor(image).width(720).url();
}
