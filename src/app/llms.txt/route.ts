import { buildLlmsManifest } from "@/lib/seo/llmsManifest";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const content = await buildLlmsManifest(siteUrl);
  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
