#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 44 / KW 26: Puffer - Reserve je nach Schuljahresplanung."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("puffer-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Reservestunde",
        "Offene Fragen, Nachbesprechung der Komplexaufgabe, freie Vertiefung")

d.chapter(1, "Die Komplexaufgabe", "Rückmeldung zu den Abgaben")

d.table_top("Was gut lief und was nicht", [
    ["Bereich", "meist gelungen", "meist schwach"],
    ["Prozessmodelle", "Notation formal korrekt", "Ist und Soll kaum unterscheidbar"],
    ["Datenmodell", "Entitäten sinnvoll gewählt", "Kardinalitäten nicht begründet"],
    ["Projektplan", "Arbeitspakete plausibel", "kritischer Pfad nicht geprüft"],
    ["Datenschutz", "DSGVO-Begriffe genannt", "keine konkreten Fristen"],
    ["Zusammenhang", "—", "Teile passen nicht zueinander"],
], [180, 320, 316], [
    ("Die letzte Zeile kostet die meisten Punkte — und ist am leichtesten zu beheben", 0),
    ("Probe: **taucht jedes Attribut irgendwo im Prozess auf?**", 0),
], font_size=10.5, bold_cols=(0,), marks={(5, 2): TINT_RED})

d.bullets("Die drei Nachbesserungen, die sich lohnen", [
    ("Ist- und Soll-Prozess **nebeneinander** legen und die Differenz markieren", 0),
    ("Zu jeder Kardinalität die **beiden Fragen** schriftlich beantworten", 0),
    ("Den kritischen Pfad **nachrechnen**: Summe der Dauern = Projektdauer?", 0),
    ("Zu jedem gespeicherten Datum **Zweck und Frist** dazuschreiben", 0),
    ("Das sind zusammen etwa dreißig Minuten Arbeit für spürbar mehr Punkte", 0),
])

d.chapter(2, "Offene Fragen", "Von der Tafel")

d.table_top("Die Fragen, die erfahrungsgemäß offen bleiben", [
    ["Frage", "Kurzantwort"],
    ["Wann XOR, wann UND?", "XOR: genau einer. UND: alle Zweige"],
    ["Wo steht der Fremdschlüssel?", "Immer auf der n-Seite"],
    ["Wann WHERE, wann HAVING?", "WHERE vor der Gruppierung, HAVING danach"],
    ["Wie erkenne ich die 3NF-Verletzung?", "Ein Nichtschlüssel bestimmt einen anderen"],
    ["Was ist der kritische Pfad?", "Die Kette der Vorgänge mit Puffer null"],
], [330, 486], [
    ("Wenn eine dieser fünf noch wackelt: **heute** klären, nicht vor der Abiturvorbereitung", 0),
], font_size=11, bold_cols=(0,))

sql("Die Abfrage, die immer wieder gefragt wird", [
    "-- „Alle Kurse, die niemand belegt hat“",
    "SELECT k.bezeichnung",
    "FROM Kurs k",
    "LEFT JOIN Belegung b ON k.knr = b.knr",
    "WHERE b.knr IS NULL;",
    "",
    "-- Der INNER JOIN kann das nicht: er wirft genau",
    "-- die Zeilen weg, die man sucht.",
], size=13)

d.chapter(3, "Freie Vertiefung", "Drei Angebote")

d.table_top("Was ihr heute wählen könnt", [
    ["Angebot", "Inhalt", "für wen"],
    ["A", "Komplexaufgabe nachbessern", "alle, die Punkte lassen wollen"],
    ["B", "SQL-Aufgaben aus dem Aufgabenpool", "wer bei Abfragen unsicher ist"],
    ["C", "Ausblick 13: erste Python-Programme", "wer schon weiterschauen will"],
], [110, 400, 306], [
    ("Angebot **A** bringt am meisten — die Bewertung steht noch nicht fest", 0),
    ("Angebot **C** ist freiwillig und wird nicht bewertet", 0),
], font_size=11, bold_cols=(0,), marks={(1, 0): TINT_GREEN})

d.merksatz("Eine Reservestunde ist keine Freistunde: sie ist die günstigste "
           "Gelegenheit, eine Lücke zu schließen, bevor sie teuer wird.")

d.bullets("Fun Facts: Puffer", [
    ("Ein Plan **ohne** Puffer ist kein Plan, sondern eine Wette", 0),
    ("In der Projektplanung heißen sie **Reserven** und werden ausdrücklich eingeplant", 0),
    ("**Parkinson**: Arbeit dehnt sich so weit aus, wie Zeit zur Verfügung steht", 0),
    ("Deshalb bekommt ein Puffer eine **Aufgabe**, sonst verschwindet er von selbst", 0),
    ("Und deshalb steht in dieser Stunde ein Programm an der Tafel", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Angebot wählen** und in die Liste eintragen", 0),
    ("Bei A: die **drei Nachbesserungen** aus Kapitel 1 abarbeiten", 0),
    ("Bei B: mindestens **vier** Aufgaben mit Selbstkontrolle", 0),
    ("Offene Fragen von der Tafel **abhaken**, wenn sie geklärt sind", 0),
    ("Nächste Woche: Jahresrückblick und Ausblick auf Jahrgangsstufe 13", 0),
])

d.save()
