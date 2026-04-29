import { readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  Accuracy,
  Connection,
  ControlRange,
  DigitalCommunication,
  FlowRange,
  IoSignal,
  LeakRate,
  LocalizedString,
  MassFlowSpecs,
  MaxPressure,
  Product,
  Repeatability,
  ResponseTime,
  SupplyPower,
  TempRange,
} from "../src/lib/types/product";

const __dirname = dirname(fileURLToPath(import.meta.url));

const CATALOG_PATH =
  process.env.CATALOG_PATH ??
  resolve(homedir(), "Dev/linetech/company-docs-private/docs/product-catalog-2020-en.md");
const OUTPUT_PATH = resolve(__dirname, "../src/lib/fixtures/products.json");

const SKIP_MODELS = new Set(["LTI-200", "LTI-1000", "FC-050S", "PR-030"]);

// Translation table.
// - Korean follows modern Korean technical writing: spaces between native words
//   ("질량 유량 제어기"), abbreviation in parentheses.
// - Chinese uses simplified Chinese mainland conventions.
// - Industry abbreviations (MFC / MFM / MEMS / Ex / IP) are kept as-is in all
//   locales — the legacy Korean site does the same.
// - Feature phrases are written in product-marketing tone (concise, positive),
//   not direct translation, since the English source itself reads as marketing.
const I18N: Record<string, LocalizedString> = {
  // ─── Product labels ───
  "Mass Flow Controller": {
    en: "Mass Flow Controller",
    ko: "질량 유량 제어기 (MFC)",
    zh: "质量流量控制器 (MFC)",
  },
  "Mass Flow Meter": {
    en: "Mass Flow Meter",
    ko: "질량 유량 측정기 (MFM)",
    zh: "质量流量计 (MFM)",
  },
  "Digital Mass Flow Controller": {
    en: "Digital Mass Flow Controller",
    ko: "디지털 질량 유량 제어기 (Digital MFC)",
    zh: "数字式质量流量控制器 (Digital MFC)",
  },
  "Digital Mass Flow Meter": {
    en: "Digital Mass Flow Meter",
    ko: "디지털 질량 유량 측정기 (Digital MFM)",
    zh: "数字式质量流量计 (Digital MFM)",
  },
  "Mass Flow Controller with Display": {
    en: "Mass Flow Controller with Display",
    ko: "디스플레이 일체형 질량 유량 제어기 (MFC)",
    zh: "带显示屏质量流量控制器 (MFC)",
  },
  "Mass Flow Meter with Display": {
    en: "Mass Flow Meter with Display",
    ko: "디스플레이 일체형 질량 유량 측정기 (MFM)",
    zh: "带显示屏质量流量计 (MFM)",
  },
  "MEMS-Tech Mass Flow Controller": {
    en: "MEMS-Tech Mass Flow Controller",
    ko: "MEMS 기반 질량 유량 제어기 (MFC)",
    zh: "MEMS 技术质量流量控制器 (MFC)",
  },
  "MEMS-Tech Mass Flow Meter": {
    en: "MEMS-Tech Mass Flow Meter",
    ko: "MEMS 기반 질량 유량 측정기 (MFM)",
    zh: "MEMS 技术质量流量计 (MFM)",
  },
  "Ex-Proof Mass Flow Controller": {
    en: "Ex-Proof Mass Flow Controller",
    ko: "방폭형 질량 유량 제어기 (MFC)",
    zh: "防爆型质量流量控制器 (MFC)",
  },
  "Ex-Proof Mass Flow Meter": {
    en: "Ex-Proof Mass Flow Meter",
    ko: "방폭형 질량 유량 측정기 (MFM)",
    zh: "防爆型质量流量计 (MFM)",
  },

  // ─── Shared features (M / MS / MD) ───
  "Accurate at Low Flow": {
    en: "Accurate at Low Flow",
    ko: "저유량에서도 정밀한 측정",
    zh: "低流量下精准测量",
  },
  "Fast Response": {
    en: "Fast Response",
    ko: "빠른 응답 속도",
    zh: "快速响应",
  },
  "Wide Pressure Range Compatibility": {
    en: "Wide Pressure Range Compatibility",
    ko: "넓은 압력 범위 대응",
    zh: "宽压力范围适用",
  },
  "Excellent Linearity": {
    en: "Excellent Linearity",
    ko: "우수한 선형성",
    zh: "优异的线性度",
  },
  "Long-Term Stability": {
    en: "Long-Term Stability",
    ko: "장기 안정성",
    zh: "长期稳定性",
  },
  "High Corrosion Resistance": {
    en: "High Corrosion Resistance",
    ko: "강한 내부식성",
    zh: "高耐腐蚀性",
  },
  "Highly Stable Removable Sensor": {
    en: "Highly Stable Removable Sensor",
    ko: "고안정 분리형 센서",
    zh: "高稳定可拆卸式传感器",
  },
  "Compact Connection": {
    en: "Compact Connection",
    ko: "컴팩트한 연결부",
    zh: "紧凑型连接结构",
  },

  // ─── LD-specific (display series) ───
  "Accurate Real Time Flow Measurements": {
    en: "Accurate Real Time Flow Measurements",
    ko: "실시간 정밀 유량 측정",
    zh: "实时精准流量测量",
  },
  "Real Time Setting Changes": {
    en: "Real Time Setting Changes",
    ko: "실시간 설정 변경 지원",
    zh: "支持实时参数调整",
  },
  "Built-in 7-Segment Display": {
    en: "Built-in 7-Segment Display",
    ko: "7-세그먼트 디스플레이 내장",
    zh: "内置七段数码显示屏",
  },

  // ─── LM-specific (MEMS series) ───
  "MEMS-Tech Sensor": {
    en: "MEMS-Tech Sensor",
    ko: "MEMS 기반 센서",
    zh: "MEMS 传感器",
  },
  "Cost-Efficient Design": {
    en: "Cost-Efficient Design",
    ko: "경제적인 설계",
    zh: "高性价比设计",
  },
  "Improved Response Time": {
    en: "Improved Response Time",
    ko: "향상된 응답 속도",
    zh: "更快的响应速度",
  },

  // ─── EX-specific (explosion-proof series) ───
  "Explosion-Proof for Hazardous Environments": {
    en: "Explosion-Proof for Hazardous Environments",
    ko: "위험 지역용 방폭 설계",
    zh: "适用于危险场所的防爆设计",
  },
  "Ex ec IIC T4 Gc Certified": {
    en: "Ex ec IIC T4 Gc Certified",
    ko: "Ex ec IIC T4 Gc 방폭 인증",
    zh: "Ex ec IIC T4 Gc 防爆认证",
  },
  "IP 65 Rated": {
    en: "IP 65 Rated",
    ko: "IP 65 보호 등급",
    zh: "IP 65 防护等级",
  },
  "Robust Industrial Construction": {
    en: "Robust Industrial Construction",
    ko: "견고한 산업용 구조",
    zh: "坚固的工业级结构",
  },
};

