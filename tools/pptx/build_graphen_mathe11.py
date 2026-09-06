#!/usr/bin/env python3
"""Graphen-Repertoire ohne Hilfsmittel - Mathe 11 (BGY), KW 5, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-graphen.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 5",
        "Sechs Graphen im Kopf",
        "Wer diese Verläufe kennt, sieht das Ergebnis, bevor er rechnet")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **61 bis 65 von 75**", 0),
    ("Sechs Grundfunktionen: $x$, $x^2$, $\\sqrt{x}$, $\\dfrac{1}{x}$, $a^x$, $\\sin x$", 0),
    ("Ziel: jeden **freihand skizzieren** und jeden Graphen dem Term zuordnen", 0),
    ("Blitz-Quiz am Ende: Graph und Term paaren", 0),
])

d.chapter(1, "Die Geraden und Parabeln", "Der vertraute Teil")

d.bullets("Die Ursprungsgerade", [
    ("$f(x) = x$ ist die **Winkelhalbierende** — Anstieg $1$, durch den Ursprung", 0),
    ("An ihr wird bei jeder Umkehrfunktion gespiegelt", 0),
    ("Sie schneidet $y = x^2$ in **zwei** Punkten: bei $0$ und bei $1$", 0),
    ("Definitions- und Wertebereich sind jeweils alle reellen Zahlen", 0),
])

d.bullets("Die Normalparabel", [
    ("$f(x) = x^2$ ist achsensymmetrisch zur $y$-Achse", 0),
    ("Sie **berührt** die $x$-Achse im Ursprung und liegt sonst darüber", 0),
    ("$f(x) = -x^2$ ist die Spiegelung nach unten, Scheitel bleibt im Ursprung", 0),
    ("Genau zwei Nullstellen hat dagegen etwa $f(x) = x^2 - 4$", 0),
])

d.chapter(2, "Wurzel und Hyperbel", "Die beiden mit eingeschränktem Definitionsbereich")

d.bullets("Die Wurzelfunktion", [
    ("$f(x) = \\sqrt{x}$ ist nur für **$x \\geq 0$** definiert", 0),
    ("Sie startet im Ursprung und steigt **immer flacher**", 0),
    ("$(4 \\mid 2)$ liegt auf ihrem Graphen", 0),
    ("Sie ist die Spiegelung von $x^2$ (für $x \\geq 0$) an der Geraden $y = x$", 0),
])

d.bullets("Die Hyperbel", [
    ("$f(x) = \\dfrac{1}{x}$ hat **zwei getrennte Äste**", 0),
    ("Definiert für alle $x \\neq 0$, punktsymmetrisch zum Ursprung", 0),
    ("Für sehr große $x$ nähert sich der Wert der **Null** an", 0),
    ("Sie erreicht die Achsen nie — beide sind **Asymptoten**", 0),
])

d.merksatz("Wurzel und Hyperbel sind die beiden, bei denen man den Definitionsbereich immer hinschreiben muss.")

d.chapter(3, "Exponentialkurve und Welle", "Die beiden mit dem eigenen Charakter")

d.bullets("Die Exponentialfunktion", [
    ("$f(x) = 2^x$ geht durch $(0 \\mid 1)$ und wächst **immer schneller**", 0),
    ("Wertebereich $y > 0$ — sie wird nie null und nie negativ", 0),
    ("Die $x$-Achse ist Asymptote, wird aber nie erreicht", 0),
    ("$f(x) = \\left(\\dfrac{1}{2}\\right)^x$ ist dieselbe Kurve, an der $y$-Achse gespiegelt", 0),
])

d.bullets("Die Sinuskurve", [
    ("$f(x) = \\sin x$ nimmt Werte zwischen $-1$ und $1$ an", 0),
    ("Sie **wiederholt sich** nach $2\\pi$ — als einzige der sechs", 0),
    ("Punktsymmetrisch zum Ursprung, unendlich viele Nullstellen", 0),
    ("Sie ist die einzige, die **nicht** monoton ist", 0),
])

d.two_cols("Wer wächst wie?", [
    ("Für große x", 0),
    ("$\\sqrt{x}$ — am langsamsten", 1),
    ("$x$ — gleichmäßig", 1),
    ("$x^2$ — schneller", 1),
    ("$2^x$ — überholt alle", 1),
], [
    ("Besonderheiten", 0),
    ("$\\dfrac{1}{x}$ fällt gegen null", 1),
    ("$\\sin x$ wächst gar nicht", 1),
    ("$2^x$ hat keine Nullstelle", 1),
    ("$\\sqrt{x}$ nur rechts definiert", 1),
])

d.bullets("Warum sich das Auswendigkennen lohnt", [
    ("Man **sieht** die Zahl der Lösungen, statt sie zu berechnen", 0),
    ("Man erkennt sofort, ob ein Ergebnis überhaupt sein kann", 0),
    ("In Prüfungsteilen ohne Hilfsmittel ist die Skizze oft der ganze Lösungsweg", 0),
    ("Und jede Parameteränderung nächste Woche baut darauf auf", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Graph und Term zuordnen", 0),
    ("Vorher: alle sechs einmal **ohne Vorlage** aufs Papier", 0),
    ("Zu jedem Graphen drei Dinge nennen: **Definitionsbereich, Wertebereich, Nullstellen**", 0),
    ("**docalvers.de/mathetest11-graphen.html**", 0),
])

d.save()
