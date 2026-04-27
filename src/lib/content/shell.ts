/**
 * Line Tech — site shell content (header nav, mega-menus, footer).
 *
 * Conventions:
 *  - One typed object per locale, same shape as `LT_HOME` in `./home.ts`.
 *  - Products mega-menu reads `productsCategories` (4 function-based buckets
 *    per the locked taxonomy in `docs/linetech-slice-2-plan.md`), NOT the
 *    homepage's 4-series SKU visual. The two are intentionally decoupled.
 *  - `PRODUCTS_SERIES_HREFS` / `getProductsSeriesEntries()` exist solely to
 *    drive the homepage Series section as a secondary entry point.
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
  contact: {
    heading: string;
    address: string;
    phone: string;
    email: string;
    fax?: string;
  };
  /** Korean regulatory block — required on KO, omitted elsewhere. */
  legal?: {
    heading: string;
    ceo: string;
    registration: string;
  };
  /** Wuxi subsidiary callout — surfaced on ZH per legacy site. */
  subsidiary?: {
    heading: string;
    name: string;
    address: string;
  };
  rights: string;
  /** Version stamp; held on the type but not rendered today. */
  version: string;
};

/**
 * One of the 4 function-based product categories (Analogue MFC / Digital MFC /
 * MFM / Specialized). Drives the Products mega-menu and `/products/[category]`
 * routes. Slug is locale-independent; label/desc are localized.
 */
export type ProductsCategory = {
  /** Stable slug: "analogue-mfc" | "digital-mfc" | "mfm" | "specialized". */
  code: string;
  label: string;
  desc: string;
  href: string;
};

/**
 * Header search panel copy. Visual-shell only today (#8) — wiring lands
 * in phase 2. Quick chips are inert buttons and currently route nowhere;
 * they exist to telegraph that this is a real search surface.
 */
export type ShellSearch = {
  /** aria-label for the header search trigger icon button. */
  openLabel: string;
  /** Dialog accessible name (visually-hidden, exposed via aria-labelledby). */
  heading: string;
  /** aria-label for the search input (visually-hidden label). */
  inputLabel: string;
  /** Placeholder text shown inside the empty input. */
  inputPlaceholder: string;
  /** 4–6 inert chips. `id` is locale-independent for tracking later. */
  quickChips: { id: string; label: string }[];
};

