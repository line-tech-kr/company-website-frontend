/**
 * Issue #270 data migration (production Sanity).
 *
 * 1. Drop the C/M suffix from the EX explosion-proof models:
 *      EX1000C / EX1000M → EX1000,  EX70C / EX70M → EX70
 *    (slugs are unchanged; only the `model` display field is patched.)
 * 2. Unpublish the two read-out units (LTI-1000, LTI-2000) so they drop out
 *    of the explosion-proof category listing. They live on the static
 *    Accessories page (src/lib/content/accessories.ts), and their old detail
 *    URLs already 301 → /products/accessories. Unpublish is reversible: the
 *    content is preserved as a draft and can be republished in the Studio.
 *
 * DO400 is intentionally NOT touched — it was already re-homed to analogue.
 *
 * Dry-run by default. Pass --commit to actually write.
 */
import { createClient } from "@sanity/client";
import { loadEnv } from "./lib/load-env";

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !dataset || !token) {
  console.error("Missing Sanity env (project id / dataset / SANITY_WRITE_TOKEN).");
  process.exit(1);
}

const commit = process.argv.includes("--commit");
if (commit && dataset === "production" && !process.argv.includes("--yes-production")) {
  console.error(
    "Refusing to --commit against the production dataset without --yes-production.",
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

const MODEL_RENAMES: Record<string, string> = {
  "product-ex1000c": "EX1000",
  "product-ex1000m": "EX1000",
  "product-ex70c": "EX70",
  "product-ex70m": "EX70",
};
const UNPUBLISH = ["product-lti-1000", "product-lti-2000"];

async function main() {
  console.log(
    `Patch explosion-proof → ${projectId}/${dataset} (commit=${commit})\n`,
  );

  for (const [id, model] of Object.entries(MODEL_RENAMES)) {
    const current = await client.fetch(`*[_id==$id][0].model`, { id });
    if (current === undefined) {
      console.log(`  SKIP   ${id}: not found`);
      continue;
    }
    console.log(`  model  ${id}: ${current} → ${model}`);
    if (commit) await client.patch(id).set({ model }).commit();
  }

  for (const id of UNPUBLISH) {
    const doc = await client.fetch(`*[_id==$id][0]`, { id });
    if (!doc) {
      console.log(`  SKIP   ${id}: not published (already unpublished?)`);
      continue;
    }
    console.log(`  unpub  ${id} (${doc.model}) → drafts.${id}, delete published`);
    if (commit) {
      const { _rev, ...rest } = doc;
      void _rev;
      await client.createIfNotExists({ ...rest, _id: `drafts.${id}` });
      await client.delete(id);
    }
  }

  console.log(commit ? "\nDone (committed)." : "\nDry run — pass --commit to write.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
