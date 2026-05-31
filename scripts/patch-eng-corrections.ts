/**
 * Applies the engineering-confirmed corrections (2026-05-30) directly to Sanity:
 *
 *   1. EX70C / EX70M  — flow range  0.01–70 slpm  →  0.01–100 slpm
 *   2. MS2150VA / MS3150VA  — flow range  0.01–100 slpm  →  30–100 slpm
 *   3. DO400  — series  analogue  →  specialized
 *   4. High-flow models (22 slugs)  — maxPressure.display  →  "inquiry"
 *      (numeric value/unit/comparator unset, since "inquiry" is not a number)
 *
 * Mirrors the corrections already applied to src/lib/fixtures/products.json.
 *
 * Usage:
 *   tsx scripts/patch-eng-corrections.ts            # dry-run
 *   tsx scripts/patch-eng-corrections.ts --apply    # actually patch Sanity
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * SANITY_WRITE_TOKEN in .env.local. Uses fetch — no @sanity/client needed.
 */

import { readFileSync } from "node:fs";

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}
loadEnv(".env.local");

type Patch = {
  id: string;
  set?: Record<string, unknown>;
  unset?: string[];
};

const FLOW_001_100 = {
  "massFlowSpecs.flowRange.display": "0.01–100 slpm",
  "massFlowSpecs.flowRange.min": 0.01,
  "massFlowSpecs.flowRange.max": 100,
  "massFlowSpecs.flowRange.unit": "slpm",
  "massFlowSpecs.flowRange.referenceGas": "N2",
};

const FLOW_30_100 = {
  "massFlowSpecs.flowRange.display": "30–100 slpm",
  "massFlowSpecs.flowRange.min": 30,
  "massFlowSpecs.flowRange.max": 100,
  "massFlowSpecs.flowRange.unit": "slpm",
  "massFlowSpecs.flowRange.referenceGas": "N2",
};

const PATCHES: Patch[] = [
  // 1. EX70 flow range
  { id: "product-ex70c", set: FLOW_001_100 },
  { id: "product-ex70m", set: FLOW_001_100 },

  // 2. MS2150 / MS3150 flow range
  { id: "product-ms2150va", set: FLOW_30_100 },
  { id: "product-ms3150va", set: FLOW_30_100 },

  // 3. DO400 series
  { id: "product-do400", set: { series: "specialized" } },

  // 4. "inquiry" maxPressure for high-flow models
  ...(
    [
      "ms3400va",
      "ms3500va",
      "ms3600va",
      "ms3700va",
      "ms3800va",
      "ms2400va",
      "ms2500va",
      "ms2600va",
      "ms2700va",
      "ms2800va",
      "md400c",
      "md500c",
      "md600c",
      "md700c",
      "md800c",
      "md400m",
      "md500m",
      "md600m",
      "md700m",
      "md800m",
      "ex1000c",
      "ex1000m",
    ] as const
  ).map<Patch>((slug) => ({
    id: `product-${slug}`,
    set: { "massFlowSpecs.maxPressure.display": "inquiry" },
    unset: [
      "massFlowSpecs.maxPressure.value",
      "massFlowSpecs.maxPressure.unit",
      "massFlowSpecs.maxPressure.comparator",
    ],
  })),
];

function printPlan(apply: boolean) {
  console.log(`\nMode: ${apply ? "APPLY" : "DRY-RUN (no writes)"}`);
  console.log(`Plan: ${PATCHES.length} patches total\n`);
  for (const p of PATCHES) {
    const sets = p.set ? Object.entries(p.set) : [];
    const unsets = p.unset ?? [];
    console.log(`  ${p.id}`);
    for (const [k, v] of sets)
      console.log(`    set    ${k} = ${JSON.stringify(v)}`);
    for (const k of unsets) console.log(`    unset  ${k}`);
  }
}

async function applyAll() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    console.error(
      "\nMissing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
    );
    process.exit(1);
  }
  const url = `https://${projectId}.api.sanity.io/v2026-01-01/data/mutate/${dataset}`;
  console.log(
    `\nApplying ${PATCHES.length} patches to ${projectId}/${dataset} via HTTPS…`,
  );
  let ok = 0;
  let fail = 0;
  for (const p of PATCHES) {
    const mutation: Record<string, unknown> = { id: p.id };
    if (p.set) mutation.set = p.set;
    if (p.unset) mutation.unset = p.unset;
    const body = { mutations: [{ patch: mutation }] };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error(
          `  FAILED   ${p.id}: HTTP ${res.status} ${txt.slice(0, 200)}`,
        );
        fail++;
      } else {
        console.log(`  patched  ${p.id}`);
        ok++;
      }
    } catch (err) {
      console.error(`  FAILED   ${p.id}:`, err);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} patched, ${fail} failed.`);
  if (fail) process.exit(1);
}

async function main() {
  const apply = process.argv.includes("--apply");
  printPlan(apply);
  if (apply) await applyAll();
  else console.log("\nDry-run only. Re-run with --apply to actually write.");
}

main();
