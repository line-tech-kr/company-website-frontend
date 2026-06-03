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
      "specialized",
      "lepc",
    ]);
  });

  it("each slug has a code and matching series in CATEGORIES", () => {
    for (const slug of CATEGORY_SLUGS) {
      expect(CATEGORIES[slug].series).toBe(slug);
      expect(typeof CATEGORIES[slug].code).toBe("string");
    }
  });
});

describe("isCategorySlug", () => {
  it.each(["analogue", "digital", "specialized", "lepc"])(
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
    ["specialized", "specialized"],
    ["lepc", "lepc"],
  ] as const)("maps series %s to category %s", (series, expected) => {
    expect(categoryForSeries(series)).toBe(expected);
  });
});
