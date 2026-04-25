"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import "./LocaleSwitcher.css";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  return (
    <nav className="lt-locale" aria-label="Language">
      {routing.locales.map((locale) => {
        const isActive = locale === currentLocale;
        return (
          <button
            key={locale}
            type="button"
            className="lt-locale__seg"
            aria-current={isActive ? "true" : undefined}
            onClick={() => {
              if (isActive) return;
              router.replace(pathname, { locale });
            }}
          >
            {locale.toUpperCase()}
          </button>
        );
      })}
    </nav>
  );
}
