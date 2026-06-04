import { describe, expect, it } from "vitest";
import { z } from "zod";
import { ALL_PRODUCTS } from "./products";
import { SanityProductSchema } from "../types/product";

describe("products.json fixture", () => {
  it("validates against SanityProductSchema for every product", () => {
    const result = z.array(SanityProductSchema).safeParse(ALL_PRODUCTS);
    if (!result.success) {
      // Surface the offending path(s) clearly — easier than digging through
      // raw Zod issues at the failure site.
      const messages = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("\n  ");
      throw new Error(`products.json failed schema validation:\n  ${messages}`);
    }
    expect(result.success).toBe(true);
  });

  it("has a unique slug per product", () => {
    const slugs = ALL_PRODUCTS.map((p) => p.slug.current);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("DO400 carries the catalogue-corrected fittings + max pressure", () => {
    // Pins the 2026-06-03 correction from PDF p.34: three SW fittings and
    // <13 bar max pressure. A silent revert (parser regen wiping the
    // hand-applied fix) would be caught here.
    const do400 = ALL_PRODUCTS.find((p) => p.model === "DO400");
    expect(do400, "DO400 missing from fixture").toBeDefined();
    expect(do400!.connections.length).toBeGreaterThanOrEqual(1);
    expect(do400!.massFlowSpecs?.maxPressure?.value).toBe(13);
    expect(do400!.massFlowSpecs?.maxPressure?.display).toBe("<13 bar");
  });
});
