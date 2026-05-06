"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SearchPanel } from "../Search/SearchPanel";
import {
  HeaderNavProvider,
  type HeaderNavCtx,
} from "../HeaderNav/HeaderNavContext";
import {
  MobileNavProvider,
  type MobileNavCtx,
} from "../MobileNav/MobileNavContext";
import { MobileNav } from "../MobileNav/MobileNav";
import type {
  ShellSearch,
  ShellMobileNav,
  ShellNavItem,
} from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";

type SearchCtx = {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  registerSearchTrigger: (el: HTMLButtonElement | null) => void;
};

const SearchStateCtx = createContext<SearchCtx | null>(null);

export function useSearch(): SearchCtx {
  const ctx = useContext(SearchStateCtx);
  if (!ctx) throw new Error("useSearch must be used inside <HeaderShell>");
  return ctx;
}

const SCROLL_ON = 40;
const SCROLL_OFF = 30;
const OPEN_DELAY = 120;
const CLOSE_DELAY = 120;

type Props = {
  children: React.ReactNode;
  search: ShellSearch;
  mobileNav: ShellMobileNav;
  navItems: ShellNavItem[];
  quoteLabel: string;
  locale: Locale;
};

export function HeaderShell({
  children,
  search,
  mobileNav,
  navItems,
  quoteLabel,
  locale,
}: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileNavTriggerRef = useRef<HTMLButtonElement | null>(null);
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
      if (e.key !== "Escape" || !openId) return;
      const trigger = document.querySelector<HTMLButtonElement>(
        `[aria-controls="pd-mega-${openId}"]`,
      );
      setOpenId(null);
      trigger?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

  const closeSearch = useCallback(() => setSearchOpen(false), []);

  const registerSearchTrigger = useCallback((el: HTMLButtonElement | null) => {
    triggerRef.current = el;
  }, []);

  const registerMobileNavTrigger = useCallback(
    (el: HTMLButtonElement | null) => {
      mobileNavTriggerRef.current = el;
    },
    [],
  );

  const searchCtx = useMemo(
    () => ({ searchOpen, setSearchOpen, registerSearchTrigger }),
    [searchOpen, registerSearchTrigger],
  );

  const mobileNavCtx = useMemo<MobileNavCtx>(
    () => ({
      mobileNavOpen,
      setMobileNavOpen,
      registerMobileNavTrigger,
    }),
    [mobileNavOpen, registerMobileNavTrigger],
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
    mobileNavOpen && "is-mnavopen",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SearchStateCtx.Provider value={searchCtx}>
      <HeaderNavProvider value={navCtx}>
        <MobileNavProvider value={mobileNavCtx}>
          <header
            className={cls}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                navCtx.setOpenId(null);
              }
            }}
          >
            {children}
            <SearchPanel
              content={search}
              open={searchOpen}
              onClose={closeSearch}
              triggerRef={triggerRef}
            />
            <MobileNav
              items={navItems}
              locale={locale}
              heading={mobileNav.heading}
              quoteLabel={quoteLabel}
              open={mobileNavOpen}
              onClose={() => setMobileNavOpen(false)}
              triggerRef={mobileNavTriggerRef}
            />
          </header>
        </MobileNavProvider>
      </HeaderNavProvider>
    </SearchStateCtx.Provider>
  );
}
