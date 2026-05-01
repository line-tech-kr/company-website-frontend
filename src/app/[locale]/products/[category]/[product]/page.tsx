import type { Metadata } from "next";
import { cache } from "react";
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
import type { MassFlowSpecs, Product } from "@/lib/types/product";
import { buildProductMetadata, siteUrl } from "@/lib/seo";
import { safeJsonLd } from "@/lib/seo/jsonLd";

type Props = {
  params: Promise<{ locale: Locale; category: string; product: string }>;
};

const getProduct = cache(async (slug: string) => {
  const raw = await fetchSanity(
    () => sanityClient.fetch(productBySlugQuery, { slug }),
    { name: "productBySlug", params: { slug } },
  );
  return raw ? SanityProductSchema.parse(raw) : null;
});

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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category, product: productSlug } = await params;
  if (!isCategorySlug(category)) return {};
  const product = await getProduct(productSlug);
  if (!product) return {};
  return buildProductMetadata(locale, product, category);
}

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

  const product = await getProduct(productSlug);

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

  const productUrl = `${siteUrl}/${locale}/products/${category}/${product.slug.current}`;
  const productLabel = product.productLabel[locale];

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
        name: categoryLabel,
        item: `${siteUrl}/${locale}/products/${category}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.model,
        item: productUrl,
      },
    ],
  };

  const additionalProperties = [
    {
      "@type": "PropertyValue",
      name: "Flow Range",
      value: product.massFlowSpecs.flowRange.display,
    },
    {
      "@type": "PropertyValue",
      name: "Accuracy",
      value: product.massFlowSpecs.accuracy.display,
    },
    {
      "@type": "PropertyValue",
      name: "Repeatability",
      value: product.massFlowSpecs.repeatability.display,
    },
    ...(product.massFlowSpecs.responseTime
      ? [
          {
            "@type": "PropertyValue",
            name: "Response Time",
            value: product.massFlowSpecs.responseTime.display,
          },
        ]
      : []),
    ...(product.massFlowSpecs.maxPressure
      ? [
          {
            "@type": "PropertyValue",
            name: "Max Pressure",
            value: product.massFlowSpecs.maxPressure.display,
          },
        ]
      : []),
    {
      "@type": "PropertyValue",
      name: "I/O Signal",
      value: product.massFlowSpecs.ioSignal.display,
    },
    {
      "@type": "PropertyValue",
      name: "Supply Power",
      value: product.massFlowSpecs.supplyPower.display,
    },
    {
      "@type": "PropertyValue",
      name: "Temperature Range",
      value: product.massFlowSpecs.tempRange.display,
    },
    {
      "@type": "PropertyValue",
      name: "Leak Rate",
      value: product.massFlowSpecs.leakRate.display,
    },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Line Tech ${product.model} ${productLabel}`,
    model: product.model,
    sku: product.model,
    description: `${productLabel} — ${product.massFlowSpecs.flowRange.display} flow range, ${product.massFlowSpecs.accuracy.display} accuracy`,
    brand: {
      "@type": "Brand",
      name: "Line Tech",
    },
    manufacturer: {
      "@type": "Organization",
      name: "라인테크 / Line Tech Inc.",
      url: siteUrl,
    },
    url: productUrl,
    additionalProperty: additionalProperties,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(productJsonLd) }}
      />
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
    </>
  );
}
