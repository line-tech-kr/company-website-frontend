import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import type { Product } from "@/lib/types/product";
import type { Locale } from "@/i18n/routing";
import { localizeSpecValue } from "@/lib/products/localizeSpecValue";
import "./ProductHero.css";

type Props = {
  product: Product;
  locale: Locale;
  categoryLabel: string;
  quoteLabel: string;
  specsLabel: string;
  cutoutUrl: string | null;
};

export function ProductHero({
  product,
  locale,
  categoryLabel,
  quoteLabel,
  specsLabel,
  cutoutUrl,
}: Props) {
  const name = product.productLabel[locale];
  const tagline = product.features
    .slice(0, 3)
    .map((f) => f[locale] || f.en)
    .filter(Boolean)
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
          <div className="lt-pdp-hero__imgframe" aria-hidden>
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--tl" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--tr" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--bl" />
            <span className="lt-pdp-hero__corner lt-pdp-hero__corner--br" />
          </div>
          {cutoutUrl && (
            <Image
              src={cutoutUrl}
              alt={`Line Tech ${product.model}`}
              fill
              sizes="(max-width: 1000px) 100vw, 50vw"
              priority
              className="lt-pdp-hero__img"
            />
          )}
          <div className="lt-pdp-hero__stamp lt-pdp-hero__stamp--tl">
            {product.model}
          </div>
          <div className="lt-pdp-hero__stamp lt-pdp-hero__stamp--tr">
            {product.function}
          </div>
          <div className="lt-pdp-hero__stamp lt-pdp-hero__stamp--bl">
            LINE TECH
          </div>
          <div className="lt-pdp-hero__stamp lt-pdp-hero__stamp--br">
            {product.massFlowSpecs ? (
              <>
                N₂ ·{" "}
                {localizeSpecValue(product.massFlowSpecs.flowRange.display, locale)}
              </>
            ) : (
              product.function
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
