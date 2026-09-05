#!/usr/bin/env python3
"""Statische Webseiten I: HTML - Elemente einer Auszeichnungssprache (Woche 24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("html-grundlagen.pptx")
P = lambda n: os.path.join(IMG, n)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "HTML",
        "Statische Webseiten I: die Sprache, die dem Browser die Struktur verrät")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Auszeichnen", "HTML ist keine Programmiersprache")

d.bullets("Was HTML tut — und was nicht", [
    ("**HTML** = HyperText Markup Language, eine **Auszeichnungssprache**", 0),
    ("Sie **beschreibt Struktur**: Das ist eine Überschrift, das ein Absatz, das eine Liste", 0),
    ("Sie **rechnet nichts**, entscheidet nichts, wiederholt nichts — keine Algorithmen", 0),
    ("Wie es **aussieht**, bestimmt CSS (nächste Woche). Was **passiert**, bestimmt JavaScript", 0),
    ("Der Browser liest den Text, baut daraus einen **Baum** und zeigt ihn an", 0),
])

d.table_top("Die drei Grundbegriffe", [
    ["Begriff", "Beispiel", "bedeutet"],
    ["Tag", "<p> … </p>", "Anfangs- und Endmarke, in spitzen Klammern"],
    ["Element", "<p>Hallo</p>", "Tags samt Inhalt — ein Bauteil der Seite"],
    ["Attribut", "<a href=\"…\">", "Zusatzangabe im Anfangstag, Name=\"Wert\""],
    ["leeres Element", "<img>, <br>", "hat keinen Inhalt, also keinen Endtag"],
], [180, 220, 416], [
    ("Elemente werden **verschachtelt**, nie überkreuzt: zuletzt geöffnet = zuerst geschlossen", 0),
    ("Der entstehende Baum heißt **DOM** — Document Object Model", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Grundgerüst", "Fünf Zeilen, die jede Seite braucht")

html("Jede Seite beginnt so", [
    "<!DOCTYPE html>",
    "<html lang=\"de\">",
    "<head>",
    "    <meta charset=\"UTF-8\">",
    "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">",
    "    <title>Ernaehrungstagebuch</title>",
    "    <link rel=\"stylesheet\" href=\"stil.css\">",
    "</head>",
    "<body>",
    "    <h1>Mein Ernaehrungstagebuch</h1>",
    "    <p>Hier trage ich meine Mahlzeiten ein.</p>",
    "</body>",
    "</html>",
], size=12)

d.table_top("Kopf und Körper", [
    ["Zeile", "wozu"],
    ["<!DOCTYPE html>", "sagt: das ist HTML5 — muss ganz oben stehen"],
    ["lang=\"de\"", "Sprache der Seite: wichtig für Vorlesesoftware und Suchmaschinen"],
    ["<meta charset=\"UTF-8\">", "Zeichensatz — ohne diese Zeile werden Umlaute zu Kauderwelsch"],
    ["<meta name=\"viewport\"…>", "Grundlage für die Darstellung auf dem Handy"],
    ["<title>", "Text im Browser-Tab und im Suchergebnis"],
    ["<head> / <body>", "Angaben ÜBER die Seite / der sichtbare Inhalt"],
], [250, 566], [
    ("Alles im **head** ist unsichtbar, aber nicht unwichtig", 0),
    ("Der **viewport** ist die Eintrittskarte zum responsiven Layout", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Bausteine", "Überschriften, Absätze, Listen, Links, Bilder")

html("Text, Listen und Links", [
    "<h1>Ueberschrift 1. Ordnung - genau EINE pro Seite</h1>",
    "<h2>Abschnitt</h2>",
    "<h3>Unterabschnitt</h3>",
    "",
    "<p>Ein Absatz. Zeilenumbrueche im Quelltext sind dem Browser egal.</p>",
    "<p>Ein Wort <strong>wichtig</strong> und eines <em>betont</em>.</p>",
    "",
    "<ul>",
    "    <li>unsortierte Liste</li>",
    "    <li>zweiter Punkt</li>",
    "</ul>",
    "",
    "<ol>",
    "    <li>nummerierte Liste</li>",
    "</ol>",
    "",
    "<a href=\"rezepte.html\">zu den Rezepten</a>",
    "<a href=\"https://www.dge.de\" target=\"_blank\">externe Seite</a>",
], size=10.5)

html("Bilder und Tabellen", [
    "<img src=\"bilder/apfel.jpg\" alt=\"Ein halbierter Apfel auf einem Teller\" width=\"400\">",
    "",
    "<table>",
    "    <tr>",
    "        <th>Lebensmittel</th><th>kcal je 100 g</th>",
    "    </tr>",
    "    <tr>",
    "        <td>Apfel</td><td>52</td>",
    "    </tr>",
    "    <tr>",
    "        <td>Haferflocken</td><td>372</td>",
    "    </tr>",
    "</table>",
], size=12)

d.table_top("Die wichtigsten Elemente", [
    ["Element", "wofür", "Hinweis"],
    ["h1 … h6", "Überschriftenebenen", "Reihenfolge einhalten, keine Ebene überspringen"],
    ["p", "Absatz", "nicht für Abstände missbrauchen — dafür ist CSS da"],
    ["ul / ol / li", "Listen", "li steckt immer in ul oder ol"],
    ["a href", "Link", "relativer Pfad im Projekt, absoluter nach außen"],
    ["img src alt", "Bild", "alt ist Pflicht — Text für alle, die es nicht sehen"],
    ["table tr th td", "Tabelle", "nur für echte Daten, nie für Layout"],
], [160, 220, 436], [
    ("**Semantik vor Optik**: Ein h2 ist eine Überschrift, keine große fette Schrift", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0,),
   marks={(6, 2): TINT_RED, (5, 2): TINT_ORANGE})

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Struktur zeigen", "Semantische Elemente und Barrierefreiheit")

html("Eine Seite mit Struktur", [
    "<body>",
    "    <header>",
    "        <h1>Ernaehrungstagebuch</h1>",
    "    </header>",
    "    <nav>",
    "        <a href=\"index.html\">Start</a>",
    "        <a href=\"rezepte.html\">Rezepte</a>",
    "    </nav>",
    "    <main>",
    "        <section>",
    "            <h2>Heute gegessen</h2>",
    "            <p>...</p>",
    "        </section>",
    "    </main>",
    "    <footer><p>Schulprojekt FOS 12, 2027</p></footer>",
    "</body>",
], size=10.5)

d.bullets("Warum das mehr ist als Kosmetik", [
    ("**Screenreader** springen von Bereich zu Bereich — mit <div> überall geht das nicht", 0),
    ("**Suchmaschinen** verstehen, was Navigation ist und was Inhalt", 0),
    ("Ihr selbst findet euch im eigenen Quelltext nach drei Wochen noch zurecht", 0),
    ("**alt**-Texte beschreiben das Bild — nicht „Bild1.jpg“, sondern was zu sehen ist", 0),
    ("Prüft eure Seite mit dem **Validator** (validator.w3.org) — er findet, was der Browser verzeiht", 0),
])

d.table_top("Typische Anfängerfehler", [
    ["Fehler", "Folge", "richtig"],
    ["Endtag vergessen", "der Rest der Seite rutscht hinein", "immer sofort beide Tags tippen"],
    ["Überkreuz verschachtelt", "unklarer Baum, Anzeige kippt", "zuletzt auf, zuerst zu"],
    ["h-Ebenen übersprungen", "Gliederung stimmt nicht", "h1, dann h2, dann h3"],
    ["kein alt bei img", "nicht barrierefrei, Validator meckert", "alt beschreibt das Bild"],
    ["Umlaute kaputt", "Zeichensatz fehlt", "<meta charset=\"UTF-8\">"],
    ["Layout mit table", "unbrauchbar auf dem Handy", "CSS benutzen"],
], [200, 300, 316], [
    ("Die meisten dieser Fehler findet der **Validator** in fünf Sekunden", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 1): TINT_RED for r in range(1, 7)})

d.bullets("Fun Facts: HTML", [
    ("Die **erste Fassung** von HTML kannte 1991 nur 18 Elemente — darunter kein einziges für Bilder", 0),
    ("Das <img>-Element schlug **Marc Andreessen** 1993 vor; die Diskussion darüber dauerte drei Tage", 0),
    ("Das **<blink>**-Element gab es wirklich — es gilt als schlechteste Idee der Webgeschichte", 0),
    ("**HTML5** hat kein Versionsende mehr: es ist ein „**living standard**“, der laufend wächst", 0),
    ("Browser sind extrem **nachsichtig**: sie reparieren fehlerhaftes HTML still — was die Fehlersuche erschwert", 0),
])

d.bullets("Eure Aufgabe: die ersten Seiten", [
    ("Legt **index.html** mit dem vollständigen Grundgerüst an — Titel, Zeichensatz, viewport", 0),
    ("Baut **header**, **nav**, **main** und **footer** ein; die Navigation verlinkt drei Seiten", 0),
    ("Füllt die Startseite: eine h1, zwei Absätze zum Thema, eine Liste, ein Bild mit **alt**-Text", 0),
    ("Legt eine zweite Seite an und verlinkt sie **gegenseitig**", 0),
    ("Prüft beide Seiten im **Validator** und behebt alle Meldungen — Screenshot ins Projekttagebuch", 0),
])

d.save()
