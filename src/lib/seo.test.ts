import { describe, expect, it } from "vitest";
import {
  buildAccessoriesMetadata,
  buildApplicationDetailMetadata,
  buildApplicationsMetadata,
  buildCategoryMetadata,
  buildCompanyMetadata,
  buildContactMetadata,
  buildFinderMetadata,
  buildHomeMetadata,
  buildPrivacyMetadata,
  buildProductMetadata,
  buildProductsMetadata,
  buildResourcesMetadata,
  siteUrl,
} from "./seo";
import { productFixture } from "@/test/fixtures/products";

describe("siteUrl", () => {
  it("uses the NEXT_PUBLIC_SITE_URL value stubbed by vitest setup", () => {
    expect(siteUrl).toBe("https://test.example.com");
  });
});

describe("locale-scoped metadata builders", () => {
  it.each(["ko", "en", "zh"] as const)(
    "home metadata in %s carries canonical, language alternates, and OG locale",
    (locale) => {
      const m = buildHomeMetadata(locale);
      expect(m.alternates?.canonical).toBe(`${siteUrl}/${locale}`);
      expect(m.alternates?.languages).toEqual({
        ko: `${siteUrl}/ko`,
        en: `${siteUrl}/en`,
        zh: `${siteUrl}/zh`,
      });
      expect(typeof (m.title as { absolute?: string }).absolute).toBe("string");
      const ogLocale = (m.openGraph as { locale?: string }).locale;
      expect(ogLocale).toMatch(/_/);
    },
  );

  it.each([
    [buildCompanyMetadata, "company"],
    [buildProductsMetadata, "products"],
    [buildAccessoriesMetadata, "products/accessories"],
    [buildFinderMetadata, "products/finder"],
    [buildContactMetadata, "contact"],
    [buildApplicationsMetadata, "applications"],
    [buildPrivacyMetadata, "legal/privacy"],
  ] as const)("%p canonicalises to /<locale>/%s", (builder, path) => {
    const m = builder("en");
    expect(m.alternates?.canonical).toBe(`${siteUrl}/en/${path}`);
    expect(m.alternates?.languages?.ko).toBe(`${siteUrl}/ko/${path}`);
    expect(m.alternates?.languages?.zh).toBe(`${siteUrl}/zh/${path}`);
  });

  it("category metadata routes by category slug", () => {
    const m = buildCategoryMetadata("en", "digital");
    expect(m.alternates?.canonical).toBe(`${siteUrl}/en/products/digital`);
    expect((m.title as { absolute?: string }).absolute).toMatch(/Digital/);
  });

  it("application detail metadata uses the supplied title and lede", () => {
    const m = buildApplicationDetailMetadata(
      "en",
      "semiconductor",
      "Semiconductor",
      "Lede goes here.",
    );
    expect(m.alternates?.canonical).toBe(
      `${siteUrl}/en/applications/semiconductor`,
    );
    expect((m.title as { absolute?: string }).absolute).toBe(
      "Semiconductor — Line Tech",
    );
    expect(m.description).toBe("Lede goes here.");
  });

  it("application detail metadata uses 라인테크 for Korean", () => {
    const m = buildApplicationDetailMetadata(
      "ko",
      "fuel-cell",
      "연료전지",
      "리드",
    );
    expect((m.title as { absolute?: string }).absolute).toBe(
      "연료전지 — 라인테크",
    );
  });

  it("resources metadata routes by section", () => {
    const m = buildResourcesMetadata("en", "drawings");
    expect(m.alternates?.canonical).toBe(`${siteUrl}/en/resources/drawings`);
  });
});

describe("buildProductMetadata", () => {
  it("emits a product canonical with category + slug and includes range + accuracy", () => {
    const m = buildProductMetadata("en", productFixture, "analogue");
    expect(m.alternates?.canonical).toBe(
      `${siteUrl}/en/products/analogue/test-1000`,
    );
    expect(m.description).toMatch(/flow range/);
    expect(m.description).toMatch(/accuracy/);
  });

  it("falls back to an application-only description when specs are absent", () => {
    const product = { ...productFixture, massFlowSpecs: undefined };
    const m = buildProductMetadata("en", product, "analogue");
    expect(m.description).not.toMatch(/flow range/);
    expect(m.description).toMatch(/semiconductor/);
  });

  it("uses pressure-range wording for EPC products without a flow range", () => {
    const specs: Record<string, unknown> = { ...productFixture.massFlowSpecs };
    delete specs.flowRange;
    const product = {
      ...productFixture,
      function: "EPC" as const,
      massFlowSpecs: {
        ...(specs as NonNullable<typeof productFixture.massFlowSpecs>),
        pressureRange: {
          display: "0–10 bar",
          min: 0,
          max: 10,
          unit: "bar",
        },
      },
    };
    const m = buildProductMetadata("en", product, "specialized");
    expect(m.description).toMatch(/pressure range/);
    expect(m.description).not.toMatch(/flow range/);
  });
});
