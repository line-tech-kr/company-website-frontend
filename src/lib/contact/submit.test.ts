import { beforeEach, describe, expect, it, vi } from "vitest";

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
  overrides: Record<string, string> = {},
  omit: string[] = [],
): FormData {
  const base: Record<string, string> = {
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
    if (omit.includes(k)) continue;
    fd.set(k, v);
  }
  return fd;
}

function mockHeaders(map: Record<string, string> = {}): void {
  headersMock.mockResolvedValue({
    get: (name: string) => map[name.toLowerCase()] ?? null,
  });
}

const initial: ContactFormState = { status: "idle" };

describe("submitContact", () => {
  beforeEach(() => {
    rateLimitMock.mockReset().mockResolvedValue(true);
    captchaMock.mockReset().mockResolvedValue(true);
    persistMock.mockReset().mockResolvedValue(undefined);
    emailMock.mockReset().mockResolvedValue(undefined);
    headersMock.mockReset();
    mockHeaders({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
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
    const result = await submitContact(initial, makeFormData({}, ["email"]));
    expect(result).toEqual({ status: "error", errorKey: "invalid" });
    expect(rateLimitMock).not.toHaveBeenCalled();
  });

  it("returns rateLimited when the limiter denies", async () => {
    rateLimitMock.mockResolvedValueOnce(false);
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "rateLimited" });
    expect(captchaMock).not.toHaveBeenCalled();
  });

  it("returns captcha error when Turnstile fails", async () => {
    captchaMock.mockResolvedValueOnce(false);
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "captcha" });
    expect(persistMock).not.toHaveBeenCalled();
  });

  it("swallows persist failures and still sends the email", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    persistMock.mockRejectedValueOnce(new Error("sanity down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "success" });
    expect(emailMock).toHaveBeenCalledTimes(1);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("returns server error when email send fails", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    emailMock.mockRejectedValueOnce(new Error("resend down"));
    const result = await submitContact(initial, makeFormData());
    expect(result).toEqual({ status: "error", errorKey: "server" });
    err.mockRestore();
  });

  it("falls back to x-real-ip when x-forwarded-for is absent", async () => {
    mockHeaders({ "x-real-ip": "9.9.9.9" });
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("9.9.9.9");
  });

  it("falls back to 0.0.0.0 when no IP headers are present", async () => {
    mockHeaders({});
    await submitContact(initial, makeFormData());
    expect(rateLimitMock).toHaveBeenCalledWith("0.0.0.0");
  });
});
