#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 8 / KW 41: Vom Datenmodell zur Datenbankstruktur -
Klassen und Objekte (LB 1, Ustd. 7/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("datenmodell-zur-struktur.pptx")

d.title("Informatik — Klasse 9", "Vom Papier in den Rechner",
        "Aus Kästen werden Tabellen: Klasse, Objekt und Attribut")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Drei neue Wörter", "Klasse, Objekt, Attribut")

d.bullets("Was die Informatik dazu sagt", [
    ("Eine **Klasse** ist die Bauanleitung: welche Merkmale hat so ein Ding?", 0),
    ("Ein **Objekt** ist ein einzelnes Ding nach dieser Bauanleitung", 0),
    ("Ein **Attribut** ist eines der Merkmale", 0),
    ("Beispiel: Klasse **Buch** — Objekt „Momo, Signatur E-14“ — Attribut **Titel**", 0),
    ("Diese drei Wörter begleiten euch durch die ganze Informatik, nicht nur bei Datenbanken", 0),
])

d.table_top("Dasselbe in drei Sprachen", [
    ["auf dem Papier", "in der Informatik", "in der Datenbank"],
    ["Kasten", "Klasse", "Tabelle"],
    ["eine Zeile darunter", "Objekt", "Datensatz"],
    ["ein Merkmal", "Attribut", "Datenfeld"],
    ["ein einzelner Eintrag", "Attributwert", "Wert in einer Zelle"],
], [250, 280, 286], [
    ("Drei Wörter für dieselbe Sache — je nachdem, wer gerade redet", 0),
    ("**Klasse = Tabelle** und **Objekt = Datensatz**: das sind die beiden, die ihr braucht", 0),
], font_size=12, bold_cols=(0,),
   marks={(1, c): TINT_GREEN for c in range(3)} | {(2, c): TINT_BLUE for c in range(3)})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Umbau", "Aus der Skizze wird eine Struktur")

d.table_top("Die Klasse BUCH wird zur Tabelle", [
    ["Attribut", "Datentyp", "Beispiel", "Bemerkung"],
    ["Signatur", "Text", "E-14", "Schlüssel: einmalig"],
    ["Titel", "Text", "Momo", ""],
    ["Autor", "Text", "Michael Ende", ""],
    ["Jahr", "Zahl", "1973", "zum Sortieren"],
    ["verliehen", "Ja/Nein", "ja", "Filter"],
], [170, 150, 230, 266], [
    ("Jedes Attribut wird ein **Datenfeld** und bekommt einen **Datentyp**", 0),
    ("Ein Attribut wird zum **Schlüssel**: es muss bei jedem Objekt **verschieden** sein", 0),
], font_size=11.5, bold_cols=(0,), marks={(1, 3): TINT_ORANGE})

d.bullets("Der Schlüssel — warum es ihn braucht", [
    ("Zwei Bücher können denselben **Titel** haben, sogar denselben Autor", 0),
    ("Aber jedes Exemplar hat genau **eine** Signatur", 0),
    ("Daran erkennt die Datenbank einen Datensatz **eindeutig** — beim Suchen, Ändern, Löschen", 0),
    ("Gibt es kein natürliches Merkmal dafür, vergibt man einfach eine **laufende Nummer**", 0),
    ("Ohne Schlüssel weiß das DBMS bei zwei gleichen Zeilen nicht, welche gemeint ist", 0),
])

d.table_top("Die drei Schritte im Programm", [
    ["Schritt", "im DBMS"],
    ["1. Tabelle anlegen", "Name vergeben: BUCH"],
    ["2. Felder anlegen", "je Attribut ein Feld, Datentyp auswählen"],
    ["3. Schlüssel festlegen", "das eindeutige Feld als Primärschlüssel markieren"],
], [250, 566], [
    ("Danach ist die Tabelle **leer, aber fertig** — die Datensätze kommen im nächsten Schritt", 0),
    ("Ändern geht später auch noch, ist aber unangenehm: bestehende Daten müssen passen", 0),
], font_size=12, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Der Check", "Passt jedes Feld? Fehlt etwas?")

d.bullets("Fünf Fragen an die fertige Struktur", [
    ("Kann ich jede Frage aus meinem Entwurf **beantworten**?", 0),
    ("Hat jede Tabelle genau **einen** Schlüssel?", 0),
    ("Steht jedes Merkmal nur an **einer** Stelle?", 0),
    ("Passt zu jedem Feld der **Datentyp** — und lässt sich damit sortieren und rechnen?", 0),
    ("Gibt es ein Feld, das **niemand** je braucht? Dann raus damit", 0),
])

d.merksatz("Aus einer Klasse wird eine Tabelle, aus einem Objekt ein Datensatz und "
           "aus einem Attribut ein Datenfeld. Und ein Feld ist der Schlüssel.")

d.bullets("Fun Facts: Klassen und Objekte", [
    ("Die Idee der **Objektorientierung** stammt aus der Sprache **Simula** von 1967 — "
     "erfunden für Simulationen in Norwegen", 0),
    ("Der Fachbegriff für den Schlüssel ist **Primärschlüssel**, englisch **primary key**", 0),
    ("Eine **ISBN** ist ein Schlüssel für Bücher weltweit — 13 Ziffern, seit 2007", 0),
    ("Die letzte Ziffer der ISBN ist eine **Prüfziffer**: sie verrät Tippfehler sofort", 0),
    ("In der Oberstufe programmiert ihr Klassen und Objekte selbst — dieselben Wörter", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Nehmt euer **Modell von letzter Woche** und setzt **eine** Klasse im DBMS um", 0),
    ("Legt die Tabelle an, alle Felder mit passendem **Datentyp**", 0),
    ("Markiert das eindeutige Feld als **Primärschlüssel**", 0),
    ("Tragt **drei** Objekte ein — also drei Datensätze", 0),
    ("Probiert es aus: was passiert, wenn ihr denselben Schlüssel **zweimal** eingebt?", 0),
])

d.save()
