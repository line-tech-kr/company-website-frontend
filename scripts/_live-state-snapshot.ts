/**
 * One-off: snapshot the live Sanity dataset for the diff session.
 * Read-only; no token needed.
 * Run: pnpm tsx scripts/_live-state-snapshot.ts
 */
import { readFileSync } from "node:fs";
import { createClient } from "@sanity/client";

function loadEnv(p: string) {
  for (const l of readFileSync(p, "utf-8").split("\n")) {
    const m = l.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}
loadEnv(".env.local");

const c = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2026-01-01",
  useCdn: false,
});

async function main() {
  const r = await c.fetch(`{
  "productCount": count(*[_type=="product"]),
  "products": *[_type=="product"]{_id, model, "slug": slug.current} | order(model asc),
  "manuals": *[_type=="manual"]{_id, title, models, series, archived, "file": file.asset->originalFilename} | order(title asc),
  "catalogues": *[_type=="catalogue"]{_id, title, series, "file": file.asset->originalFilename} | order(title asc),
  "certs": *[_type=="certification"]{_id, name, "slug": slug.current, "file": file.asset->originalFilename, order} | order(order asc),
  "drawingsSummary": *[_type=="drawing"]{_id, title, models, series, "dwg": dwgFile.asset->originalFilename, "stpCount": count(stpFiles), "pdf": pdfFile.asset->originalFilename} | order(title asc)
}`);
  console.log(JSON.stringify(r, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
