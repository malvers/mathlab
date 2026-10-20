# Italian editions of the textbooks

Doc, 18.10.2026: "schnappt ihr bitte zwei Agentinnen und macht die Übersetzung für die Mathebücher BGY elf zwölf
dreizehn. Bitte in Italienisch." Package IT0 built the architecture as a sibling of the Spanish one
(`tools/buch-es/README.md`, the brief `tools/buch-es/auftrag.md`, sections 1, 3, 4 and 5 hold with es → it); the terms are
in `glossario.md`. Books: BGY 11 `mathe11-it` (IT1), BGY 12 `mathe12-it` (IT2), BGY 13 `mathe13-it` (IT3).

## Language

- Standard Italian, the pupil is addressed with **tu**. Real accents (à è é ì ò ù), the elision apostrophe is the
  typographic one (’) in the dictionaries and in the pages.
- School names stay ("Berufliches Gymnasium", "Abitur") and are explained once on the start page.
- Numbers like German and Spanish: decimal comma, `data-ans` exactly as in the German book. Points and intervals as in
  Spanish: `P(2, 3)`, `[a, b]`; with a decimal comma a semicolon: `P(1,5; 2)`, `[0,5; 3]`.
- Labs, weekly quizzes and worksheets stay German: say so once ("in tedesco"). A link to another textbook goes to its
  Italian edition if there is one, else to the English one.
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/<book>-it/` with `<html lang="it">`, `kapitel.js` (`lang: 'it'`, `druck: false`), the start page
  with the Italian tricolour (`.b-titel-flag-it` in `js/buch-titel.css`) and the buttons "Edizione tedesca",
  "English edition" and "Edición española".
- **Engine:** `js/buch-it.js` (`window.BuchIT`), a sibling copy of `js/buch-es.js`: the engine part is the same code
  (change all three engines or none), the shared words and the header words are Italian ("Segnala un errore", Solita's
  box, the colour scheme button). Number rules as in Spanish: numbers stay German, only `\mid` and `;\,` in points and
  intervals change. Canvas text keeps its decimal comma.
- **Dictionaries:** `js/buch-it/<module>.js`, `BuchIT.add(name, { word, phrase, rule })`, for the eight modules the
  three books load (funktionen, gleichungen, lgs, numerik, stochastik, analysis, vektoren, integral). Each has the
  comment lines `// book it-1 mathe11-it:`, `// book it-2 mathe12-it:`, `// book it-3 mathe13-it:` in word, phrase and
  rule: write only right below your book's line, every entry ending with a comma, then the books merge without a
  conflict. The Spanish file of the same module shows which German strings the widgets write.
- **`js/buch.js`:** `Buch.lang` = `'de' | 'en' | 'es' | 'it'`, `Buch.t(de, en, es, it)` (a missing Italian falls back to
  German), `Buch.en` is true only for English, so every `B.en` in the widget modules keeps the German number style.
- **Speech:** "Segnala un errore" dictates in `it-IT`, the finish word is "ho finito". Solita stays German.
- **Link previews:** `tools/og-preview/make-og.mjs` has the Italian card words (`it_IT`).

## Tools (the English ones with a language switch)

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang it    # → HTML/buch/<book>-it/<chapter>.html
    node tools/buch-en/check.mjs --lang it [book-it …]                  # known strings: tools/buch-it/known.json
    node tools/buch-en/encheck.mjs <book>-it --poke [page.html]         # language from the folder name
    node tools/buch-en/geo.mjs it <book>-it
    node tools/buch-en/fit.mjs it <book>-it
    node tools/buch-en/dump.mjs <book>-it
    node tools/og-preview/make-og.mjs --only buch-<book>-it-<chapter>  # after wrap.py rebuilt a page

`check.mjs --lang it` measures leftover words against `/usr/share/dict/italian` if there is one, else only against the
words of the Italian dictionaries. Without `--lang` every tool works on the English editions exactly as before.

## Round 2 (20.10.2026): the six upper-school books, six local agents

Doc, 20.10.2026: "schnapp Dir 6 Agentinnen und macht 6 weitere Bücher in Italienisch". One orchestrator, one agent per
book; the brief is this README plus `tools/buch-es/auftrag.md` sections 1, 4 and 5 (es → it).

| Book | Agent | Worktree `.claude/worktrees/` | Branch | Port | Block |
|---|---|---|---|---|---|
| FOS 11 `mathefos11` | Castelnuovo | `it-castelnuovo` | `it-mathefos11` | 8795 | `it-4` |
| FOS 12 `mathefos12` | Cibrario | `it-cibrario` | `it-mathefos12` | 8796 | `it-5` |
| GY 11 `mathegy11` | Nalli | `it-nalli` | `it-mathegy11` | 8797 | `it-6` |
| GY 11 LK `mathegy11lk` | Pastori | `it-pastori` | `it-mathegy11lk` | 8798 | `it-7` |
| GY 12 `mathegy12` | Hack | `it-hack` | `it-mathegy12` | 8799 | `it-8` |
| GY 12 LK `mathegy12lk` | Gianotti | `it-gianotti` | `it-mathegy12lk` | 8800 | `it-9` |

1. **Only your own worktree**, never the main checkout (other agents' uncommitted work lives there). No `git switch`,
   `stash`, `rebase`, `checkout --`, no push. Commit locally on your branch after every chapter.
2. **Own server** from your worktree: `python3 -m http.server <port> -d HTML --bind localhost`; every browser tool with
   `PORT=<port>`. Stop it when you are done.
3. **Shared files have a block per book:** every `js/buch-it/<module>.js` (word, phrase, rule) and `glossario.md`.
   Write only right below your book's comment line, every entry ending with a comma. A German string that BGY 11/12/13
   or the IT0 part already translates: do not add it again (`check.mjs` flags two translations of one German string).
   `js/buch-it.js`, `js/buch.js`, `js/buch-titel.css`, the hub: not yours - write what you need into your report.
   A German error found on the way: smallest fix, named in the report.
4. **`known.json`** conflicts between the books are expected; the orchestrator takes the union when merging.
5. **Your own files besides the dictionaries:** `HTML/buch/<book>-it/`, the "Edizione italiana" button on the start
   pages of your book's German, English and Spanish editions, the link previews of your pages
   (`node tools/og-preview/make-og.mjs --only <ids>`).
6. **Report** at the end: branch, commits, check results (`check.mjs --lang it`, `encheck --poke`, `geo`, `fit`),
   German errors fixed, open questions. The orchestrator merges, adds the hub card with the Italian cover and pushes
   on Doc's word.
