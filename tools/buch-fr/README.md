# French editions of the textbooks

Doc, 22.10.2026: "Schnapp dir fünf Agenten und mach die Übersetzung der Bücher in Französisch. Fang mit BGY an."
Package FR0 built the architecture as a sibling of the Italian one (`tools/buch-it/README.md`, whose "Round 2" rules and
"What round 2 taught us" hold here too; the Spanish brief `tools/buch-es/auftrag.md`, sections 1, 4 and 5, with es → fr).
The terms are in `glossaire.md`. The German book is the single source: translate from German, look at the Italian,
English or Spanish edition of the same book only to see which German strings the widgets write.

| Book | Agent | Worktree `.claude/worktrees/` | Branch | Port | Block |
|---|---|---|---|---|---|
| BGY 11 `mathe11` | Germain | `fr-germain` | `fr-arch` (FR0), then `fr-mathe11` | 8811 | `fr-1` |
| BGY 12 `mathe12` | Châtelet | `fr-chatelet` | `fr-mathe12` | 8812 | `fr-2` |
| BGY 13 `mathe13` | Lepaute | `fr-lepaute` | `fr-mathe13` | 8813 | `fr-3` |
| FOS 11 `mathefos11` | Choquet | `fr-choquet` | `fr-mathefos11` | 8814 | `fr-4` |
| FOS 12 `mathefos12` | Voisin | `fr-voisin` | `fr-mathefos12` | 8815 | `fr-5` |

## Language

- Standard French of France, the pupil is addressed with **tu**. Real accents and ligatures (é è ê à â ç ô û î ï œ), the
  typographic apostrophe ’ in the pages and in the dictionaries.
- French punctuation: a no-break space (U+00A0, the character itself) before `: ; ! ?` and inside « ». Never inside `$…$`.
- Numbers like German: decimal comma, `data-ans` exactly as in the German book. Points and intervals the French school
  way, always a semicolon: `A(2\,;\,3)`, `P(1{,}5\,;\,2)`, `[0\,;\,1]`, `]a\,;\,b[` in TeX, `A(2 ; 3)` in plain text. The
  exact rule and what the engine does with `\mid`: `glossaire.md`, section 4.
- School names stay ("Berufliches Gymnasium", "Fachoberschule", "Abitur", "Fachhochschulreife") and are explained once on
  the start page.
- Labs, weekly quizzes and worksheets stay German: say so once ("en allemand"). A link to another textbook goes to its
  French edition if it is one of these five, else to the English one.
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.

## What is where

- **Pages:** `HTML/buch/<book>-fr/` with `<html lang="fr">`, `kapitel.js` (`lang: 'fr'`, `druck: false`), the start page
  with the French tricolour (`.b-titel-flag-fr` in `js/buch-titel.css`) and the buttons "Édition allemande",
  "English edition", "Edición española", "Edizione italiana". Pattern: `HTML/buch/mathe11-fr/index.html` and `kapitel.js`.
- **Engine:** `js/buch-fr.js` (`window.BuchFR`), a sibling copy of `js/buch-it.js`: the engine part is the same code (change
  all four engines or none), the shared words and the header words are French ("Signaler une erreur", Solita's box, the
  colour scheme button). Numbers stay German; points and intervals get the French semicolon (every `\mid` outside a set
  becomes `\,;\,`). Canvas text keeps its decimal comma.
- **Dictionaries:** `js/buch-fr/<module>.js`, `BuchFR.add(name, { word, phrase, rule })`, for the ten modules the five books
  load (analysis, finanz, funktionen, gleichungen, integral, lgs, numerik, stochastik, vektoren, zahlen). Each has the
  comment lines `// book fr-1 mathe11-fr:` … `// book fr-5 mathefos12-fr:` in word, phrase and rule: write only right below
  your book's line, every entry ending with a comma. The `fr0` part above them is already done and is not added again:
  the five covers, the helpers of analysis, funktionen, stochastik and vektoren (the strings outside every widget, which
  `check.mjs` reports as `<module>/*` on every page that loads the module), the solution set $S$ (gleichungen) and the
  coordinate inputs (vektoren). The helpers of `zahlen` (only FOS 11) are left to fr-4.
