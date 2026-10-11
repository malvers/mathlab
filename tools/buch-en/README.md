# English editions of the textbooks

The German book stays the single source. An English edition lives next to it in `HTML/buch/<book>-en/` (first one: `mathe11-en`, 10.10.2026).

## How it is built

- **Chapters:** only the content inside `<main class="b-main">` is translated. `wrap.py` adds the header and the scripts of the German chapter (header words in English) and the page title from `<book>-en/kapitel.js` (`lang: 'en'`, `druck: false` while there is no print edition).
- **Widgets:** the widget modules (`js/buch-funktionen.js`, …) stay German. `js/buch-en.js` translates what they write when they write it (innerHTML, textContent, attributes, canvas text). It holds the engine, the shared labels, the number rules and the header (Solita, "Fehler melden").
- **One dictionary per module:** `js/buch-en/<module>.js` for `js/buch-<module>.js`, loaded right after the module, registers itself with `BuchEN.add(name, { word, phrase, rule })`. A word that more than one module needs goes into `js/buch-en.js`.
- `js/buch.js` has its own few words inline (`Buch.t(de, en)`, `Buch.en`), numbers with a decimal point (`Buch.fmt`).

## Translating another book

1. Copy `<book>-en/` from `mathe11-en/` as a pattern: `index.html` (cover with `.b-titel-flag-gb`, button "Deutsche Ausgabe") and `kapitel.js` translated.
2. Per chapter, translate the content of `<main>` into a file, then `python3 tools/buch-en/wrap.py <book> <chapter> <file>`. It reports differences in the tag skeleton against the German chapter. Only added `<b>` and the like are allowed.
3. Fill the dictionaries of the modules the book uses (wrap.py creates empty ones). `node tools/buch-en/dump.mjs <book>` shows everything the widgets show after clicking through.
4. `node tools/buch-en/encheck.mjs <book>-en --poke` (browser, needs `python3 serve.py`): no JS/KaTeX errors, no overflow at 1280/390, no German in text, attributes or canvas.
5. Only then: `node tools/buch-en/check.mjs --accept` stores the strings that look German but are fine (keys, pieces of a rule) in `known.json`.

## Before every push

`node tools/buch-en/check.mjs` takes well under a second and needs no browser. It reports:

- answers and structure that differ between the German and the English page (`data-ans` etc.): a correction made in only one edition;
- missing or misplaced dictionaries, modules the German page loads and the English one does not;
- German widget sentences that were changed or added after the translation (with file and line);
- two dictionaries that translate the same German differently.

Fix: add the phrase to `js/buch-en/<module>.js`, or bring the answer over to the other edition.

## Two agents, two books at the same time

- New entries in a shared dictionary go into their own block at the end of each section, with a comment naming the book (`// book 3 mathe13-en: …`).
- Never push a shared file (dictionaries, `labs-icons.js`, `known.json`) by replacing it with your copy. Merge it three-way against the current `origin/main`: `git show <your base>:<path> > base`, `git show origin/main:<path> > theirs`, `git merge-file -p <your file> base theirs > merged`, and commit `merged`.
- `node tools/buch-en/check.mjs <your-book>-en --accept` only adds your book's strings to `known.json`, it keeps everything else.
- Change the engine `js/buch-en.js` only after agreeing on it.

## Not yet

OG preview cards (`tools/og-preview/make-og.mjs` has German templates), print edition, Solita answering in English.
