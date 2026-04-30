"use client";

import { useEffect, useState } from "react";
import type { AccessoriesNavNode } from "@/lib/content/accessories";

type Props = {
  heading: string;
  items: AccessoriesNavNode[];
};

/**
 * Sticky side-nav for /products/accessories. Two-level structure: section
 * groups (e.g., "Readouts") containing leaf items (e.g., "LTI-200"). Both
 * groups and items are anchor-linked; IntersectionObserver picks the entry
 * currently spanning a hairline scan band at 30% of viewport height.
 *
 * Mirrors the CompanySideNav scroll-spy pattern, extended to handle the
 * two-level tree by flattening nav nodes into a single observation list
 * while preserving group/leaf semantics in the rendered DOM.
 */
export function AccessoriesSideNav({ heading, items }: Props) {
  const flat = flattenNav(items);
  const [active, setActive] = useState<string>(flat[0]?.id ?? "");

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
        const next = flat.find((node) => intersecting.has(node.id));
        if (next) setActive(next.id);
      },
      { rootMargin: "-30% 0px -70% 0px" },
    );

    for (const node of flat) {
      const el = document.getElementById(node.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [flat]);

  return (
    <aside className="acc-aside" aria-label={heading}>
      <div className="acc-aside__heading">{heading}</div>
      <nav className="acc-nav">
        <ul className="acc-nav__list">
          {items.map((node) => {
            const isCurrent = node.id === active;
            return (
              <li key={node.id} className="acc-nav__item">
                <a
                  href={node.href}
                  className={"acc-nav__link" + (isCurrent ? " is-current" : "")}
                  aria-current={isCurrent ? "true" : undefined}
                >
                  {node.label}
                </a>
                {node.children && node.children.length > 0 && (
                  <ul className="acc-nav__sublist">
                    {node.children.map((child) => {
                      const isChildCurrent = child.id === active;
                      return (
                        <li key={child.id} className="acc-nav__subitem">
                          <a
                            href={child.href}
                            className={
                              "acc-nav__sublink" +
                              (isChildCurrent ? " is-current" : "")
                            }
                            aria-current={isChildCurrent ? "true" : undefined}
                          >
                            {child.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function flattenNav(nodes: AccessoriesNavNode[]): AccessoriesNavNode[] {
  const out: AccessoriesNavNode[] = [];
  for (const node of nodes) {
    out.push(node);
    if (node.children) out.push(...node.children);
  }
  return out;
}
