import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
});
