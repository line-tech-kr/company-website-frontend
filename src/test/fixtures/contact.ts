import type { ContactFormPayload } from "@/lib/contact/schema";

export const contactPayloadFixture: ContactFormPayload = {
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

export const quotePayloadFixture: ContactFormPayload = {
  inquiryType: "quote",
  name: "Buyer",
  email: "buyer@example.com",
  message: "Please quote.",
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
  "cf-turnstile-response": "test-token",
};

export const quoteMixturePayloadFixture: ContactFormPayload = {
  ...quotePayloadFixture,
  gasMode: "mixture",
  gas: undefined,
  gasComponents: JSON.stringify([
    { gas: "SiH4", percent: 5 },
    { gas: "N2", percent: 95 },
  ]),
};

export function makeContactPayload(
  overrides: Partial<ContactFormPayload> = {},
): ContactFormPayload {
  return { ...contactPayloadFixture, ...overrides };
}

export function makeQuotePayload(
  overrides: Partial<ContactFormPayload> = {},
): ContactFormPayload {
  return { ...quotePayloadFixture, ...overrides };
}
