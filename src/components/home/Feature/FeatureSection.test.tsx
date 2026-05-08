import "@/test/mocks/i18n";

import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { FeatureSection } from "./FeatureSection";
import { FLAGSHIP_IMAGE_PLACEHOLDER } from "@/lib/products/flagship";

const BULLET_LABELS = {
  flow: "Flow",
  accuracy: "Accuracy",
  response: "Response",
  io: "I/O",
};

const SLIDES = [
  { model: "M3030VA", sub: "Analogue MFC" },
  { model: "MD800C", sub: "Digital MFC" },
  { model: "LD030C", sub: "Specialized MFC" },
];

const CUTOUT_M3030VA = "https://cdn.sanity.io/m3030va.jpg";
const CUTOUT_MD800C = "https://cdn.sanity.io/md800c.jpg";

function renderSection(
  overrides: Partial<Parameters<typeof FeatureSection>[0]> = {},
) {
  return render(
    <FeatureSection
      kicker="Flagship"
      cta="Explore the {model}"
      bulletLabels={BULLET_LABELS}
      slides={SLIDES}
      cutoutByModel={{
        M3030VA: CUTOUT_M3030VA,
        MD800C: CUTOUT_MD800C,
      }}
      {...overrides}
    />,
  );
}

describe("FeatureSection", () => {
  it("renders kicker, active model, sub, and four bullets", () => {
    const { container, getByText } = renderSection();

    expect(getByText("Flagship")).toBeInTheDocument();
    expect(container.querySelector("h2")?.textContent).toBe("M3030VA");
    expect(getByText("Analogue MFC")).toBeInTheDocument();

    const bullets = container.querySelectorAll(".ho-feature__bullet");
    expect(bullets).toHaveLength(4);
    expect(getByText("Flow")).toBeInTheDocument();
    expect(getByText("Accuracy")).toBeInTheDocument();
    expect(getByText("Response")).toBeInTheDocument();
    expect(getByText("I/O")).toBeInTheDocument();
  });

  it("interpolates the active model into the CTA (#158)", () => {
    const { container } = renderSection();
    const cta = container.querySelector(".lt-btn") as HTMLAnchorElement;
    expect(cta.textContent).toContain("Explore the M3030VA");
  });

  it("CTA href points to /products/{category}/{slug} for the active model", () => {
    const { container } = renderSection();
    const cta = container.querySelector(".lt-btn") as HTMLAnchorElement;
    expect(cta.getAttribute("href")).toBe("/products/analogue/m3030va");
  });

  it("renders one dot per slide and clicking switches the active slide", () => {
    const { container } = renderSection();
    const dots = container.querySelectorAll(".ho-feature__dot");
    expect(dots).toHaveLength(SLIDES.length);

    fireEvent.click(dots[1] as Element);

    expect(container.querySelector("h2")?.textContent).toBe("MD800C");
    const cta = container.querySelector(".lt-btn") as HTMLAnchorElement;
    expect(cta.getAttribute("href")).toBe("/products/digital/md800c");
    expect(cta.textContent).toContain("MD800C");
  });

  it("uses cutoutByModel URL as the chip image src for each slide", () => {
    const { container } = renderSection();
    const slides = container.querySelectorAll(".ho-feature__chip-slide");
    const m3030 = slides[0]!.querySelector("img") as HTMLImageElement;
    const md800 = slides[1]!.querySelector("img") as HTMLImageElement;
    expect(m3030.src).toContain("m3030va.jpg");
    expect(md800.src).toContain("md800c.jpg");
  });

  it("falls back to the placeholder when a model has no cutout", () => {
    const { container } = renderSection({
      cutoutByModel: { M3030VA: CUTOUT_M3030VA },
    });
    const slides = container.querySelectorAll(".ho-feature__chip-slide");
    const ld030 = slides[2]!.querySelector("img") as HTMLImageElement;
    expect(ld030.src).toContain(FLAGSHIP_IMAGE_PLACEHOLDER);
  });

  it("returns null when the active model has no SLIDE_SPECS entry", () => {
    const { container } = renderSection({
      slides: [{ model: "ZZZ_UNKNOWN", sub: "Mystery" }],
    });
    expect(container.querySelector(".ho-feature")).toBeNull();
  });

  it("aria-current and data-active reflect the active slide after dot click", () => {
    const { container } = renderSection();
    const dots = container.querySelectorAll(".ho-feature__dot");

    fireEvent.click(dots[1] as Element);

    expect(dots[0]!.getAttribute("aria-current")).toBe("false");
    expect(dots[1]!.getAttribute("aria-current")).toBe("true");
    expect(dots[1]!.getAttribute("data-active")).toBe("true");
  });
});
