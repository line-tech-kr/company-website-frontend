import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const SANITY_CDN = "https://cdn.sanity.io";

// Evaluated at Next.js config load time (build time on Vercel), not per request.
const isDevBuild = process.env.NODE_ENV === "development";

const cspDirectives = [
  "default-src 'self'",
  // Next inlines small bootstrap scripts; allow only in production via 'self'.
  // 'unsafe-inline' on script-src is required for Next's inline runtime in
  // dev. Tighten with a nonce-based CSP later if SSR-only inlines remain.
  // 'unsafe-eval' is required by React dev tools (callstack reconstruction) but must never ship to prod.
  `script-src 'self' 'unsafe-inline'${isDevBuild ? " 'unsafe-eval'" : ""} https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SANITY_CDN}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SANITY_CDN} https://*.sanity.io https://vitals.vercel-insights.com`,
  "frame-src https://challenges.cloudflare.com https://www.google.com/maps/",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

// 2026-cutover redirects. The 2026 catalogue retires LD/LM/M2100/M3100 and
// renames EX070→EX70, MD100→MD150. These rules keep old URLs (bookmarks,
// search index entries, external links) reachable. Each rule is fanned out
// across the three locales.
const PRODUCT_PATH_REDIRECTS: { from: string; to: string }[] = [
  // Retired (2020-only): redirect to category index
  { from: "/products/specialized/ld030c", to: "/products/specialized" },
  { from: "/products/specialized/ld030m", to: "/products/specialized" },
  { from: "/products/specialized/lm030c", to: "/products/specialized" },
  { from: "/products/specialized/lm030m", to: "/products/specialized" },
  { from: "/products/analogue/m2100va", to: "/products/analogue" },
  { from: "/products/analogue/m3100va", to: "/products/analogue" },
  // Renamed: redirect to new slug
  { from: "/products/specialized/ex070c", to: "/products/specialized/ex70c" },
  { from: "/products/specialized/ex070m", to: "/products/specialized/ex70m" },
  { from: "/products/digital/md100c", to: "/products/digital/md150c" },
  { from: "/products/digital/md100m", to: "/products/digital/md150m" },
];

const REDIRECT_LOCALES = ["ko", "en", "zh"] as const;

const productRedirects = PRODUCT_PATH_REDIRECTS.flatMap(({ from, to }) =>
  REDIRECT_LOCALES.map((locale) => ({
    source: `/${locale}${from}`,
    destination: `/${locale}${to}`,
    permanent: true as const,
  })),
);

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return productRedirects;
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default withNextIntl(nextConfig);
