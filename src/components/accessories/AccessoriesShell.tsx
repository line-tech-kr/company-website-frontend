import type { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/Breadcrumbs/Breadcrumbs";
import { LT_ACCESSORIES } from "@/lib/content/accessories";
import type { Locale } from "@/lib/content/home";
import { AccessoriesSideNav } from "./AccessoriesSideNav";
import "./accessories-shell.css";

type Props = {
  locale: Locale;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
};

export function AccessoriesShell({ locale, breadcrumbs, children }: Props) {
  const c = LT_ACCESSORIES[locale];

  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className="acc">
        <AccessoriesSideNav heading={c.navHeading} items={c.nav} />
        <div className="acc-main">{children}</div>
      </div>
    </main>
  );
}
