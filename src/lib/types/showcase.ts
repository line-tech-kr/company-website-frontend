import { z } from "zod";

const ShowcaseEntrySchema = z.object({
  model: z.string(),
  slug: z.string(),
  caption: z.string().nullable(),
  function: z.enum(["MFC", "MFM"]).nullable(),
  flowRange: z.string().nullable(),
  accuracy: z.string().nullable(),
});

export const CategoryShowcaseSchema = z.object({
  analogue: z.array(ShowcaseEntrySchema).nullable(),
  digital: z.array(ShowcaseEntrySchema).nullable(),
  specialized: z.array(ShowcaseEntrySchema).nullable(),
});

export type ShowcaseEntry = z.infer<typeof ShowcaseEntrySchema>;
export type CategoryShowcaseData = z.infer<typeof CategoryShowcaseSchema>;
