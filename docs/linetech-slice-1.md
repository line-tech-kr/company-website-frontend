# Line Tech Rebuild — Slice 1 Plan

## Context

Line Tech's existing site (`line-tech.co.kr`) is a legacy Gnuboard PHP build; the repo is being rewritten as a Next.js 15 App Router application with KO/EN/ZH locales and a Sanity-backed product catalog (~44 products per the April 2026 English catalog).

A full 16-phase MVP plan exists but will drift from reality by the time it's half-executed. This plan scopes **the first shippable vertical slice**: one product detail page, end-to-end, with hardcoded fixtures first and Sanity wired in last — so schemas are shaped by what the page actually needs, not designed in the abstract.

Sections 2–4 of this document record the locked stack, schema, and open-question decisions that govern later phases. Only Section 1 is executable in this slice.

---

## Execution shape

```mermaid
flowchart LR
  A[A. Scaffold<br/>Next 15 + TS + Tailwind v4<br/>pnpm] --> B[B. i18n routing<br/>next-intl<br/>ko/en/zh]
  B --> C[C. Design tokens<br/>brand colors<br/>Button + Card]
  C --> D[D. Product page<br/>+ TS fixture]
  D --> E[E. Sanity<br/>schema from fixture<br/>seed M3030VA<br/>swap to GROQ]

  subgraph "Verification gates"
    V1[pnpm dev<br/>no errors]
    V2[/ko redirect<br/>locale switch]
    V3[spec table<br/>renders 10 rows]
    V4[pnpm build<br/>static gen]
    V5[Sanity edit →<br/>page updates]
  end

  B -.-> V1
  B -.-> V2
  D -.-> V3
  D -.-> V4
  E -.-> V5
```

Data flow before/after Sanity:

```
SLICE 1a (steps A–D):  fixtures/products.ts ──► page.tsx ──► <SpecTable/>
SLICE 1b (step E):     Sanity studio ──► GROQ query ──► page.tsx ──► <SpecTable/>
                                 (fixture deleted)
```

---

## Section 1 — Slice 1 (execute now)

One product detail page for **M3030VA** rendered at `/[locale]/products/analogue-mfc/m3030va`, built against fixtures first and Sanity-backed at the end of the slice.

### Step A — Scaffold

Run `pnpm create next-app@latest .` in the empty repo with: TypeScript, ESLint, Tailwind, App Router, `src/` directory, import alias `@/*`. Then add Prettier.

