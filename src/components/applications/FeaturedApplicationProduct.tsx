import { Fragment } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { categoryForSeries } from "@/lib/categories";
import type { Product } from "@/lib/types/product";

export type FeaturedApplicationProductSpec = {
  label: string;
  value: string;
};

export type FeaturedApplicationProductInput = {
  slug: string;
  model: string;
  series: Product["series"];
  productLabel?: string | null;
  description?: string | null;
  specs?: ReadonlyArray<FeaturedApplicationProductSpec>;
  imageUrl: string | null;
};

type Props = {
  product: FeaturedApplicationProductInput;
  /** Editorial pitch — application-specific reason this product is the right fit. */
  whyCaption: string | null;
  kickerLabel: string;
  whyHeadingLabel: string;
  viewProductLabel: string;
};

export function FeaturedApplicationProduct({
  product,
  whyCaption,
  kickerLabel,
  whyHeadingLabel,
  viewProductLabel,
}: Props) {
  const detailHref = `/products/${categoryForSeries(product.series)}/${product.slug}`;
  const body = whyCaption ?? product.description ?? null;
  const specs = product.specs ?? [];

  return (
    <section className="ap-featured" aria-labelledby="ap-featured-title">
      {product.imageUrl ? (
        <Link href={detailHref} className="ap-featured__image-link">
          <div className="ap-featured__image">
            <Image
              src={product.imageUrl}
              alt={product.model}
              width={520}
              height={400}
              sizes="(max-width: 900px) 100vw, 360px"
            />
          </div>
        </Link>
      ) : null}
      <div className="ap-featured__body">
        <div className="ap-featured__kicker">{kickerLabel}</div>
        <h2 id="ap-featured-title" className="ap-featured__title">
          {product.model}
        </h2>
        {product.productLabel ? (
          <div className="ap-featured__label">{product.productLabel}</div>
        ) : null}
        {body ? (
          <div className="ap-featured__why">
            {whyCaption ? (
              <div className="ap-featured__why-heading">{whyHeadingLabel}</div>
            ) : null}
            <p className="ap-featured__desc">{body}</p>
          </div>
        ) : null}
        {specs.length > 0 ? (
          <dl className="ap-featured__spec">
            {specs.map((s, i) => (
              <Fragment key={i}>
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </Fragment>
            ))}
          </dl>
        ) : null}
        <Link href={detailHref} className="ap-featured__cta">
          {viewProductLabel}
        </Link>
      </div>
    </section>
  );
}
