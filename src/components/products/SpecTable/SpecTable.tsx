"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import "./SpecTable.css";

type Row = { key: string; label: string; value: string };
type Group = { id: string; num: string; label: string; rows: Row[] };

type Props = {
  kicker: string;
  heading: string;
  sub: string;
  copyLabel: string;
  copiedLabel: string;
  modelName: string;
  groups: Group[];
};

export function SpecTable({
  kicker,
  heading,
  sub,
  copyLabel,
  copiedLabel,
  modelName,
  groups,
}: Props) {
  const [copied, setCopied] = useState(false);

  const doCopy = () => {
    const lines: string[] = [`${modelName} — ${heading}`];
    for (const g of groups) {
      lines.push("", g.label);
      for (const r of g.rows) lines.push(`${r.label}\t${r.value}`);
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(lines.join("\n"));
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="specs" className="lt-pdp-specs">
      <header className="lt-pdp-section-hd">
        <div>
          <div className="lt-pdp-section-hd__kicker">{kicker}</div>
          <h2 className="lt-pdp-section-hd__title">{heading}</h2>
          <p className="lt-pdp-section-hd__sub">{sub}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Glyph name={copied ? "check" : "copy"} size={13} />}
          onClick={doCopy}
        >
          {copied ? copiedLabel : copyLabel}
        </Button>
      </header>

      <div className="lt-pdp-spec">
        {groups.map((g) => (
          <section
            className="lt-pdp-spec__group"
            key={g.id}
            aria-labelledby={`spec-group-${g.id}`}
          >
            <h3 className="lt-pdp-spec__grouplbl" id={`spec-group-${g.id}`}>
              <span className="lt-pdp-spec__groupnum" aria-hidden="true">
                {g.num}
              </span>
              <span>{g.label}</span>
            </h3>
            <dl className="lt-pdp-spec__rows">
              {g.rows.map((r) => (
                <div className="lt-pdp-spec__row" key={r.key}>
                  <dt className="lt-pdp-spec__lbl">{r.label}</dt>
                  <dd className="lt-pdp-spec__val">{r.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </section>
  );
}
