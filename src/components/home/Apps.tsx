import { SectionHead } from "./SectionHead";
import type { HomeContent } from "@/lib/content/home";

type Props = { h: HomeContent };

export function Apps({ h }: Props) {
  const { apps } = h;
  return (
    <section className="ho-sec">
      <SectionHead kicker={apps.kicker} title={apps.title} />
      <div className="ho-apps">
        {apps.items.map((a, i) => (
          <div className="ho-apps__cell" key={a.n}>
            <div className="ho-apps__num">{String(i + 1).padStart(2, "0")}</div>
            <div className="ho-apps__n">{a.n}</div>
            <div className="ho-apps__k">{a.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
