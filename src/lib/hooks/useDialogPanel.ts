"use client";

import { useEffect, useRef, type RefObject } from "react";

type Options = {
  open: boolean;
  onClose: () => void;
  panelRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLElement | null>;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Wires the four behaviors every modal/panel dialog in this codebase needs:
 *   - Body scroll lock while open
 *   - Escape key closes
 *   - Tab cycles within the panel (focus trap)
 *   - Focus returns to the trigger when the panel closes
 *
 * Components keep their own auto-focus-on-open since the focus target differs
 * per dialog (search focuses an input, mobile nav focuses the first link).
 */
export function useDialogPanel({
  open,
  onClose,
  panelRef,
  triggerRef,
}: Options) {
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

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
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
    };
    panel.addEventListener("keydown", onKey);
    return () => panel.removeEventListener("keydown", onKey);
  }, [open, panelRef]);

  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      const id = window.requestAnimationFrame(() =>
        triggerRef.current?.focus(),
      );
      return () => window.cancelAnimationFrame(id);
    }
  }, [open, triggerRef]);
}
