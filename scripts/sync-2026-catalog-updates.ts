/**
 * Combined Sanity sync for the 2026 catalog-update bundle PR.
 * Covers the Sanity-side writes for issues #231 + #233.
 *
 *   pnpm tsx scripts/sync-2026-catalog-updates.ts            # dry-run
 *   pnpm tsx scripts/sync-2026-catalog-updates.ts --apply    # write to Sanity
 *
 * Sequence (deletes last so a mid-run abort leaves dataset recoverable):
 *   1. #231 — patch MS2500VA + MS3500VA flowRange to 100–1000 slpm.
 *   2. #233 — set crossListedSeries on DO400 to ["analogue", "digital"].
 *   3. #233 — append DO400 entry to all three category-showcases arrays.
 *   4. data drift — realign product-lepc.series to "specialized" (was "lepc",
 *      which is not a valid category and was breaking generateStaticParams
 *      for /[locale]/products/[category]/[product]).
 *   5. #231 — delete product-ms2400va and product-ms3400va.
 *
 * #238 (applications rename + fuel-cells featuredProduct) is handled entirely
 * by the static content in src/lib/content/applications.ts — no Sanity
 * application docs exist for those slugs yet. When applications move to
 * Sanity, add the corresponding patches here.
 *
 * Idempotent except for the final deletes (no-op if docs already gone).
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
    // .env.local optional
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
  apiVersion: "2026-01-01",
  useCdn: false,
});

const log = (label: string, detail?: unknown) => {
  const prefix = isApply ? "  apply  " : "  would  ";
  if (detail !== undefined) console.log(prefix + label, detail);
  else console.log(prefix + label);
};

// ─── Step 1 — MS2500/MS3500 flow range ───────────────────────────────────────

async function step1_widenMsFlowRanges() {
  const flowRange = {
    display: "100–1000 slpm",
    min: 100,
    max: 1000,
    unit: "slpm",
    referenceGas: "N2",
  };
  for (const id of ["product-ms2500va", "product-ms3500va"]) {
    log(`patch  ${id}.massFlowSpecs.flowRange → 100–1000 slpm`);
    if (isApply) {
      await client
        .patch(id)
        .set({ "massFlowSpecs.flowRange": flowRange })
        .commit();
    }
  }
}

// ─── Step 2 — DO400 crossListedSeries ────────────────────────────────────────

async function step2_crossListDo400() {
  log(`patch  product-do400.crossListedSeries = ["analogue", "digital"]`);
  if (isApply) {
    await client
      .patch("product-do400")
      .set({ crossListedSeries: ["analogue", "digital"] })
      .commit();
  }
}

// ─── Step 3 — Append DO400 to all 3 category-showcase arrays ─────────────────

async function step3_featureDo400InShowcases() {
  const DO400_CAPTION =
    "Purpose-built for fuel cell applications — RS-485 / Modbus";
  const doc = await client.fetch<{
    analogue?: Array<{ _key: string; product?: { _ref: string } }>;
    digital?: Array<{ _key: string; product?: { _ref: string } }>;
    specialized?: Array<{ _key: string; product?: { _ref: string } }>;
  } | null>(
    `*[_id == "category-showcases"][0]{ analogue, digital, specialized }`,
  );
  if (!doc) {
    console.error(
      "  ERROR  category-showcases doc not found — run seed-showcase.ts first",
    );
    return;
  }

  const buildEntry = () => ({
    _key: "DO400",
    _type: "object",
    product: { _ref: "product-do400", _type: "reference" as const },
    caption: DO400_CAPTION,
  });

  // One atomic .set() over all three arrays — partial mid-run aborts can't
  // leave the showcases doc with DO400 added to some categories but not others.
  const updates: Record<string, unknown> = {};
  for (const cat of ["analogue", "digital", "specialized"] as const) {
    const current = doc[cat] ?? [];
    const already = current.some(
      (e) => e._key === "DO400" || e.product?._ref === "product-do400",
    );
    if (already) {
      log(`skip   category-showcases.${cat}: DO400 already present`);
      continue;
    }
    const next = [...current, buildEntry()];
    log(
      `patch  category-showcases.${cat} += DO400 (${current.length} → ${next.length} entries)`,
    );
    updates[cat] = next;
  }
  if (isApply && Object.keys(updates).length > 0) {
    await client.patch("category-showcases").set(updates).commit();
  }
}

// ─── Step 4 — realign LEPC series ────────────────────────────────────────────

async function step4_fixLepcSeries() {
  const current = await client.fetch<{ series?: string } | null>(
    `*[_id == "product-lepc"][0]{ series }`,
  );
  if (!current) {
    console.error("  ERROR  product-lepc not found — skipping series realign");
    return;
  }
  if (current.series === "specialized") {
    log(`skip   product-lepc.series already "specialized"`);
    return;
  }
  log(
    `patch  product-lepc.series: "${current.series ?? "<unset>"}" → "specialized"`,
  );
  if (isApply) {
    await client.patch("product-lepc").set({ series: "specialized" }).commit();
  }
}

// ─── Step 5 — delete retired MS2400 / MS3400 ─────────────────────────────────

async function step5_deleteRetiredMsProducts() {
  for (const id of ["product-ms2400va", "product-ms3400va"]) {
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

async function main() {
  console.log(
    `\nsync-2026-catalog-updates  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );
  console.log("Step 1 — widen MS2500/MS3500 flow range");
  await step1_widenMsFlowRanges();
  console.log("\nStep 2 — set DO400.crossListedSeries");
  await step2_crossListDo400();
  console.log("\nStep 3 — feature DO400 in all 3 category-showcases");
  await step3_featureDo400InShowcases();
  console.log("\nStep 4 — realign product-lepc.series to specialized");
  await step4_fixLepcSeries();
  console.log("\nStep 5 — delete retired MS2400 / MS3400");
  await step5_deleteRetiredMsProducts();
  console.log(
    `\nDone. ${isApply ? "Applied to Sanity." : "Dry-run only. Re-run with --apply to write."}\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
