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
  const cylW = 30;
  const cylH = 68;
  const baseW = 188;
  const baseH = 40;
  const towerX = cx - tw / 2;
  const towerY = cy - th / 2;
  const cylX = towerX + tw + 6;
  // bottom-align cylinders with the tower so they sit on top of the silver base
  const cylY = towerY + th - cylH;
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
      {[14, 30, 46].map((dy) => (
        <line key={dy} x1={cylX} y1={cylY + dy} x2={cylX + cylW} y2={cylY + dy} stroke="#3a3d42" strokeWidth=".4" opacity=".35" />
      ))}

      <rect x={towerX} y={towerY} width={tw} height={th} rx="2" fill={`url(#${ID}_tower)`} stroke="#000" strokeWidth="1" />
      <rect x={towerX} y={towerY} width="4" height={th} rx="2" fill="#3a3a3e" opacity=".7" />
      <rect x={towerX + tw - 3} y={towerY} width="3" height={th} fill="#0a0a0c" opacity=".7" />
      <circle cx={towerX + 22} cy={baseY + 6} r="2.2" fill="#3a3d42" />
      <circle cx={towerX + tw - 22} cy={baseY + 6} r="2.2" fill="#3a3d42" />

      {/* Line Tech logomark on the tower face (white). Viewbox traced
          from the brand logo; rendered monochrome here to read on black. */}
      <svg
        x={towerX + 10}
        y={towerY + 12}
        width="28"
        height="28"
        viewBox="56.45 101.51 53.78 54.31"
      >
        <path
          fill="#E5952C"
          d="M 75.109375 149.835938 C 73.539062 148.53125 72.429688 147.046875 71.785156 145.386719 C 71.144531 143.730469 70.820312 141.398438 70.820312 138.402344 L 70.820312 115.75 L 80.800781 115.75 L 80.800781 138.136719 C 80.800781 140.367188 80.917969 141.9375 81.167969 142.839844 C 81.414062 143.75 81.839844 144.476562 82.441406 145.035156 C 83.386719 145.933594 84.542969 146.570312 85.910156 146.949219 C 87.289062 147.328125 89.183594 147.515625 91.609375 147.515625 L 99.273438 147.515625 C 104.746094 142.953125 108.230469 136.085938 108.230469 128.402344 C 108.230469 114.652344 97.089844 103.507812 83.339844 103.507812 C 69.589844 103.507812 58.449219 114.652344 58.449219 128.402344 C 58.449219 141.839844 69.101562 152.785156 82.425781 153.269531 C 81.863281 153.167969 81.335938 153.058594 80.871094 152.929688 C 78.726562 152.332031 76.808594 151.304688 75.109375 149.835938 Z"
        />
        <path
          fill="#B0B3B6"
          d="M 83.339844 153.285156 C 83.035156 153.285156 82.730469 153.277344 82.429688 153.265625 C 84.5 153.632812 87.261719 153.820312 90.742188 153.820312 L 103.320312 153.820312 L 103.320312 147.519531 L 99.277344 147.519531 C 94.957031 151.125 89.402344 153.285156 83.339844 153.285156 Z"
        />
        <path
          fill="#FFFFFF"
          d="M 99.273438 147.515625 L 91.609375 147.515625 C 89.183594 147.515625 87.285156 147.332031 85.914062 146.949219 C 84.546875 146.570312 83.382812 145.933594 82.445312 145.035156 C 81.839844 144.480469 81.414062 143.75 81.164062 142.84375 C 80.921875 141.9375 80.800781 140.367188 80.800781 138.140625 L 80.800781 115.75 L 70.820312 115.75 L 70.820312 138.394531 C 70.820312 141.398438 71.140625 143.730469 71.789062 145.386719 C 72.429688 147.039062 73.535156 148.523438 75.113281 149.839844 C 76.800781 151.300781 78.726562 152.332031 80.878906 152.929688 C 81.339844 153.054688 81.863281 153.164062 82.425781 153.269531 C 82.730469 153.277344 83.035156 153.285156 83.339844 153.285156 C 89.40625 153.285156 94.957031 151.121094 99.273438 147.515625 Z"
        />
      </svg>

      {/* Red flow indicator below the logo */}
      <g transform={`translate(${towerX + tw - 50} ${towerY + th - 14})`}>
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

const SPECS = [
  { l: "ACCURACY", v: "±1% FS" },
  { l: "RESPONSE", v: "< 2 s" },
  { l: "RANGE", v: "30 SLM" },
];

export function IntroVisual() {
  const tagX = 360;
  const tagY = 188;
  const tagW = 116;
  const tagH = 64;

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

        {/* Pipes land at the compression fittings (baseY + 20 = 394). */}
        <line x1="40" y1="394" x2="128" y2="394" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
        <circle r="2" fill="var(--pd-primary)" opacity=".7">
          <animateMotion path="M40,394 L128,394" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.15;0.85;1" dur="3.6s" repeatCount="indefinite" />
        </circle>

        <line x1="388" y1="394" x2="488" y2="394" stroke="currentColor" strokeWidth="1.4" opacity=".6" />
        <circle r="2" fill="var(--pd-primary)" opacity=".7">
          <animateMotion path="M388,394 L488,394" dur="3.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;0.7;0.7;0" keyTimes="0;0.15;0.85;1" dur="3.6s" repeatCount="indefinite" />
        </circle>

        <DeviceSilhouette cx={262} cy={290} />

        <text x="42" y="382" fontSize="7" fill="currentColor" opacity=".45" fontFamily="var(--lt-mono)">N₂</text>
        <text x="486" y="382" textAnchor="end" fontSize="7" fill="currentColor" opacity=".45" fontFamily="var(--lt-mono)">→ CHAMBER</text>

        <text x="262" y="118" textAnchor="middle" fontSize="13" fill="var(--pd-fg-strong)" fontWeight="500" letterSpacing="3" fontFamily="var(--lt-sans)">M3030VA</text>
        <text x="262" y="136" textAnchor="middle" fontSize="7" fill="currentColor" opacity=".5" letterSpacing="3" fontFamily="var(--lt-mono)">DIGITAL MASS FLOW CONTROLLER</text>

        <line x1="262" y1="206" x2={tagX - 2} y2={tagY + 12} stroke="currentColor" strokeWidth=".5" opacity=".4" />
        <circle cx="262" cy="206" r="2.4" fill="var(--pd-primary)" />
        <rect x={tagX} y={tagY} width={tagW} height={tagH} fill="var(--pd-surface)" stroke="currentColor" strokeWidth=".7" rx="2" />
        <text x={tagX + 10} y={tagY + 16} fontSize="6.5" fill="currentColor" opacity=".55" letterSpacing="1.5" fontFamily="var(--lt-mono)">LIVE</text>
        <text x={tagX + 10} y={tagY + 40} fontSize="18" fill="var(--pd-fg-strong)" fontWeight="600" fontFamily="var(--lt-mono)" letterSpacing="-0.5">
          <tspan className="ho-svg__val">20.0</tspan>
        </text>
        <text x={tagX + tagW - 6} y={tagY + 40} textAnchor="end" fontSize="8" fill="currentColor" opacity=".55" fontFamily="var(--lt-mono)">SLM</text>
        <text x={tagX + 10} y={tagY + 54} fontSize="6.5" fill="currentColor" opacity=".55" letterSpacing="1.5" fontFamily="var(--lt-mono)">SP 20.0 · LOCKED</text>
        <circle cx={tagX + tagW - 6} cy={tagY + 12} r="2.4" fill="var(--pd-primary)">
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>

        <g transform="translate(76 444)">
          {SPECS.map((c, i) => (
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
