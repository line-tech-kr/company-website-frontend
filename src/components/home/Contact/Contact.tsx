import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import type { HomeContent } from "@/lib/content/home";
import "./Contact.css";

type Props = { h: HomeContent };

export function Contact({ h }: Props) {
  const { contact } = h;
  return (
    <section className="ho-contact">
      <div className="ho-contact__inner">
        <h2 className="ho-contact__title">{contact.title}</h2>
        <p className="ho-contact__sub">{contact.sub}</p>
        <div className="ho-contact__btns">
          <Button
            variant="primary"
            size="lg"
            href="mailto:linetech@line-tech.co.kr"
            plain
            icon={<Glyph name="phone" size={14} />}
          >
            {contact.primary}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href="mailto:linetech@line-tech.co.kr"
            plain
          >
            {contact.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
