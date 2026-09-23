#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 24 (LB 3): Flächenberechnungen - Fläche zwischen
Graph und x-Achse (Nullstellen als Grenzen, Teilflächen und Beträge), Fläche
zwischen zwei Graphen (Schnittstellen, Differenzfunktion), Berechnung unbekannter
Integrationsgrenzen, Aufgaben im Prüfungsstil.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=24, slug='flaechen', thema='Flächenberechnungen', lb='LB 3',
          blurb='Fläche zwischen Graph und x-Achse, zwischen zwei Graphen, Integrationsgrenzen',
          comment='Blocks: Fläche zwischen Graph und x-Achse (1-7), Fläche zwischen zwei Graphen (8-14), Integrationsgrenzen und Prüfungsstil (15-20). Alles ohne CAS.')


# ----------------------------------------------------------------- figures ----
def fig_mix():
    """f(x) = 1 - x^2 on [0;2]: one part above, one part below the x-axis."""
    p = S.Plot((-0.6, 2.5), (-3.4, 1.7), w=440, h=320)
    p.grid(0.5, 1)
    p.axes(1, 1, xlabel="x", ylabel="y", defer_labels=True)
    f = lambda u: 1 - u * u
    p.area(f, 0, 1, fill=S.GREEN, opacity=0.35)
    p.area(f, 1, 2, fill=S.RED, opacity=0.25)
    p.curve(f, -0.5, 2.15)
    p.text(p.X(0.45), p.Y(0.35), "A1", 13, S.INK, italic=True, halo=S.PAPER)
    p.text(p.X(1.55), p.Y(-1.1), "A2", 13, S.INK, italic=True, halo=S.PAPER)
    p.draw_labels()
    return p.svg("Graph von f(x) = 1 minus x hoch 2 ueber dem Intervall 0 bis 2 mit einer Flaeche ueber und einer Flaeche unter der x-Achse")


def fig_zwei():
    """Area between the parabola f(x) = x^2 and the line g(x) = 2x + 3."""
    p = S.Plot((-2.3, 3.8), (-1.6, 10.6), w=470, h=340)
    p.grid(1, 2)
    p.axes(1, 2, xlabel="x", ylabel="y", defer_labels=True)
    f = lambda u: u * u
    g = lambda u: 2 * u + 3
    p.area_between(g, f, -1, 3, fill=S.GREEN, opacity=0.3)
    p.curve(f, -2.2, 3.2)
    p.curve(g, -2.2, 3.7, S.GREEN, 1.9)
    p.point(-1, 1)
    p.point(3, 9)
    p.draw_labels()
    return p.svg("Parabel f(x) = x hoch 2 und Gerade g(x) = 2x + 3 mit der eingeschlossenen Flaeche zwischen den Schnittstellen minus 1 und 3")


def fig_lobes():
    """f(x) = x^3 - 3x^2 + 2x: two areas between graph and axis on [0;2]."""
    p = S.Plot((-0.35, 2.35), (-0.8, 0.9), w=440, h=300)
    p.grid(0.5, 0.5)
    p.axes(1, 0.5, xlabel="x", ylabel="y", ydec=1, defer_labels=True)
    f = lambda u: u**3 - 3 * u * u + 2 * u
    p.area(f, 0, 1, fill=S.GREEN, opacity=0.35)
    p.area(f, 1, 2, fill=S.RED, opacity=0.25)
    p.curve(f, -0.3, 2.3)
    p.draw_labels()
    return p.svg("Graph von f(x) = x hoch 3 minus 3x hoch 2 plus 2x mit zwei Flaechenstuecken zwischen den Nullstellen 0, 1 und 2")


FIG_MIX = fig_mix()
FIG_ZWEI = fig_zwei()
FIG_LOBES = fig_lobes()

