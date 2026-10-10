#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 4 (LB 5): Lineare Substitution ohne Hilfsmittel,
mit CAS auch verkettete und verknüpfte Funktionen. 12 Fragen aus dem Grundkurs-Blatt
tools/aufgaben/mathegy12/w04-integrieren-cas.py (eine Quelle), 8 neue zur hilfsmittelfreien linearen
Substitution. Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=4, slug='lineare-substitution', thema='Lineare Substitution', lb='LB 5',
           blurb='∫ f(ax + b) dx ohne Hilfsmittel, Integrieren mit dem CAS und Probe durch Ableiten',
           comment='Blocks: lineare Substitution ohne Hilfsmittel (1-6 Grundkurs, 7-14 neu: Regel, Wurzel, Potenz im Nenner, cos, e, Fehler finden, bestimmte Integrale), CAS und Probe (15-20 Grundkurs).')

N = new()

N.q(r'Welche Regel gilt für $a \neq 0$, wenn $F$ eine Stammfunktion von $f$ ist?',
    [r'$\int f(ax + b)\,\mathrm{d}x = \tfrac1a\,F(ax + b) + C$', r'$\int f(ax + b)\,\mathrm{d}x = a\,F(ax + b) + C$',
     r'$\int f(ax + b)\,\mathrm{d}x = F(ax + b) + C$', r'$\int f(ax + b)\,\mathrm{d}x = \tfrac1a\,F(x) + b + C$'],
    [r'Probe durch Ableiten mit der Kettenregel: $\left(\tfrac1a\,F(ax + b)\right)^{\prime} = \tfrac1a\,f(ax + b) \cdot a$.',
     r'Das ergibt $f(ax + b)$ ✔. Die innere Ableitung $a$ wird beim Integrieren durch den Faktor $\tfrac1a$ ausgeglichen.'])

N.q(r'Berechne $\int \sqrt{4x + 1}\,\mathrm{d}x$.',
    [r'$\tfrac16\,(4x + 1)^{3/2} + C$', r'$\tfrac23\,(4x + 1)^{3/2} + C$', r'$\tfrac83\,(4x + 1)^{3/2} + C$', r'$\dfrac{1}{2\sqrt{4x + 1}} + C$'],
    [r'$\sqrt{4x + 1} = (4x + 1)^{1/2}$, äußere Stammfunktion $\tfrac23\,u^{3/2}$, dann durch die innere Ableitung $4$ teilen.',
     r'$\tfrac14 \cdot \tfrac23\,(4x + 1)^{3/2} = \tfrac16\,(4x + 1)^{3/2}$. Probe: $\tfrac16 \cdot \tfrac32\,(4x + 1)^{1/2} \cdot 4 = \sqrt{4x + 1}$ ✔'])

N.q(r'Berechne $\int \dfrac{1}{(3x - 2)^2}\,\mathrm{d}x$ für $x > \tfrac23$.',
    [r'$-\dfrac{1}{3\,(3x - 2)} + C$', r'$-\dfrac{1}{3x - 2} + C$', r'$\tfrac13 \ln(3x - 2) + C$', r'$-\dfrac{6}{(3x - 2)^3} + C$'],
    [r'$(3x - 2)^{-2}$: äußere Stammfunktion $\dfrac{u^{-1}}{-1} = -\dfrac1u$, dann durch $3$ teilen.',
     r'Ergebnis $-\dfrac{1}{3\,(3x - 2)} + C$. Der Logarithmus gehört zu $\dfrac{1}{3x - 2}$ ohne Quadrat, $-\dfrac{6}{(3x - 2)^3}$ ist die Ableitung.'])

N.q(r'Berechne $\int \cos(2x + \pi)\,\mathrm{d}x$.',
    [r'$\tfrac12 \sin(2x + \pi) + C$', r'$2 \sin(2x + \pi) + C$', r'$-\tfrac12 \sin(2x + \pi) + C$', r'$\sin(2x + \pi) + C$'],
    [r'Stammfunktion von $\cos u$ ist $\sin u$; innere Ableitung $2$.',
     r'$\tfrac12 \sin(2x + \pi) + C$. Probe: $\tfrac12 \cos(2x + \pi) \cdot 2 = \cos(2x + \pi)$ ✔'])

