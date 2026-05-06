import { defineQuery } from "next-sanity";

const PRODUCT_BASE_PROJECTION = `
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
  massFlowSpecs
`;

const PRODUCT_LIST_PROJECTION = `
  ${PRODUCT_BASE_PROJECTION},
  "images": images[0..0]
`;

const PRODUCT_DETAIL_PROJECTION = `
  ${PRODUCT_BASE_PROJECTION},
  digitalCommunication,
  images,
  dimensionDrawing,
  "datasheets": *[_type == "datasheet" && lower(model) == lower(^.model)]
    | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      title,
      rev,
      publishedAt,
      "fileUrl": file.asset->url,
      "size": file.asset->size,
      "updatedAt": _updatedAt
    },
  "manuals": *[_type == "manual" && lower(model) == lower(^.model)]
    | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      title,
      rev,
      publishedAt,
      "fileUrl": file.asset->url,
      "size": file.asset->size,
      "updatedAt": _updatedAt
    },
  "drawings": *[_type == "drawing" && lower(model) == lower(^.model)]
    | order(_updatedAt desc) {
      _id,
      title,
      "dwgUrl": dwgFile.asset->url,
      "dwgSize": dwgFile.asset->size,
      "stpUrl": stpFile.asset->url,
      "stpSize": stpFile.asset->size,
      "updatedAt": _updatedAt
    }
`;

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    ${PRODUCT_DETAIL_PROJECTION}
  }
`);

export const productsBySeriesQuery = defineQuery(`
  *[_type == "product" && series == $series] | order(function asc, model asc){
    ${PRODUCT_LIST_PROJECTION}
  }
`);

export const productByModelQuery = defineQuery(`
  *[_type == "product" && lower(model) == lower($model)][0]{
    ${PRODUCT_DETAIL_PROJECTION}
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
      "image": product->images[0],
    },
    "digital": digital[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": product->massFlowSpecs.flowRange.display,
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
    },
    "specialized": specialized[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": product->massFlowSpecs.flowRange.display,
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
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
    ${PRODUCT_LIST_PROJECTION}
  }
`);

export const allCataloguesQuery = defineQuery(`
  *[_type == "catalogue"] | order(publishedAt desc) {
    _id,
    title,
    series,
    publishedAt,
    "fileUrl": file.asset->url
  }
`);

export const allManualsQuery = defineQuery(`
  *[_type == "manual"]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    model asc
  ) {
    _id,
    title,
    model,
    series,
    rev,
    publishedAt,
    "fileUrl": file.asset->url
  }
`);

export const allDatasheetsQuery = defineQuery(`
  *[_type == "datasheet"]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    model asc
  ) {
    _id,
    title,
    model,
    series,
    rev,
    publishedAt,
    "fileUrl": file.asset->url
  }
`);

export const allDrawingsQuery = defineQuery(`
  *[_type == "drawing"]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    model asc
  ) {
    _id,
    title,
    model,
    series,
    "dwgUrl": dwgFile.asset->url,
    "stpUrl": stpFile.asset->url
  }
`);

export const resourceCountsQuery = defineQuery(`
  {
    "catalogues": count(*[_type == "catalogue"]),
    "datasheets": count(*[_type == "datasheet"]),
    "manuals": count(*[_type == "manual"]),
    "drawings": count(*[_type == "drawing"]),
    "certifications": count(*[_type == "certification"])
  }
`);

export const allCertificationsQuery = defineQuery(`
  *[_type == "certification"] | order(coalesce(order, 99) asc) {
    _id,
    name,
    "issuer": {
      "ko": coalesce(issuer[language == "ko"][0].value, issuer[language == "en"][0].value),
      "en": coalesce(issuer[language == "en"][0].value, issuer[language == "ko"][0].value),
      "zh": coalesce(issuer[language == "zh"][0].value, issuer[language == "en"][0].value)
    },
    "scope": {
      "ko": coalesce(scope[language == "ko"][0].value, scope[language == "en"][0].value),
      "en": coalesce(scope[language == "en"][0].value, scope[language == "ko"][0].value),
      "zh": coalesce(scope[language == "zh"][0].value, scope[language == "en"][0].value)
    },
    validThrough,
    "fileUrl": file.asset->url
  }
`);
