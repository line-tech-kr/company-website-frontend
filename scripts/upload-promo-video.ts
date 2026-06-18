/**
 * upload-promo-video.ts
 *
 * One-off: uploads the homepage promo video as a Sanity file asset and prints
 * its CDN URL. Paste that URL into PROMO_VIDEO_URL in
 * src/components/home/Intro/IntroVideo.tsx.
 *
 * Usage:
 *   pnpm tsx scripts/upload-promo-video.ts --source /path/to/promo.mp4
 */

import { readFileSync, createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";

function loadEnv(filePath: string) {
  try {
    for (const line of readFileSync(filePath, "utf-8").split("\n")) {
      const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      // Trim whitespace and any surrounding quotes.
      if (m) process.env[m[1]] ??= m[2].trim().replace(/^["']|["']$/g, "");
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

const CONTENT_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};
const contentType = CONTENT_TYPES[path.extname(source).toLowerCase()];
if (!contentType) {
  console.error(
    `Unsupported video type "${path.extname(source)}". Use .mp4, .webm, or .mov.`,
  );
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
  console.log(
    `Uploading ${path.basename(source)} (${sizeMb} MB) to ${projectId}/${dataset}...`,
  );
  const asset = await client.assets.upload("file", createReadStream(source), {
    filename: path.basename(source),
    contentType,
  });
  console.log(`\nDone. Asset _id: ${asset._id}`);
  console.log(`URL: ${asset.url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
