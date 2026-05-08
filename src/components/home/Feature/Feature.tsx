import type { HomeContent } from "@/lib/content/home";
import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { flagshipCutoutsQuery } from "@/sanity/queries";
import { FLAGSHIP_MODEL, flagshipCutoutUrl } from "@/lib/products/flagship";
import { FeatureSection } from "./FeatureSection";
import "./Feature.css";

type Props = { h: HomeContent };

const FLAGSHIP_MODELS_LOWER = Object.values(FLAGSHIP_MODEL)
  .filter((m): m is string => typeof m === "string")
  .map((m) => m.toLowerCase());

export async function Feature({ h }: Props) {
  const rows = await fetchSanity(
    () =>
      sanityClient.fetch(flagshipCutoutsQuery, {
        models: FLAGSHIP_MODELS_LOWER,
      }),
    { name: "flagshipCutouts" },
  );

  const cutoutByModel: Record<string, string> = {};
  for (const row of rows) {
    if (!row.model) continue;
    cutoutByModel[row.model] = flagshipCutoutUrl(row.model, row.cutout ?? null);
  }

  return <FeatureSection {...h.feature} cutoutByModel={cutoutByModel} />;
}
