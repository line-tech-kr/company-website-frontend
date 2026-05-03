/**
 * Line Tech — /products/accessories page content (single-scroller × 3 locales).
 *
 * Sections:
 *  - #readouts                LTI-200, LTI-1000
 *  - #pressure-accessories    FC-050S, PR-030
 *  - #contact                 footer CTA
 *
 * Source: ~/Dev/linetech/company-docs-private/docs/product-catalog-2020-en.md
 *         (sections 7 LTI-200 / LTI-1000 / FC-050S / PR-030, lines 994–1068).
 *
 * Stage 1: EN populated from catalog. KO/ZH stubs placed inline with
 * TODO(translation) markers — Stage 2 fills in the localized copy.
 */
import type { Locale } from "./home";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AccessorySectionId =
  | "readouts"
  | "pressure-accessories"
  | "contact";

export type AccessoryItemId = "lti-200" | "lti-1000" | "fc-050s" | "pr-030";

export type AccessorySpecRow = {
  label: string;
  value: string;
};

export type AccessoryItemImage = {
  src: string;
  alt: string;
  /** Whether the image is a generic placeholder (rendered with reduced
   * emphasis); LTI items use this until real photography lands. */
  placeholder?: boolean;
};

export type AccessoryIntegration = {
  heading: string;
  body: string;
};

export type AccessoryItem = {
  id: AccessoryItemId;
  /** Display model code, e.g., "LTI-200". */
  model: string;
  /** Functional descriptor under the model code, e.g., "Read Out Box". */
  title: string;
  /** Short prose intro, 1–2 sentences. */
  blurb: string;
  image: AccessoryItemImage;
  specsHeading: string;
  specs: AccessorySpecRow[];
  /** Optional integration paragraph (FC-050S and PR-030 only). */
  integration?: AccessoryIntegration;
};

export type AccessorySection = {
  kicker: string;
  title: string;
  sub: string;
  items: AccessoryItem[];
};

export type AccessoryContact = {
  kicker: string;
  title: string;
  body: string;
  cta: string;
  href: string;
};

/** Two-level side-nav entry. Section nodes have `children`; leaf items don't. */
export type AccessoriesNavNode = {
  id: AccessorySectionId | AccessoryItemId;
  href: string;
  label: string;
  children?: AccessoriesNavNode[];
};

export type AccessoriesContent = {
  navHeading: string;
  nav: AccessoriesNavNode[];

  /** Breadcrumb middle label ("Products" already covered by `nav.products`
   * key in i18n; the leaf "Accessories" is here so it can be locale-tuned. */
  breadcrumbAccessories: string;

  hero: {
    kicker: string;
    title: string;
    lede: string;
  };

  readouts: AccessorySection;
  pressure: AccessorySection;
  contact: AccessoryContact;
};

// ─── Shared (locale-independent) ────────────────────────────────────────────

/** LTI items use a shared neutral placeholder until real product photos exist. */
const LTI_PLACEHOLDER_SRC = "/products/lti/placeholder.svg";
const FC_050S_IMAGE_SRC = "/products/fc-050s/product-1.gif";
const PR_030_IMAGE_SRC = "/products/pr-030/product-1.gif";

// ─── Content ────────────────────────────────────────────────────────────────

