#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 16 (LB 2): Kurvendiskussion I - Nullstellen und ihre
Vielfachheit (Berühren oder Schneiden), Symmetrie an den Exponenten, Monotonie über
die erste Ableitung, Extrempunkte mit notwendiger und hinreichender Bedingung.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=16, slug='kurvendiskussion1', thema='Kurvendiskussion I', lb='LB 2',
          blurb='Nullstellen und Vielfachheit, Symmetrie, Monotonie, Extrempunkte',
          comment='Blocks: Nullstellen und Vielfachheit (1-6), Symmetrie (7-10), Monotonie (11-14), Extrempunkte und ihre Art (15-18), Anwendungen (19-20). Alles ohne CAS.')


def fig_vielfachheit():
    """f(x) = (x-2)^2 (x+1): touches the axis at x = 2, crosses it at x = -1."""
    f = lambda u: (u - 2) ** 2 * (u + 1)
    p = Plot((-1.9, 3.4), (-4, 7), w=520, h=340)
    p.grid(1, 1)
    p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y", defer_labels=True)
    p.curve(f, -1.7, 3.2)
    p.draw_labels()
    return p.svg("Graph von f mit einer einfachen und einer doppelten Nullstelle")


# ------------------------------------------- Nullstellen und Vielfachheit ----
Q.q(r'Bestimme die Nullstellen von $f(x) = x^2 - 6x + 5$.',
    [r'$x_1 = 1$ und $x_2 = 5$', r'$x_1 = -1$ und $x_2 = -5$', r'$x_1 = 1$ und $x_2 = 6$', r'$x_1 = 5$ und $x_2 = 6$'],
    [r'Satz von Vieta oder $pq$-Formel: gesucht sind zwei Zahlen mit der Summe $6$ und dem Produkt $5$.',
     r'$f(x) = (x - 1)(x - 5)$, also $x_1 = 1$ und $x_2 = 5$.',
     r'Probe: $f(1) = 1 - 6 + 5 = 0$ und $f(5) = 25 - 30 + 5 = 0$.'])

Q.q(r'Welche Nullstellen hat $f(x) = (x + 2)(x - 1)(x - 4)$?',
    [r'$x_1 = -2$, $x_2 = 1$, $x_3 = 4$', r'$x_1 = 2$, $x_2 = -1$, $x_3 = -4$',
     r'$x_1 = -2$, $x_2 = -1$, $x_3 = -4$', r'keine - dazu müsste man erst ausmultiplizieren'],
    [r'Ein Produkt ist genau dann $0$, wenn einer der Faktoren $0$ ist (Satz vom Nullprodukt).',
     r'$x + 2 = 0$, $x - 1 = 0$, $x - 4 = 0$ liefern $-2$, $1$ und $4$.',
     r'Falle: Das Vorzeichen in der Klammer dreht sich um - $(x + 2)$ gehört zur Nullstelle $-2$.'])

Q.q(r'Die Abbildung zeigt den Graphen von $f(x) = (x - 2)^2 (x + 1)$. Was passiert an den Nullstellen?',
    [r'Bei $x = 2$ berührt der Graph die $x$-Achse, bei $x = -1$ schneidet er sie.',
     r'Bei $x = -1$ berührt der Graph die $x$-Achse, bei $x = 2$ schneidet er sie.',
     r'Der Graph schneidet die $x$-Achse an beiden Stellen.',
     r'Der Graph berührt die $x$-Achse an beiden Stellen.'],
    [r'$x = 2$ ist wegen des Quadrats eine doppelte Nullstelle, $x = -1$ eine einfache.',
     r'Gerade Vielfachheit heißt berühren, ungerade Vielfachheit heißt schneiden.',
     r'Im Bild liegt der Graph links und rechts von $x = 2$ oberhalb der Achse, bei $x = -1$ wechselt er die Seite.'],
    fig=fig_vielfachheit(), figcap=r'Graph von $f(x) = (x - 2)^2 (x + 1)$')

Q.q(r'Bestimme die Nullstellen von $f(x) = x^3 + 3x^2$ mit ihrer Vielfachheit.',
    [r'$x = 0$ doppelt (berühren), $x = -3$ einfach (schneiden)',
     r'$x = 0$ einfach (schneiden), $x = -3$ doppelt (berühren)',
     r'$x = 0$ dreifach (schneiden mit waagerechter Tangente)',
     r'$x = 3$ doppelt (berühren), $x = 0$ einfach (schneiden)'],
    [r'Ausklammern: $f(x) = x^2\,(x + 3)$',
     r'Der Faktor $x^2$ liefert die doppelte Nullstelle $x = 0$, der Faktor $x + 3$ die einfache Nullstelle $x = -3$.',
     r'Probe im Kopf: $f(-1) = -1 + 3 = 2 > 0$ und $f(1) = 4 > 0$ - der Graph bleibt links und rechts der $0$ oben, er berührt dort also nur.'])

