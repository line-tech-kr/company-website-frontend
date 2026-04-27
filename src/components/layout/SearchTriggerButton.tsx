"use client";

import { useEffect, useRef } from "react";
import { useSearch } from "./SearchContext";

type Props = {
  /** Localized aria-label for the icon-only button. */
  label: string;
};

export function SearchTriggerButton({ label }: Props) {
  const { searchOpen, setSearchOpen, registerSearchTrigger } = useSearch();
  const ref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerSearchTrigger(ref.current);
    return () => registerSearchTrigger(null);
  }, [registerSearchTrigger]);

  return (
    <button
      ref={ref}
      type="button"
      className="pd-top__iconbtn"
      aria-label={label}
      aria-haspopup="dialog"
      aria-expanded={searchOpen}
      aria-controls="lt-search-panel"
      onClick={() => setSearchOpen(true)}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M11 11l3 3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
