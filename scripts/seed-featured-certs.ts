/**
 * One-shot: seeds the 3 featured certifications (ISO 9001 / CE / INNOBIZ)
 * into Sanity using the data already hardcoded in src/lib/content/company.ts.
 * Idempotent — uses createIfNotExists keyed on a stable _id, so re-runs no-op
 * once the docs exist.
 *
 *   pnpm tsx scripts/seed-featured-certs.ts            # dry-run
 *   pnpm tsx scripts/seed-featured-certs.ts --apply    # commit
 *
 * The remaining 10 certs (RoHS, REACH, etc.) are NOT seeded — they need
 * their own copy and PDF assets that don't exist in this repo yet.
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { LT_COMPANY } from "../src/lib/content/company";

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

type IntlEntry = {
  _key: string;
  _type: "internationalizedArrayStringValue";
  language: "ko" | "en" | "zh";
  value: string;
};

function intl(ko: string, en: string, zh: string): IntlEntry[] {
  return [
    {
      _key: "ko",
      _type: "internationalizedArrayStringValue",
      language: "ko",
      value: ko,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: en,
    },
    {
      _key: "zh",
      _type: "internationalizedArrayStringValue",
      language: "zh",
      value: zh,
    },
  ];
}

function buildDocs() {
  const ko = LT_COMPANY.ko.certifications.named;
  const en = LT_COMPANY.en.certifications.named;
  const zh = LT_COMPANY.zh.certifications.named;

  if (ko.length !== en.length || ko.length !== zh.length) {
    throw new Error(
      `Cert array length mismatch across locales: ko=${ko.length}, en=${en.length}, zh=${zh.length}`,
    );
  }

  return ko.map((k, i) => {
    const e = en[i];
    const z = zh[i];
    if (k.id !== e.id || k.id !== z.id) {
      throw new Error(
        `Cert ordering mismatch across locales at index ${i}: ko=${k.id}, en=${e.id}, zh=${z.id}`,
      );
    }
    return {
      _id: `cert-${k.id}`,
      _type: "certification" as const,
      name: k.name,
      slug: { _type: "slug" as const, current: k.id },
      issuer: intl(k.issuer, e.issuer, z.issuer),
      scope: intl(k.blurb, e.blurb, z.blurb),
      order: i + 1,
    };
  });
}

async function main() {
  const docs = buildDocs();

  console.log(`Will seed ${docs.length} certification(s):`);
  for (const d of docs) {
    console.log(
      `  + ${d._id}  name="${d.name}"  slug="${d.slug.current}"  order=${d.order}`,
    );
  }

  if (!apply) {
    console.log("\nDry run. Re-run with --apply to commit.");
    return;
  }

  const tx = client.transaction();
  for (const d of docs) tx.createIfNotExists(d);
  const res = await tx.commit();
  console.log(
    `\nCommitted. ${res.results.length} document operation(s) (createIfNotExists no-ops if doc already exists).`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
