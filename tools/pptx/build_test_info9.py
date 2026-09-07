#!/usr/bin/env python3
"""Informatik 9 (Oberschule), Woche 33 / KW 16: Test und Fehlersuche
(LB 2, Ustd. 10/12)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE

d = Deck("test-und-fehlersuche.pptx")

d.title("Informatik — Klasse 9", "Testen heißt: kaputt machen wollen",
        "Testplan abarbeiten, Fremdtest auswerten, Fehler beheben")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Der Testplan", "Jede Anforderung einmal prüfen")

d.table_top("So sieht euer Testplan aus", [
    ["Nr", "Anforderung", "Probe", "läuft?"],
    ["1", "Start mit grüner Flagge", "Flagge klicken", "ja"],
    ["2", "Steuerung mit Pfeiltasten", "alle vier Richtungen probieren", "ja"],
    ["3", "Punkte werden gezählt", "dreimal fangen, steht 3?", "nein"],
    ["4", "Ende nach drei Fehlern", "dreimal daneben", "ja"],
], [70, 300, 320, 126], [
    ("Zu jeder Anforderung gehört genau **eine** Probe, die man wiederholen kann", 0),
    ("„läuft?“ hat nur zwei Antworten — **ja** oder **nein**. „Fast“ heißt nein", 0),
], font_size=11, bold_cols=(0,), marks={(3, 3): TINT_RED})

d.bullets("Auch die unangenehmen Fälle testen", [
    ("Was passiert bei **null** Punkten? Bei **sehr vielen** Punkten?", 0),
    ("Was, wenn jemand **zwei Tasten gleichzeitig** drückt?", 0),
    ("Was, wenn man **sofort** nach dem Start etwas macht?", 0),
    ("Was, wenn man das Spiel **zweimal hintereinander** spielt?", 0),
    ("Genau diese Fälle probiert der Fremdtester — und sie fallen in der Präsentation auf", 0),
])

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Fehler suchen", "Systematisch statt raten")

d.table_top("Die Suchstrategie", [
    ["Schritt", "was ihr tut"],
    ["1. Wiederholen", "den Fehler absichtlich noch einmal auslösen"],
    ["2. Eingrenzen", "wann tritt er auf, wann nicht?"],
    ["3. Vermuten", "eine einzige Ursache annehmen"],
    ["4. Prüfen", "eine Sache ändern, testen"],
    ["5. Merken", "hat es geholfen? Wenn nein: Änderung zurücknehmen"],
], [200, 616], [
    ("Wer einen Fehler **nicht wiederholen** kann, kann ihn auch nicht beheben", 0),
    ("Schritt 5 wird am häufigsten vergessen — dann sammeln sich halbe Reparaturen an", 0),
], font_size=11.5, bold_cols=(0,), marks={(5, 0): TINT_ORANGE})

d.bullets("Werkzeuge, die euch beim Suchen helfen", [
    ("**Zwischenausgaben**: die Punktzahl an einer Stelle anzeigen lassen, wo man sie sieht", 0),
    ("**Langsam machen**: eine Wartezeit einbauen und zuschauen", 0),
    ("**Halbieren**: die Hälfte des Ablaufs abschalten — liegt der Fehler in der anderen?", 0),
    ("**Erklären**: einem Teammitglied laut erklären, was passieren soll", 0),
    ("Alle vier kosten Minuten. Raten kostet Stunden", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Beheben", "In der richtigen Reihenfolge")

d.table_top("Was zuerst repariert wird", [
    ["Schwere", "heißt", "Beispiel"],
    ["hoch", "das Produkt funktioniert nicht", "Punkte werden nie gezählt"],
    ["mittel", "stört, aber man kommt weiter", "Figur läuft aus dem Bild"],
    ["niedrig", "Schönheitsfehler", "Schrift überlappt"],
], [150, 330, 336], [
    ("**Hoch** zuerst, immer. Ein schöner Fehler ist besser als ein kaputtes Produkt", 0),
    ("Nach **jeder** Reparatur den zugehörigen Test noch einmal machen", 0),
    ("Was ihr nicht mehr schafft, kommt **in die Dokumentation** — offen und ehrlich", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_ORANGE, (3, 0): TINT_GREEN})

d.merksatz("Ein Fehler, den man nicht wiederholen kann, lässt sich nicht beheben. "
           "Erst wiederholen, dann eingrenzen, dann eine Sache ändern.")

d.bullets("Fun Facts: Testen", [
    ("Der erste **Bug** war 1947 eine Motte im Relais des Harvard Mark II — eingeklebt ins Logbuch", 0),
    ("**Dijkstra**: „Testen zeigt die Anwesenheit von Fehlern, nie ihre Abwesenheit“", 0),
    ("In großen Projekten gibt es mehr **Testcode** als Programmcode", 0),
    ("Ein Fehler, der erst beim Kunden auffällt, kostet ein Vielfaches von einem, der früh auffällt", 0),
    ("Profis schreiben den Test **vor** dem Programm — das heißt testgetriebene Entwicklung", 0),
])

d.bullets("Eure Aufgabe heute", [
    ("**Testplan** abarbeiten: jede Anforderung mit ihrer Probe", 0),
    ("**Fremdtest** durchführen: das Nachbarteam bekommt eure Fassung und das Protokoll", 0),
    ("Fehler nach **Schwere** sortieren", 0),
    ("Die hohen Fehler **beheben** — eine Sache zur Zeit, danach neu testen", 0),
    ("Am Ende v4 sichern und aufschreiben, **was offen bleibt**", 0),
])

d.save()
