import "@/test/mocks/i18n";

import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  FeaturedApplicationProduct,
  type FeaturedApplicationProductInput,
} from "./FeaturedApplicationProduct";

const baseProduct: FeaturedApplicationProductInput = {
  slug: "do400",
  model: "DO400",
  series: "specialized",
  productLabel: "Dissolved O₂ analyzer",
  description: "Fallback product description.",
  specs: [{ label: "Flow range", value: "0–1000 sccm" }],
  imageUrl: "/products/do400/cutout-2026.png",
};

const labels = {
  kickerLabel: "Featured",
  whyHeadingLabel: "Why this one",
  viewProductLabel: "View product",
};

describe("FeaturedApplicationProduct", () => {
  it("renders every block when all data is present", () => {
    const { container, getByText } = render(
      <FeaturedApplicationProduct
        product={baseProduct}
        whyCaption="Purpose-built for fuel cells."
        {...labels}
      />,
    );

    expect(container.querySelector(".ap-featured__image img")).not.toBeNull();
    expect(getByText("Featured")).toBeInTheDocument();
    expect(getByText("DO400")).toBeInTheDocument();
    expect(getByText("Dissolved O₂ analyzer")).toBeInTheDocument();
    expect(getByText("Why this one")).toBeInTheDocument();
    expect(getByText("Purpose-built for fuel cells.")).toBeInTheDocument();
    expect(getByText("Flow range")).toBeInTheDocument();
    expect(getByText("0–1000 sccm")).toBeInTheDocument();
  });

  it("renders every spec row in order when multiple are provided", () => {
    const { container } = render(
      <FeaturedApplicationProduct
        product={{
          ...baseProduct,
          specs: [
            { label: "Flow range", value: "100–400 slpm" },
            { label: "Max pressure", value: "<30 bar" },
          ],
        }}
        whyCaption="x"
        {...labels}
      />,
    );

    const dts = Array.from(
      container.querySelectorAll(".ap-featured__spec dt"),
    ).map((n) => n.textContent);
    const dds = Array.from(
      container.querySelectorAll(".ap-featured__spec dd"),
    ).map((n) => n.textContent);
    expect(dts).toEqual(["Flow range", "Max pressure"]);
    expect(dds).toEqual(["100–400 slpm", "<30 bar"]);
  });

  it("omits the image link when imageUrl is null", () => {
    const { container } = render(
      <FeaturedApplicationProduct
        product={{ ...baseProduct, imageUrl: null }}
        whyCaption="x"
        {...labels}
      />,
    );

    expect(container.querySelector(".ap-featured__image-link")).toBeNull();
  });

  it("falls back to description without the why-heading when whyCaption is null", () => {
    const { queryByText, getByText } = render(
      <FeaturedApplicationProduct
        product={baseProduct}
        whyCaption={null}
        {...labels}
      />,
    );

    expect(queryByText("Why this one")).toBeNull();
    expect(getByText("Fallback product description.")).toBeInTheDocument();
  });

  it("omits the spec block when specs is empty", () => {
    const { container } = render(
      <FeaturedApplicationProduct
        product={{ ...baseProduct, specs: [] }}
        whyCaption="x"
        {...labels}
      />,
    );
    expect(container.querySelector(".ap-featured__spec")).toBeNull();
  });

  it("omits the spec block when specs is undefined", () => {
    const { container } = render(
      <FeaturedApplicationProduct
        product={{ ...baseProduct, specs: undefined }}
        whyCaption="x"
        {...labels}
      />,
    );
    expect(container.querySelector(".ap-featured__spec")).toBeNull();
  });

  it("CTA href composes /products/{series}/{slug}", () => {
    const { container } = render(
      <FeaturedApplicationProduct
        product={baseProduct}
        whyCaption="x"
        {...labels}
      />,
    );

    const cta = container.querySelector(
      "a.ap-featured__cta",
    ) as HTMLAnchorElement;
    expect(cta).not.toBeNull();
    expect(cta.getAttribute("href")).toBe("/products/specialized/do400");
  });
});
