import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  FLAGSHIP_MODEL,
  FLAGSHIP_IMAGE_PLACEHOLDER,
  pickFlagship,
  flagshipImageUrl,
  flagshipCutoutUrl,
} from "./flagship";
import { CATEGORY_SLUGS } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

vi.mock("@/sanity/imageUrl", () => ({
  urlFor: () => ({
    width: () => ({ url: () => "https://cdn.sanity.io/mock.jpg" }),
  }),
}));

function makeProduct(
  overrides: Partial<Product> & Pick<Product, "model" | "series">,
): Product {
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

function makeProductWithImage(
  model: string,
  series: Product["series"],
): Product {
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
const SPECIALIZED_FLAGSHIP = makeProductWithImage("EX1000", "specialized");
const LEPC_FLAGSHIP = makeProductWithImage("LEPC", "lepc");

const ALL_PRODUCTS: Product[] = [
  makeProduct({ model: "M3010VA", series: "analogue" }),
  ANALOGUE_FLAGSHIP,
  makeProduct({ model: "MD150C", series: "digital" }),
  DIGITAL_FLAGSHIP,
  makeProduct({ model: "EX70", series: "specialized" }),
  SPECIALIZED_FLAGSHIP,
  LEPC_FLAGSHIP,
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
    expect(pickFlagship(ALL_PRODUCTS, "explosion-proof")?.model).toBe("EX1000");
    expect(pickFlagship(ALL_PRODUCTS, "lepc")?.model).toBe("LEPC");
  });

  it("falls back when the pinned model is not in the product list", () => {
    const products = ALL_PRODUCTS.filter((p) => p.model !== "M3030VA");
    const result = pickFlagship(products, "analogue");
    expect(result?.series).toBe("analogue");
    expect(result?.model).not.toBe("M3030VA");
  });

  it("falls back when the slug has no entry in FLAGSHIP_MODEL", () => {
    const saved = FLAGSHIP_MODEL.analogue;
    try {
      delete (FLAGSHIP_MODEL as Partial<Record<string, string>>).analogue;
      const products = ALL_PRODUCTS.filter((p) => p.series === "analogue");
      const result = pickFlagship(products, "analogue");
      expect(result?.series).toBe("analogue");
    } finally {
      FLAGSHIP_MODEL.analogue = saved;
    }
  });

  it("returns undefined when the category has no products", () => {
    const products = ALL_PRODUCTS.filter((p) => p.series !== "specialized");
    expect(pickFlagship(products, "explosion-proof")).toBeUndefined();
  });

  it("excludes MFM meters from the fallback", () => {
    const products: Product[] = [
      makeProduct({ model: "MS3010MA", series: "analogue", function: "MFM" }),
      makeProduct({ model: "M3010VA", series: "analogue" }),
    ];
    const result = pickFlagship(products, "analogue");
    expect(result?.model).toBe("M3010VA");
    expect(result?.function).not.toBe("MFM");
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
      makeProduct({
        model: FLAGSHIP_MODEL[slug]!,
        series: slug as Product["series"],
      }),
    );
    for (const p of imagelessFlagships) {
      vi.mocked(console.warn).mockClear();
      flagshipImageUrl(p);
      expect(console.warn).toHaveBeenCalled();
    }
  });
});

describe("flagshipCutoutUrl", () => {
  const cutoutRef = {
    _type: "image",
    asset: { _type: "reference", _ref: "image-abc-jpg" },
  } as Parameters<typeof flagshipCutoutUrl>[1];

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the Sanity CDN URL when a cutout is provided", () => {
    expect(flagshipCutoutUrl("M3030VA", cutoutRef)).toBe(
      "https://cdn.sanity.io/mock.jpg",
    );
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns the placeholder for null/undefined cutouts", () => {
    expect(flagshipCutoutUrl("MD800C", null)).toBe(FLAGSHIP_IMAGE_PLACEHOLDER);
    expect(flagshipCutoutUrl("EX1000", undefined)).toBe(
      FLAGSHIP_IMAGE_PLACEHOLDER,
    );
  });

  it("warns in non-production when the cutout is missing", () => {
    vi.stubEnv("NODE_ENV", "test");
    try {
      flagshipCutoutUrl("MD800C", null);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("MD800C"),
      );
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it("does not warn in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    try {
      flagshipCutoutUrl("MD800C", null);
      expect(console.warn).not.toHaveBeenCalled();
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
