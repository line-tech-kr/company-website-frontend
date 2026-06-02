import { Fragment } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { ResourceSubpageShell } from "@/components/resources/ResourceSubpageShell";
import { formatLongDate } from "@/lib/i18n/dates";
import { sanityClient } from "@/sanity/client";
import { allManualsQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import {
  getResourceSubpageContext,
  resourceSubpageStaticParams,
  SERIES_ORDER,
} from "@/lib/pages/resourceSubpage";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type ManualItem = {
  _id: string;
  title: string;
  models?: string[] | null;
  series?: string | null;
  rev?: string | null;
  publishedAt?: string | null;
  fileUrl?: string | null;
};

function modelLabel(item: ManualItem): string | null {
  return item.models && item.models.length > 0 ? item.models.join(" / ") : null;
}

export const generateStaticParams = resourceSubpageStaticParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "manuals");
}

export default async function ManualsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [ctx, manuals] = await Promise.all([
    getResourceSubpageContext("manuals"),
    sanityClient.fetch<ManualItem[]>(allManualsQuery),
  ]);
  const { tRes, breadcrumbs, title, intro } = ctx;

  const grouped = SERIES_ORDER.reduce<Record<string, typeof manuals>>(
    (acc, s) => {
      const items = manuals.filter((m) => m.series === s);
      if (items.length) acc[s] = items;
      return acc;
    },
    {},
  );
  const ungrouped = manuals.filter((m) => !m.series);

  const renderRow = (item: ManualItem) => (
    <DocRow
      key={item._id}
      label={item.title}
      meta={[
        modelLabel(item),
        item.rev,
        item.publishedAt && formatLongDate(item.publishedAt, locale),
      ]}
      action={
        item.fileUrl ? (
          <a href={item.fileUrl} download className="dr-list__btn">
            {tRes("download")}
          </a>
        ) : (
          <Link
            href={`/contact?topic=request&file=${encodeURIComponent(item.title)}`}
            className="dr-list__btn dr-list__btn--request"
          >
            {tRes("requestFile")}
          </Link>
        )
      }
    />
  );

  return (
    <ResourceSubpageShell title={title} intro={intro} breadcrumbs={breadcrumbs}>
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
    </ResourceSubpageShell>
  );
}
