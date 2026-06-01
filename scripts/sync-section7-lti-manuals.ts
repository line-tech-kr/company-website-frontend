/**
 * Section 7: LTI-1000 + LTI-2000 manual uploads (additive).
 *
 *   pnpm tsx scripts/sync-section7-lti-manuals.ts
 *   pnpm tsx scripts/sync-section7-lti-manuals.ts --apply
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
  console.error("Missing env");
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

const ENTRIES = [
  {
    model: "LTI-1000",
    title: "LTI-1000 Manual",
    filename: "LTI-1000메뉴얼_20220830(다이얼버전).pdf",
  },
  {
    model: "LTI-2000",
    title: "LTI-2000 Manual",
    filename: "LTI-2000 Maunal.pdf",
  },
];

async function main() {
  console.log(
    `\nsync-section7-lti-manuals  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );
  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const e of ENTRIES) {
    const filePath = path.join(STAGING, e.model, "manual", e.filename);
    const label = `"${e.title}" [${e.model}] ← ${e.filename}`;
    if (!existsSync(filePath)) {
      console.error(`  MISSING FILE  ${label}`);
      failed++;
      continue;
    }
    const exists = await client.fetch<{ _id: string } | null>(
      `*[_type == "manual" && title == $title][0]{ _id }`,
      { title: e.title },
    );
    if (exists) {
      console.log(`  skip  ${label} (already in Sanity)`);
      skipped++;
      continue;
    }
    if (!isApply) {
      console.log(`  WOULD create  ${label}`);
      created++;
      continue;
    }
    try {
      const asset = await client.assets.upload(
        "file",
        createReadStream(filePath),
        { filename: e.filename, contentType: "application/pdf" },
      );
      await client.create({
        _type: "manual",
        title: e.title,
        models: [e.model],
        series: "specialized",
        file: { _type: "file", asset: { _type: "reference", _ref: asset._id } },
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
    `\nDone. ${isApply ? "created" : "would-create"}=${created}  skipped=${skipped}  failed=${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
