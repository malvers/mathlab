#!/usr/bin/env python3
"""Informatik 12 (BGY), Woche 27 / KW 10: Planung und Erstellung einer eigenen
relationalen Datenbank I (LB 2, Ustd. 19-20/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("eigene-datenbank-1.pptx")

d.title("Informatik — Grundkurs 12", "Die eigene Datenbank",
        "Thema wählen, Miniwelt abgrenzen, ER-Modell entwerfen und normalisieren")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Das Thema", "Fachbezogen oder gesellschaftlich relevant")

d.table_top("Themenvorschläge", [
    ["Richtung", "Beispiel", "reizvoll, weil"],
    ["Schule", "Ausleihe der Fachbibliothek", "die Daten gibt es wirklich"],
    ["Verein", "Mitglieder, Beiträge, Mannschaften", "n:m-Beziehungen liegen nahe"],
    ["Umwelt", "Messstationen und Messwerte", "Zeitreihen und Auswertungen"],
    ["Mobilität", "Fahrzeuge, Fahrten, Ladepunkte", "aktuelles Thema, klare Entitäten"],
    ["Kultur", "Konzerte, Bands, Spielstätten", "mehrere n:m-Beziehungen"],
], [140, 330, 346], [
    ("Eigene Vorschläge sind willkommen — sie müssen nur **drei bis fünf Entitätstypen** hergeben", 0),
    ("Mindestens eine **n:m-Beziehung** und eine **1:n-Beziehung** sollen vorkommen", 0),
], font_size=10.5, bold_cols=(0,))

d.bullets("Die Miniwelt abgrenzen", [
    ("**Zweck in einem Satz**: Welche Fragen soll die Datenbank beantworten?", 0),
    ("**Fünf konkrete Fragen** aufschreiben — sie sind später eure Testabfragen", 0),
    ("Was **nicht** dazugehört, ebenfalls aufschreiben", 0),
    ("Alles, was ihr nie abfragen werdet, kommt **nicht** ins Modell", 0),
    ("Das ist derselbe Schritt wie im LB 1: **abgrenzen vor abstrahieren**", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Entwurf", "ER-Modell und Normalisierung")

d.table_top("Der Ablauf heute", [
    ["Schritt", "Ergebnis", "Prüffrage"],
    ["1. Zweck und Fragen", "ein Satz, fünf Fragen", "Sind die Fragen konkret?"],
    ["2. Entitätstypen", "3 bis 5 Rechtecke", "Eigene Merkmale, mehrere Exemplare?"],
    ["3. Attribute und Schlüssel", "Ellipsen, unterstrichen", "Ist jeder Schlüssel eindeutig?"],
    ["4. Beziehungen", "Rauten mit Verben", "Mit beiden Fragen begründet?"],
    ["5. Relationenschema", "Tabellen mit Schlüsseln", "n:m als eigene Tabelle?"],
    ["6. Normalisierung", "3NF", "Steht jede Angabe genau einmal?"],
], [190, 300, 326], [
    ("Prüft nach Schritt 6, ob eure **fünf Fragen** noch beantwortbar sind", 0),
    ("Wenn nicht, fehlt ein Attribut — oder ihr habt zu viel wegnormalisiert", 0),
], font_size=10.5, bold_cols=(0,), marks={(6, 0): TINT_GREEN})

d.bullets("Die typischen Entwurfsfehler", [
    ("**Zu viele Entitätstypen**: alles wird ein Rechteck, auch reine Attribute", 0),
    ("**Kein zusammengesetzter Schlüssel** bei n:m — dann sind Doppelbelegungen möglich", 0),
    ("**Listen in einer Spalte**: „Mitglieder: Anna, Ben, Chiara“ verletzt die 1NF", 0),
    ("**Berechenbares gespeichert**: Alter statt Geburtsdatum — veraltet sofort", 0),
    ("**Kein Zeitbezug**: „aktueller Trainer“ — was ist mit dem vorigen?", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Nachhaltig entwerfen", "Was über die Technik hinausgeht")

d.bullets("Fragen, die zum Entwurf gehören", [
    ("**Welche personenbezogenen Daten** braucht ihr wirklich? Alles andere weglassen", 0),
    ("**Wie lange** sollen die Daten gespeichert bleiben? Löschfristen mitdenken", 0),
    ("**Wer** darf lesen, wer ändern? Rechte gehören in den Entwurf", 0),
    ("**Was passiert bei Fehleingaben?** Constraints statt Hoffnung", 0),
    ("Diese vier Fragen sind kein Beiwerk — sie sind Teil der **Qualität** des Entwurfs", 0),
])

d.table_top("Abgabe am Ende dieser Doppelstunde", [
    ["Teil", "Umfang"],
    ["Zweck und fünf Fragen", "eine halbe Seite"],
    ["ER-Diagramm", "3 bis 5 Entitätstypen, Kardinalitäten begründet"],
    ["Relationenschema", "in Klausurschreibweise, Schlüssel markiert"],
    ["Normalisierungsnachweis", "je Schritt eine Zeile Begründung"],
], [280, 536], [
    ("Nächste Woche wird **implementiert** — mit dem, was heute entsteht", 0),
    ("Wer heute schludert, baut nächste Woche eine Datenbank, die die Fragen nicht beantwortet", 0),
], font_size=11.5, bold_cols=(0,))

d.merksatz("Erst die Fragen, dann das Modell. Eine Datenbank, deren Zweck "
           "niemand aufgeschrieben hat, ist am Ende für nichts zu gebrauchen.")

d.bullets("Fun Facts: Datenbankentwurf", [
    ("Der Entwurf gilt als der Teil, an dem später am **teuersten** nachgebessert wird", 0),
    ("Ein Fehler im Schema wandert durch **jede** Anwendung, die darauf zugreift", 0),
    ("Deshalb gibt es den Beruf **Datenbankarchitekt** — mit eigener Ausbildung", 0),
    ("**Datenmodelle großer Firmen** haben oft mehrere hundert Tabellen", 0),
    ("Und sie werden trotzdem alle nach denselben drei Normalformen geprüft", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Thema wählen** und den Zweck in einem Satz aufschreiben", 0),
    ("**Fünf Fragen** formulieren, die die Datenbank beantworten soll", 0),
    ("**ER-Modell** entwerfen, Kardinalitäten schriftlich begründen", 0),
    ("In ein **Relationenschema** überführen und bis **3NF** normalisieren", 0),
    ("Prüfen: Sind **alle fünf Fragen** mit dem Schema beantwortbar?", 0),
])

d.save()
