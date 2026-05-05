"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export type SlideAccent = "blue" | "steel" | "gold" | "neutral";

export type RotatingSlide = {
  href: string;
  accent: SlideAccent;
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
  const [mouseInside, setMouseInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = () => setReducedMotion(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (slides.length <= 1 || reducedMotion) return;
    if (mouseInside || focusInside) return;
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [mouseInside, focusInside, reducedMotion, slides.length, intervalMs]);

  if (slides.length === 0) return null;

  return (
    <div
      className="lt-products-side__rot"
      onMouseEnter={() => setMouseInside(true)}
      onMouseLeave={() => setMouseInside(false)}
      onFocusCapture={() => setFocusInside(true)}
      onBlurCapture={() => setFocusInside(false)}
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
          role="group"
          aria-label={slidesLabel}
        >
          {slides.map((s, i) => (
            <button
              key={s.href}
              type="button"
              aria-label={`${i + 1} / ${slides.length}: ${s.model}`}
              aria-current={i === active}
              className="lt-products-side__rot-dot"
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
