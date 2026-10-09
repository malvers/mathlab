#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 35 / KW 21 (LB 4): cumulative probabilities - translating
'at most', 'at least', 'between', summation sign, complement. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=35, slug='kumuliert', thema='Kumulierte Wahrscheinlichkeiten', lb='LB 4',
         blurb='„höchstens“, „mindestens“, „zwischen“; Summensymbol, Gegenereignis',
         comment='Blocks: translating words (1-6), summation sign and tables (7-9), computing (10-17), minimum number of trials (18-20).')

# -------------------------------------------------------------- translating words ----
Q.q(r'Was bedeutet „höchstens 3 Treffer“?',
    [r'$X \leq 3$', r'$X < 3$', r'$X \geq 3$', r'$X = 3$'],
    [r'Höchstens 3: 0, 1, 2 oder 3 Treffer.'])

Q.q(r'Was bedeutet „mehr als 3 Treffer“?',
    [r'$X \geq 4$', r'$X \geq 3$', r'$X \leq 3$', r'$X > 4$'],
    [r'Mehr als 3 schließt die 3 aus.'])

Q.q(r'Was bedeutet „weniger als 3 Treffer“?',
    [r'$X \leq 2$', r'$X \leq 3$', r'$X \geq 3$', r'$X < 2$'],
    [r'Weniger als 3: 0, 1 oder 2.'])

Q.q(r'Wie berechnet man $P(X \geq 1)$ am schnellsten?',
    [r'$1 - P(X = 0)$', r'$P(X = 1)$', r'$1 - P(X = 1)$', r'$P(X \leq 1)$'],
    [r'Gegenereignis von „mindestens ein Treffer“ ist „kein Treffer“.'])

Q.q(r'Wie berechnet man $P(X \geq k)$ aus einer Tabelle der Werte $P(X \leq k)$?',
    [r'$1 - P(X \leq k - 1)$', r'$1 - P(X \leq k)$', r'$P(X \leq k) - 1$', r'$P(X \leq k + 1)$'],
    [r'Gegenereignis von „mindestens $k$“ ist „höchstens $k - 1$“.',
     r'Typischer Fehler: $1 - P(X \leq k)$ schließt $k$ selbst mit aus.'])

Q.q(r'Was ist das Gegenereignis von „höchstens 2 Treffer“?',
    [r'Mindestens 3 Treffer', r'Mindestens 2 Treffer', r'Genau 2 Treffer', r'Höchstens 3 Treffer'],
    [r'$X \leq 2$ und $X \geq 3$ ergänzen sich zu allen Möglichkeiten.'])

# ------------------------------------------------------ summation sign and tables ----
Q.q(r'Wie schreibt man $P(X \leq 2)$ mit dem Summensymbol?',
    [r'$\sum\limits_{k=0}^{2} \dbinom{n}{k} p^k (1 - p)^{n - k}$', r'$\sum\limits_{k=2}^{n} \dbinom{n}{k} p^k (1 - p)^{n - k}$',
     r'$\dbinom{n}{2} p^2 (1 - p)^{n - 2}$', r'$\sum\limits_{k=1}^{2} p^k$'],
    [r'Die Einzelwahrscheinlichkeiten für $k = 0$, 1 und 2 werden addiert.'])

Q.q(r'Wie erhält man $P(X = k)$ aus kumulierten Werten?',
    [r'$P(X \leq k) - P(X \leq k - 1)$', r'$P(X \leq k) + P(X \leq k - 1)$', r'$1 - P(X \leq k)$', r'$P(X \leq k) \cdot P(X \leq k - 1)$'],
    [r'Die beiden Summen unterscheiden sich genau um den Summanden $P(X = k)$.'])

Q.q(r'Wie berechnet man „zwischen 2 und 5 Treffer (jeweils einschließlich)“?',
    [r'$P(X \leq 5) - P(X \leq 1)$', r'$P(X \leq 5) - P(X \leq 2)$', r'$P(X \leq 5) + P(X \leq 2)$', r'$P(X = 5) - P(X = 2)$'],
    [r'$P(2 \leq X \leq 5)$: Von „bis 5“ wird „bis 1“ abgezogen, damit die 2 dabei bleibt.'])

# -------------------------------------------------------------------- computing ----
Q.q(r'$n = 4$, $p = 0{,}5$. Berechne $P(X \leq 1)$.',
    [r'$\dfrac{5}{16}$', r'$\dfrac{1}{16}$', r'$\dfrac{4}{16}$', r'$\dfrac{11}{16}$'],
    [r'$P(X = 0) + P(X = 1) = \dfrac{1}{16} + \dfrac{4}{16}$'])

Q.q(r'$n = 5$, $p = 0{,}2$. Berechne $P(X \geq 1)$.',
    [r'0,67232', r'0,32768', r'0,4096', r'0,2'],
    [r'$1 - 0{,}8^5 = 1 - 0{,}327\,68$'])

Q.q(r'$n = 5$, $p = 0{,}2$. Berechne $P(X \leq 1)$.',
    [r'0,73728', r'0,4096', r'0,26272', r'0,32768'],
    [r'$0{,}327\,68 + 0{,}4096 = 0{,}737\,28$'])

