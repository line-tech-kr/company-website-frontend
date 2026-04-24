# Line Tech — Current Site Audit

**Source:** `https://www.line-tech.co.kr/` (crawled 2026-04-21)
**Purpose:** Snapshot of the legacy site before modernization. Reference for migration decisions.

**Companion inventories** (full page-by-page content extraction):
- `docs/content-inventory-ko.md` — Korean site (primary source of truth)
- `docs/content-inventory-en.md` — English site
- `docs/content-inventory-zh.md` — Chinese site

---

## 1. Executive Summary

Line Tech's current site is a content-rich but visually dated PHP/Gnuboard site with three language variants served as parallel duplicated sites rather than proper i18n. It has genuine engineering value — ~30 products with real specs, 22 manuals, 14 CAD drawings, certifications, and a 20+ year company history — but buries all of it under weak visual hierarchy, empty pages, and a `mailto:` inquiry flow.

**Keep (high-value content):** product catalog with specs, downloads library, history timeline, certifications, **Korean Q&A board + ABOUT MFC community threads** (real FAQ seeds).
**Cut (weak implementation):** Gnuboard admin, `mailto:` inquiry (EN side), empty ReadOutBox page, language-per-URL duplication.
**Add (missing):** Applications/industries page, filterable product catalog, proper inquiry + quote form (EN parity with KO), curated FAQ page built from the Korean Q&A content, institutional About copy, real certification text.

**Parity gap:** the Korean site has a live Q&A board, a community troubleshooting board ("ABOUT MFC"), and a real quote request form. The English site has none of this — just a `mailto:`. English-speaking buyers are materially worse served than Korean ones today.

### Locked Decisions (recorded here for perpetuity)

| Decision | Choice | Rationale |
|---|---|---|
| Brand continuity | **Preserve the brand** | Keep the existing primary blue `#185686` and gold accent `#fdbc04`. Modernize everything around them (neutrals, typography, layout, spacing). Rationale: buyers recognize the current visual identity; losing it costs brand equity. See §4 (Visual Design) for the full current palette. |
| Framework | Next.js 15 (App Router) + TypeScript | SSR/SSG for SEO on product pages, native i18n routing, Vercel deploy. |
| Styling | Tailwind CSS | |
| CMS | Sanity (hosted, free tier) | Non-technical staff can add products + upload PDFs; zero ops. |
| Languages | Korean + English at launch; Chinese in phase 2 | Matches where real buyer communication happens today. ZH planned but deferred. |
| About voice | Institutional (not personal CEO greeting) | "About the company" voice over "message from the CEO" — avoids needing CEO photography or personal branding. |
| Private Q&A board (219 threads) | Do NOT migrate | Thread bodies require admin auth — customer inquiry content cannot be recovered. New FAQ page will be built from the 6 public community threads plus fresh content. |
| Chinese subsidiary (Wuxi) | Acknowledge on the new site | 莱인精密技术（无锡）有限公司 / Lein Precision Technology (Wuxi) Co., Ltd. — discovered via ZH footer. **Still operating.** New site's ZH locale + global footer should surface this. |
| Component product pages (FC-050S, PR-030) | Parked | Currently empty shells. Keep in catalog placeholder, populate when datasheets are provided. |
| LTI1000 (ReadOutBox) | Build real product page | Featured on homepage but no detail page exists on EN. Must be a real product in the new catalog. |
| Legacy orphan models in Data Room | Parked | LD30C/M, M3100VA, M2100VA, MD100C/M, Gmate-2000, KRO-4000S, FM30VE have download files but no product pages. Decide later whether to kill the downloads or build pages. |
| Scope | MVP — public site + products migrated + inquiry form | Comparison tool, product finder, blog, site search deferred to phase 2. |

---

## 2. Company Identity

| Field | Value |
|---|---|
| Legal name | 라인테크 (Line Tech Inc.) — canonical. Note: `라인텍` appears on some older pages but is incorrect; site has brand-name drift that should be cleaned up in the rebuild. |
| Founded | March 1997 |
| HQ | 806, Daedeok-daero, Yuseong-gu, Daejeon, Korea (34055) |
| Phone | +82-42-624-0700 |
| Fax | +82-42-638-2211 |
| Mobile (HP) | +82-10-8696-6898 (from catalog back cover — not on website) |
| Email | `linetech@line-tech.co.kr`, `mrmfckorea@gmail.com` (catalog back cover lists gmail as primary) |
| CEO | Michael Wonho Jung, CEO — Overseas Business Division (from catalog welcome letter). Title implies other division CEOs may exist. |
| Products | Mass Flow Controllers (MFC), Mass Flow Meters (MFM) |
| Tagline (EN) | "Perfect Gas Control, With Line tech It's Possible" |
| Positioning | "Best in MFC and MFM" |
| Notable | First company in Korea to self-produce MFC/MFM (2003, via KAIST collaboration) |
| Chinese subsidiary | 莱因精密技术（无锡）有限公司 / Lein Precision Technology (Wuxi) Co., Ltd. — active (+86 mobile, QQ email in ZH footer). Still operating. |

