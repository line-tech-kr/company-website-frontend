import { defineType, defineField } from "sanity";

export const contactSubmission = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  fields: [
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "inquiryType",
      title: "Inquiry Type",
      type: "string",
    }),
    defineField({
      name: "typeDetail",
      title: "Type Detail",
      type: "string",
    }),
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
    }),
    defineField({
      name: "subject",
      title: "Subject",
      type: "string",
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
    }),
    defineField({
      name: "gasMode",
      title: "Gas mode",
      type: "string",
      description: "Quote requests only — pure | mixture.",
    }),
    defineField({
      name: "gas",
      title: "Gas (pure)",
      type: "string",
      description: "Quote requests only — single gas species (pure mode).",
    }),
    defineField({
      name: "gasComponents",
      title: "Gas composition (mixture)",
      type: "text",
      description:
        "Quote requests only — JSON array of {gas, percent} for mixtures.",
    }),
    defineField({
      name: "flowValue",
      title: "Flow value",
      type: "string",
      description: "Quote requests only — numeric flow rate as submitted.",
    }),
    defineField({
      name: "flowUnit",
      title: "Flow unit",
      type: "string",
      description: "Quote requests only — sccm | slm | sml | scfh.",
    }),
    defineField({
      name: "pressureValue",
      title: "Pressure value",
      type: "string",
      description: "Quote requests only — numeric pressure as submitted.",
    }),
    defineField({
      name: "pressureUnit",
      title: "Pressure unit",
      type: "string",
      description: "Quote requests only — bar | psi | kPa | MPa.",
    }),
    defineField({
      name: "fittingType",
      title: "Fitting type",
      type: "string",
      description: "Quote requests only — VCR | Swagelok | NPT | Rc | Other.",
    }),
    defineField({
      name: "fittingSize",
      title: "Fitting size",
      type: "string",
      description: 'Quote requests only — free text (e.g. 1/4", 6mm).',
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "email",
    },
  },
});
