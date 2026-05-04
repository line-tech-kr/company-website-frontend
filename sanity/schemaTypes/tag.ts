import { defineType, defineField } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "internationalizedArrayString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: {
        source: (doc) => {
          const label = doc.label as
            | { _key: string; value?: string; language?: string }[]
            | undefined;
          const en = label?.find((entry) => entry.language === "en")?.value;
          return en ?? "";
        },
        maxLength: 64,
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "kind",
      type: "string",
      options: {
        list: [
          { title: "Capability", value: "capability" },
          { title: "Application", value: "application" },
          { title: "Gas", value: "gas" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      kind: "kind",
    },
    prepare({ title, kind }) {
      const arr = title as
        | { _key: string; value?: string; language?: string }[]
        | undefined;
      const en = arr?.find((entry) => entry.language === "en")?.value;
      const ko = arr?.find((entry) => entry.language === "ko")?.value;
      return {
        title: en ?? ko ?? "(untitled tag)",
        subtitle: kind,
      };
    },
  },
});
