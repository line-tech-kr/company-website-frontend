import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source: Parameters<typeof builder.image>[0]) =>
  builder.image(source);
