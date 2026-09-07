#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 15 / KW 50: Responsives Layout und Inhalte
(LB 4, Ustd. 5-6/18)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, css_parts, html_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("responsives-layout.pptx")
css = lambda t, ls, **kw: d.code(t, [css_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Eine Seite für alle Geräte",
        "Flexbox, Grid und Media Queries — und Barrierefreiheit von Anfang an")

d.chapter(1, "Der Ansatz", "Mobile first")

d.bullets("Warum man klein anfängt", [
    ("Über die Hälfte aller Zugriffe kommt vom **Telefon**", 0),
    ("Ein Layout **vom kleinen zum großen** Bildschirm zu erweitern ist einfacher als umgekehrt", 0),
    ("Auf dem kleinen Schirm muss man sich auf das **Wesentliche** beschränken", 0),
    ("Was dort nicht gebraucht wird, wird auch auf dem großen selten gebraucht", 0),
    ("Voraussetzung ist das **viewport**-Meta-Tag im head — ohne das hilft kein CSS", 0),
])

css("Flexbox: eine Reihe, die umbricht", [
    ".karten {",
    "    display: flex;",
    "    flex-wrap: wrap;        /* umbrechen statt quetschen */",
    "    gap: 1rem;",
    "}",
    ".karte {",
    "    flex: 1 1 260px;        /* wachsen, schrumpfen, Grundbreite */",
    "}",
], size=13)

css("Grid: eine Fläche mit Spalten", [
    ".liste {",
    "    display: grid;",
    "    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));",
    "    gap: 1rem;",
    "}",
    "",
    "/* auto-fit + minmax passt die Spaltenzahl selbst an -",
    "   oft braucht man dafuer gar keine Media Query. */",
], size=12.5)

d.chapter(2, "Media Queries", "Wenn es doch eine Grenze braucht")

css("Ab einer Breite anders", [
    "/* Grundgestaltung: mobil, eine Spalte */",
    "nav { display: block; }",
    "",
    "@media (min-width: 700px) {",
    "    nav { display: flex; gap: 2rem; }",
    "    main { max-width: 70ch; margin: 0 auto; }",
    "}",
    "",
    "@media (prefers-reduced-motion: reduce) {",
    "    * { animation: none !important; }",
    "}",
], size=12.5)

d.table_top("Wo man Grenzen setzt", [
    ["Ansatz", "Idee", "Bewertung"],
    ["an Gerätegrößen", "Breakpoints für Handy, Tablet, Desktop", "veraltet: zu viele Geräte"],
    ["am Inhalt", "Grenze dort, wo das Layout bricht", "empfohlen"],
    ["gar nicht", "auto-fit und minmax regeln es selbst", "oft ausreichend"],
], [180, 350, 286], [
    ("Der Test ist einfach: **Fenster langsam schmaler ziehen** — wo sieht es schlecht aus?", 0),
    ("Genau dort gehört die Grenze hin, nicht bei einer runden Gerätezahl", 0),
], font_size=11, bold_cols=(0,), marks={(2, 2): TINT_GREEN})

d.chapter(3, "Barrierefreiheit", "Vier Punkte, die immer gelten")

d.table_top("Was ihr umsetzen sollt", [
    ["Punkt", "konkret", "prüfbar mit"],
    ["Alternativtexte", "jedes inhaltstragende Bild bekommt alt", "Bilder abschalten"],
    ["Kontrast", "Text zu Hintergrund mindestens 4,5:1", "Kontrastrechner"],
    ["Tastatur", "alles ohne Maus erreichbar", "nur mit Tab bedienen"],
    ["Struktur", "Überschriften in richtiger Reihenfolge", "Gliederungsansicht"],
], [180, 350, 286], [
    ("**alt=\"\"** ist richtig für rein dekorative Bilder — nicht weglassen, sondern leer lassen", 0),
    ("Barrierefreiheit hilft allen: bei Sonnenlicht, mit einer Hand, mit langsamem Netz", 0),
], font_size=10.5, bold_cols=(0,), marks={(3, 0): TINT_BLUE})

html("Inhalte barrierefrei auszeichnen", [
    "<img src=\"halle.jpg\" alt=\"Sporthalle von außen\">",
    "<img src=\"linie.svg\" alt=\"\">              <!-- rein dekorativ -->",
    "",
    "<label for=\"suche\">Verein suchen</label>",
    "<input id=\"suche\" name=\"suche\" type=\"search\">",
    "",
    "<a href=\"liste.html\">Zur Vereinsliste</a>   <!-- nicht: hier klicken -->",
], size=12),

d.merksatz("Der beste Test für ein responsives Layout ist das langsame "
           "Schmalerziehen des Fensters — und die Bedienung nur mit der Tastatur.")

d.bullets("Fun Facts: Responsive Design", [
    ("Den Begriff **Responsive Web Design** prägte Ethan Marcotte 2010", 0),
    ("**Flexbox** ist für eine Richtung gedacht, **Grid** für zwei — deshalb ergänzen sie sich", 0),
    ("Die Einheit **ch** entspricht der Breite der Ziffer Null — praktisch für Textbreiten", 0),
    ("**70 Zeichen** je Zeile gelten als gut lesbar, deshalb max-width: 70ch", 0),
    ("Die **BITV** verpflichtet öffentliche Stellen in Deutschland zur Barrierefreiheit", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Macht euer Layout **responsiv** — mit Flexbox oder Grid", 0),
    ("Setzt höchstens **zwei** Media Queries, und zwar dort, wo es bricht", 0),
    ("Pflegt eure **Inhalte** ein: echte Texte, keine Platzhalter", 0),
    ("Arbeitet die **vier Barrierefreiheitspunkte** ab und haltet fest, was ihr geändert habt", 0),
    ("Testet einmal **nur mit der Tastatur** — kommt ihr überall hin?", 0),
])

d.save()
