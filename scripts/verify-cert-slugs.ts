/**
 * Asserts that every certification id referenced by src/lib/content/company.ts
 * exists as a `slug` on a certification document in Sanity. Exits non-zero on
 * mismatch — wire this into CI before deploy if you want hard enforcement.
 *
 *   pnpm tsx scripts/verify-cert-slugs.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { LT_COMPANY } from "../src/lib/content/company";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  useCdn: false,
});

async function main() {
  const certs = await client.fetch<{ slug: string | null }[]>(
    `*[_type == "certification"]{ "slug": slug.current }`,
  );
  const sanitySlugs = new Set(
    certs.map((c) => c.slug).filter((s): s is string => Boolean(s)),
  );

  // The featured ids are identical across locales — just read en.
  const featured = LT_COMPANY.en.certifications.named.map((c) => c.id);
  const missing = featured.filter((id) => !sanitySlugs.has(id));

  if (missing.length === 0) {
    console.log(
      `OK — all ${featured.length} featured cert id(s) found in Sanity (${sanitySlugs.size} total certs).`,
    );
    return;
  }

  console.error("FAIL — featured cert ids missing as slugs in Sanity:");
  for (const id of missing) console.error(`  - ${id}`);
  console.error(
    `\nFix by adding/renaming a cert with slug "${missing[0]}" in Sanity Studio,`,
  );
  console.error(
    `or update the corresponding entry in src/lib/content/company.ts.`,
  );
  process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
