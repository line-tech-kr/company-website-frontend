import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

let currentLocale = "en";

vi.mock("next-intl", () => ({
  useLocale: () => currentLocale,
  useTranslations: () => (key: string) => key,
}));

const routerReplace = vi.fn();
vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/products/analogue",
  useRouter: () => ({ replace: routerReplace }),
}));

import { LocaleSwitcher } from "./LocaleSwitcher";

function setLocationSearch(qs: string) {
  Object.defineProperty(window, "location", {
    value: { search: qs },
    configurable: true,
    writable: true,
  });
}

describe("LocaleSwitcher", () => {
  beforeEach(() => {
    currentLocale = "en";
    routerReplace.mockReset();
    setLocationSearch("?ref=home&page=2");
  });

  it("renders one button per configured locale", () => {
    const { container } = render(<LocaleSwitcher />);
    const buttons = container.querySelectorAll("button");
    expect(buttons).toHaveLength(3);
    expect([...buttons].map((b) => b.textContent)).toEqual(["KO", "EN", "ZH"]);
  });

  it("marks only the current locale with aria-current", () => {
    const { container } = render(<LocaleSwitcher />);
    const buttons = container.querySelectorAll("button");
    const byLang = Object.fromEntries(
      [...buttons].map((b) => [b.getAttribute("lang"), b]),
    );
    expect(byLang.en).toHaveAttribute("aria-current", "true");
    expect(byLang.ko).not.toHaveAttribute("aria-current");
    expect(byLang.zh).not.toHaveAttribute("aria-current");
  });

  it("clicking a non-active locale calls router.replace with that locale and preserves the query", () => {
    const { container } = render(<LocaleSwitcher />);
    const koButton = container.querySelector(
      'button[lang="ko"]',
    ) as HTMLButtonElement;
    fireEvent.click(koButton);
    expect(routerReplace).toHaveBeenCalledTimes(1);
    expect(routerReplace).toHaveBeenCalledWith(
      { pathname: "/products/analogue", query: { ref: "home", page: "2" } },
      { locale: "ko" },
    );
  });

  it("passes an empty query object when there is no current query string", () => {
    setLocationSearch("");
    const { container } = render(<LocaleSwitcher />);
    const koButton = container.querySelector(
      'button[lang="ko"]',
    ) as HTMLButtonElement;
    fireEvent.click(koButton);
    expect(routerReplace).toHaveBeenCalledWith(
      { pathname: "/products/analogue", query: {} },
      { locale: "ko" },
    );
  });

  it("clicking the active locale is a no-op", () => {
    const { container } = render(<LocaleSwitcher />);
    const enButton = container.querySelector(
      'button[lang="en"]',
    ) as HTMLButtonElement;
    fireEvent.click(enButton);
    expect(routerReplace).not.toHaveBeenCalled();
  });
});
