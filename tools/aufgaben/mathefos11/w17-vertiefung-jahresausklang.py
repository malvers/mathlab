#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 17 / KW 52: Vertiefung quadratischer Funktionen und
Mathe-Raetsel zum Jahresausklang (kurze Woche, nur Mo und Di).
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=17, slug='vertiefung-jahresausklang', thema='Vertiefung und Mathe-Rätsel', lb='Übung',
          blurb='quadratische Funktionen wiederholen, dazu zehn Knobeleien',
          comment='Blocks: Vertiefung quadratische Funktionen (1-10), Mathe-Raetsel zum Jahresausklang (11-20).')

# --------------------------------------- Vertiefung quadratische Funktionen ----
Q.q(r'Wo liegt der Scheitelpunkt von $y = (x + 1)^2 - 3$?',
    [r'in $(-1|-3)$', r'in $(1|-3)$', r'in $(-1|3)$', r'in $(-3|-1)$'],
    [r'$(x+1)$ bedeutet $x_S = -1$.',
     r'Der Summand $-3$ ist der Scheitelwert.',
     r'Probe: $y(-1) = 0 - 3 = -3$.'])

Q.q(r'Löse: $x^2 = 25$.',
    [r'$x = 5$ und $x = -5$', r'nur $x = 5$', r'$x = 12{,}5$', r'$x = 625$'],
    [r'Beide Vorzeichen kommen in Frage.',
     r'$x = \pm 5$',
     r'Probe: $(-5)^2 = 25$.'])

Q.q(r'Löse: $x^2 - 4x = 0$.',
    [r'$x = 0$ und $x = 4$', r'nur $x = 4$', r'$x = 0$ und $x = -4$', r'$x = 2$ und $x = -2$'],
    [r'$x$ ausklammern: $x\,(x - 4) = 0$.',
     r'$x = 0$ oder $x = 4$.',
     r'Teilen durch $x$ würde die Lösung $x = 0$ verschlucken.'])

Q.q(r'Löse: $x^2 - x - 6 = 0$.',
    [r'$x = 3$ und $x = -2$', r'$x = -3$ und $x = 2$', r'$x = 6$ und $x = -1$', r'$x = 1$ und $x = 6$'],
    [r'Vieta: Summe $1$, Produkt $-6$.',
     r'Das sind $3$ und $-2$.',
     r'Probe: $9 - 3 - 6 = 0$.'])

Q.q(r'Wie lauten die Nullstellen von $y = x^2 - 4$?',
    [r'$x = 2$ und $x = -2$', r'$x = 4$ und $x = -4$', r'nur $x = 2$', r'keine'],
    [r'$x^2 - 4 = 0$, also $x^2 = 4$.',
     r'$x = \pm 2$',
     r'Über die dritte binomische Formel: $(x+2)(x-2) = 0$.'])

Q.q(r'Wie verläuft der Graph von $y = -2x^2 + 1$?',
    [r'nach unten geöffnet, gestreckt, Scheitel in $(0|1)$',
     r'nach oben geöffnet, Scheitel in $(0|1)$',
     r'nach unten geöffnet, Scheitel in $(0|-1)$',
     r'nach unten geöffnet, gestaucht, Scheitel in $(1|0)$'],
    [r'$a = -2$: das Minus öffnet nach unten, der Betrag $2$ streckt.',
     r'Die $+1$ verschiebt um eine Einheit nach oben.',
     r'Scheitel $(0|1)$, und das ist der größte Funktionswert.'])

Q.q(r'Wo schneidet $y = x^2 + 2x - 3$ die $y$-Achse?',
    [r'in $(0|-3)$', r'in $(0|3)$', r'in $(-3|0)$', r'in $(0|2)$'],
    [r'Bei $x = 0$ bleibt nur das Absolutglied stehen.',
     r'$y(0) = -3$',
     r'$(-3|0)$ wäre dagegen ein Punkt auf der $x$-Achse.'])

Q.q(r'Wo liegt der Scheitelpunkt von $y = x^2 + 2x - 3$?',
    [r'in $(-1|-4)$', r'in $(1|-4)$', r'in $(-1|4)$', r'in $(-2|-3)$'],
    [r'Quadratische Ergänzung: $x^2 + 2x + 1 - 1 - 3 = (x+1)^2 - 4$.',
     r'Also $x_S = -1$ und $y_S = -4$.',
     r'Probe: $y(-1) = 1 - 2 - 3 = -4$.'])