export const LT_ACCESSORIES: Record<Locale, AccessoriesContent> = {
  // ─── English ──────────────────────────────────────────────────────────────
  en: {
    navHeading: "On this page",
    nav: [
      {
        id: "readouts",
        href: "#readouts",
        label: "Readouts",
        children: [
          { id: "lti-200", href: "#lti-200", label: "LTI-200" },
          { id: "lti-1000", href: "#lti-1000", label: "LTI-1000" },
        ],
      },
      {
        id: "pressure-accessories",
        href: "#pressure-accessories",
        label: "Pressure accessories",
        children: [
          { id: "fc-050s", href: "#fc-050s", label: "FC-050S" },
          { id: "pr-030", href: "#pr-030", label: "PR-030" },
        ],
      },
      { id: "contact", href: "#contact", label: "Get in touch" },
    ],
    breadcrumbAccessories: "Accessories",
    hero: {
      kicker: "Accessories",
      title: "Readouts and pressure accessories.",
      lede: "Supporting hardware that pairs with our MFC and MFM lines — panel readouts that surface live flow, and upstream pressure regulators that condition gas before it reaches the controller. These are not standalone flow products; they exist to make the rest of the catalog work in real installations.",
    },
    readouts: {
      kicker: "01 — Readouts",
      title: "Panel-mount displays for live flow signals.",
      sub: "Both LTI units accept the 0–5 V output of any Line Tech MFC or MFM and display flow on a 4-digit 7-segment window. Choose by form factor: compact panel face (LTI-200) or rackable unit with PC software (LTI-1000).",
      items: [
        {
          id: "lti-200",
          model: "LTI-200",
          title: "Read Out Box",
          blurb:
            "Compact panel-mount readout. 4-digit 7-segment display, 0–5 Vdc set-point input, six-button front face for flow on/off, scrolling, and menu navigation.",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "Generic placeholder for LTI-200 panel readout",
            placeholder: true,
          },
          specsHeading: "Specifications",
          specs: [
            { label: "Input Power", value: "15 Vdc – 24 Vdc" },
            { label: "Output Power", value: "+15 Vdc @ 500 mA" },
            { label: "Display Window", value: "4-digit 7-segment" },
            { label: "Display Repeatability", value: "≤ ±1.0 % of Full Scale" },
            { label: "Output Signal", value: "0 – 5 Vdc" },
            { label: "Units of Display", value: "SCCM, SLM, %" },
            { label: "Set-Point", value: "0 – 5 Vdc for full scale" },
            { label: "Flow On/Off", value: "TTL input signal" },
            { label: "Flow Out Signal", value: "0 – 5 Vdc" },
            { label: "Communication", value: "RS-485 (option)" },
            { label: "Case Dimensions", value: "104 × 38 mm" },
          ],
        },
        {
          id: "lti-1000",
          model: "LTI-1000",
          title: "Multi-channel Read Out Box",
          blurb:
            "Rackable readout box with D-SUB remote control, optional 4–20 mA output, and an RS-232 link to companion PC software. Handles up to 8 channels in 1U / 2U / 4U arrangements.",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "Generic placeholder for LTI-1000 rackable readout",
            placeholder: true,
          },
          specsHeading: "Specifications",
          specs: [
            { label: "Input Power", value: "220 VAC (50–60 Hz)" },
            {
              label: "Output Power",
              value: "±15 VDC @ 500 mA (option ±24 VDC)",
            },
            { label: "Display Window", value: "4-digit 7-segment" },
            { label: "Display Repeatability", value: "≤ ±1.0 % of Full Scale" },
            { label: "Output Signal", value: "0 – 5 Vdc (option 4 – 20 mA)" },
            { label: "Units of Display", value: "SCCM, SLM, %" },
            { label: "Remote Control", value: "D-SUB 9-pin (male)" },
            { label: "Set-Point", value: "0 – 5 Vdc for full scale" },
            { label: "Flow On/Off", value: "TTL input signal" },
            {
              label: "Relay Contact Rate",
              value: "1 relay (max 24 Vdc @ 1 A)",
            },
            { label: "Communication", value: "RS-232 (9600 baud, 8-N-1)" },
            { label: "Dimensions", value: "147.82 × 250 × 88 mm" },
            { label: "Channels", value: "Up to 8 (Ch 1–8) via PC software" },
          ],
        },
      ],
    },
    pressure: {
      kicker: "02 — Pressure accessories",
      title: "Conditioning gas before the controller.",
      sub: "High-pressure semiconductor and process lines often deliver gas at 100–200 bar — well above what an MFC accepts. FC-050S regulates feed pressure down to MFC-compatible levels; PR-030 sits even further upstream and protects the line from pressure shocks.",
      items: [
        {
          id: "fc-050s",
          model: "FC-050S",
          title: "High-Pressure Gas / Liquid Flow Controller",
          blurb:
            "Upstream pressure regulator that takes a 100 bar feed and delivers 95–97 bar to the MFC inlet, holding a 3–5 bar differential automatically. Operates across 15–300 bar feed pressure. Corrosion-resistant.",
          image: {
            src: FC_050S_IMAGE_SRC,
            alt: "FC-050S high-pressure flow controller",
          },
          specsHeading: "Specifications",
          specs: [
            {
              label: "Auto Control Differential Pressure",
              value: "3 – 5 Barg",
            },
            { label: "Gas Flow Range", value: "25 sccm – 50 slpm" },
            { label: "Operating Pressure Range", value: "15 – 300 Barg" },
            { label: "Required Differential Pressure", value: "15 Barg" },
            { label: "Operating Temperature Range", value: "-20 – 30 °C" },
            { label: "Application", value: "Corrosion-resistant" },
          ],
          integration: {
            heading: "How it integrates",
            body: "FC-050S sits between the high-pressure feed and the MFC: gas enters at roughly 100 bar, the regulator drops it to 95–97 bar, and the conditioned line feeds the MFC, which then meters flow to the system or reactor. A capped port on top of the unit is rated to 100 bar. The same regulator can also feed a manual flow control valve when an MFC isn't required.",
          },
        },
        {
          id: "pr-030",
          model: "PR-030",
          title: "Pressure Shock Protector",
          blurb:
            "Pressure resistor that closes automatically below a minimum flow threshold and re-opens at full-range flow. Used in front of FC-050S on 200 bar lines, or standalone where pressure shocks need damping.",
          image: {
            src: PR_030_IMAGE_SRC,
            alt: "PR-030 pressure shock protector",
          },
          specsHeading: "Specifications",
          specs: [
            { label: "Auto Close Differential Pressure", value: "> 15 Barg" },
            { label: "Auto Open Differential Pressure", value: "0.5 – 8 Barg" },
            { label: "Max Gas Flow Range", value: "30 slpm" },
            { label: "Max Operating Pressure", value: "< 300 Bar" },
            { label: "Close Gas Flow Range", value: "< 0.3 – 5 slpm" },
            { label: "Required Differential Pressure", value: "15 Barg" },
            { label: "Operating Temperature Range", value: "-20 – 100 °C" },
            { label: "Application", value: "Corrosion-resistant" },
          ],
          integration: {
            heading: "How it integrates",
            body: "On a 200 bar feed line, PR-030 sits at the very front, dropping pressure before any other equipment sees it. In a typical chain, gas enters at 200 bar, passes through PR-030, then through FC-050S (which conditions it to 195–197 bar), and finally into the MFC. The valve closes automatically when flow drops below the minimum threshold and re-opens at full flow, preventing pressure surges from reaching downstream equipment.",
          },
        },
      ],
    },
    contact: {
      kicker: "03 — Get in touch",
      title: "Need integration support?",
      body: "These accessories ship to spec, but the right pairing depends on your feed pressure, gas chemistry, and target flow range. Tell us your line conditions and we'll come back with a part list and a quote.",
      cta: "Contact us",
      href: "/contact",
    },
  },

  // ─── Korean ───────────────────────────────────────────────────────────────
  ko: {
    navHeading: "이 페이지에서",
    nav: [
      {
        id: "readouts",
        href: "#readouts",
        label: "표시기",
        children: [
          { id: "lti-200", href: "#lti-200", label: "LTI-200" },
          { id: "lti-1000", href: "#lti-1000", label: "LTI-1000" },
        ],
      },
      {
        id: "pressure-accessories",
        href: "#pressure-accessories",
        label: "압력 부속품",
        children: [
          { id: "fc-050s", href: "#fc-050s", label: "FC-050S" },
          { id: "pr-030", href: "#pr-030", label: "PR-030" },
        ],
      },
      { id: "contact", href: "#contact", label: "문의" },
    ],
    breadcrumbAccessories: "부속품",
    hero: {
      kicker: "부속품",
      title: "표시기와 압력 부속품.",
      lede: "MFC와 MFM 제품군과 함께 사용되는 보조 장비입니다. 실시간 유량을 표시하는 패널 표시기, 그리고 컨트롤러로 가스가 도달하기 전에 압력을 조정하는 상류 압력 조절기가 포함됩니다. 단독으로 유량을 측정하거나 제어하는 제품이 아니며, 실제 설치 환경에서 본 카탈로그의 다른 제품들이 정상 작동하도록 보조하는 역할을 합니다.",
    },
    readouts: {
      kicker: "01 — 표시기",
      title: "실시간 유량 신호를 표시하는\n패널 장착형 디스플레이.",
      sub: "두 LTI 모델 모두 라인테크 MFC 또는 MFM의 0–5 V 출력을 입력으로 받아 4자리 7-세그먼트 디스플레이에 유량을 표시합니다. 형태에 따라 선택하십시오 — 소형 패널 일체형(LTI-200) 또는 PC 소프트웨어를 지원하는 랙 마운트형(LTI-1000).",
      items: [
        {
          id: "lti-200",
          model: "LTI-200",
          title: "표시기 박스",
          blurb:
            "소형 패널 장착형 표시기. 4자리 7-세그먼트 디스플레이, 0–5 Vdc 설정값 입력, 유량 ON/OFF · 스크롤 · 메뉴 조작을 위한 전면 6버튼 구성.",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "LTI-200 표시기 자리표시 이미지",
            placeholder: true,
          },
          specsHeading: "사양",
          specs: [
            { label: "입력 전원", value: "15 Vdc – 24 Vdc" },
            { label: "출력 전원", value: "+15 Vdc @ 500 mA" },
            { label: "표시창", value: "4자리 7-세그먼트" },
            // TODO(translation): "Display Repeatability" — confirm "표시 반복 정밀도"
            { label: "표시 반복 정밀도", value: "≤ ±1.0 % of Full Scale" },
            { label: "출력 신호", value: "0 – 5 Vdc" },
            { label: "표시 단위", value: "SCCM, SLM, %" },
            { label: "설정값 (Set-Point)", value: "0 – 5 Vdc for full scale" },
            { label: "유량 ON/OFF", value: "TTL input signal" },
            { label: "유량 출력 신호", value: "0 – 5 Vdc" },
            { label: "통신", value: "RS-485 (옵션)" },
            { label: "케이스 외형 치수", value: "104 × 38 mm" },
          ],
        },
        {
          id: "lti-1000",
          model: "LTI-1000",
          title: "다채널 표시기 박스",
          blurb:
            "랙 마운트형 표시기 박스. D-SUB 원격 제어, 4–20 mA 출력 옵션, 전용 PC 소프트웨어 연결용 RS-232 통신 지원. 1U / 2U / 4U 구성으로 최대 8채널까지 처리합니다.",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "LTI-1000 표시기 자리표시 이미지",
            placeholder: true,
          },
          specsHeading: "사양",
          specs: [
            { label: "입력 전원", value: "220 VAC (50–60 Hz)" },
            {
              label: "출력 전원",
              value: "±15 VDC @ 500 mA (옵션 ±24 VDC)",
            },
            { label: "표시창", value: "4자리 7-세그먼트" },
            { label: "표시 반복 정밀도", value: "≤ ±1.0 % of Full Scale" },
            { label: "출력 신호", value: "0 – 5 Vdc (옵션 4 – 20 mA)" },
            { label: "표시 단위", value: "SCCM, SLM, %" },
            { label: "원격 제어", value: "D-SUB 9-pin (male)" },
            { label: "설정값 (Set-Point)", value: "0 – 5 Vdc for full scale" },
            { label: "유량 ON/OFF", value: "TTL input signal" },
            // TODO(translation): "Relay Contact Rate" — confirm "릴레이 접점 정격"
            { label: "릴레이 접점 정격", value: "1 relay (max 24 Vdc @ 1 A)" },
            { label: "통신", value: "RS-232 (9600 baud, 8-N-1)" },
            { label: "외형 치수", value: "147.82 × 250 × 88 mm" },
            {
              label: "채널 수",
              value: "최대 8채널 (Ch 1–8), PC 소프트웨어 경유",
            },
          ],
        },
      ],
    },
    pressure: {
      kicker: "02 — 압력 부속품",
      title: "컨트롤러 입력 전 가스 조건 조정.",
      sub: "고압 반도체 및 공정 라인은 MFC가 허용하는 범위를 크게 상회하는 100–200 bar로 가스를 공급하는 경우가 많습니다. FC-050S는 공급 압력을 MFC가 수용 가능한 수준까지 낮추며, PR-030은 더 상류에 위치하여 압력 충격으로부터 라인을 보호합니다.",
      items: [
        {
          id: "fc-050s",
          model: "FC-050S",
          title: "고압 가스 · 액체 유량 제어기",
          blurb:
            "100 bar 입력을 받아 95–97 bar로 MFC 입구에 공급하며, 3–5 bar의 차압을 자동으로 유지하는 상류 압력 조절기. 15–300 bar 공급 압력 범위에서 동작하며 내부식성 사양입니다.",
          image: {
            src: FC_050S_IMAGE_SRC,
            alt: "FC-050S 고압 유량 제어기",
          },
          specsHeading: "사양",
          specs: [
            { label: "자동 제어 차압", value: "3 – 5 Barg" },
            { label: "가스 유량 범위", value: "25 sccm – 50 slpm" },
            { label: "동작 압력 범위", value: "15 – 300 Barg" },
            { label: "필요 차압", value: "15 Barg" },
            { label: "동작 온도 범위", value: "-20 – 30 °C" },
            // TODO(translation): "Application: Corrosion-resistant" —
            // confirm "적용 사양: 내부식성" (vs "용도: 내부식성")
            { label: "적용 사양", value: "내부식성" },
          ],
          integration: {
            heading: "통합 방식",
            body: "FC-050S는 고압 공급 라인과 MFC 사이에 설치됩니다 — 가스는 약 100 bar로 유입되어 95–97 bar로 감압된 뒤 MFC로 공급되고, MFC는 시스템 또는 반응기에 유량을 계량합니다. 본체 상단의 캡 포트는 100 bar 정격입니다. MFC가 필요 없는 경우에는 동일한 조절기로 수동 유량 조절 밸브에도 공급할 수 있습니다.",
          },
        },
        {
          id: "pr-030",
          model: "PR-030",
          title: "압력 충격 보호기",
          blurb:
            "최소 유량 이하에서 자동으로 차단되고 전 영역 유량에서 다시 개방되는 압력 저항기. 200 bar 라인에서는 FC-050S 앞단에 설치하며, 압력 충격을 단독으로 완충해야 하는 환경에서는 단독으로 사용합니다.",
          image: {
            src: PR_030_IMAGE_SRC,
            alt: "PR-030 압력 충격 보호기",
          },
          specsHeading: "사양",
          specs: [
            { label: "자동 차단 차압", value: "> 15 Barg" },
            { label: "자동 개방 차압", value: "0.5 – 8 Barg" },
            { label: "최대 가스 유량 범위", value: "30 slpm" },
            { label: "최대 동작 압력", value: "< 300 Bar" },
            { label: "차단 시 가스 유량 범위", value: "< 0.3 – 5 slpm" },
            { label: "필요 차압", value: "15 Barg" },
            { label: "동작 온도 범위", value: "-20 – 100 °C" },
            { label: "적용 사양", value: "내부식성" },
          ],
          integration: {
            heading: "통합 방식",
            // TODO(translation): "pressure surge" rendered as "압력 서지" —
            // could also be "압력 급변" or "급격한 압력 상승" depending on house style
            body: "200 bar 공급 라인에서는 PR-030이 가장 앞단에 위치하여, 다른 장비가 압력을 받기 전에 먼저 강하시킵니다. 일반적인 구성에서는 가스가 200 bar로 유입되어 PR-030을 거쳐 FC-050S(195–197 bar로 조정)를 통과한 뒤 최종적으로 MFC에 도달합니다. 유량이 최소 임계치 이하로 떨어지면 밸브가 자동으로 차단되고 전 영역 유량에서 다시 개방되어, 압력 서지가 하류 장비에 전달되는 것을 방지합니다.",
          },
        },
      ],
    },
    contact: {
      kicker: "03 — 문의",
      title: "통합 지원이 필요하신가요?",
      body: "본 부속품들은 규격에 맞춰 출하되지만, 적합한 조합은 공급 압력, 가스 종류, 목표 유량 범위에 따라 달라집니다. 라인 조건을 알려주시면 부품 목록과 견적을 회신해 드립니다.",
      cta: "문의하기",
      href: "/contact",
    },
  },

  // ─── Chinese ──────────────────────────────────────────────────────────────
  zh: {
    navHeading: "本页内容",
    nav: [
      {
        id: "readouts",
        href: "#readouts",
        label: "显示器",
        children: [
          { id: "lti-200", href: "#lti-200", label: "LTI-200" },
          { id: "lti-1000", href: "#lti-1000", label: "LTI-1000" },
        ],
      },
      {
        id: "pressure-accessories",
        href: "#pressure-accessories",
        label: "压力配件",
        children: [
          { id: "fc-050s", href: "#fc-050s", label: "FC-050S" },
          { id: "pr-030", href: "#pr-030", label: "PR-030" },
        ],
      },
      { id: "contact", href: "#contact", label: "联系" },
    ],
    breadcrumbAccessories: "配件",
    hero: {
      kicker: "配件",
      title: "显示器和压力配件。",
      lede: "与 MFC 与 MFM 产品线配套使用的辅助设备 — 实时显示流量的面板显示器，以及在气体到达控制器之前进行压力调节的上游压力调节器。这些不是独立的流量产品，而是为了让本目录中其他产品在实际安装环境中正常运行而存在。",
    },
    readouts: {
      kicker: "01 — 显示器",
      title: "面板安装式实时流量信号显示器。",
      sub: "两款 LTI 设备均可接收任一 Line Tech MFC 或 MFM 的 0–5 V 输出信号，在 4 位 7 段数码管上显示流量。请按外形选择 — 紧凑型面板一体式（LTI-200）或带 PC 软件的机架式（LTI-1000）。",
      items: [
        {
          id: "lti-200",
          model: "LTI-200",
          title: "显示器箱",
          blurb:
            "紧凑型面板安装式显示器。4 位 7 段数码管显示，0–5 Vdc 设定值输入，前面板 6 按键支持流量启停、滚动与菜单操作。",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "LTI-200 显示器占位图",
            placeholder: true,
          },
          specsHeading: "规格",
          specs: [
            { label: "输入电源", value: "15 Vdc – 24 Vdc" },
            { label: "输出电源", value: "+15 Vdc @ 500 mA" },
            { label: "显示窗口", value: "4 位 7 段数码管" },
            // TODO(translation): "Display Repeatability" — confirm "显示重复精度"
            { label: "显示重复精度", value: "≤ ±1.0 % of Full Scale" },
            { label: "输出信号", value: "0 – 5 Vdc" },
            { label: "显示单位", value: "SCCM, SLM, %" },
            { label: "设定值 (Set-Point)", value: "0 – 5 Vdc for full scale" },
            { label: "流量启停", value: "TTL input signal" },
            { label: "流量输出信号", value: "0 – 5 Vdc" },
            { label: "通信", value: "RS-485 (可选)" },
            { label: "外壳尺寸", value: "104 × 38 mm" },
          ],
        },
        {
          id: "lti-1000",
          model: "LTI-1000",
          title: "多通道显示器箱",
          blurb:
            "机架式显示器箱。支持 D-SUB 远程控制、可选 4–20 mA 输出，以及通过 RS-232 与配套 PC 软件通信。1U / 2U / 4U 机架结构，最多支持 8 通道。",
          image: {
            src: LTI_PLACEHOLDER_SRC,
            alt: "LTI-1000 显示器占位图",
            placeholder: true,
          },
          specsHeading: "规格",
          specs: [
            { label: "输入电源", value: "220 VAC (50–60 Hz)" },
            {
              label: "输出电源",
              value: "±15 VDC @ 500 mA (可选 ±24 VDC)",
            },
            { label: "显示窗口", value: "4 位 7 段数码管" },
            { label: "显示重复精度", value: "≤ ±1.0 % of Full Scale" },
            { label: "输出信号", value: "0 – 5 Vdc (可选 4 – 20 mA)" },
            { label: "显示单位", value: "SCCM, SLM, %" },
            { label: "远程控制", value: "D-SUB 9-pin (公头)" },
            { label: "设定值 (Set-Point)", value: "0 – 5 Vdc for full scale" },
            { label: "流量启停", value: "TTL input signal" },
            // TODO(translation): "Relay Contact Rate" — confirm "继电器触点参数"
            { label: "继电器触点参数", value: "1 relay (max 24 Vdc @ 1 A)" },
            { label: "通信", value: "RS-232 (9600 baud, 8-N-1)" },
            { label: "外形尺寸", value: "147.82 × 250 × 88 mm" },
            { label: "通道数", value: "最多 8 通道 (Ch 1–8)，经 PC 软件" },
          ],
        },
      ],
    },
    pressure: {
      kicker: "02 — 压力配件",
      title: "在到达控制器前对气体进行调节。",
      sub: "高压半导体与工艺线常以 100–200 bar 供气，远超 MFC 的输入范围。FC-050S 将供气压力降至 MFC 可接受的水平；PR-030 位于更上游，保护管线免受压力冲击。",
      items: [
        {
          id: "fc-050s",
          model: "FC-050S",
          title: "高压气体 · 液体流量控制器",
          blurb:
            "上游压力调节器，将 100 bar 进气压力降至 95–97 bar 并供给 MFC 入口，自动维持 3–5 bar 差压。在 15–300 bar 进气压力范围内运行，耐腐蚀。",
          image: {
            src: FC_050S_IMAGE_SRC,
            alt: "FC-050S 高压流量控制器",
          },
          specsHeading: "规格",
          specs: [
            { label: "自动控制差压", value: "3 – 5 Barg" },
            { label: "气体流量范围", value: "25 sccm – 50 slpm" },
            { label: "工作压力范围", value: "15 – 300 Barg" },
            { label: "所需差压", value: "15 Barg" },
            { label: "工作温度范围", value: "-20 – 30 °C" },
            // TODO(translation): "Application: Corrosion-resistant" —
            // confirm "适用: 耐腐蚀" (vs "应用: 耐腐蚀" or "适用工况: 耐腐蚀")
            { label: "适用", value: "耐腐蚀" },
          ],
          integration: {
            heading: "集成方式",
            body: "FC-050S 安装于高压供气管路与 MFC 之间 — 气体以约 100 bar 进入，调节器将其降至 95–97 bar，调节后的管线供给 MFC，再由 MFC 向系统或反应器计量流量。本体顶部的封盖端口耐压 100 bar。在不需要 MFC 的情况下，相同的调节器也可向手动流量控制阀供气。",
          },
        },
        {
          id: "pr-030",
          model: "PR-030",
          title: "压力冲击保护器",
          blurb:
            "在最低流量阈值以下自动关闭、在全量程流量下重新开启的压力阻力器。200 bar 管线中安装于 FC-050S 上游，需要单独缓冲压力冲击的场景下也可独立使用。",
          image: {
            src: PR_030_IMAGE_SRC,
            alt: "PR-030 压力冲击保护器",
          },
          specsHeading: "规格",
          specs: [
            { label: "自动关闭差压", value: "> 15 Barg" },
            { label: "自动开启差压", value: "0.5 – 8 Barg" },
            { label: "最大气体流量范围", value: "30 slpm" },
            { label: "最大工作压力", value: "< 300 Bar" },
            { label: "关闭时气体流量范围", value: "< 0.3 – 5 slpm" },
            { label: "所需差压", value: "15 Barg" },
            { label: "工作温度范围", value: "-20 – 100 °C" },
            { label: "适用", value: "耐腐蚀" },
          ],
          integration: {
            heading: "集成方式",
            body: "在 200 bar 供气管路中，PR-030 位于最前端，先于其他设备承受压力前对其进行降压。典型连接顺序为：气体以 200 bar 进入，经 PR-030，再经 FC-050S（调至 195–197 bar），最终进入 MFC。当流量低于最小阈值时阀门自动关闭，达到全量程流量时重新开启，防止压力冲击传至下游设备。",
          },
        },
      ],
    },
    contact: {
      kicker: "03 — 联系",
      title: "需要集成支持？",
      body: "这些配件按规格出厂，但合适的搭配取决于您的供气压力、气体种类与目标流量范围。请告知管线条件，我们将回复零件清单与报价。",
      cta: "联系我们",
      href: "/contact",
    },
  },
};
