"use client";

import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import { ProductThumb } from "../ProductThumb";
import { Chip } from "@/components/ui/Chip/Chip";
import type { Product } from "@/lib/types/product";
import type { CategorySlug } from "@/lib/categories";
import type { Locale } from "@/i18n/routing";
import { localizeSpecValue } from "@/lib/products/localizeSpecValue";
import "./EpcRow.css";

type Props = {
  product: Product;
  imageSrc: string | null;
  category: CategorySlug;
  locale: Locale;
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

export function EpcRow({ product, imageSrc, category, locale }: Props) {
  const href = `/products/${category}/${product.slug.current}`;
  const label = product.description?.[locale] ?? product.productLabel[locale];
  const pressureRange = product.massFlowSpecs?.pressureRange
    ? localizeSpecValue(product.massFlowSpecs.pressureRange.display, locale)
    : "—";
  const accuracy = product.massFlowSpecs
    ? localizeSpecValue(product.massFlowSpecs.accuracy.display, locale)
    : "—";
  const maxPressure = product.massFlowSpecs?.maxPressure
    ? localizeSpecValue(product.massFlowSpecs.maxPressure.display, locale)
    : "—";
  const fitting = fittingSummary(product.connections) || "—";
  const visibleTags = product.tags
    .filter((t) => VISIBLE_TAG_KINDS.has(t.kind))
    .slice(0, MAX_VISIBLE_TAGS);
  const router = useRouter();

  return (
    <tr
      className="lt-prod-row lt-epc-row"
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
        <div className="lt-prod-row__thumb">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt=""
              fill
              sizes="56px"
              className="lt-prod-row__thumb-img"
            />
          ) : (
            <ProductThumb />
          )}
        </div>
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
      <td className="lt-prod-row__cell lt-epc-row__cell--pressure">
        {pressureRange}
      </td>
      <td className="lt-prod-row__cell lt-epc-row__cell--accuracy">
        {accuracy}
      </td>
      <td className="lt-prod-row__cell lt-epc-row__cell--max-pressure">
        {maxPressure}
      </td>
      <td className="lt-prod-row__cell lt-epc-row__cell--fitting">
        {fitting}
      </td>
    </tr>
  );
}
