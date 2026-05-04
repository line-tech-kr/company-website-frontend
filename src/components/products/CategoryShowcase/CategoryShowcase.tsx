"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import "./CategoryShowcase.css";

export type ShowcaseProduct = {
  slug: string;
  model: string;
  caption: string | null;
  function: "MFC" | "MFM" | null;
  flowRange: string | null;
  accuracy: string | null;
  image: string;
  href: string;
};

type Props = {
  products: ShowcaseProduct[];
  viewLabel: string;
  sectionLabel: string;
  modelLabel: string;
  functionLabel: string;
  flowRangeLabel: string;
  accuracyLabel: string;
  highlightLabel: string;
  slidesLabel: string;
};

const INTERVAL_MS = 4500;

export function CategoryShowcase({
  products,
  viewLabel,
  sectionLabel,
  modelLabel,
  functionLabel,
  flowRangeLabel,
  accuracyLabel,
  highlightLabel,
  slidesLabel,
}: Props) {
  const [active, setActive] = useState(0);
  const isPaused = useRef(false);
  const len = products.length;

  useEffect(() => {
    if (len < 2) return;
    const id = setInterval(() => {
      if (!isPaused.current) setActive((n) => (n + 1) % len);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [len]);

  const selectSlide = useCallback((i: number) => setActive(i), []);

  return (
    <div
      className="lt-showcase"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      <span
        className="lt-showcase__bracket lt-showcase__bracket--tl"
        aria-hidden
      />
      <span
        className="lt-showcase__bracket lt-showcase__bracket--tr"
        aria-hidden
      />
      <span
        className="lt-showcase__bracket lt-showcase__bracket--bl"
        aria-hidden
      />
      <span
        className="lt-showcase__bracket lt-showcase__bracket--br"
        aria-hidden
      />

      {/* image side */}
      <div className="lt-showcase__img-col">
        {products.map((p, i) => (
          <div
            key={p.slug}
            className="lt-showcase__slide"
            data-active={String(i === active)}
            aria-hidden={i !== active}
          >
            <Image
              src={p.image}
              alt={p.model}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="lt-showcase__img"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="lt-showcase__fig">
          FIG. {String(active + 1).padStart(2, "0")}
        </div>
      </div>

      {/* data sheet side */}
      <div className="lt-showcase__data">
        <div className="lt-showcase__section-label">─── {sectionLabel}</div>

        {products.map((p, i) => (
          <div
            key={p.slug}
            className="lt-showcase__entry"
            data-active={String(i === active)}
            aria-hidden={i !== active}
          >
            <DataRow label={modelLabel} value={p.model} mono />
            {p.function && (
              <DataRow label={functionLabel} value={p.function} mono />
            )}
            {p.flowRange && (
              <DataRow label={flowRangeLabel} value={p.flowRange} />
            )}
            {p.accuracy && <DataRow label={accuracyLabel} value={p.accuracy} />}
            {p.caption && <DataRow label={highlightLabel} value={p.caption} />}

            <Link href={p.href} className="lt-showcase__link">
              {viewLabel} →
            </Link>
          </div>
        ))}

        <div
          className="lt-showcase__nav"
          role="tablist"
          aria-label="Featured product slides"
        >
          <span className="lt-showcase__nav-label">{slidesLabel}</span>
          <span className="lt-showcase__nav-spacer" />
          {Array.from({ length: len }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === active}
              aria-label={`Slide ${i + 1}`}
              className="lt-showcase__tick"
              data-active={String(i === active)}
              onClick={() => selectSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DataRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="lt-showcase__row">
      <span className="lt-showcase__row-label">{label}</span>
      <span
        className="lt-showcase__row-value"
        data-mono={mono ? "true" : "false"}
      >
        {value}
      </span>
    </div>
  );
}
