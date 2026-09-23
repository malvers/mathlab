#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 23 (LB 3): Bestimmtes Integral und Hauptsatz -
Ober- und Untersumme, Integral als Flächeninhalt, Hauptsatz der Differenzial- und
Integralrechnung, orientierter Flächeninhalt, Eigenschaften des Integrals, Deutung in
Kontexten. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=23, slug='hauptsatz', thema='Bestimmtes Integral und Hauptsatz', lb='LB 3',
          blurb='Integral als Flächeninhalt, Hauptsatz, orientierter Flächeninhalt',
          comment='Blocks: Ober- und Untersumme, Deutung (1-3), Hauptsatz rechnen (4-10), orientierter Flächeninhalt und Eigenschaften (11-15), Anwendungen (16-20). Alles ohne CAS.')


# ----------------------------------------------------------------- figures ----
def fig_summe(upper):
    """f(x) = x^2 on [0;2] with four rectangles of width 0.5 - lower or upper sum."""
    p = S.Plot((-0.45, 2.55), (-0.6, 4.6), w=440, h=300)
    p.grid(0.5, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    for k in range(4):
        a = 0.5 * k
        h = (a + 0.5) ** 2 if upper else a * a
        if h > 0:
            p.rect(p.X(a), p.Y(h), p.X(a + 0.5) - p.X(a), p.Y(0) - p.Y(h),
                   fill=S.GREEN if upper else S.ORANGE, stroke=S.INK, width=1, opacity=0.5)
    p.curve(lambda u: u * u, -0.35, 2.12, S.RED, 2.2)
    return p.svg("Graph von f(x) = x hoch 2 mit vier Rechtecken der %s auf dem Intervall 0 bis 2"
                 % ("Obersumme" if upper else "Untersumme"))


def fig_orientiert():
    """f(x) = x^2 - 1 on [-1;2]: one part below, one part above the x-axis."""
    p = S.Plot((-1.9, 2.6), (-1.6, 3.6), w=460, h=300)
    p.grid(1, 1)
    p.axes(1, 1, xlabel="x", ylabel="y")
    f = lambda u: u * u - 1
    p.area(f, -1, 1, fill=S.RED, opacity=0.25)
    p.area(f, 1, 2, fill=S.GREEN, opacity=0.35)
    p.curve(f, -1.8, 2.15, S.RED, 2.2)
    p.text(p.X(0), p.Y(-0.45), "A1", 13, S.INK, italic=True, halo=S.PAPER)
    p.text(p.X(1.7), p.Y(0.7), "A2", 13, S.INK, italic=True, halo=S.PAPER)
    return p.svg("Graph von f(x) = x hoch 2 minus 1 mit einer Fläche unter und einer Fläche über der x-Achse")


FIG_U = fig_summe(False)
FIG_O = fig_summe(True)
FIG_OR = fig_orientiert()

# --------------------------------------------- Ober- und Untersumme, Deutung ----
Q.q(r'Der Flächeninhalt unter dem Graphen von $f(x) = x^2$ über $[0;2]$ wird mit vier Rechtecken der Breite $0{,}5$ angenähert. Berechne die Untersumme $U_4$.',
    [r'$U_4 = 1{,}75$', r'$U_4 = 3{,}75$', r'$U_4 = 3{,}5$', r'$U_4 = 2{,}67$'],
    [r'Untersumme: Jedes Rechteck ist so hoch wie der kleinste Funktionswert im Teilintervall - hier am linken Rand, weil $f$ dort steigt.',
     r'$U_4 = 0{,}5 \cdot \left(f(0) + f(0{,}5) + f(1) + f(1{,}5)\right) = 0{,}5 \cdot (0 + 0{,}25 + 1 + 2{,}25)$',
     r'$U_4 = 0{,}5 \cdot 3{,}5 = 1{,}75$. Falle: die Breite $0{,}5$ vergessen ($3{,}5$).'],
    fig=FIG_U, figcap='Untersumme: vier Rechtecke unter dem Graphen von f(x) = x² über [0; 2]')

Q.q(r'Berechne für $f(x) = x^2$ über $[0;2]$ die Obersumme $O_4$ mit vier Rechtecken der Breite $0{,}5$.',
    [r'$O_4 = 3{,}75$', r'$O_4 = 1{,}75$', r'$O_4 = 7{,}5$', r'$O_4 = 2{,}67$'],
    [r'Obersumme: Jedes Rechteck ist so hoch wie der größte Funktionswert im Teilintervall - hier am rechten Rand.',
     r'$O_4 = 0{,}5 \cdot \left(f(0{,}5) + f(1) + f(1{,}5) + f(2)\right) = 0{,}5 \cdot (0{,}25 + 1 + 2{,}25 + 4) = 0{,}5 \cdot 7{,}5$',
     r'$O_4 = 3{,}75$. Der wahre Flächeninhalt liegt zwischen $U_4 = 1{,}75$ und $O_4 = 3{,}75$.'],
    fig=FIG_O, figcap='Obersumme: vier Rechtecke über dem Graphen von f(x) = x² über [0; 2]')

Q.q(r'Für $f(x) \geq 0$ auf $[a;b]$: Was beschreibt das bestimmte Integral $\int_a^b f(x)\,dx$?',
    [r'Den Flächeninhalt zwischen dem Graphen von $f$ und der $x$-Achse über $[a;b]$.',
     r'Die Steigung des Graphen von $f$ an der Stelle $b$.',
     r'Die Differenz der Funktionswerte $f(b) - f(a)$.',
     r'Die Länge des Graphen von $f$ zwischen $a$ und $b$.'],
    [r'Ober- und Untersumme schließen die Fläche ein; bei immer feinerer Zerlegung streben beide gegen denselben Wert - das Integral.',
     r'Deshalb: Integral als Flächeninhalt, solange der Graph über der $x$-Achse liegt.',
     r'Die Steigung gehört zur Ableitung, nicht zum Integral. $f(b) - f(a)$ ist nicht $F(b) - F(a)$.'])

# ------------------------------------------------------- Hauptsatz rechnen ----
Q.q(r'Berechne $\int_0^2 x^2\,dx$ mit dem Hauptsatz.',
    [r'$\dfrac{8}{3}$', r'$8$', r'$4$', r'$\dfrac{4}{3}$'],
    [r'Stammfunktion: $F(x) = \dfrac{x^3}{3}$',
     r'Hauptsatz: $\int_0^2 x^2\,dx = F(2) - F(0) = \dfrac{8}{3} - 0 = \dfrac{8}{3} \approx 2{,}67$',
     r'Das liegt zwischen $U_4 = 1{,}75$ und $O_4 = 3{,}75$ aus den Aufgaben 1 und 2 - passt. $8$ vergisst das Teilen durch $3$, $4$ ist $f(2)$.'])

Q.q(r'Berechne $\int_1^3 2x\,dx$.',
    [r'$8$', r'$9$', r'$6$', r'$4$'],
    [r'$F(x) = x^2$, also $\int_1^3 2x\,dx = F(3) - F(1) = 9 - 1$',
     r'$= 8$',
     r'Falle: $F(1)$ vergessen ($9$) oder $f(3) = 6$ einsetzen.'])

Q.q(r'Berechne $\int_0^1 (3x^2 + 1)\,dx$.',
    [r'$2$', r'$4$', r'$1$', r'$3$'],
    [r'$F(x) = x^3 + x$',
     r'$F(1) - F(0) = (1 + 1) - 0 = 2$',
     r'$4$ wäre $f(1)$, nicht das Integral.'])

Q.q(r'Berechne $\int_1^2 \dfrac{1}{x^2}\,dx$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'$-\dfrac{3}{2}$', r'$\dfrac{1}{4}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$, Stammfunktion $F(x) = \dfrac{x^{-1}}{-1} = -\dfrac{1}{x}$',
     r'$F(2) - F(1) = -\dfrac{1}{2} - (-1) = -\dfrac{1}{2} + 1 = \dfrac{1}{2}$',
     r'Das Minus in $F$ und das Minus im Hauptsatz sorgfältig auseinanderhalten - der Graph liegt über der Achse, das Ergebnis muss positiv sein.'])

