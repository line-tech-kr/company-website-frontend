import { SectionHead } from "../SectionHead";
import type { HomeContent } from "@/lib/content/home";
import "./Applications.css";

type Props = { h: HomeContent };

export function Applications({ h }: Props) {
  const { applications } = h;
  return (
    <section className="ho-sec">
      <SectionHead kicker={applications.kicker} title={applications.title} />
      <ul className="ho-applications">
        {applications.items.map((a, i) => (
          <li className="ho-applications__cell" key={a.n}>
            <div className="ho-applications__num">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="ho-applications__n">{a.n}</div>
            <div className="ho-applications__k">{a.k}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}
