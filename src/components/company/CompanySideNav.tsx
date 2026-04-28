"use client";

import { useEffect, useState } from "react";
import type { CompanyNavItem } from "@/lib/content/company";

type Props = {
  heading: string;
  items: CompanyNavItem[];
};

/**
 * Sticky side-nav for /company. Each item is an in-page anchor (`#greeting`,
 * etc.); IntersectionObserver picks the section currently spanning a hairline
 * scan band at 30% of viewport height. A Set tracks each section's current
 * intersection state across events — a single fired entry isn't enough to
 * decide active state, since other sections may still be intersecting and
 * just didn't change.
 */
export function CompanySideNav({ heading, items }: Props) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id);
          } else {
            intersecting.delete(entry.target.id);
          }
        }
        const next = items.find((item) => intersecting.has(item.id));
        if (next) setActive(next.id);
      },
      { rootMargin: "-30% 0px -70% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

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
                  className={
                    "co-nav__link" + (isCurrent ? " is-current" : "")
                  }
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
