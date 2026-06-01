/**
 * Backfill `slot` on ROU `instrumentSpecs` items by canonical label match.
 *
 *   pnpm tsx scripts/sync-readout-slots.ts            # dry-run
 *   pnpm tsx scripts/sync-readout-slots.ts --apply    # write
 *
 * Idempotent: rows that already carry a `slot` are left untouched.
 * Unmatched labels are logged so we can spot label drift in prod.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(p: string) {
  try {
    for (const l of readFileSync(p, "utf-8").split("\n")) {
      const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {}
}
loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
const isApply = process.argv.includes("--apply");

if (!projectId || !dataset) {
  console.error("Missing project/dataset env");
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

type Slot = "display" | "power" | "communication" | "connector";

// Canonical English label → readout column slot. Keep keys lowercased for
// case-insensitive matching against existing Sanity data.
const LABEL_TO_SLOT: Record<string, Slot> = {
  "display window": "display",
  display: "display",
  "input power": "power",
  "power supply": "power",
  communication: "communication",
  "remote control": "connector",
  connector: "connector",
};

interface InstrumentSpec {
  _key: string;
  label: string;
  value: string;
  slot?: Slot | null;
}

interface RouProduct {
  _id: string;
  model: string;
  instrumentSpecs: InstrumentSpec[] | null;
}

async function main() {
  console.log(`\nsync-readout-slots  [${isApply ? "APPLY" : "DRY RUN"}]\n`);

  const products = await client.fetch<RouProduct[]>(
    `*[_type == "product" && function == "ROU"]{
      _id, model,
      instrumentSpecs[]{ _key, label, value, slot }
    }`,
  );

  let patched = 0;
  let alreadyTagged = 0;
  let unmatched = 0;

  for (const p of products) {
    const specs = p.instrumentSpecs ?? [];
    const patch: Record<string, Slot> = {};

    for (const spec of specs) {
      if (spec.slot) {
        alreadyTagged++;
        continue;
      }
      const slot = LABEL_TO_SLOT[spec.label.trim().toLowerCase()];
      if (!slot) {
        // Most rows legitimately don't map to a column slot (Output Signal,
        // Setpoint, etc.). Only warn for labels that look like they should.
        continue;
      }
      patch[`instrumentSpecs[_key=="${spec._key}"].slot`] = slot;
    }

    // Log labels that suggest a slot but didn't match a canonical key, in
    // case prod data has drifted.
    for (const spec of specs) {
      if (spec.slot) continue;
      const lower = spec.label.trim().toLowerCase();
      if (LABEL_TO_SLOT[lower]) continue;
      if (/display|power|communication|connector|remote/.test(lower)) {
        console.warn(
          `  unmatched candidate  ${p.model}  "${spec.label}" — add to LABEL_TO_SLOT if it should be a column`,
        );
        unmatched++;
      }
    }

    const entries = Object.entries(patch);
    if (entries.length === 0) {
      console.log(`  noop   ${p.model}  (already tagged or no matches)`);
      continue;
    }

    const summary = entries
      .map(([path, slot]) => `${path.split('"').slice(-2, -1)[0]?.slice(0, 8)}→${slot}`)
      .join(", ");

    if (!isApply) {
      console.log(`  WOULD  ${p.model}  ${entries.length} slot(s)  ${summary}`);
      patched += entries.length;
      continue;
    }

    let txn = client.patch(p._id);
    for (const [path, slot] of entries) {
      txn = txn.set({ [path]: slot });
    }
    await txn.commit();
    console.log(`  patch  ${p.model}  ${entries.length} slot(s)`);
    patched += entries.length;
  }

  console.log(
    `\nDone. ${isApply ? "patched" : "would-patch"}=${patched}  alreadyTagged=${alreadyTagged}  unmatched=${unmatched}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
