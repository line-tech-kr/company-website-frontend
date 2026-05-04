import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allDrawingsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import "../resources-subpage.css";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return {
    title: `${t("drawings.title")} — Line Tech`,
    description: t("drawings.intro"),
  };
}

export default async function DrawingsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, drawings] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch(allDrawingsQuery),
  ]);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom"), href: "/resources" },
    { label: tRes("drawings.title") },
  ];

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("drawings.title")}</h1>
        <p className="dr-sub__intro">{tRes("drawings.intro")}</p>
      </header>

      {drawings.length === 0 ? (
        <p style={{ color: "var(--pd-muted)" }}>{tRes("empty")}</p>
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
            {drawings.map((item) => (
              <tr key={item._id}>
                <td>
                  <div className="dr-drawings__model">{item.model}</div>
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
                    {item.dwgUrl && (
                      <span className="dr-list__badge dr-list__badge--dwg">
                        DWG
                      </span>
                    )}
                    {item.stpUrl && (
                      <span className="dr-list__badge dr-list__badge--stp">
                        STP
                      </span>
                    )}
                    {!item.dwgUrl && !item.stpUrl && (
                      <span className="dr-list__badge">—</span>
                    )}
                  </div>
                </td>
                <td>
                  <div className="dr-drawings__actions">
                    {item.dwgUrl && (
                      <a href={item.dwgUrl} download className="dr-list__btn">
                        DWG
                      </a>
                    )}
                    {item.stpUrl && (
                      <a href={item.stpUrl} download className="dr-list__btn">
                        STP
                      </a>
                    )}
                    {!item.dwgUrl && !item.stpUrl && (
                      <span className="dr-list__btn dr-list__btn--disabled">
                        {tRes("comingSoon")}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
