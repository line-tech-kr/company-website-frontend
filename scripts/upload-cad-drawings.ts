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
  isDwgFilename,
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

type FolderPlan = {
  folder: string;
  primaryModel: string;
  models: string[];
  dwg: { filename: string; fullPath: string } | null;
  stps: StpVariantPlan[];
  warnings: string[];
};

function buildFolderPlans(): FolderPlan[] {
  const entries = readdirSync(SOURCE_DIR, { withFileTypes: true });
  const folders = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  return folders.map((folder) => {
    const folderPath = path.join(SOURCE_DIR, folder);
    const files = readdirSync(folderPath).filter((name) =>
      statSync(path.join(folderPath, name)).isFile(),
    );

    const { primaryModel, aliasModels } = parseFolderName(folder);
    const warnings: string[] = [];

    const dwgFiles = files.filter(isDwgFilename);
    if (dwgFiles.length === 0) warnings.push("no DWG file");
    if (dwgFiles.length > 1)
      warnings.push(`multiple DWG files: ${dwgFiles.join(", ")} (using first)`);
    const dwgName = dwgFiles[0] ?? null;

    const stps: StpVariantPlan[] = [];
    for (const file of files) {
      if (!/\.(step|stp)$/i.test(file)) continue;
      const parsed = parseStepFilename(file);
      if (!parsed) {
        warnings.push(`STEP filename did not parse: ${file}`);
        continue;
      }
      stps.push({
        fitting: parsed.fitting.label,
        sortKey: parsed.fitting.sortKey,
        filename: file,
        fullPath: path.join(folderPath, file),
      });
    }
    stps.sort((a, b) => a.sortKey - b.sortKey);
    if (stps.length === 0) warnings.push("no STEP files");

    return {
      folder,
      primaryModel,
      models: [primaryModel, ...aliasModels],
      dwg: dwgName
        ? { filename: dwgName, fullPath: path.join(folderPath, dwgName) }
        : null,
      stps,
      warnings,
    };
  });
}

function printPlanSummary(plans: FolderPlan[]) {
  console.log(`\nFound ${plans.length} folders in ${SOURCE_DIR}\n`);
  for (const p of plans) {
    const modelStr =
      p.models.length > 1 ? p.models.join(" + ") : p.models[0];
    const dwg = p.dwg ? p.dwg.filename : "(none)";
    const stps = p.stps.length;
    console.log(`  ${p.folder.padEnd(22)}  models: ${modelStr.padEnd(20)} dwg: ${dwg.padEnd(28)} stps: ${stps}`);
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

async function uploadFolder(plan: FolderPlan): Promise<{ uploaded: number }> {
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
  const plans = buildFolderPlans();
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
      const { uploaded } = await uploadFolder(plan);
      totalAssets += uploaded;
      okDocs++;
    } catch (err) {
      failed++;
      console.error(`  FAILED   ${plan.folder}:`, err);
    }
  }
  console.log(
    `\nDone. ${okDocs} drawings ok, ${failed} failed, ${totalAssets} assets uploaded.`,
  );
  if (failed > 0) process.exit(1);
}

main();
