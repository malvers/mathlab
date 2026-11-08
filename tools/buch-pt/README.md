# Portuguese editions of the textbooks (Portugal)

Package arch3 (08.11.2026) built the architecture for three new languages at once - Portuguese `pt` (this folder),
Dutch `nl` (`tools/buch-nl/`), Turkish `tr` (`tools/buch-tr/`) - as siblings of the French one (`tools/buch-fr/README.md`)
and of SW0 (`tools/buch-sw/README.md`). The first book is BGY 11 (`HTML/buch/mathe11-pt/`, block `pt-1`). The German book
is the single source. The terms are in `glossario.md`.

## Language and conventions

- European Portuguese as schools in Portugal write it (Acordo Ortográfico 1990: "ação", "direção", "ótimo"). The pupil is
  addressed with "tu" ("Calcula", "Resolve", "Desenha"), the teachers in the foreword with "vocês". Real accents, never ASCII.
- **Portuguese school notation** (Doc: "lokal bitte immer"): decimal comma as in German (0,5 · 10 000 · 30 %); points
  `A(2, 3)`, with a decimal comma a semicolon `A(1,5; 2)`; intervals with outward brackets `[1, 2]`, `]1, 2[`, `[0,5; 3[`;
  set-builder with a colon `{x ∈ ℝ : x ≥ 0}`; lines `y = mx + b` (declive, ordenada na origem); the vertex form
  `a(x − h)² + k` with the vertex `V(h, k)`; the quadratic formula (fórmula resolvente) with `a, b, c` instead of the
  German p-q formula; `log` for the common logarithm (not `lg`); `sen` for the sine (`\operatorname{sen}`, also in the widgets); the domain `D_f` and the range `D'_f` (contradomínio);
  the solution set `C.S.`; conditional probability `P(A|B)` (write `|`, never `\mid`: the engine turns every `\mid` in
  round brackets into a comma). Answers (`data-ans`) keep their values.
- **Letters for events come from Portuguese words** (sick/healthy D/S doente/saudável, the two faces of a euro coin N/E face nacional/face europeia …, see the glossary).
- Money stays in euros, German places with real data stay (Dresden's day length); people get Portuguese names.
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page (compared with
  the 11.º ano of the ensino secundário and the exames nacionais). Labs and weekly quizzes stay German: said once ("em alemão").
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/mathe11-pt/` with `<html lang="pt">`, `kapitel.js` (`lang: 'pt'`, `druck: false`), the start page
  with the Portuguese flag (`.b-titel-flag-pt` in `js/buch-titel.css`) and buttons to the eight other editions. The other
  editions of BGY 11 have a button "Edição portuguesa".
- **Engine:** `js/buch-pt.js` (`window.BuchPT`), a sibling copy of the engine part of `js/buch-fr.js` (comma numbers); the
  point, interval and set rules above; the header words in Portuguese ("Comunicar um erro", Solita's box, the colour scheme).
- **`js/buch.js`:** `Buch.lang` = … `| 'pt' | 'nl' | 'tr'`, `Buch.t(de, en, es, it, fr, sw, pt, nl, tr)` (a missing one falls
  back to German), `Buch.dot` stays false (decimal comma), `Buch.en` stays English only.
- **Dictionaries:** `js/buch-pt/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; a `pt0` part (cover,
  helpers of the module, notation rules) and the block `// book pt-1 mathe11-pt:`.
- **Speech:** "Comunicar um erro" dictates in `pt-PT`, the finish word is "terminei". **Foreword:** `js/buch-gruss.js`, block `pt`.
- **Link previews:** `tools/og-preview/make-og.mjs` has the Portuguese card words (`pt_PT`).

## Tools

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang pt     # → HTML/buch/<book>-pt/<chapter>.html
    node tools/buch-en/check.mjs --lang pt [book-pt …]                   # known strings: tools/buch-pt/known.json
    PORT=<port> node tools/buch-en/encheck.mjs <book>-pt --poke          # browser: errors, overflow, German left over
    PORT=<port> node tools/buch-en/dump.mjs <book>-pt                    # what the widgets show after clicking through
    PORT=<port> node tools/buch-en/geo.mjs pt <book>-pt
    PORT=<port> node tools/buch-en/fit.mjs pt <book>-pt
    node tools/og-preview/make-og.mjs --only buch-<book>-pt-<chapter>   # after wrap.py rebuilt a page

There is no Portuguese word list on macOS, so `check.mjs --lang pt` measures leftover words only against the Portuguese
dictionaries; "das" (das funções) does not count as German, and the word boundaries know accented letters.

## Next books

Add the block lines `// book pt-2 …` to the dictionaries the book loads (empty modules: `wrap.py --lang pt` makes them),
translate chapter by chapter, search the dictionaries before writing a widget string, keep the terms of `glossario.md`.
