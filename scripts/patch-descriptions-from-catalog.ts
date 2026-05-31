/**
 * Patches Sanity product docs with localized descriptions for the website rebuild.
 *
 * For --lang=en (default):
 *   Source = the catalogue-research markdown files in
 *   /Users/bspark/Dev/working/line-tech-files/catalog-research/<slug>.md (## description section).
 *
 * For --lang=ko | --lang=zh:
 *   Source = /Users/bspark/Dev/working/line-tech-files/catalog-research/_translations.json
 *   (shape: { "<slug>": { "en": "...", "ko": "...", "zh": "..." } }).
 *
 * In all cases the patch target is `description.<lang>` on the product doc
 * (_id = `product-<slug>`).
 *
 * What's deliberately held back (no usable source):
 *   - MD150C / MD150M / LTI-2000 — new products that replaced now-retired
 *     catalogue entries (MD100C/M, LTI-200); need fresh source from engineering.
 *   - LEPC / DO400 — 2026 lineup additions absent from the catalogue.
 *
 * Usage:
 *   nvm use 22
 *   tsx scripts/patch-descriptions-from-catalog.ts                     # dry-run, en
 *   tsx scripts/patch-descriptions-from-catalog.ts --apply              # apply, en
 *   tsx scripts/patch-descriptions-from-catalog.ts --lang=ko            # dry-run, ko
 *   tsx scripts/patch-descriptions-from-catalog.ts --lang=ko --apply    # apply, ko
 *   tsx scripts/patch-descriptions-from-catalog.ts --lang=zh --apply    # apply, zh
 *
 * Requires NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * SANITY_WRITE_TOKEN in .env.local.
 *
 * Uses Sanity's HTTP mutation API via fetch — no @sanity/client SDK needed,
 * so it runs without the project's node_modules installed.
 */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";

const CATALOG_RESEARCH_DIR =
  "/Users/bspark/Dev/working/line-tech-files/catalog-research";
const TRANSLATIONS_FILE = join(CATALOG_RESEARCH_DIR, "_translations.json");

type Lang = "en" | "ko" | "zh";

// After the 2026-05-31 review of the new (final 2026 Korean) catalogue, all
// previously-held slugs have catalogue source: MD150C/M p.32-33, DO400(C) p.34,
// LEPC p.50, LTI-2000 p.53. Nothing is currently held.
const HOLD: Record<string, string> = {};

function loadEnv(path: string) {
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trimEnd();
  }
}

loadEnv(".env.local");

function extractEnDescription(markdown: string): string | null {
  const m = markdown.match(/## description\s*\n([\s\S]*?)(?:\n## |\n$)/);
  if (!m) return null;
  let body = m[1].trim();
  body = body.replace(/\s*\(catalog p\.[^)]*\)/g, "");
  body = body.replace(/\*\*([^*]+)\*\*/g, "$1");
  body = body.replace(/\*([^*]+)\*/g, "$1");
  body = body
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return body.trim();
}

// slug.current → catalog-research filename stem (LTI-2000 → "lti2000")
function fileStemForSlug(slug: string): string {
  return slug.replace(/-/g, "");
}

function loadEnDescriptions(): Map<string, string> {
  const out = new Map<string, string>();
  for (const name of readdirSync(CATALOG_RESEARCH_DIR)) {
    if (!name.endsWith(".md") || name.startsWith("_")) continue;
    const stem = name.slice(0, -3);
    const md = readFileSync(join(CATALOG_RESEARCH_DIR, name), "utf-8");
    if (md.includes("Not present in the 2026 English catalogue")) continue;
    const desc = extractEnDescription(md);
    if (desc) out.set(stem, desc);
  }
  return out;
}

function loadTranslations(lang: "ko" | "zh"): Map<string, string> {
  if (!existsSync(TRANSLATIONS_FILE)) {
    console.error(
      `\nMissing translations file at ${TRANSLATIONS_FILE}. Run the translation pass first.`,
    );
    process.exit(1);
  }
  const raw = readFileSync(TRANSLATIONS_FILE, "utf-8");
  const parsed = JSON.parse(raw) as Record<
    string,
    { en?: string; ko?: string; zh?: string }
  >;
  const out = new Map<string, string>();
  for (const [stem, entry] of Object.entries(parsed)) {
    const text = entry[lang];
    if (typeof text === "string" && text.trim().length > 0) {
      out.set(stem, text.trim());
    }
  }
  return out;
}

