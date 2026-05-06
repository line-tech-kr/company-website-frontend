import type { Metadata } from "next";
import type { Locale } from "@/lib/content/home";
import type { CategorySlug } from "@/lib/categories";
import type { Product } from "@/lib/types/product";
import { routing } from "@/i18n/routing";

function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  if (process.env.NODE_ENV === "development") return "http://localhost:3000";
  return "https://line-tech.co";
}

export const siteUrl = resolveSiteUrl();

const SITE_NAME = "Line Tech";

const LOCALE_OG_MAP: Record<Locale, string> = {
  ko: "ko_KR",
  en: "en_US",
  zh: "zh_CN",
};

type PageSeo = { title: string; description: string };

const HOME_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "라인테크 — 매스플로우 컨트롤러·미터 전문 제조",
    description:
      "1997년 설립, 반도체·연료전지·바이오 공정용 매스플로우 컨트롤러(MFC)와 미터(MFM)를 설계·제조하는 대전 소재 전문 제조사.",
  },
  en: {
    title: "Line Tech — MFC & MFM Specialists",
    description:
      "Korean manufacturer of Mass Flow Controllers and Mass Flow Meters for semiconductor, fuel cell, and biotech processes. Est. 1997, Daejeon.",
  },
  zh: {
    title: "Line Tech — 质量流量控制器与流量计专业制造商",
    description:
      "韩国大田质量流量控制器（MFC）与流量计（MFM）专业制造商，服务半导体、燃料电池及生物技术领域。成立于1997年。",
  },
};

const COMPANY_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "회사 소개 — 라인테크",
    description:
      "1997년 창립의 정밀 유량 제어 전문 기업, 라인테크. 창립 연혁부터 국내외 인증, 핵심 기술까지 한눈에 확인하세요.",
  },
  en: {
    title: "About Us — Line Tech",
    description:
      "Precision flow control specialists since 1997. Learn about Line Tech's history, certifications, and manufacturing capabilities.",
  },
  zh: {
    title: "关于我们 — Line Tech",
    description:
      "成立于1997年的精密流量控制专业企业。了解莱因科技的发展历程、资质认证及制造能力。",
  },
};

const PRODUCTS_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "제품 — 라인테크",
    description:
      "아날로그·디지털 매스플로우 컨트롤러(MFC) 및 미터(MFM) 전 제품군. 표준 모델부터 특수 사양까지 모든 라인테크 제품을 살펴보세요.",
  },
  en: {
    title: "Products — Line Tech",
    description:
      "Full range of analogue and digital Mass Flow Controllers (MFC) and Mass Flow Meters (MFM). Standard to specialized — browse all Line Tech series.",
  },
  zh: {
    title: "产品 — Line Tech",
    description:
      "全系列模拟与数字质量流量控制器（MFC）及流量计（MFM）。从标准型到特殊规格，浏览莱因科技全部产品系列。",
  },
};

const ACCESSORIES_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "액세서리 — 라인테크",
    description:
      "매스플로우 컨트롤러용 전원 공급 장치, 표시기, 통신 케이블 등 라인테크 정품 액세서리.",
  },
  en: {
    title: "Accessories — Line Tech",
    description:
      "Genuine Line Tech accessories for Mass Flow Controllers — power supplies, displays, and communication cables.",
  },
  zh: {
    title: "配件 — Line Tech",
    description:
      "莱因科技原装配件，适用于质量流量控制器——电源、显示器及通信电缆。",
  },
};

const CATEGORY_SEO: Record<CategorySlug, Record<Locale, PageSeo>> = {
  analogue: {
    ko: {
      title: "아날로그 MFC·MFM — 라인테크",
      description:
        "반도체·연료전지 공정용 아날로그 매스플로우 컨트롤러(MFC)·미터(MFM). 0~500 sccm부터 대유량까지, 안정적인 대량 생산 라인에 최적화된 라인테크 M·MS 시리즈.",
    },
    en: {
      title: "Analogue MFC & MFM — Line Tech",
      description:
        "Analogue Mass Flow Controllers and Meters for semiconductor and fuel cell processes. Line Tech M·MS series — from 0–500 sccm to high-flow production lines.",
    },
    zh: {
      title: "模拟MFC与MFM — Line Tech",
      description:
        "适用于半导体及燃料电池工艺的模拟质量流量控制器与流量计。莱因科技M·MS系列，覆盖0~500 sccm至大流量生产线。",
    },
  },
  digital: {
    ko: {
      title: "디지털 MFC·MFM — 라인테크",
      description:
        "RS-485 통신 지원 디지털 매스플로우 컨트롤러(MFC)·미터(MFM). 정밀 제어·데이터 로깅이 필요한 반도체·연구용 공정에 최적화된 라인테크 MD 시리즈.",
    },
    en: {
      title: "Digital MFC & MFM — Line Tech",
      description:
        "RS-485 digital Mass Flow Controllers and Meters for semiconductor and research applications. Line Tech MD series — precision control with data logging.",
    },
    zh: {
      title: "数字MFC与MFM — Line Tech",
      description:
        "支持RS-485通信的数字质量流量控制器与流量计。莱因科技MD系列，专为半导体与研究领域精密控制及数据记录优化。",
    },
  },
  specialized: {
    ko: {
      title: "특수 사양 MFC·MFM — 라인테크",
      description:
        "고압·저유량·부식성 가스 등 극한 환경을 위한 매스플로우 컨트롤러(MFC)·미터(MFM). 맞춤형 사양 설계가 가능한 라인테크 LD·LM 시리즈.",
    },
    en: {
      title: "Specialized MFC & MFM — Line Tech",
      description:
        "Mass Flow Controllers and Meters for extreme conditions — high pressure, low flow, corrosive gases. Custom-spec Line Tech LD·LM series.",
    },
    zh: {
      title: "特殊规格MFC与MFM — Line Tech",
      description:
        "适用于高压、低流量、腐蚀性气体等极端环境的质量流量控制器与流量计。莱因科技LD·LM系列，支持定制化规格设计。",
    },
  },
};

