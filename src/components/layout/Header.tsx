import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { LT_SHELL } from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { HeaderShell } from "./HeaderShell";
import { HeaderNav } from "./HeaderNav";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logomark } from "./Logomark";
import { MegaMenu, MegaMenuScrim } from "./MegaMenu";
import "./Header.css";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const shell = LT_SHELL[locale];

  return (
    <HeaderShell>
      <div className="pd-top__inner">
        <Link href="/" className="pd-top__brand" aria-label="Line Tech">
          <span className="pd-top__logomark">
            <Logomark />
          </span>
          <span className="pd-top__wordmark">
            LINE
            <span className="pd-top__wordmark-dot" aria-hidden="true">
              ·
            </span>
            TECH
          </span>
        </Link>

        <HeaderNav items={shell.nav} />

        <div className="pd-top__right">
          {/* TODO(#8): wire to SearchPanel via HeaderNavContext */}
          <button type="button" className="pd-top__iconbtn" aria-label="Search">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11l3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <span className="pd-top__divider" aria-hidden="true" />
          <LocaleSwitcher />
          <Button
            variant="primary"
            size="md"
            href="mailto:linetech@line-tech.co.kr"
            plain
          >
            {shell.quoteLabel}
          </Button>
        </div>
      </div>
      <MegaMenu items={shell.nav} locale={locale} />
      <MegaMenuScrim />
    </HeaderShell>
  );
}
