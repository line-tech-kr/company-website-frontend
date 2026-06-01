import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trimEnd();
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-01-01",
  useCdn: false,
});

const ALL_2026_SLUGS = [
  // Existing 13 (already had cutout-2026.png, just retightened)
  "m2030va",
  "m3030va",
  "ms2400va",
  "ms2500va",
  "ms2600va",
  "ms2700va",
  "ms2800va",
  "ms3150va",
  "ms3400va",
  "ms3500va",
  "ms3600va",
  "ms3700va",
  "ms3800va",
  // The 4 "renamed" slugs previously read cutout.png — now have cutout-2026.png too
  "ex70c",
  "ex70m",
  "md150c",
  "md150m",
  // New net-23 from this PR (excluding the 4 above which overlap with renamed)
  "do400",
  "ex1000c",
  "ex1000m",
  "lti-2000",
  "m2200va",
  "m3200va",
  "md30c",
  "md30m",
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
  "ms2150va",
];

async function main() {
  const ids = ALL_2026_SLUGS.map((s) => `product-${s}`);
  const docs = await client.fetch<
    { _id: string; cutout?: { asset?: { _ref: string } } | null }[]
  >(`*[_type == "product" && _id in $ids]{ _id, cutout }`, { ids });

  const foundIds = new Set(docs.map((d) => d._id));
  console.log(`Looked up ${ids.length} slugs.\n`);

  const present: string[] = [];
  const presentNoCutout: string[] = [];
  const missing: string[] = [];

  for (const slug of ALL_2026_SLUGS) {
    const id = `product-${slug}`;
    if (!foundIds.has(id)) {
      missing.push(slug);
      continue;
    }
    const doc = docs.find((d) => d._id === id)!;
    if (doc.cutout?.asset?._ref) {
      present.push(slug);
    } else {
      presentNoCutout.push(slug);
    }
  }

  console.log(`✓ ${present.length} have a doc AND cutout already:`);
  console.log("  " + present.join(", ") + "\n");
  console.log(
    `◯ ${presentNoCutout.length} have a doc but NO cutout (need upload):`,
  );
  console.log("  " + presentNoCutout.join(", ") + "\n");
  console.log(`✗ ${missing.length} have NO product-<slug> doc at all:`);
  console.log("  " + missing.join(", "));
}

main();
