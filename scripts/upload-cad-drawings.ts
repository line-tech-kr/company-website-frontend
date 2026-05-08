import {
  readFileSync,
  createReadStream,
  readdirSync,
  statSync,
  existsSync,
} from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import {
  parseFolderName,
  parseStepFilename,
  parseDwgFilename,
} from "./lib/parse-drawing-filename";

function loadEnv(filePath: string) {
  try {
    for (const line of readFileSync(filePath, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (m) process.env[m[1]] ??= m[2].trimEnd();
    }
  } catch {
    // .env.local may not exist in CI
  }
}

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

const dryRun = process.argv.includes("--dry-run");

if (!dryRun && (!projectId || !dataset || !token)) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const client =
  !dryRun && projectId && dataset && token
    ? createClient({
        projectId,
        dataset,
        token,
        apiVersion: "2026-01-01",
        useCdn: false,
      })
    : null;

function resolveSourceDir(): string {
  const argIdx = process.argv.indexOf("--source");
  if (argIdx !== -1 && process.argv[argIdx + 1]) {
    return path.resolve(process.cwd(), process.argv[argIdx + 1]);
  }
  if (process.env.CAD_SOURCE_DIR) {
    return path.resolve(process.cwd(), process.env.CAD_SOURCE_DIR);
  }
  // Try sibling-of-repo first; then sibling-of-repo from inside a .claude/worktrees/<name> CWD.
  const candidates = [
    path.resolve(process.cwd(), "../Data/Catalog 2D, 3D"),
    path.resolve(process.cwd(), "../../../../Data/Catalog 2D, 3D"),
  ];
  for (const c of candidates) if (existsSync(c)) return c;
  console.error(
    `Could not locate source directory. Tried:\n  ${candidates.join("\n  ")}\nPass --source <path> or set CAD_SOURCE_DIR.`,
  );
  process.exit(1);
}

const SOURCE_DIR = resolveSourceDir();

type StpVariantPlan = {
  fitting: string;
  sortKey: number;
  filename: string;
  fullPath: string;
};

type DrawingPlan = {
  folder: string;
  primaryModel: string;
  models: string[];
  dwg: { filename: string; fullPath: string } | null;
  stps: StpVariantPlan[];
  warnings: string[];
};

/**
 * Build one DrawingPlan per distinct model code found in a folder.
 *
 * Most folders contain files for a single model (or a folder-level alias group
 * like M3200VA(M2200VA), where the alias models still share the primary model's
 * filename prefix). EX1000 and EX70 contain files with mixed prefixes (e.g.
 * EX1000 + EX1000C) and split into separate drawing docs per the user's call.
 */
function buildDrawingPlans(): DrawingPlan[] {
  const entries = readdirSync(SOURCE_DIR, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const plans: DrawingPlan[] = [];

  for (const folder of folders) {
    const folderPath = path.join(SOURCE_DIR, folder);
    const files = readdirSync(folderPath).filter((name) =>
      statSync(path.join(folderPath, name)).isFile(),
    );

    const { primaryModel, aliasModels } = parseFolderName(folder);

    type Bucket = {
      dwgs: { filename: string; fullPath: string }[];
      stps: StpVariantPlan[];
      unparsed: string[];
    };
    const buckets = new Map<string, Bucket>();
    const bucket = (model: string): Bucket => {
      let b = buckets.get(model);
      if (!b) {
        b = { dwgs: [], stps: [], unparsed: [] };
        buckets.set(model, b);
      }
      return b;
    };

    for (const file of files) {
      const dwg = parseDwgFilename(file);
      if (dwg) {
        bucket(dwg.model).dwgs.push({
          filename: file,
          fullPath: path.join(folderPath, file),
        });
        continue;
      }
      const step = parseStepFilename(file);
      if (step) {
        bucket(step.model).stps.push({
          fitting: step.fitting.label,
          sortKey: step.fitting.sortKey,
          filename: file,
          fullPath: path.join(folderPath, file),
        });
        continue;
      }
      // Unrecognised — attribute to primary model so it surfaces as a warning.
      bucket(primaryModel).unparsed.push(file);
    }

    // Sort models: primary first (if present), then alphabetical.
    const modelOrder = [...buckets.keys()].sort((a, b) => {
      if (a === primaryModel) return -1;
      if (b === primaryModel) return 1;
      return a.localeCompare(b);
    });

    for (const model of modelOrder) {
      const b = buckets.get(model)!;
      const warnings: string[] = [];

      if (b.dwgs.length === 0) warnings.push("no DWG file");
      if (b.dwgs.length > 1)
        warnings.push(
          `multiple DWG files: ${b.dwgs.map((d) => d.filename).join(", ")} (using first)`,
        );
      if (b.stps.length === 0) warnings.push("no STEP files");
      for (const u of b.unparsed) warnings.push(`unrecognised file: ${u}`);

      b.stps.sort((a, b) => a.sortKey - b.sortKey);

      // Folder-level aliases (e.g. M3200VA(M2200VA)) attach to the primary
      // model only, not to other split-out models in the same folder.
      const isPrimary = model === primaryModel;
      const models = isPrimary ? [model, ...aliasModels] : [model];

      plans.push({
        folder,
        primaryModel: model,
        models,
        dwg: b.dwgs[0] ?? null,
        stps: b.stps,
        warnings,
      });
    }
  }

  return plans;
}

function printPlanSummary(plans: DrawingPlan[]) {
  const folderCount = new Set(plans.map((p) => p.folder)).size;
  console.log(
    `\nFound ${folderCount} folders → ${plans.length} drawings in ${SOURCE_DIR}\n`,
  );
  for (const p of plans) {
    const modelStr = p.models.length > 1 ? p.models.join(" + ") : p.models[0];
    const dwg = p.dwg ? p.dwg.filename : "(none)";
    const stps = p.stps.length;
    console.log(
      `  ${p.folder.padEnd(22)}  models: ${modelStr.padEnd(20)} dwg: ${dwg.padEnd(28)} stps: ${stps}`,
    );
    for (const w of p.warnings) console.log(`    ⚠  ${w}`);
  }
}

async function lookupSeries(model: string): Promise<string | null> {
  if (!client) return null;
  const series = await client.fetch<string | null>(
    `*[_type == "product" && lower(model) == lower($m)][0].series`,
    { m: model },
  );
  return series ?? null;
}

async function uploadDrawing(plan: DrawingPlan): Promise<{ uploaded: number }> {
  if (!client) throw new Error("client not initialised");
  if (!plan.dwg && plan.stps.length === 0) {
    console.log(`  skip     ${plan.folder} (no files)`);
    return { uploaded: 0 };
  }

  const series = await lookupSeries(plan.primaryModel);
  if (!series) {
    console.log(
      `  ⚠ no product found for ${plan.primaryModel} — series will be blank`,
    );
  }

  let uploaded = 0;

  let dwgRef: { _type: "file"; asset: { _type: "reference"; _ref: string } } | null =
    null;
  if (plan.dwg) {
    const asset = await client.assets.upload(
      "file",
      createReadStream(plan.dwg.fullPath),
      { filename: plan.dwg.filename, contentType: "application/acad" },
    );
    dwgRef = {
      _type: "file",
      asset: { _type: "reference", _ref: asset._id },
    };
    uploaded++;
  }

  const stpFiles: Array<{
    _type: "stpVariant";
    _key: string;
    fitting: string;
    sortKey: number;
    file: { _type: "file"; asset: { _type: "reference"; _ref: string } };
  }> = [];
  for (const stp of plan.stps) {
    const asset = await client.assets.upload(
      "file",
      createReadStream(stp.fullPath),
      { filename: stp.filename, contentType: "model/step" },
    );
    stpFiles.push({
      _type: "stpVariant",
      _key: asset._id,
      fitting: stp.fitting,
      sortKey: stp.sortKey,
      file: {
        _type: "file",
        asset: { _type: "reference", _ref: asset._id },
      },
    });
    uploaded++;
  }

  const docId = `drawing-${plan.primaryModel.toLowerCase()}`;
  const doc: Record<string, unknown> = {
    _id: docId,
    _type: "drawing",
    title: `${plan.primaryModel} CAD package`,
    models: plan.models,
    stpFiles,
  };
  if (series) doc.series = series;
  if (dwgRef) doc.dwgFile = dwgRef;

  await client.createOrReplace(doc as never);
  console.log(
    `  uploaded ${plan.folder.padEnd(22)} → ${docId} (${uploaded} files, models=${plan.models.join("+")})`,
  );
  return { uploaded };
}

async function main() {
  const plans = buildDrawingPlans();
  printPlanSummary(plans);

  if (dryRun) {
    console.log("\nDry run — no uploads performed.");
    return;
  }

  console.log(
    `\nTarget: ${projectId}/${dataset}. Uploading ${plans.length} drawings...\n`,
  );
  let totalAssets = 0;
  let okDocs = 0;
  let failed = 0;
  for (const plan of plans) {
    try {
      const { uploaded } = await uploadDrawing(plan);
      totalAssets += uploaded;
      okDocs++;
    } catch (err) {
      failed++;
      console.error(`  FAILED   ${plan.primaryModel}:`, err);
    }
  }
  console.log(
    `\nDone. ${okDocs} drawings ok, ${failed} failed, ${totalAssets} assets uploaded.`,
  );
  if (failed > 0) process.exit(1);
}

main();
