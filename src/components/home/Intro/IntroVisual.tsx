import { Fragment } from "react";

// Editorial hero: M3030VA silhouette centered in negative space, single
// floating live tag, three-value spec strip below. Subtle pulses on
// inlet and outlet pipes; everything else is calm.

const ID = "iv";

function DeviceDefs() {
  return (
    <Fragment>
      <linearGradient id={`${ID}_tower`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1a1a1d" />
        <stop offset=".55" stopColor="#2c2c30" />
        <stop offset="1" stopColor="#0e0e10" />
      </linearGradient>
      <linearGradient id={`${ID}_base`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9ccd1" />
        <stop offset=".45" stopColor="#9ea2a8" />
        <stop offset="1" stopColor="#7c8087" />
      </linearGradient>
      <linearGradient id={`${ID}_chrome`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a4a8ad" />
        <stop offset=".5" stopColor="#e3e5e8" />
        <stop offset="1" stopColor="#787c82" />
      </linearGradient>
      <radialGradient id={`${ID}_wash`} cx="50%" cy="50%" r="60%">
        <stop offset="0" stopColor="var(--pd-primary)" stopOpacity=".05" />
        <stop offset="1" stopColor="var(--pd-primary)" stopOpacity="0" />
      </radialGradient>
    </Fragment>
  );
}

function DeviceSilhouette({ cx, cy }: { cx: number; cy: number }) {
  const tw = 92;
  const th = 168;
  const cylW = 50;
  const cylH = 138;
  const baseW = 188;
  const baseH = 40;
  const towerX = cx - tw / 2;
  const towerY = cy - th / 2;
  const cylX = towerX + tw + 6;
  const cylY = towerY + (th - cylH) * 0.16;
  const baseX = cx - baseW / 2 - 4;
  const baseY = towerY + th;
  const dsubX = towerX + 14;
  const dsubY = towerY - 22;
  const dsubW = tw - 28;
  const dsubH = 22;

  return (
    <g>
      <rect x={baseX} y={baseY} width={baseW} height={baseH} fill={`url(#${ID}_base)`} stroke="#3a3d42" strokeWidth="1.1" />
      <line x1={baseX + 6} y1={baseY + 14} x2={baseX + baseW - 6} y2={baseY + 14} stroke="#3a3d42" strokeWidth=".5" opacity=".55" />
      <line x1={baseX + 6} y1={baseY + baseH - 12} x2={baseX + baseW - 6} y2={baseY + baseH - 12} stroke="#3a3d42" strokeWidth=".5" opacity=".4" />

      <rect x={baseX - 28} y={baseY + 8} width="22" height="24" fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth="1" />
      <rect x={baseX + baseW + 6} y={baseY + 8} width="22" height="24" fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth="1" />
      <rect x={baseX - 6} y={baseY + 12} width="6" height="16" fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth=".7" />
      <rect x={baseX + baseW} y={baseY + 12} width="6" height="16" fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth=".7" />
      <line x1={baseX - 36} y1={baseY + 20} x2={baseX - 28} y2={baseY + 20} stroke="currentColor" strokeWidth="1.6" />
      <line x1={baseX + baseW + 28} y1={baseY + 20} x2={baseX + baseW + 36} y2={baseY + 20} stroke="currentColor" strokeWidth="1.6" />

      <rect x={cylX} y={cylY} width={cylW} height={cylH} fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth="1" />
      <line x1={cylX + cylW / 2} y1={cylY + 6} x2={cylX + cylW / 2} y2={cylY + cylH - 6} stroke="#3a3d42" strokeWidth=".7" opacity=".55" />
      {[14, 30, 46, 62, 78, 94, 110, 126].map((dy) => (
        <line key={dy} x1={cylX} y1={cylY + dy} x2={cylX + cylW} y2={cylY + dy} stroke="#3a3d42" strokeWidth=".4" opacity=".35" />
      ))}

      <rect x={towerX} y={towerY} width={tw} height={th} rx="2" fill={`url(#${ID}_tower)`} stroke="#000" strokeWidth="1" />
      <rect x={towerX} y={towerY} width="4" height={th} rx="2" fill="#3a3a3e" opacity=".7" />
      <rect x={towerX + tw - 3} y={towerY} width="3" height={th} fill="#0a0a0c" opacity=".7" />
      <circle cx={towerX + 22} cy={baseY + 6} r="2.2" fill="#3a3d42" />
      <circle cx={towerX + tw - 22} cy={baseY + 6} r="2.2" fill="#3a3d42" />

      <text x={towerX + tw / 2} y={towerY + th * 0.55 + 10} textAnchor="middle" fontSize="36" fontWeight="700" fill="#dcdde0" opacity=".92" fontFamily="var(--lt-sans)">L</text>
      <text x={towerX + tw / 2} y={towerY + th * 0.55 + 32} textAnchor="middle" fontSize="5.5" fill="#dcdde0" opacity=".75" fontFamily="var(--lt-mono)" letterSpacing="2">MASS FLOW CTRL · METER</text>

      <g transform={`translate(${towerX + tw - 32} ${towerY + th - 14})`}>
        <text x="0" y="0" fontSize="7" fill="#dcdde0" opacity=".85" fontFamily="var(--lt-sans)" fontStyle="italic">Flow</text>
        <path d="M22,-4 L34,-4 L34,-7 L40,-2 L34,3 L34,0 L22,0 Z" fill="#d13a2a" />
      </g>

      <path d={`M${dsubX},${dsubY + dsubH} L${dsubX + 4},${dsubY + 2} L${dsubX + dsubW - 4},${dsubY + 2} L${dsubX + dsubW},${dsubY + dsubH} Z`} fill={`url(#${ID}_chrome)`} stroke="#3a3d42" strokeWidth="1" />
      <rect x={dsubX + 8} y={dsubY + 8} width={dsubW - 16} height="9" fill="#1a1a1d" stroke="#3a3d42" strokeWidth=".5" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line key={i} x1={dsubX + 12 + (i * (dsubW - 24)) / 7} y1={dsubY + 10} x2={dsubX + 12 + (i * (dsubW - 24)) / 7} y2={dsubY + 13} stroke="#dcdde0" strokeWidth=".7" />
      ))}
      <circle cx={dsubX} cy={dsubY + dsubH - 4} r="2.4" fill="#dcdde0" stroke="#3a3d42" strokeWidth=".5" />
      <circle cx={dsubX + dsubW} cy={dsubY + dsubH - 4} r="2.4" fill="#dcdde0" stroke="#3a3d42" strokeWidth=".5" />
    </g>
  );
}

