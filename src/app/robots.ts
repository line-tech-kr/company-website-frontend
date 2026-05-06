import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

// Training-only harvesters — no user-facing AI assistant answers, so no discoverability return.
// User-facing assistant bots (GPTBot, PerplexityBot, Claude-User, etc.) are left unrestricted.
const TRAINING_ONLY_BOTS = [
  "CCBot",
  "Google-Extended",
  "Bytespider",
  "ClaudeBot",
  "Diffbot",
  "meta-externalagent",
  "OmgiliBot",
  "Timpibot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio"] },
      ...TRAINING_ONLY_BOTS.map((bot) => ({ userAgent: bot, disallow: "/" })),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
