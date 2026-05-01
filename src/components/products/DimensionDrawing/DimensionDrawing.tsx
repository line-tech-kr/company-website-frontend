"use client";

import { useState } from "react";
import { M3030VAOutline } from "./M3030VAOutline";
import "./DimensionDrawing.css";

export type Callout = { id: string; label: string; value: string };

type Props = {
  kicker: string;
  heading: string;
  sub: string;
  caption: string;
  note: string;
  drawingNumber: string;
  callouts: Callout[];
  calloutsAriaLabel: string;
};

export function DimensionDrawing({
  kicker,
  heading,
  sub,
  caption,
  note,
  drawingNumber,
  callouts,
  calloutsAriaLabel,
}: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const setH = (id: string | null) => () => setHover(id);

  return (
    <section id="dimensions" className="lt-pdp-dim">
      <header className="lt-pdp-section-hd">
        <div>
          <div className="lt-pdp-section-hd__kicker">{kicker}</div>
          <h2 className="lt-pdp-section-hd__title">{heading}</h2>
          <p className="lt-pdp-section-hd__sub">{sub}</p>
        </div>
      </header>

      <div className="lt-pdp-dim__frame">
        <div className="lt-pdp-dim__canvas">
          <div className="lt-pdp-dim__titleblock">
            <div>
              <span>DWG</span>
              <b>{drawingNumber}</b>
            </div>
            <div>
              <span>REV</span>
              <b>02</b>
            </div>
            <div>
              <span>SCALE</span>
              <b>1:2</b>
            </div>
            <div>
              <span>UNIT</span>
              <b>mm</b>
            </div>
          </div>

          <M3030VAOutline hover={hover} setH={setH} />
        </div>

        <aside className="lt-pdp-dim__legend" aria-label={calloutsAriaLabel}>
          {callouts.map((c) => (
            <div
              key={c.id}
              className={`lt-pdp-dim__row${hover === c.id ? " is-active" : ""}`}
              onMouseEnter={setH(c.id)}
              onMouseLeave={setH(null)}
            >
              <span className="lt-pdp-dim__dot">{c.id}</span>
              <span className="lt-pdp-dim__rowlbl">{c.label}</span>
              <span className="lt-pdp-dim__rowval">{c.value}</span>
            </div>
          ))}
          <p className="lt-pdp-dim__caption">{caption}</p>
          <p className="lt-pdp-dim__note">{note}</p>
        </aside>
      </div>
    </section>
  );
}
