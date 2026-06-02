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
      description:
        "Used as the fallback when no per-locale display name is set, and as the record name in the studio.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display name (per locale)",
      type: "internationalizedArrayString",
      description:
        "Optional. Per-locale label shown on drawing cards (e.g. M2030 도면 / M2030 Drawing / M2030 图纸). Leave empty to fall back to `title`.",
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
      name: "stpFiles",
      title: "STEP files (per fitting)",
      type: "array",
      of: [
        {
          type: "object",
          name: "stpVariant",
          title: "STEP variant",
          fields: [
            defineField({
              name: "fitting",
              title: "Fitting",
              type: "string",
              description: "Display label, e.g. '1/4\" SW' or '1/2\" VCR'",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "sortKey",
              title: "Sort key (inches)",
              type: "number",
              description:
                'Numeric size in inches for ordering (e.g. 0.25 for 1/4")',
              hidden: true,
            }),
            defineField({
              name: "file",
              title: "STEP file",
              type: "file",
              options: { accept: ".stp,.step" },
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: { title: "fitting" },
          },
        },
      ],
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
