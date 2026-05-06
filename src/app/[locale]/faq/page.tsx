import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_FAQ, type FaqGroup } from "@/lib/content/faq";
import { safeJsonLd } from "@/lib/seo/jsonLd";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { allFaqGroupsQuery } from "@/sanity/queries";
import { routing } from "@/i18n/routing";
import type { Locale } from "@/lib/content/home";
import "./faq-page.css";

type Props = { params: Promise<{ locale: Locale }> };

type SanityFaqGroup = {
  id: string;
  heading: Record<string, string>;
  questions: Array<{
    id: string;
    q: Record<string, string>;
    a: Record<string, string>;
  }> | null;
};

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

  const [tCommon, tNav, rawGroups] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    fetchSanity(
      () => sanityClient.fetch<SanityFaqGroup[]>(allFaqGroupsQuery),
      { name: "allFaqGroups" },
    ).catch(() => [] as SanityFaqGroup[]),
  ]);

  const c = LT_FAQ[locale];

  const groups: FaqGroup[] = rawGroups.length
    ? rawGroups.map((g) => ({
        id: g.id ?? "",
        heading: g.heading?.[locale] ?? g.heading?.en ?? "",
        questions: (g.questions ?? []).map((q) => ({
          id: q.id ?? "",
          q: q.q?.[locale] ?? q.q?.en ?? "",
          a: q.a?.[locale] ?? q.a?.en ?? "",
        })),
      }))
    : c.groups;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("faq") },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((g) =>
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
          <FaqSideNav groups={groups} navHeading={c.navHeading} />
          <div className="fq-main">
            <header className="fq-hero">
              <h1 className="fq-hero__title">{c.pageTitle}</h1>
              <p className="fq-hero__sub">{c.pageSub}</p>
            </header>
            {groups.map((g) => (
              <FaqGroupSection key={g.id} group={g} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

function FaqSideNav({
  groups,
  navHeading,
}: {
  groups: FaqGroup[];
  navHeading: string;
}) {
  return (
    <aside className="fq-aside" aria-label={navHeading}>
      <h2 className="fq-aside__heading">{navHeading}</h2>
      <nav className="fq-nav">
        <ul className="fq-nav__list">
          {groups.map((g) => (
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
