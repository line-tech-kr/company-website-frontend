/**
 * Section 8: cutout PNGs for LTI-1000 + LTI-2000.
 *
 * Reads optimized PNGs from .work/lti-cutouts/ (produced by the inline
 * sips+pngquant pipeline; raw 22–67 MB sources from line-tech-files are
 * not uploaded directly).
 *
 *   pnpm tsx scripts/sync-section8-lti-cutouts.ts
 *   pnpm tsx scripts/sync-section8-lti-cutouts.ts --apply
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

const ENTRIES = [
  {
    productId: "product-lti-1000",
    file: ".work/lti-cutouts/lti-1000-cutout.png",
  },
  {
    productId: "product-lti-2000",
    file: ".work/lti-cutouts/lti-2000-cutout.png",
  },
];

async function main() {
  console.log(
    `\nsync-section8-lti-cutouts  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );
  let done = 0;
  let failed = 0;

  for (const e of ENTRIES) {
    if (!existsSync(e.file)) {
      console.error(`  MISSING ${e.file}`);
      failed++;
      continue;
    }
    const label = `${e.productId}  ← ${path.basename(e.file)}`;
    if (!isApply) {
      console.log(`  WOULD upload  ${label}`);
      done++;
      continue;
    }
    try {
      const asset = await client.assets.upload(
        "image",
        createReadStream(e.file),
        {
          filename: path.basename(e.file),
          contentType: "image/png",
        },
      );
      await client
        .patch(e.productId)
        .set({
          cutout: {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          },
        })
        .commit();
      console.log(`  upload  ${label}`);
      done++;
    } catch (err) {
      console.error(`  FAILED  ${label}:`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. ${isApply ? "uploaded" : "would-upload"}=${done}  failed=${failed}`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
