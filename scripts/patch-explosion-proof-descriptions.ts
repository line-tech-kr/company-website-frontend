/**
 * Issue #270 follow-up: the EX product description prose (ko/en/zh) embeds the
 * old suffixed model name ("The EX1000C is …"). Replace the model token with
 * the unsuffixed name. The "controller"/"meter" wording in the prose already
 * carries the C/M distinction, so this is purely a name correction.
 *
 * Dry-run by default. Pass --commit to write.
 */
import { createClient } from "@sanity/client";
import { loadEnv } from "./lib/load-env";

loadEnv(".env.local");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !dataset || !token) {
  console.error(
    "Missing Sanity env (project id / dataset / SANITY_WRITE_TOKEN).",
  );
  process.exit(1);
}

const commit = process.argv.includes("--commit");
if (
  commit &&
  dataset === "production" &&
  !process.argv.includes("--yes-production")
) {
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

// slug → [oldModelToken, newModel]
const DOCS: Record<string, [string, string]> = {
  "product-ex1000c": ["EX1000C", "EX1000"],
  "product-ex1000m": ["EX1000M", "EX1000"],
  "product-ex70c": ["EX70C", "EX70"],
  "product-ex70m": ["EX70M", "EX70"],
};
const LANGS = ["ko", "en", "zh"] as const;

async function main() {
  console.log(`Patch EX descriptions (commit=${commit})\n`);
  for (const [id, [oldTok, newTok]] of Object.entries(DOCS)) {
    const doc = await client.fetch(`*[_id==$id][0]{description}`, { id });
    if (!doc?.description) {
      console.log(`  SKIP ${id}: no description`);
      continue;
    }
    const next: Record<string, string> = {};
    let changed = false;
    for (const lang of LANGS) {
      const cur = doc.description[lang];
      if (typeof cur !== "string") continue;
      let updated: string;
      if (lang === "ko") {
        // Normalize the KO topic particle to 은: "…0" (EX1000/EX70) ends in an
        // ㅇ batchim, so 은 is correct. The C-variant prose used 는 (C=씨).
        updated = cur
          .split(`${oldTok}는`)
          .join(`${newTok}은`)
          .split(`${oldTok}은`)
          .join(`${newTok}은`)
          .split(oldTok)
          .join(newTok);
      } else {
        updated = cur.split(oldTok).join(newTok);
      }
      next[`description.${lang}`] = updated;
      if (updated !== cur) {
        changed = true;
        console.log(
          `  ${id}.${lang}: "${cur.slice(0, 30)}…" → "${updated.slice(0, 30)}…"`,
        );
      }
    }
    if (changed && commit) await client.patch(id).set(next).commit();
  }
  console.log(
    commit ? "\nDone (committed)." : "\nDry run — pass --commit to write.",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
