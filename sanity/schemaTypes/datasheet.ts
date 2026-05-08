import { defineType, defineField } from "sanity";

export const datasheet = defineType({
  name: "datasheet",
  title: "Datasheet",
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
        "Product model codes covered by this datasheet (e.g. M3030VA). Multiple entries supported.",
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
    select: {
      title: "title",
      models: "models",
      series: "series",
      archived: "archived",
    },
    prepare({ title, models, series, archived }) {
      const modelLabel =
        Array.isArray(models) && models.length > 0
          ? models.join(", ")
          : undefined;
      return {
        title: archived
          ? `[Archived] ${title ?? "(untitled)"}`
          : (title ?? "(untitled)"),
        subtitle: [modelLabel, series].filter(Boolean).join(" · "),
      };
    },
  },
});
