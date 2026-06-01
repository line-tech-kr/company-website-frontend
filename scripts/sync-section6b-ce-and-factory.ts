/**
 * Section 6b: cert fix-up missed in section 6.
 *
 * - Attach `라인텍_CE인증서_R.pdf` to existing cert-ce
 * - Create cert-factory-registration record with `공장등록증.pdf`
 *
 *   pnpm tsx scripts/sync-section6b-ce-and-factory.ts
 *   pnpm tsx scripts/sync-section6b-ce-and-factory.ts --apply
 */
import { readFileSync, createReadStream, existsSync } from "node:fs";
import path from "node:path";
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
  console.error("Missing env");
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

const CERTS =
  "/Users/bspark/Dev/working/line-tech-files/organized/shared/certificates";

function intl(ko: string, en: string, zh: string) {
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

async function uploadPdf(filePath: string) {
  const asset = await client.assets.upload("file", createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: "application/pdf",
  });
  return { _type: "reference" as const, _ref: asset._id };
}

async function main() {
  console.log(
    `\nsync-section6b-ce-and-factory  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  // --- 1. Attach CE PDF ---
  const cePath = path.join(CERTS, "CE/라인텍_CE인증서_R.pdf");
  console.log("  -- attach CE PDF --");
  if (!existsSync(cePath)) {
    console.error(`    MISSING  ${cePath}`);
    process.exit(1);
  }
  if (!isApply) {
    console.log(`    WOULD attach  cert-ce  ← CE/라인텍_CE인증서_R.pdf`);
  } else {
    const ref = await uploadPdf(cePath);
    await client
      .patch("cert-ce")
      .set({ file: { _type: "file", asset: ref } })
      .commit();
    console.log(`    attach  cert-ce  ← CE/라인텍_CE인증서_R.pdf`);
  }

  // --- 2. Create Factory Registration record ---
  console.log("\n  -- create Factory Registration --");
  const frPath = path.join(CERTS, "공장등록증.pdf");
  if (!existsSync(frPath)) {
    console.error(`    MISSING  ${frPath}`);
    process.exit(1);
  }

  const id = "cert-factory-registration";
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id },
  );

  if (existing) {
    console.log(`    skip  ${id} (already exists)`);
  } else if (!isApply) {
    console.log(
      `    WOULD create  [${id}] "Factory Registration" order=15  ← 공장등록증.pdf`,
    );
  } else {
    const ref = await uploadPdf(frPath);
    await client.createIfNotExists({
      _id: id,
      _type: "certification",
      name: "Factory Registration",
      slug: { _type: "slug", current: "factory-registration" },
      issuer: intl(
        "중소벤처기업부",
        "Ministry of SMEs and Startups (MSS)",
        "中小风险企业部",
      ),
      scope: intl(
        "공장등록증",
        "Certificate of factory registration",
        "工厂登记证",
      ),
      file: { _type: "file", asset: ref },
      order: 15,
    } as Parameters<typeof client.createIfNotExists>[0]);
    console.log(`    create  [${id}] "Factory Registration" order=15`);
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
