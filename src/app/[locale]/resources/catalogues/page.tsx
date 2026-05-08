import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { DocRow } from "@/components/resources/DocRow";
import { formatISODate } from "@/lib/i18n/dates";
import { sanityClient } from "@/sanity/client";
import { allCataloguesQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "catalogues");
}

export default async function CataloguesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, catalogues] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch<CatalogueItem[]>(allCataloguesQuery),
  ]);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom"), href: "/resources" },
    { label: tRes("catalogues.title") },
  ];

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("catalogues.title")}</h1>
        <p className="dr-sub__intro">{tRes("catalogues.intro")}</p>
      </header>

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
    </main>
  );
}
