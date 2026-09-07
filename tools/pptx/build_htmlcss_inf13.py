#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 14 / KW 49: HTML/CSS - Grundgeruest der Webpraesenz
(LB 4, Ustd. 3-4/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts, css_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("html-css-grundgeruest.pptx")
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)
css = lambda t, ls, **kw: d.code(t, [css_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Das Grundgerüst",
        "Semantisches HTML und CSS — Struktur und Gestaltung getrennt")

d.chapter(1, "Trennung", "Inhalt, Struktur, Gestaltung")

d.table_top("Wer wofür zuständig ist", [
    ["Sprache", "Aufgabe", "Beispiel"],
    ["HTML", "Struktur und Bedeutung", "Das ist eine Überschrift"],
    ["CSS", "Aussehen", "Überschriften sind blau"],
    ["JavaScript", "Verhalten", "beim Klick passiert etwas"],
], [150, 330, 336], [
    ("**Semantisch** heißt: das Element sagt, **was** etwas ist, nicht wie es aussieht", 0),
    ("Wer Gestaltung ins HTML schreibt, muss jede Seite einzeln ändern", 0),
], font_size=11, bold_cols=(0,), marks={(1, 1): TINT_GREEN})

html("Ein semantisches Grundgerüst", [
    "<!DOCTYPE html>",
    "<html lang=\"de\">",
    "<head>",
    "  <meta charset=\"UTF-8\">",
    "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">",
    "  <title>Vereinsverzeichnis</title>",
    "  <link rel=\"stylesheet\" href=\"style.css\">",
    "</head>",
    "<body>",
    "  <header><h1>Vereine in Dresden</h1></header>",
    "  <nav><a href=\"index.html\">Start</a> <a href=\"liste.html\">Liste</a></nav>",
    "  <main><section><h2>Willkommen</h2><p>Kurzer Text.</p></section></main>",
    "  <footer><p>Ein Schulprojekt</p></footer>",
    "</body>",
    "</html>",
], size=10.5)

d.table_top("Semantische Elemente statt div", [
    ["statt", "besser", "bedeutet"],
    ["div class=\"kopf\"", "header", "Kopfbereich der Seite"],
    ["div class=\"menu\"", "nav", "Navigation"],
    ["div class=\"inhalt\"", "main", "Hauptinhalt, einmal je Seite"],
    ["div class=\"kasten\"", "section oder article", "Abschnitt bzw. eigenständiger Beitrag"],
    ["div class=\"fuss\"", "footer", "Fußbereich"],
], [200, 250, 366], [
    ("Semantische Elemente helfen **Screenreadern** und Suchmaschinen", 0),
    ("Und sie machen den Quelltext für Menschen lesbar", 0),
], font_size=10.5, bold_cols=(0,), mono_cols=(0, 1))

d.chapter(2, "CSS", "Auswählen und gestalten")

css("Die Grundformen der Selektoren", [
    "/* nach Element */",
    "h1 { color: #1c2b4a; font-size: 2rem; }",
    "",
    "/* nach Klasse - beliebig oft verwendbar */",
    ".hinweis { background: #f5f0e0; padding: 1rem; }",
    "",
    "/* nach ID - genau einmal je Seite */",
    "#hauptmenu { display: flex; gap: 1rem; }",
    "",
    "/* verschachtelt: Links innerhalb der Navigation */",
    "nav a { text-decoration: none; }",
], size=12)

d.table_top("Das Box-Modell", [
    ["Teil", "ist", "Beispiel"],
    ["content", "der Inhalt selbst", "der Text"],
    ["padding", "Abstand innen, innerhalb des Rahmens", "padding: 1rem"],
    ["border", "der Rahmen", "border: 1px solid"],
    ["margin", "Abstand außen, zwischen Elementen", "margin: 2rem 0"],
], [150, 350, 316], [
    ("Faustregel: **padding innen, margin außen** — die Verwechslung ist der Klassiker", 0),
    ("**box-sizing: border-box** lässt Breite inklusive Padding und Rahmen rechnen", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0,), marks={(2, 0): TINT_ORANGE, (4, 0): TINT_BLUE})

d.chapter(3, "Navigation", "Seiten verbinden")

d.bullets("Was eine brauchbare Navigation ausmacht", [
    ("Auf **jeder** Seite dieselbe Navigation, an derselben Stelle", 0),
    ("Die **aktuelle** Seite ist erkennbar markiert", 0),
    ("**Relative Pfade** benutzen, damit es auch beim Umziehen funktioniert", 0),
    ("Jeder Link hat einen **verständlichen Text** — nicht „hier klicken“", 0),
    ("Mit der **Tastatur** erreichbar: Tab-Reihenfolge prüfen", 0),
])

d.merksatz("HTML sagt, was etwas ist. CSS sagt, wie es aussieht. "
           "Wer beides mischt, ändert später jede Seite einzeln.")

d.bullets("Fun Facts: HTML und CSS", [
    ("**HTML** entstand 1991, **CSS** erst 1996 — dazwischen wurde mit Tabellen layoutet", 0),
    ("Das **font-Element** und blinkender Text gelten heute als abschreckende Beispiele", 0),
    ("**rem** bezieht sich auf die Schriftgröße der Wurzel — deshalb skaliert es mit den Einstellungen des Nutzers", 0),
    ("Der Fehler **„padding statt margin“** steht in jeder Anfängerliste", 0),
    ("Eine Seite ohne CSS bleibt **lesbar**, wenn das HTML semantisch ist — das ist die Probe", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Legt das **Grundgerüst** mit drei Seiten an, semantisch ausgezeichnet", 0),
    ("Baut eine **Navigation**, die auf allen Seiten gleich aussieht", 0),
    ("Schreibt **eine** CSS-Datei und bindet sie überall ein", 0),
    ("Probe: **schaltet CSS ab** — ist die Seite noch verständlich?", 0),
    ("Prüft mit dem **W3C-Validator**, ob euer HTML fehlerfrei ist", 0),
])

d.save()
