import type { MetadataRoute } from "next";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { allProductsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import { categoryForSeries, CATEGORY_SLUGS } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://linetech.co.kr";

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
    const products = (await fetchSanity(
      () => sanityClient.fetch(allProductsQuery),
      { name: "sitemap.allProducts" },
    )) as Product[];

    productEntries = products.flatMap((product) => {
      const category = categoryForSeries(product.series);
      if (!category) return [];
      const path = `products/${category}/${product.slug.current}`;
      return routing.locales.map((locale) =>
        entry(locale, path, 1.0, "monthly", now),
      );
    });
  } catch {
    // If Sanity is unreachable at build time, ship a sitemap with static + category routes only.
    productEntries = [];
  }

  return [...staticEntries, ...categoryEntries, ...productEntries];
}
