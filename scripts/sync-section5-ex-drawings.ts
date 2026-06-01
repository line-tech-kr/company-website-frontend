/**
 * Section 5: consolidate EX70 / EX1000 drawing docs (DESTRUCTIVE).
 *
 * - Patch drawing-ex70:    fill 6 STEP files, set models=[EX70C, EX70M], series=specialized
 * - Patch drawing-ex1000:  add DWG + 4 more STEP, set models=[EX1000C, EX1000M], series=specialized
 * - Archive drawing-ex70c and drawing-ex1000c (now redundant variant docs)
 *
 *   pnpm tsx scripts/sync-section5-ex-drawings.ts            # dry-run
 *   pnpm tsx scripts/sync-section5-ex-drawings.ts --apply    # write
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

const STAGING = "/Users/bspark/Dev/working/line-tech-files/organized/products";

/** Parse "(1^4SW)" → { fitting: '1/4" SW', sortKey: 0.25 } */
function parseFitting(filename: string): { fitting: string; sortKey: number } {
  const m = filename.match(/\((\d+)(?:\^(\d+))?(SW|VCR)\)/);
  if (!m) throw new Error(`Cannot parse fitting from ${filename}`);
  const num = parseInt(m[1], 10);
  const denom = m[2] ? parseInt(m[2], 10) : 1;
  const type = m[3];
  const sortKey = num / denom;
  const fitting = denom === 1 ? `${num}" ${type}` : `${num}/${denom}" ${type}`;
  return { fitting, sortKey };
}

interface StepUpload {
  sourceFile: string; // filename relative to STAGING/<model>/cad/
  sourceModel: string; // staging folder ("EX70" or "EX1000")
}

interface DrawingPatch {
  docId: string;
  models: string[];
  series: "specialized";
  dwg?: { sourceModel: string; sourceFile: string }; // omit to leave dwg untouched
  stepFiles: StepUpload[]; // FULL list — replaces existing stpFiles
}

const PATCHES: DrawingPatch[] = [
  {
    docId: "drawing-ex70",
    models: ["EX70C", "EX70M"],
    series: "specialized",
    // DWG already attached (EX70.DWG); skip
    stepFiles: [
      { sourceModel: "EX70", sourceFile: "EX70C(1^4SW).STEP" },
      { sourceModel: "EX70", sourceFile: "EX70C(1^4VCR).STEP" },
      { sourceModel: "EX70", sourceFile: "EX70C(3^8SW).STEP" },
      { sourceModel: "EX70", sourceFile: "EX70C(1^2SW).STEP" },
      { sourceModel: "EX70", sourceFile: "EX70C(1^2VCR).STEP" },
      { sourceModel: "EX70", sourceFile: "EX70C(3^4SW).STEP" },
    ],
  },
  {
    docId: "drawing-ex1000",
    models: ["EX1000C", "EX1000M"],
    series: "specialized",
    dwg: { sourceModel: "EX1000", sourceFile: "EX1000C Ass'y.DWG" },
    stepFiles: [
      { sourceModel: "EX1000", sourceFile: "EX1000(1^4VCR).STEP" },
      { sourceModel: "EX1000", sourceFile: "EX1000C(1^2SW).STEP" },
      { sourceModel: "EX1000", sourceFile: "EX1000C(1^2VCR).STEP" },
      { sourceModel: "EX1000", sourceFile: "EX1000C(3^4SW).STEP" },
      { sourceModel: "EX1000", sourceFile: "EX1000C(1SW).STEP" },
    ],
  },
];

const ARCHIVE_IDS = ["drawing-ex70c", "drawing-ex1000c"];

async function uploadFile(filePath: string, contentType: string) {
  const asset = await client.assets.upload("file", createReadStream(filePath), {
    filename: path.basename(filePath),
    contentType,
  });
  return { _type: "reference" as const, _ref: asset._id };
}

async function main() {
  console.log(
    `\nsync-section5-ex-drawings  [${isApply ? "APPLY" : "DRY RUN"}]\n`,
  );

  let failed = 0;

  for (const p of PATCHES) {
    console.log(
      `\n  [${p.docId}]  models=${p.models.join(",")}  series=${p.series}`,
    );

    // Validate sources first
    if (p.dwg) {
      const dwgPath = path.join(
        STAGING,
        p.dwg.sourceModel,
        "cad",
        p.dwg.sourceFile,
      );
      if (!existsSync(dwgPath)) {
        console.error(`    MISSING DWG  ${dwgPath}`);
        failed++;
        continue;
      }
    }
    const missingSteps: string[] = [];
    for (const s of p.stepFiles) {
      const sp = path.join(STAGING, s.sourceModel, "cad", s.sourceFile);
      if (!existsSync(sp)) missingSteps.push(sp);
    }
    if (missingSteps.length > 0) {
      console.error(`    MISSING STEP FILES:`);
      for (const f of missingSteps) console.error(`      ${f}`);
      failed++;
      continue;
    }

    // Show step plan
    for (const s of p.stepFiles) {
      const { fitting, sortKey } = parseFitting(s.sourceFile);
      console.log(
        `    step  ${fitting.padEnd(12)} (sortKey=${sortKey})  ← ${s.sourceFile}`,
      );
    }
    if (p.dwg) console.log(`    dwg   ← ${p.dwg.sourceFile}`);

    if (!isApply) continue;

    // Upload all files, then patch in one transaction
    try {
      let dwgRef: { _type: "reference"; _ref: string } | undefined;
      if (p.dwg) {
        const dwgPath = path.join(
          STAGING,
          p.dwg.sourceModel,
          "cad",
          p.dwg.sourceFile,
        );
        dwgRef = await uploadFile(dwgPath, "application/acad");
      }
      const stpEntries = [];
      for (const s of p.stepFiles) {
        const sp = path.join(STAGING, s.sourceModel, "cad", s.sourceFile);
        const ref = await uploadFile(sp, "application/step");
        const { fitting, sortKey } = parseFitting(s.sourceFile);
        stpEntries.push({
          _key: s.sourceFile.replace(/[^\w]/g, "_"),
          fitting,
          sortKey,
          file: { _type: "file", asset: ref },
        });
      }

      const patch: Record<string, unknown> = {
        models: p.models,
        series: p.series,
        stpFiles: stpEntries,
      };
      if (dwgRef) {
        patch.dwgFile = { _type: "file", asset: dwgRef };
      }
      await client.patch(p.docId).set(patch).commit();
      console.log(`    OK  patched ${p.docId}`);
    } catch (err) {
      console.error(`    FAILED ${p.docId}:`, err);
      failed++;
    }
  }

  console.log(`\n  -- archive variant docs --`);
  for (const id of ARCHIVE_IDS) {
    if (!isApply) {
      console.log(`    WOULD archive  ${id}`);
      continue;
    }
    try {
      await client.patch(id).set({ archived: true }).commit();
      console.log(`    archive  ${id}`);
    } catch (err) {
      console.error(`    FAILED archive ${id}:`, err);
      failed++;
    }
  }

  console.log(`\nDone. failed=${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
