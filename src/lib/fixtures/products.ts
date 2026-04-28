import type { Product } from "../types/product";

const features = (...items: string[]) =>
  items.map((en) => ({ ko: en, en, zh: en }));

const label = (en: string) => ({ ko: en, en, zh: en });

export const M3030VA: Product = {
  model: "M3030VA",
  slug: { current: "m3030va" },
  series: "analogue",
  function: "MFC",
  productLabel: label("Mass Flow Controller"),
  features: features(
    "Accurate at Low Flow",
    "Fast Response",
    "Wide Pressure Range Compatibility",
    "Excellent Linearity",
    "Long-Term Stability",
    "High Corrosion Resistance",
    "Highly Stable Removable Sensor",
    "Compact Connection",
  ),
  connections: [
    { type: '1/8" SW', length: "126.7 mm" },
    { type: '1/4" SW', length: "128 mm" },
    { type: '3/8" SW', length: "134.3 mm" },
    { type: '1/4" VCR', length: "127.8 mm" },
  ],
  massFlowSpecs: {
    flowRange: {
      display: "0.01–30 slpm",
      min: 0.01,
      max: 30,
      unit: "slpm",
      referenceGas: "N2",
    },
    responseTime: {
      display: "<2 seconds",
      value: 2,
      unit: "s",
      comparator: "lt",
    },
    accuracy: { display: "±1% of FS", value: 1, unit: "%FS" },
    repeatability: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    ioSignal: {
      display: "0–5 Vdc or 4–20 mA",
      outputs: ["0-5Vdc", "4-20mA"],
    },
    supplyPower: {
      display: "+15 or +24 Vdc, 350 mA",
      voltages: [15, 24],
      currentMA: 350,
    },
    maxPressure: {
      display: "<90 bar",
      value: 90,
      unit: "bar",
      comparator: "lt",
    },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1×10⁻⁹ atm·cc/sec",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "3–100%", min: 3, max: 100, unit: "%" },
  },
};

export const MD30C: Product = {
  model: "MD30C",
  slug: { current: "md30c" },
  series: "digital",
  function: "MFC",
  productLabel: label("Digital Mass Flow Controller"),
  features: features(
    "Accurate at Low Flow",
    "Fast Response",
    "Wide Pressure Range Compatibility",
    "Excellent Linearity",
    "Long-Term Stability",
    "High Corrosion Resistance",
    "Highly Stable Removable Sensor",
    "Compact Connection",
  ),
  connections: [
    { type: '1/8" SW', length: "126.7 mm" },
    { type: '1/4" SW', length: "128 mm" },
    { type: '3/8" SW', length: "134.3 mm" },
    { type: '1/4" VCR', length: "127.8 mm" },
  ],
  massFlowSpecs: {
    flowRange: {
      display: "0.01–30 slpm",
      min: 0.01,
      max: 30,
      unit: "slpm",
      referenceGas: "N2",
    },
    responseTime: {
      display: "<1 second",
      value: 1,
      unit: "s",
      comparator: "lt",
    },
    accuracy: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    repeatability: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    ioSignal: {
      display: "0–5 Vdc or 4–20 mA",
      outputs: ["0-5Vdc", "4-20mA"],
    },
    supplyPower: {
      display: "+15 or +24 Vdc, 350 mA",
      voltages: [15, 24],
      currentMA: 350,
    },
    maxPressure: {
      display: "<90 bar",
      value: 90,
      unit: "bar",
      comparator: "lt",
    },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1×10⁻⁹ atm·cc/sec",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "3–100%", min: 3, max: 100, unit: "%" },
  },
  digitalCommunication: {
    protocol: "RS-485",
    baudRate: 38400,
    dataBits: 8,
    stopBits: 1,
    parity: "None",
  },
};

export const MD30M: Product = {
  model: "MD30M",
  slug: { current: "md30m" },
  series: "digital",
  function: "MFM",
  productLabel: label("Digital Mass Flow Meter"),
  features: features(
    "Accurate at Low Flow",
    "Fast Response",
    "Wide Pressure Range Compatibility",
    "Excellent Linearity",
    "Long-Term Stability",
    "High Corrosion Resistance",
    "Highly Stable Removable Sensor",
    "Compact Connection",
  ),
  connections: [
    { type: '1/8" SW', length: "104.5 mm" },
    { type: '1/4" SW', length: "111.9 mm" },
    { type: '3/8" SW', length: "115.3 mm" },
    { type: '1/4" VCR', length: "107.5 mm" },
  ],
  massFlowSpecs: {
    flowRange: {
      display: "0.01–30 slpm",
      min: 0.01,
      max: 30,
      unit: "slpm",
      referenceGas: "N2",
    },
    accuracy: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    repeatability: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    ioSignal: {
      display: "0–5 Vdc or 4–20 mA",
      outputs: ["0-5Vdc", "4-20mA"],
    },
    supplyPower: {
      display: "+15 or +24 Vdc, 350 mA",
      voltages: [15, 24],
      currentMA: 350,
    },
    maxPressure: {
      display: "<90 bar",
      value: 90,
      unit: "bar",
      comparator: "lt",
    },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1×10⁻⁹ atm·cc/sec",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "3–100%", min: 3, max: 100, unit: "%" },
  },
  digitalCommunication: {
    protocol: "RS-485",
    baudRate: 38400,
    dataBits: 8,
    stopBits: 1,
    parity: "None",
  },
};