# --------------------------------------- Fläche zwischen Graph und x-Achse ----
Q.q(r'Warum bestimmt man bei einer Flächenberechnung zuerst die Nullstellen von $f$?',
    [r'Weil der Graph dort die Seite wechselt: Über jeder Teilfläche wird einzeln integriert und der Betrag genommen.',
     r'Weil das Integral sonst gar nicht existiert.',
     r'Weil die Stammfunktion nur zwischen zwei Nullstellen gebildet werden darf.',
     r'Weil der Flächeninhalt immer gleich der Anzahl der Nullstellen ist.'],
    [r'Das bestimmte Integral zählt Flächen unter der $x$-Achse negativ (orientierter Flächeninhalt).',
     r'Für den echten Flächeninhalt werden die Nullstellen zu Zwischengrenzen: $A = \left|\int_{x_1}^{x_2} f(x)\,dx\right| + \left|\int_{x_2}^{x_3} f(x)\,dx\right| + \dots$',
     r'Liegt der Graph im ganzen Intervall über der Achse, fallen Integral und Flächeninhalt zusammen.'])

Q.q(r'Berechne den Inhalt der Fläche, die der Graph von $f(x) = x^2$ über $[0;3]$ mit der $x$-Achse einschließt.',
    [r'$9\,\mathrm{FE}$', r'$27\,\mathrm{FE}$', r'$13{,}5\,\mathrm{FE}$', r'$4{,}5\,\mathrm{FE}$'],
    [r'Der Graph liegt über der $x$-Achse, also ist $A = \int_0^3 x^2\,dx$.',
     r'$F(x) = \dfrac{x^3}{3}$, also $A = F(3) - F(0) = 9 - 0 = 9$',
     r'Falle: $27$ vergisst das Teilen durch $3$; $4{,}5$ wäre $\int_0^3 x\,dx$.'])

