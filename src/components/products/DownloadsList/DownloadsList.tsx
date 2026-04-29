"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import "./DownloadsList.css";

export type DownloadItem = {
  label: string;
  type: "PDF" | "DWG" | "ZIP";
  size: string;
  rev: string;
  date: string;
};

type Props = {
  kicker: string;
  heading: string;
  sub: string;
  downloadLabel: string;
  doneLabel: string;
  items: DownloadItem[];
};

const TYPE_TONE: Record<DownloadItem["type"], string> = {
  PDF: "lt-pdp-dl__type--danger",
  DWG: "lt-pdp-dl__type--info",
  ZIP: "lt-pdp-dl__type--neutral",
};

export function DownloadsList({
  kicker,
  heading,
  sub,
  downloadLabel,
  doneLabel,
  items,
}: Props) {
  const [state, setState] = useState<
    Record<number, "idle" | "loading" | "done">
  >({});
  const start = (i: number) => {
    if (state[i] === "loading" || state[i] === "done") return;
    setState((s) => ({ ...s, [i]: "loading" }));
    setTimeout(() => setState((s) => ({ ...s, [i]: "done" })), 1400);
  };

  return (
    <section id="downloads" className="lt-pdp-dl">
      <header className="lt-pdp-section-hd">
        <div>
          <div className="lt-pdp-section-hd__kicker">{kicker}</div>
          <h2 className="lt-pdp-section-hd__title">{heading}</h2>
          <p className="lt-pdp-section-hd__sub">{sub}</p>
        </div>
      </header>

      <ul className="lt-pdp-dl__list" role="list">
        {items.map((it, i) => {
          const s = state[i] || "idle";
          return (
            <li
              key={`${it.label}-${i}`}
              className={`lt-pdp-dl__row lt-pdp-dl__row--${s}`}
            >
              <span className={`lt-pdp-dl__type ${TYPE_TONE[it.type]}`}>
                {it.type}
              </span>
              <div className="lt-pdp-dl__meta">
                <div className="lt-pdp-dl__label">{it.label}</div>
                <div className="lt-pdp-dl__sub">
                  <span>{it.rev}</span>
                  <span className="lt-pdp-dl__sep">·</span>
                  <span>{it.size}</span>
                  <span className="lt-pdp-dl__sep">·</span>
                  <span>{it.date}</span>
                </div>
              </div>
              <Button
                variant={s === "done" ? "subtle" : "ghost"}
                size="sm"
                icon={
                  <Glyph name={s === "done" ? "check" : "download"} size={14} />
                }
                onClick={() => start(i)}
              >
                {s === "loading"
                  ? "…"
                  : s === "done"
                    ? doneLabel
                    : downloadLabel}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
