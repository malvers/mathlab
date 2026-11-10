#!/usr/bin/env python3
"""Die Herleitung der pq-Formel - Mathe 11 (BGY), Lernbereich 3.

Doc, 10.11.2026: "Mach bitte ein Deck zur Herleitung", "Nach der ppt" - his own derivation in Mathe Fördern 9.pptx
(OneDrive Schule 25_26/SJ 2025-2026/MATHEMATIK/FÖRDERN JG 9, slides 43-52: (+3)(+3) = (-3)(-3) = 9, the clever
zero +6 - 6, + (p/2)^2 - (p/2)^2, then five steps Ergänzen, Zusammenfassen, Umstellen, Wurzel ziehen, Nach x
auflösen) in our deck style, with the square of his slide 14 as the picture of the missing corner
(mathe11_pq_herleitung_svg.py). Only HTML:

    python3 tools/pptx/html_deck.py build_pq_herleitung_mathe11.py

Initial only - after the first build HTML/decks/mathe11-pq-herleitung.html is the source.
"""
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck
from mathe11_pq_herleitung_svg import ergaenzung


def pq(p, q):
    """Both solutions of x^2 + px + q = 0 by the formula - every example below is checked with it."""
    d = (p / 2) ** 2 - q
    assert d >= 0
    return sorted((-p / 2 - math.sqrt(d), -p / 2 + math.sqrt(d)))


# the numbers on the slides, recomputed
assert pq(6, 5) == [-5, -1] and (6 / 2) ** 2 - 5 == 4
assert pq(-8, 7) == [1, 7] and (-8 / 2) ** 2 - 7 == 9
assert pq(2, -3) == [-3, 1] and (2 / 2) ** 2 + 3 == 4
assert pq(-2, -8) == [-2, 4]          # (x - 1)^2 = 9 is x^2 - 2x - 8 = 0

d = MathDeck("mathe11-pq-herleitung.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · LB 3",
        "Herleitung der pq-Formel",
        "Mit der quadratischen Ergänzung — Schritt für Schritt")

d.bullets("Woher kommt die pq-Formel?", [
    ("Erst eine Beobachtung: **zwei Vorzeichen** beim Wurzelziehen", 0),
    ("Dann ein Trick: eine **geschickte Null** addieren", 0),
    ("Die **quadratische Ergänzung** macht aus der linken Seite ein Quadrat", 0),
    ("In **fünf Schritten** zur Formel — und ein Beispiel als Probe", 0),
])

# ------------------------------------------------------------ 1 Vorzeichen ---
d.chapter(1, "Zwei Vorzeichen", "Warum beim Wurzelziehen ± steht")

d.bullets("Eine Zahl, zwei Wurzeln", [
    ("$(+3) \\cdot (+3) = 9$", 0),
    ("$(-3) \\cdot (-3) = 9$", 0),
    ("Also hat $x^2 = 9$ **zwei** Lösungen: $x = 3$ und $x = -3$", 0),
    ("Kurz: $x = \\pm\\sqrt{9} = \\pm 3$ — das $\\pm$ darf nie fehlen", 0),
])

d.bullets("Das geht auch mit einer ganzen Klammer", [
    ("$(x - 1)^2 = 9$: in der Klammer steht $3$ oder $-3$", 0),
    ("$x - 1 = 3$ oder $x - 1 = -3$", 0),
    ("Also $x = 4$ und $x = -2$", 0),
    ("**Quadrat = Zahl** lässt sich sofort lösen — genau da wollen wir hin", 0),
])

# ------------------------------------------------------- 2 geschickte Null ---
d.chapter(2, "Die geschickte Null", "Etwas ergänzen, ohne etwas zu ändern")

d.bullets("Null addieren ändert nichts", [
    ("$+6 - 6 = 0$", 0),
    ("$+p - p = 0$", 0),
    ("$+\\left(\\dfrac{p}{2}\\right)^2 - \\left(\\dfrac{p}{2}\\right)^2 = 0$", 0),
    ("Wir verändern nichts, wir ergänzen nur **clever** $+$ und $-$", 0),
])

svg, labels = ergaenzung()
d.figure("Die fehlende Ecke", svg, labels)

d.bullets("Die erste binomische Formel, rückwärts gelesen", [
    ("$(a + b)^2 = a^2 + 2ab + b^2$", 0),
    ("Mit $a = x$ und $b = \\dfrac{p}{2}$: "
     "$\\left(x + \\dfrac{p}{2}\\right)^2 = x^2 + px + \\left(\\dfrac{p}{2}\\right)^2$", 0),
    ("$x^2 + px$ ist also ein Quadrat, dem nur $\\left(\\dfrac{p}{2}\\right)^2$ **fehlt**", 0),
    ("Rezept: $p$ **halbieren**, **quadrieren**, ergänzen — und gleich wieder abziehen", 0),
])

# ------------------------------------------------------------- 3 Herleitung ---
d.chapter(3, "Die Herleitung", "In fünf Schritten zur pq-Formel")

d.bullets("Der Ausgangspunkt", [
    ("Die **Normalform**: $x^2 + px + q = 0$ — vor $x^2$ steht eine $1$", 0),
    ("Gesucht: $x$ allein auf einer Seite", 0),
    ("Das Problem: $x$ steht **zweimal** da, in $x^2$ und in $px$", 0),
    ("Die Idee: links ein **Quadrat** bauen — dann hilft die Wurzel", 0),
])

