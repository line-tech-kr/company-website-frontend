// DimensionDrawing — interactive technical drawing with callouts.
// Uses SVG placeholder (ISO-style line drawing of a simple MFC silhouette).

function DimensionDrawing({ t }) {
  const [hover, setHover] = React.useState(null);
  const callouts = t.dims.callouts;

  return (
    <section id="dimensions" data-screen-label="dimensions" className="pd-dim">
      <header className="pd-section-hd">
        <div>
          <div className="pd-section-hd__kicker">03 — {t.tabs.dimensions}</div>
          <h2 className="pd-section-hd__title">{t.dims.heading}</h2>
          <p className="pd-section-hd__sub">{t.dims.sub}</p>
        </div>
      </header>

      <div className="pd-dim__frame">
        <div className="pd-dim__canvas">
          {/* Title block, like an ISO drawing corner */}
          <div className="pd-dim__titleblock">
            <div><span>DWG</span><b>LT-M3030VA-OUT</b></div>
            <div><span>REV</span><b>02</b></div>
            <div><span>SCALE</span><b>1:2</b></div>
            <div><span>UNIT</span><b>mm</b></div>
          </div>

          <svg viewBox="0 0 600 340" className="pd-dim__svg" preserveAspectRatio="xMidYMid meet">
            {/* background grid */}
            <defs>
              <pattern id="ltgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth=".3" opacity=".18" />
              </pattern>
              <pattern id="ltgrid2" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth=".5" opacity=".28" />
              </pattern>
              <marker id="lt-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
              <marker id="lt-arrow-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
              </marker>
            </defs>
            <rect width="600" height="340" fill="url(#ltgrid)" />
            <rect width="600" height="340" fill="url(#ltgrid2)" />

            {/* Center crosshair reference */}
            <line x1="0" y1="170" x2="600" y2="170" stroke="currentColor" strokeDasharray="2 4" strokeWidth=".5" opacity=".3" />
            <line x1="300" y1="0" x2="300" y2="340" stroke="currentColor" strokeDasharray="2 4" strokeWidth=".5" opacity=".3" />

            {/* MFC main body (side view) */}
            <g className="pd-dim__body">
              {/* base block */}
              <rect x="170" y="210" width="260" height="45" fill="var(--dim-fill)" stroke="currentColor" strokeWidth="1.3" />
              {/* upper electronics housing */}
              <rect x="200" y="120" width="200" height="90" fill="var(--dim-fill-2)" stroke="currentColor" strokeWidth="1.3" />
              {/* top cap */}
              <rect x="215" y="108" width="170" height="12" fill="var(--dim-fill)" stroke="currentColor" strokeWidth="1.3" />
              {/* connector */}
              <rect x="360" y="130" width="50" height="22" fill="none" stroke="currentColor" strokeWidth="1" />
              <line x1="365" y1="136" x2="405" y2="136" stroke="currentColor" strokeWidth=".6" />
              <line x1="365" y1="141" x2="405" y2="141" stroke="currentColor" strokeWidth=".6" />
              <line x1="365" y1="146" x2="405" y2="146" stroke="currentColor" strokeWidth=".6" />
              {/* model mark */}
              <text x="300" y="165" fontSize="9" textAnchor="middle" fill="currentColor" fontFamily="var(--lt-mono)">M3030VA</text>
              <text x="300" y="178" fontSize="6" textAnchor="middle" fill="currentColor" opacity=".6" fontFamily="var(--lt-mono)">LINE TECH</text>

              {/* fittings left / right */}
              <g>
                <rect x="140" y="220" width="30" height="25" fill="var(--dim-fill-2)" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="140" cy="232.5" r="8" fill="var(--pd-surface)" stroke="currentColor" strokeWidth="1" />
                <circle cx="140" cy="232.5" r="3" fill="currentColor" opacity=".15" />
              </g>
              <g>
                <rect x="430" y="220" width="30" height="25" fill="var(--dim-fill-2)" stroke="currentColor" strokeWidth="1.2" />
                <circle cx="460" cy="232.5" r="8" fill="var(--pd-surface)" stroke="currentColor" strokeWidth="1" />
                <circle cx="460" cy="232.5" r="3" fill="currentColor" opacity=".15" />
              </g>

              {/* mounting holes on base */}
              <circle cx="190" cy="250" r="3" fill="none" stroke="currentColor" strokeWidth=".8" />
              <circle cx="410" cy="250" r="3" fill="none" stroke="currentColor" strokeWidth=".8" />
              <line x1="187" y1="250" x2="193" y2="250" stroke="currentColor" strokeWidth=".5" />
              <line x1="190" y1="247" x2="190" y2="253" stroke="currentColor" strokeWidth=".5" />
              <line x1="407" y1="250" x2="413" y2="250" stroke="currentColor" strokeWidth=".5" />
              <line x1="410" y1="247" x2="410" y2="253" stroke="currentColor" strokeWidth=".5" />
            </g>

            {/* ─── Dimension lines ─── */}
            {/* A — overall width (top) */}
            <DimLine
              id="A" active={hover === 'A'}
              from={[200, 85]} to={[400, 85]}
              tick1={[200, 108]} tick2={[400, 108]}
              labelPos={[300, 78]} text="28.0" onEnter={() => setHover('A')} onLeave={() => setHover(null)}
            />

            {/* B — overall height (right) */}
            <DimLine
              id="B" active={hover === 'B'}
              from={[495, 108]} to={[495, 255]}
              tick1={[430, 108]} tick2={[430, 255]}
              labelPos={[505, 185]} text="115.5" vertical onEnter={() => setHover('B')} onLeave={() => setHover(null)}
            />

            {/* C — overall length (bottom) */}
            <DimLine
              id="C" active={hover === 'C'}
              from={[140, 285]} to={[460, 285]}
              tick1={[140, 258]} tick2={[460, 258]}
              labelPos={[300, 302]} text="123.0" onEnter={() => setHover('C')} onLeave={() => setHover(null)}
            />

            {/* D — fitting center-to-center */}
            <DimLine
              id="D" active={hover === 'D'}
              from={[140, 200]} to={[460, 200]}
              tick1={[140, 220]} tick2={[460, 220]}
              labelPos={[300, 193]} text="88.9" onEnter={() => setHover('D')} onLeave={() => setHover(null)}
            />

            {/* E — mounting holes, extension to a callout */}
            <g className="pd-dim__leader" onMouseEnter={() => setHover('E')} onMouseLeave={() => setHover(null)}>
              <path d="M190,250 L120,305 L90,305" fill="none" stroke="currentColor" strokeWidth=".9" />
              <circle cx="190" cy="250" r="2" fill="currentColor" />
              <text x="85" y="303" textAnchor="end" fontSize="10" fontFamily="var(--lt-mono)" fill="currentColor">M4 × 2</text>
            </g>

            {/* Callout letters — offset from dim-label positions */}
            <CalloutDot x={252} y={85}  letter="A" active={hover === 'A'} onEnter={() => setHover('A')} onLeave={() => setHover(null)} />
            <CalloutDot x={515} y={130} letter="B" active={hover === 'B'} onEnter={() => setHover('B')} onLeave={() => setHover(null)} />
            <CalloutDot x={252} y={285} letter="C" active={hover === 'C'} onEnter={() => setHover('C')} onLeave={() => setHover(null)} />
            <CalloutDot x={348} y={193} letter="D" active={hover === 'D'} onEnter={() => setHover('D')} onLeave={() => setHover(null)} />
            <CalloutDot x={70}  y={295} letter="E" active={hover === 'E'} onEnter={() => setHover('E')} onLeave={() => setHover(null)} />
          </svg>
        </div>

        {/* Callouts legend */}
        <aside className="pd-dim__legend" aria-label="Callouts">
          {callouts.map((c) => (
            <div
              key={c.id}
              className={`pd-dim__row${hover === c.id ? ' is-active' : ''}`}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}
            >
              <span className="pd-dim__dot">{c.id}</span>
              <span className="pd-dim__rowlbl">{c.label}</span>
              <span className="pd-dim__rowval">{c.value}</span>
            </div>
          ))}
          <p className="pd-dim__caption">{t.dims.caption}</p>
          <p className="pd-dim__note">{t.dims.note}</p>
        </aside>
      </div>
    </section>
  );
}

