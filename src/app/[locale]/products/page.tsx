import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allProductsQuery } from "@/sanity/queries";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  categoryForSeries,
  type CategorySlug,
} from "@/lib/categories";
import { SanityProductSchema } from "@/lib/types/product";
import { z } from "zod";
import { buildProductsMetadata } from "@/lib/seo";
import { getProductsCategories, LT_SHELL } from "@/lib/content/shell";
import { LT_HOME, type Locale } from "@/lib/content/home";
import "./products-list.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildProductsMetadata(locale as "ko" | "en" | "zh");
}

export default async function ProductsListPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tProducts] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("products"),
  ]);

  const products = z
    .array(SanityProductSchema)
    .parse(await sanityClient.fetch(allProductsQuery));

  const counts = new Map<CategorySlug, number>(
    CATEGORY_SLUGS.map((slug) => [slug, 0]),
  );
  for (const p of products) {
    const slug = categoryForSeries(p.series);
    if (slug) counts.set(slug, counts.get(slug)! + 1);
  }

  const typedLocale = locale as Locale;
  const accessories = getProductsCategories(typedLocale).find(
    (c) => c.code === "accessories",
  );

  const seriesByHref = new Map(
    LT_HOME[typedLocale].series.items.map((s) => [s.href, s]),
  );

  const productsNav = LT_SHELL[typedLocale].nav.find(
    (n) => n.id === "products",
  );
  const featured =
    productsNav?.menu?.kind === "products" ? productsNav.menu.featured : null;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products") },
  ];

  return (
    <main className="lt-wrap lt-products-list">
      <Breadcrumbs items={breadcrumbs} />

      <header className="lt-products-list__intro">
        <h1 className="lt-products-list__title">{tProducts("list.title")}</h1>
        <p className="lt-products-list__lede">
          {tProducts("list.intro", { count: products.length })}
        </p>
      </header>

      {featured && (
        <Link href={featured.href} className="lt-products-list__featured">
          <div className="lt-products-list__featured-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/products/m3030va/product-1.jpg" alt="" loading="lazy" />
          </div>
          <div className="lt-products-list__featured-body">
            <span className="lt-products-list__featured-eyebrow">
              {featured.eyebrow}
            </span>
            <h2 className="lt-products-list__featured-title">
              {featured.title}
            </h2>
            <p className="lt-products-list__featured-blurb">{featured.blurb}</p>
            <span className="lt-products-list__featured-cta">
              {featured.cta} →
            </span>
          </div>
        </Link>
      )}

      <ul className="lt-products-list__cats">
        {CATEGORY_SLUGS.map((slug) => {
          const cat = CATEGORIES[slug];
          const count = counts.get(slug)!;
          if (count === 0) return null;
          const series = seriesByHref.get(`/products/${slug}`);
          return (
            <li key={slug}>
              <Link
                href={`/products/${slug}`}
                className="lt-products-list__card"
              >
                <span className="lt-products-list__card-code">{cat.code}</span>
                <h2 className="lt-products-list__card-title">
                  {tProducts(`categories.${slug}.title`)}
                </h2>
                <p className="lt-products-list__card-lede">
                  {tProducts(`categories.${slug}.lede`)}
                </p>
                {series?.range && (
                  <span className="lt-products-list__card-range">
                    {series.range}
                  </span>
                )}
                <div className="lt-products-list__card-foot">
                  <span className="lt-products-list__card-count">
                    {tProducts("list.cardCount", { count })}
                  </span>
                  {series?.feat && (
                    <span className="lt-products-list__card-feat">
                      {series.feat}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
        {accessories && (
          <li key="accessories">
            <Link
              href="/products/accessories"
              className="lt-products-list__card"
            >
              <h2 className="lt-products-list__card-title">
                {accessories.label}
              </h2>
              <p className="lt-products-list__card-lede">{accessories.desc}</p>
            </Link>
          </li>
        )}
      </ul>
    </main>
  );
}
