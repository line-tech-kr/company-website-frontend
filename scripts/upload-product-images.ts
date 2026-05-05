import { readFileSync, createReadStream } from "node:fs";
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

type ManifestImage = { path: string; kind: "product" | "editor" };
type ManifestProduct = { model: string; slug: string; images: ManifestImage[] };
type Manifest = { products: ManifestProduct[] };

const manifest = JSON.parse(
  readFileSync(
    path.join(process.cwd(), "public/products/_manifest.json"),
    "utf-8",
  ),
) as Manifest;

async function uploadProduct(p: ManifestProduct): Promise<void> {
  const docId = `product-${p.slug}`;

  if (!force) {
    const doc = await client.getDocument<{ images?: unknown[] }>(docId);
    if (doc?.images && doc.images.length > 0) {
      console.log(`  skipped  ${p.model} (already has images)`);
      return;
    }
  }

  if (!p.images || p.images.length === 0) {
    console.log(`  no imgs  ${p.model}`);
    return;
  }

  // product images first, then editor
  const sorted = [...p.images].sort((a, b) => {
    if (a.kind === b.kind) return a.path.localeCompare(b.path);
    return a.kind === "product" ? -1 : 1;
  });

  const imageRefs: Array<{
    _type: "image";
    _key: string;
    asset: { _type: "reference"; _ref: string };
  }> = [];

  for (const img of sorted) {
    const filePath = path.join(process.cwd(), "public", img.path);
    const filename = path.basename(img.path);
    const asset = await client.assets.upload(
      "image",
      createReadStream(filePath),
      { filename },
    );
    imageRefs.push({
      _type: "image",
      _key: asset._id,
      asset: { _type: "reference", _ref: asset._id },
    });
  }

  await client.patch(docId).set({ images: imageRefs }).commit();
  console.log(
    `  uploaded ${p.model} (${imageRefs.length} image${imageRefs.length === 1 ? "" : "s"})`,
  );
}

async function main() {
  const products = manifest.products;
  console.log(
    `Uploading product images → ${projectId}/${dataset} (${products.length} products, force=${force})`,
  );

  let ok = 0;
  let failed = 0;
  for (const product of products) {
    try {
      await uploadProduct(product);
      ok++;
    } catch (err) {
      console.error(`  FAILED   ${product.model}:`, err);
      failed++;
    }
  }

  console.log(`\nDone. ${ok} ok, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
