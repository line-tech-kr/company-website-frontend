import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { Chip } from "@/components/ui/Chip/Chip";
import { INDUSTRY_ICONS } from "@/lib/content/application-icons";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildApplicationsMetadata } from "@/lib/seo";
import "./applications-page.css";

type ChipTone = "neutral" | "info" | "warning" | "danger";

function seriesTone(series: string): ChipTone {
  if (series === "MD") return "info";
  if (series === "EX") return "danger";
  if (series === "LM" || series === "LD") return "warning";
  return "neutral";
}

type StatItem = { value: string; label: string; href?: string };

const STAT_LABELS: Record<Locale, [string, string, string]> = {
  en: ["Industries", "Models", "Certifications"],
  ko: ["적용 산업", "제품 모델", "인증"],
  zh: ["应用行业", "产品型号", "认证"],
};

function buildStats(locale: Locale, industryCount: number): StatItem[] {
  const [industries, models, certs] = STAT_LABELS[locale];
  return [
    { value: String(industryCount), label: industries, href: "#industries" },
    { value: "40+", label: models, href: "/products" },
    { value: "13", label: certs, href: "/resources/certifications" },
  ];
}

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildApplicationsMetadata(locale);
}

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  const c = LT_APPLICATIONS[locale];
  const stats = buildStats(locale, c.applications.length);

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("applications") },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />

      <header className="ap-hero">
        <Image
          src="/applications/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="ap-hero__bg"
        />
        <div className="ap-hero__overlay" aria-hidden />
        <div className="ap-hero__content">
          <h1 className="ap-hero__title">{c.pageTitle}</h1>
          <p className="ap-hero__sub">{c.pageSub}</p>
        </div>
      </header>

      <div className="ap-stats">
        {stats.map((s) =>
          s.href ? (
            <Link
              key={s.label}
              href={s.href}
              className="ap-stats__item ap-stats__item--link"
            >
              <span className="ap-stats__value">{s.value}</span>
              <span className="ap-stats__label">{s.label}</span>
            </Link>
          ) : (
            <div key={s.label} className="ap-stats__item">
              <span className="ap-stats__value">{s.value}</span>
              <span className="ap-stats__label">{s.label}</span>
            </div>
          ),
        )}
      </div>

      <section id="industries" aria-label={c.gridHeading}>
        <h2 className="ap-grid__heading">{c.gridHeading}</h2>
        <ul className="ap-grid">
          {c.applications.map((app) => (
            <li key={app.slug} className="ap-card">
              <Link
                href={`/applications/${app.slug}`}
                className="ap-card__link"
              >
                {INDUSTRY_ICONS[app.slug] && (
                  <span className="ap-card__icon" aria-hidden>
                    {INDUSTRY_ICONS[app.slug]}
                  </span>
                )}
                <span className="ap-card__title">{app.title}</span>
                <span className="ap-card__lede">{app.lede}</span>
                <span className="ap-card__chips">
                  {app.recommendedSeries.map((s) => (
                    <Chip key={s} small tone={seriesTone(s)}>
                      {s}
                    </Chip>
                  ))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="ap-cta">
        <p className="ap-cta__heading">{c.contactCta}</p>
        <Link href={c.contactCtaHref} className="ap-cta__btn">
          {c.contactBtn} →
        </Link>
      </div>
    </main>
  );
}
