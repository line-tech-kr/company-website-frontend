import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { ResourceSubpageShell } from "@/components/resources/ResourceSubpageShell";
import { formatISODate } from "@/lib/i18n/dates";
import { sanityClient } from "@/sanity/client";
import { allCataloguesQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import {
  getResourceSubpageContext,
  resourceSubpageStaticParams,
} from "@/lib/pages/resourceSubpage";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type CatalogueItem = {
  _id: string;
  title: string;
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
  const [ctx, catalogues] = await Promise.all([
    getResourceSubpageContext(locale, "catalogues"),
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
          {catalogues.map((item) => (
            <DocRow
              key={item._id}
              label={item.title}
              meta={[
                item.series &&
                  tRes(
                    `seriesLabel.${item.series as "all" | "analogue" | "digital" | "specialized"}`,
                  ),
                item.publishedAt && formatISODate(item.publishedAt, locale),
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
          ))}
        </ul>
      )}
    </ResourceSubpageShell>
  );
}
