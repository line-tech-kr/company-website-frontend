import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./schema";

const validPayload = {
  inquiryType: "support",
  typeDetail: "M3030VA",
  name: "홍길동",
  email: "customer@example.com",
  company: "테스트 회사",
  phone: "+82 10-1234-5678",
  subject: "기술 문의",
  message: "안녕하세요. 제품 확인을 부탁드립니다.",
  consent: "on",
  website: "",
  "cf-turnstile-response": "test-token",
};

describe("contactFormSchema", () => {
  it("parses a fully populated payload", () => {
    const result = contactFormSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("parses a minimal payload with optionals omitted", () => {
    const minimal = {
      inquiryType: "sales",
      name: "Buyer",
      email: "buyer@example.com",
      message: "Quote please.",
      consent: "on",
      "cf-turnstile-response": "tok",
    };
    const result = contactFormSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it.each([
    ["inquiryType", { ...validPayload, inquiryType: "" }],
    ["name", { ...validPayload, name: "" }],
    ["email", { ...validPayload, email: "not-an-email" }],
    ["message", { ...validPayload, message: "" }],
    ["cf-turnstile-response", { ...validPayload, "cf-turnstile-response": "" }],
  ])("rejects payload with empty/invalid %s", (_field, payload) => {
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects missing consent (PIPA Art. 22)", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.consent;
    expect(contactFormSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects consent values other than 'on'", () => {
    expect(
      contactFormSchema.safeParse({ ...validPayload, consent: "true" }).success,
    ).toBe(false);
  });

  it("rejects message over 5000 chars", () => {
    const payload = { ...validPayload, message: "a".repeat(5001) };
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects name over 120 chars", () => {
    const payload = { ...validPayload, name: "a".repeat(121) };
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects email over 254 chars", () => {
    const local = "a".repeat(250);
    const payload = { ...validPayload, email: `${local}@x.io` };
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects honeypot when website is non-empty", () => {
    const payload = { ...validPayload, website: "trap" };
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("defaults website to empty string when omitted", () => {
    const rest: Record<string, unknown> = { ...validPayload };
    delete rest.website;
    const result = contactFormSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe("");
  });
});
