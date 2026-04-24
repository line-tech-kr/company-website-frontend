# Line Tech — Chinese Site Content Inventory

Source: `https://www.line-tech.co.kr/` (Chinese locale, accessed 2026-04-21).

> Note: Chinese version uses the same Gnuboard skin as Korean/English. Menu labels and footer company info are localised to Simplified Chinese, but body product copy is overwhelmingly English (spec tables only). No Chinese marketing paragraphs exist on product detail pages — this is a finding, not a gap in crawling.

---

## Discovered URL Patterns

| Section | Pattern |
|---|---|
| Homepage | `/c_index.php` |
| About — CEO greeting | `/01_01_c.php` |
| About — History | `/01_02_c.php` |
| About — Location | `/01_03_c.php` |
| About — slots `01_04_c`, `01_05_c` | 302 → `html.henemsoft.co.kr/404.html` (do not exist) |
| Products | `/bbs/board.php?bo_table=02_0N_c` (and `02_07_0N_c` for specialized sub-categories) |
| Product detail | `/bbs/board.php?bo_table=02_0N_c&wr_id=<id>` |
| Q&A | `/bbs/board.php?bo_table=03_01_c` |
| Data Room — Catalogue | `/bbs/board.php?bo_table=04_01_c` |
| Data Room — AutoCAD | `/bbs/board.php?bo_table=04_02_c` |
| Data Room — Manual | `/bbs/board.php?bo_table=04_03_c` |
| Community — About MFC | `/bbs/board.php?bo_table=05_01_c` |
| Language switchers | `/` (KOR), `/e_index.php` (ENG), `/c_index.php` (CHN) |
| Admin | `/adm` |

Suffix convention: `_c` (not `_cn`). Confirmed against live site.

---

## Site Map

```
/c_index.php (Home)
├── 公司介绍 (Company / About)
│   ├── /01_01_c.php  CEO問候語 (CEO Greeting)
│   ├── /01_02_c.php  發展歷程 (History)
│   └── /01_03_c.php  地点 (Location)
├── 产品介绍 (Products)
│   ├── /bbs/board.php?bo_table=02_01_c  Analogue MFC     (8 products)
│   ├── /bbs/board.php?bo_table=02_02_c  Analogue MFM     (8 products)
│   ├── /bbs/board.php?bo_table=02_03_c  Digital MFC      (7 products)
│   ├── /bbs/board.php?bo_table=02_04_c  Digital MFM      (7 products)
│   ├── /bbs/board.php?bo_table=02_05_c  ReadOutBox       (2 products)
│   ├── /bbs/board.php?bo_table=02_06_c  Component        (2 products)
│   └── /bbs/board.php?bo_table=02_07_c  Specialized MFC
│       ├── 02_07_c       Display MFC   (1: LD030C)
│       ├── 02_07_01_c    Display MFM   (1: LD030M)
│       ├── 02_07_02_c    MEMS MFC      (1: LM030C)
│       ├── 02_07_03_c    MEMS MFM      (1: LM030M)
│       ├── 02_07_04_c    EX-Proof MFC  (2: EX070C, EX1000C)
│       └── 02_07_05_c    EX-Proof MFM  (2: EX070M, EX1000M)
├── 问答 (Q&A)               /bbs/board.php?bo_table=03_01_c  (empty)
├── 技术资料 (Technical Data)
│   ├── /bbs/board.php?bo_table=04_01_c  Catalogue  (1 doc, KR-titled)
│   ├── /bbs/board.php?bo_table=04_02_c  AutoCAD    (14 docs, KR-titled)
│   └── /bbs/board.php?bo_table=04_03_c  Manual     (23 docs, KR-titled)
└── 社区 (Community)
    └── /bbs/board.php?bo_table=05_01_c  ABOUT MFC  (empty)
```

Total product detail pages: **39**.

---

## Homepage (/c_index.php)

**Title:** 라인텍 라인테크 (Line Tech) — page `<title>` retained in Korean.

**Sections visible:**
- Pop-up layer slot (empty: "팝업레이어 알림이 없습니다")
- Featured products hero (3 cards)
- Product category grid (5 categories)
- Document/Data Room quick links (Catalogue / AutoCAD / Manual)
- Customer center block (phone, email)
- Footer

