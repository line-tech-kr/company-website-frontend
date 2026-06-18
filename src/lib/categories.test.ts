import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  CATEGORY_SLUGS,
  categoryForSeries,
  isCategorySlug,
} from "./categories";

describe("CATEGORY_SLUGS", () => {
  it("lists the brand category slugs in display order", () => {
    expect(CATEGORY_SLUGS).toEqual([
      "analogue",
      "digital",
      "explosion-proof",
      "lepc",
    ]);
  });

  it("each slug round-trips through its series and has a code", () => {
    // The URL slug and Sanity series value are decoupled (explosion-proof ↔
    // series "specialized"), so assert round-trip equality, not identity.
    for (const slug of CATEGORY_SLUGS) {
      expect(categoryForSeries(CATEGORIES[slug].series)).toBe(slug);
      expect(typeof CATEGORIES[slug].code).toBe("string");
    }
  });
});

describe("isCategorySlug", () => {
  it.each(["analogue", "digital", "explosion-proof", "lepc"])(
    "accepts %s as a category slug",
    (slug) => {
      expect(isCategorySlug(slug)).toBe(true);
    },
  );

  it.each(["accessory", "", "Analogue", "unknown"])(
    "rejects %p as a category slug",
    (slug) => {
      expect(isCategorySlug(slug)).toBe(false);
    },
  );
});

describe("categoryForSeries", () => {
  it.each([
    ["analogue", "analogue"],
    ["digital", "digital"],
    ["specialized", "explosion-proof"],
    ["lepc", "lepc"],
  ] as const)("maps series %s to category %s", (series, expected) => {
    expect(categoryForSeries(series)).toBe(expected);
  });
});
