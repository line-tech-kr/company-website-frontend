// Line Tech home page — composition of sections. Uses the same LTCore primitives
// and same shell/top bar/footer as the product page.

const { useState: hmUseState, useEffect: hmUseEffect, useRef: hmUseRef } = React;

function HomePage({ locale, setLocale, t, accentMode }) {
  const h = LT_HOME[locale] || LT_HOME.ko;
  return (
    <div className="ho">
      <HoHero h={h} accentMode={accentMode} />
      <HoStats h={h} />
      <HoSeries h={h} />
      <HoFeature h={h} t={t} />
      <HoApps h={h} />
      <HoTrust h={h} />
      <HoCta h={h} accentMode={accentMode} />
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────
function HoHero({ h, accentMode }) {
  const primaryVariant = accentMode === 'yellow' ? 'accent' : 'primary';
  return (
    <section className="ho-hero">
      <div className="ho-hero__left">
        <div className="ho-hero__kicker">
          <LTGlyph name="dot" size={10} />
          <span>{h.hero.kicker}</span>
        </div>
        <h1 className="ho-hero__title">
          <span>{h.hero.title1}</span>
          <span className="ho-hero__title--em">{h.hero.title2}</span>
        </h1>
        <p className="ho-hero__lede">{h.hero.lede}</p>
        <div className="ho-hero__ctas">
          <LTButton variant={primaryVariant} size="lg" as="a" href="index.html" trailingGlyph={<LTGlyph name="arrow-right" size={14} />}>{h.hero.ctaPrimary}</LTButton>
          <LTButton variant="ghost" size="lg" icon={<LTGlyph name="download" size={14} />}>{h.hero.ctaSecondary}</LTButton>
        </div>
        <div className="ho-hero__badge">
          <LTChip tone="neutral" dot>{h.hero.badge}</LTChip>
        </div>
      </div>
      <HoHeroVisual />
    </section>
  );
}

// Large ISO-style schematic of a flow-loop, using only CSS/SVG primitives.
// Not a product render — a technical diagram motif, same vocabulary as the
// dimension drawing on the product page.
function HoHeroVisual() {
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
        {/* Center crosshair */}
        <line x1="0" y1="260" x2="520" y2="260" stroke="currentColor" strokeDasharray="3 5" strokeWidth=".5" opacity=".25" />
        <line x1="260" y1="0" x2="260" y2="520" stroke="currentColor" strokeDasharray="3 5" strokeWidth=".5" opacity=".25" />

        {/* Gas source (left) */}
        <g className="ho-svg__src">
          <circle cx="60" cy="260" r="30" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="60" cy="260" r="5" fill="currentColor" opacity=".5" />
          <text x="60" y="315" textAnchor="middle" fontSize="9" fontFamily="var(--lt-mono)" fill="currentColor">GAS N₂</text>
        </g>

        {/* Pipe in */}
        <line x1="90" y1="260" x2="200" y2="260" stroke="currentColor" strokeWidth="2" />
        {/* arrows on pipe */}
        <path d="M140,256 L148,260 L140,264 Z" fill="currentColor" opacity=".5" />

        {/* MFC body (center) */}
        <g>
          <rect x="200" y="170" width="120" height="180" fill="var(--pd-surface-2)" stroke="currentColor" strokeWidth="1.4" />
          <rect x="210" y="185" width="100" height="50" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".5" />
          <text x="260" y="218" textAnchor="middle" fontSize="11" fontFamily="var(--lt-mono)" fill="currentColor" fontWeight="600">M3030VA</text>
          <text x="260" y="232" textAnchor="middle" fontSize="7" fontFamily="var(--lt-mono)" fill="currentColor" opacity=".6">LINE TECH</text>

          {/* Readout inside */}
          <g>
            <rect x="218" y="248" width="84" height="28" fill="var(--lt-primary-950)" stroke="currentColor" strokeWidth=".7" />
            <text x="294" y="268" textAnchor="end" fontSize="14" fontFamily="var(--lt-mono)" fill="var(--lt-accent-400)" fontWeight="600">
              <tspan className="ho-svg__val">18.42</tspan>
            </text>
            <text x="224" y="268" fontSize="7" fontFamily="var(--lt-mono)" fill="var(--lt-accent-400)" opacity=".6">SLM</text>
          </g>

          {/* Valve knob */}
          <circle cx="260" cy="305" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="260" cy="305" r="4" fill="currentColor" />
          <line x1="260" y1="289" x2="260" y2="283" stroke="currentColor" strokeWidth="1.2" />
          <line x1="260" y1="323" x2="260" y2="329" stroke="currentColor" strokeWidth="1.2" />
          <line x1="244" y1="305" x2="238" y2="305" stroke="currentColor" strokeWidth="1.2" />
          <line x1="276" y1="305" x2="282" y2="305" stroke="currentColor" strokeWidth="1.2" />
        </g>

        {/* Pipe out */}
        <line x1="320" y1="260" x2="430" y2="260" stroke="currentColor" strokeWidth="2" />
        <path d="M380,256 L388,260 L380,264 Z" fill="currentColor" opacity=".5" />

        {/* Target vessel */}
        <g>
          <rect x="430" y="215" width="60" height="90" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <line x1="430" y1="230" x2="490" y2="230" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="245" x2="490" y2="245" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="260" x2="490" y2="260" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="275" x2="490" y2="275" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <line x1="430" y1="290" x2="490" y2="290" stroke="currentColor" strokeWidth=".5" opacity=".5" />
          <text x="460" y="332" textAnchor="middle" fontSize="9" fontFamily="var(--lt-mono)" fill="currentColor">CHAMBER</text>
        </g>

        {/* Control cable to host */}
        <path d="M320,200 Q380,150 420,120 L460,120" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 3" opacity=".6" />
        <rect x="430" y="100" width="60" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
        <text x="460" y="116" textAnchor="middle" fontSize="8" fontFamily="var(--lt-mono)" fill="currentColor">HOST / PLC</text>

        {/* Callouts */}
        <g className="ho-svg__call">
          <line x1="260" y1="170" x2="260" y2="130" stroke="currentColor" strokeWidth=".7" />
          <circle cx="260" cy="123" r="8" fill="var(--pd-primary)" stroke="none" />
          <text x="260" y="127" textAnchor="middle" fontSize="9" fontFamily="var(--lt-sans)" fill="var(--pd-on-primary)" fontWeight="600">01</text>
          <text x="260" y="106" textAnchor="middle" fontSize="8" fontFamily="var(--lt-mono)" fill="currentColor" opacity=".7">PIEZO VALVE</text>
        </g>
        <g className="ho-svg__call">
          <line x1="200" y1="260" x2="160" y2="380" stroke="currentColor" strokeWidth=".7" />
          <circle cx="155" cy="388" r="8" fill="var(--pd-primary)" stroke="none" />
          <text x="155" y="392" textAnchor="middle" fontSize="9" fontFamily="var(--lt-sans)" fill="var(--pd-on-primary)" fontWeight="600">02</text>
          <text x="155" y="408" textAnchor="middle" fontSize="8" fontFamily="var(--lt-mono)" fill="currentColor" opacity=".7">THERMAL SENSOR</text>
        </g>
        <g className="ho-svg__call">
          <line x1="320" y1="260" x2="375" y2="380" stroke="currentColor" strokeWidth=".7" />
          <circle cx="380" cy="388" r="8" fill="var(--pd-primary)" stroke="none" />
          <text x="380" y="392" textAnchor="middle" fontSize="9" fontFamily="var(--lt-sans)" fill="var(--pd-on-primary)" fontWeight="600">03</text>
          <text x="380" y="408" textAnchor="middle" fontSize="8" fontFamily="var(--lt-mono)" fill="currentColor" opacity=".7">MODBUS RTU</text>
        </g>

        {/* Drawing corner tag */}
        <text x="502" y="508" textAnchor="end" fontSize="8" fontFamily="var(--lt-mono)" fill="currentColor" opacity=".4">LT-FLOW / 01 / A</text>
      </svg>
      {/* Animated flow dots that ride along the main pipe */}
      <div className="ho-hero__flow">
        <i /><i /><i />
      </div>
    </div>
  );
}

// ── Stats band ─────────────────────────────────────────────────────────
function HoStats({ h }) {
  return (
    <section className="ho-stats">
      {h.stats.map((s, i) => (
        <div className="ho-stats__cell" key={i}>
          <div className="ho-stats__k">{s.k}</div>
          <div className="ho-stats__l">{s.l}</div>
          <div className="ho-stats__s">{s.sub}</div>
        </div>
      ))}
    </section>
  );
}

// ── Series grid ────────────────────────────────────────────────────────
function HoSeries({ h }) {
  return (
    <section className="ho-sec">
      <HoSecHead h={h.series} />
      <div className="ho-series">
        {h.series.items.map((s, i) => (
          <div key={s.code} className={`ho-series__card${s.highlight ? ' is-highlight' : ''}`}>
            <div className="ho-series__top">
              <span className="ho-series__code">{s.code}</span>
              <span className="ho-series__count">{s.count}</span>
            </div>
            <h3 className="ho-series__name">{s.name}</h3>
            <p className="ho-series__desc">{s.desc}</p>
            <div className="ho-series__foot">
              <span className="ho-series__range">{s.range}</span>
              {s.feat && <a className="ho-series__feat" href="index.html">{s.feat} <LTGlyph name="arrow-right" size={11} /></a>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Featured product ──────────────────────────────────────────────────
function HoFeature({ h, t }) {
  return (
    <section className="ho-sec ho-feature">
      <div className="ho-feature__left">
        <div className="ho-feature__kicker">{h.feature.kicker}</div>
        <h2 className="ho-feature__title">{h.feature.title}</h2>
        <p className="ho-feature__sub">{h.feature.sub}</p>
        <div className="ho-feature__bullets">
          {h.feature.bullets.map((b) => (
            <div key={b.k} className="ho-feature__bullet">
              <dt>{b.k}</dt>
              <dd>{b.v}</dd>
            </div>
          ))}
        </div>
        <LTButton variant="primary" size="md" as="a" href="index.html" trailingGlyph={<LTGlyph name="arrow-right" size={14} />}>{h.feature.cta}</LTButton>
      </div>
      <div className="ho-feature__right">
        <div className="ho-feature__chip">
          <div className="ho-feature__chip-tl">M3030VA</div>
          <div className="ho-feature__chip-tr">REV.7</div>
          <div className="ho-feature__chip-body">
            <div className="ho-feature__lbl">PLACEHOLDER · PRODUCT</div>
          </div>
          <div className="ho-feature__chip-bl">LINE TECH</div>
          <div className="ho-feature__chip-br">N₂ · 20 SLM</div>
        </div>
      </div>
    </section>
  );
}

// ── Applications ──────────────────────────────────────────────────────
function HoApps({ h }) {
  return (
    <section className="ho-sec">
      <HoSecHead h={h.apps} />
      <div className="ho-apps">
        {h.apps.items.map((a, i) => (
          <div className="ho-apps__cell" key={a.n}>
            <div className="ho-apps__num">{String(i + 1).padStart(2, '0')}</div>
            <div className="ho-apps__n">{a.n}</div>
            <div className="ho-apps__k">{a.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Trust / certifications ────────────────────────────────────────────
function HoTrust({ h }) {
  return (
    <section className="ho-sec">
      <HoSecHead h={h.trust} />
      <div className="ho-trust">
        {h.trust.items.map((it) => (
          <div key={it} className="ho-trust__item">
            <span className="ho-trust__dot" />
            <span>{it}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────
function HoCta({ h, accentMode }) {
  const primaryVariant = accentMode === 'yellow' ? 'accent' : 'primary';
  return (
    <section className="ho-cta">
      <div className="ho-cta__inner">
        <h2 className="ho-cta__title">{h.cta.title}</h2>
        <p className="ho-cta__sub">{h.cta.sub}</p>
        <div className="ho-cta__btns">
          <LTButton variant={primaryVariant} size="lg" icon={<LTGlyph name="phone" size={14} />}>{h.cta.primary}</LTButton>
          <LTButton variant="ghost" size="lg">{h.cta.secondary}</LTButton>
        </div>
      </div>
    </section>
  );
}

function HoSecHead({ h }) {
  return (
    <header className="ho-sechd">
      <div className="ho-sechd__kicker">{h.kicker}</div>
      <h2 className="ho-sechd__title">{h.title}</h2>
      {h.sub && <p className="ho-sechd__sub">{h.sub}</p>}
    </header>
  );
}

Object.assign(window, { HomePage });
