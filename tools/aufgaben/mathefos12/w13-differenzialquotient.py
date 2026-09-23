#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 13 (LB 2): Differenzen- und Differenzialquotient -
Differenzenquotient berechnen, h-Methode und Grenzübergang an x^2 und x^3, Sekanten-
und Tangentenanstieg, geometrische Deutung, Ableitung an einer Stelle.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=13, slug='differenzialquotient', thema='Differenzialquotient', lb='LB 2',
          blurb='Differenzenquotient, Differenzialquotient, Sekante und Tangente, Ableitung an einer Stelle',
          comment='Blocks: Differenzenquotient und Sekante (1-5), h-Methode und Grenzübergang (6-12), Tangente und Ableitung an einer Stelle (13-16), Anwendungen (17-20). Alles ohne CAS.')


def fig_sekante():
    """f(x) = x^2 with the secant through P(1|1) and Q(3|9) and the tangent at P."""
    f = lambda u: u * u
    p = Plot((-0.8, 3.9), (-2, 10.5), w=520, h=340)
    p.grid(1, 2)
    p.axes(xstep=1, ystep=2, xlabel="x", ylabel="y", defer_labels=True)
    p.curve(f, -0.8, 3.3)
    p.seg((0.1, 4 * 0.1 - 3), (3.6, 4 * 3.6 - 3), clip=True)
    p.tangent(f, lambda u: 2 * u, 1, half=1.3)
    p.point(1, 1, "P", "above-left")
    p.point(3, 9, "Q", "right")
    p.draw_labels()
    return p.svg("Graph von f mit Sekante durch P und Q und Tangente in P")


# ------------------------------------------- Differenzenquotient und Sekante ----
Q.q(r'Der Graph von $f(x) = x^2$ wird von der Sekante durch die Punkte mit $x_1 = 1$ und $x_2 = 3$ geschnitten. Welchen Anstieg hat diese Sekante?',
    [r'$4$', r'$8$', r'$2$', r'$5$'],
    [r'$f(1) = 1$ und $f(3) = 9$.',
     r'Differenzenquotient: $\dfrac{f(3) - f(1)}{3 - 1} = \dfrac{9 - 1}{2} = 4$',
     r'Falle: $8$ ist nur der Zähler; $2$ ist der Anstieg der Tangente in $x = 1$, nicht der der Sekante.'])

Q.q(r'Berechne den Differenzenquotienten von $f(x) = x^2 + 1$ auf dem Intervall $[2;\, 5]$.',
    [r'$7$', r'$21$', r'$3$', r'$5{,}2$'],
    [r'$f(2) = 5$ und $f(5) = 26$.',
     r'$\dfrac{f(5) - f(2)}{5 - 2} = \dfrac{21}{3} = 7$',
     r'Falle: $21$ ist die Änderung, $3$ die Intervalllänge; $5{,}2 = \dfrac{f(5)}{5}$ ist etwas ganz anderes.'])

Q.q(r'Welcher Term ist der Differenzenquotient von $f$ auf dem Intervall $[x_0;\, x_0 + h]$?',
    [r'$\dfrac{f(x_0 + h) - f(x_0)}{h}$', r'$\dfrac{f(x_0 + h) - f(x_0)}{x_0}$',
     r'$\dfrac{f(x_0 + h)}{h}$', r'$f(x_0 + h) - f(x_0)$'],
    [r'Der Differenzenquotient ist „Änderung der Funktionswerte geteilt durch Änderung von $x$“.',
     r'Die $x$-Werte ändern sich von $x_0$ auf $x_0 + h$, der Nenner ist also $h$.',
     r'Geometrisch ist das der Anstieg der Sekante durch die beiden Kurvenpunkte.'])

Q.q(r'Welchen Anstieg hat die Sekante an $f(x) = x^3$ zwischen $x_1 = 0$ und $x_2 = 2$?',
    [r'$4$', r'$8$', r'$2$', r'$12$'],
    [r'$f(0) = 0$ und $f(2) = 8$.',
     r'$\dfrac{8 - 0}{2 - 0} = 4$',
     r'Falle: $12$ ist der Anstieg der Tangente in $x = 2$, die Sekante ist flacher.'])

