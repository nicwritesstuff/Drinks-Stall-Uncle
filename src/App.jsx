/* ============ ROOT — picks view by viewport width ============ */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import DesktopView from './views/DesktopView.jsx';
import MobileView from './views/MobileView.jsx';
import { decodeDrink, encodeDrink, sameDrink } from './drinks.js';

const MOBILE_QUERY = '(max-width: 699.98px)';

function subscribeToViewport(onChange) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}
const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

export default function App() {
  const [selection, setSelectionState] = useState(() => decodeDrink(window.location.search));
  const current = useRef(selection);
  const [activeTable, setActiveTable] = useState(null);
  const isMobile = useSyncExternalStore(subscribeToViewport, isMobileViewport);

  // Every change is a history entry whose URL encodes the drink, so picks are
  // shareable, survive reload, and Back/Forward step through them.
  const setSelection = useCallback((next) => {
    if (sameDrink(next, current.current)) return;
    current.current = next;
    setSelectionState(next);
    window.history.pushState(null, '', window.location.pathname + encodeDrink(next));
  }, []);
  const pick = useCallback((field, value) => setSelection({ ...current.current, [field]: value }), [setSelection]);

  useEffect(() => {
    const onPop = () => {
      const next = decodeDrink(window.location.search);
      current.current = next;
      setSelectionState(next);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const toggleTable = useCallback((base) => setActiveTable(t => (t === base ? null : base)), []);

  const shared = { selection, pick, setSelection, activeTable, toggleTable };

  if (isMobile) {
    return (
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto' }}>
        <MobileView {...shared} />
      </div>
    );
  }
  return <DesktopView {...shared} />;
}
