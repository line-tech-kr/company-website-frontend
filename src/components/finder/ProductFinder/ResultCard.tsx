"use client";

import { Link } from "@/i18n/navigation";
import { Chip } from "@/components/ui/Chip/Chip";
import type { Locale } from "@/i18n/routing";
import type { FinderMatch } from "@/lib/finder/match";
import { categoryForSeries } from "@/lib/categories";
import { localizeSpecValue } from "@/lib/products/localizeSpecValue";

type Props = {
  match: FinderMatch;
  locale: Locale;
  rankLabel?: string; // e.g. "Ideal fit" / "Good fit" / "Edge of range"
};

export function ResultCard({ match, locale, rankLabel }: Props) {
  const { product, fitScore } = match;
  const category = categoryForSeries(product.series);
  const href = `/products/${category}/${product.slug.current}`;
  const range = localizeSpecValue(
    product.massFlowSpecs.flowRange.display,
    locale,
  );
  const accuracy = localizeSpecValue(
    product.massFlowSpecs.accuracy.display,
    locale,
  );
  const tone = fitScore >= 1 ? "success" : fitScore >= 0.7 ? "info" : "warning";

  return (
    <Link href={href} className="lt-finder__result">
      <div className="lt-finder__result-head">
        <span className="lt-finder__result-model">{product.model}</span>
        {rankLabel && (
          <Chip tone={tone} small>
            {rankLabel}
          </Chip>
        )}
      </div>
      <div className="lt-finder__result-label">
        {product.description?.[locale] ?? product.productLabel[locale]}
      </div>
      <dl className="lt-finder__result-specs">
        <div>
          <dt>Range</dt>
          <dd>{range}</dd>
        </div>
        <div>
          <dt>Accuracy</dt>
          <dd>{accuracy}</dd>
        </div>
        <div>
          <dt>Function</dt>
          <dd>{product.function}</dd>
        </div>
      </dl>
    </Link>
  );
}
