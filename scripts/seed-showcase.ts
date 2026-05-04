import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

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
  console.error("Missing env vars.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const FEATURED: Record<string, { model: string; caption: string }[]> = {
  analogue: [
    { model: "M3030VA", caption: "±0.5% F.S. accuracy" },
    { model: "MS3700VA", caption: "5–3,000 sccm flow range" },
    { model: "M2030VA", caption: "Sub-200 ms response time" },
  ],
  digital: [
    { model: "MD30C", caption: "8-point linearization, RS-485 / Modbus RTU" },
    { model: "MD100C", caption: "±0.25% F.S. accuracy" },
    { model: "MD400C", caption: "High-flow digital mass flow control" },
  ],
  specialized: [
    { model: "LD030C", caption: "Display-integrated mass flow controller" },
    { model: "LM030C", caption: "Display-integrated mass flow meter" },
  ],
};

async function run() {
  // Fetch all product IDs keyed by model
  const products: { _id: string; model: string }[] = await client.fetch(
    `*[_type == "product"]{ _id, model }`,
  );
  const byModel = Object.fromEntries(
    products.map((p) => [p.model.toUpperCase(), p._id]),
  );

  function toEntries(items: { model: string; caption: string }[]) {
    return items.flatMap(({ model, caption }) => {
      const id = byModel[model.toUpperCase()];
      if (!id) {
        console.warn(`  ⚠ product not found: ${model}`);
        return [];
      }
      return [
        {
          _type: "object",
          _key: model,
          product: { _type: "reference", _ref: id },
          caption,
        },
      ];
    });
  }

  const doc = {
    _id: "category-showcases",
    _type: "categoryShowcase",
    analogue: toEntries(FEATURED.analogue),
    digital: toEntries(FEATURED.digital),
    specialized: toEntries(FEATURED.specialized),
  };

  await client.createOrReplace(doc);
  console.log("✓ category-showcases created/updated");
  for (const [cat, entries] of Object.entries(doc)) {
    if (Array.isArray(entries))
      console.log(`  ${cat}: ${entries.length} featured`);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
