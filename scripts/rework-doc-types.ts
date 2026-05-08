/**
 * One-shot Sanity migration to fix doc-type drift introduced by PR #167.
 *
 * What it does:
 *   1. Move 30 `catalogue` docs → `drawing` docs (they're dimensional drawings,
 *      not brochures). PDF asset is reused as `pdfFile`. `models[]` and
 *      `series` carry over. Title "<X> Brochure" → "<X> Dimensional Drawing".
 *   2. Move 4 `datasheet` docs → `manual` docs (MS3150, MS3400, MS3700,
 *      MS3800). They're full instruction manuals.
 *   3. Delete the MS3600 standalone `datasheet` — covered by the existing
 *      MS3500&MS3600 combined manual.
 *   4. Delete the M3030 "Maunal.pdf" + M3200 "Maunal.pdf" duplicate manuals
 *      (keep the cleaner "M3030 Series.pdf" / "M3200 Series.pdf" versions).
 *   5. Archive `M3100 Series Manual` (model is retired in 2026 lineup).
 *
 * Run:  pnpm tsx scripts/rework-doc-types.ts
 *       pnpm tsx scripts/rework-doc-types.ts --dry-run
 *
 * Single-pass and idempotent: a fresh run does steps 1-5 in one transaction;
 * re-running on already-migrated data writes nothing.
 */
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
  console.error("Missing Sanity env vars (project id / dataset / write token)");
  process.exit(1);
}

const dryRun = process.argv.includes("--dry-run");

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  useCdn: false,
  token,
});

type Catalogue = {
  _id: string;
  title: string;
  models?: string[] | null;
  series?: string | null;
  publishedAt?: string | null;
  fileRef?: string;
};

type Datasheet = {
  _id: string;
  title: string;
  model?: string | null;
  series?: string | null;
  rev?: string | null;
  publishedAt?: string | null;
  fileRef?: string;
};

type Manual = {
  _id: string;
  title: string;
  model?: string | null;
  models?: string[] | null;
  archived?: boolean | null;
};
type ProductRef = { model: string };

function reworkTitle(oldTitle: string): string {
  return (
    oldTitle
      .replace(/\s*\(Controller \+ Meter\)\s*$/, "")
      .replace(/\s*Brochure\s*$/, "")
      .trim() + " Dimensional Drawing"
  );
}

function deriveModels(title: string, productModels: string[]): string[] {
  const upper = title.toUpperCase();
  const tokens = upper.split(/[^A-Z0-9]+/).filter(Boolean);

  // 1. Direct exact-token match (e.g. "M3030VA Brochure" → ["M3030VA"]).
  const direct = productModels.filter((m) => tokens.includes(m.toUpperCase()));
  if (direct.length > 0) return direct;

  // 2. Token-prefix match. Manual titles use shorter prefixes ("M3030 Manual"
  //    for product "M3030VA"). Each token expands to all products that start
  //    with it; require ≥3 chars to avoid spurious matches on series letters.
  const STOP = new Set([
    "MANUAL",
    "MAUNAL",
    "MAUNUAL",
    "SERIES",
    "BROCHURE",
    "DRAWING",
    "DIMENSIONAL",
    "CONTROLLER",
    "METER",
    "AND",
    "OR",
  ]);
  const expanded = new Set<string>();
  for (const t of tokens) {
    if (t.length < 3) continue;
    if (STOP.has(t)) continue;
    for (const m of productModels) {
      if (m.toUpperCase().startsWith(t)) expanded.add(m);
    }
  }
  if (expanded.size > 0) return [...expanded];

  return [];
}