---

## 3. Tech Stack

| Layer | Current |
|---|---|
| Backend | PHP |
| CMS | Gnuboard (Korean bulletin-board framework) |
| URL pattern | `/bbs/board.php?bo_table=XX_YY_e` for products, `/NN_NN_e.php` for About pages |
| Admin | `/adm` (Gnuboard admin panel) |
| i18n | Three separate sites: `/index.php` (KO), `/e_index.php` (EN), `/c_index.php` (ZH) |
| Copyright | Dates back to ~2007 |
| Images | Small thumbnails (280×280 px typical) |
| Forms | None — inquiries are `mailto:` links |
| Stylesheets | `css/default.css`, `reset.css`, `main_style.css`, `jquery.bxslider.css` |
| Font loading | Google Fonts — `Nanum Gothic:400,700,800` |

---

## 4. Visual Design (Current State)

Extracted directly from the live CSS (not approximated). **Decision: preserve the brand.** The blues and gold below are the anchors for the new design system; everything else (neutrals, type, spacing, motion) gets rebuilt around them.

### 4.1 Color Palette — to preserve

**Primary blue family:**

| Hex | Uses | Role on current site |
|---|---|---|
| `#185686` | 7 | Primary blue — product headings (`.i_pro li h2`) — **treat as brand primary** |
| `#1f375e` | 7 | Dark navy |
| `#1c6b94` | 5 | Section titles (sidebar tabs `.s_l_tit`) |
| `#172e75` | — | Very dark navy (sidebar header `.s_img_t`) |
| `#21669b`, `#4989a9`, `#1b91ce`, `#2E6DBC` | 1–2 each | Blue variants |

**Accent — gold/yellow (signature color):**

| Hex | Role |
|---|---|
| `#fdbc04` | Primary accent (CTA / highlight) — **treat as brand accent** |
| `#ECA144` | Orange-yellow variant |

**State / status colors (incidental, not brand):**

| Hex | Role |
|---|---|
| `#55ae2e`, `#029f38`, `#8abc2a` | Greens (success / active) |
| `#ff3061`, `#e8180c` | Reds/pinks (warnings, errors) |

**Neutrals (text + grey ramp):**

| Hex | Role |
|---|---|
| `#000`, `#333`, `#444`, `#555` | Text greys |
| `#4b545e`, `#455255`, `#3b3c3f`, `#383838`, `#485a66` | Dark greys |
| `#dedede`, `#ddd`, `#dbdbdb`, `#d2d2d2`, `#ccc`, `#c3c6ca` | Borders / dividers |
| `#eee`, `#ebebeb`, `#e9e9e9`, `#e2e6eb` | Soft borders |
| `#f5f5f5`, `#f1f1f1`, `#f3f3f3`, `#f4f4f4`, `#fafafa`, `#f7f7f7` | Light backgrounds |

**Blue tints (backgrounds):**

| Hex | Role |
|---|---|
| `#d4e4ec`, `#cce4f0`, `#b4d6e9` | Light blue fills |
| `#dde4e9`, `#e4eaec`, `#d1dee2`, `#c1d1d5` | Blue-grey fills |
| `#ecf0f7`, `#f2f5f9`, `#f5f8f9` | Very light blue-grey backgrounds |

### 4.2 Typography (current)

| Use | Font | Notes |
|---|---|---|
| Body text | Nanum Gothic | Loaded from Google Fonts (weights 400, 700, 800) |
| Large headings | Noto Sans KR | Used for larger menu and section headings |
| Legacy fallback | Dotum / 돋움 | Windows Korean default, pre-webfont era |
| Generic fallback | HelveticaNeue, DroidSans, Sans-serif, Helvetica | |
| Sizing unit | `pt` (9pt, 10pt, 11pt, 12pt, 14pt, 22pt) | 2000s pattern; should be `rem` in the rebuild |

**Observations:**
- No dedicated font stack for English or Chinese — everything rides on Korean-primary fonts. New site should have locale-aware font stacks (Pretendard / Inter / Noto Sans SC are good defaults).
- No type scale or hierarchy system — sizes are arbitrary per component.

### 4.3 Design-system tech debt (to retire)

- No CSS custom properties — every color is hardcoded, copy-pasted
- No responsive breakpoints (fixed-width layout)
- No dark mode consideration
- No documented contrast ratios (several combinations fail WCAG AA)
- `pt`-based sizing doesn't scale with user preferences
- Three stylesheets (`default.css`, `main_style.css`, `reset.css`) with overlapping concerns and no BEM/ITCSS-style naming

### 4.4 Proposed new palette (preserving brand — use the PRINT catalog values, not web)

**Use the values sampled from the print catalog (see §5.1)**, since the current web CSS has drifted away from the authoritative identity.

