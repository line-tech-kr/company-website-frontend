import { ProductRow } from "../ProductRow";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import type { Locale } from "@/i18n/routing";
import { urlFor } from "@/sanity/imageUrl";
import { EmptyState } from "@/components/shared/EmptyState";
import "./ProductStack.css";

export type ProductStackVariant = "default" | "compact";

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
  // "compact" omits the spec columns (range/accuracy/response/fitting). Used
  // for product families that don't have flow-device specs — e.g. ROU
  // read-out units (#223).
  variant?: ProductStackVariant;
};

export function ProductStack({
  title,
  subtitle,
  products,
  category,
  locale,
  emptyLabel,
  headers,
  variant = "default",
}: Props) {
  const isCompact = variant === "compact";
  const tableClass = isCompact
    ? "lt-prod-stack__table lt-prod-stack__table--compact"
    : "lt-prod-stack__table";
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
        <table className={tableClass}>
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
              {!isCompact && (
                <>
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
                </>
              )}
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
                <ProductRow
                  key={p.slug.current}
                  product={p}
                  imageSrc={imageSrc}
                  category={category}
                  locale={locale}
                  variant={variant}
                />
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
