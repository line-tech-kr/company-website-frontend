import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CategoryHero } from "@/components/products/CategoryHero";
import { ProductStack } from "@/components/products/ProductStack";
import { sanityClient } from "@/sanity/client";
import { productsBySeriesQuery } from "@/sanity/queries";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  isCategorySlug,
  type CategorySlug,
} from "@/lib/categories";
import { routing } from "@/i18n/routing";
import type { Product } from "@/lib/types/product";

type Props = { params: Promise<{ locale: string; category: string }> };

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
  const products = (await sanityClient.fetch(productsBySeriesQuery, {
    series: cat.series,
  })) as Product[];

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
    { label: tBreadcrumb(category as CategorySlug) },
  ];

  const headers = {
    model: tProducts("table.model"),
    description: tProducts("table.description"),
    range: tProducts("table.range"),
    accuracy: tProducts("table.accuracy"),
    response: tProducts("table.response"),
    fitting: tProducts("table.fitting"),
  };
  const viewLabel = tProducts("table.view");
  const emptyLabel = tProducts("emptyStack");
  const typedLocale = locale as "ko" | "en" | "zh";

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <CategoryHero
        kickerNum={cat.kickerNum}
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
        locale={typedLocale}
        emptyLabel={emptyLabel}
        viewLabel={viewLabel}
        headers={headers}
      />
      <ProductStack
        title={tProducts("stack.meters.title")}
        subtitle={tProducts("stack.meters.subtitle")}
        products={meters}
        category={category}
        locale={typedLocale}
        emptyLabel={emptyLabel}
        viewLabel={viewLabel}
        headers={headers}
      />
    </main>
  );
}
