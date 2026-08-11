/**
 * DMFC for Windows — PC software for digital MFCs (2016-09-19 build,
 * delivered in line-tech-files/new_cert). Zips the installer folder
 * (setup.exe + .msi) and creates the first `software` document, which
 * surfaces on /resources/software in the Data Room.
 *
 *   pnpm tsx scripts/upload-dmfc-software.ts            # dry-run
 *   pnpm tsx scripts/upload-dmfc-software.ts --apply    # write
 */
import { readFileSync, createReadStream, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
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

const SRC_DIR =
  "/Users/bspark/Dev/working/line-tech-files/new_cert/DMFC for Windows_20160919 (1)";
const ZIP_PATH =
  "/Users/bspark/Dev/working/line-tech-files/new_cert/DMFC-for-Windows.zip";
const DOC_ID = "software-dmfc-windows";

function intl(t: { ko: string; en: string; zh: string }) {
  return (["ko", "en", "zh"] as const).map((language) => ({
    _key: language,
    _type: "internationalizedArrayStringValue",
    language,
    value: t[language],
  }));
}

async function main() {
  console.log(`\nupload-dmfc-software  [${isApply ? "APPLY" : "DRY RUN"}]\n`);

  if (!existsSync(SRC_DIR)) {
    console.error(`  MISSING SOURCE DIR  ${SRC_DIR}`);
    process.exit(1);
  }

  if (!existsSync(ZIP_PATH)) {
    if (!isApply) {
      console.log(`  WOULD zip  ${SRC_DIR} → ${ZIP_PATH}`);
    } else {
      // -j: flat archive (no "DMFC for Windows_20160919 (1)/" prefix inside)
      execFileSync("zip", ["-j", "-r", ZIP_PATH, SRC_DIR]);
      console.log(`  zipped  ${ZIP_PATH}`);
    }
  } else {
    console.log(`  zip exists  ${ZIP_PATH}`);
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: DOC_ID },
  );
  if (existing) {
    console.log(`  skip  [${DOC_ID}]  (already exists)`);
    return;
  }

  if (!isApply) {
    console.log(`  WOULD create  [${DOC_ID}] "DMFC for Windows"`);
    return;
  }

  const asset = await client.assets.upload("file", createReadStream(ZIP_PATH), {
    filename: "DMFC-for-Windows.zip",
    contentType: "application/zip",
  });
  await client.createIfNotExists({
    _id: DOC_ID,
    _type: "software",
    title: "DMFC for Windows",
    displayName: intl({
      ko: "DMFC for Windows (PC 소프트웨어)",
      en: "DMFC for Windows (PC software)",
      zh: "DMFC for Windows (PC 软件)",
    }),
    version: "2016-09-19",
    file: {
      _type: "file",
      asset: { _type: "reference", _ref: asset._id },
    },
    publishedAt: "2016-09-19",
    order: 1,
  });
  console.log(`  create  [${DOC_ID}]  ← ${path.basename(ZIP_PATH)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