// Track which keys were requested but missing — surfaced at end of run.
const missingTranslations = new Set<string>();

function localize(en: string): LocalizedString {
  const hit = I18N[en];
  if (!hit) {
    missingTranslations.add(en);
    return { en, ko: en, zh: en };
  }
  return hit;
}

// Per-product label overrides — used when the catalog heading is a known
// inconsistency. Documented inline so it's obvious why a value diverges.
const PRODUCT_LABEL_OVERRIDES: Record<string, string> = {
  // LD030M heading in catalog says "MEMS-Tech Mass Flow Meter" but LD is the
  // display series (catalog section opener: "LD Series — built-in 7-segment
  // display"). Treat as Mass Flow Meter with Display, matching its sibling
  // LD030C and the section narrative.
  LD030M: "Mass Flow Meter with Display",
};

const SHARED_FEATURES_M_MS_MD = [
  "Accurate at Low Flow",
  "Fast Response",
  "Wide Pressure Range Compatibility",
  "Excellent Linearity",
  "Long-Term Stability",
  "High Corrosion Resistance",
  "Highly Stable Removable Sensor",
  "Compact Connection",
];

const FEATURES_LD = [
  "Accurate Real Time Flow Measurements",
  "Real Time Setting Changes",
  "Built-in 7-Segment Display",
  "Fast Response",
  "Wide Pressure Range Compatibility",
  "Excellent Linearity",
  "Long-Term Stability",
  "High Corrosion Resistance",
  "Compact Connection",
];

