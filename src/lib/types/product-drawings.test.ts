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
  it("accepts drawings with models[], pdfUrl, and pdfSize", () => {
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
          stpUrl: null,
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
  });

  it("accepts drawings with pdf-only (no DWG/STP)", () => {
    const parsed = SanityProductSchema.parse({
      ...SANITY_BASE,
      drawings: [
        {
          _id: "drawing-2",
          title: "PDF-only outline",
          models: ["LD030C"],
          pdfUrl: "https://cdn.sanity.io/files/a/b.pdf",
          pdfSize: 9876,
        },
      ],
    });
    expect(parsed.drawings[0]!.dwgUrl ?? null).toBeNull();
    expect(parsed.drawings[0]!.stpUrl ?? null).toBeNull();
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
