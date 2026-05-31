/**
 * Section 1: MD-series manuals (additive)
 *
 * Creates 9 new `manual` docs in Sanity for MD-series digital MFCs/MFMs.
 * Files come from line-tech-files/organized/products/<MODEL>/manual/.
 * Idempotent: skips if a manual with the same title already exists.
 *
 *   pnpm tsx scripts/sync-section1-md-manuals.ts            # dry-run
 *   pnpm tsx scripts/sync-section1-md-manuals.ts --apply    # write
 */
import { readFileSync, createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

function loadEnv(p: string) {
  try {
    for (const l of readFileSync(p, "utf-8").split("\n")) {
      const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {}
}
loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const isApply = process.argv.includes("--apply");

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET",
  );
  process.exit(1);
}
if (isApply && !token) {
  console.error("--apply requires SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const STAGING = "/Users/bspark/Dev/working/line-tech-files/organized/products";

interface ManualEntry {
  model: string;
  title: string;
  filename: string;
}

// Explicit map — see commit message / sync-section1 notes for file-vs-model logic
// (e.g. "MD30 series.pdf" lives in MD30C and is the Controller manual, not a
// combined doc).
const ENTRIES: ManualEntry[] = [
  { model: "MD30C", title: "MD30C Manual", filename: "MD30 series.pdf" },
  { model: "MD30M", title: "MD30M Manual", filename: "MD30M series.pdf" },
  { model: "MD400C", title: "MD400C Manual", filename: "MD400C.pdf" },
  { model: "MD400M", title: "MD400M Manual", filename: "MD400M.pdf" },
  { model: "MD500C", title: "MD500C Manual", filename: "MD500C.pdf" },
  { model: "MD500M", title: "MD500M Manual", filename: "MD500M.pdf" },
  { model: "MD600C", title: "MD600C Manual", filename: "MD600C.pdf" },
  { model: "MD600M", title: "MD600M Manual", filename: "MD600M series.pdf" },
  { model: "MD700C", title: "MD700C Manual", filename: "MD700C.pdf" },
];

async function titleExists(title: string): Promise<boolean> {
  const r = await client.fetch<{ _id: string } | null>(
    `*[_type == "manual" && title == $title][0]{ _id }`,
    { title },
  );
  return r !== null;
}

async function uploadPdf(filePath: string) {
  const asset = await client.assets.upload("file", createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: "application/pdf",
  });
  return { _type: "reference" as const, _ref: asset._id };
}

async function main() {
  console.log(`\nsync-section1-md-manuals  [${isApply ? "APPLY" : "DRY RUN"}]`);
  console.log(`Target: ${projectId}/${dataset}`);
  console.log(`Source: ${STAGING}\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let missingFile = 0;

  for (const e of ENTRIES) {
    const filePath = path.join(STAGING, e.model, "manual", e.filename);
    const label = `"${e.title}" [${e.model}] ← ${e.filename}`;

    if (!existsSync(filePath)) {
      console.error(`  MISSING FILE  ${label}`);
      missingFile++;
      continue;
    }

    const exists = await titleExists(e.title);
    if (exists) {
      console.log(`  skip  ${label}  (title already in Sanity)`);
      skipped++;
      continue;
    }

    if (!isApply) {
      console.log(`  WOULD create  ${label}`);
      created++;
      continue;
    }

    try {
      const fileRef = await uploadPdf(filePath);
      await client.create({
        _type: "manual",
        title: e.title,
        models: [e.model],
        series: "digital",
        file: { _type: "file", asset: fileRef },
        publishedAt: new Date().toISOString().slice(0, 10),
        archived: false,
      });
      console.log(`  create  ${label}`);
      created++;
    } catch (err) {
      console.error(`  FAILED  ${label}:`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. ${isApply ? "created" : "would-create"}=${created}  skipped=${skipped}  failed=${failed}  missing-file=${missingFile}`,
  );
  if (failed > 0 || missingFile > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
