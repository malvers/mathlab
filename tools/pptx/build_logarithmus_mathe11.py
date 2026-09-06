#!/usr/bin/env python3
"""Logarithmus - Mathe 11 (BGY), KW 2, LB 3."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from omml import MathDeck

d = MathDeck("mathe11-logarithmus.pptx")

d.title("Mathematik · Berufliches Gymnasium 11 · KW 2",
        "Der Logarithmus",
        "Die Umkehrung der Exponentialfunktion — und die Frage nach dem Exponenten")

d.bullets("Der Fahrplan dieser Woche", [
    ("Lernbereich 3 — Stunden **51 bis 55 von 75**", 0),
    ("Drei Blöcke: **Begriff**, **Rechengesetze**, **Graph und Anwendungen**", 0),
    ("Der Logarithmus beantwortet immer dieselbe Frage: **welcher Exponent?**", 0),
    ("Am Rand: die natürliche Basis $e$ und $\\ln$", 0),
])

d.chapter(1, "Der Begriff", "Die Frage nach dem Exponenten")

d.bullets("Was dasteht, wenn man es vorliest", [
    ("$\\log_2 8 = 3$ heißt: **$2$ hoch $3$ ergibt $8$**", 0),
    ("Der Logarithmus ist also der gesuchte **Exponent**", 0),
    ("$\\log_{10} 1000 = 3$, denn $10^3 = 1000$", 0),
    ("$\\log_2 32 = 5$, denn $2^5 = 32$", 0),
])

d.bullets("Zwei Werte, die immer gelten", [
    ("$\\log_a 1 = 0$ für jede Basis — denn $a^0 = 1$", 0),
    ("Also ist $\\log_5 1 = 0$", 0),
    ("$\\log_a a = 1$, denn $a^1 = a$", 0),
    ("Und $10^{\\log_{10} 7} = 7$ — Potenz und Logarithmus heben sich auf", 0),
])

d.bullets("Auch negative Exponenten kommen vor", [
    ("$\\log_3 \\dfrac{1}{9} = -2$, denn $3^{-2} = \\dfrac{1}{9}$", 0),
    ("Der **Wert** des Logarithmus darf negativ sein", 0),
    ("Das **Argument** darf es nicht: $\\log_2(-4)$ ist nicht definiert", 0),
    ("Denn keine Potenz von $2$ wird jemals negativ", 0),
])

d.merksatz("Der Logarithmus ist die Antwort auf die Frage: mit welchem Exponenten komme ich dorthin?")

d.chapter(2, "Die Rechengesetze", "Aus Mal wird Plus")

d.bullets("Die drei Gesetze", [
    ("$\\log_a(x \\cdot y) = \\log_a x + \\log_a y$", 0),
    ("$\\log_a\\left(\\dfrac{x}{y}\\right) = \\log_a x - \\log_a y$", 0),
    ("$\\log_a(x^n) = n \\cdot \\log_a x$", 0),
    ("Der Logarithmus macht aus **Multiplikation Addition** — das ist sein Kern", 0),
])

d.bullets("Anwenden", [
    ("$\\log_3 9 + \\log_3 3 = \\log_3 27 = 3$", 0),
    ("Oder direkt: $2 + 1 = 3$ — beide Wege führen zum selben", 0),
    ("Das dritte Gesetz holt den Exponenten **nach vorn**", 0),
    ("Genau damit lösen wir nächste Woche Exponentialgleichungen", 0),
])

d.bullets("Basiswechsel für den Taschenrechner", [
    ("Viele Rechner kennen nur $\\log$ (Basis $10$) und $\\ln$", 0),
    ("$\\log_2 10 = \\dfrac{\\log 10}{\\log 2} \\approx 3{,}32$", 0),
    ("Allgemein $\\log_a b = \\dfrac{\\log b}{\\log a}$ — die Basis kürzt sich heraus", 0),
    ("$\\ln$ ist der Logarithmus zur Basis $e \\approx 2{,}718$", 0),
])

d.chapter(3, "Graph und Anwendungen", "Warum logarithmische Skalen so nützlich sind")

d.bullets("Der Graph der Logarithmusfunktion", [
    ("$f(x) = \\log_2 x$ ist nur für **$x > 0$** definiert", 0),
    ("Die Nullstelle liegt bei $x = 1$ — bei jeder Basis", 0),
    ("Der Graph steigt, wird aber **immer flacher**", 0),
    ("Er ist die Spiegelung von $f(x) = 2^x$ an der Geraden $y = x$", 0),
])

d.two_cols("Umkehrfunktionen im Vergleich", [
    ("$f(x) = 2^x$", 0),
    ("$D$: alle reellen Zahlen", 1),
    ("$W$: $y > 0$", 1),
    ("wächst immer schneller", 1),
    ("keine Nullstelle", 1),
], [
    ("$g(x) = \\log_2 x$", 0),
    ("$D$: $x > 0$", 1),
    ("$W$: alle reellen Zahlen", 1),
    ("wächst immer langsamer", 1),
    ("Nullstelle bei $x = 1$", 1),
])

d.bullets("Wo Logarithmen im Alltag stecken", [
    ("Die **Richterskala** ist ein Zehnerlogarithmus", 0),
    ("Stärke $6$ gegenüber Stärke $4$ heißt **hundertfache** Amplitude", 0),
    ("Ebenso Dezibel bei Lautstärke und der pH-Wert in der Chemie", 0),
    ("Überall dort, wo Werte über **viele Größenordnungen** streuen", 0),
])

d.bullets("Logarithmische Achsen im Diagramm", [
    ("Sie machen sehr kleine und sehr große Werte **gleichzeitig sichtbar**", 0),
    ("Exponentielles Wachstum wird darin zu einer **Geraden**", 0),
    ("Genau daran erkennt man es in Corona- oder Finanzgrafiken", 0),
    ("Vorsicht beim Lesen: gleiche Abstände bedeuten gleiche **Faktoren**", 0),
])

d.bullets("Jetzt ihr", [
    ("**20 Aufgaben** im Mathe-Labor — Werte, Gesetze, Graph, Skalen", 0),
    ("Bei jedem Logarithmus laut mitdenken: **welcher Exponent?**", 0),
    ("Nächste Woche lösen wir damit Gleichungen der Form $a^x = b$", 0),
    ("**docalvers.de/mathetest11-logarithmus.html**", 0),
])

d.save()
