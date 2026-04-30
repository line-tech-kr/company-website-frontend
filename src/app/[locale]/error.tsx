"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import "./error-page.css";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors.runtime");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="lt-wrap lt-error">
      <div className="lt-error__panel">
        <p className="lt-error__code">500</p>
        <h1 className="lt-error__title">{t("title")}</h1>
        <p className="lt-error__body">{t("body")}</p>
        <div className="lt-error__actions">
          <button
            type="button"
            onClick={reset}
            className="lt-btn lt-btn--primary lt-btn--md"
          >
            {t("retry")}
          </button>
          <Link href="/" className="lt-btn lt-btn--ghost lt-btn--md">
            {t("home")}
          </Link>
        </div>
        {error.digest && (
          <p className="lt-error__digest">ref: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
