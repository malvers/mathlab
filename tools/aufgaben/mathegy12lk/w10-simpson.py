#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Leistungskurs, Woche 10 (WB 5): Kepler'sche Fassregel und Formel von Simpson,
Vergleich der Verfahren (Konvergenz, Schnelligkeit). 17 Fragen neu, 3 aus dem Grundkurs-Blatt
tools/aufgaben/mathegy12/w10-trapezverfahren.py (eine Quelle). Plan: HTML/svp/mathe/mathegy12lk.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from quiz import gy12lk
from _reuse import gk, new, put, gk_checks
import sympy as sp

Q = gy12lk(nr=10, slug='simpson', thema='Fassregel und Simpson-Verfahren', lb='WB 5',
           blurb='Parabel statt Gerade: Kepler’sche Fassregel, Simpson-Summe, Fehler und Konvergenz im Vergleich',
           comment='Blocks: Fassregel (1-9: Formel, Idee, Kepler, exakt bis Grad 3, e hoch x, Weinfass), Simpson-Summe (10-13), Vergleich mit Mittelpunkt- und Trapezverfahren (14-17), Konvergenz (18-20). Mit Hilfsmitteln, 14, 16 und 19 aus dem Grundkurs.')

N = new()

N.q(r'Wie lautet die Kepler’sche Fassregel für $\int_a^b f(x)\,\mathrm{d}x$ mit der Mitte $m = \tfrac{a + b}{2}$?',
    [r'$\dfrac{b - a}{6}\big(f(a) + 4f(m) + f(b)\big)$', r'$\dfrac{b - a}{3}\big(f(a) + 4f(m) + f(b)\big)$',
     r'$\dfrac{b - a}{2}\big(f(a) + f(b)\big)$', r'$\dfrac{b - a}{6}\big(f(a) + 2f(m) + f(b)\big)$'],
    [r'Die Mitte zählt viermal, die Ränder je einmal; die Gewichte $1 + 4 + 1 = 6$ stehen im Nenner.',
     r'So liefert eine Konstante $c$ genau $(b - a) \cdot c$. $\tfrac{b - a}{2}\big(f(a) + f(b)\big)$ ist das Trapez.'])

N.q(r'Welche Idee steckt hinter der Fassregel?',
    [r'Durch die drei Punkte bei $a$, $m$ und $b$ legt man eine Parabel und integriert sie exakt.',
     r'Man verbindet $\big(a \mid f(a)\big)$ und $\big(b \mid f(b)\big)$ durch eine Gerade.',
     r'Man nimmt den Funktionswert in der Mitte als Rechteckhöhe.',
     r'Man ersetzt $f$ durch eine Exponentialfunktion durch drei Punkte.'],
    [r'Durch drei Punkte geht genau eine Parabel $p(x) = \alpha x^2 + \beta x + \gamma$.',
     r'Ihr Integral über $[a;\ b]$ ist genau $\tfrac{b - a}{6}\big(p(a) + 4p(m) + p(b)\big)$. Die Gerade gehört zum Trapez, die Rechteckhöhe zum Mittelpunktverfahren.'])

N.q(r'Woher hat die Kepler’sche Fassregel ihren Namen?',
    [r'Johannes Kepler bestimmte damit den Inhalt von Weinfässern.', r'Kepler berechnete damit die Flächen, die Planetenbahnen überstreichen.',
     r'Kepler fand damit das Fallgesetz.', r'Ein Fass hat drei Reifen, wie die drei Stützstellen.'],
    [r'Kepler kaufte 1613 Wein für seine Hochzeit und zweifelte an der Art, wie die Händler den Fassinhalt mit einem Stab schätzten.',
     r'Daraus wurde sein Buch über die Messung von Weinfässern (Quelle: J. Kepler, Nova stereometria doliorum vinariorum, Linz 1615).'])

