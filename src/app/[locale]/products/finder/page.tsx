import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allProductsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { buildFinderMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/content/home";
import {
  ProductFinder,
  type ProductFinderInitial,
} from "@/components/finder/ProductFinder";
import "./finder-page.css";
import type {
  FinderFunction,
  FinderSeries,
  FinderUnit,
} from "@/lib/finder/match";

export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildFinderMetadata(locale as Locale);
}

const FUNCTIONS: ReadonlySet<FinderFunction> = new Set([
  "any",
  "MFC",
  "MFM",
  "EPC",
]);
const SERIES: ReadonlySet<FinderSeries> = new Set([
  "any",
  "analogue",
  "digital",
  "specialized",
  "lepc",
]);
const UNITS: ReadonlySet<FinderUnit> = new Set(["slpm", "sccm"]);

function pickString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parseInitial(
  raw: Record<string, string | string[] | undefined>,
): ProductFinderInitial {
  const initial: ProductFinderInitial = {};
  const fn = pickString(raw.fn);
  if (fn && FUNCTIONS.has(fn as FinderFunction)) {
    initial.fn = fn as FinderFunction;
  }
  const gas = pickString(raw.gas);
  if (gas) initial.gas = gas;
  const flow = pickString(raw.flow);
  if (flow) {
    const n = Number(flow);
    if (Number.isFinite(n) && n > 0) initial.flow = n;
  }
  const unit = pickString(raw.unit);
  if (unit && UNITS.has(unit as FinderUnit)) {
    initial.unit = unit as FinderUnit;
  }
  const series = pickString(raw.series);
  if (series && SERIES.has(series as FinderSeries)) {
    initial.series = series as FinderSeries;
  }
  return initial;
}

export default async function ProductFinderPage({
  params,
  searchParams,
}: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const initial = parseInitial(await searchParams);

  const [tCommon, tNav, tFinder] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("productFinder"),
  ]);

  // Use safeParse per row so a single malformed Sanity document (e.g. an
  // accessory accidentally typed as a product) doesn't take the whole page
  // down. The finder needs flow specs, so anything that fails the schema
  // is not findable anyway.
  const rawProducts = await sanityClient.fetch(allProductsQuery);
  const products = (rawProducts as unknown[]).flatMap((row) => {
    const parsed = SanityProductSchema.safeParse(row);
    return parsed.success ? [parsed.data] : [];
  });

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: tFinder("breadcrumb") },
  ];

  return (
    <main className="lt-wrap lt-finder-page">
      <Breadcrumbs items={breadcrumbs} />
      <header className="lt-finder-page__intro">
        <h1 className="lt-finder-page__title">{tFinder("heading")}</h1>
        <p className="lt-finder-page__lede">{tFinder("lede")}</p>
      </header>
      <ProductFinder
        products={products}
        locale={locale as Locale}
        initial={initial}
      />
    </main>
  );
}
