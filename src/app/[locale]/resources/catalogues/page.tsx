import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { ResourceSubpageShell } from "@/components/resources/ResourceSubpageShell";
import { formatLongDate } from "@/lib/i18n/dates";
import { sanityClient } from "@/sanity/client";
import { allCataloguesQuery } from "@/sanity/queries";
import { type Locale } from "@/i18n/routing";
import { buildResourcesMetadata } from "@/lib/seo";
import {
  getResourceSubpageContext,
  resourceSubpageStaticParams,
} from "@/lib/pages/resourceSubpage";
import { pickLocalized, type LocalizedField } from "@/lib/i18n/pickLocalized";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type CatalogueItem = {
  _id: string;
  title: string;
  displayName?: LocalizedField;
  series?: string | null;
  publishedAt?: string | null;
  fileUrl?: string | null;
};

export const generateStaticParams = resourceSubpageStaticParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "catalogues");
}

export default async function CataloguesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const lang = locale as Locale;
  const [ctx, catalogues] = await Promise.all([
    getResourceSubpageContext("catalogues"),
    sanityClient.fetch<CatalogueItem[]>(allCataloguesQuery),
  ]);
  const { tRes, breadcrumbs, title, intro } = ctx;

  return (
    <ResourceSubpageShell title={title} intro={intro} breadcrumbs={breadcrumbs}>
      {catalogues.length === 0 ? (
        <EmptyState
          message={tRes("empty")}
          ctaHref="/contact?topic=request"
          ctaLabel={tRes("emptyStateCta")}
        />
      ) : (
        <ul className="dr-list" role="list">
          {catalogues.map((item) => {
            const label = pickLocalized(item.displayName, lang, item.title);
            return (
              <DocRow
                key={item._id}
                label={label}
                meta={[
                  item.series &&
                    tRes(
                      `seriesLabel.${item.series as "all" | "analogue" | "digital" | "specialized"}`,
                    ),
                  item.publishedAt && formatLongDate(item.publishedAt, locale),
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
          })}
        </ul>
      )}
    </ResourceSubpageShell>
  );
}
