#!/usr/bin/env python3
"""Aufgaben Gymnasium Mathe 12 Grundkurs, Woche 5 (LB 5): Bestimmtes Integral als aus
Änderungen rekonstruierter Bestand - Zuflussraten, Geschwindigkeit und Weg, Ober- und
Untersummen, orientierter Flächeninhalt, Würdigung B. Riemann. Plan: HTML/svp/mathe/mathegy12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy12
import svgfig as S
import sympy as sp

Q = gy12(nr=5, slug='bestand', thema='Rekonstruierter Bestand', lb='LB 5',
         blurb='Änderungsraten, Bestand, Ober- und Untersummen, orientierter Flächeninhalt',
         comment='Blocks: Bestand aus konstanten und linearen Raten (1-4, 15), Ober- und Untersumme (5-7, 14), Bestand mit Startwert (8, 9, 18, 19), Anwendungen (12, 13, 16, 17, 20), Riemann und Deutung (10, 11). Mit Hilfsmitteln erlaubt.')


def fig_rate():
    """Inflow rate r(t) = 6 - 2t on [0;5]: positive until t = 3, negative afterwards."""
    p = S.Plot((-0.6, 5.6), (-5.2, 7.2), w=440, h=300)
    p.grid(1, 1)
    p.axes(1, 2, xlabel="t", ylabel="r")
    f = lambda u: 6 - 2 * u
    p.area(f, 0, 3, fill=S.GREEN, opacity=0.35)
    p.area(f, 3, 5, fill=S.RED, opacity=0.25)
    p.curve(f, 0, 5, S.INK, 2.2)
    return p.svg("Zuflussrate r(t) = 6 minus 2t, positiv bis t = 3, danach negativ")


def fig_summe(upper):
    p = S.Plot((-0.3, 2.4), (-0.4, 2.4), w=420, h=280)
    p.grid(0.5, 0.5)
    p.axes(1, 1, xlabel="x", ylabel="y")
    for k in range(4):
        a = 0.5 * k
        hh = a + 0.5 if upper else a
        if hh > 0:
            p.rect(p.X(a), p.Y(hh), p.X(a + 0.5) - p.X(a), p.Y(0) - p.Y(hh),
                   fill=S.GREEN if upper else S.ORANGE, stroke=S.INK, width=1, opacity=0.5)
    p.curve(lambda u: u, -0.2, 2.2, S.RED, 2.2)
    return p.svg("Graph von f(x) = x mit vier Rechtecken der %s auf dem Intervall 0 bis 2" % ("Obersumme" if upper else "Untersumme"))


FIG_R = fig_rate()

Q.q(r'In ein Becken fließen $5$ Minuten lang konstant $4$ Liter pro Minute. Wie viel Wasser fließt zu?',
    [r'$20$ l', r'$9$ l', r'$4$ l', r'$1{,}25$ l'],
    [r'Bestandsänderung = Rate mal Dauer: $4\ \tfrac{\text{l}}{\text{min}} \cdot 5$ min.',
     r'$= 20$ l, der Flächeninhalt des Rechtecks unter dem Graphen der Rate.'])

Q.q(r'Die Zuflussrate steigt gleichmäßig nach $r(t) = 2t$ (in l/min). Wie viel fließt in den ersten $5$ Minuten zu?',
    [r'$25$ l', r'$10$ l', r'$50$ l', r'$5$ l'],
    [r'Die Fläche unter $r$ ist ein Dreieck mit Grundseite $5$ und Höhe $r(5) = 10$.',
     r'$\tfrac12 \cdot 5 \cdot 10 = 25$ l, ebenso $\int_0^5 2t\,\mathrm{d}t = \left[t^2\right]_0^5 = 25$. $10$ l/min ist nur die Rate am Ende.'])

Q.q(r'Ein Auto fährt $3$ s lang mit $10$ m/s und bremst dann sofort auf $0$. Welcher Weg entspricht der Fläche unter dem Geschwindigkeitsgraphen?',
    [r'$30$ m', r'$13$ m', r'$3{,}3$ m', r'$10$ m'],
    [r'Weg = Geschwindigkeit mal Zeit, im $v$-$t$-Diagramm die Fläche unter dem Graphen.',
     r'$10\ \tfrac{\text{m}}{\text{s}} \cdot 3$ s $= 30$ m.'])

Q.q(r'Die Änderungsrate eines Wasserstands ist in einem Zeitraum negativ. Was bedeutet das?',
    [r'Der Wasserstand nimmt in dieser Zeit ab.', r'Der Wasserstand ist in dieser Zeit negativ.', r'Der Wasserstand ist in dieser Zeit konstant.', r'Der Wasserstand nimmt in dieser Zeit zu, aber langsamer.'],
    [r'Die Rate gibt an, wie schnell sich der Bestand ändert, nicht wie groß er ist.',
     r'Negative Rate: Es fließt mehr ab als zu, der Bestand sinkt. Er kann dabei trotzdem groß und positiv sein.'])

Q.q(r'Berechne für $f(x) = x$ auf $[0;\ 2]$ die Untersumme mit vier Rechtecken der Breite $0{,}5$.',
    [r'$1{,}5$', r'$2{,}5$', r'$3$', r'$2$'],
    [r'$f$ steigt, die Untersumme nimmt die Werte am linken Rand: $0$; $0{,}5$; $1$; $1{,}5$.',
     r'$0{,}5 \cdot (0 + 0{,}5 + 1 + 1{,}5) = 0{,}5 \cdot 3 = 1{,}5$. Ohne die Breite $0{,}5$ käme $3$ heraus.'],
    fig=fig_summe(False), figcap='Untersumme mit vier Rechtecken unter f(x) = x')

Q.q(r'Berechne für $f(x) = x$ auf $[0;\ 2]$ die Obersumme mit vier Rechtecken der Breite $0{,}5$.',
    [r'$2{,}5$', r'$1{,}5$', r'$5$', r'$2$'],
    [r'Obersumme: Werte am rechten Rand $0{,}5$; $1$; $1{,}5$; $2$.',
     r'$0{,}5 \cdot 5 = 2{,}5$.'],
    fig=fig_summe(True), figcap='Obersumme mit vier Rechtecken über f(x) = x')

Q.q(r'Der Flächeninhalt unter $f(x) = x$ über $[0;\ 2]$ liegt zwischen Untersumme $1{,}5$ und Obersumme $2{,}5$. Wie groß ist er genau?',
    [r'$2$', r'$1{,}5$', r'$2{,}5$', r'$4$'],
    [r'Die Fläche ist ein Dreieck: $\tfrac12 \cdot 2 \cdot 2 = 2$.',
     r'Mit dem Integral: $\int_0^2 x\,\mathrm{d}x = \left[\tfrac12 x^2\right]_0^2 = 2$, genau in der Mitte, weil $f$ linear ist.'])

Q.q(r'In einem Becken sind $100$ l. Die Zuflussrate ist $r(t) = 6 - 2t$ (l/min) für $0 \le t \le 5$. Wie viel Wasser ist nach $5$ Minuten im Becken?',
    [r'$105$ l', r'$109$ l', r'$95$ l', r'$104$ l'],
    [r'$B(5) = 100 + \int_0^5 (6 - 2t)\,\mathrm{d}t = 100 + \left[6t - t^2\right]_0^5 = 100 + 5$.',
     r'$= 105$ l: Bis $t = 3$ fließen $9$ l zu, danach $4$ l ab.'],
    fig=FIG_R, figcap='Zuflussrate r(t) = 6 − 2t: grün Zufluss, rot Abfluss')

Q.q(r'Beim Becken von eben ($100$ l, $r(t) = 6 - 2t$): Wann ist am meisten Wasser darin, und wie viel?',
    [r'nach $3$ min mit $109$ l', r'nach $5$ min mit $105$ l', r'nach $0$ min mit $100$ l', r'nach $3$ min mit $103$ l'],
    [r'Der Bestand wächst, solange $r > 0$, also bis $t = 3$.',
     r'$B(3) = 100 + \left[6t - t^2\right]_0^3 = 100 + 9 = 109$ l.'],
    fig=FIG_R, figcap='Zuflussrate r(t) = 6 − 2t: grün Zufluss, rot Abfluss')

Q.q(r'Welcher Mathematiker gab im 19. Jahrhundert eine strenge Definition des Integrals über Summen immer feinerer Zerlegungen?',
    [r'Bernhard Riemann', r'Euklid', r'Blaise Pascal', r'Carl Friedrich Gauß'],
    [r'Die Summen aus Rechteckinhalten, deren Grenzwert das Integral ist, heißen nach ihm Riemann-Summen.',
     r'Bernhard Riemann (1826–1866) lebte und arbeitete in Göttingen.'])

Q.q(r'Was bedeutet $\int_0^2 (x - 1)\,\mathrm{d}x = 0$ für die Flächen zwischen dem Graphen und der $x$-Achse?',
    [r'Die Fläche unter der Achse ist genauso groß wie die darüber.', r'Zwischen Graph und Achse liegt keine Fläche.', r'Der Graph verläuft auf der $x$-Achse.', r'Die Rechnung muss falsch sein.'],
    [r'Das Integral ist ein orientierter Flächeninhalt: unter der Achse negativ, darüber positiv.',
     r'Auf $[0;\ 1]$ liegt ein Dreieck mit $\tfrac12$ unter, auf $[1;\ 2]$ eines mit $\tfrac12$ über der Achse.'])

Q.q(r'Ein Körper bewegt sich mit $v(t) = 3t^2$ (m/s). Welchen Weg legt er im Zeitraum $[0;\ 2]$ zurück?',
    [r'$8$ m', r'$12$ m', r'$6$ m', r'$24$ m'],
    [r'$s = \int_0^2 3t^2\,\mathrm{d}t = \left[t^3\right]_0^2$.',
     r'$= 8$ m.'])

Q.q(r'Eine Pumpe arbeitet mit der Leistung $P(t) = 2 + 0{,}5t$ (in kW, $t$ in h). Wie viel Energie nimmt sie in den ersten $4$ Stunden auf?',
    [r'$12$ kWh', r'$4$ kWh', r'$16$ kWh', r'$8$ kWh'],
    [r'Energie ist das Integral der Leistung über die Zeit.',
     r'$\int_0^4 (2 + 0{,}5t)\,\mathrm{d}t = \left[2t + 0{,}25t^2\right]_0^4 = 8 + 4 = 12$ kWh.'])

Q.q(r'Für $f(x) = x^2$ auf $[0;\ 2]$ mit vier Streifen ist die Untersumme $1{,}75$ und die Obersumme $3{,}75$. Um wie viel unterscheiden sie sich, und warum?',
    [r'um $2 = (f(2) - f(0)) \cdot 0{,}5$', r'um $2 = f(2) - f(0)$, unabhängig von der Breite', r'um $\tfrac83$, den genauen Wert', r'um $0{,}5$, die Streifenbreite'],
    [r'Bei einer steigenden Funktion verschieben sich die Rechteckhöhen nur um einen Streifen.',
     r'Die Differenz ist (letzter Wert minus erster Wert) mal Breite: $(4 - 0) \cdot 0{,}5 = 2$. Halbiert man die Breite, halbiert sich der Unterschied.'])

Q.q(r'Eine Rate $r(t)$ ist in Liter pro Minute angegeben, $t$ in Minuten. Welche Einheit hat $\int_0^{10} r(t)\,\mathrm{d}t$?',
    [r'Liter', r'Liter pro Minute', r'Liter pro Minute²', r'Minuten'],
    [r'Beim Integrieren multipliziert man die Rate mit Zeitabschnitten.',
     r'$\tfrac{\text{l}}{\text{min}} \cdot \text{min} = \text{l}$: Das Integral ist eine Wassermenge.'])

Q.q(r'Eine Bakterienkultur wächst mit der Rate $w(t) = 30t$ Bakterien pro Stunde. Um wie viele Bakterien wächst sie in den ersten $4$ Stunden?',
    [r'$240$', r'$120$', r'$480$', r'$30$'],
    [r'$\int_0^4 30t\,\mathrm{d}t = \left[15t^2\right]_0^4$.',
     r'$= 15 \cdot 16 = 240$.'])

Q.q(r'Für $0 \le t \le 5$ gilt die Rate $r(t) = 3t^2 - 12t$ (l/min). Wie viel Wasser fließt zwischen $t = 0$ und $t = 4$ ab?',
    [r'$32$ l', r'$25$ l', r'$7$ l', r'$64$ l'],
    [r'$r(t) = 3t(t - 4) < 0$ für $0 < t < 4$: In dieser Zeit fließt Wasser ab.',
     r'$\int_0^4 (3t^2 - 12t)\,\mathrm{d}t = \left[t^3 - 6t^2\right]_0^4 = 64 - 96 = -32$, also fließen $32$ l ab.'])

Q.q(r'Die Rate $r(t) = 6 - 2t$ (l/min) gilt fünf Minuten lang. Wie groß ist die mittlere Rate in dieser Zeit?',
    [r'$1$ l/min', r'$5$ l/min', r'$3$ l/min', r'$0{,}2$ l/min'],
    [r'Mittlere Rate = Gesamtänderung durch Dauer: $\dfrac{1}{5}\int_0^5 (6 - 2t)\,\mathrm{d}t$.',
     r'$= \tfrac15 \cdot 5 = 1$ l/min. Den Mittelwert aus Anfangs- und Endrate $\tfrac{6 + (-4)}{2} = 1$ gibt es hier nur, weil $r$ linear ist.'])

Q.q(r'Der Bestand $B(t)$ eines Lagers ist bekannt. Wie erhält man daraus die Änderungsrate?',
    [r'als Ableitung $B^{\prime}(t)$', r'als Integral $\int B(t)\,\mathrm{d}t$', r'als Quotient $\dfrac{B(t)}{t}$', r'als Differenz $B(t) - B(0)$'],
    [r'Die Rate beschreibt die momentane Änderung: Sie ist die Ableitung des Bestands.',
     r'Umgekehrt rekonstruiert das Integral der Rate den Bestand. $\tfrac{B(t)}{t}$ wäre eine mittlere Rate ab $0$, nur wenn $B(0) = 0$.'])

Q.q(r'Ein Auto bremst mit $v(t) = 20 - 4t$ (m/s) bis zum Stillstand. Wie lang ist der Bremsweg?',
    [r'$50$ m', r'$100$ m', r'$20$ m', r'$5$ m'],
    [r'Stillstand bei $20 - 4t = 0$, also nach $5$ s.',
     r'$\int_0^5 (20 - 4t)\,\mathrm{d}t = \left[20t - 2t^2\right]_0^5 = 100 - 50 = 50$ m. $5$ s ist die Bremszeit.'])


def check():
    t, x = sp.symbols('t x')
    I = lambda f, a, b, v=t: sp.integrate(f, (v, a, b))
    assert 4*5 == 20 and I(2*t, 0, 5) == 25 and 2*5 == 10
    assert 10*3 == 30
    assert sp.Rational(1, 2)*(0 + sp.Rational(1, 2) + 1 + sp.Rational(3, 2)) == sp.Rational(3, 2)
    assert sp.Rational(1, 2)*(sp.Rational(1, 2) + 1 + sp.Rational(3, 2) + 2) == sp.Rational(5, 2)
    assert I(x, 0, 2, x) == 2
    assert 100 + I(6 - 2*t, 0, 5) == 105 and I(6 - 2*t, 0, 3) == 9 and I(6 - 2*t, 3, 5) == -4
    assert sp.solve(6 - 2*t, t) == [3]
    assert I(x - 1, 0, 2, x) == 0
    assert I(3*t**2, 0, 2) == 8 and I(2 + t/2, 0, 4) == 12
    h = sp.Rational(1, 2)
    assert h*sum((k*h)**2 for k in range(4)) == sp.Rational(7, 4) and h*sum(((k + 1)*h)**2 for k in range(4)) == sp.Rational(15, 4)
    assert sp.Rational(15, 4) - sp.Rational(7, 4) == (4 - 0)*h
    assert I(30*t, 0, 4) == 240 and I(3*t**2 - 12*t, 0, 4) == -32
    assert I(6 - 2*t, 0, 5)/5 == 1
    assert sp.solve(20 - 4*t, t) == [5] and I(20 - 4*t, 0, 5) == 50


Q.verify(check)
Q.save()