N.q(r'Berechne $\int \mathrm{e}^{1 - x}\,\mathrm{d}x$.',
    [r'$-\mathrm{e}^{1 - x} + C$', r'$\mathrm{e}^{1 - x} + C$', r'$\dfrac{\mathrm{e}^{1 - x}}{1 - x} + C$', r'$-x\,\mathrm{e}^{1 - x} + C$'],
    [r'Lineare Substitution mit $a = -1$: durch $-1$ teilen.',
     r'$-\mathrm{e}^{1 - x} + C$. Probe: $-\mathrm{e}^{1 - x} \cdot (-1) = \mathrm{e}^{1 - x}$ ✔'])

N.q(r'Jemand rechnet $\int \mathrm{e}^{3x}\,\mathrm{d}x = 3\,\mathrm{e}^{3x} + C$. Was stimmt?',
    [r'Falsch: Durch die innere Ableitung wird geteilt, richtig ist $\tfrac13\,\mathrm{e}^{3x} + C$.',
     r'Richtig, die innere Ableitung $3$ kommt als Faktor davor.',
     r'Falsch: Richtig ist $\tfrac{\mathrm{e}^{3x + 1}}{3x + 1} + C$ wie bei der Potenzregel.',
     r'Falsch: Richtig ist $\mathrm{e}^{3x} + C$, die $3$ fällt weg.'],
    [r'Probe durch Ableiten: $\left(3\,\mathrm{e}^{3x}\right)^{\prime} = 9\,\mathrm{e}^{3x} \neq \mathrm{e}^{3x}$.',
     r'$\left(\tfrac13\,\mathrm{e}^{3x}\right)^{\prime} = \mathrm{e}^{3x}$ ✔. Die Potenzregel gilt nicht für $\mathrm{e}^{u}$.'])

N.q(r'Berechne $\int_0^1 (2x + 1)^3\,\mathrm{d}x$.',
    [r'$10$', r'$20$', r'$40$', r'$\tfrac{81}{8}$'],
    [r'Stammfunktion $\tfrac12 \cdot \tfrac{(2x + 1)^4}{4} = \tfrac{(2x + 1)^4}{8}$.',
     r'$\tfrac{3^4}{8} - \tfrac{1^4}{8} = \tfrac{80}{8} = 10$. Ohne den Faktor $\tfrac12$ käme $20$ heraus, ohne untere Grenze $\tfrac{81}{8}$.'])

N.q(r'Berechne $\int_0^{\pi/4} \sin(2x)\,\mathrm{d}x$.',
    [r'$\tfrac12$', r'$1$', r'$-\tfrac12$', r'$2$'],
    [r'Stammfunktion $-\tfrac12 \cos(2x)$.',
     r'$-\tfrac12 \cos\tfrac{\pi}{2} + \tfrac12 \cos 0 = 0 + \tfrac12 = \tfrac12$.'])

put(Q, [gk('w04-integrieren-cas.py', [0, 1, 2, 3, 4, 5]), N.take(), gk('w04-integrieren-cas.py', [9, 11, 8, 12, 13, 16])])


def check():
    gk_checks()
    x, a, b = sp.symbols('x a b', positive=True)
    d = lambda e: sp.diff(e, x)
    assert sp.simplify(d(sp.sin(a*x + b)/a) - sp.cos(a*x + b)) == 0
    assert sp.simplify(d(sp.Rational(1, 6)*(4*x + 1)**sp.Rational(3, 2)) - sp.sqrt(4*x + 1)) == 0
    assert sp.simplify(d(-1/(3*(3*x - 2))) - 1/(3*x - 2)**2) == 0
    assert sp.simplify(d((3*x - 2)**-2) + 6/(3*x - 2)**3) == 0
    assert sp.simplify(d(sp.sin(2*x + sp.pi)/2) - sp.cos(2*x + sp.pi)) == 0
    assert sp.simplify(d(-sp.exp(1 - x)) - sp.exp(1 - x)) == 0
    assert sp.simplify(d(3*sp.exp(3*x)) - 9*sp.exp(3*x)) == 0
    assert sp.integrate((2*x + 1)**3, (x, 0, 1)) == 10
    assert sp.Rational(3**4 - 1, 4) == 20 and sp.Rational(3**4, 8) == sp.Rational(81, 8)
    assert sp.integrate(sp.sin(2*x), (x, 0, sp.pi/4)) == sp.Rational(1, 2)


Q.verify(check)
Q.save()
