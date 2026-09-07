#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 47: quadratische Gleichungen ohne Hilfsmittel, pq-Formel, Vieta.
Deck: tools/pptx/build_quadratische_gleichungen_mathe11.py - Quiz: HTML/mathetest11-quadratische-gleichungen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-quadratische-gleichungen", "Quadratische Gleichungen", kw=47)

# ---------------------------------------------------------------- AFB I ----
s.task("Das Grundstück am Weg", 1,
       r"Ein rechteckiges Grundstück ist $3$ m länger als breit und hat eine Fläche von $130\ \mathrm{m^2}$. Die Breite heißt $b$. Gerechnet wird ohne Hilfsmittel.",
       [r"Stelle eine Gleichung für $b$ auf und bringe sie in die Normalform $b^2 + pb + q = 0$.",
        r"Löse die Gleichung mit der pq-Formel.",
        r"Welche der beiden Lösungen kommt in Frage? Gib die Maße an und mache die Probe.",
        r"Prüfe deine beiden rechnerischen Lösungen mit dem Satz von Vieta."],
       solution=[
        r"Bei Breite $b$ ist die Länge $b + 3$. Die Fläche: $b(b + 3) = 130$, also $b^2 + 3b = 130$ und in Normalform $b^2 + 3b - 130 = 0$. Damit ist $p = 3$ und $q = -130$.",
        r"$b_{1,2} = -\dfrac{3}{2} \pm \sqrt{\dfrac{9}{4} + 130} = -1{,}5 \pm \sqrt{132{,}25} = -1{,}5 \pm 11{,}5$. Also $b_1 = 10$ und $b_2 = -13$.",
        r"Eine Breite kann nicht negativ sein, also $b = 10$ m und die Länge $13$ m. Probe: $10 \cdot 13 = 130\ \mathrm{m^2}$ und $13 - 10 = 3$ m — beides stimmt.",
        r"Vieta: die Summe der Lösungen muss $-p = -3$ sein, das Produkt $q = -130$. Nachrechnen: $10 + (-13) = -3$ und $10 \cdot (-13) = -130$. Beide Bedingungen sind erfüllt, die Lösungen sind also richtig — und diese Probe geht schneller als das Einsetzen."],
       falle=r"Unter der Wurzel steht $\dfrac{p^2}{4} - q$, hier also $\dfrac{9}{4} - (-130) = 132{,}25$. Wer das Minuszeichen von $q$ übersieht, rechnet mit $\dfrac{9}{4} - 130$ und landet unter einer negativen Wurzel.")

# --------------------------------------------------------------- AFB II ----
s.task("Vier Gleichungen, vier Wege", 2,
       r"Bei der Planung eines Sportfests entstehen vier Gleichungen. Jede lässt sich lösen, aber nicht jede braucht die pq-Formel: $x^2 - 7x = 0$, $2x^2 - 50 = 0$, $x^2 - 10x + 21 = 0$ und $x^2 - 6x + 10 = 0$.",
       [r"Löse die ersten drei Gleichungen jeweils auf dem kürzesten Weg und begründe deine Wahl.",
        r"Alle $x$ stehen für Längen in Metern. Welche Lösungen sind sachlich brauchbar?",
        r"Untersuche die vierte Gleichung mit der Diskriminante. Was bedeutet das Ergebnis für die Planung?",
        r"Stelle mit dem Satz von Vieta eine quadratische Gleichung auf, deren Lösungen $4$ und $9$ sind."],
       solution=[
        r"$x^2 - 7x = 0$: kein absolutes Glied, also **ausklammern**: $x(x - 7) = 0$ und damit $x = 0$ oder $x = 7$. $2x^2 - 50 = 0$: kein $x$-Glied, also **nach $x^2$ auflösen**: $x^2 = 25$ und damit $x = 5$ oder $x = -5$. $x^2 - 10x + 21 = 0$: hier hilft nur die pq-Formel, $x_{1,2} = 5 \pm \sqrt{25 - 21} = 5 \pm 2$, also $x = 7$ oder $x = 3$.",
        r"Brauchbar sind nur positive Längen: $7$ m aus der ersten, $5$ m aus der zweiten, $3$ m und $7$ m aus der dritten Gleichung. Die Lösung $x = 0$ beschreibt eine Strecke ohne Ausdehnung, $x = -5$ eine negative Länge — beide fallen weg, obwohl sie rechnerisch richtig sind.",
        r"Diskriminante: $D = \dfrac{p^2}{4} - q = 9 - 10 = -1$. Sie ist negativ, unter der Wurzel stünde eine negative Zahl — die Gleichung hat **keine** reelle Lösung. Für die Planung heißt das: die dort geforderte Kombination aus Maßen ist gar nicht herstellbar, es muss eine Vorgabe geändert werden.",
        r"Nach Vieta gilt $x_1 + x_2 = -p$ und $x_1 \cdot x_2 = q$. Aus $4 + 9 = 13$ folgt $p = -13$, aus $4 \cdot 9 = 36$ folgt $q = 36$. Die Gleichung lautet $x^2 - 13x + 36 = 0$. Probe mit der pq-Formel: $6{,}5 \pm \sqrt{42{,}25 - 36} = 6{,}5 \pm 2{,}5$, also $9$ und $4$."],
       falle=r"$x^2 - 7x = 0$ **nicht** durch $x$ teilen — dabei geht $x = 0$ verloren. Ausklammern behält beide Lösungen, und ein Produkt ist genau dann null, wenn ein Faktor null ist.")

