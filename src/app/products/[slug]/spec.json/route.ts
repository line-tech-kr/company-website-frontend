import { sanityClient, sanityBuildClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productBySlugQuery, productSlugsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { buildSpecJson } from "@/lib/seo/specSheet";

export const dynamic = "force-static";
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://line-tech.co";

export async function generateStaticParams() {
  const products = await fetchSanity(
    () => sanityBuildClient.fetch<Array<{ slug: string; series: string }>>(productSlugsQuery),
    { name: "productSlugsForSpecJson" },
  );
  return products.map((p) => ({ slug: p.slug }));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const raw = await fetchSanity(
    () => sanityClient.fetch(productBySlugQuery, { slug }),
    { name: "specJson", params: { slug } },
  );
  const product = raw ? SanityProductSchema.parse(raw) : null;
  if (!product) return new Response("Not found", { status: 404 });
  return Response.json(buildSpecJson(product, siteUrl));
}
