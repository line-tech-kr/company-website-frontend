/**
 * Sanity migration for issue #269 — retire M2200VA / MD400C / MD400M and
 * move DO400 from "specialized" to "analogue".
 *
 *   pnpm tsx scripts/retire-skus-269.ts            # dry-run
 *   pnpm tsx scripts/retire-skus-269.ts --apply    # write to Sanity
 *
 * Steps:
 *   1. Delete product-m2200va, product-md400c, product-md400m.
 *   2. Patch product-do400: series → "analogue", crossListedSeries → ["digital"].
 *   3. Patch category-showcases: remove DO400 from the "specialized" array.
 *
 * Idempotent: deletions warn if already gone; patch on DO400 is safe to re-run.
 * Take a `sanity dataset export` backup before running with --apply.
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
    // fine in CI / Vercel
  }
}

loadEnv(".env.local");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const isApply = process.argv.includes("--apply");

function log(msg: string) {
  console.log(`  ${msg}`);
}

// ─── Step 1 — delete retired SKUs ────────────────────────────────────────────

async function step1_deleteRetiredSkus() {
  for (const id of ["product-m2200va", "product-md400c", "product-md400m"]) {
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

// ─── Step 2 — move DO400 to analogue series ───────────────────────────────────

async function step2_moveDo400ToAnalogue() {
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

// ─── Step 3 — remove DO400 from specialized showcase ─────────────────────────

async function step3_removeDo400FromSpecializedShowcase() {
  const doc = await client.fetch<{
    specialized?: Array<{ _key: string; product?: { _ref: string } }>;
  } | null>(`*[_id == "category-showcases"][0]{ specialized }`);
  if (!doc) {
    log(`skip   category-showcases doc not found`);
    return;
  }
  const current = doc.specialized ?? [];
  const next = current.filter(
    (e) => e._key !== "DO400" && e.product?._ref !== "product-do400",
  );
  if (next.length === current.length) {
    log(`skip   category-showcases.specialized: DO400 not present`);
    return;
  }
  log(
    `patch  category-showcases.specialized: remove DO400 (${current.length} → ${next.length} entries)`,
  );
  if (isApply) {
    await client
      .patch("category-showcases")
      .set({ specialized: next })
      .commit();
  }
}

async function main() {
  console.log(`\nretire-skus-269  [${isApply ? "APPLY" : "DRY RUN"}]\n`);
  console.log("Step 1 — delete M2200VA, MD400C, MD400M");
  await step1_deleteRetiredSkus();
  console.log("\nStep 2 — move DO400 to analogue series");
  await step2_moveDo400ToAnalogue();
  console.log("\nStep 3 — remove DO400 from specialized showcase");
  await step3_removeDo400FromSpecializedShowcase();
  console.log(
    `\nDone. ${isApply ? "Applied to Sanity." : "Dry-run only. Re-run with --apply to write."}\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
