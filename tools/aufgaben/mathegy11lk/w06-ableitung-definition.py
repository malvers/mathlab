#!/usr/bin/env python3
"""Exercises GY Mathe 11 LK, week 6 / KW 39 (LB 1): derivative functions by definition for x^2 and a^x (leading to e
and ln a), the graph of f' - 14 questions of the Grundkurs sheet, 6 on a^x. Plan: HTML/svp/mathe/mathegy11lk.html."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..')); sys.path.insert(0, HERE)
from quiz import gy11lk
from _reuse import harvest

Q = gy11lk(nr=6, slug='ableitung-definition', thema='Ableitungsfunktionen nach Definition', lb='LB 1',
           blurb='x² und aˣ nach Definition, die Zahl e, Graph der Ableitungsfunktion',
           comment='Questions 1-14 from the Grundkurs sheet (mathegy11/w05), 15-20 the exponential function a^x by definition.')

qs, check_gk = harvest('w05-ableitungsfunktion.py', [0, 1, 2, 5, 6, 7, 9, 11, 12, 13, 15, 16, 17, 18])
for a, k in qs:
    Q.q(*a, **k)

# ------------------------------------------------------- a^x by definition ----
Q.q(r'Wie lässt sich der Differenzenquotient von $f(x) = a^x$ umformen?',
    [r'$\dfrac{a^{x+h} - a^x}{h} = a^x \cdot \dfrac{a^h - 1}{h}$', r'$\dfrac{a^{x+h} - a^x}{h} = a^h$', r'$\dfrac{a^{x+h} - a^x}{h} = x \cdot a^{x-1}$', r'$\dfrac{a^{x+h} - a^x}{h} = \dfrac{a^x}{h}$'],
    [r'Potenzgesetz: $a^{x+h} = a^x \cdot a^h$.',
     r'$a^x$ ausklammern: Der Rest $\dfrac{a^h - 1}{h}$ hängt nicht mehr von $x$ ab.'])

Q.q(r'Für $h = 0{,}001$ ist $\dfrac{2^h - 1}{h} \approx 0{,}6934$. Was folgt für die Ableitung von $2^x$?',
    [r'$(2^x)^{\prime} \approx 0{,}693 \cdot 2^x$', r'$(2^x)^{\prime} = x \cdot 2^{x-1}$', r'$(2^x)^{\prime} = 2^x$', r'$(2^x)^{\prime} \approx 0{,}693$'],
    [r'Mit dem Ergebnis der vorigen Aufgabe: $(2^x)^{\prime} = 2^x \cdot \lim\limits_{h \to 0} \dfrac{2^h - 1}{h}$.',
     r'Der Grenzwert ist $\ln 2 \approx 0{,}693$: Die Ableitung ist proportional zur Funktion selbst.'])

Q.q(r'Für $a = 3$ ist $\dfrac{3^h - 1}{h} \approx 1{,}0992$ bei kleinem $h$. Was lässt sich daraus schließen?',
    [r'Es gibt eine Basis zwischen 2 und 3, für die der Grenzwert genau 1 ist.', r'Für jede Basis ist der Grenzwert größer als 1.',
     r'$(3^x)^{\prime} = 3^x$', r'Die Ableitung von $3^x$ existiert nicht.'],
    [r'Bei $a = 2$ ist der Faktor 0,693, bei $a = 3$ ist er 1,099.',
     r'Dazwischen liegt eine Basis mit Faktor genau 1: die Eulersche Zahl $e \approx 2{,}718$.'])

Q.q(r'Welche Eigenschaft zeichnet die Eulersche Zahl $e$ aus?',
    [r'$\lim\limits_{h \to 0} \dfrac{e^h - 1}{h} = 1$, also $(e^x)^{\prime} = e^x$', r'$e^x$ hat bei 0 den Anstieg 0', r'$e^1 = 1$', r'$e$ ist eine rationale Zahl'],
    [r'Für $a = e$ ist der Faktor genau 1.',
     r'Deshalb stimmt $e^x$ mit seiner Ableitung überein und hat bei 0 den Anstieg 1.'])

Q.q(r'Allgemein gilt $(a^x)^{\prime} = \ln a \cdot a^x$. Wie groß ist der Anstieg von $2^x$ an der Stelle 3?',
    [r'$8 \ln 2 \approx 5{,}55$', r'8', r'$3 \cdot 2^2 = 12$', r'$\ln 8 \approx 2{,}08$'],
    [r'$f^{\prime}(3) = \ln 2 \cdot 2^3$.',
     r'$8 \cdot 0{,}693 \approx 5{,}55$'])

Q.q(r'Warum hat der Graph der Ableitung einer Exponentialfunktion $a^x$ dieselbe Form wie der Graph der Funktion?',
    [r'Weil $(a^x)^{\prime} = \ln a \cdot a^x$ ein konstantes Vielfaches von $a^x$ ist.', r'Weil $a^x$ eine Gerade ist.', r'Weil die Ableitung immer 0 ist.', r'Das stimmt nur für $a = 2$.'],
    [r'Die Ableitung ist $a^x$, gestreckt mit dem Faktor $\ln a$.',
     r'Für $a = e$ ist der Faktor 1, die Graphen fallen zusammen; für $0 < a < 1$ ist $\ln a < 0$, der Ableitungsgraph wird an der $x$-Achse gespiegelt.'])


def check():
    import math
    import sympy as sp
    x, h = sp.symbols('x h', positive=True)
    check_gk()
    a = sp.symbols('a', positive=True)
    assert sp.simplify((a ** (x + h) - a ** x) / h - a ** x * (a ** h - 1) / h) == 0
    assert abs((2 ** 0.001 - 1) / 0.001 - 0.6934) < 1e-4 and abs(math.log(2) - 0.693) < 1e-3
    assert abs((3 ** 0.001 - 1) / 0.001 - 1.0992) < 1e-4
    assert sp.limit((sp.exp(h) - 1) / h, h, 0) == 1
    assert abs(8 * math.log(2) - 5.55) < 0.01 and abs(math.log(8) - 2.08) < 0.01
    assert sp.diff(2 ** x, x).subs(x, 3) == 8 * sp.log(2)


Q.verify(check)
Q.save()
