import { useEffect, useState, useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const getRMSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
const getRMServerSnapshot = () => false;

type Options = {
  intervalMs: number;
};

/**
 * Auto-advancing index hook for carousels. Skips ticks when:
 *   - length <= 1
 *   - the user has prefers-reduced-motion set
 */
export function useCarousel(length: number, { intervalMs }: Options) {
  const [active, setActive] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getRMSnapshot,
    getRMServerSnapshot,
  );

  useEffect(() => {
    if (length <= 1 || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [length, intervalMs, reducedMotion]);

  return { active, setActive };
}
