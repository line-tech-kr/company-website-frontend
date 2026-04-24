# Line Tech Product Catalog — English (2020 Edition)

> Structured extraction of `English+catalog_New+version.pdf` (88 pages, 18 MB).
> Source: `/Users/bsp/Desktop/English+catalog_New+version.pdf`
> Captured: 2026-04-21

This document is the authoritative product-data reference for the Next.js + Sanity rebuild. All product specs, tables, pinouts, and the full gas-conversion appendix are preserved verbatim from the catalog.

---

## Table of Contents

1. [Company](#1-company)
2. [Technology Overview](#2-technology-overview)
3. [Product Line Summary](#3-product-line-summary)
4. [Analogue Series (M / MS)](#4-analogue-series-m--ms)
5. [Digital Series (MD)](#5-digital-series-md)
6. [Specialized Series (LD / LM / EX)](#6-specialized-series-ld--lm--ex)
7. [Other Devices & Parts](#7-other-devices--parts)
8. [Certifications](#8-certifications)
9. [Calibration Standards](#9-calibration-standards)
10. [Installation Manual (M-Series)](#10-installation-manual-m-series)
11. [Electrical Interfacing](#11-electrical-interfacing)
12. [Services & Support](#12-services--support)
13. [Appendix — Gas Conversion](#13-appendix--gas-conversion)

---

## 1. Company

### Identity

- **Company:** LINE TECH Inc. (라인텍)
- **Tagline:** "Reliable Technology & Supreme Service — Always striving for Excellence"
- **Business:** MFC / MFM (Mass Flow Controller / Mass Flow Meter) manufacturing
- **Website:** www.line-tech.co.kr

### Contact

| | |
|---|---|
| Address | 806, Daedeok-daero, Yuseong-gu, Daejeon, Korea |
| Tel | 82-42-624-0700 |
| Fax | 82-42-638-2211 |
| HP (mobile) | 82-10-8696-6898 |
| E-mail (general) | mrmfckorea@gmail.com |
| E-mail (support / feedback) | linetech@line-tech.co.kr |

### Welcome (CEO message)

> "With a vision to become a global leader in MFC / MFM business by producing and providing only the best."

From its inception in 1997, Line Tech continues a history of daring innovation and consistent progress. After years of collaboration with Korea Advanced Institute of Science and Technology (KAIST), Line Tech became the first in the nation to self-produce MFC and MFM in 2003. Since then, the catalogue has seen additions of different MFC / MFM series, LTI Read Out Unit, and more, with continued R&D, differentiated AS service, and catered consultation.

— **Michael wonho Jung**, CEO-Overseas Business Division

### Brief History — Journey of Value Creation

| Date | Milestone |
|---|---|
| 1997.03 | Line Tech Inc. founded |
| 2000.01 | R&D in collaboration with KAIST |
| 2003.03 | First MFC / MFM models developed |
| 2006.06 | First international sales (Shanghai, China) |
| 2015.09 | R&D Center established |
| 2016.01 | Read Out Unit developed (LTI Model) |
| 2016.12 | Upgraded range capacity to 150, 500, 1,000, 2,500 SLPMs |
| 2017.08 | Certified by CE, ISO |
| 2018.03 | Certified as INNOBIZ |
| 2019.03 | Upgraded range capacity to 5,000 SLPM |
| 2019.11 | First international licensed distributor in India |
| 2020.06 | EX, LD, LM series developed |

---

## 2. Technology Overview

### Thermal Mass Flow Controller and Meter

Thermal mass flow sensor allows for a direct measurement of the mass flow and provides a number of competitive advantages.

**Advantages**

- Mass Flow Measurement with High Precision
- Reliable Delivery of Flow Mass
- High Accuracy
- Fast Response Time
- Considerable Cost Efficiency
- Consistent Repeatability
- Compact Flow Control System
- Relative Immunity to Temperature and Pressure Fluctuations of the Incoming Flow

**Measurement Technique**

Two temperature sensors are placed in opposite ends of a bypass route and heated uniformly to be at the same temperature. When gas flows through a product, a part of it gets rerouted and travels through the bypass. The upstream temperature sensor, placed at the entering portion of the bypass, loses heat as the gas molecules carry heat away. As these molecules reach the end of the bypass to exit, the downstream temperature sensor becomes heated by the carried-over heat. The resulting temperature difference between the two sensors is proportional to the mass flow rate.

- Supply: **+15 ~ +24 Vdc**
- Output: **0–5 Vdc or 4–20 mA**

### Applications

- Biotech / Pharmaceutical Industry
- Component Leak Detection
- Chemical / Petrochemical Industry
- Fuel Cells
- Fiber Optics / Glass
- Gas Injection on Surface Treatment
- LED Lighting
- Metals Processing
- Precision Gas Blending & Analysis
- Research and Development & Laboratories
- Semiconductor Industry
- Solar / Photovoltaic Technology

**Typical system:** multiple MFCs (one per gas — e.g., Gas A, B, C) → Read Out Box → PLC or PC, feeding a Process chamber & Reactor.

---

## 3. Product Line Summary

The catalog covers four product families:

| Series | Type | Flow Range (N2) | Key Trait |
|---|---|---|---|
| **M / MS (Analogue)** | MFC + MFM | 0.01 – 5,000 slpm | First-gen, proven; MS = smaller PCB variant |
| **MD (Digital)** | MFC + MFM | 0.01 – 5,000 slpm | Digital variant of M-Series, RS-485 comms |
| **LD (Specialized)** | MFC + MFM | 0.01 – 30 slpm | Built-in 7-segment display |
| **LM (Specialized)** | MFC + MFM | 0.01 – 30 slpm | MEMS-tech, low-cost, 10 bar max |
| **EX (Specialized)** | MFC + MFM | 0.01 – 1000 slpm | Explosion-Proof (Ex ec IIC T4 Gc, IP 65) |

Plus accessory devices: **LTI-200 / LTI-1000** (Read Out Units), **FC-050S** (high-pressure flow controller), **PR-030** (pressure-shock protector).

### Shared Analogue Traits (M + MS series)

- **Wide Range:** 0.01 to 5,000 SLPM (contact for >5,000 SLPM)
- **Accurate:** ±1 % FS error rate (lower ranges); ±2 % FS (higher ranges ≥100 slpm)
- **Dependable:** ±0.25 % repeatability for long-term use
- **Responsive:** 1–2 s selectable response time
- **Flexible:** 0–50 °C operating temp, <90 bar pressure
- **Durable:** high corrosion resistance

### Shared Digital Traits (MD series)

- Same flow coverage as Analogue
- **8-Point calibration** for higher linearity accuracy (±0.25 % FS at low ranges; ±1.0 % FS at higher ranges)
- **Faster response:** 0.5–1 s
- ±0.25 % repeatability
- RS-485 communication, 38400 bps, 8-bit / 1 stop / no parity, PIN 14–15

### At-a-Glance Specification Tables

#### Analogue Mass Flow Controller Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | Response (sec) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|---|
| M3030VA | 0.01 ~ 30 | ±1.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| M3100VA | 30 ~ 100 | ±1.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| M3200VA | 30 ~ 100 | ±1.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MS3150VA | 30 ~ 100 | ±1.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MS3400VA | 100 ~ 300 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS3500VA | 300 ~ 1000 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS3600VA | 1000 ~ 1500 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS3700VA | 1500 ~ 2500 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS3800VA | 2500 ~ 5000 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

#### Analogue Mass Flow Meter Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|
| M2030VA | 0.01 ~ 30 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| M2100VA | 30 ~ 100 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| M2200VA | 30 ~ 100 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MS2150VA | 30 ~ 100 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MS2400VA | 100 ~ 300 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS2500VA | 300 ~ 1000 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS2600VA | 1000 ~ 1500 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS2700VA | 1500 ~ 2500 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MS2800VA | 2500 ~ 5000 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

#### Digital Mass Flow Controller Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | Response (sec) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|---|
| MD30C | 0.01 ~ 30 | ±0.25 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MD100C | 30 ~ 100 | ±0.25 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MD400C | 100 ~ 300 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD500C | 300 ~ 1000 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD600C | 1000 ~ 1500 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD700C | 1500 ~ 2500 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD800C | 2500 ~ 5000 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

#### Digital Mass Flow Meter Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|
| MD30M | 0.01 ~ 30 | ±0.25 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MD100M | 30 ~ 100 | ±0.25 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| MD400M | 100 ~ 300 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD500M | 300 ~ 1000 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD600M | 1000 ~ 1500 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD700M | 1500 ~ 2500 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |
| MD800M | 2500 ~ 5000 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

#### Specialized Mass Flow Controller Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | Response (sec) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|---|
| LD030C | 0.01 ~ 30 | ±1.0 | ±0.25 | <2 | 0~5 Vdc | +15 ~ 24 | <90 bar | 0 ~ 50 |
| LM030C | 0.01 ~ 30 | ±1.0 | ±0.25 | <1 | 0~5 or 4~20 | +15 ~ 24 | <10 bar | 0 ~ 50 |
| EX070C | 0.01 ~ 100 | ±1.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| EX1000C | 100 ~ 1000 | ±2.0 | ±0.25 | <2 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

#### Specialized Mass Flow Meter Specifications

| Model | Full Scale N2 (slpm) | Accuracy (%FS) | Repeatability (%) | In/Out Signal | Supply (Vdc) | Max Pressure | Max Temp (°C) |
|---|---|---|---|---|---|---|---|
| LD030M | 0.01 ~ 30 | ±1.0 | ±0.25 | 0~5 Vdc | +15 ~ 24 | <90 bar | 0 ~ 50 |
| LM030M | 0.01 ~ 30 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <10 bar | 0 ~ 50 |
| EX070M | 0.01 ~ 100 | ±1.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | <90 bar | 0 ~ 50 |
| EX1000M | 100 ~ 1000 | ±2.0 | ±0.25 | 0~5 or 4~20 | +15 ~ 24 | inquiry | 0 ~ 50 |

> *Note: Flow ranges above 5,000 SLPM — contact Line Tech directly.*
> *Note: Flows > 100 slpm N2-equivalent require inlet pressure greater than 40 psig (2.76 bar).*

---

## 4. Analogue Series (M / MS)

All analogue models share this common spec set (unless overridden below):
- Supply: +15 ~ +24 Vdc, 350 mA
- Response time: <2 sec
- Repeatability: ±0.25 %
- In/Out Signal: 0~5 Vdc or 4~20 mA
- Max Operating Temp: 0–50 °C
- Leak Rate: 1 × 10⁻⁹ atm·cc/sec
- Control Range: 3–100 %

Shared features across all M / MS models: *Accurate at Low Flow · Fast Response · Wide Pressure Range Compatibility · Excellent Linearity · Long-Term Stability · High Corrosion Resistance · Highly Stable Removable Sensor · Compact Connection*.

### M3030VA — Mass Flow Controller (page 16)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

**Connection "A" Dimensions (mm)**

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 126.7 |
| 1/4″ SW | 128 |
| 3/8″ SW | 134.3 |
| 1/4″ VCR | 127.8 |

Body dimensions: 80 × 125 mm (W × H).

### M2030VA — Mass Flow Meter (page 17)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 104.5 |
| 1/4″ SW | 111.9 |
| 3/8″ SW | 115.3 |
| 1/4″ VCR | 107.5 |

Body dimensions: 59.5 × 125 mm.

### M3100VA — Mass Flow Controller (page 18)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4" SW | 145.9 |
| 3/8" SW | 149.3 |
| 1/2" SW | 161.5 |
| 1/4" VCR | 141.5 |
| 1/2" VCR | 149 |

Body: 93.5 × 137 mm.

### M2100VA — Mass Flow Meter (page 19)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4" SW | 127.4 |
| 3/8" SW | 130.8 |
| 1/2" SW | 143 |
| 1/4" VCR | 123 |
| 1/2" VCR | 130.5 |

Body: 75 × 137 mm.

### M3200VA — Mass Flow Controller (page 20)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4"SW | 145.9 |
| 3/8"SW | 149.3 |
| 1/4"VCR | 141.5 |

Body: 93.5 × 100.8 mm. Visual: distinctive silver case with red "FLOW" graphic.

### M2200VA — Mass Flow Meter (page 21)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4"SW | 145.9 |
| 3/8"SW | 149.3 |
| 1/4"VCR | 141.5 |

Body: 93.5 × 100.8 mm.

### MS3150VA — Mass Flow Controller (page 22)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4"SW | 145.9 |
| 3/8"SW | 149.3 |
| 1/4"VCR | 141.5 |

Body: 93.5 × 106.5 mm.

### MS2150VA — Mass Flow Meter (page 23)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4"SW | 145.9 |
| 3/8"SW | 149.3 |
| 1/4"VCR | 141.5 |

Body: 76.5 × 106.5 mm.

### MS3400VA — Mass Flow Controller (page 24)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 300 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 3/8"SW | 196.7 |
| 1/2"SW | 209 |
| 3/4"SW | 210.6 |
| 1/2"VCR | 196.5 |

Body: 141 × 121.5 mm. Note: flows > 100 slpm N2-equivalent require inlet pressure > 40 psig (2.76 bar).

### MS2400VA — Mass Flow Meter (page 25)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 300 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 3/8"SW | 152.8 |
| 1/2"SW | 165 |
| 3/4"SW | 166.6 |
| 1/2"VCR | 152.5 |

Body: 97 × 121.5 mm.

### MS3500VA — Mass Flow Controller (page 26)

| Spec | Value |
|---|---|
| Range (N2) | 300 slpm ~ 1000 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 246 |
| 3/4" SW | 247.6 |
| 1" SW | 254.6 |

Body: 163 × 147.5 mm (tubular / cylindrical body style).

### MS2500VA — Mass Flow Meter (page 27)

| Spec | Value |
|---|---|
| Range (N2) | 300 slpm ~ 1000 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 209 |
| 3/4" SW | 210.6 |
| 1" SW | 217.6 |

Body: 141 × 147.5 mm.

### MS3600VA — Mass Flow Controller (page 28)

| Spec | Value |
|---|---|
| Range (N2) | 1000 slpm ~ 1500 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 246 |
| 3/4" SW | 247.6 |
| 1" SW | 254.6 |

Body: 178 × 147.5 mm.

### MS2600VA — Mass Flow Meter (page 29)

| Spec | Value |
|---|---|
| Range (N2) | 1000 slpm ~ 1500 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 209 |
| 3/4" SW | 210.6 |
| 1" SW | 217.6 |

Body: 141 × 147.5 mm.

### MS3700VA — Mass Flow Controller (page 30)

| Spec | Value |
|---|---|
| Range (N2) | 1500 slpm ~ 2500 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 248 |
| 3/4" SW | 249.6 |
| 1" SW | 256.6 |

Body: 180 × 160.5 mm.

### MS2700VA — Mass Flow Meter (page 31)

| Spec | Value |
|---|---|
| Range (N2) | 1500 slpm ~ 2500 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 213 |
| 3/4" SW | 214.6 |
| 1" SW | 221.6 |

Body: 145 × 160.5 mm.

### MS3800VA — Mass Flow Controller (page 32)

| Spec | Value |
|---|---|
| Range (N2) | 2500 slpm ~ 5000 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 257 |
| 3/4" SW | 259.8 |
| 1" SW | 267.8 |

Body: 192 × 179 mm. *Please contact for ranges above 5,000 SLPM.*

### MS2800VA — Mass Flow Meter (page 33)

| Spec | Value |
|---|---|
| Range (N2) | 2500 slpm ~ 5000 slpm |
| Accuracy | ±2 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 215 |
| 3/4" SW | 217 |
| 1" SW | 225.8 |

Body: 155 × 179 mm.

---

## 5. Digital Series (MD)

All MD models share this common spec set:
- Supply: +15 ~ +24 Vdc, 350 mA
- Response time: <1 sec (faster than Analogue)
- Repeatability: ±0.25 %
- In/Out Signal: 0~5 Vdc or 4~20 mA
- Max Operating Temp: 0–50 °C
- Leak Rate: 1 × 10⁻⁹ atm·cc/sec
- Control Range: 3–100 %
- **Digital Communication** on PIN 14, 15: RS-485, 38400 bps, 8-bit Data, 1 stop bit, no Parity

Series traits: *Accurate at Low Flow · Fast Response · Wide Pressure Range Compatibility · Excellent Linearity · Long-Term Stability · High Corrosion Resistance · Highly Stable Removable Sensor · Compact Connection*.

### MD30C — Digital Mass Flow Controller (page 36)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±0.25 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 126.7 |
| 1/4″ SW | 128 |
| 3/8″ SW | 134.3 |
| 1/4″ VCR | 127.8 |

Body: 80 × 143 mm.

### MD30M — Digital Mass Flow Meter (page 37)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±0.25 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 104.5 |
| 1/4″ SW | 111.9 |
| 3/8″ SW | 115.3 |
| 1/4″ VCR | 107.5 |

Body: 59.5 × 143 mm.

### MD100C — Digital Mass Flow Controller (page 38)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±0.25 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4" SW | 145.9 |
| 3/8" SW | 149.3 |
| 1/2" SW | 161.5 |
| 1/4" VCR | 141.5 |
| 1/2" VCR | 149 |

Body: 93.5 × 155 mm.

### MD100M — Digital Mass Flow Meter (page 39)

| Spec | Value |
|---|---|
| Range (N2) | 30 slpm ~ 100 slpm |
| Accuracy | ±0.25 % of FS |
| Max Operating Pressure | <90 bar |

| Connection | A (mm) |
|---|---|
| 1/4" SW | 127.4 |
| 3/8" SW | 130.8 |
| 1/2" SW | 143 |
| 1/4" VCR | 123 |
| 1/2" VCR | 130.5 |

Body: 75 × 155 mm.

### MD400C — Digital Mass Flow Controller (page 40)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 300 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 3/8"SWG | 196.8 |
| 1/2"SWG | 209 |
| 3/4"SWG | 210.6 |
| 1/2"VCR | 196.5 |

Body: 141 × 155 mm. Flows > 100 slpm require >40 psig inlet pressure.

### MD400M — Digital Mass Flow Meter (page 41)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 300 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 3/8"SWG | 152.8 |
| 1/2"SWG | 165 |
| 3/4"SWG | 166.6 |
| 1/2"VCR | 152.5 |

Body: 97 × 156 mm.

### MD500C — Digital Mass Flow Controller (page 42)

| Spec | Value |
|---|---|
| Range (N2) | 300 slpm ~ 1000 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 246 |
| 3/4" SW | 247.6 |
| 1" SW | 254.6 |

Body: 178 × 182 mm.

### MD500M — Digital Mass Flow Meter (page 43)

| Spec | Value |
|---|---|
| Range (N2) | 300 slpm ~ 1000 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 209 |
| 3/4" SW | 210.6 |
| 1" SW | 217.6 |

Body: 141 × 182 mm.

### MD600C — Digital Mass Flow Controller (page 44)

| Spec | Value |
|---|---|
| Range (N2) | 1000 slpm ~ 1500 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 246 |
| 3/4" SW | 247.6 |
| 1" SW | 254.6 |

Body: 178 × 182 mm.

### MD600M — Digital Mass Flow Meter (page 45)

| Spec | Value |
|---|---|
| Range (N2) | 1000 slpm ~ 1500 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 209 |
| 3/4" SW | 210.6 |
| 1" SW | 217.6 |

Body: 141 × 182 mm.

### MD700C — Digital Mass Flow Controller (page 46)

| Spec | Value |
|---|---|
| Range (N2) | 1500 slpm ~ 2500 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 248 |
| 3/4" SW | 249.6 |
| 1" SW | 256.6 |

Body: 180 × 195 mm.

### MD700M — Digital Mass Flow Meter (page 47)

| Spec | Value |
|---|---|
| Range (N2) | 1500 slpm ~ 2500 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SWG | 213 |
| 3/4" SWG | 214.6 |
| 1" SWG | 221.6 |

Body: 145 × 195 mm.

### MD800C — Digital Mass Flow Controller (page 48)

| Spec | Value |
|---|---|
| Range (N2) | 2500 slpm ~ 5000 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SW | 257 |
| 3/4" SW | 259.8 |
| 1" SW | 267.8 |

Body: 192 × 210 mm. *Contact for ranges above 5,000 SLPM.*

### MD800M — Digital Mass Flow Meter (page 49)

| Spec | Value |
|---|---|
| Range (N2) | 2500 slpm ~ 5000 slpm |
| Accuracy | ±1 % of FS |
| Max Operating Pressure | inquiry |

| Connection | A (mm) |
|---|---|
| 1/2" SWG | 215 |
| 3/4" SWG | 217 |
| 1" SWG | 225.8 |

Body: 155 × 210 mm.

---

## 6. Specialized Series (LD / LM / EX)

> Introduced in 2020. Three purpose-built variants targeting display, cost, and hazardous environments.
>
> - **LD Series (0.01 ~ 30 slpm)** — Time-tested MFC / MFM with built-in 7-segment display for real-time flow monitoring
> - **LM Series (0.01 ~ 30 slpm)** — Cost-efficient MEMS-tech series with improved performance (lower pressure rating: <10 bar)
> - **EX Series (30 ~ 1000 slpm)** — State-of-the-art explosion-proof series for hazardous environments (Ex ec IIC T4 Gc · IP 65 Grade)

### LD030C — Mass Flow Controller with Display (page 52)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Response Time | <2 sec |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc (only) |
| Supply | +15 or +24 Vdc, 350 mA |
| Max Operating Pressure | <90 bar |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 140.2 |
| 1/4″ SW | 141.5 |
| 3/8″ SW | 147.8 |
| 1/4″ VCR | 141.3 |

Body: 93.5 × 124 mm. Features real-time flow measurement and real-time setting changes via on-device display + ▲ / ▼ / MENU / ENT buttons.

### LD030M — MEMS-Tech Mass Flow Meter (page 53)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc |
| Supply | +15 or +24 Vdc, 350 mA |
| Max Operating Pressure | <90 bar |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

| Connection | A (mm) |
|---|---|
| 1/8″ SW | 140.2 |
| 1/4″ SW | 141.5 |
| 3/8″ SW | 147.8 |
| 1/4″ VCR | 141.3 |

Body: 93.5 × 124 mm.

### LM030C — MEMS-Tech Mass Flow Controller (page 54)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Response Time | <1 sec |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | **<10 bar** (lower than standard models) |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

| Connection | A (mm) |
|---|---|
| 1/8" SW | 126.7 |
| 1/4" SW | 128 |
| 3/8" SW | 134.3 |
| 1/4" VCR | 127.8 |

Body: 80 × 125 mm. Case color: purple. Features outstanding cost efficiency and improved response time from MEMS tech.

### LM030M — MEMS-Tech Mass Flow Meter (page 55)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 30 slpm |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | <10 bar |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

| Connection | A (mm) |
|---|---|
| 1/8" SW | 106.2 |
| 1/4" SW | 107.5 |
| 3/8" SW | 113.8 |
| 1/4" VCR | 107.3 |

Body: 59.5 × 125 mm.

### EX070C — Ex-Proof Mass Flow Controller (page 56)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 100 slpm |
| Response Time | <2 sec |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | <90 bar |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

**Safety certifications:** Safe for Hazardous Environment · Ex ec IIC T4 Gc · IP 65 Grade.

| Connection | A (mm) |
|---|---|
| 3/8"SW | 178.8 |
| 1/2"SW | 191 |
| 3/4"SW | 192.6 |

Body: 123 × 168 mm. Robust industrial construction. Case color: red/pink with "Ex-Proof" label.

### EX070M — Ex-Proof Mass Flow Meter (page 57)

| Spec | Value |
|---|---|
| Range (N2) | 0.01 slpm ~ 100 slpm |
| Accuracy | ±1 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | <90 bar |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

Certifications: Ex ec IIC T4 Gc · IP 65.

| Connection | A (mm) |
|---|---|
| 3/8"SWG | 197 |
| 1/2"SWG | 206 |
| 3/4"SWG | 209 |

Body: 123 × 168 mm.

### EX1000C — Ex-Proof Mass Flow Controller (page 58)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 1000 slpm |
| Response Time | <2 sec |
| Accuracy | ±2 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | inquiry |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

Certifications: Ex ec IIC T4 Gc · IP 65.

| Connection | A (mm) |
|---|---|
| 1/2" SW | 221 |
| 3/4" SW | 222.6 |
| 1" SW | 229.6 |

Body: 153 × 195 mm. Flows >100 slpm N2-equivalent require >40 psig inlet.

### EX1000M — Ex-Proof Mass Flow Meter (page 59)

| Spec | Value |
|---|---|
| Range (N2) | 100 slpm ~ 1000 slpm |
| Accuracy | ±2 % of FS |
| Repeatability | ±0.25 % |
| In/Out Signal | 0~5 Vdc or 4~20 mA |
| Supply | +15 ~ +24 Vdc |
| Max Operating Pressure | inquiry |
| Max Operating Temp | 0–50 °C |
| Leak Rate | 1 × 10⁻⁹ atm·cc/sec |
| Control Range | 3–100 % |

Certifications: Ex ec IIC T4 Gc · IP 65.

| Connection | A (mm) |
|---|---|
| 1/2" SW | 218 |
| 3/4" SW | 221 |
| 1" SW | 229.8 |

Body: 153 × 195 mm.

> Catalog labels EX1000M as "MEMS Tech Mass Flow Meter" in title row, but its listed traits match the Ex-Proof line (Hazardous Environment, Ex ec IIC T4 Gc, IP 65). Treat as Ex-Proof; flag for verification with Line Tech before publishing on the site.

---

## 7. Other Devices & Parts

### LTI-200 — Read Out Box (page 61)

| Spec | Value |
|---|---|
| Input Power | 15 Vdc ~ 24 Vdc |
| Output Power | +15 Vdc @ 500 mA |
| Display Window | 4-Digit 7-Segment |
| Display Repeatability | ≤±1.0 % of Full Scale |
| Output Signal | 0~5 Vdc |
| Units of Display | SCCM, SLM, % |
| Set-Point | 0~5 Vdc for Full Scale |
| Flow On/Off | Input Signal (TTL) |
| Flow Out Signal | 0~5 Vdc |
| Communication | RS485 (Option) |

Case dimensions: 104 × 38 mm. Front buttons: Flow · Flow on/off · ▲ · ▼ · MENU · ENT.

### LTI-1000 — Read Out Box (page 62)

| Spec | Value |
|---|---|
| Input Power | 220 VAC (50 ~ 60 Hz) |
| Output Power | ±15 VDC @ 500 mA (Option ±24 VDC) |
| Display Window | 4-Digit 7-Segment |
| Display Repeatability | ≤±1.0 % of Full Scale |
| Output Signal | 0~5 Vdc (Option 4–20 mA) |
| Units of Display | SCCM, SLM, % |
| Remote Control | D-SUB 9-PIN (Male) |
| 1) Set-Point | 0~5 Vdc for Full Scale |
| 2) Flow On/Off | Input Signal (TTL) |
| 3) Flow Out Signal | 0~5 Vdc (Option 4–20 mA) |
| 4) Relay Contact Rate | 1 Relay (Max 24 Vdc @ 1A) |
| 5) Communication | RS-232 (9600 Baud, 8-N-1) |

Dimensions: 147.82 × 250 × 88 mm. Rackable — catalog shows units in 1U, 2U, and 4U arrangements.

**LTI-1000 Software** (page 63): PC companion software with:
- **Channel Monitor** — displays up to 8 channels (Ch 1–8), each showing PV, SV, Full-Scale value, SUM, plus Remote / Relay / Safe status LEDs.
- **History View** — live multi-channel time-series graph (colored traces per channel, 0–200 Y-axis).

### FC-050S — High-Pressure Gas or Liquid Flow Controller (page 64)

| Spec | Value |
|---|---|
| Auto Control Differential Pressure | 3 ~ 5 Barg |
| Gas Flow Range | 25 sccm ~ 50 slpm |
| Operating Pressure Range | 15 ~ 300 Barg |
| Required Differential Pressure | 15 Barg |
| Operating Temperature Range | -20 ~ 30 °C |
| Application | Corrosion Resistant |

**Typical integration:**
- With MFC: `Pin (100 bar) → FC050 → P2 (95~97 bar) → MFC → Pout → SYSTEM & REACTOR`
- With manual valve: `Pin (100 bar) → FC050 → FLOW CONTROL VALVE → Pout → SYSTEM & REACTOR`
- CAP PORT on top of FC050, rated 100 bar.

### PR-030 — Protector, Pressure Shock (Pressure Resistor) (page 65)

| Spec | Value |
|---|---|
| Auto Close Differential Pressure | >15 Barg |
| Auto Open Differential Pressure | 0.5 ~ 8 Barg |
| Max Gas Flow Range | 30 slpm |
| Max Operating Pressure | <300 Bar |
| Close Gas Flow Range | <0.3 ~ 5 slpm |
| Required Differential Pressure | 15 Barg |
| Operating Temperature Range | -20 ~ 100 °C |
| Application | Corrosion Resistant |

Behavior: under minimum flow (0.2–5 slpm) the valve CLOSES; at full-range flow it OPENS. Pressure curve asymptotically approaches 200 bar over time under the pressure resistor.

**Typical integration:**
- Standalone: `Pin (200 bar) → PR-030 → SYSTEM & REACTOR`
- With FC-050 + MFC: `Pin (200 bar) → PR-030 → FC050 → P2 (195~197 bar) → MFC → Pout → SYSTEM & REACTOR`

---

## 8. Certifications

> "Line Tech is committed to regular testing by official bodies of standardization to ensure the quality and reliability of its products."

Catalog images show:

**ISO 9001:2015 — Standard Management Certification** (SMC)
- Certified entity: LINE TECH INC., 806, Daedeok-daero, Yuseong-gu, Daejeon, Korea
- ANZSIC: 2839
- Scope: Design, Development and Manufacture of Gas Mass Flow Controller & Meter
- Certificate No: SKQ-11422
- Date of Initial Approval: 14 June 2017
- Re-issued Date: 13 June 2020
- Expiry Date: 13 June 2023
- Issued by: Standard Management System Co., Ltd. (JAS-ANZ / IAF)
- Signed: Myeong Jong Hwa

**EU Declaration Of Conformity (CE)**
- Directive: EU Electromagnetic Compatibility Directive 2014/30/EU
- Product: Mass Flow Controller & Mass Flow Meter
- Covered model designations: MD700C, MD600C, MD500C, MD300C, MD100C, MD30C, MS700VA, MS600VA, MS500VA, MS2500VA, MS3500VA, MS300VA, MS200VA, MS100VA, M2100VA, M1100VA, M1030VA, M3030VA, MS600M, MS500M, MS300M, MS100M, MS30M
- Document No: 2017-LT-CE
- Year of Manufacture: 2017
- Standards: EN 61000-6-4:2007 + A1:2011; EN 61000-6-2:2005
- Authorized Compiler: LINETECH INC., 806, Daedeok-daero, Yuseong-gu, Daejeon, Korea
- Signed: Park J.S, Team Manager
- Date of Issue: May 08, 2017

> Model list extracted from CE scan — some entries may be OCR artifacts; verify the authoritative PDF before listing exact models on the site's certification page.

---

## 9. Calibration Standards

**Standard Flow Measurement System** — all Line Tech products are calibrated with a sonic-nozzle system.

| Description | Specification |
|---|---|
| Sonic nozzle system | Nozzle bank with 14 sonic nozzles |
| Flow range | 0.02 SLPM ~ 3,000 SLPM |
| Flow control unit | Regulator (0 ~ 6 Bar) |
| Pressure control unit | Valve (high pressure) |
| Pressure sensor | 2 Channel (upstream and downstream) |
| System uncertainty | ±0.2 % |

**Features:** Internationally Recognized Performance · Wide Measurement Range · Exceptional Accuracy · Excellent Repeatability · Convenient Mobility · Miniaturization.

---

## 10. Installation Manual (M-Series)

### General

- All models' inlet and outlet connection standards are **V.C.R. male type and S.W.G.**
- Install per given structure and strength conditions.
- Clean pipe interior by blowing high-pressure gas before connecting to MFC / MFM.

### Cautions When Installing

1. Check the direction of the gas flow.
2. When using corrosive or inflammable gas, purge all moisture/leakage with N₂ gas before use.
3. Do not install in the presence of possible mechanical damage or vibration.

### ⚠ Warning

**MFC must be installed and operated with the knowledge that its valve is not applicable to stop the flow completely.**

### MFC / MFM Operation

**Warm-Up Time**
1. After installation, warm up equipment for **45 minutes** to stabilize sensor temperature.
2. Supply gas. Check for any leakage.
3. Operate.

**Setting Up the Zero Point**
- Zero point may change depending on surrounding temperature or installation structure.
- Set the final zero point only after securing the correct environment, warm-up time, and application conditions.

---

## 11. Electrical Interfacing

### Analogue MS-Series — 9-pin (page 70)

| PIN | Function | Color | MFC | MFM |
|---|---|---|---|---|
| 1 | F.G | Green | | |
| 2 | +15 ~ +24 Vdc Power Supply | Red | ● | ● |
| 3 | Not Used | × | | |
| 4 | Signal Ground | White | ⊙ | ⊙ |
| 5 | Power Ground | Blue | ⊙ | ⊙ |
| 6 | Signal Output (Option: 4–20 mA) | Brown | ● | ● |
| 7 | Ground | Black | ⊙ | ⊙ |
| 8 | Signal Input (Option: 4–20 mA) | Yellow | ● | |
| 9 | Valve Full Open | | | |

`⊙ = interconnected within P.C.B.`

**Command and Output Connection**
- MFC: POWER +15 ~ +24 Vdc · SIGNAL OUT 0–5 Vdc · SIGNAL IN 0–5 Vdc
- MFM: POWER +15 ~ +24 Vdc · SIGNAL OUT 0–5 Vdc

### EX-Series — 15-pin (page 71)

| PIN | Function | Color |
|---|---|---|
| J5-1 | 4–20 mA input | White |
| J5-2 | 0~5 V input | Yellow |
| J5-3 | Signal Ground | Green |
| J3-1 | Valve Override | × |
| J3-2 | 5V Refer | × |
| J3-3 | Ground | × |
| J2-1 | 4–20 mA Output | Orange |
| J2-2 | 0~5 Vdc Output | Blue |
| J2-3 | Signal Ground | Brown |
| J1-1 | Power Ground | Black |
| J1-2 | Power (+15 ~ +24 Vdc) | Red |
| J6-1 | RS485 − | × |
| J6-2 | RS485 + | × |

### Analogue M-Series — 15-pin, Voltage Mode (page 72)

| PIN | Function | Color | MFC | MFM |
|---|---|---|---|---|
| 1 | Command Ground | Green | ⊙ | ⊙ |
| 2 | 0~5 Vdc Flow Signal Output | Brown | ● | ● |
| 3 | Not Used | × | | |
| 4 | 4–20 mA Flow Signal Output | Black | | |
| 5 | +15 ~ +24 Vdc Power Supply | Red | ● | ● |
| 6 | Not Used | × | | |
| 7 | 4–20 mA Flow Command Input | Gray | | |
| 8 | 0~5 Vdc Flow Command Input | Yellow | ● | |
| 9 | Power Ground | White | ⊙ | ⊙ |
| 10 | Signal Output Ground | Blue | ⊙ | ⊙ |
| 11 | +5 Vdc Reference Output | × | | |
| 12 | Valve Override | × | | |
| 13 | Not Used | × | | |
| 14 | Shield | × | ◐ | ◐ |
| 15 | Not Used | × | | |

### Analogue M-Series — 15-pin, Current Mode (page 73)

Identical pin layout to voltage mode. Active pins differ:
- MFC: PIN 4 (4–20 mA Flow Signal Output) = ●; PIN 7 (4–20 mA Flow Command Input) = ●.
- MFM: PIN 4 = ●.
- Command and Output Connection: SIGNAL OUT 4–20 mA / SIGNAL IN 4–20 mA.

### Digital MD-Series — 15-pin, Voltage Mode (page 74)

Same pin layout as Analogue M-Series 15-pin, with these additions at PIN 14/15:

| PIN | Function | Color |
|---|---|---|
| 14 | RS 485 − | |
| 15 | RS 485 + | |

**Digital Communication [PIN 14, 15]** — RS-485, Baud 38400 bps, 8-bit Data, 1 stop bit, no Parity.

### Digital MD-Series — 15-pin, Current Mode (page 75)

Identical layout to MD-Series voltage mode, invoked when 4–20 mA signaling is used on PINS 4 and 7. RS-485 still active on PINS 14 / 15.

### LTI-200 — 9-pin, Voltage Mode (page 76)

| PIN | Function | Color |
|---|---|---|
| 1 | Signal Ground | Orange |
| 2 | Power Ground | Blue |
| 3 | N.C | |
| 4 | Signal Ground | Green |
| 5 | +15 Vdc ~ 24 Vdc | Red |
| 6 | Signal Output | Gray |
| 7 | Signal Input | Yellow |
| 8 | RS 485 A + | White |
| 9 | RS 485 B − | Black |

### M3200VA — 9-pin, Voltage Mode (page 76, lower table)

| PIN | Function | Color | MFC | MFM |
|---|---|---|---|---|
| 1 | F.G | Green | | |
| 2 | +15 ~ +24 Vdc Power Supply | Red | ● | ● |
| 3 | Not Used | × | | |
| 4 | Signal Ground | White | ⊙ | ⊙ |
| 5 | Power Ground | Blue | ⊙ | ⊙ |
| 6 | Signal Output (Option: 4–20 mA) | Brown | ● | ● |
| 7 | Ground | Black | ⊙ | ⊙ |
| 8 | Signal Input (Option: 4–20 mA) | Yellow | ● | |
| 9 | Valve Full Open | | | |

### LTI-1000 MFC Connector — DSUB-9 PIN Female (page 77)

**MFC pin connection (0–5 VDC)**

| PIN | Name | Function |
|---|---|---|
| 1 | GND | Ground |
| 2 | GND | Ground |
| 3 | -15 VDC | DC-15 V |
| 4 | GND | Ground |
| 5 | +15 VDC | MFC POWER DC ±15 V (DC+24 V : Option) |
| 6 | Set-point Signal | Output 0–5 VDC (4–20 mA : Option) |
| 7 | Flow Signal | Input 0–5 VDC (4–20 mA : Option) |
| 8 | GND | Ground |
| 9 | GND | Ground |

**I/O pin connection (0–5 VDC)**

| PIN | Name | Function |
|---|---|---|
| 1 | N.C | N.C |
| 2 | TTL Input | MFC Switch (On : 0 Vdc, Off : Open) |
| 3 | GND | GND |
| 4 | Relay N.O | Relay N.O (Max : +24 Vdc @ 1A) |
| 5 | Relay Common | Relay Common (Max : +24 Vdc @ 1A) |
| 6 | GND | GND |
| 7 | Flow out | Flow out (0–5 Vdc) |
| 8 | Flow control | Input (0–5 Vdc) |
| 9 | Relay N.C | Relay N.C (Max : +24 Vdc @ 1A) |

**MFC pin connection (4–20 mA)**

| PIN | Name | Function |
|---|---|---|
| 1 | N.C | N.C |
| 2 | TTL Input | MFC Switch (On : 0 Vdc, Off : Open) |
| 3 | GND | Ground |
| 4 | Relay N.O | Relay N.O (Max : +24 Vdc @ 1A) |
| 5 | Relay Common | Relay Common (Max : +24 Vdc @ 1A) |
| 6 | GND | Ground |
| 7 | Flow Signal | Flow out (4–20 mA) |
| 8 | Flow control | Input Set Point (4–20 mA) |
| 9 | Relay N.C | Relay N.C (Max : +24 Vdc @ 1A) |

---

## 12. Services & Support

**Commitment to Excellence**

- Customer Seminar and Training
- Repairment Service
- Replacement of parts / products
- Recalibration of instruments
- On-site trouble shooting
- On/off-site consultation services

**Warranty:** all Line Tech products and accessories carry a **one-year warranty** from the date of original purchase against defects in materials and workmanship, when used normally per operation manuals.

**Support contact:** linetech@line-tech.co.kr · +82-42-624-0700

**Feedback submission:** linetech@line-tech.co.kr

---

## 13. Appendix — Gas Conversion

### Use of the Conversion Table

```
Actual gas flow rate = Output reading × ( Factor of the gas / Factor of the calibrated gas )
```

**Example 1:** Controller is calibrated for nitrogen. The desired gas is carbon dioxide. Output reading is 75 sccm when CO₂ is flowing, then 75 × 0.74 = **55.50 sccm**.

**Sensor Conversion Factor for a Gas Mixture**

```
Mixture SCF = 100 / ( P1 / SCF1  +  P2 / SCF2  +  …  +  Pn / SCFn )
```
where `Pn` is the volumetric percentage of gas `n`.

**Example 2:** desired mixture is 20 % Helium (He) and 80 % Chlorine (Cl₂) by volume, desired full-scale flow rate of the mixture is 20 slpm.

```
Mixture Factor = 100 / ( 20 / 1.39 + 80 / 0.88 ) = 0.950
Air-equivalent flow = 20 / 0.950 = 21.05 slpm
```

### Gas Sealing — Selection and Gas Factor

> Source: J-836-D-508 Rev.b. Recommended / Allowed / Not-Recommended columns list seal-material compatibility (Viton, Buna, Epdm, Kalrez, Teflon, Metal).
>
> *Note (CO₂):* "/ 5 bar ↑ Kalrez Set / 10 bar ↑ Kalrez 0-ring Teflon seat."

| # | Gas | Formula | GasFactor | Orifice Factor | Density (kg/m³) | Recommended | Allowed | Not Recommended |
|--:|---|---|--:|--:|--:|---|---|---|
| 1 | 1,1,2-Trichloro-1,1,2-Trifluoroet (f113) | C2CL3F3 | 0.231 | 2.520 | 7.920 | Buna | – | Viton/Buna/Kalrez |
| 2 | 1,1-Difluoro-1-Chloroethane | C2H3CLF2 | 0.341 | 1.957 | 4.776 | Buna | – | – |
| 3 | 1,1-Difluoroethane | CH3CHF2 | 0.415 | 1.536 | 2.940 | Kalrez | – | – |
| 4 | 1,1-Difluoroethylene | CH2:CF2 | 0.458 | 1.512 | 2.860 | Viton | – | – |
| 5 | 1,2-Dibromotetrafluoroethane (f114B2) | C2Br2F4 | 0.215 | 2.905 | 10.530 | Teflon | Viton/Buna/Kalrez | Epdm |
| 6 | 1,2-Dichloroethane (Ethylene dichloride) | C2H4CL2 | 0.382 | 1.879 | 4.419 | Buna | – | – |
| 7 | 1,2-Dichlorotetrafluoroethane (f114) | C2CL2F4 | 0.231 | 2.449 | 7.479 | Buna | Epdm | – |
| 8 | 1,3-Butadiene | C4H6 | 0.354 | 1.413 | 2.491 | Viton | Teflon-Kalrez | Buna/Epdm |
| 9 | 1,1,1,2-Tetrafluoroethane (R134A) | C2H2F4 | 0.307 | 1.908 | 4.556 | Epdm | – | – |
| 10 | 1,1,2,2-Tetrafluoroethane (R134) | C2H2F4 | 0.295 | 1.908 | 4.556 | | | |
| 11 | 1,2-Propylene Oxide | C3H6O | 0.348 | 1.440 | 2.594 | | | |
| 12 | 1-Butene | C4H8 | 0.294 | 1.435 | 2.503 | Viton | Kalrez | Buna/Epdm |
| 13 | 1-Pentene, 4-Methyl | C6H12 | 0.200 | 1.733 | 3.758 | | | |
| 14 | 2,2-Dichloro-1,1,1-Trifloroethane | C2HCL2F3 | 0.259 | 2.336 | 6.829 | | | |
| 15 | 2,2-Dimethylpropane | C(CH3)4 | 0.247 | 1.613 | 3.244 | Buna | – | – |
| 16 | 2-Chloro-1,1,1,2-Tetrafluoroethane (R124) | C2HCIF4 | 0.027 | 2.207 | 6.094 | | | |
| 17 | 2-Chlorobutane | C4H9CL | 0.234 | 1.818 | 4.134 | | | |
| 18 | 2-Methyl-1,3-Butadiene | C5H8 | 0.247 | 1.559 | 3.042 | | | |
| 19 | 3-Methyl-1-butene | C5H1O | 0.252 | 1.584 | 3.127 | – | – | – |
| 20 | Acetonitrile | C2H3N | 0.510 | 1.211 | 1.833 | | | |
| 21 | Acetylene (Ethyne) | C2H2 | 0.615 | 0.970 | 1.173 | Viton | Epdm/Buna/Teflon-K | – |
| 22 | Acrolein | C3H4O | 0.362 | 1.415 | 2.054 | | | |
| 23 | Air | Air | 0.998 | 1.018 | 1.293 | Viton | Epdm/Buna/Teflon-K | – |
| 24 | Allene | C3H4 | 0.478 | 1.199 | 1.787 | Buna | – | – |
| 25 | Ammonia | NH3 | 0.786 | 0.781 | 0.771 | Epdm/Teflon | Buna/Teflon | Viton |
| 26 | Argon | Ar | 1.395 | 1.195 | 1.784 | Viton | Epdm/Buna/Teflon-K | – |
| 27 | Arsine | AsH3 | 0.754 | 1.661 | 3.478 | Teflon-Kalrez | – | – |
| 28 | Benzene | C6H6 | 0.294 | 1.670 | 3.488 | | | |
| 29 | Borane | H3B | 0.778 | 0.703 | 0.618 | | | |
| 30 | Boron Trichloride | BCL3 | 0.443 | 2.044 | 5.227 | Teflon-Kalrez* | Viton | – |
| 31 | Boron Trifluoride | BF3 | 0.579 | 1.569 | 3.025 | Teflon-Kalrez | Viton | – |
| 32 | Bromine | Br2 | 0.800 | 2.388 | 7.136 | | | |
| 33 | Bromine Pentafluoride | BrF5 | 0.287 | 2.502 | 7.806 | Teflon | Kalrez | Viton/Epdm/Buna |
| 34 | Bromine Trifluoride | BrF3 | 0.439 | 2.214 | 6.108 | Teflon | Kalrez | Viton/Epdm/Buna |
| 35 | Bromotrifluoroethylene | C2BrF3 | 0.326 | 2.397 | 7.165 | Viton | Buna | – |
| 36 | Bromotrifluoromethane (f13B1) | CBrF3 | 0.412 | 2.303 | 6.615 | Buna | Epdm | Viton/Kalrez |
| 37 | Butane | C4H1O | 0.257 | 1.467 | 2.593 | Viton | Buna/Kalrez | Epdm |
| 38 | Carbon Dioxide | CO2 | 0.740 | 1.255 | 1.977 | Buna | Kalrez | Viton/Epdm |
| 39 | Carbon Disulfide | CS2 | 0.638 | 1.650 | 3.393 | Viton | Kalrez | Buna/Epdm |
| 40 | Carbon Monoxide | CO | 0.995 | 1.000 | 1.250 | | Buna/Epdm/Kalrez | Buna/Epdm |
| 41 | Carbon Tetrachloride | CCL4 | 0.344 | 2.345 | 6.860 | Viton | Kalrez | Buna/Epdm |
| 42 | Carbon Tetrachloride (f14) | CF4 | 0.440 | 1.770 | 3.926 | Viton | Kalrez | – |
| 43 | Carbonyl Fluoride | COF2 | 0.567 | 1.555 | 2.045 | Viton | – | – |
| 44 | Carbonyl Sulfide | COS | 0.680 | 1.463 | 2.680 | Viton | – | – |
| 45 | Chlorine | CL2 | 0.876 | 1.598 | 3.214 | Viton | Kalrez | Buna/Epdm |
| 46 | Chlorine Dioxide | CLO2 | 0.693 | 1.554 | 3.011 | Viton | Kalrez | Buna/Epdm |
| 47 | Chlorine Trifluoride | CLF3 | 0.433 | 1.812 | 4.125 | Kalrez | – | Viton/Buna/Epdm |
| 48 | Chlorodifluoromethane (f22) | CHCLF2 | 0.505 | 1.770 | 3.906 | Epdm | Kalrez | Viton/Buna/Epdm |
| 49 | Chloroform (Trichloromethane) | CHCL3 | 0.442 | 2.066 | 5.340 | Viton | Kalrez | Buna/Epdm |
| 50 | Chloropentafluoroethane (f115) | C2CLF5 | 0.243 | 2.397 | 7.165 | Epdm | – | Buna |
| 51 | Chlorotrifluoroethylene | C2CLF3 | 0.337 | 2.044 | 5.208 | Teflon | – | – |
| 52 | Chlorotrifluoromethane (f13) | CCLF3 | 0.430 | 1.985 | 4.912 | Kalrez | – | – |
| 53 | CIS-2-Butene | C4H8 | 0.320 | 1.435 | 2.503 | Buna | – | – |
| 54 | Cyanogen | (CN)2 | 0.498 | 1.366 | 2.322 | Kalrez | – | – |
| 55 | Cyanogen Chloride | CLCN | 0.618 | 1.480 | 2.730 | Kalrez | – | – |
| 56 | Cyclobutane | C4H8 | 0.387 | 1.413 | 2.491 | Buna | – | – |
| 57 | Cyclopropane | C3H6 | 0.505 | 1.224 | 1.877 | Buna | – | – |
| 58 | Deuterium | D2 | 0.995 | 0.379 | 0.177 | Viton | – | – |
| 59 | Diborane | B2H6 | 0.448 | 1.000 | 1.235 | Kalrez | – | – |
| 60 | Diabromodifluoromethane (f12B2) | CBr2F2 | 0.363 | 2.652 | 8.768 | Viton | – | – |
| 61 | Dichlorodifluoromethane (f12) | CCL2F2 | 0.390 | 2.099 | 5.492 | Buna | – | Viton/Teflon/Kalrez/Epdm |
| 62 | Dichloroethylene | C2H2Cl2 | 0.397 | 1.860 | 4.329 | | | |
| 63 | Dichlorofluoromethane (f21) | CHCL2F | 0.456 | 1.985 | 4.912 | Kalrez | – | Viton/Buna/Epdm |
| 64 | Dichloromethane | CH2Cl2 | 0.522 | 1.741 | 3.793 | | | |
| 65 | Dichlorosilane | SiH2CL2 | 0.442 | 1.897 | 4.506 | Kalrez | – | – |
| 66 | Diethylamine | C4H1N | 0.222 | 1.616 | 3.266 | | | |
| 67 | Diethylsilane | C4H12Si | 0.183 | 1.775 | 3.940 | | | |
| 68 | Difluoromethane (R32) | CF2H2 | 0.627 | 1.360 | 2.411 | | | |
| 69 | Dimethylamine | (CH3)2NH | 0.370 | 1.269 | 2.013 | Kalrez | – | – |
| 70 | Dimethylether | (CH3)2O | 0.392 | 1.281 | 2.055 | Viton | Buna/Epdm/Kalrez | – |
| 71 | Dimethylsulfide | C2H6S | 0.357 | 1.489 | 2.775 | | | |
| 72 | Dimethylzinc | C2H6Zn | 0.234 | 1.846 | 4.262 | | | |
| 73 | Disilane | Si2H6 | 0.332 | 1.493 | 2.779 | Teflon | – | – |
| 74 | Ethane | C2H6 | 0.490 | 1.038 | 1.357 | Viton | Buna/Kalrez | Epdm |
| 75 | Ethanol | C2H6O | 0.394 | 1.282 | 2.057 | | | |
| 76 | Ethyl chloride | C2H5CL | 0.408 | 1.516 | 2.897 | Viton | Buna/Kalrez | Epdm |
| 77 | Ethylacetylene | C4H6 | 0.365 | 1.384 | 2.388 | Buna | – | – |
| 78 | Ethylene | C2H4 | 0.619 | 1.000 | 1.261 | Viton | Buna/Kalrez | Epdm |
| 79 | Ethylene Oxide | C2H4O | 0.589 | 1.254 | 1.965 | Kalrez | – | Viton/Buna/Epdm |
| 80 | Fluorine | F2 | 0.924 | 1.163 | 1.695 | Metal | – | – |
| 81 | Fluoroform (f23) | CHF3 | 0.529 | 1.584 | 3.127 | Kalrez* | – | – |
| 82 | Germanium Tetrachloride | GeCL4 | 0.268 | 2.766 | 9.574 | Kalrez* | | |
| 83 | Germanium Tetrafluoride | GeF4 | 0.356 | 2.303 | 6.636 | | | |
| 84 | Germanium Tetrahydride (Germane) | GeH4 | 0.559 | 1.654 | 3.423 | | | |
| 85 | Halothane (R123B1) | C2HBrCLF3 | 0.257 | 2.654 | 8.814 | | | |
| 86 | Helium | He | 1.386 | 0.378 | 0.178 | Viton | Buna/Epdm/Kalrez | – |
| 87 | Hexafluoroacetone | C3F6O | 0.219 | 2.434 | 7.414 | – | – | – |
| 88 | Hexafluorobenzine | C6F6 | 0.632 | 2.577 | 8.309 | | | |
| 89 | Hexafluorobutadiene | C4F6 | 0.213 | 2.405 | 7.236 | | | |
| 90 | Hexafluoroethane (f116) | C2F6 | 0.255 | 2.219 | 6.139 | Buna | – | – |
| 91 | Hexafluoropropylene (HFP) | C3F6 | 0.249 | 2.312 | 6.663 | Buna | – | – |
| 92 | Hexamethyldisilane (HMDS) | (CH2)6Si2 | 0.139 | 2.404 | 7.208 | Kalrez | – | – |
| 93 | Hexamethyldisiloxane | C6H18OSi2 | 0.110 | 2.408 | 7.251 | | | |
| 94 | Hexane | C6H14 | 0.204 | 1.757 | 3.847 | Viton | Buna/Kalrez | Epdm |
| 95 | Hexylamine | C6H15N | 0.158 | 1.901 | 4.519 | | | |
| 96 | Hydrogen | H2 | 1.008 | 0.269 | 0.090 | Viton | Buna/Epdm/Kalrez | – |
| 97 | Hydrogen Bromide | HBr | 0.987 | 1.695 | 3.645 | Viton | Epdm/Kalrez | Buna |
| 98 | Hydrogen Chloride | HCL | 0.983 | 1.141 | 1.639 | Epdm | Kalrez | Buna |
| 99 | Hydrogen Cyanide | HCN | 0.744 | 0.973 | 1.179 | Kalrez | – | – |
| 100 | Hydrogen Fluoride | HF | 0.998 | 0.845 | 0.893 | Kalrez | – | Viton/Buna/Epdm |
| 101 | Hydrogen Iodide | HI | 0.953 | 2.144 | 5.789 | Kalrez | – | – |
| 102 | Hydrogen Selenide | H2Se | 0.837 | 1.695 | 3.613 | Kalrez | – | – |
| 103 | Hydrogen Sulfide | H2S | 0.850 | 1.108 | 1.539 | Teflon/Kalrez | Epdm | Viton/Buna |
| 104 | Iodine Pentafluoride | IF5 | 0.283 | 2.819 | 9.907 | Teflon | – | Viton/Buna/Epdm |
| 105 | Isobutane | C4H1O | 0.260 | 1.440 | 2.596 | Kalrez* | – | – |
| 106 | Isobutene | C4H8 | 0.289 | 1.435 | 2.503 | Kalrez* | – | – |
| 107 | Isopentane | C5H12 | 0.211 | 1.605 | 3.222 | – | – | – |
| 108 | Krypton | Kr | 1.382 | 1.729 | 3.708 | Viton | – | – |
| 109 | Methacrolein | C4H6O | 0.313 | 1.582 | 3.13 | | | |
| 110 | Methane | CH4 | 0.763 | 0.763 | 0.717 | Buna/Viton | Kalrez | Epdm |
| 111 | Methanol | CH4O | 0.609 | 1.069 | 1.431 | | | |
| 112 | Methyl Bromide | CH3Br | 0.646 | 1.834 | 4.236 | – | – | – |
| 113 | Methyl Chloride | CH3CL | 0.687 | 1.347 | 2.308 | Kalrez | – | Viton/Buna/Epdm |
| 114 | Methyl Fluoride | CH3F | 0.761 | 1.102 | 1.518 | – | – | – |
| 115 | Methyl Mercaptan | CH4S | 0.588 | 1.313 | 2.146 | – | – | – |
| 116 | Methyl Silane | CH6Si | 0.393 | 1.283 | 2.061 | | | |
| 117 | Methyl Trichlorosilane (MTS) | CH3CL3Si | 0.267 | 2.310 | 6.675 | | | |
| 118 | Methyl Vinyl Ether | C3H6O | 0.337 | 1.435 | 2.567 | Kalrez | – | – |
| 119 | Methylacetylene | C3H4 | 0.473 | 1.196 | 1.782 | Kalrez | – | – |
| 120 | Monoethyanolamine | C2H7NO | 0.305 | 1.477 | 2.728 | | | |
| 121 | Monoethylamine (CH3CH2NH2) | C2H7 | 0.395 | 1.269 | 2.013 | Kalrez | – | – |
| 122 | Monomethylamine | CH3NH2 | 0.565 | 1.067 | 1.420 | Kalrez | – | – |
| 123 | Neon | Ne | 1.398 | 0.847 | 0.902 | Viton | Buna/Epdm/Kalrez | – |
| 124 | Nickel Carbonyl | Ni(CO)4 | 0.212 | 2.371 | 7.008 | – | – | – |
| 125 | Nitric Acid | HNO3 | 0.491 | 1.500 | 2.814 | | | |
| 126 | Nitric Oxide | NO | 0.995 | 1.030 | 1.339 | Kalrez* | Viton | – |
| 127 | Nitrogen | N2 | 1.000 | 1.000 | 1.251 | Viton | Buna/Epdm/Kalrez | – |
| 128 | Nitrogen Dioxide | NO2 | 0.758 | 1.713 | 2.052 | Kalrez | – | – |
| 129 | Nitrogen Trifluoride | NF3 | 0.501 | 1.598 | 3.168 | Teflon | Kalrez | – |
| 130 | Nitrogen Trioxide | N2O3 | 0.443 | 1.649 | 3.389 | – | – | – |
| 131 | Nitrosyl Chloride | NOCL | 0.664 | 1.529 | 2.913 | Kalrez | – | – |
| 132 | Nitrous Oxide | N2O | 0.752 | 1.259 | 1.964 | Buna | – | – |
| 133 | Octofluorocyclobutane | C4F8 | 0.169 | 2.672 | 8.933 | – | – | – |
| 134 | Octofluorotetrahydrofuran | C4F8O | 0.165 | 2.777 | 9.644 | | | |
| 135 | Octofluorocyclobutane | C4F8 | 0.169 | 2.672 | 8.933 | | | |
| 136 | Oxygen | O2 | 0.988 | 1.067 | 1.429 | Viton | Epdm/Kalrez | Buna |
| 137 | Oxygen Difluoride | OF2 | 0.672 | 1.388 | 2.402 | – | – | – |
| 138 | Ozone | O3 | 0.738 | 1.310 | 2.138 | Viton | Epdm/Kalrez | Buna |
| 139 | Pentafluoroethane | C2HF5 | 0.287 | 2.070 | 5.360 | | | |
| 140 | Pentane (n-Pentane) | C5H12 | 0.212 | 1.605 | 3.222 | – | – | – |
| 141 | Perchlory Fluoride | CLO3F | 0.448 | 1.905 | 4.571 | | | |
| 142 | Perfluoro-2-Butene | C4F8 | 0.268 | 2.672 | 8.933 | | | |
| 143 | Perfluorobutane | C4F10 | 0.738 | 2.918 | 10.610 | | | |
| 144 | Perfluoromethyl-Vinylether (PMVE) | PMVE | 0.296 | 2.029 | 5.131 | | | |
| 145 | Perfluoropropane | C3F8 | 0.179 | 2.591 | 8.396 | | | |
| 146 | Phosgene | COCL2 | 0.504 | 1.881 | 4.418 | Kalrez | – | – |
| 147 | Phosphine | PH3 | 0.783 | 1.100 | 1.517 | Kalrez | – | – |
| 148 | Phosphorous Oxychloride | POCl3 | 0.327 | 2.340 | 6.847 | | | |
| 149 | Phosphorous Pentafluoride | PF5 | 0.346 | 2.109 | 5.620 | | | |
| 150 | Phosphorous Trifluoride | PF3 | 0.495 | 1.770 | 3.906 | | | |
| 151 | Propadiene | C3H4 | 0.439 | 1.196 | 1.789 | | | |
| 152 | Propane (same as CH3CH2CH3) | C3H8 | 0.343 | 1.274 | 2.008 | Viton | Buna/Kalrez | Epdm |
| 153 | Propylene (Propene)* | C3H6 | 0.401 | 1.234 | 1.875 | Viton* | Kalrez | Buna/Epdm |
| 154 | Rhenium Hexafluoride | ReF6 | 0.230 | 3.279 | 13.410 | – | – | – |
| 155 | Silane | SiH4 | 0.625 | 1.070 | 1.440 | Kalrez | – | – |
| 156 | Silicon Tetrachloride | SiCL4 | 0.310 | 2.462 | 7.579 | Teflon-Kalrez | – | – |
| 157 | Silicon Tetrafluoride | SiF4 | 0.395 | 1.931 | 4.648 | Teflon | – | – |
| 158 | Sulfur Dioxide | SO2 | 0.728 | 1.529 | 2.858 | Epdm | Kalrez/Teflon | Buna/Viton |
| 159 | Sulfur Hexafluoride | SF6 | 0.270 | 2.348 | 6.516 | Epdm/Teflon | Buna | Kalrez |
| 160 | Sulfur Tetrafluoride | SF4 | 0.353 | 1.957 | 4.776 | – | – | – |
| 161 | Sulfur Trioxide | SO3 | 0.535 | 1.691 | 3.575 | | – | |
| 162 | Sulfuryl Fluoride | SO2F2 | 0.423 | 1.931 | 4.648 | – | – | – |
| 163 | Tetrachloromethane | CCL4 | 0.344 | 2.345 | 6.858 | | | |
| 164 | Tetraethylsilane | C8H20Si | 0.111 | 2.270 | 6.445 | | | |
| 165 | Tetrafluoroethylene (TFE) | C2F4 | 0.361 | 1.905 | 4.526 | Buna | – | Kalrez |
| 166 | Tetrafluorohydrazine | N2F4 | 0.367 | 1.926 | 4.624 | – | – | – |
| 167 | Tetramethylsilane | C4H12Si | 0.183 | 1.775 | 3.94 | | | |
| 168 | Titanium Tetrachloride | TiCl4 | 0.296 | 2.602 | 8.47 | | | |
| 169 | Toluene (C6H5) | CH3 | 0.234 | 1.814 | 4.115 | | | |
| 170 | Trans-2-Butene | C4H8 | 0.291 | 1.435 | 2.503 | – | – | – |
| 171 | Trichlorofluoromethane (f11) | CCL3F | 0.374 | 2.244 | 6.281 | Teflon | – | Buna/Epdm/Kalrez |
| 172 | Trichlorosilane | SiHCL3 | 0.329 | 2.201 | 6.038 | Viton/Kalrez | – | – |
| 173 | Trifluoroethane | C2F3F3 | 0.333 | 1.732 | 3.753 | | | |
| 174 | Trifluoropropene | C3H3F3 | 0.286 | 1.852 | 4.289 | | | |
| 175 | Trimethyl Aluminum | C3H9Al | 0.259 | 1.604 | 3.219 | | | |
| 176 | Trimethylamine | (CH3)3N | 0.316 | 1.467 | 2.639 | Kalrez | – | – |
| 177 | Trimethylgallium | C3H9Ga | 0.237 | 2.025 | 5.123 | | | |
| 178 | Trimethyloxyborane (TMB) | B(OCH3)3 | 0.300 | 1.929 | 4.638 | – | – | – |
| 179 | Trimethylsilane | C3H10Si | 0.235 | 1.627 | 3.313 | | | |
| 180 | Tungsten Hexafluoride | WF6 | 0.227 | 3.264 | 13.280 | Teflon | – | – |
| 181 | Uranium Hexafluoride | UF6 | 0.220 | 3.548 | 15.700 | Teflon | – | – |
| 182 | Vinyl Bromide | C2H3Br | 0.524 | 1.985 | 4.772 | – | – | – |
| 183 | Vinyl Chloride | C2H3CL | 0.542 | 1.492 | 2.788 | Viton | Kalrez | Buna/Epdm |
| 184 | Vinyl Fluoride | C2H3F | 0.576 | 1.281 | 2.046 | Kalrez | – | – |
| 185 | Water Vapor | H2O | 0.861 | 0.802 | 0.804 | – | – | – |
| 186 | Xennon | Xe | 1.383 | 2.180 | 5.851 | Viton | Buna/Epdm/Kalrez | – |
| 187 | "gas mixture in volume" | mixgas | 0.742 | 1.216 | 1.851 | | | |

---

*End of document. For site implementation notes, open questions, and migration decisions, see `docs/current-site-audit.md` and `docs/content-inventory-en.md`.*
