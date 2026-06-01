import { sanityClient, sanityBuildClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productBySlugQuery, productSlugsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { buildSpecJson, buildSpecMarkdown } from "@/lib/seo/specSheet";
import { siteUrl } from "@/lib/seo";

type Format = "json" | "md";

const TELEMETRY = {
  json: { single: "specJson", list: "productSlugsForSpecJson" },
  md: { single: "specMd", list: "productSlugsForSpecMd" },
} as const;

export function specRouteStaticParams(format: Format) {
  return async function generateStaticParams() {
    const products = await fetchSanity(
      () =>
        sanityBuildClient.fetch<Array<{ slug: string; series: string }>>(
          productSlugsQuery,
        ),
      { name: TELEMETRY[format].list },
    );
    return products.map((p) => ({ slug: p.slug }));
  };
}

export function specRouteHandler(format: Format) {
  return async function GET(
    _req: Request,
    ctx: { params: Promise<{ slug: string }> },
  ) {
    const { slug } = await ctx.params;
    const raw = await fetchSanity(
      () => sanityClient.fetch(productBySlugQuery, { slug }),
      { name: TELEMETRY[format].single, params: { slug } },
    );
    const product = raw ? SanityProductSchema.parse(raw) : null;
    if (!product) return new Response("Not found", { status: 404 });
    if (format === "json") {
      return Response.json(buildSpecJson(product, siteUrl));
    }
    return new Response(buildSpecMarkdown(product, siteUrl), {
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  };
}
