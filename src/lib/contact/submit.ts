"use server";

import { headers } from "next/headers";
import { contactFormSchema } from "./schema";
import { checkContactRateLimit } from "./rate-limit";
import { verifyTurnstile } from "./captcha";
import { persistContactSubmission } from "./persist";
import { sendContactEmail } from "./email";

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

  // Persist to Sanity first (best-effort — a write failure doesn't block the email).
  try {
    await persistContactSubmission(parsed.data, ip);
  } catch (err) {
    console.error("contact_submission_persist_failed", err);
  }

  // Send email — primary channel. Failure surfaces an error to the user.
  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    console.error("contact_submission_email_failed", err);
    return { status: "error", errorKey: "server" };
  }

  // Don't echo user input back to the response — minimises reflected-XSS
  // surface and avoids leaking what was submitted via shared error pages.
  return { status: "success" };
}
