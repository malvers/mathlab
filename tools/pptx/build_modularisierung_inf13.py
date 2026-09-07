#!/usr/bin/env python3
"""Informatik 13 (BGY), Woche 5 / KW 38: Modularisierung - Funktionen, Parameter und
Rueckgabewerte (LB 3, Ustd. 11-12/24)."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from slides import Deck, IMG, py_parts
from tables import TINT_ORANGE, TINT_RED, TINT_GREEN, TINT_BLUE
from flow_diagrams import struktogramm

d = Deck("modularisierung-funktionen.pptx")
P = lambda n: os.path.join(IMG, n)
code = lambda t, ls, **kw: d.code(t, [py_parts(l) for l in ls], **kw)

d.title("Informatik — Grundkurs 13", "Funktionen und Parameter",
        "Ein Programm in Teile zerlegen, die man einzeln verstehen und prüfen kann")

# ---------------------------------------------------------------- Kapitel 01
d.chapter(1, "Warum zerlegen?", "Ein langes Programm ist kein gutes Programm")

d.bullets("Fünf Gründe für Funktionen", [
    ("**Nicht wiederholen**: dieselbe Rechnung steht einmal da, nicht viermal", 0),
    ("**Benennen**: `flaeche_kreis(r)` sagt, was passiert — drei Zeilen Formel sagen es nicht", 0),
    ("**Prüfen**: eine Funktion lässt sich einzeln testen, ein Programmblock nicht", 0),
    ("**Ändern**: eine Korrektur an einer Stelle wirkt überall", 0),
    ("**Teilen**: zwei Leute können an zwei Funktionen gleichzeitig arbeiten", 0),
])

code("Vorher: dieselbe Rechnung dreimal", [
    "r1 = 3",
    "print('Flaeche:', 3.14159 * r1 * r1)",
    "",
    "r2 = 5",
    "print('Flaeche:', 3.14159 * r2 * r2)",
    "",
    "r3 = 7",
    "print('Flaeche:', 3.1459 * r3 * r3)      # <- Tippfehler, faellt nicht auf",
], size=13.5)

code("Nachher: einmal beschrieben, dreimal benutzt", [
    "import math",
    "",
    "def flaeche_kreis(radius):",
    "    return math.pi * radius ** 2",
    "",
    "for r in [3, 5, 7]:",
    "    print('Flaeche:', round(flaeche_kreis(r), 2))",
], size=14)

# ---------------------------------------------------------------- Kapitel 02
d.chapter(2, "Die Bauteile", "def, Parameter, Rückgabewert, Aufruf")

d.table_top("Die vier Begriffe, die man auseinanderhalten muss", [
    ["Begriff", "was es ist", "im Beispiel"],
    ["Definition", "die Beschreibung der Funktion", "def flaeche_kreis(radius):"],
    ["Parameter", "der Platzhalter in der Definition", "radius"],
    ["Argument", "der Wert beim Aufruf", "die 5 in flaeche_kreis(5)"],
    ["Rückgabewert", "was die Funktion herausgibt", "das Ergebnis hinter return"],
], [180, 320, 316], [
    ("**Parameter** steht in der Definition, **Argument** steht im Aufruf — der Unterschied wird geprüft", 0),
    ("Die Definition tut **nichts**, solange niemand die Funktion aufruft", 0),
], font_size=11.5, bold_cols=(0,), mono_cols=(2,))

code("Mehrere Parameter, ein Rückgabewert", [
    "def note_aus_punkten(punkte, maximum):",
    "    prozent = punkte / maximum * 100",
    "    if prozent >= 85:",
    "        return 1",
    "    elif prozent >= 70:",
    "        return 2",
    "    elif prozent >= 55:",
    "        return 3",
    "    return 4",
    "",
    "print(note_aus_punkten(48, 60))     # Argumente in der Reihenfolge der Parameter",
    "print(note_aus_punkten(maximum=60, punkte=48))   # oder benannt, dann egal",
], size=13)

d.bullets("return beendet die Funktion — sofort", [
    ("Ist **return** erreicht, springt die Funktion zurück; alles danach läuft nicht mehr", 0),
    ("Deshalb braucht das Beispiel oben kein **else** — jeder Treffer verlässt die Funktion", 0),
    ("Eine Funktion **ohne** return gibt in Python **None** zurück", 0),
    ("Mehrere Werte gehen auch: **return kleinster, groesster** liefert ein Wertepaar", 0),
    ("Aufteilen des Paars beim Aufruf: **a, b = grenzen(zahlen)**", 0),
])

# ---------------------------------------------------------------- Kapitel 03
d.chapter(3, "Die Verwechslung", "return oder print — das ist nicht dasselbe")

code("Zwei Funktionen, die verschieden viel können", [
    "def flaeche_zeigen(r):",
    "    print(3.14159 * r * r)        # zeigt es an, gibt nichts heraus",
    "",
    "def flaeche(r):",
    "    return 3.14159 * r * r        # gibt es heraus, zeigt nichts an",
    "",
    "a = flaeche_zeigen(3)             # a ist None - nicht weiterrechenbar",
    "b = flaeche(3)                    # b ist 28.27 - weiterrechenbar",
    "print('Zwei Kreise:', b * 2)",
], size=13)

d.bullets("Die Faustregel", [
    ("**Rechnen und Ausgeben trennen**: die Funktion rechnet, das Hauptprogramm zeigt an", 0),
    ("Nur so lässt sich die Funktion **testen** — man vergleicht ihren Rückgabewert mit dem Sollwert", 0),
    ("Und nur so lässt sie sich **wiederverwenden**, etwa in einer Schleife oder Datei", 0),
    ("**print** in einer Rechenfunktion ist fast immer ein Zeichen für unfertiges Zerlegen", 0),
    ("Ausnahme: Funktionen, deren **Zweck** die Ausgabe ist — die heißen dann auch so", 0),
])

# ---------------------------------------------------------------- Kapitel 04
d.chapter(4, "Sichtbarkeit", "Was in der Funktion bleibt, bleibt in der Funktion")

code("Lokal und global", [
    "zaehler = 0                  # global",
    "",
    "def erhoehen(wert):",
    "    zaehler = wert + 1       # LOKAL - eine eigene, neue Variable",
    "    return zaehler",
    "",
    "print(erhoehen(5))           # 6",
    "print(zaehler)               # 0  - das globale zaehler blieb unberuehrt",
], size=13.5)

d.bullets("Warum das gut so ist", [
    ("Alles in einer Funktion Angelegte ist **lokal** und verschwindet beim Verlassen", 0),
    ("Damit kann eine Funktion nichts kaputt machen, was sie nichts angeht", 0),
    ("Was sie braucht, kommt als **Parameter** herein; was sie liefert, geht als **return** hinaus", 0),
    ("**global** gibt es, ist aber fast immer die falsche Antwort — es hebt genau diesen Schutz auf", 0),
    ("Diese Trennung heißt **Kapselung** und ist der Kern jeder Modularisierung", 0),
])

# ---------------------------------------------------------------- Kapitel 05
d.chapter(5, "Refactoring", "Ein fertiges Programm in Module zerlegen")

code("Vorher: ein Block, der alles macht", [
    "noten = []",
    "eingabe = int(input('Note (0 = Ende): '))",
    "while eingabe != 0:",
    "    noten.append(eingabe)",
    "    eingabe = int(input('Note (0 = Ende): '))",
    "",
    "summe = 0",
    "beste = noten[0]",
    "for n in noten:",
    "    summe = summe + n",
    "    if n < beste:",
    "        beste = n",
    "print(round(summe / len(noten), 2), beste)",
], size=12.5)

code("Nachher I: die Eingabe wird eine Funktion", [
    "def noten_einlesen():",
    "    werte = []",
    "    eingabe = int(input('Note (0 = Ende): '))",
    "    while eingabe != 0:",
    "        werte.append(eingabe)",
    "        eingabe = int(input('Note (0 = Ende): '))",
    "    return werte",
], size=14)

code("Nachher II: rechnen und Hauptprogramm", [
    "def mittelwert(werte):",
    "    return sum(werte) / len(werte)",
    "",
    "def beste_note(werte):",
    "    return min(werte)",
    "",
    "noten = noten_einlesen()",
    "print(round(mittelwert(noten), 2), beste_note(noten))",
], size=14)

d.table_top("Was der Umbau gebracht hat", [
    ["vorher", "nachher"],
    ["13 Zeilen am Stück lesen", "drei Namen lesen, Details bei Bedarf"],
    ["nur als Ganzes testbar", "jede Funktion einzeln prüfbar"],
    ["Eingabe und Rechnung verflochten", "Eingabe austauschbar, etwa gegen eine Datei"],
    ["Wiederverwendung unmöglich", "mittelwert passt auf jede Zahlenliste"],
], [380, 436], [
    ("Der Umbau ändert **kein** Verhalten — nur die Struktur. Das nennt man **Refactoring**", 0),
    ("Probe: dieselben Eingaben müssen **dieselbe** Ausgabe liefern wie vorher", 0),
], font_size=11.5, bold_cols=(0,))

d.merksatz("Eine Funktion, die man in einem Satz beschreiben kann, ist richtig geschnitten. "
           "Braucht die Beschreibung ein „und“, sind es zwei Funktionen.")

d.bullets("Fun Facts: Modularisierung", [
    ("**David Parnas** formulierte 1972 das Prinzip: ein Modul verbirgt eine Entwurfsentscheidung", 0),
    ("**DRY** — „Don't repeat yourself“ — stammt aus „The Pragmatic Programmer“ (1999)", 0),
    ("Eine Python-Funktion ohne return liefert **None** — der häufigste Grund für „warum ist das leer?“", 0),
    ("Eine **veränderliche** Vorgabe wie def f(liste=[]) merkt sich Änderungen über Aufrufe hinweg — "
     "eine der bekanntesten Python-Fallen", 0),
    ("Funktionen sind in Python **Werte**: man kann sie in Variablen legen und weitergeben", 0),
])

d.bullets("Eure Aufgabe: zerlegen und prüfen", [
    ("Nehmt euer **Programm aus der letzten Stunde** (Notenauswertung) als Ausgangspunkt", 0),
    ("**Drei Funktionen** herausschneiden: einlesen, rechnen, ausgeben — jede mit einem Satz beschrieben", 0),
    ("Jede Rechenfunktion mit **return**, kein print darin", 0),
    ("**Probe**: dieselben Eingaben müssen dieselben Ergebnisse liefern wie vorher", 0),
    ("Zum Schluss eine Funktion **testen**, indem ihr Rückgabewert und Sollwert vergleicht", 0),
])

d.save()
