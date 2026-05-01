import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { LT_HOME, type Locale } from "@/lib/content/home";
import { Intro } from "@/components/home/Intro";
import { Stats } from "@/components/home/Stats";
import { Series } from "@/components/home/Series";
import { Feature } from "@/components/home/Feature";
import { Applications } from "@/components/home/Applications";
import { Credentials } from "@/components/home/Credentials";
import { Contact } from "@/components/home/Contact";
import { buildHomeMetadata } from "@/lib/seo";
import "@/components/home/home-shell.css";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata(locale);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const h = LT_HOME[locale];

  return (
    <main className="lt-wrap">
      <div className="ho">
        <Intro h={h} />
        <Stats h={h} />
        <Series h={h} />
        <Applications h={h} />
        <Feature h={h} />
        <Credentials h={h} />
        <Contact h={h} locale={locale} />
      </div>
    </main>
  );
}
