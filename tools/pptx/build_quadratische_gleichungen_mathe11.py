#!/usr/bin/env python3
"""Quadratische Gleichungen ohne Hilfsmittel - Mathe 11 (BGY), KW 47, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-quadratische-gleichungen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 47",
        "Quadratische Gleichungen",
        "pq-Formel, Satz von Vieta und die Frage, wie viele Lösungen es überhaupt gibt")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **21 bis 25 von 75**", 0),
    ("Drei Blöcke: **ohne Formel lösen**, **pq-Formel**, **Vieta und Diskriminante**", 0),
    ("Alles mit überschaubaren Zahlen, also **ohne Hilfsmittel**", 0),
    ("Dazu die **Auswertung der Klassenarbeit 1**", 0),
])

d.chapter(1, "Ohne Formel geht es oft schneller", "Erst hinsehen, dann rechnen")

d.bullets("Wenn kein absolutes Glied da ist", [
    ("$x^2 - 7x = 0$: **ausklammern** statt Formel", 0),
    ("$x(x - 7) = 0$, also $x = 0$ oder $x = 7$", 0),
    ("$3x^2 - 12x = 0$ gibt $3x(x - 4) = 0$, also $x = 0$ oder $x = 4$", 0),
    ("Die Lösung $x = 0$ geht verloren, wenn man durch $x$ teilt", 0),
])

d.bullets("Wenn kein x-Glied da ist", [
    ("$2x^2 - 8 = 0$: nach $x^2$ auflösen", 0),
    ("$x^2 = 4$, also $x = 2$ und $x = -2$ — **beide**", 0),
    ("$x^2 = 3x$ ist eine Falle: erst alles auf eine Seite bringen", 0),
    ("$x^2 - 3x = 0$ gibt $x = 0$ und $x = 3$", 0),
])

d.bullets("Wenn ein Quadrat dasteht", [
    ("$(x - 1)^2 = 9$: die Wurzel hat **zwei** Vorzeichen", 0),
    ("$x - 1 = 3$ oder $x - 1 = -3$", 0),
    ("Also $x = 4$ und $x = -2$", 0),
    ("Ausmultiplizieren wäre hier ein Umweg", 0),
])

d.merksatz("Erst schauen, ob ein Faktor fehlt. Die Formel ist der Weg für alles, was übrig bleibt.")

d.chapter(2, "Die pq-Formel", "Für die Normalform, und nur für die")

d.bullets("Die Formel und ihre Bedingung", [
    ("Für $x^2 + px + q = 0$ gilt "
     "$x_{1,2} = -\\dfrac{p}{2} \\pm \\sqrt{\\left(\\dfrac{p}{2}\\right)^2 - q}$", 0),
    ("Wichtig: der Faktor vor $x^2$ muss **$1$** sein — sonst vorher teilen", 0),
    ("$x^2 - 4x - 5 = 0$: $p = -4$, $q = -5$", 0),
    ("$x = 2 \\pm \\sqrt{4 + 5} = 2 \\pm 3$, also $x = 5$ und $x = -1$", 0),
])

d.bullets("Zwei Beispiele zum Mitrechnen", [
    ("$x^2 - 5x + 6 = 0$ gibt $x = 2{,}5 \\pm \\sqrt{6{,}25 - 6}$", 0),
    ("$\\sqrt{0{,}25} = 0{,}5$, also $x = 2$ und $x = 3$", 0),
    ("$x^2 + 2x - 15 = 0$ gibt $x = -1 \\pm 4$, also $x = 3$ und $x = -5$", 0),
    ("**Immer die Probe** über Vieta: Summe und Produkt prüfen", 0),
])

d.bullets("Die Diskriminante entscheidet die Anzahl", [
    ("$D = \\left(\\dfrac{p}{2}\\right)^2 - q$ steht unter der Wurzel", 0),
    ("$D > 0$: **zwei** Lösungen, der Graph schneidet die $x$-Achse", 0),
    ("$D = 0$: **eine** Lösung, der Graph berührt sie — etwa $x^2 - 8x + 16 = 0$", 0),
    ("$D < 0$: **keine** reelle Lösung, etwa $x^2 + 2x + 5 = 0$", 0),
])

d.bullets("Rückwärts: den Parameter bestimmen", [
    ("Für welches $c$ hat $x^2 + 6x + c = 0$ genau eine Lösung?", 0),
    ("Genau eine heißt $D = 0$, also $9 - c = 0$", 0),
    ("Damit $c = 9$ — und tatsächlich ist $x^2 + 6x + 9 = (x + 3)^2$", 0),
    ("Solche Aufgaben löst man **immer über die Diskriminante**", 0),
])

d.chapter(3, "Vieta", "Summe und Produkt statt Formel")

d.bullets("Der Satz von Vieta", [
    ("Für $x^2 + px + q = 0$ mit Lösungen $x_1$ und $x_2$ gilt:", 0),
    ("$x_1 + x_2 = -p$ und $x_1 \\cdot x_2 = q$", 0),
    ("Lösungen $2$ und $-6$: Produkt $q = -12$, Summe $-4$, also $p = 4$", 0),
    ("Als Probe nach jeder pq-Rechnung in fünf Sekunden zu machen", 0),
])

d.bullets("Faktorisieren und Gleichungen bauen", [
    ("$x^2 - x - 12$: gesucht sind zwei Zahlen mit Produkt $-12$ und Summe $-1$", 0),
    ("Das sind $-4$ und $3$, also $x^2 - x - 12 = (x - 4)(x + 3)$", 0),
    ("Umgekehrt zu $x = 3$ und $x = -5$: $(x - 3)(x + 5) = x^2 + 2x - 15$", 0),
    ("Nullstellen von $f(x) = x^2 - 2x - 8$ so: $(x - 4)(x + 2)$, also $4$ und $-2$", 0),
])

d.bullets("Sachaufgaben mit Summe und Produkt", [
    ("Zwei Zahlen mit Summe $12$ und Produkt $35$", 0),
    ("Also $x^2 - 12x + 35 = 0$ — Vorzeichen bei $p$ beachten", 0),
    ("Lösungen $5$ und $7$", 0),
    ("Rechteck mit $U = 20$ cm und $A = 21$ cm²: Seiten $3$ cm und $7$ cm", 0),
])

d.two_cols("Welcher Weg wann?", [
    ("Ohne Formel", 0),
    ("kein absolutes Glied → ausklammern", 1),
    ("kein $x$-Glied → Wurzel ziehen", 1),
    ("Quadrat sichtbar → beide Vorzeichen", 1),
    ("kleine ganze Zahlen → Vieta raten", 1),
], [
    ("Mit pq-Formel", 0),
    ("Normalform, alle drei Glieder da", 1),
    ("Zahlen passen nicht ins Kopfrechnen", 1),
    ("Anzahl der Lösungen gefragt", 1),
    ("Parameter gesucht → über $D$", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — alle drei Wege, gemischt", 0),
    ("Vor jeder Aufgabe zehn Sekunden hinsehen: **geht es ohne Formel?**", 0),
    ("Nach jeder Lösung die Vieta-Probe — sie kostet nichts", 0),
    ("**docalvers.de/mathetest11-quadratische-gleichungen.html**", 0),
])

d.save()
