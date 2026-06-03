import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export type ResourceSubpageKind = "manuals" | "catalogues" | "drawings";

export type Series = "analogue" | "digital" | "specialized";
export const SERIES_ORDER: Series[] = ["analogue", "digital", "specialized"];

export type ResourceSubpageContext = {
  tRes: Awaited<ReturnType<typeof getTranslations<"resources">>>;
  breadcrumbs: Array<{ label: string; href?: string }>;
  title: string;
  intro: string;
};

export async function getResourceSubpageContext(
  kind: ResourceSubpageKind,
): Promise<ResourceSubpageContext> {
  const [tCommon, tNav, tRes] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
  ]);
  return {
    tRes,
    breadcrumbs: [
      { label: tCommon("home"), href: "/" },
      { label: tNav("dataRoom"), href: "/resources" },
      { label: tRes(`${kind}.title`) },
    ],
    title: tRes(`${kind}.title`),
    intro: tRes(`${kind}.intro`),
  };
}

export function resourceSubpageStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