N.q(r'Berechne $\int_0^2 x^2\,\mathrm{d}x$ mit der Fassregel.',
    [r'$\tfrac83$', r'$3$', r'$4$', r'$2$'],
    [r'$\tfrac{2 - 0}{6}\big(0^2 + 4 \cdot 1^2 + 2^2\big) = \tfrac13 \cdot 8$.',
     r'$= \tfrac83$, genau der Wert des Integrals: Eine Parabel wird exakt integriert. $4$ wäre das Trapez.'])

N.q(r'Was liefert die Fassregel für $\int_0^2 x^3\,\mathrm{d}x$?',
    [r'$4$, den genauen Wert', r'$\tfrac{14}{3}$', r'$5$', r'$\tfrac{10}{3}$'],
    [r'$\tfrac26\big(0 + 4 \cdot 1 + 8\big) = \tfrac13 \cdot 12 = 4$.',
     r'Genau: $\int_0^2 x^3\,\mathrm{d}x = \tfrac{16}{4} = 4$. Das Trapez mit zwei Streifen gibt $5$.'])

N.q(r'Für welche Funktionen ist die Fassregel immer exakt?',
    [r'für alle ganzrationalen Funktionen bis zum Grad $3$', r'nur für lineare Funktionen',
     r'nur für ganzrationale Funktionen bis zum Grad $2$', r'für alle stetigen Funktionen'],
    [r'Für Grad $\le 2$ ist $f$ selbst die Parabel durch die drei Punkte.',
     r'Für $x^3$ heben sich die Fehler symmetrisch zur Mitte auf (siehe die Aufgabe mit $\int_0^2 x^3\,\mathrm{d}x$). Bei $x^4$ gibt es einen Fehler.'])

N.q(r'Berechne $\int_0^1 \mathrm{e}^x\,\mathrm{d}x$ mit der Fassregel auf drei Nachkommastellen.',
    [r'$\approx 1{,}719$', r'$\approx 1{,}859$', r'$\approx 1{,}649$', r'$\approx 3{,}438$'],
    [r'$\tfrac16\big(\mathrm{e}^0 + 4\,\mathrm{e}^{0{,}5} + \mathrm{e}^1\big) = \tfrac16\,(1 + 6{,}595 + 2{,}718)$.',
     r'$\approx 1{,}719$. Trapez: $1{,}859$, Mittelpunkt: $1{,}649$, mit $\tfrac13$ statt $\tfrac16$: $3{,}438$.'])

N.q(r'Der genaue Wert ist $\int_0^1 \mathrm{e}^x\,\mathrm{d}x = \mathrm{e} - 1 \approx 1{,}71828$. Wie groß ist der Fehler der Fassregel ungefähr?',
    [r'$0{,}0006$', r'$0{,}14$', r'$0{,}07$', r'$0{,}006$'],
    [r'Fassregel $\approx 1{,}71886$, also Fehler $\approx 1{,}71886 - 1{,}71828$.',
     r'$\approx 0{,}0006$ mit nur drei Funktionswerten. Das Trapez liegt um $0{,}14$ daneben, die Mittelpunktregel um $0{,}07$.'])

N.q(r'Ein Fass ist $8$ dm hoch, der Boden- und der Deckelradius sind $3$ dm, der Radius in der Mitte $4$ dm. Schätze den Inhalt mit der Fassregel, angewandt auf die Querschnittsflächen $A = \pi r^2$.',
    [r'$\approx 343$ Liter', r'$\approx 226$ Liter', r'$\approx 402$ Liter', r'$\approx 308$ Liter'],
    [r'$V \approx \tfrac86\big(A_{\mathrm{Boden}} + 4A_{\mathrm{Mitte}} + A_{\mathrm{Deckel}}\big) = \tfrac86\,\pi\,(9 + 64 + 9)$.',
     r'$= \tfrac{8 \cdot 82}{6}\,\pi \approx 343\ \mathrm{dm}^3 \approx 343$ Liter. Zylinder mit $r = 3$: $226$, mit $r = 4$: $402$, mit $r = 3{,}5$: $308$.'])