```
primary        #204898   (catalog, royal blue — logo wordmark + diagonals)
primary-dark   #285090   (catalog, darker shade — hover/active, shadows)
accent         #f09820   (catalog, bright orange — section numbers, CTAs)
accent-amber   #e09028   (catalog, logo L-mark color)
red-mark       #b82028   (catalog, tiny red detail on logo L — preserve for brand mark only)
```

**Do NOT reuse** the current web CSS values (`#185686`, `#fdbc04`) — those are drifted approximations picked by a 2010s developer, not the authoritative print brand.

Everything else (extended blue scale, neutrals 50–950, state colors, semantic tokens) will be rebuilt modernly with proper contrast, a full 50–950 numeric scale per color, and documented usage rules. This replaces the ad-hoc `#ddd` / `#ccc` / `#dedede` / `#d2d2d2` sprawl in the current CSS.

---

## 5. Official Company Catalog (Print)

**Source:** `/Users/bsp/Desktop/English+catalog_New+version.pdf` (88 pages, English, dated ~2020 based on internal timeline stopping at 2020-06). **Authoritative brand reference** — more authoritative than the website.

### 5.1 Brand identity (print) — differs meaningfully from web

**Sampled directly from catalog PNG renders at 200–400 DPI.** Pixel counts below are dominance indicators.

| Element | Print catalog (authoritative) | Website (drifted) |
|---|---|---|
| Primary blue | **`#204898`** rgb(32, 72, 152) — royal/indigo blue | `#185686` — dustier, more cyan |
| Primary blue darker | `#285090` rgb(40, 80, 144) — alt/shadow | — |
| Accent orange (section numbers) | **`#f09820`** rgb(240, 152, 32) — bright orange | `#fdbc04` yellow (wrong hue family) |
| Logo orange (L mark) | **`#e09028`** rgb(224, 144, 40) — slightly more amber | not used on web |
| Red (incidental detail) | `#b82028` rgb(184, 32, 40) — tiny red dot on logo L | — |
| Logo | Orange circle + white reversed-out "L" + red dot, followed by blue "ine Tech" wordmark | Not prominently used; site is text-only |
| Typography | Clean modern English sans-serif (resembles Source Sans / Open Sans), italic taglines | Nanum Gothic (Korean-first) |
| Layout | Diagonal geometric shapes (blue parallelograms with rounded corners), generous whitespace | Fixed-width table-based 2010s layout |
| Product photos | Round-cropped, high-contrast shots on white | Square 280×280 thumbnails |

**Implication:** The website has drifted from the official brand identity — both the blue and the accent color are wrong on the web. The new site must re-align to the print catalog: **`#204898` primary + `#f09820` accent**, not the `#185686` + `#fdbc04` that's on the current web CSS.

**Reference files** in `docs/brand-reference/`:
- `catalog-cover-01.png` — full cover
- `catalog-back-88.png` — back cover (cleanest logo + contact block)
- `catalog-section-opener-51.png` — shows large orange "03" section style
- `catalog-product-page-16.png` — product spread layout
- `logo-crop.png` — isolated logo region
- `palette.png` — generated swatch sheet

### 5.1.1 Logo composition (decoded from high-res render)

- **Orange filled circle** (`#e09028` amber) with a **white "L"** reversed-out inside it
- **Small red dot** (`#b82028`) on the upper-right corner of the L as a detail accent
- **"ine Tech" wordmark** in royal blue (`#204898`) continues to the right, so read together it spells **"Line Tech"**
- Modern geometric sans-serif letterforms

**Critical gap:** we do NOT have the logo as a vector file (SVG / AI / EPS / PDF vector). We only have rasterized catalog renders. Before the rebuild we need the original source from whoever produced the catalog, or we'll have to re-trace the mark. This should be logged as a blocking item.

### 5.1.2 Per-section color system (important)

The catalog uses a **per-section accent color** that persists throughout that section's pages (title color, left-edge accent bar, pill outlines, section numeral tab).

| Section | Name | Accent color | Sampled hex |
|---|---|---|---|
| §01 | Analogue MFC/MFM | **Dark green** | `#085830` rgb(8, 88, 48) |
| §02 | Digital MFC/MFM | **Royal blue** | `#305090` rgb(48, 80, 144) |
| §03 | Specialized Series | **Bright orange** | `#f09820` rgb(240, 152, 32) |
| §04 | Other Devices / Parts | **Royal blue** | `#305090` |
| §05 | Miscellaneous | **Royal blue** | `#305090` |

**Implication for the new site:** the product-catalog IA should preserve this per-series color identity (green = Analogue, blue = Digital/Parts/Misc, orange = Specialized). On category landing pages and product detail pages, use the series color as the accent (badges, borders, left-edge rule), with royal blue as the default fallback.

**Two blues in the catalog:** the deep cover blue `#204898` and the slightly lighter section blue `#305090` are both used. Treat `#204898` as the primary brand anchor and `#305090` as a lighter application variant — in a Tailwind scale they'd sit adjacent (e.g., primary-700 vs primary-600).

