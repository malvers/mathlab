# Dutch editions of the textbooks (the Netherlands)

Package arch3 (08.11.2026) built the architecture for three new languages at once - Portuguese `pt` (`tools/buch-pt/`),
Dutch `nl` (this folder), Turkish `tr` (`tools/buch-tr/`) - as siblings of the French one (`tools/buch-fr/README.md`) and of
SW0 (`tools/buch-sw/README.md`). The first book is BGY 11 (`HTML/buch/mathe11-nl/`, block `nl-1`). The German book is the
single source. The terms are in `woordenlijst.md`.

## Language and conventions

- Standard Dutch as schools in the Netherlands write it (Getal & Ruimte, Moderne Wiskunde); the pupil is addressed with
  "je/jij". Real diacritics (coördinaat, reëel, één). Chapters have "paragrafen" (German Lerneinheiten), lessons are
  "lesuren"; the sections: introductie (I), verkenningen (V), herhalen · verdiepen · verbinden (H), excursie (X),
  project (P), samenvatting (S), toets (T).
- **Dutch school notation** (Doc: "lokal bitte immer"), in the pages and, through `js/buch-nl.js` and the module files,
  in the widgets:
  - numbers with a decimal comma as in German (`data-ans` keep their values), percent without a space (`30%`), money
    `€ 4` with the sign in front (after a formula: "euro");
  - points `P(2, 3)`, with a decimal comma `P(1,5; 2)`; intervals `[1, 2]`, open ends with angle brackets `⟨1, 2⟩`,
    `[0, →⟩` (TeX `\langle`, `\rightarrow`); domain `D_f`, range `B_f`; the solution set `V` (oplossingsverzameling);
  - lines `y = ax + b` (richtingscoëfficiënt a, startgetal b), exponential functions `b · g^x` (groeifactor g), the
    vertex form `a(x - p)^2 + q` with the top `T(p, q)`, the abc-formule with `D = b^2 - 4ac` (the German p-q formula is
    gone, Vieta stays as "som en product" for `x^2 + bx + c = 0`), the sine `a + b sin(c(x - d))` (evenwichtsstand a,
    amplitude b, periode 2π/c, beginpunt (d, a)), logarithms `log` (base 10) and `{}^{g}\!\log a`, the conditional
    probability `P(Z | T+)`, the identity matrix `I`, GR for the graphing calculator;
  - GeoGebra commands in their English names (GeoGebra understands them in every language), spreadsheet functions of
    the Dutch Excel (`ASELECTTUSSEN`, `AANTAL.ALS`, `ALS`).
- Letters for events come from Dutch words (R/B rood/blauw, Z/G ziek/gezond, K/M kop/munt); money stays in euros, German
  places with real data stay (Dresden); people get Dutch names (Sanne, Lotte, Fleur, Thijs, Noor …). Terms: `woordenlijst.md`.
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page. Labs and weekly
  quizzes stay German: said once ("in het Duits").
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/mathe11-nl/` with `<html lang="nl">`, `kapitel.js` (`lang: 'nl'`, `druck: false`), the start page
  with the Dutch flag (`.b-titel-flag-nl` in `js/buch-titel.css`) and buttons to the eight other editions. The other
  editions of BGY 11 have a button "Nederlandse editie".
- **Engine:** `js/buch-nl.js` (`window.BuchNL`), a sibling copy of the engine part of `js/buch-fr.js` (comma numbers), with
  the Dutch header words, the point and interval rules and the percent typography (book nl-1).
- **`js/buch.js`:** `Buch.lang` = … `| 'nl'`, `Buch.t(de, en, es, it, fr, sw, pt, nl, tr)`, the eighth word; arch3 filled the
  Dutch words of buch.js (Tip, Oplossing, Controleren, HOOFDSTUK …) - report corrections, the file is not yours.
- **Dictionaries:** `js/buch-nl/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; an `nl0` part and the
  block `// book nl-1 mathe11-nl:`.
- **Speech:** the error report dictates in `nl-NL`, the finish word is "ik ben klaar". **Foreword:** `js/buch-gruss.js`,
  block `nl` (the button is named "Fout melden" there, as `js/buch-nl.js` writes it).
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
