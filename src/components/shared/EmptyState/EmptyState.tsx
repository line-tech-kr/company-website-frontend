import { Link } from "@/i18n/navigation";
import "./EmptyState.css";

type Props = {
  message: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function EmptyState({ message, ctaHref, ctaLabel }: Props) {
  return (
    <div className="lt-empty-state">
      <p className="lt-empty-state__msg">{message}</p>
      {ctaHref && ctaLabel && (
        <Link href={ctaHref} className="lt-empty-state__cta">
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