Q.q(r'$n = 10$, $p = 0{,}5$. Berechne $P(X \geq 9)$.',
    [r'$\dfrac{11}{1024}$', r'$\dfrac{10}{1024}$', r'$\dfrac{1}{1024}$', r'$\dfrac{1013}{1024}$'],
    [r'$P(X = 9) + P(X = 10) = \dfrac{10 + 1}{1024}$',
     r'$\approx 0{,}0107$'])

Q.q(r'$n = 3$, $p = 0{,}4$. Berechne $P(X \geq 2)$.',
    [r'0,352', r'0,288', r'0,064', r'0,648'],
    [r'$P(X = 2) = 3 \cdot 0{,}16 \cdot 0{,}6 = 0{,}288$',
     r'$P(X = 3) = 0{,}064$; zusammen 0,352.'])

Q.q(r'Fünf Fragen werden geraten ($p = \dfrac{1}{4}$). Wie wahrscheinlich sind mindestens 3 richtig?',
    [r'etwa 0,104', r'etwa 0,088', r'etwa 0,896', r'etwa 0,25'],
    [r'$\dbinom{5}{3} \cdot \dfrac{9}{1024} + \dbinom{5}{4} \cdot \dfrac{3}{1024} + \dfrac{1}{1024} = \dfrac{90 + 15 + 1}{1024}$',
     r'$= \dfrac{106}{1024} \approx 0{,}104$: Raten lohnt sich nicht.'])

Q.q(r'20 % der Menschen sind Linkshänder. In einer Gruppe von 10: Wie wahrscheinlich ist höchstens ein Linkshänder?',
    [r'etwa 0,376', r'etwa 0,268', r'etwa 0,107', r'etwa 0,624'],
    [r'$P(X = 0) = 0{,}8^{10} \approx 0{,}107$, $P(X = 1) = 10 \cdot 0{,}2 \cdot 0{,}8^9 \approx 0{,}268$',
     r'Zusammen $\approx 0{,}376$.'])

Q.q(r'$n = 4$, $p = 0{,}5$. Berechne $P(2 \leq X \leq 3)$.',
    [r'$\dfrac{5}{8}$', r'$\dfrac{3}{8}$', r'$\dfrac{1}{4}$', r'$\dfrac{11}{16}$'],
    [r'$\dfrac{6}{16} + \dfrac{4}{16} = \dfrac{10}{16}$'])

# ---------------------------------------------------- minimum number of trials ----
Q.q(r'Wie oft muss man mindestens würfeln, um mit mindestens 90 % Wahrscheinlichkeit wenigstens eine Sechs zu haben?',
    [r'13-mal', r'9-mal', r'6-mal', r'60-mal'],
    [r'$1 - \left(\dfrac{5}{6}\right)^n \geq 0{,}9 \Leftrightarrow \left(\dfrac{5}{6}\right)^n \leq 0{,}1$',
     r'$n \geq \dfrac{\ln 0{,}1}{\ln \frac{5}{6}} \approx 12{,}6$, also $n = 13$.',
     r'Beim Teilen durch $\ln \frac{5}{6} < 0$ dreht sich das Relationszeichen.'])

Q.q(r'Was ist $P(X < 0)$ bei einer binomialverteilten Zufallsgröße?',
    [r'0', r'1', r'$(1 - p)^n$', r'Nicht definiert'],
    [r'Weniger als null Treffer sind unmöglich.'])

Q.q(r'Warum ist $P(X \leq n) = 1$?',
    [r'Mehr als $n$ Treffer sind bei $n$ Versuchen unmöglich.', r'Weil $p \leq 1$ ist.', r'Weil das Histogramm symmetrisch ist.', r'Das stimmt nur für $p = 0{,}5$.'],
    [r'„Höchstens $n$“ umfasst alle Möglichkeiten.'])


def check():
    from fractions import Fraction as F
    from math import comb, log
    B = lambda n, p, k: comb(n, k) * p ** k * (1 - p) ** (n - k)
    C = lambda n, p, k: sum(B(n, p, i) for i in range(0, k + 1))
    h = F(1, 2)
    assert C(4, h, 1) == F(5, 16)
    p = F(1, 5)
    assert 1 - B(5, p, 0) == F(67232, 100000) and C(5, p, 1) == F(73728, 100000)
    assert 1 - C(10, h, 8) == F(11, 1024)
    q = F(2, 5)
    assert B(3, q, 2) == F(288, 1000) and 1 - C(3, q, 1) == F(352, 1000)
    g = F(1, 4)
    assert 1 - C(5, g, 2) == F(106, 1024) and abs(float(F(106, 1024)) - 0.104) < 0.001
    assert abs(float(C(10, F(1, 5), 1)) - 0.376) < 0.001
    assert C(4, h, 3) - C(4, h, 1) == F(5, 8)
    n = log(0.1) / log(5 / 6)
    assert 12.6 < n < 12.7 and 1 - (5 / 6) ** 13 >= 0.9 > 1 - (5 / 6) ** 12
    assert C(7, F(1, 3), 7) == 1


Q.verify(check)
Q.save()
