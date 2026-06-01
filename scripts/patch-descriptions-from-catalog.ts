/**
 * Patches Sanity product docs with localized descriptions for the website rebuild.
 *
 * For --lang=en (default):
 *   Source = catalogue-research markdown files under $CATALOG_RESEARCH_DIR/<slug>.md
 *   (## description section, with `(catalog p.X)` citations and `**…**`/`*…*`
 *   emphasis stripped).
 *
 * For --lang=ko | --lang=zh:
 *   Source = $CATALOG_RESEARCH_DIR/_translations.json
 *   shape: { "<slug>": { "en": "...", "ko": "...", "zh": "..." } }
 *
 * In all cases the patch target is `description.<lang>` on the product doc
 * (_id = `product-<slug>`).
 *
 * Usage:
 *   tsx scripts/patch-descriptions-from-catalog.ts                  # dry-run, en
 *   tsx scripts/patch-descriptions-from-catalog.ts --apply           # apply, en
 *   tsx scripts/patch-descriptions-from-catalog.ts --lang=ko         # dry-run, ko
 *   tsx scripts/patch-descriptions-from-catalog.ts --lang=ko --apply # apply, ko
 *
 * Env (in .env.local):
 *   NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_WRITE_TOKEN
 *   CATALOG_RESEARCH_DIR  — defaults to /Users/bspark/Dev/working/line-tech-files/catalog-research
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { ALL_PRODUCTS } from "../src/lib/fixtures/products";
import { loadEnv } from "./lib/load-env";
import { postMutation, readSanityEnv } from "./lib/sanity-mutate";

loadEnv(".env.local");

const CATALOG_RESEARCH_DIR =
  process.env.CATALOG_RESEARCH_DIR ??
  "/Users/bspark/Dev/working/line-tech-files/catalog-research";
const TRANSLATIONS_FILE = join(CATALOG_RESEARCH_DIR, "_translations.json");

type Lang = "en" | "ko" | "zh";

// Slugs without usable catalogue source. As of 2026-05-31 (after the final
// 2026 Korean catalogue review) all 37 products have source; this set is
// kept for future flexibility.
const HOLD: Record<string, string> = {};

function extractEnDescription(markdown: string): string | null {
  // Capture the body between `## description` and either the next `## ` heading
  // or end-of-file. Tolerates trailing whitespace / multiple trailing newlines.
  const m = markdown.match(/## description\s*\n([\s\S]*?)(?=\n##\s|\s*$)/);
  if (!m) return null;
  let body = m[1].trim();
  // Strip inline catalogue citations: `(catalog p.X)`, `(new catalog p.X)`,
  // optionally with multiple `p.X` segments.
  body = body.replace(/\s*\((?:new )?catalog p\.[^)]*\)/g, "");
  // Strip markdown emphasis (**bold**, *italic*) while preserving the wrapped text.
  body = body.replace(/\*\*([^*]+)\*\*/g, "$1");
  body = body.replace(/\*([^*]+)\*/g, "$1");
  // Normalise whitespace: trim line ends, collapse 3+ newlines to a blank line.
  body = body
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
  return body.trim() || null;
}

// Maps a `products.json` slug.current to its catalog-research filename stem
// (the .md files use a dashless convention, so `lti-2000` → `lti2000.md`).
function fileStemForSlug(slug: string): string {
  return slug.replace(/-/g, "");
}

function loadEnDescriptions(): Map<string, string> {
  if (!existsSync(CATALOG_RESEARCH_DIR)) {
    console.error(
      `\nMissing catalogue-research directory at ${CATALOG_RESEARCH_DIR}. Set CATALOG_RESEARCH_DIR in .env.local or pass it via the shell.`,
    );
    process.exit(1);
  }
  const out = new Map<string, string>();
  for (const name of readdirSync(CATALOG_RESEARCH_DIR)) {
    if (!name.endsWith(".md") || name.startsWith("_")) continue;
    const stem = name.slice(0, -3);
    const md = readFileSync(join(CATALOG_RESEARCH_DIR, name), "utf-8");
    // Files explicitly marked "not present in the catalogue" still come
    // through if someone has hand-written a usable description; otherwise
    // they fall through to the `skip` plan branch below.
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
  if (hold.length) {
    console.log("--- HELD (no usable source for this slug) ---");
    for (const p of hold) {
      if (p.action === "hold")
        console.log(`  ${p.model.padEnd(10)} — ${p.reason}`);
    }
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
  const env = readSanityEnv();
  console.log(
    `\nApplying description.${lang} to ${env.projectId}/${env.dataset} via HTTPS…`,
  );
  let ok = 0;
  let fail = 0;
  for (const p of plans) {
    if (p.action !== "patch") continue;
    const result = await postMutation(env, {
      patch: {
        id: `product-${p.slug}`,
        set: { [`description.${lang}`]: p.description },
      },
    });
    if (result.ok) {
      console.log(`  patched  ${p.model}`);
      ok++;
    } else {
      console.error(
        `  FAILED   ${p.model}: HTTP ${result.status} ${result.bodyText}`,
      );
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
