import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import type { HomeContent } from "@/lib/content/home";
import { FeatureChip } from "./FeatureChip";
import "./Feature.css";

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
          href="/products/analogue/m3030va"
          trailingGlyph={<Glyph name="arrow-right" size={14} />}
        >
          {feature.cta}
        </Button>
      </div>
      <div>
        <FeatureChip />
      </div>
    </section>
  );
}
