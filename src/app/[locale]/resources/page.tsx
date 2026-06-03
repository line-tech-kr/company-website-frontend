import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { resourceCountsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildResourcesMetadata } from "@/lib/seo";
import "./resources-hub.css";

export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildResourcesMetadata(locale as Locale, "hub");
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

  const [tCommon, tNav, tRes, counts] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
    sanityClient.fetch(resourceCountsQuery),
  ]);

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
                  {tRes(`cards.${key}.count`, { count: counts[key] })}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
