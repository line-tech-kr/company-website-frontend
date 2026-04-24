import { setRequestLocale } from "next-intl/server";
import { LT_HOME, type Locale } from "@/lib/content/home";
import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Series } from "@/components/home/Series";
import { Feature } from "@/components/home/Feature";
import { Apps } from "@/components/home/Apps";
import { Trust } from "@/components/home/Trust";
import { Cta } from "@/components/home/Cta";
import "./home.css";

type Props = { params: Promise<{ locale: Locale }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const h = LT_HOME[locale];

  return (
    <main className="lt-wrap">
      <div className="ho">
        <Hero h={h} />
        <Stats h={h} />
        <Series h={h} />
        <Feature h={h} />
        <Apps h={h} />
        <Trust h={h} />
        <Cta h={h} />
      </div>
    </main>
  );
}
