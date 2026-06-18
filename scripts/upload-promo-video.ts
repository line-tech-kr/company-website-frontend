import { readFileSync, createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

// One-off: uploads the homepage promo video as a Sanity file asset and prints
// its CDN URL. Paste that URL into PROMO_VIDEO_URL in IntroVideo.tsx.
//   npx tsx scripts/upload-promo-video.ts --source /path/to/promo.mp4

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

function resolveSource(): string {
  const idx = process.argv.indexOf("--source");
  if (idx !== -1 && process.argv[idx + 1]) {
    return path.resolve(process.cwd(), process.argv[idx + 1]);
  }
  console.error("Pass the video path with --source <path>.");
  process.exit(1);
}

const source = resolveSource();
if (!existsSync(source)) {
  console.error(`File not found: ${source}`);
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-01-01",
  useCdn: false,
});

async function main() {
  const sizeMb = (statSync(source).size / 1024 / 1024).toFixed(1);
  console.log(`Uploading ${path.basename(source)} (${sizeMb} MB) to ${projectId}/${dataset}...`);
  const asset = await client.assets.upload("file", createReadStream(source), {
    filename: path.basename(source),
    contentType: "video/mp4",
  });
  console.log(`\nDone. Asset _id: ${asset._id}`);
  console.log(`URL: ${asset.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
