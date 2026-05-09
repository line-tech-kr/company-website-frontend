import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { CategoryHero } from "@/components/products/CategoryHero";
import { CategoryShowcase } from "@/components/products/CategoryShowcase";
import { ProductStack } from "@/components/products/ProductStack";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productsBySeriesQuery, categoryShowcaseQuery } from "@/sanity/queries";
import { CATEGORIES, CATEGORY_SLUGS, isCategorySlug } from "@/lib/categories";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { SanityProductSchema } from "@/lib/types/product";
import { CategoryShowcaseSchema } from "@/lib/types/showcase";
import { urlFor } from "@/sanity/imageUrl";
import { z } from "zod";
import { buildCategoryMetadata } from "@/lib/seo";
import { localizeSpecValue } from "@/lib/products/localizeSpecValue";

export const revalidate = 3600;

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

  const [productsRaw, showcaseRaw] = await Promise.all([
    fetchSanity(
      () => sanityClient.fetch(productsBySeriesQuery, { series: cat.series }),
      { name: "productsBySeries", params: { series: cat.series } },
    ),
    fetchSanity(() => sanityClient.fetch(categoryShowcaseQuery), {
      name: "categoryShowcase",
    }),
  ]);

  const products = z.array(SanityProductSchema).parse(productsRaw);
  const showcase = CategoryShowcaseSchema.nullable().parse(showcaseRaw ?? null);
  const featuredEntries = showcase?.[category] ?? [];
  const showcaseProducts = featuredEntries.map((e) => ({
    slug: e.slug,
    model: e.model,
    caption: e.caption,
    function: e.function,
    flowRange: e.flowRange ? localizeSpecValue(e.flowRange, locale) : null,
    accuracy: e.accuracy ? localizeSpecValue(e.accuracy, locale) : null,
    image: e.cutout?.asset
      ? urlFor(e.cutout).width(960).url()
      : e.image?.asset
        ? urlFor(e.image).width(960).url()
        : "/products/lti/placeholder.svg",
    href: `/${locale}/products/${category}/${e.slug}`,
  }));

  const [tCommon, tNav, tBreadcrumb, tProducts] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
    getTranslations("products"),
  ]);

  // EPC (Electronic Pressure Controller — currently only LEPC) joins the
  // flow controllers in the Controllers stack. Catalog convention.
  const controllers = products.filter(
    (p) => p.function === "MFC" || p.function === "EPC",
  );
  const meters = products.filter((p) => p.function === "MFM");
  const instruments = products.filter((p) => p.function === "ROU");

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

  return (
    <>
      <main className="lt-wrap">
        <Breadcrumbs items={breadcrumbs} />
        {showcaseProducts.length > 0 ? (
          <CategoryShowcase
            products={showcaseProducts}
            viewLabel={tProducts("showcase.viewProduct")}
            sectionLabel={tProducts("showcase.sectionLabel")}
            modelLabel={tProducts("showcase.modelLabel")}
            functionLabel={tProducts("showcase.functionLabel")}
            flowRangeLabel={tProducts("table.range")}
            accuracyLabel={tProducts("table.accuracy")}
            highlightLabel={tProducts("showcase.highlightLabel")}
            slidesLabel={tProducts("showcase.slidesLabel")}
            slidesAriaLabel={tProducts("showcase.slidesAriaLabel")}
            slideAriaLabels={showcaseProducts.map((_, i) =>
              tProducts("showcase.slideAriaLabel", { n: i + 1 }),
            )}
            heroKickerLabel={tProducts("kicker")}
            heroTitle={tProducts(`categories.${category}.title`)}
            heroCode={cat.code}
            heroLede={tProducts(`categories.${category}.lede`)}
          />
        ) : (
          <CategoryHero
            kickerLabel={tProducts("kicker")}
            title={tProducts(`categories.${category}.title`)}
            code={cat.code}
            lede={tProducts(`categories.${category}.lede`)}
          />
        )}
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
        {instruments.length > 0 && (
          <ProductStack
            title={tProducts("stack.instruments.title")}
            subtitle={tProducts("stack.instruments.subtitle")}
            products={instruments}
            category={category}
            locale={locale}
            emptyLabel={emptyLabel}
            headers={headers}
          />
        )}
      </main>
    </>
  );
}
