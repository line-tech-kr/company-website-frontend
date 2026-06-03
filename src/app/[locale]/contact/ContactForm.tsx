"use client";

import { useActionState, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Turnstile } from "@/components/forms/Turnstile";
import { submitContact, type ContactFormState } from "@/lib/contact/submit";
import type { ContactFormCopy, InquiryTypeId } from "@/lib/content/contact";

type ContactFormDefaults = {
  inquiryType: InquiryTypeId;
  extraField: string;
  subject: string;
  message: string;
};

type Props = {
  form: ContactFormCopy;
  defaults?: ContactFormDefaults;
};

const INITIAL_STATE: ContactFormState = { status: "idle" };

type GasMode = "pure" | "mixture";
type GasComponentDraft = { id: number; gas: string; percent: string };

let gasComponentCounter = 0;
const nextComponentId = () => ++gasComponentCounter;

function makeComponentDraft(): GasComponentDraft {
  return { id: nextComponentId(), gas: "", percent: "" };
}

function serializeComponents(components: GasComponentDraft[]): string {
  return JSON.stringify(
    components.map((c) => ({
      gas: c.gas.trim(),
      percent: c.percent.trim() === "" ? NaN : Number(c.percent),
    })),
  );
}

export function ContactForm({ form, defaults }: Props) {
  const [type, setType] = useState<string>(defaults?.inquiryType ?? "");
  const [consent, setConsent] = useState(false);
  const [gasMode, setGasMode] = useState<GasMode>("pure");
  const [gasComponents, setGasComponents] = useState<GasComponentDraft[]>(() => [
    makeComponentDraft(),
    makeComponentDraft(),
  ]);
  const selected = form.inquiryTypeOptions.find((o) => o.id === type);
  const extra = selected?.extraField;

  const componentTotal = useMemo(
    () =>
      gasComponents.reduce((sum, c) => {
        const n = Number(c.percent);
        return Number.isFinite(n) ? sum + n : sum;
      }, 0),
    [gasComponents],
  );
  const totalIsValid = Math.abs(componentTotal - 100) < 0.1;
  const componentsSerialized = useMemo(
    () => serializeComponents(gasComponents),
    [gasComponents],
  );

  function updateComponent(
    id: number,
    patch: Partial<Pick<GasComponentDraft, "gas" | "percent">>,
  ) {
    setGasComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }
  function addComponent() {
    setGasComponents((prev) => [...prev, makeComponentDraft()]);
  }
  function removeComponent(id: number) {
    setGasComponents((prev) =>
      prev.length <= 2 ? prev : prev.filter((c) => c.id !== id),
    );
  }

  const t = useTranslations("contactForm");
  const [state, formAction, isPending] = useActionState(
    submitContact,
    INITIAL_STATE,
  );

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
  const turnstileRequired = process.env.NODE_ENV === "production";
  const canSubmit =
    consent && (!turnstileRequired || Boolean(turnstileSiteKey));

  const errorMessage =
    state.status === "error" && state.errorKey
      ? t(`errors.${state.errorKey}`)
      : null;

  const invalidFields = new Set(
    state.status === "error" ? (state.fieldErrors ?? []) : [],
  );
  const fieldErrId = (name: string) => `ct-${name}-err`;

  if (state.status === "success") {
    return (
      <div className="ct-form__success" role="status" aria-live="polite">
        <div className="ct-form__success-icon" aria-hidden>
          ✓
        </div>
        <div>
          <h3 className="ct-form__success-title">{t("successTitle")}</h3>
          <p className="ct-form__success-body">{t("success")}</p>
          <p className="ct-form__success-note">{t("slaHint")}</p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Honeypot — visually hidden, ignored by users, populated by bots.
          The submit handler rejects any submission with a non-empty value. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-10000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label>
          Website (leave blank)
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="ct-form__grid">
        <div className="ct-form__row ct-form__row--full">
          <label htmlFor="ct-inquiry-type" className="ct-form__label">
            {form.fields.inquiryType}
            <span className="ct-form__required" aria-hidden>
              {form.required}
            </span>
          </label>
          <select
            id="ct-inquiry-type"
            name="inquiryType"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={
              invalidFields.has("inquiryType")
                ? "ct-form__select ct-form__select--invalid"
                : "ct-form__select"
            }
            aria-invalid={invalidFields.has("inquiryType") || undefined}
            aria-describedby={
              invalidFields.has("inquiryType")
                ? fieldErrId("inquiryType")
                : undefined
            }
          >
            <option value="" disabled>
              {form.placeholders.inquiryType}
            </option>
            {form.inquiryTypeOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          {invalidFields.has("inquiryType") && (
            <p
              id={fieldErrId("inquiryType")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.inquiryType")}
            </p>
          )}
        </div>

        {extra && (
          <div className="ct-form__row ct-form__row--full">
            <label htmlFor="ct-type-detail" className="ct-form__label">
              {extra.label}
              {extra.required && (
                <span className="ct-form__required" aria-hidden>
                  {form.required}
                </span>
              )}
            </label>
            <input
              key={type}
              id="ct-type-detail"
              name="typeDetail"
              type="text"
              required={extra.required}
              placeholder={extra.placeholder}
              defaultValue={
                type === defaults?.inquiryType ? defaults.extraField : undefined
              }
              className={
                invalidFields.has("typeDetail")
                  ? "ct-form__input ct-form__input--invalid"
                  : "ct-form__input"
              }
              aria-invalid={invalidFields.has("typeDetail") || undefined}
              aria-describedby={
                invalidFields.has("typeDetail")
                  ? fieldErrId("typeDetail")
                  : undefined
              }
            />
            {invalidFields.has("typeDetail") && (
              <p
                id={fieldErrId("typeDetail")}
                className="ct-form__field-error"
                role="alert"
              >
                {t("fieldErrors.typeDetail")}
              </p>
            )}
          </div>
        )}

        {type === "quote" && (
          <fieldset className="ct-form__quote">
            <legend className="ct-form__quote-heading">
              {form.quoteFields.heading}
            </legend>
            <p className="ct-form__quote-helper">{form.quoteFields.helper}</p>
            <div className="ct-form__quote-grid">
              <div className="ct-form__row ct-form__quote-row--full">
                <span className="ct-form__label">
                  {form.quoteFields.gas.label}
                  <span className="ct-form__required" aria-hidden>
                    {form.required}
                  </span>
                </span>
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
                    <span>{form.quoteFields.gas.pureLabel}</span>
                  </label>
                  <label className="ct-form__gas-mode-option">
                    <input
                      type="radio"
                      name="gasModeRadio"
                      value="mixture"
                      checked={gasMode === "mixture"}
                      onChange={() => setGasMode("mixture")}
                    />
                    <span>{form.quoteFields.gas.mixtureLabel}</span>
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
                      placeholder={form.quoteFields.gas.placeholder}
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
                    />
                    <ul className="ct-form__gas-components">
                      {gasComponents.map((c, idx) => (
                        <li key={c.id} className="ct-form__gas-component">
                          <input
                            type="text"
                            list="quote-gases"
                            value={c.gas}
                            onChange={(e) =>
                              updateComponent(c.id, { gas: e.target.value })
                            }
                            placeholder={form.quoteFields.gas.placeholder}
                            aria-label={`${form.quoteFields.gas.componentLabel} ${idx + 1}`}
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
                                updateComponent(c.id, {
                                  percent: e.target.value,
                                })
                              }
                              placeholder="0"
                              aria-label={`${form.quoteFields.gas.percentLabel} ${idx + 1}`}
                              className="ct-form__input"
                            />
                            <span
                              className="ct-form__gas-percent-suffix"
                              aria-hidden
                            >
                              %
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeComponent(c.id)}
                            disabled={gasComponents.length <= 2}
                            className="ct-form__gas-remove"
                            aria-label={form.quoteFields.gas.removeComponentLabel}
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
                        + {form.quoteFields.gas.addComponentLabel}
                      </button>
                      <span
                        className={
                          totalIsValid
                            ? "ct-form__gas-total ct-form__gas-total--ok"
                            : "ct-form__gas-total ct-form__gas-total--bad"
                        }
                        aria-live="polite"
                      >
                        {form.quoteFields.gas.totalLabel}:{" "}
                        {Number.isFinite(componentTotal)
                          ? `${componentTotal}%`
                          : "—"}
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
                  {form.quoteFields.gas.suggestions.map((g) => (
                    <option key={g} value={g} />
                  ))}
                </datalist>
              </div>

              <div className="ct-form__row">
                <label htmlFor="ct-flow-value" className="ct-form__label">
                  {form.quoteFields.flow.label}
                  <span className="ct-form__required" aria-hidden>
                    {form.required}
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
                    placeholder={form.quoteFields.flow.valuePlaceholder}
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
                    aria-label={form.quoteFields.flow.label}
                    required
                    defaultValue={form.quoteFields.flow.units[0]?.value ?? ""}
                    className={
                      invalidFields.has("flowUnit")
                        ? "ct-form__select ct-form__select--invalid"
                        : "ct-form__select"
                    }
                    aria-invalid={invalidFields.has("flowUnit") || undefined}
                  >
                    {form.quoteFields.flow.units.map((u) => (
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
                  {form.quoteFields.pressure.label}
                  <span className="ct-form__required" aria-hidden>
                    {form.required}
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
                    placeholder={form.quoteFields.pressure.valuePlaceholder}
                    className={
                      invalidFields.has("pressureValue")
                        ? "ct-form__input ct-form__input--invalid"
                        : "ct-form__input"
                    }
                    aria-invalid={
                      invalidFields.has("pressureValue") || undefined
                    }
                    aria-describedby={
                      invalidFields.has("pressureValue")
                        ? fieldErrId("pressureValue")
                        : undefined
                    }
                  />
                  <select
                    name="pressureUnit"
                    aria-label={form.quoteFields.pressure.label}
                    required
                    defaultValue={
                      form.quoteFields.pressure.units[0]?.value ?? ""
                    }
                    className={
                      invalidFields.has("pressureUnit")
                        ? "ct-form__select ct-form__select--invalid"
                        : "ct-form__select"
                    }
                    aria-invalid={
                      invalidFields.has("pressureUnit") || undefined
                    }
                  >
                    {form.quoteFields.pressure.units.map((u) => (
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
                  {form.quoteFields.fitting.typeLabel}
                  <span className="ct-form__required" aria-hidden>
                    {form.required}
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
                    aria-invalid={
                      invalidFields.has("fittingType") || undefined
                    }
                    aria-describedby={
                      invalidFields.has("fittingType")
                        ? fieldErrId("fittingType")
                        : undefined
                    }
                  >
                    <option value="" disabled>
                      {form.quoteFields.fitting.typePlaceholder}
                    </option>
                    {form.quoteFields.fitting.types.map((ft) => (
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
                    aria-label={form.quoteFields.fitting.sizeLabel}
                    placeholder={form.quoteFields.fitting.sizePlaceholder}
                    className={
                      invalidFields.has("fittingSize")
                        ? "ct-form__input ct-form__input--invalid"
                        : "ct-form__input"
                    }
                    aria-invalid={
                      invalidFields.has("fittingSize") || undefined
                    }
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
                    {t("fieldErrors.fittingType")}
                  </p>
                )}
              </div>
            </div>
          </fieldset>
        )}

        <div className="ct-form__row">
          <label htmlFor="ct-name" className="ct-form__label">
            {form.fields.name}
            <span className="ct-form__required" aria-hidden>
              {form.required}
            </span>
          </label>
          <input
            id="ct-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder={form.placeholders.name}
            className={
              invalidFields.has("name")
                ? "ct-form__input ct-form__input--invalid"
                : "ct-form__input"
            }
            aria-invalid={invalidFields.has("name") || undefined}
            aria-describedby={
              invalidFields.has("name") ? fieldErrId("name") : undefined
            }
          />
          {invalidFields.has("name") && (
            <p
              id={fieldErrId("name")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.name")}
            </p>
          )}
        </div>

        <div className="ct-form__row">
          <label htmlFor="ct-email" className="ct-form__label">
            {form.fields.email}
            <span className="ct-form__required" aria-hidden>
              {form.required}
            </span>
          </label>
          <input
            id="ct-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder={form.placeholders.email}
            className={
              invalidFields.has("email")
                ? "ct-form__input ct-form__input--invalid"
                : "ct-form__input"
            }
            aria-invalid={invalidFields.has("email") || undefined}
            aria-describedby={
              invalidFields.has("email") ? fieldErrId("email") : undefined
            }
          />
          {invalidFields.has("email") && (
            <p
              id={fieldErrId("email")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.email")}
            </p>
          )}
        </div>

        <div className="ct-form__row">
          <label htmlFor="ct-company" className="ct-form__label">
            {form.fields.company}
          </label>
          <input
            id="ct-company"
            name="company"
            type="text"
            autoComplete="organization"
            placeholder={form.placeholders.company}
            className="ct-form__input"
          />
        </div>

        <div className="ct-form__row">
          <label htmlFor="ct-phone" className="ct-form__label">
            {form.fields.phone}
          </label>
          <input
            id="ct-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={form.placeholders.phone}
            className="ct-form__input"
          />
        </div>

        <div className="ct-form__row ct-form__row--full">
          <label htmlFor="ct-subject" className="ct-form__label">
            {form.fields.subject}
          </label>
          <input
            id="ct-subject"
            name="subject"
            type="text"
            placeholder={form.placeholders.subject}
            defaultValue={defaults?.subject}
            className="ct-form__input"
          />
        </div>

        <div className="ct-form__row ct-form__row--full">
          <label htmlFor="ct-message" className="ct-form__label">
            {form.fields.message}
            <span className="ct-form__required" aria-hidden>
              {form.required}
            </span>
          </label>
          <textarea
            id="ct-message"
            name="message"
            required
            rows={6}
            placeholder={form.placeholders.message}
            defaultValue={defaults?.message}
            className={
              invalidFields.has("message")
                ? "ct-form__textarea ct-form__textarea--invalid"
                : "ct-form__textarea"
            }
            aria-invalid={invalidFields.has("message") || undefined}
            aria-describedby={
              invalidFields.has("message") ? fieldErrId("message") : undefined
            }
          />
          {invalidFields.has("message") && (
            <p
              id={fieldErrId("message")}
              className="ct-form__field-error"
              role="alert"
            >
              {t("fieldErrors.message")}
            </p>
          )}
        </div>
      </div>

      <div className="ct-form__consent">
        <label className="ct-form__consent-label">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={invalidFields.has("consent") || undefined}
            aria-describedby={
              invalidFields.has("consent") ? fieldErrId("consent") : undefined
            }
          />
          <span>
            {form.consent.prefix}
            <Link href="/legal/privacy" className="ct-form__consent-link">
              {form.consent.linkText}
            </Link>
            {form.consent.suffix}
          </span>
        </label>
        {invalidFields.has("consent") && (
          <p
            id={fieldErrId("consent")}
            className="ct-form__field-error"
            role="alert"
          >
            {t("fieldErrors.consent")}
          </p>
        )}
      </div>

      <div className="ct-form__captcha">
        <Turnstile siteKey={turnstileSiteKey} />
        {!turnstileSiteKey && !turnstileRequired && (
          <input
            type="hidden"
            name="cf-turnstile-response"
            value="dev-preview"
          />
        )}
      </div>

      {errorMessage && (
        <p className="ct-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="ct-form__actions">
        <Button
          variant="primary"
          size="lg"
          type="submit"
          disabled={isPending || !canSubmit}
        >
          {isPending ? t("submitting") : form.submit}
        </Button>
        {!turnstileSiteKey && turnstileRequired && (
          <p className="ct-form__help">{form.submitDisabledHelp}</p>
        )}
      </div>
      <p className="ct-form__sla">{t("slaHint")}</p>
    </form>
  );
}