Q.q(r'Berechne $\int_1^2 (x^3 - 3x + 2)\,dx$.',
    [r'$\dfrac{5}{4}$', r'$2$', r'$\dfrac{11}{4}$', r'$-\dfrac{5}{4}$'],
    [r'$F(x) = \dfrac{x^4}{4} - \dfrac{3}{2}x^2 + 2x$',
     r'$F(2) = 4 - 6 + 4 = 2$ und $F(1) = \dfrac{1}{4} - \dfrac{3}{2} + 2 = \dfrac{3}{4}$',
     r'$F(2) - F(1) = 2 - \dfrac{3}{4} = \dfrac{5}{4}$. Falle: $F(1)$ vergessen ($2$) oder addieren ($\dfrac{11}{4}$).'])

Q.q(r'Berechne $\int_0^2 (x - 2)\,dx$.',
    [r'$-2$', r'$2$', r'$0$', r'$-4$'],
    [r'$F(x) = \dfrac{x^2}{2} - 2x$, also $F(2) - F(0) = (2 - 4) - 0 = -2$',
     r'Das Integral ist negativ, weil der Graph auf $[0;2]$ unter der $x$-Achse liegt.',
     r'Die Fläche zwischen Graph und Achse beträgt $2\,\mathrm{FE}$ (Dreieck), das Integral als orientierter Flächeninhalt ist $-2$.'])

