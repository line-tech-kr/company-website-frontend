import { defineType, defineField } from "sanity";

export const manual = defineType({
  name: "manual",
  title: "Manual",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "model",
      title: "Model",
      type: "string",
      description: "Product model code (e.g. M3030VA)",
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "string",
      options: {
        list: [
          { title: "Analogue", value: "analogue" },
          { title: "Digital", value: "digital" },
          { title: "Specialized", value: "specialized" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "rev",
      title: "Revision",
      type: "string",
      description: 'e.g. "Rev. A"',
    }),
    defineField({
      name: "file",
      title: "PDF file",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "date",
    }),
  ],
  preview: {
    select: { title: "title", model: "model", series: "series" },
    prepare({ title, model, series }) {
      return {
        title: title ?? "(untitled)",
        subtitle: [model, series].filter(Boolean).join(" · "),
      };
    },
  },
});
