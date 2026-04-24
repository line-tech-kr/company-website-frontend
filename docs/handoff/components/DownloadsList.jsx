// DownloadsList — file rows with type chip, size, rev, date; download state.

function DownloadsList({ t }) {
  const [state, setState] = React.useState({}); // { idx: 'idle' | 'loading' | 'done' }
  const start = (i) => {
    if (state[i] === 'loading' || state[i] === 'done') return;
    setState((s) => ({ ...s, [i]: 'loading' }));
    setTimeout(() => setState((s) => ({ ...s, [i]: 'done' })), 1400);
  };

  return (
    <section id="downloads" data-screen-label="downloads" className="pd-dl">
      <header className="pd-section-hd">
        <div>
          <div className="pd-section-hd__kicker">04 — {t.tabs.downloads}</div>
          <h2 className="pd-section-hd__title">{t.downloads.heading}</h2>
          <p className="pd-section-hd__sub">{t.downloads.sub}</p>
        </div>
      </header>

      <ul className="pd-dl__list" role="list">
        {t.downloads.items.map((it, i) => {
          const s = state[i] || 'idle';
          return (
            <li key={it.label} className={`pd-dl__row pd-dl__row--${s}`}>
              <span className="pd-dl__type">
                <LTTag tone={it.type === 'PDF' ? 'danger' : it.type === 'DWG' ? 'info' : 'neutral'}>{it.type}</LTTag>
              </span>
              <div className="pd-dl__meta">
                <div className="pd-dl__label">{it.label}</div>
                <div className="pd-dl__sub">
                  <span>{it.rev}</span>
                  <span className="pd-dl__dotsep">·</span>
                  <span>{it.size}</span>
                  <span className="pd-dl__dotsep">·</span>
                  <span>{it.date}</span>
                </div>
              </div>
              <LTButton
                variant={s === 'done' ? 'subtle' : 'ghost'}
                size="sm"
                icon={<LTGlyph name={s === 'done' ? 'check' : 'download'} size={14} />}
                onClick={() => start(i)}
              >
                {s === 'loading' ? '…' : s === 'done' ? t.cta.downloaded : t.cta.download}
              </LTButton>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

Object.assign(window, { DownloadsList });
