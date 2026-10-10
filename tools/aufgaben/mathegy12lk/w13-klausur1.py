#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 13: Wiederholung für Klausur 12/I (LB 5, WB 5, LB 6).
14 Fragen aus dem Grundkurs-Blatt tools/aufgaben/mathegy12/w14-klausur1.py (eine Quelle), 6 neue zu linearer
Substitution, Rotationskörper, Fassregel und Normalverteilung. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
from statistics import NormalDist
import sympy as sp

Q = gy12lk(nr=13, slug='klausur1', thema='Wiederholung für Klausur 12/I', lb='Klausur',
           blurb='Integrieren, Flächen, Rotationskörper, numerische Verfahren und Normalverteilung gemischt',
           comment='Blocks: Integrieren (1-6, 13-15), Flächen und Bestand (7-9), Rotationskörper (16), numerische Verfahren (10-12, 17), Normalverteilung (18-20). 1 bis 9 und 15, 16 ohne Hilfsmittel.')

N = new()

N.q(r'Berechne $\int (5 - 2x)^4\,\mathrm{d}x$.',
    [r'$-\tfrac{1}{10}\,(5 - 2x)^5 + C$', r'$\tfrac{1}{10}\,(5 - 2x)^5 + C$', r'$-\tfrac25\,(5 - 2x)^5 + C$', r'$-8\,(5 - 2x)^3 + C$'],
    [r'Äußere Stammfunktion $\tfrac{u^5}{5}$, innere Ableitung $-2$: durch $-2$ teilen.',
     r'$\tfrac{1}{-2} \cdot \tfrac{(5 - 2x)^5}{5} = -\tfrac{1}{10}\,(5 - 2x)^5$. $-8\,(5 - 2x)^3$ ist die Ableitung.'])

N.q(r'Der Graph von $f(x) = 2\sqrt{x}$ über $[0;\ 2]$ rotiert um die $x$-Achse. Wie groß ist das Volumen?',
    [r'$8\pi$', r'$4\pi$', r'$16\pi$', r'$\tfrac{8\sqrt2}{3}\,\pi$'],
    [r'$\big(2\sqrt{x}\big)^2 = 4x$, also $V = \pi \int_0^2 4x\,\mathrm{d}x = \pi \left[2x^2\right]_0^2$.',
     r'$= 8\pi$. Ohne Quadrat: $\pi \int_0^2 2\sqrt{x}\,\mathrm{d}x = \tfrac{8\sqrt2}{3}\,\pi$.'])

N.q(r'Berechne $\int_1^3 \tfrac1x\,\mathrm{d}x$ näherungsweise mit der Kepler’schen Fassregel.',
    [r'$\approx 1{,}111$', r'$\approx 1{,}333$', r'$1$', r'$\approx 1{,}099$'],
    [r'$\tfrac{3 - 1}{6}\left(\tfrac11 + 4 \cdot \tfrac12 + \tfrac13\right) = \tfrac13 \cdot \tfrac{10}{3}$.',
     r'$= \tfrac{10}{9} \approx 1{,}111$. Genau ist $\ln 3 \approx 1{,}099$; das Trapez gibt $1{,}333$, die Mittelpunktregel $1$.'])

N.q(r'Ein Intelligenztest ist normiert auf $\mu = 100$ und $\sigma = 15$. Wie groß ist der Anteil mit einem Wert über $130$ ungefähr?',
    [r'$2{,}3\,\%$', r'$4{,}6\,\%$', r'$15{,}9\,\%$', r'$0{,}1\,\%$'],
    [r'$130 = \mu + 2\sigma$; außerhalb von $\mu \pm 2\sigma$ liegen $4{,}6\,\%$.',
     r'Die Hälfte davon rechts: $\approx 2{,}3\,\%$.'])

N.q(r'$X \sim B(400;\ 0{,}2)$. Schätze $P(X \le 90)$ mit der Normalverteilung und Stetigkeitskorrektur.',
    [r'$\approx 0{,}905$', r'$\approx 0{,}894$', r'$\approx 0{,}095$', r'$\approx 0{,}841$'],
    [r'$\mu = 80$, $\sigma = \sqrt{400 \cdot 0{,}2 \cdot 0{,}8} = 8 > 3$, die Faustregel ist erfüllt.',
     r'$\Phi\!\left(\tfrac{90{,}5 - 80}{8}\right) = \Phi(1{,}31) \approx 0{,}905$. Ohne Korrektur: $\Phi(1{,}25) \approx 0{,}894$.'])

N.q(r'Eine Glockenkurve hat ihr Maximum bei $x = 60$ und Wendestellen bei $52$ und $68$. Welche Kenngrößen hat die Normalverteilung?',
    [r'$\mu = 60$, $\sigma = 8$', r'$\mu = 60$, $\sigma = 16$', r'$\mu = 60$, $\sigma = 64$', r'$\mu = 8$, $\sigma = 60$'],
    [r'Das Maximum liegt bei $\mu$, die Wendestellen bei $\mu \pm \sigma$.',
     r'$\mu = 60$ und $\sigma = 68 - 60 = 8$. $16$ ist der Abstand der Wendestellen, $64 = \sigma^2$ die Varianz.'])

put(Q, [gk('w14-klausur1.py', list(range(14))), N.take()])


def check():
    gk_checks()
    x = sp.symbols('x', positive=True)
    assert sp.simplify(sp.diff(-(5 - 2*x)**5 / 10, x) - (5 - 2*x)**4) == 0
    assert sp.expand(sp.diff((5 - 2*x)**4, x) + 8*(5 - 2*x)**3) == 0
    assert sp.pi*sp.integrate((2*sp.sqrt(x))**2, (x, 0, 2)) == 8*sp.pi
    assert sp.simplify(sp.pi*sp.integrate(2*sp.sqrt(x), (x, 0, 2)) - 8*sp.sqrt(2)/3*sp.pi) == 0
    fass = sp.Rational(2, 6) * (1 + 4*sp.Rational(1, 2) + sp.Rational(1, 3))
    assert fass == sp.Rational(10, 9) and round(float(fass), 3) == 1.111 and round(float(sp.log(3)), 3) == 1.099
    assert 1 * (1 + sp.Rational(1, 3)) == sp.Rational(4, 3) and 2 * sp.Rational(1, 2) == 1
    Z = NormalDist()
    assert round(1 - NormalDist(100, 15).cdf(130), 3) == 0.023 and round(2*(1 - Z.cdf(2)), 3) == 0.046
    s = (400 * 0.2 * 0.8) ** 0.5
    assert s == 8 and round(Z.cdf((90.5 - 80) / s), 3) == 0.905 and round(Z.cdf(10 / s), 3) == 0.894
    assert 68 - 60 == 60 - 52 == 8


Q.verify(check)
Q.save()
