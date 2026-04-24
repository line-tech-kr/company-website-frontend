import { Button } from "@/components/lt/Button";
import { Glyph } from "@/components/lt/Glyph";
import type { HomeContent } from "@/lib/content/home";

type Props = { h: HomeContent };

export function Cta({ h }: Props) {
  const { cta } = h;
  return (
    <section className="ho-cta">
      <div className="ho-cta__inner">
        <h2 className="ho-cta__title">{cta.title}</h2>
        <p className="ho-cta__sub">{cta.sub}</p>
        <div className="ho-cta__btns">
          <Button
            variant="primary"
            size="lg"
            href="mailto:linetech@line-tech.co.kr"
            plain
            icon={<Glyph name="phone" size={14} />}
          >
            {cta.primary}
          </Button>
          <Button variant="ghost" size="lg" href="mailto:linetech@line-tech.co.kr" plain>
            {cta.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
