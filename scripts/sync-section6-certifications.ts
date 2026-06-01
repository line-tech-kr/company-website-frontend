/**
 * Section 6: certifications.
 *
 * (a) Attach PDFs to 2 existing cert records (ISO 9001, INNOBIZ).
 *     CE has no matching PDF on disk — left empty.
 * (b) Create 12 new cert records: 4 patents, 1 IECEx (issued), 2 KCs
 *     explosion-proof, 5 Korean corporate credentials.
 *     The IECEx draft (KSCP 26ATEX0009X_Draft.pdf) is intentionally skipped
 *     until the final issue arrives.
 *
 *   pnpm tsx scripts/sync-section6-certifications.ts            # dry-run
 *   pnpm tsx scripts/sync-section6-certifications.ts --apply    # write
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

const CERTS_DIR =
  "/Users/bspark/Dev/working/line-tech-files/organized/shared/certificates";

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

interface AttachExisting {
  kind: "attach";
  docId: string;
  filename: string; // relative to CERTS_DIR
  validThrough?: string;
}

interface CreateNew {
  kind: "create";
  id: string; // stable _id (cert-<slug>)
  name: string;
  slug: string;
  issuer: Trilingual;
  scope: Trilingual;
  filename: string; // relative to CERTS_DIR
  validThrough?: string;
  order: number;
}

const ATTACHMENTS: AttachExisting[] = [
  // ISO Korea PDF → existing cert-iso-9001
  {
    kind: "attach",
    docId: "cert-iso-9001",
    filename: "ISO 인증서/2023 ISO(Korea).pdf",
  },
  // INNOBIZ PDF → existing cert-innobiz, validThrough from filename "(24.04.04~27.04.03)"
  {
    kind: "attach",
    docId: "cert-innobiz",
    filename: "이노비즈(24.04.04~27.04.03).pdf",
    validThrough: "2027.04",
  },
];

const NEW_CERTS: CreateNew[] = [
  // --- KCs explosion-proof (KOSHA) ---
  {
    kind: "create",
    id: "cert-kcs-ex70",
    name: "KCs Explosion-proof Certificate (EX70)",
    slug: "kcs-ex70",
    issuer: {
      ko: "한국산업안전보건공단 (KOSHA)",
      en: "Korea Occupational Safety and Health Agency (KOSHA)",
      zh: "韩国产业安全保健公团 (KOSHA)",
    },
    scope: {
      ko: "EX70 시리즈 방폭 안전 인증",
      en: "Explosion-proof safety certification for the EX70 series",
      zh: "EX70 系列防爆安全认证",
    },
    filename: "KCS 방폭 안전인증서 (EX70,1000)/방폭안전인증서 EX70.pdf",
    order: 4,
  },
  {
    kind: "create",
    id: "cert-kcs-ex1000",
    name: "KCs Explosion-proof Certificate (EX1000)",
    slug: "kcs-ex1000",
    issuer: {
      ko: "한국산업안전보건공단 (KOSHA)",
      en: "Korea Occupational Safety and Health Agency (KOSHA)",
      zh: "韩国产业安全保健公团 (KOSHA)",
    },
    scope: {
      ko: "EX1000 시리즈 방폭 안전 인증",
      en: "Explosion-proof safety certification for the EX1000 series",
      zh: "EX1000 系列防爆安全认证",
    },
    filename: "KCS 방폭 안전인증서 (EX70,1000)/방폭안전인증서 EX1000.pdf",
    order: 5,
  },
  // --- IECEx (international explosion-proof) — issued only; draft skipped ---
  {
    kind: "create",
    id: "cert-iecex-kscp-21-0022x",
    name: "IECEx Certificate KSCP 21.0022X",
    slug: "iecex-kscp-21-0022x",
    issuer: {
      ko: "IECEx 인증제도",
      en: "IECEx Certification Scheme",
      zh: "IECEx 认证体系",
    },
    scope: {
      ko: "방폭 MFC/MFM 시리즈 국제 방폭 인증",
      en: "International explosion-protection certification for Explosion-proof MFC/MFM Series",
      zh: "防爆 MFC/MFM 系列国际防爆认证",
    },
    filename: "IECEx 방폭 인증서/IECEx_KSCP_21.0022X_001.pdf",
    order: 6,
  },
  // --- Patents (KIPO) ---
  {
    kind: "create",
    id: "cert-patent-kr-10-1455928",
    name: "Patent KR 10-1455928",
    slug: "patent-kr-10-1455928",
    issuer: {
      ko: "특허청",
      en: "Korean Intellectual Property Office (KIPO)",
      zh: "韩国知识产权局 (KIPO)",
    },
    scope: {
      ko: "모터 구동회로를 갖는 유체 정밀 질량 유량 제어장치 (2014 등록)",
      en: "Mass flow control device with motor drive circuit (registered 2014)",
      zh: "具有电机驱动电路的流体精密质量流量控制装置 (2014年登记)",
    },
    filename: "특허증/특허증.pdf",
    order: 7,
  },
  {
    kind: "create",
    id: "cert-patent-kr-10-2759236",
    name: "Patent KR 10-2759236",
    slug: "patent-kr-10-2759236",
    issuer: {
      ko: "특허청",
      en: "Korean Intellectual Property Office (KIPO)",
      zh: "韩国知识产权局 (KIPO)",
    },
    scope: {
      ko: "라인텍 등록 특허",
      en: "Line Tech registered patent",
      zh: "Line Tech 注册专利",
    },
    filename: "특허증/10-2759236_특허증.pdf",
    order: 8,
  },
  {
    kind: "create",
    id: "cert-patent-kr-10-2759237",
    name: "Patent KR 10-2759237",
    slug: "patent-kr-10-2759237",
    issuer: {
      ko: "특허청",
      en: "Korean Intellectual Property Office (KIPO)",
      zh: "韩国知识产权局 (KIPO)",
    },
    scope: {
      ko: "라인텍 등록 특허",
      en: "Line Tech registered patent",
      zh: "Line Tech 注册专利",
    },
    filename: "특허증/10-2759237_특허증.pdf",
    order: 9,
  },
  {
    kind: "create",
    id: "cert-patent-kr-10-2759238",
    name: "Patent KR 10-2759238",
    slug: "patent-kr-10-2759238",
    issuer: {
      ko: "특허청",
      en: "Korean Intellectual Property Office (KIPO)",
      zh: "韩国知识产权局 (KIPO)",
    },
    scope: {
      ko: "라인텍 등록 특허",
      en: "Line Tech registered patent",
      zh: "Line Tech 注册专利",
    },
    filename: "특허증/10-2759238_특허증.pdf",
    order: 10,
  },
  // --- Korean corporate credentials ---
  {
    kind: "create",
    id: "cert-corporate-rnd-center",
    name: "Corporate R&D Center Recognition",
    slug: "corporate-rnd-center",
    issuer: {
      ko: "한국산업기술진흥협회 (KOITA)",
      en: "Korea Industrial Technology Association (KOITA)",
      zh: "韩国产业技术振兴协会 (KOITA)",
    },
    scope: {
      ko: "기업부설 연구소 인정",
      en: "Recognition as a corporate-affiliated research institute",
      zh: "企业附属研究所认定",
    },
    filename: "기업부설 연구소 인정서 (23.05).pdf",
    order: 11,
  },
  {
    kind: "create",
    id: "cert-materials-parts-equipment",
    name: "Materials, Parts & Equipment Specialist Certification",
    slug: "materials-parts-equipment-specialist",
    issuer: {
      ko: "산업통상자원부",
      en: "Ministry of Trade, Industry and Energy (MOTIE)",
      zh: "产业通商资源部",
    },
    scope: {
      ko: "소재·부품·장비 전문기업 확인",
      en: "Certified specialist in materials, parts and equipment industries",
      zh: "材料、零部件及装备专业企业认证",
    },
    filename: "소재부품장비 전문기업확인서 (23.06~26.06).pdf",
    validThrough: "2026.06",
    order: 12,
  },
  {
    kind: "create",
    id: "cert-women-owned-business",
    name: "Women-owned Business Certification",
    slug: "women-owned-business",
    issuer: {
      ko: "여성기업종합지원센터",
      en: "Korean Women Entrepreneurs Association",
      zh: "韩国女性企业综合支援中心",
    },
    scope: {
      ko: "여성기업 확인",
      en: "Certified women-owned business",
      zh: "女性企业认证",
    },
    filename: "여성기업확인서 (23.06.28~26.06.27).pdf",
    validThrough: "2026.06",
    order: 13,
  },
  {
    kind: "create",
    id: "cert-venture-business",
    name: "Venture Business Certification",
    slug: "venture-business",
    issuer: {
      ko: "중소벤처기업부",
      en: "Ministry of SMEs and Startups (MSS)",
      zh: "中小风险企业部",
    },
    scope: {
      ko: "벤처기업 확인",
      en: "Certified venture business",
      zh: "风险企业认证",
    },
    filename: "벤처기업확인서 (23.07~26.07).pdf",
    validThrough: "2026.07",
    order: 14,
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
  console.log(
    `\nsync-section6-certifications  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  let attached = 0;
  let created = 0;
  let skipped = 0;
  let failed = 0;
  let missing = 0;

  console.log("  -- attach PDFs to existing cert records --");
  for (const a of ATTACHMENTS) {
    const filePath = path.join(CERTS_DIR, a.filename);
    const label = `${a.docId}  ← ${a.filename}`;
    if (!existsSync(filePath)) {
      console.error(`    MISSING FILE  ${label}`);
      missing++;
      continue;
    }
    if (!isApply) {
      console.log(
        `    WOULD attach  ${label}${a.validThrough ? `  validThrough=${a.validThrough}` : ""}`,
      );
      attached++;
      continue;
    }
    try {
      const ref = await uploadPdf(filePath);
      const patch: Record<string, unknown> = {
        file: { _type: "file", asset: ref },
      };
      if (a.validThrough) patch.validThrough = a.validThrough;
      await client.patch(a.docId).set(patch).commit();
      console.log(`    attach  ${label}`);
      attached++;
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
      console.log(`    WOULD create  ${label}  ← ${path.basename(c.filename)}`);
      created++;
      continue;
    }

    try {
      const ref = await uploadPdf(filePath);
      const doc: Record<string, unknown> = {
        _id: c.id,
        _type: "certification",
        name: c.name,
        slug: { _type: "slug", current: c.slug },
        issuer: intl(c.issuer),
        scope: intl(c.scope),
        file: { _type: "file", asset: ref },
        order: c.order,
      };
      if (c.validThrough) doc.validThrough = c.validThrough;
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
    `\nDone. attached=${attached}  ${isApply ? "created" : "would-create"}=${created}  skipped=${skipped}  failed=${failed}  missing=${missing}`,
  );
  if (failed > 0 || missing > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
