/**
 * Verify a Cloudflare Turnstile token against the siteverify endpoint.
 * Set TURNSTILE_SECRET_KEY (server) and NEXT_PUBLIC_TURNSTILE_SITE_KEY
 * (client) to activate. Without TURNSTILE_SECRET_KEY, verification
 * fails closed by default. Set CAPTCHA_DEV_BYPASS=1 explicitly when
 * developing locally without a real Turnstile secret.
 */
const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type VerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string,
  remoteIp?: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (process.env.CAPTCHA_DEV_BYPASS === "1") return true;
    console.error("TURNSTILE_SECRET_KEY missing; failing closed");
    return false;
  }
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    const data = (await res.json()) as VerifyResponse;
    return data.success === true;
  } catch (err) {
    console.error("Turnstile verify failed", err);
    return false;
  }
}
