import type { Metadata } from "next";
import { cache } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { permanentRedirect, Link } from "@/i18n/navigation";
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
import { RequestDocs } from "@/components/products/RequestDocs";
import { formatBytes, formatDate } from "@/lib/format";
import { sanityClient, sanityBuildClient } from "@/sanity/client";
import { urlFor } from "@/sanity/imageUrl";
import { fetchSanity } from "@/sanity/fetch";
import { productBySlugQuery, productSlugsQuery } from "@/sanity/queries";
import {
  CATEGORIES,
  categoryForSeries,
  isCategorySlug,
  type CategorySlug,
} from "@/lib/categories";
import { routing, type Locale } from "@/i18n/routing";
import { SanityProductSchema } from "@/lib/types/product";
import type { MassFlowSpecs, Product } from "@/lib/types/product";
import { buildProductMetadata, siteUrl } from "@/lib/seo";
import { safeJsonLd } from "@/lib/seo/jsonLd";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import { localizeSpecValue } from "@/lib/products/localizeSpecValue";
import { pickLocalized } from "@/lib/i18n/pickLocalized";
import "./product-detail.css";

export const revalidate = 3600;

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
      "pressureRange",
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

export async function generateStaticParams() {
  const products = await fetchSanity(
    () =>
      sanityBuildClient.fetch<
        Array<{ slug: string; series: Product["series"] }>
      >(productSlugsQuery),
    { name: "productSlugsForStaticParams" },
  );
  return routing.locales.flatMap((locale) =>
    products.map((p) => ({
      locale,
      category: categoryForSeries(p.series),
      product: p.slug,
    })),
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

  const [product, tCommon, tNav, tBreadcrumb, tSpecs, tPdp, tA11y] =
    await Promise.all([
      getProduct(productSlug),
      getTranslations("common"),
      getTranslations("nav"),
      getTranslations("breadcrumbs.categories"),
      getTranslations("product.specs"),
      getTranslations("pdp"),
      getTranslations("a11y"),
    ]);

  if (!product) notFound();
  if (product.series !== CATEGORIES[category].series) {
    permanentRedirect({
      href: `/products/${categoryForSeries(product.series)}/${product.slug.current}`,
      locale,
    });
  }

  const relatedApplications = LT_APPLICATIONS[locale].applications
    .filter((a) => a.relatedCategories.includes(category as CategorySlug))
    .slice(0, 4);

  const categoryLabel = tBreadcrumb(category);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: categoryLabel, href: `/products/${category}` },
    { label: product.model },
  ];

  const features = product.features.map((f) => f[locale] || f.en);
  const isROU = product.function === "ROU";
  const loc = (s: string) => localizeSpecValue(s, locale);

  type SpecRow = { key: string; label: string; value: string };
  const specGroups = isROU
    ? [
        {
          id: "instrument",
          num: "01",
          label: tPdp("tabs.specs"),
          rows: (product.instrumentSpecs ?? []).map((r) => ({
            key: r.label,
            label: r.label,
            value: r.value,
          })),
        },
      ]
    : SPEC_GROUPS.map((g) => ({
        id: g.id,
        num: g.num,
        label: tPdp(`specGroups.${g.id}`),
        rows: g.keys.flatMap<SpecRow>((k) => {
          const spec = product.massFlowSpecs?.[k];
          return spec
            ? [
                {
                  key: k,
                  label: tSpecs(k),
                  value: localizeSpecValue(spec.display, locale),
                },
              ]
            : [];
        }),
      }));

  // EPCs have pressureRange in place of flowRange — pick whichever exists
  // for the headline overview row.
  const headlineRange =
    product.massFlowSpecs?.flowRange ?? product.massFlowSpecs?.pressureRange;

  const overviewRows = isROU
    ? (product.instrumentSpecs ?? []).slice(0, 3).map((r) => ({
        feature: r.label,
        values: [r.value],
      }))
    : [
        {
          feature: features[0] ?? "",
          values: [
            loc(headlineRange!.display),
            loc(product.massFlowSpecs!.accuracy.display),
          ],
        },
        {
          feature: features[1] ?? "",
          values: product.massFlowSpecs?.responseTime
            ? [loc(product.massFlowSpecs.responseTime.display)]
            : [],
        },
        {
          feature: features[2] ?? "",
          values: product.massFlowSpecs?.maxPressure
            ? [loc(product.massFlowSpecs.maxPressure.display)]
            : [],
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
    ...product.datasheets
      .filter((d) => d.fileUrl)
      .map<DownloadItem>((d) => ({
        label: pickLocalized(
          d.displayName,
          locale,
          d.title || tPdp("downloads.datasheetFor", { model: product.model }),
        ),
        type: "PDF",
        href: d.fileUrl ?? undefined,
        size: formatBytes(d.size),
        rev: d.rev ?? undefined,
        date: formatDate(d.publishedAt ?? d.updatedAt, locale),
      })),
    ...product.manuals
      .filter((m) => m.fileUrl)
      .map<DownloadItem>((m) => ({
        label: pickLocalized(
          m.displayName,
          locale,
          m.title || tPdp("downloads.manualFor", { model: product.model }),
        ),
        type: "PDF",
        href: m.fileUrl ?? undefined,
        size: formatBytes(m.size),
        rev: m.rev ?? undefined,
        date: formatDate(m.publishedAt ?? m.updatedAt, locale),
      })),
    ...product.certifications
      .filter((c) => c.fileUrl)
      .map<DownloadItem>((c) => {
        const certName = pickLocalized(c.displayName, locale, c.name);
        const issuer = c.issuer?.[locale] ?? c.issuer?.en ?? null;
        return {
          label: issuer ? `${certName} — ${issuer}` : certName,
          type: "CERT",
          href: c.fileUrl ?? undefined,
          size: formatBytes(c.size),
          date: c.validThrough ?? "",
        };
      }),
    ...product.drawings.flatMap<DownloadItem>((d) => {
      const items: DownloadItem[] = [];
      const drawingTitle = pickLocalized(d.displayName, locale, d.title);
      if (d.pdfUrl) {
        items.push({
          label: drawingTitle,
          type: "PDF",
          href: d.pdfUrl,
          size: formatBytes(d.pdfSize),
          date: formatDate(d.updatedAt, locale),
        });
      }
      if (d.dwgUrl) {
        items.push({
          label: `${drawingTitle} (DWG)`,
          type: "DWG",
          href: d.dwgUrl,
          size: formatBytes(d.dwgSize),
          date: formatDate(d.updatedAt, locale),
        });
      }
      for (const v of d.stpVariants ?? []) {
        if (!v.url) continue;
        items.push({
          label: `${drawingTitle} (STEP · ${v.fitting})`,
          type: "STEP",
          href: v.url,
          size: formatBytes(v.size),
          date: formatDate(d.updatedAt, locale),
        });
      }
      return items;
    }),
  ];

  const tabs = [
    { id: "overview", num: "01", label: tPdp("tabs.overview") },
    { id: "specs", num: "02", label: tPdp("tabs.specs") },
    { id: "dimensions", num: "03", label: tPdp("tabs.dimensions") },
    {
      id: "downloads",
      num: "04",
      label:
        downloadItems.length > 0
          ? tPdp("tabs.downloads")
          : tPdp("requestDocs.kicker"),
    },
  ];

  const productUrl = `${siteUrl}/${locale}/products/${category}/${product.slug.current}`;
  const productLabel = product.productLabel[locale];

  const additionalProperties = isROU
    ? (product.instrumentSpecs ?? []).map((r) => ({
        "@type": "PropertyValue",
        name: r.label,
        value: r.value,
      }))
    : [
        ...(product.massFlowSpecs?.flowRange
          ? [
              {
                "@type": "PropertyValue",
                name: "Flow Range",
                value: product.massFlowSpecs.flowRange.display,
              },
            ]
          : []),
        ...(product.massFlowSpecs?.pressureRange
          ? [
              {
                "@type": "PropertyValue",
                name: "Pressure Range",
                value: product.massFlowSpecs.pressureRange.display,
              },
            ]
          : []),
        {
          "@type": "PropertyValue",
          name: "Accuracy",
          value: product.massFlowSpecs!.accuracy.display,
        },
        {
          "@type": "PropertyValue",
          name: "Repeatability",
          value: product.massFlowSpecs!.repeatability.display,
        },
        ...(product.massFlowSpecs?.responseTime
          ? [
              {
                "@type": "PropertyValue",
                name: "Response Time",
                value: product.massFlowSpecs.responseTime.display,
              },
            ]
          : []),
        ...(product.massFlowSpecs?.maxPressure
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
          value: product.massFlowSpecs!.ioSignal.display,
        },
        {
          "@type": "PropertyValue",
          name: "Supply Power",
          value: product.massFlowSpecs!.supplyPower.display,
        },
        {
          "@type": "PropertyValue",
          name: "Temperature Range",
          value: product.massFlowSpecs!.tempRange.display,
        },
        {
          "@type": "PropertyValue",
          name: "Leak Rate",
          value: product.massFlowSpecs!.leakRate.display,
        },
      ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Line Tech ${product.model} ${productLabel}`,
    model: product.model,
    sku: product.model,
    description: isROU
      ? productLabel
      : `${productLabel} — ${headlineRange!.display} ${product.massFlowSpecs?.pressureRange ? "pressure range" : "flow range"}, ${product.massFlowSpecs!.accuracy.display} accuracy`,
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
          cutoutUrl={
            product.cutout?.asset
              ? urlFor(product.cutout).width(960).url()
              : null
          }
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

        {downloadItems.length > 0 ? (
          <DownloadsList
            kicker={`04 — ${tPdp("tabs.downloads")}`}
            heading={tPdp("downloads.heading")}
            sub={tPdp("downloads.sub")}
            downloadLabel={tPdp("downloads.download")}
            doneLabel={tPdp("downloads.done")}
            items={downloadItems}
          />
        ) : (
          <RequestDocs
            kicker={`04 — ${tPdp("requestDocs.kicker")}`}
            heading={tPdp("requestDocs.heading")}
            body={tPdp("requestDocs.body")}
            ctaLabel={tPdp("requestDocs.cta")}
            ctaHref={`/contact?product=${encodeURIComponent(product.model)}`}
          />
        )}

        {relatedApplications.length > 0 && (
          <section className="pd-related-apps">
            <h2 className="pd-related-apps__heading">{tNav("applications")}</h2>
            <ul className="pd-related-apps__list">
              {relatedApplications.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/applications/${app.slug}`}
                    className="pd-related-apps__link"
                  >
                    <span className="pd-related-apps__title">{app.title}</span>
                    <span className="pd-related-apps__lede">{app.lede}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
