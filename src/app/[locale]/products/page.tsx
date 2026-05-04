import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Chip } from "@/components/ui/Chip";
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
import { LT_APPLICATIONS } from "@/lib/content/applications";
import "./products-list.css";

type Props = { params: Promise<{ locale: string }> };

const CARD_ACCENT: Record<CategorySlug | "accessories", string> = {
  analogue: "blue",
  digital: "steel",
  specialized: "gold",
  accessories: "neutral",
};

const APPLICATION_STRIP_SLUGS = [
  "semiconductor",
  "fuel-cells",
  "biotech-pharmaceutical",
  "chemical-petrochemical",
  "research-development",
] as const;

const CERTIFICATION_COUNT = 13;
const SERIES_COUNT = 4;

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

  const applicationsByLocale = LT_APPLICATIONS[typedLocale].applications;
  const industryCount = applicationsByLocale.length;
  const stripIndustries = APPLICATION_STRIP_SLUGS.map((slug) =>
    applicationsByLocale.find((a) => a.slug === slug),
  ).filter((x): x is NonNullable<typeof x> => Boolean(x));

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products") },
  ];

  return (
    <main className="lt-wrap lt-products-list">
      <Breadcrumbs items={breadcrumbs} />

      <header className="lt-products-list__intro">
        <h1 className="lt-products-list__title">{tProducts("list.title")}</h1>
        <p className="lt-products-list__lede">{tProducts("list.lede")}</p>
      </header>

      <ul
        className="lt-products-list__stats"
        aria-label={tProducts("list.title")}
      >
        <li className="lt-products-list__stat">
          <a href="#categories" className="lt-products-list__stat-link">
            <span className="lt-products-list__stat-num">{SERIES_COUNT}</span>
            <span className="lt-products-list__stat-label">
              {tProducts("list.stats.series")}
            </span>
          </a>
        </li>
        <li className="lt-products-list__stat">
          <span className="lt-products-list__stat-num">{products.length}</span>
          <span className="lt-products-list__stat-label">
            {tProducts("list.stats.models")}
          </span>
        </li>
        <li className="lt-products-list__stat">
          <Link href="/applications" className="lt-products-list__stat-link">
            <span className="lt-products-list__stat-num">{industryCount}</span>
            <span className="lt-products-list__stat-label">
              {tProducts("list.stats.industries")}
            </span>
          </Link>
        </li>
        <li className="lt-products-list__stat">
          <span className="lt-products-list__stat-num">
            {CERTIFICATION_COUNT}
          </span>
          <span className="lt-products-list__stat-label">
            {tProducts("list.stats.certifications")}
          </span>
        </li>
      </ul>

      {featured && (
        <Link href={featured.href} className="lt-products-list__featured">
          {featured.image && (
            <div className="lt-products-list__featured-media">
              <div className="lt-products-list__featured-media-plate">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt="" />
              </div>
            </div>
          )}
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

      <section
        className="lt-products-list__helper"
        aria-labelledby="helper-title"
      >
        <h2 id="helper-title" className="lt-products-list__helper-title">
          {tProducts("list.helper.title")}
        </h2>
        <ul className="lt-products-list__helper-rows">
          {(["analogue", "digital", "specialized"] as const).map((slug) => (
            <li key={slug}>
              <Link
                href={`/products/${slug}`}
                className="lt-products-list__helper-row"
                data-accent={CARD_ACCENT[slug]}
              >
                <span className="lt-products-list__helper-name">
                  {tProducts(`categories.${slug}.title`)}
                </span>
                <span className="lt-products-list__helper-trait">
                  {tProducts(`list.helper.${slug}`)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ul className="lt-products-list__cats" id="categories">
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
                data-accent={CARD_ACCENT[slug]}
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
              className="lt-products-list__card lt-products-list__card--no-foot"
              data-accent={CARD_ACCENT.accessories}
            >
              <h2 className="lt-products-list__card-title">
                {accessories.label}
              </h2>
              <p className="lt-products-list__card-lede">{accessories.desc}</p>
            </Link>
          </li>
        )}
      </ul>

      <section
        className="lt-products-list__apps"
        aria-labelledby="apps-strip-label"
      >
        <span id="apps-strip-label" className="lt-products-list__apps-eyebrow">
          {tProducts("list.applications.label")}
        </span>
        <ul className="lt-products-list__apps-chips">
          {stripIndustries.map((ind) => (
            <li key={ind.slug}>
              <Link
                href={`/applications/${ind.slug}`}
                className="lt-products-list__apps-chip"
              >
                <Chip small>{ind.title}</Chip>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/applications" className="lt-products-list__apps-all">
          {tProducts("list.applications.viewAll", { count: industryCount })}
        </Link>
      </section>
    </main>
  );
}
