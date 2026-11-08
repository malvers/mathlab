# Dutch editions of the textbooks (the Netherlands)

Package arch3 (08.11.2026) built the architecture for three new languages at once - Portuguese `pt` (`tools/buch-pt/`),
Dutch `nl` (this folder), Turkish `tr` (`tools/buch-tr/`) - as siblings of the French one (`tools/buch-fr/README.md`) and of
SW0 (`tools/buch-sw/README.md`). The first book is BGY 11 (`HTML/buch/mathe11-nl/`, block `nl-1`). The German book is the
single source. The terms are in `woordenlijst.md`.

## Language and conventions (TODO nl: the agent of the Dutch edition completes this section)

- Standard Dutch as schools in the Netherlands write it; the pupil is addressed with "je/jij". Real diacritics (coördinaat,
  reëel, één).
- **Dutch school notation** (Doc: "lokal bitte immer"): decimal comma as in German. Points, intervals (Dutch schools write
  open ends with angle brackets ⟨1, 2⟩), the solution set, the line and vertex forms, the quadratic formula (abc-formule):
  TODO nl, decided in `js/buch-nl.js` (RULE, marked `TODO nl:`) and written down here. Answers (`data-ans`) keep their values.
- Letters for events come from Dutch words; money stays in euros, German places with real data stay; people get Dutch names.
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page. Labs and weekly
  quizzes stay German: said once ("in het Duits").
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/mathe11-nl/` with `<html lang="nl">`, `kapitel.js` (`lang: 'nl'`, `druck: false`), the start page
  with the Dutch flag (`.b-titel-flag-nl` in `js/buch-titel.css`) and buttons to the eight other editions. The other
  editions of BGY 11 have a button "Nederlandse editie".
- **Engine:** `js/buch-nl.js` (`window.BuchNL`), a sibling copy of the engine part of `js/buch-fr.js` (comma numbers). The
  header words are English placeholders marked `TODO nl:` - translate them.
- **`js/buch.js`:** `Buch.lang` = … `| 'nl'`, `Buch.t(de, en, es, it, fr, sw, pt, nl, tr)`, the eighth word; arch3 filled the
  Dutch words of buch.js (Tip, Oplossing, Controleren, HOOFDSTUK …) - report corrections, the file is not yours.
- **Dictionaries:** `js/buch-nl/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; an `nl0` part and the
  block `// book nl-1 mathe11-nl:`.
- **Speech:** the error report dictates in `nl-NL`, the finish word is "ik ben klaar". **Foreword:** `js/buch-gruss.js`,
  block `nl` (still the English letter, `TODO nl:`).
- **Link previews:** `tools/og-preview/make-og.mjs` has Dutch card words (`nl_NL`) - check them.

## Tools

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang nl     # → HTML/buch/<book>-nl/<chapter>.html
    node tools/buch-en/check.mjs --lang nl [book-nl …]                   # known strings: tools/buch-nl/known.json
    PORT=<port> node tools/buch-en/encheck.mjs <book>-nl --poke
    PORT=<port> node tools/buch-en/dump.mjs <book>-nl
    PORT=<port> node tools/buch-en/geo.mjs nl <book>-nl
    PORT=<port> node tools/buch-en/fit.mjs nl <book>-nl
    node tools/og-preview/make-og.mjs --only buch-<book>-nl-<chapter>

There is no Dutch word list on macOS, so `check.mjs --lang nl` measures leftover words only against the Dutch dictionaries;
"die", "wie", "des", "noch" and the letters ö, ü (coördinaat) do not count as German there.
