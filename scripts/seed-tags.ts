import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";
import type { Product } from "../src/lib/types/product";

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
];

function tagsForProduct(p: Product): string[] {
  const tags: string[] = [];
  if (p.series === "digital") tags.push("digital");
  if (p.model.startsWith("LM")) tags.push("mems");
  if (p.model.startsWith("EX")) {
    tags.push("explosion-proof");
    tags.push("hazardous-environment");
  }
  if (p.model.startsWith("LD")) tags.push("integrated-display");
  const { min, max } = p.massFlowSpecs.flowRange;
  if (min !== undefined && max !== undefined) {
    // Catalog tops out at 30 slpm for ultra-low models; >=1000 marks the high-flow band.
    if (min <= 0.01 && max <= 30) tags.push("ultra-low-flow");
    if (max >= 1000) tags.push("high-flow");
  }
  if (p.function === "MFM") tags.push("meter-only");
  return tags;
}

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
    `Seeding ${TAGS.length} tags + patching ${ALL_PRODUCTS.length} products → ${projectId}/${dataset} (force=${force}, dryRun=${dryRun})`,
  );

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

  let patchedCount = 0;
  let skippedCount = 0;
  let preservedCount = 0;

  for (const product of ALL_PRODUCTS) {
    const _id = `product-${product.slug.current}`;
    const slugs = tagsForProduct(product);
    if (slugs.length === 0) {
      console.log(`  skipped  ${product.model} (no tags derived)`);
      skippedCount++;
      continue;
    }
    const refs = slugs.map((s) => ({
      _key: s,
      _type: "reference" as const,
      _ref: `tag-${s}`,
    }));
    if (dryRun) {
      console.log(`  [dry] patch  ${_id} ← [${slugs.join(", ")}]`);
      patchedCount++;
      continue;
    }
    try {
      // Preserve existing tag arrays (e.g. Studio-curated gas/application
      // tags) unless --force is set. Mirrors the tag-document --force gate.
      if (!force) {
        const existing = await client.getDocument<{ tags?: unknown[] }>(_id);
        const existingCount = existing?.tags?.length ?? 0;
        if (existingCount > 0) {
          console.log(
            `  preserved  ${product.model} (has ${existingCount} existing tags; --force to overwrite)`,
          );
          preservedCount++;
          continue;
        }
      }
      await client.patch(_id).set({ tags: refs }).commit();
      console.log(`  patched  ${product.model} ← [${slugs.join(", ")}]`);
      patchedCount++;
    } catch (err) {
      console.error(`  FAILED   ${product.model}:`, err);
      process.exit(1);
    }
  }

  console.log(
    `Done. Tags=${TAGS.length}, products patched=${patchedCount}, preserved=${preservedCount}, skipped=${skippedCount}.`,
  );
  console.log(
    "Note: zh strings are machine-drafted from English. Native review pending — file follow-up issue.",
  );
}

main();
