import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allCataloguesQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
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
  const t = await getTranslations({ locale, namespace: "resources" });
  return {
    title: `${t("catalogues.title")} — Line Tech`,
    description: t("catalogues.intro"),
  };
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
        <p style={{ color: "var(--pd-muted)" }}>{tRes("empty")}</p>
      ) : (
        <ul className="dr-list" role="list">
          {catalogues.map((item) => (
            <li key={item._id} className="dr-list__row">
              <span className="dr-list__badge dr-list__badge--pdf">PDF</span>
              <div>
                <div className="dr-list__label">{item.title}</div>
                {(item.series || item.publishedAt) && (
                  <div className="dr-list__meta">
                    {item.series && (
                      <span>
                        {tRes(
                          `seriesLabel.${item.series as "all" | "analogue" | "digital" | "specialized"}`,
                        )}
                      </span>
                    )}
                    {item.series && item.publishedAt && (
                      <span className="dr-list__sep">·</span>
                    )}
                    {item.publishedAt && <span>{item.publishedAt}</span>}
                  </div>
                )}
              </div>
              {item.fileUrl ? (
                <a href={item.fileUrl} download className="dr-list__btn">
                  {tRes("download")}
                </a>
              ) : (
                <span className="dr-list__btn dr-list__btn--disabled">
                  {tRes("comingSoon")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
