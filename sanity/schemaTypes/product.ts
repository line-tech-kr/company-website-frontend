import { defineType, defineField } from "sanity";

const displayField = defineField({
  name: "display",
  title: "Display string",
  type: "string",
  description: "Rendered literally in the spec table.",
  validation: (r) => r.required(),
});

const numberField = (name: string) => defineField({ name, type: "number" });

const stringField = (name: string) => defineField({ name, type: "string" });

const comparatorField = defineField({
  name: "comparator",
  type: "string",
  options: { list: ["lt", "gt", "eq"] },
});

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "model",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "model", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "series",
      type: "string",
      options: { list: ["analogue", "digital", "specialized"] },
    }),
    defineField({
      name: "function",
      type: "string",
      options: { list: ["MFC", "MFM"] },
    }),
    defineField({
      name: "productLabel",
      title: "Product label",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "object",
      fields: [
        defineField({ name: "en", type: "string" }),
        defineField({ name: "ko", type: "string" }),
        defineField({ name: "zh", type: "string" }),
      ],
    }),
    defineField({
      name: "features",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "ko",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "en",
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "zh",
              type: "string",
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "en" } },
        },
      ],
    }),
    defineField({
      name: "connections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [stringField("type"), stringField("length")],
        },
      ],
    }),
    defineField({
      name: "massFlowSpecs",
      type: "object",
      fields: [
        defineField({
          name: "flowRange",
          type: "object",
          fields: [
            displayField,
            numberField("min"),
            numberField("max"),
            stringField("unit"),
            stringField("referenceGas"),
          ],
        }),
        defineField({
          name: "responseTime",
          type: "object",
          fields: [
            displayField,
            numberField("value"),
            stringField("unit"),
            comparatorField,
          ],
        }),
        defineField({
          name: "accuracy",
          type: "object",
          fields: [displayField, numberField("value"), stringField("unit")],
        }),
        defineField({
          name: "repeatability",
          type: "object",
          fields: [displayField, numberField("value"), stringField("unit")],
        }),
        defineField({
          name: "ioSignal",
          type: "object",
          fields: [
            displayField,
            defineField({
              name: "outputs",
              type: "array",
              of: [{ type: "string" }],
            }),
          ],
        }),
        defineField({
          name: "supplyPower",
          type: "object",
          fields: [
            displayField,
            defineField({
              name: "voltages",
              type: "array",
              of: [{ type: "number" }],
            }),
            defineField({ name: "currentMA", type: "number" }),
          ],
        }),
        defineField({
          name: "maxPressure",
          type: "object",
          fields: [
            displayField,
            numberField("value"),
            stringField("unit"),
            comparatorField,
          ],
        }),
        defineField({
          name: "tempRange",
          type: "object",
          fields: [
            displayField,
            numberField("min"),
            numberField("max"),
            stringField("unit"),
          ],
        }),
        defineField({
          name: "leakRate",
          type: "object",
          fields: [displayField, numberField("value"), stringField("unit")],
        }),
        defineField({
          name: "controlRange",
          type: "object",
          fields: [
            displayField,
            numberField("min"),
            numberField("max"),
            stringField("unit"),
          ],
        }),
      ],
    }),
    defineField({
      name: "digitalCommunication",
      type: "object",
      fields: [
        stringField("protocol"),
        numberField("baudRate"),
        numberField("dataBits"),
        numberField("stopBits"),
        defineField({
          name: "parity",
          type: "string",
          options: { list: ["None", "Even", "Odd"] },
        }),
      ],
    }),
    defineField({
      name: "images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "dimensionDrawing",
      type: "image",
    }),
  ],
  preview: {
    select: { title: "model", subtitle: "series" },
  },
});