- **`js/buch.js`:** `Buch.lang` = `'de' | 'en' | 'es' | 'it' | 'fr'`, `Buch.t(de, en, es, it, fr)` (a missing French falls
  back to German), `Buch.en` is true only for English, so every `B.en` in the widget modules keeps the German number style.
- **Speech:** "Signaler une erreur" dictates in `fr-FR`, the finish word is "j'ai fini". Solita stays German.
- **Link previews:** `tools/og-preview/make-og.mjs` has the French card words (`fr_FR`, a no-break space before the colon
  of the chapter card title).

## Tools (the English ones with a language switch)

    python3 tools/buch-en/wrap.py <book> <chapter> <file> --lang fr    # → HTML/buch/<book>-fr/<chapter>.html
    node tools/buch-en/check.mjs --lang fr [book-fr …]                  # known strings: tools/buch-fr/known.json
    node tools/buch-en/encheck.mjs <book>-fr --poke [page.html]         # language from the folder name
    node tools/buch-en/geo.mjs fr <book>-fr
    node tools/buch-en/fit.mjs fr <book>-fr
    node tools/buch-en/dump.mjs <book>-fr
    node tools/og-preview/make-og.mjs --only buch-<book>-fr-<chapter>  # after wrap.py rebuilt a page

Every browser tool with `PORT=<port>` of your own server (`python3 -m http.server <port> -d HTML --bind localhost`).
`check.mjs --lang fr` measures leftover words against `/usr/share/dict/french` if there is one (macOS has none), else only
against the words of the French dictionaries; "des" does not count as German there. Its blind spots are those of the
Italian round (labels passed to `B.seg`, German keys, sentences with `;` or a single lower-case word): after a chapter,
run `dump.mjs` and look for German in the widget output. Without `--lang` every tool works on the English editions
exactly as before.

## Phases and rules (the brief of 22.10.2026, shortened)

- **FR0** (Germain, first, alone, branch `fr-arch`): this architecture, one commit `fr0: …`, frozen, never amended.
  Proof that nothing else changed: `dump.mjs` before and after for the five books in en, es and it.
- **Phase A** (the other four, until FR0 is frozen): pre-translate in the scratch folder, chapter after chapter, the content
  of `<main class="b-main">` up to and with `</footer>` (the input `wrap.py` takes), plus `terms.md`. Before every new
  chapter: `git log fr-arch --format='%h %s' --grep='^fr0:'`.
- **Phase B** (everyone, own book): `git merge --ff-only fr-arch` (Germain: `git switch -c fr-mathe11` from the frozen
  `fr-arch`), read `glossaire.md` and align the drafts, then the start page + `kapitel.js` (pattern `mathe11-fr`),
  `wrap.py <book> <chapter> <draft> --lang fr` chapter by chapter, the widget strings into your block of the dictionaries,
  checks, a local commit after every chapter (subject `fr-<n>: …`). At the end: the "Édition française" button on your
  book's DE, EN, ES and IT start pages, and the link previews of your pages.

1. Only your own worktree, never the main checkout. No `stash`, `rebase`, `checkout --`, `reset --hard`, no push, no force.
2. Own server, headless only, no sound; stop it when you are done.
3. Shared files have a block per book (the dictionaries, `glossaire.md`). `js/buch-fr.js`, `js/buch.js`,
   `js/buch-titel.css`, the tools, the hub: not yours after FR0 - write what you need into your report. A German error
   found on the way: smallest fix, named in the report.
4. `known.json` conflicts between the books are expected; the orchestrator takes the union when merging.
5. Commit messages in English, short, ending with the Co-Authored-By line. Never a password, key or token.
6. Usage limit or API error: commit what is done (phase B) and stop.
7. Report: branch, commits, check results (`check.mjs --lang fr`, `encheck --poke`, `geo`, `fit`, a `dump.mjs` look for
   German words), German errors fixed, open questions.

## Merging the books (22.10.2026) and the next round

