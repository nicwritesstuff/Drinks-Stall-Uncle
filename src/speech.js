/* ============ TEXT-TO-SPEECH ============ */

const PHONETIC_MAP = {
  'kopi': 'ko-pee', 'teh': 'tay', 'yuan yang': 'yoo-ahn yahng', 'bing': 'beeng',
  'kosong': 'koh-song', 'siu dai': 'siew dye', 'siu siu dai': 'siew siew dye',
  'ga dai': 'gah dye', 'di lo': 'dee loh', 'po': 'poh', 'c': 'see', 'o': 'oh',
};

// Longest phrases first so "siu siu dai" isn't half-eaten by "siu dai".
// Keys are fixed ASCII words, so they are safe to drop into a RegExp as-is.
const PHONETIC_RULES = Object.entries(PHONETIC_MAP)
  .sort(([a], [b]) => b.length - a.length)
  .map(([word, sound]) => [new RegExp(`\\b${word}\\b`, 'g'), sound]);

export function toPhonetic(text) {
  return PHONETIC_RULES.reduce((out, [re, sound]) => out.replace(re, sound), text.toLowerCase());
}

const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
export const speechSupported = !!synth && typeof SpeechSynthesisUtterance !== 'undefined';

// Browsers load voices asynchronously: getVoices() is often empty until
// `voiceschanged` fires, so cache them as soon as they arrive.
let sgVoice;
function refreshVoice() {
  sgVoice = synth.getVoices().find(v => v.lang.includes('SG') || v.name.includes('Singapore'));
}
if (speechSupported) {
  refreshVoice();
  synth.addEventListener?.('voiceschanged', refreshVoice);
}

// `onEnd` fires exactly once, whether speech finishes, errors or is cancelled.
export function speakLingo(text, onEnd) {
  if (!speechSupported) return;
  synth.cancel();
  if (!sgVoice) refreshVoice();
  const u = new SpeechSynthesisUtterance(toPhonetic(text));
  if (sgVoice) u.voice = sgVoice;
  u.rate = 0.85;
  u.onend = u.onerror = () => onEnd?.();
  synth.speak(u);
}
