import type { Locale } from "@/i18n/routing";

// `inquiry` is the sentinel `display` value used on spec fields where the
// catalogue prints "inquiry" rather than a numeric bound (e.g. max pressure
// on high-flow models). We render it as a localized "contact us" label
// instead of the raw English word.
const INQUIRY = /^\s*inquiry\s*$/i;

const RULES: Record<Locale, Array<[RegExp, string]>> = {
  en: [[INQUIRY, "Contact us"]],
  ko: [
    [INQUIRY, "문의 바랍니다"],
    [/\bseconds?\b/gi, "초"],
    [/(\s)or(\s)/gi, "$1또는$2"],
    [/\bof FS\b/gi, "F.S."],
  ],
  zh: [
    [INQUIRY, "请咨询"],
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
