import { describe, expect, it, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { HeaderNav } from "./HeaderNav";
import { HeaderNavProvider, type HeaderNavCtx } from "./HeaderNavContext";
import { LT_SHELL } from "@/lib/content/shell";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({
    href,
    children,
    ...rest
  }: { href: unknown; children: React.ReactNode } & Record<
    string,
    unknown
  >) => (
    <a href={typeof href === "string" ? href : "#"} {...rest}>
      {children}
    </a>
  ),
}));

function stubCtx(overrides: Partial<HeaderNavCtx> = {}): HeaderNavCtx {
  return {
    openId: null,
    setOpenId: vi.fn(),
    onItemEnter: vi.fn(),
    onItemLeave: vi.fn(),
    ...overrides,
  };
}

function renderNav(ctx: HeaderNavCtx) {
  return render(
    <HeaderNavProvider value={ctx}>
      <HeaderNav items={LT_SHELL.en.nav} />
    </HeaderNavProvider>,
  );
}

describe("HeaderNav", () => {
  it("renders menu items as buttons and non-menu items as links", () => {
    const { container } = renderNav(stubCtx());
    const products = container.querySelector(
      '[aria-controls="pd-mega-products"]',
    );
    expect(products?.tagName).toBe("BUTTON");
    expect(products).toHaveAttribute("aria-haspopup", "true");
    expect(products).toHaveAttribute("aria-expanded", "false");
    expect(container.querySelector('a[href="/products"]')).not.toBeNull();

    const contact = LT_SHELL.en.nav.find((i) => !i.menu);
    if (!contact) throw new Error("expected a non-menu nav item in fixture");
    const link = container.querySelector(`a[href="${contact.href}"]`);
    expect(link?.tagName).toBe("A");
    expect(link).not.toHaveAttribute("aria-haspopup");
  });

  it("clicking a closed menu button opens its panel", () => {
    const setOpenId = vi.fn();
    const { container } = renderNav(stubCtx({ openId: null, setOpenId }));
    const btn = container.querySelector(
      '[aria-controls="pd-mega-products"]',
    ) as HTMLButtonElement;
    fireEvent.click(btn);
    expect(setOpenId).toHaveBeenCalledWith("products");
  });

  it("clicking an open menu button closes it", () => {
    const setOpenId = vi.fn();
    const { container } = renderNav(stubCtx({ openId: "products", setOpenId }));
    const btn = container.querySelector(
      '[aria-controls="pd-mega-products"]',
    ) as HTMLButtonElement;
    expect(btn).toHaveAttribute("aria-expanded", "true");
    fireEvent.click(btn);
    expect(setOpenId).toHaveBeenCalledWith(null);
  });

  it("hovering a non-menu item triggers close-grace", () => {
    const onItemLeave = vi.fn();
    const contact = LT_SHELL.en.nav.find((i) => !i.menu);
    if (!contact) throw new Error("expected a non-menu nav item in fixture");
    const { container } = renderNav(
      stubCtx({ openId: "products", onItemLeave }),
    );
    const link = container.querySelector(
      `a[href="${contact.href}"]`,
    ) as HTMLAnchorElement;
    fireEvent.mouseEnter(link);
    expect(onItemLeave).toHaveBeenCalled();
  });

  it("hovering a menu item schedules the open via onItemEnter", () => {
    const onItemEnter = vi.fn();
    const { container } = renderNav(stubCtx({ onItemEnter }));
    const wrapper = container.querySelector(
      '[data-navid="products"]',
    ) as HTMLElement;
    fireEvent.mouseEnter(wrapper);
    expect(onItemEnter).toHaveBeenCalledWith("products");
  });
});
