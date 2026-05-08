import { defineType, defineField } from "sanity";

export const drawing = defineType({
  name: "drawing",
  title: "CAD Drawing",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "models",
      title: "Models",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Product model codes covered by this drawing (e.g. M3030VA). Multiple entries supported when one drawing covers several models.",
      validation: (r) => r.min(1),
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
      name: "dwgFile",
      title: "AutoCAD file (.dwg)",
      type: "file",
      options: { accept: ".dwg" },
    }),
    defineField({
      name: "stpFile",
      title: "STEP file (.stp)",
      type: "file",
      options: { accept: ".stp,.step" },
    }),
    defineField({
      name: "pdfFile",
      title: "PDF dimensional drawing",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "archived",
      title: "Archived",
      type: "boolean",
      description:
        "Hide from Data Room and product pages (e.g. retired product). File remains in Sanity.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: "title", models: "models", archived: "archived" },
    prepare({ title, models, archived }) {
      const modelLabel =
        Array.isArray(models) && models.length > 0
          ? models.join(", ")
          : undefined;
      return {
        title: archived
          ? `[Archived] ${title ?? "(untitled)"}`
          : (title ?? "(untitled)"),
        subtitle: modelLabel,
      };
    },
  },
});
