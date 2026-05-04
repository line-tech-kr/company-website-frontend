import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";
import type { LocalizedString, Product } from "../src/lib/types/product";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
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

function productToSeedFields(p: Product) {
  const fields: Record<string, unknown> = {
    model: p.model,
    slug: p.slug,
    series: p.series,
    function: p.function,
    productLabel: localizedToArray(p.productLabel),
    ...(p.description ? { description: p.description } : {}),
    features: p.features.map((f, i) => ({ ...f, _key: `feature-${i}` })),
    connections: p.connections.map((c, i) => ({ ...c, _key: `conn-${i}` })),
    massFlowSpecs: p.massFlowSpecs,
  };
  if (p.digitalCommunication) {
    fields.digitalCommunication = p.digitalCommunication;
  }
  return fields;
}

async function main() {
  console.log(
    `Seeding ${ALL_PRODUCTS.length} products → ${projectId}/${dataset} (force=${force})`,
  );

  for (const product of ALL_PRODUCTS) {
    const _id = `product-${product.slug.current}`;
    const fields = productToSeedFields(product);
    try {
      await client.createIfNotExists({
        _id,
        _type: "product",
        ...fields,
      } as Parameters<typeof client.createIfNotExists>[0]);
      if (force) {
        await client.patch(_id).set(fields).commit();
        console.log(`  patched  ${product.model}`);
      } else {
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
