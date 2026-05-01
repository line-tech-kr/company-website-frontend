import { getTranslations } from "next-intl/server";
import { LT_SHELL } from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { Logomark } from "../Logomark";
import "./Footer.css";

type Props = {
  locale: Locale;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[\s-]/g, "")}`;
}

export async function Footer({ locale }: Props) {
  const { signoff, contact, legal, subsidiary, rights } =
    LT_SHELL[locale].footer;
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="pd-foot">
      <div className="pd-foot__cols">
        <div className="pd-foot__brand">
          <span className="pd-foot__mark" aria-hidden="true">
            <Logomark size={20} />
          </span>
          <p className="pd-foot__sig">{signoff}</p>
        </div>

        <div className="pd-foot__col">
          <h2 className="pd-foot__heading">{contact.heading}</h2>
          <address className="pd-foot__addr">{contact.address}</address>
          <ul className="pd-foot__list">
            <li>
              <span className="pd-foot__label">{t("tel")}</span>
              <a href={telHref(contact.phone)}>{contact.phone}</a>
            </li>
            {contact.fax ? (
              <li>
                <span className="pd-foot__label">{t("fax")}</span>
                <span>{contact.fax}</span>
              </li>
            ) : null}
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>

        {legal ? (
          <div className="pd-foot__col">
            <h2 className="pd-foot__heading">{legal.heading}</h2>
            <ul className="pd-foot__list">
              <li>{legal.ceo}</li>
              <li>{legal.registration}</li>
            </ul>
          </div>
        ) : null}

        {subsidiary ? (
          <div className="pd-foot__col">
            <h2 className="pd-foot__heading">{subsidiary.heading}</h2>
            <p className="pd-foot__sub-name">{subsidiary.name}</p>
            <address className="pd-foot__addr">{subsidiary.address}</address>
          </div>
        ) : null}
      </div>

      <div className="pd-foot__base">
        <span>{rights}</span>
      </div>
    </footer>
  );
}
