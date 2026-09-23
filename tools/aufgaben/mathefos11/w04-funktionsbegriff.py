#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 4 / KW 37 (LB 1): Funktionsbegriff, Darstellungsformen,
Definitions- und Wertebereich. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=4, slug='funktionsbegriff', thema='Der Funktionsbegriff', lb='LB 1',
          blurb='Eindeutigkeit, Darstellungsformen, Definitions- und Wertebereich',
          comment='Blocks: Funktionsbegriff und Eindeutigkeit (1-6), Darstellungsformen und Funktionswerte (7-12), Definitions- und Wertebereich (13-20).')

# ------------------------------------------ Funktionsbegriff, Eindeutigkeit ----
Q.q(r'Was kennzeichnet eine Funktion?',
    [r'Jedem Element des Definitionsbereichs wird genau ein Funktionswert zugeordnet.',
     r'Jedem Funktionswert wird genau ein Element des Definitionsbereichs zugeordnet.',
     r'Jedem Element des Definitionsbereichs werden mehrere Funktionswerte zugeordnet.',
     r'Der Graph muss eine Gerade sein.'],
    [r'Entscheidend ist die Eindeutigkeit in einer Richtung: von $x$ nach $y$.',
     r'Zu jedem $x$ gehört genau ein $y$ — nie zwei.',
     r'Umgekehrt darf derselbe $y$-Wert mehrfach vorkommen, etwa bei $f(x) = x^2$ für $x = 2$ und $x = -2$.'])

Q.q(r'Welche Zuordnung ist KEINE Funktion?',
    [r'Jeder Zahl $x$ wird jede Zahl $y$ mit $y^2 = x$ zugeordnet.',
     r'Jeder Zahl $x$ wird $y = x^2$ zugeordnet.',
     r'Jeder Person wird ihr Geburtsdatum zugeordnet.',
     r'Jeder Zahl $x$ wird $y = 2x - 1$ zugeordnet.'],
    [r'Für $x = 4$ gäbe es dort zwei Werte: $y = 2$ und $y = -2$.',
     r'Damit ist die Eindeutigkeit verletzt.',
     r'Die anderen drei ordnen jedem Element genau einen Wert zu.'],)

Q.q(r'Wie erkennt man am Graphen, ob eine Funktion vorliegt?',
    [r'Jede Parallele zur $y$-Achse schneidet den Graphen höchstens einmal.',
     r'Jede Parallele zur $x$-Achse schneidet den Graphen höchstens einmal.',
     r'Der Graph muss zusammenhängend sein.',
     r'Der Graph muss durch den Ursprung gehen.'],
    [r'Eine Parallele zur $y$-Achse steht für ein festes $x$.',
     r'Träfe sie den Graphen zweimal, gäbe es zu diesem $x$ zwei Funktionswerte.',
     r'Das ist der sogenannte Senkrechtentest.'])

Q.q(r'Gegeben ist $f(x) = 2x + 1$. Berechne $f(3)$.',
    [r'$7$', r'$6$', r'$5$', r'$1$'],
    [r'Für $x$ wird die Zahl $3$ eingesetzt.',
     r'$f(3) = 2 \cdot 3 + 1 = 7$',
     r'$6$ wäre $2 \cdot 3$ ohne den Summanden $1$.'])

Q.q(r'Gegeben ist $f(x) = x^2$. Berechne $f(-2)$.',
    [r'$4$', r'$-4$', r'$-2$', r'$2$'],
    [r'$f(-2) = (-2)^2$',
     r'Das Quadrat einer negativen Zahl ist positiv: $4$.',
     r'$-4$ wäre $-\left(2^2\right)$ — die Klammer entscheidet.'])

Q.q(r'Für welches $x$ gilt $f(x) = 0$ bei $f(x) = 2x - 6$?',
    [r'$x = 3$', r'$x = -3$', r'$x = 6$', r'$x = -6$'],
    [r'Die Nullstelle ist die Lösung von $f(x) = 0$.',
     r'$2x - 6 = 0$ ergibt $2x = 6$, also $x = 3$.',
     r'Probe: $f(3) = 6 - 6 = 0$.'])

