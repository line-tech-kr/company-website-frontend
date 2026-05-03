import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

// Separate write-capable client — uses the server-only SANITY_WRITE_TOKEN.
// Never import this in client components.
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});
