// ProductHero — model ID, name, tagline, CTAs, and animated-flow placeholder image.
const { useState: hUseState, useEffect: hUseEffect, useRef: hUseRef } = React;

function ProductHero({ t, layout = 'image-right', accentMode = 'blue', onJumpTo }) {
  // layout: image-right | image-left | stacked
  const imageBlock = <HeroImage t={t} />;
  const textBlock = <HeroText t={t} accentMode={accentMode} onJumpTo={onJumpTo} />;

  if (layout === 'stacked') {
    return (
      <section className={`pd-hero pd-hero--stacked`}>
        <div className="pd-hero__text">{textBlock}</div>
        <div className="pd-hero__media">{imageBlock}</div>
      </section>
    );
  }
  const cls = `pd-hero pd-hero--${layout}`;
  return (
    <section className={cls}>
      {layout === 'image-left' ? (
        <>
          <div className="pd-hero__media">{imageBlock}</div>
          <div className="pd-hero__text">{textBlock}</div>
        </>
      ) : (
        <>
          <div className="pd-hero__text">{textBlock}</div>
          <div className="pd-hero__media">{imageBlock}</div>
        </>
      )}
    </section>
  );
}

function HeroText({ t, accentMode, onJumpTo }) {
  const primaryVariant = accentMode === 'yellow' ? 'accent' : 'primary';
  return (
    <>
      <div className="pd-hero__eyebrow">
        <LTGlyph name="dot" size={10} />
        <span>{t.hero.category}</span>
      </div>
      <h1 className="pd-hero__model">
        <span className="pd-hero__model-num">{t.hero.model}</span>
      </h1>
      <p className="pd-hero__name">{t.hero.name}</p>
      <p className="pd-hero__tagline">{t.hero.tagline}</p>

      <div className="pd-hero__status">
        <LTChip tone="success" dot>{t.hero.inStock}</LTChip>
        <LTChip tone="neutral">{t.hero.status}</LTChip>
      </div>

      <div className="pd-hero__ctas">
        <LTButton variant={primaryVariant} size="lg" onClick={() => onJumpTo && onJumpTo('downloads')} trailingGlyph={<LTGlyph name="arrow-right" size={14} />}>
          {t.cta.quote}
        </LTButton>
        <LTButton variant="ghost" size="lg" onClick={() => onJumpTo && onJumpTo('specs')}>
          {t.cta.contact}
        </LTButton>
      </div>

      <dl className="pd-hero__kv">
        <div><dt>SKU</dt><dd>LT-M3030VA-R7</dd></div>
        <div><dt>HS-Code</dt><dd>9032.89</dd></div>
        <div><dt>MOQ</dt><dd>1</dd></div>
        <div><dt>Lead-time</dt><dd>2–3 wk</dd></div>
      </dl>
    </>
  );
}

// ── Hero image placeholder with subtle animated flow indicator ──────────
function HeroImage({ t }) {
  return (
    <div className="pd-hero__imgwrap">
      {/* grid backdrop */}
      <div className="pd-hero__grid" aria-hidden />

      {/* monospace placeholder frame */}
      <div className="pd-hero__imgframe">
        <div className="pd-hero__corner pd-hero__corner--tl" />
        <div className="pd-hero__corner pd-hero__corner--tr" />
        <div className="pd-hero__corner pd-hero__corner--bl" />
        <div className="pd-hero__corner pd-hero__corner--br" />

        <div className="pd-hero__label">
          <div className="pd-hero__label-row"><span>PLACEHOLDER</span><span>0001 / A</span></div>
          <div className="pd-hero__label-body">{t.hero.placeholder}</div>
          <div className="pd-hero__label-row">
            <span>{t.hero.model}</span>
            <span>N₂ · 20 SLM</span>
          </div>
        </div>

        {/* flow indicator: animated dashes flowing inlet → outlet */}
        <div className="pd-hero__flow" aria-hidden>
          <span className="pd-hero__port pd-hero__port--in">
            <LTGlyph name="arrow-right" size={12} />
            <i>{t.hero.inlet}</i>
          </span>
          <span className="pd-hero__flowtrack">
            <i className="pd-hero__flowdash" />
            <i className="pd-hero__flowdash pd-hero__flowdash--2" />
            <i className="pd-hero__flowdash pd-hero__flowdash--3" />
          </span>
          <span className="pd-hero__port pd-hero__port--out">
            <i>{t.hero.outlet}</i>
            <LTGlyph name="arrow-right" size={12} />
          </span>
        </div>

        {/* tiny live readout */}
        <HeroReadout t={t} />
      </div>
    </div>
  );
}

function HeroReadout({ t }) {
  const [val, setVal] = hUseState(18.42);
  hUseEffect(() => {
    let id;
    const tick = () => {
      // gentle oscillation around setpoint
      const jitter = (Math.random() - 0.5) * 0.06;
      setVal((v) => Math.max(17.8, Math.min(19.2, v + jitter * 3)));
      id = setTimeout(tick, 420);
    };
    id = setTimeout(tick, 420);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="pd-hero__readout">
      <div className="pd-hero__readout-lbl">{t.hero.flowLabel}</div>
      <div className="pd-hero__readout-val">
        <span className="pd-hero__readout-num">{val.toFixed(2)}</span>
        <span className="pd-hero__readout-unit">SLM</span>
      </div>
      <div className="pd-hero__readout-bar">
        <i style={{ width: `${(val / 20) * 100}%` }} />
      </div>
    </div>
  );
}

Object.assign(window, { ProductHero });
