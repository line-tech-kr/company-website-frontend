/**
 * Pure pattern-substitution logic for the displayName seed.
 *
 * Extracted from the runner so the rules can be unit-tested in isolation;
 * the runner (`seed-display-names.ts`) wires these into the Sanity write
 * client. Keep this module side-effect free.
 */

export type DocKind = "manual" | "datasheet" | "drawing" | "certification";

export const SUFFIX_WORDS: Record<
  Exclude<DocKind, "certification">,
  { en: RegExp; ko: string; zh: string }
> = {
  manual: {
    en: /\s+(User\s+)?Manual$/i,
    ko: "매뉴얼",
    zh: "手册",
  },
  datasheet: {
    en: /\s+Datasheet$/i,
    ko: "데이터시트",
    zh: "数据表",
  },
  drawing: {
    en: /\s+Drawing$/i,
    ko: "도면",
    zh: "图纸",
  },
};

export const CERT_PATTERNS: Array<{
  match: RegExp;
  replace: (m: RegExpMatchArray) => { ko: string; en: string; zh: string };
}> = [
  {
    match: /^Patent KR\s+(.+)$/i,
    replace: ([, rest]) => ({
      ko: `특허 KR ${rest}`,
      en: `Patent KR ${rest}`,
      zh: `专利 KR ${rest}`,
    }),
  },
];

export type DisplayNameRow = {
  _key?: string;
  language?: string;
  value?: string;
};

export function hasAnyValue(arr: DisplayNameRow[] | null | undefined): boolean {
  if (!arr) return false;
  return arr.some((e) => typeof e.value === "string" && e.value.trim() !== "");
}

export function derive(
  kind: DocKind,
  source: string,
): { ko: string; en: string; zh: string } | null {
  if (kind === "certification") {
    for (const { match, replace } of CERT_PATTERNS) {
      const m = source.match(match);
      if (m) return replace(m);
    }
    return null;
  }
  const { en, ko, zh } = SUFFIX_WORDS[kind];
  const match = source.match(en);
  if (!match) return null;
  const stem = source.slice(0, match.index).trim();
  if (stem.length === 0) return null;
  return {
    ko: `${stem} ${ko}`,
    en: source,
    zh: `${stem} ${zh}`,
  };
}

export function localizedArray(values: { ko: string; en: string; zh: string }) {
  return [
    { _key: "ko", language: "ko", value: values.ko },
    { _key: "en", language: "en", value: values.en },
    { _key: "zh", language: "zh", value: values.zh },
  ];
}
