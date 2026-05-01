import { buildLlmsManifest } from "@/lib/seo/llmsManifest";

export const dynamic = "force-static";
export const revalidate = false;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://line-tech.co";

export async function GET() {
  const content = await buildLlmsManifest(siteUrl);
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
