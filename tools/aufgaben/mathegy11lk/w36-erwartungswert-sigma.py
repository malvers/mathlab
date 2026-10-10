#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 36 / KW 22 (LB 4): expected value, variance and standard deviation of binomial
random variables - 16 questions of the Grundkurs sheet, 4 harder ones (minimum number of trials, n and p from
E(X) and sigma). Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=36, slug='erwartungswert-sigma', thema='Erwartungswert, Varianz und Standardabweichung', lb='LB 4',
           blurb='E(X) = n · p, V(X) = n · p · (1 − p), σ, Histogramme, σ-Umgebungen, Mindestanzahl von Versuchen',
           comment='Questions 1-16 from the Grundkurs sheet (mathegy11/w36), 17-20 Leistungskurs.')

qs, check_gk = harvest('w36-erwartungswert-sigma.py', [0, 1, 2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 15, 16, 17, 18])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------------ Leistungskurs ----
Q.q(r'Wie oft muss man mindestens würfeln, um mit mindestens 99 % Wahrscheinlichkeit wenigstens eine Sechs zu erhalten?',
    [r'26-mal', r'25-mal', r'13-mal', r'99-mal'],
    [r'$1 - \left(\tfrac{5}{6}\right)^n \geq 0{,}99 \Leftrightarrow \left(\tfrac{5}{6}\right)^n \leq 0{,}01$.',
     r'$n \geq \dfrac{\ln 0{,}01}{\ln \frac{5}{6}} \approx 25{,}3$; das Ungleichheitszeichen dreht sich, weil $\ln \tfrac{5}{6} < 0$ ist.'])

Q.q(r'2 % der Teile sind defekt. Wie viele Teile muss man mindestens prüfen, um mit mindestens 95 % Wahrscheinlichkeit wenigstens ein defektes zu finden?',
    [r'149', r'148', r'50', r'95'],
    [r'$1 - 0{,}98^n \geq 0{,}95 \Leftrightarrow 0{,}98^n \leq 0{,}05$.',
     r'$n \geq \dfrac{\ln 0{,}05}{\ln 0{,}98} \approx 148{,}3$'])

Q.q(r'Eine binomialverteilte Zufallsgröße hat $E(X) = 20$ und $\sigma = 4$. Bestimme $n$ und $p$.',
    [r'$n = 100$, $p = 0{,}2$', r'$n = 80$, $p = 0{,}25$', r'$n = 25$, $p = 0{,}8$', r'$n = 20$, $p = 1$'],
    [r'$V(X) = \sigma^2 = 16 = n p (1 - p) = 20\,(1 - p)$, also $1 - p = 0{,}8$.',
     r'$p = 0{,}2$ und $n = \tfrac{20}{0{,}2} = 100$.'])

Q.q(r'Für welches $n$ ist bei $p = 0{,}5$ die Standardabweichung $\sigma = 3$?',
    [r'$n = 36$', r'$n = 12$', r'$n = 6$', r'$n = 18$'],
    [r'$\sigma^2 = n \cdot 0{,}5 \cdot 0{,}5 = \tfrac{n}{4} = 9$.'])


def check():
    import math
    check_gk()
    n = math.ceil(math.log(0.01) / math.log(5 / 6))
    assert n == 26 and 1 - (5 / 6) ** 25 < 0.99 <= 1 - (5 / 6) ** 26 and abs(math.log(0.01) / math.log(5 / 6) - 25.3) < 0.05
    n = math.ceil(math.log(0.05) / math.log(0.98))
    assert n == 149 and 1 - 0.98 ** 148 < 0.95 <= 1 - 0.98 ** 149 and abs(math.log(0.05) / math.log(0.98) - 148.3) < 0.05
    assert 100 * 0.2 == 20 and abs(math.sqrt(100 * 0.2 * 0.8) - 4) < 1e-12
    assert math.sqrt(80 * 0.25 * 0.75) != 4 and math.sqrt(25 * 0.8 * 0.2) != 4
    assert math.sqrt(36 * 0.25) == 3


Q.verify(check)
Q.save()
