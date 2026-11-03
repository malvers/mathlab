# Swahili editions of the textbooks (Kenya)

Doc, 03.11.2026: "übersetz mal bitte BGY11 in Suaheli (Kenia) ich habe da "Prüfer" ob wir gut genug in der Sprache sind".
Package SW0 built the architecture as a sibling of the French one (`tools/buch-fr/README.md`), and the first book,
BGY 11 (`HTML/buch/mathe11-sw/`, block `sw-1`), was translated in the same go. The German book is the single source.
The terms are in `istilahi.md`.

## Language and conventions

- Kiswahili sanifu as Kenyan schools write it. The pupil is addressed with "wewe" (imperative singular: "Hesabu",
  "Tatua", "Chora"), the teachers in the foreword with "ninyi" ("karibuni").
- **Kenyan school notation, which is the English one** (mathematics is taught in English in Kenya): decimal point,
  comma between thousands (0.5 · 10,000 · 30%), points `(2, 3)`, intervals `[1, 2]`, `(1, 2)`, lines `y = mx + c`,
  the vertex form `a(x - h)^2 + k` with the vertex `V(h, k)`, the quadratic formula with `a, b, c` (not the German
  p-q formula), `log` for the common logarithm (not `lg`), `×` and `÷` between numbers, the identity matrix `I`,
  area `A`, perimeter `P`, circumference `C`, curved surface `A_P`. Answers (`data-ans`) keep their values, written
  with a decimal point as in the English editions.
- **Letters for events come from Swahili words** (Doc, 26.10.2026: "lokal bitte immer"): balls N/B (nyekundu/bluu),
  sick/healthy M/Z (mgonjwa/mzima), coin K/M (kichwa/mkia), the solution set S (seti ya masuluhisho).
- On the first definition of a key term the English school term stands in brackets, e.g. "kikoa (domain)", because
  Kenyan pupils meet these terms in English.
- Money stays in euros, written "€30" (the numbers of the German book stay, and KSh 30 for a ticket would be absurd).
  German places with real data stay (Dresden's day length); people get Kenyan names (Wanjiru, Otieno, Njeri, Zawadi …).
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page ("kama KCSE
  nchini Kenya"). Labs and weekly quizzes stay German: said once ("kwa Kijerumani").
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/mathe11-sw/` with `<html lang="sw">`, `kapitel.js` (`lang: 'sw'`, `druck: false`: no print
  edition yet), the start page with the Kenyan flag (`.b-titel-flag-ke` in `js/buch-titel.css`) and the buttons
  "Toleo la Kijerumani", "English edition", "Edición española", "Edizione italiana", "Édition française". The other five
  editions of BGY 11 have a button "Toleo la Kiswahili".
- **Engine:** `js/buch-sw.js` (`window.BuchSW`). Its engine part is the code of `js/buch-en.js`, because Kenya writes
  numbers as English does; the point rule is the general one of `js/buch-fr.js` (every `\mid` outside a set becomes a
  comma), intervals the English way, `2 \cdot 15` → `2 \times 15`.
- **`js/buch.js`:** `Buch.lang` = … `| 'sw'`, `Buch.t(de, en, es, it, fr, sw)`, `Buch.dot` (true for English and Swahili)
  drives `fmt`, `pct` and the answer parser; `Buch.en` stays English only. `js/buch-plot.js` reads `Buch.dot` for the axis
  numbers. The photos (`js/buch-fotos.js`) have a Swahili `alt` for the 26 photos of BGY 11, the foreword
  (`js/buch-gruss.js`) a Swahili letter.
- **Dictionaries:** `js/buch-sw/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; an `sw0` part
  (cover, helpers of the module, notation rules) and the block `// book sw-1 mathe11-sw:`.
- **Speech:** "Ripoti kosa" dictates in `sw-KE`, the finish word is "nimemaliza".
- **Link previews:** `tools/og-preview/make-og.mjs` has the Swahili card words (`sw_KE`).

## Tools

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang sw     # → HTML/buch/<book>-sw/<chapter>.html
    node tools/buch-en/check.mjs --lang sw [book-sw …]                   # known strings: tools/buch-sw/known.json
    PORT=<port> node tools/buch-en/encheck.mjs <book>-sw --poke          # browser: errors, overflow, German left over
    PORT=<port> node tools/buch-en/dump.mjs <book>-sw                    # what the widgets show after clicking through
    node tools/og-preview/make-og.mjs --only buch-<book>-sw-<chapter>   # after wrap.py rebuilt a page

There is no Swahili word list on macOS, so `check.mjs --lang sw` measures leftover words only against the Swahili
dictionaries; "bei" (price) does not count as German. The browser check is the real test.

## Next books

Add the block lines `// book sw-2 …` to the dictionaries the book loads (empty modules: `wrap.py --lang sw` makes them),
translate chapter by chapter, search the dictionaries before writing a widget string, keep the terms of `istilahi.md`.