**Files written by scaffold** (will be modified in later steps): `package.json`, `tsconfig.json` (enable `strict`), `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `.eslintrc`, `.prettierrc`.

Delete the generated `src/app/page.tsx` and `src/app/globals.css` boilerplate content — we'll replace with locale-scoped equivalents.

### Step B — i18n routing (next-intl)

Install `next-intl`. Wire per the canonical App Router setup:

| Path | Contents |
|---|---|
| `src/i18n/routing.ts` | `defineRouting({ locales: ['ko','en','zh'], defaultLocale: 'ko' })` |
| `src/i18n/request.ts` | `getRequestConfig` loading `messages/${locale}.json` |
| `src/middleware.ts` | `createMiddleware(routing)`; matcher excludes `/_next`, `/api`, static assets |
| `next.config.ts` | wrap export in `createNextIntlPlugin('./src/i18n/request.ts')` |
| `messages/ko.json`, `en.json`, `zh.json` | stubs with `product.specs.flowRange`, `product.specs.responseTime`, … (10 spec labels) + `nav.products`, `common.download` |
| `src/app/[locale]/layout.tsx` | calls `setRequestLocale`, wraps children in `NextIntlClientProvider`, loads messages |
| `src/app/[locale]/page.tsx` | placeholder "Line Tech" homepage — one `<h1>`, links to the one product |

Delete `src/app/layout.tsx` and `src/app/page.tsx` so all routes live under `[locale]`.

### Step C — Design tokens + primitives

Tailwind v4 uses CSS-first config. In `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-brand-900: #172e75;   /* darkest blue */
  --color-brand-800: #1f375e;   /* header blue */
  --color-brand-700: #185686;   /* primary brand blue */
  --color-accent-400: #fdbc04;  /* gold accent */
  --font-sans: ui-sans-serif, system-ui, /* Pretendard when available */ sans-serif;
}
```

Primitives (minimal, no variants beyond what the product page needs):

| Path | Purpose |
|---|---|
| `src/components/ui/Button.tsx` | `variant: 'primary' \| 'ghost'`, `asChild` via `React.cloneElement` (no Radix) |
| `src/components/ui/Card.tsx` | wrapper div with border + padding tokens |

Defer: spacing scale overrides, full color ramps, typography scale. The page only needs brand blue heading + body text.

### Step D — Product detail page (fixture-backed)

**Fixture:**

`src/lib/fixtures/products.ts` — single export `M3030VA` matching the shape we'll later mirror in Sanity. The 10 M3030VA spec rows from the catalog:

```
model:          "M3030VA"
series:         "analogue"
function:       "MFC"
formFactor:     "M"
connections:    [{ type: '1/4" SW', length: "131.3 mm" }]
massFlowSpecs.flowRange:      { display: "0.01–30 slpm", min: 0.01, max: 30, unit: "slpm", referenceGas: "N2" }
massFlowSpecs.responseTime:   { display: "<2 seconds", value: 2, unit: "s", comparator: "lt" }
massFlowSpecs.accuracy:       { display: "±1% of FS", value: 1, unit: "%FS" }
massFlowSpecs.repeatability:  { display: "±0.2% of FS", value: 0.2, unit: "%FS" }
massFlowSpecs.ioSignal:       { display: "0–5 Vdc or 4–20 mA", outputs: ["0-5Vdc","4-20mA"] }
massFlowSpecs.supplyPower:    { display: "+15 or +24 Vdc, 350 mA", voltages: [15,24], currentMA: 350 }
massFlowSpecs.maxPressure:    { display: "<90 bar", value: 90, unit: "bar", comparator: "lt" }
massFlowSpecs.tempRange:      { display: "0–50 °C", min: 0, max: 50, unit: "°C" }
massFlowSpecs.leakRate:       { display: "1×10⁻⁹ atm·cc/sec", value: 1e-9, unit: "atm·cc/sec" }
massFlowSpecs.controlRange:   { display: "2–100%", min: 2, max: 100, unit: "%" }
```

Type this as `Product` in `src/lib/types/product.ts` — this type is the schema source of truth and gets mirrored into Sanity in Step E.

**Page + components:**

| Path | Purpose |
|---|---|
| `src/app/[locale]/products/analogue-mfc/m3030va/page.tsx` | server component; imports fixture; renders `<ProductHero>`, `<SpecTable>`, `<DimensionDrawing>`, `<DownloadsList>` |
| `src/components/product/SpecTable.tsx` | iterates spec entries, renders label from `useTranslations('product.specs')`, value from `spec.display` literally (no formatting) |
| `src/components/product/ProductHero.tsx` | model number + `<h1>`, image placeholder (`next/image` with `data:` or `/placeholder.svg`) |
| `src/components/product/DimensionDrawing.tsx` | image placeholder + caption |
| `src/components/product/DownloadsList.tsx` | empty-state list with 2 stub rows (Datasheet, Manual) |
| `src/components/layout/LocaleSwitcher.tsx` | three links; preserves current pathname via `usePathname` + `useRouter` from `next-intl` |

Include `LocaleSwitcher` in `src/app/[locale]/layout.tsx` as the only nav element for slice 1.

**Route segment:** use `export const dynamicParams = false` and `generateStaticParams` returning the three locales on `[locale]/layout.tsx`; on the product page, `generateStaticParams` returns `[{}]` (single product).

### Step E — Sanity wiring (last)

Only once A–D are green:

1. `pnpm dlx sanity@latest init --template clean --create-project "linetech" --dataset production` — colocate the studio under `/sanity/` in the same repo (embedded studio via `src/app/studio/[[...tool]]/page.tsx`).
2. Install `next-sanity`, `@sanity/client`, `@sanity/image-url`, `sanity-plugin-internationalized-array@^5`.
3. Create `sanity/schemas/product.ts` mirroring the fixture's `Product` type — **only the fields slice 1 uses** (identity, classification, `massFlowSpecs`, `connections`, `images`, `dimensionDrawing`). Defer `readOutSpecs`, `accessorySpecs`, `productCertifications`, `applicationNotes`, `downloads`, `description` i18n to slice 2 — they're documented in Section 3 below but not needed to render M3030VA.
4. `sanity/schemaTypes/index.ts` exports `[product]`.
5. Studio route at `/studio`, dataset `production`, visionTool in dev.
6. Seed: open studio, create M3030VA document, paste values from fixture. (Migration script deferred to slice 2.)
7. `src/sanity/client.ts` — `createClient({ projectId, dataset, apiVersion: '2026-01-01', useCdn: true })`.
8. `src/sanity/queries.ts` — `productBySlug` GROQ pulling the same fields.
9. Swap `page.tsx` from fixture import to `await sanityFetch({ query: productBySlug, params: { slug: 'm3030va' } })`.
10. Delete `src/lib/fixtures/products.ts` once the swap works.

Env vars (add to `.env.local` and `.env.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=
```

### Dependencies installed in slice 1

```
next@^15  react@^19  typescript@^5
tailwindcss@^4
next-intl@^3
sanity@^3  next-sanity@^9  @sanity/client@^6  @sanity/image-url@^1
sanity-plugin-internationalized-array@^5
```

Not installed until later slices: `lucide-react`, `react-hook-form`, `zod`, `@hookform/resolvers`, `nodemailer`.

### What slice 1 explicitly excludes

Homepage (placeholder only), About/Applications/Support, Data Room, inquiry form, category/list pages, bulk product migration, header nav beyond locale switcher, Framer Motion, lucide-react, Resend/Nodemailer, Vercel deploy. All of these are tracked in Sections 2–3 but out of scope here.

### Critical files

| Path | Role |
|---|---|
| `package.json` | deps pinned as listed above |
| `next.config.ts` | wraps export in `createNextIntlPlugin` |
| `tsconfig.json` | `strict: true` |
| `src/middleware.ts` | `next-intl` createMiddleware(routing) |
| `src/i18n/routing.ts`, `src/i18n/request.ts` | locale config + message loader |
| `messages/ko.json`, `en.json`, `zh.json` | spec labels + nav stubs |
| `src/app/globals.css` | Tailwind v4 `@theme` tokens |
| `src/app/[locale]/layout.tsx` | locale layout, intl provider, `<LocaleSwitcher/>` |
| `src/app/[locale]/page.tsx` | placeholder homepage |
| `src/app/[locale]/products/analogue-mfc/m3030va/page.tsx` | the product page |
| `src/lib/types/product.ts` | `Product` type (schema source of truth) |
| `src/lib/fixtures/products.ts` | M3030VA fixture (deleted at end of slice) |
| `src/components/ui/{Button,Card}.tsx` | primitives |
| `src/components/product/{SpecTable,ProductHero,DimensionDrawing,DownloadsList}.tsx` | page components |
| `src/components/layout/LocaleSwitcher.tsx` | locale nav |
| `sanity/schemas/product.ts` | schema mirroring fixture |
| `src/sanity/{client,queries}.ts` | GROQ client + productBySlug |
| `src/app/studio/[[...tool]]/page.tsx` | embedded studio |
| `.env.example` | env vars listed above |

### Verification

1. `pnpm dev` → no type or lint errors.
2. Visit `http://localhost:3000/` → 307 to `/ko`.
3. Visit `/en/products/analogue-mfc/m3030va` → all 10 spec rows render with the values above; heading is brand-blue (`#185686`); hero + dimension placeholders visible; two download stub rows.
4. Click locale switcher → path flips to `/ko/products/analogue-mfc/m3030va` and `/zh/products/...` with same structure; spec labels translate (from message files), spec values unchanged.
5. `pnpm build` → static generation succeeds for all three locale variants of the product route.
6. (End of step E only) In `/studio` edit M3030VA's `massFlowSpecs.flowRange.display` from `"0.01–30 slpm"` to `"0.01–30 slpm (test)"`, hard-refresh page → new value renders.

