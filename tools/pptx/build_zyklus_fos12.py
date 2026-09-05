#!/usr/bin/env python3
"""Grundstrukturen III: Zyklus / Wiederholung (Woche 16)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm, pap

d = Deck("grundstruktur-zyklus.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — FOS 12", "Grundstruktur III: die Wiederholung",
        "Zählschleife und bedingte Schleife — und wie man sie wieder loswird")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Wozu Schleifen?", "Der Rechner ist geduldig, der Programmierer nicht")

d.bullets("Hundert Zeilen oder drei", [
    ("100 Zahlen addieren — ohne Schleife: 100 Zeilen. Mit Schleife: **drei**", 0),
    ("Eine Schleife wiederholt einen **Block**, solange oder sooft es nötig ist", 0),
    ("Zwei Fragen entscheiden über die Bauart: **Weiß ich vorher, wie oft?**", 0),
    ("**Ja** → Zählschleife (**for**) · **Nein** → bedingte Schleife (**while**)", 0),
    ("Jede Schleife braucht etwas, das sie **beendet** — sonst läuft sie ewig", 0),
])

d.table_top("Die beiden Bauarten", [
    ["", "Zählschleife (for)", "bedingte Schleife (while)"],
    ["Anzahl vorher bekannt?", "ja", "nein"],
    ["Steuerung", "eine Laufvariable zählt", "eine Bedingung wird geprüft"],
    ["typisch", "„für jede Note in der Liste“", "„solange die Eingabe falsch ist“"],
    ["Gefahr", "gering", "Endlosschleife"],
], [200, 290, 326], [
    ("Beide sind **kopfgesteuert**: erst prüfen, dann ausführen — der Block läuft eventuell **null** Mal", 0),
    ("Die **fußgesteuerte** Schleife (erst ausführen, dann prüfen) gibt es in Python nicht direkt", 0),
], font_size=11.5, bold_cols=(0,),
   marks={(1, 1): TINT_GREEN, (1, 2): TINT_ORANGE, (4, 1): TINT_GREEN, (4, 2): TINT_RED})

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Zählschleife", "for — wenn die Anzahl feststeht")

code("for und range", [
    "for i in range(5):",
    "    print(i)          # 0 1 2 3 4  - fuenf Durchlaeufe, Start bei 0",
    "",
    "for i in range(1, 6):",
    "    print(i)          # 1 2 3 4 5",
    "",
    "for i in range(0, 20, 5):",
    "    print(i)          # 0 5 10 15  - Schrittweite 5",
    "",
    "for note in [2, 1, 3, 2]:",
    "    print('Note:', note)   # direkt ueber die Liste laufen",
], size=13.5)

d.table_top("range verstehen", [
    ["Aufruf", "erzeugt", "Anzahl Durchläufe"],
    ["range(5)", "0, 1, 2, 3, 4", "5"],
    ["range(1, 6)", "1, 2, 3, 4, 5", "5"],
    ["range(1, 6, 2)", "1, 3, 5", "3"],
    ["range(5, 0, -1)", "5, 4, 3, 2, 1", "5"],
    ["range(0)", "nichts", "0"],
], [220, 300, 296], [
    ("Der **Startwert gehört dazu**, der **Endwert nicht** — range(1, 6) endet bei 5", 0),
    ("Genau hier sitzt der **Zaunpfahlfehler**: einmal zu oft oder einmal zu wenig", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(0, 1),
   marks={(2, 1): TINT_ORANGE} | {(5, c): TINT_BLUE for c in range(3)})

sg1 = struktogramm(P("sg-for.png"), [
    ("do", "summe = 0"),
    ("for", "für i von 1 bis n", [
        ("do", "summe = summe + i"),
    ]),
    ("do", "Ausgabe: summe"),
], W=860, size=26)
d.picture_bullets("Die Zählschleife im Struktogramm", sg1, [
    ("Der **Rahmen** umschließt genau das, was wiederholt wird", 0),
    ("Die Zeile oben nennt die **Laufvariable** und ihren Bereich", 0),
    ("Der **Summierer** wird **vor** der Schleife auf 0 gesetzt — sonst gibt es ihn beim ersten Durchlauf nicht", 0),
    ("Nach dem Rahmen steht das Ergebnis: die Schleife ist da schon fertig", 0),
], pic_w=390)

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die bedingte Schleife", "while — solange etwas gilt")

code("Das Ratespiel", [
    "import random",
    "",
    "gesucht = random.randint(1, 100)",
    "versuche = 0",
    "tipp = 0",
    "",
    "while tipp != gesucht:",
    "    tipp = int(input('Dein Tipp: '))",
    "    versuche = versuche + 1",
    "    if tipp < gesucht:",
    "        print('zu klein')",
    "    elif tipp > gesucht:",
    "        print('zu gross')",
    "",
    "print(f'Richtig! {versuche} Versuche.')",
], size=12.5)

d.bullets("Drei Dinge, die jede while-Schleife braucht", [
    ("**Vorbereiten**: die Variable der Bedingung muss vor der Schleife einen Wert haben", 0),
    ("**Prüfen**: die Bedingung im Kopf entscheidet über jeden weiteren Durchlauf", 0),
    ("**Verändern**: im Rumpf muss sich etwas ändern, das die Bedingung irgendwann **falsch** macht", 0),
    ("Fehlt der dritte Punkt, entsteht die **Endlosschleife** — Abbruch mit Strg+C", 0),
    ("Ehrliche Frage vor dem Start: **Warum** hört diese Schleife auf?", 0),
])

code("Eingabe erzwingen — das häufigste while", [
    "punkte = -1",
    "",
    "while punkte < 0 or punkte > 60:",
    "    punkte = int(input('Punkte (0-60): '))",
    "    if punkte < 0 or punkte > 60:",
    "        print('Ungueltig, bitte noch einmal.')",
    "",
    "print('Danke:', punkte)",
    "",
    "# Endlosschleife - der Klassiker:",
    "# i = 1",
    "# while i <= 10:",
    "#     print(i)        # i wird nie groesser -> laeuft ewig",
], size=13)

sg2 = struktogramm(P("sg-while.png"), [
    ("do", "punkte = -1"),
    ("while", "solange punkte < 0 oder punkte > 60", [
        ("do", "Eingabe: punkte"),
    ]),
    ("do", "Ausgabe: punkte"),
], W=1000, size=25, caption="Kopfgesteuert: die Bedingung steht oben, der Rumpf laeuft evtl. nie")
d.picture("Die bedingte Schleife im Struktogramm", sg2, [
    ("Bedingung **oben** = kopfgesteuert: erst prüfen, dann ausführen", 0),
    ("Stünde die Bedingung **unten**, liefe der Rumpf **mindestens einmal** (fußgesteuert)", 0),
], width=620)

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Die Klassiker", "Vier Muster, die immer wiederkehren")

d.table_top("Muster, die ihr in jeder Aufgabe braucht", [
    ["Muster", "Vorbereitung", "im Rumpf", "wofür"],
    ["Zähler", "anzahl = 0", "anzahl = anzahl + 1", "Wie viele erfüllen die Bedingung?"],
    ["Summierer", "summe = 0", "summe = summe + wert", "Summe, Mittelwert"],
    ["Extremwert", "groesster = erster Wert", "if wert > groesster: ...", "Maximum, Minimum"],
    ["Sucher", "gefunden = False", "if wert == gesucht: ...", "Kommt X vor?"],
], [140, 220, 240, 216], [
    ("Immer dasselbe Gerüst: **vorher setzen — im Rumpf verändern — danach ausgeben**", 0),
    ("Beim **Extremwert** nie mit 0 starten: bei lauter negativen Zahlen wäre 0 das falsche Maximum", 0),
], font_size=11, bold_cols=(0,))

code("Alle vier Muster in einem Programm", [
    "noten = [3, 1, 4, 2, 1, 5]",
    "",
    "summe = 0",
    "anzahl_einsen = 0",
    "beste = noten[0]",
    "",
    "for note in noten:",
    "    summe = summe + note",
    "    if note == 1:",
    "        anzahl_einsen = anzahl_einsen + 1",
    "    if note < beste:",
    "        beste = note",
    "",
    "print('Mittelwert:', round(summe / len(noten), 2))",
    "print('Einsen:', anzahl_einsen, '- beste Note:', beste)",
], size=12)

d.merksatz("Jede Schleife braucht eine Abbruchbedingung, die im Rumpf auch "
           "wirklich erreicht wird. Sonst rechnet der Computer bis Weihnachten.")

d.bullets("Fun Facts: Schleifen", [
    ("Die **Endlosschleife** ist der Grund für den Ausschalter — und für Strg+C", 0),
    ("**while True:** mit **break** ist keine Sünde, sondern das übliche Muster für Menüs", 0),
    ("Der **Ping-Pong-Bug** im Mars-Rover Spirit 2004: eine Schleife startete den Rover 60-mal neu, bis das Team eingriff", 0),
    ("Die **Collatz-Vermutung** ist ein Dreizeiler mit Schleife — ob sie bei **jeder** Zahl endet, weiß seit 1937 niemand", 0),
    ("**for** heißt in Python „für jedes Element in“ — deshalb läuft es auch über Texte, Listen und Dateien", 0),
])

d.bullets("Eure Aufgabe: Schleifen bauen", [
    ("**Einmaleins**: eine Zahl einlesen und die Reihe von 1 bis 10 ordentlich ausgeben", 0),
    ("**Notenstatistik**: so lange Noten einlesen, bis 0 eingegeben wird; dann Anzahl, Mittelwert, beste und schlechteste Note ausgeben", 0),
    ("**Ratespiel** umdrehen: **ihr** denkt euch eine Zahl aus, der Rechner rät (Tipp: immer die Mitte)", 0),
    ("**Collatz**: Zahl einlesen; ist sie gerade, halbieren, sonst mal 3 plus 1 — bis 1 erreicht ist. Zählt die Schritte", 0),
    ("Zu jeder Aufgabe: Struktogramm zeichnen und die Frage beantworten **warum hört die Schleife auf?**", 0),
])

d.save()
