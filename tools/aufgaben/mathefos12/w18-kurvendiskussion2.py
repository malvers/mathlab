#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 18 (LB 2): Kurvendiskussion II - Rechts- und Linkskrümmung
über f'', Wendepunkte (f'' = 0, f''' != 0), Wendetangente, Krümmungsintervalle, vollständige
Kurvendiskussion ganzrationaler Funktionen dritten und vierten Grades.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=18, slug='kurvendiskussion2', thema='Kurvendiskussion II', lb='LB 2',
          blurb='Krümmung, Wendepunkte, Wendetangente, vollständige Kurvendiskussion',
          comment='Blocks: Krümmung (1-5), Wendepunkte und Wendetangente (6-12), vollständige Kurvendiskussion (13-18), Anwendungen (19-20). Alles ohne CAS.')


def fig_wendetangente():
    """f(x) = x^3 - 3x^2 + 2 with its inflection point W(1|0) and the tangent there."""
    f = lambda u: u**3 - 3*u**2 + 2
    p = Plot((-1.5, 3.5), (-3, 4), w=520, h=340)
    p.grid(1, 1)
    p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y", defer_labels=True)
    p.curve(f, -1.2, 3.3)
    p.tangent(f, lambda u: 3*u*u - 6*u, 1, half=1.1)
    p.point(1, 0, "W", "above-right")
    p.draw_labels()
    return p.svg("Graph von f mit Wendepunkt W und Wendetangente")


def fig_absatz():
    """N(t) = -t^3 + 9t^2 on [0; 9] - the sales curve of question 20."""
    N = lambda u: -u**3 + 9*u**2
    p = Plot((-0.5, 9.8), (-15, 120), w=520, h=340)
    p.grid(1, 20)
    p.axes(xstep=1, ystep=20, xlabel="t", ylabel="N", defer_labels=True)
    p.curve(N, 0, 9)
    p.point(3, N(3), "W", "above-left")
    p.point(6, N(6), "H", "above")
    p.draw_labels()
    return p.svg("Verkaufszahlen N(t) mit Wendepunkt W und Hochpunkt H")


# ---------------------------------------------------------------- Krümmung ----
Q.q(r'Was bedeutet $f^{\prime\prime}(x) > 0$ auf einem Intervall für den Graphen von $f$?',
    [r'Der Graph ist dort linksgekrümmt (konvex): der Anstieg $f^{\prime}$ nimmt zu.',
     r'Der Graph ist dort rechtsgekrümmt: der Anstieg $f^{\prime}$ nimmt ab.',
     r'Der Graph steigt dort: $f$ ist monoton wachsend.',
     r'Der Graph hat dort einen Wendepunkt.'],
    [r'$f^{\prime\prime}$ ist die Ableitung von $f^{\prime}$: $f^{\prime\prime} > 0$ heißt, der Anstieg wächst.',
     r'Wachsender Anstieg - der Graph dreht sich beim Durchlaufen nach links (Linkskurve, wie in einer Schüssel).',
     r'Monotonie liest man an $f^{\prime}$ ab, nicht an $f^{\prime\prime}$: ein linksgekrümmter Graph kann fallen oder steigen.'])

Q.q(r'Untersuche das Krümmungsverhalten von $f(x) = x^3 - 6x^2 + 5$.',
    [r'rechtsgekrümmt für $x < 2$, linksgekrümmt für $x > 2$', r'linksgekrümmt für $x < 2$, rechtsgekrümmt für $x > 2$', r'linksgekrümmt für alle $x$', r'rechtsgekrümmt für $0 < x < 4$, sonst linksgekrümmt'],
    [r'$f^{\prime}(x) = 3x^2 - 12x$, $f^{\prime\prime}(x) = 6x - 12$',
     r'$f^{\prime\prime}(x) < 0 \Leftrightarrow 6x - 12 < 0 \Leftrightarrow x < 2$: rechtsgekrümmt',
     r'$f^{\prime\prime}(x) > 0 \Leftrightarrow x > 2$: linksgekrümmt',
     r'Falle: $x = 0$ und $x = 4$ sind die Nullstellen von $f^{\prime}$ (Extremstellen), nicht von $f^{\prime\prime}$.'])

Q.q(r'Auf welchen Intervallen ist der Graph von $f(x) = x^4 - 6x^2$ linksgekrümmt?',
    [r'für $x < -1$ und für $x > 1$', r'für $-1 < x < 1$', r'für $x > 0$', r'für $x < -\sqrt{3}$ und für $x > \sqrt{3}$'],
    [r'$f^{\prime}(x) = 4x^3 - 12x$, $f^{\prime\prime}(x) = 12x^2 - 12 = 12\,(x^2 - 1)$',
     r'$f^{\prime\prime}(x) > 0 \Leftrightarrow x^2 > 1 \Leftrightarrow x < -1$ oder $x > 1$',
     r'Dazwischen ($-1 < x < 1$) ist $f^{\prime\prime} < 0$: Rechtskrümmung um den Hochpunkt $(0|0)$.',
     r'Falle: $\pm\sqrt{3}$ sind die Nullstellen von $f^{\prime}$ (Tiefpunkte), nicht die Krümmungswechsel.'])

Q.q(r'Was gilt für den Graphen von $f(x) = -x^3 + 3x$ an der Stelle $x = 1$?',
    [r'Hochpunkt, der Graph ist dort rechtsgekrümmt', r'Tiefpunkt, der Graph ist dort linksgekrümmt', r'Wendepunkt mit Anstieg $0$ (Sattelpunkt)', r'Wendepunkt mit Anstieg $-6$'],
    [r'$f^{\prime}(x) = -3x^2 + 3$, $f^{\prime}(1) = 0$: waagerechte Tangente.',
     r'$f^{\prime\prime}(x) = -6x$, $f^{\prime\prime}(1) = -6 < 0$: Rechtskrümmung, also Hochpunkt $H(1|2)$.',
     r'Der Wendepunkt liegt bei $f^{\prime\prime}(x) = 0$, also bei $x = 0$, nicht bei $x = 1$.'])

Q.q(r'Welcher Graph ist auf ganz $\mathbb{R}$ linksgekrümmt?',
    [r'$f(x) = x^2 + 3x$', r'$f(x) = x^3$', r'$f(x) = -x^2 + 1$', r'$f(x) = x^4 - x^2$'],
    [r'Linkskrümmung überall bedeutet $f^{\prime\prime}(x) > 0$ für alle $x$.',
     r'$f(x) = x^2 + 3x$: $f^{\prime\prime}(x) = 2 > 0$ für alle $x$. Passt.',
     r'$x^3$: $f^{\prime\prime} = 6x$ wechselt bei $0$ das Vorzeichen; $-x^2 + 1$: $f^{\prime\prime} = -2 < 0$; $x^4 - x^2$: $f^{\prime\prime}(0) = -2 < 0$.'])

# ------------------------------------------ Wendepunkte und Wendetangente ----
Q.q(r'Bestimme den Wendepunkt von $f(x) = x^3 - 3x^2 + 2$.',
    [r'$W(1|0)$', r'$W(1|2)$', r'$W(2|-2)$', r'$W(0|2)$'],
    [r'Notwendig: $f^{\prime\prime}(x) = 6x - 6 = 0 \Rightarrow x = 1$',
     r'Hinreichend: $f^{\prime\prime\prime}(x) = 6 \neq 0$. Passt.',
     r'$f(1) = 1 - 3 + 2 = 0$, also $W(1|0)$.',
     r'Falle: $(2|-2)$ ist der Tiefpunkt ($f^{\prime}(2) = 0$), $(0|2)$ der Hochpunkt.'])

Q.q(r'Wie viele Wendepunkte hat $f(x) = x^4 - 2x^3$, und wo liegen sie?',
    [r'zwei: $W_1(0|0)$ und $W_2(1|-1)$', r'einen: $W(0|0)$', r'zwei: $W_1(0|0)$ und $W_2(1|1)$', r'zwei: $W_1(0|0)$ und $W_2(1{,}5|-1{,}6875)$'],
    [r'$f^{\prime}(x) = 4x^3 - 6x^2$, $f^{\prime\prime}(x) = 12x^2 - 12x = 12x\,(x - 1) = 0 \Rightarrow x = 0$ oder $x = 1$',
     r'$f^{\prime\prime\prime}(x) = 24x - 12$: $f^{\prime\prime\prime}(0) = -12 \neq 0$, $f^{\prime\prime\prime}(1) = 12 \neq 0$ - beides Wendestellen.',
     r'$f(0) = 0$, $f(1) = 1 - 2 = -1$',
     r'Falle: $x = 1{,}5$ ist die Tiefstelle ($f^{\prime}(1{,}5) = 0$), kein Wendepunkt.'])

Q.q(r'Für $f(x) = x^4$ gilt $f^{\prime\prime}(0) = 0$. Was folgt daraus?',
    [r'Kein Wendepunkt: $f^{\prime\prime}(x) = 12x^2$ wechselt bei $0$ das Vorzeichen nicht - $(0|0)$ ist ein Tiefpunkt.',
     r'$(0|0)$ ist ein Wendepunkt, weil $f^{\prime\prime}(0) = 0$ gilt.',
     r'$(0|0)$ ist ein Sattelpunkt, weil $f^{\prime}(0) = 0$ und $f^{\prime\prime}(0) = 0$ gilt.',
     r'$(0|0)$ ist ein Hochpunkt.'],
    [r'$f^{\prime\prime}(x_0) = 0$ ist nur notwendig. Hinreichend: $f^{\prime\prime\prime}(x_0) \neq 0$ oder ein Vorzeichenwechsel von $f^{\prime\prime}$.',
     r'$f^{\prime\prime\prime}(x) = 24x$, $f^{\prime\prime\prime}(0) = 0$ - keine Entscheidung; $f^{\prime\prime}(x) = 12x^2 \geq 0$ links und rechts von $0$: kein Wechsel.',
     r'Der Graph ist überall linksgekrümmt, $f^{\prime}$ wechselt bei $0$ von $-$ nach $+$: Tiefpunkt.'])

Q.q(r'Der Graph von $f(x) = x^3 - 3x^2 + 2$ hat den Wendepunkt $W(1|0)$. Wie lautet die Gleichung der Wendetangente?',
    [r'$t(x) = -3x + 3$', r'$t(x) = -3x$', r'$t(x) = 3x - 3$', r'$t(x) = -3x - 3$'],
    [r'Anstieg im Wendepunkt: $f^{\prime}(x) = 3x^2 - 6x$, $f^{\prime}(1) = 3 - 6 = -3$',
     r'Tangente: $t(x) = -3\,(x - 1) + 0 = -3x + 3$',
     r'Probe: $t(1) = 0 = f(1)$. Passt.',
     r'Falle: $t(x) = -3x$ hat den richtigen Anstieg, geht aber durch den Ursprung statt durch $W$.'],
    fig=fig_wendetangente(), figcap=r'Graph von $f(x) = x^3 - 3x^2 + 2$ mit Wendepunkt $W$ und Wendetangente')

Q.q(r'Bestimme die Wendetangente von $f(x) = -\dfrac{1}{3}x^3 + x^2 + 1$.',
    [r'$t(x) = x + \dfrac{2}{3}$', r'$t(x) = x + \dfrac{5}{3}$', r'$t(x) = -x + \dfrac{8}{3}$', r'$t(x) = x - \dfrac{2}{3}$'],
    [r'$f^{\prime}(x) = -x^2 + 2x$, $f^{\prime\prime}(x) = -2x + 2 = 0 \Rightarrow x = 1$; $f^{\prime\prime\prime}(x) = -2 \neq 0$',
     r'$f(1) = -\dfrac{1}{3} + 1 + 1 = \dfrac{5}{3}$, Anstieg $f^{\prime}(1) = -1 + 2 = 1$',
     r'$t(x) = 1 \cdot (x - 1) + \dfrac{5}{3} = x + \dfrac{2}{3}$',
     r'Falle: $x + \dfrac{5}{3}$ nimmt den Funktionswert als $y$-Achsenabschnitt - das gilt nur bei $x_0 = 0$.'])

Q.q(r'Untersuche $f(x) = x^3 - 6x^2 + 12x$ an der Stelle $x = 2$.',
    [r'Sattelpunkt $S(2|8)$: Wendepunkt mit waagerechter Tangente', r'Tiefpunkt $T(2|8)$', r'Hochpunkt $H(2|8)$', r'kein besonderer Punkt, nur $f(2) = 8$'],
    [r'$f^{\prime}(x) = 3x^2 - 12x + 12 = 3\,(x - 2)^2$, also $f^{\prime}(2) = 0$: waagerechte Tangente.',
     r'$f^{\prime\prime}(x) = 6x - 12$, $f^{\prime\prime}(2) = 0$ - kein Extremum nachweisbar; $f^{\prime\prime\prime}(x) = 6 \neq 0$: Wendepunkt.',
     r'$f(2) = 8 - 24 + 24 = 8$: Sattelpunkt $S(2|8)$.',
     r'$f^{\prime}(x) = 3\,(x - 2)^2 \geq 0$: der Graph steigt überall, ein Extremum ist unmöglich.'])

Q.q(r'An welcher Stelle ist der Anstieg des Graphen von $f(x) = -x^3 + 3x^2 + 1$ am größten, und wie groß ist er dort?',
    [r'bei $x = 1$, Anstieg $3$', r'bei $x = 2$, Anstieg $0$', r'bei $x = 0$, Anstieg $0$', r'bei $x = 1$, Anstieg $-3$'],
    [r'Der Anstieg $f^{\prime}(x) = -3x^2 + 6x$ ist selbst eine Funktion - ihr Maximum liegt bei $f^{\prime\prime}(x) = 0$.',
     r'$f^{\prime\prime}(x) = -6x + 6 = 0 \Rightarrow x = 1$; $f^{\prime\prime\prime}(x) = -6 < 0$: Maximum von $f^{\prime}$.',
     r'$f^{\prime}(1) = -3 + 6 = 3$ - der stärkste Anstieg liegt im Wendepunkt $W(1|3)$.',
     r'Falle: $x = 0$ und $x = 2$ sind die Extremstellen von $f$, dort ist der Anstieg $0$.'])

# ------------------------------------------ vollständige Kurvendiskussion ----
Q.q(r'Kurvendiskussion von $f(x) = x^3 - 3x^2$: Bestimme die Nullstellen und ihre Vielfachheit.',
    [r'$x = 0$ (doppelt, Berührstelle) und $x = 3$ (einfach)', r'$x = 0$ (einfach) und $x = 3$ (doppelt)', r'$x = 0$ und $x = \pm\sqrt{3}$', r'$x = 3$ (dreifach)'],
    [r'$f(x) = x^2\,(x - 3)$',
     r'$x^2 = 0 \Rightarrow x = 0$ mit Vielfachheit $2$: der Graph berührt dort die $x$-Achse.',
     r'$x - 3 = 0 \Rightarrow x = 3$ mit Vielfachheit $1$: der Graph schneidet die $x$-Achse.'])

Q.q(r'Kurvendiskussion von $f(x) = x^3 - 3x^2$: Bestimme die Extrempunkte.',
    [r'Hochpunkt $H(0|0)$, Tiefpunkt $T(2|-4)$', r'Tiefpunkt $T(0|0)$, Hochpunkt $H(2|-4)$', r'Hochpunkt $H(0|0)$, Tiefpunkt $T(3|0)$', r'Hochpunkt $H(1|-2)$, Tiefpunkt $T(2|-4)$'],
    [r'$f^{\prime}(x) = 3x^2 - 6x = 3x\,(x - 2) = 0 \Rightarrow x = 0$ oder $x = 2$',
     r'$f^{\prime\prime}(x) = 6x - 6$: $f^{\prime\prime}(0) = -6 < 0$ (Hochpunkt), $f^{\prime\prime}(2) = 6 > 0$ (Tiefpunkt)',
     r'$f(0) = 0$, $f(2) = 8 - 12 = -4$',
     r'Falle: $x = 1$ ist die Wendestelle, $x = 3$ eine Nullstelle - keine Extremstellen.'])

Q.q(r'Kurvendiskussion von $f(x) = x^3 - 3x^2$: Bestimme den Wendepunkt und die Wendetangente.',
    [r'$W(1|-2)$, $t(x) = -3x + 1$', r'$W(1|-2)$, $t(x) = -3x - 2$', r'$W(1|0)$, $t(x) = -3x + 3$', r'$W(2|-4)$, $t(x) = -4$'],
    [r'$f^{\prime\prime}(x) = 6x - 6 = 0 \Rightarrow x = 1$; $f^{\prime\prime\prime}(x) = 6 \neq 0$',
     r'$f(1) = 1 - 3 = -2$, Anstieg $f^{\prime}(1) = 3 - 6 = -3$',
     r'$t(x) = -3\,(x - 1) - 2 = -3x + 1$; Probe: $t(1) = -2$. Passt.',
     r'Falle: $-3x - 2$ setzt den Funktionswert als Achsenabschnitt ein.'])

Q.q(r'Welche Aussage über Symmetrie und Verhalten im Unendlichen trifft auf $f(x) = -x^4 + 4x^2$ zu?',
    [r'achsensymmetrisch zur $y$-Achse; $f(x) \to -\infty$ für $x \to \pm\infty$',
     r'punktsymmetrisch zum Ursprung; $f(x) \to -\infty$ für $x \to \pm\infty$',
     r'achsensymmetrisch zur $y$-Achse; $f(x) \to +\infty$ für $x \to \pm\infty$',
     r'keine Symmetrie; $f(x) \to -\infty$ für $x \to -\infty$ und $f(x) \to +\infty$ für $x \to +\infty$'],
    [r'Nur gerade Exponenten ($4$ und $2$): $f(-x) = f(x)$, achsensymmetrisch zur $y$-Achse.',
     r'Für große $|x|$ bestimmt der Summand mit dem höchsten Exponenten: $-x^4 \to -\infty$ für $x \to \pm\infty$.',
     r'Der Graph ist eine nach unten geöffnete W-Form (umgedrehtes W).'])

Q.q(r'Bestimme die Wendestellen von $f(x) = \dfrac{1}{4}x^4 - 2x^2$.',
    [r'$x = \pm\dfrac{2}{\sqrt{3}} \approx \pm 1{,}15$', r'$x = \pm 2$', r'$x = 0$', r'$x = \pm\dfrac{4}{3}$'],
    [r'$f^{\prime}(x) = x^3 - 4x$, $f^{\prime\prime}(x) = 3x^2 - 4$',
     r'$3x^2 - 4 = 0 \Rightarrow x^2 = \dfrac{4}{3} \Rightarrow x = \pm\sqrt{\dfrac{4}{3}} = \pm\dfrac{2}{\sqrt{3}} \approx \pm 1{,}15$',
     r'$f^{\prime\prime\prime}(x) = 6x \neq 0$ an beiden Stellen. Passt.',
     r'Fallen: $\pm 2$ sind Tiefstellen ($f^{\prime} = 0$), $\pm\dfrac{4}{3}$ entsteht, wenn man die Wurzel vergisst.'])

Q.q(r'Auf welchen Intervallen ist $f(x) = x^3 - 3x^2$ monoton wachsend?',
    [r'für $x < 0$ und für $x > 2$', r'für $0 < x < 2$', r'für $x > 1$', r'für $x > 0$'],
    [r'$f^{\prime}(x) = 3x\,(x - 2)$; Vorzeichen prüfen: $f^{\prime}(-1) = 9 > 0$, $f^{\prime}(1) = -3 < 0$, $f^{\prime}(3) = 9 > 0$',
     r'Wachsend, wo $f^{\prime} > 0$: links von $0$ und rechts von $2$.',
     r'Zwischen Hochpunkt $(0|0)$ und Tiefpunkt $(2|-4)$ fällt der Graph.',
     r'Falle: $x = 1$ ist der Krümmungswechsel, kein Monotoniewechsel.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Die Gesamtkosten eines Betriebs sind $K(x) = x^3 - 6x^2 + 15x + 20$ (in Tsd. €, $x$ in ME). Bei welcher Menge sind die Grenzkosten $K^{\prime}(x)$ minimal?',
    [r'bei $x = 2$ ME, Grenzkosten $3$', r'bei $x = 4$ ME, Grenzkosten $15$', r'bei $x = 3$ ME, Grenzkosten $6$', r'bei $x = 6$ ME, Grenzkosten $51$'],
    [r'Grenzkosten $K^{\prime}(x) = 3x^2 - 12x + 15$; ihr Minimum liegt bei $K^{\prime\prime}(x) = 0$.',
     r'$K^{\prime\prime}(x) = 6x - 12 = 0 \Rightarrow x = 2$; $K^{\prime\prime\prime}(x) = 6 > 0$: Minimum von $K^{\prime}$.',
     r'$K^{\prime}(2) = 12 - 24 + 15 = 3$; das ist der Wendepunkt der Kostenkurve - Übergang von degressivem zu progressivem Kostenverlauf.',
     r'Probe: $K^{\prime}(1) = 6$, $K^{\prime}(3) = 6$, beide größer als $3$. Passt.'])

Q.q(r'Die Verkaufszahlen eines neuen Produkts folgen in den ersten Wochen $N(t) = -t^3 + 9t^2$ ($t$ in Wochen, $0 \leq t \leq 9$). Wann wächst der Absatz am stärksten, und wie groß ist der Zuwachs dann?',
    [r'nach $3$ Wochen, Zuwachs $27$ pro Woche', r'nach $6$ Wochen, Zuwachs $0$ pro Woche', r'nach $3$ Wochen, Zuwachs $54$ pro Woche', r'nach $9$ Wochen, Zuwachs $0$ pro Woche'],
    [r'Zuwachs pro Woche: $N^{\prime}(t) = -3t^2 + 18t$; stärkster Zuwachs $=$ Maximum von $N^{\prime}$.',
     r'$N^{\prime\prime}(t) = -6t + 18 = 0 \Rightarrow t = 3$; $N^{\prime\prime\prime}(t) = -6 < 0$: Maximum. Passt.',
     r'$N^{\prime}(3) = -27 + 54 = 27$; der Wendepunkt $W(3|54)$ ist der Moment mit dem steilsten Anstieg.',
     r'Falle: $54$ ist der Funktionswert $N(3)$, nicht der Zuwachs. Bei $t = 6$ liegt der Hochpunkt $H(6|108)$, danach sinkt der Absatz.'],
    fig=fig_absatz(), figcap=r'Verkaufszahlen $N(t) = -t^3 + 9t^2$ mit Wendepunkt $W$ und Hochpunkt $H$')


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x = sp.symbols('x')
    d = sp.diff
    eq = lambda a, b: sp.simplify(a - b) == 0
    # 1: Begriff
    # 2
    f2 = x**3 - 6*x**2 + 5
    assert eq(d(f2, x, 2), 6*x - 12) and sp.solve(d(f2, x, 2), x) == [2]
    assert sorted(sp.solve(d(f2, x), x)) == [0, 4]
    assert d(f2, x, 2).subs(x, 0) < 0 and d(f2, x, 2).subs(x, 3) > 0
    # 3
    f3 = x**4 - 6*x**2
    assert eq(d(f3, x, 2), 12*x**2 - 12) and sorted(sp.solve(d(f3, x, 2), x)) == [-1, 1]
    assert d(f3, x, 2).subs(x, 2) > 0 and d(f3, x, 2).subs(x, 0) < 0
    assert sorted(sp.solve(d(f3, x), x)) == [-sp.sqrt(3), 0, sp.sqrt(3)]
    # 4
    f4 = -x**3 + 3*x
    assert d(f4, x).subs(x, 1) == 0 and d(f4, x, 2).subs(x, 1) == -6 and f4.subs(x, 1) == 2
    assert sp.solve(d(f4, x, 2), x) == [0]
    # 5
    assert d(x**2 + 3*x, x, 2) == 2 and eq(d(x**3, x, 2), 6*x) and d(-x**2 + 1, x, 2) == -2
    assert d(x**4 - x**2, x, 2).subs(x, 0) == -2
    # 6
    f6 = x**3 - 3*x**2 + 2
    assert sp.solve(d(f6, x, 2), x) == [1] and d(f6, x, 3) == 6 and f6.subs(x, 1) == 0
    assert sorted(sp.solve(d(f6, x), x)) == [0, 2] and f6.subs(x, 2) == -2 and f6.subs(x, 0) == 2
    # 7
    f7 = x**4 - 2*x**3
    assert sorted(sp.solve(d(f7, x, 2), x)) == [0, 1]
    assert d(f7, x, 3).subs(x, 0) == -12 and d(f7, x, 3).subs(x, 1) == 12
    assert f7.subs(x, 0) == 0 and f7.subs(x, 1) == -1
    assert sp.Rational(3, 2) in sp.solve(d(f7, x), x) and f7.subs(x, sp.Rational(3, 2)) == sp.Rational(-27, 16)
    assert F(-27, 16) == F(-16875, 10000)
    # 8
    assert d(x**4, x, 2).subs(x, 0) == 0 and d(x**4, x, 3).subs(x, 0) == 0
    assert d(x**4, x, 2).subs(x, -1) > 0 and d(x**4, x, 2).subs(x, 1) > 0
    # 9
    assert d(f6, x).subs(x, 1) == -3
    t9 = -3*(x - 1) + 0
    assert eq(t9, -3*x + 3) and t9.subs(x, 1) == f6.subs(x, 1)
    # 10
    f10 = -sp.Rational(1, 3)*x**3 + x**2 + 1
    assert sp.solve(d(f10, x, 2), x) == [1] and d(f10, x, 3) == -2
    assert f10.subs(x, 1) == sp.Rational(5, 3) and d(f10, x).subs(x, 1) == 1
    t10 = 1*(x - 1) + sp.Rational(5, 3)
    assert eq(t10, x + sp.Rational(2, 3))
    # 11
    f11 = x**3 - 6*x**2 + 12*x
    assert eq(d(f11, x), 3*(x - 2)**2) and d(f11, x).subs(x, 2) == 0
    assert d(f11, x, 2).subs(x, 2) == 0 and d(f11, x, 3) == 6 and f11.subs(x, 2) == 8
    # 12
    f12 = -x**3 + 3*x**2 + 1
    assert sp.solve(d(f12, x, 2), x) == [1] and d(f12, x, 3) == -6
    assert d(f12, x).subs(x, 1) == 3 and f12.subs(x, 1) == 3
    assert sorted(sp.solve(d(f12, x), x)) == [0, 2]
    # 13-15, 18: f = x^3 - 3x^2
    f13 = x**3 - 3*x**2
    assert sp.roots(f13) == {0: 2, 3: 1}
    assert sorted(sp.solve(d(f13, x), x)) == [0, 2]
    assert d(f13, x, 2).subs(x, 0) == -6 and d(f13, x, 2).subs(x, 2) == 6
    assert f13.subs(x, 0) == 0 and f13.subs(x, 2) == -4
    assert sp.solve(d(f13, x, 2), x) == [1] and d(f13, x, 3) == 6
    assert f13.subs(x, 1) == -2 and d(f13, x).subs(x, 1) == -3
    t15 = -3*(x - 1) - 2
    assert eq(t15, -3*x + 1) and t15.subs(x, 1) == -2
    assert d(f13, x).subs(x, -1) == 9 and d(f13, x).subs(x, 1) == -3 and d(f13, x).subs(x, 3) == 9
    # 16
    f16 = -x**4 + 4*x**2
    assert eq(f16.subs(x, -x), f16) and sp.limit(f16, x, sp.oo) == -sp.oo and sp.limit(f16, x, -sp.oo) == -sp.oo
    # 17
    f17 = sp.Rational(1, 4)*x**4 - 2*x**2
    assert eq(d(f17, x, 2), 3*x**2 - 4)
    ws = sp.solve(d(f17, x, 2), x)
    assert sorted(ws) == [-2/sp.sqrt(3), 2/sp.sqrt(3)] and abs(2 / math.sqrt(3) - 1.15) < 0.005
    assert all(d(f17, x, 3).subs(x, w) != 0 for w in ws)
    assert sorted(sp.solve(d(f17, x), x)) == [-2, 0, 2]
    # 19
    K = x**3 - 6*x**2 + 15*x + 20
    assert eq(d(K, x), 3*x**2 - 12*x + 15) and sp.solve(d(K, x, 2), x) == [2] and d(K, x, 3) == 6
    assert d(K, x).subs(x, 2) == 3 and d(K, x).subs(x, 1) == 6 and d(K, x).subs(x, 3) == 6
    assert d(K, x).subs(x, 4) == 15 and d(K, x).subs(x, 6) == 51
    # 20
    N = -x**3 + 9*x**2
    assert eq(d(N, x), -3*x**2 + 18*x) and sp.solve(d(N, x, 2), x) == [3] and d(N, x, 3) == -6
    assert d(N, x).subs(x, 3) == 27 and N.subs(x, 3) == 54
    assert sorted(sp.solve(d(N, x), x)) == [0, 6] and N.subs(x, 6) == 108 and d(N, x).subs(x, 9) == -243 + 162


Q.verify(check)
Q.save()
