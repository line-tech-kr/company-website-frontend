import { getLocale, getTranslations } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { safeJsonLd } from "@/lib/seo/jsonLd";
import "./Breadcrumbs.css";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type Props = {
  items: BreadcrumbItem[];
};

function resolveSiteUrl(): string {
  const fromEnv = process.env.SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) {
    if (process.env.VERCEL_ENV === "production") {
      console.warn(
        "SITE_URL is not set on a Vercel production deploy; falling back to VERCEL_URL for breadcrumb JSON-LD. Set SITE_URL to the canonical domain.",
      );
    }
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export async function Breadcrumbs({ items }: Props) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("breadcrumbs"),
  ]);
  const siteUrl = resolveSiteUrl();
  const typedLocale = locale as (typeof routing.locales)[number];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href !== undefined && {
        item: `${siteUrl}${getPathname({ locale: typedLocale, href: item.href })}`,
      }),
    })),
  };

  return (
    <>
      <nav className="lt-breadcrumbs" aria-label={t("label")}>
        <ol className="lt-breadcrumbs__list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const className = `lt-breadcrumbs__item${
              isLast ? " lt-breadcrumbs__item--current" : ""
            }`;
            const content =
              item.href && !isLast ? (
                <Link className="lt-breadcrumbs__link" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                item.label
              );

            return (
              <li
                key={index}
                className={className}
                aria-current={isLast ? "page" : undefined}
              >
                {content}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
    </>
  );
}
