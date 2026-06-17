/**
 * Sanity data fix for #268 — power-supply spec formatting.
 *
 *   pnpm tsx scripts/sync-supply-power-format.ts            # dry-run
 *   pnpm tsx scripts/sync-supply-power-format.ts --apply    # write to Sanity
 *
 * The supply-power range was seeded with the English word "or"
 * ("+15 or +24 Vdc, 350 mA"), which localizeSpecValue then rewrites to
 * "또는" / "或" — reading as a false either/or when +15–+24 V is a continuous
 * range. This patches every product's massFlowSpecs.supplyPower.display to the
 * range form ("+15 ~ +24 Vdc, 350 mA"). The committed seed source
 * (src/lib/fixtures/products.json) is fixed in the same PR; this brings the
 * live dataset in line.
 *
 * Idempotent: queries only docs that still contain " or " and rewrites just
 * that token, so a re-run is a no-op.
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

// Rewrite the " or " range separator to " ~ " — leaves any other content
// (voltages, "Vdc", current) untouched so the fix is purely the separator.
const toRange = (display: string) => display.replace(/\s+or\s+/g, " ~ ");

async function main() {
  console.log(
    `\nsync-supply-power-format  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  const docs = await client.fetch<Array<{ _id: string; display: string }>>(
    `*[_type == "product" && defined(massFlowSpecs.supplyPower.display) &&
       massFlowSpecs.supplyPower.display match "* or *"]{
       _id, "display": massFlowSpecs.supplyPower.display }`,
  );

  if (docs.length === 0) {
    console.log(
      '  Nothing to patch — no supplyPower.display contains " or ".\n',
    );
    return;
  }

  for (const { _id, display } of docs) {
    const next = toRange(display);
    log(
      `patch  ${_id}.massFlowSpecs.supplyPower.display`,
      `"${display}" → "${next}"`,
    );
    if (isApply) {
      await client
        .patch(_id)
        .set({ "massFlowSpecs.supplyPower.display": next })
        .commit();
    }
  }

  console.log(
    `\nDone. ${docs.length} product(s). ${
      isApply
        ? "Applied to Sanity."
        : "Dry-run only. Re-run with --apply to write."
    }\n`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
