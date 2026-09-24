# Drinks-Stall-Uncle
"Don't know how to order kopi? Lai _*coarse uncle-style coughs*_, Uncle help you!"

## Project layout

```
index.html          page shell (strict Content-Security-Policy, no third-party requests)
styles/main.css     all styles + self-hosted @font-face rules
assets/fonts/       Caveat, Instrument Serif, Inter, Kalam (latin + latin-ext subsets)
src/
  drinks.js         options, labels, lingo builder, menu combinations, phrase list
  speech.js         phonetic mapping + Web Speech playback
  components/       DrinkSketch (SVG cup) and shared controls
  views/            DesktopView and MobileView
  App.jsx, main.jsx root component + entry point
dist/app.js         built bundle (committed so the site works on any static host)
test/               unit tests (node:test)
```

## Development

```sh
npm install
npm run build   # bundles src/ into dist/app.js (commit the result)
npm run serve   # rebuilds on request and serves the site at http://localhost:8000
npm test
```