**Text content (verbatim + translation):**
- "电话 : 139-1177-2500" — Phone
- "E-mail : 497081452@qq.com / mrmfckorea@gmail.com"
- Featured card bullets (English, not Chinese): "Accurate at Low Flow, Fast Response, Compact Connection, Highly Stable Removable Sensor, High Corrosion Resistance, Excellent Linearity" — repeated for M3200VA and MS3400VA
- Footer: "公司名称 : 莱因精密技术（无锡）有限公司" (Line Tech Precision Technology (Wuxi) Co., Ltd.)
- Footer: "地址 : 江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号" (Building 6, Unit 117, Huizhi Enterprise Center, Xihu East Rd, Xishan District, Wuxi, Jiangsu)
- Footer: "COPYRIGHT @ 2007 LINE-TECH. ALL RIGHT RESERVED."

**Images:**
- `/images/logo.gif` (alt: "에이치엔에스하이텍 로고" — Korean alt, not localised)
- `images/c_i_m_text.png`
- `images/i_q1_img_01.jpg` through `i_q1_img_05.jpg` (category thumbs)
- `/images/c_i_q2_01.png` Catalogue, `c_i_q2_02.png` AutoCAD, `c_i_q2_03.png` Manual
- `/images/t_icon_02.gif` (contact dropdown icon)
- `/images/c_logo.gif`

**Links leaving page:** all nav/footer URLs listed in Site Map above, plus featured-product deep links:
- `/bbs/board.php?bo_table=02_01_c&wr_id=15` (M3200VA)
- `/bbs/board.php?bo_table=02_01_c&wr_id=13` (MS3400VA)
- `/bbs/board.php?bo_table=02_05_c&wr_id=2` (LTI1000)
- `/e_index.php`, `/`, `/adm`, `#` (Contact anchor, no modal confirmed)

**Forms / interactive elements:** None on homepage. "Contact" nav item is an anchor (`#`), not a form.

**Notable:**
- Featured-product `wr_id` references (15, 13) in homepage markup do NOT match current product `wr_id`s in Analogue MFC listing (which are 18–26). Homepage links are stale or point to deleted/renumbered records — verify at implementation time; treat as a bug in the legacy site.
- Document icons (Catalogue/AutoCAD/Manual) link to the same board tables the Korean site uses; no Chinese-specific documents are hosted.

---

## About

### /01_01_c.php (CEO Greeting — CEO問候語)

**Headings:** 公司介绍 → CEO問候語.

**Content summary (no Chinese paragraph on page — copy appears in English / mixed):**
- Vision: "to become the global leader in the world's MFC/MFM business by producing and providing the Best"
- Corporate narrative: founded 1997; first domestic Korean MFC/MFM producer in 2003 via KAIST collaboration; emphasis on continued R&D, differentiated AS service, catered consultation.

**Images:** `/images/logo.gif`, `/images/t_icon_02.gif`, `/images/c_logo.gif`.

**Forms:** none.

**Notable:** No signature / CEO name / portrait image. Message is identical in substance to KR/EN versions.

### /01_02_c.php (Development History — 發展歷程)

**Heading:** 公司介绍 → 發展歷程.

**Timeline (verbatim dates; copy rendered in English):**

| Date | Event |
|---|---|
| 1997.03 | Company founded |
| 2000.01 | KAIST collaboration R&D begins |
| 2003.03 | First MFC/MFM products developed |
| 2006.06 | Initial international sales (China) |
| 2015.09 | R&D Center established |
| 2016.01 | Read Out Unit developed |
| 2017.08 | CE and ISO certification |
| 2019.11 | India distributor licensed |

**Images:** `/images/m01_02_m_img_01.gif` (timeline graphic), plus logo images.

**Notable:** Last entry is 2019 — site has not been updated with post-2019 milestones in any locale.

### /01_03_c.php (Location — 地点)

**Heading:** 公司介绍 → 地点.

**Content:**
- Company (Chinese entity): 莱因精密技术（无锡）有限公司
- Address: 江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号
- Phone: 139-1177-2500
- Email: 497081452@qq.com, mrmfckorea@gmail.com

**Notable:** No embedded map / iframe detected in the page text. KR/EN versions typically have a Daum/Naver map; Chinese version appears to render only an address block. Verify when the page is viewed in a browser — the WebFetch summary would not surface an iframe.

### /01_04_c.php, /01_05_c.php

**Status:** 302 redirect → `http://html.henemsoft.co.kr/404.html`. Slots do not exist. Korean and English sites have the same gap — no "Certifications" or extra About page in this URL range.

