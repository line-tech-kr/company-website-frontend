import { Resend } from "resend";
import { formatGasSummary, type ContactFormPayload } from "./schema";

const DEFAULT_TO = "linetech@line-tech.co.kr";

const INQUIRY_LABELS: Record<string, string> = {
  quote: "견적 요청",
  sales: "영업 문의",
  support: "기술 지원",
  "doc-request": "자료 요청",
  partnership: "협력·파트너십",
  general: "일반 문의",
  "site-visit": "현장 방문 지원",
};

function formatFlow(data: ContactFormPayload): string | null {
  if (!data.flowValue) return null;
  return data.flowUnit ? `${data.flowValue} ${data.flowUnit}` : data.flowValue;
}

function formatPressure(data: ContactFormPayload): string | null {
  if (!data.pressureValue) return null;
  return data.pressureUnit
    ? `${data.pressureValue} ${data.pressureUnit}`
    : data.pressureValue;
}

function formatFitting(data: ContactFormPayload): string | null {
  if (!data.fittingType && !data.fittingSize) return null;
  const parts = [data.fittingType, data.fittingSize].filter((s): s is string =>
    Boolean(s && s.trim()),
  );
  return parts.length > 0 ? parts.join(" · ") : null;
}

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
  const gasSummary =
    data.inquiryType === "quote" ? formatGasSummary(data) : null;
  const quoteLines =
    data.inquiryType === "quote"
      ? [
          "",
          "공정 조건:",
          ...(data.model ? [`- 모델: ${data.model}`] : []),
          ...(gasSummary ? [`- 가스: ${gasSummary}`] : []),
          ...(formatFlow(data) ? [`- 유량: ${formatFlow(data)}`] : []),
          ...(formatPressure(data) ? [`- 압력: ${formatPressure(data)}`] : []),
          ...(formatFitting(data) ? [`- 피팅: ${formatFitting(data)}`] : []),
        ]
      : [];

  const lines = [
    "라인테크 웹사이트 문의가 접수되었습니다.",
    "",
    `문의 유형: ${formatInquiryType(data)}`,
    `성함: ${data.name}`,
    `이메일: ${data.email}`,
    ...(data.company ? [`회사명: ${data.company}`] : []),
    ...(data.phone ? [`연락처: ${data.phone}`] : []),
    ...(data.subject ? [`제목: ${data.subject}`] : []),
    ...quoteLines,
    "",
    "문의 내용:",
    data.message,
    "",
    "이 메일에 그대로 답장하면 문의자에게 회신됩니다. (Gmail·메일 앱 답장 링크도 본문 하단에 있습니다.)",
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

function recipientAddresses(): string[] {
  const recipients = (process.env.CONTACT_FORM_TO ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => entry.includes("@"));
  const deduped = Array.from(new Set(recipients));
  return deduped.length > 0 ? deduped : [DEFAULT_TO];
}

function buildHtml(data: ContactFormPayload): string {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 16px 8px 0;color:#475569;font-size:13px;font-weight:600;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="padding:8px 0;color:#0f172a;font-size:14px;vertical-align:top">${value}</td>
    </tr>`;

  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safePhone = data.phone ? escapeHtml(data.phone) : "";
  const replyLinks = buildReplyLinks(data);
  const phoneHref = data.phone
    ? `tel:${data.phone.replace(/[^\d+]/g, "")}`
    : null;

  const contactLineStyle =
    "margin:0;font-size:18px;line-height:1.45;color:#0f172a;font-weight:600;word-break:break-all";
  const contactRows = [
    `<p style="${contactLineStyle}"><span style="display:inline-block;min-width:64px;color:#475569;font-size:13px;font-weight:600;vertical-align:middle;margin-right:8px">이메일</span><a href="mailto:${safeEmail}" style="color:#0b4f81;text-decoration:none">${safeEmail}</a></p>`,
    ...(data.phone
      ? [
          `<p style="${contactLineStyle};margin-top:6px"><span style="display:inline-block;min-width:64px;color:#475569;font-size:13px;font-weight:600;vertical-align:middle;margin-right:8px">연락처</span>${
            phoneHref
              ? `<a href="${phoneHref}" style="color:#0b4f81;text-decoration:none">${safePhone}</a>`
              : safePhone
          }</p>`,
        ]
      : []),
  ].join("");

  const isQuote = data.inquiryType === "quote";
  const gasText = isQuote ? formatGasSummary(data) : null;
  const flowText = formatFlow(data);
  const pressureText = formatPressure(data);
  const fittingText = formatFitting(data);

  const rows = [
    row("문의 유형", escapeHtml(formatInquiryType(data))),
    ...(data.company ? [row("회사명", escapeHtml(data.company))] : []),
    ...(data.subject ? [row("제목", escapeHtml(data.subject))] : []),
    ...(isQuote && data.model ? [row("모델", escapeHtml(data.model))] : []),
    ...(isQuote && gasText ? [row("가스", escapeHtml(gasText))] : []),
    ...(isQuote && flowText ? [row("유량", escapeHtml(flowText))] : []),
    ...(isQuote && pressureText ? [row("압력", escapeHtml(pressureText))] : []),
    ...(isQuote && fittingText ? [row("피팅", escapeHtml(fittingText))] : []),
  ].join("");

  const secondaryLinkStyle =
    "color:#0b4f81;text-decoration:underline;font-size:13px";
  const secondaryParts = [
    `<a href="${escapeHtml(replyLinks.gmailHref)}" style="${secondaryLinkStyle}">Gmail로 답장</a>`,
    `<a href="${escapeHtml(replyLinks.mailtoHref)}" style="${secondaryLinkStyle}">메일 앱으로 답장</a>`,
    ...(phoneHref
      ? [`<a href="${phoneHref}" style="${secondaryLinkStyle}">전화하기</a>`]
      : []),
  ].join(' <span style="color:#cbd5e1">·</span> ');

  return `
<div style="margin:0;background:#f6f8fb;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;border:1px solid #dbe3ee;border-radius:10px;overflow:hidden">
    <div style="background:#0b4f81;color:#ffffff;padding:20px 24px">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#cfe5f6">LINE TECH WEBSITE</p>
      <h1 style="margin:0;font-size:22px;line-height:1.3">웹사이트 문의가 접수되었습니다</h1>
    </div>

    <div style="padding:22px 24px 8px">
      <div style="margin:0 0 18px;background:#f1f6fb;border:1px solid #dbe7f3;border-radius:8px;padding:16px 18px">
        <p style="margin:0 0 10px;color:#475569;font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase">답장 받는 분 — ${safeName}</p>
        ${contactRows}
      </div>

      <p style="margin:0 0 18px;color:#475569;font-size:14px;line-height:1.6">
        이 메일에 그대로 답장하면 위 문의자에게 회신됩니다.
      </p>

      <table style="border-collapse:collapse;width:100%;margin:0 0 22px">${rows}</table>

      <div style="border-top:1px solid #e2e8f0;padding-top:18px">
        <h2 style="margin:0 0 10px;font-size:15px;color:#0f172a">문의 내용</h2>
        <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;color:#0f172a;font-size:15px;line-height:1.7">${escapeHtml(data.message)}</div>
      </div>

      <p style="margin:18px 0 0;color:#64748b;font-size:13px;line-height:1.6">
        또는 ${secondaryParts}
      </p>
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
    to: recipientAddresses(),
    replyTo: data.email,
    subject: buildSubject(data),
    html: buildHtml(data),
    text: buildText(data),
  });

  if (error) {
    throw new Error(`Resend delivery failed: ${error.message}`);
  }
}
