import { ProductRow } from "../ProductRow";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import type { Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/imageUrl";
import { EmptyState } from "@/components/shared/EmptyState";
import "./ProductStack.css";

type Props = {
  title: string;
  subtitle: string;
  products: Product[];
  category: CategorySlug;
  locale: Locale;
  emptyLabel: string;
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
        <EmptyState message={emptyLabel} />
      ) : (
        <table className="lt-prod-stack__table">
          <caption className="lt-prod-stack__sr-caption">{title}</caption>
          <thead>
            <tr className="lt-prod-stack__head">
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--thumb"
                aria-hidden="true"
              />
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--code"
              >
                {headers.model}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--label"
              >
                {headers.description}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--range"
              >
                {headers.range}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--acc"
              >
                {headers.accuracy}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--resp"
              >
                {headers.response}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-prod-stack__head-cell--fit"
              >
                {headers.fitting}
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const firstImage = p.images?.[0];
              const imageSrc = firstImage?.asset
                ? urlFor(firstImage).width(88).url()
                : null;
              return (
                <ProductRow
                  key={p.slug.current}
                  product={p}
                  imageSrc={imageSrc}
                  category={category}
                  locale={locale}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
