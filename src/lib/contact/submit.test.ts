import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockNextHeaders } from "@/test/helpers/headers";

const { rateLimitMock, captchaMock, persistMock, emailMock, headersMock } =
  vi.hoisted(() => ({
    rateLimitMock: vi.fn(),
    captchaMock: vi.fn(),
    persistMock: vi.fn(),
    emailMock: vi.fn(),
    headersMock: vi.fn(),
  }));

vi.mock("next/headers", () => ({ headers: headersMock }));
vi.mock("./rate-limit", () => ({ checkContactRateLimit: rateLimitMock }));
vi.mock("./captcha", () => ({ verifyTurnstile: captchaMock }));
vi.mock("./persist", () => ({ persistContactSubmission: persistMock }));
vi.mock("./email", () => ({ sendContactEmail: emailMock }));

import { submitContact, type ContactFormState } from "./submit";

function makeFormData(
  overrides: Record<string, string | undefined> = {},
): FormData {
  const base: Record<string, string | undefined> = {
    inquiryType: "support",
    name: "홍길동",
    email: "customer@example.com",
    message: "안녕하세요.",
    consent: "on",
    website: "",
    "cf-turnstile-response": "tok",
    ...overrides,
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries(base)) {
    if (v === undefined) continue;
    fd.set(k, v);
  }
  return fd;
}

const initial: ContactFormState = { status: "idle" };

describe("submitContact", () => {
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    rateLimitMock.mockReset().mockResolvedValue(true);
    captchaMock.mockReset().mockResolvedValue(true);
    persistMock.mockReset().mockResolvedValue(undefined);
    emailMock.mockReset().mockResolvedValue(undefined);
    headersMock.mockReset();
    mockNextHeaders(headersMock, { "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    errSpy.mockRestore();
  });

  it("returns success on the happy path", async () => {
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "success" });
    expect(rateLimitMock).toHaveBeenCalledWith("1.2.3.4");
    expect(captchaMock).toHaveBeenCalledWith("tok", "1.2.3.4");
    expect(persistMock).toHaveBeenCalledTimes(1);
    expect(emailMock).toHaveBeenCalledTimes(1);
  });

  it("rejects honeypot submissions as invalid (silent)", async () => {
    const result = await submitContact(
      initial,
      makeFormData({ website: "trapped" }),
    );
    expect(result).toEqual({ status: "error", errorKey: "invalid" });
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("returns invalid when zod parsing fails", async () => {
    const result = await submitContact(
      initial,
      makeFormData({ email: undefined }),
    );
    expect(result).toEqual({ status: "error", errorKey: "invalid" });
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("returns rateLimited when the limiter denies", async () => {
    rateLimitMock.mockResolvedValueOnce(false);
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "rateLimited" });
    expect(captchaMock).not.toHaveBeenCalled();
  });

  it("returns server error when the rate limiter throws", async () => {
    rateLimitMock.mockRejectedValueOnce(new Error("redis down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "server" });
    expect(captchaMock).not.toHaveBeenCalled();
  });

  it("returns captcha error when Turnstile fails", async () => {
    captchaMock.mockResolvedValueOnce(false);
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "captcha" });
    expect(persistMock).not.toHaveBeenCalled();
  });

  it("returns server error when captcha verification throws", async () => {
    captchaMock.mockRejectedValueOnce(new Error("turnstile down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "server" });
    expect(persistMock).not.toHaveBeenCalled();
  });

  it("swallows persist failures and still sends the email", async () => {
    persistMock.mockRejectedValueOnce(new Error("sanity down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "success" });
    expect(emailMock).toHaveBeenCalledTimes(1);
  });

  it("returns server error when email send fails", async () => {
    emailMock.mockRejectedValueOnce(new Error("resend down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "server" });
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", async () => {
    mockNextHeaders(headersMock, { "x-real-ip": "9.9.9.9" });
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("9.9.9.9");
  });

  it("falls back to 0.0.0.0 when no IP headers are present", async () => {
    mockNextHeaders(headersMock, {});
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("0.0.0.0");
  });

  it("trims leading whitespace from the leftmost x-forwarded-for entry", async () => {
    mockNextHeaders(headersMock, { "x-forwarded-for": "   2.2.2.2, 3.3.3.3" });
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("2.2.2.2");
  });

  it("handles single-IP x-forwarded-for without a comma", async () => {
    mockNextHeaders(headersMock, { "x-forwarded-for": "7.7.7.7" });
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("7.7.7.7");
  });
});
