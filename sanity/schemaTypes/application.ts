import { defineType, defineField } from "sanity";

export const application = defineType({
  name: "application",
  title: "Application",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "order",
      title: "Display order",
      type: "number",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "internationalizedArrayString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "lede",
      title: "Lede",
      type: "internationalizedArrayString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "internationalizedArrayText",
      description: "Separate paragraphs with a blank line.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "recommendedSeries",
      title: "Recommended series",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "relatedCategories",
      title: "Related categories",
      type: "array",
      of: [
        {
          type: "string",
          options: {
            list: [
              { title: "Analogue", value: "analogue" },
              { title: "Digital", value: "digital" },
              { title: "Specialized", value: "specialized" },
            ],
          },
        },
      ],
    }),
  ],
});
