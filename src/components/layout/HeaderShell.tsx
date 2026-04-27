"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchPanel } from "./SearchPanel";
import { SearchProvider, type SearchCtx } from "./SearchContext";
import type { ShellSearch } from "@/lib/content/shell";

const SCROLL_ON = 40;
const SCROLL_OFF = 30;

type Props = {
  children: React.ReactNode;
  search: ShellSearch;
};

export function HeaderShell({ children, search }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

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

  const registerSearchTrigger = useCallback((el: HTMLButtonElement | null) => {
    triggerRef.current = el;
  }, []);

  const ctx = useMemo<SearchCtx>(
    () => ({ searchOpen, setSearchOpen, registerSearchTrigger }),
    [searchOpen, registerSearchTrigger],
  );

  const cls = [
    "pd-top",
    scrolled && "is-scrolled",
    searchOpen && "is-searchopen",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SearchProvider value={ctx}>
      <header className={cls}>
        {children}
        <SearchPanel
          content={search}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          triggerRef={triggerRef}
        />
      </header>
    </SearchProvider>
  );
}
