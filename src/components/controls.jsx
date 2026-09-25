/* ============ SHARED CONTROLS ============ */

// Toggle buttons report their state to assistive tech via aria-pressed.
export function Chip({ active, onClick, children }) {
  return (
    <button type="button" className={`chip ${active ? 'active' : ''}`} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  );
}

export function DialButton({ active, onClick, children, sub }) {
  return (
    <button type="button" className={`c-dial ${active ? 'c-dial-active' : ''}`} aria-pressed={active} onClick={onClick}>
      <div className="c-dial-main">{children}</div>
      {sub && <div className="c-dial-sub">{sub}</div>}
    </button>
  );
}

export function SideLabel({ children }) {
  return <div className="c-side-label">{children}</div>;
}

export function GroupLabel({ children, note }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="group-label">
        <span>{children}</span>
        {note && <span className="helper-inline">— {note}</span>}
      </div>
    </div>
  );
}

export function HandArrow({ style }) {
  return (
    <svg className="arrow-svg" width="80" height="40" viewBox="0 0 80 40" style={style} aria-hidden="true">
      <path d="M4 26 Q 24 8 44 18 T 72 14" stroke="#1A1815" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M68 8 L 74 14 L 66 18" stroke="#1A1815" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// The spoken order, one popping word at a time. `as`/`className` let each view
// keep its own heading level and styling; animation timing comes from CSS vars.
export function LingoWords({ lingo, as: Tag, className, wordClassName, stepMs }) {
  return (
    <Tag className={className} key={lingo} aria-live="polite">
      {lingo.split(' ').map((word, i) => (
        <span
          key={i}
          className={`${wordClassName} ${i === 0 ? 'is-first' : ''}`}
          style={{ animationDelay: `${i * stepMs}ms` }}
        >{word}</span>
      ))}
    </Tag>
  );
}
