"use client";

import { Link, useRouter } from "@/i18n/navigation";
import { ProductThumb } from "../ProductThumb";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import "./ProductRow.css";

type Props = {
  product: Product;
  category: CategorySlug;
  locale: "ko" | "en" | "zh";
};

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
  const label = product.description?.[locale] ?? product.productLabel[locale];
  const range = product.massFlowSpecs.flowRange.display;
  const accuracy = product.massFlowSpecs.accuracy.display;
  const response = product.massFlowSpecs.responseTime?.display ?? "—";
  const fitting = fittingSummary(product.connections);
  const router = useRouter();

  return (
    <tr
      className="lt-prod-row"
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) return;
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        router.push(href);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(href);
      }}
    >
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
        <span className="lt-prod-row__label">{label}</span>
      </td>
      <td className="lt-prod-row__cell lt-prod-row__cell--range">{range}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--acc">{accuracy}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--resp">{response}</td>
      <td className="lt-prod-row__cell lt-prod-row__cell--fit">{fitting}</td>
    </tr>
  );
}
