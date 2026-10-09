#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 14 (Klausur 12/I): Wiederholung von
LB 5 Integralrechnung, Wahlbereich 5 Numerische Integration und LB 6 Beurteilende
Statistik in gemischter Reihenfolge. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import sympy as sp
from fractions import Fraction as Fr
from math import comb

Q = gy12(nr=14, slug='klausur1', thema='Wiederholung für Klausur 12/I', lb='Klausur',
         blurb='Integralrechnung, numerische Integration, Schätzen und Testen gemischt',
         comment='Blocks: Integrieren (1-6, 13, 14), Flächen und Bestand (7-9), numerische Verfahren (10-12), Schätzen (15, 16), Testen (17-20). Teil 1 bis 9 ohne Hilfsmittel.')


def cdf(n, p, k):
    return sum(comb(n, i) * p ** i * (1 - p) ** (n - i) for i in range(0, k + 1))


Q.q(r'Berechne $\int (6x^2 + 4x)\,\mathrm{d}x$.',
    [r'$2x^3 + 2x^2 + C$', r'$12x + 4 + C$', r'$6x^3 + 4x^2 + C$', r'$3x^3 + 2x^2 + C$'],
    [r'$6 \cdot \tfrac{x^3}{3} + 4 \cdot \tfrac{x^2}{2}$.',
     r'$= 2x^3 + 2x^2 + C$.'])

Q.q(r'Berechne $\int_0^2 (x^3 - x)\,\mathrm{d}x$.',
    [r'$2$', r'$6$', r'$0$', r'$4$'],
    [r'$\left[\tfrac14 x^4 - \tfrac12 x^2\right]_0^2 = 4 - 2$.',
     r'$= 2$.'])

Q.q(r'Berechne $\int \mathrm{e}^{3x}\,\mathrm{d}x$.',
    [r'$\tfrac13\,\mathrm{e}^{3x} + C$', r'$3\,\mathrm{e}^{3x} + C$', r'$\mathrm{e}^{3x} + C$', r'$\tfrac{1}{3x}\,\mathrm{e}^{3x} + C$'],
    [r'Lineare Verkettung, innere Ableitung $3$.',
     r'Probe: $\left(\tfrac13\,\mathrm{e}^{3x}\right)^{\prime} = \mathrm{e}^{3x}$ ✔'])

Q.q(r'Berechne $\int_1^{\mathrm{e}} \dfrac2x\,\mathrm{d}x$.',
    [r'$2$', r'$1$', r'$2\mathrm{e} - 2$', r'$\ln 2$'],
    [r'$\left[2\ln x\right]_1^{\mathrm{e}} = 2 \cdot 1 - 2 \cdot 0$.',
     r'$= 2$.'])

Q.q(r'Berechne $\int_0^{\pi/2} \sin x\,\mathrm{d}x$.',
    [r'$1$', r'$0$', r'$-1$', r'$2$'],
    [r'$\left[-\cos x\right]_0^{\pi/2} = -0 - (-1)$.',
     r'$= 1$.'])

Q.q(r'Welche Stammfunktion von $f(x) = 4x^3$ geht durch $(1 \mid 3)$?',
    [r'$F(x) = x^4 + 2$', r'$F(x) = x^4 + 3$', r'$F(x) = 12x^2 - 9$', r'$F(x) = 4x^4 - 1$'],
    [r'$F(x) = x^4 + C$, $1 + C = 3$.',
     r'$C = 2$.'])

