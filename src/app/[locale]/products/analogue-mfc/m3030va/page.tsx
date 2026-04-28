import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { sanityClient } from "@/sanity/client";
import { productBySlugQuery } from "@/sanity/queries";
import type { MassFlowSpecs, Product } from "@/lib/types/product";

type Props = { params: Promise<{ locale: string }> };

export default async function ProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const product = (await sanityClient.fetch(productBySlugQuery, {
    slug: "m3030va",
  })) as Product | null;

  if (!product) notFound();

  const [t, tDownloads, tCommon, tNav, tCategories] = await Promise.all([
    getTranslations("product.specs"),
    getTranslations("product.downloads"),
    getTranslations("common"),
    getTranslations("nav"),
    getTranslations("breadcrumbs.categories"),
  ]);

  const specEntries = Object.entries(product.massFlowSpecs) as Array<
    [keyof MassFlowSpecs, { display: string }]
  >;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: tCategories("analogueMfc"), href: "/products/analogue-mfc" },
    { label: product.model },
  ];

  return (
    <main>
      <Breadcrumbs items={breadcrumbs} />
      <h1>{product.model}</h1>
      <p>
        {product.productLabel[locale as "ko" | "en" | "zh"]} · {product.series}{" "}
        · {product.function}
      </p>

      <h2>Specifications</h2>
      <table>
        <tbody>
          {specEntries.map(([key, spec]) => (
            <tr key={key}>
              <th style={{ textAlign: "left" }}>{t(key)}</th>
              <td>{spec.display}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Connections</h2>
      <ul>
        {product.connections.map((c, i) => (
          <li key={i}>
            {c.type} — {c.length}
          </li>
        ))}
      </ul>

      <h2>Dimension drawing</h2>
      <p>(placeholder — designed component pending)</p>

      <h2>Downloads</h2>
      <ul>
        <li>{tDownloads("datasheet")} (placeholder)</li>
        <li>{tDownloads("manual")} (placeholder)</li>
      </ul>
    </main>
  );
}
