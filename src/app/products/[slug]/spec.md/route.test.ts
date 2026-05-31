import { mockFetchSanity } from "@/test/mocks/sanity";

import { describe, expect, it, beforeEach } from "vitest";
import { GET } from "./route";
import { productFixture, rouProductFixture } from "@/test/fixtures/products";

describe("GET /products/[slug]/spec.md", () => {
  beforeEach(() => {
    mockFetchSanity({
      specMd: () => productFixture,
    });
  });

  it("returns markdown for a flow product", async () => {
    const res = await GET(new Request("http://test/products/test-1000"), {
      params: Promise.resolve({ slug: "test-1000" }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toMatch(/text\/markdown/);
    const body = await res.text();
    expect(body).toContain("# TEST-1000");
    expect(body).toContain("| Flow range | 0–1000 sccm |");
  });

  it("returns 404 when the Sanity query yields nothing", async () => {
    mockFetchSanity({
      specMd: () => null,
    });

    const res = await GET(new Request("http://test/products/missing"), {
      params: Promise.resolve({ slug: "missing" }),
    });

    expect(res.status).toBe(404);
  });

  it("renders instrumentSpecs rows for a ROU product", async () => {
    mockFetchSanity({
      specMd: () => rouProductFixture,
    });

    const res = await GET(new Request("http://test/products/rou-test"), {
      params: Promise.resolve({ slug: "rou-test" }),
    });

    expect(res.status).toBe(200);
    const body = await res.text();
    expect(body).toContain("# ROU-TEST");
    expect(body).toContain("| Input Power | 220VAC (50–60 Hz) |");
    expect(body).toContain("| Communication | RS-232, RS-485 |");
    expect(body).not.toContain("Flow range");
  });
});
