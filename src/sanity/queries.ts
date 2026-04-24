import { defineQuery } from "next-sanity";

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    model,
    series,
    "function": function,
    formFactor,
    connections,
    massFlowSpecs
  }
`);