d.bullets("Schritt 1: Ergänzen", [
    ("$x^2 + px + q = 0$", 0),
    ("$x^2 + px + \\left(\\dfrac{p}{2}\\right)^2 - \\left(\\dfrac{p}{2}\\right)^2 + q = 0$", 0),
    ("Die geschickte Null: dieselbe Zahl **dazu und gleich wieder weg**", 0),
    ("Die Gleichung ist **dieselbe** geblieben", 0),
])

d.bullets("Schritt 2: Zusammenfassen", [
    ("Die ersten drei Terme sind ein **Quadrat**:", 0),
    ("$x^2 + px + \\left(\\dfrac{p}{2}\\right)^2 = \\left(x + \\dfrac{p}{2}\\right)^2$", 0),
    ("Damit: $\\left(x + \\dfrac{p}{2}\\right)^2 - \\left(\\dfrac{p}{2}\\right)^2 + q = 0$", 0),
    ("$x$ steht jetzt nur noch **einmal** da", 0),
])

d.bullets("Schritt 3: Umstellen", [
    ("Alles ohne $x$ nach rechts: $\\quad \\Big| + \\left(\\dfrac{p}{2}\\right)^2 - q$", 0),
    ("$\\left(x + \\dfrac{p}{2}\\right)^2 = \\left(\\dfrac{p}{2}\\right)^2 - q$", 0),
    ("Links ein Quadrat, rechts eine Zahl: **Quadrat = Zahl**", 0),
])

d.bullets("Schritt 4: Wurzel ziehen", [
    ("$x + \\dfrac{p}{2} = \\pm\\sqrt{\\left(\\dfrac{p}{2}\\right)^2 - q}$", 0),
    ("**Zwei Vorzeichen** — wie bei $(+3)^2 = (-3)^2 = 9$", 0),
    ("Das geht nur, wenn unter der Wurzel **nichts Negatives** steht", 0),
])

d.bullets("Schritt 5: Nach x auflösen", [
    ("$\\dfrac{p}{2}$ auf die andere Seite: $\\quad \\Big| - \\dfrac{p}{2}$", 0),
    ("$x_{1,2} = -\\dfrac{p}{2} \\pm \\sqrt{\\left(\\dfrac{p}{2}\\right)^2 - q}$", 0),
    ("Das ist die **pq-Formel**", 0),
])

d.bullets("Die Herleitung auf einen Blick", [
    ("**1** Ergänzen: $x^2 + px + \\left(\\tfrac{p}{2}\\right)^2 - \\left(\\tfrac{p}{2}\\right)^2 + q = 0$", 0),
    ("**2** Zusammenfassen: $\\left(x + \\tfrac{p}{2}\\right)^2 - \\left(\\tfrac{p}{2}\\right)^2 + q = 0$", 0),
    ("**3** Umstellen: $\\left(x + \\tfrac{p}{2}\\right)^2 = \\left(\\tfrac{p}{2}\\right)^2 - q$", 0),
    ("**4** Wurzel ziehen: $x + \\tfrac{p}{2} = \\pm\\sqrt{\\left(\\tfrac{p}{2}\\right)^2 - q}$", 0),
    ("**5** Nach $x$ auflösen: $x_{1,2} = -\\tfrac{p}{2} \\pm \\sqrt{\\left(\\tfrac{p}{2}\\right)^2 - q}$", 0),
])

d.merksatz("Die pq-Formel ist die quadratische Ergänzung — einmal mit Buchstaben statt mit Zahlen gerechnet.")

d.bullets("Was die Formel uns noch verrät", [
    ("Unter der Wurzel steht die **Diskriminante** $D = \\left(\\dfrac{p}{2}\\right)^2 - q$", 0),
    ("$D > 0$: **zwei** Lösungen", 0),
    ("$D = 0$: **eine** Lösung, nämlich $x = -\\dfrac{p}{2}$", 0),
    ("$D < 0$: **keine** — Schritt 4 geht nicht, denn kein Quadrat ist negativ", 0),
])

# ------------------------------------------------------------------ 4 Probe ---
d.chapter(4, "Die Probe", "Dieselben Schritte mit Zahlen")

d.bullets("Dieselben Schritte mit Zahlen", [
    ("$x^2 + 6x + 5 = 0$: die Hälfte von $6$ ist $3$, ihr Quadrat $9$", 0),
    ("Ergänzen: $x^2 + 6x + 9 - 9 + 5 = 0$", 0),
    ("Zusammenfassen und umstellen: $(x + 3)^2 = 4$", 0),
    ("Wurzel ziehen: $x + 3 = \\pm 2$, also $x = -1$ und $x = -5$", 0),
])

d.bullets("Und jetzt mit der Formel", [
    ("$p = 6$, $q = 5$", 0),
    ("$x_{1,2} = -3 \\pm \\sqrt{9 - 5} = -3 \\pm 2$", 0),
    ("Also $x = -1$ und $x = -5$ — **dasselbe Ergebnis**", 0),
    ("Vieta-Probe: $-1 + (-5) = -6 = -p$ ✓ und $(-1) \\cdot (-5) = 5 = q$ ✓", 0),
])

d.bullets("Jetzt ihr", [
    ("Löst $x^2 - 8x + 7 = 0$ **zweimal**: mit quadratischer Ergänzung und mit der Formel", 0),
    ("Lösung: $(x - 4)^2 = 9$, also $x - 4 = \\pm 3$: $x = 7$ und $x = 1$", 0),
    ("Genauso $x^2 + 2x - 3 = 0$ — Lösung: $(x + 1)^2 = 4$, also $x = 1$ und $x = -3$", 0),
    ("Wer fertig ist: die Herleitung **ohne Folie** aufschreiben. Nicht verzagen, Doc Alvers fragen!", 0),
])

d.save()
