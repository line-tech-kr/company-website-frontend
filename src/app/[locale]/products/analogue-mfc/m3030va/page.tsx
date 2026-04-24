import { setRequestLocale, getTranslations } from "next-intl/server";
import { M3030VA } from "@/lib/fixtures/products";
import type { MassFlowSpecs } from "@/lib/types/product";

type Props = { params: Promise<{ locale: string }> };

export default async function ProductPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("product.specs");
  const tDownloads = await getTranslations("product.downloads");

  const product = M3030VA;
  const specEntries = Object.entries(product.massFlowSpecs) as Array<
    [keyof MassFlowSpecs, { display: string }]
  >;

  return (
    <main>
      <h1>{product.model}</h1>
      <p>
        Series: {product.series} · Function: {product.function} · Form factor:{" "}
        {product.formFactor}
      </p>

      <h2>Specifications</h2>
      <table>
        <tbody>
          {specEntries.map(([key, spec]) => (
            <tr key={key}>
              <th align="left">{t(key)}</th>
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
