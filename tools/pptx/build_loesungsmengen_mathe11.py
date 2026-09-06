#!/usr/bin/env python3
"""Diskussion der Loesungsmengen - Mathe 11 (BGY), KW 12, LB 4."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-loesungsmengen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 12",
        "Keine, eine, unendlich viele",
        "Was am Ende des Gauß-Verfahrens dasteht — und was es bedeutet")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 4 — Stunden **11 bis 15 von 20**", 0),
    ("Drei Blöcke: **die drei Fälle**, **Lösungsmengen aufschreiben**, "
     "**geometrisch deuten**", 0),
    ("Übungszirkel Gauß — Rechnen bleibt, die Deutung kommt dazu", 0),
    ("Ein lineares System hat **nie zwei** oder **fünf** Lösungen, nur diese drei Fälle", 0),
])

d.chapter(1, "Die drei Fälle", "Mehr gibt es nicht")

d.bullets("Keine Lösung", [
    ("Die Stufenform endet mit $0 = -7$ — eine **falsche** Aussage", 0),
    ("Dann ist die Lösungsmenge **leer**", 0),
    ("$x + y = 4$ und $x + y = 9$: dieselbe linke Seite, verschiedene rechte", 0),
    ("Man schreibt $L = \\{\\}$", 0),
])

d.bullets("Genau eine Lösung", [
    ("Jede Unbekannte bekommt eine eigene Stufe", 0),
    ("Aus der Stufenform lässt sich rückwärts jeder Wert eindeutig bestimmen", 0),
    ("Die Lösung $(2 \\mid -1 \\mid 4)$ heißt $x = 2$, $y = -1$, $z = 4$", 0),
    ("**Reihenfolge zählt** — es ist ein geordnetes Tripel", 0),
])

d.bullets("Unendlich viele Lösungen", [
    ("Es bleibt eine Zeile $0 = 0$ übrig — eine **wahre**, aber leere Aussage", 0),
    ("$x + y = 4$ und $2x + 2y = 8$ sind dieselbe Gleichung", 0),
    ("$2x - y = 3$ und $-4x + 2y = -6$ ebenso — die zweite ist das $-2$-fache", 0),
    ("Bei drei Unbekannten und nur zwei echten Zeilen bleibt eine **frei wählbar**", 0),
])

d.merksatz("Die letzte Zeile entscheidet: falsche Aussage heißt keine Lösung, wahre Aussage heißt unendlich viele.")

d.chapter(2, "Lösungsmengen aufschreiben", "Mit Parameter statt mit Worten")

d.bullets("Die Parameterform", [
    ("Eine Unbekannte frei setzen, etwa $z = t$", 0),
    ("Die anderen durch $t$ ausdrücken", 0),
    ("Dann $L = \\{(x \\mid y \\mid z)\\}$ mit allen Werten in Abhängigkeit von $t$", 0),
    ("$t$ durchläuft alle reellen Zahlen — daher unendlich viele Lösungen", 0),
])

d.bullets("Ein Beispiel", [
    ("$x + y + z = 3$, $2x + 2y + 2z = 6$, $x - y = 0$", 0),
    ("Die zweite Zeile ist das Doppelte der ersten und fällt weg", 0),
    ("Aus $x = y$ und $x + y + z = 3$ folgt $z = 3 - 2x$", 0),
    ("$x = y = z = 1$ ist **eine** Lösung von vielen — mit $x = 0$ etwa auch $(0 \\mid 0 \\mid 3)$", 0),
])

d.bullets("Homogene Systeme", [
    ("Homogen heißt: rechts steht überall **null**", 0),
    ("Dann ist $x = y = z = 0$ immer eine Lösung — die **triviale**", 0),
    ("Ein homogenes System hat also **mindestens eine** Lösung, nie keine", 0),
    ("$0 \\cdot x = 0$ ist für **jedes** $x$ wahr: $L$ sind alle reellen Zahlen", 0),
])

d.bullets("Mehr Unbekannte als Gleichungen", [
    ("Dann bleibt typischerweise mindestens eine Unbekannte **frei**", 0),
    ("Also unendlich viele Lösungen — oder gar keine, wenn ein Widerspruch auftritt", 0),
    ("Eine eindeutige Lösung ist in diesem Fall **nicht** möglich", 0),
    ("Vor dem Notieren von „keine Lösung“ immer **nachrechnen**, nicht raten", 0),
])

d.chapter(3, "Geometrisch deuten", "Ebenen im Raum")

d.bullets("Was eine Gleichung beschreibt", [
    ("Eine Gleichung mit zwei Unbekannten ist eine **Gerade** in der Ebene", 0),
    ("Eine Gleichung mit drei Unbekannten ist eine **Ebene** im Raum", 0),
    ("Die Lösungsmenge ist der **gemeinsame Teil** aller Gleichungen", 0),
    ("Drei Ebenen mit genau einem gemeinsamen Punkt: eindeutige Lösung", 0),
])

d.two_cols("Wenn drei Ebenen sich nicht treffen", [
    ("Kein gemeinsamer Punkt", 0),
    ("Dreiecksprisma: paarweise Schnittgeraden, aber keine gemeinsame", 1),
    ("System hat **keine** Lösung", 1),
], [
    ("Unendlich viele", 0),
    ("alle drei schneiden sich in **einer Geraden**", 1),
    ("oder zwei sind deckungsgleich", 1),
])

d.bullets("Windschief und andere Sonderfälle", [
    ("Zwei Geraden im Raum, die sich nicht schneiden und nicht parallel sind, "
     "heißen **windschief**", 0),
    ("Im Raum ist das der Normalfall, nicht die Ausnahme", 0),
    ("Ein Mischungsproblem mit der Lösung $x = -3$ Liter ist **rechnerisch richtig**", 0),
    ("Sachlich unmöglich — also verwerfen und den Ansatz prüfen", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — die drei Fälle erkennen und aufschreiben", 0),
    ("Bei jedem Ergebnis fragen: **welcher der drei Fälle ist das?**", 0),
    ("Und bei Sachaufgaben: passt die Lösung überhaupt zur Wirklichkeit?", 0),
    ("**docalvers.de/mathetest11-loesungsmengen.html**", 0),
])

d.save()
