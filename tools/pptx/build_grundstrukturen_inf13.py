#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 4 / KW 37: Grundstrukturen ueben - Verzweigungen und
Schleifen, mit Schreibtischtest (LB 3, Ustd. 9-10/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm

d = Deck("grundstrukturen-ueben.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Verzweigungen und Schleifen im Griff",
        "Üben in Stufen, von Hand nachrechnen — und die Fallen, in die alle tappen")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Kurz aufgefrischt", "Drei Bauformen, mehr gibt es nicht")

d.table_top("Auswahl und Wiederholung auf einen Blick", [
    ["Bauform", "Python", "läuft", "typisch für"],
    ["einseitige Auswahl", "if Bedingung:", "0- oder 1-mal", "Sonderfall abfangen"],
    ["zweiseitige Auswahl", "if … else:", "genau einer der Zweige", "Entweder-oder"],
    ["mehrseitige Auswahl", "if … elif … else:", "der erste passende Zweig", "Notenstufen"],
    ["Zählschleife", "for i in range(…):", "so oft wie gezählt", "Anzahl steht fest"],
    ["bedingte Schleife", "while Bedingung:", "solange sie gilt", "Anzahl steht nicht fest"],
], [190, 200, 200, 226], [
    ("Bei **elif** gewinnt der **erste** passende Zweig — die Reihenfolge ist Teil der Logik", 0),
    ("Beide Schleifen sind **kopfgesteuert**: erst prüfen, dann ausführen, also eventuell **null** Durchläufe", 0),
], font_size=11, bold_cols=(0,), mono_cols=(1,))

code("Auswahl: der erste passende Zweig gewinnt", [
    "punkte = int(input('Punkte (0-60): '))",
    "",
    "if punkte < 0 or punkte > 60:      # Sonderfall zuerst abfangen",
    "    print('Ungueltige Eingabe')",
    "elif punkte >= 50:                 # ab hier: der erste Treffer gewinnt",
    "    print('Note 1')",
    "elif punkte >= 40:",
    "    print('Note 2')",
    "elif punkte >= 30:",
    "    print('Note 3')",
    "else:                              # alles, was uebrig bleibt",
    "    print('Note 4')",
], size=13.5)

code("Wiederholung: gezählt oder bedingt", [
    "for i in range(1, 4):          # Anzahl steht fest: drei Durchlaeufe",
    "    print('Durchlauf', i)",
    "",
    "eingabe = -1                   # vorbereiten, sonst gibt es die Variable nicht",
    "while eingabe < 0:             # Anzahl steht nicht fest",
    "    eingabe = int(input('Zahl >= 0: '))",
    "",
    "print('Danke:', eingabe)",
], size=14)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Der Schreibtischtest", "Der Kopf ist der schnellste Debugger")

d.bullets("Was ein Schreibtischtest ist", [
    ("Das Programm **von Hand** durchlaufen und jede Variable nach jedem Schritt notieren", 0),
    ("Werkzeug: eine **Wertetabelle** — eine Spalte je Variable, eine Zeile je Durchlauf", 0),
    ("Er findet genau die Fehler, die der Rechner **ohne Fehlermeldung** durchlaufen lässt", 0),
    ("Und er beantwortet die wichtigste Frage bei jeder Schleife: **Warum hört sie auf?**", 0),
    ("Wer nicht von Hand nachrechnen kann, hat das Programm **nicht verstanden**", 0),
])

code("Testkandidat: die Summe von 1 bis n", [
    "n = 5",
    "summe = 0",
    "i = 1",
    "",
    "while i <= n:",
    "    summe = summe + i",
    "    i = i + 1",
    "",
    "print(summe)",
], size=14)

d.table_top("Die Wertetabelle dazu", [
    ["Durchlauf", "i vorher", "i <= 5 ?", "summe nachher", "i nachher"],
    ["1", "1", "wahr", "1", "2"],
    ["2", "2", "wahr", "3", "3"],
    ["3", "3", "wahr", "6", "4"],
    ["4", "4", "wahr", "10", "5"],
    ["5", "5", "wahr", "15", "6"],
    ["—", "6", "falsch", "15", "6"],
], [140, 150, 150, 200, 176], [
    ("Die letzte Zeile ist die wichtigste: hier wird die Bedingung **falsch**, die Schleife endet", 0),
    ("Ausgabe: **15**. Und 1+2+3+4+5 ist tatsächlich 15 — der Test bestätigt das Programm", 0),
], font_size=11.5, bold_cols=(0,), marks={(6, c): TINT_GREEN for c in range(5)})

sg = struktogramm(P("sg-summe-inf13.png"), [
    ("do", "summe = 0, i = 1"),
    ("while", "solange i <= n", [
        ("do", "summe = summe + i"),
        ("do", "i = i + 1"),
    ]),
    ("do", "Ausgabe: summe"),
], W=700, size=26)
d.picture_bullets("Dasselbe als Struktogramm", sg, [
    ("Der **Rahmen** umschließt genau das, was wiederholt wird", 0),
    ("**i = i + 1** steht im Rumpf — nimmt man es heraus, läuft die Schleife ewig", 0),
    ("Der Zähler wird **vor** der Schleife gesetzt, das Ergebnis **danach** ausgegeben", 0),
    ("Struktogramm und Wertetabelle prüfen dasselbe von zwei Seiten", 0),
], pic_w=400)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Übungskaskade", "Drei Stufen: nachvollziehen, ergänzen, bauen")

d.table_top("Wie wir heute üben", [
    ["Stufe", "Aufgabe", "was ihr abgebt"],
    ["A — nachvollziehen", "fertiges Programm von Hand durchlaufen", "die Wertetabelle"],
    ["B — ergänzen", "Lückenprogramm vervollständigen und testen", "die fehlenden Zeilen"],
    ["C — bauen", "aus der Beschreibung selbst entwickeln", "Struktogramm und Code"],
], [220, 350, 246], [
    ("Jede Stufe wird **erst abgehakt**, wenn das Ergebnis stimmt — Stufe C ohne A ist Raten", 0),
    ("**Partnerprogrammierung**: einer tippt, einer denkt mit und liest laut. Nach jeder Aufgabe tauschen", 0),
], font_size=11.5, bold_cols=(0,))

code("Stufe A — was gibt dieses Programm aus?", [
    "zahlen = [4, 7, 2, 9, 5]",
    "groesster = zahlen[0]",
    "anzahl = 0",
    "",
    "for z in zahlen:",
    "    if z > groesster:",
    "        groesster = z",
    "    if z % 2 == 1:",
    "        anzahl = anzahl + 1",
    "",
    "print(groesster, anzahl)",
], size=13.5)

code("Stufe B — drei Lücken, drei Entscheidungen", [
    "# Gesucht: die kleinste Zahl und wie viele Zahlen unter 5 liegen.",
    "zahlen = [8, 3, 6, 1, 9, 4]",
    "kleinster = ____",
    "unter5 = 0",
    "",
    "for z in zahlen:",
    "    if z ____ kleinster:",
    "        kleinster = z",
    "    if z < 5:",
    "        ____",
    "",
    "print(kleinster, unter5)",
], size=13)

code("Stufe C — selbst entwickeln", [
    "# Eingabe: beliebig viele Noten, Abbruch mit 0.",
    "# Ausgabe: Anzahl, Mittelwert und beste Note.",
    "#",
    "# 1. Welche Schleifenart? Steht die Anzahl vorher fest?",
    "# 2. Welche Variablen muessen VOR der Schleife existieren?",
    "# 3. Womit startet die beste Note - und warum nicht mit 0?",
    "# 4. Was passiert, wenn die erste Eingabe schon 0 ist?",
], size=13)

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Die üblichen Fallen", "Fünf Fehler, die jeder einmal macht")

d.table_top("Symptom, Ursache, Gegenmittel", [
    ["Symptom", "Ursache", "Gegenmittel"],
    ["Schleife läuft ewig", "im Rumpf ändert sich die Bedingung nie", "Zählerzeile suchen"],
    ["einmal zu oft oder zu wenig", "Zaunpfahlfehler bei range oder <=", "Wertetabelle für 1 und n"],
    ["falscher Zweig", "elif-Reihenfolge falsch herum", "Grenzfälle einzeln prüfen"],
    ["Syntaxfehler bei if", "= statt == geschrieben", "= zuweisen, == vergleichen"],
    ["Zeile läuft nie mit", "Einrückung außerhalb des Blocks", "Einrückung mitlesen"],
], [230, 320, 266], [
    ("Alle fünf findet ein Schreibtischtest — der Rechner meldet nur die vierte", 0),
], font_size=11, bold_cols=(0,),
   marks={(1, 0): TINT_RED, (2, 0): TINT_ORANGE, (3, 0): TINT_ORANGE, (5, 0): TINT_ORANGE})

code("Falle 1 und 2 im Original", [
    "# Endlosschleife: i wird nie groesser",
    "i = 1",
    "while i <= 10:",
    "    print(i)",
    "",
    "# Zaunpfahlfehler: laeuft nur bis 9, nicht bis 10",
    "for i in range(1, 10):",
    "    print(i)",
    "",
    "# richtig:",
    "for i in range(1, 11):",
    "    print(i)",
], size=13)

d.merksatz("Wer ein Programm nicht von Hand nachrechnen kann, hat es nicht verstanden. "
           "Der Schreibtischtest ist billiger als jede Fehlersuche im laufenden Code.")

d.bullets("Fun Facts: Auswahl und Wiederholung", [
    ("**Böhm und Jacopini** bewiesen 1966: Folge, Auswahl und Wiederholung genügen für **jeden** Algorithmus", 0),
    ("**Dijkstra** schrieb 1968 „Go To Statement Considered Harmful“ — der Anfang vom Ende des Sprungbefehls", 0),
    ("Der erste dokumentierte **Bug** war 1947 eine echte Motte im Relais des Harvard Mark II, "
     "eingeklebt ins Logbuch", 0),
    ("Python kennt **kein do-while** — die fußgesteuerte Schleife baut man mit while True und break", 0),
    ("Python-Schleifen dürfen ein **else** haben: es läuft, wenn die Schleife **ohne break** endet", 0),
])

d.bullets("Eure Aufgabe: die Kaskade durchlaufen", [
    ("**Stufe A**: das Programm aus Kapitel 3 von Hand durchlaufen, Wertetabelle abgeben", 0),
    ("**Stufe B**: die drei Lücken füllen, in Thonny testen, Ergebnis mit der Tabelle vergleichen", 0),
    ("**Stufe C**: die Notenauswertung selbst bauen — erst Struktogramm, dann Code", 0),
    ("Zu jeder Schleife den Satz aufschreiben: **Diese Schleife hört auf, weil …**", 0),
    ("**Partnerprogrammierung**: nach jeder Aufgabe Rollen tauschen, beide geben ab", 0),
])

d.save()
