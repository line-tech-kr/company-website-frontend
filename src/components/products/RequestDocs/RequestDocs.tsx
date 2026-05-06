import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import "./RequestDocs.css";

type Props = {
  kicker: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

export function RequestDocs({
  kicker,
  heading,
  body,
  ctaLabel,
  ctaHref,
}: Props) {
  return (
    <section id="downloads" className="lt-pdp-rd">
      <header className="lt-pdp-section-hd">
        <div>
          <div className="lt-pdp-section-hd__kicker">{kicker}</div>
          <h2 className="lt-pdp-section-hd__title">{heading}</h2>
          <p className="lt-pdp-section-hd__sub">{body}</p>
        </div>
      </header>
      <div className="lt-pdp-rd__cta">
        <Button
          variant="primary"
          size="lg"
          href={ctaHref}
          trailingGlyph={<Glyph name="arrow-right" size={14} />}
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
