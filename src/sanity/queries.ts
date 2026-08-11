import { defineQuery } from "next-sanity";

/**
 * Localized-field projection helpers.
 *
 * The CMS stores localized text as `[{ language, value }]` arrays. Every query
 * needs to project a `{ ko, en, zh }` object with locale fallbacks. There are
 * two fallback shapes in use:
 *
 *   - localized(field):     ko↔en↔ko, zh→en→zh   (most fields)
 *   - localizedFull(field): full circular fallback through all 3 locales
 *                           (used where every locale must produce a value, e.g.
 *                           product tag labels surfaced in the UI)
 *
 * Helpers return a GROQ object literal — embed inside a projection with `:`.
 */
const localized = (field: string) => `{
    "ko": coalesce(${field}[language == "ko"][0].value, ${field}[language == "en"][0].value),
    "en": coalesce(${field}[language == "en"][0].value, ${field}[language == "ko"][0].value),
    "zh": coalesce(${field}[language == "zh"][0].value, ${field}[language == "en"][0].value)
  }`;

const localizedFull = (field: string) => `{
    "ko": coalesce(${field}[language == "ko"][0].value, ${field}[language == "en"][0].value, ${field}[language == "zh"][0].value),
    "en": coalesce(${field}[language == "en"][0].value, ${field}[language == "ko"][0].value, ${field}[language == "zh"][0].value),
    "zh": coalesce(${field}[language == "zh"][0].value, ${field}[language == "en"][0].value, ${field}[language == "ko"][0].value)
  }`;

/**
 * Strict variant of `localized` that does NOT cross-fill empty slots. Use
 * for editorial-override fields (e.g. `displayName`) where an empty slot
 * means "fall back to the un-localized record field at render time" — the
 * coalescing behaviour in `localized` would silently surface another
 * locale's value instead, defeating the fallback.
 */
export const localizedStrict = (field: string) => `{
    "ko": ${field}[language == "ko"][0].value,
    "en": ${field}[language == "en"][0].value,
    "zh": ${field}[language == "zh"][0].value
  }`;

const PRODUCT_BASE_PROJECTION = `
  model,
  slug,
  series,
  "function": function,
  "productLabel": ${localized("productLabel")},
  "tags": coalesce(tags[]->{
    "slug": slug,
    kind,
    "label": ${localizedFull("label")}
  }, []),
  description,
  features,
  connections,
  massFlowSpecs,
  instrumentSpecs,
  cutout
`;

const PRODUCT_LIST_PROJECTION = `
  ${PRODUCT_BASE_PROJECTION},
  "images": images[0..0]
`;

const PRODUCT_DETAIL_PROJECTION = `
  ${PRODUCT_BASE_PROJECTION},
  digitalCommunication,
  connectorType,
  images,
  dimensionDrawing,
  "manuals": *[_type == "manual" && archived != true && ^.model in coalesce(models, [])]
    | order(coalesce(publishedAt, _updatedAt) desc) {
      _id,
      title,
      "displayName": ${localizedStrict("displayName")},
      rev,
      publishedAt,
      "fileUrl": file.asset->url,
      "size": file.asset->size,
      "updatedAt": _updatedAt
    },
  "drawings": *[_type == "drawing" && archived != true && ^.model in coalesce(models, [])]
    | order(_updatedAt desc) {
      _id,
      title,
      "displayName": ${localizedStrict("displayName")},
      models,
      "dwgUrl": dwgFile.asset->url,
      "dwgSize": dwgFile.asset->size,
      "stpVariants": stpFiles[]{
        fitting,
        sortKey,
        "url": file.asset->url,
        "size": file.asset->size
      } | order(sortKey asc),
      "pdfUrl": pdfFile.asset->url,
      "pdfSize": pdfFile.asset->size,
      "updatedAt": _updatedAt
    },
  "certifications": *[_type == "certification" && ^.model in coalesce(models, [])]
    | order(coalesce(order, 99) asc) {
      _id,
      name,
      "displayName": ${localizedStrict("displayName")},
      "slug": slug.current,
      "issuer": ${localized("issuer")},
      "scope": ${localized("scope")},
      validThrough,
      "fileUrl": file.asset->url,
      "size": file.asset->size
    }
`;

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug][0]{
    ${PRODUCT_DETAIL_PROJECTION}
  }
