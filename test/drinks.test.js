import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLingo, describeDrink, DRINKS_BY_BASE, TOTAL_COMBINATIONS, DEFAULT_DRINK, PHRASES, encodeDrink, decodeDrink } from '../src/drinks.js';
import { toPhonetic } from '../src/speech.js';

test('default order is plain kopi', () => {
  assert.equal(getLingo(DEFAULT_DRINK), 'Kopi');
});

test('modifiers come out in kopitiam order', () => {
  assert.equal(
    getLingo({ base: 'Tea', temp: 'iced', milk: 'evaporated', sugar: 'less_less', intensity: 'more' }),
    'Teh c di lo bing siu siu dai',
  );
  assert.equal(
    getLingo({ base: 'Coffee + Tea', temp: 'hot', milk: 'none', sugar: 'no_sugar', intensity: 'less' }),
    'Yuan Yang o po kosong',
  );
});

test('menu has 270 distinct combinations with unique names', () => {
  const all = Object.values(DRINKS_BY_BASE).flat();
  assert.equal(TOTAL_COMBINATIONS, 270);
  assert.equal(all.length, 270);
  assert.equal(new Set(all.map(getLingo)).size, 270);
});

test('describeDrink', () => {
  assert.equal(describeDrink(DEFAULT_DRINK), 'Coffee piping hot, condensed milk, normal sugar.');
  assert.equal(
    describeDrink({ ...DEFAULT_DRINK, base: 'Tea', milk: 'none', sugar: 'no_sugar' }),
    'Tea piping hot, no milk, no sugar.',
  );
  assert.equal(describeDrink({ ...DEFAULT_DRINK, sugar: 'less_less' }), 'Coffee piping hot, condensed milk, very little sugar.');
  assert.equal(
    describeDrink({ base: 'Coffee + Tea', temp: 'iced', milk: 'evaporated', sugar: 'more', intensity: 'more' }),
    'Coffee + Tea on ice, evaporated milk, strong brew, extra sugar.',
  );
});

test('every lingo token is explained in the phrase decoder', () => {
  const words = PHRASES.map(p => p.word.toLowerCase());
  for (const drink of Object.values(DRINKS_BY_BASE).flat()) {
    let rest = getLingo(drink).toLowerCase();
    for (const w of [...words].sort((a, b) => b.length - a.length)) rest = rest.replace(new RegExp(`\\b${w}\\b`), '');
    assert.equal(rest.trim(), '', getLingo(drink));
  }
});

test('drink round-trips through the URL', () => {
  assert.equal(encodeDrink(DEFAULT_DRINK), '');
  const d = { base: 'Coffee + Tea', temp: 'iced', milk: 'none', sugar: 'less_less', intensity: 'more' };
  assert.deepEqual(decodeDrink(encodeDrink(d)), d);
  assert.deepEqual(decodeDrink('?base=Bogus&temp=iced'), { ...DEFAULT_DRINK, temp: 'iced' });
});

test('phonetics replace longest phrase first', () => {
  assert.equal(toPhonetic('Kopi siu siu dai'), 'ko-pee siew siew dye');
  assert.equal(toPhonetic('Kopi siu dai'), 'ko-pee siew dye');
  assert.equal(toPhonetic('Yuan Yang o po kosong'), 'yoo-ahn yahng oh poh koh-song');
  assert.equal(toPhonetic('Teh c bing ga dai'), 'tay see beeng gah dye');
});
