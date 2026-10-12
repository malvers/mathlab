# Spanish editions of the textbooks — brief for the cloud sessions

Doc, 12.10.2026: "übersetze bitte drei Bücher ins Spanische … mit dem, was wir alles schon wissen über Übersetzungen".
Sixteen English editions are live (`HTML/buch/*-en/`). Everything below comes from building them and from the second
check of 12.10.2026 (`tools/audit/auftrag.md`). Read `tools/buch-en/README.md` first — the Spanish editions copy that
architecture.

You get **one phase or one book** (table in 2). Work only on that. Your own branch, one pull request, never `main`.

## 1. What a Spanish edition is

- `HTML/buch/<book>-es/` next to the German book, the same file names, the same tag skeleton, the same answers.
  The German book stays the single source. Only the text inside `<main class="b-main">` is translated.
- **Spanish of Spain** (castellano), the pupil is addressed with **tú** (the German books say du).
  The school names stay recognisable: keep "Gymnasium", "Berufliches Gymnasium", "Fachoberschule", "Oberschule"
  as names and explain them once on the start page (the English editions say "Grammar School" etc.; for Spanish
  readers a short explanation is better than a false equivalent such as "gimnasio").
- **Numbers like in German:** decimal comma (`0,5`), thousands with a point or a thin space (`10 000` / `10.000`),
  `data-ans` exactly as in the German book. So unlike English, number formatting needs no conversion.
- **Points and intervals:** `P(2, 3)` and `[a, b]` for whole numbers; as soon as a coordinate has a decimal comma, a
  semicolon separates the coordinates: `P(1,5; 2)`, `[0,5; 3]`. One rule for all three books.
- Labs, weekly quizzes and worksheets stay German. Where a chapter links to them, say so once ("en alemán").
- Links to another textbook go to its Spanish edition if there is one, else to the English one, else to the German one.

## 2. Phases and packages

| Package | What | Who may start |
|---|---|---|
| **ES0** | The architecture (section 3), the glossary, and the start page + `kapitel.js` of all three books | first, alone |
| **ES1** | book 1, all chapters + its widget dictionaries | after ES0 is merged |
| **ES2** | book 2 | after ES0 is merged |
| **ES3** | book 3 | after ES0 is merged |

The three books: **Doc decides** (default if nothing else is said: BGY 11 `mathe11`, BGY 12 `mathe12`, BGY 13 `mathe13`
— the first three English editions, so every widget already has a tested English dictionary to compare with).

## 3. Package ES0 — the architecture

Goal: Spanish pages work like the English ones, **without changing a single character of what the 16 English books
show**. Prove that: run `node tools/buch-en/dump.mjs <book>` for every English book before and after your change and
diff the dumps; run `node tools/buch-en/check.mjs` (must end "✓ ok") before and after.

1. **Engine.** `js/buch-en.js` is the English engine (hooks on innerHTML, textContent, title, aria-label, placeholder,
   alt and canvas text; words, phrases, rules; header words). Make a Spanish engine `js/buch-es.js` with the same
   mechanics and Spanish shared words and header words (Solita box, "Fehler melden" → "Informar de un error", colour
   scheme button, page overview). Its number rules are **not** the English ones: Spanish keeps the decimal comma.
   Prefer a small shared core over a full copy if you can do it without touching English behaviour; a sibling copy is
   acceptable for now (say which you chose and why).
2. **Dictionaries.** `js/buch-es/<module>.js` per widget module, registered like the English ones. Each book package
   fills the dictionaries of the modules its pages load; a word that several modules need goes into `js/buch-es.js`.
3. **`js/buch.js`.** It has its own words inline as `t(de, en)` and a flag `Buch.en`. Give it a language
   (`Buch.lang` = 'de' | 'en' | 'es') and Spanish words, keeping `Buch.en` and `t(de, en)` working exactly as now.
   `Buch.fmt` keeps the comma for Spanish. Check every place that tests `B.en` in the widget modules
   (`grep -n "B.en\|Buch.en" HTML/js/buch-*.js`): most of them switch to the decimal point and must stay German-style
   for Spanish.
4. **Speech and plots.** `js/buch-feedback.js` (dictation language `es-ES`), `js/buch-plot.js` axis numbers (comma),
   Solita stays German.
