#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 9 / KW 44: Wiederholung + Leistungskontrolle 1
(LB 1: Grundlagen Datenbanken)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("wiederholung-lk1-info9.pptx")

d.title("Informatik — Klasse 9", "Alles noch einmal",
        "Wiederholung und Leistungskontrolle 1 — Grundlagen der Datenbanken")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Die Blitzrunde", "Sieben Begriffe, die sitzen müssen")

d.table_top("Die Begriffe aus LB 1", [
    ["Begriff", "in einem Satz"],
    ["Datenbanksystem", "Datenbasis und DBMS zusammen"],
    ["Datenbasis", "die gespeicherten Daten selbst"],
    ["DBMS", "das Programm, das die Daten verwaltet"],
    ["Tabelle", "alle Datensätze einer Art"],
    ["Datensatz", "eine Zeile — ein einzelnes Ding"],
    ["Datenfeld", "eine Spalte — ein Merkmal"],
    ["Schlüssel", "das Feld, das jeden Datensatz eindeutig macht"],
], [230, 586], [
    ("Wer diese sieben Sätze kann, hat die halbe Leistungskontrolle schon geschafft", 0),
], font_size=11.5, bold_cols=(0,))

d.table_top("Die fünf Datentypen", [
    ["Typ", "wofür", "Beispiel"],
    ["Text", "alles mit Buchstaben, und Zahlen ohne Rechnen", "PLZ 01067"],
    ["Zahl", "womit gerechnet oder sortiert wird", "Jahr 2017"],
    ["Datum", "Tage und Zeitpunkte", "12.03.2026"],
    ["Währung", "Geldbeträge", "34,95 €"],
    ["Ja/Nein", "genau zwei Möglichkeiten", "verliehen"],
], [140, 420, 256], [
    ("Die Faustregel: **womit man nicht rechnet, ist Text**", 0),
    ("Die Gegenprobe: ergibt eine **Summe** über die Spalte einen Sinn?", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Aufwärmen", "Fünf Fragen, die in der LK vorkommen könnten")

d.bullets("Erklärt eurem Nachbarn …", [
    ("… warum man **nie** direkt an die Daten geht, sondern immer über das **DBMS**", 0),
    ("… warum eine Postleitzahl als **Text** gespeichert wird", 0),
    ("… was passiert, wenn ein Schlüsselwert **zweimal** vorkommt", 0),
    ("… warum „Kosmos 1995“ in **einem** Feld ein Fehler ist", 0),
    ("… was ihr zuerst tut, bevor ihr eine Datenbank anlegt", 0),
])

d.table_top("Findet den Fehler", [
    ["Fall", "Fehler?", "warum"],
    ["Telefon als Zahlenfeld", "ja", "die führende 0 verschwindet"],
    ["Jahr als Zahlenfeld", "nein", "damit soll sortiert werden"],
    ["Zwei Zeilen mit Nr 5", "ja", "der Schlüssel ist nicht eindeutig"],
    ["Feld „Vorname Nachname“", "ja", "zwei Merkmale in einer Spalte"],
    ["Preis als Währung", "nein", "richtig so"],
], [270, 120, 426], [
    ("Verdeckt die rechten beiden Spalten und prüft euch selbst", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 1): TINT_RED, (3, 1): TINT_RED, (4, 1): TINT_RED,
          (2, 1): TINT_GREEN, (5, 1): TINT_GREEN})

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Leistungskontrolle 1", "Etwa 20 Minuten")

d.bullets("So läuft es ab", [
    ("**20 Minuten**, Einzelarbeit, keine Hilfsmittel", 0),
    ("Gefragt sind die **Begriffe**, die **Datentypen** und ein kleiner **Entwurf**", 0),
    ("Schreibt bei jeder Antwort **einen** vollständigen Satz — Stichworte kosten Punkte", 0),
    ("Beim Entwurf: **Kästen mit Merkmalen**, ein Merkmal als Schlüssel markiert", 0),
    ("Wer fertig ist, dreht das Blatt um und wartet auf die Knobelaufgabe", 0),
])

d.merksatz("Datenbasis plus DBMS ergibt ein Datenbanksystem. Zeile ist Datensatz, "
           "Spalte ist Datenfeld, und ein Feld ist der Schlüssel.")

d.bullets("Für die Schnellen: das Sortier-Rätsel", [
    ("Fünf Spiele, fünf Verlage, fünf Jahre — und sechs Hinweise", 0),
    ("„Carcassonne ist älter als Azul, aber jünger als Catan.“", 0),
    ("„Das Kosmos-Spiel von 2016 ist kein Legespiel.“", 0),
    ("Baut euch eine **Tabelle** und streicht aus, was nicht passt", 0),
    ("Genau so arbeitet auch eine Datenbank: **filtern, bis nur eine Zeile übrig ist**", 0),
])

d.bullets("Fun Facts: Wiederholung", [
    ("Wer den Stoff einmal **erklärt**, behält ihn deutlich besser als wer ihn dreimal liest", 0),
    ("Der Effekt heißt **Testeffekt** — Abfragen bringt mehr als Wiederlesen", 0),
    ("**Verteiltes Üben** schlägt Pauken: fünf Minuten täglich schlagen eine Stunde am Vorabend", 0),
    ("Der berühmteste Merksatz der Informatik lautet: **„Erst denken, dann tippen“**", 0),
    ("Und der zweitberühmteste: **„Es gibt keine dummen Fragen, nur ungefragte“**", 0),
])

d.save()
