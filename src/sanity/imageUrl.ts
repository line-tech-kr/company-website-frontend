import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
  builder.image(source);
