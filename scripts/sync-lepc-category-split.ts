/**
 * Migrate LEPC into its own product category (#237).
 *
 * Two patches, both idempotent:
 *   1. product-lepc: series "specialized" → "lepc"
 *      + massFlowSpecs.maxPressure = "50 bar"
 *   2. categoryShowcase: remove any LEPC entries from `specialized[]`
 *      (LEPC has left the Specialized category; if it was featured there
 *       it should be re-added under the new `lepc[]` slot via Studio.)
 *
 *   pnpm tsx scripts/sync-lepc-category-split.ts             # dry-run
 *   pnpm tsx scripts/sync-lepc-category-split.ts --apply     # commit
 *
 * Safe to re-run: only writes when the current value differs from the target.
 */
import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(p: string) {
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}
loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const apply = process.argv.includes("--apply");

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN.",
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

const LEPC_ID = "product-lepc";
const SHOWCASE_ID = "category-showcases";
const MAX_PRESSURE = { display: "50 bar", value: 50, unit: "bar" };

type LepcDoc = {
  _id: string;
  series?: string;
  massFlowSpecs?: { maxPressure?: { display?: string } };
} | null;

type ShowcaseDoc = {
  _id: string;
  specialized?: Array<{ _key: string; product?: { _ref?: string } }>;
} | null;

async function patchLepc() {
  const doc = (await client.fetch<LepcDoc>(`*[_id == $id][0]`, {
    id: LEPC_ID,
  })) as LepcDoc;
  if (!doc) {
    console.log(`  ! ${LEPC_ID} not found in dataset — skipping`);
    return;
  }
  const updates: Record<string, unknown> = {};
  if (doc.series !== "lepc") {
    updates.series = "lepc";
  }
  const cur = doc.massFlowSpecs?.maxPressure?.display;
  if (cur !== MAX_PRESSURE.display) {
    updates["massFlowSpecs.maxPressure"] = MAX_PRESSURE;
  }
  if (Object.keys(updates).length === 0) {
    console.log(`  = ${LEPC_ID} already migrated`);
    return;
  }
  for (const [k, v] of Object.entries(updates)) {
    console.log(`  ~ ${LEPC_ID}  set ${k} = ${JSON.stringify(v)}`);
  }
  if (apply) {
    await client.patch(LEPC_ID).set(updates).commit();
  }
}

async function removeLepcFromSpecializedShowcase() {
  const doc = (await client.fetch<ShowcaseDoc>(`*[_id == $id][0]`, {
    id: SHOWCASE_ID,
  })) as ShowcaseDoc;
  if (!doc) {
    console.log(`  ! ${SHOWCASE_ID} not found — skipping showcase cleanup`);
    return;
  }
  const lepcKeys = (doc.specialized ?? [])
    .filter((e) => e.product?._ref === LEPC_ID)
    .map((e) => e._key);
  if (lepcKeys.length === 0) {
    console.log(`  = ${SHOWCASE_ID}.specialized has no LEPC entries`);
    return;
  }
  console.log(
    `  ~ ${SHOWCASE_ID}  remove ${lepcKeys.length} LEPC entry/entries from specialized[]`,
  );
  if (apply) {
    await client
      .patch(SHOWCASE_ID)
      .unset(lepcKeys.map((k) => `specialized[_key=="${k}"]`))
      .commit();
  }
}

async function main() {
  console.log(`Sanity ${dataset} · ${apply ? "APPLY" : "DRY RUN"}`);
  await patchLepc();
  await removeLepcFromSpecializedShowcase();
  if (!apply) console.log("\nDry run. Re-run with --apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
