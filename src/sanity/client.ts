import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export const sanityBuildClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});
