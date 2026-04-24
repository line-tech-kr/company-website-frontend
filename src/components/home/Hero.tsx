import { Button } from "@/components/lt/Button";
import { Chip } from "@/components/lt/Chip";
import { Glyph } from "@/components/lt/Glyph";
import type { HomeContent } from "@/lib/content/home";

type Props = { h: HomeContent };

export function Hero({ h }: Props) {
  return (
    <section className="ho-hero">
      <div className="ho-hero__left">
        <div className="ho-hero__kicker">
          <Glyph name="dot" size={10} />
          <span>{h.hero.kicker}</span>
        </div>
        <h1 className="ho-hero__title">
          <span>{h.hero.title1}</span>
          <span className="ho-hero__title--em">{h.hero.title2}</span>
        </h1>
        <p className="ho-hero__lede">{h.hero.lede}</p>
        <div className="ho-hero__ctas">
          <Button
            variant="primary"
            size="lg"
            href="/products/analogue-mfc/m3030va"
            trailingGlyph={<Glyph name="arrow-right" size={14} />}
          >
            {h.hero.ctaPrimary}
          </Button>
          <Button
            variant="ghost"
            size="lg"
            href="/catalog.pdf"
            plain
            icon={<Glyph name="download" size={14} />}
          >
            {h.hero.ctaSecondary}
          </Button>
        </div>
        <Chip tone="neutral" dot>{h.hero.badge}</Chip>
      </div>
      <HeroVisual />
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="ho-hero__visual" aria-hidden>
      <div className="ho-hero__grid" />
      <svg viewBox="0 0 520 520" className="ho-hero__svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="hogrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".2" />
          </pattern>
        </defs>
        <rect width="520" height="520" fill="url(#hogrid)" />
        <line x1="0" y1="260" x2="520" y2="260" stroke="currentColor" strokeDasharray="3 5" strokeWidth=".5" opacity=".25" />
        <line x1="260" y1="0" x2="260" y2="520" stroke="currentColor" strokeDasharray="3 5" strokeWidth=".5" opacity=".25" />

        <g className="ho-svg__src">
          <circle cx="60" cy="260" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="60" cy="260" r="5" fill="currentColor" opacity=".5" />
          <text x="60" y="315" textAnchor="middle" fontSize="9" fill="currentColor">GAS N₂</text>
        </g>

        <line x1="90" y1="260" x2="200" y2="260" stroke="currentColor" strokeWidth="2" />
        <path d="M140,256 L148,260 L140,264 Z" fill="currentColor" opacity=".5" />

        <g>
          <rect x="200" y="170" width="120" height="180" fill="var(--pd-surface-2)" stroke="currentColor" strokeWidth="1.4" />
          <rect x="210" y="185" width="100" height="50" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
          <text x="260" y="218" textAnchor="middle" fontSize="11" fill="currentColor" fontWeight="600">M3030VA</text>
          <text x="260" y="232" textAnchor="middle" fontSize="7" fill="currentColor" opacity=".6">LINE TECH</text>

          <g>
            <rect x="218" y="248" width="84" height="28" fill="var(--lt-primary-950)" stroke="currentColor" strokeWidth=".7" />
            <text x="294" y="268" textAnchor="end" fontSize="14" fill="var(--lt-accent-400)" fontWeight="600">
              <tspan className="ho-svg__val">18.42</tspan>
            </text>
            <text x="224" y="268" fontSize="7" fill="var(--lt-accent-400)" opacity=".6">SLM</text>
          </g>

          <circle cx="260" cy="305" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="260" cy="305" r="4" fill="currentColor" />
          <line x1="260" y1="289" x2="260" y2="283" stroke="currentColor" strokeWidth="1.2" />
          <line x1="260" y1="323" x2="260" y2="329" stroke="currentColor" strokeWidth="1.2" />
          <line x1="244" y1="305" x2="238" y2="305" stroke="currentColor" strokeWidth="1.2" />
          <line x1="276" y1="305" x2="282" y2="305" stroke="currentColor" strokeWidth="1.2" />
        </g>

        <line x1="320" y1="260" x2="430" y2="260" stroke="currentColor" strokeWidth="2" />
        <path d="M380,256 L388,260 L380,264 Z" fill="currentColor" opacity=".5" />

        <g>
          <rect x="430" y="215" width="60" height="90" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="430" y1="230" x2="490" y2="230" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="245" x2="490" y2="245" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="260" x2="490" y2="260" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="275" x2="490" y2="275" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="290" x2="490" y2="290" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <text x="460" y="332" textAnchor="middle" fontSize="9" fill="currentColor">CHAMBER</text>
        </g>

        <path d="M320,200 Q380,150 420,120 L460,120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity=".6" />
        <rect x="430" y="100" width="60" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="460" y="116" textAnchor="middle" fontSize="8" fill="currentColor">HOST / PLC</text>

        <g className="ho-svg__call">
          <line x1="260" y1="170" x2="260" y2="130" stroke="currentColor" strokeWidth=".7" />
          <circle cx="260" cy="123" r="8" fill="var(--pd-primary)" stroke="none" />
          <text className="ho-svg__num" x="260" y="127" textAnchor="middle" fontSize="9" fill="var(--pd-on-primary)" fontWeight="600">01</text>
          <text x="260" y="106" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".7">PIEZO VALVE</text>
        </g>
        <g className="ho-svg__call">
          <line x1="200" y1="260" x2="160" y2="380" stroke="currentColor" strokeWidth=".7" />
          <circle cx="155" cy="388" r="8" fill="var(--pd-primary)" stroke="none" />
          <text className="ho-svg__num" x="155" y="392" textAnchor="middle" fontSize="9" fill="var(--pd-on-primary)" fontWeight="600">02</text>
          <text x="155" y="408" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".7">THERMAL SENSOR</text>
        </g>
        <g className="ho-svg__call">
          <line x1="320" y1="260" x2="375" y2="380" stroke="currentColor" strokeWidth=".7" />
          <circle cx="380" cy="388" r="8" fill="var(--pd-primary)" stroke="none" />
          <text className="ho-svg__num" x="380" y="392" textAnchor="middle" fontSize="9" fill="var(--pd-on-primary)" fontWeight="600">03</text>
          <text x="380" y="408" textAnchor="middle" fontSize="8" fill="currentColor" opacity=".7">MODBUS RTU</text>
        </g>

        <text x="502" y="508" textAnchor="end" fontSize="8" fill="currentColor" opacity=".4">LT-FLOW / 01 / A</text>
      </svg>
      <div className="ho-hero__flow">
        <i /><i /><i />
      </div>
    </div>
  );
}
