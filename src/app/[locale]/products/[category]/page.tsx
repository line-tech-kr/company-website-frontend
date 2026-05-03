import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { CategoryHero } from "@/components/products/CategoryHero";
import { ProductStack } from "@/components/products/ProductStack";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productsBySeriesQuery } from "@/sanity/queries";
import { CATEGORIES, CATEGORY_SLUGS, isCategorySlug } from "@/lib/categories";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { SanityProductSchema } from "@/lib/types/product";
import { z } from "zod";
import { buildCategoryMetadata, siteUrl } from "@/lib/seo";
import { safeJsonLd } from "@/lib/seo/jsonLd";

type Props = { params: Promise<{ locale: Locale; category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isCategorySlug(category)) return {};
  return buildCategoryMetadata(locale, category);
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATEGORY_SLUGS.map((category) => ({ locale, category })),
  );
}

export default async function CategoryPage({ params }: Props) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  if (!isCategorySlug(category)) notFound();

  const cat = CATEGORIES[category];
  const products = z
    .array(SanityProductSchema)
    .parse(
      await fetchSanity(
        () => sanityClient.fetch(productsBySeriesQuery, { series: cat.series }),
        { name: "productsBySeries", params: { series: cat.series } },
      ),
    );

  const [tCommon, tNav, tBreadcrumb, tProducts] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
    getTranslations("products"),
  ]);

  const controllers = products.filter((p) => p.function === "MFC");
  const meters = products.filter((p) => p.function === "MFM");

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: tBreadcrumb(category) },
  ];

  const headers = {
    model: tProducts("table.model"),
    description: tProducts("table.description"),
    range: tProducts("table.range"),
    accuracy: tProducts("table.accuracy"),
    response: tProducts("table.response"),
    fitting: tProducts("table.fitting"),
  };
  const emptyLabel = tProducts("emptyStack");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tCommon("home"),
        item: `${siteUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tNav("products"),
        item: `${siteUrl}/${locale}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: tBreadcrumb(category),
        item: `${siteUrl}/${locale}/products/${category}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <main className="lt-wrap">
        <Breadcrumbs items={breadcrumbs} />
        <CategoryHero
          kickerLabel={tProducts("kicker")}
          title={tProducts(`categories.${category}.title`)}
          code={cat.code}
          lede={tProducts(`categories.${category}.lede`)}
        />
        <ProductStack
          title={tProducts("stack.controllers.title")}
          subtitle={tProducts("stack.controllers.subtitle")}
          products={controllers}
          category={category}
          locale={locale}
          emptyLabel={emptyLabel}
          headers={headers}
        />
        <ProductStack
          title={tProducts("stack.meters.title")}
          subtitle={tProducts("stack.meters.subtitle")}
          products={meters}
          category={category}
          locale={locale}
          emptyLabel={emptyLabel}
          headers={headers}
        />
      </main>
    </>
  );
}
