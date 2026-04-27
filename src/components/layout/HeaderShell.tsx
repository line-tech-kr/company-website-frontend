"use client";

import { useEffect, useState } from "react";

const SCROLL_ON = 40;
const SCROLL_OFF = 30;

type Props = { children: React.ReactNode };

export function HeaderShell({ children }: Props) {
  const [scrolled, setScrolled] = useState(false);

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

  const cls = ["pd-top", scrolled && "is-scrolled"].filter(Boolean).join(" ");

  return <header className={cls}>{children}</header>;
}
