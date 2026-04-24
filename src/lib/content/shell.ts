/**
 * Line Tech — site shell content (header nav, mega-menus, footer).
 *
 * Conventions:
 *  - One typed object per locale, same shape as `LT_HOME` in `./home.ts`.
 *  - Products mega-menu is **derived** from `LT_HOME[locale].series.items` — we
 *    don't duplicate series copy here. We only supply per-series `href`s keyed
 *    by series `code` (see `PRODUCTS_SERIES_HREFS` below).
 *  - Consumed by: Header (#6), Footer (#4), MegaMenu (#7). Keep labels here,
 *    layout decisions in the components.
 */
import { LT_HOME } from "./home";
import type { Locale } from "./home";

// ─── Types ──────────────────────────────────────────────────────────────────

/** Simple nav item — label is per-locale so consumers pick by locale key. */
export type ShellNavItem = {
  /** Stable key, used for React keys + hash links. */
  id: string;
  /** Route, may be a slug stub until Header PR wires the full tree. */
  href: string;
  label: string;
  /** If present, this item opens a mega-menu panel. */
  menu?: ShellMegaMenu;
};

/** A 2-column simple link list, e.g. Company / Contact. */
export type ShellMegaMenuSimple = {
  kind: "simple";
  /** Section heading inside the panel. */
  heading: string;
  links: { href: string; label: string; desc?: string }[];
};

/** Products panel: rendered from LT_HOME series + our href map + optional featured card. */
export type ShellMegaMenuProducts = {
  kind: "products";
  heading: string;
  /** "View all products" style tail link. */
  allHref: string;
  allLabel: string;
  /** Featured card (drives the M3030VA spotlight in the Products panel). */
  featured: ShellFeaturedCard;
};

/** Resources panel: link list + featured card. */
export type ShellMegaMenuResources = {
  kind: "resources";
  heading: string;
  links: { href: string; label: string; desc?: string }[];
  featured: ShellFeaturedCard;
};

export type ShellMegaMenu =
  | ShellMegaMenuSimple
  | ShellMegaMenuProducts
  | ShellMegaMenuResources;

export type ShellFeaturedCard = {
  eyebrow: string;
  title: string;
  blurb: string;
  href: string;
  cta: string;
};

export type ShellFooter = {
  signoff: string;
  address: string;
  rights: string;
  /** Version stamp rendered small in the footer margin. */
  version: string;
};

export type ShellContent = {
  nav: ShellNavItem[];
  footer: ShellFooter;
};

// ─── Shared (locale-independent) ────────────────────────────────────────────

/**
 * Per-series href map keyed by series `code` as defined in `LT_HOME.series.items`.
 *
 * NOTE: routes for category pages are TBD. These slugs are placeholders —
 * Header PR (#6) will wire them to real routes once `src/app/[locale]/products/[category]/`
 * lands. The Header component should tolerate 404s gracefully until then.
 */
const PRODUCTS_SERIES_HREFS: Record<string, string> = {
  "M / MS": "/products/analogue-mfc",
  MD: "/products/digital-mfc",
  "LD / LM": "/products/specialized",
  LTI: "/products/readouts",
};

/** Resolve href for a series by its code; falls back to the category index. */
export function seriesHref(code: string): string {
  return PRODUCTS_SERIES_HREFS[code] ?? "/products";
}

/** Version stamp for the footer. Bump when shell content changes materially. */
const SHELL_VERSION = "v0.2";

// ─── Content ────────────────────────────────────────────────────────────────

