// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";

const { intlImplMock } = vi.hoisted(() => ({ intlImplMock: vi.fn() }));

vi.mock("next-intl/middleware", () => ({
  default: vi.fn(() => intlImplMock),
}));

import middleware, { detectLocale } from "./middleware";

function makeReq(
  url = "http://localhost/",
  opts: { headers?: Record<string, string>; cookie?: string } = {},
) {
  const headers: Record<string, string> = { ...opts.headers };
  if (opts.cookie) headers["cookie"] = opts.cookie;
  return new NextRequest(url, { headers });
}

describe("detectLocale", () => {
  it("returns cookie value when valid", () => {
    const req = makeReq("http://localhost/", { cookie: "NEXT_LOCALE=en" });
    expect(detectLocale(req)).toBe("en");
  });

  it("ignores cookie with unknown locale", () => {
    const req = makeReq("http://localhost/", {
      cookie: "NEXT_LOCALE=fr",
      headers: { "accept-language": "ko" },
    });
    expect(detectLocale(req)).toBe("ko");
  });

  it("prefers cookie over Accept-Language", () => {
    const req = makeReq("http://localhost/", {
      cookie: "NEXT_LOCALE=zh",
      headers: { "accept-language": "en-US,en;q=0.9" },
    });
    expect(detectLocale(req)).toBe("zh");
  });

  it("detects Korean from Accept-Language", () => {
    const req = makeReq("http://localhost/", {
      headers: { "accept-language": "ko-KR,ko;q=0.9" },
    });
    expect(detectLocale(req)).toBe("ko");
  });

  it("detects English from Accept-Language", () => {
    const req = makeReq("http://localhost/", {
      headers: { "accept-language": "en-US,en;q=0.9,ko;q=0.8" },
    });
    expect(detectLocale(req)).toBe("en");
  });

  it("detects Chinese from Accept-Language", () => {
    const req = makeReq("http://localhost/", {
      headers: { "accept-language": "zh-CN,zh;q=0.9" },
    });
    expect(detectLocale(req)).toBe("zh");
  });

  it("prefers Accept-Language over geo", () => {
    const req = makeReq("http://localhost/", {
      headers: {
        "accept-language": "en",
        "x-vercel-ip-country": "KR",
      },
    });
    expect(detectLocale(req)).toBe("en");
  });

  it("falls back to geo when Accept-Language has no match", () => {
    const req = makeReq("http://localhost/", {
      headers: {
        "accept-language": "fr,de;q=0.9",
        "x-vercel-ip-country": "KR",
      },
    });
    expect(detectLocale(req)).toBe("ko");
  });

  it("maps CN to zh via geo", () => {
    const req = makeReq("http://localhost/", {
      headers: { "x-vercel-ip-country": "CN" },
    });
    expect(detectLocale(req)).toBe("zh");
  });

  it("falls back to ko when no signals match", () => {
    const req = makeReq("http://localhost/", {
      headers: { "accept-language": "fr,de;q=0.9" },
    });
    expect(detectLocale(req)).toBe("ko");
  });

  it("falls back to ko with no headers at all", () => {
    expect(detectLocale(makeReq())).toBe("ko");
  });
});

describe("middleware (default export)", () => {
  beforeEach(() => {
    intlImplMock.mockReset();
    intlImplMock.mockImplementation(() => NextResponse.next());
  });

  it("delegates to next-intl middleware when the path already has a known locale prefix", () => {
    const req = makeReq("http://localhost/en/products", {
      cookie: "NEXT_LOCALE=en",
    });
    const res = middleware(req);
    expect(intlImplMock).toHaveBeenCalledWith(req);
    expect(res).toBeInstanceOf(NextResponse);
  });

  it("sets the locale cookie when the URL locale differs from the cookie", () => {
    const req = makeReq("http://localhost/zh/products", {
      cookie: "NEXT_LOCALE=en",
    });
    const res = middleware(req);
    expect(res.cookies.get("NEXT_LOCALE")?.value).toBe("zh");
  });

  it("does not overwrite the cookie when it already matches the URL locale", () => {
    const req = makeReq("http://localhost/en/products", {
      cookie: "NEXT_LOCALE=en",
    });
    const res = middleware(req);
    expect(res.cookies.get("NEXT_LOCALE")).toBeUndefined();
  });

  it("redirects to /{detectedLocale}{path} when no locale prefix is present", () => {
    const req = makeReq("http://localhost/products", {
      headers: { "accept-language": "en" },
    });
    const res = middleware(req);
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost/en/products");
    expect(res.cookies.get("NEXT_LOCALE")?.value).toBe("en");
    expect(intlImplMock).not.toHaveBeenCalled();
  });

  it("delegates unknown 2-letter prefixes to next-intl for normalization", () => {
    const req = makeReq("http://localhost/xx/about");
    middleware(req);
    expect(intlImplMock).toHaveBeenCalledWith(req);
  });
});
