import type { Locale } from "@/i18n/routing";

const RULES: Record<Locale, Array<[RegExp, string]>> = {
  en: [],
  ko: [
    [/\bseconds?\b/gi, "초"],
    [/\bor\b/gi, "또는"],
    [/\bof FS\b/g, "F.S."],
  ],
  zh: [
    [/\bseconds?\b/gi, "秒"],
    [/\bor\b/gi, "或"],
    [/\bof FS\b/g, "F.S."],
  ],
};

export function localizeSpecValue(value: string, locale: Locale): string {
  let result = value;
  for (const [pattern, replacement] of RULES[locale]) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
