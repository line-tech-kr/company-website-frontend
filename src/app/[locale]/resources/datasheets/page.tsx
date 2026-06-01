import { Fragment } from "react";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { ResourceSubpageShell } from "@/components/resources/ResourceSubpageShell";
import { sanityClient } from "@/sanity/client";
import { allDatasheetsQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import {
  getResourceSubpageContext,
  resourceSubpageStaticParams,
} from "@/lib/pages/resourceSubpage";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type Series = "analogue" | "digital" | "specialized";
const SERIES_ORDER: Series[] = ["analogue", "digital", "specialized"];

type DatasheetItem = {
  _id: string;
  title: string;
  models?: string[] | null;
  series?: string | null;
  rev?: string | null;
  publishedAt?: string | null;
  fileUrl?: string | null;
};

function modelLabel(item: DatasheetItem): string | null {
  return item.models && item.models.length > 0 ? item.models.join(" / ") : null;
}

export const generateStaticParams = resourceSubpageStaticParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "datasheets");
}

export default async function DatasheetsPage({ params }: Props) {
  const { locale } = await params;
  const [ctx, datasheets] = await Promise.all([
    getResourceSubpageContext(locale, "datasheets"),
    sanityClient.fetch<DatasheetItem[]>(allDatasheetsQuery),
  ]);
  const { tRes, breadcrumbs, title, intro } = ctx;

  const grouped = SERIES_ORDER.reduce<Record<string, typeof datasheets>>(
    (acc, s) => {
      const items = datasheets.filter((d) => d.series === s);
      if (items.length) acc[s] = items;
      return acc;
    },
    {},
  );
  const ungrouped = datasheets.filter((d) => !d.series);

  const renderRow = (item: DatasheetItem) => (
    <DocRow
      key={item._id}
      label={item.title}
      meta={[modelLabel(item), item.rev, item.publishedAt]}
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
      {datasheets.length === 0 ? (
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
