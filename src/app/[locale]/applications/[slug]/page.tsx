import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_APPLICATIONS } from "@/lib/content/applications";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import { buildApplicationDetailMetadata } from "@/lib/seo";
import "../applications-page.css";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

export function generateStaticParams() {
  const slugs = [
    ...new Set(
      routing.locales.flatMap((l) =>
        LT_APPLICATIONS[l].applications.map((a) => a.slug),
      ),
    ),
  ];
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const app = LT_APPLICATIONS[locale].applications.find((a) => a.slug === slug);
  if (!app) return {};
  return buildApplicationDetailMetadata(locale, slug, app.title, app.lede);
}

const CATEGORY_HREFS: Record<string, string> = {
  analogue: "/products/analogue",
  digital: "/products/digital",
  specialized: "/products/specialized",
};

export default async function ApplicationDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav, tCategory] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
  ]);

  const c = LT_APPLICATIONS[locale];
  const app = c.applications.find((a) => a.slug === slug);

  if (!app) notFound();

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("applications"), href: "/applications" },
    { label: app.title },
  ];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className="ap-detail">
        <div className="ap-detail__main">
          <header className="ap-detail__header">
            <h1 className="ap-detail__title">{app.title}</h1>
            <p className="ap-detail__lede">{app.lede}</p>
          </header>
          <div className="ap-detail__body">
            {app.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <aside className="ap-detail__sidebar">
          <div className="ap-sidebar-block">
            <div className="ap-sidebar-block__heading">{c.relatedHeading}</div>
            <ul className="ap-sidebar-block__list">
              {app.relatedCategories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={CATEGORY_HREFS[cat]}
                    className="ap-sidebar-block__link"
                  >
                    {tCategory(cat)}
                    <span className="ap-sidebar-block__link-series">
                      {app.recommendedSeries
                        .filter((s) => {
                          if (cat === "digital") return s === "MD";
                          if (cat === "specialized")
                            return ["LD", "LM", "EX"].includes(s);
                          return s === "M / MS";
                        })
                        .join(" / ") || app.recommendedSeries[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="ap-sidebar-block ap-sidebar-block--cta">
            <Link href={c.contactCtaHref} className="ap-sidebar-block__cta">
              {c.contactCta}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
