import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import {
  FeaturedApplicationProduct,
  type FeaturedApplicationProductInput,
  type FeaturedApplicationProductSpec,
} from "@/components/applications/FeaturedApplicationProduct";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import type { MassFlowSpecs, Product } from "@/lib/types/product";
import { productBySlug } from "@/lib/fixtures/products";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildApplicationDetailMetadata } from "@/lib/seo";
import { sanityClient, sanityBuildClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { urlFor } from "@/sanity/imageUrl";
import {
  applicationBySlugQuery,
  applicationSlugsQuery,
} from "@/sanity/queries";
import "../applications-page.css";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

type SanityFeaturedProduct = {
  slug: string;
  model: string;
  series: Product["series"];
  productLabel?: Record<string, string> | null;
  description?: Record<string, string> | null;
  flowRange?: string | null;
  image?: { asset?: { _ref: string } } | null;
  cutout?: { asset?: { _ref: string } } | null;
};

type SanityApp = {
  slug: string;
  title: Record<string, string>;
  lede: Record<string, string>;
  body: Record<string, string>;
  recommendedSeries: string[];
  relatedCategories: string[];
  featuredProduct?: SanityFeaturedProduct | null;
};

export async function generateStaticParams() {
  const staticSlugs = [
    ...new Set(
      routing.locales.flatMap((l) =>
        LT_APPLICATIONS[l].applications.map((a) => a.slug),
      ),
    ),
  ];

  const sanitySlugs = await fetchSanity(
    () =>
      sanityBuildClient.fetch<Array<{ slug: string }>>(applicationSlugsQuery),
    { name: "applicationSlugsForStaticParams" },
  ).catch(() => [] as Array<{ slug: string }>);

  const allSlugs = [
    ...new Set([...staticSlugs, ...sanitySlugs.map((s) => s.slug)]),
  ];

  return routing.locales.flatMap((locale) =>
    allSlugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = await fetchSanity(
    () =>
      sanityClient.fetch<SanityApp | null>(applicationBySlugQuery, { slug }),
    { name: "applicationBySlug", params: { slug } },
  ).catch(() => null);
  const title =
    raw?.title?.[locale] ??
    raw?.title?.en ??
    LT_APPLICATIONS[locale].applications.find((a) => a.slug === slug)?.title;
  const lede =
    raw?.lede?.[locale] ??
    raw?.lede?.en ??
    LT_APPLICATIONS[locale].applications.find((a) => a.slug === slug)?.lede;
  if (!title) return {};
  return buildApplicationDetailMetadata(locale, slug, title, lede ?? "");
}

const CATEGORY_HREFS: Record<string, string> = {
  analogue: "/products/analogue",
  digital: "/products/digital",
  specialized: "/products/specialized",
  lepc: "/products/lepc",
};

const DEFAULT_FEATURED_SPEC_KEYS: ReadonlyArray<keyof MassFlowSpecs> = [
  "flowRange",
];

function resolveFeaturedProduct({
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

export default async function ApplicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tCategory, tSpecs] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
    getTranslations("product.specs"),
  ]);

  const c = LT_APPLICATIONS[locale];

  const rawApp = await fetchSanity(
    () =>
      sanityClient.fetch<SanityApp | null>(applicationBySlugQuery, { slug }),
    { name: "applicationBySlug", params: { slug } },
  ).catch(() => null);

  const staticEntry = c.applications.find((a) => a.slug === slug);

  const app = rawApp
    ? {
        slug: rawApp.slug,
        title: rawApp.title?.[locale] ?? rawApp.title?.en ?? "",
        lede: rawApp.lede?.[locale] ?? rawApp.lede?.en ?? "",
        body: (rawApp.body?.[locale] ?? rawApp.body?.en ?? "")
          .split(/\n\n+/)
          .filter(Boolean),
        recommendedSeries: rawApp.recommendedSeries ?? [],
        relatedCategories: (rawApp.relatedCategories ??
          []) as (typeof c.applications)[0]["relatedCategories"],
      }
    : staticEntry;

  if (!app) notFound();

  const featuredProduct = resolveFeaturedProduct({
    sanity: rawApp?.featuredProduct ?? null,
    staticSlug: staticEntry?.featuredProductSlug,
    locale,
    specKeys: staticEntry?.featuredSpecKeys ?? DEFAULT_FEATURED_SPEC_KEYS,
    getSpecLabel: (key) => tSpecs(key),
  });

  const featuredCaption = staticEntry?.featuredProductCaption ?? null;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("applications"), href: "/applications" },
    { label: app.title },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className="ap-detail">
        <div className="ap-detail__main">
          <header className="ap-detail__header">
            <h1 className="ap-detail__title">{app.title}</h1>
            <p className="ap-detail__lede">{app.lede}</p>
          </header>
          {featuredProduct ? (
            <FeaturedApplicationProduct
              product={featuredProduct}
              whyCaption={featuredCaption}
              kickerLabel={c.featuredKicker}
              whyHeadingLabel={c.featuredWhyHeading}
              viewProductLabel={c.featuredViewProduct}
            />
          ) : null}
          <div className="ap-detail__body">
            {app.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <aside className="ap-detail__sidebar">
          <div className="ap-sidebar-block">
            <div className="ap-sidebar-block__heading">{c.relatedHeading}</div>
            <ul className="ap-sidebar-block__list">
              {app.relatedCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={CATEGORY_HREFS[cat]}
                    className="ap-sidebar-block__link"
                  >
                    {tCategory(cat)}
                    <span className="ap-sidebar-block__link-series">
                      {app.recommendedSeries
                        .filter((s) => {
                          if (cat === "digital") return s === "MD";
                          if (cat === "specialized") return s === "EX";
                          if (cat === "lepc") return s === "LEPC";
                          return s === "M / MS";
                        })
                        .join(" / ") || app.recommendedSeries[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ap-sidebar-block ap-sidebar-block--cta">
            <Link href={c.contactCtaHref} className="ap-sidebar-block__cta">
              {c.contactCta}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
