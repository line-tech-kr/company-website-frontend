import { mockFetchSanity } from "@/test/mocks/sanity";

import { describe, expect, it, beforeEach } from "vitest";
import { GET } from "./route";
import { productFixture, makeProduct } from "@/test/fixtures/products";

describe("GET /products/[slug]/spec.json", () => {
  beforeEach(() => {
    mockFetchSanity({
      specJson: () => productFixture,
    });
  });

  it("returns the spec payload for a known product", async () => {
    const res = await GET(new Request("http://test/products/test-1000"), {
      params: Promise.resolve({ slug: "test-1000" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.model).toBe("TEST-1000");
    expect(body.slug).toBe("test-1000");
    expect(body.series).toBe("analogue");
    expect(body.canonicalUrl).toMatch(/\/en\/products\/analogue\/test-1000$/);
    expect(body.alternates.ko).toMatch(/\/ko\/products\/analogue\/test-1000$/);
    expect(body.alternates.zh).toMatch(/\/zh\/products\/analogue\/test-1000$/);
    expect(body.specifications.flowRange.display).toBe("0–1000 sccm");
  });

  it("returns 404 when the Sanity query yields nothing", async () => {
    mockFetchSanity({
      specJson: () => null,
    });

    const res = await GET(new Request("http://test/products/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });

    expect(res.status).toBe(404);
  });

  it("propagates fixture overrides into the response", async () => {
    mockFetchSanity({
      specJson: () =>
        makeProduct({
          model: "OVERRIDE-9000",
          slug: { current: "override-9000" },
          series: "digital",
        }),
    });

    const res = await GET(new Request("http://test/products/override-9000"), {
      params: Promise.resolve({ slug: "override-9000" }),
    });

    const body = await res.json();
    expect(body.model).toBe("OVERRIDE-9000");
    expect(body.series).toBe("digital");
    expect(body.canonicalUrl).toMatch(
      /\/en\/products\/digital\/override-9000$/,
    );
  });
});
