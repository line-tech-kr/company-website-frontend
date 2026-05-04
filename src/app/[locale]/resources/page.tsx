import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import {
  allCataloguesQuery,
  allManualsQuery,
  allDrawingsQuery,
  allCertificationsQuery,
} from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import "./resources-hub.css";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resources" });
  return {
    title: `${t("hub.title")} — Line Tech`,
    description: t("hub.intro"),
  };
}

const CARDS = [
  { key: "catalogues", href: "/resources/catalogues" },
  { key: "drawings", href: "/resources/drawings" },
  { key: "manuals", href: "/resources/manuals" },
  { key: "certifications", href: "/resources/certifications" },
] as const;

export default async function ResourcesHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tRes, catalogues, manuals, drawings, certifications] =
    await Promise.all([
      getTranslations("common"),
      getTranslations("nav"),
      getTranslations("resources"),
      sanityClient.fetch(allCataloguesQuery),
      sanityClient.fetch(allManualsQuery),
      sanityClient.fetch(allDrawingsQuery),
      sanityClient.fetch(allCertificationsQuery),
    ]);

  const counts: Record<string, number> = {
    catalogues: catalogues.length,
    drawings: drawings.length,
    manuals: manuals.length,
    certifications: certifications.length,
  };

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("dataRoom") },
  ];

  return (
    <main className="lt-wrap dr-hub">
      <Breadcrumbs items={breadcrumbs} />

      <header className="dr-hub__hero">
        <h1 className="dr-hub__title">{tRes("hub.title")}</h1>
        <p className="dr-hub__intro">{tRes("hub.intro")}</p>
      </header>

      <ul className="dr-hub__grid" role="list">
        {CARDS.map(({ key, href }) => (
          <li key={key}>
            <Link
              href={href as `/resources/${string}`}
              className="dr-hub__card"
            >
              <span className="dr-hub__card-title">
                {tRes(`cards.${key}.title`)}
              </span>
              <span className="dr-hub__card-desc">
                {tRes(`cards.${key}.desc`)}
              </span>
              {counts[key] > 0 && (
                <span className="dr-hub__card-count">
                  {counts[key]} {key === "drawings" ? "models" : "documents"}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
