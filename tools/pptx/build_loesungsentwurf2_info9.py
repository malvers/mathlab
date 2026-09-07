#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 27 / KW 10: Loesungsentwurf II und
Aufgabenverteilung im Team (LB 2, Ustd. 5/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("loesungsentwurf-2.pptx")

d.title("Informatik — Klasse 9", "Wer macht was bis wann?",
        "Aufgaben verteilen, Termine setzen, Schnittstellen absprechen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Aufgabenplan", "Drei Spalten reichen")

d.table_top("So sieht euer Plan aus", [
    ["Aufgabe", "wer", "bis wann", "fertig?"],
    ["Figur mit Pfeiltasten steuern", "Ben", "18.03.", ""],
    ["Gegenstände fallen lassen", "Chiara", "18.03.", ""],
    ["Punkte zählen und anzeigen", "Anna", "25.03.", ""],
    ["Startbildschirm", "Ben", "15.04.", ""],
    ["Testen und Fehlerliste", "alle", "22.04.", ""],
], [340, 140, 180, 156], [
    ("Jede Aufgabe hat **genau einen** Namen — „alle“ heißt in der Praxis oft „niemand“", 0),
    ("Ausnahme ist das Testen: da schaut jeder auf das, was er **nicht** gebaut hat", 0),
], font_size=11, bold_cols=(0,), marks={(5, 1): TINT_ORANGE})

d.bullets("Regeln für die Verteilung", [
    ("Jeder bekommt **mindestens ein** Teilproblem, das zum Produkt gehört", 0),
    ("Niemand bekommt nur **Verschönerung** — das ist keine Leistung fürs Zeugnis", 0),
    ("Wer sich unsicher fühlt, nimmt eine Aufgabe **zu zweit**, nicht gar keine", 0),
    ("Und: wer früh fertig ist, hilft — statt heimlich schon etwas anderes zu bauen", 0),
    ("Änderungen am Plan sind erlaubt, aber sie werden **eingetragen**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Schnittstellen", "Wie die Teile zusammenpassen")

d.bullets("Die Absprache, die am häufigsten fehlt", [
    ("Bens Figur und Chiaras Gegenstände sollen sich **treffen** können", 0),
    ("Dafür müssen beide wissen: wie heißt die Figur, wie heißen die Gegenstände?", 0),
    ("Annas Punktzähler braucht ein **Signal**, wenn ein Treffer passiert", 0),
    ("Wer welche **Variable** benutzt, wird vorher festgelegt, nicht nachher gesucht", 0),
    ("Diese Übergabepunkte heißen **Schnittstellen** — sie sind die häufigste Fehlerquelle", 0),
])

d.table_top("Schnittstellen im Fangspiel", [
    ["Zwischen", "Übergabe", "vereinbart als"],
    ["Figur und Gegenstand", "Berührung erkannt", "Meldung „Treffer“"],
    ["Treffer und Punktzähler", "Punktzahl erhöhen", "Variable punkte"],
    ["Punktzähler und Ende", "drei Fehlwürfe", "Variable leben"],
    ["alle und Startbildschirm", "Spiel beginnt", "Meldung „Start“"],
], [230, 300, 286], [
    ("Schreibt die **Namen** auf ein Blatt, das alle sehen — nicht ins eigene Heft", 0),
    ("Ein Tippfehler im Variablennamen kostet später eine halbe Stunde Suche", 0),
], font_size=11, bold_cols=(0,), mono_cols=(2,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Termine", "Meilensteine, die man ernst nimmt")

d.bullets("Wie man einen Termin richtig setzt", [
    ("Ein Termin nennt ein **Datum**, keine Woche und kein „bald“", 0),
    ("Zu jedem Termin gehört ein **prüfbares** Ergebnis: „läuft“, nicht „ist angefangen“", 0),
    ("Plant die **eigene Aufgabe** lieber großzügig — es kommt immer etwas dazwischen", 0),
    ("Sagt **sofort** Bescheid, wenn ein Termin nicht zu halten ist", 0),
    ("Ein gerissener Termin ist kein Drama. Ein **verschwiegener** schon", 0),
])

d.merksatz("Jede Aufgabe hat einen Namen und ein Datum. Und jede Stelle, an der "
           "zwei Teile zusammenkommen, wird vorher abgesprochen.")

d.bullets("Fun Facts: Zusammenarbeit", [
    ("Die meisten Fehler in großen Programmen sitzen **an den Schnittstellen**, nicht im Inneren", 0),
    ("Die **Mars Climate Orbiter** ging 1999 verloren, weil zwei Teams verschiedene Einheiten nutzten", 0),
    ("Deshalb schreiben Profis Schnittstellen auf, bevor die erste Zeile entsteht", 0),
    ("**Conways Gesetz**: Software sieht am Ende so aus wie die Kommunikation im Team", 0),
    ("Was heißt: schlecht abgesprochene Teams bauen schlecht zusammenpassende Programme", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Aufgabenplan** ausfüllen: Aufgabe, Name, Datum — für alle Teilprobleme", 0),
    ("**Schnittstellen** festlegen: welche Namen und Meldungen benutzt ihr gemeinsam?", 0),
    ("Alles auf **ein** Blatt, das im Teamordner liegt", 0),
    ("Legt euren **ersten Meilenstein** fest: was läuft am Ende der nächsten Doppelstunde?", 0),
    ("Ab nächster Woche wird gebaut — bringt den Plan mit", 0),
])

d.save()
