import type { HomeContent } from "@/lib/content/home";
import "./Stats.css";

type Props = { h: HomeContent };

export function Stats({ h }: Props) {
  return (
    <ul className="ho-stats">
      {h.stats.map((s, i) => (
        <li className="ho-stats__cell" key={i}>
          <div className="ho-stats__k">{s.k}</div>
          <div className="ho-stats__l">{s.l}</div>
          <div className="ho-stats__s">{s.sub}</div>
        </li>
      ))}
    </ul>
  );
}
