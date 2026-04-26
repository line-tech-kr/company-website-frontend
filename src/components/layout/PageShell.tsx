import type { Locale } from "@/lib/content/home";
import { Header } from "./Header";

type Props = { locale: Locale; children: React.ReactNode };

// Footer slot is intentionally empty — issue #4 wires <Footer> here.
export function PageShell({ locale, children }: Props) {
  return (
    <>
      <Header locale={locale} />
      {children}
    </>
  );
}
