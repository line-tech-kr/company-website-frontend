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

  it("sends Korean content with Gmail, mail-app, and phone actions", async () => {
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

  it("falls back to the default when all entries are malformed", async () => {
    vi.stubEnv("CONTACT_FORM_TO", "nope, also-nope");

    await sendContactEmail(payload);

    const email = sendMock.mock.calls[0]![0];
    expect(email.to).toEqual(["linetech@line-tech.co.kr"]);
  });
});
