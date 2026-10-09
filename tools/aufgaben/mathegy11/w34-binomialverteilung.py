#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 34 / KW 20 (LB 4): single probabilities P(X = k) of binomially
distributed random variables, histograms. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=34, slug='binomialverteilung', thema='Binomialverteilung: Einzelwahrscheinlichkeiten', lb='LB 4',
         blurb='P(X = k) berechnen, n und p erkennen, Histogramme deuten',
         comment='Blocks: formula and model (1-4), computing P(X = k) (5-13), histograms (14-18), properties (19-20).')

# ---------------------------------------------------------- formula and model ----
Q.q(r'Wie lautet die Formel für die Einzelwahrscheinlichkeit einer binomialverteilten Zufallsgröße?',
    [r'$P(X = k) = \dbinom{n}{k} \cdot p^k \cdot (1 - p)^{n - k}$', r'$P(X = k) = \dbinom{n}{k} \cdot p^n$',
     r'$P(X = k) = p^k \cdot (1 - p)^k$', r'$P(X = k) = \dfrac{k}{n}$'],
    [r'Anzahl der Pfade mal Wahrscheinlichkeit eines Pfades.'])

Q.q(r'Was bedeutet die Schreibweise $B_{n;\,p}(k)$?',
    [r'Die Wahrscheinlichkeit für genau $k$ Treffer bei $n$ Versuchen mit Trefferwahrscheinlichkeit $p$', r'Den Binomialkoeffizienten $\dbinom{n}{k}$',
     r'Die Wahrscheinlichkeit für höchstens $k$ Treffer', r'Den Erwartungswert'],
    [r'$B_{n;\,p}(k) = P(X = k)$ für $X$ binomialverteilt mit $n$ und $p$.'])

Q.q(r'90 % der Samen einer Sorte keimen. Man sät 10 Samen. Was ist die Zufallsgröße $X$ und wie ist sie verteilt?',
    [r'$X$: Anzahl der keimenden Samen, binomialverteilt mit $n = 10$, $p = 0{,}9$', r'$X$: Keimdauer, binomialverteilt mit $n = 10$',
     r'$X$: Anzahl der Samen, immer 10', r'$X$: Anteil der Samen, gleichverteilt'],
    [r'Jeder Samen ist ein Bernoulli-Experiment: keimt oder keimt nicht.'])

Q.q(r'Welche Situation ist NICHT binomialverteilt?',
    [r'Aus einer Urne mit 3 roten und 2 blauen Kugeln dreimal ohne Zurücklegen ziehen, $X$: Anzahl rot', r'Zehnmal würfeln, $X$: Anzahl Sechsen',
     r'20 Münzwürfe, $X$: Anzahl Kopf', r'Fünf Fragen raten, $X$: Anzahl richtig'],
    [r'Ohne Zurücklegen bei so wenigen Kugeln ändert sich $p$ deutlich.'])

# --------------------------------------------------------- computing P(X = k) ----
Q.q(r'$X$ ist binomialverteilt mit $n = 10$, $p = 0{,}5$. Berechne $P(X = 5)$.',
    [r'etwa 0,246', r'0,5', r'etwa 0,05', r'etwa 0,377'],
    [r'$\dbinom{10}{5} \cdot 0{,}5^{10} = \dfrac{252}{1024}$',
     r'$\approx 0{,}246$: Selbst der wahrscheinlichste Wert tritt nur in einem Viertel der Fälle ein.'])

Q.q(r'$n = 5$, $p = 0{,}2$. Berechne $P(X = 0)$.',
    [r'0,32768', r'0', r'0,2', r'0,00032'],
    [r'$0{,}8^5 = 0{,}327\,68$'])

Q.q(r'$n = 5$, $p = 0{,}2$. Berechne $P(X = 1)$.',
    [r'0,4096', r'0,2', r'0,08192', r'0,32768'],
    [r'$\dbinom{5}{1} \cdot 0{,}2 \cdot 0{,}8^4 = 5 \cdot 0{,}2 \cdot 0{,}4096$',
     r'$= 0{,}4096$'])

Q.q(r'$n = 4$, $p = 0{,}3$. Berechne $P(X = 2)$.',
    [r'0,2646', r'0,09', r'0,0441', r'0,3'],
    [r'$\dbinom{4}{2} \cdot 0{,}3^2 \cdot 0{,}7^2 = 6 \cdot 0{,}09 \cdot 0{,}49$'])

Q.q(r'$n = 20$, $p = 0{,}1$. Berechne $P(X = 2)$ (gerundet).',
    [r'0,2852', r'0,01', r'0,1', r'0,1901'],
    [r'$\dbinom{20}{2} \cdot 0{,}1^2 \cdot 0{,}9^{18} = 190 \cdot 0{,}01 \cdot 0{,}1501$'])

Q.q(r'Ein Würfel wird sechsmal geworfen. Wie wahrscheinlich ist genau eine Sechs?',
    [r'etwa 0,402', r'$\dfrac{1}{6}$', r'1', r'etwa 0,335'],
    [r'$\dbinom{6}{1} \cdot \dfrac{1}{6} \cdot \left(\dfrac{5}{6}\right)^5 = \left(\dfrac{5}{6}\right)^5$',
     r'$\approx 0{,}402$'])

