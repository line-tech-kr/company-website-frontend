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
      description:
        "Used as the fallback when no per-locale display name is set, and as the record name in the studio.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display name (per locale)",
      type: "internationalizedArrayString",
      description:
        "Optional. Per-locale label shown on manual cards (e.g. M2030 매뉴얼 / M2030 Manual / M2030 手册). Leave empty to fall back to `title`.",
    }),
    defineField({
      name: "models",
      title: "Models",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Product model codes covered by this manual (e.g. M3030VA). Multiple entries when the manual covers a series (e.g. MS3500VA + MS3600VA).",
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
