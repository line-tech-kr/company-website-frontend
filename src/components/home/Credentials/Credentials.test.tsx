import "@/test/mocks/i18n";

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Credentials } from "./Credentials";
import type { HomeContent } from "@/lib/content/home";

const baseHome = {
  credentials: {
    kicker: "04",
    title: "Certifications",
    sub: "Trusted standards.",
    items: [
      {
        name: "ISO 9001",
        scope: "Quality management",
        category: "quality" as const,
        slug: "cert-iso-9001",
      },
      {
        name: "CE",
        scope: "EU compliance",
        category: "compliance" as const,
        slug: "cert-ce",
      },
      {
        name: "KAIST R&D",
        scope: "Research collaboration",
        category: "partnership" as const,
      },
    ],
    viewAll: "View all certifications",
  },
} as unknown as HomeContent;

describe("Credentials", () => {
  it("renders every credential with name, scope, and a category icon", () => {
    const { container, getByText } = render(<Credentials h={baseHome} />);

    expect(getByText("ISO 9001")).toBeInTheDocument();
    expect(getByText("CE")).toBeInTheDocument();
    expect(getByText("KAIST R&D")).toBeInTheDocument();
    expect(getByText("Quality management")).toBeInTheDocument();

    const icons = container.querySelectorAll(".ho-credentials__icon");
    expect(icons).toHaveLength(3);
    expect(icons[0]!.getAttribute("data-category")).toBe("quality");
    expect(icons[1]!.getAttribute("data-category")).toBe("compliance");
    expect(icons[2]!.getAttribute("data-category")).toBe("partnership");
  });

  it("wraps slugged items in a link to the cert anchor", () => {
    const { container } = render(<Credentials h={baseHome} />);
    const links = container.querySelectorAll("a.ho-credentials__card--link");
    expect(links).toHaveLength(2);
    expect(links[0]!.getAttribute("href")).toBe(
      "/resources/certifications#cert-iso-9001",
    );
    expect(links[1]!.getAttribute("href")).toBe(
      "/resources/certifications#cert-ce",
    );
  });

  it("renders un-slugged items as non-link cards", () => {
    const { container } = render(<Credentials h={baseHome} />);
    const cards = container.querySelectorAll(".ho-credentials__card");
    expect(cards).toHaveLength(3);
    const nonLink = cards[2] as HTMLElement;
    expect(nonLink.tagName).toBe("DIV");
    expect(nonLink.classList.contains("ho-credentials__card--link")).toBe(
      false,
    );
  });

  it('renders the "View all" CTA pointing at the certifications hub', () => {
    const { container, getByText } = render(<Credentials h={baseHome} />);
    expect(getByText("View all certifications")).toBeInTheDocument();
    const cta = container.querySelector(
      "a.ho-credentials__link",
    ) as HTMLAnchorElement;
    expect(cta.getAttribute("href")).toBe("/resources/certifications");
  });
});