N.q(r'Welche Formel ist die Simpson-Summe mit $n = 4$ Streifen der Breite $h$ und $f_k = f(x_k)$?',
    [r'$\tfrac{h}{3}\big(f_0 + 4f_1 + 2f_2 + 4f_3 + f_4\big)$', r'$\tfrac{h}{2}\big(f_0 + 2f_1 + 2f_2 + 2f_3 + f_4\big)$',
     r'$\tfrac{h}{3}\big(f_0 + 2f_1 + 4f_2 + 2f_3 + f_4\big)$', r'$\tfrac{h}{6}\big(f_0 + 4f_1 + 2f_2 + 4f_3 + f_4\big)$'],
    [r'Fassregel auf $[x_0;\ x_2]$ und $[x_2;\ x_4]$, jeweils Breite $2h$: $\tfrac{2h}{6}(f_0 + 4f_1 + f_2) + \tfrac{2h}{6}(f_2 + 4f_3 + f_4)$.',
     r'Zusammengefasst $\tfrac{h}{3}\big(f_0 + 4f_1 + 2f_2 + 4f_3 + f_4\big)$: innere Punkte abwechselnd $4$ und $2$. Mit $\tfrac{h}{2}$ und lauter $2$ ist es das Trapez.'])

N.q(r'Warum braucht die Simpson-Summe eine gerade Streifenzahl $n$?',
    [r'Je zwei benachbarte Streifen bilden einen Abschnitt, auf dem die Fassregel mit drei Punkten angewendet wird.',
     r'Sonst wäre die Schrittweite $h$ keine ganze Zahl.', r'Nur dann ist das Ergebnis positiv.', r'Bei ungeradem $n$ wird das Integral doppelt gezählt.'],
    [r'Jede Parabel braucht drei Stützstellen: Anfang, Mitte, Ende eines Doppelstreifens.',
     r'$n$ Streifen ergeben $\tfrac{n}{2}$ Doppelstreifen, das geht nur für gerades $n$.'])

N.q(r'Berechne die Simpson-Summe $S_4$ für $\int_1^2 \tfrac1x\,\mathrm{d}x$ auf vier Nachkommastellen.',
    [r'$\approx 0{,}6933$', r'$\approx 0{,}6970$', r'$\approx 0{,}6912$', r'$\approx 0{,}7500$'],
    [r'$h = 0{,}25$, $f = 1$; $0{,}8$; $0{,}6667$; $0{,}5714$; $0{,}5$.',
     r'$\tfrac{0{,}25}{3}\big(1 + 3{,}2 + 1{,}3333 + 2{,}2857 + 0{,}5\big) \approx 0{,}6933$. Das Trapez $T_4$ gibt $0{,}6970$, die Mittelpunktsumme $M_4$ gibt $0{,}6912$.'])

N.q(r'Der genaue Wert ist $\int_1^2 \tfrac1x\,\mathrm{d}x = \ln 2 \approx 0{,}69315$. Wie groß ist der Fehler von $S_4$ ungefähr?',
    [r'$0{,}0001$', r'$0{,}0039$', r'$0{,}0019$', r'$0{,}01$'],
    [r'$S_4 \approx 0{,}69325$, also Fehler $\approx 0{,}0001$.',
     r'Mit denselben fünf Funktionswerten liegt $T_4$ um $0{,}0039$ daneben, $M_4$ um $0{,}0019$: Simpson ist um eine Größenordnung genauer.'])

