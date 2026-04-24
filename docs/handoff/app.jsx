// Main app wiring: loads locales, manages tweaks, orchestrates page + library views.

const { useState: aUseState, useEffect: aUseEffect, useMemo: aUseMemo } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "locale": "ko",
  "accentMode": "blue",
  "density": "comfortable",
  "dark": false,
  "heroLayout": "image-right",
  "specStyle": "bordered",
  "typography": "sans-mono"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setViewRaw] = aUseState('product'); // product | library
  const setView = (v) => {
    if (v === 'home') { window.location.href = 'home.html'; return; }
    setViewRaw(v);
  };
  const [activeTab, setActiveTab] = aUseState('overview');
  const locale = t.locale;
  const dict = LT_LOCALES[locale] || LT_LOCALES.ko;

  // Apply theme + accent to root
  aUseEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    html.setAttribute('data-accent-mode', t.accentMode);
    html.setAttribute('data-typography', t.typography);
  }, [t.dark, t.accentMode, t.typography]);

  // Scroll spy on tabs
  aUseEffect(() => {
    if (view !== 'product') return;
    const onScroll = () => {
      const ids = ['overview', 'specs', 'dimensions', 'downloads'];
      const y = window.scrollY + 200;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) current = id;
      }
      setActiveTab(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [view, locale]);

  const jumpTo = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
  };

  return (
    <>
      <PageShell t={{ ...dict, __locale: locale }} locale={locale} setLocale={(v) => setTweak('locale', v)} view={view} setView={setView} accentMode={t.accentMode}>
        {view === 'product' ? (
          <>
            <ProductHero t={dict} layout={t.heroLayout} accentMode={t.accentMode} onJumpTo={jumpTo} />
            <TabNav t={dict} active={activeTab} setActive={setActiveTab} />
            <Overview t={dict} />
            <SpecTable t={dict} style={t.specStyle} density={t.density} monoValues={t.typography === 'sans-mono'} />
            <DimensionDrawing t={dict} />
            <DownloadsList t={dict} />
          </>
        ) : (
          <ComponentLibrary t={dict} accentMode={t.accentMode} />
        )}
      </PageShell>

      <TweaksPanel title="Tweaks · Line Tech">
        <TweakSection label="Locale">
          <TweakRadio label="Language" value={t.locale}
                      options={[{ value: 'ko', label: 'KO' }, { value: 'en', label: 'EN' }, { value: 'zh', label: 'ZH' }]}
                      onChange={(v) => setTweak('locale', v)} />
        </TweakSection>

        <TweakSection label="Brand">
          <TweakRadio label="Accent mode" value={t.accentMode}
                      options={[{ value: 'blue', label: 'Blue' }, { value: 'yellow', label: 'Yellow' }]}
                      onChange={(v) => setTweak('accentMode', v)} />
          <TweakToggle label="Dark mode" value={t.dark}
                       onChange={(v) => setTweak('dark', v)} />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio label="Hero layout" value={t.heroLayout}
                      options={[{ value: 'image-right', label: '→' }, { value: 'image-left', label: '←' }, { value: 'stacked', label: '↧' }]}
                      onChange={(v) => setTweak('heroLayout', v)} />
          <TweakRadio label="Spec table" value={t.specStyle}
                      options={[{ value: 'striped', label: 'Strip' }, { value: 'bordered', label: 'Bord' }, { value: 'minimal', label: 'Min' }]}
                      onChange={(v) => setTweak('specStyle', v)} />
          <TweakRadio label="Density" value={t.density}
                      options={[{ value: 'compact', label: 'Compact' }, { value: 'comfortable', label: 'Comfy' }]}
                      onChange={(v) => setTweak('density', v)} />
          <TweakRadio label="Typography" value={t.typography}
                      options={[{ value: 'sans-only', label: 'Sans' }, { value: 'sans-mono', label: 'Sans + Mono' }]}
                      onChange={(v) => setTweak('typography', v)} />
        </TweakSection>

        <TweakSection label="Demo · Navigate">
          <TweakButton label="← Home" onClick={() => { window.location.href = 'home.html'; }} />
          <TweakRadio label="View" value={view}
                      options={[{ value: 'product', label: 'Product' }, { value: 'library', label: 'Library' }]}
                      onChange={(v) => setView(v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
