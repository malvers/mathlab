#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 6 / KW 39: Felddatentypen (LB 1, Ustd. 5/13)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("felddatentypen.pptx")

d.title("Informatik — Klasse 9", "Was darf in dieses Feld?",
        "Felddatentypen: Text, Zahl, Datum, Währung, Wahrheitswert")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum das wichtig ist", "Drei Dinge gehen schief ohne Datentyp")

d.table_top("Dieselbe Spalte, einmal als Text und einmal als Zahl", [
    ["als Text sortiert", "als Zahl sortiert"],
    ["10", "2"],
    ["2", "9"],
    ["9", "10"],
    ["100", "100"],
], [408, 408], [
    ("Text wird **Zeichen für Zeichen** verglichen: „10“ kommt vor „2“, weil 1 kleiner als 2 ist", 0),
    ("Nur bei einer **Zahl** sortiert der Rechner nach dem Wert", 0),
    ("Genau dafür gibt es **Felddatentypen**: sie sagen, was in einem Feld stehen darf", 0),
], font_size=13, marks={(1, 0): TINT_RED, (2, 0): TINT_RED, (3, 0): TINT_RED} |
   {(r, 1): TINT_GREEN for r in range(1, 5)})

d.bullets("Was ein Datentyp für euch erledigt", [
    ("**Richtig sortieren** — Zahlen nach Wert, Datumsangaben nach Zeit", 0),
    ("**Rechnen** — Summe, Durchschnitt und Differenz gehen nur mit Zahlen", 0),
    ("**Eingaben prüfen** — in ein Datumsfeld kommt kein „morgen“ hinein", 0),
    ("**Platz sparen** — eine Zahl braucht weniger Speicher als der Text „1995“", 0),
    ("Der Typ wird **einmal** beim Anlegen der Tabelle festgelegt und gilt für die ganze Spalte", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die fünf Typen", "Mehr braucht ihr dieses Jahr nicht")

d.table_top("Welcher Typ wofür?", [
    ["Typ", "für", "Beispiel", "geht damit"],
    ["Text", "alles, was Buchstaben enthält", "Carcassonne", "suchen, sortieren"],
    ["Zahl", "Mengen und Anzahlen", "2000", "rechnen, sortieren"],
    ["Datum", "Tage und Zeitpunkte", "24.12.2026", "Zeitraum berechnen"],
    ["Währung", "Geldbeträge", "34,95 €", "rechnen, richtig runden"],
    ["Ja/Nein", "genau zwei Möglichkeiten", "verliehen: ja", "filtern"],
], [130, 260, 200, 226], [
    ("**Ja/Nein** heißt auch **Wahrheitswert** oder **boolesch** — nach George Boole", 0),
    ("**Währung** ist im Grunde eine Zahl, die das DBMS immer mit zwei Nachkommastellen zeigt", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Die drei Fallen, in die alle tappen", [
    ("**Telefonnummer als Zahl** — dann verschwindet die 0 am Anfang: aus 0351 wird 351", 0),
    ("**Postleitzahl als Zahl** — 01067 Dresden wird zu 1067. Beides gehört als **Text** hinein", 0),
    ("**Datum als Text** — dann steht der 1. Mai vor dem 30. April, weil „1“ vor „3“ kommt", 0),
    ("Faustregel: **Womit man nicht rechnet, ist Text** — auch wenn es aus Ziffern besteht", 0),
    ("Gegenprobe: Ergibt eine Summe über diese Spalte einen Sinn? Nein? Dann Text", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "An unserer Tabelle", "Die Spielesammlung bekommt Typen")

d.table_top("Spielesammlung: welcher Typ passt?", [
    ["Feld", "Beispielwert", "Typ", "warum"],
    ["Nr", "3", "Zahl", "zählt und sortiert"],
    ["Titel", "Azul", "Text", "Buchstaben"],
    ["Verlag", "Kosmos", "Text", "Buchstaben"],
    ["Jahr", "2017", "Zahl", "sortieren, vergleichen"],
    ["Preis", "34,95 €", "Währung", "Geldbetrag"],
    ["gekauft am", "12.03.2026", "Datum", "Zeitpunkt"],
    ["verliehen", "ja", "Ja/Nein", "nur zwei Möglichkeiten"],
], [140, 190, 150, 336], [
    ("**Nr** und **Jahr** sind beide Zahlen — aber nur mit Nr rechnet niemand: sie ist der Schlüssel", 0),
], font_size=10.5, bold_cols=(0,), marks={(r, 2): TINT_BLUE for r in range(1, 8)})

d.merksatz("Der Datentyp legt fest, was in ein Feld darf. Womit man nicht rechnet, "
           "gehört als Text hinein — auch eine Postleitzahl.")

d.bullets("Fun Facts: Datentypen", [
    ("**George Boole** beschrieb 1854 das Rechnen mit wahr und falsch — heute steckt es in jedem Rechner", 0),
    ("Ein Datum speichert der Rechner als **Zahl**: meist die Tage seit einem festen Starttag", 0),
    ("Deshalb kann er ausrechnen, **wie viele Tage** zwischen zwei Datumsangaben liegen", 0),
    ("Beim **Jahr-2000-Problem** waren Jahreszahlen nur zweistellig gespeichert — „00“ hieß dann 1900", 0),
    ("Geldbeträge speichert man **nie** als Kommazahl, sondern in Cent — sonst entstehen Rundungsfehler", 0),
])

d.bullets("Eure Aufgabe am Rechner", [
    ("Öffnet eure Tabelle **Spielesammlung** von letzter Woche", 0),
    ("Legt für **jedes** Feld den passenden Datentyp fest", 0),
    ("Ergänzt die Felder **Preis**, **gekauft am** und **verliehen**", 0),
    ("**Probe**: tippt in das Jahr-Feld ein Wort. Was sagt das DBMS?", 0),
    ("Sortiert einmal nach **Jahr** und einmal nach **Titel** — und erklärt den Unterschied", 0),
])

d.save()
