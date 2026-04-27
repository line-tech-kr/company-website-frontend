"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchPanel } from "./SearchPanel";
import { SearchProvider, type SearchCtx } from "./SearchContext";
import { HeaderNavProvider, type HeaderNavCtx } from "./HeaderNavContext";
import type { ShellSearch } from "@/lib/content/shell";

const SCROLL_ON = 40;
const SCROLL_OFF = 30;
const OPEN_DELAY = 120;
const CLOSE_DELAY = 120;

type Props = {
  children: React.ReactNode;
  search: ShellSearch;
};

export function HeaderShell({ children, search }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
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

  const registerSearchTrigger = useCallback((el: HTMLButtonElement | null) => {
    triggerRef.current = el;
  }, []);

  const searchCtx = useMemo<SearchCtx>(
    () => ({ searchOpen, setSearchOpen, registerSearchTrigger }),
    [searchOpen, registerSearchTrigger],
  );

  const navCtx = useMemo<HeaderNavCtx>(() => {
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

  const cls = [
    "pd-top",
    scrolled && "is-scrolled",
    searchOpen && "is-searchopen",
    openId && "is-menuopen",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SearchProvider value={searchCtx}>
      <HeaderNavProvider value={navCtx}>
        <header className={cls}>
          {children}
          <SearchPanel
            content={search}
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
            triggerRef={triggerRef}
          />
        </header>
      </HeaderNavProvider>
    </SearchProvider>
  );
}
