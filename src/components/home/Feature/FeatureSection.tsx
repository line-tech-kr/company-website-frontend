"use client";

import Image from "next/image";
import { useCarousel } from "@/lib/hooks/useCarousel";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { FLAGSHIP_IMAGE_PLACEHOLDER } from "@/lib/products/flagship";

type BulletLabels = {
  flow: string;
  accuracy: string;
  response: string;
  io: string;
};
type Slide = { model: string; sub: string };

type Props = {
  kicker: string;
  cta: string;
  bulletLabels: BulletLabels;
  slides: Slide[];
  cutoutByModel: Record<string, string>;
};

type SlideSpec = {
  category: "analogue" | "digital" | "explosion-proof";
  slug: string;
  fn: "MFC";
  gas: string;
  flowChip: string;
  bullets: { flow: string; accuracy: string; response: string; io: string };
};

const SLIDE_SPECS: Record<string, SlideSpec> = {
  M3030VA: {
    category: "analogue",
    slug: "m3030va",
    fn: "MFC",
    gas: "N₂",
    flowChip: "30 SLPM",
    bullets: {
      flow: "0.01–30 slpm",
      accuracy: "±1% FS",
      response: "<2 s",
      io: "0–5 Vdc / 4–20 mA",
    },
  },
  MD800C: {
    category: "digital",
    slug: "md800c",
    fn: "MFC",
    gas: "N₂",
    flowChip: "5000 SLPM",
    bullets: {
      flow: "2500–5000 slpm",
      accuracy: "±1% FS",
      response: "<1 s",
      io: "0–5 Vdc / 4–20 mA",
    },
  },
  EX1000: {
    category: "explosion-proof",
    // Display model dropped the C suffix (#9); the Sanity slug keeps it.
    slug: "ex1000c",
    fn: "MFC",
    gas: "N₂",
    flowChip: "1000 SLPM",
    bullets: {
      flow: "70–1000 slpm",
      accuracy: "±2% FS",
      response: "<2 s",
      io: "0–5 Vdc / 4–20 mA",
    },
  },
};

const INTERVAL_MS = 4000;

export function FeatureSection({
  kicker,
  cta,
  bulletLabels,
  slides,
  cutoutByModel,
}: Props) {
  const { active, setActive } = useCarousel(slides.length, {
    intervalMs: INTERVAL_MS,
  });

  const current = slides[active];
  const spec = SLIDE_SPECS[current.model];
  if (!spec) return null;

  return (
    <section className="ho-sec ho-feature">
      <div>
        <div className="ho-feature__kicker">{kicker}</div>
        <h2 className="ho-feature__title">{current.model}</h2>
        <p className="ho-feature__sub">{current.sub}</p>
        <dl className="ho-feature__bullets">
          <BulletRow label={bulletLabels.flow} value={spec.bullets.flow} />
          <BulletRow
            label={bulletLabels.accuracy}
            value={spec.bullets.accuracy}
          />
          <BulletRow
            label={bulletLabels.response}
            value={spec.bullets.response}
          />
          <BulletRow label={bulletLabels.io} value={spec.bullets.io} />
        </dl>
        <Button
          variant="primary"
          size="md"
          href={`/products/${spec.category}/${spec.slug}`}
          trailingGlyph={<Glyph name="arrow-right" size={14} />}
        >
          {cta.replaceAll("{model}", current.model)}
        </Button>
      </div>
      <div>
        <div className="ho-feature__chip">
          <div className="ho-feature__chip-tl">{current.model}</div>
          <div className="ho-feature__chip-tr">{spec.fn}</div>
          <div className="ho-feature__chip-body">
            {slides.map((s, i) => {
              const sp = SLIDE_SPECS[s.model];
              if (!sp) return null;
              return (
                <div
                  key={s.model}
                  className="ho-feature__chip-slide"
                  data-active={String(i === active)}
                  aria-hidden={i !== active}
                >
                  <Image
                    src={cutoutByModel[s.model] ?? FLAGSHIP_IMAGE_PLACEHOLDER}
                    alt={`Line Tech ${s.model}`}
                    fill
                    className="ho-feature__chip-img"
                    sizes="(max-width: 1000px) 100vw, 50vw"
                    priority={i === 0}
                  />
                </div>
              );
            })}
          </div>
          <div className="ho-feature__chip-bl">LINE TECH</div>
          <div className="ho-feature__chip-br">
            {spec.gas} · {spec.flowChip}
          </div>
        </div>
      </div>
      {slides.length > 1 && (
        <div className="ho-feature__dots" role="group" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.model}
              type="button"
              className="ho-feature__dot"
              aria-label={`${i + 1} / ${slides.length}: ${s.model}`}
              aria-current={i === active}
              data-active={String(i === active)}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function BulletRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="ho-feature__bullet">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
