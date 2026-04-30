# Line Tech Inc. — Company Website

Modern rebuild of [line-tech.co.kr](https://line-tech.co.kr) for Line Tech Inc. (주식회사 라인텍), a Korean manufacturer of Mass Flow Controllers (MFC) and Mass Flow Meters (MFM).

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme`)
- **CMS:** Sanity (hosted) — non-technical staff manage products + downloadable PDFs
- **i18n:** Korean / English / Chinese via `next-intl` (native Next.js i18n routing)
- **Deploy:** Vercel

See `CLAUDE.md` for locked architecture decisions and brand tokens.

## Prerequisites

- Node.js >= 22 (see `.nvmrc`)
- pnpm 10 (`packageManager` field pins the version)

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in NEXT_PUBLIC_SANITY_PROJECT_ID
pnpm dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000). The default locale (`ko`) is served at `/`; English at `/en`, Chinese at `/zh`.

## Scripts

| Command                  | What it does                                      |
| ------------------------ | ------------------------------------------------- |
| `pnpm dev`               | Start the Next.js dev server                      |
| `pnpm build`             | Production build                                  |
| `pnpm start`             | Run the production build                          |
| `pnpm lint`              | ESLint                                            |
| `pnpm typecheck`         | `tsc --noEmit`                                    |
| `pnpm test` / `test:run` | Vitest (watch / one-shot)                         |
| `pnpm format`            | Prettier (write)                                  |
| `pnpm seed:products`     | Seed Sanity from `public/products/_manifest.json` |

## Project layout

```
src/
  app/[locale]/        # localized routes (home, products, contact, company)
  app/studio/          # embedded Sanity Studio at /studio
  components/          # ui/, home/, products/, layout/, company/
  lib/content/         # static content + types per locale (KO/EN/ZH)
  i18n/                # next-intl routing + request config
  sanity/              # client + queries
sanity/schemaTypes/    # Sanity schema definitions
messages/              # next-intl message catalogs (en/ko/zh)
public/products/       # migrated product imagery + manifest
docs/                  # site audit, slice plans, design handoff
scripts/               # catalog parser + Sanity seeder
```

## Reference docs

- `docs/current-site-audit.md` — full audit of the legacy site (product inventory, color extraction, sitemap)
- `docs/linetech-slice-1.md` — first vertical slice plan (M3030VA product page)
- `docs/handoff/` — design system handoff prototype
- `CLAUDE.md` / `AGENTS.md` — instructions for AI assistants working in this repo

## Continuous integration

- `.github/workflows/ci.yml` — format / lint / typecheck / test / build on every pull request and on pushes to `main`.
- `.github/workflows/claude-review.yml` — automated pull request review by Claude (`anthropics/claude-code-action`); runs on non-draft pull requests from this repo.
