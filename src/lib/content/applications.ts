import type { Locale } from "./home";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApplicationEntry = {
  slug: string;
  title: string;
  lede: string;
  body: string[];
  recommendedSeries: string[];
  relatedCategories: Array<"analogue" | "digital" | "specialized">;
};

export type ApplicationsContent = {
  pageTitle: string;
  pageSub: string;
  gridHeading: string;
  relatedHeading: string;
  contactCta: string;
  contactCtaHref: string;
  applications: ApplicationEntry[];
};

// ─── Content ─────────────────────────────────────────────────────────────────

export const LT_APPLICATIONS: Record<Locale, ApplicationsContent> = {
  en: {
    pageTitle: "Applications",
    pageSub:
      "Line Tech MFCs and MFMs are deployed across a broad range of industries that require precise, reliable gas flow measurement and control.",
    gridHeading: "Industries we serve",
    relatedHeading: "Recommended products",
    contactCta: "Discuss your application",
    contactCtaHref: "/contact",
    applications: [
      {
        slug: "semiconductor",
        title: "Semiconductor",
        lede: "Precise dopant and precursor gas delivery is critical in wafer fabrication — even sub-percent flow errors affect device yield.",
        body: [
          "In semiconductor manufacturing, mass flow controllers regulate the delivery of process gases — dopants, etchants, and chemical vapour deposition (CVD) precursors — into reaction chambers with tight repeatability. Any deviation in flow rate directly impacts film thickness, doping concentration, and ultimately device performance.",
          "Line Tech's MD Digital series, with ±0.25% F.S. accuracy and sub-second response, is well suited to precision deposition and etch steps. The proven M/MS Analogue series handles high-volume gas lines where wide flow ranges (up to 5,000 slpm) and long-term stability are the priority.",
          "All instruments are available with Kalrez or Teflon seals for aggressive semiconductor gases including HF, BCl₃, and ClF₃.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fuel-cells",
        title: "Fuel cells",
        lede: "Hydrogen and reactant gas feed rates must be metered accurately to maintain cell efficiency and prevent membrane damage.",
        body: [
          "Fuel cell systems — whether PEM, solid oxide, or alkaline — depend on controlled delivery of hydrogen, oxygen, and inert purge gases across each cell stack. An MFC on each gas line ensures the stoichiometric ratios required for peak power output while protecting membranes from over-pressure or starvation conditions.",
          "The M/MS Analogue series covers the wide flow ranges typical of stack-level hydrogen feeds. For lower-pressure laboratory fuel cell testing rigs, the LM MEMS series offers a cost-efficient option with fast response and a compact footprint.",
          "Line Tech supplies both MFC and MFM variants, making it straightforward to build measurement-only monitoring loops alongside controlled feed lines in the same system.",
        ],
        recommendedSeries: ["M / MS", "LM"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "biotech-pharmaceutical",
        title: "Biotech & pharmaceutical",
        lede: "Bioreactor gas sparging and cleanroom inert-gas blanketing demand consistent, repeatable flow that can be validated against regulatory standards.",
        body: [
          "Bioprocess applications include sparging CO₂ and O₂ into fermenters and bioreactors to support cell culture, blanketing tanks with N₂ to prevent oxidation, and supplying calibrated gas mixtures for analytical reference systems. All require instruments that maintain specification over long production campaigns.",
          "The MD Digital series' ±0.25% F.S. accuracy and RS-485 communication facilitate data logging and batch record compliance. The M/MS Analogue series is the established choice for non-critical blanketing and purge lines where a simple analogue signal is sufficient.",
          "Viton seals are standard for pharmaceutical process gases; Kalrez is available for more aggressive sterilisation agents on request.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "chemical-petrochemical",
        title: "Chemical & petrochemical",
        lede: "High-pressure reactor feed lines, flammable process gases, and aggressive chemicals require instruments built for demanding environments.",
        body: [
          "Chemical and petrochemical plants use mass flow controllers to meter reactant gases, carrier gases, and catalyst regeneration streams across reactors operating at high pressure. The wide operating pressure range of Line Tech instruments (up to 90 bar for M/MS and MD series) makes them a direct fit for most reactor inlet conditions.",
          "Where the process atmosphere contains flammable or explosive gases — such as hydrogen, hydrocarbons, or solvent vapours — the EX series provides the required ATEX certification (Ex ec IIC T4 Gc) and IP 65 protection. It covers flow ranges up to 1,000 slpm.",
          "Seal material selection is critical in chemical service: Kalrez for most corrosive halide gases, Teflon for the most aggressive oxidisers. Line Tech's gas-conversion Appendix covers over 100 process gases with seal recommendations.",
        ],
        recommendedSeries: ["EX", "M / MS"],
        relatedCategories: ["specialized", "analogue"],
      },
      {
        slug: "precision-gas-blending",
        title: "Precision gas blending",
        lede: "Specialty gas mixtures and calibration standards require flow accuracy that is traceable and verifiable across the full blend composition.",
        body: [
          "Gas blending systems — whether producing certified reference gas mixtures, multi-component calibration standards, or specialty process gases — rely on tightly controlled individual component flows. The final mixture composition is only as accurate as the individual MFCs or MFMs in each gas line.",
          "The MD Digital series, with ±0.25% F.S. accuracy at low ranges, is the recommended choice for high-precision blending. Its 8-point linearisation ensures accuracy across the full operating range of each component flow, not just at a single calibration point.",
          "Line Tech's sonic-nozzle calibration system (uncertainty ±0.2%) provides the measurement traceability required by gas-mixture certification standards. RS-485 communication on MD instruments allows direct integration with blend-management software.",
        ],
        recommendedSeries: ["MD"],
        relatedCategories: ["digital"],
      },
      {
        slug: "research-development",
        title: "Research & development",
        lede: "Laboratory and pilot-plant gas systems need flexibility across a wide range of gases, flow rates, and configurations.",
        body: [
          "R&D environments typically involve frequent reconfiguration — new gases, new flow ranges, and new experimental conditions. The breadth of the Line Tech product range means that a single supplier can cover flows from 0.01 sccm to 5,000 slpm across analogue, digital, and specialist configurations.",
          "The LD series is particularly useful in standalone laboratory setups: the built-in 7-segment display and front-panel setpoint adjustment eliminate the need for a separate controller or PC, making it easy to operate a single instrument independently on a bench.",
          "The LM MEMS series offers a cost-efficient option for low-pressure lab gas lines — useful when a large number of instruments are needed to instrument a multi-channel experiment without a high per-channel cost.",
        ],
        recommendedSeries: ["LD", "LM", "MD"],
        relatedCategories: ["specialized", "digital"],
      },
      {
        slug: "metals-processing",
        title: "Metals processing",
        lede: "Annealing, carburising, and sintering furnaces depend on controlled protective and reactive gas atmospheres to produce consistent metallurgical results.",
        body: [
          "Heat treatment processes in metals manufacturing use precisely controlled gas atmospheres — typically nitrogen, hydrogen, ammonia, or endothermic gas mixtures — to achieve specific surface chemistry and mechanical properties. An incorrect gas ratio can result in surface defects, decarburisation, or improper case hardening.",
          "The M/MS Analogue series, with flow ranges extending to 5,000 slpm, covers the high-volume purge and atmosphere flows typical of continuous furnace lines. The instruments' wide operating pressure tolerance (up to 90 bar) accommodates the varying supply pressures found across industrial gas distribution systems.",
          "For processes involving flammable atmospheres such as hydrogen or cracked ammonia, the EX series provides the ATEX-compliant protection required in those zones.",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "led-lighting",
        title: "LED lighting",
        lede: "Epitaxial growth of LED structures requires sub-percent flow control over MOCVD precursor and carrier gases to achieve target wavelength and efficiency.",
        body: [
          "Metal-organic chemical vapour deposition (MOCVD) for LED production demands extremely precise delivery of metalorganic precursors (TMGa, TMAl, TMIn) and hydride sources (AsH₃, PH₃, NH₃) alongside hydrogen and nitrogen carrier gases. Any variation in precursor flow directly shifts the bandgap of the deposited layer and therefore the emission wavelength.",
          "The MD Digital series offers the ±0.25% F.S. accuracy and fast response required by MOCVD reactors, and its RS-485 interface integrates cleanly with reactor control systems for logging and recipe management.",
          "Kalrez seals are recommended for corrosive hydride precursor gases; Viton is adequate for hydrogen and nitrogen carrier lines.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "solar-photovoltaic",
        title: "Solar & photovoltaic",
        lede: "Thin-film silicon and perovskite solar cell deposition processes rely on controlled precursor and dopant gas delivery to achieve target conversion efficiency.",
        body: [
          "Silicon solar cells are produced using plasma-enhanced CVD (PECVD) or thermal CVD processes that deposit amorphous or polycrystalline silicon layers from silane (SiH₄), diborane (B₂H₆), and phosphine (PH₃) precursors. Precise flow control over these toxic and reactive gases is essential for consistent film quality across large substrates.",
          "Line Tech's MD series provides the accuracy required for process recipe control, while the M/MS series handles the larger nitrogen and hydrogen purge flows surrounding the deposition chamber. All instruments used with toxic precursor gases are ordered with appropriate Kalrez or Teflon seals.",
          "The RS-485 communication on MD instruments supports integration with process control systems for recipe management and batch data logging.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fiber-optics",
        title: "Fiber optics & glass",
        lede: "Optical fibre preform manufacturing and specialty glass deposition require tightly controlled precursor and dopant gas flows to achieve target refractive index profiles.",
        body: [
          "Modified chemical vapour deposition (MCVD) and outside vapour deposition (OVD) processes used in optical fibre production deposit silica and dopant layers from SiCl₄, GeCl₄, and POCl₃ precursors with oxygen carrier gas. The refractive index profile of the fibre — which determines its transmission characteristics — is set by the ratio of these precursor flows.",
          "Line Tech's M/MS Analogue series covers the stable, long-run flow control needed during the preform deposition phase. The MD Digital series is preferred for the dopant lines where high precision is most critical.",
          "Chloride precursor gases require Kalrez or Teflon seals, and Line Tech's published seal recommendations cover all standard optical fibre process gases.",
        ],
        recommendedSeries: ["M / MS", "MD"],
        relatedCategories: ["analogue", "digital"],
      },
      {
        slug: "surface-treatment",
        title: "Gas injection & surface treatment",
        lede: "Plasma surface treatment, physical vapour deposition, and thermal spray processes all require controlled gas injection into the treatment zone.",
        body: [
          "Surface treatment processes use controlled gas flows to generate and sustain plasma discharges, create reactive coating atmospheres, or carry powdered materials in thermal spray systems. Applications include plasma nitriding, PVD/CVD hard coating, atmospheric plasma cleaning, and thermal spray.",
          "The M/MS Analogue series is widely used for argon, nitrogen, and oxygen flows in PVD and plasma systems. For processes in areas classified as hazardous due to flammable carrier gases or solvents, the EX series meets the ATEX requirements of the zone.",
          "Line Tech's wide product range — from 0.01 sccm to 5,000 slpm — covers both the fine dopant injection lines and the high-volume carrier and purge flows in a single instrument family.",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "leak-detection",
        title: "Component leak detection",
        lede: "Accurate flow measurement at low flow rates is the basis for detecting seal failures and sub-threshold leaks in pressurised systems.",
        body: [
          "Component leak detection systems use a calibrated flow measurement to quantify leakage through seals, valves, or joints in pressurised assemblies. By measuring the residual flow across a nominally closed component and comparing it to a known leak-rate threshold, the test system identifies non-conforming parts.",
          "The MD Digital series, with ±0.25% F.S. accuracy at low ranges (down to 0.01 slpm), provides the resolution needed to detect small leaks reliably. Its RS-485 interface allows direct data capture and pass/fail logging in automated test stations.",
          "For leak testing with inert tracer gases such as helium or nitrogen, standard Viton seals are appropriate. The M/MS Analogue series is an alternative where lower accuracy requirements and analogue signal integration are acceptable.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
    ],
  },

  ko: {
    pageTitle: "응용 분야",
    pageSub:
      "라인테크 MFC·MFM은 정밀하고 신뢰할 수 있는\n가스 유량 측정 및 제어가 필요한\n다양한 산업 현장에서 사용되고 있습니다.",
    gridHeading: "적용 산업",
    relatedHeading: "추천 제품",
    contactCta: "응용 분야 문의하기",
    contactCtaHref: "/contact",
    applications: [
      {
        slug: "semiconductor",
        title: "반도체",
        lede: "웨이퍼 제조 공정에서 도펀트 및 전구체 가스의 정밀한 공급은 수율에 직결됩니다.",
        body: [
          "반도체 제조 공정에서 질량유량 제어기는 도펀트, 식각 가스, 화학기상증착(CVD) 전구체 등 공정 가스를 반응 챔버에 높은 재현성으로 공급합니다. 유량의 미세한 편차도 막 두께, 도핑 농도, 나아가 소자 성능에 직접적인 영향을 미칩니다.",
          "±0.25% F.S. 정확도와 1초 미만 응답을 갖춘 MD 디지털 시리즈는 정밀 증착 및 식각 공정에 적합합니다. 검증된 M/MS 아날로그 시리즈는 최대 5,000 slpm의 넓은 유량 범위와 장기 안정성이 우선되는 대용량 가스 라인에 적합합니다.",
          "HF, BCl₃, ClF₃ 등 반도체 공정용 부식성 가스에는 Kalrez 또는 Teflon 실을 선택할 수 있습니다.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fuel-cells",
        title: "연료전지",
        lede: "수소 및 반응 가스 공급 유량을 정밀하게 계량해야 셀 효율을 유지하고 막 손상을 방지할 수 있습니다.",
        body: [
          "PEM, 고체산화물 또는 알칼리형 연료전지 시스템은 각 셀 스택에 수소, 산소, 불활성 퍼지 가스를 정확히 공급해야 합니다. 가스 라인마다 MFC를 적용하면 최대 출력에 필요한 화학양론적 비율을 유지하면서 막 과압 및 공급 부족 상황을 방지할 수 있습니다.",
          "M/MS 아날로그 시리즈는 스택 수준의 수소 공급에서 요구되는 넓은 유량 범위를 커버합니다. 저압 실험실용 연료전지 테스트 리그에는 빠른 응답과 컴팩트한 폼팩터를 갖춘 LM MEMS 시리즈가 비용 효율적인 선택입니다.",
          "라인테크는 MFC와 MFM을 모두 제공하므로, 같은 시스템 안에서 제어 공급 라인과 측정 전용 모니터링 루프를 간편하게 구성할 수 있습니다.",
        ],
        recommendedSeries: ["M / MS", "LM"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "biotech-pharmaceutical",
        title: "바이오텍 · 제약",
        lede: "바이오리액터 가스 스파징과 클린룸 불활성 가스 블랭킷은 규제 기준 검증이 가능한 일관된 재현 유량을 요구합니다.",
        body: [
          "바이오공정 응용에는 세포 배양을 위한 발효조·바이오리액터에의 CO₂·O₂ 스파징, 산화 방지를 위한 N₂ 탱크 블랭킷, 분석 기준 시스템용 교정 가스 혼합물 공급 등이 포함됩니다. 장기 생산 캠페인 전반에 걸쳐 사양을 유지하는 기기가 필요합니다.",
          "MD 디지털 시리즈의 ±0.25% F.S. 정확도와 RS-485 통신은 데이터 로깅과 배치 레코드 준수를 용이하게 합니다. M/MS 아날로그 시리즈는 간단한 아날로그 신호로 충분한 비핵심 블랭킷·퍼지 라인에 검증된 선택입니다.",
          "제약 공정 가스에는 Viton 실이 기본이며, 보다 부식성이 강한 멸균 가스에는 Kalrez를 주문 시 선택할 수 있습니다.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "chemical-petrochemical",
        title: "화학 · 석유화학",
        lede: "고압 반응기 공급 라인, 가연성 공정 가스, 부식성 화학물질은 까다로운 환경에 맞춰 설계된 기기를 필요로 합니다.",
        body: [
          "화학·석유화학 플랜트에서는 고압으로 운전되는 반응기의 반응물 가스, 캐리어 가스, 촉매 재생 스트림을 계량하기 위해 질량유량 제어기가 사용됩니다. M/MS 및 MD 시리즈의 광범위한 동작 압력 범위(최대 90 bar)는 대부분의 반응기 입구 조건에 바로 적용할 수 있습니다.",
          "수소, 탄화수소, 용제 증기 등 가연성 또는 폭발성 가스가 있는 공정 환경에서는 EX 시리즈가 필요한 ATEX 인증(Ex ec IIC T4 Gc)과 IP 65 보호를 제공합니다. 최대 1,000 slpm까지 제공합니다.",
          "화학 서비스에서는 실링 재질 선택이 매우 중요합니다. 대부분의 부식성 할라이드 가스에는 Kalrez, 가장 강한 산화제에는 Teflon을 사용하십시오. 라인테크의 가스 변환 부록에는 100가지 이상의 공정 가스에 대한 실링 권장 사항이 수록되어 있습니다.",
        ],
        recommendedSeries: ["EX", "M / MS"],
        relatedCategories: ["specialized", "analogue"],
      },
      {
        slug: "precision-gas-blending",
        title: "정밀 가스 혼합",
        lede: "특수 가스 혼합물 및 교정 표준 가스는 전체 혼합 조성에 걸쳐 추적 가능하고 검증 가능한 유량 정확도를 요구합니다.",
        body: [
          "인증 기준 가스 혼합물, 다성분 교정 표준, 또는 특수 공정 가스를 생산하는 가스 블렌딩 시스템은 각 가스 라인의 성분 유량을 정밀하게 제어합니다. 최종 혼합물의 조성 정확도는 개별 MFC 또는 MFM의 정확도에 의해 결정됩니다.",
          "저유량 범위에서 ±0.25% F.S. 정확도를 갖춘 MD 디지털 시리즈는 고정밀 블렌딩에 권장됩니다. 8포인트 선형화는 단일 교정 포인트만이 아닌 전체 동작 범위에서 각 성분 유량의 정확도를 보장합니다.",
          "라인테크의 소닉 노즐 교정 시스템(불확도 ±0.2%)은 가스 혼합물 인증 표준이 요구하는 측정 추적성을 제공합니다. MD 기기의 RS-485 통신은 블렌딩 관리 소프트웨어와의 직접 연동을 지원합니다.",
        ],
        recommendedSeries: ["MD"],
        relatedCategories: ["digital"],
      },
      {
        slug: "research-development",
        title: "연구 · 개발",
        lede: "실험실 및 파일럿 플랜트 가스 시스템은 다양한 가스, 유량 범위, 구성에 걸친 유연성을 필요로 합니다.",
        body: [
          "R&D 환경에서는 새로운 가스, 새로운 유량 범위, 새로운 실험 조건으로 빈번하게 재구성이 이루어집니다. 라인테크 제품 라인의 폭넓은 범위 덕분에 아날로그, 디지털, 특수 사양을 망라한 0.01 sccm부터 5,000 slpm까지의 유량을 단일 공급사에서 해결할 수 있습니다.",
          "LD 시리즈는 독립형 실험실 설비에 특히 유용합니다. 내장 7세그먼트 디스플레이와 전면 패널 설정값 조절 기능 덕분에 별도의 컨트롤러나 PC 없이 벤치 위에서 단독으로 기기를 쉽게 운용할 수 있습니다.",
          "LM MEMS 시리즈는 저압 실험실 가스 라인에 비용 효율적인 선택으로, 다채널 실험에 많은 수의 기기가 필요할 때 채널당 비용을 절감할 수 있습니다.",
        ],
        recommendedSeries: ["LD", "LM", "MD"],
        relatedCategories: ["specialized", "digital"],
      },
      {
        slug: "metals-processing",
        title: "금속 가공",
        lede: "소둔, 침탄 및 소결 용광로는 일관된 야금 결과를 얻기 위해 제어된 보호·반응 가스 분위기에 의존합니다.",
        body: [
          "금속 제조의 열처리 공정은 특정 표면 화학과 기계적 특성을 달성하기 위해 정밀하게 제어된 가스 분위기(일반적으로 질소, 수소, 암모니아, 또는 흡열 가스 혼합물)를 사용합니다. 가스 비율이 잘못되면 표면 결함, 탈탄, 또는 불균일한 케이스 경화가 발생할 수 있습니다.",
          "M/MS 아날로그 시리즈는 최대 5,000 slpm의 유량 범위로 연속 용광로 라인의 대용량 퍼지 및 분위기 가스 흐름을 커버합니다. 넓은 동작 압력 허용 범위(최대 90 bar)는 산업용 가스 배관 시스템의 다양한 공급 압력에 적응합니다.",
          "수소나 분해 암모니아와 같은 가연성 분위기를 수반하는 공정의 경우, EX 시리즈가 해당 구역에 필요한 ATEX 규격 보호를 제공합니다.",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "led-lighting",
        title: "LED 조명",
        lede: "LED 구조의 에피택셜 성장은 목표 파장과 효율을 달성하기 위해 MOCVD 전구체 및 캐리어 가스에 대한 1% 미만의 유량 제어를 요구합니다.",
        body: [
          "LED 생산을 위한 유기금속 화학기상증착(MOCVD)은 수소 및 질소 캐리어 가스와 함께 유기금속 전구체(TMGa, TMAl, TMIn) 및 수소화물 소스(AsH₃, PH₃, NH₃)를 매우 정밀하게 공급해야 합니다. 전구체 유량의 변화는 증착층의 밴드갭을 직접 변화시켜 발광 파장에 영향을 미칩니다.",
          "MD 디지털 시리즈는 MOCVD 반응기에 필요한 ±0.25% F.S. 정확도와 빠른 응답을 제공하며, RS-485 인터페이스는 로깅 및 레시피 관리를 위한 반응기 제어 시스템과 원활하게 연동됩니다.",
          "부식성 수소화물 전구체 가스에는 Kalrez 실을 권장하며, 수소 및 질소 캐리어 라인에는 Viton으로 충분합니다.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "solar-photovoltaic",
        title: "태양광 · 태양전지",
        lede: "박막 실리콘 및 페로브스카이트 태양전지 증착 공정은 목표 변환 효율을 달성하기 위해 전구체 및 도펀트 가스 공급을 정밀하게 제어해야 합니다.",
        body: [
          "실리콘 태양전지는 실란(SiH₄), 디보란(B₂H₆), 포스핀(PH₃) 전구체로 비정질 또는 다결정 실리콘 층을 증착하는 PECVD 또는 열 CVD 공정으로 생산됩니다. 이러한 독성 및 반응성 가스에 대한 정밀한 유량 제어는 대면적 기판 전반에 걸친 일관된 막 품질을 위해 필수적입니다.",
          "MD 시리즈는 공정 레시피 제어에 필요한 정확도를 제공하며, M/MS 시리즈는 증착 챔버 주변의 대용량 질소·수소 퍼지 가스를 처리합니다. 독성 전구체 가스에 사용되는 모든 기기는 적절한 Kalrez 또는 Teflon 실로 주문됩니다.",
          "MD 기기의 RS-485 통신은 레시피 관리 및 배치 데이터 로깅을 위한 공정 제어 시스템과의 연동을 지원합니다.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fiber-optics",
        title: "광섬유 · 유리",
        lede: "광섬유 프리폼 제조 및 특수 유리 증착에는 목표 굴절률 프로파일을 달성하기 위해 전구체 및 도펀트 가스 유량을 정밀하게 제어해야 합니다.",
        body: [
          "광섬유 생산에 사용되는 MCVD 및 OVD 공정은 SiCl₄, GeCl₄, POCl₃ 전구체와 산소 캐리어 가스로 실리카 및 도펀트 층을 증착합니다. 광섬유의 굴절률 프로파일(전송 특성을 결정)은 이러한 전구체 가스 유량의 비율에 의해 결정됩니다.",
          "M/MS 아날로그 시리즈는 프리폼 증착 단계에서 필요한 안정적인 장기 유량 제어를 커버합니다. 정밀도가 가장 중요한 도펀트 라인에는 MD 디지털 시리즈가 적합합니다.",
          "염화물 전구체 가스에는 Kalrez 또는 Teflon 실이 필요하며, 라인테크의 공개된 실링 권장 사항에는 모든 표준 광섬유 공정 가스가 포함되어 있습니다.",
        ],
        recommendedSeries: ["M / MS", "MD"],
        relatedCategories: ["analogue", "digital"],
      },
      {
        slug: "surface-treatment",
        title: "가스 분사 · 표면 처리",
        lede: "플라즈마 표면 처리, 물리기상증착, 용사 코팅 공정은 모두 처리 구역에 제어된 가스 분사를 필요로 합니다.",
        body: [
          "표면 처리 공정은 제어된 가스 흐름을 사용하여 플라즈마 방전을 생성 및 유지하거나, 반응성 코팅 분위기를 형성하거나, 용사 코팅 시스템에서 분말 재료를 운반합니다. 적용 분야로는 플라즈마 질화, PVD/CVD 경질 코팅, 대기압 플라즈마 세정, 용사 코팅 등이 있습니다.",
          "M/MS 아날로그 시리즈는 PVD 및 플라즈마 시스템의 아르곤, 질소, 산소 가스 흐름에 널리 사용됩니다. 가연성 캐리어 가스나 용제로 인해 위험 구역으로 분류된 공정 환경에서는 EX 시리즈가 해당 구역의 ATEX 요구 사항을 충족합니다.",
          "라인테크의 광범위한 제품 라인(0.01 sccm~5,000 slpm)은 미세 도펀트 분사 라인과 대용량 캐리어·퍼지 가스 흐름을 단일 제품군으로 모두 커버합니다.",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "leak-detection",
        title: "부품 누설 검사",
        lede: "저유량에서의 정확한 유량 측정은 가압 시스템의 씰 불량 및 임계값 미만 누설을 감지하는 기반입니다.",
        body: [
          "부품 누설 검사 시스템은 가압된 조립품의 씰, 밸브, 또는 이음 부위를 통한 누설량을 정량화하기 위해 교정된 유량 측정을 사용합니다. 명목상 닫혀 있는 부품을 통과하는 잔류 흐름을 측정하고 알려진 누설 허용 임계값과 비교함으로써 불량 부품을 식별합니다.",
          "저유량 범위(최소 0.01 slpm)에서 ±0.25% F.S. 정확도를 갖춘 MD 디지털 시리즈는 소량 누설을 신뢰성 있게 감지하는 데 필요한 분해능을 제공합니다. RS-485 인터페이스는 자동화 검사 스테이션에서 직접 데이터 수집 및 합격/불합격 판정 로깅을 가능하게 합니다.",
          "헬륨이나 질소와 같은 불활성 트레이서 가스를 이용한 누설 검사에는 표준 Viton 실이 적합합니다. 낮은 정확도 요건과 아날로그 신호 연동이 허용되는 경우에는 M/MS 아날로그 시리즈도 대안이 됩니다.",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
    ],
  },

  zh: {
    pageTitle: "应用领域",
    pageSub:
      "莱因 MFC 与 MFM 广泛应用于需要精确、可靠气体流量测量与控制的各类工业场合。",
    gridHeading: "服务的行业",
    relatedHeading: "推荐产品",
    contactCta: "咨询您的应用",
    contactCtaHref: "/contact",
    applications: [
      {
        slug: "semiconductor",
        title: "半导体",
        lede: "晶圆制造中掺杂剂和前驱体气体的精确输送对良率至关重要——即使是低于百分之一的流量误差也会影响器件性能。",
        body: [
          "在半导体制造中，质量流量控制器以高重复性将工艺气体——掺杂剂、刻蚀气体和化学气相沉积（CVD）前驱体——输送到反应腔。流量的任何偏差都会直接影响薄膜厚度、掺杂浓度，进而影响器件性能。",
          "具备 ±0.25% F.S. 精度和亚秒级响应的 MD 数字系列非常适合精密沉积和刻蚀工序。经过验证的 M/MS 模拟系列则适用于大流量气体管线，覆盖高达 5,000 slpm 的宽流量范围，并具备优异的长期稳定性。",
          "针对 HF、BCl₃、ClF₃ 等半导体工艺腐蚀性气体，可选配 Kalrez 或 Teflon 密封件。",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fuel-cells",
        title: "燃料电池",
        lede: "必须对氢气和反应气体的供给流量进行精确计量，以维持电池效率并防止膜损坏。",
        body: [
          "无论是 PEM、固体氧化物还是碱性燃料电池系统，都需要对每个电堆中的氢气、氧气和惰性吹扫气体进行精确控制。在每条气体管线上配置 MFC，可在防止膜过压或气体供给不足的同时，维持最大功率输出所需的化学计量比。",
          "M/MS 模拟系列覆盖电堆级氢气供应所需的宽流量范围。对于低压实验室燃料电池测试台，LM MEMS 系列提供响应快速、外形紧凑的高性价比选择。",
          "莱因同时提供 MFC 和 MFM 两种形式，便于在同一系统中同时构建受控供气管线和纯测量监控回路。",
        ],
        recommendedSeries: ["M / MS", "LM"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "biotech-pharmaceutical",
        title: "生物技术与制药",
        lede: "生物反应器气体鼓泡和洁净室惰性气体覆盖需要可核查、可重复的稳定流量，以满足法规标准。",
        body: [
          "生物工艺应用包括：向发酵罐和生物反应器中鼓入 CO₂ 和 O₂ 以支持细胞培养、用 N₂ 覆盖储罐以防止氧化，以及为分析参考系统提供经校准的混合气体。这些应用都需要在长期生产周期内保持仪器规格不变。",
          "MD 数字系列的 ±0.25% F.S. 精度和 RS-485 通信便于数据记录和批次记录合规。M/MS 模拟系列是简单模拟信号即可满足需求的非关键覆盖和吹扫管线的成熟选择。",
          "制药工艺气体标准密封为 Viton；腐蚀性更强的灭菌介质可按需订购 Kalrez 密封件。",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "chemical-petrochemical",
        title: "化工与石油化工",
        lede: "高压反应器进料管线、易燃工艺气体和强腐蚀性化学品需要专为恶劣环境设计的仪器。",
        body: [
          "化工和石油化工厂使用质量流量控制器对在高压下运行的反应器中的反应物气体、载气和催化剂再生气流进行计量。莱因仪器的宽工作压力范围（M/MS 和 MD 系列最高 90 bar）使其直接适用于大多数反应器入口条件。",
          "当工艺环境含有易燃或爆炸性气体（如氢气、烃类或溶剂蒸气）时，EX 系列提供所需的 ATEX 认证（Ex ec IIC T4 Gc）和 IP 65 防护，最大流量可达 1,000 slpm。",
          "化工应用中密封材料的选择至关重要：大多数腐蚀性卤化物气体选用 Kalrez，腐蚀性最强的氧化剂选用 Teflon。莱因气体换算附录涵盖 100 余种工艺气体的密封推荐。",
        ],
        recommendedSeries: ["EX", "M / MS"],
        relatedCategories: ["specialized", "analogue"],
      },
      {
        slug: "precision-gas-blending",
        title: "精密气体混合",
        lede: "特种气体混合物和校准标准气要求在整个混合组成范围内具备可溯源、可验证的流量精度。",
        body: [
          "气体混合系统——无论是生产认证参考气体混合物、多组分校准标准气还是特种工艺气体——都依赖对各组分流量的精密控制。最终混合物的组成精度取决于每条气体管线上各台 MFC 或 MFM 的精度。",
          "在低流量范围具备 ±0.25% F.S. 精度的 MD 数字系列是高精度混合的推荐选择。其 8 点线性化确保在整个工作范围内而非仅在单一校准点保持各组分流量的精度。",
          "莱因声速喷嘴校准系统（不确定度 ±0.2%）提供气体混合物认证标准所要求的计量溯源性。MD 仪器的 RS-485 通信支持与混气管理软件的直接集成。",
        ],
        recommendedSeries: ["MD"],
        relatedCategories: ["digital"],
      },
      {
        slug: "research-development",
        title: "研究与开发",
        lede: "实验室和中试工厂气体系统需要在各种气体、流量范围和配置之间具备灵活性。",
        body: [
          "研发环境通常需要频繁重新配置——新气体、新流量范围和新实验条件。莱因产品系列的宽广覆盖意味着一家供应商即可满足从 0.01 sccm 到 5,000 slpm 的模拟、数字和特殊规格各类配置需求。",
          "LD 系列在独立实验室配置中尤为实用：内置 7 段显示屏和前面板设定值调节功能使单台仪器可在工作台上独立操作，无需单独的控制器或 PC。",
          "LM MEMS 系列为低压实验室气体管线提供高性价比选择——当多通道实验需要大量仪器时，可有效降低单通道成本。",
        ],
        recommendedSeries: ["LD", "LM", "MD"],
        relatedCategories: ["specialized", "digital"],
      },
      {
        slug: "metals-processing",
        title: "金属加工",
        lede: "退火、渗碳和烧结炉依靠受控的保护性和反应性气体气氛来获得一致的冶金结果。",
        body: [
          "金属制造中的热处理工艺使用精确控制的气体气氛——通常为氮气、氢气、氨气或吸热气体混合物——来实现特定的表面化学成分和力学性能。气体比例不当会导致表面缺陷、脱碳或不均匀的渗碳硬化。",
          "M/MS 模拟系列流量范围延伸至 5,000 slpm，可覆盖连续炉生产线上典型的大流量吹扫和气氛气体流量。宽工作压力容差（最高 90 bar）可适应工业气体配送系统中不同的供气压力。",
          "对于涉及氢气或裂解氨等可燃气氛的工艺，EX 系列提供这些区域所需的 ATEX 合规防护。",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "led-lighting",
        title: "LED 照明",
        lede: "LED 结构的外延生长需要对 MOCVD 前驱体和载气进行低于百分之一的精密流量控制，以实现目标波长和效率。",
        body: [
          "用于 LED 生产的金属有机化学气相沉积（MOCVD）需要极其精确地输送有机金属前驱体（TMGa、TMAl、TMIn）和氢化物源（AsH₃、PH₃、NH₃），同时配合氢气和氮气载气。任何前驱体流量变化都会直接改变沉积层的带隙，从而影响发射波长。",
          "MD 数字系列提供 MOCVD 反应器所需的 ±0.25% F.S. 精度和快速响应，其 RS-485 接口与反应器控制系统无缝集成，支持记录和配方管理。",
          "腐蚀性氢化物前驱体气体推荐使用 Kalrez 密封件；氢气和氮气载气管线使用 Viton 即可满足要求。",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "solar-photovoltaic",
        title: "太阳能与光伏",
        lede: "薄膜硅和钙钛矿太阳能电池沉积工艺依赖精确控制前驱体和掺杂剂气体输送，以实现目标转换效率。",
        body: [
          "硅太阳能电池采用 PECVD 或热 CVD 工艺，以硅烷（SiH₄）、乙硼烷（B₂H₆）和磷化氢（PH₃）为前驱体沉积非晶或多晶硅层。对这些有毒且具反应性气体的精确流量控制对于大面积基板上一致的薄膜质量至关重要。",
          "MD 系列提供工艺配方控制所需的精度；M/MS 系列处理沉积腔周围的大流量氮气和氢气吹扫气体。所有用于有毒前驱体气体的仪器均配备相应的 Kalrez 或 Teflon 密封件。",
          "MD 仪器的 RS-485 通信支持与工艺控制系统集成，实现配方管理和批次数据记录。",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
      {
        slug: "fiber-optics",
        title: "光纤与玻璃",
        lede: "光纤预制棒制造和特种玻璃沉积需要精密控制前驱体和掺杂剂气体流量，以实现目标折射率分布。",
        body: [
          "光纤生产中使用的 MCVD 和 OVD 工艺以 SiCl₄、GeCl₄ 和 POCl₃ 前驱体配合氧气载体沉积二氧化硅和掺杂剂层。光纤的折射率分布（决定其传输特性）由这些前驱体气体流量的比率决定。",
          "M/MS 模拟系列覆盖预制棒沉积阶段所需的稳定长期流量控制。对于精度要求最高的掺杂剂管线，推荐使用 MD 数字系列。",
          "氯化物前驱体气体需要 Kalrez 或 Teflon 密封件；莱因公开的密封推荐涵盖所有标准光纤工艺气体。",
        ],
        recommendedSeries: ["M / MS", "MD"],
        relatedCategories: ["analogue", "digital"],
      },
      {
        slug: "surface-treatment",
        title: "气体注入与表面处理",
        lede: "等离子体表面处理、物理气相沉积和热喷涂工艺都需要向处理区注入受控气体。",
        body: [
          "表面处理工艺利用受控气流产生和维持等离子体放电、形成反应性涂层气氛或在热喷涂系统中输送粉末材料。应用包括等离子氮化、PVD/CVD 硬质涂层、常压等离子体清洁和热喷涂。",
          "M/MS 模拟系列广泛用于 PVD 和等离子体系统中的氩气、氮气和氧气流量控制。对于因易燃载气或溶剂而被划定为危险区域的工艺环境，EX 系列满足该区域的 ATEX 要求。",
          "莱因的宽广产品范围（0.01 sccm 至 5,000 slpm）以单一产品系列同时覆盖精细掺杂剂注入管线和大流量载气及吹扫气体流量。",
        ],
        recommendedSeries: ["M / MS", "EX"],
        relatedCategories: ["analogue", "specialized"],
      },
      {
        slug: "leak-detection",
        title: "元器件泄漏检测",
        lede: "低流量下的精确流量测量是检测承压系统密封失效和低于阈值泄漏的基础。",
        body: [
          "元器件泄漏检测系统利用经校准的流量测量对承压组件的密封件、阀门或接头处的泄漏量进行定量。通过测量名义上关闭的元器件残余流量并与已知泄漏率阈值对比，检测系统识别不合格零件。",
          "在低流量范围（低至 0.01 slpm）具备 ±0.25% F.S. 精度的 MD 数字系列提供可靠检测小泄漏所需的分辨率。RS-485 接口支持在自动化测试站中直接采集数据并记录合格/不合格判定结果。",
          "使用氦气或氮气等惰性示踪气体进行泄漏测试时，标准 Viton 密封件即可满足要求。当精度要求较低且可接受模拟信号集成时，M/MS 模拟系列也是可选方案。",
        ],
        recommendedSeries: ["MD", "M / MS"],
        relatedCategories: ["digital", "analogue"],
      },
    ],
  },
};
