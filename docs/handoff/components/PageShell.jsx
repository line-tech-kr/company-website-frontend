// PageShell — top nav, breadcrumb, tab nav, footer.
// Overview section included here since it's short and sits at the top.

const { useState: psUseState, useEffect: psUseEffect, useRef: psUseRef } = React;
const hmUseState = (typeof window !== 'undefined' && window.hmUseState) || psUseState;
const hmUseEffect = (typeof window !== 'undefined' && window.hmUseEffect) || psUseEffect;
const hmUseRef = (typeof window !== 'undefined' && window.hmUseRef) || psUseRef;

function PageShell({ t, locale, setLocale, view, setView, accentMode, children, tabState }) {
  return (
    <div className="pd-shell">
      <TopBar t={t} locale={locale} setLocale={setLocale} view={view} setView={setView} />
      {view === 'product' ? (
        <>
          <Breadcrumb t={t} />
          <main className="pd-main">{children}</main>
        </>
      ) : (
        <main className="pd-main pd-main--library">{children}</main>
      )}
      <Footer t={t} />
    </div>
  );
}

function TopBar({ t, locale, setLocale, view, setView }) {
  const localeOpts = [
    { value: 'ko', code: 'KO', name: '한국어' },
    { value: 'en', code: 'EN', name: 'English' },
    { value: 'zh', code: 'ZH', name: '中文' },
  ];
  const [openMenu, setOpenMenu] = hmUseState(null); // 'products' | 'solutions' | 'support' | 'company' | null
  const [searchOpen, setSearchOpen] = hmUseState(false);
  const [scrolled, setScrolled] = hmUseState(false);
  const closeTimer = hmUseRef(null);

  hmUseEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  hmUseEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { setOpenMenu(null); setSearchOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hoverOpen = (id) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(id);
  };
  const hoverClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header className={`pd-top${scrolled ? ' is-scrolled' : ''}${openMenu ? ' is-menuopen' : ''}`}>
      {/* Main bar */}
      <div className="pd-top__main" onMouseLeave={hoverClose}>
        <div className="pd-top__inner">
          <a className="pd-top__brand" href="home.html">
            <span className="pd-top__logomark" aria-hidden>
              <svg viewBox="0 0 32 32" width="22" height="22"><rect x="4" y="4" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M4 16h24M16 4v24" stroke="currentColor" strokeWidth="2" /></svg>
            </span>
            <span className="pd-top__wordmark">LINE<span className="pd-top__wordmark-dot">·</span>TECH</span>
          </a>

          <nav className="pd-top__nav" aria-label="Primary">
            <NavItem id="products" label={t.nav.products} openMenu={openMenu} onOpen={hoverOpen} active hasMenu />
            <NavItem id="solutions" label={t.nav.solutions} openMenu={openMenu} onOpen={hoverOpen} hasMenu />
            <NavItem id="support" label={t.nav.support} openMenu={openMenu} onOpen={hoverOpen} hasMenu />
            <NavItem id="company" label={t.nav.company} openMenu={openMenu} onOpen={hoverOpen} hasMenu />
          </nav>

          <div className="pd-top__right">
            <button className="pd-top__iconbtn" aria-label="Search" onClick={() => { setSearchOpen((v) => !v); setOpenMenu(null); }}>
              <LTGlyph name="search" size={15} />
            </button>
            <span className="pd-top__divider" aria-hidden />
            <LTLocaleSwitcher value={locale} options={localeOpts} onChange={setLocale} size="sm" />
            <LTButton variant="primary" size="sm" icon={<LTGlyph name="phone" size={12} />}>{t.nav.quote}</LTButton>
          </div>
        </div>

        {/* Mega-menu panel */}
        {openMenu && (
          <div className="pd-mm" onMouseEnter={() => hoverOpen(openMenu)} onMouseLeave={hoverClose}>
            <div className="pd-mm__inner">
              {openMenu === 'products' && <MMProducts t={t} onClose={() => setOpenMenu(null)} />}
              {openMenu === 'solutions' && <MMList title={t.nav.solutions} items={t.nav.mm_solutions} />}
              {openMenu === 'support' && <MMList title={t.nav.support} items={t.nav.mm_support} />}
              {openMenu === 'company' && <MMList title={t.nav.company} items={t.nav.mm_company} />}
            </div>
          </div>
        )}

        {/* Search panel */}
        {searchOpen && (
          <div className="pd-search" onMouseLeave={() => setSearchOpen(false)}>
            <div className="pd-search__inner">
              <div className="pd-search__field">
                <LTGlyph name="search" size={16} />
                <input type="text" placeholder={t.nav.search_placeholder} autoFocus />
                <button className="pd-search__close" onClick={() => setSearchOpen(false)} aria-label="Close">ESC</button>
              </div>
              <div className="pd-search__quick">
                <span className="pd-search__quick-lbl">{t.nav.search_quick}</span>
                {t.nav.search_quick_items.map((q) => (
                  <button key={q} className="pd-search__chip" onClick={() => setSearchOpen(false)}>{q}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Backdrop when a menu is open */}
      {(openMenu || searchOpen) && <div className="pd-top__scrim" onClick={() => { setOpenMenu(null); setSearchOpen(false); }} />}
    </header>
  );
}

function NavItem({ id, label, openMenu, onOpen, active, hasMenu }) {
  const isOpen = openMenu === id;
  return (
    <button
      className={`pd-top__navitem${active ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => hasMenu && onOpen(id)}
      onFocus={() => hasMenu && onOpen(id)}
      aria-expanded={isOpen}
      aria-haspopup={hasMenu ? 'true' : undefined}
    >
      <span>{label}</span>
      {hasMenu && <LTGlyph name="chevron-down" size={11} />}
    </button>
  );
}

function MMProducts({ t, onClose }) {
  // Use the same series data rendered on the home page — single source of truth.
  const home = (typeof LT_HOME !== 'undefined' && LT_HOME[t.__locale]) || null;
  const series = home ? home.series.items : [
    { code: 'M / MS',  name: 'Analog series',  desc: '0–5 VDC / 4–20 mA',  count: '18 models', highlight: true, feat: '★ M3030VA' },
    { code: 'MD',      name: 'Digital series', desc: '±0.25 % accuracy',   count: '14 models' },
    { code: 'LD / LM', name: 'Specialty',      desc: 'Display / MEMS / Ex', count: '8 models' },
    { code: 'LTI',    name: 'Readouts',       desc: 'LTI-200, FC-050S',   count: '5 models' },
  ];
  return (
    <div className="pd-mm__grid pd-mm__grid--products">
      <div className="pd-mm__col pd-mm__col--series">
        <div className="pd-mm__coltitle">{t.nav.mm_series}</div>
        <div className="pd-mm__serieslist">
          {series.map((s) => (
            <a key={s.code} href="#" className={`pd-mm__series${s.highlight ? ' is-highlight' : ''}`} onClick={onClose}>
              <div className="pd-mm__series-top">
                <span className="pd-mm__series-code">{s.code}</span>
                <span className="pd-mm__series-count">{s.count}</span>
              </div>
              <div className="pd-mm__series-name">{s.name}</div>
              <div className="pd-mm__series-desc">{s.desc}</div>
            </a>
          ))}
        </div>
      </div>
      <div className="pd-mm__col pd-mm__col--featured">
        <div className="pd-mm__coltitle">{t.nav.mm_featured}</div>
        <a href="index.html" className="pd-mm__featured" onClick={onClose}>
          <div className="pd-mm__featured-img" aria-hidden>
            <div className="pd-mm__featured-model">M3030VA</div>
            <div className="pd-mm__featured-sub">LINE TECH</div>
          </div>
          <div className="pd-mm__featured-meta">
            <div className="pd-mm__featured-name">{t.hero.name}</div>
            <div className="pd-mm__featured-desc">10 SCCM – 20 SLM · ±1.0 % S.P. · Modbus RTU</div>
            <span className="pd-mm__featured-cta">{t.nav.product} <LTGlyph name="arrow-right" size={11} /></span>
          </div>
        </a>
      </div>
      <div className="pd-mm__col pd-mm__col--res">
        <div className="pd-mm__coltitle">{t.nav.mm_resources}</div>
        <ul className="pd-mm__linklist">
          {t.nav.mm_res_items.map((r) => (
            <li key={r}><a href="#" onClick={onClose}>{r}</a></li>
          ))}
        </ul>
        <a href="#" className="pd-mm__viewall" onClick={onClose}>{t.nav.mm_viewall} <LTGlyph name="arrow-right" size={12} /></a>
      </div>
    </div>
  );
}

function MMList({ title, items }) {
  // Two-column simple list for Solutions / Support / Company
  const mid = Math.ceil(items.length / 2);
  const left = items.slice(0, mid);
  const right = items.slice(mid);
  return (
    <div className="pd-mm__grid pd-mm__grid--list">
      <div className="pd-mm__col">
        <div className="pd-mm__coltitle">{title}</div>
        <ul className="pd-mm__linklist">
          {left.map((x) => <li key={x}><a href="#">{x}</a></li>)}
        </ul>
      </div>
      <div className="pd-mm__col">
        <div className="pd-mm__coltitle" aria-hidden>&nbsp;</div>
        <ul className="pd-mm__linklist">
          {right.map((x) => <li key={x}><a href="#">{x}</a></li>)}
        </ul>
      </div>
    </div>
  );
}

function Breadcrumb({ t }) {
  return (
    <nav className="pd-crumb" aria-label="Breadcrumb">
      <ol>
        <li><a href="#">{t.crumb.home}</a></li>
        <li><LTGlyph name="chevron-right" size={11} /></li>
        <li><a href="#">{t.crumb.products}</a></li>
        <li><LTGlyph name="chevron-right" size={11} /></li>
        <li><a href="#">{t.crumb.mfc}</a></li>
        <li><LTGlyph name="chevron-right" size={11} /></li>
        <li aria-current="page">{t.crumb.model}</li>
      </ol>
    </nav>
  );
}

function TabNav({ t, active, setActive }) {
  const tabs = [
    { id: 'overview', label: t.tabs.overview, num: '01' },
    { id: 'specs', label: t.tabs.specs, num: '02' },
    { id: 'dimensions', label: t.tabs.dimensions, num: '03' },
    { id: 'downloads', label: t.tabs.downloads, num: '04' },
  ];
  return (
    <div className="pd-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          className={`pd-tabs__tab${active === tab.id ? ' is-active' : ''}`}
          onClick={() => {
            setActive(tab.id);
            const el = document.getElementById(tab.id);
            if (el) window.scrollTo({ top: el.offsetTop - 120, behavior: 'smooth' });
          }}
        >
          <span className="pd-tabs__num">{tab.num}</span>
          <span className="pd-tabs__lbl">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

function Overview({ t }) {
  return (
    <section id="overview" data-screen-label="overview" className="pd-over">
      <header className="pd-section-hd">
        <div>
          <div className="pd-section-hd__kicker">01 — {t.tabs.overview}</div>
          <h2 className="pd-section-hd__title">{t.overview.heading}</h2>
          <p className="pd-section-hd__sub pd-section-hd__sub--lede">{t.overview.lede}</p>
        </div>
      </header>
      <div className="pd-over__grid">
        {t.overview.points.map((p) => (
          <LTCard key={p.k} tone="surface" pad="lg" className="pd-over__card">
            <div className="pd-over__k">{p.k}</div>
            <h3 className="pd-over__t">{p.t}</h3>
            <p className="pd-over__d">{p.d}</p>
          </LTCard>
        ))}
      </div>
    </section>
  );
}

function Footer({ t }) {
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
          <span className="pd-foot__v">v26.04 · Rev.7</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { PageShell, TabNav, Overview, TopBar, Footer });
