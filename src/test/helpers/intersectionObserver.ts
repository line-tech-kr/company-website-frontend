import { vi, type Mock } from "vitest";

export type IOEntry = { id: string; isIntersecting: boolean };

export type IORecord = {
  callback: IntersectionObserverCallback;
  options?: IntersectionObserverInit;
  observed: Element[];
  disconnect: Mock;
};

export type IOHarness = {
  observers: IORecord[];
  ctor: Mock;
  fire(entries: IOEntry[]): void;
};

export function installIntersectionObserver(): IOHarness {
  const observers: IORecord[] = [];
  const ctor = vi.fn().mockImplementation(function (
    this: IntersectionObserver,
    cb: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    const observed: Element[] = [];
    const record: IORecord = {
      callback: cb,
      options,
      observed,
      disconnect: vi.fn(() => {
        const i = observers.indexOf(record);
        if (i >= 0) observers.splice(i, 1);
      }),
    };
    observers.push(record);
    Object.assign(this, {
      observe: (el: Element) => observed.push(el),
      unobserve: vi.fn(),
      disconnect: record.disconnect,
      takeRecords: () => [],
      root: null,
      rootMargin: "",
      thresholds: [],
    });
  });
  vi.stubGlobal("IntersectionObserver", ctor);

  return {
    observers,
    ctor,
    fire(entries) {
      const targets = entries.map(({ id, isIntersecting }) => ({
        isIntersecting,
        target: document.getElementById(id) as Element,
      })) as unknown as IntersectionObserverEntry[];
      for (const obs of observers)
        obs.callback(targets, obs as unknown as IntersectionObserver);
    },
  };
}
