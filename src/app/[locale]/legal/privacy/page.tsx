import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { LT_PRIVACY } from "@/lib/content/privacy";
import { buildPrivacyMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/content/home";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPrivacyMetadata(locale as Locale);
}

const LOCALE_TAG: Record<string, string> = {
  ko: "ko-KR",
  en: "en-US",
  zh: "zh-CN",
};

function formatDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return new Intl.DateTimeFormat(LOCALE_TAG[locale] ?? "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const content =
    LT_PRIVACY[locale as keyof typeof LT_PRIVACY] ?? LT_PRIVACY.en;

  return (
    <main className="lt-wrap" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <article style={{ maxWidth: "72ch" }}>
        <header style={{ marginBottom: 40 }}>
          <h1 style={{ marginBottom: 8 }}>{content.title}</h1>
          <p style={{ color: "var(--pd-muted)", fontSize: "0.875rem" }}>
            {formatDate(content.effectiveDate, locale)}
          </p>
        </header>
        {content.sections.map((section, i) => (
          <section key={i} style={{ marginBottom: 32 }}>
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              {i + 1}. {section.heading}
            </h2>
            {section.body && (
              <p style={{ marginBottom: section.items ? 8 : 0 }}>
                {section.body}
              </p>
            )}
            {section.items && (
              <ul style={{ paddingLeft: 20, margin: "0 0 8px" }}>
                {section.items.map((item, j) => (
                  <li key={j} style={{ marginBottom: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {section.note && (
              <p style={{ color: "var(--pd-muted)", fontSize: "0.875rem" }}>
                {section.note}
              </p>
            )}
          </section>
        ))}
      </article>
    </main>
  );
}
