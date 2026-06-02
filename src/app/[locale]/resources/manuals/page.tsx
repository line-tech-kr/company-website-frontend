import { Fragment } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { formatISODate } from "@/lib/i18n/dates";
import { sanityClient } from "@/sanity/client";
import { allManualsQuery } from "@/sanity/queries";
import { routing, type Locale } from "@/i18n/routing";
import { buildResourcesMetadata } from "@/lib/seo";
import { pickLocalized, type LocalizedField } from "@/lib/i18n/pickLocalized";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type Series = "analogue" | "digital" | "specialized";
const SERIES_ORDER: Series[] = ["analogue", "digital", "specialized"];

type ManualItem = {
  _id: string;
  title: string;
  displayName?: LocalizedField;
  models?: string[] | null;
  series?: string | null;
  rev?: string | null;
  publishedAt?: string | null;
  fileUrl?: string | null;
};

function modelLabel(item: ManualItem): string | null {
  return item.models && item.models.length > 0 ? item.models.join(" / ") : null;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "manuals");
}

export default async function ManualsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, manuals] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch<ManualItem[]>(allManualsQuery),
  ]);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom"), href: "/resources" },
    { label: tRes("manuals.title") },
  ];

  const grouped = SERIES_ORDER.reduce<Record<string, typeof manuals>>(
    (acc, s) => {
      const items = manuals.filter((m) => m.series === s);
      if (items.length) acc[s] = items;
      return acc;
    },
    {},
  );

  const ungrouped = manuals.filter((m) => !m.series);

  const renderRow = (item: ManualItem) => {
    const label = pickLocalized(item.displayName, locale as Locale, item.title);
    return (
      <DocRow
        key={item._id}
        label={label}
        meta={[
          modelLabel(item),
          item.rev,
          item.publishedAt && formatISODate(item.publishedAt, locale),
        ]}
        action={
          item.fileUrl ? (
            <a href={item.fileUrl} download className="dr-list__btn">
              {tRes("download")}
            </a>
          ) : (
            <Link
              href={`/contact?topic=request&file=${encodeURIComponent(label)}`}
              className="dr-list__btn dr-list__btn--request"
            >
              {tRes("requestFile")}
            </Link>
          )
        }
      />
    );
  };

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("manuals.title")}</h1>
        <p className="dr-sub__intro">{tRes("manuals.intro")}</p>
      </header>

      {manuals.length === 0 ? (
        <EmptyState
          message={tRes("empty")}
          ctaHref="/contact?topic=request"
          ctaLabel={tRes("emptyStateCta")}
        />
      ) : (
        <ul className="dr-list" role="list">
          {SERIES_ORDER.filter((s) => grouped[s]).map((s) => (
            <Fragment key={s}>
              <li>
                <h2 className="dr-list__group-heading">
                  {tRes(`seriesLabel.${s}`)}
                </h2>
              </li>
              {grouped[s].map(renderRow)}
            </Fragment>
          ))}
          {ungrouped.map(renderRow)}
        </ul>
      )}
    </main>
  );
}