Q.q(r'Ein Bogen wird durch $f(x) = -x^2 + 6x$ beschrieben. Welchen Anstieg hat die Sekante zwischen $x_1 = 1$ und $x_2 = 4$?',
    [r'$1$', r'$3$', r'$-1$', r'$2$'],
    [r'$f(1) = -1 + 6 = 5$ und $f(4) = -16 + 24 = 8$.',
     r'$\dfrac{8 - 5}{4 - 1} = \dfrac{3}{3} = 1$',
     r'Falle: $3$ ist nur der Zähler, $2 = \dfrac{f(4)}{4}$ gehört nicht hierher.'])

# ------------------------------------------- h-Methode und Grenzübergang ----
Q.q(r'Vereinfache den Differenzenquotienten von $f(x) = x^2$ an der Stelle $x_0 = 3$, also $\dfrac{f(3 + h) - f(3)}{h}$.',
    [r'$6 + h$', r'$6$', r'$9 + 6h + h^2$', r'$6h + h^2$'],
    [r'$f(3 + h) = (3 + h)^2 = 9 + 6h + h^2$ und $f(3) = 9$.',
     r'Zähler: $9 + 6h + h^2 - 9 = 6h + h^2 = h\,(6 + h)$',
     r'Kürzen durch $h$ (erlaubt, weil $h \ne 0$): $6 + h$.'])

Q.q(r'Weiter mit $f(x) = x^2$: Welchen Wert hat $f^{\prime}(3) = \lim\limits_{h \to 0} \dfrac{f(3 + h) - f(3)}{h}$?',
    [r'$6$', r'$9$', r'$6 + h$', r'$0$'],
    [r'Der Differenzenquotient ist $6 + h$.',
     r'Grenzübergang $h \to 0$: $\lim\limits_{h \to 0} (6 + h) = 6$',
     r'Falle: $6 + h$ ist noch der Sekantenanstieg, $9 = f(3)$ ist der Funktionswert.'])

Q.q(r'Die h-Methode liefert für $f(x) = x^2$ an einer beliebigen Stelle $x_0$ welches Ergebnis?',
    [r'$f^{\prime}(x_0) = 2x_0$', r'$f^{\prime}(x_0) = x_0^2$', r'$f^{\prime}(x_0) = 2x_0 + h$', r'$f^{\prime}(x_0) = x_0$'],
    [r'$(x_0 + h)^2 - x_0^2 = 2x_0 h + h^2 = h\,(2x_0 + h)$',
     r'Durch $h$ kürzen: $2x_0 + h$; für $h \to 0$ bleibt $2x_0$.',
     r'Damit hat jede Stelle ihren eigenen Anstieg: $f^{\prime}(x) = 2x$ ist die Ableitungsfunktion von $f(x) = x^2$.'])

Q.q(r'Vereinfache $\dfrac{f(2 + h) - f(2)}{h}$ für $f(x) = x^3$.',
    [r'$12 + 6h + h^2$', r'$12 + 6h$', r'$8 + 12h + 6h^2$', r'$6 + 12h + h^2$'],
    [r'$(2 + h)^3 = 8 + 12h + 6h^2 + h^3$ und $f(2) = 8$.',
     r'Zähler: $12h + 6h^2 + h^3 = h\,(12 + 6h + h^2)$',
     r'Kürzen durch $h$: $12 + 6h + h^2$.'])

Q.q(r'Welchen Anstieg hat der Graph von $f(x) = x^3$ damit an der Stelle $x_0 = 2$?',
    [r'$12$', r'$8$', r'$6$', r'$4$'],
    [r'$\lim\limits_{h \to 0} (12 + 6h + h^2) = 12$',
     r'Also $f^{\prime}(2) = 12$: Die Tangente im Punkt $(2|8)$ steigt mit dem Anstieg $12$.',
     r'Falle: $8 = f(2)$ ist der Funktionswert, $4$ der Sekantenanstieg von $0$ bis $2$.'])

