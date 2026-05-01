"use server";

import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { contactFormSchema } from "./schema";
import { checkContactRateLimit } from "./rate-limit";
import { verifyTurnstile } from "./captcha";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  errorKey?: "invalid" | "rateLimited" | "captcha" | "server";
};

async function getClientIp(): Promise<string> {
  const h = await headers();
  // Vercel sets x-forwarded-for with a comma-separated chain. The leftmost
  // entry is the original client. Fallback to x-real-ip, then a sentinel.
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return h.get("x-real-ip") ?? "0.0.0.0";
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData.entries());

  // Honeypot — drop silently with a generic invalid response so bots
  // can't distinguish honeypot trips from validation failures.
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { status: "error", errorKey: "invalid" };
  }

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errorKey: "invalid" };
  }

  const ip = await getClientIp();

  const rateOk = await checkContactRateLimit(ip);
  if (!rateOk) {
    return { status: "error", errorKey: "rateLimited" };
  }

  const captchaOk = await verifyTurnstile(
    parsed.data["cf-turnstile-response"],
    ip,
  );
  if (!captchaOk) {
    return { status: "error", errorKey: "captcha" };
  }

  // Persisting the submission is out of scope for this scaffold — wire to
  // Resend/SendGrid/route handler/Sanity-as-store here. We log a redacted
  // record so submissions are auditable in Vercel logs while we don't yet
  // have a transport.
  try {
    const { name: _name, email: _email, ...redacted } = parsed.data;
    console.log("contact_submission", {
      ts: Date.now(),
      ip,
      inquiryType: parsed.data.inquiryType,
      hasCompany: Boolean(parsed.data.company),
      hasPhone: Boolean(parsed.data.phone),
      messageLength: parsed.data.message.length,
      _redacted: Object.keys(redacted),
    });
  } catch (err) {
    console.error("contact_submission_log_failed", err);
    return { status: "error", errorKey: "server" };
  }

  // Don't echo user input back to the response — minimises reflected-XSS
  // surface and avoids leaking what was submitted via shared error pages.
  return { status: "success" };
}

export async function getContactCopy() {
  const t = await getTranslations("contactForm");
  return {
    errors: {
      invalid: t("errors.invalid"),
      rateLimited: t("errors.rateLimited"),
      captcha: t("errors.captcha"),
      server: t("errors.server"),
    },
    success: t("success"),
    submitting: t("submitting"),
  };
}
