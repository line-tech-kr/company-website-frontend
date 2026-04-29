import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { LT_SHELL } from "@/lib/content/shell";
import type { Locale } from "@/lib/content/home";
import { HeaderShell } from "./HeaderShell";
import { HeaderNav } from "./HeaderNav";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Logomark } from "./Logomark";
import { MegaMenu, MegaMenuScrim } from "./MegaMenu";
import { SearchTriggerButton } from "./SearchTriggerButton";
import { MobileNavTrigger } from "./MobileNavTrigger";
import "./Header.css";

type Props = { locale: Locale };

export function Header({ locale }: Props) {
  const shell = LT_SHELL[locale];

  return (
    <HeaderShell
      search={shell.search}
      mobileNav={shell.mobileNav}
      navItems={shell.nav}
      quoteLabel={shell.quoteLabel}
      locale={locale}
    >
      <div className="pd-top__inner">
        <Link href="/" className="pd-top__brand" aria-label="Line Tech">
          <span className="pd-top__logomark">
            <Logomark size={28} />
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
          <SearchTriggerButton label={shell.search.openLabel} />
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
          <MobileNavTrigger
            openLabel={shell.mobileNav.openLabel}
            closeLabel={shell.mobileNav.closeLabel}
          />
        </div>
      </div>
      <MegaMenu items={shell.nav} locale={locale} />
      <MegaMenuScrim />
    </HeaderShell>
  );
}