Q.q(r'Bestimme $f^{\prime}(1)$ für $f(x) = 2x^2 - 3x$ mit der h-Methode.',
    [r'$1$', r'$-1$', r'$4$', r'$1 + 2h$'],
    [r'$f(1 + h) = 2\,(1 + 2h + h^2) - 3 - 3h = -1 + h + 2h^2$ und $f(1) = -1$.',
     r'$\dfrac{f(1 + h) - f(1)}{h} = \dfrac{h + 2h^2}{h} = 1 + 2h$',
     r'Für $h \to 0$: $f^{\prime}(1) = 1$. Falle: $-1 = f(1)$ ist der Funktionswert.'])

Q.q(r'Was ergibt die h-Methode für die lineare Funktion $f(x) = 3x + 2$ an einer beliebigen Stelle $x_0$?',
    [r'$f^{\prime}(x_0) = 3$, denn der Differenzenquotient ist schon für jedes $h$ gleich $3$',
     r'$f^{\prime}(x_0) = 3x_0 + 2$', r'$f^{\prime}(x_0) = 5$', r'$f^{\prime}(x_0) = 3 + h$'],
    [r'$f(x_0 + h) - f(x_0) = 3\,(x_0 + h) + 2 - (3x_0 + 2) = 3h$',
     r'$\dfrac{3h}{h} = 3$ - unabhängig von $h$ und von $x_0$.',
     r'Bei einer Geraden fällt jede Sekante mit der Geraden selbst zusammen, der Anstieg ist überall $3$.'])

# ----------------------------- Tangente und Ableitung an einer Stelle ----
Q.q(r'Was beschreibt der Differenzialquotient $\lim\limits_{h \to 0} \dfrac{f(x_0 + h) - f(x_0)}{h}$ geometrisch?',
    [r'den Anstieg der Tangente an den Graphen von $f$ im Punkt $P(x_0|f(x_0))$',
     r'den Anstieg der Sekante durch $P(x_0|f(x_0))$ und $Q(x_0 + h|f(x_0 + h))$',
     r'den Funktionswert $f(x_0)$',
     r'den Inhalt der Fläche unter dem Graphen bis zur Stelle $x_0$'],
    [r'Für festes $h$ misst der Bruch den Sekantenanstieg.',
     r'Lässt man $Q$ auf $P$ zuwandern ($h \to 0$), geht die Sekante in die Tangente über.',
     r'Der Grenzwert heißt Ableitung von $f$ an der Stelle $x_0$, kurz $f^{\prime}(x_0)$.'])

Q.q(r'Die Abbildung zeigt den Graphen von $f(x) = x^2$ mit der Sekante durch $P(1|1)$ und $Q(3|9)$ sowie der Tangente in $P$. Um wie viel ist der Sekantenanstieg größer als der Tangentenanstieg in $P$?',
    [r'um $2$', r'um $4$', r'um $6$', r'um $0$ - beide Anstiege sind gleich'],
    [r'Sekante: $\dfrac{9 - 1}{3 - 1} = 4$',
     r'Tangente in $P$: $f^{\prime}(1) = 2 \cdot 1 = 2$',
     r'Unterschied: $4 - 2 = 2$. Schiebt man $Q$ auf $P$ zu, wird aus der $4$ allmählich die $2$.'],
    fig=fig_sekante(), figcap=r'Graph von $f(x) = x^2$ mit der Sekante durch $P$ und $Q$ und der Tangente in $P$')

Q.q(r'Für $f(x) = x^2$ gilt $f^{\prime}(x) = 2x$. An welcher Stelle hat die Tangente den Anstieg $5$?',
    [r'$x = 2{,}5$', r'$x = 5$', r'$x = 10$', r'$x = 25$'],
    [r'Ansatz: $f^{\prime}(x) = 5$, also $2x = 5$.',
     r'$x = \dfrac{5}{2} = 2{,}5$',
     r'Probe: $f^{\prime}(2{,}5) = 2 \cdot 2{,}5 = 5$. Falle: $x = 5$ gäbe den Anstieg $10$.'])

Q.q(r'An welcher Stelle verläuft die Tangente an den Graphen von $f(x) = x^2 - 4x$ waagerecht?',
    [r'$x = 2$', r'$x = 0$', r'$x = 4$', r'$x = -2$'],
    [r'h-Methode: $f(x_0 + h) - f(x_0) = 2x_0 h + h^2 - 4h = h\,(2x_0 - 4 + h)$, also $f^{\prime}(x_0) = 2x_0 - 4$.',
     r'Waagerecht heißt Anstieg $0$: $2x_0 - 4 = 0$, also $x_0 = 2$.',
     r'Falle: $x = 0$ und $x = 4$ sind die Nullstellen von $f$, nicht die Stelle mit waagerechter Tangente.'])

