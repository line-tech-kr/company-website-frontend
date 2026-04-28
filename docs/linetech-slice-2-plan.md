# Line Tech Rebuild — Slice 2 Plan

## Context

Builds on `linetech-slice-1.md`. Slice 1 shipped the M3030VA product page end-to-end (i18n routing, Sanity schema, GROQ, studio). Gap: no header, no footer, no homepage, no way to navigate without typing a URL.

Slice 2 ships the site shell so every downstream slice has a home to hang from.

**Design handoff** (`docs/handoff/`) landed mid-slice and now drives the visual spec. Where the original plan and the design disagree, conflicts are flagged below for resolution.

---

## What's already shipped this slice

The home page (Intro, Stats, Series, Feature, Applications, Credentials, Contact) is built from the design — see `src/components/home/` and `src/app/[locale]/page.tsx`. Tokens live in `src/app/globals.css`; primitives (`Button`, `Glyph`, `Chip`) in `src/components/ui/`. Home content is typed and inline at `src/lib/content/home.ts` (NOT in `messages/*.json` — see deviation note below).

**Still missing — the rest of this plan:** header (PageShell top nav), footer, breadcrumbs, category pages.

---

## Scope (revised against design)

| Piece | What ships |
|---|---|
| **Top bar (header)** | Logomark + wordmark, 4-item nav, hover-to-open mega-menu, search panel, styled locale switcher (replaces unstyled `<LocaleSwitcher>`), "Quote" CTA, sticky-on-scroll compression |
| **Mega-menu — Products** | 3-col panel: series list (drives off `LT_HOME[locale].series.items` for single source of truth) + featured M3030VA card + resources link list |
| **Mega-menu — others** | 2-col simple link list for Solutions / Support / Company |
| **Footer** | Single-row: logomark + signoff + address + rights + version stamp |
| **Breadcrumbs** | Home › Products › Analogue MFC › M3030VA (renders on product pages, not home) |
| **Category pages** | `/[locale]/products/[category]` for all categories — fixture-backed, M3030VA real, siblings as shells |

---

## Locked decisions

### Top-level nav — 4 items

The plan originally locked **Company / Products / Data Room / Contact** (Korean B2B convention; credibility before catalog). The design uses **Products / Solutions / Support / Company** (catalog-first).

✅ **Resolved (2026-04-24):** keep the plan's IA — **Company / Products / Data Room / Contact**. Korean B2B buyers expect "Data Room" (catalogues, CAD, manuals) as a first-class destination; burying it under "Support" costs discoverability. Adopt the design's *visual treatment* (mega-menu structure, hover behavior, chevron-down indicator) but with plan's labels.

### Nav dropdown trigger — hover (revised)

Plan originally specced **click** (avoids hover flicker, works on touch). Design uses **hover with 120 ms grace timer + focus support + Esc to close + scrim backdrop**.

The design's hover implementation handles the failure modes the plan was avoiding: focus opens the menu (keyboard accessibility), scrim catches off-target clicks (no ghost-hover bugs), and touch falls through to click on mobile. Adopting the design's hover pattern.

### Search in header — included (revised)

Plan originally excluded header search. Design includes a search panel with autocomplete chips. Building the visual shell (input + close button + quick chips) but **wiring is stubbed** — actual search functionality is phase 2.

### Sticky header — included (revised)

Plan originally excluded sticky behavior. Design has the bar staying pinned, compressing height (`72px → 60px`) once scrolled past 40px. Design's choice — easy to ship, real UX win on long product pages.

### Quote CTA in header — included (new)

Design surfaces a primary "Quote" CTA in the top-right next to the locale switcher. Adding — this is high-intent conversion real estate that the plan missed. Wires to same target as home page final CTA (mailto for now, contact form later).

### Hero / homepage copy source — TS not JSON (deviation noted)

Plan originally locked hero copy in `messages/{ko,en,zh}.json` under `home.hero.*`. **What actually shipped:** typed `LT_HOME` object in `src/lib/content/home.ts`.

Reason: design data is heavily nested (series items, app cells, stat tuples, etc.) — flattening into next-intl's flat-key JSON format would explode key counts and lose type safety. Inline TS keeps it typed and editable. Migration path to Sanity-backed content if client asks: same shape, different loader.

🟡 Plan rationale for messages-based copy was "not worth a Sanity round-trip for copy that rarely changes" — that rationale still holds, just satisfied by the TS file instead of the JSON file.

### Logomark — real logo, not design placeholder

Design handoff uses a generic square-with-cross SVG as a placeholder. Real Line Tech logo is available at `docs/brand-reference/logo-crop.png`.

✅ **Resolved (2026-04-24):** use the **real logo** from `docs/brand-reference/logo-crop.png`. Placeholders in shipped code are a smell. If the PNG is too low-res for retina header use, trace it to SVG as a prerequisite — don't ship the generic placeholder.

### Category card content — superseded by Series section

Plan originally specced 5 homepage category cards (title + count + image). The design's **Series section** (4 cards: M/MS, MD, LD/LM, LTI) covers this need. Dropping the separate category-grid spec — Series IS the category grid.

✅ **Resolved (2026-04-24, refined 2026-04-26):** catalog taxonomy is **4 (function × type)** — Analogue MFC, Digital MFC, MFM, Specialized. Buyers shop by function ("I need a digital MFC"), not by internal SKU series (M/MD/LD/LTI mean nothing to new customers). Series stays as a filter/facet *within* a category, not as the category itself. Homepage Series section keeps the design's 4-series visual as a secondary entry point; mega-menu and category pages route on the 4-way function taxonomy. Accessories (LTI readouts, FC-050S, PR-030) surface as a callout block on the `/products` index page rather than as a top-level category — too few SKUs to earn nav real-estate, and they're system support rather than peer to MFC/MFM.

