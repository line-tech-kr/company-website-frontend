import { readFileSync } from "node:fs";
import { join } from "node:path";

const LOCALES = ["en", "ko", "zh"] as const;
const MESSAGES_DIR = join(process.cwd(), "messages");

type Json = string | number | boolean | null | { [k: string]: Json } | Json[];

function flatten(value: Json, prefix = ""): string[] {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value).flatMap(([k, v]) =>
    flatten(v, prefix ? `${prefix}.${k}` : k),
  );
}

const keysByLocale = Object.fromEntries(
  LOCALES.map((locale) => {
    const file = join(MESSAGES_DIR, `${locale}.json`);
    const data = JSON.parse(readFileSync(file, "utf-8")) as Json;
    return [locale, new Set(flatten(data))];
  }),
) as Record<(typeof LOCALES)[number], Set<string>>;

const union = new Set(LOCALES.flatMap((l) => [...keysByLocale[l]]));

const missing: Record<string, string[]> = {};
for (const locale of LOCALES) {
  const gaps = [...union].filter((k) => !keysByLocale[locale].has(k)).sort();
  if (gaps.length > 0) missing[locale] = gaps;
}

if (Object.keys(missing).length > 0) {
  console.error("i18n parity check failed — missing keys:\n");
  for (const [locale, keys] of Object.entries(missing)) {
    console.error(`  ${locale}.json is missing ${keys.length} key(s):`);
    for (const k of keys) console.error(`    - ${k}`);
    console.error("");
  }
  process.exit(1);
}

console.log(`i18n parity OK — ${union.size} keys across ${LOCALES.join(", ")}`);
