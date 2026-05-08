/**
 * upload-catalogue-2026.ts
 *
 * Uploads 2026 catalogue/manual/datasheet PDFs to Sanity.
 * Additive only — never overwrites existing docs.
 *
 * Usage:
 *   pnpm tsx scripts/upload-catalogue-2026.ts             # real upload
 *   pnpm tsx scripts/upload-catalogue-2026.ts --dry-run   # log only, no writes
 *   pnpm tsx scripts/upload-catalogue-2026.ts --check-only # show existing matches
 */

import { readFileSync, createReadStream } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

// ---------------------------------------------------------------------------
// Env loading
// ---------------------------------------------------------------------------

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

if (!projectId || !dataset || !token) {
  console.error(
    "Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
  );
  process.exit(1);
}

const isDryRun = process.argv.includes("--dry-run");
const isCheckOnly = process.argv.includes("--check-only");

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Series = "analogue" | "digital" | "specialized" | "all";

interface CatalogueEntry {
  _type: "catalogue";
  title: string;
  series: Series;
  filePath: string;
}

interface ManualEntry {
  _type: "manual";
  title: string;
  model: string;
  series: Series;
  filePath: string;
}

interface DatasheetEntry {
  _type: "datasheet";
  title: string;
  model: string;
  series: Series;
  filePath: string;
}

type Entry = CatalogueEntry | ManualEntry | DatasheetEntry;

// ---------------------------------------------------------------------------
// Series classification
// ---------------------------------------------------------------------------

function classifySeries(model: string): Series {
  const upper = model.toUpperCase();
  if (upper.startsWith("MD")) return "digital";
  if (upper.startsWith("DO")) return "analogue";
  if (upper.startsWith("M") || upper.startsWith("MS")) return "analogue";
  if (
    upper.startsWith("EX") ||
    upper.startsWith("LEPC") ||
    upper.startsWith("DEPC") ||
    upper.startsWith("LD") ||
    upper.startsWith("LM")
  )
    return "specialized";
  return "analogue"; // fallback
}

// ---------------------------------------------------------------------------
// Title normalization for catalogue PDFs
// ---------------------------------------------------------------------------

const COMBINED_PDF_TITLES: Record<string, { title: string; series: Series }> =
  {
    "EX1000C,M.pdf": {
      title: "EX1000 Series (Controller + Meter)",
      series: "specialized",
    },
    "EX70C,M 수정본.pdf": {
      title: "EX70 Series (Controller + Meter)",
      series: "specialized",
    },
    "M3200VA,M2200VA 수정본.pdf": {
      title: "M3200VA / M2200VA Brochure",
      series: "analogue",
    },
    "MS2500VA, 2600VA.pdf": {
      title: "MS2500VA / MS2600VA Brochure",
      series: "analogue",
    },
    "MS3500VA, MS3600VA 수정본.pdf": {
      title: "MS3500VA / MS3600VA Brochure",
      series: "analogue",
    },
  };

function normalizeCatalogueTitle(filename: string): {
  title: string;
  series: Series;
} {
  if (COMBINED_PDF_TITLES[filename]) {
    return COMBINED_PDF_TITLES[filename];
  }
  // Strip extension and Korean suffixes like 수정본
  let stem = filename.replace(/\.pdf$/i, "");
  stem = stem.replace(/\s*수정본\s*$/, "").trim();
  // Derive series from the leading model code
  const model = stem.split(/[\s,]/)[0];
  const series = classifySeries(model);
  return { title: `${stem} Brochure`, series };
}

// ---------------------------------------------------------------------------
// Build the full entry list
// ---------------------------------------------------------------------------

const BASE =
  ".work/2026-catalogue/해외 카달로그 제작";

