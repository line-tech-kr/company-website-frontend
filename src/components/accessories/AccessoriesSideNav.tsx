"use client";

import { useMemo } from "react";
import { useScrollSpy } from "@/lib/hooks/useScrollSpy";
import type { AccessoriesNavNode } from "@/lib/content/accessories";

type Props = {
  heading: string;
  items: AccessoriesNavNode[];
};

export function AccessoriesSideNav({ heading, items }: Props) {
  const ids = useMemo(() => flattenNav(items).map((n) => n.id), [items]);
  const active = useScrollSpy(ids);

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
