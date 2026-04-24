import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <h1>Line Tech</h1>
      <Link href="/products/analogue-mfc/m3030va">M3030VA</Link>
    </main>
  );
}