const SERIES_APPLICATION: Record<Product["series"], Record<Locale, string>> = {
  analogue: {
    ko: "반도체·연료전지 공정에 적합",
    en: "suited for semiconductor and fuel cell processes",
    zh: "适用于半导体及燃料电池工艺",
  },
  digital: {
    ko: "반도체·연구용 정밀 공정에 적합",
    en: "suited for semiconductor and precision research processes",
    zh: "适用于半导体与精密研究工艺",
  },
  specialized: {
    ko: "고압·부식성 가스 특수 공정에 적합",
    en: "suited for high-pressure and corrosive gas processes",
    zh: "适用于高压及腐蚀性气体特殊工艺",
  },
};

function buildLanguages(path: string): Record<string, string> {
  return Object.fromEntries(
    routing.locales.map((locale) => [
      locale,
      path ? `${siteUrl}/${locale}/${path}` : `${siteUrl}/${locale}`,
    ]),
  );
}

function buildBase(locale: Locale, page: PageSeo, path: string): Metadata {
  const canonical = path
    ? `${siteUrl}/${locale}/${path}`
    : `${siteUrl}/${locale}`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: {
      canonical,
      languages: buildLanguages(path),
    },
    openGraph: {
      type: "website",
      locale: LOCALE_OG_MAP[locale],
      title: page.title,
      description: page.description,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
    },
    robots: { index: true, follow: true },
  };
}

export function buildHomeMetadata(locale: Locale): Metadata {
  return buildBase(locale, HOME_SEO[locale], "");
}

export function buildCompanyMetadata(locale: Locale): Metadata {
  return buildBase(locale, COMPANY_SEO[locale], "company");
}

export function buildProductsMetadata(locale: Locale): Metadata {
  return buildBase(locale, PRODUCTS_SEO[locale], "products");
}

export function buildAccessoriesMetadata(locale: Locale): Metadata {
  return buildBase(locale, ACCESSORIES_SEO[locale], "products/accessories");
}

export function buildCategoryMetadata(
  locale: Locale,
  category: CategorySlug,
): Metadata {
  return buildBase(
    locale,
    CATEGORY_SEO[category][locale],
    `products/${category}`,
  );
}

export function buildProductMetadata(
  locale: Locale,
  product: Pick<
    Product,
    "model" | "slug" | "function" | "productLabel" | "series" | "massFlowSpecs"
  >,
  category: CategorySlug,
): Metadata {
  const label = product.productLabel[locale];
  const fn = product.function;
  const flowRange = product.massFlowSpecs.flowRange.display;
  const accuracy = product.massFlowSpecs.accuracy.display;
  const application = SERIES_APPLICATION[product.series][locale];

  const titles: Record<Locale, string> = {
    ko: `${product.model} ${fn} — 라인테크`,
    en: `${product.model} ${fn} — Line Tech`,
    zh: `${product.model} ${fn} — Line Tech`,
  };

  const descriptions: Record<Locale, string> = {
    ko: `라인테크 ${product.model} ${label} — 유량 ${flowRange}, 정확도 ${accuracy}. ${application}.`,
    en: `Line Tech ${product.model} ${label} — flow range ${flowRange}, accuracy ${accuracy}. ${application}.`,
    zh: `莱因科技 ${product.model} ${label} — 流量范围 ${flowRange}，精度 ${accuracy}。${application}。`,
  };

  const page: PageSeo = {
    title: titles[locale],
    description: descriptions[locale],
  };

  return buildBase(
    locale,
    page,
    `products/${category}/${product.slug.current}`,
  );
}

