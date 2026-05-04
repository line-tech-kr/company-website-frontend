import { sanityClient } from "@/sanity/client";
import { fetchSanity } from "@/sanity/fetch";
import { productBySlugQuery, productSlugsQuery } from "@/sanity/queries";
import { SanityProductSchema } from "@/lib/types/product";
import { buildSpecMarkdown } from "@/lib/seo/specSheet";

export const dynamic = "force-static";
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://line-tech.co";

export async function generateStaticParams() {
  const products = await fetchSanity(
    () => sanityClient.fetch<Array<{ slug: string; series: string }>>(productSlugsQuery),
    { name: "productSlugsForSpecMd" },
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
    { name: "specMd", params: { slug } },
  );
  const product = raw ? SanityProductSchema.parse(raw) : null;
  if (!product) return new Response("Not found", { status: 404 });
  return new Response(buildSpecMarkdown(product, siteUrl), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
