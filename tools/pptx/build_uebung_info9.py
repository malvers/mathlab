#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 16 / KW 51: Vertiefung und Puffer -
Uebungsstunde Datenbanken."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("uebungsstunde-datenbanken.pptx")

d.title("Informatik — Klasse 9", "Übungsstunde Datenbanken",
        "Offene Aufgaben fertig machen — und für die Schnellen eine Challenge")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Übungszirkel", "Vier Stationen, jeder da, wo es hakt")

d.table_top("Was heute an den Stationen liegt", [
    ["Station", "Aufgabe", "fertig, wenn"],
    ["A — Struktur", "Tabelle mit Feldern und Datentypen anlegen", "Schlüssel ist gesetzt"],
    ["B — Eingabe", "zehn Datensätze über die Maske erfassen", "keine leeren Pflichtfelder"],
    ["C — Suchen", "drei Filter setzen und Treffer notieren", "Zahlen stehen im Heft"],
    ["D — Rechnen", "Anzahl, Summe, Durchschnitt bilden", "Zahlen sind plausibel"],
], [190, 380, 246], [
    ("Fangt bei der Station an, die euch am wenigsten liegt — nicht bei der leichtesten", 0),
    ("Wer eine Station abschließt, hakt sie ab und hilft dem Nachbarn", 0),
], font_size=11, bold_cols=(0,))

d.bullets("Die Fragen, die heute am häufigsten kommen", [
    ("„**Warum sortiert es falsch?**“ — meistens steht die Zahl als Text im Feld", 0),
    ("„**Warum findet der Filter nichts?**“ — Leerzeichen, Tippfehler oder ein UND zu viel", 0),
    ("„**Warum darf ich das nicht speichern?**“ — Pflichtfeld leer oder Schlüssel doppelt", 0),
    ("„**Warum ist der Durchschnitt so komisch?**“ — leere Felder zählen nicht mit", 0),
    ("Alle vier lassen sich in **einer** Minute selbst prüfen. Erst dann Hand heben", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Selbstkontrolle", "Woran ihr merkt, dass es stimmt")

d.table_top("Prüft euch selbst", [
    ["Frage an eure Datenbank", "so muss es sein"],
    ["Wie viele Datensätze?", "so viele, wie ihr eingegeben habt"],
    ["Nach Jahr sortiert", "die kleinste Jahreszahl steht oben"],
    ["Filter „Jahr < 2000“", "es fehlen genau die neueren Zeilen"],
    ["Summe der Preise", "grob im Kopf nachgerechnet plausibel"],
    ["Schlüssel doppelt eingeben", "das DBMS lehnt ab"],
], [330, 486], [
    ("Wenn eine dieser fünf Proben schiefgeht, liegt der Fehler **nicht** am Programm", 0),
], font_size=11.5, bold_cols=(0,))

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Challenge", "Für alle, die durch sind")

d.table_top("Filter- und Auswertungs-Challenge", [
    ["Nr", "Findet heraus …", "Punkte"],
    ["1", "Wie viele Spiele sind älter als ihr selbst?", "1"],
    ["2", "Welcher Verlag kommt am häufigsten vor?", "2"],
    ["3", "Was kosten alle Spiele ab USK 12 zusammen?", "2"],
    ["4", "Welches Spiel ist am teuersten je USK-Stufe?", "3"],
    ["5", "Gibt es zwei Spiele aus demselben Jahr?", "3"],
], [80, 550, 186], [
    ("Zu jeder Antwort gehört der **Weg**: welcher Filter, welche Auswertung?", 0),
    ("Aufgabe 4 und 5 gehen nur mit **Gruppieren** — probiert es aus", 0),
], font_size=11.5, bold_cols=(0,), marks={(4, 2): TINT_ORANGE, (5, 2): TINT_ORANGE})

d.merksatz("Wer eine Frage an die Datenbank formulieren kann, hat den schwierigen "
           "Teil schon hinter sich. Das Klicken ist der Rest.")

d.bullets("Fun Facts: Üben", [
    ("Eine Aufgabe **selbst zu lösen** bringt mehr als drei erklärt zu bekommen", 0),
    ("Wer einem anderen etwas erklärt, merkt am schnellsten, was er selbst noch nicht kann", 0),
    ("Profis nennen das **Rubber Duck Debugging**: dem Gummientchen den Fehler erklären", 0),
    ("Erstaunlich oft findet man den Fehler **beim Erklären**, bevor jemand antwortet", 0),
    ("Deshalb steht in vielen Büros wirklich eine Ente auf dem Schreibtisch", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("Arbeitet die **offenen Stationen** ab — jeder da, wo er steht", 0),
    ("Hakt jede Station im Laufzettel ab, wenn die **Probe** stimmt", 0),
    ("Wer fertig ist: die **Challenge**, mindestens drei Aufgaben", 0),
    ("Notiert zu jeder Challenge-Aufgabe den **Weg**, nicht nur die Zahl", 0),
    ("Am Ende: eine Frage aufschreiben, die ihr **nächstes Mal** klären wollt", 0),
])

d.save()
