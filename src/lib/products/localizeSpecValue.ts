import type { Locale } from "@/i18n/routing";

const RULES: Record<Locale, Array<[RegExp, string]>> = {
  en: [],
  ko: [
    [/\bseconds?\b/gi, "초"],
    [/(\s)or(\s)/gi, "$1또는$2"],
    [/\bof FS\b/gi, "F.S."],
  ],
  zh: [
    [/\bseconds?\b/gi, "秒"],
    [/(\s)or(\s)/gi, "$1或$2"],
    [/\bof FS\b/gi, "F.S."],
  ],
};

export function localizeSpecValue(value: string, locale: Locale): string {
  let result = value;
  for (const [pattern, replacement] of RULES[locale]) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
