/**
 * Section 2: MS2150 manual (1 new doc, additive)
 *
 *   pnpm tsx scripts/sync-section2-ms2150-manual.ts
 *   pnpm tsx scripts/sync-section2-ms2150-manual.ts --apply
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

const ENTRY = {
  model: "MS2150VA",
  title: "MS2150 Manual",
  filename: "MS2150 Maunal.pdf",
  series: "analogue" as const,
};

async function main() {
  console.log(
    `\nsync-section2-ms2150-manual  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  const filePath = path.join(STAGING, ENTRY.model, "manual", ENTRY.filename);
  const label = `"${ENTRY.title}" [${ENTRY.model}] ← ${ENTRY.filename}`;

  if (!existsSync(filePath)) {
    console.error(`  MISSING FILE  ${label}`);
    process.exit(1);
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "manual" && title == $title][0]{ _id }`,
    { title: ENTRY.title },
  );
  if (existing) {
    console.log(`  skip  ${label}  (already in Sanity as ${existing._id})`);
    return;
  }

  if (!isApply) {
    console.log(`  WOULD create  ${label}`);
    return;
  }

  const asset = await client.assets.upload("file", createReadStream(filePath), {
    filename: ENTRY.filename,
    contentType: "application/pdf",
  });
  await client.create({
    _type: "manual",
    title: ENTRY.title,
    models: [ENTRY.model],
    series: ENTRY.series,
    file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
    publishedAt: new Date().toISOString().slice(0, 10),
    archived: false,
  });
  console.log(`  create  ${label}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
