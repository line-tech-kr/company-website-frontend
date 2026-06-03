import { describe, it, expect } from "vitest";
import { contactFormSchema, formatGasSummary, formatPercent } from "./schema";
import {
  contactPayloadFixture,
  makeContactPayload,
  makeQuotePayload,
  quoteMixturePayloadFixture,
  quotePayloadFixture,
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

  describe("quote inquiries", () => {
    it("accepts a fully populated pure-gas quote payload", () => {
      const result = contactFormSchema.safeParse(quotePayloadFixture);
      expect(result.success).toBe(true);
    });

    it("accepts a fully populated mixture quote payload", () => {
      const result = contactFormSchema.safeParse(quoteMixturePayloadFixture);
      expect(result.success).toBe(true);
    });

    it.each([
      "gas",
      "flowValue",
      "flowUnit",
      "pressureValue",
      "pressureUnit",
      "fittingType",
      "fittingSize",
    ] as const)("rejects a pure quote payload missing %s", (field) => {
      const payload = makeQuotePayload({ [field]: "" });
      const result = contactFormSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const fieldErrors = result.error.flatten().fieldErrors;
        expect(fieldErrors[field]).toBeDefined();
      }
    });

    it("rejects a quote payload with an unknown gas mode", () => {
      const result = contactFormSchema.safeParse(
        makeQuotePayload({ gasMode: "liquid" }),
      );
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.gasMode).toBeDefined();
      }
    });

    it("rejects a mixture payload that doesn't sum to 100", () => {
      const payload = {
        ...quoteMixturePayloadFixture,
        gasComponents: JSON.stringify([
          { gas: "SiH4", percent: 5 },
          { gas: "N2", percent: 80 },
        ]),
      };
      const result = contactFormSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.gasComponents).toBeDefined();
      }
    });

    it("rejects a mixture payload with only one component", () => {
      const payload = {
        ...quoteMixturePayloadFixture,
        gasComponents: JSON.stringify([{ gas: "N2", percent: 100 }]),
      };
      expect(contactFormSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects a mixture payload with a blank component name", () => {
      const payload = {
        ...quoteMixturePayloadFixture,
        gasComponents: JSON.stringify([
          { gas: "", percent: 5 },
          { gas: "N2", percent: 95 },
        ]),
      };
      expect(contactFormSchema.safeParse(payload).success).toBe(false);
    });

    it("rejects malformed gasComponents JSON", () => {
      const payload = {
        ...quoteMixturePayloadFixture,
        gasComponents: "not json",
      };
      expect(contactFormSchema.safeParse(payload).success).toBe(false);
    });

    it("formats gas summaries", () => {
      const pure = contactFormSchema.safeParse(quotePayloadFixture);
      expect(pure.success).toBe(true);
      if (pure.success) {
        expect(formatGasSummary(pure.data)).toBe("N2");
      }
      const mix = contactFormSchema.safeParse(quoteMixturePayloadFixture);
      expect(mix.success).toBe(true);
      if (mix.success) {
        expect(formatGasSummary(mix.data)).toBe("5% SiH4 + 95% N2");
      }
    });

    it.each([
      [5, "5"],
      [100, "100"],
      [5.5, "5.5"],
      [33.333, "33.333"],
      [0.001, "0.001"],
      [99.999, "99.999"],
    ])("formats percent %s as %s", (input, expected) => {
      expect(formatPercent(input)).toBe(expected);
    });

    it("preserves trace dopant precision in gas summary", () => {
      const payload = {
        ...quoteMixturePayloadFixture,
        gasComponents: JSON.stringify([
          { gas: "SiH4", percent: 0.001 },
          { gas: "N2", percent: 99.999 },
        ]),
      };
      const result = contactFormSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(formatGasSummary(result.data)).toBe("0.001% SiH4 + 99.999% N2");
      }
    });

    it("rejects a non-positive flow value", () => {
      const result = contactFormSchema.safeParse(
        makeQuotePayload({ flowValue: "0" }),
      );
      expect(result.success).toBe(false);
    });

    it("rejects a non-numeric pressure value", () => {
      const result = contactFormSchema.safeParse(
        makeQuotePayload({ pressureValue: "high" }),
      );
      expect(result.success).toBe(false);
    });

    it("rejects an unknown flow unit", () => {
      const result = contactFormSchema.safeParse(
        makeQuotePayload({ flowUnit: "gph" }),
      );
      expect(result.success).toBe(false);
    });

    it("rejects an unknown fitting type", () => {
      const result = contactFormSchema.safeParse(
        makeQuotePayload({ fittingType: "Banjo" }),
      );
      expect(result.success).toBe(false);
    });

    it("does not require quote fields for non-quote inquiries", () => {
      const result = contactFormSchema.safeParse({
        inquiryType: "general",
        name: "Buyer",
        email: "buyer@example.com",
        message: "Hi.",
        consent: "on",
        "cf-turnstile-response": "tok",
      });
      expect(result.success).toBe(true);
    });
  });
});
