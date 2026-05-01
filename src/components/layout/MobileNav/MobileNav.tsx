"use client";

import { useEffect, useId, useRef, useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import {
  LT_SHELL,
  getProductsCategories,
  type ShellNavItem,
} from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { useDialogPanel } from "@/lib/hooks/useDialogPanel";
import { LocaleSwitcher } from "../LocaleSwitcher/LocaleSwitcher";
import "./MobileNav.css";

const PANEL_ID = "lt-mobile-nav-panel";

type Props = {
  items: ShellNavItem[];
  locale: Locale;
  heading: string;
  quoteLabel: string;
  open: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function MobileNav({
  items,
  locale,
  heading,
  quoteLabel,
  open,
  onClose,
  triggerRef,
}: Props) {
  const headingId = useId();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const t = useTranslations("a11y");

  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useDialogPanel({ open, onClose, panelRef, triggerRef });

  useEffect(() => {
    if (!open) return;
    const id = window.requestAnimationFrame(() => {
      const first = panelRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      first?.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  // Close on route change. Compare against previous so the initial mount
  // doesn't fire a spurious close.
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      onClose();
    }
  }, [pathname, onClose]);

  const toggle = (id: string) =>
    setExpanded((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const rootCls = ["pd-mnav", open && "is-open"].filter(Boolean).join(" ");

  return (
    <div className={rootCls} inert={!open}>
      <div
        ref={panelRef}
        id={PANEL_ID}
        className="pd-mnav__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className="pd-mnav__inner">
          <h2 id={headingId} className="pd-mnav__sr">
            {heading}
          </h2>

          <nav aria-label={t("primaryNav")} className="pd-mnav__nav">
            <ul className="pd-mnav__list">
              {items.map((item) =>
                item.menu ? (
                  <AccordionItem
                    key={item.id}
                    item={item}
                    locale={locale}
                    isOpen={expanded.has(item.id)}
                    onToggle={() => toggle(item.id)}
                  />
                ) : (
                  <li key={item.id} className="pd-mnav__item">
                    <Link href={item.href} className="pd-mnav__link">
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="pd-mnav__footer">
            <LocaleSwitcher />
            <Button
              variant="primary"
              size="md"
              href={`mailto:${LT_SHELL[locale].footer.contact.email}`}
              plain
            >
              {quoteLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({
  item,
  locale,
  isOpen,
  onToggle,
}: {
  item: ShellNavItem;
  locale: Locale;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const sectionId = `pd-mnav-section-${item.id}`;
  const menu = item.menu;
  if (!menu) return null;

  const sublinks =
    menu.kind === "products"
      ? getProductsCategories(locale).map((c) => ({
          href: c.href,
          label: c.label,
        }))
      : menu.links.map((l) => ({ href: l.href, label: l.label }));

  return (
    <li className="pd-mnav__item pd-mnav__group">
      <button
        type="button"
        className="pd-mnav__group-trigger"
        aria-expanded={isOpen}
        aria-controls={sectionId}
        onClick={onToggle}
      >
        <span>{item.label}</span>
        <svg
          className="pd-mnav__chev"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M3 5l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <div id={sectionId} className="pd-mnav__group-body" hidden={!isOpen}>
        <ul className="pd-mnav__sublist">
          {menu.kind === "products" && (
            <li>
              <Link
                href={menu.allHref}
                className="pd-mnav__sublink pd-mnav__sublink--all"
              >
                {menu.allLabel}
              </Link>
            </li>
          )}
          {sublinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="pd-mnav__sublink">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
