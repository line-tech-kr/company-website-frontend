import { defineType, defineField } from "sanity";

export const faqGroup = defineType({
  name: "faqGroup",
  title: "FAQ Group",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Group ID",
      type: "slug",
      description: "URL-safe identifier, e.g. mfc-vs-mfm-basics",
      options: {
        source: (doc) => {
          const heading = doc.heading as
            | { language: string; value?: string }[]
            | undefined;
          return heading?.find((e) => e.language === "en")?.value ?? "";
        },
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "internationalizedArrayString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "id",
              title: "Question ID",
              type: "string",
              description: "Unique identifier, e.g. mfc-vs-mfm-difference",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "q",
              title: "Question",
              type: "internationalizedArrayString",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "a",
              title: "Answer",
              type: "internationalizedArrayText",
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
  ],
});
