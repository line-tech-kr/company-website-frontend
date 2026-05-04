import { defineType, defineField } from "sanity";

export const catalogue = defineType({
  name: "catalogue",
  title: "Catalogue",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "string",
      options: {
        list: [
          { title: "All series", value: "all" },
          { title: "Analogue", value: "analogue" },
          { title: "Digital", value: "digital" },
          { title: "Specialized", value: "specialized" },
        ],
        layout: "radio",
      },
      initialValue: "all",
      validation: (r) => r.required(),
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
    select: { title: "title", series: "series" },
    prepare({ title, series }) {
      return { title: title ?? "(untitled)", subtitle: series };
    },
  },
});
