"use client";

import { useEffect, useId, useMemo, useState } from "react";
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
import {
  computeMixtureFactor,
  formatMixtureLabel,
  type GasComponent,
} from "@/lib/finder/mixture";
import { toBar, type PressureUnit } from "@/lib/finder/pressure";
import { FunctionPicker } from "./FunctionPicker";
import { GasSelect } from "./GasSelect";
import { FlowInput } from "./FlowInput";
import { PressureInput } from "./PressureInput";
import { SeriesPicker } from "./SeriesPicker";
import { ResultCard } from "./ResultCard";
import { MixtureEditor, defaultMixtureComponents } from "./MixtureEditor";
import "./ProductFinder.css";

export type GasMode = "pure" | "mixture";

export type ProductFinderInitial = {
  fn?: FinderFunction;
  gas?: string;
  flow?: number;
  unit?: FinderUnit;
  series?: FinderSeries;
  gasMode?: GasMode;
  components?: GasComponent[];
  pressure?: number;
  pressureUnit?: PressureUnit;
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
const DEFAULT_MODE: GasMode = "pure";
const DEFAULT_PRESSURE_UNIT: PressureUnit = "bar";

export function ProductFinder({ products, locale, initial }: Props) {
  const t = useTranslations("productFinder");
  const router = useRouter();
  const pathname = usePathname();
  const modeId = useId();

  const [fn, setFn] = useState<FinderFunction>(initial?.fn ?? DEFAULT_FN);
  const [gasId, setGasId] = useState<string>(initial?.gas ?? DEFAULT_GAS);
  const [flow, setFlow] = useState<number | "">(
    initial?.flow != null ? initial.flow : "",
  );
  const [unit, setUnit] = useState<FinderUnit>(initial?.unit ?? DEFAULT_UNIT);
  const [series, setSeries] = useState<FinderSeries>(
    initial?.series ?? DEFAULT_SERIES,
  );
  const [gasMode, setGasMode] = useState<GasMode>(
    initial?.gasMode ?? DEFAULT_MODE,
  );
  const [components, setComponents] = useState<GasComponent[]>(
    initial?.components ?? defaultMixtureComponents(),
  );
  const [pressure, setPressure] = useState<number | "">(
    initial?.pressure != null ? initial.pressure : "",
  );
  const [pressureUnit, setPressureUnit] = useState<PressureUnit>(
    initial?.pressureUnit ?? DEFAULT_PRESSURE_UNIT,
  );

  // Sync state to URL whenever the form changes.
  useEffect(() => {
    const query: Record<string, string> = {};
    if (fn !== DEFAULT_FN) query.fn = fn;
    if (series !== DEFAULT_SERIES) query.series = series;
    if (flow !== "" && Number.isFinite(flow)) query.flow = String(flow);
    if (unit !== DEFAULT_UNIT) query.unit = unit;
    if (gasMode === "mixture") {
      const encoded = components
        .filter((c) => c.gasId.trim() !== "" && c.percent > 0)
        .map((c) => `${c.gasId}:${c.percent}`)
        .join(",");
      if (encoded) query.gasMix = encoded;
    } else if (gasId !== DEFAULT_GAS) {
      query.gas = gasId;
    }
    if (
      pressure !== "" &&
      Number.isFinite(pressure) &&
      (pressure as number) > 0
    ) {
      query.p = String(pressure);
      if (pressureUnit !== DEFAULT_PRESSURE_UNIT) query.pu = pressureUnit;
    }
    router.replace({ pathname, query }, { scroll: false });
  }, [
    fn,
    gasId,
    gasMode,
    components,
    flow,
    unit,
    series,
    pressure,
    pressureUnit,
    pathname,
    router,
  ]);

  const mixture = useMemo(() => {
    if (gasMode !== "mixture") return null;
    const result = computeMixtureFactor(components);
    if (!result || "missingGas" in result) return null;
    return result;
  }, [gasMode, components]);

  const result = useMemo(() => {
    const flowProvided =
      flow !== "" && Number.isFinite(flow) && (flow as number) > 0;
    if (fn !== "EPC" && !flowProvided) return null;
    if (gasMode === "mixture" && !mixture) return null;
    const pressureProvided =
      pressure !== "" && Number.isFinite(pressure) && (pressure as number) > 0;
    return findProducts(products, {
      function: fn,
      gasId,
      flow: flowProvided ? (flow as number) : 0,
      unit,
      series,
      mixture: mixture
        ? {
            factor: mixture.factor,
            specialty: mixture.category === "specialty",
          }
        : undefined,
      pressureBar: pressureProvided
        ? toBar(pressure as number, pressureUnit)
        : undefined,
    });
  }, [
    products,
    fn,
    gasId,
    flow,
    unit,
    series,
    gasMode,
    mixture,
    pressure,
    pressureUnit,
  ]);

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
  const mixtureLabels = {
    gasLegend: t("gas.label"),
    gasPlaceholder: t("gas.placeholder"),
    gasCommon: t("gas.commonLabel"),
    gasAll: t("gas.allLabel"),
    gasEmpty: t("gas.empty"),
    percentAria: t("gas.percentAria"),
    addComponent: t("gas.addComponent"),
    removeComponent: t("gas.removeComponent"),
    totalLabel: t("gas.totalLabel"),
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
        <fieldset className="lt-finder__group lt-finder__group--full">
          <legend className="lt-finder__label">{t("gas.label")}</legend>
          <div
            className="lt-finder__gas-mode"
            role="radiogroup"
            aria-label={t("gas.modeLabel")}
          >
            <label className="lt-finder__gas-mode-option">
              <input
                type="radio"
                name={`${modeId}-mode`}
                value="pure"
                checked={gasMode === "pure"}
                onChange={() => setGasMode("pure")}
              />
              <span>{t("gas.modePure")}</span>
            </label>
            <label className="lt-finder__gas-mode-option">
              <input
                type="radio"
                name={`${modeId}-mode`}
                value="mixture"
                checked={gasMode === "mixture"}
                onChange={() => setGasMode("mixture")}
              />
              <span>{t("gas.modeMixture")}</span>
            </label>
          </div>
          {gasMode === "pure" ? (
            <GasSelect
              value={gasId}
              onChange={setGasId}
              labels={gasLabels}
              hideLabel
            />
          ) : (
            <MixtureEditor
              components={components}
              onChange={setComponents}
              labels={mixtureLabels}
            />
          )}
        </fieldset>
        {fn !== "EPC" && (
          <FlowInput
            flow={flow}
            unit={unit}
            onFlowChange={setFlow}
            onUnitChange={setUnit}
            labels={{ legend: t("flow.label"), unit: unitLabels }}
          />
        )}
        <PressureInput
          value={pressure}
          unit={pressureUnit}
          onValueChange={setPressure}
          onUnitChange={setPressureUnit}
          labels={{
            legend: t("pressure.label"),
            placeholder: t("pressure.placeholder"),
          }}
        />
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
                (gasMode === "mixture"
                  ? mixture && (
                      <p className="lt-finder__converted">
                        {t("convertedNoteMix", {
                          mix: formatMixtureLabel(components),
                          n2: result.n2EquivalentSlpm.toLocaleString(locale, {
                            maximumFractionDigits: 3,
                          }),
                        })}
                      </p>
                    )
                  : result.gas &&
                    result.gas.id !== DEFAULT_GAS && (
                      <p className="lt-finder__converted">
                        {t("convertedNote", {
                          n2: result.n2EquivalentSlpm.toLocaleString(locale, {
                            maximumFractionDigits: 3,
                          }),
                        })}
                      </p>
                    ))}
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
