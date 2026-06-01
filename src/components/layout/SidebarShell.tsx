import type { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/Breadcrumbs/Breadcrumbs";

type Props = {
  breadcrumbs: BreadcrumbItem[];
  sideNav: ReactNode;
  wrapperClassName: string;
  mainClassName: string;
  children: ReactNode;
};

export function SidebarShell({
  breadcrumbs,
  sideNav,
  wrapperClassName,
  mainClassName,
  children,
}: Props) {
  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className={wrapperClassName}>
        {sideNav}
        <div className={mainClassName}>{children}</div>
      </div>
    </main>
  );
}
