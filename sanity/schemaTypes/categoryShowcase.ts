import { defineType, defineField, defineArrayMember } from "sanity";

export const categoryShowcase = defineType({
  name: "categoryShowcase",
  title: "Category Showcases",
  type: "document",
  fields: [
    defineField({
      name: "analogue",
      title: "Analogue series",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description:
                "Short highlight shown on the slide — e.g. '±0.5% F.S. accuracy'",
            }),
          ],
          preview: {
            select: { title: "product.model", subtitle: "caption" },
          },
        }),
      ],
    }),
    defineField({
      name: "digital",
      title: "Digital series",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Short highlight shown on the slide.",
            }),
          ],
          preview: {
            select: { title: "product.model", subtitle: "caption" },
          },
        }),
      ],
    }),
    defineField({
      name: "specialized",
      title: "Specialized series",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (r) => r.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
              description: "Short highlight shown on the slide.",
            }),
          ],
          preview: {
            select: { title: "product.model", subtitle: "caption" },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Category Showcases" }),
  },
});