# -------------------------------------------------------------- AFB III ----
s.task("Immer zwei Lösungen?", 3,
       r"Eine Mitschülerin behauptet: **„Eine quadratische Gleichung hat immer zwei Lösungen — deshalb heißt sie ja quadratisch.“**",
       [r"Prüfe die Behauptung an $x^2 - 5x + 6 = 0$, an $x^2 - 6x + 9 = 0$ und an $x^2 + 4 = 0$.",
        r"Welche Größe entscheidet über die Anzahl der Lösungen? Gib die drei Fälle an.",
        r"Ein Mitschüler wendet die pq-Formel direkt auf $2x^2 + 6x - 8 = 0$ an und setzt $p = 6$, $q = -8$. Rechne sein Ergebnis aus, mache die Probe und finde den Fehler.",
        r"Beurteile die Behauptung und formuliere, was man **vor** dem Anwenden der pq-Formel immer prüfen muss."],
       solution=[
        r"$x^2 - 5x + 6 = 0$: $x_{1,2} = 2{,}5 \pm \sqrt{6{,}25 - 6} = 2{,}5 \pm 0{,}5$, also $x = 3$ und $x = 2$ — **zwei** Lösungen. $x^2 - 6x + 9 = 0$: $x_{1,2} = 3 \pm \sqrt{9 - 9} = 3$ — nur **eine** Lösung, denn $x^2 - 6x + 9 = (x - 3)^2$. $x^2 + 4 = 0$: $x^2 = -4$, kein Quadrat einer reellen Zahl ist negativ — **keine** Lösung.",
        r"Die Diskriminante $D = \dfrac{p^2}{4} - q$: bei $D > 0$ gibt es zwei Lösungen, bei $D = 0$ genau eine (der Scheitel berührt die $x$-Achse), bei $D < 0$ keine reelle Lösung. In den drei Beispielen ist $D = 0{,}25$, $D = 0$ und $D = -4$.",
        r"Mit $p = 6$ und $q = -8$ ergäbe sich $x_{1,2} = -3 \pm \sqrt{9 + 8} = -3 \pm \sqrt{17}$, also etwa $1{,}123$ und $-7{,}123$. Probe mit $x \approx 1{,}1231$: $2 \cdot 1{,}1231^2 + 6 \cdot 1{,}1231 - 8 \approx 1{,}26 \neq 0$ — falsch. Der Fehler: die pq-Formel gilt nur für die **Normalform** mit Vorfaktor $1$. Erst durch $2$ teilen: $x^2 + 3x - 4 = 0$, dann $x_{1,2} = -1{,}5 \pm \sqrt{2{,}25 + 4} = -1{,}5 \pm 2{,}5$, also $x = 1$ und $x = -4$. Probe: $2 + 6 - 8 = 0$ und $32 - 24 - 8 = 0$.",
        r"Die Behauptung ist falsch: es können zwei, eine oder keine Lösung sein — die Diskriminante entscheidet. Vor der pq-Formel prüft man immer zweierlei: steht alles auf **einer** Seite, sodass rechts null steht, und ist der Vorfaktor von $x^2$ wirklich $1$? Und oft lohnt der Blick, ob Ausklammern oder Wurzelziehen schneller geht."],
       falle=r"Ein doppelter Lösungswert ist keine „halbe“ Lösung: bei $D = 0$ berührt die Parabel die $x$-Achse genau im Scheitel. Am Graphen sieht man sofort, welcher der drei Fälle vorliegt.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    import sympy as sp
    x = sp.symbols("x")
    # plot
    assert sp.solve(x ** 2 + 3 * x - 130, x) == [-13, 10]
    assert F(9, 4) + 130 == F(529, 4) and math.sqrt(132.25) == 11.5
    assert 10 * 13 == 130 and 13 - 10 == 3
    assert 10 + (-13) == -3 and 10 * (-13) == -130
    # four equations
    assert sp.solve(x ** 2 - 7 * x, x) == [0, 7]
    assert sp.solve(2 * x ** 2 - 50, x) == [-5, 5]
    assert sp.solve(x ** 2 - 10 * x + 21, x) == [3, 7]
    assert 25 - 21 == 4 and math.sqrt(4) == 2
    assert sp.solve(x ** 2 - 6 * x + 10, x) == [3 - sp.I, 3 + sp.I]
    assert F(36, 4) - 10 == -1
    assert 4 + 9 == 13 and 4 * 9 == 36 and sp.solve(x ** 2 - 13 * x + 36, x) == [4, 9]
    assert F(169, 4) - 36 == F(25, 4) and math.sqrt(42.25) == 6.5
    # how many solutions
    assert sp.solve(x ** 2 - 5 * x + 6, x) == [2, 3] and F(25, 4) - 6 == F(1, 4)
    assert sp.solve(x ** 2 - 6 * x + 9, x) == [3] and F(36, 4) - 9 == 0
    assert sp.expand((x - 3) ** 2) == x ** 2 - 6 * x + 9
    assert sp.solve(x ** 2 + 4, x) == [-2 * sp.I, 2 * sp.I]
    # the un-normalised pq blunder
    wrong = -3 + math.sqrt(17)
    assert abs(wrong - 1.1231) < 1e-4 and abs(-3 - math.sqrt(17) + 7.1231) < 1e-4
    assert abs(2 * wrong ** 2 + 6 * wrong - 8 - 1.2614) < 1e-3
    assert sp.solve(2 * x ** 2 + 6 * x - 8, x) == [-4, 1]
    assert 2 * 1 + 6 * 1 - 8 == 0 and 2 * 16 - 24 - 8 == 0
    assert F(9, 4) + 4 == F(25, 4) and math.sqrt(6.25) == 2.5


s.verify(check)
s.save()
