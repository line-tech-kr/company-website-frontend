import type { Locale } from "./home";

export type PrivacySection = {
  heading: string;
  body?: string;
  items?: string[];
  note?: string;
};

export type PrivacyContent = {
  title: string;
  effectiveDate: string;
  sections: PrivacySection[];
};

export const LT_PRIVACY: Record<Locale, PrivacyContent> = {
  ko: {
    title: "개인정보처리방침",
    effectiveDate: "2026-05-06",
    sections: [
      {
        heading: "개인정보의 처리 목적",
        body: '주식회사 라인테크(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 처리된 개인정보는 아래 목적 이외의 용도로 이용되지 않으며, 이용 목적이 변경되는 경우 개인정보 보호법 제18조에 따라 별도의 동의를 받을 예정입니다.',
        items: [
          "제품·기술 문의 처리 및 견적 응대",
          "고객 서비스 제공 및 불만 처리",
          "법령 및 계약상 의무 이행",
        ],
      },
      {
        heading: "수집하는 개인정보의 항목",
        body: "회사는 문의 처리를 위해 다음 개인정보를 수집합니다.",
        items: ["필수: 성명, 회사명, 이메일 주소, 전화번호", "선택: 문의 내용"],
      },
      {
        heading: "개인정보의 보유 및 이용기간",
        body: "수집 및 이용 목적이 달성된 후 즉시 파기합니다. 단, 관계 법령에 의하여 보존이 필요한 경우 해당 기간 동안 보관합니다.",
        items: [
          "문의 처리 목적: 처리 완료 후 3년",
          "분쟁 발생 시: 분쟁 해결 시까지",
        ],
      },
      {
        heading: "개인정보의 제3자 제공",
        body: "회사는 정보주체의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 정보주체의 동의가 있거나 법률에 특별한 규정이 있는 경우에는 그러하지 않습니다.",
      },
      {
        heading: "개인정보처리 위탁",
        body: "회사는 현재 개인정보 처리업무를 외부 업체에 위탁하고 있지 않습니다.",
      },
      {
        heading: "정보주체의 권리와 행사방법",
        body: "정보주체는 회사에 대해 다음 권리를 행사할 수 있습니다.",
        items: [
          "개인정보 열람 요구",
          "오류 정정 요구",
          "삭제 요구",
          "처리정지 요구",
        ],
        note: "권리 행사는 서면, 이메일 또는 팩스를 통해 가능하며, 회사는 지체 없이 조치합니다.",
      },
      {
        heading: "개인정보 보호책임자",
        items: [
          "회사명: 주식회사 라인테크",
          "주소: 대전광역시 유성구 대덕대로 806",
          "전화: 042-624-0700",
          "팩스: 042-638-2211",
          "이메일: linetech@line-tech.co.kr",
        ],
      },
      {
        heading: "개인정보처리방침 변경",
        body: "이 개인정보처리방침은 2026년 5월 6일부터 적용됩니다. 변경사항이 있는 경우 시행 7일 전부터 홈페이지를 통해 고지합니다.",
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    effectiveDate: "2026-05-06",
    sections: [
      {
        heading: "Purpose of Processing",
        body: 'Line Tech Co., Ltd. (the "Company") processes personal data for the purposes listed below. Personal data is not used beyond these purposes. If the purpose changes, the Company will obtain separate consent as required by the Personal Information Protection Act (PIPA) Article 18.',
        items: [
          "Processing product and technical inquiries, and responding to quotation requests",
          "Providing customer service and handling complaints",
          "Fulfilling legal and contractual obligations",
        ],
      },
      {
        heading: "Personal Data Collected",
        body: "The Company collects the following personal data to process inquiries:",
        items: [
          "Required: Full name, company name, email address, phone number",
          "Optional: Inquiry content",
        ],
      },
      {
        heading: "Retention Period",
        body: "Personal data is destroyed once the purpose of collection is fulfilled. Where retention is required by applicable law, the data is kept for the prescribed period.",
        items: [
          "Inquiry processing: 3 years after the inquiry is resolved",
          "Disputes: Until the dispute is resolved",
        ],
      },
      {
        heading: "Third-Party Disclosure",
        body: "The Company does not share personal data with third parties as a general rule. Exceptions apply only where the data subject has consented or where a specific legal provision requires disclosure.",
      },
      {
        heading: "Processing Outsourcing",
        body: "The Company does not currently outsource any personal data processing to third-party service providers.",
      },
      {
        heading: "Your Rights",
        body: "You have the right to:",
        items: [
          "Request access to your personal data",
          "Request correction of inaccurate data",
          "Request deletion of your data",
          "Request suspension of processing",
        ],
        note: "To exercise these rights, please contact us in writing, by email, or by fax. The Company will act without delay.",
      },
      {
        heading: "Privacy Officer",
        items: [
          "Company: Line Tech Co., Ltd.",
          "Address: 806 Daedeok-daero, Yuseong-gu, Daejeon 34055, Korea",
          "Phone: +82 42-624-0700",
          "Fax: +82 42-638-2211",
          "Email: linetech@line-tech.co.kr",
        ],
      },
      {
        heading: "Policy Updates",
        body: "This Privacy Policy is effective from 6 May 2026. Any changes will be announced on this website at least 7 days before taking effect.",
      },
    ],
  },
  zh: {
    title: "隐私政策",
    effectiveDate: "2026-05-06",
    sections: [
      {
        heading: "个人信息处理目的",
        body: '莱因科技有限公司（以下简称"公司"）依据以下目的处理个人信息。个人信息不得用于上述目的以外的用途。如处理目的发生变化，公司将依据《个人信息保护法》第18条重新获取单独同意。',
        items: [
          "处理产品及技术咨询，回应报价请求",
          "提供客户服务及处理投诉",
          "履行法律及合同义务",
        ],
      },
      {
        heading: "收集的个人信息项目",
        body: "公司为处理咨询收集以下个人信息：",
        items: [
          "必填项：姓名、公司名称、电子邮箱、电话号码",
          "选填项：咨询内容",
        ],
      },
      {
        heading: "保留和使用期限",
        body: "个人信息在收集及使用目的达成后立即销毁。如相关法律要求保留，则在规定期限内保管。",
        items: ["咨询处理目的：处理完成后3年", "发生纠纷时：至纠纷解决为止"],
      },
      {
        heading: "个人信息的第三方提供",
        body: "公司原则上不向第三方提供信息主体的个人信息。仅在信息主体同意或法律有特别规定的情况下例外。",
      },
      {
        heading: "个人信息处理委托",
        body: "公司目前未将任何个人信息处理业务委托给外部供应商。",
      },
      {
        heading: "您的权利及行使方式",
        body: "信息主体可随时对公司行使以下权利：",
        items: [
          "要求查阅个人信息",
          "要求更正错误信息",
          "要求删除个人信息",
          "要求暂停处理",
        ],
        note: "权利行使可通过书面、电子邮件或传真进行，公司将立即予以处理。",
      },
      {
        heading: "隐私保护负责人",
        items: [
          "公司：莱因科技有限公司",
          "地址：韩国大田广域市儒城区大德大路806号",
          "电话：+82 42-624-0700",
          "传真：+82 42-638-2211",
          "电子邮箱：linetech@line-tech.co.kr",
        ],
      },
      {
        heading: "方针变更",
        body: "本隐私政策自2026年5月6日起生效。如有变更，将在生效7日前通过本网站公告。",
      },
    ],
  },
};
