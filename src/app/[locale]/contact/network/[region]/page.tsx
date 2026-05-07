import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { LT_CONTACT, type DistributorRegionId } from "@/lib/content/contact";
import { routing, type Locale } from "@/i18n/routing";
import "./region-page.css";

const REGION_IDS: DistributorRegionId[] = ["kr", "cn", "sea", "other"];

type Props = {
  params: Promise<{ locale: Locale; region: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    REGION_IDS.map((region) => ({ locale, region })),
  );
}

function findRegion(locale: Locale, regionId: string) {
  return LT_CONTACT[locale].distributors.regions.find((r) => r.id === regionId);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region } = await params;
  const r = findRegion(locale, region);
  if (!r) return {};
  const c = LT_CONTACT[locale];
  return {
    title: `${r.name} — ${c.distributors.heading} — Line Tech`,
    description: c.regionPage.comingSoonBody,
    robots: { index: false, follow: true },
  };
}

export default async function RegionPlaceholderPage({ params }: Props) {
  const { locale, region } = await params;
  setRequestLocale(locale);

  const r = findRegion(locale, region);
  if (!r) notFound();

  const tCommon = await getTranslations("common");
  const c = LT_CONTACT[locale];

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: c.breadcrumbLabel, href: "/contact" },
    { label: r.name },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <section className="ct-region">
        <span className="ct-region__eyebrow">{c.distributors.heading}</span>
        <h1 className="ct-region__title">{r.name}</h1>
        <p className="ct-region__status">{r.status}</p>
        <div className="ct-region__panel">
          <h2 className="ct-region__soon-title">
            {c.regionPage.comingSoonTitle}
          </h2>
          <p className="ct-region__soon-body">{c.regionPage.comingSoonBody}</p>
        </div>
        <Link href="/contact" className="ct-region__back">
          ← {c.regionPage.backLabel}
        </Link>
      </section>
    </main>
  );
}
