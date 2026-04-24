import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import "./Button.css";

type LinkHref = ComponentProps<typeof Link>["href"];

type Variant = "primary" | "accent" | "ghost" | "subtle";
type Size = "sm" | "md" | "lg";

type Base = {
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
  icon?: React.ReactNode;
  trailingGlyph?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
};

// `plain: true` renders a bare <a> instead of the locale-aware <Link>.
// Use for non-route URLs: mailto:, tel:, static files, external origins.
type AsLocalLink = Base & { href: LinkHref; plain?: false };
type AsPlainLink = Base & { href: string; plain: true };
type AsButton = Base & { onClick?: () => void; type?: "button" | "submit" };

type Props = AsLocalLink | AsPlainLink | AsButton;

function isLink(p: Props): p is AsLocalLink | AsPlainLink {
  return "href" in p;
}

function classes(p: Base) {
  return [
    "lt-btn",
    `lt-btn--${p.variant ?? "primary"}`,
    `lt-btn--${p.size ?? "md"}`,
    p.fullWidth && "lt-btn--block",
    p.className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: Props) {
  const cls = classes(props);
  const inner = (
    <>
      {props.icon && (
        <span className="lt-btn__icon" aria-hidden>
          {props.icon}
        </span>
      )}
      <span className="lt-btn__label">{props.children}</span>
      {props.trailingGlyph && (
        <span className="lt-btn__trail" aria-hidden>
          {props.trailingGlyph}
        </span>
      )}
    </>
  );

  if (isLink(props)) {
    if (props.plain) {
      return (
        <a className={cls} href={props.href}>
          {inner}
        </a>
      );
    }
    return (
      <Link className={cls} href={props.href}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      className={cls}
      onClick={props.onClick}
    >
      {inner}
    </button>
  );
}