All five books went live on 22.10.2026 (bc694d32). What the orchestrator learned while merging them:

- **One French per German string, and the later file wins** - for `word` and for `phrase` alike (both are tables in
  `compile()` of `js/buch-fr.js`: `Object.assign` and `Map.set`); only the `rule` list runs in order, so there the first
  matching rule wins. A string that two blocks or two modules translate differently is therefore decided silently by
  the load order ("Was wird gezeigt?" in analysis and in vektoren). `check.mjs --lang fr` over **all** French books
  together names these cases - run it over all of them, not only over your own book.
- The five books had translated 494 widget strings two or three times. The merge kept one copy per string: the lowest
  block wins (fr0, then the book the widget belongs to), with a reason where a later one was better. So, **before you
  translate a widget string, search the dictionaries for it** (`grep -n "<German>" HTML/js/buch-fr/*.js`): another
  block may have it already.
- **Gender:** one German word may need two French words ("orthogonal": vectors "orthogonaux", lines
  "perpendiculaires"). Keep the common one as a word and make the other a rule tied to its widget's markup (see `lage`
  in `js/buch-fr/funktionen.js`).
- The chapter text says what the widget shows: a term changed in a dictionary is changed in the pages too ("boîte de
  conserve" in FOS 12).
- **Hub:** a card with five covers fits only at 80 px with an 8 px gap (`js/labs-icons.js`, measured at 1280 and 390).
- **Next round:** FR0 exists. The orchestrator only adds the comment lines `// book fr-6 …` (and so on) and empty
  dictionaries for the modules not translated yet, then one agent per book, all starting at once.

## Round 2 (25.10.2026): the Gymnasium books

Doc, 25.10.2026: "bitte beauftrage 5 Agentinnen weitere 5 Bücher in FR zu übersetzen … du bist die Dirigentin". The
orchestrator prepared the dictionaries in one local commit `fr2-prep:` (the block lines `fr-6 … fr-10` in the ten
existing modules, and the eleven new modules exponential, folgen, gy11, gy11lk, gy11lk-stoch, gy11lk-vek, gy12, gy12lk,
komplex, spiele, trigonometrie with only the block lines of the books that load them). No FR0 phase: every agent starts
right away on its own branch from that commit, with phase B of round 1.

| Book | Agent | Worktree `.claude/worktrees/` | Branch | Port | Block |
|---|---|---|---|---|---|
| GY 10 `mathegy10` | Saint-Raymond | `fr-saintraymond` | `fr-mathegy10` | 8821 | `fr-6` |
| GY 11 `mathegy11` | Vergne | `fr-vergne` | `fr-mathegy11` | 8822 | `fr-7` |
| GY 12 `mathegy12` | Amice | `fr-amice` | `fr-mathegy12` | 8823 | `fr-8` |
| LK 11 `mathegy11lk` | Dubreil | `fr-dubreil` | `fr-mathegy11lk` | 8824 | `fr-9` |
| LK 12 `mathegy12lk` | Ferrand | `fr-ferrand` | `fr-mathegy12lk` | 8825 | `fr-10` |

What is new in round 2:

- **School names:** "Gymnasium", "Grundkurs", "Leistungskurs" stay German and are explained once on the start page
  (like "Berufliches Gymnasium" in round 1).
- **Links to other textbooks** go to the French edition if there is one (now the five of round 1 and the five of round 2),
  else to the English one.
- **Search first:** a widget shared with a round-1 book (or with another round-2 book) is mostly translated already.
  `grep -n "<German>" HTML/js/buch-fr/*.js` before writing a string; a string written twice is merged away later anyway.
- **Photos** (`js/buch-fotos.js`) come into every language by themselves, with a French credit line. Nothing to do.
- **Not yours:** `js/buch.js`, `js/buch-fr.js`, `js/buch-fotos.js`, `js/buch-titel.css`, the tools, the hub (`js/labs-*`),
  `tools/buch-fr/known.json` conflicts (the orchestrator takes the union). What you need there goes into the report.
- Report to the orchestrator at the end: branch, tip, commits, check results, German errors fixed, open questions.
