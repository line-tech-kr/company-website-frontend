import { defineQuery } from "next-sanity";

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    model,
    slug,
    series,
    "function": function,
    "productLabel": {
      "ko": productLabel[language == "ko"][0].value,
      "en": productLabel[language == "en"][0].value,
      "zh": productLabel[language == "zh"][0].value
    },
    features,
    connections,
    massFlowSpecs,
    digitalCommunication,
    images,
    dimensionDrawing
  }
`);
