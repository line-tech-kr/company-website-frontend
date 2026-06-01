import {
  specRouteHandler,
  specRouteStaticParams,
} from "@/lib/products/specRouteHandler";

export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = specRouteStaticParams("md");
export const GET = specRouteHandler("md");
