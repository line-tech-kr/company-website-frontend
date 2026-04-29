import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";

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

if (!projectId || !dataset) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

type Row = { model: string };

async function main() {
  const rows = await client.fetch<Row[]>(
    `*[_type == "product"]{ model } | order(model asc)`,
  );

  const inSanity = new Set(rows.map((r) => r.model));
  const expected = new Set(ALL_PRODUCTS.map((p) => p.model));

  const missing = [...expected].filter((m) => !inSanity.has(m)).sort();
  const extra = [...inSanity].filter((m) => !expected.has(m)).sort();

  console.log(`Sanity product count: ${rows.length}`);
  console.log(`Fixture product count: ${ALL_PRODUCTS.length}`);

  if (missing.length) {
    console.log(
      `\nMissing in Sanity (${missing.length}): ${missing.join(", ")}`,
    );
  }
  if (extra.length) {
    console.log(`\nExtra in Sanity (${extra.length}): ${extra.join(", ")}`);
  }

  if (
    rows.length === ALL_PRODUCTS.length &&
    missing.length === 0 &&
    extra.length === 0
  ) {
    console.log("\nSanity is current. No seed needed.");
    process.exit(0);
  }

  console.log(
    "\nSanity is out of sync. Run: pnpm tsx scripts/seed-products.ts --force",
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
