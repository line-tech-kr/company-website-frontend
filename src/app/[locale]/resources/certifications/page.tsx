import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { allCertificationsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import "../resources-subpage.css";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return {
    title: `${t("certifications.title")} — Line Tech`,
    description: t("certifications.intro"),
  };
}

export default async function CertificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, certs] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch(allCertificationsQuery),
  ]);

  const lang = locale as Locale;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom"), href: "/resources" },
    { label: tRes("certifications.title") },
  ];

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("certifications.title")}</h1>
        <p className="dr-sub__intro">{tRes("certifications.intro")}</p>
      </header>

      {certs.length === 0 ? (
        <p style={{ color: "var(--pd-muted)" }}>{tRes("empty")}</p>
      ) : (
        <ul className="dr-certs" role="list">
          {certs.map((cert) => {
            const issuer = cert.issuer?.[lang] ?? cert.issuer?.en ?? null;
            const scope = cert.scope?.[lang] ?? cert.scope?.en ?? null;
            return (
              <li key={cert._id} className="dr-cert">
                <h2 className="dr-cert__name">{cert.name}</h2>
                <dl className="dr-cert__dl">
                  {issuer && (
                    <>
                      <dt className="dr-cert__dt">{tRes("certCard.issuer")}</dt>
                      <dd className="dr-cert__dd">{issuer}</dd>
                    </>
                  )}
                  {scope && (
                    <>
                      <dt className="dr-cert__dt">{tRes("certCard.scope")}</dt>
                      <dd className="dr-cert__dd">{scope}</dd>
                    </>
                  )}
                  {cert.validThrough && (
                    <>
                      <dt className="dr-cert__dt">
                        {tRes("certCard.validThrough")}
                      </dt>
                      <dd className="dr-cert__dd">{cert.validThrough}</dd>
                    </>
                  )}
                </dl>
                <div className="dr-cert__footer">
                  {cert.fileUrl ? (
                    <a href={cert.fileUrl} download className="dr-list__btn">
                      {tRes("download")}
                    </a>
                  ) : (
                    <span className="dr-list__btn dr-list__btn--disabled">
                      {tRes("comingSoon")}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
