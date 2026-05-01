import { Link } from "@/i18n/navigation";
import { SectionHead } from "../SectionHead";
import type { HomeContent } from "@/lib/content/home";
import "./Series.css";

type Props = { h: HomeContent };

export function Series({ h }: Props) {
  const { series } = h;
  return (
    <section className="ho-sec">
      <SectionHead
        kicker={series.kicker}
        title={series.title}
        sub={series.sub}
      />
      <div className="ho-series">
        {series.items.map((s) => (
          <Link
            key={s.code}
            href={s.href}
            className={`ho-series__card${s.highlight ? " is-highlight" : ""}`}
          >
            <div className="ho-series__top">
              <span className="ho-series__code">{s.code}</span>
              <span className="ho-series__count">{s.count}</span>
            </div>
            <h3 className="ho-series__name">{s.name}</h3>
            <p className="ho-series__desc">{s.desc}</p>
            <div className="ho-series__foot">
              <span className="ho-series__range">{s.range}</span>
              {s.feat && <span className="ho-series__feat">{s.feat}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
