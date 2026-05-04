import { Link } from "@/i18n/navigation";
import { ProductThumb } from "../ProductThumb";
import { Chip } from "@/components/ui/Chip/Chip";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import "./ProductRow.css";

type Props = {
  product: Product;
  category: CategorySlug;
  locale: "ko" | "en" | "zh";
};

const VISIBLE_TAG_KINDS = new Set(["capability", "gas"]);
const MAX_VISIBLE_TAGS = 3;

function fittingSummary(connections: Product["connections"]): string {
  const types = new Set<string>();
  for (const c of connections) {
    const last = c.type.split(/\s+/).at(-1);
    if (last) types.add(last);
  }
  return [...types].join(" · ");
}

export function ProductRow({ product, category, locale }: Props) {
  const href = `/products/${category}/${product.slug.current}`;
  const label = product.productLabel[locale];
  const range = product.massFlowSpecs.flowRange.display;
  const accuracy = product.massFlowSpecs.accuracy.display;
  const response = product.massFlowSpecs.responseTime?.display ?? "—";
  const fitting = fittingSummary(product.connections);
  const visibleTags = product.tags
    .filter((t) => VISIBLE_TAG_KINDS.has(t.kind))
    .slice(0, MAX_VISIBLE_TAGS);

  return (
    <tr className="lt-prod-row">
      <td
        className="lt-prod-row__cell lt-prod-row__cell--thumb"
        aria-hidden="true"
      >
        <ProductThumb />
      </td>
      <th scope="row" className="lt-prod-row__cell lt-prod-row__cell--code">
        <Link href={href} className="lt-prod-row__codelink">
          {product.model}
        </Link>
      </th>
      <td className="lt-prod-row__cell lt-prod-row__cell--label">
        {visibleTags.length > 0 ? (
          <span className="lt-prod-row__tags">
            {visibleTags.map((t) => (
              <Chip
                key={`${t.kind}:${t.slug.current}`}
                small
                tone={t.kind === "gas" ? "accent" : "neutral"}
              >
                {t.label[locale]}
              </Chip>
            ))}
          </span>
        ) : (
          <span className="lt-prod-row__label">{label}</span>
        )}
      </td>
      <td className="lt-prod-row__cell lt-prod-row__cell--range">{range}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--acc">{accuracy}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--resp">{response}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--fit">{fitting}</td>
    </tr>
  );
}