Q.q(r'Welchen Inhalt hat die Fläche zwischen dem Graphen von $f(x) = 4 - x^2$ und der $x$-Achse?',
    [r'$\dfrac{32}{3} \approx 10{,}67$', r'$\dfrac{16}{3} \approx 5{,}33$', r'$16$', r'$8$'],
    [r'Nullstellen als Grenzen: $4 - x^2 = 0 \Leftrightarrow x = \pm 2$.',
     r'$F(x) = 4x - \dfrac{x^3}{3}$, also $A = F(2) - F(-2) = \dfrac{16}{3} - \left(-\dfrac{16}{3}\right) = \dfrac{32}{3}$',
     r'Falle: $\dfrac{16}{3}$ ist nur die rechte Hälfte; $16$ vergisst den Term $\dfrac{x^3}{3}$.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen dem Graphen von $f(x) = x^2 - 2x$ und der $x$-Achse über $[0;2]$.',
    [r'$\dfrac{4}{3}$', r'$-\dfrac{4}{3}$', r'$\dfrac{8}{3}$', r'$4$'],
    [r'Auf $[0;2]$ liegt der Graph unter der $x$-Achse (Nullstellen $0$ und $2$).',
     r'$F(x) = \dfrac{x^3}{3} - x^2$, also $\int_0^2 f(x)\,dx = \left(\dfrac{8}{3} - 4\right) - 0 = -\dfrac{4}{3}$',
     r'Ein Flächeninhalt ist nie negativ: $A = \left|-\dfrac{4}{3}\right| = \dfrac{4}{3}$.'])

Q.q(r'Der Graph von $f(x) = 1 - x^2$ schließt über $[0;2]$ mit der $x$-Achse zwei Flächenstücke ein. Wie groß ist der gesamte Flächeninhalt?',
    [r'$A = 2$', r'$A = \dfrac{2}{3}$', r'$A = \dfrac{4}{3}$', r'$A = -\dfrac{2}{3}$'],
    [r'Nullstelle im Innern: $x = 1$. Teilflächen getrennt rechnen, $F(x) = x - \dfrac{x^3}{3}$.',
     r'$A_1 = \int_0^1 f(x)\,dx = 1 - \dfrac{1}{3} = \dfrac{2}{3}$ und $\int_1^2 f(x)\,dx = \left(2 - \dfrac{8}{3}\right) - \dfrac{2}{3} = -\dfrac{4}{3}$, also $A_2 = \dfrac{4}{3}$.',
     r'$A = A_1 + A_2 = \dfrac{2}{3} + \dfrac{4}{3} = 2$.',
     r'Das Integral über $[0;2]$ wäre nur $-\dfrac{2}{3}$ - es verrechnet die beiden Stücke gegeneinander.'],
    fig=FIG_MIX, figcap='f(x) = 1 − x² über [0; 2]: A₁ liegt über, A₂ unter der x-Achse')

Q.q(r'Welchen Inhalt hat die Fläche, die der Graph von $f(x) = x^3 - 4x$ über $[-2;2]$ mit der $x$-Achse einschließt?',
    [r'$8$', r'$0$', r'$4$', r'$16$'],
    [r'Nullstellen: $x\,(x^2 - 4) = 0$, also $x = -2$, $x = 0$, $x = 2$ - der Graph wechselt bei $x = 0$ die Seite.',
     r'$F(x) = \dfrac{x^4}{4} - 2x^2$, also $\int_0^2 f(x)\,dx = (4 - 8) - 0 = -4$; wegen der Punktsymmetrie ist $\int_{-2}^{0} f(x)\,dx = +4$.',
     r'$A = |-4| + |4| = 8$. Das Integral über $[-2;2]$ ist dagegen $0$ - der klassische Fehler.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen dem Graphen von $f(x) = x^2 - 2x$ und der $x$-Achse über $[1;4]$.',
    [r'$\dfrac{22}{3} \approx 7{,}33$', r'$6$', r'$\dfrac{20}{3} \approx 6{,}67$', r'$\dfrac{2}{3}$'],
    [r'Nullstelle im Intervall: $x = 2$. Mit $F(x) = \dfrac{x^3}{3} - x^2$ ist $F(1) = -\dfrac{2}{3}$, $F(2) = -\dfrac{4}{3}$, $F(4) = \dfrac{16}{3}$.',
     r'$\int_1^2 f(x)\,dx = -\dfrac{4}{3} + \dfrac{2}{3} = -\dfrac{2}{3}$ (unter der Achse) und $\int_2^4 f(x)\,dx = \dfrac{16}{3} + \dfrac{4}{3} = \dfrac{20}{3}$.',
     r'$A = \dfrac{2}{3} + \dfrac{20}{3} = \dfrac{22}{3}$; das Integral über $[1;4]$ ist nur $6$.'])

# ------------------------------------------ Fläche zwischen zwei Graphen ----
Q.q(r'Wie berechnet man den Inhalt der Fläche, die zwei Graphen einschließen?',
    [r'$A = \int_a^b \left(f(x) - g(x)\right)dx$, wobei $a$ und $b$ die Schnittstellen sind und $f$ oben verläuft.',
     r'$A = \int_a^b \left(f(x) + g(x)\right)dx$ mit den Schnittstellen $a$ und $b$.',
     r'$A = \int_a^b f(x) \cdot g(x)\,dx$ mit den Schnittstellen $a$ und $b$.',
     r'$A = \left|\int_a^b f(x)\,dx\right| + \left|\int_a^b g(x)\,dx\right|$'],
    [r'Erst die Schnittstellen aus $f(x) = g(x)$ - sie sind die Integrationsgrenzen.',
     r'Dann die Differenzfunktion „oben minus unten“ integrieren; dabei ist es egal, ob die Graphen über oder unter der $x$-Achse liegen.',
     r'Kommt ein negativer Wert heraus, waren die Rollen vertauscht - Betrag nehmen.'])

Q.q(r'Welchen Inhalt hat die Fläche zwischen den Graphen von $f(x) = x^2$ und $g(x) = x$?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{3}$', r'$\dfrac{1}{2}$', r'$-\dfrac{1}{6}$'],
    [r'Schnittstellen: $x^2 = x \Leftrightarrow x\,(x - 1) = 0$, also $x = 0$ und $x = 1$.',
     r'Auf $[0;1]$ liegt $g$ oben: $A = \int_0^1 \left(x - x^2\right)dx = \left[\dfrac{x^2}{2} - \dfrac{x^3}{3}\right]_0^1 = \dfrac{1}{2} - \dfrac{1}{3}$',
     r'$A = \dfrac{1}{6}$. Falle: $-\dfrac{1}{6}$ entsteht, wenn man $f - g$ statt $g - f$ rechnet.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen der Parabel $f(x) = x^2$ und der Geraden $g(x) = 2x + 3$.',
    [r'$\dfrac{32}{3} \approx 10{,}67$', r'$-\dfrac{32}{3}$', r'$\dfrac{16}{3} \approx 5{,}33$', r'$\dfrac{8}{3} \approx 2{,}67$'],
    [r'Schnittstellen: $x^2 = 2x + 3 \Leftrightarrow x^2 - 2x - 3 = 0$, also $x = -1$ und $x = 3$.',
     r'Die Gerade liegt zwischen den Schnittstellen oben: $A = \int_{-1}^{3} \left(2x + 3 - x^2\right)dx = \left[x^2 + 3x - \dfrac{x^3}{3}\right]_{-1}^{3}$',
     r'$= (9 + 9 - 9) - \left(1 - 3 + \dfrac{1}{3}\right) = 9 + \dfrac{5}{3} = \dfrac{32}{3}$'],
    fig=FIG_ZWEI, figcap='Fläche zwischen der Parabel f(x) = x² und der Geraden g(x) = 2x + 3')

Q.q(r'Welchen Inhalt hat die Fläche zwischen den Graphen von $f(x) = x^2$ und $g(x) = -x^2 + 8$?',
    [r'$\dfrac{64}{3} \approx 21{,}33$', r'$\dfrac{32}{3} \approx 10{,}67$', r'$16$', r'$\dfrac{128}{3} \approx 42{,}67$'],
    [r'Schnittstellen: $x^2 = -x^2 + 8 \Leftrightarrow 2x^2 = 8 \Leftrightarrow x = \pm 2$.',
     r'$A = \int_{-2}^{2} \left(8 - 2x^2\right)dx = \left[8x - \dfrac{2x^3}{3}\right]_{-2}^{2} = \left(16 - \dfrac{16}{3}\right) - \left(-16 + \dfrac{16}{3}\right)$',
     r'$= 32 - \dfrac{32}{3} = \dfrac{64}{3}$. Falle: $\dfrac{32}{3}$ ist nur die rechte Hälfte.'])

Q.q(r'Die Graphen von $f(x) = x^3$ und $g(x) = x$ schließen zwei Flächenstücke ein. Wie groß ist der gesamte Flächeninhalt?',
    [r'$\dfrac{1}{2}$', r'$0$', r'$\dfrac{1}{4}$', r'$\dfrac{3}{4}$'],
    [r'Schnittstellen: $x^3 = x \Leftrightarrow x\,(x - 1)(x + 1) = 0$, also $x = -1$, $x = 0$, $x = 1$.',
     r'Auf $[0;1]$ liegt $g$ oben: $\int_0^1 \left(x - x^3\right)dx = \dfrac{1}{2} - \dfrac{1}{4} = \dfrac{1}{4}$; auf $[-1;0]$ liegt $f$ oben, ebenfalls $\dfrac{1}{4}$.',
     r'$A = \dfrac{1}{4} + \dfrac{1}{4} = \dfrac{1}{2}$.',
     r'Wer in einem Zug von $-1$ bis $1$ integriert, erhält $0$ - die Schnittstelle $x = 0$ muss Zwischengrenze sein.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen den Graphen von $f(x) = x^2 - 4x + 3$ und $g(x) = 3 - x$.',
    [r'$\dfrac{9}{2} = 4{,}5$', r'$\dfrac{27}{2} = 13{,}5$', r'$9$', r'$-\dfrac{9}{2}$'],
    [r'Schnittstellen: $x^2 - 4x + 3 = 3 - x \Leftrightarrow x^2 - 3x = 0 \Leftrightarrow x\,(x - 3) = 0$, also $x = 0$ und $x = 3$.',
     r'Differenzfunktion (Gerade oben): $g(x) - f(x) = 3x - x^2$',
     r'$A = \int_0^3 \left(3x - x^2\right)dx = \left[\dfrac{3x^2}{2} - \dfrac{x^3}{3}\right]_0^3 = \dfrac{27}{2} - 9 = \dfrac{9}{2}$'])

Q.q(r'Welchen Inhalt hat die Fläche zwischen den Graphen von $f(x) = x^3$ und $g(x) = x^2$ über $[0;1]$?',
    [r'$\dfrac{1}{12}$', r'$\dfrac{7}{12}$', r'$\dfrac{1}{4}$', r'$-\dfrac{1}{12}$'],
    [r'Auf $[0;1]$ gilt $x^2 \geq x^3$, also liegt $g$ oben.',
     r'$A = \int_0^1 \left(x^2 - x^3\right)dx = \dfrac{1}{3} - \dfrac{1}{4} = \dfrac{1}{12}$',
     r'Probe an einer Stelle: $g(0{,}5) = 0{,}25 > 0{,}125 = f(0{,}5)$. Passt. Falle: $\dfrac{7}{12}$ addiert die beiden Integrale.'])

# --------------------------------- Integrationsgrenzen und Prüfungsstil ----
Q.q(r'Für welche obere Grenze $b > 0$ gilt $\int_0^b 3x^2\,dx = 64$?',
    [r'$b = 4$', r'$b = 8$', r'$b \approx 5{,}77$', r'$b = 64$'],
    [r'$\int_0^b 3x^2\,dx = \left[x^3\right]_0^b = b^3$',
     r'$b^3 = 64 \Leftrightarrow b = 4$',
     r'Probe: $\int_0^4 3x^2\,dx = 64$. Falle: $b^2 = 64$ liefert $8$; wer den Faktor $3$ vergisst, landet bei $b = \sqrt[3]{192} \approx 5{,}77$.'])

Q.q(r'Der Graph von $f(x) = 2x + 1$ schließt über $[0;b]$ mit der $x$-Achse eine Fläche vom Inhalt $12$ ein. Wie groß ist $b$?',
    [r'$b = 3$', r'$b = -4$', r'$b = 6$', r'$b = 2$'],
    [r'$\int_0^b (2x + 1)\,dx = \left[x^2 + x\right]_0^b = b^2 + b$',
     r'$b^2 + b = 12 \Leftrightarrow b^2 + b - 12 = 0 \Leftrightarrow (b - 3)(b + 4) = 0$',
     r'Nur $b = 3$ ist sinnvoll, denn die Grenze muss rechts von $0$ liegen. Probe: $9 + 3 = 12$.'])

Q.q(r'Für welchen Wert von $a$ gilt $\int_0^2 (a\,x + 1)\,dx = 8$?',
    [r'$a = 3$', r'$a = 4$', r'$a = 2$', r'$a = 8$'],
    [r'$\int_0^2 (a\,x + 1)\,dx = \left[\dfrac{a}{2}x^2 + x\right]_0^2 = 2a + 2$',
     r'$2a + 2 = 8 \Leftrightarrow a = 3$',
     r'Probe: $\int_0^2 (3x + 1)\,dx = 6 + 2 = 8$. Falle: die $+1$ vergessen führt auf $a = 4$.'])

Q.q(r'Ein Tunnelbogen hat im Querschnitt die Form des Graphen von $f(x) = 3 - \dfrac{x^2}{3}$ (Maße in Metern, $x$-Achse ist die Fahrbahn). Wie groß ist die Querschnittsfläche?',
    [r'$12\,\mathrm{m}^2$', r'$6\,\mathrm{m}^2$', r'$18\,\mathrm{m}^2$', r'$4\,\mathrm{m}^2$'],
    [r'Nullstellen: $3 - \dfrac{x^2}{3} = 0 \Leftrightarrow x^2 = 9$, also $x = \pm 3$ - der Tunnel ist $6\,\mathrm{m}$ breit und $3\,\mathrm{m}$ hoch.',
     r'$F(x) = 3x - \dfrac{x^3}{9}$, also $A = F(3) - F(-3) = 6 - (-6) = 12$',
     r'$18\,\mathrm{m}^2$ wäre das umschriebene Rechteck $6 \cdot 3$; der Bogen füllt davon genau zwei Drittel.'])

Q.q(r'In ein Becken fließt Wasser mit der Rate $z(t) = 6t$ und gleichzeitig ab mit $a(t) = t^2$ (jeweils in Litern pro Minute). Wann sind Zufluss und Abfluss gleich groß, und wie viel Wasser ist bis dahin netto zugeflossen?',
    [r'nach $6$ Minuten, netto $36$ Liter', r'nach $6$ Minuten, netto $108$ Liter',
     r'nach $3$ Minuten, netto $18$ Liter', r'nach $6$ Minuten, netto $180$ Liter'],
    [r'Gleich groß: $6t = t^2 \Leftrightarrow t\,(t - 6) = 0$, also nach $t = 6$ Minuten.',
     r'Die Nettomenge ist die Fläche zwischen den beiden Graphen: $\int_0^6 \left(6t - t^2\right)dt = \left[3t^2 - \dfrac{t^3}{3}\right]_0^6 = 108 - 72$',
     r'$= 36$ Liter. Falle: $108$ Liter sind nur der Zufluss, $180$ Liter addiert Zu- und Abfluss statt sie zu verrechnen.'])

Q.q(r'Prüfungsstil: Der Graph von $f(x) = x^3 - 3x^2 + 2x$ schließt mit der $x$-Achse zwei Flächenstücke ein. Berechne den gesamten Flächeninhalt.',
    [r'$\dfrac{1}{2}$', r'$0$', r'$\dfrac{1}{4}$', r'$\dfrac{3}{2}$'],
    [r'Nullstellen: $x\left(x^2 - 3x + 2\right) = x\,(x - 1)(x - 2) = 0$, also $x = 0$, $x = 1$, $x = 2$.',
     r'$F(x) = \dfrac{x^4}{4} - x^3 + x^2$; $F(0) = 0$, $F(1) = \dfrac{1}{4}$, $F(2) = 0$.',
     r'$\int_0^1 f(x)\,dx = \dfrac{1}{4}$ und $\int_1^2 f(x)\,dx = -\dfrac{1}{4}$, also $A = \dfrac{1}{4} + \dfrac{1}{4} = \dfrac{1}{2}$.',
     r'Das Integral von $0$ bis $2$ ist $0$ - ohne die Zwischengrenze $x = 1$ geht die Fläche verloren.'],
    fig=FIG_LOBES, figcap='f(x) = x³ − 3x² + 2x: zwei Flächenstücke zwischen den Nullstellen 0, 1 und 2')


def check():
    import sympy as sp
    x, t, b, a = sp.symbols('x t b a')
    I = lambda e, lo, hi, v=None: sp.integrate(e, (v or x, lo, hi))
    R = sp.Rational
    # 2
    assert I(x**2, 0, 3) == 9 and 3**3 == 27 and I(x, 0, 3) == R(9, 2)
    # 3
    assert sp.solve(4 - x**2, x) == [-2, 2]
    assert I(4 - x**2, -2, 2) == R(32, 3) and I(4 - x**2, 0, 2) == R(16, 3)
    assert 4 * 2 - (-4 * 2) == 16
    # 4
    assert sp.solve(x**2 - 2 * x, x) == [0, 2] and I(x**2 - 2 * x, 0, 2) == R(-4, 3)
    assert abs(I(x**2 - 2 * x, 0, 2)) == R(4, 3) and R(2, 1)**3 / 3 == R(8, 3)
    # 5
    assert sp.solve(1 - x**2, x) == [-1, 1]
    assert I(1 - x**2, 0, 1) == R(2, 3) and I(1 - x**2, 1, 2) == R(-4, 3)
    assert R(2, 3) + R(4, 3) == 2 and I(1 - x**2, 0, 2) == R(-2, 3)
    # 6
    assert sp.solve(x**3 - 4 * x, x) == [-2, 0, 2]
    assert I(x**3 - 4 * x, 0, 2) == -4 and I(x**3 - 4 * x, -2, 0) == 4
    assert I(x**3 - 4 * x, -2, 2) == 0 and 4 + 4 == 8
    # 7
    f7 = x**2 - 2 * x
    assert I(f7, 1, 2) == R(-2, 3) and I(f7, 2, 4) == R(20, 3) and I(f7, 1, 4) == 6
    assert R(2, 3) + R(20, 3) == R(22, 3) and abs(float(R(22, 3)) - 7.33) < 0.005
    # 9
    assert sp.solve(x**2 - x, x) == [0, 1] and I(x - x**2, 0, 1) == R(1, 6)
    assert I(x, 0, 1) == R(1, 2) and I(x**2, 0, 1) == R(1, 3) and I(x**2 - x, 0, 1) == R(-1, 6)
    # 10
    assert sp.solve(x**2 - (2 * x + 3), x) == [-1, 3]
    assert I(2 * x + 3 - x**2, -1, 3) == R(32, 3) and abs(float(R(32, 3)) - 10.67) < 0.005
    assert I(2 * x + 3 - x**2, 0, 3) == 9 and abs(float(R(16, 3)) - 5.33) < 0.005
    # 11
    assert sp.solve(x**2 - (-x**2 + 8), x) == [-2, 2]
    assert I(8 - 2 * x**2, -2, 2) == R(64, 3) and I(8 - 2 * x**2, 0, 2) == R(32, 3)
    assert abs(float(R(64, 3)) - 21.33) < 0.005 and abs(float(R(128, 3)) - 42.67) < 0.005
    # 12
    assert sp.solve(x**3 - x, x) == [-1, 0, 1]
    assert I(x - x**3, 0, 1) == R(1, 4) and I(x**3 - x, -1, 0) == R(1, 4)
    assert I(x - x**3, -1, 1) == 0 and R(1, 4) + R(1, 4) == R(1, 2)
    # 13
    assert sp.solve((x**2 - 4 * x + 3) - (3 - x), x) == [0, 3]
    assert sp.expand((3 - x) - (x**2 - 4 * x + 3)) == 3 * x - x**2
    assert I(3 * x - x**2, 0, 3) == R(9, 2) and I(3 * x, 0, 3) == R(27, 2) and I(x**2, 0, 3) == 9
    # 14
    assert I(x**2 - x**3, 0, 1) == R(1, 12) and R(1, 3) + R(1, 4) == R(7, 12)
    assert R(1, 2)**2 > R(1, 2)**3
    # 15
    assert I(3 * x**2, 0, b) == b**3 and sp.solve(sp.Eq(b**3, 64), b)[0] == 4
    assert I(3 * x**2, 0, 4) == 64 and 8**2 == 64 and abs(float(192 ** R(1, 3)) - 5.77) < 0.005
    # 16
    assert sp.expand(I(2 * x + 1, 0, b)) == b**2 + b
    assert sorted(sp.solve(sp.Eq(b**2 + b, 12), b)) == [-4, 3] and 3**2 + 3 == 12
    assert sp.expand((b - 3) * (b + 4)) == b**2 + b - 12
    # 17
    assert sp.expand(I(a * x + 1, 0, 2)) == 2 * a + 2 and sp.solve(sp.Eq(2 * a + 2, 8), a) == [3]
    assert I(3 * x + 1, 0, 2) == 8
    # 18
    ft = 3 - x**2 / 3
    assert sp.solve(ft, x) == [-3, 3] and I(ft, -3, 3) == 12 and I(ft, 0, 3) == 6 and 6 * 3 == 18
    # 19
    assert sp.solve(sp.Eq(6 * t, t**2), t) == [0, 6]
    assert I(6 * t - t**2, 0, 6, t) == 36 and I(6 * t, 0, 6, t) == 108 and I(t**2, 0, 6, t) == 72
    assert 108 + 72 == 180 and I(6 * t - t**2, 0, 3, t) == 18
    # 20
    f20 = x**3 - 3 * x**2 + 2 * x
    assert sp.solve(f20, x) == [0, 1, 2] and sp.expand(x * (x - 1) * (x - 2)) == f20
    assert I(f20, 0, 1) == R(1, 4) and I(f20, 1, 2) == R(-1, 4) and I(f20, 0, 2) == 0
    assert R(1, 4) + R(1, 4) == R(1, 2)


Q.verify(check)
Q.save()
