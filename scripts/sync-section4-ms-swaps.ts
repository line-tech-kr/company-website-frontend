/**
 * Section 4: MS-series file swaps on existing manual docs (DESTRUCTIVE).
 *
 * For each entry, find the existing manual doc by current file's
 * originalFilename, upload the new PDF, swap `file.asset` to the new ref,
 * bump publishedAt. Doc _id, title, models, refs all preserved.
 * Old asset becomes unreferenced (can be cleaned up later in Studio).
 *
 *   pnpm tsx scripts/sync-section4-ms-swaps.ts            # dry-run
 *   pnpm tsx scripts/sync-section4-ms-swaps.ts --apply    # write
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
  console.error("Missing project/dataset env");
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

interface Swap {
  // Lookup: the manual doc whose `title` matches this value.
  docTitle: string;
  // Replacement: PDF file under STAGING/<sourceModel>/manual/<sourceFilename>
  sourceModel: string;
  sourceFilename: string;
  // Sanity-side expected current file (sanity check before swap)
  expectedCurrentFile: string;
}

const SWAPS: Swap[] = [
  {
    docTitle: "MS3150 Series",
    sourceModel: "MS3150VA",
    sourceFilename: "MS3150 Maunal.pdf",
    expectedCurrentFile: "MS3150 Series.pdf",
  },
  {
    // MS3500 + MS3600 share a manual; the two staged "Maunal" PDFs differ only
    // in the title-page model label. Using MS3500 as canonical.
    docTitle: "MS3500 / MS3600 Series Manual",
    sourceModel: "MS3500VA",
    sourceFilename: "MS3500 Maunal.pdf",
    expectedCurrentFile: "MS3500&MS3600 Series.pdf",
  },
  {
    docTitle: "MS3700 Series",
    sourceModel: "MS3700VA",
    sourceFilename: "MS3700 Maunal.pdf",
    expectedCurrentFile: "MS3700 Series.pdf",
  },
  {
    docTitle: "MS3800 Series",
    sourceModel: "MS3800VA",
    sourceFilename: "MS3800 Maunal.pdf",
    expectedCurrentFile: "MS3800 Series.pdf",
  },
  {
    docTitle: "LEPC Manual",
    sourceModel: "LEPC",
    sourceFilename: "20260529_LEPC_user_guide_V11K.pdf",
    expectedCurrentFile: "LEPC Maunal.pdf",
  },
];

async function findDoc(title: string) {
  return client.fetch<{
    _id: string;
    title: string;
    models: string[] | null;
    series: string | null;
    publishedAt: string | null;
    fileName: string | null;
  } | null>(
    `*[_type == "manual" && title == $title][0]{
      _id, title, models, series, publishedAt,
      "fileName": file.asset->originalFilename
    }`,
    { title },
  );
}

async function main() {
  console.log(`\nsync-section4-ms-swaps  [${isApply ? "APPLY" : "DRY RUN"}]\n`);

  let swapped = 0;
  const skipped = 0;
  let failed = 0;
  let warnings = 0;

  for (const s of SWAPS) {
    const filePath = path.join(
      STAGING,
      s.sourceModel,
      "manual",
      s.sourceFilename,
    );
    const label = `"${s.docTitle}"  ${s.expectedCurrentFile} → ${s.sourceFilename}`;

    if (!existsSync(filePath)) {
      console.error(`  MISSING SOURCE  ${label}`);
      failed++;
      continue;
    }

    const doc = await findDoc(s.docTitle);
    if (!doc) {
      console.error(`  NOT FOUND  no Sanity doc with title "${s.docTitle}"`);
      failed++;
      continue;
    }

    // Sanity check current file
    if (doc.fileName !== s.expectedCurrentFile) {
      console.warn(
        `  WARN  current file is "${doc.fileName}", expected "${s.expectedCurrentFile}". ` +
          `Doc may have been updated since the diff. Proceeding anyway.`,
      );
      warnings++;
    }

    if (!isApply) {
      console.log(`  WOULD swap  [${doc._id}] ${label}`);
      swapped++;
      continue;
    }

    try {
      const asset = await client.assets.upload(
        "file",
        createReadStream(filePath),
        { filename: s.sourceFilename, contentType: "application/pdf" },
      );
      await client
        .patch(doc._id)
        .set({
          file: {
            _type: "file",
            asset: { _type: "reference", _ref: asset._id },
          },
          publishedAt: new Date().toISOString().slice(0, 10),
        })
        .commit();
      console.log(`  swap  [${doc._id}] ${label}`);
      swapped++;
    } catch (err) {
      console.error(`  FAILED  ${label}:`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. ${isApply ? "swapped" : "would-swap"}=${swapped}  skipped=${skipped}  failed=${failed}  warnings=${warnings}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
