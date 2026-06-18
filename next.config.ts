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

// 2020 → 2026 catalogue resync. Renamed SKUs go to their new slug; SKUs
// retired entirely fall back to the category index page so old bookmarks
// and search-index entries stay reachable.
const SLUG_REDIRECTS = [
  // 특수 → 방폭 (specialized → explosion-proof) category rename. The product
  // slugs are unchanged; only the category path moves. Bare category index and
  // each EX product redirect to the new slug.
  { from: "specialized", to: "explosion-proof" },
  { from: "specialized/ex70c", to: "explosion-proof/ex70c" },
  { from: "specialized/ex70m", to: "explosion-proof/ex70m" },
  { from: "specialized/ex1000c", to: "explosion-proof/ex1000c" },
  { from: "specialized/ex1000m", to: "explosion-proof/ex1000m" },
  // Read-out units moved out of the series to the accessories page.
  { from: "specialized/lti-1000", to: "accessories" },
  { from: "specialized/lti-2000", to: "accessories" },
  // Legacy 2020 SKU slugs (zero-padded / retired) → new slug under the renamed
  // category, or the category index when fully retired.
  { from: "specialized/ex070c", to: "explosion-proof/ex70c" },
  { from: "specialized/ex070m", to: "explosion-proof/ex70m" },
  { from: "digital/md100c", to: "digital/md150c" },
  { from: "digital/md100m", to: "digital/md150m" },
  { from: "specialized/ld030c", to: "explosion-proof" },
  { from: "specialized/ld030m", to: "explosion-proof" },
  { from: "specialized/lm030c", to: "explosion-proof" },
  { from: "specialized/lm030m", to: "explosion-proof" },
  { from: "analogue/m2100va", to: "analogue" },
  { from: "analogue/m3100va", to: "analogue" },
  { from: "analogue/m2200va", to: "analogue" },
  { from: "digital/md400c", to: "digital" },
  { from: "digital/md400m", to: "digital" },
  { from: "specialized/do400", to: "analogue/do400" },
];

const nextConfig: NextConfig = {
  async redirects() {
    const locales = ["ko", "en", "zh"];
    return locales.flatMap((locale) =>
      SLUG_REDIRECTS.map(({ from, to }) => ({
        source: `/${locale}/products/${from}`,
        destination: `/${locale}/products/${to}`,
        permanent: true,
      })),
    );
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default withNextIntl(nextConfig);
