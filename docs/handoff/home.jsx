// Home page wiring. Shares locale state with product page via localStorage
// (so toggling locale on either page persists to the other).

const { useState: haUseState, useEffect: haUseEffect } = React;

const HOME_TWEAKS = /*EDITMODE-BEGIN*/{
  "locale": "ko",
  "accentMode": "blue",
  "dark": false
}/*EDITMODE-END*/;

function HomeApp() {
  const [t, setTweak] = useTweaks(HOME_TWEAKS);

  haUseEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    html.setAttribute('data-accent-mode', t.accentMode);
    html.setAttribute('lang', t.locale);
  }, [t.dark, t.accentMode, t.locale]);

  const locale = t.locale;
  const dict = LT_LOCALES[locale] || LT_LOCALES.ko;

  const setView = (v) => {
    if (v === 'product' || v === 'library') {
      window.location.href = 'index.html' + (v === 'library' ? '#library' : '');
    }
  };

  return (
    <>
      <div className="pd-shell">
        <TopBar t={{ ...dict, __locale: locale }} locale={locale} setLocale={(v) => setTweak('locale', v)} view="home" setView={setView} />
        <main className="pd-main pd-main--home">
          <HomePage locale={locale} setLocale={(v) => setTweak('locale', v)} t={dict} accentMode={t.accentMode} />
        </main>
        <Footer t={dict} />
      </div>

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
        <TweakSection label="Demo · Navigate">
          <TweakButton label="→ M3030VA product page" onClick={() => { window.location.href = 'index.html'; }} />
          <TweakButton label="→ Component library" onClick={() => { window.location.href = 'index.html#library'; }} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

function HomeTopBar({ t, locale, setLocale }) {
  const localeOpts = [
    { value: 'ko', code: 'KO', name: '한국어' },
    { value: 'en', code: 'EN', name: 'English' },
    { value: 'zh', code: 'ZH', name: '中文' },
  ];
  return (
    <header className="pd-top">
      <div className="pd-top__inner">
        <a className="pd-top__brand" href="home.html">
          <span className="pd-top__logomark" aria-hidden>
            <svg viewBox="0 0 32 32" width="22" height="22"><rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 16h24M16 4v24" stroke="currentColor" strokeWidth="2" /></svg>
          </span>
          <span className="pd-top__wordmark">LINE<span className="pd-top__wordmark-dot">·</span>TECH</span>
        </a>
        <nav className="pd-top__nav" aria-label="Primary">
          <a className="is-active" href="home.html">{t.nav.products.split('').length ? (locale === 'ko' ? '홈' : locale === 'zh' ? '首页' : 'Home') : 'Home'}</a>
          <a href="index.html">{t.nav.products}</a>
          <a href="#">{t.nav.solutions}</a>
          <a href="#">{t.nav.support}</a>
          <a href="#">{t.nav.company}</a>
        </nav>
        <div className="pd-top__right">
          <LTLocaleSwitcher value={locale} options={localeOpts} onChange={setLocale} size="sm" />
          <LTButton variant="primary" size="sm" icon={<LTGlyph name="phone" size={12} />}>{t.nav.contact}</LTButton>
        </div>
      </div>
    </header>
  );
}

function HomeFooter({ t }) {
  return (
    <footer className="pd-foot">
      <div className="pd-foot__inner">
        <div className="pd-foot__brand">
          <span className="pd-foot__mark"><svg viewBox="0 0 32 32" width="16" height="16"><rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 16h24M16 4v24" stroke="currentColor" strokeWidth="2" /></svg></span>
          <div>
            <div className="pd-foot__sig">{t.footer.sig}</div>
            <div className="pd-foot__addr">{t.footer.addr}</div>
          </div>
        </div>
        <div className="pd-foot__right">
          <span>{t.footer.rights}</span>
          <span className="pd-foot__v">v26.04</span>
        </div>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HomeApp />);
