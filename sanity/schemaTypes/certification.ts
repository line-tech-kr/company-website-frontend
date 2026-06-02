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
      description:
        "Short, language-agnostic identifier (e.g. ISO 9001, CE). Used as the fallback when no per-locale display name is set, and as the indexable record name in the studio.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayName",
      title: "Display name (per locale)",
      type: "internationalizedArrayString",
      description:
        "Optional. Per-locale name shown on cert cards (e.g. 특허 KR 10-2759236 / Patent KR 10-2759236 / 专利 KR 10-2759236). Leave empty for certs whose name is already the same in every language (ISO 9001, CE) — the `name` field is used as the fallback.",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "Stable URL fragment for deep-linking (e.g. iso-9001). Once set, do not change — the /company page links to /resources/certifications#<slug>.",
      options: {
        source: "name",
        maxLength: 40,
        isUnique: (slug, ctx) => ctx.defaultIsUnique(slug, ctx),
      },
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
      name: "models",
      title: "Applies to models",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Leave empty for company-wide certs (ISO, INNOBIZ). For product-specific certs (e.g. CE DoC for MS3150VA, or Readout Box DoC shared by LTI-1000 + LTI-2000), list each model code so the cert surfaces on the product page.",
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
