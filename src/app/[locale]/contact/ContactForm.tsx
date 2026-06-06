"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { Turnstile } from "@/components/forms/Turnstile";
import { submitContact, type ContactFormState } from "@/lib/contact/submit";
import type { ContactFormCopy, InquiryTypeId } from "@/lib/content/contact";
import { QuoteFields } from "./QuoteFields";

type ContactFormDefaults = {
  inquiryType: InquiryTypeId;
  extraField?: string;
  model?: string;
  subject: string;
  message: string;
};

type Props = {
  form: ContactFormCopy;
  defaults?: ContactFormDefaults;
};

const INITIAL_STATE: ContactFormState = { status: "idle" };

export function ContactForm({ form, defaults }: Props) {
  const [type, setType] = useState<string>(defaults?.inquiryType ?? "");
  const [consent, setConsent] = useState(false);
  const selected = form.inquiryTypeOptions.find((o) => o.id === type);
  const extra = selected?.extraField;

  const t = useTranslations("contactForm");
  // Manual submit (not <form action>) so React 19 doesn't auto-reset the form
  // after the action runs — preserves typed values when validation fails.
  const [state, setState] = useState<ContactFormState>(INITIAL_STATE);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await submitContact(state, formData);
      setState(result);
    });
  };

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
    <form onSubmit={handleSubmit} noValidate>
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
          <QuoteFields
            form={form.quoteFields}
            requiredLabel={form.required}
            invalidFields={invalidFields}
            fieldErrId={fieldErrId}
            defaultModel={defaults?.model}
          />
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