const FEATURES_LM = [
  "MEMS-Tech Sensor",
  "Cost-Efficient Design",
  "Improved Response Time",
  "Excellent Linearity",
  "Long-Term Stability",
  "High Corrosion Resistance",
  "Compact Connection",
];

const FEATURES_EX = [
  "Explosion-Proof for Hazardous Environments",
  "Ex ec IIC T4 Gc Certified",
  "IP 65 Rated",
  "Robust Industrial Construction",
  "Wide Pressure Range Compatibility",
  "Excellent Linearity",
  "Long-Term Stability",
  "High Corrosion Resistance",
];

function determineSeries(model: string): Product["series"] {
  if (/^MD/.test(model)) return "digital";
  if (/^M[S]?\d/.test(model)) return "analogue";
  if (/^(LD|LM|EX)/.test(model)) return "specialized";
  throw new Error(`Cannot determine series for model "${model}"`);
}

function determineFunction(headingTitle: string): Product["function"] {
  if (/Controller/i.test(headingTitle)) return "MFC";
  if (/Meter/i.test(headingTitle)) return "MFM";
  throw new Error(`Cannot determine function from heading: "${headingTitle}"`);
}

function featuresFor(model: string): string[] {
  if (/^LD/.test(model)) return FEATURES_LD;
  if (/^LM/.test(model)) return FEATURES_LM;
  if (/^EX/.test(model)) return FEATURES_EX;
  return SHARED_FEATURES_M_MS_MD;
}

// --- Parsing helpers ---

function normalizeQuotes(s: string): string {
  return s.replace(/[″”]/g, '"').replace(/[′’]/g, "'");
}

function parseFlowRange(raw: string): FlowRange {
  // examples: "0.01 slpm ~ 30 slpm", "30 slpm ~ 100 slpm"
  const m = raw.match(/([\d.]+)\s*(?:slpm)?\s*~\s*([\d.]+)\s*slpm?/i);
  if (!m) throw new Error(`Cannot parse flow range: "${raw}"`);
  const min = parseFloat(m[1]);
  const max = parseFloat(m[2]);
  return {
    display: `${min}–${max} slpm`,
    min,
    max,
    unit: "slpm",
    referenceGas: "N2",
  };
}

function parseAccuracy(raw: string): Accuracy {
  // examples: "±1 % of FS", "±0.25 %", "±2 %"
  const m = raw.match(/±\s*([\d.]+)/);
  if (!m) throw new Error(`Cannot parse accuracy: "${raw}"`);
  const value = parseFloat(m[1]);
  return { display: `±${value}% of FS`, value, unit: "%FS" };
}

function parseRepeatability(raw: string): Repeatability {
  const m = raw.match(/±\s*([\d.]+)/);
  if (!m) throw new Error(`Cannot parse repeatability: "${raw}"`);
  const value = parseFloat(m[1]);
  return { display: `±${value}% of FS`, value, unit: "%FS" };
}

function parseResponseTime(raw: string): ResponseTime {
  // examples: "<2 sec", "<1", "<2 seconds"
  const m = raw.match(/<\s*([\d.]+)/);
  if (!m) throw new Error(`Cannot parse response time: "${raw}"`);
  const value = parseFloat(m[1]);
  const unit = "s";
  const display = `<${value} second${value === 1 ? "" : "s"}`;
  return { display, value, unit, comparator: "lt" };
}

