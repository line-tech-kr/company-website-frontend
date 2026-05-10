import type { Locale } from "@/i18n/routing";

export type { Locale };

type SeriesItem = {
  code: string;
  name: string;
  desc: string;
  count: string;
  range: string;
  href: string;
  highlight?: boolean;
  feat?: string;
};

type ApplicationItem = { n: string; k: string; slug: string };
type Stat = { k: string; l: string; sub: string };
type FeatureBulletLabels = {
  flow: string;
  accuracy: string;
  response: string;
  io: string;
};
type FeatureSlide = { model: string; sub: string };

export type HomeContent = {
  intro: {
    kicker: string;
    title1: string;
    title2: string;
    lede: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badge: string;
  };
  stats: Stat[];
  series: { kicker: string; title: string; sub: string; items: SeriesItem[] };
  applications: {
    kicker: string;
    title: string;
    sub: string;
    items: ApplicationItem[];
  };
  feature: {
    kicker: string;
    cta: string;
    bulletLabels: FeatureBulletLabels;
    slides: FeatureSlide[];
  };
  credentials: {
    kicker: string;
    title: string;
    sub: string;
    items: { name: string; scope: string }[];
    viewAll: string;
  };
  contact: { title: string; sub: string; primary: string; secondary: string };
};

export const LT_HOME: Record<Locale, HomeContent> = {
  ko: {
    intro: {
      kicker: "1997년 설립 · 질량유량 측정 솔루션",
      title1: "신뢰할 수 있는 기술과",
      title2: "확실한 애프터서비스.",
      lede: "한국 최초의 자체 생산 MFC·MFM 제조사. 반도체, 디스플레이, 바이오, 연료전지 공정 현장에서 25년 이상 검증된 정밀 질량유량 제어.",
      ctaPrimary: "맞춤 제품 찾기",
      ctaSecondary: "전체 제품 보기",
      badge: "KAIST 공동연구 기반 · 국내 최초",
    },
    stats: [
      { k: "1997", l: "설립 연도", sub: "대전광역시 유성구" },
      { k: "2003", l: "국내 최초 자체 MFC 양산", sub: "M-Series" },
      { k: "0.01–5000", l: "SLPM 측정 범위", sub: "전 시리즈 합산" },
      { k: "±0.25%", l: "반복 정밀도", sub: "전 제품 공통" },
    ],
    series: {
      kicker: "01 — 제품 시리즈",
      title: "네 가지 계열, 하나의 기준",
      sub: "공정 조건, 예산, 가스 종류에 따라 선택 가능한 풀 라인업.",
      items: [
        {
          code: "M / MS",
          name: "아날로그 시리즈",
          desc: "가장 오래 검증된 기본 라인업. 0~5 VDC / 4~20 mA 신호.",
          count: "18 모델",
          range: "0.01 – 5,000 SLPM",
          href: "/products/analogue",
          highlight: true,
          feat: "★ M3030VA",
        },
        {
          code: "MD",
          name: "디지털 시리즈",
          desc: "8-포인트 보정, ±0.25 % 정확도. 응답 0.5–1 초.",
          count: "14 모델",
          range: "0.01 – 5,000 SLPM",
          href: "/products/digital",
        },
        {
          code: "EX / LEPC",
          name: "특수 시리즈",
          desc: "방폭 사양과 저압 환경 정밀 제어 등 특수 요건에 대응.",
          count: "5 모델",
          range: "0.01 – 1,000 SLPM",
          href: "/products/specialized",
        },
        {
          code: "LTI",
          name: "부속품",
          desc: "표시기 · 고압 유량 제어기 · 압력 충격 보호기.",
          count: "5 모델",
          range: "전 모델 공통",
          href: "/products/accessories",
        },
      ],
    },
    applications: {
      kicker: "02 — 적용 분야",
      title: "어디서나, 정확하게",
      sub: "반도체부터 바이오까지, 정밀이 요구되는 모든 현장.",
      items: [
        { n: "반도체 · 디스플레이", k: "Semiconductor", slug: "semiconductor" },
        { n: "연료전지", k: "Fuel Cells", slug: "fuel-cells" },
        { n: "LED · 광섬유", k: "LED · Fiber Optics", slug: "led-lighting" },
        {
          n: "바이오 · 제약",
          k: "Biotech · Pharma",
          slug: "biotech-pharmaceutical",
        },
        { n: "화학 · 석유화학", k: "Chemical", slug: "chemical-petrochemical" },
        { n: "태양광 · PV", k: "Photovoltaic", slug: "solar-photovoltaic" },
        { n: "금속 가공", k: "Metals", slug: "metals-processing" },
        { n: "R&D · 연구소", k: "R&D · Labs", slug: "research-development" },
      ],
    },
    feature: {
      kicker: "03 — 핵심 모델",
      cta: "{model} 살펴보기",
      bulletLabels: {
        flow: "유량",
        accuracy: "정확도",
        response: "응답",
        io: "통신",
      },
      slides: [
        {
          model: "M3030VA",
          sub: "반도체·디스플레이 공정용 아날로그 질량유량제어기, 0.01–30 slpm.",
        },
        {
          model: "MD800C",
          sub: "디지털 8점 보정 방식의 대유량 질량유량제어기, 2500–5000 slpm.",
        },
        {
          model: "EX1000C",
          sub: "위험 지역용 방폭 질량유량제어기, 70–1000 slpm.",
        },
      ],
    },
    credentials: {
      kicker: "04 — 인증",
      title: "검증된 국제 인증",
      sub: "ISO 9001, CE 인증을 포함한 국제 기준을 충족합니다.",
      items: [
        { name: "ISO 9001", scope: "품질경영시스템" },
        { name: "CE", scope: "EU 안전·전자파 적합성" },
        { name: "INNOBIZ 인증", scope: "기술혁신형 중소기업" },
        { name: "RoHS / REACH", scope: "유해물질·화학물질 규제 적합" },
        { name: "KAIST 공동 R&D", scope: "산학 협력" },
      ],
      viewAll: "전체 인증 보기",
    },
    contact: {
      title: "도입 검토 중이십니까?",
      sub: "공정 조건과 가스 종류를 알려주시면\n2영업일 내 견적과 적합 모델을 회신해 드립니다.",
      primary: "기술 문의",
      secondary: "견적 요청",
    },
  },

  en: {
    intro: {
      kicker: "Since 1997 · Mass Flow Solutions",
      title1: "Reliable technology,",
      title2: "trusted service.",
      lede: "Korea's first mass flow controller manufacturer — trusted across semiconductor, display, fuel cell, and biotech process lines for over 25 years.",
      ctaPrimary: "Find your controller",
      ctaSecondary: "Browse all products",
      badge: "ISO 9001 · CE · RoHS",
    },
    stats: [
      { k: "1997", l: "Founded", sub: "Daejeon, Korea" },
      { k: "2003", l: "First MFC made in Korea", sub: "M-Series" },
      { k: "0.01–5000", l: "slpm flow range", sub: "across all series" },
      { k: "±0.25 %", l: "Repeatability", sub: "across all models" },
    ],
    series: {
      kicker: "01 — Product series",
      title: "Four series, one standard.",
      sub: "A full catalog spanning analog, digital, specialized, and accessories.",
      items: [
        {
          code: "M / MS",
          name: "Analogue Series",
          desc: "The longest-running line. 0–5 VDC / 4–20 mA signal.",
          count: "18 models",
          range: "0.01 – 5,000 slpm",
          href: "/products/analogue",
          highlight: true,
          feat: "★ M3030VA",
        },
        {
          code: "MD",
          name: "Digital Series",
          desc: "8-point calibration, ±0.25 % accuracy, 0.5–1 s response.",
          count: "14 models",
          range: "0.01 – 5,000 slpm",
          href: "/products/digital",
        },
        {
          code: "EX / LEPC",
          name: "Specialized Series",
          desc: "Explosion-proof and low-pressure precision control for specialized environments.",
          count: "5 models",
          range: "0.01 – 1,000 slpm",
          href: "/products/specialized",
        },
        {
          code: "LTI",
          name: "Accessories",
          desc: "Panel readouts, high-pressure regulators, shock protectors.",
          count: "5 models",
          range: "all lines",
          href: "/products/accessories",
        },
      ],
    },
    applications: {
      kicker: "02 — Applications",
      title: "Anywhere. Precisely.",
      sub: "From semiconductors to biotech — wherever the process demands it.",
      items: [
        { n: "Semiconductor", k: "Wafer fab gas", slug: "semiconductor" },
        { n: "Fuel Cells", k: "Stack feed gas", slug: "fuel-cells" },
        {
          n: "LED · Fiber Optics",
          k: "Deposition control",
          slug: "led-lighting",
        },
        {
          n: "Biotech · Pharma",
          k: "Bioreactor gas",
          slug: "biotech-pharmaceutical",
        },
        { n: "Chemical", k: "Reactor feed", slug: "chemical-petrochemical" },
        { n: "Photovoltaic", k: "Cell deposition", slug: "solar-photovoltaic" },
        { n: "Metals", k: "Furnace atmospheres", slug: "metals-processing" },
        {
          n: "R&D · Labs",
          k: "Bench gas dosing",
          slug: "research-development",
        },
      ],
    },
    feature: {
      kicker: "03 — Featured model",
      cta: "Explore {model}",
      bulletLabels: {
        flow: "Flow",
        accuracy: "Accuracy",
        response: "Response",
        io: "I/O",
      },
      slides: [
        {
          model: "M3030VA",
          sub: "Analogue mass flow controller for semiconductor and display process lines, 0.01–30 slpm.",
        },
        {
          model: "MD800C",
          sub: "Digital high-flow mass flow controller with 8-point calibration, 2500–5000 slpm.",
        },
        {
          model: "EX1000C",
          sub: "Explosion-proof mass flow controller for hazardous-environment applications, 70–1000 slpm.",
        },
      ],
    },
    credentials: {
      kicker: "04 — Certifications",
      title: "International certifications.",
      sub: "Certified to international quality, safety, and compliance standards.",
      items: [
        { name: "ISO 9001", scope: "Quality management system" },
        { name: "CE", scope: "EU safety & EMC compliance" },
        { name: "INNOBIZ", scope: "Korean tech-innovation SME" },
        { name: "RoHS / REACH", scope: "Hazardous substances & chemicals" },
        { name: "KAIST R&D", scope: "Research collaboration" },
      ],
      viewAll: "View all certifications",
    },
    contact: {
      title: "Evaluating a line?",
      sub: "Send us your process conditions and gas types. We'll return a quote and a model recommendation within two business days.",
      primary: "Technical inquiry",
      secondary: "Request quote",
    },
  },

  zh: {
    intro: {
      kicker: "自 1997 年以来 · 质量流量解决方案",
      title1: "可靠的技术,",
      title2: "卓越的服务。",
      lede: "韩国首家自主生产质量流量控制器与流量计的制造商。25 年来在半导体、显示、生物制药与燃料电池工艺线上持续验证。",
      ctaPrimary: "查找适合的型号",
      ctaSecondary: "浏览全部产品",
      badge: "基于 KAIST 合作研究 · 韩国首家",
    },
    stats: [
      { k: "1997", l: "成立年份", sub: "韩国大田" },
      { k: "2003", l: "韩国首款自产 MFC", sub: "M 系列" },
      { k: "0.01–5000", l: "SLPM 流量范围", sub: "全系列合计" },
      { k: "±0.25 %", l: "重复精度", sub: "全系一致" },
    ],
    series: {
      kicker: "01 — 产品系列",
      title: "四个系列,一个标准。",
      sub: "覆盖模拟、数字、特种与配件四大类型的完整型谱。",
      items: [
        {
          code: "M / MS",
          name: "模拟系列",
          desc: "历史最悠久的基础型谱。0–5 VDC / 4–20 mA 信号。",
          count: "18 款",
          range: "0.01 – 5,000 SLPM",
          href: "/products/analogue",
          highlight: true,
          feat: "★ M3030VA",
        },
        {
          code: "MD",
          name: "数字系列",
          desc: "8 点校准,±0.25 % 精度,0.5–1 秒响应。",
          count: "14 款",
          range: "0.01 – 5,000 SLPM",
          href: "/products/digital",
        },
        {
          code: "EX / LEPC",
          name: "特种系列",
          desc: "防爆与低压精密控制等特殊规格。",
          count: "5 款",
          range: "0.01 – 1,000 SLPM",
          href: "/products/specialized",
        },
        {
          code: "LTI",
          name: "配件",
          desc: "面板显示器 · 高压稳流控制器 · 压力冲击保护器。",
          count: "5 款",
          range: "全系列兼容",
          href: "/products/accessories",
        },
      ],
    },
    applications: {
      kicker: "02 — 应用领域",
      title: "随处可用，精准可靠。",
      sub: "从半导体到生物科技，精密工艺的每个领域。",
      items: [
        { n: "半导体 · 显示", k: "Semiconductor", slug: "semiconductor" },
        { n: "燃料电池", k: "Fuel Cells", slug: "fuel-cells" },
        { n: "LED · 光纤", k: "LED · Fiber", slug: "led-lighting" },
        { n: "生物制药", k: "Biotech", slug: "biotech-pharmaceutical" },
        { n: "化学 · 石化", k: "Chemical", slug: "chemical-petrochemical" },
        { n: "光伏", k: "Photovoltaic", slug: "solar-photovoltaic" },
        { n: "金属加工", k: "Metals", slug: "metals-processing" },
        { n: "研发实验室", k: "R&D", slug: "research-development" },
      ],
    },
    feature: {
      kicker: "03 — 重点型号",
      cta: "了解 {model}",
      bulletLabels: {
        flow: "流量",
        accuracy: "精度",
        response: "响应",
        io: "信号",
      },
      slides: [
        {
          model: "M3030VA",
          sub: "模拟式质量流量控制器，适用于半导体与显示工艺，0.01–30 slpm。",
        },
        {
          model: "MD800C",
          sub: "数字式大流量质量流量控制器，8 点校准，2500–5000 slpm。",
        },
        {
          model: "EX1000C",
          sub: "用于危险场所的防爆质量流量控制器，70–1000 slpm。",
        },
      ],
    },
    credentials: {
      kicker: "04 — 认证",
      title: "经验证的国际认证",
      sub: "满足 ISO 9001、CE 等国际认证标准。",
      items: [
        { name: "ISO 9001", scope: "质量管理体系" },
        { name: "CE", scope: "欧盟安全与电磁兼容性" },
        { name: "INNOBIZ", scope: "韩国技术革新型中小企业" },
        { name: "RoHS / REACH", scope: "有害物质与化学品合规" },
        { name: "KAIST 联合研发", scope: "产学研合作" },
      ],
      viewAll: "查看全部认证",
    },
    contact: {
      title: "正在评估方案?",
      sub: "请告知工艺条件与气体种类,我们将在两个工作日内回复适用型号与报价。",
      primary: "技术咨询",
      secondary: "申请报价",
    },
  },
};
