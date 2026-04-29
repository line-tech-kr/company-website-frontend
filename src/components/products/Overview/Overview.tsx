import "./Overview.css";

export type OverviewRow = {
  feature: string;
  values: string[];
};

export type OverviewTone =
  | "primary"
  | "deep"
  | "dark"
  | "fg"
  | "accent"
  | "muted";

type Props = {
  kicker: string;
  heading: string;
  sub: string;
  rows: OverviewRow[];
  tone?: OverviewTone;
};

export function Overview({
  kicker,
  heading,
  sub,
  rows,
  tone = "primary",
}: Props) {
  return (
    <section id="overview" className={`lt-pdp-over lt-pdp-over--${tone}`}>
      <header className="lt-pdp-section-hd">
        <div>
          <div className="lt-pdp-section-hd__kicker">{kicker}</div>
          <h2 className="lt-pdp-section-hd__title">{heading}</h2>
          <p className="lt-pdp-section-hd__sub">{sub}</p>
        </div>
      </header>

      <ol className="lt-pdp-over__list">
        {rows.map((r, i) => (
          <li key={i} className="lt-pdp-over__row">
            <span className="lt-pdp-over__num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="lt-pdp-over__feat">{r.feature}</span>
            <span className="lt-pdp-over__data">
              {r.values.map((v, vi) => (
                <span key={vi} className="lt-pdp-over__data-item">
                  {vi > 0 && (
                    <span className="lt-pdp-over__sep" aria-hidden>
                      ·
                    </span>
                  )}
                  {v}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
