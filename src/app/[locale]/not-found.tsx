import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "./not-found.css";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <main className="lt-wrap lt-nf">
      <p className="lt-nf__code" aria-hidden="true">
        {t("code")}
      </p>
      <h1 className="lt-nf__title">{t("title")}</h1>
      <p className="lt-nf__lede">{t("lede")}</p>
      <Link className="lt-nf__back" href="/">
        ← {t("back")}
      </Link>
    </main>
  );
}
