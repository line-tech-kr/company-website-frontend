import { Fragment, type ReactNode } from "react";

type Props = {
  /** Document title shown as the row's primary label. */
  label: string;
  /** Meta parts (model, rev, date, …). Falsy entries are dropped; rendered with `·` separators. */
  meta?: Array<string | null | undefined>;
  /** Action element — typically a download `<a>` or a request `<Link>`/badge. */
  action: ReactNode;
};

/**
 * One row in the data-room list views (catalogues / manuals / drawings).
 * Layout: `[PDF badge] [label + meta] [action]`. CSS lives in
 * resources-subpage.css and is shared by every consumer.
 */
export function DocRow({ label, meta, action }: Props) {
  const parts = (meta ?? []).filter((p): p is string => Boolean(p));
  return (
    <li className="dr-list__row">
      <span className="dr-list__badge dr-list__badge--pdf">PDF</span>
      <div>
        <div className="dr-list__label">{label}</div>
        {parts.length > 0 && (
          <div className="dr-list__meta">
            {parts.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="dr-list__sep">·</span>}
                <span>{part}</span>
              </Fragment>
            ))}
          </div>
        )}
      </div>
      {action}
    </li>
  );
}
