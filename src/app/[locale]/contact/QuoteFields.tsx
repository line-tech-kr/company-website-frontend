"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ContactFormCopy } from "@/lib/content/contact";

type GasMode = "pure" | "mixture";
type GasComponentDraft = { id: number; gas: string; percent: string };

type Props = {
  form: ContactFormCopy["quoteFields"];
  requiredLabel: string;
  invalidFields: ReadonlySet<string>;
  fieldErrId: (name: string) => string;
};

function serializeComponents(components: GasComponentDraft[]): string {
  return JSON.stringify(
    components.map((c) => ({
      gas: c.gas.trim(),
      percent: c.percent.trim() === "" ? null : Number(c.percent),
    })),
  );
}

export function QuoteFields({
  form,
  requiredLabel,
  invalidFields,
  fieldErrId,
}: Props) {
  const t = useTranslations("contactForm");
  // useRef counter survives mode toggles but resets per mount, so HMR can't
  // collide IDs between an old and new component list. The two seed rows
  // own IDs 1 and 2; the ref tracks the next free ID for addComponent().
  const idRef = useRef(2);
  const [gasMode, setGasMode] = useState<GasMode>("pure");
  const [components, setComponents] = useState<GasComponentDraft[]>(() => [
    { id: 1, gas: "", percent: "" },
    { id: 2, gas: "", percent: "" },
  ]);

  const componentTotal = useMemo(
    () =>
      components.reduce((sum, c) => {
        const n = Number(c.percent);
        return Number.isFinite(n) ? sum + n : sum;
      }, 0),
    [components],
  );
  const totalIsValid = Math.abs(componentTotal - 100) < 0.1;
  const componentsSerialized = useMemo(
    () => serializeComponents(components),
    [components],
  );

  function updateComponent(
    id: number,
    patch: Partial<Pick<GasComponentDraft, "gas" | "percent">>,
  ) {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }
  function addComponent() {
    setComponents((prev) => [
      ...prev,
      { id: ++idRef.current, gas: "", percent: "" },
    ]);
  }
  function removeComponent(id: number) {
    setComponents((prev) =>
      prev.length <= 2 ? prev : prev.filter((c) => c.id !== id),
    );
  }

  return (
    <fieldset className="ct-form__quote">
      <legend className="ct-form__quote-heading">{form.heading}</legend>
      <p className="ct-form__quote-helper">{form.helper}</p>
      <div className="ct-form__quote-grid">
        <div className="ct-form__row ct-form__quote-row--full">
          <span className="ct-form__label">
            {form.gas.label}
            <span className="ct-form__required" aria-hidden>
              {requiredLabel}
            </span>
          </span>
          {/* Real form value lives in the hidden input; radios drive UI only. */}
          <input type="hidden" name="gasMode" value={gasMode} />
          <div className="ct-form__gas-mode" role="radiogroup">
            <label className="ct-form__gas-mode-option">
              <input
                type="radio"
                name="gasModeRadio"
                value="pure"
                checked={gasMode === "pure"}
                onChange={() => setGasMode("pure")}
              />
              <span>{form.gas.pureLabel}</span>
            </label>
            <label className="ct-form__gas-mode-option">
              <input
                type="radio"
                name="gasModeRadio"
                value="mixture"
                checked={gasMode === "mixture"}
                onChange={() => setGasMode("mixture")}
              />
              <span>{form.gas.mixtureLabel}</span>
            </label>
          </div>

          {gasMode === "pure" && (
            <>
              <input
                id="ct-gas"
                name="gas"
                type="text"
                required
                list="quote-gases"
                placeholder={form.gas.placeholder}
                className={
                  invalidFields.has("gas")
                    ? "ct-form__input ct-form__input--invalid"
                    : "ct-form__input"
                }
                aria-invalid={invalidFields.has("gas") || undefined}
                aria-describedby={
                  invalidFields.has("gas") ? fieldErrId("gas") : undefined
                }
              />
              {invalidFields.has("gas") && (
                <p
                  id={fieldErrId("gas")}
                  className="ct-form__field-error"
                  role="alert"
                >
                  {t("fieldErrors.gas")}
                </p>
              )}
            </>
          )}

          {gasMode === "mixture" && (
            <>
              <input
                type="hidden"
                name="gasComponents"
                value={componentsSerialized}
                data-testid="ct-gas-components"
              />
              <ul className="ct-form__gas-components">
                {components.map((c, idx) => (
                  <li key={c.id} className="ct-form__gas-component">
                    <input
                      type="text"
                      list="quote-gases"
                      value={c.gas}
                      onChange={(e) =>
                        updateComponent(c.id, { gas: e.target.value })
                      }
                      placeholder={form.gas.placeholder}
                      aria-label={`${form.gas.componentLabel} ${idx + 1}`}
                      className="ct-form__input"
                    />
                    <div className="ct-form__gas-percent">
                      <input
                        type="number"
                        inputMode="decimal"
                        min={0}
                        max={100}
                        step="any"
                        value={c.percent}
                        onChange={(e) =>
                          updateComponent(c.id, { percent: e.target.value })
                        }
                        placeholder="0"
                        aria-label={`${form.gas.percentLabel} ${idx + 1}`}
                        className="ct-form__input"
                      />
                      <span className="ct-form__gas-percent-suffix" aria-hidden>
                        %
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeComponent(c.id)}
                      disabled={components.length <= 2}
                      className="ct-form__gas-remove"
                      aria-label={form.gas.removeComponentLabel}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="ct-form__gas-mixture-actions">
                <button
                  type="button"
                  onClick={addComponent}
                  className="ct-form__gas-add"
                >
                  + {form.gas.addComponentLabel}
                </button>
                <span
                  className={
                    totalIsValid
                      ? "ct-form__gas-total ct-form__gas-total--ok"
                      : "ct-form__gas-total ct-form__gas-total--bad"
                  }
                  aria-live="polite"
                  data-testid="ct-gas-total"
                >
                  {form.gas.totalLabel}: {Number(componentTotal.toFixed(4))}%
                </span>
              </div>
              {invalidFields.has("gasComponents") && (
                <p
                  id={fieldErrId("gasComponents")}
                  className="ct-form__field-error"
                  role="alert"
                >
                  {t("fieldErrors.gasComponents")}
                </p>
              )}
            </>
          )}
          <datalist id="quote-gases">
            {form.gas.suggestions.map((g) => (
              <option key={g} value={g} />
            ))}
          </datalist>
        </div>

        <div className="ct-form__row">
          <label htmlFor="ct-flow-value" className="ct-form__label">
            {form.flow.label}
            <span className="ct-form__required" aria-hidden>
              {requiredLabel}
            </span>
          </label>
          <div className="ct-form__pair">
            <input
              id="ct-flow-value"
              name="flowValue"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              required
              placeholder={form.flow.valuePlaceholder}
              className={
                invalidFields.has("flowValue")
                  ? "ct-form__input ct-form__input--invalid"
                  : "ct-form__input"
              }
              aria-invalid={invalidFields.has("flowValue") || undefined}
              aria-describedby={
                invalidFields.has("flowValue")
                  ? fieldErrId("flowValue")
                  : undefined
              }
            />
            <select
              name="flowUnit"
              aria-label={form.flow.label}
              required
              defaultValue={form.flow.units[0]?.value ?? ""}
              className={
                invalidFields.has("flowUnit")
                  ? "ct-form__select ct-form__select--invalid"
                  : "ct-form__select"
              }
              aria-invalid={invalidFields.has("flowUnit") || undefined}
            >
              {form.flow.units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          {(invalidFields.has("flowValue") ||
            invalidFields.has("flowUnit")) && (
            <p
              id={fieldErrId("flowValue")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.flowValue")}
            </p>
          )}
        </div>

        <div className="ct-form__row">
          <label htmlFor="ct-pressure-value" className="ct-form__label">
            {form.pressure.label}
            <span className="ct-form__required" aria-hidden>
              {requiredLabel}
            </span>
          </label>
          <div className="ct-form__pair">
            <input
              id="ct-pressure-value"
              name="pressureValue"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              required
              placeholder={form.pressure.valuePlaceholder}
              className={
                invalidFields.has("pressureValue")
                  ? "ct-form__input ct-form__input--invalid"
                  : "ct-form__input"
              }
              aria-invalid={invalidFields.has("pressureValue") || undefined}
              aria-describedby={
                invalidFields.has("pressureValue")
                  ? fieldErrId("pressureValue")
                  : undefined
              }
            />
            <select
              name="pressureUnit"
              aria-label={form.pressure.label}
              required
              defaultValue={form.pressure.units[0]?.value ?? ""}
              className={
                invalidFields.has("pressureUnit")
                  ? "ct-form__select ct-form__select--invalid"
                  : "ct-form__select"
              }
              aria-invalid={invalidFields.has("pressureUnit") || undefined}
            >
              {form.pressure.units.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
          {(invalidFields.has("pressureValue") ||
            invalidFields.has("pressureUnit")) && (
            <p
              id={fieldErrId("pressureValue")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.pressureValue")}
            </p>
          )}
        </div>

        <div className="ct-form__row ct-form__quote-row--full">
          <label htmlFor="ct-fitting-type" className="ct-form__label">
            {form.fitting.typeLabel}
            <span className="ct-form__required" aria-hidden>
              {requiredLabel}
            </span>
          </label>
          <div className="ct-form__pair">
            <select
              id="ct-fitting-type"
              name="fittingType"
              required
              defaultValue=""
              className={
                invalidFields.has("fittingType")
                  ? "ct-form__select ct-form__select--invalid"
                  : "ct-form__select"
              }
              aria-invalid={invalidFields.has("fittingType") || undefined}
              aria-describedby={
                invalidFields.has("fittingType")
                  ? fieldErrId("fittingType")
                  : undefined
              }
            >
              <option value="" disabled>
                {form.fitting.typePlaceholder}
              </option>
              {form.fitting.types.map((ft) => (
                <option key={ft.value} value={ft.value}>
                  {ft.label}
                </option>
              ))}
            </select>
            <input
              id="ct-fitting-size"
              name="fittingSize"
              type="text"
              required
              aria-label={form.fitting.sizeLabel}
              placeholder={form.fitting.sizePlaceholder}
              className={
                invalidFields.has("fittingSize")
                  ? "ct-form__input ct-form__input--invalid"
                  : "ct-form__input"
              }
              aria-invalid={invalidFields.has("fittingSize") || undefined}
              aria-describedby={
                invalidFields.has("fittingSize")
                  ? fieldErrId("fittingSize")
                  : undefined
              }
            />
          </div>
          {(invalidFields.has("fittingType") ||
            invalidFields.has("fittingSize")) && (
            <p
              id={fieldErrId("fittingType")}
              className="ct-form__field-error"
              role="alert"
            >
              {t(
                invalidFields.has("fittingSize") &&
                  !invalidFields.has("fittingType")
                  ? "fieldErrors.fittingSize"
                  : "fieldErrors.fittingType",
              )}
            </p>
          )}
        </div>
      </div>
    </fieldset>
  );
}
