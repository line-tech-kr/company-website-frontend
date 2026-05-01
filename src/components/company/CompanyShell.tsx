import type { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_COMPANY } from "@/lib/content/company";
import type { Locale } from "@/lib/content/home";
import { CompanySideNav } from "./CompanySideNav";
import "./company-shell.css";

type Props = {
  locale: Locale;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
};

export function CompanyShell({ locale, breadcrumbs, children }: Props) {
  const c = LT_COMPANY[locale];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className="co">
        <CompanySideNav heading={c.navHeading} items={c.nav} />
        <div className="co-main">{children}</div>
      </div>
    </main>
  );
}
