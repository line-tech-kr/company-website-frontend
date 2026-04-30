import { setRequestLocale, getTranslations } from "next-intl/server";
import { AccessoriesShell } from "@/components/accessories/AccessoriesShell";
import {
  LT_ACCESSORIES,
  type AccessoriesContent,
  type AccessoryItem,
  type AccessorySection,
  type AccessoryContact,
} from "@/lib/content/accessories";
import type { Locale } from "@/lib/content/home";

type Props = { params: Promise<{ locale: Locale }> };

export default async function AccessoriesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [tCommon, tNav] = await Promise.all([
    getTranslations("common"),
    getTranslations("nav"),
  ]);

  const c = LT_ACCESSORIES[locale];
  const breadcrumbs = [
    { label: tCommon("home"), href: "/" },
    { label: tNav("products"), href: "/products" },
    { label: c.breadcrumbAccessories },
  ];

  return (
    <AccessoriesShell locale={locale} breadcrumbs={breadcrumbs}>
      <Hero c={c} />
      <ItemsSection
        id="readouts"
        section={c.readouts}
        kickerLabelClass="acc-sechd__kicker"
      />
      <ItemsSection
        id="pressure-accessories"
        section={c.pressure}
        kickerLabelClass="acc-sechd__kicker"
      />
      <ContactSection c={c.contact} />
    </AccessoriesShell>
  );
}

function Hero({ c }: { c: AccessoriesContent }) {
  return (
    <section className="acc-section">
      <div className="acc-sechd">
        <div className="acc-hero__kicker">{c.hero.kicker}</div>
        <h1 className="acc-hero__title">{c.hero.title}</h1>
        <p className="acc-hero__lede">{c.hero.lede}</p>
      </div>
    </section>
  );
}

function ItemsSection({
  id,
  section,
}: {
  id: string;
  section: AccessorySection;
  kickerLabelClass: string;
}) {
  return (
    <section id={id} className="acc-section">
      <header className="acc-sechd">
        <div className="acc-sechd__kicker">{section.kicker}</div>
        <h2 className="acc-sechd__title">{section.title}</h2>
        <p className="acc-sechd__sub">{section.sub}</p>
      </header>
      <div className="acc-items">
        {section.items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function ItemCard({ item }: { item: AccessoryItem }) {
  return (
    <article id={item.id} className="acc-item">
      <div
        className={
          "acc-item__media" +
          (item.image.placeholder ? " acc-item__media--placeholder" : "")
        }
      >
        <img src={item.image.src} alt={item.image.alt} loading="lazy" />
      </div>
      <div className="acc-item__body">
        <h3 className="acc-item__model">{item.model}</h3>
        <p className="acc-item__title">{item.title}</p>
        <p className="acc-item__blurb">{item.blurb}</p>

        <div className="acc-specs__heading">{item.specsHeading}</div>
        <table className="acc-specs">
          <tbody>
            {item.specs.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td>{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {item.integration && (
          <aside className="acc-integration">
            <div className="acc-integration__heading">
              {item.integration.heading}
            </div>
            <p className="acc-integration__body">{item.integration.body}</p>
          </aside>
        )}
      </div>
    </article>
  );
}

function ContactSection({ c }: { c: AccessoryContact }) {
  return (
    <section id="contact" className="acc-section">
      <header className="acc-sechd">
        <div className="acc-sechd__kicker">{c.kicker}</div>
        <h2 className="acc-sechd__title">{c.title}</h2>
      </header>
      <div className="acc-contact">
        <p className="acc-contact__body">{c.body}</p>
        <a className="acc-contact__cta" href={c.href}>
          {c.cta}
        </a>
      </div>
    </section>
  );
}
