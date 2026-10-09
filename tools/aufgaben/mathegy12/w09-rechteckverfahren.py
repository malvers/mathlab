#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 9 (Wahlbereich 5): Geschichte der
Integralrechnung und Rechteckverfahren - Links-, Rechts- und Mittelpunktsummen, Fehler,
Archimedes, Leibniz, Riemann. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
import sympy as sp
from fractions import Fraction as Fr
import math

Q = gy12(nr=9, slug='rechteckverfahren', thema='Rechteckverfahren und Geschichte der Integralrechnung', lb='WB 5',
         blurb='Links-, Rechts- und Mittelpunktsummen, Archimedes, Leibniz, Riemann',
         comment='Blocks: Rechtecksummen rechnen (1-5, 12, 13, 16, 18), Eigenschaften und Genauigkeit (6-8, 14, 17, 19), Geschichte (9-11), Tabellenkalkulation und Messwerte (15, 20). Taschenrechner erlaubt.')


def fig_mitte():
    p = S.Plot((-0.15, 1.15), (-0.12, 1.12), w=400, h=300)
    p.grid(0.25, 0.25)
    p.axes(0.25, 0.25, xlabel="x", ylabel="y")
    for k in range(4):
        a = 0.25 * k
        m = a + 0.125
        p.rect(p.X(a), p.Y(m * m), p.X(a + 0.25) - p.X(a), p.Y(0) - p.Y(m * m), fill=S.ORANGE, stroke=S.INK, width=1, opacity=0.5)
        p.circle(p.X(m), p.Y(m * m), 2.8)
    p.curve(lambda u: u * u, -0.1, 1.06, S.RED, 2.2)
    return p.svg("Mittelpunktsumme mit vier Rechtecken unter f(x) = x hoch 2 auf 0 bis 1")


Q.q(r'Das Intervall $[0;\ 2]$ wird in $n = 8$ gleich breite Streifen geteilt. Wie breit ist jeder Streifen?',
    [r'$\Delta x = 0{,}25$', r'$\Delta x = 0{,}5$', r'$\Delta x = 4$', r'$\Delta x = 0{,}125$'],
    [r'$\Delta x = \dfrac{b - a}{n} = \dfrac{2 - 0}{8}$.',
     r'$= 0{,}25$.'])

Q.q(r'Berechne für $f(x) = x^2$ auf $[0;\ 1]$ die Linkssumme mit $n = 4$ Streifen.',
    [r'$0{,}21875$', r'$0{,}46875$', r'$0{,}328125$', r'$0{,}875$'],
    [r'$\Delta x = 0{,}25$, linke Ränder $0$; $0{,}25$; $0{,}5$; $0{,}75$.',
     r'$0{,}25 \cdot (0 + 0{,}0625 + 0{,}25 + 0{,}5625) = 0{,}25 \cdot 0{,}875 = 0{,}21875$.'])

Q.q(r'Berechne für $f(x) = x^2$ auf $[0;\ 1]$ die Rechtssumme mit $n = 4$ Streifen.',
    [r'$0{,}46875$', r'$0{,}21875$', r'$1{,}875$', r'$0{,}34375$'],
    [r'Rechte Ränder $0{,}25$; $0{,}5$; $0{,}75$; $1$.',
     r'$0{,}25 \cdot (0{,}0625 + 0{,}25 + 0{,}5625 + 1) = 0{,}25 \cdot 1{,}875 = 0{,}46875$.'])

Q.q(r'Berechne für $f(x) = x^2$ auf $[0;\ 1]$ die Mittelpunktsumme mit $n = 4$ Streifen.',
    [r'$0{,}328125$', r'$0{,}34375$', r'$0{,}3125$', r'$1{,}3125$'],
    [r'Mittelpunkte $0{,}125$; $0{,}375$; $0{,}625$; $0{,}875$; Quadrate $0{,}015625$; $0{,}140625$; $0{,}390625$; $0{,}765625$.',
     r'Summe $1{,}3125$, mal $0{,}25$: $0{,}328125$.'],
    fig=fig_mitte(), figcap='Mittelpunktsumme: Rechteckhöhe ist der Funktionswert in der Streifenmitte')

