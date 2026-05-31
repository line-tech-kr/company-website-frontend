# 2026 Catalogue Resync — Phase 1 Handoff

This branch (`worktree-catalogue-resync-2026`) is **Phase 1 only** — extraction of the 2026 catalogue zip into reviewable markdown. **No Sanity, code, fixture, or schema changes.** Phase 2 happens in a separate PR after sign-off.

## Where the deliverables live

All Phase 1 output goes into the sibling private docs repo at `~/Dev/linetech/company-docs-private/`, **not this repo** (per scope: extraction + review docs, not site code):

```
docs/
├── product-catalog-2026.md              ← MAIN deliverable, 178 lines / 38 KB
├── catalog-extract/2026/
│   ├── decisions.md                     ← all checkpoint A/B decisions captured
│   ├── lineup-diff.md                   ← Phase 2 checklist (carryover/rename/new/retired/carry-over)
│   ├── images/<slug>/                   ← extracted product photos + CAD renders (35 slugs)
│   ├── images-diff.md                   ← per-slug image action recommendations
│   └── translations/<slug>.md           ← (placeholder — KR→EN/ZH drafts coming from issue #166)
├── content-inventory-{ko,en,zh}.md      ← prepended a 1-paragraph note pointing at 2026 catalog
└── archive/2020-catalog/                ← moved old material here
    ├── README.md
    ├── product-catalog-2020-en.md       ← was at docs/ root
    └── pages/                           ← was at docs/catalog-extract/pages/
```

## How the new catalog was built

Source: `~/Dev/linetech/linetech_zip.zip` (~22 MB, 73 meaningful files, CP949-encoded filenames).

Pipeline (intermediate scripts at `.work/scripts/`, gitignored):

1. **`unzip_cp949.py`** — extract zip with proper Korean filename decoding
2. **`docx_to_md.py`** — convert 15 instruction-manual `.docx` files to markdown via `python-docx`
3. **`pdftotext -layout`** — convert 30 brochure PDFs + 13 manual PDFs to text (preserves spec-table grid)
4. **`xlsx_to_json.py` + `parse_xlsx_specs.py`** — parse `카달로그 내용정리.xlsx` (the editor's master spec sheet — 5 sheets, 37 products) into structured JSON per product
5. **`build_records.py`** — aggregate xlsx + docx + manual PDFs + brochure into a per-product record. Surface unknown fields and spec mismatches.
6. **`generate_markdown.py`** — render `product-catalog-2026.md` with the 2020-style structure so `parse-catalog.ts` can drop in (Phase 2)

## Source precedence (locked decisions)

- **Spec data:** xlsx (canonical) — falls back to docx only for DO400 (which isn't in xlsx)
- **Body dimensions + connections:** xlsx connection-A table primary, brochure CAD secondary
- **Features + descriptions:** instruction `.docx` files (analogue series + DO400 only — digital products have no prose source)
- **Reference material** (company info, gas conversion appendix, electrical interfacing): carried forward from 2020 catalog with explicit `Source: 2020 (no 2026 update found)` callouts. The 2026 zip didn't refresh these.
- **Translations:** machine-drafted via Anthropic API (handled in parallel issue #166), marked `{draft}`

## Lineup decisions (see `decisions.md` for full reasoning)

- **Retired:** M2100VA, M3100VA, LTI-200, LD030C, LM030C, LM030M
- **Renamed:** MD100C/M → MD150C/M, EX070C/M → EX70C/M
- **Brand new:** LEPC, LTI-2000, DO400
- **Carry-over from 2020 unchanged:** FC-050S, PR-030 (xlsx marks "그대로사용")
- **Schema change pending:** `connectorType` field added to `product` (Phase 2)

## Parallel work (separate PRs / agents)

| Issue | Status | Output |
|---|---|---|
| [#164 — Cutouts (phase 1)](https://github.com/line-tech-kr/company-website-frontend/issues/164) | Closed | 13 retightened cutouts + 4 rename copies in `public/products/<slug>/` |
| [#215 — Cutouts (phase 2)](https://github.com/line-tech-kr/company-website-frontend/pull/215) | Open | 23 net-new cutouts (DO400, EX1000C/M, EX70C/M, LTI-2000, M2200VA, M3200VA, MD30-800 C/M, MS2150VA) + matching upload-script extension |
| [#165 — Sanity PDF uploads](https://github.com/line-tech-kr/company-website-frontend/issues/165) | TBD | 50+ new Sanity catalogue/manual/datasheet documents |
| [#166 — KR→EN/ZH translations](https://github.com/line-tech-kr/company-website-frontend/issues/166) | TBD | 38 translation files in `catalog-extract/2026/translations/<slug>.md` |

These three run independently and merge in their own PRs.

## What this PR contains (in this repo)

- `.gitignore` addition for `.work/` (catalogue staging dir, throwaway)
- This handoff doc (`docs/catalogue-2026-handoff.md`)

That's it. The actual deliverables are in `company-docs-private` (separate filesystem location, not git-tracked here). This PR exists mainly as a coordination artifact + the gitignore line.

## Phase 2 (NOT in this PR)

After sign-off on `product-catalog-2026.md` and `lineup-diff.md`:

1. Update `scripts/parse-catalog.ts` to consume the new markdown (default path bump + regex check)
2. Add `connectorType` field to `sanity/schemaTypes/product.ts`
3. Re-run `parse-catalog.ts` → regenerate `src/lib/fixtures/products.json`
4. Update `public/products/_manifest.json` to match new lineup
5. Run `scripts/seed-products.ts --force` against Sanity
6. Run `scripts/upload-product-cutouts.ts --force` (after #164 lands)
7. Delete retired Sanity docs (with confirmation)
8. Add 301 redirects for renamed slugs
9. Verify on Vercel preview, then merge

## Verification done in Phase 1

- 73 source files audited (every file in zip categorized — see `.work/inventory.md`)
- 35 product images extracted and reviewed
- xlsx parser correctly captures 37 products + connection tables
- DO400 docx specs sanity-checked (range, accuracy, supply, connector)
- Spec mismatches between xlsx and docx flagged (12 products, xlsx wins per decision)
- Lineup diff cross-checked vs 2020 catalog and current `public/products/`

## Verification deferred to Phase 2

- Run `parse-catalog.ts --dry-run` against `product-catalog-2026.md` (depends on regex update)
- End-to-end on Vercel preview
- i18n parity check after translations land
