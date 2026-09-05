#!/usr/bin/env python3
"""Projekt Webtechnologie: Kickoff - Phasen, Teams, Themen (Woche 23, LB 3A)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import pap

d = Deck("webprojekt-kickoff.pptx")
P = lambda n: os.path.join(IMG, n)

d.title("Informatik — FOS 12", "Projekt Webtechnologie",
        "Kickoff: Phasen, Teams, Themen — 20 Stunden bis zur eigenen Webpräsenz")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Projekt", "Was in den nächsten zehn Wochen entsteht")

d.table_top("Die Eckdaten", [
    ["", "Festlegung"],
    ["Umfang", "20 Unterrichtsstunden, Wochen 23 bis 32 (KW 8 bis KW 18)"],
    ["Team", "3 bis 4 Personen, feste Rollen, gemeinsame Verantwortung"],
    ["Produkt", "eine Webpräsenz zu einem selbst gewählten Thema, mit Datenbankanbindung"],
    ["Dokumentation", "Projekttagebuch, Datenmodell, Testprotokoll, Quellenangaben"],
    ["Abschluss", "Präsentation in Woche 32 — Produkt, Arbeitsweise und Ergebnisse"],
    ["Bewertung", "Produkt, Prozess und Präsentation zu gleichen Teilen"],
], [180, 636], [
    ("Das Projekt ist **fächerverbindend**: das Thema darf aus eurer Fachrichtung kommen", 0),
    ("Es schließt an **LB 1** (Datenbanken) und **LB 2** (Algorithmen) an — nichts davon ist vergessen", 0),
], font_size=11.5, bold_cols=(0,))

CH = ["Kickoff", "HTML", "CSS", "HTTP", "Daten-\nmodell", "Umset-\nzung", "Test", "Sicher-\nheit", "Doku", "Präsen-\ntation"]
WK = ["23", "24", "25", "26", "27", "28/29", "29", "30", "31", "32"]
nodes, edges = {}, []
for i, t in enumerate(CH):
    key = f"n{i}"
    nodes[key] = {"pos": (95 + i * 160, 100), "text": t.replace("\n", " "), "w": 132, "h": 118}
    if i in (0, 9):
        nodes[key]["color"] = (221, 232, 198)
    if i:
        edges.append((f"n{i-1}", key, ""))
notes = [(w, (58 + i * 160, 178)) for i, w in enumerate(WK)]
chain = pap(P("chain-projekt.png"), 1620, 230, nodes, edges,
            notes=[(f"Woche {w}" if i == 0 else w, (50 + i * 160, 180)) for i, w in enumerate(WK)],
            size=23)
d.picture("Der Fahrplan", chain, [
    ("Jede Woche hat ein **Ergebnis**, das am Ende der Stunde vorliegt — keine Woche ohne Zwischenstand", 0),
    ("Zwei Wochen sind **Umsetzung** — die Zeit reicht nur, wenn der Entwurf steht", 0),
    ("Der **Osterferien**-Schnitt liegt zwischen Woche 27 und 28: was vorher fertig ist, entspannt danach", 0),
], width=800)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Das Team", "Vier Rollen, eine Verantwortung")

d.table_top("Rollen im Projektteam", [
    ["Rolle", "kümmert sich um", "Ergebnis, das sie liefert"],
    ["Projektleitung", "Termine, Aufgabenliste, Absprachen", "Projekttagebuch, Wochenplan"],
    ["Design & Inhalt", "Struktur, Texte, Gestaltung, Bilder", "Seitenentwurf, Inhaltsverzeichnis"],
    ["Technik & Daten", "Datenmodell, Anbindung, Code", "ER-Modell, Datenbankschema"],
    ["Qualität & Test", "Testfälle, Rechtschreibung, Quellen", "Testprotokoll, Quellenliste"],
], [180, 320, 316], [
    ("Rollen heißen **Zuständigkeit**, nicht Alleinarbeit — programmiert wird gemeinsam", 0),
    ("In einem Dreierteam übernimmt die Projektleitung die vierte Rolle mit", 0),
    ("Legt heute fest, wer welche Rolle hat, und schreibt es ins **Projekttagebuch**", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Wie ihr euch organisiert", [
    ("**Wochenziel** am Anfang der Stunde festlegen, am Ende prüfen — schriftlich, drei Zeilen genügen", 0),
    ("**Aufgabenliste** mit Name und Termin: wer macht was bis wann?", 0),
    ("**Ein** gemeinsamer Ordner, feste Dateinamen, **keine** Versionen wie „endgueltig_final_2“", 0),
    ("Absprache zum **Dateiaustausch**: wer ändert wann welche Datei? Sonst überschreibt ihr euch", 0),
    ("Bei Problemen **früh** melden — eine Woche vor der Abgabe ist zu spät", 0),
])

d.table_top("Digitale Werkzeuge — Vorschlag", [
    ["wofür", "Werkzeug", "Hinweis"],
    ["Code schreiben", "VS Code (oder ein einfacher Editor)", "keine Textverarbeitung!"],
    ["Dateien teilen", "Schulcloud-Ordner des Teams", "feste Ordnerstruktur vereinbaren"],
    ["Aufgaben verwalten", "gemeinsame Tabelle oder Kanban-Brett", "drei Spalten: offen, läuft, fertig"],
    ["Tagebuch führen", "ein Dokument, jede Stunde ein Absatz", "Datum, Ziel, Ergebnis, Probleme"],
    ["Testen", "Browser + Entwicklertools (F12)", "ab Woche 26 unser Hauptwerkzeug"],
], [180, 330, 306], [
    ("Wichtiger als die Werkzeugwahl ist, dass **alle dasselbe** benutzen", 0),
], font_size=11, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Das Thema", "Persönlich bedeutsam oder gesellschaftlich relevant")

d.bullets("Was ein gutes Projektthema ausmacht", [
    ("Es interessiert euch **wirklich** — zehn Wochen sind lang", 0),
    ("Es hat **Daten**, die sich in Tabellen fassen lassen: Personen, Termine, Angebote, Messwerte", 0),
    ("Es ist **klein genug**: eine Idee, drei bis fünf Seiten, eine Datenbank mit 3–4 Tabellen", 0),
    ("Es kommt **ohne echte personenbezogene Daten** aus — erfundene Beispieldaten genügen", 0),
    ("Und es lässt sich in **drei Sätzen** erklären. Wenn nicht, ist es noch nicht scharf genug", 0),
])

d.table_top("Themenideen nach Fachrichtung", [
    ["Richtung", "Idee", "Datenbank dahinter"],
    ["Gesundheit", "Ernährungstagebuch mit Nährwerttabelle", "Lebensmittel, Mahlzeit, Nutzer"],
    ["Gesundheit", "Übungssammlung für den Rücken, nach Beschwerden filterbar", "Übung, Muskelgruppe, Level"],
    ["Sozialwesen", "Beratungsangebote der Stadt, nach Thema durchsuchbar", "Stelle, Thema, Öffnungszeit"],
    ["Sozialwesen", "Ehrenamtsbörse: wer sucht wen, wofür", "Angebot, Bereich, Kontakt"],
    ["Wirtschaft", "Preisvergleich für Schulbedarf", "Artikel, Anbieter, Preis"],
    ["Wirtschaft", "Vereinsverwaltung mit Mitgliedern und Beiträgen", "Mitglied, Beitrag, Zahlung"],
    ["frei", "Musik-, Film- oder Spielearchiv des Kurses", "Werk, Genre, Bewertung"],
], [150, 380, 286], [
    ("Das sind **Anregungen** — eine eigene Idee ist ausdrücklich erwünscht", 0),
    ("Prüft die Idee sofort am **Datenmodell**: Welche drei Tabellen brauche ich mindestens?", 0),
], font_size=10.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Bewertung", "Damit von Anfang an klar ist, worauf es ankommt")

d.table_top("Worauf geachtet wird", [
    ["Bereich", "Kriterien", "Anteil"],
    ["Produkt", "Funktion, Datenmodell, sauberes HTML/CSS, Datenschutz umgesetzt", "40 %"],
    ["Prozess", "Planung, Tagebuch, Arbeitsteilung, Testprotokoll, Quellen", "30 %"],
    ["Präsentation", "Aufbau, Fachsprache, Demonstration, Antworten auf Nachfragen", "30 %"],
], [150, 480, 110], [
    ("Der **Prozess** zählt fast so viel wie das Produkt — dokumentiert von Anfang an, nicht am Ende", 0),
    ("Ein ehrlich dokumentierter Fehlschlag ist mehr wert als eine schöne Seite ohne Nachweis", 0),
    ("Die Kriterien für die Präsentation kennt ihr aus **Klasse 11** — wir nutzen dieselben", 0),
], font_size=11, bold_cols=(0,), align="llc")

d.bullets("Fun Facts: das Web", [
    ("**Tim Berners-Lee** schrieb 1989 am CERN einen Projektantrag; sein Chef notierte an den Rand: „**vage, aber spannend**“", 0),
    ("Die **erste Website** der Welt läuft noch: info.cern.ch — sie erklärt, was das World Wide Web ist", 0),
    ("Der erste Webserver war ein **NeXT-Rechner** mit dem Aufkleber: „Diese Maschine ist ein Server. NICHT AUSSCHALTEN!“", 0),
    ("**HTML** hatte 1991 genau **18 Elemente** — heute sind es über 110", 0),
    ("Berners-Lee verzichtete bewusst auf ein **Patent** — deshalb gehört das Web niemandem", 0),
])

d.bullets("Eure Aufgabe für diese Woche", [
    ("**Team bilden** (3–4 Personen) und die vier Rollen verteilen", 0),
    ("**Thema festlegen** und in drei Sätzen aufschreiben: Was? Für wen? Warum?", 0),
    ("**Drei Tabellen** nennen, die eure Datenbank vermutlich braucht — grob, ohne Attribute", 0),
    ("**Projekttagebuch** anlegen: Datum, Teilnehmende, Ziel, Ergebnis, offene Punkte", 0),
    ("**Werkzeuge** festlegen und den gemeinsamen Ordner einrichten — nächste Woche wird getippt", 0),
])

d.save()
