import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { sanityClient } from "@/sanity/client";
import { allCertificationsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import { splitCerts } from "./splitCerts";
import "../resources-subpage.css";

export const revalidate = 3600;

type CertItem = {
  _id: string;
  name: string;
  /** Stable URL slug from Sanity. Used as the anchor target for /company deep-links. */
  slug: string | null;
  issuer?: {
    ko?: string | null;
    en?: string | null;
    zh?: string | null;
  } | null;
  scope?: { ko?: string | null; en?: string | null; zh?: string | null } | null;
  validThrough?: string | null;
  models?: string[] | null;
  fileUrl?: string | null;
};

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "certifications");
}

export default async function CertificationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, certs] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch<CertItem[]>(allCertificationsQuery),
  ]);

  const lang = locale as Locale;
  const { companyWide, productSpecific } = splitCerts(certs);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom"), href: "/resources" },
    { label: tRes("certifications.title") },
  ];

  const renderCert = (cert: CertItem) => {
    const issuer = cert.issuer?.[lang] ?? cert.issuer?.en ?? null;
    const scope = cert.scope?.[lang] ?? cert.scope?.en ?? null;
    const models = cert.models ?? [];
    return (
      <li key={cert._id} id={cert.slug ?? cert._id} className="dr-cert">
        <h3 className="dr-cert__name">{cert.name}</h3>
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
              <dt className="dr-cert__dt">{tRes("certCard.validThrough")}</dt>
              <dd className="dr-cert__dd">{cert.validThrough}</dd>
            </>
          )}
          {models.length > 0 && (
            <>
              <dt className="dr-cert__dt">{tRes("certCard.appliesTo")}</dt>
              <dd className="dr-cert__dd">{models.join(", ")}</dd>
            </>
          )}
        </dl>
        <div className="dr-cert__footer">
          {cert.fileUrl ? (
            <a href={cert.fileUrl} download className="dr-list__btn">
              {tRes("download")}
            </a>
          ) : (
            <Link
              href={`/contact?topic=request&file=${encodeURIComponent(cert.name)}`}
              className="dr-list__btn dr-list__btn--request"
            >
              {tRes("requestFile")}
            </Link>
          )}
        </div>
      </li>
    );
  };

  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{tRes("certifications.title")}</h1>
        <p className="dr-sub__intro">{tRes("certifications.intro")}</p>
      </header>

      {certs.length === 0 ? (
        <EmptyState
          message={tRes("empty")}
          ctaHref="/contact?topic=request"
          ctaLabel={tRes("emptyStateCta")}
        />
      ) : (
        <>
          {companyWide.length > 0 && (
            <section className="dr-cert-group">
              <h2 className="dr-cert-group__heading">
                {tRes("certifications.companyWideHeading")}
              </h2>
              <ul className="dr-certs" role="list">
                {companyWide.map(renderCert)}
              </ul>
            </section>
          )}
          {productSpecific.length > 0 && (
            <section className="dr-cert-group">
              <h2 className="dr-cert-group__heading">
                {tRes("certifications.productSpecificHeading")}
              </h2>
              <ul className="dr-certs" role="list">
                {productSpecific.map(renderCert)}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
