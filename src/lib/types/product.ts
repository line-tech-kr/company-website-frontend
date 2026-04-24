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
  responseTime: ResponseTime;
  accuracy: Accuracy;
  repeatability: Repeatability;
  ioSignal: IoSignal;
  supplyPower: SupplyPower;
  maxPressure: MaxPressure;
  tempRange: TempRange;
  leakRate: LeakRate;
  controlRange: ControlRange;
};

export type Product = {
  model: string;
  series: "analogue" | "digital" | "specialized";
  function: "MFC" | "MFM";
  formFactor: "M" | "MS";
  connections: Connection[];
  massFlowSpecs: MassFlowSpecs;
};
