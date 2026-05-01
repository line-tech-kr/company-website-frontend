import { z } from "zod";

/**
 * Server-side schema for the public contact form. Mirrors the visible
 * fields plus the honeypot and Turnstile token. Errors here are mapped to
 * a single user-facing "invalid" message; we never echo specific field
 * messages back, since attackers can use them to probe validation.
 */
export const contactFormSchema = z.object({
  inquiryType: z.string().min(1).max(64),
  typeDetail: z.string().max(200).optional(),
  name: z.string().min(1).max(120),
  email: z.string().email().max(254),
  company: z.string().max(200).optional(),
  phone: z.string().max(40).optional(),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
  // Honeypot: a hidden field that real users never fill. Bots typically
  // populate every input. Reject submissions where this is non-empty.
  website: z.string().max(0).optional().default(""),
  // Cloudflare Turnstile token, posted automatically by the widget into
  // an input named `cf-turnstile-response`.
  "cf-turnstile-response": z.string().min(1),
});

export type ContactFormPayload = z.infer<typeof contactFormSchema>;
