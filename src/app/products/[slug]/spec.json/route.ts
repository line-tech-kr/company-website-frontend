import {
  specRouteGET,
  specRouteStaticParams,
} from "@/lib/products/specRouteHandler";

export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return specRouteStaticParams("json");
}

export function GET(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  return specRouteGET("json", req, ctx);
}
