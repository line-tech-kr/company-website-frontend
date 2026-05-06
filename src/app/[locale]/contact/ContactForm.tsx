"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
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
  privacyNotice: string;
  defaults?: ContactFormDefaults;
};

const INITIAL_STATE: ContactFormState = { status: "idle" };

export function ContactForm({ form, privacyNotice, defaults }: Props) {
  const [type, setType] = useState<string>(defaults?.inquiryType ?? "");
  const selected = form.inquiryTypeOptions.find((o) => o.id === type);
  const extra = selected?.extraField;

  const t = useTranslations("contactForm");
  const [state, formAction, isPending] = useActionState(
    submitContact,
    INITIAL_STATE,
  );

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  const errorMessage =
    state.status === "error" && state.errorKey
      ? t(`errors.${state.errorKey}`)
      : null;

  if (state.status === "success") {
    return (
      <div className="ct-form__success" role="status">
        {t("success")}
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
            className="ct-form__select"
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
              className="ct-form__input"
            />
          </div>
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
            className="ct-form__input"
          />
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
            className="ct-form__input"
          />
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
            className="ct-form__textarea"
          />
        </div>
      </div>

      <div className="ct-form__captcha">
        <Turnstile siteKey={turnstileSiteKey} />
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
          disabled={isPending || !turnstileSiteKey}
        >
          {isPending ? t("submitting") : form.submit}
        </Button>
        {!turnstileSiteKey && (
          <p className="ct-form__help">{form.submitDisabledHelp}</p>
        )}
      </div>
      <p className="ct-form__sla">{t("slaHint")}</p>
      <p className="ct-form__privacy">{privacyNotice}</p>
    </form>
  );
}
