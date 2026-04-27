"use client";

import { Link } from "@/i18n/navigation";
import type { ShellNavItem } from "@/lib/content/shell";
import "./HeaderNav.css";

// Disclosure semantics + chevron + open-state will return with the mega-menu
// panel in #7 (search panel #8 will introduce its own state shape).

type Props = { items: ShellNavItem[] };

export function HeaderNav({ items }: Props) {
  return (
    <nav className="pd-top__nav" aria-label="Primary">
      {items.map((item) => (
        <Link key={item.id} href={item.href} className="pd-top__navitem">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
