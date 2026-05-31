/**
 * Per-product CE Declarations of Conformity (#214).
 *
 * Uploads 2 PDFs from line-tech-files/organized/products/ and creates / updates
 * 2 certification docs tagged with the applicable `models`:
 *
 *   ce-doc-ms3150va         models: [MS3150VA]
 *   ce-doc-readout-box      models: [LTI-1000, LTI-2000]   (one PDF, two products)
 *
 *   pnpm tsx scripts/sync-section9-product-doc.ts            # dry-run
 *   pnpm tsx scripts/sync-section9-product-doc.ts --apply    # commit
 *
 * Idempotent: re-running with --apply re-uploads the asset only if the doc has
 * no file ref. Run once, then edit in Studio.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
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

const STAGING = path.resolve(
  process.env.LINE_TECH_FILES ?? "../line-tech-files",
);

type IntlEntry = {
  _key: string;
  _type: "internationalizedArrayStringValue";
  language: "ko" | "en" | "zh";
  value: string;
};
const intl = (ko: string, en: string, zh: string): IntlEntry[] => [
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

type Plan = {
  id: string;
  slug: string;
  name: string;
  models: string[];
  order: number;
  issuer: IntlEntry[];
  scope: IntlEntry[];
  pdfPath: string;
};

const SELF_DECLARATION = intl(
  "라인테크 (자가선언)",
  "Line Tech Inc. (self-declaration)",
  "莱因技术 (自我声明)",
);

const PLANS: Plan[] = [
  {
    id: "ce-doc-ms3150va",
    slug: "ce-doc-ms3150va",
    name: "CE DoC — MS3150VA",
    models: ["MS3150VA"],
    order: 20,
    issuer: SELF_DECLARATION,
    scope: intl(
      "MS3150VA 매스플로우 컨트롤러에 대한 EU 적합성 선언 (2022).",
      "Declaration of Conformity for the MS3150VA mass flow controller (2022).",
      "MS3150VA 质量流量控制器 EU 符合性声明 (2022)。",
    ),
    pdfPath: path.join(
      STAGING,
      "organized/products/MS3150VA/certificate/라인텍_MS3150VA_CE-DOC.pdf",
    ),
  },
  {
    id: "ce-doc-readout-box",
    slug: "ce-doc-readout-box",
    name: "CE DoC — Readout Box (LVD)",
    models: ["LTI-1000", "LTI-2000"],
    order: 21,
    issuer: SELF_DECLARATION,
    scope: intl(
      "LTI 시리즈 리드아웃 박스 (LTI-1000, LTI-2000) 저전압 지침 EU 적합성 선언 (2022).",
      "Low Voltage Directive Declaration of Conformity for LTI-series readout boxes (LTI-1000, LTI-2000) — 2022.",
      "LTI 系列读出器 (LTI-1000, LTI-2000) 低电压指令 EU 符合性声明 (2022)。",
    ),
    pdfPath: path.join(
      STAGING,
      "organized/products/LTI-1000/certificate/라인텍_Readout Box_CE(LVD)-DOC.pdf",
    ),
  },
];

async function ensureAsset(plan: Plan): Promise<string> {
  if (!existsSync(plan.pdfPath)) {
    throw new Error(`PDF missing: ${plan.pdfPath}`);
  }
  const buf = readFileSync(plan.pdfPath);
  const filename = path.basename(plan.pdfPath);
  const asset = await client.assets.upload("file", buf, {
    filename,
    contentType: "application/pdf",
  });
  return asset._id;
}

async function upsert(plan: Plan) {
  const existing = await client.fetch<{
    _id: string;
    hasFile: boolean;
  } | null>(
    `*[_type=="certification" && _id==$id][0]{ _id, "hasFile": defined(file.asset) }`,
    { id: plan.id },
  );

  const body: Record<string, unknown> = {
    _id: plan.id,
    _type: "certification",
    name: plan.name,
    slug: { _type: "slug", current: plan.slug },
    issuer: plan.issuer,
    scope: plan.scope,
    models: plan.models,
    order: plan.order,
  };

  if (!existing) {
    console.log(`  + create ${plan.id}  models=[${plan.models.join(", ")}]`);
    if (!apply) return;
    const assetId = await ensureAsset(plan);
    body.file = {
      _type: "file",
      asset: { _type: "reference", _ref: assetId },
    };
    await client.create(body as never);
    return;
  }

  console.log(
    `  ~ patch  ${plan.id}  hasFile=${existing.hasFile}  models=[${plan.models.join(", ")}]`,
  );
  if (!apply) return;

  const patch: Record<string, unknown> = {
    name: plan.name,
    slug: body.slug,
    issuer: plan.issuer,
    scope: plan.scope,
    models: plan.models,
    order: plan.order,
  };
  if (!existing.hasFile) {
    const assetId = await ensureAsset(plan);
    patch.file = {
      _type: "file",
      asset: { _type: "reference", _ref: assetId },
    };
  }
  await client.patch(plan.id).set(patch).commit();
}

async function main() {
  console.log(`Sanity ${dataset} · ${apply ? "APPLY" : "DRY RUN"}`);
  console.log(`Staging root: ${STAGING}\n`);
  for (const p of PLANS) await upsert(p);
  if (!apply) console.log("\nDry run. Re-run with --apply.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