# ------------------------------------------- Darstellungsformen und Werte ----
Q.q(r'Welche der folgenden ist KEINE der üblichen Darstellungsformen einer Funktion?',
    [r'die Lösungsmenge einer Ungleichung', r'die Wertetabelle', r'der Funktionsterm', r'der Graph'],
    [r'Üblich sind vier Formen: verbale Beschreibung, Wertetabelle, Term und Graph.',
     r'Zwischen ihnen wechselt man je nach Fragestellung.',
     r'Eine Lösungsmenge beschreibt dagegen keine Zuordnung, sondern eine Auswahl von Zahlen.'])

Q.q(r'Die verbale Beschreibung lautet: „Verdopple die Zahl und addiere $3$.“ Wie lautet der Funktionsterm?',
    [r'$f(x) = 2x + 3$', r'$f(x) = 2(x + 3)$', r'$f(x) = x^2 + 3$', r'$f(x) = 3x + 2$'],
    [r'Verdoppeln heißt mit $2$ multiplizieren, danach wird $3$ addiert.',
     r'$f(x) = 2x + 3$',
     r'$2(x+3)$ würde erst addieren und dann verdoppeln — die Reihenfolge ändert das Ergebnis.'])

Q.q(r'Welche Beschreibung passt zu $f(x) = \dfrac{x}{2} - 4$?',
    [r'Halbiere die Zahl und ziehe $4$ ab.', r'Ziehe $4$ ab und halbiere dann.',
     r'Verdopple die Zahl und ziehe $4$ ab.', r'Halbiere die um $4$ verminderte Zahl.'],
    [r'Im Term wird zuerst geteilt, dann subtrahiert.',
     r'Also: halbieren, danach $4$ abziehen.',
     r'Probe mit $x = 10$: $5 - 4 = 1$. Die Variante „erst abziehen“ ergäbe $3$.'])

Q.q(r'In der Wertetabelle zu $f(x) = x^2 - 1$ steht ein Fehler. Welche Zuordnung ist falsch?',
    [r'$x = 3 \mapsto 9$', r'$x = 0 \mapsto -1$', r'$x = 2 \mapsto 3$', r'$x = -1 \mapsto 0$'],
    [r'$f(3) = 9 - 1 = 8$, nicht $9$.',
     r'Die anderen stimmen: $f(0) = -1$, $f(2) = 3$, $f(-1) = 0$.',
     r'Beim Aufstellen einer Wertetabelle wird der Subtraktionsteil leicht vergessen.'])

Q.q(r'Der Graph einer Funktion verläuft durch $P(0|2)$ und $Q(2|6)$ und ist eine Gerade. Wie lautet der Term?',
    [r'$f(x) = 2x + 2$', r'$f(x) = 3x$', r'$f(x) = x + 2$', r'$f(x) = 2x + 6$'],
    [r'Der $y$-Achsenabschnitt ist $2$, denn der Graph schneidet die $y$-Achse bei $P(0|2)$.',
     r'Anstieg: $m = \dfrac{6-2}{2-0} = 2$.',
     r'$f(x) = 2x + 2$. Probe: $f(2) = 6$.'])

Q.q(r'Gegeben ist $f(x) = 3x - 5$. Für welches $x$ gilt $f(x) = 7$?',
    [r'$x = 4$', r'$x = 16$', r'$x = 2$', r'$x = \dfrac{7}{3}$'],
    [r'Gleichung aufstellen: $3x - 5 = 7$.',
     r'$3x = 12$, also $x = 4$.',
     r'Probe: $f(4) = 12 - 5 = 7$.'])

