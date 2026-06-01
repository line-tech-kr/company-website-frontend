import {
  specRouteGET,
  specRouteStaticParams,
} from "@/lib/products/specRouteHandler";

export const dynamic = "force-static";
export const revalidate = false;

export function generateStaticParams() {
  return specRouteStaticParams("md");
}

export function GET(
  req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  return specRouteGET("md", req, ctx);
}
