"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type RefObject,
} from "react";
import type { ShellSearch } from "@/lib/content/shell";
import "./SearchPanel.css";

type Props = {
  content: ShellSearch;
  open: boolean;
  onClose: () => void;
  /** Trigger button to focus-restore on close. */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

const PANEL_ID = "lt-search-panel";

/**
 * Visual-shell search panel — slides down under the header with a full-
 * viewport scrim. No real query handling: the form preventDefaults and
 * quick chips are inert <button>s. Wiring lands in phase 2.
 */
export function SearchPanel({ content, open, onClose, triggerRef }: Props) {
  const headingId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  // Restore focus + clear input when closing (only if we were previously open).
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      setValue("");
      const id = window.requestAnimationFrame(() =>
        triggerRef.current?.focus(),
      );
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Tab trap across the panel's focusable controls.
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const rootCls = ["pd-search", open && "is-open"].filter(Boolean).join(" ");

  return (
    <div
      className={rootCls}
      // `inert` removes the subtree from tab order + a11y tree when closed.
      // Without this, hidden controls remain keyboard-focusable.
      inert={!open}
    >
      <div className="pd-search-scrim" aria-hidden="true" onClick={onClose} />
      <div
        ref={panelRef}
        id={PANEL_ID}
        className="pd-search__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        onKeyDown={handleKeyDown}
      >
        <div className="pd-search__inner">
          <div className="pd-search__row">
            <h2 id={headingId} className="pd-search__heading">
              {content.heading}
            </h2>
            <button
              type="button"
              className="pd-search__close"
              aria-label={content.closeLabel}
              onClick={onClose}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4l8 8M12 4l-8 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <form
            className="pd-search__form"
            onSubmit={handleSubmit}
            role="search"
          >
            <label htmlFor="lt-search-input" className="pd-search__sr">
              {content.inputLabel}
            </label>
            <span className="pd-search__icon" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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
              onChange={(e) => setValue(e.target.value)}
            />
          </form>

          <div className="pd-search__chips">
            <p className="pd-search__chips-heading">
              {content.quickChipsHeading}
            </p>
            <ul className="pd-search__chip-list">
              {content.quickChips.map((chip) => (
                <li key={chip.id}>
                  <button
                    type="button"
                    className="pd-search__chip"
                    data-chip-id={chip.id}
                  >
                    {chip.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
