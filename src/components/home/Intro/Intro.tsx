import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Glyph } from "@/components/ui/Glyph";
import type { HomeContent } from "@/lib/content/home";
import { IntroVisual } from "./IntroVisual";
import "./Intro.css";

type Props = { h: HomeContent };

export function Intro({ h }: Props) {
  return (
    <section className="ho-intro">
      <div className="ho-intro__left">
        <div className="ho-intro__kicker">
          <span>{h.intro.kicker}</span>
        </div>
        <h1 className="ho-intro__title">
          <span>{h.intro.title1}</span>
          <span className="ho-intro__title--em">{h.intro.title2}</span>
        </h1>
        <p className="ho-intro__lede">{h.intro.lede}</p>
        <div className="ho-intro__ctas">
          <Button
            variant="primary"
            size="lg"
            href="/products/analogue/m3030va"
            trailingGlyph={<Glyph name="arrow-right" size={14} />}
          >
            {h.intro.ctaPrimary}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href="/catalog.pdf"
            plain
            icon={<Glyph name="download" size={14} />}
          >
            {h.intro.ctaSecondary}
          </Button>
        </div>
        <Chip tone="neutral" dot>
          {h.intro.badge}
        </Chip>
      </div>
      <IntroVisual />
    </section>
  );
}
