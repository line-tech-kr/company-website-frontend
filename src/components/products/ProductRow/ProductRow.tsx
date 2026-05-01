import { Link } from "@/i18n/navigation";
import { Glyph } from "@/components/ui/Glyph";
import { ProductThumb } from "../ProductThumb";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import "./ProductRow.css";

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
    <tr className="lt-prod-row">
      <td className="lt-prod-row__cell lt-prod-row__cell--thumb">
        <ProductThumb />
      </td>
      <th scope="row" className="lt-prod-row__cell lt-prod-row__cell--code">
        <Link href={href} className="lt-prod-row__codelink">
          {product.model}
        </Link>
      </th>
      <td className="lt-prod-row__cell lt-prod-row__cell--label">
        <span className="lt-prod-row__label">{label}</span>
      </td>
      <td className="lt-prod-row__cell lt-prod-row__cell--range">{range}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--acc">{accuracy}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--resp">{response}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--fit">{fitting}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--act">
        <Link href={href} className="lt-prod-row__view">
          {viewLabel}
          <Glyph name="arrow-right" size={11} />
        </Link>
      </td>
    </tr>
  );
}
