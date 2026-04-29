import { Link } from "@/i18n/navigation";
import { Glyph } from "@/components/ui/Glyph";
import { ProductThumb } from "../ProductThumb";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";

type Props = {
  product: Product;
  category: CategorySlug;
  locale: "ko" | "en" | "zh";
  viewLabel: string;
};

function fittingSummary(connections: Product["connections"]): string {
  const types = new Set<string>();
  for (const c of connections) {
    const last = c.type.split(/\s+/).at(-1);
    if (last) types.add(last);
  }
  return [...types].join(" · ");
}

export function ProductRow({ product, category, locale, viewLabel }: Props) {
  const href = `/products/${category}/${product.slug.current}`;
  const label = product.productLabel[locale];
  const range = product.massFlowSpecs.flowRange.display;
  const accuracy = product.massFlowSpecs.accuracy.display;
  const response = product.massFlowSpecs.responseTime?.display ?? "—";
  const fitting = fittingSummary(product.connections);

  return (
    <Link className="lt-prod-row" href={href}>
      <span className="lt-prod-row__cell lt-prod-row__cell--thumb">
        <ProductThumb />
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--code">
        {product.model}
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--label">
        <span className="lt-prod-row__label">{label}</span>
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--range">
        {range}
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--acc">
        {accuracy}
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--resp">
        {response}
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--fit">
        {fitting}
      </span>
      <span className="lt-prod-row__cell lt-prod-row__cell--act">
        <span className="lt-prod-row__view">
          {viewLabel}
          <Glyph name="arrow-right" size={11} />
        </span>
      </span>
    </Link>
  );
}