Q.q(r'Von 10 Samen ($p = 0{,}9$): Wie wahrscheinlich keimen alle?',
    [r'etwa 0,349', r'0,9', r'etwa 0,387', r'etwa 0,1'],
    [r'$0{,}9^{10} \approx 0{,}349$'])

Q.q(r'Von 10 Samen ($p = 0{,}9$): Wie wahrscheinlich keimen genau 9?',
    [r'etwa 0,387', r'0,9', r'etwa 0,349', r'0,09'],
    [r'$\dbinom{10}{9} \cdot 0{,}9^9 \cdot 0{,}1 = 0{,}9^9 \approx 0{,}387$',
     r'Also ist „genau 9“ wahrscheinlicher als „alle 10“.'])

Q.q(r'Was ist $P(X = n)$ bei einer Binomialverteilung?',
    [r'$p^n$', r'$(1 - p)^n$', r'$n \cdot p$', r'1'],
    [r'Nur ein Pfad: alles Treffer.'])

# ------------------------------------------------------------------ histograms ----
Q.q(r'Was zeigt das Histogramm einer Binomialverteilung?',
    [r'Über jedem $k$ einen Balken der Höhe $P(X = k)$', r'Die kumulierten Wahrscheinlichkeiten', r'Nur den Erwartungswert', r'Die Pfade des Baumdiagramms'],
    [r'Breite 1, also ist auch die Fläche jedes Balkens $P(X = k)$.'])

Q.q(r'Wie sieht das Histogramm für $p = 0{,}5$ aus?',
    [r'Symmetrisch zu $k = \dfrac{n}{2}$', r'Linkssteil', r'Rechtssteil', r'Alle Balken gleich hoch'],
    [r'Treffer und Niete sind gleich wahrscheinlich, also gilt $P(X = k) = P(X = n - k)$.'])

Q.q(r'Wo liegt etwa der höchste Balken für $n = 10$, $p = 0{,}3$?',
    [r'Bei $k = 3$', r'Bei $k = 5$', r'Bei $k = 0$', r'Bei $k = 10$'],
    [r'Der wahrscheinlichste Wert liegt in der Nähe von $n \cdot p = 3$.'])

Q.q(r'Wie sieht das Histogramm für $n = 20$, $p = 0{,}1$ aus?',
    [r'Die Balken drängen sich links, rechts läuft es flach aus (linkssteil).', r'Symmetrisch', r'Die Balken drängen sich rechts.', r'Alle Balken gleich hoch'],
    [r'Kleine $p$: wenige Treffer sind wahrscheinlich, viele kaum.'])

Q.q(r'Vergleiche für $n = 10$, $p = 0{,}5$: $P(X = 4)$ und $P(X = 6)$.',
    [r'Sie sind gleich.', r'$P(X = 4)$ ist größer.', r'$P(X = 6)$ ist größer.', r'Man kann es nicht sagen.'],
    [r'$\dbinom{10}{4} = \dbinom{10}{6} = 210$ und $0{,}5^{10}$ ist für beide gleich.'])

# ------------------------------------------------------------------ properties ----
Q.q(r'Was ergibt die Summe aller Einzelwahrscheinlichkeiten $P(X = 0) + \ldots + P(X = n)$?',
    [r'1', r'$n$', r'$n \cdot p$', r'0,5'],
    [r'Irgendeine Trefferzahl tritt sicher ein.'])

Q.q(r'Bei $n = 3$ gilt $P(X = 3) = p^3$. Für welches $p$ ist $P(X = 3) = 0{,}125$?',
    [r'$p = 0{,}5$', r'$p = 0{,}125$', r'$p = 0{,}375$', r'$p = 0{,}25$'],
    [r'$p^3 = 0{,}125 = \dfrac{1}{8}$',
     r'$p = \dfrac{1}{2}$'])


def check():
    from fractions import Fraction as F
    from math import comb
    B = lambda n, p, k: comb(n, k) * p ** k * (1 - p) ** (n - k)
    assert B(10, F(1, 2), 5) == F(252, 1024) and abs(float(F(252, 1024)) - 0.246) < 0.001
    assert B(5, F(1, 5), 0) == F(32768, 100000) and B(5, F(1, 5), 1) == F(4096, 10000)
    assert B(4, F(3, 10), 2) == F(2646, 10000)
    assert abs(float(B(20, F(1, 10), 2)) - 0.2852) < 0.0001
    assert abs(float(B(6, F(1, 6), 1)) - 0.402) < 0.001
    assert abs(float(B(10, F(9, 10), 10)) - 0.349) < 0.001 and abs(float(B(10, F(9, 10), 9)) - 0.387) < 0.001
    probs = [B(10, F(3, 10), k) for k in range(11)]
    assert probs.index(max(probs)) == 3 and sum(probs) == 1
    assert B(10, F(1, 2), 4) == B(10, F(1, 2), 6) and comb(10, 4) == 210
    assert F(1, 2) ** 3 == F(1, 8)


Q.verify(check)
Q.save()
