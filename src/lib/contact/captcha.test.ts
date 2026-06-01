import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import {
  restoreFetch,
  stubFetchJson,
  stubFetchReject,
} from "@/test/helpers/fetch";
import { verifyTurnstile } from "./captcha";

describe("verifyTurnstile", () => {
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("CAPTCHA_DEV_BYPASS", "");
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    restoreFetch();
    vi.unstubAllEnvs();
    errSpy.mockRestore();
  });

  it("fails closed by default when the secret is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    await expect(verifyTurnstile("token")).resolves.toBe(false);
    expect(errSpy).toHaveBeenCalled();
  });

  it("allows an explicit CAPTCHA_DEV_BYPASS=1 opt-in when secret is missing", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("CAPTCHA_DEV_BYPASS", "1");
    await expect(verifyTurnstile("token")).resolves.toBe(true);
  });

  it("returns true when siteverify reports success", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    const fetchMock = stubFetchJson({ success: true });

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
    const fetchMock = stubFetchJson({ success: true });

    await verifyTurnstile("good-token");
    const body = (fetchMock.mock.calls[0][1] as { body: URLSearchParams }).body;
    expect(body.get("remoteip")).toBeNull();
  });

  it("returns false when siteverify reports failure", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    stubFetchJson({ success: false, "error-codes": ["invalid"] });

    await expect(verifyTurnstile("bad-token")).resolves.toBe(false);
  });

  it("returns false when fetch throws", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    stubFetchReject(new Error("network down"));

    await expect(verifyTurnstile("token")).resolves.toBe(false);
    expect(errSpy).toHaveBeenCalled();
  });
});
