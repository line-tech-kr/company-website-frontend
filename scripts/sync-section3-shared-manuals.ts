/**
 * Section 3: shared manuals (2 new docs, additive)
 *
 *   pnpm tsx scripts/sync-section3-shared-manuals.ts
 *   pnpm tsx scripts/sync-section3-shared-manuals.ts --apply
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

const SHARED_DIR =
  "/Users/bspark/Dev/working/line-tech-files/organized/shared/manuals";

type Series = "analogue" | "digital" | "specialized";
interface Entry {
  title: string;
  filename: string;
  models: string[];
  series: Series;
}

const ENTRIES: Entry[] = [
  {
    // PED20 is a DeviceNet accessory module that mounts on digital MFCs — not
    // tied to a single model. models=[] keeps it out of every MD product
    // sidebar; it surfaces only in shared/general downloads.
    title: "PED20 DeviceNet User Guide",
    filename: "20260331_DMFC D-NET_user_guide_V10E.pdf",
    models: [],
    series: "digital",
  },
  {
    title: "KCs Explosion-proof Installation Manual",
    filename: "KCs_방폭설치매뉴얼.pdf",
    models: ["EX70C", "EX70M", "EX1000C", "EX1000M"],
    series: "specialized",
  },
];

async function main() {
  console.log(
    `\nsync-section3-shared-manuals  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;
  let missing = 0;

  for (const e of ENTRIES) {
    const filePath = path.join(SHARED_DIR, e.filename);
    const label = `"${e.title}" models=[${e.models.join(",")}] ← ${e.filename}`;

    if (!existsSync(filePath)) {
      console.error(`  MISSING FILE  ${label}`);
      missing++;
      continue;
    }

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_type == "manual" && title == $title][0]{ _id }`,
      { title: e.title },
    );
    if (existing) {
      console.log(`  skip  ${label}`);
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
        models: e.models,
        series: e.series,
        file: {
          _type: "file",
          asset: { _type: "reference", _ref: asset._id },
        },
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
    `\nDone. ${isApply ? "created" : "would-create"}=${created}  skipped=${skipped}  failed=${failed}  missing=${missing}`,
  );
  if (failed > 0 || missing > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
