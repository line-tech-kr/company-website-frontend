"use client";

import { useMemo } from "react";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import type { CompanyNavItem } from "@/lib/content/company";

type Props = {
  heading: string;
  items: CompanyNavItem[];
};

export function CompanySideNav({ heading, items }: Props) {
  const ids = useMemo(() => items.map((i) => i.id), [items]);
  const active = useScrollSpy(ids);

  return (
    <aside className="co-aside" aria-label={heading}>
      <div className="co-aside__heading">{heading}</div>
      <nav className="co-nav">
        <ul className="co-nav__list">
          {items.map((item) => {
            const isCurrent = item.id === active;
            return (
              <li key={item.id} className="co-nav__item">
                <a
                  href={item.href}
                  className={"co-nav__link" + (isCurrent ? " is-current" : "")}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
