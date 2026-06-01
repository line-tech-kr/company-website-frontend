import { describe, it, expect } from "vitest";
import { SanityProductSchema } from "./product";
import { productFixture } from "@/test/fixtures/products";

const SANITY_BASE = {
  ...productFixture,
  // The Sanity-side schema uses bare image objects, fixture has none.
  images: null,
  cutout: null,
  dimensionDrawing: null,
  digitalCommunication: null,
};

describe("SanityProductSchema drawings (#174)", () => {
  it("normalizes null connections for instruments without fluid fittings", () => {
    const parsed = SanityProductSchema.parse({
      ...SANITY_BASE,
      connections: null,
    });

    expect(parsed.connections).toEqual([]);
  });

  it("accepts drawings with models[], pdfUrl, pdfSize, and stpVariants[]", () => {
    const parsed = SanityProductSchema.parse({
      ...SANITY_BASE,
      drawings: [
        {
          _id: "drawing-1",
          title: "M3030VA outline",
          models: ["M3030VA", "M3030VB"],
          pdfUrl: "https://cdn.sanity.io/files/x/y.pdf",
          pdfSize: 12345,
          dwgUrl: "https://cdn.sanity.io/files/x/y.dwg",
          stpVariants: [
            {
              fitting: '1/4" SW',
              sortKey: 0.25,
              url: "https://cdn.sanity.io/files/x/y.step",
              size: 4_172_863,
            },
            {
              fitting: '3/8" SW',
              sortKey: 0.375,
              url: "https://cdn.sanity.io/files/x/z.step",
              size: 4_172_916,
            },
          ],
          updatedAt: "2026-05-07T00:00:00Z",
        },
      ],
    });
    expect(parsed.drawings).toHaveLength(1);
    expect(parsed.drawings[0]!.models).toEqual(["M3030VA", "M3030VB"]);
    expect(parsed.drawings[0]!.pdfUrl).toBe(
      "https://cdn.sanity.io/files/x/y.pdf",
    );
    expect(parsed.drawings[0]!.pdfSize).toBe(12345);
    expect(parsed.drawings[0]!.stpVariants).toHaveLength(2);
    expect(parsed.drawings[0]!.stpVariants?.[0]?.fitting).toBe('1/4" SW');
  });

  it("accepts drawings with pdf-only (no DWG/STP)", () => {
    const parsed = SanityProductSchema.parse({
      ...SANITY_BASE,
      drawings: [
        {
          _id: "drawing-2",
          title: "PDF-only outline",
          models: ["LEPC"],
          pdfUrl: "https://cdn.sanity.io/files/a/b.pdf",
          pdfSize: 9876,
        },
      ],
    });
    expect(parsed.drawings[0]!.dwgUrl ?? null).toBeNull();
    expect(parsed.drawings[0]!.stpVariants ?? null).toBeNull();
    expect(parsed.drawings[0]!.pdfUrl).toBeTruthy();
  });

  it("accepts drawings with null models (legacy/incomplete data)", () => {
    const parsed = SanityProductSchema.parse({
      ...SANITY_BASE,
      drawings: [
        {
          _id: "drawing-3",
          title: "Legacy",
          models: null,
        },
      ],
    });
    expect(parsed.drawings[0]!.models ?? null).toBeNull();
  });

  it("rejects drawings with non-string entries in models[]", () => {
    expect(() =>
      SanityProductSchema.parse({
        ...SANITY_BASE,
        drawings: [
          {
            _id: "drawing-4",
            title: "Bad",
            models: ["M3030VA", 123],
          },
        ],
      }),
    ).toThrow();
  });
});
