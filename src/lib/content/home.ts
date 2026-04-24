import type { routing } from "@/i18n/routing";

export type Locale = (typeof routing.locales)[number];

type SeriesItem = {
  code: string;
  name: string;
  desc: string;
  count: string;
  range: string;
  highlight?: boolean;
  feat?: string;
};

type ApplicationItem = { n: string; k: string };
type Stat = { k: string; l: string; sub: string };
type Bullet = { k: string; v: string };

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
  applications: { kicker: string; title: string; items: ApplicationItem[] };
  feature: { kicker: string; title: string; sub: string; bullets: Bullet[]; cta: string };
  credentials: { kicker: string; title: string; items: string[] };
  contact: { title: string; sub: string; primary: string; secondary: string };
};

export const LT_HOME: Record<Locale, HomeContent> = {
  ko: {
    intro: {
      kicker: "1997년부터 · 질량유량 측정 솔루션",
      title1: "신뢰할 수 있는 기술과",
      title2: "확실한 애프터서비스.",
      lede: "한국 최초의 자체 생산 MFC·MFM 제조사. 반도체, 디스플레이, 바이오, 연료전지 공정 현장에서 25년 이상 검증된 정밀 질량유량 제어.",
      ctaPrimary: "M3030VA 제품 페이지",
      ctaSecondary: "전체 카탈로그 (PDF)",
      badge: "KAIST 공동연구 기반 · 국내 최초",
    },
    stats: [
      { k: "1997", l: "설립 연도", sub: "경기도 화성시" },
      { k: "2003", l: "국내 최초 자체 MFC 양산", sub: "M-Series" },
      { k: "0.01–5000", l: "SLPM 측정 범위", sub: "전 시리즈 합산" },
      { k: "±0.25%", l: "반복 정밀도", sub: "전 제품 공통" },
    ],
    series: {
      kicker: "01 — 제품 시리즈",
      title: "네 가지 계열, 하나의 기준",
      sub: "공정 조건, 예산, 가스 종류에 따라 선택 가능한 풀 라인업.",
      items: [
        { code: "M / MS", name: "아날로그 시리즈", desc: "가장 오래 검증된 기본 라인업. 0~5 VDC / 4~20 mA 신호.", count: "18 모델", range: "0.01 – 5,000 SLPM", highlight: true, feat: "★ M3030VA" },
        { code: "MD",     name: "디지털 시리즈",   desc: "8-포인트 보정, ±0.25 % 정확도. 응답 0.5–1 초.",                count: "14 모델", range: "0.01 – 5,000 SLPM" },
        { code: "LD / LM", name: "전문 시리즈",    desc: "내장 디스플레이(LD) · MEMS 저비용(LM) · 방폭(EX).",            count: "8 모델",  range: "0.01 – 1,000 SLPM" },
        { code: "LTI",   name: "리드아웃·부속",    desc: "LTI-200/1000 표시기, FC-050S 유량계, PR-030 압력계.",         count: "5 모델",  range: "전 모델 공통" },
      ],
    },
    applications: {
      kicker: "02 — 적용 분야",
      title: "정밀을 요구하는 모든 공정에",
      items: [
        { n: "반도체 · 디스플레이", k: "Semiconductor" },
        { n: "연료전지",           k: "Fuel Cells" },
        { n: "LED · 광섬유",       k: "LED · Fiber Optics" },
        { n: "바이오 · 제약",      k: "Biotech · Pharma" },
        { n: "화학 · 석유화학",    k: "Chemical" },
        { n: "태양광 · PV",        k: "Photovoltaic" },
        { n: "금속 가공",          k: "Metals" },
        { n: "R&D · 연구소",       k: "R&D · Labs" },
      ],
    },
    feature: {
      kicker: "03 — 핵심 모델",
      title: "M3030VA",
      sub: "반도체·디스플레이 공정용 디지털 압전식 질량유량제어기.",
      bullets: [
        { k: "유량",   v: "10 SCCM – 20 SLM" },
        { k: "정확도", v: "± 1.0 % S.P." },
        { k: "응답",   v: "≤ 1.0 s" },
        { k: "통신",   v: "0–5 VDC / Modbus RTU" },
      ],
      cta: "제품 상세 보기",
    },
    credentials: {
      kicker: "04 — 인증",
      title: "국제 표준을 충족합니다",
      items: ["ISO 9001", "CE", "INNOBIZ 인증", "RoHS / REACH", "KAIST 공동 R&D"],
    },
    contact: {
      title: "도입 검토 중이십니까?",
      sub: "공정 조건과 가스 종류를 알려주시면 2영업일 내 견적과 적합 모델을 회신해 드립니다.",
      primary: "기술 문의",
      secondary: "견적 요청",
    },
  },

  en: {
    intro: {
      kicker: "Since 1997 · Mass Flow Solutions",
      title1: "Reliable technology,",
      title2: "supreme service.",
      lede: "Korea's first domestic manufacturer of mass flow controllers and meters. Proven for over 25 years across semiconductor, display, biotech, and fuel-cell process lines.",
      ctaPrimary: "View M3030VA product",
      ctaSecondary: "Full catalog (PDF)",
      badge: "Founded on KAIST collaboration · First in Korea",
    },
    stats: [
      { k: "1997", l: "Founded",                   sub: "Hwaseong, Gyeonggi" },
      { k: "2003", l: "First Korean MFC produced", sub: "M-Series" },
      { k: "0.01–5000", l: "SLPM flow range",      sub: "across all series" },
      { k: "±0.25 %", l: "Repeatability",          sub: "every product" },
    ],
    series: {
      kicker: "01 — Product series",
      title: "Four series, one standard.",
      sub: "A full catalog spanning analog, digital, and specialized variants.",
      items: [
        { code: "M / MS", name: "Analogue Series",    desc: "The longest-running line. 0–5 VDC / 4–20 mA signal.",           count: "18 models", range: "0.01 – 5,000 SLPM", highlight: true, feat: "★ M3030VA" },
        { code: "MD",     name: "Digital Series",     desc: "8-point calibration, ±0.25 % accuracy, 0.5–1 s response.",       count: "14 models", range: "0.01 – 5,000 SLPM" },
        { code: "LD / LM", name: "Specialized Series", desc: "Built-in display (LD) · MEMS low-cost (LM) · Explosion-proof (EX).", count: "8 models",  range: "0.01 – 1,000 SLPM" },
        { code: "LTI",   name: "Readouts & Parts",    desc: "LTI-200/1000 readouts, FC-050S flowmeter, PR-030 pressure.",    count: "5 models",  range: "all lines" },
      ],
    },
    applications: {
      kicker: "02 — Applications",
      title: "Wherever precision is required.",
      items: [
        { n: "Semiconductor",        k: "반도체 · 디스플레이" },
        { n: "Fuel Cells",            k: "연료전지" },
        { n: "LED · Fiber Optics",    k: "LED · 광섬유" },
        { n: "Biotech · Pharma",      k: "바이오 · 제약" },
        { n: "Chemical",              k: "화학 · 석유화학" },
        { n: "Photovoltaic",          k: "태양광" },
        { n: "Metals",                k: "금속 가공" },
        { n: "R&D · Labs",            k: "R&D · 연구소" },
      ],
    },
    feature: {
      kicker: "03 — Featured model",
      title: "M3030VA",
      sub: "Digital piezo-actuated mass flow controller for semiconductor and display process lines.",
      bullets: [
        { k: "Flow",     v: "10 SCCM – 20 SLM" },
        { k: "Accuracy", v: "± 1.0 % S.P." },
        { k: "Response", v: "≤ 1.0 s" },
        { k: "I/O",      v: "0–5 VDC / Modbus RTU" },
      ],
      cta: "Open product page",
    },
    credentials: {
      kicker: "04 — Certifications",
      title: "Tested against international standards.",
      items: ["ISO 9001", "CE", "INNOBIZ", "RoHS / REACH", "KAIST joint R&D"],
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
      ctaPrimary: "查看 M3030VA 产品",
      ctaSecondary: "完整样册 (PDF)",
      badge: "基于 KAIST 合作研究 · 韩国首家",
    },
    stats: [
      { k: "1997", l: "成立年份",                 sub: "京畿道华城市" },
      { k: "2003", l: "韩国首款自产 MFC",         sub: "M 系列" },
      { k: "0.01–5000", l: "SLPM 流量范围",       sub: "全系列合计" },
      { k: "±0.25 %", l: "重复精度",              sub: "全系一致" },
    ],
    series: {
      kicker: "01 — 产品系列",
      title: "四个系列,一个标准。",
      sub: "覆盖模拟、数字、特种三大类型的完整型谱。",
      items: [
        { code: "M / MS", name: "模拟系列",         desc: "历史最悠久的基础型谱。0–5 VDC / 4–20 mA 信号。",             count: "18 款", range: "0.01 – 5,000 SLPM", highlight: true, feat: "★ M3030VA" },
        { code: "MD",     name: "数字系列",         desc: "8 点校准,±0.25 % 精度,0.5–1 秒响应。",                      count: "14 款", range: "0.01 – 5,000 SLPM" },
        { code: "LD / LM", name: "特种系列",        desc: "内置显示 (LD) · MEMS 低成本 (LM) · 防爆 (EX)。",            count: "8 款",  range: "0.01 – 1,000 SLPM" },
        { code: "LTI",   name: "显示与配件",        desc: "LTI-200/1000 显示器、FC-050S 流量计、PR-030 压力计。",      count: "5 款",  range: "全系列兼容" },
      ],
    },
    applications: {
      kicker: "02 — 应用领域",
      title: "任何需要精度的工艺。",
      items: [
        { n: "半导体 · 显示",      k: "Semiconductor" },
        { n: "燃料电池",           k: "Fuel Cells" },
        { n: "LED · 光纤",         k: "LED · Fiber" },
        { n: "生物制药",           k: "Biotech" },
        { n: "化学 · 石化",        k: "Chemical" },
        { n: "光伏",               k: "Photovoltaic" },
        { n: "金属加工",           k: "Metals" },
        { n: "研发实验室",         k: "R&D" },
      ],
    },
    feature: {
      kicker: "03 — 重点型号",
      title: "M3030VA",
      sub: "用于半导体与显示工艺线的数字压电式质量流量控制器。",
      bullets: [
        { k: "流量", v: "10 SCCM – 20 SLM" },
        { k: "精度", v: "± 1.0 % S.P." },
        { k: "响应", v: "≤ 1.0 s" },
        { k: "信号", v: "0–5 VDC / Modbus RTU" },
      ],
      cta: "打开产品页",
    },
    credentials: {
      kicker: "04 — 认证",
      title: "符合国际标准。",
      items: ["ISO 9001", "CE", "INNOBIZ", "RoHS / REACH", "KAIST 联合研发"],
    },
    contact: {
      title: "正在评估方案?",
      sub: "请告知工艺条件与气体种类,我们将在两个工作日内回复适用型号与报价。",
      primary: "技术咨询",
      secondary: "申请报价",
    },
  },
};
