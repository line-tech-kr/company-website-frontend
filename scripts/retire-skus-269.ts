/**
 * Sanity migration for issue #269 — retire M2200VA / MD400C / MD400M and
 * move DO400 from "specialized" to "analogue".
 *
 *   pnpm tsx scripts/retire-skus-269.ts            # dry-run
 *   pnpm tsx scripts/retire-skus-269.ts --apply    # write to Sanity
 *
 * Steps (showcase refs cleared first so the deletes don't hit referential
 * integrity errors):
 *   1. Patch category-showcases: drop retired-SKU refs from every array and
 *      drop DO400 from the "specialized" array.
 *   2. Delete product-m2200va, product-md400c, product-md400m.
 *   3. Patch product-do400: series → "analogue", crossListedSeries → ["digital"].
 *
 * Idempotent: deletions warn if already gone; showcase + DO400 patches are
 * safe to re-run. Take a `sanity dataset export` backup before --apply.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(p: string) {
  try {
    for (const line of readFileSync(p, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {
    // .env.local optional — injected directly in CI / Vercel
  }
}
loadEnv(".env.local");

const isApply = process.argv.includes("--apply");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET",
  );
  process.exit(1);
}
if (isApply && !token) {
  console.error("--apply requires SANITY_WRITE_TOKEN");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const RETIRED_IDS = ["product-m2200va", "product-md400c", "product-md400m"];

function log(msg: string) {
  console.log(`  ${msg}`);
}

// ─── Step 1 — clear category-showcase references ─────────────────────────────
// Strips the retired SKUs from every showcase array and DO400 from the
// "specialized" array, in one fetch + one patch. Must run before the deletes:
// Sanity refuses to delete a doc that is still referenced.

async function step1_clearShowcaseRefs() {
  const retired = new Set(RETIRED_IDS);
  const doc = await client.fetch<{
    analogue?: Array<{ _key: string; product?: { _ref: string } }>;
    digital?: Array<{ _key: string; product?: { _ref: string } }>;
    specialized?: Array<{ _key: string; product?: { _ref: string } }>;
  } | null>(
    `*[_id == "category-showcases"][0]{ analogue, digital, specialized }`,
  );
  if (!doc) {
    log(`skip   category-showcases doc not found`);
    return;
  }
  const updates: Record<string, unknown> = {};
  for (const cat of ["analogue", "digital", "specialized"] as const) {
    const current = doc[cat] ?? [];
    const next = current.filter((e) => {
      const ref = e.product?._ref ?? "";
      if (retired.has(ref)) return false;
      // DO400 only leaves the specialized array; it stays in analogue/digital.
      if (
        cat === "specialized" &&
        (e._key === "DO400" || ref === "product-do400")
      )
        return false;
      return true;
    });
    if (next.length < current.length) {
      log(
        `patch  category-showcases.${cat}: ${current.length} → ${next.length} entries`,
      );
      updates[cat] = next;
    }
  }
  if (Object.keys(updates).length === 0) {
    log(`skip   category-showcases: nothing to remove`);
    return;
  }
  if (isApply) {
    await client.patch("category-showcases").set(updates).commit();
  }
}

// ─── Step 2 — delete retired SKUs ────────────────────────────────────────────

async function step2_deleteRetiredSkus() {
  for (const id of RETIRED_IDS) {
    log(`delete ${id}`);
    if (isApply) {
      try {
        await client.delete(id);
      } catch (err) {
        console.warn(`  warn   could not delete ${id}:`, err);
      }
    }
  }
}

// ─── Step 3 — move DO400 to analogue series ──────────────────────────────────

async function step3_moveDo400ToAnalogue() {
  log(
    `patch  product-do400: series → "analogue", crossListedSeries → ["digital"]`,
  );
  if (isApply) {
    await client
      .patch("product-do400")
      .set({ series: "analogue", crossListedSeries: ["digital"] })
      .commit();
  }
}

async function main() {
  console.log(`\nretire-skus-269  [${isApply ? "APPLY" : "DRY RUN"}]\n`);
  console.log("Step 1 — clear category-showcase references");
  await step1_clearShowcaseRefs();
  console.log("\nStep 2 — delete M2200VA, MD400C, MD400M");
  await step2_deleteRetiredSkus();
  console.log("\nStep 3 — move DO400 to analogue series");
  await step3_moveDo400ToAnalogue();
  console.log(
    `\nDone. ${isApply ? "Applied to Sanity." : "Dry-run only. Re-run with --apply to write."}\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
