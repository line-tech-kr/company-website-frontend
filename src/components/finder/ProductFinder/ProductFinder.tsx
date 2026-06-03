"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { Product } from "@/lib/types/product";
import {
  findProducts,
  type FinderFunction,
  type FinderSeries,
  type FinderUnit,
} from "@/lib/finder/match";
import { FunctionPicker } from "./FunctionPicker";
import { GasSelect } from "./GasSelect";
import { FlowInput } from "./FlowInput";
import { SeriesPicker } from "./SeriesPicker";
import { ResultCard } from "./ResultCard";
import "./ProductFinder.css";

export type ProductFinderInitial = {
  fn?: FinderFunction;
  gas?: string;
  flow?: number;
  unit?: FinderUnit;
  series?: FinderSeries;
};

type Props = {
  products: readonly Product[];
  locale: Locale;
  initial?: ProductFinderInitial;
};

const DEFAULT_GAS = "nitrogen";
const DEFAULT_FN: FinderFunction = "any";
const DEFAULT_SERIES: FinderSeries = "any";
const DEFAULT_UNIT: FinderUnit = "slpm";

export function ProductFinder({ products, locale, initial }: Props) {
  const t = useTranslations("productFinder");
  const router = useRouter();
  const pathname = usePathname();

  const [fn, setFn] = useState<FinderFunction>(initial?.fn ?? DEFAULT_FN);
  const [gasId, setGasId] = useState<string>(initial?.gas ?? DEFAULT_GAS);
  const [flow, setFlow] = useState<number | "">(
    initial?.flow != null ? initial.flow : "",
  );
  const [unit, setUnit] = useState<FinderUnit>(initial?.unit ?? DEFAULT_UNIT);
  const [series, setSeries] = useState<FinderSeries>(
    initial?.series ?? DEFAULT_SERIES,
  );

  // Sync state to URL whenever the form changes.
  useEffect(() => {
    const query: Record<string, string> = {};
    if (fn !== DEFAULT_FN) query.fn = fn;
    if (gasId !== DEFAULT_GAS) query.gas = gasId;
    if (flow !== "" && Number.isFinite(flow)) query.flow = String(flow);
    if (unit !== DEFAULT_UNIT) query.unit = unit;
    if (series !== DEFAULT_SERIES) query.series = series;
    router.replace({ pathname, query }, { scroll: false });
  }, [fn, gasId, flow, unit, series, pathname, router]);

  const result = useMemo(() => {
    const flowProvided =
      flow !== "" && Number.isFinite(flow) && (flow as number) > 0;
    // EPC products use pressureRange, not flowRange — surface them without
    // requiring a flow value.
    if (fn !== "EPC" && !flowProvided) {
      return null;
    }
    return findProducts(products, {
      function: fn,
      gasId,
      flow: flowProvided ? (flow as number) : 0,
      unit,
      series,
    });
  }, [products, fn, gasId, flow, unit, series]);

  const fnLabels: Record<FinderFunction, string> = {
    any: t("fn.any"),
    MFC: t("fn.mfc"),
    MFM: t("fn.mfm"),
    EPC: t("fn.epc"),
  };
  const seriesLabels: Record<FinderSeries, string> = {
    any: t("series.any"),
    analogue: t("series.analogue"),
    digital: t("series.digital"),
    specialized: t("series.specialized"),
    lepc: t("series.lepc"),
  };
  const unitLabels = { slpm: t("flow.unit.slpm"), sccm: t("flow.unit.sccm") };
  const gasLabels = {
    legend: t("gas.label"),
    placeholder: t("gas.placeholder"),
    common: t("gas.commonLabel"),
    all: t("gas.allLabel"),
    empty: t("gas.empty"),
  };

  const rankLabel = (score: number) => {
    if (score >= 1) return t("results.rankIdeal");
    if (score >= 0.7) return t("results.rankGood");
    return t("results.rankEdge");
  };

  return (
    <section className="lt-finder">
      <form
        className="lt-finder__form"
        onSubmit={(e) => e.preventDefault()}
        aria-label={t("heading")}
      >
        <FunctionPicker
          value={fn}
          onChange={setFn}
          labels={fnLabels}
          legend={t("fn.label")}
        />
        <SeriesPicker
          value={series}
          onChange={setSeries}
          labels={seriesLabels}
          legend={t("series.label")}
        />
        <GasSelect value={gasId} onChange={setGasId} labels={gasLabels} />
        {fn !== "EPC" && (
          <FlowInput
            flow={flow}
            unit={unit}
            onFlowChange={setFlow}
            onUnitChange={setUnit}
            labels={{ legend: t("flow.label"), unit: unitLabels }}
          />
        )}
      </form>

      <div className="lt-finder__results" aria-live="polite">
        {result == null ? (
          <p className="lt-finder__hint">{t("results.prompt")}</p>
        ) : (
          <>
            <header className="lt-finder__results-head">
              <h2 className="lt-finder__results-title">
                {t("results.heading", { count: result.matches.length })}
              </h2>
              {fn !== "EPC" &&
                result.gas &&
                result.gas.id !== DEFAULT_GAS && (
                  <p className="lt-finder__converted">
                    {t("convertedNote", {
                      n2: result.n2EquivalentSlpm.toLocaleString(locale, {
                        maximumFractionDigits: 3,
                      }),
                    })}
                  </p>
                )}
            </header>

            {result.warning === "specialty-gas" && (
              <p className="lt-finder__warn" role="note">
                {t("results.specialtyWarning")}
              </p>
            )}

            {result.matches.length === 0 ? (
              <p className="lt-finder__empty">{t("results.empty")}</p>
            ) : (
              <ul className="lt-finder__list">
                {result.matches.map((m) => (
                  <li key={m.product.slug.current}>
                    <ResultCard
                      match={m}
                      locale={locale}
                      rankLabel={rankLabel(m.fitScore)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </section>
  );
}
