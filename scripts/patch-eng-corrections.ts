/**
 * Applies the engineering-confirmed corrections (2026-05-30) directly to Sanity:
 *
 *   1. EX70C / EX70M  — flow range  0.01–70 slpm  →  0.01–100 slpm
 *   2. MS2150VA / MS3150VA  — flow range  0.01–100 slpm  →  30–100 slpm
 *   3. DO400  — series analogue → specialized, plus connections (3 SW
 *      fittings) and maxPressure <30 bar → <13 bar (source: 2026 final
 *      catalogue PDF p.34; the markdown in company-docs-private still
 *      lacks the connection table)
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

import { loadEnv } from "./lib/load-env";
import {
  type PatchMutation,
  postMutation,
  readSanityEnv,
} from "./lib/sanity-mutate";

loadEnv(".env.local");

type Patch = PatchMutation["patch"];

const FLOW_0_01_TO_100: Patch["set"] = {
  "massFlowSpecs.flowRange.display": "0.01–100 slpm",
  "massFlowSpecs.flowRange.min": 0.01,
  "massFlowSpecs.flowRange.max": 100,
  "massFlowSpecs.flowRange.unit": "slpm",
  "massFlowSpecs.flowRange.referenceGas": "N2",
};

const FLOW_30_TO_100: Patch["set"] = {
  "massFlowSpecs.flowRange.display": "30–100 slpm",
  "massFlowSpecs.flowRange.min": 30,
  "massFlowSpecs.flowRange.max": 100,
  "massFlowSpecs.flowRange.unit": "slpm",
  "massFlowSpecs.flowRange.referenceGas": "N2",
};

const INQUIRY_SLUGS = [
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
] as const;

const PATCHES: Patch[] = [
  // 1. EX70 flow range
  { id: "product-ex70c", set: FLOW_0_01_TO_100 },
  { id: "product-ex70m", set: FLOW_0_01_TO_100 },

  // 2. MS2150 / MS3150 flow range
  { id: "product-ms2150va", set: FLOW_30_TO_100 },
  { id: "product-ms3150va", set: FLOW_30_TO_100 },

  // 3. DO400 — series + connections + corrected maxPressure (PDF p.34)
  {
    id: "product-do400",
    set: {
      series: "specialized",
      connections: [
        { _key: "conn-0", type: '1/2" SW', length: "208.5 mm" },
        { _key: "conn-1", type: '3/4" SW', length: "208.5 mm" },
        { _key: "conn-2", type: '1" SW', length: "217.2 mm" },
      ],
      "massFlowSpecs.maxPressure.display": "<13 bar",
      "massFlowSpecs.maxPressure.value": 13,
      "massFlowSpecs.maxPressure.unit": "bar",
      "massFlowSpecs.maxPressure.comparator": "lt",
    },
  },

  // 4. "inquiry" maxPressure for high-flow models
  ...INQUIRY_SLUGS.map<Patch>((slug) => ({
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
  const env = readSanityEnv();
  console.log(
    `\nApplying ${PATCHES.length} patches to ${env.projectId}/${env.dataset} via HTTPS…`,
  );
  let ok = 0;
  let fail = 0;
  for (const patch of PATCHES) {
    const result = await postMutation(env, { patch });
    if (result.ok) {
      console.log(`  patched  ${patch.id}`);
      ok++;
    } else {
      console.error(
        `  FAILED   ${patch.id}: HTTP ${result.status} ${result.bodyText}`,
      );
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
