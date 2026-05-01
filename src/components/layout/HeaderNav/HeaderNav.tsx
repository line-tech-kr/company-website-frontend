"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ShellNavItem } from "@/lib/content/shell";
import { useHeaderNav } from "./HeaderNavContext";
import "./HeaderNav.css";

type Props = { items: ShellNavItem[] };

export function HeaderNav({ items }: Props) {
  const { openId, onItemEnter, onItemLeave, setOpenId } = useHeaderNav();
  const t = useTranslations("a11y");

  return (
    <nav
      className="pd-top__nav"
      aria-label={t("primaryNav")}
      onMouseLeave={onItemLeave}
    >
      {items.map((item) => {
        const isOpen = openId === item.id;
        const hasMenu = !!item.menu;
        const cls = `pd-top__navitem${isOpen ? " is-open" : ""}`;

        if (hasMenu) {
          return (
            <button
              key={item.id}
              type="button"
              className={cls}
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-controls={`pd-mega-${item.id}`}
              onMouseEnter={() => onItemEnter(item.id)}
              onFocus={() => setOpenId(item.id)}
              onClick={() => setOpenId(isOpen ? null : item.id)}
            >
              {item.label}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4l3 3 3-3"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          );
        }

        // Cursor moving from a menu trigger to a no-menu sibling never fires
        // the nav's onMouseLeave; trigger close-grace here so the open panel
        // doesn't linger.
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cls}
            onMouseEnter={onItemLeave}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
