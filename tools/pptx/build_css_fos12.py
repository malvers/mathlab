#!/usr/bin/env python3
"""Statische Webseiten II: CSS - Trennung von Inhalt und Layout (Woche 25)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, html_parts, css_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import box_model

d = Deck("css-layout.pptx")
P = lambda n: os.path.join(IMG, n)
css = lambda t, ls, **kw: d.code(t, [css_parts(l) for l in ls], **kw)
html = lambda t, ls, **kw: d.code(t, [html_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "CSS",
        "Statische Webseiten II: Inhalt und Layout sauber trennen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Trennung", "HTML sagt was, CSS sagt wie")

d.bullets("Warum Gestaltung nicht ins HTML gehört", [
    ("**Ein** Stylesheet gestaltet **alle** Seiten — eine Änderung, überall sichtbar", 0),
    ("Der Quelltext bleibt lesbar: Struktur hier, Aussehen dort", 0),
    ("Dieselbe Seite kann **anders aussehen** je nach Gerät — Handy, Bildschirm, Druck", 0),
    ("Barrierefreiheit: wer eine eigene Darstellung braucht, ersetzt einfach das CSS", 0),
    ("Fachwort: **Separation of Concerns** — jedes Werkzeug für seine Aufgabe", 0),
])

d.table_top("Drei Wege, CSS einzubinden", [
    ["Weg", "Schreibweise", "Bewertung"],
    ["inline", "<p style=\"color: red\">", "nur im Notfall — Gestaltung klebt am Inhalt"],
    ["intern", "<style> … </style> im head", "für eine einzelne Testseite"],
    ["extern", "<link rel=\"stylesheet\" href=\"stil.css\">", "so machen wir es — eine Datei für alles"],
], [110, 330, 376], [
    ("Im Projekt gilt: **eine** Datei stil.css, in **jeder** Seite verlinkt", 0),
    ("Das ist auch die Antwort auf „warum sieht Seite 3 anders aus?“ — sie tut es dann nämlich nicht", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,),
   marks={(1, 2): TINT_RED, (2, 2): TINT_ORANGE, (3, 2): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Selektoren", "Wen soll die Regel treffen?")

css("Der Aufbau einer Regel", [
    "/* Selektor { Eigenschaft: Wert; } */",
    "",
    "h1 {",
    "    color: #0e244e;",
    "    font-size: 2rem;",
    "}",
    "",
    ".karte {",
    "    background: #ffffff;",
    "    border: 1px solid #b0c4e2;",
    "    padding: 16px;",
    "}",
    "",
    "nav a:hover {",
    "    color: #b02418;",
    "}",
], size=12.5)

d.table_top("Die wichtigsten Selektoren", [
    ["Selektor", "trifft", "im HTML"],
    ["p", "alle Absätze", "<p>…</p>"],
    [".karte", "alles mit dieser Klasse", "<div class=\"karte\">"],
    ["#kopf", "das eine Element mit dieser id", "<header id=\"kopf\">"],
    ["nav a", "alle Links innerhalb der Navigation", "<nav><a>…</a></nav>"],
    ["a:hover", "Link, während die Maus darauf liegt", "—"],
    ["h1, h2", "beide zugleich", "—"],
], [140, 330, 346], [
    ("**class** darf beliebig oft vorkommen, **id** genau einmal pro Seite", 0),
    ("Faustregel im Projekt: **Klassen** benutzen, ids nur für Sprungziele", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0, 2))

d.bullets("Wenn zwei Regeln streiten: die Kaskade", [
    ("**C** in CSS heißt **Cascading** — es gibt eine feste Rangfolge", 0),
    ("**Spezifität**: id schlägt Klasse, Klasse schlägt Element (100 : 10 : 1)", 0),
    ("Bei gleicher Spezifität gewinnt die **später** notierte Regel", 0),
    ("Eigenschaften wie Schriftart und Farbe **vererben** sich an die Kindelemente", 0),
    ("**!important** löst jeden Streit — und schafft beim nächsten Mal einen neuen. Finger weg", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Box-Modell", "Jedes Element ist ein Kasten")

bm = box_model(P("boxmodell.png"), W=1180, H=520)
d.picture_bullets("Vier Ringe um jeden Inhalt", bm, [
    ("**content** — der Inhalt selbst, Text oder Bild", 0),
    ("**padding** — Innenabstand, innerhalb des Rahmens, mit Hintergrundfarbe", 0),
    ("**border** — der Rahmen", 0),
    ("**margin** — Außenabstand zum Nachbarn, immer durchsichtig", 0),
    ("Mit **box-sizing: border-box** zählt width die ganze Kiste", 0),
], pic_w=430)

css("Farben, Schrift, Abstände", [
    "* { box-sizing: border-box; }",
    "",
    "body {",
    "    margin: 0;",
    "    font-family: 'Outfit', Arial, sans-serif;",
    "    line-height: 1.6;",
    "    color: #2c3c60;",
    "    background: #f4f7fc;",
    "}",
    "",
    "h1 { font-family: 'Orbitron', sans-serif; letter-spacing: 0.04em; }",
    "",
    "img { max-width: 100%; height: auto; }",
], size=12)

d.table_top("Einheiten und Farben", [
    ["Angabe", "bedeutet", "wofür"],
    ["px", "feste Bildpunkte", "Rahmen, feine Abstände"],
    ["rem", "Vielfaches der Grundschriftgröße", "Schrift und Abstände — skaliert mit"],
    ["%", "Anteil des Elternelements", "Breiten im Layout"],
    ["#0e244e", "Farbe als Hexcode (RGB)", "unsere Palette"],
    ["rgb(245,194,66)", "Farbe als Zahlentripel", "gleichwertig, besser lesbar"],
], [200, 300, 316], [
    ("Legt eure **Farbpalette** einmal fest — höchstens drei Farben plus Grau", 0),
    ("Mindestens **4,5 : 1** Kontrast zwischen Text und Hintergrund, sonst ist es nicht barrierefrei", 0),
], font_size=11, bold_cols=(0,), mono_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Layout", "Nebeneinander — und auf dem Handy untereinander")

css("Flexbox: die Navigation und die Kartenreihe", [
    "nav {",
    "    display: flex;",
    "    gap: 24px;",
    "    padding: 12px 20px;",
    "    background: #0e244e;",
    "}",
    "",
    ".karten {",
    "    display: flex;",
    "    flex-wrap: wrap;      /* umbrechen statt quetschen */",
    "    gap: 20px;",
    "}",
    "",
    ".karte { flex: 1 1 280px; }   /* waechst, schrumpft, mind. 280px */",
], size=12)

css("Responsiv: eine Regel für kleine Bildschirme", [
    "@media (max-width: 700px) {",
    "",
    "    nav {",
    "        flex-direction: column;   /* Links untereinander */",
    "        gap: 8px;",
    "    }",
    "",
    "    h1 {",
    "        font-size: 1.5rem;",
    "    }",
    "",
    "}",
    "",
    "/* Testen: Entwicklertools (F12), Geraeteansicht einschalten */",
], size=12.5)

d.bullets("Gestaltungsregeln, die immer gelten", [
    ("**Wenige Schriften**: höchstens zwei — eine für Überschriften, eine für Fließtext", 0),
    ("**Wenige Farben**: eine Hauptfarbe, eine Signalfarbe, ein Grau — mehr wirkt unruhig", 0),
    ("**Luft lassen**: großzügige Abstände wirken hochwertiger als volle Seiten", 0),
    ("**Ausrichtung**: alles an einer gemeinsamen Kante, keine zufälligen Einrückungen", 0),
    ("**Konsistenz**: gleiche Dinge sehen gleich aus — auf jeder Seite", 0),
    ("**Zuerst schmal denken**: was auf dem Handy funktioniert, geht auf dem Bildschirm sowieso", 0),
])

d.bullets("Fun Facts: CSS", [
    ("**Håkon Wium Lie** schlug CSS 1994 vor — im selben Haus wie das Web, am CERN", 0),
    ("Vor CSS gestaltete man mit <font>-Tags und unsichtbaren Tabellen — Seiten waren unwartbar", 0),
    ("Die **Zen Garden**-Galerie zeigte 2003, wie **dasselbe HTML** mit anderem CSS völlig anders aussieht", 0),
    ("Das Zentrieren eines Kastens war jahrelang ein Running Gag — mit Flexbox sind es heute zwei Zeilen", 0),
    ("**Dark Mode** ist in CSS eine einzige Medienabfrage: prefers-color-scheme", 0),
])

d.bullets("Eure Aufgabe: dem Projekt ein Gesicht geben", [
    ("Legt **stil.css** an und verlinkt sie in **allen** Seiten — kein style-Attribut mehr im HTML", 0),
    ("Definiert **Farbpalette** und **zwei Schriften**; schreibt die Hexcodes ins Projekttagebuch", 0),
    ("Gestaltet **Navigation** und **Karten** mit Flexbox", 0),
    ("Ergänzt eine **Medienabfrage** für max-width: 700px und testet mit F12 in der Geräteansicht", 0),
    ("Prüft den **Kontrast** eures Textes und haltet das Ergebnis fest", 0),
])

d.save()
