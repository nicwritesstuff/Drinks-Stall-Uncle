/* ============ MOBILE CENTRIC VIEW ============ */
/**
 * Cup-centric layout: the order cup sits in the center; controls flank it
 * left and right symmetrically. The whole screen IS the drink.
 *   Left dial   — Base, Temp
 *   Right dial  — Milk, Strength
 *   Bottom strip — Sugar (5 options, easier as one row)
 */
import DrinkSketch from '../components/DrinkSketch.jsx';
import { DialButton, SideLabel, LingoWords } from '../components/controls.jsx';
import {
  BASES, TEMPS, MILKS, SUGARS, INTENSITIES, DRINKS_BY_BASE, PHRASES, TOTAL_COMBINATIONS,
  getLingo, sugarLabel, intensityLabel, milkLabel, tempLabel,
} from '../drinks.js';
import { speakLingo } from '../speech.js';

export default function MobileView({ selection, pick, setSelection, activeTable, toggleTable }) {
  const lingo = getLingo(selection);

  return (
    <div className="c-shell">
      <div className="c-header">
        <span className="c-pill">☕ Kopitiam Order</span>
        <h1 className="c-title">Drinks Stall <span style={{ color: '#D97757' }}>Uncle</span></h1>
      </div>

      <div className="c-stage">
        <div className="c-side">
          <DialGroup label="Base" options={BASES} value={selection.base} onPick={(b) => pick('base', b)}
            format={(b) => b === 'Coffee + Tea' ? <>Coffee<br/>+ Tea</> : b} />
          <DialGroup label="Temperature" options={TEMPS} value={selection.temp} onPick={(t) => pick('temp', t)}
            format={tempLabel} />
        </div>

        <div className="c-center">
          <div className="c-tape"></div>
          <div className="c-cup-wrap">
            <DrinkSketch drink={selection} size="sm" />
          </div>
          <div className="c-small-cap" style={{ marginBottom: 1 }}>say to uncle ↓</div>
          <LingoWords lingo={lingo} as="h3" className="c-lingo" wordClassName="c-word" stepMs={50} />
          <button type="button" className="c-speak-mini" onClick={() => speakLingo(lingo)}>🔊 hear</button>
        </div>

        <div className="c-side">
          <DialGroup label="Milk" options={MILKS} value={selection.milk} onPick={(m) => pick('milk', m)}
            format={milkLabel} />
          <DialGroup label="Strength" options={INTENSITIES} value={selection.intensity} onPick={(i) => pick('intensity', i)}
            format={intensityLabel} />
        </div>
      </div>

      <div className="c-sugar-block">
        <SideLabel>Sweetness</SideLabel>
        <div className="c-sugar-row">
          {SUGARS.map((s) => (
            <button key={s} type="button"
              className={`c-sugar-pill ${selection.sugar === s ? 'c-sugar-pill-active' : ''}`}
              aria-pressed={selection.sugar === s}
              onClick={() => pick('sugar', s)}>
              <span className="c-sugar-name">{sugarLabel(s)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="c-section-divider"></div>
      <h3 className="c-section-h">The phrase decoder</h3>
      <p className="c-section-sub">little words that change everything</p>
      <div className="c-decoder-grid">
        {PHRASES.map(p => (
          <div key={p.word} className="c-decoder-card">
            <div className="c-decoder-word">{p.word}</div>
            <div className="c-decoder-mean">= {p.short}</div>
          </div>
        ))}
      </div>

      <div className="c-section-divider"></div>
      <h3 className="c-section-h">The whole menu</h3>
      <p className="c-section-sub">all {TOTAL_COMBINATIONS} combinations — pick a base</p>
      <div className="c-menu-tabs">
        {BASES.map(b => (
          <button key={b} type="button"
            className={`c-menu-tab ${activeTable === b ? 'c-menu-tab-active' : ''}`}
            aria-expanded={activeTable === b}
            onClick={() => toggleTable(b)}>
            {b}
          </button>
        ))}
      </div>
      {activeTable && (
        <div className="c-menu-grid">
          {DRINKS_BY_BASE[activeTable].map((drink) => {
            const name = getLingo(drink);
            return (
              <button key={name} type="button" className="c-menu-card" onClick={() => setSelection(drink)}>
                <DrinkSketch drink={drink} size="sm" />
                <div className="c-menu-card-label">{name}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DialGroup({ label, options, value, onPick, format }) {
  return (
    <div>
      <SideLabel>{label}</SideLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {options.map(o => (
          <DialButton key={o} active={value === o} onClick={() => onPick(o)}>{format(o)}</DialButton>
        ))}
      </div>
    </div>
  );
}
