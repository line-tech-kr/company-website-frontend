import { Resend } from "resend";
import type { ContactFormPayload } from "./schema";

const TO = "info@linetech.co.kr";
// Use a verified sending domain once configured in Resend; fall back to the
// shared testing address during initial setup.
const FROM =
  process.env.RESEND_FROM ?? "Line Tech Contact <onboarding@resend.dev>";

function buildSubject(data: ContactFormPayload): string {
  const parts = [data.inquiryType];
  if (data.typeDetail) parts.push(`(${data.typeDetail})`);
  const who = data.company ? `${data.name} · ${data.company}` : data.name;
  return `[Contact Form] ${parts.join(" ")} — ${who}`;
}

function buildHtml(data: ContactFormPayload): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0">${value}</td></tr>`;

  const rows = [
    row("Inquiry type", data.inquiryType),
    ...(data.typeDetail ? [row("Detail", data.typeDetail)] : []),
    row("Name", data.name),
    row("Email", `<a href="mailto:${data.email}">${data.email}</a>`),
    ...(data.company ? [row("Company", data.company)] : []),
    ...(data.phone ? [row("Phone", data.phone)] : []),
    ...(data.subject ? [row("Subject", data.subject)] : []),
  ].join("");

  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="margin-bottom:16px">New contact form submission</h2>
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  <hr style="margin:24px 0">
  <h3 style="margin-bottom:8px">Message</h3>
  <p style="white-space:pre-wrap;margin:0">${data.message}</p>
</div>`;
}

export async function sendContactEmail(
  data: ContactFormPayload,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: FROM,
    to: TO,
    replyTo: data.email,
    subject: buildSubject(data),
    html: buildHtml(data),
  });

  if (error) {
    throw new Error(`Resend delivery failed: ${error.message}`);
  }
}
