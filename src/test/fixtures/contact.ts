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

export function makeContactPayload(
  overrides: Partial<ContactFormPayload> = {},
): ContactFormPayload {
  return { ...contactPayloadFixture, ...overrides };
}
