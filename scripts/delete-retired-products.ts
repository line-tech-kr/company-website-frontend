import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

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

async function main() {
  // 1. Replace retired specialized entries with EX70C/LEPC
  await client
    .patch("category-showcases")
    .set({
      specialized: [
        {
          _key: "EX70C",
          _type: "object",
          caption: "Ex-proof, IP 65 — for hazardous environments",
          product: { _ref: "product-ex70c", _type: "reference" },
        },
        {
          _key: "LEPC",
          _type: "object",
          caption: "Low-pressure precision control, 0.1–6 barA",
          product: { _ref: "product-lepc", _type: "reference" },
        },
      ],
    })
    .commit();
  console.log("  patched  category-showcases.specialized");

  // 2. Update the stale md100c → md150c ref in digital
  const doc = await client.fetch<{
    digital: { _key: string; caption: string; product: { _ref: string } }[];
  }>(`*[_id == "category-showcases"][0]{ digital }`);

  const updatedDigital = doc.digital.map((item) =>
    item.product._ref === "product-md100c"
      ? {
          ...item,
          _key: "MD150C",
          product: { _ref: "product-md150c", _type: "reference" },
        }
      : item,
  );

  await client
    .patch("category-showcases")
    .set({ digital: updatedDigital })
    .commit();
  console.log("  patched  category-showcases.digital");

  // 3. Delete the now-unreferenced retired docs
  for (const slug of ["ld030c", "lm030c"]) {
    await client.delete(`product-${slug}`);
    console.log(`  deleted  product-${slug}`);
  }
}

main();