Q.q(r'Der genaue Wert ist $\int_0^1 x^2\,\mathrm{d}x = \tfrac13$. Welche der drei Summen aus den Aufgaben 2 bis 4 liegt am nächsten daran?',
    [r'die Mittelpunktsumme', r'die Linkssumme', r'die Rechtssumme', r'alle drei gleich nah'],
    [r'Abweichungen: links $0{,}115$, rechts $0{,}135$, Mitte $0{,}005$.',
     r'Bei der Mittelpunktsumme gleichen sich Zuviel und Zuwenig in jedem Streifen fast aus.'])

Q.q(r'$f$ ist auf $[a;\ b]$ streng monoton steigend. Welche Aussage gilt für jede Streifenzahl $n$?',
    [r'Linkssumme $\le$ Integral $\le$ Rechtssumme', r'Rechtssumme $\le$ Integral $\le$ Linkssumme', r'Linkssumme $=$ Rechtssumme', r'Mittelpunktsumme $=$ Integral'],
    [r'Bei steigender Funktion ist der linke Rand eines Streifens der kleinste Wert darin.',
     r'Die Linkssumme ist dann eine Untersumme, die Rechtssumme eine Obersumme.'])

Q.q(r'Wie lautet die Linkssumme $L_n$ für $f$ auf $[a;\ b]$ mit $n$ Streifen der Breite $\Delta x$?',
    [r'$L_n = \Delta x \cdot \sum\limits_{i=0}^{n-1} f(a + i\,\Delta x)$', r'$L_n = \Delta x \cdot \sum\limits_{i=1}^{n} f(a + i\,\Delta x)$', r'$L_n = \sum\limits_{i=0}^{n-1} f(a + i\,\Delta x)$', r'$L_n = \Delta x \cdot \left(f(a) + f(b)\right)$'],
    [r'Die Stützstellen sind die linken Ränder $a, a + \Delta x, \ldots, a + (n - 1)\Delta x$.',
     r'Die Summe von $i = 1$ bis $n$ ist die Rechtssumme; ohne $\Delta x$ fehlt die Breite.'])

Q.q(r'Man verdoppelt bei der Linkssumme einer glatten, monotonen Funktion die Streifenzahl. Wie ändert sich der Fehler ungefähr?',
    [r'Er halbiert sich ungefähr.', r'Er viertelt sich ungefähr.', r'Er bleibt gleich.', r'Er verdoppelt sich.'],
    [r'Der Fehler der Links- und Rechtssumme wächst ungefähr mit $\Delta x$.',
     r'Halbe Breite, halber Fehler. Bei Mittelpunkt- und Trapezverfahren sinkt er schneller, etwa auf ein Viertel.'])

Q.q(r'Was zeigte Archimedes im 3. Jahrhundert v. Chr. über ein Parabelsegment?',
    [r'Es ist $\tfrac43$ so groß wie das Dreieck mit derselben Grundseite und Höhe.', r'Es ist halb so groß wie das umschließende Rechteck.', r'Es ist $\pi$-mal so groß wie das Dreieck.', r'Es lässt sich nicht berechnen.'],
    [r'Archimedes füllte das Segment mit immer kleineren Dreiecken; ihre Summe ist eine geometrische Reihe $1 + \tfrac14 + \tfrac{1}{16} + \ldots = \tfrac43$.',
     r'Probe: $\int_{-2}^2 (4 - x^2)\,\mathrm{d}x = \tfrac{32}{3}$, das Dreieck hat $\tfrac12 \cdot 4 \cdot 4 = 8$, und $\tfrac43 \cdot 8 = \tfrac{32}{3}$.'])

Q.q(r'Welche Vorstellung steckt in Leibniz’ Schreibweise $\int f(x)\,\mathrm{d}x$?',
    [r'eine Summe von Produkten $f(x) \cdot \mathrm{d}x$ über unendlich schmale Streifen', r'eine Ableitung von $f$ nach $x$', r'ein Produkt aus $f$ und $x$', r'ein Bruch aus $f$ und $\mathrm{d}x$'],
    [r'Das Zeichen $\int$ ist ein langgezogenes S für Summe, $\mathrm{d}x$ die Breite eines Streifens.',
     r'Rechteckhöhe $f(x)$ mal Breite $\mathrm{d}x$, alles aufsummiert: genau das Rechteckverfahren im Grenzfall.'])

