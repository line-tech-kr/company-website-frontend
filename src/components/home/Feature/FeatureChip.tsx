"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const SLIDES = [
  { model: "M3030VA", fn: "MFC", gas: "N₂", flow: "30 SLM", slug: "m3030va" },
  { model: "M2030VA", fn: "MFM", gas: "N₂", flow: "30 SLM", slug: "m2030va" },
  { model: "M3200VA", fn: "MFC", gas: "N₂", flow: "100 SLM", slug: "m3200va" },
  { model: "M2200VA", fn: "MFM", gas: "N₂", flow: "100 SLM", slug: "m2200va" },
] as const;

const INTERVAL_MS = 3500;

export function FeatureChip() {
  const [active, setActive] = useState(0);
  const isPaused = useRef(false);
  const len = SLIDES.length;

  useEffect(() => {
    const id = setInterval(() => {
      if (!isPaused.current) setActive((n) => (n + 1) % len);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [len]);

  const current = SLIDES[active];

  return (
    <div
      className="ho-feature__chip"
      onMouseEnter={() => (isPaused.current = true)}
      onMouseLeave={() => (isPaused.current = false)}
    >
      <div className="ho-feature__chip-tl">{current.model}</div>
      <div className="ho-feature__chip-tr">{current.fn}</div>
      <div className="ho-feature__chip-body">
        {SLIDES.map((s, i) => (
          <div
            key={s.slug}
            className="ho-feature__chip-slide"
            data-active={String(i === active)}
          >
            <Image
              src={`/products/${s.slug}/product-1.jpg`}
              alt={`Line Tech ${s.model}`}
              fill
              className="ho-feature__chip-img"
              sizes="(max-width: 1000px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
      </div>
      <div className="ho-feature__chip-bl">LINE TECH</div>
      <div className="ho-feature__chip-br">
        {current.gas} · {current.flow}
      </div>
    </div>
  );
}