### 5.1.3 Typography system (print)

- **Family:** English sans-serif throughout the catalog (resembles Source Sans Pro / Open Sans / similar humanist sans family). No serif anywhere. Korean and Chinese typefaces don't appear — catalog is English-only.
- **Weights used:** light (captions, subtitles like "Analogue" above "MFC / MFM"), regular (body copy), medium / semi-bold (pills, table headers), bold (titles like "LTI-1000", "LD030C"), extra-bold (section numerals "01", "02", "03").
- **Italic is load-bearing:** used deliberately for headlines and emphasis — *"Brief History"*, *"Journey of Value Creation"*, *"Line Tech's Calibration Standards"*, *"Services and Support"*, *"Reliable Technology & Supreme Service"*. This is a signature of the brand voice.
- **Case:** mixed — "DIGITAL" in all-caps on Digital section opener subtitle; "Specialized Series", "Miscellaneous" in title case.
- **No pt→px conversion on web:** the current site's `pt`-based sizing has no relation to the catalog's print hierarchy; the web rebuild should define a fresh type scale rather than try to port anything.

### 5.1.4 Design-system patterns observed in the catalog

**Page chrome:**
- Top-left of content pages: `www.line-tech.co.kr` in small grey text
- Top-right of content pages: `Mass Flow Controller & Meter | [Line Tech logo]` — consistent brand signature across spreads
- Thin horizontal rules separate sections
- Page numbers discreet in bottom corner

**Section-opener pages (6 in total):**
- Large rounded-rectangle frame on page
- Numbered tab protruding from top-left of frame (in section color, white numeral)
- Centered title: small label + large title + subtitle (e.g., `Specialized Series` / **`MFC / MFM`** / `Mass Flow Controller & Meter`)
- Entire outline + numeral in the section's color

**Pill / badge component (two variants):**
- **Outlined (ghost) pill:** rounded rectangle, thin 1–2px outline in section color, transparent fill, text in section color. Used for product-type labels ("Mass Flow Controller", "Read Out Box", "Mass Flow Controller with Display", "Digital Mass Flow Controller").
- **Filled (solid) pill:** same shape, solid colored fill, white text. Used for CTAs ("Want to submit a feedback?") and some section subheaders ("Cautions When Installing", "MFC/MFM Operation").

**Product detail page layout (MFC/MFM):**
- Left column: small left-edge vertical accent bar in section color, model name as H1 (in section color), type pill below, "Features" as a bulleted list
- Right column: "Specifications" heading, spec table, "Connection" + dimension table
- Bottom row: product hero photo (left) + engineering dimension diagram (right)

**LTI (Read Out Box) page layout:**
- Different — model title top-right, pill below, then specs table
- Dimension drawing on LEFT, product photos at the bottom
- A small right-edge blue accent marker
- Reflects that LTI-200 / LTI-1000 are rack / display devices, not the inline MFC form factor

**Component page layout (FC-050S, PR-030):**
- Title + pill(s) — components can have two stacked pills (type + subtype)
- Features as `Key : Value` pairs rather than bullet list
- System-integration schematics showing how the component fits into the gas flow path (pressure gauges, MFC, reactor)
- For pressure-related components (PR-030): a pressure-over-time data chart with axes

**At-a-glance / overview pages (p8, p9, p11, p13):**
- Hero: grid of round-cropped product photos showing the lineup diversity
- Below: comparison spec tables (MFC on top half, MFM on bottom half typically)
- Small heading pills identify each sub-series ("Analogue", "Digital")

