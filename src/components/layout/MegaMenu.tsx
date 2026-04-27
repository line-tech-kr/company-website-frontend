"use client";

import { Link } from "@/i18n/navigation";
import { getProductsCategories } from "@/lib/content/shell";
import type {
  ShellFeaturedCard,
  ShellMegaMenuProducts,
  ShellMegaMenuResources,
  ShellNavItem,
} from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { useHeaderNav } from "./HeaderNavContext";
import "./MegaMenu.css";

type Props = { items: ShellNavItem[]; locale: Locale };

export function MegaMenu({ items, locale }: Props) {
  const { openId, onItemEnter, onItemLeave } = useHeaderNav();

  // Cursor entering the panel cancels the close-grace timer that fired when
  // the cursor left the nav row. `onItemEnter(openId)` is a no-op state-wise
  // but clears the timer (see HeaderShell ctx).
  const handleEnter = () => {
    if (openId) onItemEnter(openId);
  };

  return (
    <div
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
    case "simple":
      // TODO(future): no current consumer — re-add a renderer when a nav item
      // needs a simple link-list panel again.
      return null;
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
