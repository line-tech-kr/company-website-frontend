"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { HeaderNavProvider, type HeaderNavCtx } from "./HeaderNavContext";

const OPEN_DELAY = 120;
const CLOSE_DELAY = 120;
const SCROLL_ON = 40;
const SCROLL_OFF = 30;

type Props = { children: React.ReactNode };

export function HeaderShell({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const openTimer = useRef<number | null>(null);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => (prev ? y > SCROLL_OFF : y > SCROLL_ON));
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ctx = useMemo<HeaderNavCtx>(() => {
    const clearTimers = () => {
      if (openTimer.current) {
        window.clearTimeout(openTimer.current);
        openTimer.current = null;
      }
      if (closeTimer.current) {
        window.clearTimeout(closeTimer.current);
        closeTimer.current = null;
      }
    };
    return {
      openId,
      setOpenId: (id) => {
        clearTimers();
        setOpenId(id);
      },
      onItemEnter: (id) => {
        if (closeTimer.current) {
          window.clearTimeout(closeTimer.current);
          closeTimer.current = null;
        }
        if (openId === id) return;
        if (openTimer.current) window.clearTimeout(openTimer.current);
        openTimer.current = window.setTimeout(() => {
          setOpenId(id);
          openTimer.current = null;
        }, OPEN_DELAY);
      },
      onItemLeave: () => {
        if (openTimer.current) {
          window.clearTimeout(openTimer.current);
          openTimer.current = null;
        }
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => {
          setOpenId(null);
          closeTimer.current = null;
        }, CLOSE_DELAY);
      },
    };
  }, [openId]);

  const cls = ["pd-top", scrolled && "is-scrolled", openId && "is-menuopen"]
    .filter(Boolean)
    .join(" ");

  return (
    <HeaderNavProvider value={ctx}>
      <header className={cls}>{children}</header>
    </HeaderNavProvider>
  );
}
