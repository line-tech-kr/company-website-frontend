import { EpcRow } from "../EpcRow";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import type { Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/imageUrl";
import { EmptyState } from "@/components/shared/EmptyState";
import "./EpcStack.css";

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
    pressureRange: string;
    accuracy: string;
    maxPressure: string;
    fitting: string;
  };
};

export function EpcStack({
  title,
  subtitle,
  products,
  category,
  locale,
  emptyLabel,
  headers,
}: Props) {
  const titleId = `epc-stack-${category}`;
  return (
    <section className="lt-prod-stack lt-epc-stack" aria-labelledby={titleId}>
      <header className="lt-prod-stack__hd">
        <div className="lt-prod-stack__kicker">{subtitle}</div>
        <h2 id={titleId} className="lt-prod-stack__title">
          {title}{" "}
          <span className="lt-prod-stack__count">{products.length}</span>
        </h2>
      </header>

      {products.length === 0 ? (
        <EmptyState message={emptyLabel} />
      ) : (
        <table className="lt-prod-stack__table lt-epc-stack__table">
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
                className="lt-prod-stack__head-cell lt-epc-stack__head-cell--pressure"
              >
                {headers.pressureRange}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-epc-stack__head-cell--accuracy"
              >
                {headers.accuracy}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-epc-stack__head-cell--max-pressure"
              >
                {headers.maxPressure}
              </th>
              <th
                scope="col"
                className="lt-prod-stack__head-cell lt-epc-stack__head-cell--fitting"
              >
                {headers.fitting}
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const fallback = p.images?.[0];
              const source = p.cutout?.asset
                ? p.cutout
                : fallback?.asset
                  ? fallback
                  : null;
              const imageSrc = source ? urlFor(source).width(128).url() : null;
              return (
                <EpcRow
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
