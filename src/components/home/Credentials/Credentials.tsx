import { SectionHead } from "../SectionHead";
import type { HomeContent } from "@/lib/content/home";
import "./Credentials.css";

type Props = { h: HomeContent };

export function Credentials({ h }: Props) {
  const { credentials } = h;
  return (
    <section className="ho-sec">
      <SectionHead kicker={credentials.kicker} title={credentials.title} />
      <ul className="ho-credentials">
        {credentials.items.map((it) => (
          <li key={it} className="ho-credentials__item">
            <span className="ho-credentials__dot" aria-hidden="true" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
