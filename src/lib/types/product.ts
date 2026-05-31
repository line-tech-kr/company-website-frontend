import { z } from "zod";

const SpecBaseSchema = z.object({ display: z.string() });

const MassFlowSpecsSchema = z.object({
  flowRange: SpecBaseSchema.extend({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
    referenceGas: z.string().optional(),
  }).optional(),
  // Operating pressure range. Used for EPC products in place of flowRange,
  // since an electronic pressure controller's defining spec is a pressure
  // range (e.g. "0.1–6 barA"), not a flow range.
  pressureRange: SpecBaseSchema.extend({
    min: z.number().optional(),
    max: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
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

const InstrumentSpecsSchema = z.array(
  z.object({ label: z.string(), value: z.string() }),
);

const SanityImageRefSchema = z.object({
  _ref: z.string(),
  _type: z.literal("reference"),
});

export const SanityImageSchema = z.object({
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
  function: z.enum(["MFC", "MFM", "EPC", "ROU"]),
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
      }),
    )
    .default([]),
  description: z
    .object({ ko: z.string(), en: z.string(), zh: z.string() })
    .nullable()
    .optional(),
  features: z.array(
    z.object({
      ko: z.string().optional(),
      en: z.string().optional(),
      zh: z.string().optional(),
      _key: z.string().optional(),
    }),
  ),
  connections: z
    .array(
      z.object({
        type: z.string(),
        length: z.string(),
        _key: z.string().optional(),
      }),
    )
    .nullable()
    .transform((connections) => connections ?? []),
  massFlowSpecs: MassFlowSpecsSchema.nullable().optional(),
  instrumentSpecs: InstrumentSpecsSchema.nullable().optional(),
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
  cutout: SanityImageSchema.nullable().optional(),
  connectorType: z.string().nullable().optional(),
  dimensionDrawing: SanityImageSchema.nullable().optional(),
  datasheets: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string(),
        rev: z.string().nullable().optional(),
        publishedAt: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        size: z.number().nullable().optional(),
        updatedAt: z.string().nullable().optional(),
      }),
    )
    .default([]),
  manuals: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string(),
        rev: z.string().nullable().optional(),
        publishedAt: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        size: z.number().nullable().optional(),
        updatedAt: z.string().nullable().optional(),
      }),
    )
    .default([]),
  drawings: z
    .array(
      z.object({
        _id: z.string(),
        title: z.string(),
        models: z.array(z.string()).nullable().optional(),
        dwgUrl: z.string().nullable().optional(),
        dwgSize: z.number().nullable().optional(),
        stpVariants: z
          .array(
            z.object({
              fitting: z.string(),
              sortKey: z.number().nullable().optional(),
              url: z.string().nullable().optional(),
              size: z.number().nullable().optional(),
            }),
          )
          .nullable()
          .optional(),
        pdfUrl: z.string().nullable().optional(),
        pdfSize: z.number().nullable().optional(),
        updatedAt: z.string().nullable().optional(),
      }),
    )
    .default([]),
  certifications: z
    .array(
      z.object({
        _id: z.string(),
        name: z.string(),
        slug: z.string().nullable().optional(),
        issuer: z
          .object({
            ko: z.string().nullable().optional(),
            en: z.string().nullable().optional(),
            zh: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        scope: z
          .object({
            ko: z.string().nullable().optional(),
            en: z.string().nullable().optional(),
            zh: z.string().nullable().optional(),
          })
          .nullable()
          .optional(),
        validThrough: z.string().nullable().optional(),
        fileUrl: z.string().nullable().optional(),
        size: z.number().nullable().optional(),
      }),
    )
    .default([]),
});

export type Product = z.infer<typeof SanityProductSchema>;
export type MassFlowSpecs = z.infer<typeof MassFlowSpecsSchema>;
export type InstrumentSpecs = z.infer<typeof InstrumentSpecsSchema>;

export type LocalizedString = { ko: string; en: string; zh: string };

// Derived aliases kept for parse-catalog / seed-products compatibility
export type Connection = { type: string; length: string };
export type FlowRange = NonNullable<MassFlowSpecs["flowRange"]>;
export type PressureRange = NonNullable<MassFlowSpecs["pressureRange"]>;
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
