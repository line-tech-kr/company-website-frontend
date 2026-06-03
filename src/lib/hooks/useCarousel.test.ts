import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCarousel } from "./useCarousel";

type MqlListener = (this: MediaQueryList, ev: MediaQueryListEvent) => void;

// `useCarousel` uses useSyncExternalStore, whose snapshot getter calls
// `window.matchMedia()` afresh on every read. The mock below returns a new
// object per call whose `matches` field reads through to the captured
// `prefersReducedMotion` closure, so flipping that variable + firing a
// change event makes the snapshot return the new value on the next read.
let prefersReducedMotion = false;
let mqlListeners: MqlListener[] = [];

function setReducedMotion(value: boolean): void {
  prefersReducedMotion = value;
  const event = { matches: value } as MediaQueryListEvent;
  for (const cb of mqlListeners) cb.call({} as MediaQueryList, event);
}

beforeEach(() => {
  vi.useFakeTimers();
  prefersReducedMotion = false;
  mqlListeners = [];

  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return prefersReducedMotion;
    },
    media: query,
    onchange: null,
    addEventListener: (_event: string, cb: MqlListener) => {
      mqlListeners.push(cb);
    },
    removeEventListener: (_event: string, cb: MqlListener) => {
      mqlListeners = mqlListeners.filter((l) => l !== cb);
    },
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useCarousel", () => {
  it("starts on index 0", () => {
    const { result } = renderHook(() => useCarousel(3, { intervalMs: 1000 }));
    expect(result.current.active).toBe(0);
  });

  it("advances after the interval", () => {
    const { result } = renderHook(() => useCarousel(3, { intervalMs: 1000 }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.active).toBe(1);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.active).toBe(2);
  });

  it("wraps from the last index back to zero", () => {
    const { result } = renderHook(() => useCarousel(2, { intervalMs: 500 }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.active).toBe(1);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.active).toBe(0);
  });

  it("does not advance when length <= 1", () => {
    const { result } = renderHook(() => useCarousel(1, { intervalMs: 500 }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.active).toBe(0);
  });

  it("does not advance when prefers-reduced-motion is set", () => {
    prefersReducedMotion = true;
    const { result } = renderHook(() => useCarousel(3, { intervalMs: 1000 }));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.active).toBe(0);
  });

  it("exposes setActive for manual jumps", () => {
    const { result } = renderHook(() => useCarousel(4, { intervalMs: 1000 }));
    act(() => {
      result.current.setActive(2);
    });
    expect(result.current.active).toBe(2);
  });

  it("stops advancing once reduced-motion turns on at runtime", () => {
    const { result } = renderHook(() => useCarousel(3, { intervalMs: 1000 }));
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.active).toBe(1);
    act(() => {
      setReducedMotion(true);
    });
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.active).toBe(1);
  });
});
