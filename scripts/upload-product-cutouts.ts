import { readFileSync, createReadStream, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

function loadEnv(filePath: string) {
  try {
    for (const line of readFileSync(filePath, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {
    // .env.local may not exist in CI
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

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const PRODUCTS_DIR = path.join(process.cwd(), "public/products");

function findCutoutSlugs(): string[] {
  const slugs: string[] = [];
  for (const entry of readdirSync(PRODUCTS_DIR)) {
    const dir = path.join(PRODUCTS_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const cutoutPath = path.join(dir, "cutout.png");
    try {
      if (statSync(cutoutPath).isFile()) slugs.push(entry);
    } catch {
      // no cutout for this slug — skip silently
    }
  }
  return slugs.sort();
}

async function uploadCutout(
  slug: string,
): Promise<"uploaded" | "skipped" | "missing"> {
  const docId = `product-${slug}`;
  const doc = await client.getDocument<{ cutout?: unknown }>(docId);
  if (!doc) {
    console.log(`  no doc   ${slug}`);
    return "missing";
  }

  if (!force && doc.cutout) {
    console.log(`  skipped  ${slug} (already has cutout)`);
    return "skipped";
  }

  const filePath = path.join(PRODUCTS_DIR, slug, "cutout.png");
  const asset = await client.assets.upload(
    "image",
    createReadStream(filePath),
    { filename: `${slug}-cutout.png` },
  );

  await client
    .patch(docId)
    .set({
      cutout: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      },
    })
    .commit();

  console.log(`  uploaded ${slug}`);
  return "uploaded";
}

async function main() {
  const slugs = findCutoutSlugs();
  console.log(
    `Uploading product cutouts → ${projectId}/${dataset} (${slugs.length} cutouts on disk, force=${force})`,
  );

  const counts = { uploaded: 0, skipped: 0, missing: 0, failed: 0 };
  for (const slug of slugs) {
    try {
      const result = await uploadCutout(slug);
      counts[result]++;
    } catch (err) {
      console.error(`  FAILED   ${slug}:`, err);
      counts.failed++;
    }
  }

  console.log(
    `\nDone. ${counts.uploaded} uploaded, ${counts.skipped} skipped, ${counts.missing} missing-doc, ${counts.failed} failed.`,
  );
  if (counts.failed > 0) process.exit(1);
}

main();
