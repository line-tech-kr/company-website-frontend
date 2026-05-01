"use client";

import Script from "next/script";

type Props = {
  /** Cloudflare Turnstile site key. Set NEXT_PUBLIC_TURNSTILE_SITE_KEY in env. */
  siteKey: string;
};

/**
 * Mounts the Cloudflare Turnstile widget. The script auto-initializes any
 * `.cf-turnstile` element and posts the verification token into a hidden
 * input named `cf-turnstile-response` within the same form.
 */
export function Turnstile({ siteKey }: Props) {
  if (!siteKey) return null;
  return (
    <>
      <div className="cf-turnstile" data-sitekey={siteKey} />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        async
        defer
      />
    </>
  );
}
