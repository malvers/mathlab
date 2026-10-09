#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 10 (Wahlbereich 5): Trapezverfahren -
Herleitung, Rechnen, Über- und Unterschätzung bei Krümmung, Genauigkeit, Messwerte,
Integrale ohne Stammfunktion. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
import sympy as sp
from fractions import Fraction as Fr
import math

Q = gy12(nr=10, slug='trapezverfahren', thema='Trapezverfahren', lb='WB 5',
         blurb='Trapezsummen, Krümmung und Fehler, Messwerte, Vergleich der Verfahren',
         comment='Blocks: Trapezformel (1, 12, 19), Trapezsummen rechnen (2, 3, 6, 7, 10, 11, 18), Krümmung und Fehler (4, 5, 8, 9, 15-17), Messwerte (13, 14), Sinn numerischer Verfahren (20). Taschenrechner erlaubt.')


def fig_trapez():
    p = S.Plot((-0.25, 2.3), (-0.4, 4.4), w=420, h=300)
    p.grid(0.5, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    for a in (0, 1):
        pts = [p.P(a, 0), p.P(a, a * a), p.P(a + 1, (a + 1) ** 2), p.P(a + 1, 0)]
        p.poly(pts, stroke=S.INK, width=1, fill=S.GREEN, opacity=0.4)
    p.curve(lambda u: u * u, -0.2, 2.08, S.RED, 2.2)
    return p.svg("Zwei Trapeze unter der Parabel f(x) = x hoch 2 auf 0 bis 2, die Sehnen liegen über dem Graphen")


Q.q(r'Wie hängt die Trapezsumme $T_n$ mit der Links- und der Rechtssumme zusammen?',
    [r'$T_n = \tfrac12 (L_n + R_n)$', r'$T_n = L_n + R_n$', r'$T_n = R_n - L_n$', r'$T_n = \sqrt{L_n R_n}$'],
    [r'Ein Trapez mit den Höhen $f(x_{i-1})$ und $f(x_i)$ hat den Inhalt $\Delta x \cdot \tfrac{f(x_{i-1}) + f(x_i)}{2}$.',
     r'Aufsummiert ist das der Mittelwert aus Links- und Rechtssumme.'])

Q.q(r'Mit $L_4 = 0{,}21875$ und $R_4 = 0{,}46875$ für $\int_0^1 x^2\,\mathrm{d}x$: Wie groß ist $T_4$?',
    [r'$0{,}34375$', r'$0{,}6875$', r'$0{,}328125$', r'$0{,}25$'],
    [r'$T_4 = \tfrac12 (0{,}21875 + 0{,}46875)$.',
     r'$= 0{,}34375$. Der genaue Wert $\tfrac13$ liegt knapp darunter.'])

Q.q(r'Berechne $T_2$ für $f(x) = x^2$ auf $[0;\ 2]$.',
    [r'$3$', r'$\tfrac83$', r'$5$', r'$2{,}5$'],
    [r'$\Delta x = 1$: $T_2 = 1 \cdot \left(\tfrac{f(0)}{2} + f(1) + \tfrac{f(2)}{2}\right) = 0 + 1 + 2$.',
     r'$= 3$, etwas mehr als der genaue Wert $\tfrac83$.'],
    fig=fig_trapez(), figcap='Zwei Trapeze unter f(x) = x²: die oberen Kanten liegen über dem Graphen')

Q.q(r'Warum überschätzt das Trapezverfahren das Integral von $x^2$?',
    [r'Der Graph ist linksgekrümmt, die Sehnen liegen über ihm.', r'Weil $x^2$ steigt.', r'Weil die Streifen zu schmal sind.', r'Weil $x^2$ positiv ist.'],
    [r'Bei Linkskrümmung ($f^{\prime\prime} > 0$) liegt jede Sehne über dem Graphen.',
     r'Die Trapeze sind dann zu groß, egal ob die Funktion steigt oder fällt.'])

Q.q(r'Was gilt für das Trapezverfahren bei $f(x) = \sqrt{x}$ auf $[0;\ 4]$?',
    [r'Es unterschätzt das Integral.', r'Es überschätzt das Integral.', r'Es liefert genau den Wert.', r'Man kann es nicht anwenden.'],
    [r'$\sqrt{x}$ ist rechtsgekrümmt: Die Sehnen liegen unter dem Graphen.',
     r'Die Trapeze sind zu klein, siehe Aufgabe 18.'])

Q.q(r'Berechne $T_2$ für $f(x) = \dfrac1x$ auf $[1;\ 2]$.',
    [r'$\approx 0{,}708$', r'$\approx 0{,}693$', r'$\approx 0{,}833$', r'$\approx 0{,}583$'],
    [r'$\Delta x = 0{,}5$: $0{,}5 \cdot \left(\tfrac12 + \tfrac23 + \tfrac14\right) = 0{,}5 \cdot \tfrac{17}{12}$.',
     r'$= \tfrac{17}{24} \approx 0{,}708$, genau ist $\ln 2 \approx 0{,}693$.'])

Q.q(r'Berechne $T_1$ für $\mathrm{e}^x$ auf $[0;\ 1]$ (ein einziges Trapez).',
    [r'$\approx 1{,}859$', r'$\approx 1{,}718$', r'$\approx 3{,}718$', r'$\approx 1{,}359$'],
    [r'$T_1 = 1 \cdot \tfrac{\mathrm{e}^0 + \mathrm{e}^1}{2} = \tfrac{1 + \mathrm{e}}{2}$.',
     r'$\approx 1{,}859$; genau ist $\mathrm{e} - 1 \approx 1{,}718$.'])

Q.q(r'Für welche Funktionen ist das Trapezverfahren schon mit einem Trapez exakt?',
    [r'für lineare Funktionen', r'für quadratische Funktionen', r'für alle monotonen Funktionen', r'für Exponentialfunktionen'],
    [r'Unter einer Geraden ist die Fläche selbst ein Trapez.',
     r'Sobald der Graph gekrümmt ist, weicht die Sehne ab.'])

Q.q(r'Man verdoppelt beim Trapezverfahren für eine glatte Funktion die Streifenzahl. Wie ändert sich der Fehler ungefähr?',
    [r'Er sinkt ungefähr auf ein Viertel.', r'Er halbiert sich ungefähr.', r'Er bleibt gleich.', r'Er sinkt auf ein Achtel.'],
    [r'Der Fehler wächst beim Trapezverfahren etwa mit $(\Delta x)^2$.',
     r'Halbe Breite, etwa ein Viertel des Fehlers. Für $x^2$ auf $[0;\ 1]$ gilt sogar genau $T_n - \tfrac13 = \tfrac{1}{6n^2}$.'])

Q.q(r'Berechne $T_4$ für $\int_0^1 \mathrm{e}^{-x^2}\,\mathrm{d}x$ auf drei Nachkommastellen.',
    [r'$\approx 0{,}743$', r'$\approx 0{,}747$', r'$\approx 0{,}684$', r'$\approx 0{,}829$'],
    [r'Werte bei $0$; $0{,}25$; $0{,}5$; $0{,}75$; $1$: $1$; $0{,}9394$; $0{,}7788$; $0{,}5698$; $0{,}3679$.',
     r'$0{,}25 \cdot \left(\tfrac12 + 0{,}9394 + 0{,}7788 + 0{,}5698 + \tfrac{0{,}3679}{2}\right) \approx 0{,}743$; genau etwa $0{,}747$.'])

Q.q(r'Berechne $T_2$ für $\sin x$ auf $[0;\ \pi]$.',
    [r'$\dfrac{\pi}{2} \approx 1{,}571$', r'$2$', r'$\pi \approx 3{,}142$', r'$0$'],
    [r'$\Delta x = \tfrac\pi2$, Werte $0$; $1$; $0$.',
     r'$\tfrac\pi2 \cdot \left(0 + 1 + 0\right) = \tfrac\pi2$, deutlich weniger als der genaue Wert $2$, weil $\sin$ rechtsgekrümmt ist.'])

Q.q(r'Ein Trapez hat die parallelen Seiten $a$ und $c$ und die Höhe $h$. Wie groß ist sein Flächeninhalt?',
    [r'$A = \dfrac{a + c}{2} \cdot h$', r'$A = (a + c) \cdot h$', r'$A = a \cdot c \cdot h$', r'$A = \dfrac{a \cdot c}{2} \cdot h$'],
    [r'Mittellinie mal Höhe.',
     r'Im Trapezverfahren sind $a$ und $c$ zwei benachbarte Funktionswerte und $h = \Delta x$.'])

Q.q(r'Ein Fluss ist $8$ m breit. Alle $2$ m gemessen ist er $0$; $1{,}2$; $1{,}8$; $1{,}5$; $0$ m tief. Schätze die Querschnittsfläche mit dem Trapezverfahren.',
    [r'$9$ m²', r'$4{,}5$ m²', r'$18$ m²', r'$9{,}6$ m²'],
    [r'$T = 2 \cdot \left(\tfrac02 + 1{,}2 + 1{,}8 + 1{,}5 + \tfrac02\right)$.',
     r'$= 2 \cdot 4{,}5 = 9$ m². Ohne die Breite $2$ käme $4{,}5$ heraus.'])

Q.q(r'Aus $v = 0$; $4$; $7$; $9$ m/s nach $0$; $1$; $2$; $3$ s: Welchen Weg schätzt das Trapezverfahren?',
    [r'$15{,}5$ m', r'$20$ m', r'$11$ m', r'$31$ m'],
    [r'$1 \cdot \left(\tfrac02 + 4 + 7 + \tfrac92\right)$.',
     r'$= 15{,}5$ m, der Mittelwert aus Links- ($11$ m) und Rechtssumme ($20$ m).'])

Q.q(r'Für $\int_0^1 x^2\,\mathrm{d}x$ mit $n = 4$ ist $M_4 = 0{,}328125$ und $T_4 = 0{,}34375$. Welches Verfahren ist hier genauer?',
    [r'das Mittelpunktverfahren', r'das Trapezverfahren', r'beide gleich genau', r'keines von beiden'],
    [r'Abweichungen von $\tfrac13$: $M_4$ etwa $0{,}0052$, $T_4$ etwa $0{,}0104$.',
     r'Der Fehler der Mittelpunktsumme ist hier halb so groß und hat das andere Vorzeichen.'])

Q.q(r'Wie groß ist der Fehler $T_4 - \int_0^1 x^2\,\mathrm{d}x$ auf vier Nachkommastellen?',
    [r'$\approx 0{,}0104$', r'$\approx 0{,}0052$', r'$\approx 0{,}0208$', r'$\approx 0{,}3438$'],
    [r'$0{,}34375 - 0{,}33333 = 0{,}01042$.',
     r'Das ist genau $\tfrac{1}{6 \cdot 4^2} = \tfrac{1}{96}$.'])

Q.q(r'Für $\int_0^1 x^2\,\mathrm{d}x$ gilt $T_n - \tfrac13 = \dfrac{1}{6n^2}$. Ab welcher Streifenzahl ist der Fehler kleiner als $0{,}001$?',
    [r'ab $n = 13$', r'ab $n = 12$', r'ab $n = 167$', r'ab $n = 4$'],
    [r'$\tfrac{1}{6n^2} < 0{,}001$ gibt $n^2 > 166{,}7$.',
     r'$12^2 = 144$ reicht nicht, $13^2 = 169$ reicht: ab $n = 13$.'])

Q.q(r'Berechne $T_4$ für $\sqrt{x}$ auf $[0;\ 4]$ auf drei Nachkommastellen.',
    [r'$\approx 5{,}146$', r'$\approx 5{,}333$', r'$\approx 6{,}146$', r'$\approx 4{,}146$'],
    [r'$\Delta x = 1$: $\tfrac02 + 1 + \sqrt2 + \sqrt3 + \tfrac22 \approx 1 + 1{,}4142 + 1{,}7321 + 1$.',
     r'$\approx 5{,}146$, weniger als der genaue Wert $\tfrac{16}{3} \approx 5{,}333$: rechtsgekrümmt, Unterschätzung.'])

Q.q(r'Wie lautet die Trapezsumme mit $n$ Streifen und den Stützstellen $x_0 = a, x_1, \ldots, x_n = b$? Kurz: $f_k = f(x_k)$.',
    [r'$T_n = \Delta x \left(\tfrac12 f_0 + f_1 + \ldots + f_{n-1} + \tfrac12 f_n\right)$', r'$T_n = \Delta x \left(f_0 + f_1 + \ldots + f_n\right)$', r'$T_n = \tfrac12 \Delta x \left(f_0 + f_n\right)$', r'$T_n = \Delta x \left(f_1 + \ldots + f_n\right)$'],
    [r'Jeder innere Wert gehört zu zwei Trapezen und zählt ganz, die Randwerte gehören nur zu einem.',
     r'Darum stehen die Randwerte mit dem Faktor $\tfrac12$.'])

Q.q(r'Warum braucht man numerische Integration, obwohl es den Hauptsatz gibt?',
    [r'Viele Funktionen haben keine elementare Stammfunktion, und Messwerte liegen nur als Tabelle vor.', r'Weil der Hauptsatz nur für Geraden gilt.', r'Weil numerische Verfahren immer genauer sind.', r'Weil Integrale sonst negativ werden.'],
    [r'Beispiele: $\mathrm{e}^{-x^2}$ in der Statistik, Geschwindigkeitsmessungen, Querschnitte aus Lotungen.',
     r'Dann helfen nur Näherungen wie Rechteck- und Trapezverfahren, die Rechner im Hintergrund verwenden.'])


def check():
    x = sp.symbols('x')
    T = lambda f, a, b, n: (b - a) / n * (f(a) / 2 + sum(f(a + (b - a) * i / n) for i in range(1, n)) + f(b) / 2)
    assert Fr(1, 2) * (Fr(7, 32) + Fr(15, 32)) == Fr(11, 32) and 11 / 32 == 0.34375
    assert T(lambda u: u * u, Fr(0), Fr(2), 2) == 3
    assert T(lambda u: 1 / u, Fr(1), Fr(2), 2) == Fr(17, 24) and abs(17 / 24 - 0.708) < 0.0005
    assert abs((1 + math.e) / 2 - 1.859) < 0.0005
    t4 = T(lambda u: math.exp(-u * u), 0.0, 1.0, 4)
    assert abs(t4 - 0.743) < 0.0005
    assert abs(T(math.sin, 0.0, math.pi, 2) - math.pi / 2) < 1e-12
    assert 2 * (0 / 2 + 1.2 + 1.8 + 1.5 + 0 / 2) == 9
    assert abs(T(lambda u: u * u, Fr(0), Fr(1), 4) - Fr(1, 3) - Fr(1, 96)) == 0 and abs(1 / 96 - 0.0104) < 0.00005
    assert abs(21 / 64 - 1 / 3) < abs(11 / 32 - 1 / 3)
    for n in (4, 8, 12, 13):
        assert T(lambda u: u * u, Fr(0), Fr(1), n) - Fr(1, 3) == Fr(1, 6 * n * n)
    assert 1 / (6 * 144) > 0.001 > 1 / (6 * 169)
    s4 = T(math.sqrt, 0.0, 4.0, 4)
    assert abs(s4 - 5.146) < 0.0005 and abs(16 / 3 - 5.333) < 0.0005
    assert 0 / 2 + 4 + 7 + 9 / 2 == 15.5


Q.verify(check)
Q.save()
