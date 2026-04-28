/**
 * Line Tech — /contact page content.
 *
 * Static info (address / phone / fax / email) is sourced from `LT_SHELL.footer.contact`
 * to stay DRY with the footer. This file only carries page-specific copy
 * (heading, intro, hours, form labels, submission-notice).
 */
import type { Locale } from "./home";

export type InquiryTypeId =
  | "sales"
  | "support"
  | "partnership"
  | "general";

export type ContactFormCopy = {
  heading: string;
  notice: string;
  fields: {
    inquiryType: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
  };
  placeholders: {
    inquiryType: string;
    name: string;
    email: string;
    company: string;
    phone: string;
    subject: string;
    message: string;
  };
  inquiryTypeOptions: {
    id: InquiryTypeId;
    label: string;
    /**
     * Optional follow-up field that appears below the select when this type
     * is chosen. Captures the one piece of structured info that matters most
     * for the bucket (model number for support, region for partnership, etc).
     */
    extraField?: {
      label: string;
      placeholder: string;
      required: boolean;
    };
  }[];
  required: string;
  submit: string;
  submitDisabledHelp: string;
};

export type DistributorRegion = {
  id: string;
  name: string;
  status: string;
};

export type ContactContent = {
  breadcrumbLabel: string;
  title: string;
  lede: string;
  infoHeading: string;
  hoursLabel: string;
  hoursValue: string;
  addressLabel: string;
  phoneLabel: string;
  faxLabel: string;
  emailLabel: string;
  emailDirectCta: string;
  form: ContactFormCopy;
  /**
   * Inline fine-print under the form's submit. References "privacy policy" in
   * each locale's natural phrasing — wrap the relevant phrase in an <a> once
   * the policy page lands.
   */
  privacyNotice: string;
  distributors: {
    heading: string;
    lede: string;
    regions: DistributorRegion[];
  };
  map: {
    heading: string;
    caption: string;
    openLabel: string;
  };
};

