# Turkish editions of the textbooks (Turkey)

Package arch3 (08.11.2026) built the architecture for three new languages at once - Portuguese `pt` (`tools/buch-pt/`),
Dutch `nl` (`tools/buch-nl/`), Turkish `tr` (this folder) - as siblings of the French one (`tools/buch-fr/README.md`) and of
SW0 (`tools/buch-sw/README.md`). The first book is BGY 11 (`HTML/buch/mathe11-tr/`, block `tr-1`). The German book is the
single source. The terms are in `sozluk.md`.

## Language and conventions (TODO tr: the agent of the Turkish edition completes this section)

- Standard Turkish as schools in Turkey write it; the pupil is addressed with "sen". Real letters (ç ğ ı İ ö ş ü), and the
  capitals of i and ı are İ and I: `js/buch.js` and `wrap.py` use the Turkish upper case, CSS `text-transform` does it by
  itself on `<html lang="tr">`.
- **Turkish school notation** (Doc: "lokal bitte immer"): decimal comma as in German. Points, intervals (Turkish schools
  write open ends with round brackets (1, 2)), the solution set (Ç.K.), the line and vertex forms, the discriminant Δ:
  TODO tr, decided in `js/buch-tr.js` (RULE, marked `TODO tr:`) and written down here. Answers (`data-ans`) keep their values.
- Letters for events come from Turkish words; money stays in euros, German places with real data stay; people get Turkish names.
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page. Labs and weekly
  quizzes stay German: said once ("Almanca").
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.
- Orbitron has no ğ, ı, ş, İ: headings in Orbitron show those letters in the fallback font. Look at them at 1280 and 390.

## What is where

- **Pages:** `HTML/buch/mathe11-tr/` with `<html lang="tr">`, `kapitel.js` (`lang: 'tr'`, `druck: false`), the start page
  with the Turkish flag (`.b-titel-flag-tr` in `js/buch-titel.css`) and buttons to the eight other editions. The other
  editions of BGY 11 have a button "Türkçe baskı".
- **Engine:** `js/buch-tr.js` (`window.BuchTR`), a sibling copy of the engine part of `js/buch-fr.js` (comma numbers). The
  header words are English placeholders marked `TODO tr:` - translate them.
- **`js/buch.js`:** `Buch.lang` = … `| 'tr'`, `Buch.t(de, en, es, it, fr, sw, pt, nl, tr)`, the ninth word; arch3 filled the
  Turkish words of buch.js (İpucu, Çözüm, Kontrol et, BÖLÜM …) - report corrections, the file is not yours.
- **Dictionaries:** `js/buch-tr/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; a `tr0` part and the
  block `// book tr-1 mathe11-tr:`.
- **Speech:** the error report dictates in `tr-TR`, the finish word is "bitirdim". **Foreword:** `js/buch-gruss.js`, block
  `tr` (still the English letter, `TODO tr:`).
- **Link previews:** `tools/og-preview/make-og.mjs` has Turkish card words (`tr_TR`) - check them.

## Tools

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang tr     # → HTML/buch/<book>-tr/<chapter>.html
    node tools/buch-en/check.mjs --lang tr [book-tr …]                   # known strings: tools/buch-tr/known.json
    PORT=<port> node tools/buch-en/encheck.mjs <book>-tr --poke
    PORT=<port> node tools/buch-en/dump.mjs <book>-tr
    PORT=<port> node tools/buch-en/geo.mjs tr <book>-tr
    PORT=<port> node tools/buch-en/fit.mjs tr <book>-tr
    node tools/og-preview/make-og.mjs --only buch-<book>-tr-<chapter>

There is no Turkish word list on macOS, so `check.mjs --lang tr` measures leftover words only against the Turkish
dictionaries; ö and ü are Turkish letters there, and the word boundaries know ç, ğ, ı, ş ("biçim" is no German "im").
