"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import "./LocaleSwitcher.css";

const LOCALE_NAMES: Record<(typeof routing.locales)[number], string> = {
  ko: "한국어",
  en: "English",
  zh: "中文",
};

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();
  const t = useTranslations("a11y");

  return (
    <nav className="lt-locale" aria-label={t("language")}>
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            className="lt-locale__seg"
            aria-current={isActive ? "true" : undefined}
            aria-label={LOCALE_NAMES[locale]}
            onClick={() => {
              if (isActive) return;
              const query = Object.fromEntries(
                new URLSearchParams(window.location.search),
              );
              router.replace({ pathname, query }, { locale });
            }}
          >
            <span aria-hidden="true">{locale.toUpperCase()}</span>
          </button>
        );
      })}
    </nav>
  );
}
