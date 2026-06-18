import { describe, expect, it } from "vitest";
import { buildSpecJson, buildSpecMarkdown } from "./specSheet";
import { makeProduct, productFixture } from "@/test/fixtures/products";
import type { Product } from "@/lib/types/product";

const siteUrl = "https://example.test";

describe("buildSpecJson", () => {
  it("returns the canonical English URL and ko/zh alternates", () => {
    const payload = buildSpecJson(productFixture, siteUrl);
    expect(payload.canonicalUrl).toBe(
      "https://example.test/en/products/analogue/test-1000",
    );
    expect(payload.alternates).toEqual({
      ko: "https://example.test/ko/products/analogue/test-1000",
      zh: "https://example.test/zh/products/analogue/test-1000",
    });
  });

  it("propagates model / slug / series / function", () => {
    const payload = buildSpecJson(productFixture, siteUrl);
    expect(payload.model).toBe("TEST-1000");
    expect(payload.slug).toBe("test-1000");
    expect(payload.series).toBe("analogue");
    expect(payload.function).toBe("MFC");
  });

  it("includes only specs present on the source product", () => {
    const payload = buildSpecJson(productFixture, siteUrl);
    expect(payload.specifications.flowRange).toBeDefined();
    expect(payload.specifications.accuracy).toBeDefined();
    expect(payload.specifications.pressureRange).toBeUndefined();
  });

  it("strips _key from connections", () => {
    const payload = buildSpecJson(productFixture, siteUrl);
    expect(payload.connections).toEqual([
      { type: "1/4 inch VCR", length: "60mm" },
    ]);
  });

  it("emits instrumentSpecs only when rows are non-empty", () => {
    const without = buildSpecJson(productFixture, siteUrl);
    expect(without.instrumentSpecs).toBeUndefined();

    const product = makeProduct({
      instrumentSpecs: [{ label: "Display", value: "LCD" }],
    });
    const withRows = buildSpecJson(product, siteUrl);
    expect(withRows.instrumentSpecs).toEqual([
      { label: "Display", value: "LCD" },
    ]);
  });

  it("maps EPC series to the explosion-proof category", () => {
    const product: Product = makeProduct({
      series: "specialized",
      function: "EPC",
    });
    const payload = buildSpecJson(product, siteUrl);
    expect(payload.canonicalUrl).toContain("/products/explosion-proof/");
  });
});

describe("buildSpecMarkdown", () => {
  it("emits an H1 with model, series, and function shortname", () => {
    const md = buildSpecMarkdown(productFixture, siteUrl);
    expect(md.split("\n")[0]).toBe(
      "# TEST-1000 — Analogue Mass Flow Controller",
    );
  });

  it("includes Features section when features have English values", () => {
    const md = buildSpecMarkdown(productFixture, siteUrl);
    expect(md).toContain("## Features");
    expect(md).toContain("- Feature 1");
  });

  it("omits Features section when no English values present", () => {
    const product = makeProduct({
      features: [{ ko: "특징", _key: "f1" }],
    });
    const md = buildSpecMarkdown(product, siteUrl);
    expect(md).not.toContain("## Features");
  });

  it("uses massFlowSpecs rows when instrumentSpecs is absent", () => {
    const md = buildSpecMarkdown(productFixture, siteUrl);
    expect(md).toContain("| Flow range | 0–1000 sccm |");
    expect(md).toContain("| Accuracy | ±1% F.S. |");
  });

  it("uses instrumentSpecs rows when present, instead of massFlowSpecs", () => {
    const product = makeProduct({
      instrumentSpecs: [{ label: "Display", value: "LCD" }],
    });
    const md = buildSpecMarkdown(product, siteUrl);
    expect(md).toContain("| Display | LCD |");
    expect(md).not.toContain("| Flow range |");
  });

  it("includes Connections section when connections are present", () => {
    const md = buildSpecMarkdown(productFixture, siteUrl);
    expect(md).toContain("## Connections");
    expect(md).toContain("- 1/4 inch VCR — body length 60mm");
  });

  it("includes Digital communication section when protocol is set", () => {
    const product = makeProduct({
      digitalCommunication: {
        protocol: "RS-485",
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: "None",
      },
    });
    const md = buildSpecMarkdown(product, siteUrl);
    expect(md).toContain("## Digital communication");
    expect(md).toContain("- Protocol: RS-485");
    expect(md).toContain("- Baud rate: 9600");
  });

  it("emits ko and zh source URLs in the footer", () => {
    const md = buildSpecMarkdown(productFixture, siteUrl);
    expect(md).toContain(
      "Korean: https://example.test/ko/products/analogue/test-1000",
    );
    expect(md).toContain(
      "Chinese: https://example.test/zh/products/analogue/test-1000",
    );
  });
});
