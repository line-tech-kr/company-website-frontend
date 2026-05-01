"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import type { ShellSearch } from "@/lib/content/shell";
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

  useDialogPanel({ open, onClose, panelRef, triggerRef });

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

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
                  data-chip-id={chip.id}
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
              onChange={(e) => setValue(e.target.value)}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
