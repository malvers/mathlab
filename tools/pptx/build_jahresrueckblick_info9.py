#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 44 / KW 26: Puffer, Jahresrueckblick und Feedback."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("jahresrueckblick-info9.pptx")

d.title("Informatik — Klasse 9", "Was bleibt hängen?",
        "Jahresrückblick, Feedback — und ein Ausblick auf Klasse 10")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Jahr in fünf Bildern", "Wo ihr im August standet, wo jetzt")

d.table_top("Vorher und nachher", [
    ["Im August konntet ihr …", "jetzt könnt ihr …"],
    ["eine Liste in einem Textprogramm anlegen", "eine Datenbank entwerfen und bauen"],
    ["nach einem Wort suchen", "filtern, sortieren und auswerten"],
    ["eine Zahl ablesen", "fragen, aus welchen Zeilen sie stammt"],
    ["eine Idee haben", "sie in Teilprobleme zerlegen und planen"],
    ["etwas ausprobieren", "es testen, dokumentieren und vorführen"],
], [380, 436], [
    ("Die rechte Spalte ist nicht selbstverständlich — das habt ihr euch **erarbeitet**", 0),
], font_size=11, bold_cols=(0,), marks={(r, 1): TINT_GREEN for r in range(1, 6)})

d.bullets("Die fünf Sätze, die bleiben sollen", [
    ("**Datenbasis plus DBMS ergibt ein Datenbanksystem**", 0),
    ("**Zeile ist Datensatz, Spalte ist Datenfeld, ein Feld ist der Schlüssel**", 0),
    ("**Erst filtern, dann rechnen — und die Zahl gilt nur für ihren Filter**", 0),
    ("**Was man nicht zeichnen kann, kann man nicht programmieren**", 0),
    ("**Die sparsamste Datenbank ist die sicherste**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Euer Feedback", "Ehrlich hilft mehr als freundlich")

d.table_top("Der Feedbackbogen", [
    ["Frage", "Antwortform"],
    ["Was hat dir am meisten gebracht?", "ein bis zwei Sätze"],
    ["Was war zu schnell oder zu unklar?", "konkret, mit Thema"],
    ["Womit hast du dich am wohlsten gefühlt?", "Datenbanken oder Projekt?"],
    ["Was sollte in Klasse 10 unbedingt vorkommen?", "ein Vorschlag"],
    ["Was sollte ich anders machen?", "ehrlich, gern deutlich"],
], [380, 436], [
    ("Der Bogen ist **anonym** — es geht um den Unterricht, nicht um Personen", 0),
    ("„War gut“ hilft niemandem. **Was genau** war gut, und woran lag es?", 0),
], font_size=11, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.bullets("Was ich aus euren Antworten mache", [
    ("Ich lese alle Bögen und sortiere die Rückmeldungen nach **Themen**", 0),
    ("Was mehrfach kommt, ändere ich im nächsten Jahr", 0),
    ("Was einmal kommt, denke ich mir trotzdem durch", 0),
    ("In der ersten Stunde in Klasse 10 sage ich euch, **was ich geändert habe**", 0),
    ("Genau so haben wir es im Projekt auch gemacht: prüfen und verbessern", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Ausblick Klasse 10", "Worauf das Jahr hinausläuft")

d.bullets("Was euch erwartet", [
    ("**Webbasierte Anwendungen** — wie kommt eine Seite auf den Bildschirm?", 0),
    ("Ihr baut selbst etwas, das im **Browser** läuft", 0),
    ("Dabei kommen Datenbanken **wieder** — hinter den meisten Webseiten steckt eine", 0),
    ("Und die Projektarbeit kommt wieder, mit mehr eigener Verantwortung", 0),
    ("Kurz: alles aus diesem Jahr wird gebraucht. Nichts war umsonst", 0),
])

d.merksatz("Am Ende zählt nicht, was man auswendig weiß, sondern was man "
           "im nächsten Projekt anders macht.")

d.bullets("Fun Facts: das Jahr in Zahlen", [
    ("Ihr habt in diesem Schuljahr rund **35 Informatikstunden** gehabt", 0),
    ("Darin: eine Datenbank entworfen, gebaut, gefüllt und ausgewertet", 0),
    ("Und ein Projekt von der Idee bis zur Präsentation gebracht", 0),
    ("Der häufigste Fehler des Jahres saß an einer **Schnittstelle**", 0),
    ("Und die Motte von 1947 hat es in fast jede Stunde geschafft", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Rückblick**: was aus der rechten Spalte könnt ihr wirklich?", 0),
    ("**Feedbackbogen** ausfüllen — anonym und konkret", 0),
    ("Einen **Vorschlag** für Klasse 10 aufschreiben", 0),
    ("Offene Abgaben und Dateien **aufräumen**", 0),
    ("Nächste Woche ist Ausklang — bringt gute Laune mit", 0),
])

d.save()
