import type { MetadataRoute } from "next";
import { sanityBuildClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productSlugsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { categoryForSeries, CATEGORY_SLUGS } from "@/lib/categories";
import type { Product } from "@/lib/types/product";
import { siteUrl } from "@/lib/seo";

export const revalidate = 3600;

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const STATIC_ROUTES: StaticRoute[] = [
  { path: "", priority: 0.5, changeFrequency: "yearly" },
  { path: "company", priority: 0.3, changeFrequency: "yearly" },
  { path: "contact", priority: 0.3, changeFrequency: "yearly" },
  { path: "products", priority: 0.7, changeFrequency: "monthly" },
  { path: "products/accessories", priority: 0.6, changeFrequency: "monthly" },
];

function buildLocaleAlternates(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => {
      const url = path
        ? `${siteUrl}/${locale}/${path}`
        : `${siteUrl}/${locale}`;
      return [locale, url];
    }),
  );
}

function entry(
  locale: string,
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified: Date,
): MetadataRoute.Sitemap[number] {
  const url = path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`;
  return {
    url,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: buildLocaleAlternates(path) },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.flatMap((route) =>
    routing.locales.map((locale) =>
      entry(locale, route.path, route.priority, route.changeFrequency, now),
    ),
  );

  const categoryEntries = CATEGORY_SLUGS.flatMap((category) =>
    routing.locales.map((locale) =>
      entry(locale, `products/${category}`, 0.8, "monthly", now),
    ),
  );

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const products = await fetchSanity(
      () =>
        sanityBuildClient.fetch<
          Array<{ slug: string; series: Product["series"] }>
        >(productSlugsQuery),
      { name: "sitemap.productSlugs" },
    );

    productEntries = products
      .filter((p) => p?.slug)
      .flatMap((product) => {
        const path = `products/${categoryForSeries(product.series)}/${product.slug}`;
        return routing.locales.map((locale) =>
          entry(locale, path, 1.0, "monthly", now),
        );
      });
  } catch {
    productEntries = [];
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
