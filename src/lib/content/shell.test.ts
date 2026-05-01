import { describe, expect, it } from "vitest";
import { LT_SHELL, seriesHref } from "./shell";
import { LT_HOME, type Locale } from "./home";
import { routing } from "@/i18n/routing";

const LOCALES = routing.locales as readonly Locale[];

const LOCKED_CATEGORY_CODES = [
  "analogue",
  "digital",
  "specialized",
  "accessories",
] as const;

describe("LT_SHELL invariants", () => {
  it("uses the same nav ids in the same order across locales", () => {
    const reference = LT_SHELL.ko.nav.map((item) => item.id);
    for (const locale of LOCALES) {
      expect(LT_SHELL[locale].nav.map((item) => item.id)).toEqual(reference);
    }
  });

  it("locks the 4-category products taxonomy across locales", () => {
    for (const locale of LOCALES) {
      const codes = LT_SHELL[locale].productsCategories.map((c) => c.code);
      expect(codes).toEqual([...LOCKED_CATEGORY_CODES]);
    }
  });

  it("aligns each productsCategory href with its slug", () => {
    for (const locale of LOCALES) {
      for (const cat of LT_SHELL[locale].productsCategories) {
        expect(cat.href).toBe(`/products/${cat.code}`);
      }
    }
  });

  it("attaches regulatory blocks only to the locales that need them", () => {
    expect(LT_SHELL.ko.footer.legal).toBeDefined();
    expect(LT_SHELL.en.footer.legal).toBeUndefined();
    expect(LT_SHELL.zh.footer.legal).toBeUndefined();

    expect(LT_SHELL.zh.footer.subsidiary).toBeDefined();
    expect(LT_SHELL.ko.footer.subsidiary).toBeUndefined();
    expect(LT_SHELL.en.footer.subsidiary).toBeUndefined();
  });
});

describe("seriesHref", () => {
  it("resolves every series code defined on LT_HOME to a real category route", () => {
    // Catches the silent-fallback bug: adding a series in LT_HOME without
    // wiring its href in shell.ts would route the homepage card to /products.
    for (const item of LT_HOME.ko.series.items) {
      expect(seriesHref(item.code)).not.toBe("/products");
      expect(seriesHref(item.code).startsWith("/products/")).toBe(true);
    }
  });
});