export const MD100C: Product = {
  model: "MD100C",
  slug: { current: "md100c" },
  series: "digital",
  function: "MFC",
  productLabel: label("Digital Mass Flow Controller"),
  features: features(
    "Accurate at Low Flow",
    "Fast Response",
    "Wide Pressure Range Compatibility",
    "Excellent Linearity",
    "Long-Term Stability",
    "High Corrosion Resistance",
    "Highly Stable Removable Sensor",
    "Compact Connection",
  ),
  connections: [
    { type: '1/4" SW', length: "145.9 mm" },
    { type: '3/8" SW', length: "149.3 mm" },
    { type: '1/2" SW', length: "161.5 mm" },
    { type: '1/4" VCR', length: "141.5 mm" },
    { type: '1/2" VCR', length: "149 mm" },
  ],
  massFlowSpecs: {
    flowRange: {
      display: "30–100 slpm",
      min: 30,
      max: 100,
      unit: "slpm",
      referenceGas: "N2",
    },
    responseTime: {
      display: "<1 second",
      value: 1,
      unit: "s",
      comparator: "lt",
    },
    accuracy: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    repeatability: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    ioSignal: {
      display: "0–5 Vdc or 4–20 mA",
      outputs: ["0-5Vdc", "4-20mA"],
    },
    supplyPower: {
      display: "+15 or +24 Vdc, 350 mA",
      voltages: [15, 24],
      currentMA: 350,
    },
    maxPressure: {
      display: "<90 bar",
      value: 90,
      unit: "bar",
      comparator: "lt",
    },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1×10⁻⁹ atm·cc/sec",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "3–100%", min: 3, max: 100, unit: "%" },
  },
  digitalCommunication: {
    protocol: "RS-485",
    baudRate: 38400,
    dataBits: 8,
    stopBits: 1,
    parity: "None",
  },
};

export const LD030C: Product = {
  model: "LD030C",
  slug: { current: "ld030c" },
  series: "specialized",
  function: "MFC",
  productLabel: label("Mass Flow Controller with Display"),
  features: features(
    "Accurate Real Time Flow Measurements",
    "Real Time Setting Changes",
    "Fast Response",
    "Wide Pressure Range Compatibility",
    "Excellent Linearity",
    "Long-Term Stability",
    "High Corrosion Resistance",
    "Highly Stable Removable Sensor",
    "Compact Connection",
  ),
  connections: [
    { type: '1/8" SW', length: "140.2 mm" },
    { type: '1/4" SW', length: "141.5 mm" },
    { type: '3/8" SW', length: "147.8 mm" },
    { type: '1/4" VCR', length: "141.3 mm" },
  ],
  massFlowSpecs: {
    flowRange: {
      display: "0.01–30 slpm",
      min: 0.01,
      max: 30,
      unit: "slpm",
      referenceGas: "N2",
    },
    responseTime: {
      display: "<2 seconds",
      value: 2,
      unit: "s",
      comparator: "lt",
    },
    accuracy: { display: "±1% of FS", value: 1, unit: "%FS" },
    repeatability: { display: "±0.25% of FS", value: 0.25, unit: "%FS" },
    ioSignal: {
      display: "0–5 Vdc",
      outputs: ["0-5Vdc"],
    },
    supplyPower: {
      display: "+15 or +24 Vdc, 350 mA",
      voltages: [15, 24],
      currentMA: 350,
    },
    maxPressure: {
      display: "<90 bar",
      value: 90,
      unit: "bar",
      comparator: "lt",
    },
    tempRange: { display: "0–50 °C", min: 0, max: 50, unit: "°C" },
    leakRate: {
      display: "1×10⁻⁹ atm·cc/sec",
      value: 1e-9,
      unit: "atm·cc/sec",
    },
    controlRange: { display: "3–100%", min: 3, max: 100, unit: "%" },
  },
};

export const ALL_PRODUCTS: Product[] = [M3030VA, MD30C, MD30M, MD100C, LD030C];