type Plan =
  | { slug: string; model: string; action: "patch"; description: string }
  | { slug: string; model: string; action: "hold"; reason: string }
  | { slug: string; model: string; action: "skip"; reason: string };

function buildPlan(lang: Lang): Plan[] {
  const descs = lang === "en" ? loadEnDescriptions() : loadTranslations(lang);
  const plans: Plan[] = [];
  for (const p of ALL_PRODUCTS) {
    const slug = p.slug.current;
    if (HOLD[slug]) {
      plans.push({ slug, model: p.model, action: "hold", reason: HOLD[slug] });
      continue;
    }
    const stem = fileStemForSlug(slug);
    const description = descs.get(stem);
    if (!description) {
      plans.push({
        slug,
        model: p.model,
        action: "skip",
        reason:
          lang === "en"
            ? `no description found at ${stem}.md`
            : `no ${lang} entry for "${stem}" in _translations.json`,
      });
      continue;
    }
    plans.push({ slug, model: p.model, action: "patch", description });
  }
  return plans;
}

function printPlan(plans: Plan[], lang: Lang, apply: boolean) {
  const patch = plans.filter((p) => p.action === "patch");
  const hold = plans.filter((p) => p.action === "hold");
  const skip = plans.filter((p) => p.action === "skip");
  console.log(
    `\nMode: ${apply ? "APPLY" : "DRY-RUN (no writes)"}  ·  Lang: ${lang}`,
  );
  console.log(
    `Plan: patch ${patch.length} · hold ${hold.length} · skip ${skip.length} (of ${plans.length} Sanity products)\n`,
  );
  console.log("--- HELD (no usable source for this slug) ---");
  for (const p of hold) {
    if (p.action === "hold")
      console.log(`  ${p.model.padEnd(10)} — ${p.reason}`);
  }
  if (skip.length) {
    console.log("\n--- SKIPPED ---");
    for (const p of skip) {
      if (p.action === "skip")
        console.log(`  ${p.model.padEnd(10)} — ${p.reason}`);
    }
  }
  console.log(`\n--- TO PATCH (description.${lang}) ---`);
  for (const p of patch) {
    if (p.action !== "patch") continue;
    const preview = p.description.replace(/\s+/g, " ").slice(0, 140);
    console.log(`\n  ${p.model}  (product-${p.slug})`);
    console.log(`    ${preview}${p.description.length > 140 ? "…" : ""}`);
  }
}

async function applyPlan(plans: Plan[], lang: Lang) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    console.error(
      "\nMissing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN in .env.local",
    );
    process.exit(1);
  }
  const url = `https://${projectId}.api.sanity.io/v2026-01-01/data/mutate/${dataset}`;
  console.log(
    `\nApplying description.${lang} to ${projectId}/${dataset} via HTTPS…`,
  );
  let ok = 0;
  let fail = 0;
  for (const p of plans) {
    if (p.action !== "patch") continue;
    const _id = `product-${p.slug}`;
    const body = {
      mutations: [
        {
          patch: {
            id: _id,
            set: { [`description.${lang}`]: p.description },
          },
        },
      ],
    };
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error(
          `  FAILED   ${p.model}: HTTP ${res.status} ${txt.slice(0, 200)}`,
        );
        fail++;
      } else {
        console.log(`  patched  ${p.model}`);
        ok++;
      }
    } catch (err) {
      console.error(`  FAILED   ${p.model}:`, err);
      fail++;
    }
  }
  console.log(`\nDone. ${ok} patched, ${fail} failed.`);
  if (fail) process.exit(1);
}

function parseLangArg(argv: string[]): Lang {
  const arg = argv.find((a) => a.startsWith("--lang="));
  if (!arg) return "en";
  const v = arg.slice("--lang=".length);
  if (v === "en" || v === "ko" || v === "zh") return v;
  console.error(`\nInvalid --lang=${v}. Must be one of: en, ko, zh.`);
  process.exit(1);
}

async function main() {
  const apply = process.argv.includes("--apply");
  const lang = parseLangArg(process.argv);
  const plans = buildPlan(lang);
  printPlan(plans, lang, apply);
  if (apply) await applyPlan(plans, lang);
  else
    console.log(
      `\nDry-run only. Re-run with --apply (and --lang=${lang} if not 'en') to actually write.`,
    );
}

main();
