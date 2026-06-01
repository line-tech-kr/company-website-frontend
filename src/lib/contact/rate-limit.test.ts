import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { limitMock, RatelimitMock, slidingWindowMock, redisFromEnvMock } =
  vi.hoisted(() => ({
    limitMock: vi.fn(),
    RatelimitMock: vi.fn(),
    slidingWindowMock: vi.fn(() => "sliding-window-config"),
    redisFromEnvMock: vi.fn(() => ({ marker: "redis" })),
  }));

vi.mock("@upstash/ratelimit", () => {
  const Ratelimit = Object.assign(
    function (this: unknown, opts: unknown) {
      RatelimitMock(opts);
      // @ts-expect-error - constructed via `new`, assign instance shape
      this.limit = limitMock;
    },
    { slidingWindow: slidingWindowMock },
  );
  return { Ratelimit };
});

vi.mock("@upstash/redis", () => ({
  Redis: { fromEnv: redisFromEnvMock },
}));

describe("checkContactRateLimit", () => {
  let errSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
    limitMock.mockReset();
    RatelimitMock.mockReset();
    redisFromEnvMock.mockClear();
    slidingWindowMock.mockClear();
    errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    errSpy.mockRestore();
  });

  it("no-ops to true when Upstash env vars are missing (non-prod)", async () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const { checkContactRateLimit } = await import("./rate-limit");
    await expect(checkContactRateLimit("1.2.3.4")).resolves.toBe(true);
    expect(RatelimitMock).not.toHaveBeenCalled();
    expect(limitMock).not.toHaveBeenCalled();
    expect(errSpy).not.toHaveBeenCalled();
  });

  it("warns loudly in production when env vars are missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");

    const { checkContactRateLimit } = await import("./rate-limit");
    await expect(checkContactRateLimit("1.2.3.4")).resolves.toBe(true);
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining("rate-limit disabled"),
    );
  });

  it("returns true when the limiter allows the request", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://upstash.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limitMock.mockResolvedValue({ success: true });

    const { checkContactRateLimit } = await import("./rate-limit");
    await expect(checkContactRateLimit("1.2.3.4")).resolves.toBe(true);

    expect(RatelimitMock).toHaveBeenCalledTimes(1);
    expect(RatelimitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        redis: expect.objectContaining({ marker: "redis" }),
        limiter: "sliding-window-config",
        prefix: "rl:contact",
      }),
    );
    expect(slidingWindowMock).toHaveBeenCalledWith(5, "1 h");
    expect(limitMock).toHaveBeenCalledWith("1.2.3.4");
  });

  it("returns false when the limiter denies the request", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://upstash.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limitMock.mockResolvedValue({ success: false });

    const { checkContactRateLimit } = await import("./rate-limit");
    await expect(checkContactRateLimit("1.2.3.4")).resolves.toBe(false);
  });

  it("reuses the limiter within a single import", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://upstash.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limitMock.mockResolvedValue({ success: true });

    const { checkContactRateLimit } = await import("./rate-limit");
    await checkContactRateLimit("1.2.3.4");
    await checkContactRateLimit("5.6.7.8");

    expect(RatelimitMock).toHaveBeenCalledTimes(1);
    expect(limitMock).toHaveBeenNthCalledWith(1, "1.2.3.4");
    expect(limitMock).toHaveBeenNthCalledWith(2, "5.6.7.8");
  });

  it("propagates errors from the limiter's limit() call", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://upstash.example");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "token");
    limitMock.mockRejectedValueOnce(new Error("redis down"));

    const { checkContactRateLimit } = await import("./rate-limit");
    await expect(checkContactRateLimit("1.2.3.4")).rejects.toThrow("redis down");
  });
});