Q.q(r'Was erlaubt die Riemann-Summe im Unterschied zu Links- oder Rechtssumme?',
    [r'In jedem Streifen eine beliebige Stelle als Höhe zu nehmen', r'Streifen beliebiger negativer Breite', r'Auf die Streifenbreite zu verzichten', r'Nur unstetige Funktionen'],
    [r'Riemann nimmt in jedem Teilintervall irgendeine Stelle $\xi_i$ und bildet $\sum f(\xi_i)\,\Delta x_i$.',
     r'Streben alle diese Summen bei feiner werdender Zerlegung gegen denselben Wert, ist das das Integral.'])

Q.q(r'Berechne die Linkssumme für $f(x) = \dfrac1x$ auf $[1;\ 2]$ mit $n = 2$ Streifen.',
    [r'$\approx 0{,}833$', r'$\approx 0{,}583$', r'$\approx 0{,}693$', r'$\approx 1{,}667$'],
    [r'$\Delta x = 0{,}5$, linke Ränder $1$ und $1{,}5$.',
     r'$0{,}5 \cdot \left(1 + \tfrac23\right) = \tfrac56 \approx 0{,}833$. Genau wäre $\ln 2 \approx 0{,}693$.'])

Q.q(r'Berechne die Rechtssumme für $f(x) = \dfrac1x$ auf $[1;\ 2]$ mit $n = 2$ Streifen.',
    [r'$\approx 0{,}583$', r'$\approx 0{,}833$', r'$\approx 0{,}708$', r'$\approx 1{,}167$'],
    [r'Rechte Ränder $1{,}5$ und $2$.',
     r'$0{,}5 \cdot \left(\tfrac23 + \tfrac12\right) = \tfrac{7}{12} \approx 0{,}583$.'])

Q.q(r'$f$ ist auf $[a;\ b]$ streng monoton fallend. Was ist dann die Linkssumme?',
    [r'eine Obersumme', r'eine Untersumme', r'genau das Integral', r'immer null'],
    [r'Bei fallender Funktion ist der linke Rand der größte Wert im Streifen.',
     r'Die Rechtecke ragen über den Graphen hinaus, siehe $\tfrac1x$ in Aufgabe 12.'])

Q.q(r'In einer Tabellenkalkulation sollen die Mittelpunkte der Streifen berechnet werden. Welche Stelle gehört zum $i$-ten Streifen ($i = 1, \ldots, n$)?',
    [r'$a + (i - 0{,}5)\,\Delta x$', r'$a + i\,\Delta x$', r'$a + (i - 1)\,\Delta x$', r'$\tfrac12 (a + b)$'],
    [r'Der $i$-te Streifen reicht von $a + (i - 1)\Delta x$ bis $a + i\,\Delta x$.',
     r'Seine Mitte liegt einen halben Streifen weiter als der linke Rand.'])

Q.q(r'Berechne die Mittelpunktsumme für $\sin x$ auf $[0;\ \pi]$ mit $n = 2$ Streifen.',
    [r'$\approx 2{,}221$', r'$2$', r'$\approx 1{,}571$', r'$\approx 1{,}414$'],
    [r'$\Delta x = \tfrac\pi2$, Mittelpunkte $\tfrac\pi4$ und $\tfrac{3\pi}{4}$, beide Sinuswerte $\tfrac{\sqrt2}{2}$.',
     r'$\tfrac\pi2 \cdot \sqrt2 \approx 2{,}221$. Der genaue Wert ist $2$.'])

Q.q(r'Für $f(x) = x$ auf $[0;\ 1]$ ist die Linkssumme $L_n = \dfrac{n - 1}{2n}$. Wie viele Streifen braucht man mindestens, damit der Fehler kleiner als $0{,}01$ ist?',
    [r'$n = 51$', r'$n = 50$', r'$n = 100$', r'$n = 10$'],
    [r'Fehler $\tfrac12 - \tfrac{n - 1}{2n} = \tfrac{1}{2n} < 0{,}01$ gibt $n > 50$.',
     r'Also mindestens $n = 51$. Bei $n = 50$ ist der Fehler genau $0{,}01$, nicht kleiner.'])