Q.q(r'Bestimme alle Nullstellen von $f(x) = x^4 - 5x^2 + 4$.',
    [r'$x = \pm 1$ und $x = \pm 2$', r'nur $x = \pm 1$', r'nur $x = \pm 2$', r'$x = 1$ und $x = 4$'],
    [r'Substitution $u = x^2$: $u^2 - 5u + 4 = 0$ mit den Lösungen $u_1 = 1$ und $u_2 = 4$.',
     r'Rücksubstitution: $x^2 = 1$ gibt $x = \pm 1$, $x^2 = 4$ gibt $x = \pm 2$.',
     r'Falle: $u_1 = 1$ und $u_2 = 4$ sind noch keine Nullstellen von $f$, erst die Wurzeln daraus.'])

Q.q(r'Welche Vielfachheit hat die Nullstelle $x = 0$ von $f(x) = x^4 - 4x^3$, und was folgt daraus für den Graphen?',
    [r'dreifach - der Graph schneidet die $x$-Achse mit waagerechter Tangente',
     r'dreifach - der Graph berührt die $x$-Achse',
     r'einfach - der Graph schneidet die $x$-Achse schräg',
     r'vierfach - der Graph berührt die $x$-Achse'],
    [r'Ausklammern: $f(x) = x^3\,(x - 4)$ - die Nullstelle $x = 0$ ist dreifach.',
     r'Ungerade Vielfachheit heißt schneiden; ab der Vielfachheit $3$ legt sich der Graph dabei waagerecht an die Achse.',
     r'Nachrechnen: $f^{\prime}(x) = 4x^3 - 12x^2$ und $f^{\prime}(0) = 0$ - die Tangente ist dort tatsächlich waagerecht.'])

