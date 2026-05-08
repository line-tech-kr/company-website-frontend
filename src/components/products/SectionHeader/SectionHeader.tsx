import type { ReactNode } from "react";
import "./SectionHeader.css";

type Props = {
  kicker: string;
  title: string;
  sub: string;
  /** Optional right-aligned content (e.g. action button). */
  children?: ReactNode;
};

export function SectionHeader({ kicker, title, sub, children }: Props) {
  return (
    <header className="lt-pdp-section-hd">
      <div>
        <div className="lt-pdp-section-hd__kicker">{kicker}</div>
        <h2 className="lt-pdp-section-hd__title">{title}</h2>
        <p className="lt-pdp-section-hd__sub">{sub}</p>
      </div>
      {children}
    </header>
  );
}
