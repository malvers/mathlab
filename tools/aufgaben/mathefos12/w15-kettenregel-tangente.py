#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 15 (LB 2): Kettenregel an (ax+b)^n, Zusammenhang der
Graphen von f und der Ableitungsfunktion, Tangenten- und Normalengleichung in einem
Punkt, Schnittwinkel des Graphen mit der x-Achse über tan(alpha) = f-Strich(x0).
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=15, slug='kettenregel-tangente', thema='Kettenregel, Tangente und Normale', lb='LB 2',
          blurb='Kettenregel, Graph von f und Ableitungsfunktion, Tangente, Normale, Schnittwinkel',
          comment='Blocks: Kettenregel (1-6), Graph von f und Graph der Ableitung (7-10), Tangente und Normale (11-16), Schnittwinkel und Transfer (17-20). Alles ohne CAS.')


def fig_f_und_ableitung():
    """f(x) = x^3 - 6x^2 + 9x - the reader has to spot the two horizontal tangents."""
    f = lambda u: u ** 3 - 6 * u ** 2 + 9 * u
    p = Plot((-0.7, 4.4), (-2.5, 6), w=520, h=340)
    p.grid(1, 1)
    p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y", defer_labels=True)
    p.curve(f, -0.5, 4.2)
    p.draw_labels()
    return p.svg("Graph von f mit zwei waagerechten Tangenten")


# ---------------------------------------------------------------- Kettenregel ----
Q.q(r'Bestimme die Ableitung von $f(x) = (3x + 2)^4$.',
    [r'$f^{\prime}(x) = 12\,(3x + 2)^3$', r'$f^{\prime}(x) = 4\,(3x + 2)^3$',
     r'$f^{\prime}(x) = 12\,(3x + 2)^4$', r'$f^{\prime}(x) = 3\,(3x + 2)^3$'],
    [r'Kettenregel: äußere Ableitung mal innere Ableitung.',
     r'Äußere: $4\,(3x + 2)^3$, innere: $(3x + 2)^{\prime} = 3$.',
     r'$f^{\prime}(x) = 4\,(3x + 2)^3 \cdot 3 = 12\,(3x + 2)^3$. Falle: die innere Ableitung vergessen.'])

Q.q(r'Bestimme die Ableitung von $f(x) = (x - 5)^3$.',
    [r'$f^{\prime}(x) = 3\,(x - 5)^2$', r'$f^{\prime}(x) = 3\,(x - 5)^3$',
     r'$f^{\prime}(x) = (x - 5)^2$', r'$f^{\prime}(x) = 3x^2$'],
    [r'Innere Funktion $x - 5$, innere Ableitung $1$.',
     r'$f^{\prime}(x) = 3\,(x - 5)^2 \cdot 1 = 3\,(x - 5)^2$',
     r'Falle: $3x^2$ entsteht, wenn man die Klammer einfach ignoriert.'])

