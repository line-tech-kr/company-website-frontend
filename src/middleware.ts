import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60;

const COUNTRY_LOCALE: Record<string, string> = {
  KR: "ko",
  CN: "zh",
  TW: "zh",
  HK: "zh",
  MO: "zh",
};

export function detectLocale(req: NextRequest): string {
  const locales: readonly string[] = routing.locales;

  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && locales.includes(cookie)) return cookie;

  const acceptLang = req.headers.get("accept-language") ?? "";
  for (const part of acceptLang.split(",")) {
    const lang = part.trim().split(/[-;]/)[0].toLowerCase();
    if (locales.includes(lang)) return lang;
  }

  const country = req.headers.get("x-vercel-ip-country")?.toUpperCase();
  if (country && COUNTRY_LOCALE[country]) return COUNTRY_LOCALE[country];

  return routing.defaultLocale;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const locales: readonly string[] = routing.locales;

  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  const secure = process.env.NODE_ENV === "production";

  if (matchedLocale) {
    const response = intlMiddleware(req);
    if (req.cookies.get(LOCALE_COOKIE)?.value !== matchedLocale) {
      response.cookies.set(LOCALE_COOKIE, matchedLocale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
        secure,
      });
    }
    return response;
  }

  // Unknown locale-like prefix (e.g. /xx/about) — let intlMiddleware normalize it
  if (/^\/[a-z]{2}(\/|$)/.test(pathname)) {
    return intlMiddleware(req);
  }

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
    secure,
  });
  return response;
}

export const config = {
  matcher: "/((?!api|_next|_vercel|studio|icon|apple-icon|.*\\..*).*)",
};