N.q(r'Für $\int_0^1 x^2\,\mathrm{d}x$ ist $M_4 = 0{,}328125$ und $T_4 = 0{,}34375$. Berechne $\tfrac13\,(2M_4 + T_4)$.',
    [r'$\tfrac13$, der genaue Wert', r'$\approx 0{,}3359$', r'$\approx 0{,}3385$', r'$\approx 0{,}6719$'],
    [r'$\tfrac13\,(0{,}65625 + 0{,}34375) = \tfrac13 \cdot 1 = \tfrac13$.',
     r'Allgemein gilt $S_{2n} = \tfrac13\,(2M_n + T_n)$: Die Simpson-Summe gewichtet die Fehler von Mittelpunkt- und Trapezverfahren so, dass sie sich aufheben. Der einfache Mittelwert gibt $0{,}3359$.'])

N.q(r'Berechne die Simpson-Summe $S_4$ für $\int_0^1 \mathrm{e}^{-x^2}\,\mathrm{d}x$ auf drei Nachkommastellen.',
    [r'$\approx 0{,}747$', r'$\approx 0{,}743$', r'$\approx 0{,}749$', r'$\approx 0{,}760$'],
    [r'$h = 0{,}25$, $f \approx 1$; $0{,}9394$; $0{,}7788$; $0{,}5698$; $0{,}3679$.',
     r'$\tfrac{0{,}25}{3}\big(1 + 3{,}7577 + 1{,}5576 + 2{,}2791 + 0{,}3679\big) \approx 0{,}747$. Das Trapez $T_4$ gibt $0{,}743$, $M_4$ gibt $0{,}749$; genau sind es $0{,}7468$.'])

N.q(r'Man halbiert bei der Simpson-Summe für eine glatte Funktion die Streifenbreite $h$. Um welchen Faktor wird der Fehler etwa kleiner?',
    [r'$16$', r'$4$', r'$2$', r'$8$'],
    [r'Der Fehler der Simpson-Summe ist proportional zu $h^4$.',
     r'$\left(\tfrac12\right)^4 = \tfrac{1}{16}$. Beim Trapez- und Mittelpunktverfahren (Fehler $\sim h^2$) ist es nur der Faktor $4$.'])

N.q(r'Für $\int_0^1 x^4\,\mathrm{d}x$ gilt $S_n - \tfrac15 = \dfrac{2}{15\,n^4}$ ($n$ gerade). Ab welchem geraden $n$ ist der Fehler kleiner als $0{,}0001$?',
    [r'ab $n = 8$', r'ab $n = 6$', r'ab $n = 4$', r'ab $n = 14$'],
    [r'$\dfrac{2}{15\,n^4} < 0{,}0001$ heißt $n^4 > 1333{,}3$, also $n > 6{,}04$.',
     r'$n = 6$: $\tfrac{2}{19\,440} \approx 0{,}000103$ ist noch zu groß; das nächste gerade $n$ ist $8$. Zum Vergleich braucht das Trapez schon bei $x^2$ für $0{,}001$ dreizehn Streifen.'])

put(Q, [N.take(0, 13), gk('w10-trapezverfahren.py', [14]), N.take(13, 14), gk('w10-trapezverfahren.py', [9]), N.take(14, 16),
        gk('w10-trapezverfahren.py', [16]), N.take(16)])


