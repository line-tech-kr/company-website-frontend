import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { installIntersectionObserver, type IOHarness } from "@/test/helpers/intersectionObserver";
import { useScrollSpy } from "./useScrollSpy";

const SCROLL_HEIGHT = 5000;
const VIEWPORT = 800;
// `useScrollSpy` treats the page as "near bottom" when
// scrollY + VIEWPORT >= SCROLL_HEIGHT - bottomEdgeOffset (default 64).
// 4300 + 800 = 5100 ≥ 5000 − 64.
const NEAR_BOTTOM_SCROLL_Y = 4300;

const originalScrollHeight = Object.getOwnPropertyDescriptor(
  document.documentElement,
  "scrollHeight",
);

let io: IOHarness;

beforeEach(() => {
  io = installIntersectionObserver();

  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: SCROLL_HEIGHT,
  });
  window.scrollY = 0;
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: VIEWPORT,
  });

  document.body.innerHTML = "";
  for (const id of ["a", "b", "c"]) {
    const el = document.createElement("section");
    el.id = id;
    document.body.append(el);
  }
});

afterEach(() => {
  if (originalScrollHeight) {
    Object.defineProperty(
      document.documentElement,
      "scrollHeight",
      originalScrollHeight,
    );
  }
});

describe("useScrollSpy", () => {
  it("returns the first id immediately", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    expect(result.current).toBe("a");
  });

  it("returns empty string when given no ids", () => {
    const { result } = renderHook(() => useScrollSpy([]));
    expect(result.current).toBe("");
  });

  it("constructs the IntersectionObserver with the default rootMargin", () => {
    renderHook(() => useScrollSpy(["a", "b", "c"]));
    expect(io.ctor).toHaveBeenCalledTimes(1);
    expect(io.ctor.mock.calls[0][1]).toEqual({
      rootMargin: "-30% 0px -70% 0px",
    });
  });

  it("uses a caller-supplied rootMargin", () => {
    renderHook(() =>
      useScrollSpy(["a", "b", "c"], { rootMargin: "-10% 0px -10% 0px" }),
    );
    expect(io.ctor.mock.calls[0][1]).toEqual({
      rootMargin: "-10% 0px -10% 0px",
    });
  });

  it("updates to the id of the section that becomes intersecting", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      io.fire([{ id: "b", isIntersecting: true }]);
    });
    expect(result.current).toBe("b");
  });

  it("prefers earlier ids when multiple sections are intersecting", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      io.fire([
        { id: "b", isIntersecting: true },
        { id: "c", isIntersecting: true },
      ]);
    });
    expect(result.current).toBe("b");
  });

  it("does not update active when scrolled near the page bottom", () => {
    window.scrollY = NEAR_BOTTOM_SCROLL_Y;
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      io.fire([{ id: "b", isIntersecting: true }]);
    });
    expect(result.current).toBe("a");
  });

  it("snaps to the last id on the scroll handler at the bottom", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    window.scrollY = NEAR_BOTTOM_SCROLL_Y;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("c");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    expect(io.observers).toHaveLength(1);
    const disconnect = io.observers[0].disconnect;
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
