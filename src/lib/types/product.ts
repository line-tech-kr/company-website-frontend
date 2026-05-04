import { z } from "zod";

const SpecBaseSchema = z.object({ display: z.string() });

const MassFlowSpecsSchema = z.object({
  flowRange: SpecBaseSchema.extend({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
    referenceGas: z.string().optional(),
  }),
  responseTime: SpecBaseSchema.extend({
    value: z.number().optional(),
    unit: z.string().optional(),
    comparator: z.enum(["lt", "gt", "eq"]).optional(),
  }).optional(),
  accuracy: SpecBaseSchema.extend({
    value: z.number().optional(),
    unit: z.string().optional(),
  }),
  repeatability: SpecBaseSchema.extend({
    value: z.number().optional(),
    unit: z.string().optional(),
  }),
  ioSignal: SpecBaseSchema.extend({
    outputs: z.array(z.string()).optional(),
  }),
  supplyPower: SpecBaseSchema.extend({
    voltages: z.array(z.number()).optional(),
    currentMA: z.number().optional(),
  }),
  maxPressure: SpecBaseSchema.extend({
    value: z.number().optional(),
    unit: z.string().optional(),
    comparator: z.enum(["lt", "gt", "eq"]).optional(),
  }).optional(),
  tempRange: SpecBaseSchema.extend({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
  }),
  leakRate: SpecBaseSchema.extend({
    value: z.number().optional(),
    unit: z.string().optional(),
  }),
  controlRange: SpecBaseSchema.extend({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
  }),
});

const SanityImageRefSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

const SanityImageSchema = z.object({
  _type: z.literal("image"),
  asset: SanityImageRefSchema.optional(),
  hotspot: z
    .object({
      x: z.number(),
      y: z.number(),
      height: z.number(),
      width: z.number(),
    })
    .optional(),
  crop: z
    .object({
      top: z.number(),
      bottom: z.number(),
      left: z.number(),
      right: z.number(),
    })
    .optional(),
});

export const SanityProductSchema = z.object({
  model: z.string(),
  slug: z.object({ current: z.string() }),
  series: z.enum(["analogue", "digital", "specialized"]),
  function: z.enum(["MFC", "MFM"]),
  productLabel: z.object({
    ko: z.string(),
    en: z.string(),
    zh: z.string(),
  }),
  tags: z
    .array(
      z.object({
        slug: z.object({ current: z.string() }),
        kind: z.enum(["capability", "application", "gas"]),
        label: z.object({
          ko: z.string(),
          en: z.string(),
          zh: z.string(),
        }),
        _key: z.string().optional(),
      }),
    )
    .default([]),
  features: z.array(
    z.object({
      ko: z.string().optional(),
      en: z.string().optional(),
      zh: z.string().optional(),
      _key: z.string().optional(),
    }),
  ),
  connections: z.array(
    z.object({
      type: z.string(),
      length: z.string(),
      _key: z.string().optional(),
    }),
  ),
  massFlowSpecs: MassFlowSpecsSchema,
  digitalCommunication: z
    .object({
      protocol: z.string().optional(),
      baudRate: z.number().optional(),
      dataBits: z.number().optional(),
      stopBits: z.number().optional(),
      parity: z.enum(["None", "Even", "Odd"]).optional(),
    })
    .nullable()
    .optional(),
  images: z
    .array(SanityImageSchema.extend({ _key: z.string() }))
    .nullable()
    .optional(),
  dimensionDrawing: SanityImageSchema.nullable().optional(),
});

export type Product = z.infer<typeof SanityProductSchema>;
export type MassFlowSpecs = z.infer<typeof MassFlowSpecsSchema>;

export type LocalizedString = { ko: string; en: string; zh: string };

// Derived aliases kept for parse-catalog / seed-products compatibility
export type Connection = { type: string; length: string };
export type FlowRange = NonNullable<MassFlowSpecs["flowRange"]>;
export type Accuracy = NonNullable<MassFlowSpecs["accuracy"]>;
export type Repeatability = NonNullable<MassFlowSpecs["repeatability"]>;
export type IoSignal = NonNullable<MassFlowSpecs["ioSignal"]>;
export type SupplyPower = NonNullable<MassFlowSpecs["supplyPower"]>;
export type MaxPressure = NonNullable<MassFlowSpecs["maxPressure"]>;
export type TempRange = NonNullable<MassFlowSpecs["tempRange"]>;
export type LeakRate = NonNullable<MassFlowSpecs["leakRate"]>;
export type ControlRange = NonNullable<MassFlowSpecs["controlRange"]>;
export type ResponseTime = NonNullable<MassFlowSpecs["responseTime"]>;
export type DigitalCommunication = NonNullable<Product["digitalCommunication"]>;
export type SanityImage = NonNullable<Product["dimensionDrawing"]>;
