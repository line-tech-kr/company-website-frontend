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

const union = [...new Set(LOCALES.flatMap((l) => [...keysByLocale[l]]))].sort();

const drift = union
  .map((key) => ({
    key,
    presentIn: LOCALES.filter((l) => keysByLocale[l].has(key)),
    missingFrom: LOCALES.filter((l) => !keysByLocale[l].has(key)),
  }))
  .filter((row) => row.missingFrom.length > 0);

if (drift.length > 0) {
  console.error(`i18n parity check failed — ${drift.length} key(s) drifted:\n`);
  for (const { key, presentIn, missingFrom } of drift) {
    console.error(
      `  ${key} — missing from ${missingFrom.join(", ")} (present in ${presentIn.join(", ")})`,
    );
  }
  console.error("");
  process.exit(1);
}

console.log(
  `i18n parity OK — ${union.length} keys across ${LOCALES.join(", ")}`,
);