`);

export const productsBySeriesQuery = defineQuery(`
  *[_type == "product" && (series == $series || $series in coalesce(crossListedSeries, []))] | order(function asc, model asc){
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
    "analogue": analogue[product->function != "MFM"]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": coalesce(product->massFlowSpecs.flowRange.display, product->massFlowSpecs.pressureRange.display),
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
      "cutout": product->cutout,
    },
    "digital": digital[product->function != "MFM"]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": coalesce(product->massFlowSpecs.flowRange.display, product->massFlowSpecs.pressureRange.display),
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
      "cutout": product->cutout,
    },
    "explosion-proof": specialized[product->function != "MFM"]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": coalesce(product->massFlowSpecs.flowRange.display, product->massFlowSpecs.pressureRange.display),
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
      "cutout": product->cutout,
    },
    "lepc": lepc[]{
      caption,
      "model": product->model,
      "slug": product->slug.current,
      "function": product->function,
      "flowRange": coalesce(product->massFlowSpecs.flowRange.display, product->massFlowSpecs.pressureRange.display),
      "accuracy": product->massFlowSpecs.accuracy.display,
      "image": product->images[0],
      "cutout": product->cutout,
    },
  }
`);

export const flagshipCutoutsQuery = defineQuery(`
  *[_type == "product" && lower(model) in $models]{
    model,
    cutout
  }
`);

export const allProductsQuery = defineQuery(`
  *[_type == "product" && defined(massFlowSpecs) && function in ["MFC", "MFM", "EPC"]]
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
  *[_type == "manual" && archived != true]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    models[0] asc
  ) {
    _id,
    title,
    "displayName": ${localizedStrict("displayName")},
    models,
    series,
    rev,
    publishedAt,
    "fileUrl": file.asset->url
  }
`);

export const allDrawingsQuery = defineQuery(`
  *[_type == "drawing" && archived != true]
  | order(
    select(series == "analogue" => 0, series == "digital" => 1, 2),
    models[0] asc
  ) {
    _id,
    title,
    "displayName": ${localizedStrict("displayName")},
    models,
    series,
    "dwgUrl": dwgFile.asset->url,
    "dwgSize": dwgFile.asset->size,
    "stpVariants": stpFiles[]{
      fitting,
      sortKey,
      "url": file.asset->url,
      "size": file.asset->size
    } | order(sortKey asc),
    "pdfUrl": pdfFile.asset->url,
    "pdfSize": pdfFile.asset->size
  }
`);

export const allSoftwareQuery = defineQuery(`
  *[_type == "software"] | order(coalesce(order, 99) asc) {
    _id,
    title,
    "displayName": ${localizedStrict("displayName")},
    version,
    models,
    publishedAt,
    "fileUrl": file.asset->url
  }
`);

export const allFaqGroupsQuery = defineQuery(`
  *[_type == "faqGroup"] | order(coalesce(order, 99) asc) {
    "id": id.current,
    "heading": ${localized("heading")},
    "questions": questions[] {
      id,
      "q": ${localized("q")},
      "a": ${localized("a")}
    }
  }
`);

const APPLICATION_PROJECTION = `
  "slug": slug.current,
  "title": ${localized("title")},
  "lede": ${localized("lede")},
  "body": ${localized("body")},
  recommendedSeries,
  relatedCategories,
  "featuredProduct": featuredProduct->{
    "slug": slug.current,
    model,
    series,
    "productLabel": ${localized("productLabel")},
    description,
    "flowRange": coalesce(massFlowSpecs.flowRange.display, massFlowSpecs.pressureRange.display),
    "image": images[0],
    cutout
  }
`;

export const allApplicationsQuery = defineQuery(`
  *[_type == "application"] | order(coalesce(order, 99) asc) {
    ${APPLICATION_PROJECTION}
  }
`);

export const applicationBySlugQuery = defineQuery(`
  *[_type == "application" && slug.current == $slug][0] {
    ${APPLICATION_PROJECTION}
  }
`);

export const applicationSlugsQuery = defineQuery(`
  *[_type == "application" && defined(slug.current)] {
    "slug": slug.current
  }
`);

export const resourceCountsQuery = defineQuery(`
  {
    "catalogues": count(*[_type == "catalogue"]),
    "manuals": count(*[_type == "manual" && archived != true]),
    "drawings": count(*[_type == "drawing" && archived != true]),
    "software": count(*[_type == "software"]),
    "certifications": count(*[_type == "certification"])
  }
`);

export const allCertificationsQuery = defineQuery(`
  *[_type == "certification"] | order(coalesce(order, 99) asc) {
    _id,
    name,
    "displayName": ${localizedStrict("displayName")},
    "slug": slug.current,
    "issuer": ${localized("issuer")},
    "scope": ${localized("scope")},
    validThrough,
    models,
    "fileUrl": file.asset->url
  }
`);
