export type LocalizedString = { ko: string; en: string; zh: string };

export type Connection = { type: string; length: string };

type DisplayOnly = { display: string };

export type FlowRange = DisplayOnly & {
  min: number;
  max: number;
  unit: string;
  referenceGas: string;
};

export type ResponseTime = DisplayOnly & {
  value: number;
  unit: string;
  comparator: "lt" | "gt" | "eq";
};

export type Accuracy = DisplayOnly & { value: number; unit: string };
export type Repeatability = DisplayOnly & { value: number; unit: string };

export type IoSignal = DisplayOnly & { outputs: string[] };

export type SupplyPower = DisplayOnly & {
  voltages: number[];
  currentMA: number;
};

export type MaxPressure = DisplayOnly & {
  value: number;
  unit: string;
  comparator: "lt" | "gt" | "eq";
};

export type TempRange = DisplayOnly & {
  min: number;
  max: number;
  unit: string;
};

export type LeakRate = DisplayOnly & { value: number; unit: string };

export type ControlRange = DisplayOnly & {
  min: number;
  max: number;
  unit: string;
};

export type MassFlowSpecs = {
  flowRange: FlowRange;
  responseTime?: ResponseTime;
  accuracy: Accuracy;
  repeatability: Repeatability;
  ioSignal: IoSignal;
  supplyPower: SupplyPower;
  maxPressure: MaxPressure;
  tempRange: TempRange;
  leakRate: LeakRate;
  controlRange: ControlRange;
};

export type DigitalCommunication = {
  protocol: string;
  baudRate: number;
  dataBits: number;
  stopBits: number;
  parity: "None" | "Even" | "Odd";
};

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
};

export type Product = {
  model: string;
  slug: { current: string };
  series: "analogue" | "digital" | "specialized";
  function: "MFC" | "MFM";
  productLabel: LocalizedString;
  features: LocalizedString[];
  connections: Connection[];
  massFlowSpecs: MassFlowSpecs;
  digitalCommunication?: DigitalCommunication;
  images?: SanityImage[];
  dimensionDrawing?: SanityImage;
};
