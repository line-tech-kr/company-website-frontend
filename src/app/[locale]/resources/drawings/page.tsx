import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/shared/EmptyState";
import { ResourceSubpageShell } from "@/components/resources/ResourceSubpageShell";
import { sanityClient } from "@/sanity/client";
import { allDrawingsQuery } from "@/sanity/queries";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import {
  getResourceSubpageContext,
  resourceSubpageStaticParams,
} from "@/lib/pages/resourceSubpage";
import "../resources-subpage.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

type StpVariant = {
  fitting: string;
  sortKey?: number | null;
  url?: string | null;
  size?: number | null;
};

type DrawingItem = {
  _id: string;
  title: string;
  models?: string[] | null;
  series?: string | null;
  dwgUrl?: string | null;
  dwgSize?: number | null;
  stpVariants?: StpVariant[] | null;
  pdfUrl?: string | null;
  pdfSize?: number | null;
};

export const generateStaticParams = resourceSubpageStaticParams;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "drawings");
}

export default async function DrawingsPage({ params }: Props) {
  const { locale } = await params;
  const [ctx, drawings] = await Promise.all([
    getResourceSubpageContext(locale, "drawings"),
    sanityClient.fetch<DrawingItem[]>(allDrawingsQuery),
  ]);
  const { tRes, breadcrumbs, title, intro } = ctx;

  return (
    <ResourceSubpageShell title={title} intro={intro} breadcrumbs={breadcrumbs}>
      {drawings.length === 0 ? (
        <EmptyState
          message={tRes("empty")}
          ctaHref="/contact?topic=request"
          ctaLabel={tRes("emptyStateCta")}
        />
      ) : (
        <table className="dr-drawings">
          <thead>
            <tr>
              <th>{tRes("drawingsTable.model")}</th>
              <th>{tRes("drawingsTable.series")}</th>
              <th>{tRes("drawingsTable.files")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {drawings.map((item) => {
              const modelLabel =
                item.models && item.models.length > 0
                  ? item.models.join(" / ")
                  : "—";
              const stpVariants = (item.stpVariants ?? []).filter(
                (v): v is StpVariant & { url: string } => Boolean(v.url),
              );
              const hasFile =
                item.pdfUrl || item.dwgUrl || stpVariants.length > 0;
              return (
                <tr key={item._id}>
                  <td>
                    <div className="dr-drawings__model">{modelLabel}</div>
                    <div className="dr-drawings__series">{item.title}</div>
                  </td>
                  <td>
                    {item.series && (
                      <span className="dr-drawings__series">
                        {tRes(
                          `seriesLabel.${item.series as "analogue" | "digital" | "specialized"}`,
                        )}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="dr-drawings__files">
                      {item.pdfUrl && (
                        <span className="dr-list__badge dr-list__badge--pdf">
                          PDF
                        </span>
                      )}
                      {item.dwgUrl && (
                        <span className="dr-list__badge dr-list__badge--dwg">
                          DWG
                        </span>
                      )}
                      {stpVariants.length > 0 && (
                        <span className="dr-list__badge dr-list__badge--stp">
                          {stpVariants.length === 1
                            ? "STP"
                            : `STP × ${stpVariants.length}`}
                        </span>
                      )}
                      {!hasFile && <span className="dr-list__badge">—</span>}
                    </div>
                  </td>
                  <td>
                    <div className="dr-drawings__actions">
                      {item.pdfUrl && (
                        <a href={item.pdfUrl} download className="dr-list__btn">
                          PDF
                        </a>
                      )}
                      {item.dwgUrl && (
                        <a href={item.dwgUrl} download className="dr-list__btn">
                          DWG
                        </a>
                      )}
                      {stpVariants.map((v) => (
                        <a
                          key={`${item._id}-${v.fitting}`}
                          href={v.url}
                          download
                          className="dr-list__btn"
                          title={`STEP · ${v.fitting}`}
                        >
                          {`STP · ${v.fitting}`}
                        </a>
                      ))}
                      {!hasFile && (
                        <Link
                          href={`/contact?topic=request&file=${encodeURIComponent(item.title)}`}
                          className="dr-list__btn dr-list__btn--request"
                        >
                          {tRes("requestFile")}
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </ResourceSubpageShell>
  );
}