export const LT_CONTACT: Record<Locale, ContactContent> = {
  ko: {
    breadcrumbLabel: "문의",
    title: "문의하기",
    lede: "제품 문의부터 기술 지원, 협력 제안까지 — 영업일 기준 2일 이내에 회신드립니다.",
    infoHeading: "연락처",
    hoursLabel: "운영 시간",
    hoursValue: "평일 09:00 – 18:00 (KST) · 점심 12:00 – 13:00",
    addressLabel: "주소",
    phoneLabel: "전화",
    faxLabel: "팩스",
    emailLabel: "이메일",
    emailDirectCta: "이메일로 직접 문의",
    form: {
      heading: "온라인 문의",
      notice:
        "온라인 제출 시스템을 업그레이드 중입니다. 즉시 회신이 필요하시면 위 이메일로 직접 연락해 주세요.",
      fields: {
        inquiryType: "문의 유형",
        name: "성함",
        email: "이메일",
        company: "회사명",
        phone: "연락처",
        subject: "제목",
        message: "문의 내용",
      },
      placeholders: {
        inquiryType: "문의 유형을 선택해 주세요",
        name: "홍길동",
        email: "name@company.com",
        company: "(주)회사명",
        phone: "010-0000-0000",
        subject: "예: 견적 요청, 기술 문의, 협력 제안",
        message:
          "어떤 도움이 필요하신지 자세히 적어주세요. 제품 문의라면 가스 종류·유량 범위 등 공정 조건을 함께 알려주시면 더 빠르게 안내드릴 수 있습니다.",
      },
      inquiryTypeOptions: [
        {
          id: "sales",
          label: "영업·견적",
          extraField: {
            label: "관심 제품·모델",
            placeholder: "예: M3030VA, MD2030, 또는 카테고리",
            required: false,
          },
        },
        {
          id: "support",
          label: "기술 지원",
          extraField: {
            label: "모델·시리얼 번호",
            placeholder: "예: M3030VA / SN-12345",
            required: true,
          },
        },
        {
          id: "partnership",
          label: "협력·파트너십",
          extraField: {
            label: "지역·시장",
            placeholder: "예: 동남아시아, 일본, 유럽",
            required: false,
          },
        },
        { id: "general", label: "일반 문의" },
      ],
      required: "필수",
      submit: "문의 보내기",
      submitDisabledHelp:
        "제출 백엔드는 현재 작업 중입니다. 위 이메일 주소로 보내주시면 즉시 회신드리겠습니다.",
    },
    privacyNotice:
      "문의 내용은 개인정보처리방침에 따라 처리되며 제3자에 공유되지 않습니다.",
    distributors: {
      heading: "글로벌 네트워크",
      lede: "한국 본사를 중심으로 주요 시장을 직간접적으로 지원하고 있습니다.",
      regions: [
        { id: "kr", name: "한국 (본사)", status: "대전 본사 직접 영업" },
        {
          id: "cn",
          name: "중국",
          status: "라인텍 정밀 기술(우시) 자회사",
        },
        {
          id: "sea",
          name: "동남아시아",
          status: "파트너 네트워크 확장 중 — 본사 문의",
        },
        {
          id: "other",
          name: "기타 지역",
          status: "유럽 · 북미 · 일본 — 본사 직접 문의",
        },
      ],
    },
    map: {
      heading: "오시는 길",
      caption: "라인텍 본사 · 대전광역시 유성구",
      openLabel: "네이버 지도에서 열기",
    },
  },

  en: {
    breadcrumbLabel: "Contact",
    title: "Get in touch",
    lede: "Product questions, technical support, partnership ideas — whatever brings you here, we'll reply within two business days.",
    infoHeading: "Contact details",
    hoursLabel: "Hours",
    hoursValue: "Mon – Fri, 09:00 – 18:00 KST · Lunch 12:00 – 13:00",
    addressLabel: "Address",
    phoneLabel: "Phone",
    faxLabel: "Fax",
    emailLabel: "Email",
    emailDirectCta: "Email us directly",
    form: {
      heading: "Send an inquiry",
      notice:
        "Our online submission system is being upgraded. For an immediate response, please email us directly using the address above.",
      fields: {
        inquiryType: "What's this about?",
        name: "Name",
        email: "Email",
        company: "Company",
        phone: "Phone",
        subject: "Subject",
        message: "Message",
      },
      placeholders: {
        inquiryType: "Choose one",
        name: "Jane Doe",
        email: "name@company.com",
        company: "Company name",
        phone: "+1 555 000 0000",
        subject: "e.g. Quote request, technical question, distributor inquiry",
        message:
          "Tell us how we can help. If it's a product inquiry, gas type, flow range, and timeline help us route you faster.",
      },
      inquiryTypeOptions: [
        {
          id: "sales",
          label: "Sales / quote",
          extraField: {
            label: "Product or model of interest",
            placeholder: "e.g. M3030VA, MD2030, or a category",
            required: false,
          },
        },
        {
          id: "support",
          label: "Technical support",
          extraField: {
            label: "Model and serial number",
            placeholder: "e.g. M3030VA / SN-12345",
            required: true,
          },
        },
        {
          id: "partnership",
          label: "Partnership / distributor",
          extraField: {
            label: "Region or market",
            placeholder: "e.g. Southeast Asia, Japan, EU",
            required: false,
          },
        },
        { id: "general", label: "General inquiry" },
      ],
      required: "Required",
      submit: "Send inquiry",
      submitDisabledHelp:
        "Submission backend is in progress. Please email the address above for an immediate reply.",
    },
    privacyNotice:
      "We'll handle your message per our privacy policy and won't share your details with third parties.",
    distributors: {
      heading: "Global network",
      lede: "Headquartered in Korea, supporting key markets directly or through our subsidiary and partners.",
      regions: [
        { id: "kr", name: "Korea (HQ)", status: "Direct sales from Daejeon HQ" },
        {
          id: "cn",
          name: "China",
          status: "Line Tech Precision (Wuxi) — subsidiary office",
        },
        {
          id: "sea",
          name: "Southeast Asia",
          status: "Partner network expanding — contact HQ",
        },
        {
          id: "other",
          name: "Other regions",
          status: "Europe · North America · Japan — contact HQ directly",
        },
      ],
    },
    map: {
      heading: "Find us",
      caption: "Line Tech HQ · Daejeon, Korea",
      openLabel: "Open in Google Maps",
    },
  },

  zh: {
    breadcrumbLabel: "联系",
    title: "联系我们",
    lede: "无论是产品咨询、技术支持，还是合作洽谈 — 我们都会在两个工作日内回复您。",
    infoHeading: "联系方式",
    hoursLabel: "工作时间",
    hoursValue: "周一至周五 09:00 – 18:00（韩国时间）· 午休 12:00 – 13:00",
    addressLabel: "地址",
    phoneLabel: "电话",
    faxLabel: "传真",
    emailLabel: "邮箱",
    emailDirectCta: "直接发送邮件",
    form: {
      heading: "在线咨询",
      notice: "在线提交系统正在升级。如需即时回复，请使用上方邮箱直接联系我们。",
      fields: {
        inquiryType: "咨询类型",
        name: "姓名",
        email: "邮箱",
        company: "公司",
        phone: "电话",
        subject: "主题",
        message: "咨询内容",
      },
      placeholders: {
        inquiryType: "请选择咨询类型",
        name: "张三",
        email: "name@company.com",
        company: "公司名称",
        phone: "+86 138 0000 0000",
        subject: "例如：报价咨询、技术支持、合作洽谈",
        message:
          "请说明您的需求。如为产品咨询，请一并提供气体种类与流量范围，我们将更快为您对接。",
      },
      inquiryTypeOptions: [
        {
          id: "sales",
          label: "销售·报价",
          extraField: {
            label: "关注产品或型号",
            placeholder: "例如：M3030VA、MD2030 或某一类别",
            required: false,
          },
        },
        {
          id: "support",
          label: "技术支持",
          extraField: {
            label: "型号与序列号",
            placeholder: "例如：M3030VA / SN-12345",
            required: true,
          },
        },
        {
          id: "partnership",
          label: "合作·代理",
          extraField: {
            label: "地区或市场",
            placeholder: "例如：东南亚、日本、欧洲",
            required: false,
          },
        },
        { id: "general", label: "一般咨询" },
      ],
      required: "必填",
      submit: "发送咨询",
      submitDisabledHelp:
        "提交后端正在开发中。请使用上方邮箱直接联系我们以获得即时回复。",
    },
    privacyNotice:
      "您的信息将依据我们的隐私政策处理，不会与第三方共享。",
    distributors: {
      heading: "全球网络",
      lede: "以韩国总部为核心，直接或通过子公司与合作伙伴覆盖主要市场。",
      regions: [
        { id: "kr", name: "韩国（总部）", status: "大田总部直接销售" },
        {
          id: "cn",
          name: "中国",
          status: "莱因精密技术（无锡）子公司",
        },
        {
          id: "sea",
          name: "东南亚",
          status: "合作网络扩展中 — 请联系总部",
        },
        {
          id: "other",
          name: "其他地区",
          status: "欧洲 · 北美 · 日本 — 请联系总部",
        },
      ],
    },
    map: {
      heading: "公司位置",
      caption: "莱因总部 · 韩国大田广域市",
      openLabel: "在 Google 地图中打开",
    },
  },
};
