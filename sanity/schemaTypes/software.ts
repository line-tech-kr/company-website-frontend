import { defineType, defineField } from "sanity";

export const software = defineType({
  name: "software",
  title: "Software",
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
        "Optional. Per-locale label shown on software rows. Leave empty to fall back to `title`.",
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: 'e.g. "v1.0" or a build date like "2016-09-19"',
    }),
    defineField({
      name: "models",
      title: "Models",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Product model codes this software supports. Leave empty if it applies across the lineup.",
    }),
    defineField({
      name: "file",
      title: "Archive (.zip)",
      type: "file",
      options: { accept: ".zip" },
      description:
        "Installer packaged as a single zip so browsers download it without executable warnings.",
    }),
    defineField({
      name: "publishedAt",
      title: "Published",
      type: "date",
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 99,
    }),
  ],
  preview: {
    select: { title: "title", version: "version" },
    prepare({ title, version }) {
      return { title: title ?? "(untitled)", subtitle: version };
    },
  },
});