Q.q(r'Bestimme die Ableitung von $f(x) = (4 - 2x)^3$.',
    [r'$f^{\prime}(x) = -6\,(4 - 2x)^2$', r'$f^{\prime}(x) = 6\,(4 - 2x)^2$',
     r'$f^{\prime}(x) = -6\,(4 - 2x)^3$', r'$f^{\prime}(x) = 3\,(4 - 2x)^2$'],
    [r'Innere Ableitung: $(4 - 2x)^{\prime} = -2$.',
     r'$f^{\prime}(x) = 3\,(4 - 2x)^2 \cdot (-2) = -6\,(4 - 2x)^2$',
     r'Das Minus gehört dazu: Die Klammer wird mit wachsendem $x$ kleiner.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{1}{2x + 1}$.',
    [r'$f^{\prime}(x) = -\dfrac{2}{(2x + 1)^2}$', r'$f^{\prime}(x) = \dfrac{2}{(2x + 1)^2}$',
     r'$f^{\prime}(x) = -\dfrac{1}{(2x + 1)^2}$', r'$f^{\prime}(x) = -\dfrac{2}{2x + 1}$'],
    [r'Als Potenz: $f(x) = (2x + 1)^{-1}$.',
     r'Kettenregel: $f^{\prime}(x) = -1 \cdot (2x + 1)^{-2} \cdot 2 = -\dfrac{2}{(2x + 1)^2}$',
     r'Falle: ohne die innere Ableitung $2$ bliebe nur $-\dfrac{1}{(2x + 1)^2}$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \sqrt{2x + 1}$.',
    [r'$f^{\prime}(x) = \dfrac{1}{\sqrt{2x + 1}}$', r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{2x + 1}}$',
     r'$f^{\prime}(x) = \dfrac{2}{\sqrt{2x + 1}}$', r'$f^{\prime}(x) = \dfrac{1}{2}\sqrt{2x + 1}$'],
    [r'Als Potenz: $f(x) = (2x + 1)^{\frac{1}{2}}$.',
     r'$f^{\prime}(x) = \dfrac{1}{2}\,(2x + 1)^{-\frac{1}{2}} \cdot 2 = (2x + 1)^{-\frac{1}{2}}$',
     r'Also $f^{\prime}(x) = \dfrac{1}{\sqrt{2x + 1}}$ - die innere Ableitung $2$ kürzt sich gegen den Nenner $2$.'])

Q.q(r'Berechne $f^{\prime}(2)$ für $f(x) = (x^2 - 1)^3$.',
    [r'$108$', r'$54$', r'$27$', r'$9$'],
    [r'$f^{\prime}(x) = 3\,(x^2 - 1)^2 \cdot 2x = 6x\,(x^2 - 1)^2$',
     r'$f^{\prime}(2) = 6 \cdot 2 \cdot (4 - 1)^2 = 12 \cdot 9 = 108$',
     r'Fallen: $54$ entsteht ohne den Faktor $2$ aus der inneren Ableitung, $27$ ganz ohne sie.'])

# -------------------------------------- Graph von f und Graph der Ableitung ----
Q.q(r'Die Abbildung zeigt den Graphen von $f(x) = x^3 - 6x^2 + 9x$. An welchen Stellen hat die Ableitungsfunktion $f^{\prime}$ eine Nullstelle?',
    [r'bei $x = 1$ und $x = 3$', r'bei $x = 0$ und $x = 3$', r'nur bei $x = 2$', r'nur bei $x = 1$'],
    [r'$f^{\prime}$ hat dort eine Nullstelle, wo der Graph von $f$ eine waagerechte Tangente hat - im Bild am Hochpunkt und am Tiefpunkt.',
     r'Nachrechnen: $f^{\prime}(x) = 3x^2 - 12x + 9 = 3\,(x - 1)(x - 3)$, also $x = 1$ und $x = 3$.',
     r'Falle: $x = 0$ und $x = 3$ sind die Nullstellen von $f$ selbst, nicht die von $f^{\prime}$.'],
    fig=fig_f_und_ableitung(), figcap=r'Graph von $f(x) = x^3 - 6x^2 + 9x$')

Q.q(r'Der Graph von $f$ ist eine nach oben geöffnete Parabel mit dem Scheitel $S(2|-1)$. Wie sieht der Graph von $f^{\prime}$ aus?',
    [r'eine steigende Gerade, die die $x$-Achse bei $x = 2$ schneidet',
     r'eine steigende Gerade, die die $x$-Achse bei $x = -1$ schneidet',
     r'wieder eine nach oben geöffnete Parabel mit dem Scheitel $S(2|-1)$',
     r'eine waagerechte Gerade'],
    [r'Die Parabel lautet $f(x) = (x - 2)^2 - 1 = x^2 - 4x + 3$.',
     r'$f^{\prime}(x) = 2x - 4$ - eine Gerade mit dem Anstieg $2$ und der Nullstelle $x = 2$.',
     r'Das passt: Im Scheitel verläuft die Tangente waagerecht, dort ist $f^{\prime}(2) = 0$.'])

Q.q(r'Auf einem Intervall gilt $f^{\prime}(x) < 0$. Was bedeutet das für den Graphen von $f$?',
    [r'Der Graph fällt dort.', r'Der Graph liegt dort unterhalb der $x$-Achse.',
     r'Der Graph hat dort eine Nullstelle.', r'Der Graph verläuft dort waagerecht.'],
    [r'$f^{\prime}(x)$ ist der Anstieg der Tangente an der Stelle $x$.',
     r'Ein negativer Anstieg heißt: Der Graph geht von links nach rechts nach unten - $f$ ist monoton fallend.',
     r'Falle: Das Vorzeichen von $f^{\prime}$ sagt nichts über das Vorzeichen von $f$ aus.'])

Q.q(r'Der Graph von $f^{\prime}$ ist die waagerechte Gerade $y = 3$. Was für eine Funktion ist $f$?',
    [r'eine lineare Funktion mit dem Anstieg $3$, also $f(x) = 3x + c$',
     r'die konstante Funktion $f(x) = 3$',
     r'eine Parabel der Form $f(x) = 3x^2 + c$',
     r'eine Funktion mit einer waagerechten Tangente bei $x = 3$'],
    [r'$f^{\prime}(x) = 3$ heißt: An jeder Stelle ist der Anstieg $3$.',
     r'Das leistet genau eine Gerade mit dem Anstieg $3$: $f(x) = 3x + c$.',
     r'Probe: $(3x + c)^{\prime} = 3$ für jedes $c$ - die Höhe der Geraden bleibt unbestimmt.'])

# ----------------------------------------------------- Tangente und Normale ----
Q.q(r'Wie lautet die Gleichung der Tangente an den Graphen von $f(x) = x^2$ im Punkt $P(3|9)$?',
    [r'$y = 6x - 9$', r'$y = 6x + 9$', r'$y = 6x$', r'$y = 9x - 6$'],
    [r'Anstieg: $f^{\prime}(x) = 2x$, also $m = f^{\prime}(3) = 6$.',
     r'Punkt-Anstiegs-Form: $y = 9 + 6\,(x - 3) = 6x - 9$',
     r'Probe: Für $x = 3$ liefert $6 \cdot 3 - 9 = 9$ genau $f(3)$.'])

Q.q(r'Bestimme die Tangente an den Graphen von $f(x) = x^3 - 2x$ an der Stelle $x_0 = 1$.',
    [r'$y = x - 2$', r'$y = x - 1$', r'$y = -x$', r'$y = 3x - 4$'],
    [r'$f(1) = 1 - 2 = -1$ und $f^{\prime}(x) = 3x^2 - 2$, also $m = f^{\prime}(1) = 1$.',
     r'$y = -1 + 1 \cdot (x - 1) = x - 2$',
     r'Probe: $x = 1$ gibt $y = -1$ - der Berührpunkt $(1|-1)$ liegt auf der Geraden.'])

Q.q(r'Wie lautet die Normale an den Graphen von $f(x) = x^2$ im Punkt $P(2|4)$?',
    [r'$y = -\dfrac{1}{4}x + 4{,}5$', r'$y = 4x - 4$', r'$y = -4x + 12$', r'$y = -\dfrac{1}{4}x + 4$'],
    [r'Tangentenanstieg: $f^{\prime}(2) = 4$.',
     r'Die Normale steht senkrecht dazu: $m_n = -\dfrac{1}{4}$.',
     r'$y = 4 - \dfrac{1}{4}\,(x - 2) = -\dfrac{1}{4}x + 4{,}5$. Falle: $y = 4x - 4$ ist die Tangente.'])

Q.q(r'Die Tangente in einem Punkt hat den Anstieg $2$. Welchen Anstieg hat dort die Normale?',
    [r'$-\dfrac{1}{2}$', r'$\dfrac{1}{2}$', r'$-2$', r'$2$'],
    [r'Für senkrechte Geraden gilt $m_t \cdot m_n = -1$.',
     r'$m_n = -\dfrac{1}{m_t} = -\dfrac{1}{2}$',
     r'Falle: nur das Vorzeichen zu wechseln ($-2$) reicht nicht, der Kehrwert gehört dazu.'])

Q.q(r'Bestimme die Tangente an den Graphen von $f(x) = (2x - 1)^3$ an der Stelle $x_0 = 1$.',
    [r'$y = 6x - 5$', r'$y = 6x - 6$', r'$y = 3x - 2$', r'$y = 6x + 1$'],
    [r'$f(1) = 1^3 = 1$; Kettenregel: $f^{\prime}(x) = 3\,(2x - 1)^2 \cdot 2 = 6\,(2x - 1)^2$.',
     r'$m = f^{\prime}(1) = 6$, also $y = 1 + 6\,(x - 1) = 6x - 5$.',
     r'Probe: $6 \cdot 1 - 5 = 1 = f(1)$. Falle: $y = 6x - 6$ geht durch $(1|0)$ statt durch $(1|1)$.'])

Q.q(r'Wie lautet die Normale an den Graphen von $f(x) = x^3$ im Punkt $P(1|1)$?',
    [r'$y = -\dfrac{1}{3}x + \dfrac{4}{3}$', r'$y = 3x - 2$', r'$y = -3x + 4$', r'$y = -\dfrac{1}{3}x + 1$'],
    [r'$f^{\prime}(x) = 3x^2$, also $m_t = f^{\prime}(1) = 3$ und $m_n = -\dfrac{1}{3}$.',
     r'$y = 1 - \dfrac{1}{3}\,(x - 1) = -\dfrac{1}{3}x + \dfrac{4}{3}$',
     r'Probe: $x = 1$ gibt $-\dfrac{1}{3} + \dfrac{4}{3} = 1$. Falle: $y = 3x - 2$ ist die Tangente.'])

# ------------------------------------------------ Schnittwinkel und Transfer ----
Q.q(r'Unter welchem Winkel schneidet der Graph von $f(x) = x^2 - 4$ die $x$-Achse im Punkt $(2|0)$?',
    [r'$\alpha \approx 76{,}0^\circ$', r'$\alpha \approx 14{,}0^\circ$', r'$\alpha \approx 4{,}0^\circ$', r'$\alpha = 45^\circ$'],
    [r'Der Schnittwinkel mit der $x$-Achse ist der Steigungswinkel der Tangente: $\tan(\alpha) = f^{\prime}(x_0)$.',
     r'$f^{\prime}(x) = 2x$, also $\tan(\alpha) = f^{\prime}(2) = 4$.',
     r'$\alpha = \arctan(4) \approx 76{,}0^\circ$. Falle: $14{,}0^\circ$ ist der Winkel zur $y$-Achse.'])

Q.q(r'Unter welchem Winkel schneidet der Graph von $f(x) = x^3 - x$ die $x$-Achse an der Stelle $x = 1$?',
    [r'$\alpha \approx 63{,}4^\circ$', r'$\alpha \approx 26{,}6^\circ$', r'$\alpha \approx 2{,}0^\circ$', r'$\alpha = 45^\circ$'],
    [r'$f^{\prime}(x) = 3x^2 - 1$, also $\tan(\alpha) = f^{\prime}(1) = 2$.',
     r'$\alpha = \arctan(2) \approx 63{,}4^\circ$',
     r'Falle: $2$ ist der Anstieg, nicht der Winkel; $26{,}6^\circ$ ergänzt $63{,}4^\circ$ zu $90^\circ$.'])

Q.q(r'Ein Hang wird im Querschnitt durch $f(x) = 0{,}01x^2$ beschrieben ($x$ und $f(x)$ in m). Unter welchem Winkel gegen die Waagerechte verläuft er an der Stelle $x = 50$?',
    [r'$\alpha = 45^\circ$', r'$\alpha \approx 26{,}6^\circ$', r'$\alpha \approx 87{,}7^\circ$', r'$\alpha \approx 0{,}6^\circ$'],
    [r'$f^{\prime}(x) = 0{,}02x$, also $\tan(\alpha) = f^{\prime}(50) = 1$.',
     r'$\alpha = \arctan(1) = 45^\circ$ - der Hang steigt dort um $1$ m je Meter.',
     r'Falle: Mit $f(50) = 25$ statt $f^{\prime}(50)$ käme $87{,}7^\circ$ heraus, ein senkrechter Absturz.'])

Q.q(r'Die Tangente an den Graphen von $f(x) = x^2 + 3$ im Punkt $P(x_0|f(x_0))$ verläuft durch den Ursprung. Bestimme das positive $x_0$.',
    [r'$x_0 = \sqrt{3} \approx 1{,}73$', r'$x_0 = 3$', r'$x_0 = \dfrac{3}{2}$', r'$x_0 = \sqrt{2} \approx 1{,}41$'],
    [r'Tangente: $y = x_0^2 + 3 + 2x_0\,(x - x_0) = 2x_0\,x - x_0^2 + 3$',
     r'Durch den Ursprung heißt $y(0) = 0$: $-x_0^2 + 3 = 0$, also $x_0 = \sqrt{3}$.',
     r'Probe: $f(\sqrt{3}) = 6$ und $f^{\prime}(\sqrt{3}) = 2\sqrt{3}$; die Gerade $y = 2\sqrt{3}\,x$ trifft $(\sqrt{3}|6)$.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    d = lambda e, n=1: sp.diff(e, x, n)
    eq = lambda a, b: sp.simplify(a - b) == 0
    # chain rule
    assert eq(d((3 * x + 2) ** 4), 12 * (3 * x + 2) ** 3)
    assert eq(d((x - 5) ** 3), 3 * (x - 5) ** 2)
    assert eq(d((4 - 2 * x) ** 3), -6 * (4 - 2 * x) ** 2)
    assert eq(d(1 / (2 * x + 1)), -2 / (2 * x + 1) ** 2)
    assert eq(d(sp.sqrt(2 * x + 1)), 1 / sp.sqrt(2 * x + 1))
    ch = (x ** 2 - 1) ** 3
    assert eq(d(ch), 6 * x * (x ** 2 - 1) ** 2) and d(ch).subs(x, 2) == 108
    assert (3 * (2 ** 2 - 1) ** 2 * 2 == 54) and (3 * (2 ** 2 - 1) ** 2 == 27) and ((2 ** 2 - 1) ** 2 == 9)
    # f and its derivative
    f = x ** 3 - 6 * x ** 2 + 9 * x
    assert eq(d(f), 3 * (x - 1) * (x - 3)) and sorted(sp.solve(d(f), x)) == [1, 3]
    assert sorted(sp.solve(f, x)) == [0, 3] and d(f, 2).subs(x, 2) == 0
    par = (x - 2) ** 2 - 1
    assert eq(sp.expand(par), x ** 2 - 4 * x + 3) and eq(d(par), 2 * x - 4) and sp.solve(d(par), x) == [2]
    c = sp.symbols('c')
    assert sp.diff(3 * x + c, x) == 3
    # tangent and normal
    tan_at = lambda expr, a: sp.expand(expr.subs(x, a) + d(expr).subs(x, a) * (x - a))
    nor_at = lambda expr, a: sp.expand(expr.subs(x, a) - (x - a) / d(expr).subs(x, a))
    assert tan_at(x ** 2, 3) == 6 * x - 9
    assert tan_at(x ** 3 - 2 * x, 1) == x - 2 and (x ** 3 - 2 * x).subs(x, 1) == -1
    assert eq(nor_at(x ** 2, 2), -x / 4 + sp.Rational(9, 2)) and tan_at(x ** 2, 2) == 4 * x - 4
    assert sp.Rational(-1, 2) * 2 == -1
    kt = (2 * x - 1) ** 3
    assert kt.subs(x, 1) == 1 and eq(d(kt), 6 * (2 * x - 1) ** 2) and d(kt).subs(x, 1) == 6
    assert tan_at(kt, 1) == 6 * x - 5
    assert eq(nor_at(x ** 3, 1), -x / 3 + sp.Rational(4, 3)) and tan_at(x ** 3, 1) == 3 * x - 2
    # angles
    ang = lambda m: sp.deg(sp.atan(m)).evalf()
    assert d(x ** 2 - 4).subs(x, 2) == 4 and abs(ang(4) - 76.0) < 0.05
    assert abs(ang(sp.Rational(1, 4)) - 14.0) < 0.05
    assert d(x ** 3 - x).subs(x, 1) == 2 and abs(ang(2) - 63.4) < 0.05 and abs(ang(sp.Rational(1, 2)) - 26.6) < 0.05
    hang = sp.Rational(1, 100) * x ** 2
    assert eq(d(hang), x / 50) and d(hang).subs(x, 50) == 1 and sp.deg(sp.atan(1)) == 45
    assert hang.subs(x, 50) == 25 and abs(ang(25) - 87.7) < 0.05 and abs(ang(sp.Rational(1, 100)) - 0.6) < 0.05
    # tangent through the origin
    x0 = sp.symbols('x0', positive=True)
    t = (x0 ** 2 + 3) + 2 * x0 * (x - x0)
    assert sp.expand(t) == 2 * x0 * x - x0 ** 2 + 3
    assert sp.solve(sp.Eq(t.subs(x, 0), 0), x0) == [sp.sqrt(3)]
    assert (x ** 2 + 3).subs(x, sp.sqrt(3)) == 6 and abs(float(sp.sqrt(3)) - 1.73) < 0.005


Q.verify(check)
Q.save()
