// Mirrors product images from the legacy Gnuboard site (line-tech.co.kr) into
// public/products/<model-slug>/. One-shot; delete after products migrate to Sanity.
//
// Usage: node scripts/scrape-legacy-assets.mjs

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const BASE = "https://line-tech.co.kr";
const OUT_DIR = "public/products";
const MANIFEST_PATH = "public/products/_manifest.json";

const BOARDS = [
  {
    boTable: "02_01_e",
    category: "analogue-mfc",
    label: "Analogue Mass Flow Controller",
  },
  {
    boTable: "02_02_e",
    category: "analogue-mfm",
    label: "Analogue Mass Flow Meter",
  },
  {
    boTable: "02_03_e",
    category: "digital-mfc",
    label: "Digital Mass Flow Controller",
  },
  {
    boTable: "02_04_e",
    category: "digital-mfm",
    label: "Digital Mass Flow Meter",
  },
  { boTable: "02_05_e", category: "readoutbox", label: "ReadOutBox" },
  { boTable: "02_06_e", category: "component", label: "Component" },
  { boTable: "02_07_e", category: "display-mfc", label: "Display MFC" },
  { boTable: "02_07_01_e", category: "display-mfm", label: "Display MFM" },
  { boTable: "02_07_02_e", category: "mems-mfc", label: "MEMS MFC" },
  { boTable: "02_07_03_e", category: "mems-mfm", label: "MEMS MFM" },
  { boTable: "02_07_04_e", category: "exproof-mfc", label: "EX-Proof MFC" },
  { boTable: "02_07_05_e", category: "exproof-mfm", label: "EX-Proof MFM" },
];

async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

async function fetchBytes(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return new Uint8Array(await res.arrayBuffer());
}

function decodeHtmlEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Gnuboard stores originals next to the auto-generated thumbnails:
//   /data/.../thumb-<hash>_<W>x<H>.jpg  ->  /data/.../<hash>.jpg
// The view_image.php endpoint the site links to requires a session; the direct
// thumb URL does not, so we rewrite to the original instead.
function thumbToOriginal(thumbUrl) {
  return thumbUrl.replace(
    /\/thumb-([^/]+?)_\d+x\d+(\.[a-z]+)(\?.*)?$/i,
    "/$1$2",
  );
}

function extractWrIds(html) {
  const ids = new Set();
  const re = /wr_id=(\d+)/g;
  let m;
  while ((m = re.exec(html)) !== null) ids.add(parseInt(m[1], 10));
  return [...ids].sort((a, b) => a - b);
}

function extractTitle(html) {
  const m = /<h1[^>]*id="bo_v_title"[^>]*>([\s\S]*?)<\/h1>/i.exec(html);
  if (!m) return "";
  const raw = decodeHtmlEntities(m[1].replace(/<[^>]+>/g, "")).trim();
  // Digital boards prefix titles with a display-order token, e.g. "07 | MD700C".
  return raw.replace(/^\d+\s*[|.]\s*/, "");
}

function extractImages(html) {
  const found = [];
  const seen = new Set();
  const re = /<img\b[^>]*\bsrc="([^"]+)"/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const raw = decodeHtmlEntities(m[1]);
    if (!raw.includes("/data/file/") && !raw.includes("/data/editor/"))
      continue;
    const abs = raw.startsWith("http") ? raw : BASE + raw;
    if (seen.has(abs)) continue;
    seen.add(abs);
    const kind = abs.includes("/data/file/") ? "product" : "editor";
    found.push({ kind, thumb: abs, original: thumbToOriginal(abs) });
  }
  return found;
}

async function main() {
  const manifest = { generatedAt: new Date().toISOString(), products: [] };

  for (const board of BOARDS) {
    console.log(`\n== ${board.label} (${board.boTable}) ==`);
    let listHtml;
    try {
      listHtml = await fetchText(
        `${BASE}/bbs/board.php?bo_table=${board.boTable}`,
      );
    } catch (e) {
      console.log(`  listing failed: ${e.message}`);
      continue;
    }
    const wrIds = extractWrIds(listHtml);
    if (wrIds.length === 0) {
      console.log("  (no products)");
      continue;
    }
    console.log(`  ${wrIds.length} products: ${wrIds.join(", ")}`);

    for (const wrId of wrIds) {
      let detailHtml;
      try {
        detailHtml = await fetchText(
          `${BASE}/bbs/board.php?bo_table=${board.boTable}&wr_id=${wrId}`,
        );
      } catch (e) {
        console.log(`  wr_id=${wrId}: detail failed ${e.message}`);
        continue;
      }
      const title = extractTitle(detailHtml);
      const slug = slugify(title);
      if (!slug) {
        console.log(`  wr_id=${wrId}: skipped (no title)`);
        continue;
      }

      const images = extractImages(detailHtml);
      const counts = { product: 0, editor: 0 };
      const saved = [];
      for (const img of images) {
        counts[img.kind] += 1;
        const ext = img.original.match(/\.([a-z]+)(?:\?|$)/i)?.[1] || "jpg";
        const filename = `${img.kind}-${counts[img.kind]}.${ext}`;
        const destPath = join(OUT_DIR, slug, filename);
        try {
          const bytes = await fetchBytes(img.original);
          await mkdir(dirname(destPath), { recursive: true });
          await writeFile(destPath, bytes);
          saved.push({
            path: `/products/${slug}/${filename}`,
            source: img.original,
            kind: img.kind,
          });
        } catch (e) {
          console.log(`  ${slug}/${filename}: ${e.message}`);
        }
      }
      console.log(`  ${title} (wr_id=${wrId}) → ${saved.length} images`);
      manifest.products.push({
        model: title,
        slug,
        category: board.category,
        boTable: board.boTable,
        wrId,
        images: saved,
      });
    }
  }

  await mkdir(dirname(MANIFEST_PATH), { recursive: true });
  await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(
    `\nManifest: ${MANIFEST_PATH}  (${manifest.products.length} products)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
