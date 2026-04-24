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
- **i18n:** Korean + English + Chinese, all equal priority, using Next.js native i18n routing (NOT language-per-URL duplication like the old site)
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

## Reference

- `docs/current-site-audit.md` — full audit of the legacy site with product inventory, color extraction, sitemap, and open questions
- `docs/linetech-slice-1.md` — first vertical slice plan (M3030VA product page end-to-end)

@AGENTS.md