---

## Section 2 — Locked stack decisions (reference for later slices)

| # | Choice | Decision |
|---|---|---|
| 1 | Package manager | **pnpm** |
| 2 | i18n library | **next-intl** (locales: ko/en/zh, default ko) |
| 3 | Styling | **Tailwind CSS v4** (CSS-first `@theme`) |
| 4 | Animations | **None** (CSS transitions + View Transitions only; cut Framer Motion) |
| 5 | Icons | **lucide-react** (deferred to slice 2) |
| 6 | Inquiry email | **Nodemailer + Gmail app password** (`mrmfckorea@gmail.com`, 500/day cap; cut Resend) |
| 7 | Form stack | **react-hook-form + Zod + `@hookform/resolvers`** |
| 8 | Localized Sanity fields | **`sanity-plugin-internationalized-array@^5`** (v3 in old plan is stale; plugin moved to `sanity-io/plugins` monorepo, verified 2026-04-21) |

Env vars needed in later slices:

```
SANITY_API_WRITE_TOKEN=          # migration script only
GMAIL_USER=mrmfckorea@gmail.com
GMAIL_APP_PASSWORD=              # 16-char, requires 2FA on account
INQUIRY_TO_EMAIL=linetech@line-tech.co.kr
INQUIRY_FROM_EMAIL="Line Tech Website <mrmfckorea@gmail.com>"
```

