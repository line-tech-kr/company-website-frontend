import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: false, follow: false },
  };
}

const CONTENT = {
  ko: {
    title: "개인정보처리방침",
    body: "개인정보처리방침은 준비 중입니다.",
  },
  en: {
    title: "Privacy Policy",
    body: "Our privacy policy is being prepared.",
  },
  zh: {
    title: "隐私政策",
    body: "隐私政策正在准备中。",
  },
} as const;

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { title, body } = CONTENT[locale as keyof typeof CONTENT] ?? CONTENT.en;

  return (
    <main className="lt-wrap" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <h1 style={{ marginBottom: 16 }}>{title}</h1>
      <p style={{ color: "var(--pd-muted)" }}>{body}</p>
    </main>
  );
}