export type ShellContent = {
  nav: ShellNavItem[];
  /** Top-right "Quote" button label in the header. Mailto target is shared. */
  quoteLabel: string;
  /** Function-based product categories — 4 entries, locked taxonomy. */
  productsCategories: ProductsCategory[];
  /** Header search panel copy (#8). */
  search: ShellSearch;
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
          kind: "resources",
          heading: "회사 안내",
          links: [
            { href: "/company", label: "인사말", desc: "CEO 메시지" },
            {
              href: "/company/history",
              label: "연혁",
              desc: "1997년부터 현재까지",
            },
            {
              href: "/company/certifications",
              label: "인증",
              desc: "ISO · CE · INNOBIZ 외",
            },
            {
              href: "/company/location",
              label: "오시는 길",
              desc: "대전 본사 위치",
            },
          ],
          featured: {
            eyebrow: "신뢰",
            title: "13종 인증",
            blurb: "ISO 9001 · CE · INNOBIZ · RoHS / REACH 외 9종.",
            href: "/company/certifications",
            cta: "전체 인증 보기",
          },
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
            {
              href: "/resources/catalogues",
              label: "카탈로그",
              desc: "제품군 별 PDF 카탈로그",
            },
            {
              href: "/resources/drawings",
              label: "도면",
              desc: "AutoCAD (.dwg · .stp)",
            },
            {
              href: "/resources/manuals",
              label: "매뉴얼",
              desc: "모델별 사용 설명서",
            },
            {
              href: "/resources/certifications",
              label: "인증서",
              desc: "13종 인증 문서",
            },
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
      },
    ],
    quoteLabel: "견적 요청",
    productsCategories: [
      {
        code: "analogue-mfc",
        label: "아날로그 MFC",
        desc: "M · MS 시리즈 아날로그 질량유량 제어기",
        href: "/products/analogue-mfc",
      },
      {
        code: "digital-mfc",
        label: "디지털 MFC",
        desc: "RS-485 통신 기반 MD 시리즈",
        href: "/products/digital-mfc",
      },
      {
        code: "mfm",
        label: "MFM (질량유량계)",
        desc: "전 시리즈 질량유량계 라인업",
        href: "/products/mfm",
      },
      {
        code: "specialized",
        label: "특수 사양",
        desc: "방폭 · 디스플레이 일체형 · 저가형 MEMS",
        href: "/products/specialized",
      },
    ],
    search: {
      openLabel: "검색 열기",
      heading: "사이트 검색",
      inputLabel: "제품, 자료, 모델명을 검색",
      inputPlaceholder: "예: M3030VA, 카탈로그, 디지털 MFC",
      quickChips: [
        { id: "m3030va", label: "M3030VA" },
        { id: "digital-mfc", label: "디지털 MFC" },
        { id: "catalogue", label: "카탈로그 PDF" },
        { id: "calibration", label: "교정" },
        { id: "certifications", label: "인증서" },
      ],
    },
    footer: {
      signoff: "정밀 질량유량 솔루션",
      contact: {
        heading: "문의",
        address: "대전광역시 유성구 대덕대로 806 (34055)",
        phone: "042-624-0700",
        fax: "042-638-2211",
        email: "linetech@line-tech.co.kr",
      },
      legal: {
        heading: "법인 정보",
        ceo: "대표자 배정이",
        registration: "사업자등록번호 314-86-55562",
      },
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
          kind: "resources",
          heading: "About Line Tech",
          links: [
            {
              href: "/company",
              label: "Greeting",
              desc: "Message from the CEO",
            },
            {
              href: "/company/history",
              label: "History",
              desc: "From 1997 to today",
            },
            {
              href: "/company/certifications",
              label: "Certifications",
              desc: "ISO · CE · INNOBIZ and more",
            },
            {
              href: "/company/location",
              label: "Location",
              desc: "Daejeon headquarters",
            },
          ],
          featured: {
            eyebrow: "Trust",
            title: "13 certifications",
            blurb:
              "ISO 9001, CE, INNOBIZ, RoHS / REACH and 9 more — the full set procurement teams ask for.",
            href: "/company/certifications",
            cta: "View all certifications",
          },
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
            blurb:
              "Digital piezo-actuated MFC for semiconductor and display process lines.",
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
            {
              href: "/resources/catalogues",
              label: "Catalogues",
              desc: "Series-level PDF catalogues",
            },
            {
              href: "/resources/drawings",
              label: "CAD drawings",
              desc: "AutoCAD (.dwg · .stp)",
            },
            {
              href: "/resources/manuals",
              label: "Manuals",
              desc: "Per-model user guides",
            },
            {
              href: "/resources/certifications",
              label: "Certifications",
              desc: "13 certification documents",
            },
          ],
          featured: {
            eyebrow: "Spotlight",
            title: "M3030VA manual + catalogue",
            blurb:
              "Full specs and Modbus protocol for our flagship digital MFC.",
            href: "/products/m3030va",
            cta: "Open M3030VA",
          },
        },
      },
      {
        id: "contact",
        href: "/contact",
        label: "Contact",
      },
    ],
    quoteLabel: "Quote",
    productsCategories: [
      {
        code: "analogue-mfc",
        label: "Analogue MFC",
        desc: "M / MS series — proven analogue controllers",
        href: "/products/analogue-mfc",
      },
      {
        code: "digital-mfc",
        label: "Digital MFC",
        desc: "MD series with RS-485 communications",
        href: "/products/digital-mfc",
      },
      {
        code: "mfm",
        label: "MFM (Mass Flow Meters)",
        desc: "Flow meters across every series",
        href: "/products/mfm",
      },
      {
        code: "specialized",
        label: "Specialized",
        desc: "Explosion-proof, integrated display, low-cost MEMS",
        href: "/products/specialized",
      },
    ],
    search: {
      openLabel: "Open search",
      heading: "Search the site",
      inputLabel: "Search products, resources, models",
      inputPlaceholder: "Try M3030VA, catalogue, digital MFC",
      quickChips: [
        { id: "m3030va", label: "M3030VA" },
        { id: "digital-mfc", label: "Digital MFC" },
        { id: "catalogue", label: "Catalogue PDF" },
        { id: "calibration", label: "Calibration" },
        { id: "certifications", label: "Certifications" },
      ],
    },
    footer: {
      signoff: "Mass Flow Solutions",
      contact: {
        heading: "Contact",
        address: "806 Daedeok-daero, Yuseong-gu, Daejeon 34055, Korea",
        phone: "+82 42-624-0700",
        fax: "+82 42-638-2211",
        email: "linetech@line-tech.co.kr",
      },
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
          kind: "resources",
          heading: "关于莱因",
          links: [
            { href: "/company", label: "问候语", desc: "CEO 致辞" },
            {
              href: "/company/history",
              label: "发展历程",
              desc: "自 1997 年至今",
            },
            {
              href: "/company/certifications",
              label: "资质认证",
              desc: "ISO · CE · INNOBIZ 等",
            },
            {
              href: "/company/location",
              label: "联系地址",
              desc: "大田总部位置",
            },
          ],
          featured: {
            eyebrow: "信赖",
            title: "13 项资质认证",
            blurb: "ISO 9001 · CE · INNOBIZ · RoHS / REACH 等 13 项认证文件。",
            href: "/company/certifications",
            cta: "查看全部认证",
          },
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
            {
              href: "/resources/catalogues",
              label: "产品样册",
              desc: "系列 PDF 样册",
            },
            {
              href: "/resources/drawings",
              label: "CAD 图纸",
              desc: "AutoCAD (.dwg · .stp)",
            },
            {
              href: "/resources/manuals",
              label: "使用手册",
              desc: "按型号分类的说明书",
            },
            {
              href: "/resources/certifications",
              label: "认证文件",
              desc: "13 份认证文件",
            },
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
      },
    ],
    quoteLabel: "申请报价",
    productsCategories: [
      {
        code: "analogue-mfc",
        label: "模拟 MFC",
        desc: "M · MS 系列模拟质量流量控制器",
        href: "/products/analogue-mfc",
      },
      {
        code: "digital-mfc",
        label: "数字 MFC",
        desc: "MD 系列，RS-485 通讯",
        href: "/products/digital-mfc",
      },
      {
        code: "mfm",
        label: "MFM (质量流量计)",
        desc: "全系列质量流量计产品",
        href: "/products/mfm",
      },
      {
        code: "specialized",
        label: "特殊型号",
        desc: "防爆 · 集成显示 · 低成本 MEMS",
        href: "/products/specialized",
      },
    ],
    search: {
      openLabel: "打开搜索",
      heading: "站内搜索",
      inputLabel: "搜索产品、资料、型号",
      inputPlaceholder: "如：M3030VA、产品样册、数字 MFC",
      quickChips: [
        { id: "m3030va", label: "M3030VA" },
        { id: "digital-mfc", label: "数字 MFC" },
        { id: "catalogue", label: "产品样册 PDF" },
        { id: "calibration", label: "校准" },
        { id: "certifications", label: "认证文件" },
      ],
    },
    footer: {
      signoff: "精密质量流量解决方案",
      contact: {
        heading: "联系方式",
        address: "韩国大田广域市儒城区大德大路 806 号 (34055)",
        phone: "+82 42-624-0700",
        fax: "+82 42-638-2211",
        email: "linetech@line-tech.co.kr",
      },
      subsidiary: {
        heading: "中国子公司",
        name: "莱因精密技术（无锡）有限公司",
        address: "江苏省无锡市锡山区锡沪东荟智企业中心 6 号楼 117 号",
      },
      rights: "© 2026 株式会社莱因。保留所有权利。",
      version: SHELL_VERSION,
    },
  },
};

/**
 * Helper: products mega-menu category list for a locale. The 4-way function
 * taxonomy (Analogue MFC / Digital MFC / MFM / Specialized) — primary entry
 * point used by Header (#6) / MegaMenu (#7) / category pages (#9).
 */
export function getProductsCategories(locale: Locale): ProductsCategory[] {
  return LT_SHELL[locale].productsCategories;
}

/**
 * Helper: homepage Series section entries (4 SKU-coded cards). Secondary
 * entry point — kept for the design's homepage visual only. Mega-menu and
 * category routing use `getProductsCategories()` instead.
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
