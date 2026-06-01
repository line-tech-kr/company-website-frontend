import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "./captcha";

describe("verifyTurnstile", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "test");
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("returns true in non-production when secret is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile("token")).resolves.toBe(true);
  });

  it("returns false in production when secret is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    await expect(verifyTurnstile("token")).resolves.toBe(false);
  });

  it("returns true when siteverify reports success", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(verifyTurnstile("good-token", "1.2.3.4")).resolves.toBe(true);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    const body = (init as { body: URLSearchParams }).body;
    expect(body.get("secret")).toBe("secret");
    expect(body.get("response")).toBe("good-token");
    expect(body.get("remoteip")).toBe("1.2.3.4");
  });

  it("omits remoteip when not provided", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true }),
    });
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await verifyTurnstile("good-token");
    const body = (fetchMock.mock.calls[0][1] as { body: URLSearchParams }).body;
    expect(body.get("remoteip")).toBeNull();
  });

  it("returns false when siteverify reports failure", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: () =>
        Promise.resolve({ success: false, "error-codes": ["invalid"] }),
    }) as unknown as typeof fetch;

    await expect(verifyTurnstile("bad-token")).resolves.toBe(false);
  });

  it("returns false when fetch throws", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    globalThis.fetch = vi
      .fn()
      .mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    await expect(verifyTurnstile("token")).resolves.toBe(false);
  });
});
