import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, within, act } from "@testing-library/react";
import { useRef } from "react";
import { MobileNav } from "./MobileNav";
import { LT_SHELL, getProductsCategories } from "@/lib/content/shell";

let pathnameValue = "/";

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
  usePathname: () => pathnameValue,
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
}));

vi.mock("next-intl", () => ({
  useLocale: () => "en",
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n/routing", () => ({
  routing: { locales: ["ko", "en", "zh"] },
}));

beforeEach(() => {
  pathnameValue = "/";
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

afterEach(() => {
  vi.clearAllMocks();
});

function Harness({
  open,
  onClose = vi.fn(),
}: {
  open: boolean;
  onClose?: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      <button ref={triggerRef}>trigger</button>
      <MobileNav
        items={LT_SHELL.en.nav}
        locale="en"
        heading={LT_SHELL.en.mobileNav.heading}
        quoteLabel={LT_SHELL.en.quoteLabel}
        open={open}
        onClose={onClose}
        triggerRef={triggerRef}
      />
    </>
  );
}

describe("MobileNav", () => {
  it("renders all 4 top-level nav items, locale switcher, and Quote button", () => {
    const { container } = render(<Harness open={true} />);

    LT_SHELL.en.nav.forEach((item) => {
      expect(
        within(container).getByText(item.label, { exact: true }),
      ).toBeInTheDocument();
    });
    expect(container.querySelector(".lt-locale")).toBeInTheDocument();
    expect(within(container).getByText("Quote")).toBeInTheDocument();
  });

  it("menu items render as accordion triggers, contact renders as a link", () => {
    const { container } = render(<Harness open={true} />);

    const productsBtn = container.querySelector(
      '[aria-controls="pd-mnav-section-products"]',
    );
    expect(productsBtn?.tagName).toBe("BUTTON");
    expect(productsBtn).toHaveAttribute("aria-expanded", "false");

    const contact = LT_SHELL.en.nav.find((i) => !i.menu);
    if (!contact) throw new Error("expected a non-menu nav item");
    const link = container.querySelector(`a[href="${contact.href}"]`);
    expect(link?.tagName).toBe("A");
  });

  it("clicking an accordion trigger toggles aria-expanded and reveals sub-items", () => {
    const { container } = render(<Harness open={true} />);

    const trigger = container.querySelector(
      '[aria-controls="pd-mnav-section-products"]',
    ) as HTMLButtonElement;
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    const body = container.querySelector(
      "#pd-mnav-section-products",
    ) as HTMLElement;
    expect(body).toHaveAttribute("hidden");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(body).not.toHaveAttribute("hidden");

    const cats = getProductsCategories("en");
    cats.forEach((c) => {
      expect(within(body).getByText(c.label)).toBeInTheDocument();
    });
    expect(within(body).getByText("See all products")).toBeInTheDocument();
  });

  it("Resources accordion reveals 4 resource links (no products 'all' link)", () => {
    const { container } = render(<Harness open={true} />);

    const trigger = container.querySelector(
      '[aria-controls="pd-mnav-section-resources"]',
    ) as HTMLButtonElement;
    fireEvent.click(trigger);

    const body = container.querySelector(
      "#pd-mnav-section-resources",
    ) as HTMLElement;
    ["Catalogues", "CAD drawings", "Manuals", "Certifications"].forEach(
      (label) => {
        expect(within(body).getByText(label)).toBeInTheDocument();
      },
    );
    expect(
      within(body).queryByText(/See all products/),
    ).not.toBeInTheDocument();
  });

  it("Esc key calls onClose when open", () => {
    const onClose = vi.fn();
    render(<Harness open={true} onClose={onClose} />);

    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on route change (pathname differs from initial)", () => {
    const onClose = vi.fn();
    pathnameValue = "/";
    const { rerender } = render(<Harness open={true} onClose={onClose} />);

    pathnameValue = "/products";
    act(() => {
      rerender(<Harness open={true} onClose={onClose} />);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose on initial mount with stable pathname", () => {
    const onClose = vi.fn();
    pathnameValue = "/anywhere";
    render(<Harness open={true} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();
  });

  it("is inert when closed", () => {
    const { container } = render(<Harness open={false} />);
    const root = container.querySelector(".pd-mnav") as HTMLElement;
    expect(root).toHaveAttribute("inert");
  });

  it("is not inert when open", () => {
    const { container } = render(<Harness open={true} />);
    const root = container.querySelector(".pd-mnav") as HTMLElement;
    expect(root).not.toHaveAttribute("inert");
  });
});
