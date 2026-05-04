import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import type { Product } from "@/lib/types/product";
import "./ProductHero.css";

type Props = {
  product: Product;
  locale: "ko" | "en" | "zh";
  categoryLabel: string;
  quoteLabel: string;
  specsLabel: string;
};

export function ProductHero({
  product,
  locale,
  categoryLabel,
  quoteLabel,
  specsLabel,
}: Props) {
  const name = product.productLabel[locale];
  const tagline = product.features
    .slice(0, 3)
    .map((f) => f[locale])
    .join(" · ");

  return (
    <section className="lt-pdp-hero">
      <div className="lt-pdp-hero__text">
        <div className="lt-pdp-hero__eyebrow">
          <span className="lt-pdp-hero__eyebrow-dot" aria-hidden />
          <span>
            {categoryLabel} · {product.function}
          </span>
        </div>
        <h1 className="lt-pdp-hero__model">{product.model}</h1>
        <p className="lt-pdp-hero__name">{name}</p>
        {product.description && (
          <p className="lt-pdp-hero__desc">
            {product.description[locale] ?? product.description.en}
          </p>
        )}
        <p className="lt-pdp-hero__tagline">{tagline}</p>
        <div className="lt-pdp-hero__ctas">
          <Button
            variant="primary"
            size="lg"
            href={`/contact?product=${encodeURIComponent(product.model)}`}
            trailingGlyph={<Glyph name="arrow-right" size={14} />}
          >
            {quoteLabel}
          </Button>
          <Button variant="ghost" size="lg" href="#specs" plain>
            {specsLabel}
          </Button>
        </div>
      </div>
      <div className="lt-pdp-hero__media">
        <div className="lt-pdp-hero__imgwrap">
          <div className="lt-pdp-hero__grid" aria-hidden />
          <div className="lt-pdp-hero__imgframe">
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--tl" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--tr" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--bl" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--br" />
            <div className="lt-pdp-hero__label">
              <div className="lt-pdp-hero__label-row">
                <span>PLACEHOLDER</span>
                <span>0001 / A</span>
              </div>
              <div className="lt-pdp-hero__label-body">
                {product.model} · {product.function}
              </div>
              <div className="lt-pdp-hero__label-row">
                <span>{product.model}</span>
                <span>N₂ · {product.massFlowSpecs.flowRange.display}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
