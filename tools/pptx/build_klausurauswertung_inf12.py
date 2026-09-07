#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 38 / KW 20: Auswertung Klausuren und Uebung."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, sql_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("klausurauswertung-inf12.pptx")
sql = lambda t, ls, **kw: d.code(t, [sql_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 12", "Auswertung und Berichtigung",
        "Was schiefging, warum es schiefging — und wie man es abstellt")

d.chapter(1, "Der Überblick", "Wo die Punkte geblieben sind")

d.table_top("Die typische Punkteverteilung", [
    ["Teil", "meist gut", "meist schwach"],
    ["Begriffe", "Definitionen nennen", "Unterschiede begründen"],
    ["Modellieren", "Entitäten finden", "Kardinalitäten begründen"],
    ["Normalisieren", "Ergebnis hinschreiben", "Abhängigkeit benennen"],
    ["SQL", "einfache SELECTs", "GROUP BY und HAVING"],
], [180, 320, 316], [
    ("Das Muster ist jedes Jahr dasselbe: **Wissen ja, Begründen schwach**", 0),
    ("Punkte gibt es aber genau für das Begründen", 0),
], font_size=11, bold_cols=(0,), marks={(r, 2): TINT_ORANGE for r in range(1, 5)})

d.bullets("Die fünf häufigsten Fehler", [
    ("**Fremdschlüssel auf der falschen Seite** — er gehört zur n-Seite", 0),
    ("**n:m ohne eigene Tabelle** — dann sind Mehrfachbelegungen nicht abbildbar", 0),
    ("**Normalform behauptet, nicht begründet** — kein Punkt ohne Abhängigkeit", 0),
    ("**HAVING mit WHERE verwechselt** — Gruppenbedingung gehört in HAVING", 0),
    ("**JOIN ohne ON** — liefert klaglos das kartesische Produkt", 0),
])

d.chapter(2, "Die Berichtigung", "Nicht abschreiben, sondern verstehen")

d.table_top("So wird berichtigt", [
    ["Schritt", "was hineingehört"],
    ["1. Aufgabe notieren", "Nummer und Kurzfassung"],
    ["2. Eigene Antwort", "die falsche, so wie sie dastand"],
    ["3. Der Fehler", "welche Regel wurde verletzt?"],
    ["4. Richtige Antwort", "vollständig, mit Begründung"],
    ["5. Merksatz", "ein Satz, damit es nicht wieder passiert"],
], [230, 586], [
    ("Schritt 3 ist der wichtigste — eine Berichtigung **ohne** ihn bringt nichts", 0),
    ("„Ich habe es falsch gemacht“ ist keine Fehleranalyse", 0),
], font_size=11.5, bold_cols=(0,), marks={(3, 0): TINT_GREEN})

sql("Die Abfrage, die am häufigsten schiefging", [
    "-- gesucht: Kurse mit mindestens 3 Belegungen, absteigend",
    "SELECT k.bezeichnung, COUNT(*) AS anzahl",
    "FROM Kurs k JOIN Belegung b ON k.knr = b.knr",
    "GROUP BY k.bezeichnung",
    "HAVING COUNT(*) >= 3",
    "ORDER BY anzahl DESC;",
    "",
    "-- haeufiger Fehler: WHERE COUNT(*) >= 3  -> geht nicht,",
    "-- WHERE wirkt VOR der Gruppierung.",
], size=12)

d.chapter(3, "Üben", "Gezielt an den Lücken")

d.table_top("Die Übungsstationen", [
    ["Station", "für wen", "Aufgabe"],
    ["A", "Kardinalitäten", "sechs Beziehungen bestimmen und begründen"],
    ["B", "Normalisierung", "zwei Sammeltabellen bis 3NF"],
    ["C", "SQL-Aggregate", "fünf Abfragen mit GROUP BY und HAVING"],
    ["D", "Lesen", "fremde Abfragen in Worten beschreiben"],
], [110, 230, 476], [
    ("Wählt die Station nach eurer **Berichtigung**, nicht nach Vorliebe", 0),
    ("Zu jeder Station gibt es ein Lösungsblatt zur Selbstkontrolle", 0),
], font_size=11, bold_cols=(0,))

d.merksatz("Eine Berichtigung ohne die Frage „welche Regel habe ich verletzt“ "
           "ist Abschreiben mit anderer Tinte.")

d.bullets("Fun Facts: aus Fehlern lernen", [
    ("Der **Testeffekt**: eine Aufgabe, an der man gescheitert ist, behält man besser als eine gelöste", 0),
    ("Vorausgesetzt, man erfährt **danach**, was richtig gewesen wäre", 0),
    ("Deshalb ist die Berichtigung wirksamer als jede Wiederholung des Stoffes", 0),
    ("In der Luftfahrt heißt das Verfahren **Fehlerkultur**: melden statt verstecken", 0),
    ("Und dieselbe Idee steckt in der Retrospektive aus dem Projektmanagement", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Berichtigung** nach den fünf Schritten — für jede Aufgabe mit Punktverlust", 0),
    ("Wählt danach die **Station**, die zu euren Fehlern passt", 0),
    ("Mindestens **zwei** Aufgaben je Station, mit Selbstkontrolle", 0),
    ("Schreibt eure **drei Merksätze** auf ein Blatt für die Abiturvorbereitung", 0),
    ("Offene Fragen an die Tafel — die klären wir vor dem Jahresende", 0),
])

d.save()
