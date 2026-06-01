import {
  specRouteHandler,
  specRouteStaticParams,
} from "@/lib/products/specRouteHandler";

export const dynamic = "force-static";
export const revalidate = false;

export const generateStaticParams = specRouteStaticParams("json");
export const GET = specRouteHandler("json");
