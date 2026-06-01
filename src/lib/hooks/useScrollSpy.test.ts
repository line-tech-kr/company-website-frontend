import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useScrollSpy } from "./useScrollSpy";

type Cb = (
  entries: Array<{ isIntersecting: boolean; target: Element }>,
) => void;

let observers: Array<{
  callback: Cb;
  observed: Element[];
  disconnect: () => void;
}> = [];
let observerCtor: ReturnType<typeof vi.fn>;

function fireEntries(
  entries: Array<{ id: string; isIntersecting: boolean }>,
): void {
  const targets = entries.map(({ id, isIntersecting }) => ({
    isIntersecting,
    target: document.getElementById(id) as Element,
  }));
  for (const obs of observers) obs.callback(targets);
}

const originalScrollHeight = Object.getOwnPropertyDescriptor(
  document.documentElement,
  "scrollHeight",
);

beforeEach(() => {
  observers = [];
  observerCtor = vi.fn().mockImplementation(function (
    this: IntersectionObserver,
    cb: Cb,
  ) {
    const observed: Element[] = [];
    const record = {
      callback: cb,
      observed,
      disconnect: vi.fn(() => {
        const i = observers.indexOf(record);
        if (i >= 0) observers.splice(i, 1);
      }),
    };
    observers.push(record);
    return {
      observe: (el: Element) => observed.push(el),
      unobserve: vi.fn(),
      disconnect: record.disconnect,
      takeRecords: () => [],
      root: null,
      rootMargin: "",
      thresholds: [],
    } as unknown as IntersectionObserver;
  });
  vi.stubGlobal("IntersectionObserver", observerCtor);

  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: 5000,
  });
  window.scrollY = 0;
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: 800,
  });

  document.body.innerHTML = "";
  for (const id of ["a", "b", "c"]) {
    const el = document.createElement("section");
    el.id = id;
    document.body.append(el);
  }
});

afterEach(() => {
  vi.unstubAllGlobals();
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

  it("updates to the id of the section that becomes intersecting", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      fireEntries([{ id: "b", isIntersecting: true }]);
    });
    expect(result.current).toBe("b");
  });

  it("prefers earlier ids when multiple sections are intersecting", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      fireEntries([
        { id: "b", isIntersecting: true },
        { id: "c", isIntersecting: true },
      ]);
    });
    expect(result.current).toBe("b");
  });

  it("does not update active when scrolled near the page bottom", () => {
    window.scrollY = 4300; // 4300 + 800 = 5100 > 5000 - 64
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    act(() => {
      fireEntries([{ id: "b", isIntersecting: true }]);
    });
    expect(result.current).toBe("a");
  });

  it("snaps to the last id on the scroll handler at the bottom", () => {
    const { result } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    window.scrollY = 4300;
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(result.current).toBe("c");
  });

  it("disconnects the observer on unmount", () => {
    const { unmount } = renderHook(() => useScrollSpy(["a", "b", "c"]));
    expect(observers).toHaveLength(1);
    const disconnect = observers[0].disconnect;
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
