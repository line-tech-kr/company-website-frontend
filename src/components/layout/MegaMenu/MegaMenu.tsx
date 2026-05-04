"use client";

import { useEffect, useRef } from "react";
import { Link } from "@/i18n/navigation";
import { getProductsCategories } from "@/lib/content/shell";
import type {
  ShellFeaturedCard,
  ShellMegaMenuProducts,
  ShellMegaMenuResources,
  ShellNavItem,
} from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { useHeaderNav } from "../HeaderNav/HeaderNavContext";
import "./MegaMenu.css";

type Props = { items: ShellNavItem[]; locale: Locale };

export function MegaMenu({ items, locale }: Props) {
  const { openId, onItemEnter, onItemLeave } = useHeaderNav();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const position = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      items.forEach((item) => {
        if (!item.menu) return;
        const button = document.querySelector(
          `[aria-controls="pd-mega-${item.id}"]`,
        ) as HTMLElement | null;
        const panel = document.getElementById(
          `pd-mega-${item.id}`,
        ) as HTMLElement | null;
        if (!button || !panel) return;
        const buttonLeft =
          button.getBoundingClientRect().left - containerRect.left;
        const maxLeft = containerRect.width - panel.offsetWidth - 16;
        panel.style.left = `${Math.min(buttonLeft, maxLeft)}px`;
      });
    };
    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [items]);

  const handleEnter = () => {
    if (openId) onItemEnter(openId);
  };

  return (
    <div
      ref={containerRef}
      className="pd-mega"
      onMouseEnter={handleEnter}
      onMouseLeave={onItemLeave}
    >
      {items.map((item) => {
        if (!item.menu) return null;
        const isOpen = openId === item.id;
        const cls = `pd-mega__panel${isOpen ? " is-open" : ""}`;
        return (
          <section
            key={item.id}
            id={`pd-mega-${item.id}`}
            className={cls}
            aria-hidden={!isOpen}
            inert={!isOpen}
            data-id={item.id}
          >
            <div className="pd-mega__inner">
              {renderPanelBody(item.menu, locale)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function renderPanelBody(
  menu: NonNullable<ShellNavItem["menu"]>,
  locale: Locale,
) {
  switch (menu.kind) {
    case "products":
      return <ProductsBody menu={menu} locale={locale} />;
    case "resources":
      return <ResourcesBody menu={menu} />;
  }
}

function ProductsBody({
  menu,
  locale,
}: {
  menu: ShellMegaMenuProducts;
  locale: Locale;
}) {
  const categories = getProductsCategories(locale);
  return (
    <>
      <h2 className="pd-mega__heading">{menu.heading}</h2>
      <div className="pd-mega__cols">
        <ul className="pd-mega__list">
          {categories.map((c) => (
            <li key={c.code}>
              <Link href={c.href} className="pd-mega__link">
                <span className="pd-mega__link-label">{c.label}</span>
                <span className="pd-mega__link-desc">{c.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
        <FeaturedCard featured={menu.featured} />
      </div>
      <Link href={menu.allHref} className="pd-mega__all">
        {menu.allLabel}
      </Link>
    </>
  );
}

function ResourcesBody({ menu }: { menu: ShellMegaMenuResources }) {
  return (
    <>
      <h2 className="pd-mega__heading">{menu.heading}</h2>
      <div className="pd-mega__cols">
        <ul className="pd-mega__list">
          {menu.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="pd-mega__link">
                <span className="pd-mega__link-label">{l.label}</span>
                {l.desc && <span className="pd-mega__link-desc">{l.desc}</span>}
              </Link>
            </li>
          ))}
        </ul>
        <FeaturedCard featured={menu.featured} />
      </div>
    </>
  );
}

function FeaturedCard({ featured }: { featured: ShellFeaturedCard }) {
  return (
    <Link href={featured.href} className="pd-mega__featured">
      <span className="pd-mega__featured-eyebrow">{featured.eyebrow}</span>
      <span className="pd-mega__featured-title">{featured.title}</span>
      <span className="pd-mega__featured-blurb">{featured.blurb}</span>
      <span className="pd-mega__featured-cta">{featured.cta}</span>
    </Link>
  );
}

export function MegaMenuScrim() {
  const { openId, setOpenId, onItemLeave } = useHeaderNav();
  const cls = `pd-mega-scrim${openId ? " is-active" : ""}`;
  return (
    <div
      className={cls}
      onClick={() => setOpenId(null)}
      onMouseEnter={onItemLeave}
      aria-hidden="true"
    />
  );
}
