// ComponentLibrary — showcases all primitives and modules in one view.

function ComponentLibrary({ t, accentMode }) {
  return (
    <div className="pd-lib">
      <header className="pd-lib__hero">
        <div className="pd-lib__kicker">Line Tech · Design System 2026</div>
        <h1 className="pd-lib__title">Component library</h1>
        <p className="pd-lib__sub">Building blocks used across the M3030VA product page. Values map 1:1 to Tailwind v4 <code>@theme</code> tokens in globals.css.</p>
      </header>

      <LibSection num="00" title="Color — brand">
        <div className="pd-lib__swatches">
          <Swatch name="primary-500" hex="#185686" role="Primary brand" />
          <Swatch name="primary-700" hex="#1f375e" role="Hover / pressed" dark />
          <Swatch name="primary-900" hex="#172e75" role="Heading on light" dark />
          <Swatch name="accent-500"  hex="#fdbc04" role="Accent / CTA" fg="#1a1100" />
        </div>
      </LibSection>

      <LibSection num="01" title="Color — primary ramp 50→950">
        <Ramp name="primary" stops={[
          ['50', '#eff6fc'], ['100', '#dbeaf5'], ['200', '#b8d4ea'], ['300', '#8bb7d9'],
          ['400', '#5393c1'], ['500', '#185686'], ['600', '#144770'], ['700', '#12395a'],
          ['800', '#122e47'], ['900', '#122637'], ['950', '#0a1623']
        ]} />
      </LibSection>

      <LibSection num="02" title="Color — accent + neutrals + state">
        <Ramp name="accent" stops={[
          ['50', '#fffbea'], ['100', '#fff3c2'], ['200', '#ffe58a'], ['300', '#ffd24d'],
          ['400', '#fdbc04'], ['500', '#e4a502'], ['600', '#b88004'], ['700', '#935f0b'],
          ['800', '#784c10'], ['900', '#653f11'], ['950', '#3a2106']
        ]} />
        <Ramp name="neutral" stops={[
          ['50', '#f8f9fb'], ['100', '#eff1f5'], ['200', '#e2e5ec'], ['300', '#c7cdd8'],
          ['400', '#97a0b0'], ['500', '#6b7485'], ['600', '#4c5566'], ['700', '#353c4b'],
          ['800', '#242a37'], ['900', '#181c26'], ['950', '#0c0e14']
        ]} />
        <div className="pd-lib__staterow">
          <Swatch name="success" hex="#0d7a4a" role="In stock" small />
          <Swatch name="warning" hex="#c07a02" role="Advisory" small />
          <Swatch name="danger"  hex="#a12b2b" role="Critical" small />
          <Swatch name="info"    hex="#1b6cad" role="Info" small />
        </div>
      </LibSection>

      <LibSection num="03" title="Typography">
        <div className="pd-lib__type">
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">display / 48</span><span className="pd-lib__typeex" style={{ fontSize: 48, lineHeight: 1.04, letterSpacing: '-0.02em', fontWeight: 500 }}>M3030VA — High-precision thermal MFC</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">h1 / 34</span><span className="pd-lib__typeex" style={{ fontSize: 34, lineHeight: 1.1, fontWeight: 500 }}>Technical specifications</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">h2 / 22</span><span className="pd-lib__typeex" style={{ fontSize: 22, lineHeight: 1.2, fontWeight: 500 }}>Outline dimensions</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">body / 15</span><span className="pd-lib__typeex" style={{ fontSize: 15, lineHeight: 1.55 }}>Digital piezo-actuated mass flow controller for semiconductor and display process lines.</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">caption / 12</span><span className="pd-lib__typeex" style={{ fontSize: 12, lineHeight: 1.4, color: 'var(--pd-muted)' }}>Units: mm · VCR 1/4" fittings</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">mono-val / 14</span><span className="pd-lib__typeex pd-lib__typeex--mono">10 SCCM – 20 SLM · ± 1.0 % S.P.</span></div>
          <div className="pd-lib__typerow"><span className="pd-lib__typetok">eyebrow / 11</span><span className="pd-lib__typeex pd-lib__typeex--eyebrow">MASS FLOW CONTROLLER · MFC</span></div>
        </div>
      </LibSection>

      <LibSection num="04" title="Spacing scale">
        <div className="pd-lib__spacing">
          {[['1', 4], ['2', 8], ['3', 12], ['4', 16], ['5', 20], ['6', 24], ['8', 32], ['10', 40], ['12', 48], ['16', 64], ['20', 80]].map(([k, v]) => (
            <div className="pd-lib__spacerow" key={k}>
              <span className="pd-lib__spacetok">space-{k}</span>
              <span className="pd-lib__spaceval">{v}px</span>
              <span className="pd-lib__spacebar" style={{ width: v }} />
            </div>
          ))}
        </div>
      </LibSection>

      <LibSection num="05" title="Buttons">
        <div className="pd-lib__btns">
          <LTButton variant="primary" size="md">{t.cta.quote}</LTButton>
          <LTButton variant="primary" size="md" icon={<LTGlyph name="download" size={14} />}>{t.cta.datasheet}</LTButton>
          <LTButton variant="accent"  size="md" trailingGlyph={<LTGlyph name="arrow-right" size={14} />}>{t.cta.quote}</LTButton>
          <LTButton variant="ghost"   size="md">{t.cta.contact}</LTButton>
          <LTButton variant="ghost"   size="md" icon={<LTGlyph name="plus" size={14} />}>{t.cta.compare}</LTButton>
          <LTButton variant="subtle"  size="md">{t.cta.download}</LTButton>
          <LTButton variant="primary" size="lg">{t.cta.quote}</LTButton>
          <LTButton variant="primary" size="sm">{t.cta.download}</LTButton>
          <LTButton variant="primary" size="md" disabled>{t.cta.quote}</LTButton>
        </div>
      </LibSection>

      <LibSection num="06" title="Chips, tags & locale switcher">
        <div className="pd-lib__misc">
          <div className="pd-lib__miscrow">
            <LTChip tone="success" dot>{t.hero.inStock}</LTChip>
            <LTChip tone="neutral">{t.hero.status}</LTChip>
            <LTChip tone="info" dot>Modbus RTU</LTChip>
            <LTChip tone="warning" dot>Rev. 7</LTChip>
          </div>
          <div className="pd-lib__miscrow">
            <LTTag tone="danger">PDF</LTTag>
            <LTTag tone="info">DWG</LTTag>
            <LTTag tone="neutral">STEP</LTTag>
            <LTTag tone="success">N₂</LTTag>
            <LTTag tone="neutral">M4 × 2</LTTag>
          </div>
          <div className="pd-lib__miscrow">
            <LTLocaleSwitcher
              value={'ko'}
              options={[{ value: 'ko', code: 'KO', name: '한국어' }, { value: 'en', code: 'EN', name: 'English' }, { value: 'zh', code: 'ZH', name: '中文' }]}
              onChange={() => {}}
            />
          </div>
        </div>
      </LibSection>

      <LibSection num="07" title="Card surfaces">
        <div className="pd-lib__cards">
          <LTCard tone="surface" pad="lg">
            <div className="pd-lib__cardlbl">surface</div>
            <div className="pd-lib__cardtxt">Default card on page background.</div>
          </LTCard>
          <LTCard tone="muted" pad="lg">
            <div className="pd-lib__cardlbl">muted</div>
            <div className="pd-lib__cardtxt">Secondary container; used for spec groups.</div>
          </LTCard>
          <LTCard tone="invert" pad="lg">
            <div className="pd-lib__cardlbl">invert</div>
            <div className="pd-lib__cardtxt">Dark surface — footer, callouts.</div>
          </LTCard>
        </div>
      </LibSection>
    </div>
  );
}

