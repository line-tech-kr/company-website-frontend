import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { LT_SHELL } from "@/lib/content/shell";
import type { HomeContent, Locale } from "@/lib/content/home";
import "./Contact.css";

type Props = { h: HomeContent; locale: Locale };

export function Contact({ h, locale }: Props) {
  const { contact } = h;
  const email = LT_SHELL[locale].footer.contact.email;
  return (
    <section className="ho-contact">
      <div className="ho-contact__inner">
        <h2 className="ho-contact__title">{contact.title}</h2>
        <p className="ho-contact__sub">{contact.sub}</p>
        <div className="ho-contact__btns">
          <Button
            variant="primary"
            size="lg"
            href={`mailto:${email}`}
            plain
            icon={<Glyph name="phone" size={14} />}
          >
            {contact.primary}
          </Button>
          <Button variant="ghost" size="lg" href={`mailto:${email}`} plain>
            {contact.secondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