function buildEntries(): Entry[] {
  const entries: Entry[] = [];

  // --- Catalogue PDFs ---
  const catalogueDir = path.join(
    process.cwd(),
    BASE,
    "카달로그 모델 PDF",
  );

  const catalogueFiles = [
    "EX1000C,M.pdf",
    "EX70C,M 수정본.pdf",
    "LEPC.pdf",
    "M2030VA 수정본.pdf",
    "M3030VA 수정본.pdf",
    "M3200VA,M2200VA 수정본.pdf",
    "MD150C 수정본.pdf",
    "MD150M 수정본.pdf",
    "MD30C.pdf",
    "MD30M.pdf",
    "MD400C.pdf",
    "MD400M.pdf",
    "MD500C.pdf",
    "MD500M.pdf",
    "MD600C 수정본.pdf",
    "MD600M 수정본.pdf",
    "MD700C.pdf",
    "MD700M.pdf",
    "MD800C.pdf",
    "MD800M.pdf",
    "MS2150VA 수정본.pdf",
    "MS2400VA.pdf",
    "MS2500VA, 2600VA.pdf",
    "MS2700VA.pdf",
    "MS2800VA.pdf",
    "MS3150VA 수정본.pdf",
    "MS3400VA.pdf",
    "MS3500VA, MS3600VA 수정본.pdf",
    "MS3700VA.pdf",
    "MS3800VA.pdf",
  ];

  for (const filename of catalogueFiles) {
    const { title, series } = normalizeCatalogueTitle(filename);
    entries.push({
      _type: "catalogue",
      title,
      series,
      filePath: path.join(catalogueDir, filename),
    });
  }

  // --- Manual PDFs (from PDF/ subdirectory) ---
  const manualDir = path.join(
    process.cwd(),
    BASE,
    "Analogue MFC 메뉴얼",
    "PDF",
  );

  const manualFiles: Array<{ filename: string; title: string; model: string }> = [
    { filename: "M2030 Maunal.pdf",         title: "M2030 Manual",               model: "M2030"  },
    { filename: "M2200 Maunal.pdf",         title: "M2200 Manual",               model: "M2200"  },
    { filename: "M3030 Maunal.pdf",         title: "M3030 Manual",               model: "M3030"  },
    { filename: "M3030 Series.pdf",         title: "M3030 Series Manual",        model: "M3030"  },
    { filename: "M3100 series.pdf",         title: "M3100 Series Manual",        model: "M3100"  },
    { filename: "M3200 Maunal.pdf",         title: "M3200 Manual",               model: "M3200"  },
    { filename: "M3200 Series.pdf",         title: "M3200 Series Manual",        model: "M3200"  },
    { filename: "MS2400 Manual.pdf",        title: "MS2400 Manual",              model: "MS2400" },
    { filename: "MS2500 Maunal.pdf",        title: "MS2500 Manual",              model: "MS2500" },
    { filename: "MS2600 Maunal.pdf",        title: "MS2600 Manual",              model: "MS2600" },
    { filename: "MS2700 Series.pdf",        title: "MS2700 Series Manual",       model: "MS2700" },
    { filename: "MS2800 Manual.pdf",        title: "MS2800 Manual",              model: "MS2800" },
    { filename: "MS3500&MS3600 Series.pdf", title: "MS3500 / MS3600 Series Manual", model: "MS3500" },
  ];

  for (const { filename, title, model } of manualFiles) {
    const series = classifySeries(model) as "analogue" | "digital" | "specialized";
    entries.push({
      _type: "manual",
      title,
      model,
      series,
      filePath: path.join(manualDir, filename),
    });
  }

  // --- Additional manuals ---
  entries.push({
    _type: "manual",
    title: "DO400 Manual",
    model: "DO400",
    series: "analogue",
    filePath: path.join(
      process.cwd(),
      BASE,
      "DO400 Manual",
      "DO400 Maunal.pdf",
    ),
  });

  entries.push({
    _type: "manual",
    title: "LEPC Manual",
    model: "LEPC",
    series: "specialized",
    filePath: path.join(
      process.cwd(),
      BASE,
      "EPC 메뉴얼",
      "LEPC Maunal.pdf",
    ),
  });

  // --- Datasheet PDFs ---
  const datasheetDir = path.join(
    process.cwd(),
    BASE,
    "Analogue MFC 메뉴얼",
  );

  const datasheetFiles: Array<{ filename: string; model: string; series: Series }> = [
    { filename: "MS3150 Series.pdf", model: "MS3150", series: "analogue" },
    { filename: "MS3400 Series.pdf", model: "MS3400", series: "analogue" },
    { filename: "MS3600 Series.pdf", model: "MS3600", series: "analogue" },
    { filename: "MS3700 Series.pdf", model: "MS3700", series: "analogue" },
    { filename: "MS3800 Series.pdf", model: "MS3800", series: "analogue" },
  ];

  for (const { filename, model, series } of datasheetFiles) {
    const stem = filename.replace(/\.pdf$/i, "");
    entries.push({
      _type: "datasheet",
      title: stem,
      model,
      series,
      filePath: path.join(datasheetDir, filename),
    });
  }

  return entries;
}

