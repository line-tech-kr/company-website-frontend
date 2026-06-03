/**
 * seed-display-names.ts
 *
 * One-shot seeder that backfilled per-locale `displayName` fields on existing
 * data-room documents.
 *
 * Status: frozen — historical record. The `datasheet` `DocKind` is a no-op
 * after #239 retired the schema (queries against `_type == "datasheet"` will
 * return zero rows). Kept intact for provenance and as a template if the
 * pattern is needed for a new doc type later.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import {
  derive,
  hasAnyValue,
  localizedArray,
  type DisplayNameRow,
  type DocKind,
} from "./seed-display-names.lib";

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

type SanityDoc = {
  _id: string;
  _type: string;
  title?: string | null;
  name?: string | null;
  displayName?: DisplayNameRow[] | null;
};

async function processKind(kind: DocKind) {
  // certs use `name`; others use `title`. Both are projected so the source
  // field can be picked per kind.
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
