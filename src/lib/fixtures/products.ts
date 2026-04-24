import type { Product } from "@/lib/types/product";

export const M3030VA: Product = {
  model: "M3030VA",
  series: "analogue",
  function: "MFC",
  formFactor: "M",
  connections: [{ type: '1/4" SW', length: "131.3 mm" }],
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
    repeatability: { display: "±0.2% of FS", value: 0.2, unit: "%FS" },
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
    controlRange: { display: "2–100%", min: 2, max: 100, unit: "%" },
  },
};