Q.q(r'Berechne $\int_{-2}^{2} x^3\,dx$.',
    [r'$0$', r'$8$', r'$4$', r'$-8$'],
    [r'$F(x) = \dfrac{x^4}{4}$, $F(2) = 4$ und $F(-2) = \dfrac{16}{4} = 4$',
     r'$F(2) - F(-2) = 4 - 4 = 0$',
     r'Der Graph ist punktsymmetrisch zum Ursprung: Die Fläche links unter der Achse und rechts über der Achse sind gleich groß und heben sich im Integral auf.'])

# --------------------------------- orientierter Flächeninhalt, Eigenschaften ----
Q.q(r'Berechne $\int_{-1}^{2} (x^2 - 1)\,dx$ und deute das Ergebnis mit Hilfe der Abbildung.',
    [r'$0$ - die Teilfläche $A_1$ unter der Achse und $A_2$ über der Achse sind gleich groß und heben sich auf.',
     r'$\dfrac{8}{3}$ - der gesamte Flächeninhalt zwischen Graph und Achse.',
     r'$\dfrac{2}{3}$ - der Wert der Stammfunktion an der oberen Grenze.',
     r'$-\dfrac{4}{3}$ - nur die Teilfläche unter der Achse zählt.'],
    [r'$F(x) = \dfrac{x^3}{3} - x$, $F(2) = \dfrac{8}{3} - 2 = \dfrac{2}{3}$, $F(-1) = -\dfrac{1}{3} + 1 = \dfrac{2}{3}$',
     r'$F(2) - F(-1) = 0$. Dabei ist $A_1 = \left|\int_{-1}^{1} (x^2 - 1)\,dx\right| = \dfrac{4}{3}$ und $A_2 = \int_1^2 (x^2 - 1)\,dx = \dfrac{4}{3}$.',
     r'Das Integral ist der orientierte Flächeninhalt: unter der Achse negativ gezählt. Der gesamte Flächeninhalt wäre $A_1 + A_2 = \dfrac{8}{3}$.'],
    fig=FIG_OR, figcap='f(x) = x² − 1 über [−1; 2]: A₁ liegt unter, A₂ über der x-Achse')

Q.q(r'Es gilt $\int_1^4 f(x)\,dx = 6$. Welchen Wert hat $\int_4^1 f(x)\,dx$?',
    [r'$-6$', r'$6$', r'$0$', r'$\dfrac{1}{6}$'],
    [r'Vertauschen der Grenzen ändert das Vorzeichen: $\int_b^a f(x)\,dx = -\int_a^b f(x)\,dx$',
     r'Begründung mit dem Hauptsatz: $F(1) - F(4) = -(F(4) - F(1)) = -6$'])

Q.q(r'Es gilt $\int_0^2 f(x)\,dx = 3$ und $\int_2^5 f(x)\,dx = -1$. Welchen Wert hat $\int_0^5 f(x)\,dx$?',
    [r'$2$', r'$4$', r'$-3$', r'$3$'],
    [r'Intervalladditivität: $\int_0^5 f(x)\,dx = \int_0^2 f(x)\,dx + \int_2^5 f(x)\,dx$',
     r'$= 3 + (-1) = 2$',
     r'Falle: $3 + 1 = 4$ - das Minus des zweiten Integrals gehört dazu.'])