Q.q(r'Löse: $(x - 1)(x + 5) = 0$.',
    [r'$x = 1$ und $x = -5$', r'$x = -1$ und $x = 5$', r'$x = 1$ und $x = 5$', r'$x = -1$ und $x = -5$'],
    [r'Nullproduktsatz: jeder Faktor wird null gesetzt.',
     r'$x - 1 = 0$ ergibt $x = 1$; $x + 5 = 0$ ergibt $x = -5$.',
     r'In den Linearfaktoren steht die Nullstelle mit umgekehrtem Vorzeichen.'])

Q.q(r'Wie viele reelle Lösungen hat $x^2 + 2x + 5 = 0$?',
    [r'keine', r'eine', r'zwei', r'drei'],
    [r'Diskriminante: $2^2 - 4 \cdot 1 \cdot 5 = 4 - 20 = -16$.',
     r'Sie ist negativ, unter der Wurzel steht also eine negative Zahl.',
     r'Im Reellen gibt es keine Lösung; der Graph liegt ganz oberhalb der $x$-Achse.'])

# ------------------------------------------------------------- Mathe-Rätsel ----
Q.q(r'Wie groß ist die Summe aller natürlichen Zahlen von $1$ bis $100$?',
    [r'$5050$', r'$5000$', r'$10\,100$', r'$4950$'],
    [r'Man bildet Paare: $1 + 100$, $2 + 99$, $3 + 98$ und so weiter — jedes Paar ergibt $101$.',
     r'Es gibt $50$ solcher Paare: $50 \cdot 101 = 5050$.',
     r'Diesen Trick soll der junge Gauß in der Schule gefunden haben.'])

Q.q(r'Sechs Personen begrüßen sich, jede mit jeder genau einmal per Handschlag. Wie viele Handschläge sind das?',
    [r'$15$', r'$30$', r'$36$', r'$12$'],
    [r'Jede der $6$ Personen gibt $5$ anderen die Hand: $6 \cdot 5 = 30$.',
     r'Jeder Handschlag ist dabei doppelt gezählt.',
     r'$\dfrac{30}{2} = 15$ Handschläge.'])

Q.q(r'Wie viele Quadrate enthält ein Schachbrettausschnitt von $3 \times 3$ Feldern insgesamt?',
    [r'$14$', r'$9$', r'$10$', r'$13$'],
    [r'Es zählen nicht nur die Einzelfelder.',
     r'$9$ Quadrate der Größe $1 \times 1$, $4$ der Größe $2 \times 2$, $1$ der Größe $3 \times 3$.',
     r'Zusammen $9 + 4 + 1 = 14$.'])

Q.q(r'Denke dir eine Zahl, verdopple sie, addiere $10$, halbiere das Ergebnis und ziehe die gedachte Zahl ab. Was kommt heraus?',
    [r'immer $5$, unabhängig von der gedachten Zahl', r'immer $10$',
     r'die gedachte Zahl', r'das hängt von der gedachten Zahl ab'],
    [r'Mit $n$ als gedachter Zahl: $2n$, dann $2n + 10$, halbiert $n + 5$.',
     r'Abzüglich $n$ bleibt $5$.',
     r'Der Term $\dfrac{2n + 10}{2} - n$ vereinfacht sich zu $5$ — die Variable fällt heraus.'])

Q.q(r'Auf einem See verdoppelt sich die Fläche der Seerosen jeden Tag. Am $48$. Tag ist der See vollständig bedeckt. Wann war er halb bedeckt?',
    [r'am $47$. Tag', r'am $24$. Tag', r'am $46$. Tag', r'am $12$. Tag'],
    [r'Rückwärts gedacht: einen Tag vor dem vollen See war die Hälfte bedeckt.',
     r'Das ist der $47$. Tag.',
     r'Der $24$. Tag wäre die Antwort bei gleichmäßigem Wachstum — bei Verdopplung geht fast alles in den letzten Tagen.'])

Q.q(r'Auf wie viele Nullen endet $10! = 1 \cdot 2 \cdot 3 \cdot \ldots \cdot 10$?',
    [r'auf $2$ Nullen', r'auf $1$ Null', r'auf $3$ Nullen', r'auf $10$ Nullen'],
    [r'Eine Endnull entsteht aus je einem Faktor $2$ und einem Faktor $5$.',
     r'Faktoren $5$ stecken in $5$ und in $10$, das sind zwei; Faktoren $2$ gibt es reichlich.',
     r'Also zwei Nullen: $10! = 3\,628\,800$.'])

