/* ============ DRINK OPTIONS, LABELS & LINGO ============ */

export const BASES = ['Coffee', 'Tea', 'Coffee + Tea'];
export const TEMPS = ['hot', 'iced'];
export const MILKS = ['condensed', 'evaporated', 'none'];
export const SUGARS = ['no_sugar', 'less_less', 'less', 'normal', 'more'];
export const INTENSITIES = ['less', 'normal', 'more'];

export const DEFAULT_DRINK = Object.freeze({
  base: 'Coffee', temp: 'hot', milk: 'condensed', sugar: 'normal', intensity: 'normal',
});

const SUGAR_LABELS = { no_sugar: 'None', less_less: 'Very Less', less: 'Less', normal: 'Normal', more: 'More' };
const INTENSITY_LABELS = { less: 'Weak', normal: 'Normal', more: 'Strong' };
const MILK_LABELS = { condensed: 'Condensed', evaporated: 'Evaporated', none: 'No Milk' };
const TEMP_LABELS = { hot: 'Hot', iced: 'Iced' };

export const sugarLabel = (s) => SUGAR_LABELS[s];
export const intensityLabel = (i) => INTENSITY_LABELS[i];
export const milkLabel = (m) => MILK_LABELS[m];
export const tempLabel = (t) => TEMP_LABELS[t];

const BASE_LINGO = { 'Coffee': 'Kopi', 'Tea': 'Teh', 'Coffee + Tea': 'Yuan Yang' };
const MILK_LINGO = { evaporated: 'c', none: 'o' };
const INTENSITY_LINGO = { more: 'di lo', less: 'po' };
const SUGAR_LINGO = { no_sugar: 'kosong', less_less: 'siu siu dai', less: 'siu dai', more: 'ga dai' };

// Builds the kopitiam order in the order uncle expects to hear it:
// base → milk → strength → temperature → sugar.
export function getLingo(drink) {
  return [
    BASE_LINGO[drink.base],
    MILK_LINGO[drink.milk],
    INTENSITY_LINGO[drink.intensity],
    drink.temp === 'iced' ? 'bing' : undefined,
    SUGAR_LINGO[drink.sugar],
  ].filter(Boolean).join(' ');
}

const MILK_RECIPE = { condensed: 'condensed milk', evaporated: 'evaporated milk', none: 'no milk' };
const SUGAR_RECIPE = {
  no_sugar: 'no sugar', less_less: 'very little sugar', less: 'less sugar', normal: 'normal sugar', more: 'extra sugar',
};
const INTENSITY_RECIPE = { less: 'weak brew', more: 'strong brew' };

export function describeDrink(drink) {
  const temp = drink.temp === 'iced' ? 'on ice' : 'piping hot';
  return [
    `${drink.base} ${temp}`,
    MILK_RECIPE[drink.milk],
    INTENSITY_RECIPE[drink.intensity], // normal strength needs no mention
    SUGAR_RECIPE[drink.sugar],
  ].filter(Boolean).join(', ') + '.';
}

// Shareable URL state: ?base=Tea&temp=iced&... Unknown/invalid values fall back to defaults.
const FIELD_OPTIONS = { base: BASES, temp: TEMPS, milk: MILKS, sugar: SUGARS, intensity: INTENSITIES };

export function decodeDrink(search) {
  const params = new URLSearchParams(search);
  const drink = { ...DEFAULT_DRINK };
  for (const [field, options] of Object.entries(FIELD_OPTIONS)) {
    const v = params.get(field);
    if (options.includes(v)) drink[field] = v;
  }
  return drink;
}

export function encodeDrink(drink) {
  const params = new URLSearchParams();
  for (const field of Object.keys(FIELD_OPTIONS)) {
    if (drink[field] !== DEFAULT_DRINK[field]) params.set(field, drink[field]);
  }
  const q = params.toString();
  return q ? `?${q}` : '';
}

export const sameDrink = (a, b) => Object.keys(FIELD_OPTIONS).every(f => a[f] === b[f]);

// Every combination, grouped by base. Built once so the objects are stable
// between renders (lets memoised DrinkSketch skip re-rendering the menu).
export const DRINKS_BY_BASE = Object.fromEntries(BASES.map((base) => {
  const drinks = [];
  TEMPS.forEach(temp => MILKS.forEach(milk => SUGARS.forEach(sugar => INTENSITIES.forEach(intensity => {
    drinks.push(Object.freeze({ base, temp, milk, sugar, intensity }));
  }))));
  return [base, drinks];
}));

export const TOTAL_COMBINATIONS = BASES.reduce((n, b) => n + DRINKS_BY_BASE[b].length, 0);

// `mean` is the desktop wording, `short` the tighter mobile wording.
export const PHRASES = [
  { word: 'Kopi', mean: 'Coffee with condensed milk', short: 'Coffee w/ condensed milk', tone: 'orange' },
  { word: 'Teh', mean: 'Tea with condensed milk', short: 'Tea w/ condensed milk', tone: 'leaf' },
  { word: 'Yuan Yang', mean: 'Coffee and tea mixed', short: 'Coffee + tea mix', tone: 'orange' },
  { word: 'C', mean: 'Evaporated milk instead', short: 'Evaporated milk', tone: 'ink' },
  { word: 'O', mean: 'No milk at all', short: 'No milk', tone: 'ink' },
  { word: 'Bing', mean: 'On ice', short: 'On ice', tone: 'ink' },
  { word: 'Kosong', mean: 'Zero sugar', short: 'Zero sugar', tone: 'ink' },
  { word: 'Siu Dai', mean: 'Less sugar', short: 'Less sugar', tone: 'ink' },
  { word: 'Siu Siu Dai', mean: 'Even less sugar', short: 'Even less sugar', tone: 'ink' },
  { word: 'Ga Dai', mean: 'Extra sugar', short: 'Extra sugar', tone: 'orange' },
  { word: 'Di Lo', mean: 'Strong, kao kao', short: 'Strong, kao kao', tone: 'ink' },
  { word: 'Po', mean: 'Weak, more water', short: 'Weak, more water', tone: 'ink' },
];
