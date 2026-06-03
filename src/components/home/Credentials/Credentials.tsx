import { Link } from "@/i18n/navigation";
import { SectionHead } from "../SectionHead";
import type { HomeContent } from "@/lib/content/home";
import { CredentialIcon } from "./CredentialIcon";
import "./Credentials.css";

type Props = { h: HomeContent };

export function Credentials({ h }: Props) {
  const { credentials } = h;
  return (
    <section className="ho-sec">
      <SectionHead
        kicker={credentials.kicker}
        title={credentials.title}
        sub={credentials.sub}
      />
      <ul className="ho-credentials">
        {credentials.items.map((it) => {
          const inner = (
            <>
              <CredentialIcon category={it.category} />
              <div className="ho-credentials__text">
                <span className="ho-credentials__name">{it.name}</span>
                <span className="ho-credentials__scope">{it.scope}</span>
              </div>
            </>
          );
          return (
            <li key={it.name} className="ho-credentials__item">
              {it.slug ? (
                <Link
                  href={`/resources/certifications#${it.slug}`}
                  className="ho-credentials__card ho-credentials__card--link"
                >
                  {inner}
                </Link>
              ) : (
                <div className="ho-credentials__card">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="ho-credentials__cta">
        <Link href="/resources/certifications" className="ho-credentials__link">
          {credentials.viewAll}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
