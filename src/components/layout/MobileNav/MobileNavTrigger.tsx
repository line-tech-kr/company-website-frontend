"use client";

import { useEffect, useRef } from "react";
import { useMobileNav } from "./MobileNavContext";

const PANEL_ID = "lt-mobile-nav-panel";

type Props = {
  openLabel: string;
  closeLabel: string;
};

export function MobileNavTrigger({ openLabel, closeLabel }: Props) {
  const { mobileNavOpen, setMobileNavOpen, registerMobileNavTrigger } =
    useMobileNav();
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerMobileNavTrigger(ref.current);
    return () => registerMobileNavTrigger(null);
  }, [registerMobileNavTrigger]);

  return (
    <button
      ref={ref}
      type="button"
      className="pd-top__iconbtn pd-top__hamburger"
      aria-label={mobileNavOpen ? closeLabel : openLabel}
      aria-haspopup="dialog"
      aria-expanded={mobileNavOpen}
      aria-controls={PANEL_ID}
      onClick={() => setMobileNavOpen(!mobileNavOpen)}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
      >
        {mobileNavOpen ? (
          <>
            <path
              d="M4 4l10 10"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M14 4L4 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <path
              d="M3 5h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M3 9h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M3 13h12"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}