const CONTACT_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "문의하기 — 라인테크",
    description:
      "제품 문의부터 기술 지원, 협력 제안까지 — 영업일 기준 2일 이내에 회신드립니다.",
  },
  en: {
    title: "Get in touch — Line Tech",
    description:
      "Product questions, technical support, partnership ideas — whatever brings you here, we'll reply within two business days.",
  },
  zh: {
    title: "联系我们 — Line Tech",
    description:
      "无论是产品咨询、技术支持，还是合作洽谈 — 我们都会在两个工作日内回复您。",
  },
};

export function buildContactMetadata(locale: Locale): Metadata {
  return buildBase(locale, CONTACT_SEO[locale], "contact");
}

const APPLICATIONS_SEO: Record<Locale, PageSeo> = {
  ko: {
    title: "응용 분야 — 라인테크",
    description:
      "라인테크 MFC·MFM은 정밀하고 신뢰할 수 있는 가스 유량 측정 및 제어가 필요한 다양한 산업 현장에서 사용되고 있습니다.",
  },
  en: {
    title: "Applications — Line Tech",
    description:
      "Line Tech MFCs and MFMs are deployed across a broad range of industries that require precise, reliable gas flow measurement and control.",
  },
  zh: {
    title: "应用领域 — Line Tech",
    description:
      "莱因 MFC 与 MFM 广泛应用于需要精确、可靠气体流量测量与控制的各类工业场合。",
  },
};

export function buildApplicationsMetadata(locale: Locale): Metadata {
  return buildBase(locale, APPLICATIONS_SEO[locale], "applications");
}

export function buildApplicationDetailMetadata(
  locale: Locale,
  slug: string,
  appTitle: string,
  appLede: string,
): Metadata {
  const brand = locale === "ko" ? "라인테크" : "Line Tech";
  return buildBase(
    locale,
    { title: `${appTitle} — ${brand}`, description: appLede },
    `applications/${slug}`,
  );
}

type ResourceSection =
  | "hub"
  | "catalogues"
  | "drawings"
  | "manuals"
  | "certifications";

const RESOURCES_SEO: Record<ResourceSection, Record<Locale, PageSeo>> = {
  hub: {
    ko: {
      title: "자료실 — 라인테크",
      description:
        "라인테크의 카탈로그, 도면, 매뉴얼 및 인증 서류를 다운로드하실 수 있습니다.",
    },
    en: {
      title: "Data Room — Line Tech",
      description:
        "Download Line Tech catalogues, CAD drawings, user manuals, and certification documents.",
    },
    zh: {
      title: "资料室 — Line Tech",
      description: "下载莱因技术的产品样册、CAD 图纸、使用手册及认证文件。",
    },
  },
  catalogues: {
    ko: {
      title: "카탈로그 — 라인테크",
      description: "시리즈별 제품 브로슈어를 PDF로 제공합니다.",
    },
    en: {
      title: "Catalogues — Line Tech",
      description: "Series-level product brochures in PDF format.",
    },
    zh: {
      title: "产品样册 — Line Tech",
      description: "提供各系列产品的 PDF 格式宣传册。",
    },
  },
  drawings: {
    ko: {
      title: "CAD 도면 — 라인테크",
      description:
        "모델별 외형 도면을 AutoCAD (.dwg) 및 STEP (.stp) 형식으로 제공합니다.",
    },
    en: {
      title: "CAD Drawings — Line Tech",
      description:
        "Outline drawings for each model in AutoCAD (.dwg) and STEP (.stp) formats.",
    },
    zh: {
      title: "CAD 图纸 — Line Tech",
      description:
        "提供各型号外形图，支持 AutoCAD (.dwg) 和 STEP (.stp) 格式下载。",
    },
  },
  manuals: {
    ko: {
      title: "매뉴얼 — 라인테크",
      description: "각 제품 모델의 사용자 가이드 및 설치 매뉴얼입니다.",
    },
    en: {
      title: "Manuals — Line Tech",
      description:
        "User guides and installation manuals for each product model.",
    },
    zh: {
      title: "使用手册 — Line Tech",
      description: "各产品型号的用户指南与安装手册。",
    },
  },
  certifications: {
    ko: {
      title: "인증서 — 라인테크",
      description: "라인테크가 보유한 품질경영 및 제품 적합성 인증서입니다.",
    },
    en: {
      title: "Certifications — Line Tech",
      description:
        "Quality management and product conformity certificates held by Line Tech.",
    },
    zh: {
      title: "认证文件 — Line Tech",
      description: "莱因技术持有的质量管理及产品合规认证证书。",
    },
  },
};

const RESOURCES_PATHS: Record<ResourceSection, string> = {
  hub: "resources",
  catalogues: "resources/catalogues",
  drawings: "resources/drawings",
  manuals: "resources/manuals",
  certifications: "resources/certifications",
};

export function buildResourcesMetadata(
  locale: Locale,
  section: ResourceSection,
): Metadata {
  return buildBase(
    locale,
    RESOURCES_SEO[section][locale],
    RESOURCES_PATHS[section],
  );
}
