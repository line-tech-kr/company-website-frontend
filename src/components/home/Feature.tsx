import { Button } from "@/components/lt/Button";
import { Glyph } from "@/components/lt/Glyph";
import type { HomeContent } from "@/lib/content/home";

type Props = { h: HomeContent };

export function Feature({ h }: Props) {
  const { feature } = h;
  return (
    <section className="ho-sec ho-feature">
      <div>
        <div className="ho-feature__kicker">{feature.kicker}</div>
        <h2 className="ho-feature__title">{feature.title}</h2>
        <p className="ho-feature__sub">{feature.sub}</p>
        <dl className="ho-feature__bullets">
          {feature.bullets.map((b) => (
            <div key={b.k} className="ho-feature__bullet">
              <dt>{b.k}</dt>
              <dd>{b.v}</dd>
            </div>
          ))}
        </dl>
        <Button
          variant="primary"
          size="md"
          href="/products/analogue-mfc/m3030va"
          trailingGlyph={<Glyph name="arrow-right" size={14} />}
        >
          {feature.cta}
        </Button>
      </div>
      <div>
        <div className="ho-feature__chip">
          <div className="ho-feature__chip-tl">M3030VA</div>
          <div className="ho-feature__chip-tr">REV.7</div>
          <div className="ho-feature__chip-body">
            <div className="ho-feature__lbl">PLACEHOLDER · PRODUCT</div>
          </div>
          <div className="ho-feature__chip-bl">LINE TECH</div>
          <div className="ho-feature__chip-br">N₂ · 20 SLM</div>
        </div>
      </div>
    </section>
  );
}
