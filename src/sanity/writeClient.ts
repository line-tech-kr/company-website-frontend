import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

const writeToken = (() => {
  const v = process.env.SANITY_WRITE_TOKEN;
  if (!v) throw new Error("Missing env var: SANITY_WRITE_TOKEN");
  return v;
})();

// Separate write-capable client — uses the server-only SANITY_WRITE_TOKEN.
// Never import this in client components.
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: writeToken,
});