---

## Products

Every product detail page uses the identical Gnuboard skin: a spec table, a connection/dimensions table, 2 product photos, 1 dimensional drawing, and (on Analogue MFC only) three PDF/ZIP download buttons with Korean filename stems. **All spec tables are in English regardless of locale.** The Chinese localization does not extend to product copy.

### /bbs/board.php?bo_table=02_01_c — Analogue MFC (8 products)

Ordering by flow range (lowest → highest):

#### M3030VA (wr_id=25)
| Parameter | Value |
|---|---|
| Range(N2) | 0.01slpm~30slpm |
| Response Time | < 2 sec |
| Accuracy | ±1% of FS |
| Repeatability | ±0.25% |
| In/Out Signal | 0~5Vdc or 4~20mA |
| Supply Power | +15 or +24Vdc, 350mA |
| Max Operating Pressure | < 90 bar |
| Max Operating Temp | 0~50℃ |
| Leak Rate | 1X10⁻⁹atm. cc/sec |
| Control Range | 3~100% |

Dimensions: 1/8" SW 126.7; 1/4" SW 131.3; 3/8" SW 134.3; 1/4" VCR 127.8. Downloads: `M3030VA.CA.pdf`, `M3030VA.도면.zip`, `M3030VA Maunal.pdf`.

#### M3200VA (wr_id=24)
Range 30–100 slpm, Accuracy ±1% FS, rest identical to M3030VA. Dimensions: 1/4" SWG 144.8; 3/8" SWG 147.8; 1/4" VCR 141.5; 1/2" VCR 144.8. Downloads: Catalogue PDF / Drawing ZIP / Manual PDF.

#### MS3150VA (wr_id=23)
Range 30–100 slpm (same table as M3200VA). Dimensions: 1/4" SWG 144.8; 3/8" SWG 147.8; 1/4" VCR 141.5; 1/2" VCR 144.8. Downloads: Catalogue / Drawing / Manual.

#### MS3400VA (wr_id=22)
Range 100–300 slpm, Accuracy ±2% FS, Max Pressure < 13 bar. Dimensions: 3/8" SWG 196.7; 1/2" SWG 202.4; 3/4" SWG 210.6; 1/2" VCR 196.5. Downloads present.

#### MS3500VA (wr_id=21)
Range 300–1000 slpm, Max Pressure < 13 bar. Dimensions: 1/2" SWG 246; 3/4" SWG 246; 1" SWG 254.6. Downloads: `MS3500VA.CA.pdf`, `MS3500VA.도면.zip`, `MS3500VA Maunal.pdf`.

#### MS3600VA (wr_id=20)
Range 1000–1500 slpm, Max Pressure < 13 bar. Dimensions same as MS3500VA.

#### MS3700VA (wr_id=19)
Range 1500–2000 slpm, Max Pressure < 13 bar. Dimensions: 3/4" SWG 248; 1" SWG 256.6. Downloads: `MS3700VA.CA.pdf`, `MS3700VA.도면.zip`, `MS3700VA Manual.pdf`.

#### MS3800VA (wr_id=26)
Range 2500–5000 slpm, Max Pressure < 13 bar. Dimensions: 3/4" SWG 260; 1" SWG 268.7. Downloads present.

### /bbs/board.php?bo_table=02_02_c — Analogue MFM (8 products)

All share: Accuracy varies (±1% or ±2% FS), Repeatability ±0.25%, Signals 0~5Vdc or 4~20mA, Power +15 or +24Vdc 350mA, Max P < 90 bar (except MS2400VA row listed at 90 bar, verify), Temp 0~50℃, Leak 1×10⁻⁹ atm·cc/s, Control 3–100%. No Response Time row (meter, not controller).

