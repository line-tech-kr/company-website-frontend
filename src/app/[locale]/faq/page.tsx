import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_FAQ, type FaqContent, type FaqGroup } from "@/lib/content/faq";
import { safeJsonLd } from "@/lib/seo/jsonLd";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import "./faq-page.css";

type Props = { params: Promise<{ locale: Locale }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const c = LT_FAQ[locale];
  return {
    title: `${c.pageTitle} — Line Tech`,
    description: c.pageSub,
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  const c = LT_FAQ[locale];

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("faq") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.groups.flatMap((g) =>
      g.questions.map((q) => ({
        "@type": "Question",
        name: q.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: q.a,
        },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <main className="lt-wrap">
        <Breadcrumbs items={breadcrumbs} />
        <div className="fq">
          <FaqSideNav c={c} />
          <div className="fq-main">
            <header className="fq-hero">
              <h1 className="fq-hero__title">{c.pageTitle}</h1>
              <p className="fq-hero__sub">{c.pageSub}</p>
            </header>
            {c.groups.map((g) => (
              <FaqGroupSection key={g.id} group={g} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function FaqSideNav({ c }: { c: FaqContent }) {
  return (
    <aside className="fq-aside" aria-label={c.navHeading}>
      <div className="fq-aside__heading">{c.navHeading}</div>
      <nav className="fq-nav">
        <ul className="fq-nav__list">
          {c.groups.map((g) => (
            <li key={g.id} className="fq-nav__item">
              <a href={`#${g.id}`} className="fq-nav__link">
                {g.heading}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

function FaqGroupSection({ group }: { group: FaqGroup }) {
  return (
    <section id={group.id} className="fq-section">
      <h2 className="fq-section__heading">{group.heading}</h2>
      <dl className="fq-list">
        {group.questions.map((item) => (
          <div key={item.id} id={item.id} className="fq-item">
            <dt className="fq-item__q">{item.q}</dt>
            <dd className="fq-item__a">{item.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
