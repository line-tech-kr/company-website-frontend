"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  return (
    <nav aria-label="Language">
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          disabled={locale === currentLocale}
          onClick={() => router.replace(pathname, { locale })}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </nav>
  );
}
