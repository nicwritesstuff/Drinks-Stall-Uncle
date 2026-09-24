/* ============ ROOT — picks view by viewport width ============ */
import { useCallback, useState, useSyncExternalStore } from 'react';
import DesktopView from './views/DesktopView.jsx';
import MobileView from './views/MobileView.jsx';
import { DEFAULT_DRINK } from './drinks.js';

const MOBILE_QUERY = '(max-width: 699.98px)';

function subscribeToViewport(onChange) {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}
const isMobileViewport = () => window.matchMedia(MOBILE_QUERY).matches;

export default function App() {
  const [selection, setSelection] = useState(DEFAULT_DRINK);
  const [activeTable, setActiveTable] = useState(null);
  const isMobile = useSyncExternalStore(subscribeToViewport, isMobileViewport);

  const pick = useCallback((field, value) => setSelection(s => ({ ...s, [field]: value })), []);
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