function LibSection({ num, title, children }) {
  return (
    <section className="pd-lib__sec">
      <header className="pd-lib__sechd">
        <span className="pd-lib__secnum">{num}</span>
        <h2>{title}</h2>
      </header>
      <div className="pd-lib__secbody">{children}</div>
    </section>
  );
}

function Swatch({ name, hex, role, dark, fg, small }) {
  return (
    <div className={`pd-lib__sw${small ? ' pd-lib__sw--sm' : ''}`}>
      <div className="pd-lib__swchip" style={{ background: hex, color: fg || (dark ? '#fff' : '#fff') }}>
        <span className="pd-lib__swhex">{hex}</span>
      </div>
      <div className="pd-lib__swmeta">
        <span className="pd-lib__swname">{name}</span>
        <span className="pd-lib__swrole">{role}</span>
      </div>
    </div>
  );
}

function Ramp({ name, stops }) {
  return (
    <div className="pd-lib__ramp">
      <div className="pd-lib__rampname">{name}</div>
      <div className="pd-lib__rampstrip">
        {stops.map(([k, v]) => (
          <div key={k} className="pd-lib__rampstop" style={{ background: v }} title={`${name}-${k} · ${v}`}>
            <span className="pd-lib__rampk">{k}</span>
            <span className="pd-lib__ramphex">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { ComponentLibrary });
