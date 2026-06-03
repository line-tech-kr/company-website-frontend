import type { Product } from "@/lib/types/product";

export const productFixture: Product = {
  model: "TEST-1000",
  slug: { current: "test-1000" },
  series: "analogue",
  function: "MFC",
  productLabel: {
    ko: "테스트 컨트롤러",
    en: "Test Controller",
    zh: "测试控制器",
  },
  tags: [],
  features: [{ ko: "특징 1", en: "Feature 1", zh: "特征 1", _key: "f1" }],
  connections: [{ type: "1/4 inch VCR", length: "60mm", _key: "c1" }],
  massFlowSpecs: {
    flowRange: { display: "0–1000 sccm", min: 0, max: 1000, unit: "sccm" },
    accuracy: { display: "±1% F.S.", value: 1, unit: "% F.S." },
    repeatability: { display: "±0.2% F.S.", value: 0.2, unit: "% F.S." },
    ioSignal: { display: "0–5 VDC", outputs: ["0-5VDC"] },
    supplyPower: { display: "±15 VDC", voltages: [15, -15] },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1 × 10⁻⁹ atm·cc/sec He",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "2–100% F.S.", min: 2, max: 100, unit: "% F.S." },
  },
  manuals: [],
  drawings: [],
  certifications: [],
};

export function makeProduct(overrides: Partial<Product> = {}): Product {
  return { ...productFixture, ...overrides };
}

export const rouProductFixture: Product = {
  model: "ROU-TEST",
  slug: { current: "rou-test" },
  series: "specialized",
  function: "ROU",
  productLabel: {
    ko: "테스트 리드아웃",
    en: "Test Read-Out Unit",
    zh: "测试读数单元",
  },
  tags: [],
  features: [{ ko: "특징 1", en: "Feature 1", zh: "特征 1", _key: "f1" }],
  connections: [],
  instrumentSpecs: [
    {
      label: "Input Power",
      value: "220VAC (50–60 Hz)",
      slot: "power",
    },
    { label: "Output Signal", value: "0–5 Vdc or 4–20 mA" },
    {
      label: "Display Window",
      value: "256×64 OLED",
      slot: "display",
    },
    {
      label: "Communication",
      value: "RS-232, RS-485",
      slot: "communication",
    },
    {
      label: "Remote Control",
      value: "D-SUB 9-pin",
      slot: "connector",
    },
  ],
  manuals: [],
  drawings: [],
  certifications: [],
};
