#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 40: Jahresrueckblick - das ganze Jahr in 16 Aufgaben
in Planreihenfolge, dazu vier Knobeleien. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec

Q = fos12(nr=40, slug='jahresabschluss', thema='Jahresrückblick', lb='Abschluss',
          blurb='das ganze Jahr in 16 Aufgaben, dazu vier Knobeleien',
          comment='Blocks: Vektorrechnung (1-4), Grenzwerte (5-6), Differenzialrechnung (7-11), Integralrechnung (12-14), gebrochenrationale und e-Funktionen (15-16), Knobeleien (17-20). In Planreihenfolge.')

# -------------------------------------------------------- Vektorrechnung ----
Q.q(r'Berechne den Betrag von $\vec a = ' + vec(6, -2, 3) + '$.',
    [r'$7$', r'$11$', r'$49$', r'$\sqrt{7}$'],
    [r'$|\vec a| = \sqrt{36 + 4 + 9} = \sqrt{49}$',
     r'$|\vec a| = 7$',
     r'Das Minus verschwindet beim Quadrieren: $(-2)^2 = 4$.'])

Q.q(r'Berechne das Skalarprodukt $' + vec(1, 2, 3) + r' \cdot ' + vec(4, -1, 2) + '$.',
    [r'$8$', r'$12$', r'$' + vec(4, -2, 6) + '$', r'$-8$'],
    [r'Koordinatenweise multiplizieren und addieren: $1 \cdot 4 + 2 \cdot (-1) + 3 \cdot 2$',
     r'$= 4 - 2 + 6 = 8$',
     r'Das Ergebnis ist eine Zahl, kein Vektor — genau das unterscheidet das Skalarprodukt vom Vektorprodukt.'])

Q.q(r'Wie lautet ein Richtungsvektor der Geraden durch $A(1|0|2)$ und $B(3|4|2)$?',
    [r'$' + vec(2, 4, 0) + '$', r'$' + vec(4, 4, 4) + '$', r'$' + vec(-2, -4, 0) + r'$ ist kein Richtungsvektor', r'$' + vec(3, 4, 2) + '$'],
    [r'Richtungsvektor ist $\overrightarrow{AB} = \vec b - \vec a$, also Spitze minus Fuß.',
     r'$' + vec(3, 4, 2) + ' - ' + vec(1, 0, 2) + ' = ' + vec(2, 4, 0) + '$',
     r'Auch $' + vec(-2, -4, 0) + r'$ wäre ein gültiger Richtungsvektor — jedes Vielfache tut es, nur der Nullvektor nicht.'])

Q.q(r'Wie lautet ein Normalenvektor der Ebene $2x - y + 3z = 6$?',
    [r'$' + vec(2, -1, 3) + '$', r'$' + vec(2, 1, 3) + '$', r'$' + vec(6, 6, 6) + '$', r'$' + vec(-2, 1, -3) + r'$ ist kein Normalenvektor'],
    [r'In der Koordinatengleichung $ax + by + cz = d$ stehen die Koeffizienten des Normalenvektors vorn.',
     r'Also $\vec n = ' + vec(2, -1, 3) + '$.',
     r'Das Vorzeichen bei $y$ gehört dazu; $' + vec(-2, 1, -3) + r'$ zeigt nur in die Gegenrichtung und wäre ebenfalls zulässig.'])

# ------------------------------------------------------------- Grenzwerte ----
Q.q(r'Bestimme $\lim\limits_{n \to \infty} \dfrac{4n - 3}{2n}$.',
    [r'$2$', r'$0$', r'$\infty$', r'$\dfrac{1}{2}$'],
    [r'Term aufspalten: $\dfrac{4n-3}{2n} = 2 - \dfrac{3}{2n}$',
     r'Der zweite Summand geht gegen $0$.',
     r'Der Grenzwert ist $2$ — bei gleichem Grad entscheidet das Verhältnis der höchsten Koeffizienten.'])

Q.q(r'Wie verhält sich $f(x) = x^5$ für $x \to -\infty$?',
    [r'$f(x) \to -\infty$', r'$f(x) \to +\infty$', r'$f(x) \to 0$', r'$f(x) \to 5$'],
    [r'Der Grad $5$ ist ungerade, der Leitkoeffizient positiv.',
     r'Bei ungeradem Grad bleibt das Vorzeichen des Arguments erhalten.',
     r'Probe: $(-10)^5 = -100\,000$.'])

