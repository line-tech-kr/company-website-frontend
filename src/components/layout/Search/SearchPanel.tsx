"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import Fuse from "fuse.js";
import { useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { ShellSearch } from "@/lib/content/shell";
import type { SearchEntry } from "@/lib/search/types";
import { useDialogPanel } from "@/lib/hooks/useDialogPanel";
import "./SearchPanel.css";

type Props = {
  content: ShellSearch;
  open: boolean;
  onClose: () => void;
  /** Trigger button to focus-restore on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const PANEL_ID = "lt-search-panel";

// Chips with a known direct URL — navigate without running a search.
// m3030va is hardcoded to analogue; update if the product series changes in Sanity.
const CHIP_URLS: Record<string, string> = {
  m3030va: "/products/analogue/m3030va",
  "digital-mfc": "/products/digital",
  certifications: "/company#certifications",
};

export function SearchPanel({ content, open, onClose, triggerRef }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const headingId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const fuseRef = useRef<Fuse<SearchEntry> | null>(null);
  const resultsRef = useRef<HTMLUListElement | null>(null);

  const [value, setValue] = useState("");
  const [results, setResults] = useState<SearchEntry[] | null>(null);
  const [indexReady, setIndexReady] = useState(false);

  // Clears local state and delegates to the prop — used everywhere we close.
  const close = useCallback(() => {
    setValue("");
    setResults(null);
    onClose();
  }, [onClose]);

  useDialogPanel({ open, onClose: close, panelRef, triggerRef });

  // Load index once when the panel first opens
  useEffect(() => {
    if (!open || fuseRef.current) return;
    fetch(`/search/index.${locale}.json`)
      .then((r) => r.json())
      .then((entries: SearchEntry[]) => {
        fuseRef.current = new Fuse(entries, {
          keys: [
            { name: "model", weight: 2 },
            { name: "title", weight: 1 },
          ],
          threshold: 0.3,
        });
        setIndexReady(true);
      })
      .catch(() => {
        console.warn("[search] index not found — run pnpm build:search-index");
      });
  }, [open, locale]);

  useEffect(() => {
    if (!open) return;
    // `inert` removes the subtree from tab order + a11y tree when closed.
    // Without this, hidden controls remain keyboard-focusable.
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  const runSearch = (query: string) => {
    if (!fuseRef.current || !query.trim()) {
      setResults(null);
      return;
    }
    setResults(fuseRef.current.search(query).map((r) => r.item));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && results?.length) {
      e.preventDefault();
      resultsRef.current
        ?.querySelector<HTMLAnchorElement>(".pd-search__result")
        ?.focus();
    }
  };

  const handleResultKeyDown = (
    e: React.KeyboardEvent<HTMLAnchorElement>,
    index: number,
  ) => {
    const items = () =>
      resultsRef.current?.querySelectorAll<HTMLAnchorElement>(
        ".pd-search__result",
      );
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items()?.[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) inputRef.current?.focus();
      else items()?.[index - 1]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      inputRef.current?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const all = items();
      all?.[all.length - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    runSearch(value);
  };

  const handleChipClick = (chipId: string, chipLabel: string) => {
    const url = CHIP_URLS[chipId];
    if (url) {
      close();
      router.push(url);
      return;
    }
    setValue(chipLabel);
    runSearch(chipLabel);
  };

  const rootCls = ["pd-search", open && "is-open"].filter(Boolean).join(" ");

  return (
    <div className={rootCls} inert={!open}>
      <div className="pd-search-scrim" aria-hidden="true" onClick={close} />
      <div
        ref={panelRef}
        id={PANEL_ID}
        className="pd-search__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className="pd-search__inner">
          <h2 id={headingId} className="pd-search__sr">
            {content.heading}
          </h2>

          <ul className="pd-search__chip-list">
            {content.quickChips.map((chip) => (
              <li key={chip.id}>
                <button
                  type="button"
                  className="pd-search__chip"
                  onClick={() => handleChipClick(chip.id, chip.label)}
                  disabled={!CHIP_URLS[chip.id] && !indexReady}
                >
                  {chip.label}
                </button>
              </li>
            ))}
          </ul>

          <form
            className="pd-search__form"
            onSubmit={handleSubmit}
            role="search"
          >
            <label htmlFor="lt-search-input" className="pd-search__sr">
              {content.inputLabel}
            </label>
            <span className="pd-search__icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12.5 12.5l3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              id="lt-search-input"
              type="search"
              className="pd-search__input"
              placeholder={content.inputPlaceholder}
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                runSearch(e.target.value);
              }}
              onKeyDown={handleInputKeyDown}
            />
          </form>

          {results !== null && (
            <div className="pd-search__results" aria-live="polite">
              {results.length === 0 ? (
                <p className="pd-search__empty">
                  {content.noResults.replace("{q}", value)}
                </p>
              ) : (
                <ul ref={resultsRef} className="pd-search__result-list">
                  {results.map((entry, i) => (
                    <li key={entry.id}>
                      <Link
                        href={entry.url}
                        className="pd-search__result"
                        onClick={close}
                        onKeyDown={(e) => handleResultKeyDown(e, i)}
                      >
                        <span className="pd-search__result-title">
                          {entry.title}
                        </span>
                        <span className="pd-search__result-crumb">
                          {entry.breadcrumb}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
