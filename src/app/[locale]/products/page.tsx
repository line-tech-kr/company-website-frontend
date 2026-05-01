import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { CategoryHero } from "@/components/products/CategoryHero";
import { ProductStack } from "@/components/products/ProductStack";
import { sanityClient } from "@/sanity/client";
import { allProductsQuery } from "@/sanity/queries";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  categoryForSeries,
  type CategorySlug,
} from "@/lib/categories";
import { SanityProductSchema } from "@/lib/types/product";
import type { Product } from "@/lib/types/product";
import { z } from "zod";
import "./products-list.css";

type Props = { params: Promise<{ locale: string }> };

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
  const typedLocale = locale as "ko" | "en" | "zh";

  const grouped = new Map<CategorySlug, Product[]>(
    CATEGORY_SLUGS.map((slug) => [slug, []]),
  );
  for (const p of products) {
    const slug = categoryForSeries(p.series);
    if (slug) grouped.get(slug)!.push(p);
  }

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products") },
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
    <main className="lt-wrap lt-products-list">
      <Breadcrumbs items={breadcrumbs} />

      <header className="lt-products-list__intro">
        <h1 className="lt-products-list__title">{tProducts("list.title")}</h1>
        <p className="lt-products-list__lede">
          {tProducts("list.intro", { count: products.length })}
        </p>
      </header>

      {CATEGORY_SLUGS.map((slug) => {
        const cat = CATEGORIES[slug];
        const items = grouped.get(slug)!;
        if (items.length === 0) return null;
        const controllers = items.filter((p) => p.function === "MFC");
        const meters = items.filter((p) => p.function === "MFM");
        return (
          <section key={slug} className="lt-products-list__section">
            <CategoryHero
              kickerNum={cat.kickerNum}
              kickerLabel={tProducts("kicker")}
              title={tProducts(`categories.${slug}.title`)}
              code={cat.code}
              lede={tProducts(`categories.${slug}.lede`)}
            />
            <ProductStack
              title={tProducts("stack.controllers.title")}
              subtitle={tProducts("stack.controllers.subtitle")}
              products={controllers}
              category={slug}
              locale={typedLocale}
              emptyLabel={emptyLabel}
              headers={headers}
            />
            <ProductStack
              title={tProducts("stack.meters.title")}
              subtitle={tProducts("stack.meters.subtitle")}
              products={meters}
              category={slug}
              locale={typedLocale}
              emptyLabel={emptyLabel}
              headers={headers}
            />
          </section>
        );
      })}
    </main>
  );
}
