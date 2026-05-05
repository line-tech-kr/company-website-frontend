import { defineType, defineField } from "sanity";

export const certification = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certificate name",
      type: "string",
      description: "Short name, same across languages (e.g. ISO 9001, CE)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "issuer",
      title: "Issuing body",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "scope",
      title: "Scope / description",
      type: "internationalizedArrayString",
    }),
    defineField({
      name: "validThrough",
      title: "Valid through",
      type: "string",
      description: 'e.g. "2026.08" — leave blank if ongoing',
    }),
    defineField({
      name: "file",
      title: "Certificate PDF",
      type: "file",
      options: { accept: ".pdf" },
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
    select: { name: "name", issuer: "issuer" },
    prepare({ name, issuer }) {
      const arr = issuer as
        | { _key: string; value?: string; language?: string }[]
        | undefined;
      const en = arr?.find((e) => e.language === "en")?.value;
      return { title: name ?? "(untitled)", subtitle: en };
    },
  },
});