---

## Section 3 — Sanity content model (decided, but only `product` partially built in slice 1)

**Four Sanity document types for the whole MVP:**

1. **`product`** — catalog entries (~44). Polymorphic via `productCategory: 'mass-flow' | 'read-out' | 'accessory'`; irrelevant fields hidden in studio via `hidden` callbacks. Full schema shape:

   - Identity: `model` (string, not localized), `slug` (source: `model`), `productCategory` (discriminator).
   - Classification (mass-flow only): `series` (`analogue|digital|specialized`), `subSeries` (`LD|LM|EX`, specialized only), `function` (`MFC|MFM`), `formFactor` (`M|MS`, analogue only), `sibling` (ref to paired product), `connections` (array of `{type, length}`).
   - `massFlowSpecs`: each spec is `{display, …structured}` — `flowRange`, `responseTime`, `accuracy`, `repeatability`, `ioSignal`, `supplyPower`, `maxPressure`, `tempRange`, `leakRate`, `controlRange`; plus `digitalCommunication` (digital series only).
   - `readOutSpecs` (read-out only): `inputPower`, `outputPower`, `displayWindow`, `displayRepeatability`, `outputSignal`, `unitsOfDisplay[]`, `setPoint`, `flowOnOff`, `flowOutSignal`, `communication`.
   - `accessorySpecs` (accessory only): array of `{label, value}` rows.
   - Common: `images[]`, `dimensionDrawing`, `description` (localized portable text), `productCertifications: string[]` (e.g. `"Ex ec IIC T4 Gc"`, `"IP 65 Grade"`), `applicationNotes` (localized string), `downloads[]` (refs), `order`.

2. **`download`** — PDFs/CAD/software. Fields: `title` (localized), `type` (`catalogue|manual|cad|software|protocol|brochure`), `file` (asset), `language` (`ko|en|zh|multi`), `relatedProducts[]` (refs), `relatedSeries: string[]`, `version`, `publishDate`. No slug, no standalone page — surfaces on product detail only.

3. **`certification`** — company-level certs (ISO 9001:2015, CE confirmed; 11 others TBD from client). Fields: `name`, `issuer`, `certificateNumber`, `dateIssued`, `dateReissued`, `dateExpires`, `image`, `description` (localized PT), `order`.

4. **`siteSettings`** — singleton. Contact info (landline + mobile `+82-10-8696-6898`), fax, email, address, hours, services (`["Customer Seminar","Repair","Recalibration","Trouble Shooting","Consultation"]`), `warranty` (portable text).

**Hardcoded / JSON, not Sanity:**
- About pages (Greetings, Business, Location, Support) → Next.js TS files + `messages/*.json`.
- History timeline → TS array.
- Gas compatibility (187 rows from catalog pp. 81–85) → static JSON; powers `/data-room/gas-compatibility` in a later slice.
- Interface specs (pin-outs, pp. 70–77) → static JSON.
- Applications page → hardcoded placeholders.

**Render rule:** `<SpecTable>` always reads `spec.display` and renders it literally — handles edge cases like `"inquiry"`, `"<2 seconds"`, `"1×10⁻⁹ atm·cc/sec"`, `"15V or 24V"`. Structured fields (`min`, `max`, `value`, `comparator`) power phase-2 filter/compare only; never rendered directly.

**Catalog note to confirm with client:** p.53 of the 2026 catalog labels `LD030M` as "MEMS Tech Mass Flow Meter", but LD is the Display series and LM is MEMS. Likely typo; verify during migration.

---

## Section 4 — Audit open questions (resolved)

| # | Question | Decision |
|---|---|---|
| 1 | Real titles for 11 unlabeled certs | Defer cert page to phase 2. Build `certification` schema + `/about/certifications` skeleton; feature-flag the nav link until client provides metadata. |
| 2 | Product photography resolution | Design for catalog-quality (~800px). Don't upscale. Client to supply originals when available. |
| 3 | Gnuboard `/adm` hidden content | Closed — Gnuboard admin manages posts/users, no hidden pages. |
| 4 | File formats of catalogues/manuals | Closed — PDF/DWG/ZIP. `download.file` accepts any asset. |
| 5 | Traffic breakdown by language | Ship `/zh/*` with EN fallback + "translation in progress" badge where ZH content missing. Not a launch blocker. |
| 6 | KO Q&A board SEO value | Archive to JSON in repo. Zero MVP scope. Revisit in phase 2. |
