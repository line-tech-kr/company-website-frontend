import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allProductsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { buildFinderMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/content/home";
import { ProductFinder } from "@/components/finder/ProductFinder";
import { parseFinderUrl } from "@/lib/finder/parseFinderUrl";
import "./finder-page.css";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildFinderMetadata(locale as Locale);
}

export default async function ProductFinderPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initial = parseFinderUrl(await searchParams);

  const [tCommon, tNav, tFinder] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("productFinder"),
  ]);

  // Use safeParse per row so a single malformed Sanity document (e.g. an
  // accessory accidentally typed as a product) doesn't take the whole page
  // down. The finder needs flow specs, so anything that fails the schema
  // is not findable anyway.
  const rawProducts = await sanityClient.fetch(allProductsQuery);
  const products = (rawProducts as unknown[]).flatMap((row) => {
    const parsed = SanityProductSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: tFinder("breadcrumb") },
  ];

  return (
    <main className="lt-wrap lt-finder-page">
      <Breadcrumbs items={breadcrumbs} />
      <header className="lt-finder-page__intro">
        <h1 className="lt-finder-page__title">{tFinder("heading")}</h1>
        <p className="lt-finder-page__lede">{tFinder("lede")}</p>
      </header>
      <ProductFinder
        products={products}
        locale={locale as Locale}
        initial={initial}
      />
    </main>
  );
}
