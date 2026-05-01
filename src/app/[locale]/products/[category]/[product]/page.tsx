import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { permanentRedirect } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { ProductHero } from "@/components/products/ProductHero";
import { TabNav } from "@/components/products/TabNav";
import { Overview } from "@/components/products/Overview";
import { SpecTable } from "@/components/products/SpecTable";
import {
  DimensionDrawing,
  type Callout,
} from "@/components/products/DimensionDrawing";
import {
  DownloadsList,
  type DownloadItem,
} from "@/components/products/DownloadsList";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productBySlugQuery } from "@/sanity/queries";
import { ALL_PRODUCTS } from "@/lib/fixtures/products";
import {
  CATEGORIES,
  categoryForSeries,
  isCategorySlug,
  type CategorySlug,
} from "@/lib/categories";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { SanityProductSchema } from "@/lib/types/product";
import type { MassFlowSpecs } from "@/lib/types/product";
import { z } from "zod";

type Props = {
  params: Promise<{ locale: Locale; category: string; product: string }>;
};

const SPEC_GROUPS: Array<{
  id: string;
  num: string;
  keys: Array<keyof MassFlowSpecs>;
}> = [
  {
    id: "performance",
    num: "01",
    keys: [
      "flowRange",
      "responseTime",
      "accuracy",
      "repeatability",
      "controlRange",
    ],
  },
  { id: "signal", num: "02", keys: ["ioSignal", "supplyPower"] },
  {
    id: "environment",
    num: "03",
    keys: ["maxPressure", "tempRange", "leakRate"],
  },
];

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ALL_PRODUCTS.flatMap((p) => {
      const category = categoryForSeries(p.series);
      if (!category) return [];
      return [{ locale, category, product: p.slug.current }];
    }),
  );
}

const M3030VA_CALLOUT_VALUES: Record<string, string> = {
  A: "28.0",
  B: "115.5",
  C: "123.0",
  D: "88.9",
  E: "M4 × 2",
};

export default async function ProductPage({ params }: Props) {
  const { locale, category, product: productSlug } = await params;
  setRequestLocale(locale);

  if (!isCategorySlug(category)) notFound();

  const _rawProduct = await fetchSanity(
    () => sanityClient.fetch(productBySlugQuery, { slug: productSlug }),
    { name: "productBySlug", params: { slug: productSlug } },
  );
  const product = _rawProduct ? SanityProductSchema.parse(_rawProduct) : null;

  if (!product) notFound();
  if (product.series !== CATEGORIES[category].series) {
    const canonicalCategory = categoryForSeries(product.series);
    if (canonicalCategory) {
      permanentRedirect({
        href: `/products/${canonicalCategory}/${product.slug.current}`,
        locale,
      });
    }
    notFound();
  }

  const [tCommon, tNav, tBreadcrumb, tSpecs, tPdp, tA11y] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
    getTranslations("product.specs"),
    getTranslations("pdp"),
    getTranslations("a11y"),
  ]);

  const categoryLabel = tBreadcrumb(category);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: categoryLabel, href: `/products/${category}` },
    { label: product.model },
  ];

  const tabs = [
    { id: "overview", num: "01", label: tPdp("tabs.overview") },
    { id: "specs", num: "02", label: tPdp("tabs.specs") },
    { id: "dimensions", num: "03", label: tPdp("tabs.dimensions") },
    { id: "downloads", num: "04", label: tPdp("tabs.downloads") },
  ];

  type SpecRow = { key: string; label: string; value: string };
  const specGroups = SPEC_GROUPS.map((g) => ({
    id: g.id,
    num: g.num,
    label: tPdp(`specGroups.${g.id}`),
    rows: g.keys.flatMap<SpecRow>((k) => {
      const spec = product.massFlowSpecs[k];
      return spec ? [{ key: k, label: tSpecs(k), value: spec.display }] : [];
    }),
  }));

  const features = product.features.map((f) => f[locale]);
  const specs = product.massFlowSpecs;
  const overviewRows = [
    {
      feature: features[0] ?? "",
      values: [specs.flowRange.display, specs.accuracy.display],
    },
    {
      feature: features[1] ?? "",
      values: specs.responseTime ? [specs.responseTime.display] : [],
    },
    {
      feature: features[2] ?? "",
      values: specs.maxPressure ? [specs.maxPressure.display] : [],
    },
  ].filter((r) => r.feature);

  const isM3030VA = product.slug.current === "m3030va";
  const dimensionCallouts: Callout[] | null = isM3030VA
    ? (["A", "B", "C", "D", "E"] as const).map((id) => ({
        id,
        label: tPdp(`dimensions.callouts.${id}`),
        value: M3030VA_CALLOUT_VALUES[id],
      }))
    : null;

  const downloadItems: DownloadItem[] = [
    {
      label: tPdp("downloads.placeholders.datasheet", { model: product.model }),
      type: "PDF",
      size: "—",
      rev: tPdp("downloads.placeholders.rev"),
      date: tPdp("downloads.placeholders.tbd"),
    },
    {
      label: tPdp("downloads.placeholders.manual", { model: product.model }),
      type: "PDF",
      size: "—",
      rev: tPdp("downloads.placeholders.rev"),
      date: tPdp("downloads.placeholders.tbd"),
    },
    {
      label: tPdp("downloads.placeholders.cad", { model: product.model }),
      type: "DWG",
      size: "—",
      rev: tPdp("downloads.placeholders.rev"),
      date: tPdp("downloads.placeholders.tbd"),
    },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />

      <ProductHero
        product={product}
        locale={locale}
        categoryLabel={categoryLabel}
        quoteLabel={tPdp("ctas.quote")}
        specsLabel={tPdp("ctas.viewSpecs")}
      />

      <TabNav tabs={tabs} ariaLabel={tA11y("sectionNav")} />

      <Overview
        kicker={`01 — ${tPdp("tabs.overview")}`}
        heading={tPdp("overview.heading")}
        sub={tPdp("overview.sub")}
        rows={overviewRows}
        tone="primary"
      />

      <SpecTable
        kicker={`02 — ${tPdp("tabs.specs")}`}
        heading={tPdp("specs.heading")}
        sub={tPdp("specs.sub")}
        copyLabel={tPdp("specs.copy")}
        copiedLabel={tPdp("specs.copied")}
        modelName={product.model}
        groups={specGroups}
      />

      {dimensionCallouts && (
        <DimensionDrawing
          kicker={`03 — ${tPdp("tabs.dimensions")}`}
          heading={tPdp("dimensions.heading")}
          sub={tPdp("dimensions.sub")}
          caption={tPdp("dimensions.caption")}
          note={tPdp("dimensions.note")}
          drawingNumber={`LT-${product.model}-OUT`}
          callouts={dimensionCallouts}
          calloutsAriaLabel={tA11y("dimensionCallouts")}
        />
      )}

      <DownloadsList
        kicker={`04 — ${tPdp("tabs.downloads")}`}
        heading={tPdp("downloads.heading")}
        sub={tPdp("downloads.sub")}
        downloadLabel={tPdp("downloads.download")}
        doneLabel={tPdp("downloads.done")}
        items={downloadItems}
      />
    </main>
  );
}
