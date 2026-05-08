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

const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

type TagKind = "capability" | "application" | "gas";

type TagDef = {
  slug: string;
  kind: TagKind;
  label: { ko: string; en: string; zh: string };
};

const TAGS: TagDef[] = [
  {
    slug: "ultra-low-flow",
    kind: "capability",
    label: { ko: "초저유량", en: "Ultra-low flow", zh: "超低流量" },
  },
  {
    slug: "high-flow",
    kind: "capability",
    label: { ko: "고유량", en: "High flow", zh: "高流量" },
  },
  {
    slug: "meter-only",
    kind: "capability",
    label: { ko: "측정전용", en: "Meter only", zh: "仅测量" },
  },
  {
    slug: "digital",
    kind: "capability",
    label: { ko: "디지털", en: "Digital", zh: "数字" },
  },
  {
    slug: "mems",
    kind: "capability",
    label: { ko: "MEMS", en: "MEMS", zh: "MEMS" },
  },
  {
    slug: "explosion-proof",
    kind: "capability",
    label: { ko: "방폭", en: "Explosion-proof", zh: "防爆" },
  },
  {
    slug: "integrated-display",
    kind: "capability",
    label: {
      ko: "디스플레이 일체형",
      en: "Integrated display",
      zh: "显示一体",
    },
  },
  {
    slug: "hazardous-environment",
    kind: "application",
    label: {
      ko: "위험환경",
      en: "Hazardous environment",
      zh: "危险环境",
    },
  },
  {
    slug: "mid-flow",
    kind: "capability",
    label: { ko: "중간 유량", en: "Mid flow", zh: "中等流量" },
  },
  {
    slug: "low-pressure",
    kind: "capability",
    label: { ko: "저압", en: "Low pressure", zh: "低压" },
  },
];

function tagDocFields(t: TagDef) {
  return {
    slug: { _type: "slug", current: t.slug },
    kind: t.kind,
    label: [
      { _key: "ko", language: "ko", value: t.label.ko },
      { _key: "en", language: "en", value: t.label.en },
      { _key: "zh", language: "zh", value: t.label.zh },
    ],
  };
}

async function main() {
  console.log(
    `Seeding ${TAGS.length} tag documents → ${projectId}/${dataset} (force=${force}, dryRun=${dryRun})`,
  );
  // Tag assignment to products is managed in Sanity Studio, not via this script.

  for (const tag of TAGS) {
    const _id = `tag-${tag.slug}`;
    const fields = tagDocFields(tag);
    if (dryRun) {
      console.log(`  [dry] tag    ${_id} (${tag.kind})`);
      continue;
    }
    try {
      await client.createIfNotExists({
        _id,
        _type: "tag",
        ...fields,
      } as Parameters<typeof client.createIfNotExists>[0]);
      if (force) {
        await client.patch(_id).set(fields).commit();
        console.log(`  patched  ${_id}`);
      } else {
        console.log(`  ensured  ${_id}`);
      }
    } catch (err) {
      console.error(`  FAILED   ${_id}:`, err);
      process.exit(1);
    }
  }

  console.log(`Done. Tags=${TAGS.length}.`);
  console.log(
    "Note: zh strings are machine-drafted from English. Native review pending — file follow-up issue.",
  );
}

main();
