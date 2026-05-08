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

// Products with updated 2026 cutout PNGs (prefer cutout-2026.png over cutout.png)
const CUTOUT_2026 = [
  "m2030va", "m3030va",
  "ms2400va", "ms2500va", "ms2600va", "ms2700va", "ms2800va",
  "ms3150va", "ms3400va", "ms3500va", "ms3600va", "ms3700va", "ms3800va",
];

// Renamed slugs — their Sanity docs are brand new, need cutout.png uploaded
const RENAMED_NEW_CUTOUTS = ["ex70c", "ex70m", "md150c", "md150m"];

async function uploadCutout(slug: string, filename: string) {
  const filePath = path.join(PRODUCTS_DIR, slug, filename);
  if (!existsSync(filePath)) {
    console.log(`  missing  ${slug}/${filename}`);
    return;
  }

  const asset = await client.assets.upload("image", createReadStream(filePath), {
    filename: `${slug}-cutout.png`,
  });

  await client
    .patch(`product-${slug}`)
    .set({ cutout: { _type: "image", asset: { _type: "reference", _ref: asset._id } } })
    .commit();

  console.log(`  uploaded ${slug} (${filename})`);
}

async function main() {
  console.log("Uploading 2026 cutouts...");
  for (const slug of CUTOUT_2026) {
    await uploadCutout(slug, "cutout-2026.png");
  }
  for (const slug of RENAMED_NEW_CUTOUTS) {
    await uploadCutout(slug, "cutout.png");
  }
  console.log("Done.");
}

main();
