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

export function speakLingo(text) {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
  if (!synth || typeof SpeechSynthesisUtterance === 'undefined') return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(toPhonetic(text));
  const sg = synth.getVoices().find(v => v.lang.includes('SG') || v.name.includes('Singapore'));
  if (sg) u.voice = sg;
  u.rate = 0.85;
  synth.speak(u);
}
