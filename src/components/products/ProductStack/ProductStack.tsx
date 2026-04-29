import { ProductRow } from "../ProductRow";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import "./ProductStack.css";

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  category: CategorySlug;
  locale: "ko" | "en" | "zh";
  emptyLabel: string;
  viewLabel: string;
  headers: {
    model: string;
    description: string;
    range: string;
    accuracy: string;
    response: string;
    fitting: string;
  };
};

export function ProductStack({
  title,
  subtitle,
  products,
  category,
  locale,
  emptyLabel,
  viewLabel,
  headers,
}: Props) {
  return (
    <section className="lt-prod-stack">
      <header className="lt-prod-stack__hd">
        <div className="lt-prod-stack__kicker">{subtitle}</div>
        <h2 className="lt-prod-stack__title">
          {title}{" "}
          <span className="lt-prod-stack__count">{products.length}</span>
        </h2>
      </header>

      {products.length === 0 ? (
        <p className="lt-prod-stack__empty">{emptyLabel}</p>
      ) : (
        <div className="lt-prod-stack__rows">
          <div className="lt-prod-stack__head">
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--thumb"></span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--code">
              {headers.model}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--label">
              {headers.description}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--range">
              {headers.range}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--acc">
              {headers.accuracy}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--resp">
              {headers.response}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--fit">
              {headers.fitting}
            </span>
            <span className="lt-prod-stack__head-cell lt-prod-stack__head-cell--act"></span>
          </div>
          {products.map((p) => (
            <ProductRow
              key={p.slug.current}
              product={p}
              category={category}
              locale={locale}
              viewLabel={viewLabel}
            />
          ))}
        </div>
      )}
    </section>
  );
}
