import { describe, expect, it, vi } from "vitest";

import type { Product } from "@/lib/types/product";

import {
  DEFAULT_FEATURED_SPEC_KEYS,
  resolveFeaturedProduct,
  type SanityFeaturedProduct,
} from "./resolveFeaturedProduct";

vi.mock("@/sanity/imageUrl", () => ({
  urlFor: () => ({ width: () => ({ url: () => "https://cdn/x.png" }) }),
}));

vi.mock("@/lib/fixtures/products", () => ({
  productBySlug: (slug: string): Partial<Product> | undefined => {
    if (slug === "do400") {
      return {
        slug: { current: "do400" },
        model: "DO400",
        series: "specialized",
        productLabel: {
          en: "Mass Flow Controller",
          ko: "MFC-ko",
          zh: "MFC-zh",
        },
        description: { en: "desc-en", ko: "desc-ko", zh: "desc-zh" },
        massFlowSpecs: {
          flowRange: { display: "100–400 slpm" },
          maxPressure: { display: "<30 bar" },
          accuracy: { display: "" },
          repeatability: { display: "" },
          ioSignal: { display: "" },
          supplyPower: { display: "" },
          tempRange: { display: "" },
          leakRate: { display: "" },
          controlRange: { display: "" },
        },
      } as unknown as Partial<Product>;
    }
    if (slug === "no-specs") {
      return {
        slug: { current: "no-specs" },
        model: "NS",
        series: "analogue",
        productLabel: { en: "No Specs", ko: "NS-ko", zh: "NS-zh" },
        description: null,
        massFlowSpecs: undefined,
      } as unknown as Partial<Product>;
    }
    return undefined;
  },
}));

const label = (key: string) => `lbl:${key}`;

describe("resolveFeaturedProduct", () => {
  it("returns null when both sanity and staticSlug are absent", () => {
    expect(
      resolveFeaturedProduct({
        sanity: null,
        staticSlug: undefined,
        locale: "en",
        specKeys: DEFAULT_FEATURED_SPEC_KEYS,
        getSpecLabel: label,
      }),
    ).toBeNull();
  });

  it("returns null when staticSlug doesn't match a fixture", () => {
    expect(
      resolveFeaturedProduct({
        sanity: null,
        staticSlug: "nonexistent",
        locale: "en",
        specKeys: DEFAULT_FEATURED_SPEC_KEYS,
        getSpecLabel: label,
      }),
    ).toBeNull();
  });

  it("fixture branch surfaces the default flowRange spec", () => {
    const r = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "do400",
      locale: "en",
      specKeys: DEFAULT_FEATURED_SPEC_KEYS,
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([
      { label: "lbl:flowRange", value: "100–400 slpm" },
    ]);
    expect(r?.slug).toBe("do400");
    expect(r?.imageUrl).toBe("/products/do400/cutout-2026.png");
  });

  it("fixture branch surfaces multiple keys in the requested order", () => {
    const r = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "do400",
      locale: "en",
      specKeys: ["maxPressure", "flowRange"],
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([
      { label: "lbl:maxPressure", value: "<30 bar" },
      { label: "lbl:flowRange", value: "100–400 slpm" },
    ]);
  });

  it("fixture branch silently drops keys whose display value is empty/missing", () => {
    const r = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "do400",
      locale: "en",
      specKeys: ["flowRange", "accuracy", "maxPressure"],
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([
      { label: "lbl:flowRange", value: "100–400 slpm" },
      { label: "lbl:maxPressure", value: "<30 bar" },
    ]);
  });

  it("fixture branch returns empty specs when massFlowSpecs is absent", () => {
    const r = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "no-specs",
      locale: "en",
      specKeys: ["flowRange", "maxPressure"],
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([]);
  });

  it("fixture branch picks the locale-specific productLabel/description", () => {
    const en = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "do400",
      locale: "en",
      specKeys: DEFAULT_FEATURED_SPEC_KEYS,
      getSpecLabel: label,
    });
    const ko = resolveFeaturedProduct({
      sanity: null,
      staticSlug: "do400",
      locale: "ko",
      specKeys: DEFAULT_FEATURED_SPEC_KEYS,
      getSpecLabel: label,
    });
    expect(en?.productLabel).toBe("Mass Flow Controller");
    expect(ko?.productLabel).toBe("MFC-ko");
    expect(en?.description).toBe("desc-en");
    expect(ko?.description).toBe("desc-ko");
  });

  it("sanity branch fills flowRange when present and skips other requested keys", () => {
    const sanity: SanityFeaturedProduct = {
      slug: "do400",
      model: "DO400",
      series: "specialized",
      productLabel: { en: "MFC", ko: "ko", zh: "zh" },
      description: { en: "d", ko: "k", zh: "z" },
      flowRange: "100–400 slpm",
      cutout: { asset: { _ref: "image-asset" } },
    };
    const r = resolveFeaturedProduct({
      sanity,
      staticSlug: "ignored",
      locale: "en",
      specKeys: ["flowRange", "maxPressure"],
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([
      { label: "lbl:flowRange", value: "100–400 slpm" },
    ]);
    expect(r?.imageUrl).toBe("https://cdn/x.png");
  });

  it("sanity branch returns empty specs when flowRange is null", () => {
    const r = resolveFeaturedProduct({
      sanity: {
        slug: "x",
        model: "X",
        series: "analogue",
        flowRange: null,
      },
      staticSlug: undefined,
      locale: "en",
      specKeys: ["flowRange"],
      getSpecLabel: label,
    });
    expect(r?.specs).toEqual([]);
    expect(r?.imageUrl).toBeNull();
  });
});
