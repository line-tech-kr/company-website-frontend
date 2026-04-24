import { SectionHead } from "./SectionHead";
import type { HomeContent } from "@/lib/content/home";

type Props = { h: HomeContent };

export function Trust({ h }: Props) {
  const { trust } = h;
  return (
    <section className="ho-sec">
      <SectionHead kicker={trust.kicker} title={trust.title} />
      <div className="ho-trust">
        {trust.items.map((it) => (
          <div key={it} className="ho-trust__item">
            <span className="ho-trust__dot" />
            <span>{it}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