Q.q(r'Berechne den Flächeninhalt zwischen dem Graphen von $f(x) = x^2 - 9$ und der $x$-Achse.',
    [r'$36$', r'$-36$', r'$18$', r'$72$'],
    [r'Nullstellen $\pm 3$: $\int_{-3}^3 (x^2 - 9)\,\mathrm{d}x = \left[\tfrac13 x^3 - 9x\right]_{-3}^3 = -18 - 18$.',
     r'$= -36$, die Fläche ist $36$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen $f(x) = x^2$ und $g(x) = x^3$ über $[0;\ 1]$.',
    [r'$\tfrac{1}{12}$', r'$\tfrac{7}{12}$', r'$\tfrac14$', r'$\tfrac13$'],
    [r'Auf $[0;\ 1]$ liegt $x^2$ oben.',
     r'$\int_0^1 (x^2 - x^3)\,\mathrm{d}x = \tfrac13 - \tfrac14 = \tfrac{1}{12}$.'])

Q.q(r'Ein Speicher enthält $50$ l. Die Rate ist $r(t) = 8 - 2t$ (l/min). Wie viel enthält er nach $6$ Minuten?',
    [r'$62$ l', r'$66$ l', r'$46$ l', r'$12$ l'],
    [r'$50 + \int_0^6 (8 - 2t)\,\mathrm{d}t = 50 + \left[8t - t^2\right]_0^6$.',
     r'$= 50 + 12 = 62$ l. Bis $t = 4$ fließen $16$ l zu, danach $4$ l ab.'])

Q.q(r'Berechne die Mittelpunktsumme für $x^3$ auf $[0;\ 2]$ mit $n = 2$ Streifen.',
    [r'$3{,}5$', r'$4$', r'$5$', r'$9$'],
    [r'$\Delta x = 1$, Mittelpunkte $0{,}5$ und $1{,}5$.',
     r'$1 \cdot (0{,}125 + 3{,}375) = 3{,}5$. Genau ist $4$.'])

Q.q(r'Berechne die Trapezsumme $T_2$ für $x^3$ auf $[0;\ 2]$.',
    [r'$5$', r'$4$', r'$3{,}5$', r'$9$'],
    [r'$1 \cdot \left(\tfrac02 + 1 + \tfrac82\right)$.',
     r'$= 5$.'])

Q.q(r'Für $x^3$ auf $[0;\ 2]$ ist $M_2 = 3{,}5$, $T_2 = 5$, genau $4$. Woran liegt es, dass die Mittelpunktsumme zu klein und die Trapezsumme zu groß ist?',
    [r'$x^3$ ist auf $[0;\ 2]$ linksgekrümmt.', r'$x^3$ ist auf $[0;\ 2]$ fallend.', r'$x^3$ ist punktsymmetrisch.', r'$x^3$ hat bei $0$ eine Nullstelle.'],
    [r'Linkskrümmung: Sehnen liegen über, Tangenten unter dem Graphen.',
     r'Trapeze überschätzen, Mittelpunktrechtecke (flächengleich zum Tangententrapez) unterschätzen.'])

Q.q(r'Bestimme die Integralfunktion $I(x) = \int_0^x \cos t\,\mathrm{d}t$.',
    [r'$I(x) = \sin x$', r'$I(x) = \sin x + C$', r'$I(x) = -\sin x$', r'$I(x) = \cos x - 1$'],
    [r'$I(x) = \left[\sin t\right]_0^x = \sin x - \sin 0$.',
     r'$= \sin x$, die untere Grenze legt die Konstante fest.'])

Q.q(r'Wie groß ist $\int_{-a}^{a} x^5\,\mathrm{d}x$ für jedes $a > 0$?',
    [r'$0$', r'$\tfrac13 a^6$', r'$2a^6$', r'$a^5$'],
    [r'$x^5$ ist punktsymmetrisch.',
     r'$\left[\tfrac16 x^6\right]_{-a}^a = \tfrac16 a^6 - \tfrac16 a^6 = 0$.'])

Q.q(r'Bei einer Kontrolle sind $48$ von $400$ Geräten fehlerhaft. Schätze den Fehleranteil.',
    [r'$12\,\%$', r'$48\,\%$', r'$8{,}3\,\%$', r'$1{,}2\,\%$'],
    [r'$\hat p = \tfrac{48}{400} = 0{,}12$.',
     r'Also etwa $12\,\%$.'])

Q.q(r'Berechne die Stichprobenvarianz $s^2 = \dfrac{1}{n - 1}\sum (x_i - \bar x)^2$ der Werte $12$; $15$; $9$; $14$.',
    [r'$s^2 = 7$', r'$s^2 = 5{,}25$', r'$s^2 = 21$', r'$s^2 = 2{,}65$'],
    [r'$\bar x = 12{,}5$, Abweichungen $-0{,}5$; $2{,}5$; $-3{,}5$; $1{,}5$, Quadratsumme $21$.',
     r'$s^2 = \tfrac{21}{3} = 7$. Mit $\tfrac1n$ wären es $5{,}25$.'])

Q.q(r'Rechtsseitiger Test, $n = 20$, $H_0\colon p = 0{,}3$, $\alpha = 5\,\%$. Es gilt $P(X \ge 9) \approx 0{,}113$ und $P(X \ge 10) \approx 0{,}048$. Wie lautet der Ablehnungsbereich?',
    [r'$K = \{10;\ \ldots;\ 20\}$', r'$K = \{9;\ \ldots;\ 20\}$', r'$K = \{6;\ \ldots;\ 20\}$', r'$K = \{0;\ \ldots;\ 10\}$'],
    [r'Kleinstes $k$ mit $P(X \ge k) \le 0{,}05$.',
     r'$k = 10$.'])

Q.q(r'Zweiseitiger Münztest, $n = 100$, $\alpha = 5\,\%$, $K = \{0;\ \ldots;\ 39\} \cup \{61;\ \ldots;\ 100\}$. Es fällt $37$-mal Zahl. Entscheidung?',
    [r'$H_0\colon p = 0{,}5$ wird abgelehnt.', r'$H_0$ wird nicht abgelehnt.', r'Die Münze ist bewiesen fair.', r'Der Test ist nicht anwendbar.'],
    [r'$37 \in \{0;\ \ldots;\ 39\}$.',
     r'Auffällig wenig Zahl: Ablehnung auf dem $5\,\%$-Niveau.'])

Q.q(r'Welche statistische Sicherheit hat ein Test mit dem Signifikanzniveau $\alpha = 1\,\%$?',
    [r'$99\,\%$', r'$1\,\%$', r'$95\,\%$', r'$90\,\%$'],
    [r'Statistische Sicherheit $= 1 - \alpha$.',
     r'$1 - 0{,}01 = 0{,}99$.'])

Q.q(r'Wie sieht der Ablehnungsbereich eines linksseitigen Tests aus?',
    [r'$K = \{0;\ 1;\ \ldots;\ k\}$', r'$K = \{k;\ \ldots;\ n\}$', r'$K = \{0;\ n\}$', r'$K = \{k\}$'],
    [r'Linksseitig sprechen nur auffällig kleine Werte gegen $H_0$.',
     r'Der kritische Wert $k$ ist der größte Wert im Ablehnungsbereich.'])


def check():
    x, t, a = sp.symbols('x t a', positive=True)
    I = lambda f, p, q, v=x: sp.integrate(f, (v, p, q))
    assert sp.integrate(6*x**2 + 4*x, x) == 2*x**3 + 2*x**2 and I(x**3 - x, 0, 2) == 2
    assert sp.simplify(sp.integrate(sp.exp(3*x), x) - sp.exp(3*x)/3) == 0 and I(2/x, 1, sp.E) == 2
    assert I(sp.sin(x), 0, sp.pi/2) == 1 and sp.solve(1 + sp.Symbol('C') - 3, sp.Symbol('C')) == [2]
    assert I(x**2 - 9, -3, 3) == -36 and I(x**2 - x**3, 0, 1) == sp.Rational(1, 12)
    assert 50 + I(8 - 2*t, 0, 6, t) == 62 and I(8 - 2*t, 0, 4, t) == 16 and I(8 - 2*t, 4, 6, t) == -4
    assert Fr(1, 8) + Fr(27, 8) == Fr(7, 2) and 0 + 1 + 4 == 5 and I(x**3, 0, 2) == 4
    assert sp.diff(x**3, x, 2) == 6*x
    assert I(sp.cos(t), 0, x, t) == sp.sin(x) and I(x**5, -a, a) == 0
    assert Fr(48, 400) == Fr(12, 100)
    xs = [12, 15, 9, 14]
    m = Fr(sum(xs), 4)
    q = sum((v - m) ** 2 for v in xs)
    assert m == Fr(25, 2) and q == 21 and q / 3 == 7 and q / 4 == Fr(21, 4)
    ge = lambda n, p, k: 1 - cdf(n, p, k - 1)
    assert ge(20, 0.3, 10) <= 0.05 < ge(20, 0.3, 9) and abs(ge(20, 0.3, 9) - 0.113) < 0.0005 and abs(ge(20, 0.3, 10) - 0.048) < 0.0005
    assert cdf(100, 0.5, 39) <= 0.025


Q.verify(check)
Q.save()