**Applications page (p7):**
- Simple bulleted list of 12 industries (NO icons — engineering-first catalog doesn't use decorative industry icons)
- Flanked by a single product hero photo
- **Gas flow diagram** at the bottom: GAS A / GAS B / GAS C → valves → ReadOut Box → Process chamber & Reactor → PLC or PC. This is the canonical "how MFCs fit in a gas control system" diagram — reusable on the new site.

**Installation / technical pages (p69–p77):**
- Numbered steps use circled-numeral glyphs (①②③) rather than decimal numbers
- "⚠ Warning !" with triangle glyph — one of the few literal icons
- Pin-connector tables with wire colors (Green, Red, White, Blue, Brown, Black, Yellow) — actual hardware wire colors called out in spec tables
- Left-margin callout labels with arrows: *"Voltage ▶"* in italic orange — orange used here as a general accent, not strictly section color

**Calibration / services pages:**
- Italic royal blue page titles
- Real lab photography (sonic nozzle bank) — breaks from the product-on-white convention for technical credibility

**Imagery language — summary:**
- **Product hero photos:** isolated on pure white, round crops on covers/openers, rectangular on detail pages, consistent angle across product lines
- **Product color variation is visible and intentional:** blue bodies (Digital), purple (legacy M-series?), black (EX-Proof), silver/chrome (LTI, Components) — each series has a distinguishable physical color
- **Technical schematics** are the primary decorative language — no generic icon illustrations, no stock industrial photography, no "engineer in PPE" stock shots
- **Cityscape skyline photo** appears twice (cover welcome, TOC/history) as a "global reach" motif
- **Real lab photography** only on calibration page
- **Data charts** on pressure-related components
- **Pin-out diagrams** on interfacing pages

**Iconography inventory (catalog has very few icons):**
- ⚠ warning triangle on install manual
- ① ② ③ circled numerals for steps
- Page arrow markers (▶) on margin labels
- NO industry icons on Applications page
- NO feature icons on features lists
- Logo is the only piece of identity graphics

**Spec table style:**
- Header row in dark blue or grey with white text
- Body rows with thin grey rules, no stripes by default (some pages alternate subtly)
- Small sans-serif text
- Numeric values centered, labels left-aligned

### 5.2 Official tagline (from catalog cover)

> **"Mass Flow Solutions"**
> *Reliable Technology & Supreme Service*
> *Always striving for Excellence*

This replaces the awkward web tagline "Perfect Gas Control, With Line tech It's Possible."

### 5.3 Technology positioning (verbatim, p.6)

"Thermal Mass Flow Controller and Meter" — differentiated as thermal sensing technology with advantages: High Precision, Reliable Delivery, High Accuracy, Fast Response Time, Cost Efficiency, Consistent Repeatability, Compact System, Relative Immunity to Temperature/Pressure Fluctuations.

Includes a plain-English explanation of the measurement technique (upstream + downstream temperature sensors in a bypass, heat transfer proportional to mass flow rate) — good candidate copy for a "How it works" section on the new site.

### 5.4 Full product list (catalog is more complete than website)

**Analogue Series — 18 models (9 MFC + 9 MFM):**
- MFC: M3030VA, M3100VA, M3200VA, MS3150VA, MS3400VA, MS3500VA, MS3600VA, MS3700VA, MS3800VA
- MFM: M2030VA, M2100VA, M2200VA, MS2150VA, MS2400VA, MS2500VA, MS2600VA, MS2700VA, MS2800VA

**Digital Series — 14 models (7 MFC + 7 MFM):**
- MFC: MD30C, MD100C, MD400C, MD500C, MD600C, MD700C, MD800C
- MFM: MD30M, MD100M, MD400M, MD500M, MD600M, MD700M, MD800M

**Specialized Series — 8 models (4 MFC + 4 MFM):**
- LD030C/M (Display, 0.01–30 slpm, built-in display for real-time monitoring)
- LM030C/M (MEMS, 0.01–30 slpm, cost-efficient, <10 bar)
- EX070C/M (EX-Proof, 0.01–100 slpm, hazardous environments)
- EX1000C/M (EX-Proof, 100–1000 slpm, hazardous environments)

**Other Devices / Parts — 4 models:**
- **LTI-200** (ReadOut Unit — not currently on the website at all)
- LTI-1000 (ReadOut Unit)
- FC-050S (Component)
- PR-030 (Component)

**Total: 44 product variants** vs ~30 on the website. New site must include all of these.

### 5.5 Series naming conventions (authoritative)

| Prefix | Meaning | Intro year |
|---|---|---|
| M- | Original analogue | 2003 |
| MS- | Smaller PCB analogue variant | later |
| MD- | Digital | — |
| LD- | Display (built-in flow monitor) | 2020 |
| LM- | MEMS (cost-efficient) | 2020 |
| EX- | Explosion-proof (hazardous environments) | 2020 |
| LTI- | ReadOut Unit (separate product line) | 2016 |

### 5.6 Applications (from catalog p.7, verbatim — 12 industries)

1. Biotech / Pharmaceutical Industry
2. Component Leak Detection
3. Chemical / Petrochemical Industry
4. Fuel Cells
5. Fiber Optics / Glass
6. Gas Injection on Surface Treatment
7. LED Lighting
8. Metals Processing
9. Precision Gas Blending & Analysis
10. Research and Development & Laboratories
11. Semiconductor Industry
12. Solar / Photovoltaic Technology

**This is the seed for the Applications page** — the list is authoritative and should be reproduced on the new site with icons + short descriptions per industry.

### 5.7 Services offered (from catalog p.78)

- Customer Seminar and Training
- Repairment Service *(note: typo in catalog — should read "Repair Service")*
- Replacement of parts / products
- Recalibration of instruments
- On-site trouble shooting
- On/off site consultation services
- **1-year warranty** from original purchase date against material/workmanship defects

**These should populate a Services section** on the new site (currently absent).

### 5.8 Calibration standards (from catalog p.68)

- Method: sonic nozzle system (state of the art)
- Nozzle bank with 14 sonic nozzles
- Flow range: 0.02 SLPM ~ 3,000 SLPM
- Flow control: regulator (0–6 Bar)
- Pressure control: valve (high pressure)
- Pressure sensor: 2-channel (up and down stream)
- System uncertainty: ±0.2%

**Technical credibility content for the new site** — currently not on website.

### 5.9 Certifications (visible in catalog p.67–68)

- ISO 9001-style Quality Management Certificate
- EU Declaration of Conformity (CE)
- Additional certificates shown on p.68 (render as needed)

Together with the INNOBIZ certification from the timeline, this gives us ≥4 named certs — enough to rebuild the certifications page with real text instead of 13 unlabeled JPGs.

### 5.10 Gas conversion table (catalog appendix, p.79–87)

Reference table for **186 gases** with conversion factors (relative to N₂), densities, and sealing material compatibility (Viton, Kalrez, Buna/EPDM, Teflon). Useful technical content — worth including as an interactive lookup on the new site or a downloadable reference.

### 5.11 Catalog back cover (contact)

```
www.line-tech.co.kr

LINE TECH Inc.
806, Daedeok-daero, Yuseong-gu, Daejeon, Korea
Tel    82-42-624-0700
Fax    82-42-638-2211
HP     82-10-8696-6898
E-mail mrmfckorea@gmail.com
```

Note: catalog uses `LINE TECH Inc.` (all-caps) and **`mrmfckorea@gmail.com` is listed as the primary email** — not the branded address. The site inconsistently mixes both.

---

## 6. Site Map

```
/
├── ABOUT US
│   ├── Greetings          (01_01_e.php)
│   ├── History            (01_02_e.php)
│   ├── Business Info      (01_03_e.php)
│   ├── Certification      (01_04_e.php)
│   └── Location           (01_05_e.php)
│
├── PRODUCTS
│   ├── Analogue MFC       (02_01_e)  — 8 products
│   ├── Analogue MFM       (02_02_e)
│   ├── Digital MFC        (02_03_e)  — 7 products
│   ├── Digital MFM        (02_04_e)
│   ├── Specialized MFC    (02_07_e)
│   │   ├── Display MFC    (02_07_e)
│   │   ├── Display MFM    (02_07_01_e)
│   │   ├── MEMS MFC       (02_07_02_e)
│   │   ├── MEMS MFM       (02_07_03_e)
│   │   ├── EX-Proof MFC   (02_07_04_e)
│   │   └── EX-Proof MFM   (02_07_05_e)
│   ├── ReadOutBox         (02_05_e)  — EMPTY on English site
│   └── Component          (02_06_e)  — 2 products
│
├── SUPPORT                (03_01_e)  — EN: essentially empty
│                            KO: Q&A board + quote form (see §11)
│
├── DATA ROOM
│   ├── Catalogue          (04_01_e)  — 2 docs
│   ├── AutoCAD            (04_02_e)  — 14 drawings
│   └── Manual             (04_03_e)  — 22 docs
│
├── INQUIRY                (mailto:mrmfckorea@gmail.com on EN; real form on KO)
│
└── COMMUNITY (KO only)
    └── ABOUT MFC         (05_01)  — user Q&A / troubleshooting board
```

---

## 7. Company History (from /01_02_e.php)

| Date | Event |
|---|---|
| 1997.03 | Line Tech Inc. founded |
| 2000.01 | R&D collaboration with KAIST |
| 2003.03 | First MFC / MFM models developed (first in Korea) |
| 2006.06 | First international sale (Shanghai, China) |
| 2015.09 | R&D Center established |
| 2016.01 | Read Out Unit developed (LTI model) |
| 2016.12 | Extended capacity to 150, 500, 1,000, 2,500 SLPM |
| 2017.08 | CE and ISO certifications obtained |
| 2018.03 | Certified as INNOBIZ |
| 2019.03 | Extended capacity to 5,000 SLPM |
| 2019.11 | First international licensed distributor (India) |
| 2020.06 | EX, LD, LM series developed |

This timeline is one of the site's strongest credibility assets and should be preserved as-is (visually upgraded).

---

## 8. Product Inventory (crawled)

### Analogue Mass Flow Controllers — 8 models

| Model | Detail URL |
|---|---|
| M3030VA | `/bbs/board.php?bo_table=02_01_e&wr_id=16` |
| M3200VA | `&wr_id=15` |
| MS3150VA | `&wr_id=14` |
| MS3400VA | `&wr_id=13` |
| MS3500VA | `&wr_id=12` |
| MS3600VA | `&wr_id=11` |
| MS3700VA | `&wr_id=10` |
| MS3800VA | `&wr_id=17` |

### Digital Mass Flow Controllers — 7 models

| Model |
|---|
| MD30C |
| MD100C |
| MD400C |
| MD500C |
| MD600C |
| MD700C |
| MD800C |

### Analogue & Digital MFM
Listings exist but not fully crawled; structure mirrors MFC categories (likely M2xxxVA analogue, MD xxx M digital).

### Specialized MFC/MFM
Category page shows one detailed model:
- **LD030C** (Display MFC)

Subcategories exist for Display, MEMS, and EX-Proof variants of both MFC and MFM, but most sub-pages have minimal content.

### ReadOutBox
**English category page is empty** (shows "게시물이 없습니다" / "no posts"). The homepage references **LTI1000** as a featured ReadOutBox product, so content exists but is not surfaced here. Gap to fix.

### Components — 2 models
- FC-050S
- PR-030

### Homepage featured products
- M3030VA (Analogue MFC)
- MD30C (Digital MFC)
- LTI1000 (ReadOutBox)

---

## 9. Product Detail Depth (example: M3030VA)

Detail pages are the site's strongest pages — they contain real engineering content worth preserving verbatim.

| Specification | Value (M3030VA) |
|---|---|
| Flow range (N₂) | 0.01–30 slpm |
| Response time | <2 seconds |
| Accuracy | ±1% of FS |
| Repeatability | ±0.25% |
| I/O signal | 0–5 Vdc or 4–20 mA |
| Supply power | +15 or +24 Vdc, 350 mA |
| Max operating pressure | <90 bar |
| Operating temperature | 0–50 °C |
| Leak rate | 1×10⁻⁹ atm·cc/sec |
| Control range | 3–100% |

**Connection types / dimensions:**
- 1/8" SW: 126.7 mm
- 1/4" SW: 131.3 mm
- 3/8" SW: 134.3 mm
- 1/4" VCR: 127.8 mm

**Media on detail page:**
- 2 product photos
- 1 dimensional diagram
- Downloads: catalogue PDF, CAD ZIP, manual PDF

---

## 10. Data Room Inventory

### Catalogue — 2 docs
- "English catalog_New version"
- "(주)라인텍 카다로그 입니다" (Korean catalog)
- Both marked as popular posts ("인기글"), both with attachments. File types not stated.

### AutoCAD — 14 drawings

| # | Covers |
|---|---|
| 14 | MS30V (MFC) |
| 13 | M3200VA (MFC) — 15-pin & 9-pin |
| 12 | M3400VA / MD400C |
| 11 | M2600VA / MD600M |
| 10 | M3700VA / MD700C |
| 9 | M3600VA / MD600C |
| 8 | M3500VA / MD500C |
| 7 | M2500VA / MD500M |
| 6 | M3300VA / MD300C |
| 5 | M2300VA / MD300M |
| 4 | M3100VA / MD100C |
| 3 | M2100VA / MD100M |
| 2 | M3030VA / MD30C |
| 1 | M2030VA / MD30M |

### Manual — 22 docs

| # | Title | Product |
|---|---|---|
| 22 | DMFC Ascii sender | DMFC |
| 21 | DMFC protocol v1.6E user ENG | DMFC |
| 20 | DMFC for Windows | DMFC |
| 19 | DMFC user manual ENG | DMFC |
| 18 | LTI-1000 Communication Protocol | LTI-1000 |
| 17 | LTI-1000 Manual Update | LTI-1000 |
| 16 | LTI-1000 PC Program | LTI-1000 |
| 15 | LINETECH New Catalog | — |
| 14 | KRO-4000S Communication Program | KRO-4000S |
| 13 | DMFC Windows Manual | DMFC |
| 12 | DMFC User Program Upgrade | DMFC |
| 11 | DMFC User Manual | DMFC |
| 10 | MFC Haunting Phenomenon | MFC (general) |
| 9 | RA312 Manual | RA312 |
| 8 | KRO4000S Manual | KRO4000S |
| 7 | MFC Power +24Vdc Usage | MFC (general) |
| 6 | JVC Manual | JVC |
| 5 | DFC4000 Manual | DFC4000 |
| 4 | OSC4000 Manual | OSC4000 |
| 3 | GMC 1000 Manual | GMC 1000 |
| 2 | Gmate-2000 Manual | Gmate-2000 (Roxas) |
| 1 | FM30VE Manual | FM30VE |

---

## 11. Certifications

Page at `/01_04_e.php` displays **13 certification images** (`/images/1.jpg` … `/images/13.jpg`). **No text labels, no dates, no issuing bodies listed.**

From the history page we know at least:
- **CE certification** (2017.08)
- **ISO certification** (2017.08)
- **INNOBIZ** (2018.03)

The other ~10 certifications are not documented in text on the site. Recovering their titles and issuers is an open task for the new site.

---

## 12. Language Variants

| Locale | URL |
|---|---|
| Korean | `/index.php` |
| English | `/e_index.php` |
| Chinese | `/c_index.php` |

Each is a **separate parallel site**, not true i18n:
- No `hreflang` tags
- No shared URL structure — a user on `/e_index.php` who wants Korean must re-navigate from `/index.php`
- Content drift between languages is significant:

| Feature | Korean | English | Chinese |
|---|---|---|---|
| SUPPORT → Q&A board | ✅ Active (`bo_table=03_01_20212021`) | ❌ `mailto:` only | ❌ |
| Quote request form (견적문의) | ✅ Form at `bo_table=03_02_2024` | ❌ | ❌ |
| COMMUNITY → ABOUT MFC board | ✅ Active (`bo_table=05_01`) | ❌ | ❌ |
| Kakao Talk consultation button | ✅ | ❌ | ❌ |
| ReadOutBox product listings | ✅ Has content | ❌ Empty category page | — |
| Company reg. number in footer | ✅ | ❌ | — |

Net: English users are materially worse served. The new site must close this parity gap.

---

## 13. Strengths (worth preserving)

| Asset | Why it matters |
|---|---|
| ~30 products with real specs | The real engineering content that differentiates this from a brochure site |
| 22 manuals + 14 CAD drawings | Genuine technical library — engineers download these |
| Company history (1997 → 2020) | KAIST collaboration, first-in-Korea MFC, INNOBIZ, CE/ISO all build credibility |
| Three languages | Reach matters, even if implementation is dated |
| Clear product taxonomy | Analogue/Digital × MFC/MFM × Standard/Specialized is a sound structure |

---

## 14. Weaknesses (to fix or cut)

| Weakness | Severity | Recommendation |
|---|---|---|
| Certifications shown as unlabeled JPGs | High | Rebuild with real text (name, issuer, date, description) |
| Support page is essentially empty | High | Add FAQs, troubleshooting, integration notes, or remove |
| ReadOutBox English page is empty | High | Migrate KO content, ensure parity |
| `mailto:` Inquiry | High | Replace with a real form + server-side handling |
| Language-per-URL duplication | High | Rebuild as true i18n with shared URL structure + `hreflang` |
| No product filtering | High | Add filters (gas, flow range, connection, output) |
| No product search | Medium | Add site-wide search (phase 2 acceptable) |
| No product comparison | Medium | Add spec side-by-side (phase 2 acceptable) |
| Generic CEO greeting | Medium | Rewrite with specifics (KAIST, first Korean MFC, R&D investment) |
| Thumbnails only 280×280 | Medium | Request higher-res photography |
| Text-only navigation, weak visual hierarchy | Medium | Modern design system with clear sections |
| Gnuboard admin | Low (just replace) | Replace with Sanity CMS |
| Copyright notices from ~2007 | Low | Auto-generate from current year |

---

## 15. Missing (worth adding)

| Addition | Why |
|---|---|
| Applications / industries page | Semiconductor, solar, biotech, research, specialty gas — buyers self-identify by industry before they know which MFC they need |
| Product finder wizard | "I need to control [gas] at [flow range]" → recommended models (phase 2) |
| Case studies | Third-party validation — which companies/universities use these products |
| News / R&D updates | Shows the company is active; good for SEO |
| Inquiry form with routing | Send sales inquiries to one inbox, support to another, distributor questions to a third |
| CRM integration | Capture leads into HubSpot / Salesforce rather than email (phase 2) |
| Google Maps embed on Location | Current page has address text only |
| Accessibility (WCAG 2.1 AA) | Mandatory for many B2B procurement processes |
| Modern SEO (metadata, OG, sitemap, structured data) | Current site has minimal metadata |

---

## 16. Korean Homepage Extras (not on English site)

Worth noting for i18n parity decisions:

- **"ABOUT MFC" Q&A board** — community troubleshooting content (e.g., "N2 gas MFC에 다른가스를…"). Useful content, currently Korean-only.
- **Kakao Talk consultation button** — Korean messenger contact. Should be locale-conditional (show on KO, hide on EN/ZH).
- **Company registration number + full Korean business address in footer** — Korean regulatory standard, keep on KO only.

---

## 17. Assets to Export from the Old Site

For the migration script:

- [ ] All product thumbnails (~30 files, 280×280)
- [ ] All product detail images (~60 files) + dimensional drawings (~30)
- [ ] 14 AutoCAD files (ZIP/DWG)
- [ ] 22 manual PDFs
- [ ] 2 catalogue PDFs
- [ ] 13 certification JPGs (for reference while sourcing real certificate docs)
- [ ] CEO portrait (if any) from Greetings page
- [ ] Korean Q&A board content (decide: migrate, archive, or drop)

---

## 18. Not Yet Confirmed / Open Questions

- Real certification titles and issuing bodies (page has only images)
- Whether the Gnuboard `/adm` contains additional content not linked from public nav
- File formats of catalogues and manuals (attachment icons shown, extensions not)
- Traffic breakdown by language — drives whether "all three equal" is really warranted
- Whether KO Q&A board content has SEO value worth migrating
- Higher-resolution product photography availability
- **Vector logo file (SVG / AI / EPS / vector PDF)** — currently only rasterized catalog renders. Blocks high-fidelity use of the logo at arbitrary sizes and on dark backgrounds. Ask whoever produced the catalog for the source file.
- Whether `#204898` / `#f09820` are registered brand colors in a brand-guidelines document, or just what the catalog designer picked — either way these are more authoritative than the web CSS, but a brand guide would lock it down.
