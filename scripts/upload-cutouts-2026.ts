import { readFileSync, createReadStream, existsSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trimEnd();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const PRODUCTS_DIR = path.join(process.cwd(), "public/products");

// Slugs to upload in this run: the 23 cutouts newly added by the 2026 batch.
// Excludes the 13 previously-shipped cutouts (m2030va, m3030va, ms2400-2800va,
// ms3150-3800va) whose Sanity assets already match the designer-cropped
// versions in main — re-uploading would just create duplicate assets.
const CUTOUT_2026 = [
  // MFC/MFM standard — shared-body pairs
  "m2200va",
  "m3200va",
  // EX explosion-proof variants
  "ex70c",
  "ex70m",
  "ex1000c",
  "ex1000m",
  // DO400 digital outlet
  "do400",
  // LTI read-out unit
  "lti-2000",
  // MD digital MFC/MFM family
  "md30c",
  "md30m",
  "md150c",
  "md150m",
  "md400c",
  "md400m",
  "md500c",
  "md500m",
  "md600c",
  "md600m",
  "md700c",
  "md700m",
  "md800c",
  "md800m",
  // MS specialized series — only the new MS2150 (rest unchanged)
  "ms2150va",
];

async function uploadCutout(slug: string, filename: string) {
  const filePath = path.join(PRODUCTS_DIR, slug, filename);
  if (!existsSync(filePath)) {
    console.log(`  missing  ${slug}/${filename}`);
    return;
  }

  const asset = await client.assets.upload(
    "image",
    createReadStream(filePath),
    {
      filename: `${slug}-cutout.png`,
    },
  );

  await client
    .patch(`product-${slug}`)
    .set({
      cutout: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log(`  uploaded ${slug} (${filename})`);
}

async function main() {
  console.log(`Uploading ${CUTOUT_2026.length} 2026 cutouts...`);
  for (const slug of CUTOUT_2026) {
    await uploadCutout(slug, "cutout-2026.png");
  }
  console.log("Done.");
}

main();
