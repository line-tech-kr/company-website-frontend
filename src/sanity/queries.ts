import { defineQuery } from "next-sanity";

const PRODUCT_PROJECTION = `
  model,
  slug,
  series,
  "function": function,
  "productLabel": {
    "ko": coalesce(productLabel[language == "ko"][0].value, productLabel[language == "en"][0].value),
    "en": coalesce(productLabel[language == "en"][0].value, productLabel[language == "ko"][0].value),
    "zh": coalesce(productLabel[language == "zh"][0].value, productLabel[language == "en"][0].value)
  },
  "tags": coalesce(tags[]->{
    "slug": slug,
    kind,
    "label": {
      "ko": coalesce(label[language == "ko"][0].value, label[language == "en"][0].value),
      "en": coalesce(label[language == "en"][0].value, label[language == "ko"][0].value),
      "zh": coalesce(label[language == "zh"][0].value, label[language == "en"][0].value)
    }
  }, []),
  features,
  connections,
  massFlowSpecs,
  digitalCommunication,
  images,
  dimensionDrawing
`;

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    ${PRODUCT_PROJECTION}
  }
`);

export const productsBySeriesQuery = defineQuery(`
  *[_type == "product" && series == $series] | order(function asc, model asc){
    ${PRODUCT_PROJECTION}
  }
`);

export const productByModelQuery = defineQuery(`
  *[_type == "product" && lower(model) == lower($model)][0]{
    ${PRODUCT_PROJECTION}
  }
`);

export const allProductsQuery = defineQuery(`
  *[_type == "product"]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    function asc,
    model asc
  ){
    ${PRODUCT_PROJECTION}
  }
`);
