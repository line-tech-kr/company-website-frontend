import "@/test/mocks/sanity";
import { beforeEach, describe, expect, it } from "vitest";
import { mockFetchSanity } from "@/test/mocks/sanity";
import { GET } from "./route";
import { makeProduct, productFixture } from "@/test/fixtures/products";

describe("GET /products/[slug]/spec.md", () => {
  beforeEach(() => {
    mockFetchSanity({ specMd: () => productFixture });
  });

  it("returns 200 with markdown body for a known product", async () => {
    const res = await GET(new Request("http://test/products/test-1000"), {
      params: Promise.resolve({ slug: "test-1000" }),
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8",
    );
    const body = await res.text();
    expect(body.startsWith("# TEST-1000 — Analogue Mass Flow Controller")).toBe(
      true,
    );
    expect(body).toContain("| Flow range | 0–1000 sccm |");
  });

  it("returns 404 when the Sanity query yields nothing", async () => {
    mockFetchSanity({ specMd: () => null });
    const res = await GET(new Request("http://test/products/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });
    expect(res.status).toBe(404);
    expect(await res.text()).toBe("Not found");
  });

  it("renders fixture overrides into the markdown", async () => {
    mockFetchSanity({
      specMd: () =>
        makeProduct({
          model: "OVERRIDE-9000",
          slug: { current: "override-9000" },
          series: "digital",
          function: "MFM",
        }),
    });
    const res = await GET(new Request("http://test/products/override-9000"), {
      params: Promise.resolve({ slug: "override-9000" }),
    });
    const body = await res.text();
    expect(body).toContain("# OVERRIDE-9000 — Digital Mass Flow Meter");
  });
});
