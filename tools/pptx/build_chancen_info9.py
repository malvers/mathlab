#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 14 / KW 49: Chancen und Risiken automatisierter
Datenverarbeitung (LB 1, Ustd. 12/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("chancen-risiken-daten.pptx")

d.title("Informatik — Klasse 9", "Wenn Maschinen Daten verarbeiten",
        "Industrie 4.0, Internet der Dinge, Big Data — Nutzen und Preis")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei Schlagwörter", "Was steckt wirklich dahinter?")

d.table_top("Die Begriffe, die überall stehen", [
    ["Begriff", "heißt", "Beispiel"],
    ["Industrie 4.0", "Maschinen tauschen selbst Daten aus", "Fabrik meldet Verschleiß vorher"],
    ["Internet der Dinge", "Alltagsgeräte hängen am Netz", "Heizung, Waage, Türklingel"],
    ["Smart Home", "das Haus reagiert auf Daten", "Licht nach Sonnenuntergang"],
    ["Big Data", "Datenmengen, die kein Mensch mehr liest", "alle Bewegungsdaten einer Stadt"],
], [190, 300, 326], [
    ("Allen gemeinsam: **Daten werden gesammelt, ausgewertet und lösen etwas aus** — ohne Mensch", 0),
    ("Automatisiert heißt nicht klug: die Maschine macht, was in den Daten steht", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Was Automatisierung möglich macht", [
    ("**Schneller**: eine Auswertung, für die früher Wochen nötig waren, dauert Sekunden", 0),
    ("**Vorher statt hinterher**: eine Maschine meldet den Defekt, bevor sie stehen bleibt", 0),
    ("**Sparsamer**: Heizung und Licht laufen nur, wenn jemand da ist", 0),
    ("**Sicherer**: ein Auto bremst schneller, als ein Mensch reagieren kann", 0),
    ("**Bequemer**: die Bestellung ist da, bevor man merkt, dass etwas fehlt", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Preis", "Was jede dieser Chancen kostet")

d.table_top("Jede Chance hat eine Kehrseite", [
    ["Chance", "Risiko"],
    ["Alles wird gemessen", "alles wird auch gespeichert"],
    ["Geräte reden miteinander", "sie sind angreifbar — auch die Türklingel"],
    ["Entscheidungen laufen automatisch", "niemand prüft mehr die Einzelfälle"],
    ["Auswertung über alle Nutzer", "Rückschlüsse auf einzelne Personen"],
    ["Maschinen übernehmen Arbeit", "Tätigkeiten fallen weg oder ändern sich"],
], [330, 486], [
    ("Die Frage ist selten **ob**, sondern **wer entscheidet** und **wer haftet**", 0),
], font_size=11.5, bold_cols=(0,), marks={(r, 1): TINT_ORANGE for r in range(1, 6)})

d.bullets("Drei Fälle zum Nachdenken", [
    ("Ein **Fitnessarmband** zählt Schritte — und die Versicherung möchte die Daten sehen", 0),
    ("Ein **Sprachassistent** hört mit, um sein Weckwort zu erkennen. Was geht in die Cloud?", 0),
    ("Eine **Fabrik** meldet automatisch Nachschub. Was passiert bei einem Messfehler?", 0),
    ("In allen drei Fällen ist die Technik in Ordnung — die Frage ist die **Regel** dahinter", 0),
    ("Und die Regel macht kein Gerät, sondern ein **Mensch**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Stationenlernen", "Vier Stationen, vier Beispiele")

d.table_top("Die Stationen", [
    ["Station", "Auftrag"],
    ["Industrie 4.0", "Welche Daten misst eine Maschine, und was löst sie aus?"],
    ["Internet der Dinge", "Sucht fünf Geräte im Haushalt, die am Netz hängen könnten"],
    ["Smart Home", "Welche Bequemlichkeit lohnt welchen Datenverlust?"],
    ["Big Data", "Was verrät ein Bewegungsprofil über einen Menschen?"],
], [230, 586], [
    ("An jeder Station: **eine Chance und ein Risiko** aufschreiben — in ganzen Sätzen", 0),
    ("Am Ende stimmen wir ab: welche Station war die überraschendste?", 0),
], font_size=11.5, bold_cols=(0,))

d.merksatz("Automatisierte Datenverarbeitung ist weder gut noch böse. "
           "Entscheidend ist, welche Daten gesammelt werden — und wer darüber bestimmt.")

d.bullets("Fun Facts: Automatisierung", [
    ("Der Begriff **Industrie 4.0** wurde 2011 auf der Hannover Messe erfunden — als Schlagwort", 0),
    ("Der erste vernetzte Gegenstand war ein **Getränkeautomat** an der Carnegie Mellon University, 1982", 0),
    ("Er meldete über das Netz, ob die Cola kalt ist — lange vor dem Internet der Dinge", 0),
    ("Ein modernes Auto erzeugt bis zu **25 Gigabyte** Daten pro Stunde Fahrt", 0),
    ("Der Ausdruck **Big Data** meint nicht nur viel, sondern auch **schnell** und **unterschiedlich**", 0),
])

d.bullets("Eure Aufgabe: die Pro-Contra-Debatte", [
    ("Thema: **„Unsere Schule soll Anwesenheit automatisch per Chip erfassen.“**", 0),
    ("Die eine Hälfte sammelt **Argumente dafür**, die andere **dagegen**", 0),
    ("Je Seite drei Argumente — jedes mit einem **konkreten Beispiel**", 0),
    ("Nach der Debatte: schreibt **eure eigene** Meinung in drei Sätzen auf", 0),
    ("Pflichtsatz darin: **Welche Daten würdet ihr auf keinen Fall speichern?**", 0),
])

d.save()
