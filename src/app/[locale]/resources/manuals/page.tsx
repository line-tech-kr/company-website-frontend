import { Fragment } from "react";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allManualsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import "../resources-subpage.css";

type Props = { params: Promise<{ locale: string }> };

type Series = "analogue" | "digital" | "specialized";
const SERIES_ORDER: Series[] = ["analogue", "digital", "specialized"];

type ManualItem = {
  _id: string;
  title: string;
  model?: string | null;
  series?: string | null;
  rev?: string | null;
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
    title: `${t("manuals.title")} — Line Tech`,
    description: t("manuals.intro"),
  };
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

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("manuals.title")}</h1>
        <p className="dr-sub__intro">{tRes("manuals.intro")}</p>
      </header>

      {manuals.length === 0 ? (
        <p style={{ color: "var(--pd-muted)" }}>{tRes("empty")}</p>
      ) : (
        <ul className="dr-list" role="list">
          {SERIES_ORDER.filter((s) => grouped[s]).map((s) => (
            <Fragment key={s}>
              <li>
                <h2 className="dr-list__group-heading">
                  {tRes(`seriesLabel.${s}`)}
                </h2>
              </li>
              {grouped[s].map((item) => (
                <li key={item._id} className="dr-list__row">
                  <span className="dr-list__badge dr-list__badge--pdf">
                    PDF
                  </span>
                  <div>
                    <div className="dr-list__label">{item.title}</div>
                    {(item.model || item.rev || item.publishedAt) && (
                      <div className="dr-list__meta">
                        {item.model && <span>{item.model}</span>}
                        {item.model && (item.rev || item.publishedAt) && (
                          <span className="dr-list__sep">·</span>
                        )}
                        {item.rev && <span>{item.rev}</span>}
                        {item.rev && item.publishedAt && (
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
            </Fragment>
          ))}
          {ungrouped.map((item) => (
            <li key={item._id} className="dr-list__row">
              <span className="dr-list__badge dr-list__badge--pdf">PDF</span>
              <div>
                <div className="dr-list__label">{item.title}</div>
                {(item.model || item.rev) && (
                  <div className="dr-list__meta">
                    {item.model && <span>{item.model}</span>}
                    {item.model && item.rev && (
                      <span className="dr-list__sep">·</span>
                    )}
                    {item.rev && <span>{item.rev}</span>}
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