def check():
    gk_checks()
    x = sp.symbols('x')
    fass = lambda f, a, b: (b - a) / sp.Integer(6) * (f.subs(x, a) + 4*f.subs(x, (a + b) / sp.Integer(2)) + f.subs(x, b))
    def simpson(f, a, b, n):
        h = (b - a) / sp.Integer(n)
        w = [1] + [4 if k % 2 else 2 for k in range(1, n)] + [1]
        return h / 3 * sum(wk * f.subs(x, a + k*h) for k, wk in enumerate(w))
    def trap(f, a, b, n):
        h = (b - a) / sp.Integer(n)
        return h * (f.subs(x, a)/2 + sum(f.subs(x, a + k*h) for k in range(1, n)) + f.subs(x, b)/2)
    def mid(f, a, b, n):
        h = (b - a) / sp.Integer(n)
        return h * sum(f.subs(x, a + (k + sp.Rational(1, 2))*h) for k in range(n))
    # Fassregel exact up to degree 3
    for p in (sp.Integer(1), x, x**2, x**3):
        assert sp.simplify(fass(p, 0, 2) - sp.integrate(p, (x, 0, 2))) == 0
    assert fass(x**4, 0, 2) != sp.integrate(x**4, (x, 0, 2))
    assert fass(x**2, 0, 2) == sp.Rational(8, 3) and trap(x**2, 0, 2, 1) == 4
    assert fass(x**3, 0, 2) == 4 and trap(x**3, 0, 2, 2) == 5
    e = sp.exp(x)
    assert round(float(fass(e, 0, 1)), 3) == 1.719 and round(float(trap(e, 0, 1, 1)), 3) == 1.859 and round(float(mid(e, 0, 1, 1)), 3) == 1.649
    assert round(float(2*fass(e, 0, 1)), 3) == 3.438
    assert abs(float(fass(e, 0, 1) - (sp.E - 1)) - 0.0006) < 0.00005
    assert abs(float(trap(e, 0, 1, 1) - (sp.E - 1)) - 0.14) < 0.005 and abs(float((sp.E - 1) - mid(e, 0, 1, 1)) - 0.07) < 0.005
    # barrel: cross sections pi r^2 at bottom, middle, top
    fassV = sp.Rational(8, 6) * sp.pi * (9 + 4*16 + 9)
    assert round(float(fassV)) == 343 and round(float(9*sp.pi*8)) == 226 and round(float(16*sp.pi*8)) == 402 and round(float(sp.Rational(49, 4)*sp.pi*8)) == 308
    # Simpson from two Fassregel pieces
    assert simpson(1/x, 1, 2, 4) == fass(1/x, 1, sp.Rational(3, 2)) + fass(1/x, sp.Rational(3, 2), 2)
    S4, T4, M4 = simpson(1/x, 1, 2, 4), trap(1/x, 1, 2, 4), mid(1/x, 1, 2, 4)
    assert round(float(S4), 4) == 0.6933 and round(float(T4), 4) == 0.6970 and round(float(M4), 4) == 0.6912
    assert round(float(S4 - sp.log(2)), 4) == 0.0001 and round(float(T4 - sp.log(2)), 4) == 0.0039 and round(float(sp.log(2) - M4), 4) == 0.0019
    assert mid(x**2, 0, 1, 4) == sp.Rational(21, 64) and trap(x**2, 0, 1, 4) == sp.Rational(11, 32)
    assert (2*mid(x**2, 0, 1, 4) + trap(x**2, 0, 1, 4)) / 3 == sp.Rational(1, 3) == simpson(x**2, 0, 1, 8)
    assert sp.simplify((2*mid(1/x, 1, 2, 4) + trap(1/x, 1, 2, 4)) / 3 - simpson(1/x, 1, 2, 8)) == 0
    assert round((0.328125 + 0.34375) / 2, 4) == 0.3359 and round((0.328125 + 2*0.34375) / 3, 4) == 0.3385
    g = sp.exp(-x**2)
    assert round(float(simpson(g, 0, 1, 4)), 3) == 0.747 and round(float(trap(g, 0, 1, 4)), 3) == 0.743 and round(float(mid(g, 0, 1, 4)), 3) == 0.749
    assert round(float(sp.Integral(g, (x, 0, 1)).evalf()), 4) == 0.7468
    # error ~ h^4: halving h shrinks the error by about 16
    E = lambda n: float(simpson(e, 0, 1, n) - (sp.E - 1))
    assert 15 < E(4) / E(8) < 17
    for n in (2, 4, 6, 8):
        assert sp.simplify(simpson(x**4, 0, 1, n) - sp.Rational(1, 5) - sp.Rational(2, 15) / n**4) == 0
    assert sp.Rational(2, 15) / 6**4 > sp.Rational(1, 10000) > sp.Rational(2, 15) / 8**4


Q.verify(check)
Q.save()