Q.q(r'Welche der folgenden Zahlen ist KEINE Primzahl?',
    [r'$51$', r'$53$', r'$59$', r'$61$'],
    [r'Die Quersumme von $51$ ist $6$, also ist $51$ durch $3$ teilbar.',
     r'$51 = 3 \cdot 17$',
     r'$53$, $59$ und $61$ haben keine Teiler außer $1$ und sich selbst.'])

Q.q(r'Die Folge beginnt $1$, $1$, $2$, $3$, $5$, $8$, $13$. Wie lautet das nächste Glied?',
    [r'$21$', r'$18$', r'$26$', r'$20$'],
    [r'Jedes Glied ist die Summe der beiden vorherigen.',
     r'$8 + 13 = 21$',
     r'Das ist die Fibonacci-Folge; die Quotienten aufeinanderfolgender Glieder streben gegen den goldenen Schnitt.'])

Q.q(r'Ein Ziegelstein wiegt $1$ Kilogramm plus einen halben Ziegelstein. Wie schwer ist er?',
    [r'$2$ Kilogramm', r'$1{,}5$ Kilogramm', r'$1$ Kilogramm', r'$3$ Kilogramm'],
    [r'Ansatz: $z = 1 + \dfrac{z}{2}$.',
     r'$\dfrac{z}{2} = 1$, also $z = 2$.',
     r'Probe: $2 = 1 + 1$ stimmt. Die schnelle Antwort $1{,}5$ ist die klassische Falle.'])

Q.q(r'Ein Zug fährt $60\,\mathrm{km}$ hin mit $60\,\mathrm{km/h}$ und dieselbe Strecke zurück mit $30\,\mathrm{km/h}$. Wie groß ist die Durchschnittsgeschwindigkeit für die gesamte Fahrt?',
    [r'$40\,\mathrm{km/h}$', r'$45\,\mathrm{km/h}$', r'$50\,\mathrm{km/h}$', r'$30\,\mathrm{km/h}$'],
    [r'Hinfahrt: $1$ Stunde. Rückfahrt: $2$ Stunden. Zusammen $120\,\mathrm{km}$ in $3$ Stunden.',
     r'$\dfrac{120}{3} = 40\,\mathrm{km/h}$',
     r'$45\,\mathrm{km/h}$ wäre der Mittelwert der Geschwindigkeiten — der gilt hier nicht, weil die langsame Strecke länger dauert.'])


def check():
    from fractions import Fraction as F
    from math import factorial
    import sympy as sp
    x, n, z = sp.symbols('x n z')
    # Vertiefung
    assert ((x + 1) ** 2 - 3).subs(x, -1) == -3
    assert sp.solve(x ** 2 - 25, x) == [-5, 5]
    assert sp.solve(x ** 2 - 4 * x, x) == [0, 4]
    assert sp.solve(x ** 2 - x - 6, x) == [-2, 3] and 3 + (-2) == 1 and 3 * (-2) == -6
    assert sp.solve(x ** 2 - 4, x) == [-2, 2] and sp.factor(x ** 2 - 4) == (x - 2) * (x + 2)
    assert (-2 * x ** 2 + 1).subs(x, 0) == 1
    g = x ** 2 + 2 * x - 3
    assert g.subs(x, 0) == -3 and sp.expand((x + 1) ** 2 - 4) == g and g.subs(x, -1) == -4
    assert sp.solve((x - 1) * (x + 5), x) == [-5, 1]
    assert 2 ** 2 - 4 * 1 * 5 == -16
    assert sp.solveset(x ** 2 + 2 * x + 5, x, sp.S.Reals) == sp.S.EmptySet
    # Raetsel
    assert sum(range(1, 101)) == 5050 and 50 * 101 == 5050 and 1 + 100 == 101
    assert F(6 * 5, 2) == 15 and 6 * 5 == 30
    assert 9 + 4 + 1 == 14
    assert sp.simplify((2 * n + 10) / 2 - n) == 5
    assert factorial(10) == 3628800 and str(factorial(10)).endswith('00') and not str(factorial(10)).endswith('000')
    assert 51 == 3 * 17 and sum(int(c) for c in '51') == 6 and all(sp.isprime(p) for p in (53, 59, 61))
    assert not sp.isprime(51)
    fib = [1, 1]
    while len(fib) < 8:
        fib.append(fib[-1] + fib[-2])
    assert fib == [1, 1, 2, 3, 5, 8, 13, 21]
    assert sp.solve(sp.Eq(z, 1 + z / 2), z) == [2] and 2 == 1 + 1
    assert F(60, 60) == 1 and F(60, 30) == 2 and F(120, 3) == 40 and F(60 + 30, 2) == 45


Q.verify(check)
Q.save()
