# Druckregeln für die Lehrbücher

Gelernt am ersten KDP-Probedruck „Mathematik · Berufliches Gymnasium 11“ (Doc, 24.10.2026, mit Klebezetteln
in der Hand). Gilt für jede Druckausgabe `HTML/buch/<buch>/druck.html` und jedes PDF aus `tools/kdp/kdp.mjs`.
Gesetzt wird mit Paged.js 0.4.3 (`HTML/js/buch-druck.js`, `HTML/js/buch-druck.css`), immer im Farbschema
Hell (`HTML/js/farbschema.js`).

**Vor jedem Upload zu KDP:** `node tools/kdp/druckcheck.mjs <buch> [basis-url]` laufen lassen und die
gemeldeten Seiten ansehen. Das Skript prüft die Regeln 1 und 3. Regel 2 und 4 brauchen noch Augen.

## 1. Eine Überschrift steht nie allein am Seitenende

Ein Satzfehler wie Hurenkind und Schusterjunge. Paged.js beachtet `break-after: avoid` nicht, deshalb
schiebt der Handler `KeepWithNext` in `buch-druck.js` eine Überschrift, nach der auf der Seite nichts mehr
kommt, auf die nächste Seite, Band und Überschrift zusammen. Welche Elemente als Überschrift gelten, steht in
`KEEP`. **Wer eine neue Art Überschrift einführt, trägt sie dort ein.**

Vorfälle: S. 34 „Aufgaben“, S. 38 „Wiederholen · Vertiefen · Vernetzen“, S. 51 „Rückblick“,
S. 101 „Gauß-Verfahren“, dazu S. 18, 29 und 52: das Band „Test“ allein unten, darunter weiß. Der Test stand
vollständig auf der nächsten Seite, gelesen hat es sich aber wie ein leerer Test. Insgesamt fand
`druckcheck.mjs` im Probedruck 19 solche Stellen.

## 2. Nie dunkle Schrift auf dunklem Grund

Die Bücher sind für das dunkle Schema gezeichnet, `farbschema.js` übersetzt die Farben. Dabei werden
Akzentfarben im Hellen **dunkler**, und SVG-`fill` zählt immer als Schrift. Ein dunkler Grund in einem SVG
bleibt deshalb dunkel. Korrekturen für das helle Schema gehören in `HTML/js/farbschema.css`, mit einem
Element mehr als der übersetzte Zwilling (`html.fs-light body …`).

**Prüfen:** jede neue Box, jedes neue Band und jedes neue SVG-Widget einmal online mit `?farbschema=light`
ansehen. Was dort schlecht lesbar ist, ist es auf Papier noch mehr.

Vorfälle: S. 28 schwarz auf dunkellila (Band „Exkursion“), schwarz auf dunkelgrün („Wiederholen · Vertiefen ·
Vernetzen“), S. 116 und S. 120 schwarze Kästen im Baumdiagramm.

## 3. Nichts ragt über den Satzspiegel

Der Satzspiegel ist 178 mm breit, und in einer zweispaltigen Box ist es die Hälfte. Mindestbreiten in Pixeln
(`min-width` im Inline-Stil, feste `width` an SVGs) sind für den Bildschirm gedacht, wo man scrollen kann.
Im Druck gilt `max-width: 100%` und ein SVG skaliert über seine `viewBox`. Overrides stehen in
`buch-druck.css` unter `body.b-print`.

Vorfall: S. 120 das Baumdiagramm neben der Vierfeldertafel, rechts abgeschnitten.

## 4. Keine leeren Flächen

Alles Interaktive braucht eine Druckfassung. Wenn sie fehlt, druckt das Buch eine weiße Fläche mit
Überschrift, und die Leserin fragt sich, was da hingehört.

Auch ein Kapitelende kann leer wirken: Jedes Kapitel beginnt auf einer neuen Seite. Endet ein Kapitel mit
einem einzelnen Kasten, bleibt der Rest der Seite weiß. Offen (Stand 24.10.2026): S. 54, Kapitel 3.3 endet mit
nur dem Link „Anwendungen: Wurf, Brücke, Extremwerte“.

## 5. Der Einband zählt nicht mit

Die erste Seite nach dem Einband ist Seite 1 (`.d-front { counter-reset: page 1; }`). KDP bekommt den
Innenteil ohne Einband, Seite 1 ist eine rechte Seite, also stehen ungerade Zahlen rechts, wie in jedem Buch.

## 6. Links im Druck

Ein Link auf Papier ist nur nützlich, wenn man ihn abtippen oder scannen kann: als kurze URL mit QR-Code,
sauber untereinander. Offen (Docs Wunsch, 24.10.2026): Lab- und DocPad-Kästen mit QR-Code, ein eigenes
Icon für Links ins Buch.

## 7. Bilder

KDP druckt mit 300 dpi. `kdp.mjs` friert Canvas-Grafiken mit dem Faktor 3,2 ein (≈ 300 dpi). Fotos müssen
dieselbe Auflösung haben, frei lizenziert sein und eine Quellenangabe tragen.

## Noch nicht abgedeckt

- Hurenkind und Schusterjunge **innerhalb** von Absätzen (CSS `widows`/`orphans`): Paged.js setzt Text
  selbst um und hält sich nicht daran. Bisher ist das im Probedruck nicht aufgefallen.