# --------------------------------------------------------------- Anwendungen ----
Q.q(r'Ein Betrieb erzielt beim Absatz von $x$ Stück den Erlös $E(x) = 50x - 0{,}5x^2$ (in €). Wie groß ist der momentane Erlöszuwachs (Grenzerlös) bei $x = 20$?',
    [r'$30$ € pro Stück', r'$50$ € pro Stück', r'$40$ € pro Stück', r'$800$ € pro Stück'],
    [r'$E(20) = 1000 - 200 = 800$ und $E(20 + h) = 800 + 30h - 0{,}5h^2$.',
     r'$\dfrac{E(20 + h) - E(20)}{h} = 30 - 0{,}5h \longrightarrow 30$ für $h \to 0$',
     r'Falle: $40 = \dfrac{800}{20}$ ist der Erlös je Stück im Schnitt, $800$ der gesamte Erlös.'])

Q.q(r'Der Bremsweg eines Autos beträgt näherungsweise $s(v) = \dfrac{v^2}{100}$ ($s$ in m, $v$ in km/h). Wie stark wächst der Bremsweg bei $v = 50\,\dfrac{\mathrm{km}}{\mathrm{h}}$ momentan?',
    [r'um $1$ m je km/h', r'um $0{,}5$ m je km/h', r'um $2$ m je km/h', r'um $25$ m je km/h'],
    [r'$s(50) = 25$ und $s(50 + h) = \dfrac{2500 + 100h + h^2}{100}$.',
     r'$\dfrac{s(50 + h) - s(50)}{h} = \dfrac{100h + h^2}{100h} = 1 + \dfrac{h}{100} \longrightarrow 1$',
     r'Falle: $25$ ist der Bremsweg selbst, $0{,}5 = \dfrac{25}{50}$ die mittlere Zunahme seit dem Stillstand.'])

Q.q(r'Ein quadratisches Schild hat die Seitenlänge $a$ (in cm) und den Flächeninhalt $A(a) = a^2$. Wie schnell wächst die Fläche momentan, wenn die Seite gerade $6$ cm lang ist?',
    [r'um $12\,\mathrm{cm}^2$ je cm', r'um $36\,\mathrm{cm}^2$ je cm', r'um $6\,\mathrm{cm}^2$ je cm', r'um $24\,\mathrm{cm}^2$ je cm'],
    [r'$\dfrac{A(6 + h) - A(6)}{h} = \dfrac{36 + 12h + h^2 - 36}{h} = 12 + h$',
     r'Für $h \to 0$: $A^{\prime}(6) = 12\,\dfrac{\mathrm{cm}^2}{\mathrm{cm}}$ - anschaulich zwei Streifen der Länge $6$ cm.',
     r'Falle: $36 = A(6)$ ist die Fläche, $24$ der Umfang des Quadrats.'])

