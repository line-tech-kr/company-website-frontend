import "@/test/mocks/i18n";

import { describe, expect, it, vi } from "vitest";
import { render, fireEvent, within } from "@testing-library/react";
import { MegaMenu, MegaMenuScrim } from "./MegaMenu";
import {
  HeaderNavProvider,
  type HeaderNavCtx,
} from "../HeaderNav/HeaderNavContext";
import { LT_SHELL, getProductsCategories } from "@/lib/content/shell";

function stubCtx(overrides: Partial<HeaderNavCtx> = {}): HeaderNavCtx {
  return {
    openId: null,
    setOpenId: vi.fn(),
    onItemEnter: vi.fn(),
    onItemLeave: vi.fn(),
    ...overrides,
  };
}

function renderMega(ctx: HeaderNavCtx) {
  return render(
    <HeaderNavProvider value={ctx}>
      <MegaMenu items={LT_SHELL.en.nav} locale="en" />
      <MegaMenuScrim />
    </HeaderNavProvider>,
  );
}

describe("MegaMenu", () => {
  it("hides all panels and the scrim when no item is open", () => {
    const { container } = renderMega(stubCtx({ openId: null }));

    container.querySelectorAll(".pd-mega__panel").forEach((panel) => {
      expect(panel).toHaveAttribute("aria-hidden", "true");
      expect(panel).not.toHaveClass("is-open");
    });

    const scrim = container.querySelector(".pd-mega-scrim");
    expect(scrim).not.toHaveClass("is-active");
  });

  it("renders all 4 product categories + featured M3030VA card when products is open", () => {
    const { container } = renderMega(stubCtx({ openId: "products" }));

    const panel = container.querySelector('[data-id="products"]');
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveClass("is-open");

    const cats = getProductsCategories("en");
    expect(cats).toHaveLength(4);
    cats.forEach((c) => {
      expect(
        within(panel as HTMLElement).getByText(c.label),
      ).toBeInTheDocument();
    });

    expect(
      within(panel as HTMLElement).getByText("M3030VA"),
    ).toBeInTheDocument();
    expect(
      within(panel as HTMLElement).getByText("See all products"),
    ).toBeInTheDocument();
  });

  it("renders 4 resource links + featured card when resources is open", () => {
    const { container } = renderMega(stubCtx({ openId: "resources" }));

    const panel = container.querySelector('[data-id="resources"]');
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveClass("is-open");

    ["Catalogues", "CAD drawings", "Manuals", "Certifications"].forEach(
      (label) => {
        expect(
          within(panel as HTMLElement).getByText(label),
        ).toBeInTheDocument();
      },
    );
    expect(
      within(panel as HTMLElement).getByText(/M3030VA manual/i),
    ).toBeInTheDocument();
  });

  it("clicking the scrim calls setOpenId(null)", () => {
    const setOpenId = vi.fn();
    const { container } = renderMega(
      stubCtx({ openId: "products", setOpenId }),
    );

    const scrim = container.querySelector(".pd-mega-scrim");
    expect(scrim).toHaveClass("is-active");

    fireEvent.click(scrim as Element);
    expect(setOpenId).toHaveBeenCalledWith(null);
  });

  it("only the active panel is exposed; siblings remain aria-hidden", () => {
    const { container } = renderMega(stubCtx({ openId: "products" }));

    const products = container.querySelector('[data-id="products"]');
    const resources = container.querySelector('[data-id="resources"]');

    expect(products).toHaveAttribute("aria-hidden", "false");
    expect(resources).toHaveAttribute("aria-hidden", "true");
  });

  it("renders 4 company links + 13-certifications featured card when company is open", () => {
    const { container } = renderMega(stubCtx({ openId: "company" }));

    const panel = container.querySelector('[data-id="company"]');
    expect(panel).toHaveAttribute("aria-hidden", "false");
    expect(panel).toHaveClass("is-open");

    ["Greeting", "History", "Certifications", "Location"].forEach((label) => {
      expect(within(panel as HTMLElement).getByText(label)).toBeInTheDocument();
    });
    expect(
      within(panel as HTMLElement).getByText(/certifications/i),
    ).toBeInTheDocument();
  });

  it("does not render a panel for nav items without a menu (e.g., contact)", () => {
    const { container } = renderMega(stubCtx({ openId: "contact" }));

    expect(container.querySelector('[data-id="contact"]')).toBeNull();

    container.querySelectorAll(".pd-mega__panel").forEach((panel) => {
      expect(panel).not.toHaveClass("is-open");
    });
  });
});
