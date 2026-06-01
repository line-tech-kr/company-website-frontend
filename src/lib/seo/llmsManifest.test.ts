import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockFetchSanity } from "@/test/mocks/sanity";
import { buildLlmsManifest } from "./llmsManifest";
import { makeProduct, productFixture } from "@/test/fixtures/products";

const siteUrl = "https://example.test";

describe("buildLlmsManifest", () => {
  beforeEach(() => {
    mockFetchSanity({ llmsManifest: () => [] });
  });

  it("starts with the Line Tech header and company section URLs", async () => {
    const md = await buildLlmsManifest(siteUrl);
    expect(md.startsWith("# Line Tech\n")).toBe(true);
    expect(md).toContain("## Company");
    expect(md).toContain(`[Company overview](${siteUrl}/en/company)`);
    expect(md).toContain(`[Contact & inquiry](${siteUrl}/en/contact)`);
  });

  it("includes Optional locale pointers for ko and zh", async () => {
    const md = await buildLlmsManifest(siteUrl);
    expect(md).toContain(`[Korean site](${siteUrl}/ko)`);
    expect(md).toContain(`[Chinese site](${siteUrl}/zh)`);
  });

  it("skips empty series sections when no products are present", async () => {
    const md = await buildLlmsManifest(siteUrl);
    expect(md).not.toContain("Analogue series");
    expect(md).not.toContain("Digital series");
    expect(md).not.toContain("Specialized series");
  });

  it("renders the Analogue series with MFC entries and locale-prefixed URLs", async () => {
    mockFetchSanity({ llmsManifest: () => [productFixture] });
    const md = await buildLlmsManifest(siteUrl);
    expect(md).toContain("### Analogue series (M / MS)");
    expect(md).toContain("**Mass Flow Controllers**");
    expect(md).toContain(
      `[TEST-1000](${siteUrl}/en/products/analogue/test-1000)`,
    );
    expect(md).toContain(`[Spec JSON](${siteUrl}/products/test-1000/spec.json)`);
    expect(md).toContain(`[Spec sheet](${siteUrl}/products/test-1000/spec.md)`);
  });

  it("groups MFM products under the Mass Flow Meters subsection", async () => {
    const meter = makeProduct({
      model: "TEST-METER-1",
      slug: { current: "test-meter-1" },
      function: "MFM",
    });
    mockFetchSanity({ llmsManifest: () => [meter] });
    const md = await buildLlmsManifest(siteUrl);
    expect(md).toContain("**Mass Flow Meters**");
    expect(md).toContain("[TEST-METER-1]");
  });

  it("skips products that fail schema validation and logs the error", async () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetchSanity({
      llmsManifest: () => [productFixture, { model: "BROKEN" }],
    });
    const md = await buildLlmsManifest(siteUrl);
    expect(md).toContain("[TEST-1000]");
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("returns an empty product catalog when Sanity returns a non-array", async () => {
    mockFetchSanity({ llmsManifest: () => null });
    const md = await buildLlmsManifest(siteUrl);
    expect(md).toContain("## Products");
    expect(md).not.toContain("**Mass Flow Controllers**");
  });
});