Q.q(r'Für $f(x) = x^3$ ergibt der Differenzenquotient an der Stelle $x_0 = 1$ nacheinander $3{,}31$ (für $h = 0{,}1$), $3{,}0301$ (für $h = 0{,}01$) und $3{,}003001$ (für $h = 0{,}001$). Welchen Wert hat $f^{\prime}(1)$?',
    [r'$3$', r'$3{,}003001$', r'$3{,}31$', r'$1$'],
    [r'Die Zahlen nähern sich sichtbar der $3$, kommen aber nie ganz an - genau das leistet der Grenzwert.',
     r'Nachrechnen: $\dfrac{(1 + h)^3 - 1}{h} = \dfrac{3h + 3h^2 + h^3}{h} = 3 + 3h + h^2 \longrightarrow 3$',
     r'Falle: Kein Differenzenquotient mit $h \ne 0$ ist der gesuchte Wert; $1 = f(1)$ ist der Funktionswert.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x, h, x0 = sp.symbols('x h x0')
    # secants
    f2 = lambda t: t ** 2
    assert f2(1) == 1 and f2(3) == 9 and F(f2(3) - f2(1), 3 - 1) == 4 and f2(3) - f2(1) == 8
    assert sp.limit((f2(1 + h) - f2(1)) / h, h, 0) == 2
    g = lambda t: t ** 2 + 1
    assert g(2) == 5 and g(5) == 26 and F(g(5) - g(2), 3) == 7 and g(5) - g(2) == 21
    assert abs(26 / 5 - 5.2) < 1e-12
    f3 = lambda t: t ** 3
    assert f3(0) == 0 and f3(2) == 8 and F(f3(2) - f3(0), 2) == 4
    assert sp.limit((f3(2 + h) - f3(2)) / h, h, 0) == 12
    b = lambda t: -t ** 2 + 6 * t
    assert b(1) == 5 and b(4) == 8 and F(b(4) - b(1), 3) == 1 and F(b(4), 4) == 2
    # h-method
    assert sp.simplify((f2(3 + h) - f2(3)) / h - (6 + h)) == 0
    assert sp.expand(f2(3 + h)) == 9 + 6 * h + h ** 2
    assert sp.limit((f2(3 + h) - f2(3)) / h, h, 0) == 6
    assert sp.simplify((f2(x0 + h) - f2(x0)) / h - (2 * x0 + h)) == 0
    assert sp.limit((f2(x0 + h) - f2(x0)) / h, h, 0) == 2 * x0
    assert sp.expand(f3(2 + h)) == 8 + 12 * h + 6 * h ** 2 + h ** 3
    assert sp.simplify((f3(2 + h) - f3(2)) / h - (12 + 6 * h + h ** 2)) == 0
    p = lambda t: 2 * t ** 2 - 3 * t
    assert p(1) == -1 and sp.expand(p(1 + h)) == -1 + h + 2 * h ** 2
    assert sp.simplify((p(1 + h) - p(1)) / h - (1 + 2 * h)) == 0
    assert sp.limit((p(1 + h) - p(1)) / h, h, 0) == 1
    lin = lambda t: 3 * t + 2
    assert sp.simplify(lin(x0 + h) - lin(x0) - 3 * h) == 0 and sp.limit((lin(x0 + h) - lin(x0)) / h, h, 0) == 3
    # tangent, derivative at a point
    assert sp.solve(sp.Eq(2 * x, 5), x) == [sp.Rational(5, 2)] and 2 * sp.Rational(5, 2) == 5
    assert 2 * 5 == 10
    q = lambda t: t ** 2 - 4 * t
    assert sp.expand(q(x0 + h) - q(x0)) == 2 * x0 * h + h ** 2 - 4 * h
    assert sp.limit((q(x0 + h) - q(x0)) / h, h, 0) == 2 * x0 - 4
    assert sp.solve(sp.Eq(2 * x - 4, 0), x) == [2] and sorted(sp.solve(q(x), x)) == [0, 4]
    # applications
    E = lambda t: 50 * t - sp.Rational(1, 2) * t ** 2
    assert E(20) == 800 and sp.expand(E(20 + h)) == 800 + 30 * h - sp.Rational(1, 2) * h ** 2
    assert sp.limit((E(20 + h) - E(20)) / h, h, 0) == 30 and F(800, 20) == 40
    s = lambda v: sp.Rational(1, 100) * v ** 2
    assert s(50) == 25 and sp.limit((s(50 + h) - s(50)) / h, h, 0) == 1 and F(25, 50) == F(1, 2)
    A = lambda a: a ** 2
    assert A(6) == 36 and sp.simplify((A(6 + h) - A(6)) / h - (12 + h)) == 0
    assert sp.limit((A(6 + h) - A(6)) / h, h, 0) == 12 and 4 * 6 == 24
    # the numeric sequence of question 20
    dq = lambda k: (F(1) + F(k)) ** 3 - 1
    for k, want in ((F(1, 10), F(331, 100)), (F(1, 100), F(30301, 10000)), (F(1, 1000), F(3003001, 1000000))):
        assert dq(k) / k == want
    assert sp.limit((f3(1 + h) - f3(1)) / h, h, 0) == 3


Q.verify(check)
Q.save()
