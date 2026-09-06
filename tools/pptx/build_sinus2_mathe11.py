#!/usr/bin/env python3
"""Periodische Vorgaenge II: Sinus vertieft - Mathe 11 (BGY), KW 50, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-sinus2.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 50",
        "Amplitude, Periode, Verschiebung",
        "Vier Parameter machen aus der Sinuskurve jedes periodische Modell")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **36 bis 40 von 75**", 0),
    ("Die allgemeine Form: $f(x) = a \\cdot \\sin(b\\,x + c) + d$", 0),
    ("Drei Blöcke: **Amplitude und Verschiebung**, **Periode**, **Anwendungen**", 0),
    ("GeoGebra: die Parameter mit Schiebereglern **selbst erkunden**", 0),
])

d.chapter(1, "Höhe und Lage", "Was a und d machen")

d.bullets("Die Amplitude a", [
    ("$f(x) = 3\\sin x$ schwingt zwischen $-3$ und $3$", 0),
    ("Die **Amplitude** ist $3$ — die größte Auslenkung aus der Mittellage", 0),
    ("$f(x) = -4\\sin x$ hat die Amplitude $4$, nicht $-4$", 0),
    ("Das Minus **spiegelt** die Kurve, es verkleinert sie nicht", 0),
])

d.bullets("Die Verschiebung d", [
    ("$f(x) = \\sin x + 2$ hebt die ganze Kurve um $2$ an", 0),
    ("Die **Mittellage** liegt dann bei $y = 2$ statt bei null", 0),
    ("$f(x) = 2\\sin x + 5$ schwingt zwischen $3$ und $7$", 0),
    ("Wertebereich also $3 \\leq y \\leq 7$ — Mittellage $\\pm$ Amplitude", 0),
])

d.bullets("Was die Anhebung mit den Nullstellen macht", [
    ("Bei $f(x) = \\sin x + d$ verschieben sich die Nullstellen", 0),
    ("Ist $d > 1$, gibt es **gar keine** mehr — die Kurve bleibt oberhalb der Achse", 0),
    ("Ist $d = 1$, berührt sie die Achse nur noch", 0),
    ("Die Amplitude bleibt dabei **unverändert**", 0),
])

d.bullets("Die Verschiebung nach rechts", [
    ("$f(x) = \\sin\\left(x - \\dfrac{\\pi}{2}\\right)$ ist um $\\dfrac{\\pi}{2}$ "
     "nach **rechts** geschoben", 0),
    ("Im Term steht ein Minus, verschoben wird nach rechts — wie bei der Parabel", 0),
    ("Das Ergebnis ist genau die Kosinuskurve, gespiegelt", 0),
    ("Sinus und Kosinus sind dieselbe Welle, nur **um $\\dfrac{\\pi}{2}$ versetzt**", 0),
])

d.merksatz("Amplitude ist die Höhe der Welle, die Verschiebung ihre Ruhelage. Beide ändern die Periode nicht.")

d.chapter(2, "Die Periode", "Der Parameter, der am häufigsten verwechselt wird")

d.bullets("Wie b die Periode ändert", [
    ("$f(x) = \\sin(2x)$ hat die Periode $\\pi$ — **halb** so lang", 0),
    ("$f(x) = \\sin\\left(\\dfrac{x}{2}\\right)$ hat die Periode $4\\pi$", 0),
    ("Formel: Periode $= \\dfrac{2\\pi}{b}$", 0),
    ("Großes $b$ heißt **schnelle** Schwingung, kleines $b$ eine langsame", 0),
])

d.bullets("Schwingungen zählen", [
    ("$f(x) = \\sin(3x)$ macht im Bereich $0 \\leq x < 2\\pi$ genau **drei** Schwingungen", 0),
    ("Denn $b$ gibt an, wie oft die Welle in $2\\pi$ passt", 0),
    ("$f(t) = 0{,}5\\sin(4t)$ hat die maximale Auslenkung $0{,}5$", 0),
    ("Die $4$ betrifft nur die Geschwindigkeit, nicht die Höhe", 0),
])

d.bullets("Frequenz und Periode sind Kehrwerte", [
    ("Wechselspannung mit $50$ Schwingungen je Sekunde", 0),
    ("Eine Periode dauert also $\\dfrac{1}{50}$ s, das sind $0{,}02$ s", 0),
    ("Ein Ton mit $440$ Hz: $y = A\\sin(2\\pi f t)$ mit $f = 440$", 0),
    ("Im Diagramm liest man die Periode als **Abstand zweier gleicher Punkte** ab", 0),
])

d.chapter(3, "Modelle bauen", "Von der Beschreibung zum Term")

d.bullets("Aus Höchst- und Tiefstwert", [
    ("Tageslänge schwankt zwischen $8$ h und $16$ h", 0),
    ("Mittelwert $\\dfrac{8 + 16}{2} = 12$ h — das ist $d$", 0),
    ("Amplitude $\\dfrac{16 - 8}{2} = 4$ h — das ist $a$", 0),
    ("Rezept: **Mitte** ist der Mittelwert, **Amplitude** die halbe Spanne", 0),
])

d.bullets("Ein Gezeitenmodell lesen", [
    ("$h(t) = 3\\sin\\left(\\dfrac{\\pi}{6}t\\right) + 5$ in Metern", 0),
    ("Mittellage $5$ m, Amplitude $3$ m — bei Flut also **$8$ m**", 0),
    ("Periode $= \\dfrac{2\\pi}{\\pi/6} = 12$ Stunden", 0),
    ("Das passt zur Wirklichkeit: rund zweimal Flut am Tag", 0),
])

d.two_cols("Die vier Parameter auf einen Blick", [
    ("Ändern die Höhe", 0),
    ("$a$ — Amplitude, Auslenkung", 1),
    ("$d$ — Mittellage, hebt und senkt", 1),
    ("beide lassen die Periode gleich", 1),
], [
    ("Ändern die Lage in x", 0),
    ("$b$ — Periode $= \\dfrac{2\\pi}{b}$", 1),
    ("$c$ — verschiebt nach links/rechts", 1),
    ("beide lassen die Höhe gleich", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Amplitude, Periode, Verschiebung, Modelle", 0),
    ("Eine Schwingung mit Amplitude $5$ und Periode $2\\pi$ ist $f(x) = 5\\sin x$", 0),
    ("In GeoGebra jeden Parameter einzeln ziehen und **zuschauen**", 0),
    ("**docalvers.de/mathetest11-sinus2.html**", 0),
])

d.save()
