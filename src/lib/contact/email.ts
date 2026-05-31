import { Resend } from "resend";
import type { ContactFormPayload } from "./schema";

const DEFAULT_TO = "linetech@line-tech.co.kr";

const INQUIRY_LABELS: Record<string, string> = {
  sales: "영업·견적",
  support: "기술 지원",
  "doc-request": "자료 요청",
  partnership: "협력·파트너십",
  general: "일반 문의",
  "site-visit": "현장 방문 지원",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatInquiryType(data: ContactFormPayload): string {
  const label = INQUIRY_LABELS[data.inquiryType] ?? data.inquiryType;
  return data.typeDetail ? `${label} (${data.typeDetail})` : label;
}

function buildReplyLinks(data: ContactFormPayload): {
  gmailHref: string;
  mailtoHref: string;
} {
  const subject = data.subject
    ? `Re: ${data.subject}`
    : `Re: ${formatInquiryType(data)} 문의`;
  const body = [
    `${data.name}님, 안녕하세요.`,
    "",
    "라인테크에 문의해 주셔서 감사합니다.",
    "",
  ].join("\n");

  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: data.email,
    su: subject,
    body,
  });
  const mailtoQuery = new URLSearchParams({
    subject,
    body,
  });

  return {
    gmailHref: `https://mail.google.com/mail/?${params.toString()}`,
    mailtoHref: `mailto:${data.email}?${mailtoQuery.toString()}`,
  };
}

function buildText(data: ContactFormPayload): string {
  const lines = [
    "라인테크 웹사이트 문의가 접수되었습니다.",
    "",
    `문의 유형: ${formatInquiryType(data)}`,
    `성함: ${data.name}`,
    `이메일: ${data.email}`,
    ...(data.company ? [`회사명: ${data.company}`] : []),
    ...(data.phone ? [`연락처: ${data.phone}`] : []),
    ...(data.subject ? [`제목: ${data.subject}`] : []),
    "",
    "문의 내용:",
    data.message,
    "",
    "Gmail 답장 버튼, 메일 앱 답장 버튼, 또는 이 메일의 기본 답장 기능으로 문의자에게 회신할 수 있습니다.",
  ];

  return lines.join("\n");
}

function buildSubject(data: ContactFormPayload): string {
  const inquiryType = formatInquiryType(data);
  const who = data.company ? `${data.name} · ${data.company}` : data.name;
  return `[라인테크 문의] ${inquiryType} - ${who}`;
}

function requireFromAddress(): string {
  const from = process.env.RESEND_FROM?.trim();
  if (!from) {
    throw new Error("RESEND_FROM is not set");
  }
  return from;
}

function recipientAddress(): string {
  return process.env.CONTACT_FORM_TO?.trim() || DEFAULT_TO;
}

function buildHtml(data: ContactFormPayload): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#475569;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 0;color:#0f172a;font-size:14px;vertical-align:top">${value}</td>
    </tr>`;

  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "";
  const replyLinks = buildReplyLinks(data);
  const phoneHref = data.phone
    ? `tel:${data.phone.replace(/[^\d+]/g, "")}`
    : null;

  const rows = [
    row("문의 유형", escapeHtml(formatInquiryType(data))),
    row("성함", escapeHtml(data.name)),
    row("이메일", `<a href="mailto:${safeEmail}">${safeEmail}</a>`),
    ...(data.company ? [row("회사명", escapeHtml(data.company))] : []),
    ...(data.phone
      ? [
          row(
            "연락처",
            phoneHref ? `<a href="${phoneHref}">${safePhone}</a>` : safePhone,
          ),
        ]
      : []),
    ...(data.subject ? [row("제목", escapeHtml(data.subject))] : []),
  ].join("");

  return `
<div style="margin:0;background:#f6f8fb;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ee;border-radius:10px;overflow:hidden">
    <div style="background:#0b4f81;color:#ffffff;padding:20px 24px">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#cfe5f6">LINE TECH WEBSITE</p>
      <h1 style="margin:0;font-size:22px;line-height:1.3">웹사이트 문의가 접수되었습니다</h1>
    </div>

    <div style="padding:22px 24px 8px">
      <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.6">
        Gmail 버튼을 누르면 문의자 이메일이 수신자로 입력된 작성 화면이 열립니다. 이 메일에 바로 답장해도 문의자에게 회신됩니다.
      </p>

      <div style="margin:0 0 22px">
        <a href="${escapeHtml(replyLinks.gmailHref)}" style="display:inline-block;background:#0b4f81;color:#ffffff;text-decoration:none;font-weight:700;border-radius:6px;padding:11px 16px;margin:0 8px 8px 0">${escapeHtml(data.name)}님께 Gmail로 답장하기</a>
        <a href="${escapeHtml(replyLinks.mailtoHref)}" style="display:inline-block;background:#eef5fb;color:#0b4f81;text-decoration:none;font-weight:700;border-radius:6px;padding:11px 16px;margin:0 8px 8px 0">메일 앱으로 답장하기</a>
        ${
          phoneHref
            ? `<a href="${phoneHref}" style="display:inline-block;background:#eef5fb;color:#0b4f81;text-decoration:none;font-weight:700;border-radius:6px;padding:11px 16px;margin:0 0 8px">${safePhone} 전화하기</a>`
            : ""
        }
      </div>

      <table style="border-collapse:collapse;width:100%;margin:0 0 22px">${rows}</table>

      <div style="border-top:1px solid #e2e8f0;padding-top:18px">
        <h2 style="margin:0 0 10px;font-size:15px;color:#0f172a">문의 내용</h2>
        <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;color:#0f172a;font-size:15px;line-height:1.7">${escapeHtml(data.message)}</div>
      </div>
    </div>

    <div style="padding:16px 24px 22px;color:#64748b;font-size:12px;line-height:1.5">
      라인테크 웹사이트 문의 양식에서 자동 발송된 메일입니다.
    </div>
  </div>
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
    from: requireFromAddress(),
    to: recipientAddress(),
    replyTo: data.email,
    subject: buildSubject(data),
    html: buildHtml(data),
    text: buildText(data),
  });

  if (error) {
    throw new Error(`Resend delivery failed: ${error.message}`);
  }
}
