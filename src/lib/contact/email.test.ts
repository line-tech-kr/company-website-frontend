import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactFormPayload } from "./schema";
import { sendContactEmail } from "./email";

const { sendMock } = vi.hoisted(() => ({
  sendMock: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const STUBBED_FROM = "Line Tech Contact <linetech@line-tech.co.kr>";

const payload: ContactFormPayload = {
  inquiryType: "support",
  typeDetail: "M3030VA",
  name: "홍길동",
  email: "customer@example.com",
  company: "테스트 회사",
  phone: "+82 10-1234-5678",
  subject: "기술 문의",
  message: "제품 확인을 부탁드립니다.",
  consent: "on",
  website: "",
  "cf-turnstile-response": "test-token",
};

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubEnv("RESEND_FROM", STUBBED_FROM);
    vi.stubEnv("CONTACT_FORM_TO", "recipient@example.com");
    sendMock.mockReset();
    sendMock.mockResolvedValue({ error: null });
  });

  it("requires an explicitly configured sender address", async () => {
    vi.stubEnv("RESEND_FROM", "");

    await expect(sendContactEmail(payload)).rejects.toThrow(
      "RESEND_FROM is not set",
    );
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("promotes the inquirer contact block and demotes Gmail/mail-app/phone to secondary links", async () => {
    await sendContactEmail(payload);

    expect(sendMock).toHaveBeenCalledOnce();
    const email = sendMock.mock.calls[0]![0];

    expect(email).toMatchObject({
      from: STUBBED_FROM,
      to: ["recipient@example.com"],
      replyTo: "customer@example.com",
    });
    expect(email.subject).toContain("[라인테크 문의]");
    expect(email.html).toContain("to=customer%40example.com");
    expect(email.html).toContain("mailto:customer@example.com?");
    expect(email.html).toContain("tel:+821012345678");
    expect(email.text).toContain("문의 내용:");
    expect(email.text).toContain("이 메일에 그대로 답장하면");

    expect(email.html).toContain("답장 받는 분 — 홍길동");
    const html: string = email.html;
    const contactBlockIdx = html.indexOf("답장 받는 분");
    const inquiryTypeRowIdx = html.indexOf("문의 유형");
    const emailInBlockIdx = html.indexOf("customer@example.com");
    expect(contactBlockIdx).toBeGreaterThan(-1);
    expect(emailInBlockIdx).toBeGreaterThan(contactBlockIdx);
    expect(inquiryTypeRowIdx).toBeGreaterThan(emailInBlockIdx);

    expect(html).not.toMatch(/Gmail로 답장하기/);
    expect(html).toContain("Gmail로 답장");
    expect(html).toContain("또는");
  });

  it("renders the contact block without a phone line when phone is absent", async () => {
    const { phone: _phone, ...rest } = payload;
    await sendContactEmail(rest);

    const email = sendMock.mock.calls[0]![0];
    const html: string = email.html;

    expect(html).toContain("답장 받는 분 — 홍길동");
    expect(html).toContain("customer@example.com");
    expect(html).not.toContain("연락처");
    expect(html).not.toContain("tel:");
    expect(html).not.toContain("전화하기");

    expect(html).toContain("Gmail로 답장");
    expect(html).toContain("메일 앱으로 답장");

    expect(email.text).not.toContain("연락처:");
  });

  it("splits CONTACT_FORM_TO on commas and trims whitespace", async () => {
    vi.stubEnv(
      "CONTACT_FORM_TO",
      "a@example.com, b@example.com ,, c@example.com",
    );

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual([
      "a@example.com",
      "b@example.com",
      "c@example.com",
    ]);
  });

  it("falls back to the default recipient when CONTACT_FORM_TO is unset", async () => {
    vi.stubEnv("CONTACT_FORM_TO", "");

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["linetech@line-tech.co.kr"]);
  });

  it("trims surrounding whitespace on a single recipient", async () => {
    vi.stubEnv("CONTACT_FORM_TO", "  a@example.com   ");

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["a@example.com"]);
  });

  it("deduplicates repeated recipients", async () => {
    vi.stubEnv(
      "CONTACT_FORM_TO",
      "a@example.com, a@example.com, b@example.com",
    );

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["a@example.com", "b@example.com"]);
  });

  it("drops entries that don't look like email addresses", async () => {
    vi.stubEnv(
      "CONTACT_FORM_TO",
      "valid@example.com, not-an-email, another@example.com",
    );

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["valid@example.com", "another@example.com"]);
  });

  it("includes the model in the quote details when supplied", async () => {
    const quote: ContactFormPayload = {
      inquiryType: "quote",
      name: "Buyer",
      email: "buyer@example.com",
      message: "Quote please.",
      model: "M3030VA",
      gasMode: "pure",
      gas: "N2",
      flowValue: "500",
      flowUnit: "sccm",
      pressureValue: "2",
      pressureUnit: "bar",
      fittingType: "VCR",
      fittingSize: '1/4"',
      consent: "on",
      website: "",
      "cf-turnstile-response": "tok",
    };

    await sendContactEmail(quote);

    const email = sendMock.mock.calls[0]![0];
    expect(email.html).toContain("모델");
    expect(email.html).toContain("M3030VA");
    expect(email.text).toContain("- 모델: M3030VA");
  });

  it("omits the model row from the quote details when not supplied", async () => {
    const quote: ContactFormPayload = {
      inquiryType: "quote",
      name: "Buyer",
      email: "buyer@example.com",
      message: "Quote please.",
      gasMode: "pure",
      gas: "N2",
      flowValue: "500",
      flowUnit: "sccm",
      pressureValue: "2",
      pressureUnit: "bar",
      fittingType: "VCR",
      fittingSize: '1/4"',
      consent: "on",
      website: "",
      "cf-turnstile-response": "tok",
    };

    await sendContactEmail(quote);

    const email = sendMock.mock.calls[0]![0];
    expect(email.text).not.toContain("- 모델:");
    // The HTML quote-details table should not include a 모델 row.
    expect(email.html).not.toMatch(/>모델</);
  });

  it("falls back to the default when all entries are malformed", async () => {
    vi.stubEnv("CONTACT_FORM_TO", "nope, also-nope");

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["linetech@line-tech.co.kr"]);
  });
});
