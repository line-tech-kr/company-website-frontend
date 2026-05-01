import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/content/home";
import { Header } from "./Header/Header";
import { Footer } from "./Footer/Footer";

type Props = { locale: Locale; children: React.ReactNode };

export async function PageShell({ locale, children }: Props) {
  const t = await getTranslations({ locale, namespace: "skipLink" });
  return (
    <>
      <a className="lt-skiplink" href="#lt-main">
        {t("main")}
      </a>
      <Header locale={locale} />
      <div id="lt-main" tabIndex={-1}>
        {children}
      </div>
      <Footer locale={locale} />
    </>
  );
}
