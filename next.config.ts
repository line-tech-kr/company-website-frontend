import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const SANITY_CDN = "https://cdn.sanity.io";

const cspDirectives = [
  "default-src 'self'",
  // Next inlines small bootstrap scripts; allow only in production via 'self'.
  // 'unsafe-inline' on script-src is required for Next's inline runtime in
  // dev. Tighten with a nonce-based CSP later if SSR-only inlines remain.
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: ${SANITY_CDN}`,
  "font-src 'self' data:",
  `connect-src 'self' ${SANITY_CDN} https://*.sanity.io https://vitals.vercel-insights.com`,
  "frame-src https://challenges.cloudflare.com",
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

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
