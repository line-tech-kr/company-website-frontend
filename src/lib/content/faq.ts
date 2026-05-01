import type { Locale } from "./home";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FaqQuestion = {
  id: string;
  q: string;
  a: string;
};

export type FaqGroup = {
  id: string;
  heading: string;
  questions: FaqQuestion[];
};

export type FaqContent = {
  pageTitle: string;
  pageSub: string;
  navHeading: string;
  groups: FaqGroup[];
};

// ─── Content ─────────────────────────────────────────────────────────────────

export const LT_FAQ: Record<Locale, FaqContent> = {
  en: {
    pageTitle: "Frequently asked questions",
    pageSub:
      "Technical and commercial answers about Line Tech MFCs and MFMs — sourced from our product catalog and service team.",
    navHeading: "Topics",
    groups: [
      {
        id: "basics",
        heading: "MFC vs MFM basics",
        questions: [
          {
            id: "mfc-vs-mfm-difference",
            q: "What is the difference between an MFC and an MFM?",
            a: "A Mass Flow Controller (MFC) actively regulates the flow of gas to a commanded setpoint using a built-in proportional valve. A Mass Flow Meter (MFM) measures flow passively — it outputs a signal proportional to the measured flow rate but cannot adjust it. Both devices use the same thermal mass flow sensing technology and share identical pressure and temperature ratings within the same series.",
          },
          {
            id: "mfc-vs-mfm-choose",
            q: "How do I choose between an MFC and an MFM?",
            a: "Use an MFC when you need to actively set and maintain a precise gas flow rate — typical in semiconductor deposition, fuel cell gas feeds, or any closed-loop flow control process. Use an MFM when you only need to monitor flow without controlling it, such as in process verification or analytical instrumentation. Most multi-gas systems use several MFCs — one per gas line — with an optional readout box for centralised display.",
          },
        ],
      },
      {
        id: "service",
        heading: "Service & support",
        questions: [
          {
            id: "warranty",
            q: "What warranty do Line Tech products carry?",
            a: "All Line Tech products and accessories carry a one-year warranty from the date of original purchase, covering defects in materials and workmanship when used in accordance with the operation manual. For warranty claims and general support inquiries, contact linetech@line-tech.co.kr or call +82-42-624-0700.",
          },
          {
            id: "after-sales-services",
            q: "What after-sales services does Line Tech provide?",
            a: "Line Tech offers a full range of post-sale services: repair, parts and unit replacement, on-site or return-to-factory instrument recalibration to restore factory-specified accuracy, and on-site or remote technical consultation for troubleshooting. Customer training seminars are also available to support in-house engineering teams.",
          },
          {
            id: "on-site-support",
            q: "Does Line Tech offer on-site technical support?",
            a: "Yes. Line Tech engineers provide on-site troubleshooting and consultation to diagnose process issues, verify installation, and restore instrument performance. Remote consultation is also available. Contact linetech@line-tech.co.kr to arrange a site visit.",
          },
          {
            id: "request-repair",
            q: "How do I request a repair or recalibration?",
            a: "Contact Line Tech at linetech@line-tech.co.kr or +82-42-624-0700. Describe the instrument model, the issue observed, and your process conditions. The service team will advise whether on-site or return-to-factory service is more appropriate, and arrange calibration traceable to Line Tech's sonic-nozzle standard (system uncertainty ±0.2%).",
          },
          {
            id: "training",
            q: "Does Line Tech offer customer training?",
            a: "Yes. Line Tech offers customer seminars and technical training covering installation, calibration procedures, gas conversion calculations, and maintenance best practices. Training can be arranged for engineering and maintenance teams — reach out via the contact page to discuss format and scheduling.",
          },
        ],
      },
      {
        id: "series",
        heading: "Choosing a series",
        questions: [
          {
            id: "series-overview",
            q: "What are the main product series and how do I choose?",
            a: "Line Tech produces five series: M/MS (Analogue) — proven controllers and meters covering 0.01–5,000 slpm; MD (Digital) — RS-485 communication, 8-point calibration, and sub-second response; LD (Specialized) — built-in 7-segment display for direct monitoring; LM (Specialized) — MEMS-based, cost-efficient, suited to low-pressure applications below 10 bar; and EX (Specialized) — explosion-proof (Ex ec IIC T4 Gc, IP 65) for hazardous environments. All series cover both MFC and MFM variants.",
          },
          {
            id: "m-vs-ms",
            q: "What is the difference between the M and MS variants?",
            a: "The M and MS series are identical in specification — same flow ranges, accuracy (±1% F.S.), and operating conditions. The MS variant uses a smaller PCB footprint, suited to space-constrained enclosures or panel installations. Choose MS when board space is limited; otherwise both are interchangeable.",
          },
          {
            id: "md-vs-analogue",
            q: "When should I use the Digital (MD) series instead of Analogue (M/MS)?",
            a: "The MD series offers three advantages over M/MS: higher accuracy at low ranges (±0.25% F.S. via 8-point linearisation versus ±1% F.S.), faster response time (0.5–1 second versus under 2 seconds), and RS-485 digital communication for remote monitoring and setpoint control. Choose MD when tighter accuracy, faster control loop, or digital integration with a PLC or PC is required.",
          },
          {
            id: "lm-series",
            q: "What is the LM (MEMS) series best for?",
            a: "The LM series uses MEMS sensor technology to offer a cost-efficient instrument for low-pressure applications. It delivers the same ±1% F.S. accuracy and ±0.25% repeatability as the standard series, with a slightly faster response (under 1 second). The key constraint is a maximum operating pressure of 10 bar — it is not suitable for high-pressure lines. The LM is recognisable by its purple housing.",
          },
          {
            id: "ld-series",
            q: "When should I use the LD series with built-in display?",
            a: "The LD series adds a built-in 4-digit 7-segment display showing live flow values, plus front-panel buttons for direct setpoint adjustment — no external controller or PC required. It is ideal for standalone laboratory setups, field calibration checks, or anywhere real-time visibility without a readout box is needed. Note the LD supports only 0–5 Vdc signalling (no 4–20 mA option) and is limited to a maximum range of 30 slpm.",
          },
          {
            id: "ex-series",
            q: "What does explosion-proof mean for the EX series?",
            a: "The EX series is certified for use in potentially explosive atmospheres, carrying Ex ec IIC T4 Gc (ATEX/IEC) certification and IP 65 ingress protection against dust and water. It is the correct choice when the process environment contains flammable vapours, gases, or dusts requiring ATEX-rated equipment — typical in chemical plants, petrochemical lines, and solvent-based coating operations. Available for flow ranges up to 1,000 slpm.",
          },
        ],
      },
      {
        id: "accuracy",
        heading: "Accuracy & calibration",
        questions: [
          {
            id: "fs-accuracy",
            q: "What does ±1% F.S. accuracy mean?",
            a: "F.S. stands for Full Scale — the maximum rated flow for the selected range. An accuracy of ±1% F.S. means the reading may deviate by up to 1% of the full-scale value at any point. For example, an instrument rated to 30 slpm has an absolute error of ±0.3 slpm. For ranges above 100 slpm in the M/MS analogue series the specification widens to ±2% F.S. The MD Digital series achieves ±0.25% F.S. at low-flow ranges through 8-point linearisation.",
          },
          {
            id: "accuracy-vs-repeatability",
            q: "What is the difference between accuracy and repeatability?",
            a: "Accuracy describes how close the instrument's reading is to the true value — it governs absolute measurement error. Repeatability describes how consistently the instrument returns the same reading under the same conditions across multiple measurements — it governs long-term stability. All Line Tech series carry ±0.25% repeatability regardless of accuracy rating, indicating strong consistency in sustained operation.",
          },
          {
            id: "calibration-method",
            q: "How are Line Tech instruments calibrated?",
            a: "Line Tech uses a sonic-nozzle calibration system with 14 nozzles, covering 0.02–3,000 slpm at regulated supply pressures of 0–6 bar. The system achieves an overall uncertainty of ±0.2% — tighter than any product accuracy specification, ensuring full measurement traceability. This calibration infrastructure also underpins the 8-point linearisation used in the MD Digital series.",
          },
        ],
      },
      {
        id: "gases",
        heading: "Gas compatibility",
        questions: [
          {
            id: "other-gases",
            q: "Can I use my MFC/MFM with gases other than nitrogen?",
            a: "Yes. All Line Tech instruments are calibrated using nitrogen (N₂) as the reference gas but can be used with over 100 different gases by applying a published conversion factor. The formula is: Actual flow = Instrument reading × (Factor of actual gas ÷ Factor of N₂). Gas factors and seal material recommendations for each gas are listed in the Appendix of the product catalog.",
          },
          {
            id: "gas-conversion",
            q: "How do I apply the gas conversion factor?",
            a: "Locate the conversion factor for your gas in the Appendix. Multiply the displayed reading by the gas factor to obtain the actual mass flow of that gas. Example: instrument reads 75 sccm and the gas is CO₂ (factor = 0.74) → actual CO₂ flow = 75 × 0.74 = 55.5 sccm. Always verify readings after installation under actual process conditions.",
          },
          {
            id: "gas-mixture",
            q: "How do I calculate the setpoint for a gas mixture?",
            a: "Calculate the mixture factor using the weighted-harmonic formula: Mixture SCF = 100 ÷ (P₁/SCF₁ + P₂/SCF₂ + … + Pₙ/SCFₙ), where P is the volume percentage of each component and SCF is its individual gas factor. Use the resulting mixture factor the same way as a single-gas factor. Example: for 20% He + 80% Cl₂, the mixture factor is approximately 0.95, so setting the instrument to 21.05 slpm delivers 20 slpm of the mixture.",
          },
          {
            id: "seal-material",
            q: "Which seal material should I choose for my process gas?",
            a: "Viton is the standard choice for most neutral and mildly reactive gases (N₂, He, Ar, CO₂, H₂). Kalrez is recommended for aggressive gases such as HF, H₂S, BCl₃, and BF₃. Teflon is required for the most corrosive gases including Br₂ and interhalogen compounds. Fluorine (F₂) requires metal seals. Full recommendations are in the Appendix — always confirm compatibility before ordering.",
          },
        ],
      },
      {
        id: "installation",
        heading: "Installation & operation",
        questions: [
          {
            id: "pre-use",
            q: "What preparation is needed before using an MFC/MFM?",
            a: "Before first use: verify the gas flow direction arrow on the instrument body; for corrosive or flammable gases, purge the system with dry N₂ to displace moisture and confirm no leakage; clean the pipe interior with high-pressure gas before connecting; and mount in a location free from mechanical vibration and physical damage. All inlet and outlet connections are standard VCR male type.",
          },
          {
            id: "warmup",
            q: "How long is the warm-up time after installation?",
            a: "Allow at least 45 minutes after powering on before making flow measurements or setting the zero point. The thermal sensor requires this period to reach a stable operating temperature. Temperature changes and installation conditions can shift the zero reading — set the final zero point only after the warm-up period is complete and the instrument has settled to its working environment.",
          },
          {
            id: "flow-shutoff",
            q: "Can an MFC completely stop gas flow?",
            a: "No. An MFC valve is designed for proportional control, not isolation — it cannot guarantee a complete gas shutoff. If process safety requires positive isolation, install a dedicated isolation valve upstream or downstream of the MFC. Do not rely on the MFC valve alone to stop flow in an emergency.",
          },
        ],
      },
      {
        id: "signals",
        heading: "Power & signals",
        questions: [
          {
            id: "power-supply",
            q: "What power supply is required?",
            a: "All Line Tech instruments require a regulated DC supply of +15 to +24 Vdc at up to 350 mA. Operating outside this range affects accuracy and zero stability. A stable, regulated bench or rack-mount supply is recommended — noisy or under-voltage power degrades both the zero point and the output signal.",
          },
          {
            id: "signal-types",
            q: "What analogue and digital signal types are supported?",
            a: "All Line Tech series support both 0–5 Vdc voltage and 4–20 mA current-loop signalling for flow output and MFC setpoint input. The signal mode is selected at time of order and configured at the factory. The 4–20 mA mode is preferred over long cable runs where voltage drop would degrade a 0–5 Vdc signal. The MD Digital series additionally supports RS-485 at 38,400 bps for remote monitoring and control.",
          },
        ],
      },
    ],
  },

  ko: {
    pageTitle: "자주 묻는 질문",
    pageSub:
      "라인테크 MFC · MFM에 관한 기술적·상업적 질문에 대한 답변을 제품 카탈로그와 서비스팀 기준으로 정리했습니다.",
    navHeading: "주제별 보기",
    groups: [
      {
        id: "basics",
        heading: "MFC와 MFM의 기초",
        questions: [
          {
            id: "mfc-vs-mfm-difference",
            q: "MFC(질량유량 제어기)와 MFM(질량유량 측정기)의 차이는 무엇인가요?",
            a: "MFC(질량유량 제어기)는 내장된 비례 밸브를 통해 설정값에 맞춰 가스 유량을 능동적으로 조절합니다. MFM(질량유량 측정기)은 밸브 없이 유량만 측정하여 측정된 유량에 비례하는 신호를 출력합니다. 두 기기 모두 동일한 열식 질량유량 센서 기술을 사용하며, 동일 시리즈 내에서 압력 및 온도 사양이 동일합니다.",
          },
          {
            id: "mfc-vs-mfm-choose",
            q: "MFC와 MFM 중 어떤 것을 선택해야 하나요?",
            a: "반도체 증착, 연료전지 가스 공급, 또는 폐루프 유량 제어가 필요한 공정에는 MFC를 사용하십시오. 유량 검증이나 분석 계측과 같이 유량을 조절하지 않고 모니터링만 필요한 경우에는 MFM을 사용하십시오. 다중 가스 시스템은 일반적으로 가스 라인별로 MFC를 하나씩 사용하고, 중앙 표시를 위한 리드아웃 박스를 함께 사용합니다.",
          },
        ],
      },
      {
        id: "service",
        heading: "서비스 및 지원",
        questions: [
          {
            id: "warranty",
            q: "라인테크 제품의 보증 기간은 얼마나 되나요?",
            a: "라인테크의 모든 제품과 액세서리는 최초 구매일로부터 1년간 자재 및 제조 결함에 대해 보증됩니다(사용 설명서에 따라 정상 사용 시). 보증 청구 및 일반 지원 문의는 linetech@line-tech.co.kr 또는 +82-42-624-0700으로 연락하십시오.",
          },
          {
            id: "after-sales-services",
            q: "라인테크는 어떤 사후 서비스를 제공하나요?",
            a: "라인테크는 수리, 부품 및 완제품 교체, 공장 규격을 복원하는 현장 또는 반납 재교정, 현장 또는 원격 기술 컨설팅을 포함한 완전한 사후 서비스를 제공합니다. 사내 엔지니어링 팀을 지원하기 위한 고객 기술 교육 세미나도 운영합니다.",
          },
          {
            id: "on-site-support",
            q: "라인테크 엔지니어가 현장 방문 지원을 제공하나요?",
            a: "네. 라인테크 엔지니어가 공정 문제 진단, 설치 점검, 기기 성능 복원을 위한 현장 문제 해결 및 컨설팅을 제공합니다. 원격 컨설팅도 가능합니다. 현장 방문 신청은 linetech@line-tech.co.kr로 연락하십시오.",
          },
          {
            id: "request-repair",
            q: "수리 또는 재교정은 어떻게 신청하나요?",
            a: "linetech@line-tech.co.kr 또는 +82-42-624-0700으로 연락하여 기기 모델, 발생한 문제, 공정 조건을 알려주십시오. 서비스팀이 현장 또는 반납 서비스 중 적합한 방법을 안내하며, 라인테크의 소닉 노즐 기준(시스템 불확도 ±0.2%)에 따른 교정을 진행합니다.",
          },
          {
            id: "training",
            q: "고객 교육 프로그램이 있나요?",
            a: "네. 라인테크는 설치, 교정 절차, 가스 변환 계산, 유지보수 모범 사례를 다루는 고객 세미나 및 기술 교육을 제공합니다. 엔지니어링 및 유지보수 팀을 위한 맞춤 교육도 가능합니다. 교육 형식과 일정은 문의 페이지를 통해 상담하십시오.",
          },
        ],
      },
      {
        id: "series",
        heading: "시리즈 선택 가이드",
        questions: [
          {
            id: "series-overview",
            q: "주요 제품 시리즈는 무엇이며, 어떻게 선택하나요?",
            a: "라인테크는 다섯 가지 시리즈를 제공합니다. M/MS(아날로그) — 0.01~5,000 slpm의 검증된 MFC·MFM; MD(디지털) — RS-485 통신, 8포인트 교정, 1초 미만 응답; LD(특수) — 실시간 모니터링을 위한 내장 7세그먼트 디스플레이; LM(특수) — MEMS 기반으로 10 bar 미만 저압 환경에 최적화된 비용 효율적 모델; EX(특수) — 위험 환경용 방폭 사양(Ex ec IIC T4 Gc, IP 65). 모든 시리즈에서 MFC와 MFM을 모두 제공합니다.",
          },
          {
            id: "m-vs-ms",
            q: "M 시리즈와 MS 시리즈의 차이는 무엇인가요?",
            a: "M과 MS 시리즈는 유량 범위, 정확도(±1% F.S.), 동작 조건이 동일합니다. MS는 공간이 제한된 함체나 패널 설치에 적합한 소형 PCB를 사용합니다. 공간 제약이 있으면 MS를, 그렇지 않으면 두 시리즈 모두 같은 용도로 사용할 수 있습니다.",
          },
          {
            id: "md-vs-analogue",
            q: "아날로그 M/MS 대신 디지털 MD 시리즈를 사용해야 하는 경우는 언제인가요?",
            a: "MD 시리즈는 M/MS 대비 세 가지 장점이 있습니다: 저유량 범위에서의 높은 정확도(8포인트 선형화로 ±0.25% F.S., M/MS는 ±1% F.S.), 더 빠른 응답 시간(0.5~1초, M/MS는 2초 미만), RS-485 디지털 통신으로 원격 모니터링 및 설정값 제어 가능. 더 높은 정확도, 빠른 제어 루프, 또는 PLC·PC와의 디지털 연동이 필요한 경우 MD를 선택하십시오.",
          },
          {
            id: "lm-series",
            q: "LM(MEMS) 시리즈는 어떤 용도에 가장 적합한가요?",
            a: "LM 시리즈는 MEMS 센서 기술을 사용해 저압 환경에 비용 효율적인 기기를 제공합니다. 표준 시리즈와 동일한 ±1% F.S. 정확도와 ±0.25% 재현성을 가지며, 응답 시간은 1초 미만으로 약간 더 빠릅니다. 주요 제약은 최대 동작 압력 10 bar로, 고압 라인에는 적합하지 않습니다. LM은 자주색 케이스로 구분됩니다.",
          },
          {
            id: "ld-series",
            q: "내장 디스플레이가 있는 LD 시리즈는 언제 사용하나요?",
            a: "LD 시리즈는 실시간 유량을 표시하는 내장 4자리 7세그먼트 디스플레이와 전면 패널 버튼으로 직접 설정값을 조절할 수 있어, 외부 컨트롤러나 PC 없이도 사용 가능합니다. 독립형 실험 설비, 현장 교정 확인, 또는 리드아웃 박스 없이 실시간 확인이 필요한 환경에 이상적입니다. 단, 신호는 0~5 Vdc만 지원(4~20 mA 미지원)하며 최대 범위는 30 slpm입니다.",
          },
          {
            id: "ex-series",
            q: "EX 시리즈의 방폭 인증은 무엇을 의미하나요?",
            a: "EX 시리즈는 폭발 위험 환경에서의 사용을 위해 Ex ec IIC T4 Gc(ATEX/IEC) 인증과 분진·수분에 대한 IP 65 보호 등급을 갖추고 있습니다. 화학 플랜트, 석유화학 공정, 용제 기반 코팅 작업 등 가연성 증기, 가스, 또는 분진이 있는 환경에서 ATEX 등급 기기가 필요할 때 선택하십시오. 최대 1,000 slpm까지 제공합니다.",
          },
        ],
      },
      {
        id: "accuracy",
        heading: "정확도 및 교정",
        questions: [
          {
            id: "fs-accuracy",
            q: "±1% F.S. 정확도는 어떤 의미인가요?",
            a: "F.S.는 Full Scale(최대 측정 범위)을 의미합니다. ±1% F.S. 정확도는 어느 지점에서든 지시값이 최대 측정 범위의 1%까지 오차를 가질 수 있다는 뜻입니다. 예를 들어 최대 범위 30 slpm인 기기의 절대 오차는 ±0.3 slpm입니다. M/MS 아날로그 시리즈는 100 slpm 초과 범위에서 ±2% F.S.가 적용됩니다. MD 디지털 시리즈는 8포인트 선형화를 통해 저유량 범위에서 ±0.25% F.S.를 달성합니다.",
          },
          {
            id: "accuracy-vs-repeatability",
            q: "정확도와 재현성의 차이는 무엇인가요?",
            a: "정확도는 기기의 지시값이 실제 값에 얼마나 가까운지를 나타내며, 절대 측정 오차를 결정합니다. 재현성은 동일한 조건에서 동일한 지시값을 얼마나 일관되게 반환하는지를 나타내며, 장기적인 안정성을 결정합니다. 모든 라인테크 시리즈는 정확도 등급에 관계없이 ±0.25% 재현성을 보장하여 지속 운용에서의 높은 일관성을 확인할 수 있습니다.",
          },
          {
            id: "calibration-method",
            q: "라인테크 기기는 어떻게 교정되나요?",
            a: "라인테크는 소닉 노즐 14개를 갖춘 교정 시스템으로 0.02~3,000 slpm 범위를 0~6 bar 공급 압력에서 교정합니다. 시스템 불확도는 ±0.2%로 어떤 제품 정확도 사양보다 더 정밀하여 완전한 추적성을 보장합니다. 이 교정 인프라는 MD 디지털 시리즈의 8포인트 선형화의 기반이 됩니다.",
          },
        ],
      },
      {
        id: "gases",
        heading: "가스 호환성",
        questions: [
          {
            id: "other-gases",
            q: "질소 이외의 가스에도 MFC/MFM을 사용할 수 있나요?",
            a: "네. 모든 라인테크 기기는 질소(N₂)를 기준 가스로 교정되어 있지만, 공개된 변환 계수를 적용하면 100가지 이상의 가스에 사용할 수 있습니다. 계산식은 다음과 같습니다: 실제 유량 = 기기 지시값 × (실제 가스 변환 계수 ÷ N₂ 변환 계수). 각 가스의 변환 계수와 실링 재질 권장 사항은 제품 카탈로그 부록에서 확인하십시오.",
          },
          {
            id: "gas-conversion",
            q: "가스 변환 계수는 어떻게 적용하나요?",
            a: "부록에서 해당 가스의 변환 계수를 찾은 다음, 기기 지시값에 가스 변환 계수를 곱하면 실제 질량 유량을 구할 수 있습니다. 예시: CO₂(변환 계수 = 0.74) 기준으로 지시값이 75 sccm이면, 실제 CO₂ 유량 = 75 × 0.74 = 55.5 sccm. 설치 후 실제 공정 조건에서 지시값을 반드시 확인하십시오.",
          },
          {
            id: "gas-mixture",
            q: "혼합 가스의 설정값은 어떻게 계산하나요?",
            a: "가중 조화 평균 공식으로 혼합 계수를 계산하십시오: 혼합 SCF = 100 ÷ (P₁/SCF₁ + P₂/SCF₂ + … + Pₙ/SCFₙ), 여기서 P는 각 성분의 부피 비율(%), SCF는 각 성분의 변환 계수입니다. 계산된 혼합 계수를 단일 가스 계수와 동일하게 사용하십시오. 예시: He 20% + Cl₂ 80% 혼합가스의 혼합 계수는 약 0.95이므로, 기기를 21.05 slpm으로 설정하면 실제 혼합가스 20 slpm이 공급됩니다.",
          },
          {
            id: "seal-material",
            q: "공정 가스에 맞는 실링 재질은 어떻게 선택하나요?",
            a: "대부분의 중성 및 약반응성 가스(N₂, He, Ar, CO₂, H₂)에는 Viton이 표준 선택입니다. HF, H₂S, BCl₃, BF₃와 같이 부식성이 강한 가스에는 Kalrez를 권장합니다. Br₂ 및 할로겐 간 화합물 등 가장 부식성이 강한 가스에는 Teflon이 필요합니다. 불소(F₂)는 금속 실을 사용해야 합니다. 전체 권장 사항은 카탈로그 부록을 참조하시고, 주문 전에 반드시 호환성을 확인하십시오.",
          },
        ],
      },
      {
        id: "installation",
        heading: "설치 및 운용",
        questions: [
          {
            id: "pre-use",
            q: "MFC/MFM 사용 전에 어떤 준비가 필요한가요?",
            a: "최초 사용 전: 기기 본체의 가스 흐름 방향 화살표를 확인하십시오; 부식성 또는 가연성 가스의 경우 건조 N₂로 시스템을 퍼지하여 수분을 제거하고 누설이 없는지 확인하십시오; 연결 전 고압 가스로 배관 내부를 세정하십시오; 기계적 진동과 물리적 충격이 없는 위치에 설치하십시오. 모든 입·출구 연결부는 표준 VCR 수형입니다.",
          },
          {
            id: "warmup",
            q: "설치 후 예열 시간은 얼마나 필요한가요?",
            a: "전원 투입 후 유량 측정 또는 영점 설정 전에 최소 45분의 예열 시간이 필요합니다. 열식 센서가 안정적인 동작 온도에 도달하는 데 이 시간이 필요합니다. 온도 변화와 설치 환경이 영점을 변화시킬 수 있으므로, 예열 완료 후 실제 동작 환경에서 최종 영점을 설정하십시오.",
          },
          {
            id: "flow-shutoff",
            q: "MFC가 가스 흐름을 완전히 차단할 수 있나요?",
            a: "아니요. MFC 밸브는 비례 제어용으로 설계되어 있으며, 완전한 차단은 보장되지 않습니다. 공정 안전을 위해 완전한 차단이 필요한 경우, MFC 상류 또는 하류에 별도의 차단 밸브를 설치하십시오. 비상 시 MFC 밸브만으로 가스 흐름을 멈추려 하지 마십시오.",
          },
        ],
      },
      {
        id: "signals",
        heading: "전원 및 신호",
        questions: [
          {
            id: "power-supply",
            q: "어떤 전원 공급 장치가 필요한가요?",
            a: "모든 라인테크 기기는 +15~+24 Vdc 범위의 안정적인 직류 전원(최대 350 mA)이 필요합니다. 이 범위를 벗어나면 정확도와 영점 안정성에 영향을 줍니다. 노이즈가 있거나 전압이 낮은 전원은 영점과 출력 신호를 저하시킬 수 있으므로, 안정적인 정전압 벤치형 또는 랙 마운트형 전원 공급 장치를 사용하십시오.",
          },
          {
            id: "signal-types",
            q: "아날로그 및 디지털 신호 방식은 어떤 것을 지원하나요?",
            a: "모든 라인테크 시리즈는 유량 출력 및 MFC 설정값 입력에 대해 0~5 Vdc 전압 방식과 4~20 mA 전류 루프 방식을 모두 지원합니다. 신호 방식은 주문 시 선택하여 공장에서 설정됩니다. 전압 강하가 우려되는 장거리 배선에는 4~20 mA 방식이 권장됩니다. MD 디지털 시리즈는 추가로 38,400 bps의 RS-485 디지털 통신을 지원합니다.",
          },
        ],
      },
    ],
  },

  zh: {
    pageTitle: "常见问题解答",
    pageSub:
      "以下针对莱因 MFC 与 MFM 的技术与商务问题，内容来源于产品目录及服务团队。",
    navHeading: "按主题浏览",
    groups: [
      {
        id: "basics",
        heading: "MFC 与 MFM 基础",
        questions: [
          {
            id: "mfc-vs-mfm-difference",
            q: "MFC（质量流量控制器）与 MFM（质量流量计）有何区别？",
            a: "MFC（质量流量控制器）通过内置比例阀，主动将气体流量调节至设定值。MFM（质量流量计）仅被动测量流量，输出与测量流量成比例的信号，但无法对其进行调节。两类设备均采用相同的热式质量流量传感技术，同一系列内的压力和温度额定值完全相同。",
          },
          {
            id: "mfc-vs-mfm-choose",
            q: "如何在 MFC 与 MFM 之间做出选择？",
            a: "当需要主动设定并维持精确气体流量时，选择 MFC——典型应用包括半导体沉积、燃料电池供气或任何闭环流量控制工艺。当仅需监测流量而无需控制时，选择 MFM，例如工艺验证或分析仪器。多气体系统通常每路气体线配置一台 MFC，并可选配显示单元进行集中显示。",
          },
        ],
      },
      {
        id: "service",
        heading: "服务与支持",
        questions: [
          {
            id: "warranty",
            q: "莱因产品提供怎样的保修服务？",
            a: "莱因所有产品及配件自原始购买之日起提供一年保修，在按照操作手册正常使用的前提下，涵盖材料和工艺缺陷。保修申请及技术支持请联系 linetech@line-tech.co.kr 或拨打 +82-42-624-0700。",
          },
          {
            id: "after-sales-services",
            q: "莱因提供哪些售后服务？",
            a: "莱因提供全面的售后服务，包括：维修、零部件及整机更换、恢复出厂精度的现场或返厂重新校准，以及现场或远程技术咨询。同时还为客户工程团队提供技术培训研讨会。",
          },
          {
            id: "on-site-support",
            q: "莱因是否提供现场技术支持？",
            a: "是的。莱因工程师提供现场故障排查与咨询服务，帮助诊断工艺问题、验证安装情况并恢复仪器性能。同时也提供远程咨询。请通过 linetech@line-tech.co.kr 预约现场服务。",
          },
          {
            id: "request-repair",
            q: "如何申请维修或重新校准服务？",
            a: "请联系 linetech@line-tech.co.kr 或 +82-42-624-0700，并告知仪器型号、所观察到的问题及工艺条件。服务团队将评估现场服务或返厂服务的适合性，并按照莱因声速喷嘴标准（系统不确定度 ±0.2%）安排校准。",
          },
          {
            id: "training",
            q: "莱因是否提供客户技术培训？",
            a: "是的。莱因提供涵盖安装、校准流程、气体换算和维护最佳实践的客户研讨会与技术培训。可为工程和维护团队定制培训内容——请通过联系页面沟通培训形式与时间安排。",
          },
        ],
      },
      {
        id: "series",
        heading: "系列选型指南",
        questions: [
          {
            id: "series-overview",
            q: "莱因有哪些主要产品系列，该如何选择？",
            a: "莱因提供五个系列：M/MS（模拟系列）——覆盖 0.01~5,000 slpm 的成熟 MFC 与 MFM；MD（数字系列）——RS-485 通信、8 点校准、亚秒级响应；LD（特殊系列）——内置 7 段显示屏，支持直接监控；LM（特殊系列）——MEMS 技术，性价比高，适用于 10 bar 以下低压场合；EX（特殊系列）——防爆认证（Ex ec IIC T4 Gc，IP 65），适用于危险环境。所有系列均提供 MFC 和 MFM 两种形式。",
          },
          {
            id: "m-vs-ms",
            q: "M 系列与 MS 系列有何不同？",
            a: "M 与 MS 系列规格完全相同——流量范围、精度（±1% F.S.）和工作条件均一致。MS 采用更小的 PCB，适合空间受限的机柜或面板安装。当安装空间有限时选择 MS；否则两者可互换使用。",
          },
          {
            id: "md-vs-analogue",
            q: "何时应选择数字 MD 系列而非模拟 M/MS？",
            a: "MD 系列相较 M/MS 具备三项优势：低流量范围的更高精度（8 点线性化达 ±0.25% F.S.，M/MS 为 ±1% F.S.）；更快的响应时间（0.5~1 秒，M/MS 低于 2 秒）；RS-485 数字通信，支持远程监控与设定值控制。当需要更高精度、更快控制回路或与 PLC/PC 数字集成时，选择 MD。",
          },
          {
            id: "lm-series",
            q: "LM（MEMS）系列最适合哪些应用？",
            a: "LM 系列采用 MEMS 传感器技术，为低压场合提供高性价比的仪器。其精度（±1% F.S.）与重复性（±0.25%）与标准系列相同，响应时间更快（低于 1 秒）。主要限制是最高工作压力为 10 bar，不适用于高压管线。LM 系列以紫色外壳为识别特征。",
          },
          {
            id: "ld-series",
            q: "何时应选择带内置显示屏的 LD 系列？",
            a: "LD 系列内置 4 位 7 段显示屏实时显示流量值，并配有前面板按键直接调节设定值，无需外部控制器或 PC。适合独立实验室配置、现场校准验证，或任何需要实时可视化但不具备显示单元的场合。请注意：LD 仅支持 0~5 Vdc 信号（不支持 4~20 mA），最大量程为 30 slpm。",
          },
          {
            id: "ex-series",
            q: "EX 系列的防爆认证意味着什么？",
            a: "EX 系列通过 Ex ec IIC T4 Gc（ATEX/IEC）认证，具备 IP 65 防尘防水等级，适用于潜在爆炸性气氛环境。当工艺环境含有易燃蒸气、气体或粉尘，需要 ATEX 认证设备时，应选择 EX 系列——常见于化工厂、石化生产线和溶剂基涂装作业。最大流量可达 1,000 slpm。",
          },
        ],
      },
      {
        id: "accuracy",
        heading: "精度与校准",
        questions: [
          {
            id: "fs-accuracy",
            q: "±1% F.S. 精度是什么意思？",
            a: "F.S. 代表满量程（所选量程的最大流量）。±1% F.S. 精度意味着在任意点，示值偏差最大可达满量程的 1%。例如，量程为 30 slpm 的仪器绝对误差为 ±0.3 slpm。M/MS 模拟系列在 100 slpm 以上量程时精度放宽至 ±2% F.S.。MD 数字系列通过 8 点线性化在低流量范围实现 ±0.25% F.S. 精度。",
          },
          {
            id: "accuracy-vs-repeatability",
            q: "精度与重复性有何区别？",
            a: "精度描述仪器示值与真实值的接近程度，决定绝对测量误差。重复性描述在相同条件下多次测量的一致性，决定长期稳定性。无论精度等级如何，莱因所有系列均保证 ±0.25% 的重复性，体现了持续运行中的高度一致性。",
          },
          {
            id: "calibration-method",
            q: "莱因仪器是如何校准的？",
            a: "莱因采用配备 14 个声速喷嘴的校准系统，在 0~6 bar 调节压力下覆盖 0.02~3,000 slpm 流量范围。系统不确定度为 ±0.2%，优于任何产品精度规格，确保完整的计量溯源性。该校准基础设施也支撑了 MD 数字系列的 8 点线性化校准。",
          },
        ],
      },
      {
        id: "gases",
        heading: "气体兼容性",
        questions: [
          {
            id: "other-gases",
            q: "MFC/MFM 能否用于氮气以外的气体？",
            a: "可以。所有莱因仪器均以氮气（N₂）为基准气体进行校准，但通过应用公开的转换系数，可用于 100 多种不同气体。计算公式为：实际流量 = 仪器示值 × (实际气体系数 ÷ N₂ 系数)。各气体的转换系数和密封材料推荐见产品目录附录。",
          },
          {
            id: "gas-conversion",
            q: "如何应用气体转换系数？",
            a: "在附录中查找所用气体的转换系数，将仪器示值乘以该系数即可得到实际质量流量。示例：仪器示值为 75 sccm，通入气体为 CO₂（系数 = 0.74），则实际 CO₂ 流量 = 75 × 0.74 = 55.5 sccm。安装完成后请在实际工艺条件下验证读数。",
          },
          {
            id: "gas-mixture",
            q: "如何计算混合气体的设定值？",
            a: "使用加权调和公式计算混合系数：混合 SCF = 100 ÷ (P₁/SCF₁ + P₂/SCF₂ + … + Pₙ/SCFₙ)，其中 P 为各组分的体积百分比，SCF 为各组分的气体系数。将所得混合系数与单一气体系数同样使用。示例：20% He + 80% Cl₂ 混合气的混合系数约为 0.95，设定仪器为 21.05 slpm 即可供应 20 slpm 的混合气体。",
          },
          {
            id: "seal-material",
            q: "如何为工艺气体选择合适的密封材料？",
            a: "对于大多数惰性及弱反应性气体（N₂、He、Ar、CO₂、H₂），Viton 是标准选择。对于 HF、H₂S、BCl₃、BF₃ 等强腐蚀性气体，推荐使用 Kalrez。对于 Br₂ 及卤素间化合物等腐蚀性最强的气体，需使用 Teflon。氟气（F₂）需要金属密封件。完整推荐见目录附录——下单前请务必确认兼容性。",
          },
        ],
      },
      {
        id: "installation",
        heading: "安装与操作",
        questions: [
          {
            id: "pre-use",
            q: "使用 MFC/MFM 前需要做哪些准备？",
            a: "首次使用前：确认仪器本体上的气体流向箭头；对于腐蚀性或易燃气体，用干燥 N₂ 吹扫系统以排除水分并确认无泄漏；连接前用高压气体清洁管道内部；安装在远离机械振动和物理损伤的位置。所有进出口连接均为标准 VCR 外螺纹。",
          },
          {
            id: "warmup",
            q: "安装后需要多长的预热时间？",
            a: "上电后，在进行流量测量或设置零点前，至少需要 45 分钟的预热时间，以使热式传感器达到稳定的工作温度。温度变化和安装条件可能导致零点漂移——应在预热完成且仪器适应工作环境后再设置最终零点。",
          },
          {
            id: "flow-shutoff",
            q: "MFC 能否完全切断气体流量？",
            a: "不能。MFC 阀门设计用于比例控制，无法保证完全截止气体。如工艺安全需要正向隔离，应在 MFC 上游或下游另外安装截止阀。紧急情况下不要仅依赖 MFC 阀门来停止气体流动。",
          },
        ],
      },
      {
        id: "signals",
        heading: "电源与信号",
        questions: [
          {
            id: "power-supply",
            q: "需要什么电源？",
            a: "所有莱因仪器需要 +15~+24 Vdc 稳定直流供电，电流最高 350 mA。超出此范围将影响精度和零点稳定性。建议使用稳定的稳压台式或机架式电源——电源噪声或欠压会影响零点和输出信号质量。",
          },
          {
            id: "signal-types",
            q: "支持哪些模拟和数字信号类型？",
            a: "所有莱因系列的流量输出和 MFC 设定值输入均支持 0~5 Vdc 电压信号和 4~20 mA 电流环路信号。信号类型在下单时选择并由工厂配置。对于可能存在电压降的长距离接线，推荐使用 4~20 mA 模式。MD 数字系列另外支持 38,400 bps 的 RS-485 数字通信，用于远程监控与控制。",
          },
        ],
      },
    ],
  },
};