| Model | wr_id | Range (N2) | Accuracy | Key connection A-dim |
|---|---|---|---|---|
| M2030VA | 18 | 0.01~30 slpm | ±1% FS | 1/8" SWG 106.2 / 1/4" SWG 110.8 / 3/8" SWG 113.8 / 1/4" VCR 107.2 |
| M2200VA | 19 | 30~100 slpm | ±1% FS | 1/4" SWG 144.8 / 3/8" SWG 147.8 / 1/4" VCR 141.5 / 1/2" VCR 144.8 |
| MS2150VA | 20 | 30~100 slpm | ±1% FS | 1/4" SWG 132.3 / 3/8" SWG 135.3 / 1/4" VCR 128.7 / 1/2" VCR 136.3 |
| MS2400VA | 17 | 100~300 slpm | ±2% FS | 3/8" SW 152.8 / 1/2" SW 158.4 / 3/4" SW 166.6 / 1/2" VCR 152.5 |
| MS2500VA | 16 | 300~1000 slpm | ±2% FS | 1/2" SWG 209 / 3/4" SWG 209 / 1" SWG 217.6 |
| MS2600VA | 15 | 1000~1500 slpm | ±2% FS | 1/2" SWG 209 / 3/4" SWG 209 / 1" SWG 217.6 |
| MS2700VA | 21 | 1500~2500 slpm | ±2% FS | 3/4" SWG 213 / 1" SWG 221.6 |
| MS2800VA | 22 | 2500~5000 slpm | ±2% FS | 3/4" SWG 223 / 1" SWG 231.7 |

Downloads: Catalogue PDF / Drawing ZIP / Manual PDF on each page.

### /bbs/board.php?bo_table=02_03_c — Digital MFC (7 products)

All share: Response Time < 1 sec, Signals 0~5Vdc or 4~20mA, Power +15 or +24Vdc 350mA, Temp 0~50℃, Leak 1×10⁻⁹, Control 3–100%. MD700C / MD800C add Communication: RS-485. Max Operating Pressure: "< 90 bar" for small units, "inquiry" for MD400C and above.

| Model | wr_id | Range (N2) | Accuracy | Dimensions (A, mm) |
|---|---|---|---|---|
| MD30C | 15 | 0.01~30 slpm | ±0.25% FS | 1/8" SW 126.7 / 1/4" SW 128 / 3/8" SW 134.3 / 1/4" VCR 127.8 |
| MD100C | 14 | 30~100 slpm | ±0.25% FS | 1/4" SW 145.9 / 3/8" SW 149.3 / 1/2" SW 161.5 / 1/4" VCR 141.5 / 1/2" VCR 149 |
| MD400C | 12 | 100~300 slpm | ±1% FS | 3/8" SWG 196.8 / 1/2" SWG 209 / 3/4" SWG 210.6 / 1/2" VCR 196.5 |
| MD500C | 11 | 300~1000 slpm | ±1% FS | 1/2" SW 246 / 3/4" SW 247.6 / 1" SW 254.6 |
| MD600C | 10 | 1000~1500 slpm | ±1% FS | 1/2" SW 246 / 3/4" SW 247.6 / 1" SW 254.6 |
| MD700C | 9 | 1500~2500 slpm | ±1% FS | 1/2" SW 248 / 3/4" SW 249.6 / 1" SW 256.6 |
| MD800C | 13 | 2500~5000 slpm | ±1% FS | 1/2" SW 257 / 3/4" SW 259.8 / 1" SW 267.8 |

Downloads: Drawing ZIP (e.g. `M3100.zip`), Manual docx (e.g. `MD100.docx`) — inconsistent with Analogue MFC which ships PDFs.

### /bbs/board.php?bo_table=02_04_c — Digital MFM (7 products)

All share: Signals 0~5Vdc or 4~20mA, Power +15 or +24Vdc 350mA, Temp 0~50℃, Leak 1×10⁻⁹, Control 3–100%. Max Pressure: < 90 bar up through MD400M listing; larger units say "inquiry".

| Model | wr_id | Range (N2) | Accuracy | Dimensions (A, mm) |
|---|---|---|---|---|
| MD30M | 10 | 0.01~30 slpm | ±0.25% FS | 1/8" SW 104.5 / 1/4" SW 111.9 / 3/8" SW 115.3 / 1/4" VCR 107.5 |
| MD100M | 9 | 30~100 slpm | ±0.25% FS | 1/4" SW 127.4 / 3/8" SW 130.8 / 1/2" SW 143 / 1/4" VCR 123 / 1/2" VCR 130.5 |
| MD400M | 8 | 100~300 slpm | ±1% FS | 3/8" SWG 152.8 / 1/2" SWG 165 / 3/4" SWG 166.6 / 1/2" VCR 152.5 |
| MD500M | 7 | 300~1000 slpm | ±1% FS | 1/2" SW 209 / 3/4" SW 210.6 / 1" SW 217.6 |
| MD600M | 6 | 1000~1500 slpm | ±1% FS | 1/2" SW 209 / 3/4" SW 210.6 / 1" SW 217.6 |
| MD700M | 11 | 1500~2500 slpm | ±1% FS | 1/2" SWG 213 / 3/4" SWG 214.6 / 1" SWG 221.6 |
| MD800M | 12 | 2500~5000 slpm | ±1% FS | 1/2" SWG 215 / 3/4" SWG 217 / 1" SWG 225.8 |

