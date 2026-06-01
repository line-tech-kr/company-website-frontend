/**
 * Tag the 3 EX-related certs with the products they actually certify.
 *
 *   cert-kcs-ex70                 → [EX70C, EX70M]
 *   cert-kcs-ex1000               → [EX1000C, EX1000M]
 *   cert-iecex-kscp-21-0022x      → [EX70C, EX70M, EX1000C, EX1000M]
 *
 *   pnpm tsx scripts/sync-section10-ex-cert-models.ts            # dry-run
 *   pnpm tsx scripts/sync-section10-ex-cert-models.ts --apply    # commit
 *
 * Idempotent — sets `models` and is safe to re-run.
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

const PATCHES: Array<{ id: string; models: string[] }> = [
  { id: "cert-kcs-ex70", models: ["EX70C", "EX70M"] },
  { id: "cert-kcs-ex1000", models: ["EX1000C", "EX1000M"] },
  {
    id: "cert-iecex-kscp-21-0022x",
    models: ["EX70C", "EX70M", "EX1000C", "EX1000M"],
  },
];

async function main() {
  console.log(`Sanity ${dataset} · ${apply ? "APPLY" : "DRY RUN"}`);
  for (const p of PATCHES) {
    console.log(`  ~ ${p.id}  models=[${p.models.join(", ")}]`);
    if (apply) await client.patch(p.id).set({ models: p.models }).commit();
  }
  if (!apply) console.log("\nDry run. Re-run with --apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
