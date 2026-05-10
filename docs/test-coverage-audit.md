# Test coverage audit

Snapshot of the test suite at the time of the "strengthen tests" initiative. Captured on `worktree-strengthen-tests`.

## Baseline

Coverage % is scoped to **Tier A only** (logic, route handlers, middleware, hooks). Tier C paths — presentational components, static content, type-only files, RSC pages/layouts — are excluded from the coverage `include` so the threshold gate isn't diluted by code that policy says shouldn't be unit-tested. See `vitest.config.ts → coverage.exclude`.

`pnpm test:coverage` on a clean checkout:

| Metric     | Covered / Total | Percent |
| ---------- | --------------- | ------- |
| Statements | 155 / 496       | 31.25%  |
| Branches   | 63 / 228        | 27.63%  |
| Functions  | 31 / 113        | 27.43%  |
| Lines      | 137 / 438       | 31.27%  |

Test suite: **13 vitest specs / 90 tests**, **5 Playwright specs**. Tier B/C component tests (HeaderNav, MegaMenu, MobileNav, MarketsMap, FeatureSection) still run — they verify behavior — but don't contribute to the coverage %.

## Existing tests

### vitest (13)

- `src/middleware.test.ts`
- `src/app/products/[slug]/spec.json/route.test.ts`
- `src/components/home/Feature/FeatureSection.test.tsx`
- `src/components/layout/HeaderNav/HeaderNav.test.tsx`
- `src/components/layout/MegaMenu/MegaMenu.test.tsx`
- `src/components/layout/MobileNav/MobileNav.test.tsx`
- `src/components/company/MarketsMap.test.tsx`
- `src/lib/types/product-drawings.test.ts`
- `src/lib/products/slug-redirects.test.ts`
- `src/lib/products/localizeSpecValue.test.ts`
- `src/lib/products/flagship.test.ts`
- `src/lib/content/shell.test.ts`
- `src/lib/hooks/useDialogPanel.test.ts`

### Playwright (5)

- `e2e/applications.spec.ts`
- `e2e/contact-form.spec.ts`
- `e2e/contact-network.spec.ts`
- `e2e/locale-switch.spec.ts`
- `e2e/products.spec.ts`

## Tier definitions

- **Tier A — must test.** Logic that can be wrong: input validation, business rules, route handlers, middleware, data shaping for SEO/JSON-LD/feeds, hooks with state. Coverage gap = correctness gap.
- **Tier B — should test.** Stateful or branching components: forms, search, dialogs/drawers, carousels, locale switcher. Skipped historically because of cost; worth backfilling for the highest-traffic ones.
- **Tier C — skip.** Pure presentational components (rendering JSX from props), `src/lib/content/*` static content, type-only files, `src/sanity/**`, `src/app/studio/**`. Tests here would just assert "renders" or duplicate the source.

## Tier A gaps (must test)

### `src/lib/contact/` — inquiry form pipeline

| File           | What to cover                                                              |
| -------------- | -------------------------------------------------------------------------- |
| `schema.ts`    | zod parse: valid payload, each required-field violation, length limits     |
| `email.ts`     | Resend payload shape; mock client; surface Resend error to caller          |
| `captcha.ts`   | Turnstile verify success; fail; network error                              |
| `rate-limit.ts`| allow under limit; deny over limit; key derivation                         |
| `persist.ts`   | Sanity write payload shape; error propagation                              |
| `submit.ts`    | Orchestrator: success path; each upstream failure mode short-circuits      |

### `src/lib/seo/`

| File              | What to cover                                                       |
| ----------------- | ------------------------------------------------------------------- |
| `jsonLd.ts`       | Snapshot + key-field assertions for Organization / Product / FAQ    |
| `specSheet.ts`    | Markdown emission: required sections, locale variants, missing data |
| `llmsManifest.ts` | Manifest sections present; URLs locale-prefixed                     |

### `src/lib/` — pure utilities and hooks

| File                      | What to cover                                                      |
| ------------------------- | ------------------------------------------------------------------ |
| `format.ts`               | Table-driven: number formatting, locale-aware separators           |
| `categories.ts`           | category lookups, ordering, fallback                               |
| `i18n/dates.ts`           | Format date in ko / en / zh; invalid date handling                 |
| `seo.ts`                  | metadata builders, canonical URL, hreflang alternates              |
| `hooks/useScrollSpy.ts`   | RTL renderHook + IntersectionObserver mock                         |
| `hooks/useCarousel.ts`    | next/prev/jump; autoplay timer; pause                              |

### Route handlers

| File                                            | What to cover                            |
| ----------------------------------------------- | ---------------------------------------- |
| `src/app/llms.txt/route.ts`                     | 200 + text/plain + manifest sections     |
| `src/app/products/[slug]/spec.md/route.ts`      | 200 happy path; 404 unknown slug         |

### Dynamic-route Playwright gaps

`src/app/[locale]/...` dynamic pages currently lacking a happy-path + 404 e2e:

- `applications/[slug]/page.tsx`
- `products/[category]/page.tsx`
- `products/[category]/[product]/page.tsx`
- `contact/network/[region]/page.tsx`

(Existing `e2e/products.spec.ts` and `e2e/applications.spec.ts` may already cover the happy path — verify before duplicating.)

## Tier B gaps (selective backfill)

These are stateful/branching and worth testing; presentational siblings explicitly excluded.

- `src/components/forms/Turnstile.tsx` (loads SDK, renders fallback)
- `src/components/layout/Search/SearchPanel.tsx` + `SearchTriggerButton.tsx`
- `src/components/layout/LocaleSwitcher/LocaleSwitcher.tsx`
- `src/components/products/TabNav/TabNav.tsx` (tab state)
- `src/components/products/DimensionDrawing/*.tsx` (variant switcher)
- `src/components/accessories/AccessoriesSideNav.tsx` (active item, scroll spy)
- `src/components/layout/Breadcrumbs/*` (locale-aware paths)

## Tier C — explicitly out of scope

- All of `src/lib/content/*` (static config)
- `src/lib/fixtures/*`
- `src/lib/types/*` (type-only)
- `src/sanity/**`, `src/app/studio/**`
- Presentational: `Hero`, `*Card`, `*Logo`, `EmptyState`, `Stats`, `Intro`, `Credentials`, `Series`, `Footer`, `Header` shell, `CategoryHero`, `SectionHeader`, `Chip`, `Glyph`

## Future improvements (not in this PR)

- Move e2e job to run on PRs, not just `main` push, once flake rate is confirmed low.
- Once Tier A is filled, add a per-directory threshold for `src/lib/**` (target 80% lines/functions).
- Consider Storybook + visual regression for Tier C (replaces unit tests for pure-presentational).