export const LT_SHELL: Record<Locale, ShellContent> = {
  ko: {
    nav: [
      {
        id: "company",
        href: "/company",
        label: "회사소개",
        menu: {
          kind: "simple",
          heading: "회사 안내",
          links: [
            { href: "/company", label: "인사말", desc: "CEO 메시지" },
            { href: "/company/history", label: "연혁", desc: "1997년부터 현재까지" },
            { href: "/company/certifications", label: "인증", desc: "ISO · CE · INNOBIZ 외" },
            { href: "/company/location", label: "오시는 길", desc: "대전 본사 위치" },
          ],
        },
      },
      {
        id: "products",
        href: "/products",
        label: "제품",
        menu: {
          kind: "products",
          heading: "제품 시리즈",
          allHref: "/products",
          allLabel: "전체 제품 보기",
          featured: {
            eyebrow: "대표 모델",
            title: "M3030VA",
            blurb: "반도체·디스플레이 공정을 위한 디지털 압전식 MFC.",
            href: "/products/m3030va",
            cta: "상세 보기",
          },
        },
      },
      {
        id: "resources",
        href: "/resources",
        label: "자료실",
        menu: {
          kind: "resources",
          heading: "자료실",
          links: [
            { href: "/resources/catalogues", label: "카탈로그", desc: "제품군 별 PDF 카탈로그" },
            { href: "/resources/drawings", label: "도면", desc: "AutoCAD (.dwg · .stp)" },
            { href: "/resources/manuals", label: "매뉴얼", desc: "모델별 사용 설명서" },
            { href: "/resources/certifications", label: "인증서", desc: "13종 인증 문서" },
          ],
          featured: {
            eyebrow: "주목할 자료",
            title: "M3030VA 매뉴얼 · 카탈로그",
            blurb: "대표 모델의 전체 규격과 통신 프로토콜을 한 문서로.",
            href: "/products/m3030va",
            cta: "M3030VA 자료",
          },
        },
      },
      {
        id: "contact",
        href: "/contact",
        label: "문의",
        menu: {
          kind: "simple",
          heading: "문의 방법",
          links: [
            { href: "/contact", label: "견적 요청", desc: "공정 조건을 알려주세요" },
            { href: "/contact#support", label: "기술 문의", desc: "적합 모델 추천" },
            { href: "mailto:linetech@line-tech.co.kr", label: "이메일", desc: "linetech@line-tech.co.kr" },
            { href: "tel:+82426240700", label: "전화", desc: "042-624-0700" },
          ],
        },
      },
    ],
    footer: {
      signoff: "1997년부터 정밀 질량유량 제어를 만들어 온 라인텍입니다.",
      address: "(34055) 대전광역시 유성구 대덕대로 806 · TEL 042-624-0700",
      rights: "© 2026 주식회사 라인텍. All rights reserved.",
      version: SHELL_VERSION,
    },
  },

  en: {
    nav: [
      {
        id: "company",
        href: "/company",
        label: "Company",
        menu: {
          kind: "simple",
          heading: "About Line Tech",
          links: [
            { href: "/company", label: "Greeting", desc: "Message from the CEO" },
            { href: "/company/history", label: "History", desc: "From 1997 to today" },
            { href: "/company/certifications", label: "Certifications", desc: "ISO · CE · INNOBIZ and more" },
            { href: "/company/location", label: "Location", desc: "Daejeon headquarters" },
          ],
        },
      },
      {
        id: "products",
        href: "/products",
        label: "Products",
        menu: {
          kind: "products",
          heading: "Product series",
          allHref: "/products",
          allLabel: "See all products",
          featured: {
            eyebrow: "Featured model",
            title: "M3030VA",
            blurb: "Digital piezo-actuated MFC for semiconductor and display process lines.",
            href: "/products/m3030va",
            cta: "View product",
          },
        },
      },
      {
        id: "resources",
        href: "/resources",
        label: "Data Room",
        menu: {
          kind: "resources",
          heading: "Resources",
          links: [
            { href: "/resources/catalogues", label: "Catalogues", desc: "Series-level PDF catalogues" },
            { href: "/resources/drawings", label: "CAD drawings", desc: "AutoCAD (.dwg · .stp)" },
            { href: "/resources/manuals", label: "Manuals", desc: "Per-model user guides" },
            { href: "/resources/certifications", label: "Certifications", desc: "13 certification documents" },
          ],
          featured: {
            eyebrow: "Spotlight",
            title: "M3030VA manual + catalogue",
            blurb: "Full specs and Modbus protocol for our flagship digital MFC.",
            href: "/products/m3030va",
            cta: "Open M3030VA",
          },
        },
      },
      {
        id: "contact",
        href: "/contact",
        label: "Contact",
        menu: {
          kind: "simple",
          heading: "Get in touch",
          links: [
            { href: "/contact", label: "Request quote", desc: "Share your process conditions" },
            { href: "/contact#support", label: "Technical inquiry", desc: "Model recommendations" },
            { href: "mailto:linetech@line-tech.co.kr", label: "Email", desc: "linetech@line-tech.co.kr" },
            { href: "tel:+82426240700", label: "Phone", desc: "+82 42-624-0700" },
          ],
        },
      },
    ],
    footer: {
      signoff: "Building precision mass-flow control since 1997.",
      address: "806 Daedeok-daero, Yuseong-gu, Daejeon 34055, Korea · TEL +82 42-624-0700",
      rights: "© 2026 Line Tech Inc. All rights reserved.",
      version: SHELL_VERSION,
    },
  },

  zh: {
    nav: [
      {
        id: "company",
        href: "/company",
        label: "公司介绍",
        menu: {
          kind: "simple",
          heading: "关于莱因",
          links: [
            { href: "/company", label: "问候语", desc: "CEO 致辞" },
            { href: "/company/history", label: "发展历程", desc: "自 1997 年至今" },
            { href: "/company/certifications", label: "资质认证", desc: "ISO · CE · INNOBIZ 等" },
            { href: "/company/location", label: "联系地址", desc: "大田总部位置" },
          ],
        },
      },
      {
        id: "products",
        href: "/products",
        label: "产品",
        menu: {
          kind: "products",
          heading: "产品系列",
          allHref: "/products",
          allLabel: "查看全部产品",
          featured: {
            eyebrow: "重点型号",
            title: "M3030VA",
            blurb: "用于半导体与显示工艺的数字压电式质量流量控制器。",
            href: "/products/m3030va",
            cta: "查看详情",
          },
        },
      },
      {
        id: "resources",
        href: "/resources",
        label: "资料室",
        menu: {
          kind: "resources",
          heading: "技术资料",
          links: [
            { href: "/resources/catalogues", label: "产品样册", desc: "系列 PDF 样册" },
            { href: "/resources/drawings", label: "CAD 图纸", desc: "AutoCAD (.dwg · .stp)" },
            { href: "/resources/manuals", label: "使用手册", desc: "按型号分类的说明书" },
            { href: "/resources/certifications", label: "认证文件", desc: "13 份认证文件" },
          ],
          featured: {
            eyebrow: "推荐资料",
            title: "M3030VA 手册 · 样册",
            blurb: "旗舰数字 MFC 的完整规格与 Modbus 协议说明。",
            href: "/products/m3030va",
            cta: "打开 M3030VA",
          },
        },
      },
      {
        id: "contact",
        href: "/contact",
        label: "联系",
        menu: {
          kind: "simple",
          heading: "联系我们",
          links: [
            { href: "/contact", label: "申请报价", desc: "告知您的工艺条件" },
            { href: "/contact#support", label: "技术咨询", desc: "型号推荐" },
            { href: "mailto:linetech@line-tech.co.kr", label: "邮箱", desc: "linetech@line-tech.co.kr" },
            { href: "tel:+82426240700", label: "电话", desc: "+82 42-624-0700" },
          ],
        },
      },
    ],
    footer: {
      signoff: "自 1997 年起专注于精密质量流量控制。",
      address: "韩国大田广域市儒城区大德大路 806 号 (34055) · TEL +82 42-624-0700",
      rights: "© 2026 株式会社莱因。保留所有权利。",
      version: SHELL_VERSION,
    },
  },
};

/**
 * Helper: resolve the Products mega-menu series list for a locale by joining
 * `LT_HOME[locale].series.items` (copy) with `PRODUCTS_SERIES_HREFS` (routes).
 *
 * Keeps series copy single-sourced in `home.ts`. Header/MegaMenu components
 * should call this rather than duplicating the series list.
 */
export function getProductsSeriesEntries(locale: Locale) {
  return LT_HOME[locale].series.items.map((item) => ({
    code: item.code,
    name: item.name,
    desc: item.desc,
    count: item.count,
    range: item.range,
    highlight: item.highlight ?? false,
    feat: item.feat,
    href: seriesHref(item.code),
  }));
}
