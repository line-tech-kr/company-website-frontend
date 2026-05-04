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
      "ko": coalesce(label[language == "ko"][0].value, label[language == "en"][0].value, label[language == "zh"][0].value),
      "en": coalesce(label[language == "en"][0].value, label[language == "ko"][0].value, label[language == "zh"][0].value),
      "zh": coalesce(label[language == "zh"][0].value, label[language == "en"][0].value, label[language == "ko"][0].value)
    }
  }, []),
  description,
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

export const productSlugsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current)]{
    "slug": slug.current,
    series
  }
`);

export const categoryShowcaseQuery = defineQuery(`
  *[_type == "categoryShowcase" && _id == "category-showcases"][0]{
    "analogue": analogue[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": product->massFlowSpecs.flowRange.display,
      "accuracy": product->massFlowSpecs.accuracy.display,
    },
    "digital": digital[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": product->massFlowSpecs.flowRange.display,
      "accuracy": product->massFlowSpecs.accuracy.display,
    },
    "specialized": specialized[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": product->massFlowSpecs.flowRange.display,
      "accuracy": product->massFlowSpecs.accuracy.display,
    },
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
