// SpecTable — 10 spec rows, three style variants, three density modes.
// style: striped | bordered | minimal
// density: compact | comfortable

function SpecTable({ t, style = 'bordered', density = 'comfortable', monoValues = true }) {
  const [copied, setCopied] = React.useState(false);
  const rows = t.specs.rows;
  const groups = t.specs.groups;

  const doCopy = () => {
    const lines = rows.map((r) => `${r.label}\t${r.value}${r.note && r.note !== '-' ? '\t(' + r.note + ')' : ''}`);
    const text = `${t.hero.model} — ${t.specs.heading}\n` + lines.join('\n');
    navigator.clipboard && navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  // Group rows for visual clustering
  const grouped = React.useMemo(() => {
    const map = new Map();
    rows.forEach((r, i) => {
      if (!map.has(r.group)) map.set(r.group, []);
      map.get(r.group).push({ ...r, i });
    });
    return Array.from(map.entries());
  }, [rows]);

  return (
    <section id="specs" data-screen-label="specs" className="pd-specs">
      <header className="pd-section-hd">
        <div>
          <div className="pd-section-hd__kicker">02 — {t.tabs.specs}</div>
          <h2 className="pd-section-hd__title">{t.specs.heading}</h2>
          <p className="pd-section-hd__sub">{t.specs.sub}</p>
        </div>
        <LTButton variant="ghost" size="sm" icon={<LTGlyph name={copied ? 'check' : 'copy'} size={13} />} onClick={doCopy}>
          {copied ? t.specs.copied : t.specs.copy}
        </LTButton>
      </header>

      <div className={`pd-spec pd-spec--${style} pd-spec--${density}${monoValues ? ' pd-spec--mono' : ''}`}>
        {grouped.map(([g, rs]) => (
          <div className="pd-spec__group" key={g}>
            <div className="pd-spec__grouplbl">
              <span className="pd-spec__groupnum">0{Object.keys(groups).indexOf(g) + 1}</span>
              <span>{groups[g]}</span>
            </div>
            <div className="pd-spec__rows">
              {rs.map((r) => (
                <div className="pd-spec__row" key={r.label}>
                  <div className="pd-spec__idx">{String(r.i + 1).padStart(2, '0')}</div>
                  <div className="pd-spec__lbl">{r.label}</div>
                  <div className="pd-spec__val">{r.value}</div>
                  <div className="pd-spec__note">{r.note && r.note !== '-' ? r.note : ''}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { SpecTable });