# -------------------------------------- Definitions- und Wertebereich ----
Q.q(r'Wie lautet der größtmögliche Definitionsbereich von $f(x) = \dfrac{1}{x - 2}$?',
    [r'$D = \mathbb{R} \setminus \{2\}$', r'$D = \mathbb{R} \setminus \{-2\}$',
     r'$D = \mathbb{R}$', r'$D = \{x \in \mathbb{R} \mid x > 2\}$'],
    [r'Der Nenner darf nicht null werden: $x - 2 \neq 0$.',
     r'Also ist $x = 2$ ausgeschlossen.',
     r'Alle anderen reellen Zahlen sind erlaubt.'])

Q.q(r'Wie lautet der größtmögliche Definitionsbereich von $f(x) = \sqrt{x - 3}$?',
    [r'$D = \{x \in \mathbb{R} \mid x \geq 3\}$', r'$D = \{x \in \mathbb{R} \mid x > 3\}$',
     r'$D = \{x \in \mathbb{R} \mid x \geq -3\}$', r'$D = \mathbb{R}$'],
    [r'Unter der Wurzel darf im Reellen nichts Negatives stehen: $x - 3 \geq 0$.',
     r'Also $x \geq 3$.',
     r'Die $3$ selbst gehört dazu, denn $\sqrt{0} = 0$ ist definiert.'])

Q.q(r'Wie lautet der Wertebereich von $f(x) = x^2$ mit $D = \mathbb{R}$?',
    [r'$W = \{y \in \mathbb{R} \mid y \geq 0\}$', r'$W = \mathbb{R}$',
     r'$W = \{y \in \mathbb{R} \mid y > 0\}$', r'$W = \{y \in \mathbb{R} \mid y \leq 0\}$'],
    [r'Ein Quadrat ist nie negativ.',
     r'Der kleinste Wert ist $0$, er wird bei $x = 0$ angenommen.',
     r'Nach oben ist der Wertebereich unbegrenzt.'])

Q.q(r'Wie lautet der Wertebereich von $f(x) = x^2 + 2$ mit $D = \mathbb{R}$?',
    [r'$W = \{y \in \mathbb{R} \mid y \geq 2\}$', r'$W = \{y \in \mathbb{R} \mid y \geq 0\}$',
     r'$W = \mathbb{R}$', r'$W = \{y \in \mathbb{R} \mid y > 2\}$'],
    [r'Der Graph ist die um $2$ nach oben verschobene Normalparabel.',
     r'Der kleinste Wert ist der Scheitelwert $f(0) = 2$.',
     r'Er wird auch angenommen, deshalb steht dort $\geq$ und nicht $>$.'])

Q.q(r'Wie lautet der Wertebereich von $f(x) = -x^2 + 4$ mit $D = \mathbb{R}$?',
    [r'$W = \{y \in \mathbb{R} \mid y \leq 4\}$', r'$W = \{y \in \mathbb{R} \mid y \geq 4\}$',
     r'$W = \{y \in \mathbb{R} \mid y \leq 0\}$', r'$W = \mathbb{R}$'],
    [r'Das Minus vor dem Quadrat spiegelt die Parabel, sie ist nach unten geöffnet.',
     r'Der größte Wert ist der Scheitelwert $f(0) = 4$.',
     r'Nach unten ist sie unbegrenzt, also $y \leq 4$.'])

Q.q(r'Wie lautet der größtmögliche Definitionsbereich von $f(x) = \dfrac{1}{\sqrt{x}}$?',
    [r'$D = \{x \in \mathbb{R} \mid x > 0\}$', r'$D = \{x \in \mathbb{R} \mid x \geq 0\}$',
     r'$D = \mathbb{R} \setminus \{0\}$', r'$D = \mathbb{R}$'],
    [r'Zwei Bedingungen treffen zusammen: unter der Wurzel darf nichts Negatives stehen, und der Nenner darf nicht null sein.',
     r'$x \geq 0$ und $\sqrt{x} \neq 0$, also $x \neq 0$.',
     r'Übrig bleibt $x > 0$.'])

