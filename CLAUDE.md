# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Company website rebuild for Line Tech Inc. (라인텍), a Korean manufacturer of Mass Flow Controllers (MFC) and Mass Flow Meters (MFM). Modernizing a legacy PHP/Gnuboard site into a modern stack while preserving brand identity and migrating ~30 products, 22 manuals, 14 CAD drawings, and certifications.

## Locked Architecture Decisions

These are final — do not propose alternatives:

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`)
- **CMS:** Sanity (hosted, free tier) — non-technical staff manage products + PDFs
- **Deploy:** Vercel
- **i18n:** Korean + English + Chinese, all equal priority, using next-intl with `[locale]` URL segments (NOT three parallel content sites like the old PHP build)
- **Scope:** MVP = public site + product catalog migrated + inquiry form. Product finder, comparison tool, blog, site search are phase 2.

## Brand Colors (preserve exactly)

```
primary:      #185686  (brand blue — headings, primary actions)
primary-dark: #1f375e  (hover/active states)
primary-deep: #172e75  (rare — deep headers)
accent:       #fdbc04  (gold — CTAs, highlights)
```

Build the full Tailwind color scale (50–950) around these anchors. Neutrals, state colors, and semantic tokens get rebuilt fresh.

## Key Content to Preserve

- Product catalog: Analogue/Digital × MFC/MFM × Standard/Specialized taxonomy
- Product detail specs (flow range, accuracy, response time, connections, dimensions)
- Data Room: catalogues, AutoCAD drawings, manuals (all downloadable)
- Company history timeline (1997–2020) — strong credibility asset
- Certifications (13 total, need real text labels — old site had unlabeled JPGs only)

## Testing expectations

- New `src/` modules with logic ship with vitest coverage (component or unit).
- New dynamic routes (`src/app/[locale]/.../[param]/page.tsx`) ship with a Playwright spec covering the happy path and the `notFound()` path.
- Run locally with Node 22 (`nvm use 22`) — vitest 4 + std-env requires `require(esm)` support.

### Tiers (see `docs/test-coverage-audit.md`)

- **Tier A (must test)** — logic in `src/lib/`, route handlers, middleware, hooks with state. Coverage gap = correctness gap.
- **Tier B (should test)** — stateful or branching components: forms, search, dialogs, locale switcher, tab nav.
- **Tier C (skip)** — pure presentational components, `src/lib/content/*`, type-only files, Sanity/studio.

### Coverage gate

`vitest.config.ts` enforces coverage thresholds. CI (`pnpm test:coverage` in `.github/workflows/ci.yml`) fails on regression below baseline.

**Ratchet policy:** when you add tests that raise overall coverage, also raise the `thresholds` in `vitest.config.ts` to the new baseline (rounded down). Coverage can never silently regress.

## Reference

- `docs/catalogue-2026-handoff.md` — 2026 product catalog refresh; active source-of-truth for the current lineup (LM and LD series retired, LEPC and DO400 added)
- `docs/catalog-extract/` — machine-readable extracts from the 2026 catalog
- `docs/handoff/` — design system handoff prototype
- `docs/brand-reference/` — brand assets and colour reference

@AGENTS.md
