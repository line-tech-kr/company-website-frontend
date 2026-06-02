import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

/**
 * Pattern-based derivation of per-locale display names.
 *
 * Each doc type carries a trailing English word in its existing `title`
 * (e.g. "M2030 Manual", "DO400 Series Datasheet"). We strip that word
 * and re-attach the locale-specific equivalent.
 *
 * Anything that doesn't end with the expected English word is skipped
 * — an editor will fill it in by hand. That's intentional: pattern
 * guessing past the obvious cases tends to produce subtly wrong output.
 */

type DocKind = "manual" | "datasheet" | "drawing" | "certification";

const SUFFIX_WORDS: Record<
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

/**
 * Cert names are too varied to auto-derive in general — only the
 * "Patent KR N" pattern (the original complaint in #219) is safe to
 * pattern-derive. Everything else (ISO 9001 / CE / long descriptive
 * names) is left to editors.
 */
const CERT_PATTERNS: Array<{
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

type SanityDoc = {
  _id: string;
  _type: string;
  title?: string | null;
  name?: string | null;
  displayName?: { _key?: string; language?: string; value?: string }[] | null;
};

function localizedArray(values: { ko: string; en: string; zh: string }) {
  return [
    { _key: "ko", language: "ko", value: values.ko },
    { _key: "en", language: "en", value: values.en },
    { _key: "zh", language: "zh", value: values.zh },
  ];
}

function hasAnyValue(arr: SanityDoc["displayName"]): boolean {
  if (!arr) return false;
  return arr.some((e) => typeof e.value === "string" && e.value.trim() !== "");
}

function derive(
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

async function processKind(kind: DocKind) {
  // certs use `name`; others use `title`. Both are projected so the
  // source field can be picked per kind.
  const docs = await client.fetch<SanityDoc[]>(
    `*[_type == $type && archived != true]{ _id, _type, title, name, displayName }`,
    { type: kind },
  );

  let skippedExisting = 0;
  let skippedNoMatch = 0;
  let updated = 0;

  for (const doc of docs) {
    if (!force && hasAnyValue(doc.displayName)) {
      skippedExisting += 1;
      continue;
    }
    const source = kind === "certification" ? doc.name : doc.title;
    if (typeof source !== "string" || source.trim() === "") {
      skippedNoMatch += 1;
      continue;
    }
    const derived = derive(kind, source);
    if (!derived) {
      skippedNoMatch += 1;
      console.log(`  skip (no pattern match): [${kind}] ${source}`);
      continue;
    }

    console.log(
      `  ${dryRun ? "would set" : "set"} [${kind}] ${doc._id}:\n    ko=${derived.ko}\n    en=${derived.en}\n    zh=${derived.zh}`,
    );
    if (!dryRun) {
      await client
        .patch(doc._id)
        .set({ displayName: localizedArray(derived) })
        .commit();
    }
    updated += 1;
  }

  console.log(
    `${kind}: updated=${updated} skippedExisting=${skippedExisting} skippedNoMatch=${skippedNoMatch}`,
  );
}

async function main() {
  console.log(
    `Seeding displayName for manuals/datasheets/drawings → ${projectId}/${dataset} (force=${force}, dryRun=${dryRun})`,
  );
  for (const kind of [
    "manual",
    "datasheet",
    "drawing",
    "certification",
  ] as const) {
    await processKind(kind);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
