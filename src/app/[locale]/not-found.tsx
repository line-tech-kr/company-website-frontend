import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import "./error-page.css";

export default async function LocaleNotFound() {
  const t = await getTranslations("errors.notFound");

  return (
    <main className="lt-wrap lt-error">
      <div className="lt-error__panel">
        <p className="lt-error__code">404</p>
        <h1 className="lt-error__title">{t("title")}</h1>
        <p className="lt-error__body">{t("body")}</p>
        <Link href="/" className="lt-btn lt-btn--primary lt-btn--md">
          {t("cta")}
        </Link>
      </div>
    </main>
  );
}
