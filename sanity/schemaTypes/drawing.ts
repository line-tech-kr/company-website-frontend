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
      name: "model",
      title: "Model",
      type: "string",
      description: "Product model code (e.g. M3030VA)",
      validation: (r) => r.required(),
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
  ],
  preview: {
    select: { title: "title", model: "model" },
    prepare({ title, model }) {
      return { title: title ?? "(untitled)", subtitle: model };
    },
  },
});
