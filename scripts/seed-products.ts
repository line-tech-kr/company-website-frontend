import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";
import type {
  LocalizedString,
  Product,
} from "../src/lib/types/product";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2];
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

function localizedToArray(loc: LocalizedString) {
  return [
    { _key: "ko", language: "ko", value: loc.ko },
    { _key: "en", language: "en", value: loc.en },
    { _key: "zh", language: "zh", value: loc.zh },
  ];
}

function productToDoc(p: Product) {
  const doc: Record<string, unknown> = {
    _id: `product-${p.slug.current}`,
    _type: "product",
    model: p.model,
    slug: p.slug,
    series: p.series,
    function: p.function,
    productLabel: localizedToArray(p.productLabel),
    features: p.features.map((f, i) => ({ _key: `feature-${i}`, ...f })),
    connections: p.connections.map((c, i) => ({ _key: `conn-${i}`, ...c })),
    massFlowSpecs: p.massFlowSpecs,
  };
  if (p.digitalCommunication) {
    doc.digitalCommunication = p.digitalCommunication;
  }
  return doc;
}

async function main() {
  console.log(
    `Seeding ${ALL_PRODUCTS.length} products → ${projectId}/${dataset} (force=${force})`,
  );

  for (const product of ALL_PRODUCTS) {
    const doc = productToDoc(product);
    try {
      if (force) {
        await client.createOrReplace(doc as Parameters<typeof client.createOrReplace>[0]);
        console.log(`  replaced ${product.model}`);
      } else {
        await client.createIfNotExists(doc as Parameters<typeof client.createIfNotExists>[0]);
        console.log(`  ensured  ${product.model}`);
      }
    } catch (err) {
      console.error(`  FAILED   ${product.model}:`, err);
      process.exit(1);
    }
  }

  console.log("Done.");
}

main();
