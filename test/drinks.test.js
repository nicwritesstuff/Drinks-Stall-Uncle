import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getLingo, describeDrink, DRINKS_BY_BASE, TOTAL_COMBINATIONS, DEFAULT_DRINK } from '../src/drinks.js';
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
  assert.equal(describeDrink({ ...DEFAULT_DRINK, base: 'Coffee + Tea' }), 'A friendly mash-up — coffee married to tea.');
});

test('phonetics replace longest phrase first', () => {
  assert.equal(toPhonetic('Kopi siu siu dai'), 'ko-pee siew siew dye');
  assert.equal(toPhonetic('Kopi siu dai'), 'ko-pee siew dye');
  assert.equal(toPhonetic('Yuan Yang o po kosong'), 'yoo-ahn yahng oh poh koh-song');
  assert.equal(toPhonetic('Teh c bing ga dai'), 'tay see beeng gah dye');
});
