"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export type RotatingSlide = {
  href: string;
  accent: string;
  eyebrow: string;
  model: string;
  blurb: string;
  image: string;
  cta: string;
};

type Props = {
  slides: RotatingSlide[];
  slidesLabel: string;
  intervalMs?: number;
};

export function RotatingFeatured({
  slides,
  slidesLabel,
  intervalMs = 5500,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div
      className="lt-products-side__rot"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="lt-products-side__rot-stack">
        {slides.map((s, i) => {
          const isActive = i === active;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="lt-products-side__featured"
              data-accent={s.accent}
              data-active={isActive}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
            >
              <div className="lt-products-side__featured-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" />
              </div>
              <div className="lt-products-side__featured-body">
                <span className="lt-products-side__featured-eyebrow">
                  {s.eyebrow}
                </span>
                <h2 className="lt-products-side__featured-title">{s.model}</h2>
                <p className="lt-products-side__featured-blurb">{s.blurb}</p>
                <span className="lt-products-side__featured-cta">
                  {s.cta} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {slides.length > 1 && (
        <div
          className="lt-products-side__rot-dots"
          role="tablist"
          aria-label={slidesLabel}
        >
          {slides.map((s, i) => (
            <button
              key={s.href}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`${i + 1} / ${slides.length}: ${s.model}`}
              className="lt-products-side__rot-dot"
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
