import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";

const searchCtx = {
  searchOpen: false,
  setSearchOpen: vi.fn(),
  registerSearchTrigger: vi.fn(),
};

vi.mock("../Header/HeaderShell", () => ({
  useSearch: () => searchCtx,
}));

import { SearchTriggerButton } from "./SearchTriggerButton";

beforeEach(() => {
  searchCtx.searchOpen = false;
  searchCtx.setSearchOpen.mockReset();
  searchCtx.registerSearchTrigger.mockReset();
});

describe("SearchTriggerButton", () => {
  it("reflects the closed search state via aria-expanded", () => {
    const { getByRole } = render(<SearchTriggerButton label="Open search" />);
    const btn = getByRole("button", { name: "Open search" });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(btn).toHaveAttribute("aria-haspopup", "dialog");
    expect(btn).toHaveAttribute("aria-controls", "lt-search-panel");
  });

  it("reflects the open search state via aria-expanded", () => {
    searchCtx.searchOpen = true;
    const { getByRole } = render(<SearchTriggerButton label="Open search" />);
    expect(getByRole("button", { name: "Open search" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("clicking the button calls setSearchOpen(true)", () => {
    const { getByRole } = render(<SearchTriggerButton label="Open search" />);
    fireEvent.click(getByRole("button", { name: "Open search" }));
    expect(searchCtx.setSearchOpen).toHaveBeenCalledWith(true);
  });

  it("registers the button ref on mount and clears it on unmount", () => {
    const { unmount } = render(<SearchTriggerButton label="Open search" />);
    expect(searchCtx.registerSearchTrigger).toHaveBeenCalledTimes(1);
    const registered = searchCtx.registerSearchTrigger.mock.calls[0][0];
    expect(registered).toBeInstanceOf(HTMLButtonElement);

    unmount();
    expect(searchCtx.registerSearchTrigger).toHaveBeenCalledTimes(2);
    expect(searchCtx.registerSearchTrigger.mock.calls[1][0]).toBeNull();
  });
});
