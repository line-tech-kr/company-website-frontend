import type { Locale } from "@/lib/content/home";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = { locale: Locale; children: React.ReactNode };

export function PageShell({ locale, children }: Props) {
  return (
    <>
      <Header locale={locale} />
      {children}
      <Footer locale={locale} />
    </>
  );
}