Q.q(r'Ein Betrieb stellt bis zu $500$ Stück her, die Kosten betragen $K(x) = 4x + 1000$. Welcher Definitionsbereich ist im Sachzusammenhang sinnvoll?',
    [r'$D = \{x \in \mathbb{N} \mid 0 \leq x \leq 500\}$', r'$D = \mathbb{R}$',
     r'$D = \{x \in \mathbb{R} \mid x \geq 0\}$', r'$D = \{x \in \mathbb{N} \mid x \geq 1000\}$'],
    [r'Stückzahlen sind nicht negativ und in der Regel ganzzahlig.',
     r'Die Kapazität begrenzt sie nach oben auf $500$.',
     r'Der Sachzusammenhang schränkt den mathematisch möglichen Definitionsbereich also ein.'])

Q.q(r'Welchen Wertebereich hat die Kostenfunktion $K(x) = 4x + 1000$ auf $D = \{x \in \mathbb{N} \mid 0 \leq x \leq 500\}$?',
    [r'alle Werte von $1000$ bis $3000$, die sich als $4x + 1000$ mit ganzzahligem $x$ ergeben',
     r'alle reellen Zahlen von $1000$ bis $3000$',
     r'alle reellen Zahlen ab $1000$',
     r'alle Werte von $0$ bis $3000$'],
    [r'Die Funktion steigt, also liegt der kleinste Wert bei $x = 0$ und der größte bei $x = 500$.',
     r'$K(0) = 1000$ und $K(500) = 2000 + 1000 = 3000$.',
     r'Weil nur ganzzahlige Stückzahlen vorkommen, sind es einzelne Werte im Abstand von $4$, nicht alle Zahlen dazwischen.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x = sp.Symbol('x')
    f1 = 2 * x + 1
    assert f1.subs(x, 3) == 7 and 2 * 3 == 6
    assert (x ** 2).subs(x, -2) == 4 and -(2 ** 2) == -4
    assert sp.solve(2 * x - 6, x) == [3] and (2 * x - 6).subs(x, 3) == 0
    # y^2 = x ist keine Funktion: zu x = 4 gehoeren zwei Werte
    assert sorted(sp.solve(sp.Eq(sp.Symbol('y') ** 2, 4), sp.Symbol('y')), key=str) == [-2, 2]
    # Darstellungsformen
    assert (2 * x + 3).subs(x, 5) == 13 and (2 * (x + 3)).subs(x, 5) == 16
    assert (x / 2 - 4).subs(x, 10) == 1 and ((x - 4) / 2).subs(x, 10) == 3
    g = x ** 2 - 1
    assert g.subs(x, 3) == 8 and g.subs(x, 0) == -1 and g.subs(x, 2) == 3 and g.subs(x, -1) == 0
    assert F(6 - 2, 2 - 0) == 2 and (2 * x + 2).subs(x, 0) == 2 and (2 * x + 2).subs(x, 2) == 6
    assert sp.solve(sp.Eq(3 * x - 5, 7), x) == [4] and (3 * x - 5).subs(x, 4) == 7
    assert F(7, 3) != 4
    # Definitions- und Wertebereich
    assert sp.solve(x - 2, x) == [2]
    assert sp.solve(x - 3, x) == [3] and sp.sqrt(0) == 0
    assert sp.Min(*[(x ** 2).subs(x, v) for v in (-3, 0, 3)]) == 0
    assert (x ** 2 + 2).subs(x, 0) == 2 and all((x ** 2 + 2).subs(x, v) >= 2 for v in (-3, -1, 0, 1, 3))
    assert (-x ** 2 + 4).subs(x, 0) == 4 and all((-x ** 2 + 4).subs(x, v) <= 4 for v in (-3, -1, 0, 1, 3))
    # Kostenfunktion
    K = lambda v: 4 * v + 1000
    assert K(0) == 1000 and K(500) == 3000 and K(1) - K(0) == 4


Q.verify(check)
Q.save()