function parseIoSignal(raw: string): IoSignal {
  // examples: "0~5 or 4~20", "0~5 Vdc", "0~5 Vdc or 4~20 mA"
  const outputs: string[] = [];
  let display = "";
  const has05 = /0\s*~\s*5\s*(Vdc)?/i.test(raw);
  const has420 = /4\s*~\s*20\s*(mA)?/i.test(raw);
  if (has05) outputs.push("0-5Vdc");
  if (has420) outputs.push("4-20mA");
  if (has05 && has420) display = "0–5 Vdc or 4–20 mA";
  else if (has05) display = "0–5 Vdc";
  else if (has420) display = "4–20 mA";
  else throw new Error(`Cannot parse IO signal: "${raw}"`);
  return { display, outputs };
}

function parseSupplyPower(raw: string): SupplyPower {
  // examples: "+15 ~ 24", "+15 ~ +24 Vdc", "+15 or +24 Vdc, 350 mA"
  const voltageMatches = raw.match(/[+]?(\d+)\s*[~or]+\s*[+]?(\d+)/);
  if (!voltageMatches) throw new Error(`Cannot parse supply power: "${raw}"`);
  const v1 = parseInt(voltageMatches[1], 10);
  const v2 = parseInt(voltageMatches[2], 10);
  const currentMA = 350; // catalog standard for all M/MS/MD/LD/LM/EX
  return {
    display: `+${v1} or +${v2} Vdc, ${currentMA} mA`,
    voltages: [v1, v2],
    currentMA,
  };
}

function parseMaxPressure(raw: string): MaxPressure | undefined {
  if (/inquiry/i.test(raw)) return undefined;
  const m = raw.match(/<\s*([\d.]+)\s*bar/i);
  if (!m) throw new Error(`Cannot parse max pressure: "${raw}"`);
  const value = parseFloat(m[1]);
  return {
    display: `<${value} bar`,
    value,
    unit: "bar",
    comparator: "lt",
  };
}

function parseTempRange(raw: string): TempRange {
  // example: "0 ~ 50", "0–50 °C"
  const m = raw.match(/(-?\d+)\s*[~–-]\s*(-?\d+)/);
  if (!m) throw new Error(`Cannot parse temp range: "${raw}"`);
  const min = parseInt(m[1], 10);
  const max = parseInt(m[2], 10);
  return { display: `${min}–${max} °C`, min, max, unit: "°C" };
}

const STANDARD_LEAK_RATE: LeakRate = {
  display: "1×10⁻⁹ atm·cc/sec",
  value: 1e-9,
  unit: "atm·cc/sec",
};

const STANDARD_CONTROL_RANGE: ControlRange = {
  display: "3–100%",
  min: 3,
  max: 100,
  unit: "%",
};

const STANDARD_DIGITAL_COMM: DigitalCommunication = {
  protocol: "RS-485",
  baudRate: 38400,
  dataBits: 8,
  stopBits: 1,
  parity: "None",
};

// --- Markdown table parser ---

type TableRow = Record<string, string>;

function parseMarkdownTable(lines: string[], startIdx: number): { rows: TableRow[]; endIdx: number } {
  // first line: header, second: separator (---), then rows
  const headerLine = lines[startIdx];
  const sepLine = lines[startIdx + 1];
  if (!sepLine || !/^\s*\|[\s\-|]+\|\s*$/.test(sepLine)) {
    throw new Error(`Expected table separator at line ${startIdx + 2}`);
  }
  const headers = splitTableRow(headerLine);
  const rows: TableRow[] = [];
  let i = startIdx + 2;
  while (i < lines.length && /^\s*\|/.test(lines[i])) {
    const cells = splitTableRow(lines[i]);
    const row: TableRow = {};
    headers.forEach((h, idx) => (row[h] = cells[idx] ?? ""));
    rows.push(row);
    i++;
  }
  return { rows, endIdx: i };
}

function splitTableRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

// --- Main parser ---

type AtAGlanceRow = {
  flowRange: string;
  accuracy: string;
  repeatability: string;
  response?: string;
  ioSignal: string;
  supply: string;
  maxPressure: string;
  maxTemp: string;
};

function parseAtAGlance(catalog: string): Map<string, AtAGlanceRow> {
  const map = new Map<string, AtAGlanceRow>();
  const lines = catalog.split("\n");
  // find each "At-a-Glance" subsection table
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^####\s+(Analogue|Digital|Specialized)\s+Mass Flow (Controller|Meter) Specifications/.test(line)) {
      // find next table start
      let j = i + 1;
      while (j < lines.length && !/^\s*\|/.test(lines[j])) j++;
      if (j >= lines.length) continue;
      const { rows, endIdx } = parseMarkdownTable(lines, j);
      for (const row of rows) {
        const model = row["Model"];
        if (!model) continue;
        map.set(model, {
          flowRange: row["Full Scale N2 (slpm)"] ?? "",
          accuracy: row["Accuracy (%FS)"] ?? "",
          repeatability: row["Repeatability (%)"] ?? "",
          response: row["Response (sec)"],
          ioSignal: row["In/Out Signal"] ?? "",
          supply: row["Supply (Vdc)"] ?? "",
          maxPressure: row["Max Pressure"] ?? "",
          maxTemp: row["Max Temp (°C)"] ?? "",
        });
      }
      i = endIdx;
    }
  }
  return map;
}

type ProductSection = {
  model: string;
  headingTitle: string;
  page: number;
  body: string[];
};

