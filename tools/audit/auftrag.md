# Audit 10/2026 — a second pair of eyes on all teaching material

Doc, 12.10.2026: "alle Aufgaben und Bücher nochmals prüfen … doppelt ist besser bei Lehrmaterial".
Pupils learn from these pages. A wrong answer in a self-check teaches them that their correct result is wrong.
Your job is to find what is **really wrong** and fix it — not to restyle, not to rewrite, not to invent problems.

You are a cloud session with your own branch. You get **one package** (table below). Work only on that package.

## 1. Packages

| Package | What | Where |
|---|---|---|
| B1 | books GY 5 + GY 6, German and English | `HTML/buch/mathegy5`, `mathegy6` (+ `-en`), `HTML/js/buch-gy5.js`, `buch-gy6.js` |
| B2 | books GY 7 + GY 8 | `mathegy7`, `mathegy8` (+ `-en`), `buch-gy7.js`, `buch-gy8.js` |
| B3 | books GY 9 + GY 10 | `mathegy9`, `mathegy10` (+ `-en`) |
| B4 | books GY 11 + GY 11 LK | `mathegy11`, `mathegy11lk` (+ `-en`), `buch-gy11*.js` |
| B5 | books GY 12 + GY 12 LK | `mathegy12`, `mathegy12lk` (+ `-en`), `buch-gy12*.js` |
| B6 | books BGY 11 + BGY 12 | `mathe11`, `mathe12` (+ `-en`) |
| B7 | books BGY 13 + OS 10 | `mathe13`, `mathe10` (+ `-en`), `buch-os10.js` |
| B8 | books FOS 11 + FOS 12 | `mathefos11`, `mathefos12` (+ `-en`) |
| Q1 | weekly quizzes OS 6, 7, 8 | sources `tools/aufgaben/mathe6`, `mathe7`, `mathe8` → `HTML/mathetestos6-*.html` … |
| Q2 | weekly quizzes OS 9, OS 10, GY 11 | `tools/aufgaben/mathe9`, `mathe10`, `mathegy11` |
| Q3 | weekly quizzes GY 11 LK, GY 12, GY 12 LK | `tools/aufgaben/mathegy11lk`, `mathegy12`, `mathegy12lk` |
| Q4 | weekly quizzes FOS 11 + FOS 12 | `tools/aufgaben/mathefos11`, `mathefos12` |
| Q5 | weekly quizzes BGY 11 (`HTML/mathetest11-*.html`, `mathetest12.html`, `mathetest13.html`) | `tools/aufgaben/mathe11` |
| A1 | worksheets: Abitur, BLF, BGY 11 word problems | `HTML/aufgaben/*.html`, sources `tools/aufgaben/abi`, `blf`, `textaufgaben.py` |

The German Oberschule books OS 6–9 are not finished and not on `main`. They are not part of any package.

## 2. What to check

Recompute **everything yourself**, independently, before you believe it — with Python if it helps. Do not trust a
solution text, a `check()` function or another answer on the page. They were written by the same author.

**Books (German)**, chapter by chapter (`lbN-M.html`, `wb*.html`, `abi.html`, `index.html`):
- every self-check `<div class="b-q" data-ans="…">`: the expected answer (`data-ans`, `data-tol`) is right for the
  question as written, and the solution text in `b-sol` agrees with it;
- every task `b-task` with its hint and solution: numbers, steps, units, rounding, the final result;
- worked examples, key-point boxes (`b-merk`), definitions and theorems: mathematically correct and complete enough
  not to mislead (e.g. a condition that is missing, "≤" where it must be "<");
- references: "Aufgabe 3", "Beispiel 2", "Kapitel 4.1", numbering of tests, chapter numbers in `kapitel.js`;
- history and sources (`b-note`, excursions): dates, names, titles plausible; flag anything you cannot confirm;
- the widgets in `HTML/js/buch-*.js` the package's pages load: read the code that computes what pupils see (formulas,
  solvers, self-checks inside widgets) and recompute a few cases by hand.

**Books (English editions, `<book>-en/`)**: the same page in English must say the same thing — same numbers, same
answers, nothing left out, nothing added. Check that the mathematics in English is standard British usage
(e.g. "trapezium", "gradient", "spinner", decimal point, "CLASS TEST"). Run `node tools/buch-en/check.mjs <book>-en`
— it must end with "✓ ok". If you fix a number in the German book, fix it in the English book too, and vice versa.

**Weekly quizzes** (Q-packages): check the Python source `tools/aufgaben/<course>/w*.py` (or `*.py`), not the
generated HTML. For every question: the marked solution (`solution=`) is the only correct option, the other options
are wrong, the explanation lines are right, the question is answerable from what it says. Recompute the `check()`
asserts independently — a check that recomputes the same wrong formula proves nothing.

**Worksheets** (A1): every part of every task and its solution, recomputed. AFB levels plausible.
`node tools/aufgaben/check-sheet.mjs HTML/aufgaben/*.html` must stay clean.

## 3. Fix or report

- **Fix** what is clearly wrong: a wrong answer, a calculation error, a wrong sign, a wrong reference, a wrong unit,
  a misleading statement, a spelling mistake, German left in an English page. Make the **smallest** change that
  makes it right.
- **Report only** (no change) what is a matter of taste or didactics, what you are not sure about, and anything that
  would mean rewriting a section. Say why.
- Do not change layout, design, CSS, the engine `HTML/js/buch-en.js`, `HTML/js/buch.js` or any shared file beyond
  a one-line fix you can justify. No reformatting, no renaming, no "while I was here".

Where to fix:
- book text: the chapter HTML (German and its English twin);
- a widget: `HTML/js/buch-<module>.js`; its English words: `HTML/js/buch-en/<module>.js` (a rule there runs over
  the whole innerHTML, attributes included — never write a rule that can match SVG coordinates such as "88.4,664.6");
- a quiz: the Python source, then rebuild with the folder's build script (read its docstring: `build_all.py --check`,
  `python3 tools/aufgaben/build_os.py <class> --check`, or the file itself) and commit source **and** generated HTML.
  Never edit a generated `HTML/mathetest*.html` by hand.

## 4. Rules of the house (also in CLAUDE.md)

- German texts: real umlauts (ä ö ü ß), never "ae/oe/ue"; say "die Schülerin oder der Schüler", never "Kids".
- Numbers in running text stay plain text; LaTeX only for real formulas.
- "Doc Alvers Mathe-Labor" is a name — never translate it.
- Comments and commit messages in English.
- No secrets anywhere. The repo is public.

## 5. Git and the result

- Work on your own branch (`claude-…`). Commit and push there after every chapter or quiz folder. **Never push to
  `main`, never force-push, never merge.**
- Before every push: look at the diff (`git diff`) — only your fixes, no secrets.
- When the package is done, open **one pull request** to `main`, titled `audit <package>: <n> fixes, <m> notes`.
  The description has two tables:

  **Fixed** — `file:line` · what was wrong · your recomputation (one line) · what it says now

  **Notes, not changed** — `file:line` · what you noticed · why you did not change it

  End with one line: `checked: <list of files or chapters>`. If you found nothing in a chapter, say so — that is a
  result too.
- Better ten real findings than fifty doubtful ones. Every "Fixed" line must survive a second look.
