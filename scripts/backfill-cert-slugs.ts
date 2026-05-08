/**
 * One-shot backfill: assigns a `slug` to every certification document that
 * lacks one. Run once after deploying the schema change at
 * sanity/schemaTypes/certification.ts.
 *
 *   pnpm tsx scripts/backfill-cert-slugs.ts            # dry-run by default
 *   pnpm tsx scripts/backfill-cert-slugs.ts --apply    # actually write
 *
 * Slugs are looked up in KNOWN_SLUGS first (the 3 certs the /company page
 * deep-links to). Anything not in that table is auto-derived from the cert
 * name; review the dry-run output before re-running with --apply.
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

const apply = process.argv.includes("--apply");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

/**
 * Hand-curated mapping for certs the /company page references. These slugs
 * MUST equal the `id` values in src/lib/content/company.ts (verified by
 * scripts/verify-cert-slugs.ts). Anything not in this table is left for the
 * editor to slug explicitly in Studio — we deliberately don't auto-derive.
 */
const KNOWN_SLUGS: Record<string, string> = {
  "ISO 9001": "iso-9001",
  CE: "ce",
  INNOBIZ: "innobiz",
};

type CertRow = { _id: string; name: string; slug?: { current?: string } };

async function main() {
  const certs = await client.fetch<CertRow[]>(
    `*[_type == "certification"]{ _id, name, slug }`,
  );
  if (certs.length === 0) {
    console.log("No certifications found in dataset. Nothing to backfill.");
    return;
  }

  let toWrite = 0;
  let skipped = 0;
  const tx = client.transaction();

  for (const cert of certs) {
    const existing = cert.slug?.current;
    if (existing) {
      skipped++;
      continue;
    }
    const slug = KNOWN_SLUGS[cert.name];
    if (!slug) {
      console.warn(
        `! ${cert._id} "${cert.name}" — not in KNOWN_SLUGS; assign slug manually in Studio`,
      );
      continue;
    }
    console.log(`+ ${cert._id} "${cert.name}" → "${slug}"`);
    tx.patch(cert._id, (p) =>
      p.set({ slug: { _type: "slug", current: slug } }),
    );
    toWrite++;
  }

  console.log(
    `\n${toWrite} cert(s) to update, ${skipped} already had a slug, ${certs.length} total.`,
  );

  if (!apply) {
    console.log("Dry run. Re-run with --apply to commit.");
    return;
  }
  if (toWrite === 0) {
    console.log("Nothing to write.");
    return;
  }
  await tx.commit();
  console.log("Committed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