5. **Tools.** Make `tools/buch-en/wrap.py` and `check.mjs` work for `es` (a `--lang es` switch or a sibling in
   `tools/buch-es/`). `encheck.mjs`, `geo.mjs` and `fit.mjs` must report German left in Spanish pages, raw `$`, KaTeX
   errors, overflow at 1280 and 390, changed SVG geometry, text outside its box.
6. **Cover and start page.** A Spanish flag on the cover as a central class (`.b-titel-flag-es` in `js/buch-titel.css`,
   like `.b-titel-flag-gb`), buttons "Edición alemana" and "English edition". `index.html` and `kapitel.js`
   (`lang: 'es'`, `druck: false`) for all three books.
7. **Glossary.** `tools/buch-es/glosario.md`: every recurring term once, decided for all three books — the section
   names (Auftakt, Erkundungen, Lerneinheit, Merke, Beispiel, Teste dich, Rückblick, Test, Runde 1 ohne Hilfsmittel …),
   the level names (Grundlage, Mittel, Anspruchsvoll), Klausur, Wahlbereich, Lernbereich, Ustd., and the maths terms
   that differ from English habits (Glücksrad = ruleta, Vierfeldertafel, Ableitung = derivada, Stammfunktion = primitiva …).

## 4. Book packages ES1–ES3

1. Start from `origin/main` **after ES0 is merged**. Follow the glossary; add a term to it in your own block if it is
   missing, never change an existing one without saying so in the PR.
2. Per chapter: translate the content of `<main class="b-main">`, run the wrap tool → **"0 differences"**.
3. Fill the dictionaries of the modules your pages load. The English dictionary of the same module shows which
   German sentences a widget writes — every German string there needs a Spanish one.
4. Check, in this order: check tool ✓; `encheck … --poke` **page by page** (a full run dies when the live reload of
   serve.py fires); `geo.mjs es <book>-es`; `fit.mjs es <book>-es`; all local links resolve.
5. German errors you find on the way: fix them in the German book (and in its English twin), smallest change,
   recompute first. List them separately in the PR.

## 5. Traps we fell into (English editions, 10.–12.10.2026)

- **A rule runs over the whole innerHTML, attributes included.** A rule meant for "0.0,035" also joined the SVG path
  "88.4,664.6" into "88.4664.6" and broke every drawing of a book. With the decimal comma in Spanish this is even
  closer: SVG coordinates are written "x,y". Never write a rule that can match digits around a comma or point
  without German words around them; test every rule on a real SVG string.
- **A `word` key that starts with `<b>` never matches** (the html pass skips pieces that start with "<"). Put such
  sentences in `phrase`.
- **Boxes sized from the German label.** A widget that computes a box width from the German text leaves the longer
  translation hanging out ("Trapezium" in the box made for "Trapez"). Fix it in the widget: size the box by the label
  the page shows (`vierecke6` in `js/buch-gy6.js`: `shown = t => B.en && window.BuchEN ? BuchEN.plain(t) : t`).
- **The same German word, two meanings.** "Satz" (theorem / rate), "Betrag" (absolute value / amount), "Würfel"
  (cube / dice): a global word breaks the other widget. Use a phrase with context or rename the German table head.
- **Two dictionaries, two translations of one word** ("Glücksrad": wheel of fortune vs spinner) — `check.mjs` finds
  conflicts; align with what exists.
- **Grammar the engine cannot see.** Plural after a number ("1 Tage"), gender after an article ("ein/eine"), word
  order around a number: write a rule or fix the German widget so it passes the whole phrase.
- **Generated pages** are never edited by hand; the books are not generated (their chapters are the source).
- **Do not overwrite shared files with your copy.** Edit them with a fresh read, your own block per book
  (`// book es-1 mathe11-es: …`); the orchestrator merges three-way.
- **Do not touch `main`, do not force-push, no secrets.** Secret scan of your diff before every push.

## 6. The result

One pull request per package, titled `es <package>: <book or "architecture">`, with: what was built, the glossary
changes, the check results (all six checks), the German errors fixed on the way (with recomputation), and what is
still open. The orchestrator (a local session) reviews, recomputes samples, adds the hub card with the Spanish cover
and merges.