Q.q(r'$\int_0^1 \mathrm{e}^{-x^2}\,\mathrm{d}x$ hat keine elementare Stammfunktion. Was liefert die Mittelpunktsumme mit $n = 2$?',
    [r'$\approx 0{,}755$', r'$\approx 0{,}684$', r'$\approx 0{,}868$', r'$\approx 1{,}509$'],
    [r'Mittelpunkte $0{,}25$ und $0{,}75$: $\mathrm{e}^{-0{,}0625} \approx 0{,}9394$, $\mathrm{e}^{-0{,}5625} \approx 0{,}5698$.',
     r'$0{,}5 \cdot (0{,}9394 + 0{,}5698) \approx 0{,}755$. Der genaue Wert ist etwa $0{,}747$.'])

Q.q(r'Für welche Funktionen liefert die Mittelpunktsumme schon mit einem Streifen den genauen Wert?',
    [r'für lineare Funktionen', r'für alle quadratischen Funktionen', r'für alle monotonen Funktionen', r'für keine Funktion'],
    [r'Bei einer Geraden ist das Rechteck mit der Mittenhöhe flächengleich zum Trapez unter der Geraden.',
     r'Das Dreieck, das oben fehlt, ist genauso groß wie das, das übersteht.'])

Q.q(r'Ein Auto beschleunigt; gemessen wird $v = 0$; $4$; $7$; $9$ m/s nach $0$; $1$; $2$; $3$ s. Zwischen welchen Werten liegt der Weg in diesen $3$ s sicher?',
    [r'zwischen $11$ m und $20$ m', r'zwischen $0$ m und $9$ m', r'zwischen $15$ m und $16$ m', r'zwischen $20$ m und $27$ m'],
    [r'$v$ steigt: Linkssumme $1 \cdot (0 + 4 + 7) = 11$ m ist zu klein, Rechtssumme $1 \cdot (4 + 7 + 9) = 20$ m zu groß.',
     r'Der wahre Weg liegt dazwischen. Das Trapezverfahren nächste Woche schätzt $15{,}5$ m.'])


def check():
    x = sp.symbols('x')
    f = lambda u: u * u
    h = Fr(1, 4)
    L = h * sum(f(h * i) for i in range(4))
    R = h * sum(f(h * (i + 1)) for i in range(4))
    M = h * sum(f(h * i + h / 2) for i in range(4))
    assert Fr(2, 8) == Fr(1, 4) and L == Fr(7, 32) and R == Fr(15, 32) and M == Fr(21, 64)
    assert float(L) == 0.21875 and float(R) == 0.46875 and float(M) == 0.328125
    e = [abs(float(v) - 1/3) for v in (L, R, M)]
    assert min(e) == e[2] and abs(e[0] - 0.115) < 0.001 and abs(e[1] - 0.135) < 0.001
    assert sp.integrate(4 - x**2, (x, -2, 2)) == sp.Rational(32, 3) and sp.Rational(4, 3)*8 == sp.Rational(32, 3)
    assert Fr(1, 2) * (1 + Fr(2, 3)) == Fr(5, 6) and Fr(1, 2) * (Fr(2, 3) + Fr(1, 2)) == Fr(7, 12)
    m = math.pi / 2 * (math.sin(math.pi / 4) + math.sin(3 * math.pi / 4))
    assert abs(m - 2.221) < 0.0005
    n = sp.symbols('n', positive=True)
    assert sp.simplify(sp.Rational(1, 2) - (n - 1)/(2*n) - 1/(2*n)) == 0 and 1/(2*50) == 0.01 and 1/(2*51) < 0.01
    v = 0.5 * (math.exp(-0.0625) + math.exp(-0.5625))
    assert abs(v - 0.755) < 0.0005 and abs(float(sp.integrate(sp.exp(-x**2), (x, 0, 1))) - 0.747) < 0.0005
    assert 0 + 4 + 7 == 11 and 4 + 7 + 9 == 20 and 0/2 + 4 + 7 + 9/2 == 15.5


Q.verify(check)
Q.save()