async function main() {
  const products = await client.fetch<ProductRef[]>(
    `*[_type == "product"]{ model }`,
  );
  const productModels = products.map((p) => p.model);

  const catalogues = await client.fetch<Catalogue[]>(`
    *[_type == "catalogue"] | order(title asc) {
      _id, title, models, series, publishedAt,
      "fileRef": file.asset._ref
    }
  `);

  const datasheets = await client.fetch<Datasheet[]>(`
    *[_type == "datasheet"] | order(title asc) {
      _id, title, model, series, rev, publishedAt,
      "fileRef": file.asset._ref
    }
  `);

  const manuals = await client.fetch<Manual[]>(
    `*[_type == "manual"]{_id, title, model, models, archived} | order(title asc)`,
  );

  // Plan datasheet → manual moves
  const datasheetMigrate = new Set(["MS3150", "MS3400", "MS3700", "MS3800"]);
  const datasheetDelete = new Set(["MS3600"]);

  // Plan duplicate manual deletes (keep the "Series" version, drop "Manual" alias)
  const manualDeleteIds: string[] = [];
  for (const dupModel of ["M3030", "M3200"]) {
    const dupes = manuals.filter((m) => m.model === dupModel);
    if (dupes.length > 1) {
      const keep = dupes.find((m) => /Series/i.test(m.title));
      const drop = dupes.filter((m) => m._id !== keep?._id);
      if (keep) manualDeleteIds.push(...drop.map((m) => m._id));
    }
  }

  // Plan archive (retired). Skip if already archived so re-runs are a true no-op.
  const retiredManual = manuals.find(
    (m) =>
      m.model === "M3100" && /Manual/i.test(m.title) && m.archived !== true,
  );

  // Plan manual model→models[] migration (existing docs use legacy `model` prefix
  // like "M3030" while products use full codes like "M3030VA"). For each manual
  // without `models[]` set, derive from title using the same algorithm as the
  // catalogue→drawing migration. Skips docs already having models[].
  const productModelsList = products.map((p) => p.model);
  const manualModelMigrations: Array<{
    id: string;
    title: string;
    models: string[];
  }> = [];
  const manualModelSkipped: string[] = [];
  for (const m of manuals) {
    if (manualDeleteIds.includes(m._id)) continue;
    if (m._id === retiredManual?._id) continue;
    if (m.models && m.models.length > 0) continue;
    const derived = deriveModels(m.title, productModelsList);
    if (derived.length > 0) {
      manualModelMigrations.push({
        id: m._id,
        title: m.title,
        models: derived,
      });
    } else {
      manualModelSkipped.push(m.title);
    }
  }

  // ----- Print plan -----
  console.log(`\nPlan summary:\n`);

  console.log(`  catalogue → drawing  (${catalogues.length} docs):`);
  for (const c of catalogues) {
    const models =
      c.models && c.models.length > 0
        ? c.models
        : deriveModels(c.title, productModels);
    console.log(
      `    "${c.title}" → "${reworkTitle(c.title)}"  models=[${models.join(", ")}]`,
    );
  }

  const dsMigrate = datasheets.filter((d) =>
    d.model ? datasheetMigrate.has(d.model) : false,
  );
  const dsDelete = datasheets.filter((d) =>
    d.model ? datasheetDelete.has(d.model) : false,
  );
  console.log(`\n  datasheet → manual  (${dsMigrate.length} docs):`);
  for (const d of dsMigrate) {
    const derived = deriveModels(d.title, productModels);
    console.log(`    "${d.title}" → models=[${derived.join(", ")}]`);
  }

  console.log(`\n  delete datasheet (collision)  (${dsDelete.length} docs):`);
  for (const d of dsDelete) console.log(`    "${d.title}" (model=${d.model})`);

  console.log(
    `\n  delete duplicate manuals  (${manualDeleteIds.length} docs):`,
  );
  for (const id of manualDeleteIds) {
    const m = manuals.find((x) => x._id === id);
    if (m) console.log(`    "${m.title}" (model=${m.model})`);
  }

  console.log(
    `\n  archive (retired)  (${retiredManual ? 1 : 0} doc${retiredManual ? "" : "s"}):`,
  );
  if (retiredManual)
    console.log(`    "${retiredManual.title}" (model=${retiredManual.model})`);

  console.log(
    `\n  manual model→models[]  (${manualModelMigrations.length} docs):`,
  );
  for (const m of manualModelMigrations) {
    console.log(`    "${m.title}" → models=[${m.models.join(", ")}]`);
  }
  if (manualModelSkipped.length > 0) {
    console.log(
      `\n  manual model→models[] skipped (no product match — likely product not yet seeded):`,
    );
    for (const t of manualModelSkipped) console.log(`    "${t}"`);
  }

  if (dryRun) {
    console.log(`\n--dry-run: no writes performed.`);
    return;
  }

  // ----- Execute -----
  let tx = client.transaction();

  for (const c of catalogues) {
    const models =
      c.models && c.models.length > 0
        ? c.models
        : deriveModels(c.title, productModels);
    if (models.length === 0) {
      console.warn(
        `  skipping ${c._id} — could not derive models from title "${c.title}"`,
      );
      continue;
    }
    if (!c.fileRef) {
      console.warn(`  skipping ${c._id} — no file asset`);
      continue;
    }
    tx = tx.create({
      _type: "drawing",
      title: reworkTitle(c.title),
      models,
      ...(c.series ? { series: c.series } : {}),
      pdfFile: {
        _type: "file",
        asset: { _type: "reference", _ref: c.fileRef },
      },
      archived: false,
    });
    tx = tx.delete(c._id);
  }

  for (const d of dsMigrate) {
    if (!d.fileRef) {
      console.warn(`  skipping ${d._id} — no file asset`);
      continue;
    }
    const derived = deriveModels(d.title, productModels);
    if (derived.length === 0) {
      console.warn(
        `  skipping ${d._id} — could not derive models from "${d.title}"`,
      );
      continue;
    }
    tx = tx.create({
      _type: "manual",
      title: d.title,
      models: derived,
      ...(d.series ? { series: d.series } : {}),
      ...(d.rev ? { rev: d.rev } : {}),
      ...(d.publishedAt ? { publishedAt: d.publishedAt } : {}),
      file: { _type: "file", asset: { _type: "reference", _ref: d.fileRef } },
      archived: false,
    });
    tx = tx.delete(d._id);
  }

  for (const d of dsDelete) {
    tx = tx.delete(d._id);
  }

  for (const id of manualDeleteIds) {
    tx = tx.delete(id);
  }

  if (retiredManual) {
    tx = tx.patch(retiredManual._id, (p) => p.set({ archived: true }));
  }

  for (const m of manualModelMigrations) {
    tx = tx.patch(m.id, (p) => p.set({ models: m.models }).unset(["model"]));
  }

  console.log(`\nCommitting transaction…`);
  const result = await tx.commit();
  console.log(`Done. ${result.results.length} mutations applied.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
