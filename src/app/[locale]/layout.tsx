import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { routing } from "@/i18n/routing";
import { PageShell } from "@/components/layout/PageShell";
import type { Locale } from "@/lib/content/home";
import "../globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://linetech.co.kr",
  ),
  title: {
    default: "Line Tech",
    template: "%s — Line Tech",
  },
  description: "Mass Flow Controllers and Mass Flow Meters",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "라인테크 / Line Tech Inc.",
    alternateName: ["Line Tech", "라인테크", "Linetech"],
    url: "https://linetech.co.kr",
    foundingDate: "1997",
    address: {
      "@type": "PostalAddress",
      streetAddress: "806 Daedeok-daero, Yuseong-gu",
      addressLocality: "Daejeon",
      postalCode: "34055",
      addressCountry: "KR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Korean", "English", "Chinese"],
    },
    sameAs: ["https://linetech.co.kr"],
  };

  return (
    <html lang={locale} className={`${fontSans.variable} ${fontMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <PageShell locale={locale as Locale}>{children}</PageShell>
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
