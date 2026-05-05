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
| `pnpm test:coverage`     | Vitest with V8 coverage (HTML at `coverage/`)     |
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

## Testing

Vitest + Testing Library + jsdom. Tests live next to the code as `*.test.ts(x)`.

**Where things are**

- Test runner config: `vitest.config.ts`
- Setup (jest-dom matchers, env stubs): `vitest.setup.ts`
- Shared mocks + fixtures: `src/test/`

**Shared utilities** (in `src/test/`)

- `mocks/i18n.ts` — registers `vi.mock` for `next-intl` and `@/i18n/navigation`. Side-effect import: `import "@/test/mocks/i18n";` as the first line of the test file.
- `mocks/sanity.ts` — registers `vi.mock` for `@/sanity/fetch`. Use `mockFetchSanity({ "<ctx.name>": () => fixture })` per test (or in `beforeEach`). Unmocked names throw, so missing setup fails loudly.
- `fixtures/products.ts` — `productFixture` and `makeProduct(overrides)` for Sanity-shaped product data.

**When the shared `i18n` mock isn't enough** — if you need control over `usePathname`, `useRouter`, `useLocale`, or `routing`, declare your own `vi.mock` inline (see `MobileNav.test.tsx`).

**Coverage** — `pnpm test:coverage` writes an HTML report to `coverage/index.html`. No threshold yet; it's a diagnostic, not a gate.

**Pre-push hook** — `git push` runs `pnpm test:run` via husky. Bypass with `--no-verify` only if you really mean it; CI runs the same command and will block the merge anyway.

## Reference docs

- `docs/current-site-audit.md` — full audit of the legacy site (product inventory, color extraction, sitemap)
- `docs/linetech-slice-1.md` — first vertical slice plan (M3030VA product page)
- `docs/handoff/` — design system handoff prototype
- `CLAUDE.md` / `AGENTS.md` — instructions for AI assistants working in this repo