# ----------------------------------------------------- Differenzialrechnung ----
Q.q(r'Leite ab: $f(x) = 4x^3 - x$.',
    [r'$f^{\prime}(x) = 12x^2 - 1$', r'$f^{\prime}(x) = 12x^2 - x$',
     r'$f^{\prime}(x) = 4x^2 - 1$', r'$f^{\prime}(x) = 12x^2$'],
    [r'Potenzregel gliedweise: $4x^3 \to 12x^2$.',
     r'$-x \to -1$, denn $x = x^1$ hat die Ableitung $1$.',
     r'$f^{\prime}(x) = 12x^2 - 1$.'])

Q.q(r'Leite ab: $f(x) = (3x + 1)^5$.',
    [r'$f^{\prime}(x) = 15(3x+1)^4$', r'$f^{\prime}(x) = 5(3x+1)^4$',
     r'$f^{\prime}(x) = 15(3x+1)^5$', r'$f^{\prime}(x) = 3(3x+1)^4$'],
    [r'Kettenregel: äußere mal innere Ableitung.',
     r'Äußere: $5(3x+1)^4$, innere: $3$.',
     r'$f^{\prime}(x) = 15(3x+1)^4$.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = x^2 - 6x$.',
    [r'Tiefpunkt $T(3|-9)$', r'Hochpunkt $H(3|-9)$', r'Tiefpunkt $T(3|9)$', r'Tiefpunkt $T(6|0)$'],
    [r'$f^{\prime}(x) = 2x - 6 = 0$ liefert $x = 3$.',
     r'$f^{\prime\prime}(x) = 2 > 0$, also ein Tiefpunkt.',
     r'$f(3) = 9 - 18 = -9$, somit $T(3|-9)$.'])

Q.q(r'Bestimme den Wendepunkt von $f(x) = x^3 - 6x^2$.',
    [r'$W(2|-16)$', r'$W(2|16)$', r'$W(4|-32)$', r'$W(0|0)$'],
    [r'$f^{\prime\prime}(x) = 6x - 12 = 0$ liefert $x = 2$.',
     r'$f^{\prime\prime\prime}(x) = 6 \neq 0$, es ist wirklich ein Wendepunkt.',
     r'$f(2) = 8 - 24 = -16$, somit $W(2|-16)$.'])

Q.q(r'Die Summe zweier positiver Zahlen beträgt $12$. Wann ist ihr Produkt am größten?',
    [r'bei $6$ und $6$ mit dem Produkt $36$', r'bei $8$ und $4$ mit dem Produkt $32$',
     r'bei $11$ und $1$ mit dem Produkt $11$', r'bei $7$ und $5$ mit dem Produkt $35$'],
    [r'Nebenbedingung $x + y = 12$, also $y = 12 - x$.',
     r'Zielfunktion $P(x) = x\,(12 - x)$, Ableitung $P^{\prime}(x) = 12 - 2x = 0$ ergibt $x = 6$.',
     r'$P^{\prime\prime}(x) = -2 < 0$, also ein Maximum: $6 \cdot 6 = 36$. Bei fester Summe gewinnt immer die gleichmäßige Aufteilung.'])

# ------------------------------------------------------ Integralrechnung ----
Q.q(r'Wie lautet die allgemeine Stammfunktion von $f(x) = 3x^2$?',
    [r'$F(x) = x^3 + C$', r'$F(x) = x^3$', r'$F(x) = 6x + C$', r'$F(x) = \dfrac{3x^3}{3} $'],
    [r'Exponent um $1$ erhöhen und durch den neuen Exponenten teilen: $\dfrac{3x^3}{3} = x^3$.',
     r'Die Integrationskonstante gehört dazu: $F(x) = x^3 + C$.',
     r'Probe: $\left(x^3 + C\right)^{\prime} = 3x^2$.'])

Q.q(r'Berechne $\int_0^2 3x^2\,dx$.',
    [r'$8$', r'$12$', r'$4$', r'$24$'],
    [r'Stammfunktion: $F(x) = x^3$.',
     r'Hauptsatz: $F(2) - F(0) = 8 - 0 = 8$.',
     r'$12$ wäre $f(2)$, also der Funktionswert an der oberen Grenze — nicht der Flächeninhalt.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen dem Graphen von $f(x) = 4 - x^2$ und der $x$-Achse.',
    [r'$\dfrac{32}{3} \approx 10{,}67$', r'$\dfrac{16}{3} \approx 5{,}33$', r'$16$', r'$8$'],
    [r'Nullstellen als Grenzen: $4 - x^2 = 0$ ergibt $x = \pm 2$.',
     r'$\int_{-2}^{2} (4 - x^2)\,dx = \left[4x - \dfrac{x^3}{3}\right]_{-2}^{2} = \dfrac{16}{3} - \left(-\dfrac{16}{3}\right)$',
     r'$= \dfrac{32}{3} \approx 10{,}67$. Wer nur von $0$ bis $2$ rechnet, erhält die halbe Fläche $\dfrac{16}{3}$.'])

# ------------------------------- gebrochenrationale und e-Funktionen ----
Q.q(r'Wie lautet der Definitionsbereich von $f(x) = \dfrac{x+1}{x-3}$?',
    [r'$D = \mathbb{R} \setminus \{3\}$', r'$D = \mathbb{R} \setminus \{-1\}$',
     r'$D = \mathbb{R} \setminus \{-1;\,3\}$', r'$D = \mathbb{R}$'],
    [r'Der Nenner darf nicht null werden: $x - 3 \neq 0$.',
     r'Also ist $x = 3$ ausgeschlossen.',
     r'$x = -1$ ist die Nullstelle der Funktion, dort ist sie völlig unproblematisch definiert.'])

Q.q(r'Leite ab: $f(x) = e^{3x}$.',
    [r'$f^{\prime}(x) = 3e^{3x}$', r'$f^{\prime}(x) = e^{3x}$', r'$f^{\prime}(x) = 3x\,e^{3x}$', r'$f^{\prime}(x) = e^{3}$'],
    [r'Kettenregel: die e-Funktion bleibt stehen, die innere Ableitung kommt als Faktor davor.',
     r'Innere Funktion $3x$, ihre Ableitung ist $3$.',
     r'$f^{\prime}(x) = 3e^{3x}$. Die innere Ableitung zu vergessen ist hier der häufigste Fehler.'])

# --------------------------------------------------------- Knobeleien ----
Q.q(r'Beim Nim liegen zwei Häufchen mit je $4$ Hölzchen. Wer abwechselnd beliebig viele Hölzchen von genau einem Häufchen nimmt und das letzte Hölzchen nimmt, gewinnt. Wer gewinnt bei bestem Spiel?',
    [r'der zweite Spieler, indem er jeden Zug spiegelt', r'der erste Spieler, indem er ein ganzes Häufchen nimmt',
     r'der erste Spieler, indem er ein Hölzchen nimmt', r'das Spiel endet immer unentschieden'],
    [r'Die Stellung ist symmetrisch: beide Häufchen sind gleich groß.',
     r'Der zweite Spieler nimmt einfach immer genauso viele Hölzchen vom anderen Häufchen — nach jedem seiner Züge sind die Häufchen wieder gleich.',
     r'So bleibt ihm stets ein Zug übrig, und er nimmt das letzte Hölzchen. In der Binärsprache des Spiels: $4 \oplus 4 = 0$, und eine Nullstellung verliert für den, der am Zug ist.'])

Q.q(r'Eine Zahl ist genau dann durch $9$ teilbar, wenn ihre Quersumme durch $9$ teilbar ist. Welche der folgenden Zahlen ist durch $9$ teilbar?',
    [r'$61\,254$', r'$61\,253$', r'$61\,255$', r'$61\,256$'],
    [r'Quersumme von $61\,254$: $6 + 1 + 2 + 5 + 4 = 18$, und $18$ ist durch $9$ teilbar.',
     r'Probe: $61\,254 : 9 = 6806$.',
     r'Der Grund: $10$ lässt beim Teilen durch $9$ den Rest $1$, also auch jede Zehnerpotenz — deshalb zählt nur die Ziffernsumme.'])

Q.q(r'Auf einer Feier begrüßen sich $5$ Personen, jede mit jeder genau einmal per Handschlag. Wie viele Handschläge sind das?',
    [r'$10$', r'$20$', r'$25$', r'$5$'],
    [r'Jede der $5$ Personen schüttelt $4$ anderen die Hand: $5 \cdot 4 = 20$.',
     r'Dabei ist jeder Handschlag doppelt gezählt, einmal von jeder Seite.',
     r'Also $\dfrac{5 \cdot 4}{2} = 10$ Handschläge.'])

Q.q(r'Wie viele Diagonalen hat ein regelmäßiges Achteck?',
    [r'$20$', r'$28$', r'$16$', r'$8$'],
    [r'Von jeder der $8$ Ecken gehen Verbindungen zu $5$ Ecken, die weder sie selbst noch ihre beiden Nachbarn sind.',
     r'$8 \cdot 5 = 40$, und jede Diagonale wird von beiden Enden gezählt.',
     r'$\dfrac{8 \cdot 5}{2} = 20$. Die $28$ wären alle Verbindungen inklusive der $8$ Seiten.'])


def check():
    from fractions import Fraction as F
    from math import isqrt
    import sympy as sp
    x = sp.Symbol('x'); n = sp.Symbol('n', positive=True)
    d = lambda e, v=x: sp.diff(e, v)
    # Vektoren
    assert isqrt(36 + 4 + 9) == 7 and 36 + 4 + 9 == 49
    assert 1 * 4 + 2 * (-1) + 3 * 2 == 8
    assert (3 - 1, 4 - 0, 2 - 2) == (2, 4, 0)
    # Grenzwerte
    assert sp.limit((4 * n - 3) / (2 * n), n, sp.oo) == 2
    assert sp.simplify((4 * n - 3) / (2 * n) - (2 - 3 / (2 * n))) == 0
    assert sp.limit(x ** 5, x, -sp.oo) is -sp.oo and (-10) ** 5 == -100000
    # Differenzialrechnung
    assert d(4 * x ** 3 - x) == 12 * x ** 2 - 1
    assert sp.simplify(d((3 * x + 1) ** 5) - 15 * (3 * x + 1) ** 4) == 0
    f1 = x ** 2 - 6 * x
    assert sp.solve(d(f1), x) == [3] and d(d(f1)) == 2 and f1.subs(x, 3) == -9
    f2 = x ** 3 - 6 * x ** 2
    assert sp.solve(d(d(f2)), x) == [2] and d(d(d(f2))) == 6 and f2.subs(x, 2) == -16
    assert f2.subs(x, 4) == -32
    P = lambda v: v * (12 - v)
    assert sp.solve(d(x * (12 - x)), x) == [6] and P(6) == 36 and P(8) == 32 and P(7) == 35 and P(11) == 11
    # Integralrechnung
    assert d(x ** 3) == 3 * x ** 2 and sp.integrate(3 * x ** 2, (x, 0, 2)) == 8
    assert (3 * x ** 2).subs(x, 2) == 12
    g = 4 - x ** 2
    assert sp.solve(g, x) == [-2, 2] and sp.integrate(g, (x, -2, 2)) == F(32, 3)
    assert sp.integrate(g, (x, 0, 2)) == F(16, 3) and abs(float(F(32, 3)) - 10.67) < 0.005
    assert abs(float(F(16, 3)) - 5.33) < 0.005
    # gebrochenrational und e-Funktion
    assert sp.solve(x - 3, x) == [3] and ((x + 1) / (x - 3)).subs(x, -1) == 0
    assert sp.simplify(d(sp.exp(3 * x)) - 3 * sp.exp(3 * x)) == 0
    # Knobeleien
    assert 4 ^ 4 == 0                                  # Nim: gleiche Haeufchen sind eine Nullstellung
    assert sum(int(z) for z in '61254') == 18 and 18 % 9 == 0 and 61254 % 9 == 0 and 61254 // 9 == 6806
    assert all(v % 9 != 0 for v in (61253, 61255, 61256)) and 10 % 9 == 1
    assert F(5 * 4, 2) == 10 and 5 * 4 == 20
    assert F(8 * 5, 2) == 20 and F(8 * 7, 2) == 28 and 28 - 8 == 20


Q.verify(check)
Q.save()
