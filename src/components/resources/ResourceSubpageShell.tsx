import type { ReactNode } from "react";
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/Breadcrumbs/Breadcrumbs";

type Props = {
  title: string;
  intro: string;
  breadcrumbs: BreadcrumbItem[];
  children: ReactNode;
};

export function ResourceSubpageShell({
  title,
  intro,
  breadcrumbs,
  children,
}: Props) {
  return (
    <main className="lt-wrap dr-sub">
      <Breadcrumbs items={breadcrumbs} />
      <header className="dr-sub__hero">
        <h1 className="dr-sub__title">{title}</h1>
        <p className="dr-sub__intro">{intro}</p>
      </header>
      {children}
    </main>
  );
}