export function IntroVisual() {
  return (
    <div className="ho-intro__visual" aria-hidden>
      <div className="ho-intro__grid" />
      <svg
        viewBox="0 0 520 520"
        className="ho-intro__svg"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <DeviceDefs />
        </defs>

        <rect width="520" height="520" fill={`url(#${ID}_wash)`} />

        <line x1="40" y1="290" x2="220" y2="290" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
        <circle r="2" fill="var(--pd-primary)" opacity=".7">
          <animateMotion path="M40,290 L220,290" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.15;0.85;1" dur="3.6s" repeatCount="indefinite" />
        </circle>

        <line x1="306" y1="290" x2="488" y2="290" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
        <circle r="2" fill="var(--pd-primary)" opacity=".7">
          <animateMotion path="M306,290 L488,290" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.15;0.85;1" dur="3.6s" repeatCount="indefinite" />
        </circle>

        <DeviceSilhouette cx={262} cy={290} />

        <text x="42" y="278" fontSize="7" fill="currentColor" opacity=".45" fontFamily="var(--lt-mono)">N₂</text>
        <text x="486" y="278" textAnchor="end" fontSize="7" fill="currentColor" opacity=".45" fontFamily="var(--lt-mono)">→ CHAMBER</text>

        <text x="262" y="118" textAnchor="middle" fontSize="13" fill="var(--pd-fg-strong)" fontWeight="500" letterSpacing="3" fontFamily="var(--lt-sans)">M3030VA</text>
        <text x="262" y="136" textAnchor="middle" fontSize="7" fill="currentColor" opacity=".5" letterSpacing="3" fontFamily="var(--lt-mono)">DIGITAL MASS FLOW CONTROLLER</text>

        <line x1="262" y1="206" x2="380" y2="170" stroke="currentColor" strokeWidth=".5" opacity=".4" />
        <circle cx="262" cy="206" r="2.4" fill="var(--pd-primary)" />
        <rect x="382" y="146" width="92" height="48" fill="var(--pd-surface)" stroke="currentColor" strokeWidth=".7" rx="2" />
        <text x="392" y="162" fontSize="6.5" fill="currentColor" opacity=".55" letterSpacing="1.5" fontFamily="var(--lt-mono)">LIVE</text>
        <text x="392" y="184" fontSize="20" fill="var(--pd-fg-strong)" fontWeight="600" fontFamily="var(--lt-mono)" letterSpacing="-0.5">
          <tspan className="ho-svg__val">18.42</tspan>
        </text>
        <text x="468" y="184" textAnchor="end" fontSize="8" fill="currentColor" opacity=".55" fontFamily="var(--lt-mono)">SLM</text>
        <circle cx="468" cy="158" r="2.4" fill="var(--pd-primary)">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>

        <g transform="translate(76 432)">
          {[
            { l: "ACCURACY", v: "±0.1% FS" },
            { l: "RESPONSE", v: "0.8 s" },
            { l: "RANGE", v: "30 SLM" },
          ].map((c, i) => (
            <g key={c.l} transform={`translate(${i * 124} 0)`}>
              <text x="0" y="0" fontSize="6.5" fill="currentColor" opacity=".5" letterSpacing="1.5" fontFamily="var(--lt-mono)">{c.l}</text>
              <text x="0" y="22" fontSize="14" fill="var(--pd-fg-strong)" fontWeight="500" fontFamily="var(--lt-sans)">{c.v}</text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
