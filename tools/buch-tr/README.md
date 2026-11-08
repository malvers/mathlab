# Turkish editions of the textbooks (Turkey)

Package arch3 (08.11.2026) built the architecture for three new languages at once - Portuguese `pt` (`tools/buch-pt/`),
Dutch `nl` (`tools/buch-nl/`), Turkish `tr` (this folder) - as siblings of the French one (`tools/buch-fr/README.md`) and of
SW0 (`tools/buch-sw/README.md`). The first book is BGY 11 (`HTML/buch/mathe11-tr/`, block `tr-1`). The German book is the
single source. The terms are in `sozluk.md`.

## Language and conventions (tr-1, BGY 11, 08.11.2026)

- Standard Turkish as schools in Turkey write it; the pupil is addressed with "sen" (Çöz, Hesapla, Göster), group tasks in
  the explorations with the plural imperative (Bulun, Çizin), the teachers in the foreword with "siz". Real letters
  (ç ğ ı İ ö ş ü), and the capitals of i and ı are İ and I: `js/buch.js` and `wrap.py` use the Turkish upper case, CSS
  `text-transform` does it by itself on `<html lang="tr">`. A German name keeps its German capitals: the header line reads
  BERUFLICHES GYMNASIUM (wrap.py writes BERUFLİCHES GYMNASİUM; tr-1 corrected its pages after wrap.py).
- **Turkish school notation** (Doc: "lokal bitte immer"), all in `sozluk.md`: decimal comma as in German, thousands with a
  dot; the percent sign before the number, %30 and `\%30` (POST of `js/buch-tr.js`, only after a space so that style
  sheets stay untouched); points (2, 5), with a decimal comma inside (1,5; 2); intervals [a, b], (a, b), [a, b);
  sets keep their bar {x | x ≥ 0}; solution set $\text{Ç}$; domain $T$ (tanım kümesi), range $G$ (görüntü kümesi);
  lines $y = mx + n$; the vertex $T(r, k)$ with $f(x) = a(x - r)^2 + k$; the quadratic formula with $\Delta = b^2 - 4ac$
  instead of the p-q formula; `log` instead of `lg`; the complement $A'$; conditional probability $P(B \,|\, A)$ with a
  plain bar (never `\mid`). Answers (`data-ans`) keep their values.
- Letters for events come from Turkish words (balls K/M, sick/healthy H/S, coin tura/yazı T/Y), also in the widgets
  (rules in `js/buch-tr/stochastik.js`); money stays in euros ("2 €"), German places with real data stay; people get
  Turkish names.
- School names stay German ("Berufliches Gymnasium", "Abitur") and are explained once on the start page (compared with
  the lise diploma and YKS). Labs and weekly quizzes stay German: said once on the start page and in every "ÇEVRİMİÇİ DAHA
  FAZLA ALIŞTIRMA (ALMANCA)" heading.
- "Doc Alvers Mathe-Labor" is never translated. Solita (the voice) stays German.
- **Orbitron** (Google Fonts) loads only its latin subset: ı is in it, ğ Ğ ş Ş İ are not. Chromium draws them from the base
  letter in Orbitron and the accent from the fallback font, which looks right at 1280 and 390 (checked on lb3-6: "ÖĞRENME
  ALANI", "DERİNLEŞTİR", "ETKİLEŞİMLİ"); other browsers may take the whole letter from the fallback font. A fix for all
  languages belongs into the shared CSS (a `unicode-range` face for U+011E-011F, U+0130, U+015E-015F), not into this book.

## What is where

- **Pages:** `HTML/buch/mathe11-tr/` with `<html lang="tr">`, `kapitel.js` (`lang: 'tr'`, `druck: false`), the start page
  with the Turkish flag (`.b-titel-flag-tr` in `js/buch-titel.css`) and buttons to the eight other editions. The other
  editions of BGY 11 have a button "Türkçe baskı".
- **Engine:** `js/buch-tr.js` (`window.BuchTR`), a sibling copy of the engine part of `js/buch-fr.js` (comma numbers). Header
  words in Turkish ("Hata bildir", Solita'ya sor); the notation rules above in RULE and POST.
- **`js/buch.js`:** `Buch.lang` = … `| 'tr'`, `Buch.t(de, en, es, it, fr, sw, pt, nl, tr)`, the ninth word; arch3 filled the
  Turkish words of buch.js (İpucu, Çözüm, Kontrol et, BÖLÜM …) - report corrections, the file is not yours.
- **Dictionaries:** `js/buch-tr/<module>.js` for funktionen, gleichungen, lgs, numerik, stochastik; a `tr0` part and the
  block `// book tr-1 mathe11-tr:`.
- **Speech:** the error report dictates in `tr-TR`, the finish word is "bitirdim". **Foreword:** `js/buch-gruss.js`, block
  `tr` (the Turkish letter, tr-1).
- **Link previews:** `tools/og-preview/make-og.mjs` has Turkish card words (`tr_TR`), checked by tr-1 (fine); the cards
  of mathe11-tr are not made yet (make-og.mjs uploads to R2: on Doc's word).

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
