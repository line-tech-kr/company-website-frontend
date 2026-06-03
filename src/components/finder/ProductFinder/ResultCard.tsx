"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("product.specs");
  const { product, fitScore } = match;
  const category = categoryForSeries(product.series);
  const href = `/products/${category}/${product.slug.current}`;
  const specs = product.massFlowSpecs!;
  const flowRange = specs.flowRange?.display;
  const pressureRange = specs.pressureRange?.display;
  const rangeDisplay = flowRange ?? pressureRange ?? "—";
  const rangeLabel = flowRange ? t("flowRange") : t("pressureRange");
  const range = localizeSpecValue(rangeDisplay, locale);
  const accuracy = localizeSpecValue(specs.accuracy.display, locale);
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
          <dt>{rangeLabel}</dt>
          <dd>{range}</dd>
        </div>
        <div>
          <dt>{t("accuracy")}</dt>
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
