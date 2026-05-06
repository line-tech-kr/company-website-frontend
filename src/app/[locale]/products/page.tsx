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
import { SanityProductSchema, type Product } from "@/lib/types/product";
import { z } from "zod";
import { buildProductsMetadata } from "@/lib/seo";
import { getProductsCategories } from "@/lib/content/shell";
import { LT_HOME, type Locale } from "@/lib/content/home";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import { urlFor } from "@/sanity/imageUrl";
import {
  RotatingFeatured,
  type RotatingSlide,
  type SlideAccent,
} from "./RotatingFeatured";
import "./products-list.css";

export const revalidate = 3600;

const FLAGSHIP_IMAGE_PLACEHOLDER = "/products/lti/placeholder.svg";

function flagshipImageUrl(flagship: Product): string {
  const image = flagship.images?.[0];
  if (!image?.asset) return FLAGSHIP_IMAGE_PLACEHOLDER;
  return urlFor(image).width(720).url();
}

type Props = { params: Promise<{ locale: string }> };

const CARD_ACCENT: Record<CategorySlug | "accessories", SlideAccent> = {
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

const FLAGSHIP_MODEL: Partial<Record<CategorySlug, string>> = {
  analogue: "M3030VA",
};

function pickFlagship(
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildProductsMetadata(locale as Locale);
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

  const slides: RotatingSlide[] = CATEGORY_SLUGS.map((slug) => {
    const flagship = pickFlagship(products, slug);
    if (!flagship) return null;
    return {
      href: `/products/${slug}/${flagship.slug.current}`,
      accent: CARD_ACCENT[slug],
      eyebrow: tProducts(`categories.${slug}.title`),
      model: flagship.model,
      blurb: tProducts(`categories.${slug}.lede`),
      image: flagshipImageUrl(flagship),
      cta: tProducts("showcase.viewProduct"),
    };
  }).filter((x): x is RotatingSlide => Boolean(x));

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
        className="lt-products-list__stats lt-products-list__stats--dark lt-products-list__stats--engineered"
        aria-label={tProducts("list.title")}
      >
        <li className="lt-products-list__stat">
          <div className="lt-products-list__stat-cell">
            <div className="lt-products-list__stat-num">{products.length}</div>
            <div className="lt-products-list__stat-label">
              {tProducts("list.stats.modelsLabel")}
            </div>
            <div className="lt-products-list__stat-sub">
              {tProducts("list.stats.modelsSub", { count: SERIES_COUNT })}
            </div>
          </div>
        </li>
        <li className="lt-products-list__stat">
          <div className="lt-products-list__stat-cell">
            <div className="lt-products-list__stat-num">0.01 – 5,000</div>
            <div className="lt-products-list__stat-label">
              {tProducts("list.stats.rangeLabel")}
            </div>
            <div className="lt-products-list__stat-sub">
              {tProducts("list.stats.rangeSub")}
            </div>
          </div>
        </li>
        <li className="lt-products-list__stat">
          <Link
            href="/applications"
            className="lt-products-list__stat-cell lt-products-list__stat-link"
          >
            <div className="lt-products-list__stat-num">{industryCount}</div>
            <div className="lt-products-list__stat-label">
              {tProducts("list.stats.industriesLabel")}
            </div>
            <div className="lt-products-list__stat-sub">
              {tProducts("list.stats.industriesSub")}
            </div>
          </Link>
        </li>
        <li className="lt-products-list__stat">
          <div className="lt-products-list__stat-cell">
            <div className="lt-products-list__stat-num">
              {CERTIFICATION_COUNT}
            </div>
            <div className="lt-products-list__stat-label">
              {tProducts("list.stats.certificationsLabel")}
            </div>
            <div className="lt-products-list__stat-sub">
              {tProducts("list.stats.certificationsSub")}
            </div>
          </div>
        </li>
      </ul>

      <div className="lt-products-side">
        <ul className="lt-products-side__stack">
          {CATEGORY_SLUGS.map((slug) => {
            const cat = CATEGORIES[slug];
            const count = counts.get(slug)!;
            if (count === 0) return null;
            const series = seriesByHref.get(`/products/${slug}`);
            return (
              <li key={slug}>
                <Link
                  href={`/products/${slug}`}
                  className="lt-products-side__card"
                  data-accent={CARD_ACCENT[slug]}
                >
                  <span className="lt-products-side__card-code">
                    {cat.code}
                  </span>
                  <div className="lt-products-side__card-body">
                    <h2 className="lt-products-side__card-title">
                      {tProducts(`categories.${slug}.title`)}
                    </h2>
                    <p className="lt-products-side__card-lede">
                      {tProducts(`categories.${slug}.lede`)}
                    </p>
                  </div>
                  <div className="lt-products-side__card-meta">
                    <span className="lt-products-side__card-count">
                      {tProducts("list.cardCount", { count })}
                    </span>
                    {series?.feat && (
                      <span className="lt-products-side__card-feat">
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
                className="lt-products-side__card lt-products-side__card--no-code"
                data-accent={CARD_ACCENT.accessories}
              >
                <div className="lt-products-side__card-body">
                  <h2 className="lt-products-side__card-title">
                    {accessories.label}
                  </h2>
                  <p className="lt-products-side__card-lede">
                    {accessories.desc}
                  </p>
                </div>
              </Link>
            </li>
          )}
        </ul>

        <RotatingFeatured
          slides={slides}
          slidesLabel={tProducts("showcase.slidesAriaLabel")}
        />
      </div>

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