# ------------------------------------------------------------------ Symmetrie ----
Q.q(r'Welcher Graph ist achsensymmetrisch zur $y$-Achse?',
    [r'$f(x) = x^4 - 3x^2 + 1$', r'$f(x) = x^3 - x$', r'$f(x) = x^3 + x^2$', r'$f(x) = x^2 + x$'],
    [r'Achsensymmetrie zur $y$-Achse bedeutet $f(-x) = f(x)$.',
     r'Bei einer ganzrationalen Funktion gilt das genau dann, wenn nur gerade Exponenten vorkommen (die Konstante zählt als $x^0$).',
     r'$x^4 - 3x^2 + 1$ hat nur gerade Exponenten; $x^3 - x$ ist punktsymmetrisch, die beiden anderen sind unsymmetrisch.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^5 - 4x^3 + x$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur $y$-Achse',
     r'achsensymmetrisch zur $x$-Achse', r'weder achsen- noch punktsymmetrisch'],
    [r'Es kommen nur ungerade Exponenten vor ($5$, $3$, $1$).',
     r'Damit gilt $f(-x) = -f(x)$, der Graph ist punktsymmetrisch zum Ursprung.',
     r'Zur $x$-Achse kann ein Funktionsgraph nie symmetrisch sein - sonst gäbe es zu einem $x$ zwei Funktionswerte.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^4 + 2x^3$?',
    [r'weder achsen- noch punktsymmetrisch', r'achsensymmetrisch zur $y$-Achse',
     r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur Geraden $x = 2$'],
    [r'Hier treffen gerade ($4$) und ungerade ($3$) Exponenten aufeinander.',
     r'Probe: $f(1) = 3$, aber $f(-1) = 1 - 2 = -1$ - weder gleich noch entgegengesetzt.',
     r'Also liegt keine der beiden Symmetrien vor.'])

Q.q(r'Der Graph von $f$ ist punktsymmetrisch zum Ursprung und es gilt $f(2) = 5$. Welchen Wert hat $f(-2)$?',
    [r'$f(-2) = -5$', r'$f(-2) = 5$', r'$f(-2) = -2$', r'$f(-2) = 0$'],
    [r'Punktsymmetrie zum Ursprung heißt $f(-x) = -f(x)$.',
     r'$f(-2) = -f(2) = -5$',
     r'Bei Achsensymmetrie zur $y$-Achse wäre dagegen $f(-2) = f(2) = 5$.'])

# ------------------------------------------------------------------ Monotonie ----
Q.q(r'Auf welchem Bereich ist $f(x) = x^2 - 6x$ monoton fallend?',
    [r'für $x < 3$', r'für $x > 3$', r'für $x < 0$', r'für $0 < x < 6$'],
    [r'$f^{\prime}(x) = 2x - 6$',
     r'Monoton fallend heißt $f^{\prime}(x) < 0$: $2x - 6 < 0$, also $x < 3$.',
     r'Falle: $0 < x < 6$ ist der Bereich, in dem $f$ negativ ist - das ist etwas anderes als fallend.'])

Q.q(r'Auf welchem Intervall ist $f(x) = x^3 - 12x$ monoton fallend?',
    [r'$-2 < x < 2$', r'$x < -2$', r'$0 < x < 2$', r'$x > 2$'],
    [r'$f^{\prime}(x) = 3x^2 - 12 = 3\,(x - 2)(x + 2)$',
     r'Die Parabel $f^{\prime}$ ist zwischen ihren Nullstellen $-2$ und $2$ negativ.',
     r'Probe: $f^{\prime}(0) = -12 < 0$, also fällt $f$ dort - außerhalb wächst der Graph.'])

Q.q(r'Für eine Funktion $f$ gilt $f^{\prime}(x) = (x - 1)^2$. Welche Aussage ist richtig?',
    [r'$f$ ist auf ganz $\mathbb{R}$ monoton wachsend; bei $x = 1$ liegt nur eine waagerechte Tangente',
     r'$f$ hat bei $x = 1$ einen Tiefpunkt', r'$f$ hat bei $x = 1$ einen Hochpunkt',
     r'$f$ ist auf ganz $\mathbb{R}$ monoton fallend'],
    [r'$(x - 1)^2 \ge 0$ für jedes $x$, also ist der Anstieg nirgends negativ.',
     r'Nur bei $x = 1$ ist $f^{\prime}(x) = 0$, dort verläuft die Tangente waagerecht.',
     r'$f^{\prime}$ wechselt dort aber das Vorzeichen nicht - ohne Vorzeichenwechsel kein Extrempunkt.'])

Q.q(r'Auf welchem Intervall wächst der Graph von $f(x) = -x^3 + 3x^2$?',
    [r'$0 < x < 2$', r'$x < 0$', r'$x > 2$', r'$-2 < x < 0$'],
    [r'$f^{\prime}(x) = -3x^2 + 6x = -3x\,(x - 2)$',
     r'Die nach unten geöffnete Parabel $f^{\prime}$ ist zwischen ihren Nullstellen $0$ und $2$ positiv.',
     r'Probe: $f^{\prime}(1) = 3 > 0$ - dort steigt der Graph.'])

# ------------------------------------------------ Extrempunkte und ihre Art ----
Q.q(r'Welche Bedingungen sichern einen Hochpunkt an der Stelle $x_0$?',
    [r'$f^{\prime}(x_0) = 0$ und $f^{\prime\prime}(x_0) < 0$', r'$f^{\prime}(x_0) = 0$ und $f^{\prime\prime}(x_0) > 0$',
     r'$f(x_0) = 0$ und $f^{\prime}(x_0) < 0$', r'$f^{\prime\prime}(x_0) = 0$ und $f^{\prime}(x_0) < 0$'],
    [r'Notwendig ist eine waagerechte Tangente: $f^{\prime}(x_0) = 0$.',
     r'Hinreichend wird es durch $f^{\prime\prime}(x_0) < 0$ - oder gleichwertig durch den Vorzeichenwechsel von $f^{\prime}$ von $+$ nach $-$.',
     r'Falle: $f^{\prime\prime}(x_0) > 0$ gehört zum Tiefpunkt.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = x^2 + 6x + 5$ und seine Art.',
    [r'Tiefpunkt $T(-3|-4)$', r'Hochpunkt $H(-3|-4)$', r'Tiefpunkt $T(3|32)$', r'Tiefpunkt $T(-3|4)$'],
    [r'$f^{\prime}(x) = 2x + 6 = 0$ liefert $x = -3$.',
     r'$f(-3) = 9 - 18 + 5 = -4$, also der Punkt $(-3|-4)$.',
     r'$f^{\prime\prime}(x) = 2 > 0$: Es ist ein Tiefpunkt - passend zur nach oben geöffneten Parabel.'])

Q.q(r'Bestimme Lage und Art der Extrempunkte von $f(x) = 2x^3 - 3x^2 - 12x$.',
    [r'$H(-1|7)$ und $T(2|-20)$', r'$T(-1|7)$ und $H(2|-20)$', r'$H(-1|7)$ und $T(2|20)$', r'nur $T(2|-20)$'],
    [r'$f^{\prime}(x) = 6x^2 - 6x - 12 = 6\,(x - 2)(x + 1)$, also $x_1 = -1$ und $x_2 = 2$.',
     r'$f(-1) = -2 - 3 + 12 = 7$ und $f(2) = 16 - 12 - 24 = -20$.',
     r'$f^{\prime\prime}(x) = 12x - 6$: $f^{\prime\prime}(-1) = -18 < 0$ (Hochpunkt), $f^{\prime\prime}(2) = 18 > 0$ (Tiefpunkt).'])

Q.q(r'Welche Extrempunkte hat $f(x) = x^4 - 2x^2$?',
    [r'$H(0|0)$, $T(-1|-1)$ und $T(1|-1)$', r'$T(0|0)$, $H(-1|-1)$ und $H(1|-1)$',
     r'nur $H(0|0)$', r'$H(0|0)$, $T(-1|1)$ und $T(1|1)$'],
    [r'$f^{\prime}(x) = 4x^3 - 4x = 4x\,(x - 1)(x + 1)$, also $x = 0$, $x = 1$ und $x = -1$.',
     r'$f^{\prime\prime}(x) = 12x^2 - 4$: $f^{\prime\prime}(0) = -4 < 0$, $f^{\prime\prime}(\pm 1) = 8 > 0$.',
     r'Funktionswerte: $f(0) = 0$ und $f(\pm 1) = 1 - 2 = -1$ - die typische Doppelmulde.'])

# --------------------------------------------------------------- Anwendungen ----
Q.q(r'Aus einem $24$ cm langen Draht wird ein Rechteck gebogen. Wie groß ist der größtmögliche Flächeninhalt?',
    [r'$36\,\mathrm{cm}^2$', r'$32\,\mathrm{cm}^2$', r'$24\,\mathrm{cm}^2$', r'$144\,\mathrm{cm}^2$'],
    [r'Halber Umfang: $x + y = 12$, also $y = 12 - x$ und $A(x) = x\,(12 - x) = 12x - x^2$.',
     r'$A^{\prime}(x) = 12 - 2x = 0$ liefert $x = 6$; $A^{\prime\prime}(x) = -2 < 0$, also ein Hochpunkt.',
     r'$A(6) = 36\,\mathrm{cm}^2$ - das Quadrat gewinnt. Ein Rechteck $4 \times 8$ brächte nur $32\,\mathrm{cm}^2$.'])

Q.q(r'Der Gewinn eines Betriebs beträgt $G(x) = -x^3 + 9x^2 - 15x$ (in Tsd. €, $x$ in ME, $0 \leq x \leq 7$). Bei welcher Menge ist der Gewinn am größten?',
    [r'bei $x = 5$ ME mit $25$ Tsd. €', r'bei $x = 1$ ME mit $-7$ Tsd. €',
     r'bei $x = 3$ ME mit $9$ Tsd. €', r'bei $x = 5$ ME mit $75$ Tsd. €'],
    [r'$G^{\prime}(x) = -3x^2 + 18x - 15 = -3\,(x - 1)(x - 5)$, also $x = 1$ und $x = 5$.',
     r'$G^{\prime\prime}(x) = -6x + 18$: $G^{\prime\prime}(5) = -12 < 0$ - bei $x = 5$ liegt der Hochpunkt, bei $x = 1$ ein Tiefpunkt.',
     r'$G(5) = -125 + 225 - 75 = 25$ Tsd. €; die Ränder bringen weniger: $G(0) = 0$ und $G(7) = -7$.'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    d = lambda e, n=1: sp.diff(e, x, n)
    eq = lambda a, b: sp.simplify(a - b) == 0
    # zeros and multiplicity
    assert sorted(sp.solve(x ** 2 - 6 * x + 5, x)) == [1, 5] and eq((x - 1) * (x - 5), x ** 2 - 6 * x + 5)
    assert sorted(sp.solve((x + 2) * (x - 1) * (x - 4), x)) == [-2, 1, 4]
    tri = (x - 2) ** 2 * (x + 1)
    assert sp.roots(sp.Poly(sp.expand(tri), x)) == {2: 2, -1: 1}
    assert tri.subs(x, 1) > 0 and tri.subs(x, 3) > 0 and tri.subs(x, -1.5) < 0
    kub = x ** 3 + 3 * x ** 2
    assert eq(kub, x ** 2 * (x + 3)) and sp.roots(sp.Poly(kub, x)) == {0: 2, -3: 1}
    assert kub.subs(x, -1) == 2 and kub.subs(x, 1) == 4
    assert sorted(sp.solve(x ** 4 - 5 * x ** 2 + 4, x)) == [-2, -1, 1, 2]
    assert sorted(sp.solve(sp.Symbol('u') ** 2 - 5 * sp.Symbol('u') + 4, sp.Symbol('u'))) == [1, 4]
    q4 = x ** 4 - 4 * x ** 3
    assert eq(q4, x ** 3 * (x - 4)) and sp.roots(sp.Poly(q4, x)) == {0: 3, 4: 1}
    assert eq(d(q4), 4 * x ** 3 - 12 * x ** 2) and d(q4).subs(x, 0) == 0
    # symmetry
    ax = lambda e: sp.simplify(e.subs(x, -x) - e) == 0
    pt = lambda e: sp.simplify(e.subs(x, -x) + e) == 0
    assert ax(x ** 4 - 3 * x ** 2 + 1) and not ax(x ** 3 - x) and not ax(x ** 3 + x ** 2) and not ax(x ** 2 + x)
    assert pt(x ** 3 - x) and pt(x ** 5 - 4 * x ** 3 + x) and not ax(x ** 5 - 4 * x ** 3 + x)
    m = x ** 4 + 2 * x ** 3
    assert not ax(m) and not pt(m) and m.subs(x, 1) == 3 and m.subs(x, -1) == -1
    # monotonicity
    assert eq(d(x ** 2 - 6 * x), 2 * x - 6) and sp.solve(d(x ** 2 - 6 * x), x) == [3]
    assert (2 * 0 - 6) < 0 and (2 * 4 - 6) > 0 and sorted(sp.solve(x ** 2 - 6 * x, x)) == [0, 6]
    k = x ** 3 - 12 * x
    assert eq(d(k), 3 * (x - 2) * (x + 2)) and sorted(sp.solve(d(k), x)) == [-2, 2] and d(k).subs(x, 0) == -12
    assert d(k).subs(x, 3) > 0 and d(k).subs(x, -3) > 0
    assert ((x - 1) ** 2).subs(x, 5) > 0 and sp.solve((x - 1) ** 2, x) == [1]
    n = -x ** 3 + 3 * x ** 2
    assert eq(d(n), -3 * x * (x - 2)) and sorted(sp.solve(d(n), x)) == [0, 2] and d(n).subs(x, 1) == 3
    assert d(n).subs(x, -1) < 0 and d(n).subs(x, 3) < 0
    # extrema
    p = x ** 2 + 6 * x + 5
    assert sp.solve(d(p), x) == [-3] and p.subs(x, -3) == -4 and d(p, 2) == 2 and p.subs(x, 3) == 32
    g = 2 * x ** 3 - 3 * x ** 2 - 12 * x
    assert eq(d(g), 6 * (x - 2) * (x + 1)) and sorted(sp.solve(d(g), x)) == [-1, 2]
    assert g.subs(x, -1) == 7 and g.subs(x, 2) == -20
    assert d(g, 2).subs(x, -1) == -18 and d(g, 2).subs(x, 2) == 18
    q = x ** 4 - 2 * x ** 2
    assert eq(d(q), 4 * x * (x - 1) * (x + 1)) and sorted(sp.solve(d(q), x)) == [-1, 0, 1]
    assert d(q, 2).subs(x, 0) == -4 and d(q, 2).subs(x, 1) == 8 and d(q, 2).subs(x, -1) == 8
    assert q.subs(x, 0) == 0 and q.subs(x, 1) == -1 and q.subs(x, -1) == -1
    # applications
    A = x * (12 - x)
    assert eq(A, 12 * x - x ** 2) and sp.solve(d(A), x) == [6] and d(A, 2) == -2
    assert A.subs(x, 6) == 36 and A.subs(x, 4) == 32 and 12 ** 2 == 144
    G = -x ** 3 + 9 * x ** 2 - 15 * x
    assert eq(d(G), -3 * (x - 1) * (x - 5)) and sorted(sp.solve(d(G), x)) == [1, 5]
    assert d(G, 2).subs(x, 5) == -12 and d(G, 2).subs(x, 1) == 12
    assert G.subs(x, 5) == 25 and G.subs(x, 1) == -7 and G.subs(x, 3) == 9
    assert G.subs(x, 0) == 0 and G.subs(x, 7) == -7


Q.verify(check)
Q.save()
