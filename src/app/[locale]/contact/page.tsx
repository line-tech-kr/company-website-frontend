import { setRequestLocale, getTranslations } from "next-intl/server";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { LT_CONTACT } from "@/lib/content/contact";
import { LT_SHELL } from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { ContactForm } from "./ContactForm";
import "./contact-page.css";

type Props = { params: Promise<{ locale: Locale }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tCommon = await getTranslations("common");
  const c = LT_CONTACT[locale];
  const info = LT_SHELL[locale].footer.contact;
  const { form } = c;

  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: c.breadcrumbLabel },
  ];

  // Iframe stays Google (Naver doesn't allow keyless embeds). Using the
  // official Google Maps Embed URL (`pb=…`) generated via "Share → Embed
  // map" — stable across Google's UI changes, unlike the older `output=embed`
  // pattern. The deep link follows the visitor's natural map preference:
  // Naver for KR, Google for EN/ZH.
  const mapEmbedAddress = "806 Daedeok-daero, Yuseong-gu, Daejeon 34055, Korea";
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24056.780848582704!2d127.36912219355615!3d36.38991365710943!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35654a04e7c961ab%3A0xe91272f47a8f5e5!2sLine%20Tech!5e0!3m2!1sen!2sus!4v1777338643281!5m2!1sen!2sus";
  const mapOpenUrl =
    locale === "ko"
      ? `https://map.naver.com/p/search/${encodeURIComponent(
          "대전광역시 유성구 대덕대로 806",
        )}`
      : `https://maps.google.com/maps?q=${encodeURIComponent(mapEmbedAddress)}`;

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />

      <div className="ct">
        <header className="ct__header">
          <h1 className="ct__title">{c.title}</h1>
          <p className="ct__lede">{c.lede}</p>
        </header>

        <div className="ct__layout">
          <section className="ct-form" aria-labelledby="ct-form-heading">
            <h2 id="ct-form-heading" className="ct-form__heading">
              {form.heading}
            </h2>
            <p className="ct-form__notice" role="status">
              {form.notice}
            </p>

            <ContactForm form={form} privacyNotice={c.privacyNotice} />
          </section>

          <aside
            className="ct-info"
            aria-labelledby="ct-info-heading"
          >
            <h2 id="ct-info-heading" className="ct-info__heading">
              {c.infoHeading}
            </h2>
            <ul className="ct-info__list">
              <li className="ct-info__row">
                <span className="ct-info__label">{c.addressLabel}</span>
                <span className="ct-info__value">{info.address}</span>
              </li>
              <li className="ct-info__row">
                <span className="ct-info__label">{c.phoneLabel}</span>
                <span className="ct-info__value">
                  <a href={`tel:${info.phone.replace(/\s+/g, "")}`}>
                    {info.phone}
                  </a>
                </span>
              </li>
              {info.fax && (
                <li className="ct-info__row">
                  <span className="ct-info__label">{c.faxLabel}</span>
                  <span className="ct-info__value">{info.fax}</span>
                </li>
              )}
              <li className="ct-info__row">
                <span className="ct-info__label">{c.emailLabel}</span>
                <span className="ct-info__value">
                  <a href={`mailto:${info.email}`}>{info.email}</a>
                </span>
              </li>
              <li className="ct-info__row">
                <span className="ct-info__label">{c.hoursLabel}</span>
                <span className="ct-info__value">{c.hoursValue}</span>
              </li>
            </ul>
            <div className="ct-info__cta">
              <Button
                variant="ghost"
                size="md"
                href={`mailto:${info.email}`}
                plain
                fullWidth
              >
                {c.emailDirectCta}
              </Button>
            </div>
          </aside>
        </div>

        <section
          className="ct-dist"
          aria-labelledby="ct-dist-heading"
        >
          <header className="ct-dist__header">
            <h2 id="ct-dist-heading" className="ct-dist__heading">
              {c.distributors.heading}
            </h2>
            <p className="ct-dist__lede">{c.distributors.lede}</p>
          </header>
          <ul className="ct-dist__grid">
            {c.distributors.regions.map((region) => (
              <li key={region.id} className="ct-dist__card">
                <span className="ct-dist__region">{region.name}</span>
                <span className="ct-dist__status">{region.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="ct-map" aria-labelledby="ct-map-heading">
          <header className="ct-map__header">
            <h2 id="ct-map-heading" className="ct-map__heading">
              {c.map.heading}
            </h2>
            <p className="ct-map__caption">{c.map.caption}</p>
          </header>
          <div className="ct-map__frame">
            <iframe
              title={c.map.caption}
              src={mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            className="ct-map__open"
            href={mapOpenUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {c.map.openLabel} →
          </a>
        </section>
      </div>
    </main>
  );
}
