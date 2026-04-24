// Line Tech core primitives: Button, Card, Chip, Tag, IconGlyph, LocaleSwitcher.
// Industrial/technical tone — thin borders, measured type, minimal decoration.

const { useState, useEffect, useRef, useMemo } = React;

// ── Button ───────────────────────────────────────────────────────────────
// Variants: primary (brand blue), accent (brand yellow), ghost (outline), subtle
function LTButton({ variant = 'primary', size = 'md', icon, children, onClick, disabled, as, href, fullWidth, trailingGlyph }) {
  const Tag = as || (href ? 'a' : 'button');
  const cls = `lt-btn lt-btn--${variant} lt-btn--${size}${fullWidth ? ' lt-btn--block' : ''}${disabled ? ' is-disabled' : ''}`;
  return (
    <Tag className={cls} onClick={disabled ? undefined : onClick} href={href} aria-disabled={disabled}>
      {icon && <span className="lt-btn__icon" aria-hidden>{icon}</span>}
      <span className="lt-btn__label">{children}</span>
      {trailingGlyph && <span className="lt-btn__trail" aria-hidden>{trailingGlyph}</span>}
    </Tag>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────
function LTCard({ children, tone = 'surface', pad = 'lg', className = '', interactive = false, as: Tag = 'div' }) {
  const cls = `lt-card lt-card--${tone} lt-card--pad-${pad}${interactive ? ' is-interactive' : ''} ${className}`;
  return <Tag className={cls}>{children}</Tag>;
}

// ── Chip (small pill: status, meta, file-type) ──────────────────────────
function LTChip({ children, tone = 'neutral', size = 'sm', dot }) {
  return (
    <span className={`lt-chip lt-chip--${tone} lt-chip--${size}`}>
      {dot && <span className="lt-chip__dot" aria-hidden />}
      {children}
    </span>
  );
}

// ── Tag / Badge (boxy, mono) ────────────────────────────────────────────
function LTTag({ children, tone = 'neutral' }) {
  return <span className={`lt-tag lt-tag--${tone}`}>{children}</span>;
}

// ── Glyph (tiny monochromatic SVG icons, stroke based) ──────────────────
function LTGlyph({ name, size = 14, stroke = 1.5 }) {
  const s = size;
  const common = { width: s, height: s, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrow-right':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrow-down':
      return <svg {...common}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
    case 'download':
      return <svg {...common}><path d="M12 4v12M7 11l5 5 5-5M5 20h14" /></svg>;
    case 'check':
      return <svg {...common}><path d="M5 12l4 4 10-10" /></svg>;
    case 'copy':
      return <svg {...common}><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" /></svg>;
    case 'external':
      return <svg {...common}><path d="M14 4h6v6M20 4L10 14M18 14v6H4V6h6" /></svg>;
    case 'globe':
      return <svg {...common}><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.5 3 2.5 13 0 16M12 4c-2.5 3-2.5 13 0 16" /></svg>;
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>;
    case 'chevron-down':
      return <svg {...common}><path d="M6 9l6 6 6-6" /></svg>;
    case 'chevron-right':
      return <svg {...common}><path d="M9 6l6 6-6 6" /></svg>;
    case 'phone':
      return <svg {...common}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>;
    case 'search':
      return <svg {...common}><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></svg>;
    case 'play':
      return <svg {...common}><path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" /></svg>;
    case 'file':
      return <svg {...common}><path d="M7 3h8l5 5v13a0 0 0 0 1 0 0H7z" /><path d="M15 3v5h5" /></svg>;
    case 'menu':
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case 'dot':
      return <svg {...common}><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" /></svg>;
    default:
      return null;
  }
}

// ── LocaleSwitcher (3-segment chip) ─────────────────────────────────────
function LTLocaleSwitcher({ value, options, onChange, size = 'md' }) {
  return (
    <div className={`lt-locale lt-locale--${size}`} role="radiogroup" aria-label="Language">
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={value === o.value}
          className={`lt-locale__opt${value === o.value ? ' is-active' : ''}`}
          onClick={() => onChange(o.value)}
        >
          <span className="lt-locale__code">{o.code}</span>
          <span className="lt-locale__name">{o.name}</span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, {
  LTButton, LTCard, LTChip, LTTag, LTGlyph, LTLocaleSwitcher,
});
