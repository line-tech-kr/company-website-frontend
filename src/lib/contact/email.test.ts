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
    vi.stubEnv("RESEND_FROM", "Line Tech Contact <linetech@line-tech.co>");
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
      from: "Line Tech Contact <linetech@line-tech.co>",
      to: "recipient@example.com",
      replyTo: "customer@example.com",
    });
    expect(email.subject).toContain("[라인테크 문의]");
    expect(email.html).toContain("to=customer%40example.com");
    expect(email.html).toContain("mailto:customer@example.com?");
    expect(email.html).toContain("tel:+821012345678");
    expect(email.text).toContain("문의 내용:");
  });
});
