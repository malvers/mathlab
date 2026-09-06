#!/usr/bin/env python3
"""Quadratische Funktionen und beschleunigte Bewegung - Mathe 11 (BGY), KW 46, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-quadratisch.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 46",
        "Quadratische Funktionen",
        "Scheitelpunkt, Normalform — und warum ein fallender Stein keine Gerade beschreibt")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **16 bis 20 von 75**", 0),
    ("Drei Blöcke: **Scheitelpunktform**, **Normalform**, **beschleunigte Bewegung**", 0),
    ("Der Physikbezug ist kein Beiwerk: $s(t) = \\dfrac{a}{2}\\,t^2$ **ist** eine Parabel", 0),
    ("Am Ende **20 Aufgaben** — Scheitel ablesen, umformen, Wurf und freier Fall", 0),
])

d.chapter(1, "Die Scheitelpunktform", "Alles Wichtige steht schon da")

d.bullets("Ablesen statt rechnen", [
    ("$f(x) = (x - d)^2 + e$ hat den Scheitel $S(d \\mid e)$", 0),
    ("$f(x) = (x - 3)^2 + 2$ also $S(3 \\mid 2)$ — **Vorzeichen umdrehen** bei $d$", 0),
    ("$f(x) = (x + 4)^2 - 1$ gibt $S(-4 \\mid -1)$", 0),
    ("Die Symmetrieachse ist immer $x = d$, bei $(x - 5)^2$ also $x = 5$", 0),
])

d.bullets("Was der Faktor vor dem Quadrat macht", [
    ("$f(x) = 3x^2$ ist gegenüber der Normalparabel **gestreckt**, also schmaler", 0),
    ("Ein Faktor zwischen $0$ und $1$ staucht sie, macht sie also breiter", 0),
    ("Ein **negativer** Faktor öffnet nach unten: $f(x) = -2x^2 + 5$", 0),
    ("Bei nach unten geöffneten Parabeln ist der Scheitel der **höchste** Punkt", 0),
])

d.bullets("Von der Scheitelform zur Normalform", [
    ("$f(x) = (x - 2)^2 - 5$ ausmultiplizieren", 0),
    ("$(x - 2)^2 = x^2 - 4x + 4$, also $f(x) = x^2 - 4x - 1$", 0),
    ("Der $y$-Achsenabschnitt ist immer das **absolute Glied**", 0),
    ("Bei $f(x) = x^2 - 4x + 3$ also der Punkt $(0 \\mid 3)$", 0),
])

d.bullets("Zurück: quadratische Ergänzung", [
    ("$f(x) = x^2 - 6x + 11$ — die Hälfte von $-6$ ist $-3$", 0),
    ("$x^2 - 6x = (x - 3)^2 - 9$, also $f(x) = (x - 3)^2 + 2$", 0),
    ("Damit ist der Scheitel $S(3 \\mid 2)$ abgelesen", 0),
    ("Rezept: **halbieren, quadrieren, wieder abziehen**", 0),
])

d.merksatz("Die Scheitelpunktform verrät den Scheitel, die Normalform den y-Achsenabschnitt. Beide beschreiben dieselbe Parabel.")

d.chapter(2, "Nullstellen und Verlauf", "Wie viele Schnittpunkte kann es geben?")

d.bullets("Nullstellen ablesen und zählen", [
    ("$f(x) = x^2 - 9$ hat die Nullstellen $x = 3$ und $x = -3$", 0),
    ("Eine Parabel hat **zwei, eine oder keine** Nullstelle", 0),
    ("Zwei, wenn sie die Achse schneidet, eine, wenn sie sie berührt", 0),
    ("Keine, wenn sie ganz oberhalb oder ganz unterhalb verläuft", 0),
])

d.bullets("Verschieben statt neu zeichnen", [
    ("$f(x) = x^2 + 3$ ist die Normalparabel, um $3$ **nach oben** geschoben", 0),
    ("Ihr Scheitel liegt bei $(0 \\mid 3)$, Nullstellen hat sie keine", 0),
    ("$(x - 5)^2$ ist um $5$ **nach rechts** geschoben", 0),
    ("Im Term steht $-5$, verschoben wird nach $+5$ — die klassische Falle", 0),
])

d.chapter(3, "Beschleunigte Bewegung", "Wo diese Parabeln in der Wirklichkeit vorkommen")

d.bullets("Der freie Fall", [
    ("$s(t) = \\dfrac{g}{2}\\,t^2$ mit $g \\approx 10$ m/s²", 0),
    ("Nach $3$ s also $s = 5 \\cdot 9 = 45$ m", 0),
    ("Die Geschwindigkeit wächst dagegen **linear**: $v = g\\,t = 30$ m/s", 0),
    ("Weg quadratisch, Geschwindigkeit linear — das ist der Kern", 0),
])

d.bullets("Doppelte Zeit, vierfacher Weg", [
    ("Verdoppelt man die Fallzeit, wird der Weg **viermal** so lang", 0),
    ("Denn $t$ steht im Quadrat: $(2t)^2 = 4t^2$", 0),
    ("Deshalb ist $s(t)$ **keine** gleichmäßige Zunahme", 0),
    ("Ein Auto mit $a = 4$ m/s² fährt in $5$ s: $s = 2 \\cdot 25 = 50$ m", 0),
])

d.bullets("Der Wurf: nach unten geöffnete Parabel", [
    ("$h(t) = -5t^2 + 20t$ in Metern", 0),
    ("Am Boden ist $h = 0$: $t(-5t + 20) = 0$, also $t = 0$ und $t = 4$ s", 0),
    ("Der Scheitel liegt in der Mitte zwischen den Nullstellen, bei $t = 2$ s", 0),
    ("Maximale Höhe $h(2) = -20 + 40 = 20$ m", 0),
])

d.two_cols("Zwei Bewegungen im Vergleich", [
    ("Gleichförmig", 0),
    ("$s(t) = v \\cdot t$", 1),
    ("Graph ist eine Gerade", 1),
    ("doppelte Zeit, doppelter Weg", 1),
], [
    ("Gleichmäßig beschleunigt", 0),
    ("$s(t) = \\dfrac{a}{2}\\,t^2$", 1),
    ("Graph ist eine Parabel", 1),
    ("doppelte Zeit, vierfacher Weg", 1),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Scheitel, Normalform, Fall und Wurf", 0),
    ("Umstellen nicht vergessen: $s = \\dfrac{a}{2}t^2$ nach $a$ gibt "
     "$a = \\dfrac{2s}{t^2}$", 0),
    ("Bei Sachaufgaben immer fragen: **nach oben oder nach unten geöffnet?**", 0),
    ("**docalvers.de/mathetest11-quadratisch.html**", 0),
])

d.save()
