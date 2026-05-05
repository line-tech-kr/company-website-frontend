import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LT_SHELL } from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { LogoLockup } from "../LogoLockup";
import "./Footer.css";

type Props = {
  locale: Locale;
};

function telHref(phone: string) {
  return `tel:${phone.replace(/[\s-]/g, "")}`;
}

export async function Footer({ locale }: Props) {
  const { contact, legal, subsidiary, links, rights } = LT_SHELL[locale].footer;
  const t = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="pd-foot">
      <div className="pd-foot__cols">
        <div className="pd-foot__brand">
          <LogoLockup height={28} />
          <span className="sr-only">Line Tech</span>
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

        {links ? (
          <div className="pd-foot__col">
            <h2 className="pd-foot__heading">{links.heading}</h2>
            <ul className="pd-foot__list">
              {links.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="pd-foot__nav-link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="pd-foot__base">
        <span>{rights}</span>
      </div>
    </footer>
  );
}
