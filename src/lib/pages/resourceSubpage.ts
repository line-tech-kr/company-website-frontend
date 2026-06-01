import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export type ResourceSubpageKind =
  | "datasheets"
  | "manuals"
  | "catalogues"
  | "drawings";

export type ResourceSubpageContext = {
  tCommon: Awaited<ReturnType<typeof getTranslations<"common">>>;
  tNav: Awaited<ReturnType<typeof getTranslations<"nav">>>;
  tRes: Awaited<ReturnType<typeof getTranslations<"resources">>>;
  breadcrumbs: Array<{ label: string; href?: string }>;
  title: string;
  intro: string;
};

export async function getResourceSubpageContext(
  locale: string,
  kind: ResourceSubpageKind,
): Promise<ResourceSubpageContext> {
  setRequestLocale(locale);
  const [tCommon, tNav, tRes] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("resources"),
  ]);
  return {
    tCommon,
    tNav,
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
