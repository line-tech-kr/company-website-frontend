import type { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/Breadcrumbs/Breadcrumbs";

export type SidebarShellVariant = "accessories" | "company";

const VARIANT_CLASSES: Record<
  SidebarShellVariant,
  { wrapper: string; main: string }
> = {
  accessories: { wrapper: "acc", main: "acc-main" },
  company: { wrapper: "co", main: "co-main" },
};

type Props = {
  breadcrumbs: BreadcrumbItem[];
  sideNav: ReactNode;
  variant: SidebarShellVariant;
  children: ReactNode;
};

export function SidebarShell({
  breadcrumbs,
  sideNav,
  variant,
  children,
}: Props) {
  const cls = VARIANT_CLASSES[variant];
  return (
    <main className="lt-wrap">
      <Breadcrumbs items={breadcrumbs} />
      <div className={cls.wrapper}>
        {sideNav}
        <div className={cls.main}>{children}</div>
      </div>
    </main>
  );
}
