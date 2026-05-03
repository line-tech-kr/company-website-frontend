/**
 * Line Tech — /company page content (single-scroller, four sections × 3 locales).
 *
 * Sections (rendered top-to-bottom on `/company`, side-nav uses anchor hrefs):
 *  - #greeting          institutional intro (no CEO photo / signature)
 *  - #history           1997.03 → 2020.06 timeline
 *  - #certifications    3 named certs + footnote (per IA decision in
 *                       docs/linetech-slice-2-plan.md, only 3 of 13 legacy
 *                       certs have recovered text labels)
 *  - #location          Daejeon HQ + (ZH only) Wuxi subsidiary
 *
 * Source notes:
 *  - History rows from docs/current-site-audit.md §7.
 *  - Address / contact from docs/current-site-audit.md §2.
 *  - Wuxi subsidiary surfaced on ZH only, matching footer convention.
 */
import type { Locale } from "./home";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CompanySectionId =
  | "greeting"
  | "history"
  | "certifications"
  | "location";

/** One row of the side-nav shared across all /company sub-routes. */
export type CompanyNavItem = {
  id: CompanySectionId;
  href: string;
  label: string;
};

export type CompanyGreetingFact = {
  /** The eye-grabbing value (e.g., "1997", "13"). */
  k: string;
  /** The qualifying label (e.g., "Founded", "Certifications"). */
  l: string;
};

export type CompanyGreeting = {
  kicker: string;
  title: string;
  /** Multi-paragraph body. Renderer joins with paragraph breaks. */
  paragraphs: string[];
  /** Heading shown above the fact sidebar. */
  factsHeading: string;
  /** 4 quick facts surfaced beside the paragraphs (year founded, first MFC,
   * R&D partner, cert count). */
  facts: CompanyGreetingFact[];
};

export type CompanyHistoryRow = {
  /** "1997.03"-style stamp; locale-independent formatting. */
  date: string;
  /** Event description. */
  event: string;
};

export type CompanyHistory = {
  kicker: string;
  title: string;
  sub: string;
  rows: CompanyHistoryRow[];
};

export type CompanyCert = {
  /** Stable slug for keys + future linking. */
  id: string;
  /** Short title (e.g., "ISO 9001"). */
  name: string;
  /** Issuing body / standard description. */
  issuer: string;
  /** Date obtained, "YYYY.MM" format. */
  date: string;
  /** One-line description of what the cert verifies. */
  blurb: string;
};

export type CompanyCertifications = {
  kicker: string;
  title: string;
  sub: string;
  /** The 3 named certs with full text. */
  named: CompanyCert[];
  /** Footnote acknowledging the additional 10 documents. */
  footnote: string;
};

export type CompanyMapLink = {
  label: string;
  href: string;
};

export type CompanyLocationOffice = {
  /** Heading: "Headquarters" / "Subsidiary". */
  heading: string;
  /** Company name as displayed (canonical Korean spelling on KO). */
  name: string;
  address: string;
  phone?: string;
  fax?: string;
  email?: string;
  mapLinks?: CompanyMapLink[];
};

export type CompanyLocationLabels = {
  address: string;
  phone: string;
  fax: string;
  email: string;
};

export type CompanyLocation = {
  kicker: string;
  title: string;
  sub: string;
  /** Row labels shared by every office card. */
  labels: CompanyLocationLabels;
  hq: CompanyLocationOffice;
  /** Wuxi subsidiary — only present on ZH. */
  subsidiary?: CompanyLocationOffice;
};

export type CompanyContent = {
  /** Side-nav items in display order. */
  nav: CompanyNavItem[];
  /** Section heading shown above the side-nav. */
  navHeading: string;
  greeting: CompanyGreeting;
  history: CompanyHistory;
  certifications: CompanyCertifications;
  location: CompanyLocation;
};

// ─── Shared (locale-independent) ────────────────────────────────────────────

/**
 * Timeline event keys → date stamps. The date format ("1997.03") is shared
 * across locales; only the event description is localized.
 */