Downloads (when present): Drawing ZIP (e.g. `M2100.zip`). Manual docx variably present.

### /bbs/board.php?bo_table=02_05_c — ReadOutBox (2 products)

#### LTI-1000 (wr_id=2)
| Parameter | Value |
|---|---|
| Input Power | 220VAC (50~60Hz) |
| Output Power | ±15VDC @ 500mA (Option ±24VDC) |
| Display Window | 4Digit – 7Segment |
| Display Repeatability | ±0.1% of Full Scale |
| Output Signal | 0~5Vdc (Option 4-20mA) |
| Units of Display | SCCM, SLM, % |
| Remote Control | D-SUB 9PIN (Male) |
| Set-Point | 0~5Vdc for Full Scale |
| Flow On/Off | Input Signal (TTL) |
| Flow Out Signal | 0~5Vdc (Option 4-20mA) |
| Relay Contact | 1 relay, max 24Vdc @ 1A |
| Communication | RS-232 (9600 Baud, 8-N-1) |

Downloads: `LTI-1000.pdf` (manual).

#### LTI-200 (wr_id=3)
| Parameter | Value |
|---|---|
| Input Power | 15Vdc ~ 24Vdc |
| Output Power | ±15VDC @ 500mA |
| Display Window | 4Digit – 7Segment |
| Display Repeatability | ±0.1% of Full Scale |
| Output Signal | 0~5Vdc (Option 4-20mA) |
| Display Units | SCCM, SLM, % |
| Set-Point | 0~5Vdc for Full Scale |
| Flow On/Off | TTL input |
| Flow Out Signal | 0~5Vdc (Option 4-20mA) |
| Communication | RS-485 (optional) |

No downloads linked.

### /bbs/board.php?bo_table=02_06_c — Component (2 products)

- **FC-050S** (wr_id=4): page exists but body is image-only (2 GIFs). No spec table or text body.
- **PR-030** (wr_id=3): same — two GIFs + one JPG (`...1610543932_9424.jpg`), no specs.

These pages appear to be image-only stubs. Confirmed against WebFetch; a headless browser render may expose more.

### /bbs/board.php?bo_table=02_07_c — Specialized MFC (Display MFC) (1 product)

#### LD030C (wr_id=1)
Range 0.01–30 slpm; Response Time < 2 sec; Accuracy ±1% FS; Repeatability ±0.25%; In/Out 0~5Vdc; Power +15 or +24Vdc 350mA; Max P < 90 bar; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 1/8" SW 140.2 / 1/4" SW 141.5 / 3/8" SW 147.8 / 1/4" VCR 141.3. No downloads.

### /bbs/board.php?bo_table=02_07_01_c — Specialized MFC (Display MFM) (1 product)

#### LD030M (wr_id=1)
Identical spec block and dimensions to LD030C (meter variant; no Response Time row per meter pattern).

### /bbs/board.php?bo_table=02_07_02_c — Specialized MFC (MEMS MFC) (1 product)

#### LM030C (wr_id=1)
Range 0.01–30 slpm; Response Time < 1 sec; Accuracy ±1% FS; Repeatability ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vdc; Max P < 10 bar; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 1/8" SW 126.7 / 1/4" SW 128 / 3/8" SW 134.3 / 1/4" VCR 127.8.

### /bbs/board.php?bo_table=02_07_03_c — Specialized MFC (MEMS MFM) (1 product)

#### LM030M (wr_id=1)
Range 0.01–30 slpm; Accuracy ±1% FS; Repeatability ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vdc; Max P < 10 bar; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 1/8" SW 106.2 / 1/4" SW 107.5 / 3/8" SW 113.8 / 1/4" VCR 107.3.

### /bbs/board.php?bo_table=02_07_04_c — EX-Proof MFC (2 products)

#### EX070C (wr_id=1)
Range 0.01–100 slpm; Response Time < 2 sec; Accuracy ±1% FS; Rep ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vd(c); Max P < 90 bar; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 3/8" SW 178.8 / 1/2" SW 191 / 3/4" SW 192.6.