// ---------------------------------------------------------------------------
// Upload helpers
// ---------------------------------------------------------------------------

async function docExists(
  _type: string,
  title: string,
): Promise<boolean> {
  const result = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && title == $title][0]{ _id }`,
    { type: _type, title },
  );
  return result !== null;
}

async function uploadPdf(
  filePath: string,
  filename: string,
): Promise<{ _type: "reference"; _ref: string }> {
  const asset = await client.assets.upload(
    "file",
    createReadStream(filePath),
    { filename, contentType: "application/pdf" },
  );
  return { _type: "reference", _ref: asset._id };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const entries = buildEntries();

  const catalogues = entries.filter((e) => e._type === "catalogue");
  const manuals = entries.filter((e) => e._type === "manual");
  const datasheets = entries.filter((e) => e._type === "datasheet");

  console.log(
    `\nupload-catalogue-2026  [${isDryRun ? "DRY RUN" : isCheckOnly ? "CHECK ONLY" : "LIVE"}]`,
  );
  console.log(
    `Total entries: ${entries.length}  (${catalogues.length} catalogues, ${manuals.length} manuals, ${datasheets.length} datasheets)`,
  );
  console.log(`Target: ${projectId}/${dataset}\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const entry of entries) {
    const label = `[${entry._type}] "${entry.title}"`;

    if (isCheckOnly) {
      const exists = await docExists(entry._type, entry.title);
      console.log(`  ${exists ? "EXISTS " : "MISSING"} ${label}`);
      continue;
    }

    // Check existence
    const exists = await docExists(entry._type, entry.title);
    if (exists) {
      console.log(`  skipped  ${label}  (already exists)`);
      skipped++;
      continue;
    }

    if (isDryRun) {
      console.log(`  would create  ${label}  ← ${path.basename(entry.filePath)}`);
      created++;
      continue;
    }

    // Real upload
    try {
      const filename = path.basename(entry.filePath);
      const fileRef = await uploadPdf(entry.filePath, filename);

      const today = new Date().toISOString().slice(0, 10);

      if (entry._type === "catalogue") {
        await client.create({
          _type: "catalogue",
          title: entry.title,
          series: entry.series,
          file: { _type: "file", asset: fileRef },
          publishedAt: today,
        });
      } else if (entry._type === "manual") {
        const m = entry as ManualEntry;
        await client.create({
          _type: "manual",
          title: m.title,
          model: m.model,
          series: m.series,
          file: { _type: "file", asset: fileRef },
          publishedAt: today,
        });
      } else if (entry._type === "datasheet") {
        const d = entry as DatasheetEntry;
        await client.create({
          _type: "datasheet",
          title: d.title,
          model: d.model,
          series: d.series,
          file: { _type: "file", asset: fileRef },
          publishedAt: today,
        });
      }

      console.log(`  created  ${label}`);
      created++;
    } catch (err) {
      console.error(`  FAILED   ${label}:`, err);
      failed++;
      // Leave orphan asset in place per spec — do not retry
    }
  }

  if (!isCheckOnly) {
    console.log(
      `\nDone.  created=${created}  skipped=${skipped}  failed=${failed}`,
    );
    if (failed > 0) process.exit(1);
  }
}

main();
