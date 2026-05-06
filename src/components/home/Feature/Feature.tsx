import type { HomeContent } from "@/lib/content/home";
import { FeatureSection } from "./FeatureSection";
import "./Feature.css";

type Props = { h: HomeContent };

export function Feature({ h }: Props) {
  return <FeatureSection {...h.feature} />;
}