#### EX1000C (wr_id=2)
Range 100–1000 slpm; Response Time < 2 sec; Accuracy ±2% FS; Rep ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vd(c); Max P "inquiry"; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 1/2" SW 221 / 3/4" SW 222.6 / 1" SW 229.6.

### /bbs/board.php?bo_table=02_07_05_c — EX-Proof MFM (2 products)

#### EX070M (wr_id=1)
Range 0.01–100 slpm; Accuracy ±1% FS; Rep ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vd(c); Max P < 90 bar; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 3/8" SW 197 / 1/2" SW 206 / 3/4" SW 209.

#### EX1000M (wr_id=2)
Range 100–1000 slpm; Accuracy ±2% FS; Rep ±0.25%; Signals 0~5Vdc or 4~20mA; Power +15 or +24Vd(c); Max P "inquiry"; Temp 0~50℃; Leak 1×10⁻⁹; Control 3–100%.
Dimensions: 1/2" SW 218 / 3/4" SW 221 / 1" SW 229.8.

---

## Q&A (/bbs/board.php?bo_table=03_01_c)

**Status:** Empty board. "Total 0건 1 페이지" / "게시물이 없습니다" (no posts). Listing UI shows columns: 번호 (number), 제목 (title), 글쓴이 (author), 날짜 (date), 조회 (views). Search form with dropdown (title/content/title+content/user ID/author) and required keyword field. A "write" button would be exposed once logged in — not tested here. **No "write" form visible to anonymous users** based on the WebFetch render.

---

## Data Room (技术资料)

### Catalogue — /bbs/board.php?bo_table=04_01_c

| # | Title | Date | Views | File | URL |
|---|---|---|---|---|---|
| 1 | (주)라인텍 카다로그 입니다. ("Line-Tech Catalogue") | 07-03 | 3481 | Attached (not directly linked on list) | `&wr_id=1` |

Only one entry. Title is Korean. No Chinese-language catalogue.

### AutoCAD — /bbs/board.php?bo_table=04_02_c (14 entries)

All dated 07-03. Titles are Korean; content is device drawings applying to both MFC and MFM.

| wr_id | Title | Views |
|---|---|---|
| 14 | MS30V도면(MFC) | 3858 |
| 13 | M3200VA도면(MFC) 15pin,9pin | 4237 |
| 12 | M3400VA MD400C 도면(MFC) | 4031 |
| 11 | M2600VA, MD600M도면(MFM) | 3759 |
| 10 | M3700VA, MD700C도면(MFC) | 3785 |
| 9 | M3600VA, MD600C도면(MFC) | 3757 |
| 8 | M3500VA, MD500C도면(MFC) | 3935 |
| 7 | M2500VA, MD500M도면(MFM) | 3937 |
| 6 | M3300VA, MD300C도면(MFC) | 3920 |
| 5 | M2300VA, MD300M도면(MFM) | 3881 |
| 4 | M3100VA, MD100C도면(MFC) | 3806 |
| 3 | M2100VA, MD100M도면(MFM) | 4051 |
| 2 | M3030VA, MD30C도면(MFC) | 4151 |
| 1 | M2030VA, MD30M도면(MFM) | 3740 |

Each entry has an attached file; exact file URL requires opening the detail page (not crawled — follow pattern `/data/file/04_02_c/<hash>`).

### Manual — /bbs/board.php?bo_table=04_03_c (23 entries)

All dated 07-03. Titles Korean. #7 has no file. Notable entries:

| wr_id | Title | File |
|---|---|---|
| 23 | LINETECH 신규카다로그 (new catalogue) | yes |
| 22 | KRO-4000S 통신프로그램 | yes |
| 21 | LTI-1000 Read Out Unit 매뉴얼 | yes |
| 20 | DMFC windows 메뉴얼 | yes |
| 19 | DMFC사용자 프로그램 업그레이드 | yes |
| 18 | Analogue MFC M3700 series Manual | yes |
| 17 | Analogue MFC M3600 series Manual | yes |
| 16 | Analogue MFC M3500 series Manual | yes |
| 15 | Analogue MFC M3300 series Manual | yes |
| 14 | Analogue MFC M3100 series Manual | yes |
| 13 | Analogue MFC M3030 series Manual | yes |
| 12 | DMFC사용자 매뉴얼 | yes |
| 11 | MFC haunting 현상 | yes |
| 10 | M-series 메뉴얼 | yes |
| 9 | RA312 Manual | yes |
| 8 | KRO4000S 메뉴얼 | yes |
| 7 | MFC 전원 +24Vdc 까지 사용가능 | **no file** (text-only note) |
| 6 | JVC 메뉴얼 | yes |
| 5 | DFC4000 메뉴얼 | yes |
| 4 | OSC4000 메뉴얼 | yes |
| 3 | GMC 1000 메뉴얼 | yes |
| 2 | Gmate-2000 메뉴얼 (로카스 제품) | yes |
| 1 | FM30VE manual | yes |

