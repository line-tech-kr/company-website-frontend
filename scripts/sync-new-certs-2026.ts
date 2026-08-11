/**
 * New-cert drop (2026-08, line-tech-files/new_cert/인증).
 *
 * (a) Renewals — replace the PDF + bump validThrough on 3 existing certs:
 *     ISO 9001 (→2029.06), 여성기업 (→2029.06), 소재부품장비 (→2029.08).
 * (b) Create 2 new cert records: MAIN-BIZ (new credential) and the public
 *     IECEx QAR summary (PL/KSCP/QAR21.0029/03, valid to 2027.12).
 *
 * "LINE TECH - QAR R3_signed.pdf" (full 34-page audit report) is marked
 * CONFIDENTIAL by KSC POLAND and is intentionally excluded — client
 * confirmed exclusion on 2026-08-10.
 *
 *   pnpm tsx scripts/sync-new-certs-2026.ts            # dry-run
 *   pnpm tsx scripts/sync-new-certs-2026.ts --apply    # write
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

const CERTS_DIR = "/Users/bspark/Dev/working/line-tech-files/new_cert/인증";

type Trilingual = { ko: string; en: string; zh: string };

function intl(t: Trilingual) {
  return [
    {
      _key: "ko",
      _type: "internationalizedArrayStringValue",
      language: "ko",
      value: t.ko,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: t.en,
    },
    {
      _key: "zh",
      _type: "internationalizedArrayStringValue",
      language: "zh",
      value: t.zh,
    },
  ];
}

interface Renewal {
  docId: string;
  filename: string; // relative to CERTS_DIR
  validThrough: string;
}

interface CreateNew {
  id: string; // stable _id (cert-<slug>)
  name: string;
  displayName: Trilingual;
  slug: string;
  issuer: Trilingual;
  scope: Trilingual;
  filename: string; // relative to CERTS_DIR
  validThrough: string;
  order: number;
}

const RENEWALS: Renewal[] = [
  {
    docId: "cert-iso-9001",
    filename: "ISO 인증서 (26.06~29.06).pdf",
    validThrough: "2029.06",
  },
  {
    docId: "cert-women-owned-business",
    filename: "여성기업 확인서 29.06.30.pdf",
    validThrough: "2029.06",
  },
  {
    docId: "cert-materials-parts-equipment",
    filename: "소재부품장비 전문기업확인서 29.08.05.pdf",
    validThrough: "2029.08",
  },
];

const NEW_CERTS: CreateNew[] = [
  {
    id: "cert-mainbiz",
    name: "MAIN-BIZ Certification",
    displayName: {
      ko: "경영혁신형 중소기업 (MAIN-BIZ) 확인서",
      en: "MAIN-BIZ Certification (Management Innovation)",
      zh: "经营创新型中小企业 (MAIN-BIZ) 认证",
    },
    slug: "mainbiz",
    issuer: {
      ko: "중소벤처기업부",
      en: "Ministry of SMEs and Startups (MSS)",
      zh: "中小风险企业部",
    },
    scope: {
      ko: "경영혁신형 중소기업(Main-Biz) 확인",
      en: "Certified management-innovative SME (Main-Biz)",
      zh: "经营创新型中小企业 (Main-Biz) 认证",
    },
    filename: "메인비즈 확인서 29.05.24.pdf",
    validThrough: "2029.05",
    order: 15,
  },
  {
    id: "cert-iecex-qar",
    name: "IECEx Quality Assessment Report",
    displayName: {
      ko: "IECEx 품질심사보고서 (QAR)",
      en: "IECEx Quality Assessment Report (QAR)",
      zh: "IECEx 质量评估报告 (QAR)",
    },
    slug: "iecex-qar",
    issuer: {
      ko: "KSC POLAND (IECEx 인증기관)",
      en: "KSC POLAND Sp. z o.o. (IECEx ExCB)",
      zh: "KSC POLAND (IECEx 认证机构)",
    },
    scope: {
      ko: "IECEx 품질시스템 심사 요약 보고서 (PL/KSCP/QAR21.0029/03)",
      en: "IECEx quality system assessment summary (PL/KSCP/QAR21.0029/03)",
      zh: "IECEx 质量体系评估摘要报告 (PL/KSCP/QAR21.0029/03)",
    },
    filename: "PL_KSCP_QAR21.0029_03_003.pdf",
    validThrough: "2027.12",
    order: 16,
  },
];

async function uploadPdf(filePath: string) {
  const asset = await client.assets.upload("file", createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType: "application/pdf",
  });
  return { _type: "reference" as const, _ref: asset._id };
}

async function main() {
  console.log(`\nsync-new-certs-2026  [${isApply ? "APPLY" : "DRY RUN"}]\n`);

  let renewed = 0;
  let created = 0;
  let skipped = 0;
  let failed = 0;
  let missing = 0;

  console.log("  -- renewals: replace PDF + validThrough --");
  for (const r of RENEWALS) {
    const filePath = path.join(CERTS_DIR, r.filename);
    const label = `${r.docId}  ← ${r.filename}  validThrough=${r.validThrough}`;
    if (!existsSync(filePath)) {
      console.error(`    MISSING FILE  ${label}`);
      missing++;
      continue;
    }
    const existing = await client.fetch<{ validThrough?: string } | null>(
      `*[_id == $id][0]{ validThrough }`,
      { id: r.docId },
    );
    if (!existing) {
      console.error(`    MISSING DOC  ${label}`);
      failed++;
      continue;
    }
    if (existing.validThrough === r.validThrough) {
      console.log(`    skip  ${label}  (already renewed)`);
      skipped++;
      continue;
    }
    if (!isApply) {
      console.log(`    WOULD renew  ${label}`);
      renewed++;
      continue;
    }
    try {
      const ref = await uploadPdf(filePath);
      await client
        .patch(r.docId)
        .set({
          file: { _type: "file", asset: ref },
          validThrough: r.validThrough,
        })
        .commit();
      console.log(`    renew  ${label}`);
      renewed++;
    } catch (err) {
      console.error(`    FAILED  ${label}:`, err);
      failed++;
    }
  }

  console.log("\n  -- create new cert records --");
  for (const c of NEW_CERTS) {
    const filePath = path.join(CERTS_DIR, c.filename);
    const label = `[${c.id}] "${c.name}" order=${c.order}`;

    if (!existsSync(filePath)) {
      console.error(`    MISSING FILE  ${label}  ← ${c.filename}`);
      missing++;
      continue;
    }

    // Idempotency: if a doc with this _id already exists, skip
    const existing = await client.fetch<{ _id: string } | null>(
      `*[_id == $id][0]{ _id }`,
      { id: c.id },
    );
    if (existing) {
      console.log(`    skip  ${label}  (already exists)`);
      skipped++;
      continue;
    }

    if (!isApply) {
      console.log(`    WOULD create  ${label}  ← ${c.filename}`);
      created++;
      continue;
    }

    try {
      const ref = await uploadPdf(filePath);
      const doc = {
        _id: c.id,
        _type: "certification",
        name: c.name,
        displayName: intl(c.displayName),
        slug: { _type: "slug", current: c.slug },
        issuer: intl(c.issuer),
        scope: intl(c.scope),
        file: { _type: "file", asset: ref },
        validThrough: c.validThrough,
        order: c.order,
      };
      await client.createIfNotExists(
        doc as Parameters<typeof client.createIfNotExists>[0],
      );
      console.log(`    create  ${label}`);
      created++;
    } catch (err) {
      console.error(`    FAILED  ${label}:`, err);
      failed++;
    }
  }

  console.log(
    `\nDone. ${isApply ? "renewed" : "would-renew"}=${renewed}  ${isApply ? "created" : "would-create"}=${created}  skipped=${skipped}  failed=${failed}  missing=${missing}`,
  );
  if (failed > 0 || missing > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
