import {
  type FeaturedApplicationProductInput,
  type FeaturedApplicationProductSpec,
} from "@/components/applications/FeaturedApplicationProduct";
import type { Locale } from "@/lib/content/home";
import { productBySlug } from "@/lib/fixtures/products";
import type { MassFlowSpecs, Product } from "@/lib/types/product";
import { urlFor } from "@/sanity/imageUrl";

export type SanityFeaturedProduct = {
  slug: string;
  model: string;
  series: Product["series"];
  productLabel?: Record<string, string> | null;
  description?: Record<string, string> | null;
  flowRange?: string | null;
  image?: { asset?: { _ref: string } } | null;
  cutout?: { asset?: { _ref: string } } | null;
};

export const DEFAULT_FEATURED_SPEC_KEYS: ReadonlyArray<keyof MassFlowSpecs> = [
  "flowRange",
];

export function resolveFeaturedProduct({
  sanity,
  staticSlug,
  locale,
  specKeys,
  getSpecLabel,
}: {
  sanity: SanityFeaturedProduct | null;
  staticSlug: string | undefined;
  locale: Locale;
  specKeys: ReadonlyArray<keyof MassFlowSpecs>;
  getSpecLabel: (key: keyof MassFlowSpecs) => string;
}): FeaturedApplicationProductInput | null {
  if (sanity) {
    const cutoutOrImage = sanity.cutout ?? sanity.image ?? null;
    // The Sanity featured-product schema only carries `flowRange` today;
    // any other requested key is skipped silently until the schema is extended.
    const specs: FeaturedApplicationProductSpec[] = [];
    for (const key of specKeys) {
      if (key === "flowRange" && sanity.flowRange) {
        specs.push({ label: getSpecLabel(key), value: sanity.flowRange });
      }
    }
    return {
      slug: sanity.slug,
      model: sanity.model,
      series: sanity.series,
      productLabel: sanity.productLabel?.[locale] ?? null,
      description: sanity.description?.[locale] ?? null,
      specs,
      imageUrl: cutoutOrImage?.asset
        ? urlFor(cutoutOrImage).width(960).url()
        : null,
    };
  }

  if (!staticSlug) return null;
  const fixture = productBySlug(staticSlug);
  if (!fixture) return null;

  const massFlowSpecs = fixture.massFlowSpecs;
  const specs: FeaturedApplicationProductSpec[] = [];
  for (const key of specKeys) {
    const value = massFlowSpecs?.[key]?.display;
    if (value) specs.push({ label: getSpecLabel(key), value });
  }

  return {
    slug: fixture.slug.current,
    model: fixture.model,
    series: fixture.series,
    productLabel: fixture.productLabel[locale] ?? null,
    description: fixture.description?.[locale] ?? null,
    specs,
    imageUrl: `/products/${fixture.slug.current}/cutout-2026.png`,
  };
}