Q.q(r'Es gilt $\int_0^3 f(x)\,dx = 4$ und $\int_0^3 g(x)\,dx = 1$. Welchen Wert hat $\int_0^3 \left(2f(x) - g(x)\right)dx$?',
    [r'$7$', r'$6$', r'$9$', r'$2$'],
    [r'Faktor- und Summenregel gelten auch für bestimmte Integrale: $\int (2f - g) = 2\int f - \int g$',
     r'$= 2 \cdot 4 - 1 = 7$',
     r'Falle: $2 \cdot (4 - 1) = 6$ - der Faktor $2$ gehört nur zu $f$.'])

Q.q(r'Für eine Funktion $f$ gilt $\int_0^5 f(x)\,dx = -3$. Welche Aussage folgt daraus sicher?',
    [r'Die Flächenstücke unter der $x$-Achse überwiegen; der orientierte Flächeninhalt über $[0;5]$ ist $-3$.',
     r'Der Flächeninhalt zwischen Graph und $x$-Achse über $[0;5]$ beträgt genau $3\,\mathrm{FE}$.',
     r'$f(x) < 0$ für alle $x$ aus $[0;5]$.',
     r'$f$ hat auf $[0;5]$ keine Nullstelle.'],
    [r'Das Integral zählt Flächen unter der Achse negativ. Ein negativer Wert heißt nur: Unten ist mehr als oben.',
     r'Der Graph darf trotzdem teilweise über der Achse liegen (und Nullstellen haben) - dann ist die Gesamtfläche größer als $3$.',
     r'Beispiel: Aufgabe 11 hat das Integral $0$, aber die Fläche $\dfrac{8}{3}$.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Ein Fahrzeug beschleunigt mit $v(t) = 4t$ (in $\mathrm{m/s}$, $t$ in $\mathrm{s}$). Welchen Weg legt es in den ersten $3$ Sekunden zurück?',
    [r'$18\,\mathrm{m}$', r'$12\,\mathrm{m}$', r'$36\,\mathrm{m}$', r'$6\,\mathrm{m}$'],
    [r'Weg = Integral der Geschwindigkeit: $s = \int_0^3 4t\,dt = \left[2t^2\right]_0^3$',
     r'$= 2 \cdot 9 - 0 = 18\,\mathrm{m}$',
     r'$12\,\mathrm{m/s}$ ist die Geschwindigkeit nach $3\,\mathrm{s}$, nicht der Weg. Der Weg ist die Fläche unter dem $v$-$t$-Graphen.'])

Q.q(r'In ein Becken fließt Wasser mit der Rate $z(t) = 12 - 2t$ (in Liter pro Minute, $0 \leq t \leq 6$). Wie viel Wasser fließt in den ersten $4$ Minuten zu?',
    [r'$32$ Liter', r'$48$ Liter', r'$16$ Liter', r'$4$ Liter'],
    [r'Menge = Integral der Zuflussrate: $\int_0^4 (12 - 2t)\,dt = \left[12t - t^2\right]_0^4$',
     r'$= 48 - 16 = 32$ Liter',
     r'$48$ wäre die Menge bei konstant $12$ Litern pro Minute; $4$ ist nur die Rate zur Zeit $t = 4$.'])

Q.q(r'Für welche obere Grenze $b > 0$ gilt $\int_0^b 2x\,dx = 9$?',
    [r'$b = 3$', r'$b = 9$', r'$b = 4{,}5$', r'$b = \sqrt{3}$'],
    [r'$\int_0^b 2x\,dx = \left[x^2\right]_0^b = b^2$',
     r'$b^2 = 9$, mit $b > 0$ folgt $b = 3$.',
     r'Probe: $\int_0^3 2x\,dx = 9 - 0 = 9$.'])

Q.q(r'Ein Körper hat zur Zeit $t = 0$ die Geschwindigkeit $v(0) = 3\,\mathrm{m/s}$ und beschleunigt konstant mit $a(t) = 2\,\mathrm{m/s^2}$. Welche Geschwindigkeit hat er nach $4$ Sekunden?',
    [r'$11\,\mathrm{m/s}$', r'$8\,\mathrm{m/s}$', r'$19\,\mathrm{m/s}$', r'$5\,\mathrm{m/s}$'],
    [r'Die Geschwindigkeitsänderung ist das Integral der Beschleunigung: $\int_0^4 2\,dt = \left[2t\right]_0^4 = 8$',
     r'$v(4) = v(0) + 8 = 3 + 8 = 11\,\mathrm{m/s}$',
     r'$8$ vergisst die Anfangsgeschwindigkeit, $19$ rechnet fälschlich mit $t^2$ statt $t$.'])

Q.q(r'Die Grenzkosten eines Betriebs sind $K^{\prime}(x) = 0{,}02x + 3$ (in € pro Stück). Um wie viel steigen die Kosten, wenn die Produktion von $100$ auf $200$ Stück erhöht wird?',
    [r'$600$ €', r'$1000$ €', r'$700$ €', r'$300$ €'],
    [r'Kostenzuwachs = Integral der Grenzkosten: $\int_{100}^{200} (0{,}02x + 3)\,dx = \left[0{,}01x^2 + 3x\right]_{100}^{200}$',
     r'$= (400 + 600) - (100 + 300) = 1000 - 400 = 600$ €',
     r'$1000$ vergisst die untere Grenze; $700$ rechnet mit $K^{\prime}(200) \cdot 100$, also mit konstanten Grenzkosten.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, t = sp.symbols('x t')
    b = sp.Symbol('b', positive=True)
    I = lambda e, lo, hi: sp.integrate(e, (x, lo, hi))
    # 1, 2 (lower and upper sums with four rectangles)
    f = lambda u: u * u
    h = F(1, 2)
    left = [f(F(k, 2)) for k in range(4)]
    right = [f(F(k, 2)) for k in range(1, 5)]
    assert left == [0, F(1, 4), 1, F(9, 4)] and right == [F(1, 4), 1, F(9, 4), 4]
    assert h * sum(left) == F(7, 4) and sum(left) == F(7, 2)
    assert h * sum(right) == F(15, 4) and sum(right) == F(15, 2)
    # 4
    assert I(x**2, 0, 2) == sp.Rational(8, 3) and F(7, 4) < F(8, 3) < F(15, 4) and abs(8 / 3 - 2.67) < 0.005
    # 5
    assert I(2*x, 1, 3) == 8 and 3**2 == 9 and 2*3 == 6
    # 6
    assert I(3*x**2 + 1, 0, 1) == 2 and 3 + 1 == 4
    # 7
    assert I(x**-2, 1, 2) == sp.Rational(1, 2) and F(-1, 2) - F(-1, 1) == F(1, 2) and F(1, 4) == F(1, 2**2)
    # 8
    assert I(x**3 - 3*x + 2, 1, 2) == sp.Rational(5, 4)
    assert F(16, 4) - F(3, 2) * 4 + 4 == 2 and F(1, 4) - F(3, 2) + 2 == F(3, 4) and 2 + F(3, 4) == F(11, 4)
    # 9
    assert I(x - 2, 0, 2) == -2 and F(2 * 2, 2) == 2
    # 10
    assert I(x**3, -2, 2) == 0 and F(16, 4) == 4 and I(x**3, 0, 2) == 4
    # 11
    assert I(x**2 - 1, -1, 2) == 0 and I(x**2 - 1, -1, 1) == -sp.Rational(4, 3) and I(x**2 - 1, 1, 2) == sp.Rational(4, 3)
    assert F(8, 3) - 2 == F(2, 3) and F(-1, 3) + 1 == F(2, 3) and F(4, 3) + F(4, 3) == F(8, 3)
    # 12-14
    assert -(6) == -6 and 3 + (-1) == 2 and 3 + 1 == 4 and 2*4 - 1 == 7 and 2*(4 - 1) == 6 and 2*4 + 1 == 9
    # 15 conceptual (see 11: integral 0, area 8/3)
    # 16
    assert sp.integrate(4*t, (t, 0, 3)) == 18 and 4*3 == 12 and 4*9 == 36
    # 17
    assert sp.integrate(12 - 2*t, (t, 0, 4)) == 32 and 12*4 == 48 and 12 - 2*4 == 4
    # 18
    assert sp.solve(sp.Eq(I(2*x, 0, b), 9), b) == [3] and I(2*x, 0, 3) == 9
    # 19
    assert 3 + sp.integrate(2, (t, 0, 4)) == 11 and 3 + 4**2 == 19
    # 20
    r = sp.Rational
    assert sp.integrate(r(1, 50)*x + 3, (x, 100, 200)) == 600
    assert r(1, 100)*200**2 + 3*200 == 1000 and r(1, 100)*100**2 + 3*100 == 400 and (r(1, 50)*200 + 3)*100 == 700


Q.verify(check)
Q.save()
