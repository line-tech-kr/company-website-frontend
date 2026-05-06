"use client";

import { useEffect, useState } from "react";

type Options = {
  rootMargin?: string;
  bottomEdgeOffset?: number;
};

export function useScrollSpy(ids: string[], options: Options = {}): string {
  const { rootMargin = "-30% 0px -70% 0px", bottomEdgeOffset = 64 } = options;
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const intersecting = new Set<string>();

    const isNearBottom = () =>
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - bottomEdgeOffset;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNearBottom()) return;
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        const next = ids.find((id) => intersecting.has(id));
        if (next) setActive(next);
      },
      { rootMargin },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    const onScroll = () => {
      if (isNearBottom() && ids.length > 0) setActive(ids[ids.length - 1]);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids, rootMargin, bottomEdgeOffset]);

  return active;
}