### Community — ABOUT MFC — /bbs/board.php?bo_table=05_01_c

**Status:** Empty. "Total 0건" / "게시물이 없습니다".

---

## Footer content

Identical on every Chinese page:

- 公司名称 (Company Name): 莱因精密技术（无锡）有限公司 — Line Tech Precision Technology (Wuxi) Co., Ltd. This is the Chinese **local entity**, not the Korean parent. KR and EN versions show the Korean entity (Daejeon HQ).
- 电话 (Phone): 139-1177-2500 (Chinese mobile number, +86 prefix implied)
- 地址 (Address): 江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号
- 电子邮箱 (Email): 497081452@qq.com, mrmfckorea@gmail.com
- Copyright: "COPYRIGHT @ 2007 LINE-TECH. ALL RIGHT RESERVED."

No ICP beian (备案) number visible — likely missing despite being legally required for sites hosted/served to mainland China. Flag for launch compliance.

No privacy policy, terms, sitemap, or social links in footer.

---

## Parity vs Korean / English

**Present (structural parity):**
- Same nav topology: About (3) / Products (6 top-level + 6 specialized sub) / Q&A / Technical / Community
- Same product catalog: 39 products across the same 12 category pages

**Missing / reduced:**
- No Chinese translation of product body copy — all spec tables in English on all three language versions
- No Chinese translation of Data Room document titles — all entries retain Korean titles with Korean filename stems (e.g. `MS3500VA.도면.zip`)
- No Chinese copy of the CEO greeting or history timeline — labels are in Chinese but narrative content appears English/Korean
- Q&A and Community boards are empty (same in KR/EN)
- Component pages (FC-050S, PR-030) are image-only stubs (same in all locales — verify)
- Featured product `wr_id`s on homepage (15, 13) don't match current product IDs; likely stale

**Unique to Chinese version:**
- Footer is localised to the Wuxi subsidiary: 莱因精密技术（无锡）有限公司, Wuxi address, Chinese mobile number
- Email includes a QQ address (497081452@qq.com) that doesn't appear on KR/EN footers
- Nav labels (公司介绍, 产品介绍, 问答, 技术资料, 社区) are Chinese

---

## Open Questions / Unknowns

1. **01_04_c / 01_05_c redirect to 404.** These slots do not exist — mirror KR/EN behaviour. No hidden "Certifications" or extras.
2. **Featured homepage product links stale:** homepage points to `02_01_c&wr_id=15` (M3200VA in body) and `wr_id=13` (MS3400VA), but the current Analogue MFC listing has `wr_id` 18–26. Either the homepage HTML is stale or products were renumbered. The deep links likely 404 or show a different product. Worth verifying in browser.
3. **Component pages are image-only.** Neither FC-050S nor PR-030 has structured specs in the rendered HTML. Unclear whether the legacy site displays additional info via a headless-rendered script; WebFetch would not capture JS-rendered content.
4. **Data Room downloads:** document entry pages were not opened individually. File paths follow `/data/file/04_0N_c/<hash>.{pdf|zip|docx}` based on product-page observations; each entry would need a second fetch to capture exact filenames and sizes.
5. **Contact nav item** is a `#` anchor — no confirmed modal / form. Either a JS popup (not captured) or dead.
6. **No ICP license number** in footer — regulatory risk if the Next.js replacement is served to mainland China.
7. **Q&A write form behaviour for anonymous users** was not tested. Korean boards typically require login; confirm whether the "write" button is exposed.
8. **Image alt texts** are in Korean on every Chinese page (e.g. "에이치엔에스하이텍 로고") — accessibility gap.
9. **Page titles** (`<title>`) render in Korean on all Chinese pages — SEO/localization gap.
10. **Chinese translations not persisted to product copy.** Only structural chrome is translated. The Chinese site is effectively a Chinese-menu skin over the English product data.
