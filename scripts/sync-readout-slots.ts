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
      if (m) {
        const value = m[2].trimEnd().replace(/^['"]|['"]$/g, "");
        process.env[m[1]] ??= value;
      }
    }
  } catch (err) {
    // Missing .env.local is fine; surface anything else.
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }
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

// Canonical English label → readout column slot. Keys are lowercased for
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

// Sanity-generated _keys are URL-safe nanoids. Anything else came from a
// non-standard import path and we won't risk it in a query-path literal.
const SAFE_KEY = /^[A-Za-z0-9_-]+$/;

// Build the unmatched-warning keyword set from the map keys so adding a new
// slot to LABEL_TO_SLOT automatically updates the warning heuristic.
const SLOT_KEYWORDS = new Set(
  Object.keys(LABEL_TO_SLOT).flatMap((k) => k.split(/\s+/)),
);

// Labels that share a slot keyword but legitimately aren't column candidates.
// Suppresses noise on every ROU product. Update if a new label drifts in.
const KNOWN_NON_SLOT_LABELS = new Set([
  "output power",
  "display repeatability",
  "units of display",
]);

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

interface PendingPatch {
  key: string;
  slot: Slot;
  path: string;
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
  let skippedBadKey = 0;

  for (const p of products) {
    const specs = p.instrumentSpecs ?? [];
    const pending: PendingPatch[] = [];

    for (const spec of specs) {
      if (spec.slot) {
        alreadyTagged++;
        continue;
      }
      const slot = LABEL_TO_SLOT[spec.label.trim().toLowerCase()];
      if (!slot) continue;
      if (!spec._key || !SAFE_KEY.test(spec._key)) {
        console.warn(
          `  bad-key  ${p.model}  "${spec.label}" has _key=${JSON.stringify(spec._key)}; skipping`,
        );
        skippedBadKey++;
        continue;
      }
      pending.push({
        key: spec._key,
        slot,
        path: `instrumentSpecs[_key=="${spec._key}"].slot`,
      });
    }

    // Surface labels that look like they should map to a slot but don't.
    for (const spec of specs) {
      if (spec.slot) continue;
      const lower = spec.label.trim().toLowerCase();
      if (LABEL_TO_SLOT[lower]) continue;
      if (KNOWN_NON_SLOT_LABELS.has(lower)) continue;
      const words = lower.split(/\s+/);
      if (words.some((w) => SLOT_KEYWORDS.has(w))) {
        console.warn(
          `  unmatched candidate  ${p.model}  "${spec.label}" — add to LABEL_TO_SLOT if it should be a column`,
        );
        unmatched++;
      }
    }

    if (pending.length === 0) {
      console.log(`  noop   ${p.model}  (already tagged or no matches)`);
      continue;
    }

    const summary = pending.map((e) => `${e.key}→${e.slot}`).join(", ");

    if (!isApply) {
      console.log(`  WOULD  ${p.model}  ${pending.length} slot(s)  ${summary}`);
      patched += pending.length;
      continue;
    }

    try {
      const patchSet = Object.fromEntries(
        pending.map((e) => [e.path, e.slot] as const),
      );
      await client.patch(p._id).set(patchSet).commit();
      console.log(`  patch  ${p.model}  ${pending.length} slot(s)  ${summary}`);
      patched += pending.length;
    } catch (err) {
      const e = err as Error & { response?: { statusCode?: number } };
      console.error(
        `  FAILED  ${p.model}  ${e.message} (status ${e.response?.statusCode ?? "?"})`,
      );
      throw err;
    }
  }

  console.log(
    `\nDone. ${isApply ? "patched" : "would-patch"}=${patched}  alreadyTagged=${alreadyTagged}  unmatched=${unmatched}  skippedBadKey=${skippedBadKey}`,
  );
}

main().catch((err) => {
  const e = err as Error & { response?: { statusCode?: number } };
  console.error(
    `fatal: ${e.message} (status ${e.response?.statusCode ?? "?"})`,
  );
  process.exit(1);
});
