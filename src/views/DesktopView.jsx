/* ============ DESKTOP VIEW ============ */
import DrinkSketch from '../components/DrinkSketch.jsx';
import { Chip, GroupLabel, HandArrow, LingoWords } from '../components/controls.jsx';
import {
  BASES, TEMPS, MILKS, SUGARS, INTENSITIES, DEFAULT_DRINK, DRINKS_BY_BASE, PHRASES, TOTAL_COMBINATIONS,
  getLingo, describeDrink, sugarLabel, intensityLabel, milkLabel, tempLabel,
} from '../drinks.js';
import { speakLingo } from '../speech.js';

const TONE_COLORS = { orange: 'var(--orange-deep)', leaf: 'var(--leaf)', ink: 'var(--ink)' };
const BASE_TILT = { 'Coffee': -1.4, 'Tea': 0.6, 'Coffee + Tea': -0.4 };
const BASE_PREVIEW = Object.fromEntries(BASES.map(b => [b, { ...DEFAULT_DRINK, base: b }]));

export default function DesktopView({ selection, pick, setSelection, activeTable, toggleTable }) {
  const lingo = getLingo(selection);

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '40px 24px 80px', position: 'relative' }}>
      <svg className="scribble" style={{ top: 20, right: 30, width: 90, height: 90 }} viewBox="0 0 90 90" aria-hidden="true">
        <path d="M10 50 Q 20 20 45 30 Q 70 40 80 20" stroke="#D97757" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M35 70 L 42 78 M 50 65 L 55 75" stroke="#1A1815" strokeWidth="1.6" strokeLinecap="round"/>
        <circle cx="70" cy="60" r="3" fill="#D97757" />
      </svg>
      <svg className="scribble" style={{ top: 80, left: 10, width: 70, height: 70 }} viewBox="0 0 70 70" aria-hidden="true">
        <path d="M10 35 Q 35 5 60 35 Q 35 65 10 35 Z" stroke="#1A1815" strokeWidth="1.8" fill="none" />
        <path d="M20 35 Q 35 22 50 35" stroke="#D97757" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      </svg>

      <header style={{ textAlign: 'center', marginBottom: 36, position: 'relative' }}>
        <div className="menu-pill" style={{ marginBottom: 18 }}>
          <span style={{ fontSize: 18 }}>☕</span> Kopitiam Order Cheat-Sheet
        </div>
        <h1 className="serif" style={{ fontSize: 'clamp(54px, 8vw, 104px)', margin: 0, lineHeight: 0.95, letterSpacing: '-0.025em', fontStyle: 'italic' }}>
          Drinks Stall <span style={{ color: 'var(--orange)' }}>Uncle</span>
        </h1>
        <p className="hand" style={{ fontSize: 28, marginTop: 8, marginBottom: 0, color: 'var(--ink-soft)' }}>
          ~ a friendly guide to ordering coffeeshop drinks in Singapore ~
        </p>
      </header>

      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)', gap: 28, alignItems: 'stretch' }}>
        <section className="card" style={{ transform: 'rotate(-0.4deg)' }}>
          <div className="tape" style={{ top: -16, left: 36, transform: 'rotate(-3deg)' }}></div>
          <div className="tape" style={{ top: -14, right: 32, transform: 'rotate(4deg)', background: 'rgba(107,122,79,0.45)' }}></div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 22 }}>
            <h2 className="serif" style={{ margin: 0, fontSize: 42, fontStyle: 'italic' }}>Build your drink</h2>
            <span className="hand" style={{ fontSize: 22, color: 'var(--orange-deep)' }}>tap to choose →</span>
          </div>

          <OptionGroup note="kopi, teh, or both?" label="1. Pick your base" columns={3}
            options={BASES} value={selection.base} onPick={(b) => pick('base', b)} />
          <OptionGroup note="hot for breakfast, iced for the heat" label="2. How cold?" columns={2}
            options={TEMPS} value={selection.temp} format={tempLabel} onPick={(t) => pick('temp', t)} />
          <OptionGroup note="condensed = sweet & creamy. evaporated = lighter." label="3. Milk situation" columns={3}
            options={MILKS} value={selection.milk} format={milkLabel} onPick={(m) => pick('milk', m)} />
          <OptionGroup note="how much concentrate vs water" label="4. Drink strength" columns={3}
            options={INTENSITIES} value={selection.intensity} format={intensityLabel} onPick={(i) => pick('intensity', i)} />
          <OptionGroup note="kosong = none, ga dai = extra" label="5. Sweet level" columns={5} gap={8} last
            options={SUGARS} value={selection.sugar}
            format={(s) => <span style={{ fontSize: 13 }}>{sugarLabel(s)}</span>}
            onPick={(s) => pick('sugar', s)} />
        </section>

        <section className="card card-dark" style={{ transform: 'rotate(0.6deg)', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="tape" style={{ top: -16, left: '50%', transform: 'translateX(-50%) rotate(-2deg)', background: 'rgba(251,246,233,0.6)' }}></div>
          <div className="small-cap" style={{ color: 'rgba(251,246,233,0.5)', marginBottom: 10 }}>The Order &nbsp;·&nbsp; serving #001</div>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginTop: 8, marginBottom: 18 }}>
            <div style={{ position: 'relative' }}>
              <DrinkSketch drink={selection} size="lg" />
              <div style={{ position: 'absolute', top: -10, right: -110, color: 'var(--cream)', textAlign: 'left' }}>
                <div className="hand" style={{ fontSize: 22, color: 'var(--orange)', maxWidth: 110, lineHeight: 1.05 }}>
                  {selection.temp === 'hot' ? 'steamy!' : 'icy cold!'}
                </div>
                <HandArrow style={{ marginTop: 2, transform: 'scaleX(-1) rotate(20deg)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 30, left: -130, color: 'var(--cream)', textAlign: 'right' }}>
                <HandArrow style={{ transform: 'rotate(-12deg)' }} />
                <div className="hand" style={{ fontSize: 22, color: 'var(--orange)', maxWidth: 130, lineHeight: 1.05, marginTop: 2 }}>
                  {selection.milk === 'condensed' ? 'sweet milk layer' : selection.milk === 'evaporated' ? 'evap milk top' : 'no milk — just kao kao!'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 6 }}>
            <div className="small-cap" style={{ color: 'rgba(251,246,233,0.5)', marginBottom: 6 }}>Say this to uncle ↓</div>
            <LingoWords lingo={lingo} as="h2" className="lingo" wordClassName="word" stepMs={60} />
            <button type="button" className="speak-btn" onClick={() => speakLingo(lingo)} style={{ marginTop: 18 }}>🔊 hear it</button>
          </div>
          <div style={{ marginTop: 24, paddingTop: 22, borderTop: '1.5px dashed rgba(251,246,233,0.25)' }}>
            <div className="small-cap" style={{ color: 'rgba(251,246,233,0.5)', marginBottom: 8 }}>Recipe</div>
            <div className="recipe-line">{describeDrink(selection)}</div>
          </div>
        </section>
      </div>

      <section style={{ marginTop: 56 }}>
        <div className="squiggle" style={{ marginBottom: 22 }}></div>
        <h3 className="serif" style={{ fontSize: 44, fontStyle: 'italic', textAlign: 'center', margin: '0 0 8px' }}>
          The <span className="underline-wob">phrase decoder</span>
        </h3>
        <p className="hand" style={{ textAlign: 'center', fontSize: 24, color: 'var(--ink-soft)', marginTop: 4, marginBottom: 28 }}>
          little words that change everything
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
          {PHRASES.map((p, i) => (
            <div key={p.word} className="card" style={{ padding: '14px 18px', transform: `rotate(${(i % 2 ? 0.5 : -0.5) * (1 + (i % 3))}deg)`, boxShadow: '4px 4px 0 var(--ink)' }}>
              <div className="serif" style={{ fontSize: 32, fontStyle: 'italic', lineHeight: 1, color: TONE_COLORS[p.tone] }}>{p.word}</div>
              <div className="hand" style={{ fontSize: 20, color: 'var(--ink-soft)', marginTop: 4 }}>= {p.mean}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 64 }}>
        <div className="squiggle" style={{ marginBottom: 22 }}></div>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h3 className="serif" style={{ fontSize: 44, fontStyle: 'italic', margin: 0 }}>The <span className="underline-wob">whole menu</span></h3>
          <p className="hand" style={{ fontSize: 24, color: 'var(--ink-soft)', marginTop: 4 }}>all {TOTAL_COMBINATIONS} combinations — pick a base to peek inside</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, flexWrap: 'wrap' }}>
          {BASES.map(b => (
            <button key={b} type="button" onClick={() => toggleTable(b)} className="card" aria-expanded={activeTable === b}
              style={{
                padding: '18px 22px 14px',
                background: activeTable === b ? 'var(--orange)' : 'var(--cream)',
                color: activeTable === b ? 'var(--cream)' : 'var(--ink)',
                cursor: 'pointer',
                transform: `rotate(${BASE_TILT[b]}deg)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 160
              }}>
              <DrinkSketch drink={BASE_PREVIEW[b]} size="sm" />
              <div className="serif" style={{ fontSize: 26, fontStyle: 'italic' }}>{b}</div>
              <div className="hand" style={{ fontSize: 18, opacity: 0.75 }}>{activeTable === b ? 'close ✕' : 'open ↓'}</div>
            </button>
          ))}
        </div>
        {activeTable && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
              <h4 className="serif" style={{ margin: 0, fontSize: 32, fontStyle: 'italic' }}>All the <span style={{ color: 'var(--orange-deep)' }}>{activeTable}</span> drinks</h4>
              <span className="hand" style={{ fontSize: 22, color: 'var(--ink-soft)' }}>{DRINKS_BY_BASE[activeTable].length} variations</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 12, justifyContent: 'center', maxWidth: 1080, margin: '0 auto' }}>
              {DRINKS_BY_BASE[activeTable].map((drink) => (
                <MenuCard key={getLingo(drink)} drink={drink} onPick={setSelection} />
              ))}
            </div>
          </div>
        )}
      </section>

      <footer style={{ marginTop: 80, textAlign: 'center' }}>
        <div className="squiggle" style={{ marginBottom: 18 }}></div>
        <p className="hand" style={{ fontSize: 26, color: 'var(--ink-soft)', margin: 0 }}>
          made with care for kopitiam culture · sit, sip, see uncle smile
        </p>
      </footer>
    </div>
  );
}

function OptionGroup({ label, note, options, value, format = (o) => o, onPick, columns, gap = 10, last = false }) {
  return (
    <div style={last ? undefined : { marginBottom: 24 }}>
      <GroupLabel note={note}>{label}</GroupLabel>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}>
        {options.map(o => <Chip key={o} active={value === o} onClick={() => onPick(o)}>{format(o)}</Chip>)}
      </div>
    </div>
  );
}

function MenuCard({ drink, onPick }) {
  return (
    <button type="button" className="grid-card" onClick={() => onPick(drink)} style={{ cursor: 'pointer', border: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--paper)', borderRadius: 8, padding: 6, border: '1.5px dashed var(--rule)' }}>
        <DrinkSketch drink={drink} size="sm" />
      </div>
      <div className="label">{getLingo(drink)}</div>
    </button>
  );
}
