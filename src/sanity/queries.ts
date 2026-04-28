import { defineQuery } from "next-sanity";

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    model,
    slug,
    series,
    "function": function,
    "productLabel": {
      "ko": coalesce(productLabel[language == "ko"][0].value, productLabel[language == "en"][0].value),
      "en": coalesce(productLabel[language == "en"][0].value, productLabel[language == "ko"][0].value),
      "zh": coalesce(productLabel[language == "zh"][0].value, productLabel[language == "en"][0].value)
    },
    features,
    connections,
    massFlowSpecs,
    digitalCommunication,
    images,
    dimensionDrawing
  }
`);
