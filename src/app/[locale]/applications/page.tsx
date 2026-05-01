import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import "./applications-page.css";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ApplicationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  const c = LT_APPLICATIONS[locale];

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("applications") },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <header className="ap-hero">
        <h1 className="ap-hero__title">{c.pageTitle}</h1>
        <p className="ap-hero__sub">{c.pageSub}</p>
      </header>
      <section aria-label={c.gridHeading}>
        <h2 className="ap-grid__heading">{c.gridHeading}</h2>
        <ul className="ap-grid">
          {c.applications.map((app) => (
            <li key={app.slug} className="ap-card">
              <Link
                href={`/applications/${app.slug}`}
                className="ap-card__link"
              >
                <span className="ap-card__title">{app.title}</span>
                <span className="ap-card__lede">{app.lede}</span>
                <span className="ap-card__series">
                  {app.recommendedSeries.join(" · ")}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