const HISTORY_DATES = [
  "1997.03",
  "2000.01",
  "2003.03",
  "2006.06",
  "2015.09",
  "2016.01",
  "2016.12",
  "2017.08",
  "2018.03",
  "2019.03",
  "2019.11",
  "2020.06",
] as const;

// ─── Content ────────────────────────────────────────────────────────────────

export const LT_COMPANY: Record<Locale, CompanyContent> = {
  ko: {
    navHeading: "회사 안내",
    nav: [
      { id: "greeting", href: "#greeting", label: "인사말" },
      { id: "history", href: "#history", label: "발자취" },
      { id: "certifications", href: "#certifications", label: "인증" },
      { id: "location", href: "#location", label: "오시는 길" },
    ],
    greeting: {
      kicker: "01 — 인사말",
      title: "안녕하십니까, 라인테크입니다.",
      paragraphs: [
        "1997년 설립 이래 라인테크는 자체 기술로 질량유량 제어기와 측정기를 개발·생산하며, 정밀 측정이 필요한 산업 현장에서 25년 이상 신뢰를 쌓아 왔습니다.",
        "KAIST와의 공동연구를 기반으로 2003년 국내 최초로 MFC와 MFM 양산에 성공한 이후, 반도체·디스플레이·바이오·연료전지 공정 라인에서 표준이 되는 정밀 제어 솔루션을 공급해 왔습니다.",
        "검증된 기술과 확실한 사후 지원을 통해 고객의 공정에 신뢰성을 더하는 일, 그것이 라인테크가 지난 25년 동안 지켜 온 약속입니다.",
      ],
      factsHeading: "라인테크의 발자취",
      facts: [
        { k: "1997", l: "설립 연도" },
        { k: "2003", l: "국내 최초 MFC 양산" },
        { k: "KAIST", l: "공동 연구 파트너" },
        { k: "13종", l: "보유 인증" },
      ],
    },
    history: {
      kicker: "02 — 발자취",
      title: "1997년 설립 이래, 한 분야에 집중해 왔습니다.",
      sub: "설립 이후 주요 성과를 시간순으로 정리했습니다.",
      rows: [
        { date: HISTORY_DATES[0], event: "라인테크 설립" },
        { date: HISTORY_DATES[1], event: "KAIST 공동연구 시작" },
        {
          date: HISTORY_DATES[2],
          event: "국내 최초 MFC · MFM 모델 자체 개발",
        },
        {
          date: HISTORY_DATES[3],
          event: "첫 해외 수출 (중국 상하이)",
        },
        { date: HISTORY_DATES[4], event: "기업부설연구소 설립" },
        {
          date: HISTORY_DATES[5],
          event: "Read Out Unit (LTI 시리즈) 개발",
        },
        {
          date: HISTORY_DATES[6],
          event: "측정 범위 확대 — 150 · 500 · 1,000 · 2,500 SLPM",
        },
        { date: HISTORY_DATES[7], event: "CE · ISO 9001 인증 획득" },
        { date: HISTORY_DATES[8], event: "INNOBIZ 인증 획득" },
        {
          date: HISTORY_DATES[9],
          event: "측정 범위 확대 — 5,000 SLPM",
        },
        {
          date: HISTORY_DATES[10],
          event: "첫 해외 공인 대리점 계약 (인도)",
        },
        { date: HISTORY_DATES[11], event: "EX · LD · LM 시리즈 개발" },
      ],
    },
    certifications: {
      kicker: "03 — 인증",
      title: "검증된 품질 시스템.",
      sub: "주요 인증 3종을 명시합니다. 그 외 적합성 증빙 문서는 요청 시 제공해 드립니다.",
      named: [
        {
          id: "iso-9001",
          name: "ISO 9001",
          issuer: "국제표준화기구 (ISO)",
          date: "2017.08",
          blurb:
            "품질경영시스템 국제 표준. 설계부터 생산, 출하 후 지원까지 일관된 품질 절차를 검증합니다.",
        },
        {
          id: "ce",
          name: "CE",
          issuer: "EU 적합성 선언",
          date: "2017.08",
          blurb:
            "유럽 경제 지역 내 공급을 위한 안전·전자기 적합성 요구사항을 충족함을 선언합니다.",
        },
        {
          id: "innobiz",
          name: "INNOBIZ",
          issuer: "중소벤처기업부",
          date: "2018.03",
          blurb:
            "기술혁신형 중소기업으로 선정. 기술경쟁력과 미래 성장 가능성을 정부에서 인증받았습니다.",
        },
      ],
      footnote:
        "위 3종 외에도 라인테크의 품질 시스템 안에는 RoHS · REACH 등 10건의 적합성 증빙 문서가 운용되고 있으며, 필요 시 영업 담당자를 통해 사본을 제공해 드립니다.",
    },
    location: {
      kicker: "04 — 오시는 길",
      title: "대전 본사",
      sub: "대덕연구개발특구 안에 위치한 본사 및 생산 시설.",
      labels: {
        address: "주소",
        phone: "전화",
        fax: "팩스",
        email: "이메일",
      },
      hq: {
        heading: "본사 · 공장",
        name: "주식회사 라인테크",
        address: "대전광역시 유성구 대덕대로 806 (34055)",
        phone: "042-624-0700",
        fax: "042-638-2211",
        email: "linetech@line-tech.co.kr",
        mapLinks: [
          {
            label: "카카오맵",
            href: "https://map.kakao.com/link/search/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EB%8C%80%EB%8D%95%EB%8C%80%EB%A1%9C%20806",
          },
          {
            label: "네이버지도",
            href: "https://map.naver.com/v5/search/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EB%8C%80%EB%8D%95%EB%8C%80%EB%A1%9C%20806",
          },
          {
            label: "구글지도",
            href: "https://maps.google.com/maps?q=대전광역시+유성구+대덕대로+806",
          },
        ],
      },
    },
  },

  en: {
    navHeading: "About Line Tech",
    nav: [
      { id: "greeting", href: "#greeting", label: "Greeting" },
      { id: "history", href: "#history", label: "History" },
      {
        id: "certifications",
        href: "#certifications",
        label: "Certifications",
      },
      { id: "location", href: "#location", label: "Location" },
    ],
    greeting: {
      kicker: "01 — Greeting",
      title: "Welcome to Line Tech.",
      paragraphs: [
        "Since 1997, Line Tech has designed and built mass flow controllers and meters using technology developed in-house — earning the trust of process engineers for more than 25 years across industries that demand precision measurement.",
        "Through our R&D collaboration with KAIST, we became the first Korean manufacturer to mass-produce MFCs and MFMs in 2003. Our instruments have set a reliable measurement standard across semiconductor, display, biotech, and fuel-cell process lines ever since.",
        "Proven technology paired with attentive after-sales support — that has been our commitment for the last quarter-century, and it remains the standard we hold ourselves to with every customer.",
      ],
      factsHeading: "Line Tech in brief",
      facts: [
        { k: "1997", l: "Founded" },
        { k: "2003", l: "First Korean MFC produced" },
        { k: "KAIST", l: "R&D collaboration partner" },
        { k: "13", l: "Certifications held" },
      ],
    },
    history: {
      kicker: "02 — History",
      title: "One discipline, since 1997.",
      sub: "Milestones from the company's founding to the present.",
      rows: [
        { date: HISTORY_DATES[0], event: "Line Tech Inc. founded" },
        {
          date: HISTORY_DATES[1],
          event: "R&D collaboration with KAIST begins",
        },
        {
          date: HISTORY_DATES[2],
          event: "First MFC / MFM models developed (first in Korea)",
        },
        {
          date: HISTORY_DATES[3],
          event: "First international sale (Shanghai, China)",
        },
        { date: HISTORY_DATES[4], event: "Corporate R&D Center established" },
        {
          date: HISTORY_DATES[5],
          event: "Read Out Unit (LTI series) developed",
        },
        {
          date: HISTORY_DATES[6],
          event: "Capacity extended — 150 · 500 · 1,000 · 2,500 SLPM",
        },
        {
          date: HISTORY_DATES[7],
          event: "CE and ISO 9001 certifications obtained",
        },
        { date: HISTORY_DATES[8], event: "Certified as INNOBIZ" },
        { date: HISTORY_DATES[9], event: "Capacity extended — 5,000 SLPM" },
        {
          date: HISTORY_DATES[10],
          event: "First international licensed distributor (India)",
        },
        { date: HISTORY_DATES[11], event: "EX · LD · LM series developed" },
      ],
    },
    certifications: {
      kicker: "03 — Certifications",
      title: "A documented quality system.",
      sub: "Three core certifications are listed below. Additional conformity documents are available on request.",
      named: [
        {
          id: "iso-9001",
          name: "ISO 9001",
          issuer: "International Organization for Standardization",
          date: "2017.08",
          blurb:
            "International standard for quality management — covers design, production, and after-sales support under a single audited system.",
        },
        {
          id: "ce",
          name: "CE",
          issuer: "EU Declaration of Conformity",
          date: "2017.08",
          blurb:
            "Declares that our products meet the safety and electromagnetic-compatibility requirements for supply within the European Economic Area.",
        },
        {
          id: "innobiz",
          name: "INNOBIZ",
          issuer: "Korean Ministry of SMEs and Startups",
          date: "2018.03",
          blurb:
            "Government recognition awarded to technology-driven Korean SMEs with proven competitiveness and growth potential.",
        },
      ],
      footnote:
        "Beyond the three above, Line Tech maintains 10 additional conformity documents within its quality system — including RoHS and REACH declarations. Copies are provided on request through your sales contact.",
    },
    location: {
      kicker: "04 — Location",
      title: "Daejeon headquarters.",
      sub: "Headquarters and production located within the Daedeok Innopolis research cluster.",
      labels: {
        address: "Address",
        phone: "Phone",
        fax: "Fax",
        email: "Email",
      },
      hq: {
        heading: "Headquarters · Factory",
        name: "Line Tech Inc.",
        address: "806 Daedeok-daero, Yuseong-gu, Daejeon 34055, Korea",
        phone: "+82-42-624-0700",
        fax: "+82-42-638-2211",
        email: "linetech@line-tech.co.kr",
        mapLinks: [
          {
            label: "Kakao Maps",
            href: "https://map.kakao.com/link/search/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EB%8C%80%EB%8D%95%EB%8C%80%EB%A1%9C%20806",
          },
          {
            label: "Naver Maps",
            href: "https://map.naver.com/v5/search/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EB%8C%80%EB%8D%95%EB%8C%80%EB%A1%9C%20806",
          },
          {
            label: "Google Maps",
            href: "https://maps.google.com/maps?q=대전광역시+유성구+대덕대로+806",
          },
        ],
      },
    },
  },

  zh: {
    navHeading: "关于莱因",
    nav: [
      { id: "greeting", href: "#greeting", label: "问候语" },
      { id: "history", href: "#history", label: "发展历程" },
      {
        id: "certifications",
        href: "#certifications",
        label: "资质认证",
      },
      { id: "location", href: "#location", label: "联系地址" },
    ],
    greeting: {
      kicker: "01 — 问候语",
      title: "您好，欢迎了解莱因。",
      paragraphs: [
        "自 1997 年成立以来，莱因始终以自主技术为基础，专注于质量流量控制器与流量计的研发与制造，在对精度有严格要求的工艺现场积累了 25 年以上的信赖。",
        "通过与韩国科学技术院 (KAIST) 的联合研发，我们于 2003 年成为韩国首家量产 MFC 与 MFM 的厂商，此后在半导体、显示、生物制药与燃料电池工艺线上持续作为可靠的测量基准被采用。",
        "经过验证的技术，配合细致的售后支持 — 这是莱因 25 年来对每一位客户工艺始终如一的承诺。",
      ],
      factsHeading: "莱因关键数据",
      facts: [
        { k: "1997", l: "成立年份" },
        { k: "2003", l: "国内首款 MFC 量产" },
        { k: "KAIST", l: "联合研发伙伴" },
        { k: "13 项", l: "已获认证" },
      ],
    },
    history: {
      kicker: "02 — 发展历程",
      title: "自 1997 年起，专注一个领域。",
      sub: "公司创立至今的主要发展节点。",
      rows: [
        { date: HISTORY_DATES[0], event: "莱因公司成立" },
        {
          date: HISTORY_DATES[1],
          event: "与 KAIST 启动联合研发",
        },
        {
          date: HISTORY_DATES[2],
          event: "韩国首款 MFC · MFM 量产 (国内首家)",
        },
        {
          date: HISTORY_DATES[3],
          event: "首次海外销售 (中国上海)",
        },
        { date: HISTORY_DATES[4], event: "设立企业附设研究所" },
        {
          date: HISTORY_DATES[5],
          event: "开发 LTI 系列显示单元 (Read Out Unit)",
        },
        {
          date: HISTORY_DATES[6],
          event: "量程扩展至 150 · 500 · 1,000 · 2,500 SLPM",
        },
        {
          date: HISTORY_DATES[7],
          event: "获得 CE 与 ISO 9001 认证",
        },
        { date: HISTORY_DATES[8], event: "获得 INNOBIZ 认证" },
        { date: HISTORY_DATES[9], event: "量程扩展至 5,000 SLPM" },
        {
          date: HISTORY_DATES[10],
          event: "首家海外授权代理 (印度)",
        },
        { date: HISTORY_DATES[11], event: "开发 EX · LD · LM 系列" },
      ],
    },
    certifications: {
      kicker: "03 — 资质认证",
      title: "经过认证的质量体系。",
      sub: "以下列出三项核心资质。其余符合性证明文件可按需提供。",
      named: [
        {
          id: "iso-9001",
          name: "ISO 9001",
          issuer: "国际标准化组织 (ISO)",
          date: "2017.08",
          blurb:
            "国际通用的质量管理体系标准，覆盖设计、生产与售后服务的全流程审计。",
        },
        {
          id: "ce",
          name: "CE",
          issuer: "欧盟符合性声明",
          date: "2017.08",
          blurb: "声明产品符合在欧洲经济区销售所需的安全与电磁兼容要求。",
        },
        {
          id: "innobiz",
          name: "INNOBIZ",
          issuer: "韩国中小企业部",
          date: "2018.03",
          blurb:
            "韩国政府授予具备技术竞争力与成长潜力的技术创新型中小企业的资质。",
        },
      ],
      footnote:
        "除上述三项外，莱因质量体系内另维护包括 RoHS 与 REACH 在内的 10 份符合性证明文件，可通过销售对接人按需提供。",
    },
    location: {
      kicker: "04 — 联系地址",
      title: "大田总部",
      sub: "总部与生产基地位于大德研发特区内。",
      labels: {
        address: "地址",
        phone: "电话",
        fax: "传真",
        email: "邮箱",
      },
      hq: {
        heading: "总部 · 工厂",
        name: "株式会社莱因",
        address: "韩国大田广域市儒城区大德大路 806 号 (34055)",
        phone: "+82-42-624-0700",
        fax: "+82-42-638-2211",
        email: "linetech@line-tech.co.kr",
        mapLinks: [
          {
            label: "Kakao地图",
            href: "https://map.kakao.com/link/search/%EB%8C%80%EC%A0%84%EA%B4%91%EC%97%AD%EC%8B%9C%20%EC%9C%A0%EC%84%B1%EA%B5%AC%20%EB%8C%80%EB%8D%95%EB%8C%80%EB%A1%9C%20806",
          },
          {
            label: "谷歌地图",
            href: "https://maps.google.com/maps?q=대전광역시+유성구+대덕대로+806",
          },
        ],
      },
      subsidiary: {
        heading: "中国子公司",
        name: "莱因精密技术（无锡）有限公司",
        address: "江苏省无锡市锡山区锡沪东荟智企业中心 6 号楼 117 号",
        mapLinks: [
          {
            label: "高德地图",
            href: "https://uri.amap.com/search?keyword=江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号",
          },
          {
            label: "百度地图",
            href: "https://map.baidu.com/search/江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号",
          },
          {
            label: "谷歌地图",
            href: "https://maps.google.com/maps?q=江苏省无锡市锡山区锡沪东荟智企业中心6号楼117号",
          },
        ],
      },
    },
  },
};
