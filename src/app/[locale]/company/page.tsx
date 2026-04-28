import { setRequestLocale, getTranslations } from "next-intl/server";
import { CompanyShell } from "@/components/company/CompanyShell";
import {
  LT_COMPANY,
  type CompanyContent,
  type CompanyLocationLabels,
  type CompanyLocationOffice,
} from "@/lib/content/company";
import type { Locale } from "@/lib/content/home";

type Props = { params: Promise<{ locale: Locale }> };

/** Founding, first-in-Korea MFC, and the two cert milestones get a filled
 * dot on the timeline. Everything else is a hollow tick. */
const MILESTONE_DATES = new Set(["1997.03", "2003.03", "2017.08", "2018.03"]);

export default async function CompanyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  const c = LT_COMPANY[locale];
  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("company") },
  ];

  return (
    <CompanyShell locale={locale} breadcrumbs={breadcrumbs}>
      <Greeting c={c} />
      <History c={c} />
      <Certifications c={c} />
      <Location c={c} />
    </CompanyShell>
  );
}

function Greeting({ c }: { c: CompanyContent }) {
  return (
    <section id="greeting" className="co-section">
      <header className="co-sechd">
        <div className="co-sechd__kicker">{c.greeting.kicker}</div>
        <h1 className="co-sechd__title">{c.greeting.title}</h1>
      </header>
      <div className="co-greeting__layout">
        <div className="co-greeting__body">
          {c.greeting.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <aside
          className="co-greeting__facts"
          aria-label={c.greeting.factsHeading}
        >
          <div className="co-greeting__factsHeading">
            {c.greeting.factsHeading}
          </div>
          <dl className="co-greeting__factList">
            {c.greeting.facts.map((fact) => (
              <div key={fact.k} className="co-greeting__fact">
                <dt className="co-greeting__factK">{fact.k}</dt>
                <dd className="co-greeting__factL">{fact.l}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function History({ c }: { c: CompanyContent }) {
  return (
    <section id="history" className="co-section">
      <header className="co-sechd">
        <div className="co-sechd__kicker">{c.history.kicker}</div>
        <h2 className="co-sechd__title">{c.history.title}</h2>
        <p className="co-sechd__sub">{c.history.sub}</p>
      </header>
      <ol className="co-timeline">
        {c.history.rows.map((row) => {
          const isMilestone = MILESTONE_DATES.has(row.date);
          return (
            <li
              key={row.date}
              className={
                "co-timeline__row" +
                (isMilestone ? " co-timeline__row--milestone" : "")
              }
            >
              <span className="co-timeline__date">{row.date}</span>
              <span className="co-timeline__event">{row.event}</span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Certifications({ c }: { c: CompanyContent }) {
  return (
    <section id="certifications" className="co-section">
      <header className="co-sechd">
        <div className="co-sechd__kicker">{c.certifications.kicker}</div>
        <h2 className="co-sechd__title">{c.certifications.title}</h2>
        <p className="co-sechd__sub">{c.certifications.sub}</p>
      </header>
      <ul className="co-certs">
        {c.certifications.named.map((cert) => (
          <li key={cert.id} className="co-cert">
            <div className="co-cert__head">
              <h3 className="co-cert__name">{cert.name}</h3>
              <span className="co-cert__date">{cert.date}</span>
            </div>
            <p className="co-cert__issuer">{cert.issuer}</p>
            <p className="co-cert__blurb">{cert.blurb}</p>
          </li>
        ))}
      </ul>
      <p className="co-certs__footnote">{c.certifications.footnote}</p>
    </section>
  );
}

function Location({ c }: { c: CompanyContent }) {
  return (
    <section id="location" className="co-section">
      <header className="co-sechd">
        <div className="co-sechd__kicker">{c.location.kicker}</div>
        <h2 className="co-sechd__title">{c.location.title}</h2>
        <p className="co-sechd__sub">{c.location.sub}</p>
      </header>
      <div className="co-locations">
        <OfficeCard office={c.location.hq} labels={c.location.labels} />
        {c.location.subsidiary && (
          <OfficeCard
            office={c.location.subsidiary}
            labels={c.location.labels}
          />
        )}
      </div>
    </section>
  );
}

type OfficeCardProps = {
  office: CompanyLocationOffice;
  labels: CompanyLocationLabels;
};

function OfficeCard({ office, labels }: OfficeCardProps) {
  return (
    <article className="co-office">
      <div className="co-office__heading">{office.heading}</div>
      <h3 className="co-office__name">{office.name}</h3>
      <dl className="co-office__rows">
        <dt className="co-office__label">{labels.address}</dt>
        <dd className="co-office__value">{office.address}</dd>
        {office.phone && (
          <>
            <dt className="co-office__label">{labels.phone}</dt>
            <dd className="co-office__value">
              <a href={`tel:${office.phone.replace(/\s+/g, "")}`}>
                {office.phone}
              </a>
            </dd>
          </>
        )}
        {office.fax && (
          <>
            <dt className="co-office__label">{labels.fax}</dt>
            <dd className="co-office__value">{office.fax}</dd>
          </>
        )}
        {office.email && (
          <>
            <dt className="co-office__label">{labels.email}</dt>
            <dd className="co-office__value">
              <a href={`mailto:${office.email}`}>{office.email}</a>
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
