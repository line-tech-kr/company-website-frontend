/**
 * One-shot backfill: removes the legacy `ip` field from every existing
 * `contactSubmission` document in Sanity.
 *
 * The `ip` field was dropped from the schema in PR #149 to align stored
 * data with the privacy policy's disclosed collection items. Records
 * created before that PR still carry IPs in the doc store; this script
 * strips them.
 *
 * Run:  pnpm tsx scripts/strip-contact-ip.ts
 * Re-running is idempotent — `unset` is a no-op on records without the field.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-01-01",
  useCdn: false,
  token,
});

type Row = { _id: string; ip?: string };

async function main() {
  const rows = await client.fetch<Row[]>(
    `*[_type == "contactSubmission"]{ _id, ip }`,
  );

  const withIp = rows.filter((r) => typeof r.ip === "string" && r.ip.length);

  console.log(`Found ${rows.length} contactSubmission records.`);
  console.log(`${withIp.length} carry an \`ip\` field.`);

  if (withIp.length === 0) {
    console.log("Nothing to strip.");
    return;
  }

  const tx = client.transaction();
  for (const r of withIp) {
    tx.patch(r._id, (p) => p.unset(["ip"]));
  }

  const result = await tx.commit();
  console.log(`Stripped ip from ${result.results.length} records.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
