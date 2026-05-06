import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  FLAGSHIP_MODEL,
  FLAGSHIP_IMAGE_PLACEHOLDER,
  pickFlagship,
  flagshipImageUrl,
} from "./flagship";
import { CATEGORY_SLUGS, type CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

vi.mock("@/sanity/imageUrl", () => ({
  urlFor: () => ({ width: () => ({ url: () => "https://cdn.sanity.io/mock.jpg" }) }),
}));

function makeProduct(overrides: Partial<Product> & Pick<Product, "model" | "series">): Product {
  return {
    slug: { current: overrides.model.toLowerCase() },
    function: "MFC",
    productLabel: { ko: "", en: "", zh: "" },
    tags: [],
    features: [],
    connections: [],
    massFlowSpecs: [],
    images: null,
    ...overrides,
  } as unknown as Product;
}

function makeProductWithImage(model: string, series: Product["series"]): Product {
  return makeProduct({
    model,
    series,
    images: [
      {
        _type: "image",
        _key: "img1",
        asset: { _type: "reference", _ref: "image-abc123-jpg" },
      } as NonNullable<Product["images"]>[0],
    ],
  });
}

const ANALOGUE_FLAGSHIP = makeProductWithImage("M3030VA", "analogue");
const DIGITAL_FLAGSHIP = makeProductWithImage("MD800C", "digital");
const SPECIALIZED_FLAGSHIP = makeProductWithImage("LD030C", "specialized");

const ALL_PRODUCTS: Product[] = [
  makeProduct({ model: "M3010VA", series: "analogue" }),
  ANALOGUE_FLAGSHIP,
  makeProduct({ model: "MD100C", series: "digital" }),
  DIGITAL_FLAGSHIP,
  makeProduct({ model: "LD010C", series: "specialized" }),
  SPECIALIZED_FLAGSHIP,
];

describe("FLAGSHIP_MODEL", () => {
  it("pins a model for every category slug", () => {
    for (const slug of CATEGORY_SLUGS) {
      expect(FLAGSHIP_MODEL[slug]).toBeDefined();
    }
  });
});

describe("pickFlagship", () => {
  it("returns the pinned model when present", () => {
    expect(pickFlagship(ALL_PRODUCTS, "analogue")?.model).toBe("M3030VA");
    expect(pickFlagship(ALL_PRODUCTS, "digital")?.model).toBe("MD800C");
    expect(pickFlagship(ALL_PRODUCTS, "specialized")?.model).toBe("LD030C");
  });

  it("falls back to any product in the category when the pin is absent", () => {
    const products = ALL_PRODUCTS.filter((p) => p.model !== "M3030VA");
    const result = pickFlagship(products, "analogue");
    expect(result?.series).toBe("analogue");
  });

  it("returns undefined when the category has no products", () => {
    const products = ALL_PRODUCTS.filter((p) => p.series !== "specialized");
    expect(pickFlagship(products, "specialized")).toBeUndefined();
  });
});

describe("flagshipImageUrl", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the Sanity CDN URL when the product has an image", () => {
    const url = flagshipImageUrl(ANALOGUE_FLAGSHIP);
    expect(url).toBe("https://cdn.sanity.io/mock.jpg");
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns the placeholder and warns when the product has no image", () => {
    const noImage = makeProduct({ model: "M3030VA", series: "analogue" });
    const url = flagshipImageUrl(noImage);
    expect(url).toBe(FLAGSHIP_IMAGE_PLACEHOLDER);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining("M3030VA"),
    );
  });

  it("placeholder cannot silently reach the rotator — warn fires for every imageless flagship", () => {
    const imagelessFlagships = CATEGORY_SLUGS.map((slug) =>
      makeProduct({ model: FLAGSHIP_MODEL[slug]!, series: slug === "analogue" ? "analogue" : slug === "digital" ? "digital" : "specialized" }),
    );
    for (const p of imagelessFlagships) {
      vi.mocked(console.warn).mockClear();
      flagshipImageUrl(p);
      expect(console.warn).toHaveBeenCalled();
    }
  });
});