function extractProductSections(catalog: string): ProductSection[] {
  const lines = catalog.split("\n");
  const sections: ProductSection[] = [];
  let current: ProductSection | null = null;
  let inMassFlowSection = false;

  for (const line of lines) {
    // top-level section markers we care about
    if (/^##\s+\d+\.\s/.test(line)) {
      // entering a new ## section
      if (/##\s+(4|5|6)\./.test(line)) inMassFlowSection = true;
      else inMassFlowSection = false;
      if (current) sections.push(current);
      current = null;
      continue;
    }

    if (!inMassFlowSection) continue;

    const headingMatch = line.match(/^###\s+([\w-]+)\s+—\s+(.+?)\s+\(page\s+(\d+)\)/);
    if (headingMatch) {
      if (current) sections.push(current);
      const model = headingMatch[1];
      if (SKIP_MODELS.has(model)) {
        current = null;
      } else {
        current = {
          model,
          headingTitle: headingMatch[2],
          page: parseInt(headingMatch[3], 10),
          body: [],
        };
      }
      continue;
    }

    if (current) current.body.push(line);
  }
  if (current) sections.push(current);
  return sections;
}

function parseConnectionTable(body: string[]): Connection[] {
  for (let i = 0; i < body.length; i++) {
    if (/^\s*\|\s*Connection\s*\|/.test(body[i])) {
      const { rows } = parseMarkdownTable(body, i);
      return rows.map((row) => {
        const type = normalizeQuotes(row["Connection"] ?? "").trim();
        const lengthRaw = row["A (mm)"] ?? "";
        return { type, length: `${lengthRaw} mm` };
      });
    }
  }
  return [];
}

type MiniSpecTable = {
  range?: string;
  responseTime?: string;
  accuracy?: string;
  repeatability?: string;
  ioSignal?: string;
  supply?: string;
  maxPressure?: string;
  maxTemp?: string;
  leakRate?: string;
  controlRange?: string;
};

function parseMiniSpecTable(body: string[]): MiniSpecTable {
  // first table whose header is "Spec | Value"
  for (let i = 0; i < body.length; i++) {
    if (/^\s*\|\s*Spec\s*\|\s*Value\s*\|/.test(body[i])) {
      const { rows } = parseMarkdownTable(body, i);
      const map: Record<string, string> = {};
      for (const row of rows) {
        const k = row["Spec"];
        const v = row["Value"];
        if (k) map[k] = v ?? "";
      }
      return {
        range: map["Range (N2)"],
        responseTime: map["Response Time"],
        accuracy: map["Accuracy"],
        repeatability: map["Repeatability"],
        ioSignal: map["In/Out Signal"],
        supply: map["Supply"],
        maxPressure: map["Max Operating Pressure"],
        maxTemp: map["Max Operating Temp"],
        leakRate: map["Leak Rate"],
        controlRange: map["Control Range"],
      };
    }
  }
  return {};
}

// --- Compose Product ---

function buildMassFlowSpecs(
  model: string,
  function_: Product["function"],
  series: Product["series"],
  mini: MiniSpecTable,
  glance: AtAGlanceRow | undefined,
): MassFlowSpecs {
  // Range: prefer mini-section > at-a-glance
  const rangeRaw = mini.range ?? glance?.flowRange;
  if (!rangeRaw) throw new Error(`No flow range for ${model}`);
  const flowRange = parseFlowRange(rangeRaw);

  // Accuracy: same priority
  const accuracyRaw = mini.accuracy ?? glance?.accuracy;
  if (!accuracyRaw) throw new Error(`No accuracy for ${model}`);
  const accuracy = parseAccuracy(accuracyRaw);

  // Repeatability: prefer mini > glance > default ±0.25
  const repeatabilityRaw = mini.repeatability ?? glance?.repeatability ?? "±0.25 %";
  const repeatability = parseRepeatability(repeatabilityRaw);

  // Response time: only for MFC
  let responseTime: ResponseTime | undefined;
  if (function_ === "MFC") {
    const responseRaw = mini.responseTime ?? glance?.response ?? defaultResponse(series);
    responseTime = parseResponseTime(responseRaw);
  }

  // IO signal
  const ioRaw = mini.ioSignal ?? glance?.ioSignal ?? "0~5 Vdc or 4~20 mA";
  const ioSignal = parseIoSignal(ioRaw);

  // Supply
  const supplyRaw = mini.supply ?? glance?.supply ?? "+15 ~ +24";
  const supplyPower = parseSupplyPower(supplyRaw);

  // Max pressure
  const maxPressureRaw = mini.maxPressure ?? glance?.maxPressure;
  const maxPressure = maxPressureRaw ? parseMaxPressure(maxPressureRaw) : undefined;

  // Temp range
  const tempRaw = mini.maxTemp ?? glance?.maxTemp ?? "0 ~ 50";
  const tempRange = parseTempRange(tempRaw);

  const specs: MassFlowSpecs = {
    flowRange,
    accuracy,
    repeatability,
    ioSignal,
    supplyPower,
    tempRange,
    leakRate: STANDARD_LEAK_RATE,
    controlRange: STANDARD_CONTROL_RANGE,
  };
  if (responseTime) specs.responseTime = responseTime;
  if (maxPressure) specs.maxPressure = maxPressure;
  return specs;
}

function defaultResponse(series: Product["series"]): string {
  if (series === "digital") return "<1 sec";
  return "<2 sec";
}

function buildProduct(section: ProductSection, glance: Map<string, AtAGlanceRow>): Product {
  const series = determineSeries(section.model);
  const function_ = determineFunction(section.headingTitle);
  const mini = parseMiniSpecTable(section.body);
  const connections = parseConnectionTable(section.body);
  const glanceRow = glance.get(section.model);
  const massFlowSpecs = buildMassFlowSpecs(section.model, function_, series, mini, glanceRow);

  const labelKey = PRODUCT_LABEL_OVERRIDES[section.model] ?? section.headingTitle;

  const product: Product = {
    model: section.model,
    slug: { current: section.model.toLowerCase() },
    series,
    function: function_,
    productLabel: localize(labelKey),
    features: featuresFor(section.model).map(localize),
    connections,
    massFlowSpecs,
  };
  if (series === "digital") {
    product.digitalCommunication = STANDARD_DIGITAL_COMM;
  }
  return product;
}

// --- Validation ---

function validate(p: Product): void {
  if (!p.model) throw new Error("Missing model");
  if (!p.slug.current) throw new Error(`${p.model}: missing slug`);
  if (!["analogue", "digital", "specialized"].includes(p.series))
    throw new Error(`${p.model}: bad series "${p.series}"`);
  if (!["MFC", "MFM"].includes(p.function))
    throw new Error(`${p.model}: bad function "${p.function}"`);
  if (p.connections.length === 0)
    throw new Error(`${p.model}: no connections parsed`);
  const s = p.massFlowSpecs;
  if (!s.flowRange || !(s.flowRange.max > s.flowRange.min))
    throw new Error(`${p.model}: bad flowRange`);
  if (s.accuracy.value <= 0)
    throw new Error(`${p.model}: bad accuracy ${s.accuracy.value}`);
  if (p.function === "MFC" && !s.responseTime)
    throw new Error(`${p.model}: MFC missing responseTime`);
  if (p.series === "digital" && !p.digitalCommunication)
    throw new Error(`${p.model}: digital missing digitalCommunication`);

  // Localization sanity: every translated field must have ko/zh distinct from en.
  // (English fallback would mean we forgot to translate a string.)
  assertTranslated(p.model, "productLabel", p.productLabel);
  p.features.forEach((f, i) =>
    assertTranslated(p.model, `features[${i}]`, f),
  );

  // Connection lengths should look like "<number> mm"
  for (const c of p.connections) {
    if (!/^[\d.]+\s+mm$/.test(c.length))
      throw new Error(`${p.model}: malformed connection length "${c.length}"`);
    if (!c.type) throw new Error(`${p.model}: empty connection type`);
  }
}

function assertTranslated(
  model: string,
  field: string,
  loc: LocalizedString,
): void {
  if (!loc.en || !loc.ko || !loc.zh)
    throw new Error(`${model}: ${field} missing locale`);
  if (loc.ko === loc.en && loc.zh === loc.en)
    throw new Error(
      `${model}: ${field} not translated — value "${loc.en}" missing from I18N table`,
    );
}

// --- Main ---

function main() {
  const catalog = readFileSync(CATALOG_PATH, "utf-8");
  const glance = parseAtAGlance(catalog);
  const sections = extractProductSections(catalog);

  console.log(`Found ${sections.length} product sections.`);

  const products: Product[] = [];
  for (const section of sections) {
    try {
      const product = buildProduct(section, glance);
      validate(product);
      products.push(product);
      console.log(`  ✓ ${product.model.padEnd(10)} ${product.series}/${product.function}`);
    } catch (err) {
      console.error(`  ✗ ${section.model}: ${(err as Error).message}`);
      throw err;
    }
  }

  // Slug uniqueness
  const slugCounts = new Map<string, number>();
  for (const p of products) {
    slugCounts.set(p.slug.current, (slugCounts.get(p.slug.current) ?? 0) + 1);
  }
  const dupes = [...slugCounts.entries()].filter(([, n]) => n > 1);
  if (dupes.length > 0) {
    throw new Error(`Duplicate slugs: ${dupes.map(([s]) => s).join(", ")}`);
  }

  // Translation coverage — strings asked of localize() that weren't in I18N.
  if (missingTranslations.size > 0) {
    console.error(
      `\n✗ Missing translations for ${missingTranslations.size} string(s):`,
    );
    for (const s of missingTranslations) console.error(`    "${s}"`);
    throw new Error("Add the strings above to the I18N table and re-run.");
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2) + "\n");
  console.log(`\nWrote ${products.length} products → ${OUTPUT_PATH}`);
}

main();
