# Spanish editions of the textbooks

Package ES0 (12.10.2026) built the architecture next to the English one (`tools/buch-en/README.md`); the brief is
`auftrag.md`, the terms are in `glosario.md`. Books: BGY 11 `mathe11-es`, BGY 12 `mathe12-es`, BGY 13 `mathe13-es`.

## What is where

- **Pages:** `HTML/buch/<book>-es/` with `<html lang="es">`, `kapitel.js` (`lang: 'es'`, `druck: false`), the start page
  with the Spanish flag (`.b-titel-flag-es` in `js/buch-titel.css`) and the buttons "Edición alemana" and "English edition".
- **Engine:** `js/buch-es.js`, a sibling copy of `js/buch-en.js` (`window.BuchES`). A copy and not a shared core, so
  that not one character of the English engine changes; the engine part is the same code (one difference, commented:
  a backslash also starts the translation, for a bare `$[1;\,2]$`). Change both or neither.
  Its rules differ: numbers stay German (0,5 · 10.000 · 30 %), only points and intervals change: `(1 \mid 2)` → `(1, 2)`,
  `(1{,}5 \mid 2)` → `(1{,}5; 2)`, `[1;\,2]` → `[1, 2]`, `[0{,}5;\,3]` stays. Canvas text keeps its decimal comma.
- **Dictionaries:** `js/buch-es/<module>.js`, `BuchES.add(name, { word, phrase, rule })`. ES0 made `funktionen`,
  `analysis` and `integral` with only the cover of the start page; the book packages fill them.
- **`js/buch.js`:** `Buch.lang` = `'de' | 'en' | 'es'`, `Buch.t(de, en, es)` (a missing Spanish falls back to German),
  `Buch.en` is true only for English, so every `B.en` in the widget modules keeps German number style for Spanish.
- **Speech:** "Informar de un error" dictates in `es-ES`, the finish word is "he terminado". Solita stays German.

## Tools (the English ones with a language switch)

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang es    # → HTML/buch/<book>-es/<chapter>.html
    node tools/buch-en/check.mjs --lang es [book-es …]                  # known strings: tools/buch-es/known.json
    node tools/buch-en/encheck.mjs <book>-es --poke [page.html]         # language from the folder name
    node tools/buch-en/geo.mjs es <book>-es
    node tools/buch-en/fit.mjs es <book>-es
    node tools/buch-en/dump.mjs <book>-es

`check.mjs --lang es` measures leftover words against `/usr/share/dict/spanish` if there is one, else only against the
words of the Spanish dictionaries - so it is stricter than the English check. After ES0 it still lists the German
sentences of the helpers of `funktionen`, `analysis` and `integral` (code outside the widgets, used by the chapters):
that is the work of ES1–ES3. `tools/buch-es/known.json` holds only the three cover labels, checked in the browser.
Without `--lang` every tool works on the English editions exactly as before.
