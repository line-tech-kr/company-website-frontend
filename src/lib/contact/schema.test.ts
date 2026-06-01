import { describe, it, expect } from "vitest";
import { contactFormSchema } from "./schema";
import {
  contactPayloadFixture,
  makeContactPayload,
} from "@/test/fixtures/contact";

describe("contactFormSchema", () => {
  it("parses a fully populated payload", () => {
    const result = contactFormSchema.safeParse(contactPayloadFixture);
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
    ["inquiryType", makeContactPayload({ inquiryType: "" })],
    ["name", makeContactPayload({ name: "" })],
    ["email", makeContactPayload({ email: "not-an-email" })],
    ["message", makeContactPayload({ message: "" })],
    [
      "cf-turnstile-response",
      makeContactPayload({ "cf-turnstile-response": "" }),
    ],
  ])("rejects payload with empty/invalid %s", (_field, payload) => {
    expect(contactFormSchema.safeParse(payload).success).toBe(false);
  });

  it("rejects missing consent (PIPA Art. 22)", () => {
    const rest: Record<string, unknown> = { ...contactPayloadFixture };
    delete rest.consent;
    expect(contactFormSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects consent values other than 'on'", () => {
    expect(
      contactFormSchema.safeParse({ ...contactPayloadFixture, consent: "true" })
        .success,
    ).toBe(false);
  });

  it("rejects message over 5000 chars", () => {
    expect(
      contactFormSchema.safeParse(
        makeContactPayload({ message: "a".repeat(5001) }),
      ).success,
    ).toBe(false);
  });

  it("rejects name over 120 chars", () => {
    expect(
      contactFormSchema.safeParse(makeContactPayload({ name: "a".repeat(121) }))
        .success,
    ).toBe(false);
  });

  it("rejects email over 254 chars", () => {
    const local = "a".repeat(250);
    expect(
      contactFormSchema.safeParse(
        makeContactPayload({ email: `${local}@x.io` }),
      ).success,
    ).toBe(false);
  });

  it("rejects honeypot when website is non-empty", () => {
    expect(
      contactFormSchema.safeParse(makeContactPayload({ website: "trap" }))
        .success,
    ).toBe(false);
  });

  it("defaults website to empty string when omitted", () => {
    const rest: Record<string, unknown> = { ...contactPayloadFixture };
    delete rest.website;
    const result = contactFormSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.website).toBe("");
  });
});