function DimLine({ from, to, tick1, tick2, labelPos, text, active, vertical, onEnter, onLeave }) {
  return (
    <g className={`pd-dim__dimline${active ? ' is-active' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      {/* extension lines */}
      <line x1={tick1[0]} y1={tick1[1]} x2={from[0]} y2={from[1]} stroke="currentColor" strokeWidth=".7" />
      <line x1={tick2[0]} y1={tick2[1]} x2={to[0]} y2={to[1]} stroke="currentColor" strokeWidth=".7" />
      {/* dim line */}
      <line
        x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]}
        stroke="currentColor" strokeWidth="1"
        markerStart="url(#lt-arrow-start)"
        markerEnd="url(#lt-arrow)"
      />
      <text
        x={labelPos[0]} y={labelPos[1]}
        textAnchor="middle"
        fontSize="11"
        fontFamily="var(--lt-mono)"
        fill="currentColor"
        transform={vertical ? `rotate(-90 ${labelPos[0]} ${labelPos[1]})` : undefined}
      >{text}</text>
    </g>
  );
}

function CalloutDot({ x, y, letter, active, onEnter, onLeave }) {
  return (
    <g className={`pd-dim__cdot${active ? ' is-active' : ''}`} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <circle cx={x} cy={y} r="8.5" />
      <text x={x} y={y + 3.5} textAnchor="middle" fontSize="9.5" fontFamily="var(--lt-sans)" fontWeight="600">{letter}</text>
    </g>
  );
}

Object.assign(window, { DimensionDrawing });
