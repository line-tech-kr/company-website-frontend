import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { SectionHeader } from "../SectionHeader";
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
      <SectionHeader kicker={kicker} title={heading} sub={body} />
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