### Company section IA — single scroller with anchored sections (closes #29)

Issue #29 asked three questions: single scroller vs page-per-topic; whether Certifications should get a nav spotlight; and whether Company needs a dropdown at all.

✅ **Resolved (2026-04-27):** **single scroller** at `/company` with four anchored sections (`#greeting`, `#history`, `#certifications`, `#location`); a sticky side-nav drives scroll-spy active state; mega-menu links and the spotlight card all point to the matching anchor.

- **Route:** `/company` only. The four sections render top-to-bottom on one page; deep links use anchor URLs (`/company#certifications` etc.) and stay shareable.
- **Why not page-per-topic:** four standalone routes for what is effectively one institutional narrative bloated the IA — Greeting and Location especially are filler pages by themselves. A single scroller reads as a continuous "About Line Tech" story, mobile-friendly, and the four-section structure is preserved visually via section dividers and the side-nav. Anchored URLs preserve the deep-link case for RFQs (`/company#certifications` works the same as `/company/certifications` for sharing).
- **Side-nav scroll-spy:** sticky `CompanySideNav` is a client component running an `IntersectionObserver` (rootMargin `-88px / -60%`) so the active item tracks scroll position. Hidden behind `prefers-reduced-motion` for the smooth-scroll behavior.
- **Certifications spotlight:** kept inside the Company mega-menu featured card (`shell.ts`) pointing at `/company#certifications` — credibility surface without inflating global nav.
- **Dropdown stays:** mega-menu still useful as a discovery surface for the four sections (vs forcing users to scroll to find them).
- **"Greeting" voice:** institutional copy without CEO photo or signature — no portrait or signed-letter assets needed from the client.
- **Certifications content gap:** the legacy site has 13 unlabeled cert JPGs but only 3 have recovered text labels (ISO 9001, CE, INNOBIZ). Initial build ships those 3 as full cards plus a footnote acknowledging 10 additional conformity documents available on request. A Sanity-driven expansion is a phase-2 task (filed below).

---

## Deferred / follow-ups

- **Mobile nav → slice 7.** Plan-original. Design also defers (`.pd-top__nav` hides at `max-width: 1000px` with no replacement). B2B MFC audience is desktop-first.
- **Header search wiring** — visual shell ships now, actual search → phase 2 (depends on Sanity index).
- **Theme/accent toggles** — design has `[data-theme="dark"]` and `[data-accent-mode="yellow"]` hooks but no UI trigger. Hardcoded to `light` / `blue` for now.
- **Utility bar** — design CSS supports a top utility strip (`.pd-top__util` with hours/contacts) but design's `PageShell.jsx` doesn't render it. Skipping unless requested.
- **Certifications detail (10 unnamed)** — legacy site has 13 cert JPGs; only 3 have recovered text. `/company/certifications` ships with the 3 named + footnote. Phase 2: collect names/issuers/dates for the remaining 10 from the client and surface them, ideally Sanity-managed.

---

## Critical files (revised)

```
# Header / shell
src/components/layout/PageShell.tsx              (wraps Header + children + Footer)
src/components/layout/Header.tsx                 (the .pd-top top bar)
src/components/layout/HeaderNav.tsx              (client — hover/focus state, nav items)
src/components/layout/MegaMenu.tsx               (client — Products + simple-list variants)
src/components/layout/SearchPanel.tsx            (client — visual shell only, no wiring)
src/components/layout/LocaleSwitcher.tsx         (rewrite — styled .lt-locale pill, replace current unstyled)
src/components/layout/Footer.tsx                 (single-row footer)
src/components/layout/Breadcrumbs.tsx            (server — renders on product pages)

# Wiring
src/app/[locale]/layout.tsx                      (replace bare LocaleSwitcher with <PageShell>)
src/lib/content/shell.ts                         (typed nav items + footer copy, ko/en/zh)

# Styles
src/app/globals.css                              (add .pd-top, .pd-mm, .pd-search, .pd-foot, .lt-locale)

# Category pages (still pending)
src/app/[locale]/products/page.tsx               (all-products index)
src/app/[locale]/products/[category]/page.tsx   (dynamic category page)
src/lib/fixtures/categories.ts                   (5 categories: Analogue MFC, Digital MFC, MFM, Specialized, +1)
```

## Explicit exclusions

Pretendard font (using next/font Inter + JetBrains Mono — already shipped), animations beyond CSS transitions, header search wiring (visual only), dark mode UI toggle, mobile nav, theme/accent toggles, Sanity-backed nav copy.

## Verification

1. `/` (no locale) redirects to `/ko` regardless of `Accept-Language` (already verified — `localeDetection: false`)
2. `/ko` renders header (logomark + 4-item nav + search + KO/EN/ZH pill + Quote CTA), home page (7 sections), footer
3. Hover any nav item → mega-menu opens within 120 ms; mouse off → closes after 120 ms grace
4. Tab into nav with keyboard → mega-menu opens on focus; Esc closes
5. Click "Products" mega-menu's M3030VA card → product page
6. Click search icon → search panel opens; Esc or click scrim closes
7. Scroll past 40px → header compresses to 60px height; scroll back up → expands
8. Switch locale via header pill → same path, swapped prefix, content updates
9. Breadcrumbs appear on product page; click "Products" → category index
10. `pnpm build` static-gens `/`, `/ko`, `/en`, `/zh`, `/[locale]/products`, `/[locale]/products/[category]`, `/[locale]/products/analogue-mfc/m3030va`

---

## Open questions before implementation

All three resolved 2026-04-24 — see **Locked decisions** above (nav labels, category taxonomy, logomark). Issue #2 closed.
