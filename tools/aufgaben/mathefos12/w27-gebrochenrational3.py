#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 27 (LB 4): Gebrochenrationale Funktionen III - Extrem- und
Wendepunkte, Wertebereich, Flächenberechnungen (GTR ohne CAS). Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=27, slug='gebrochenrational3', thema='Gebrochenrationale Funktionen III', lb='LB 4',
          blurb='Extrem- und Wendepunkte, Wertebereich, Flächen',
          comment='Blocks: Extrempunkte mit der Quotientenregel (1-7), Wendepunkte mit dem GTR (8-10), Wertebereich (11-13), Flächen (14-17), Untersuchung und Anwendung (18-20). GTR ohne CAS.')


# ------------------------------------------------------------- figures ----
def fig_hyperbel():
    f = lambda x: (x * x + 1) / x
    p = S.Plot((-4.2, 4.2), (-6.5, 6.5), w=520, h=340)
    p.axes(1, 2, xlabel="x", ylabel="y")
    p.curve(f, -4.1, -0.16, S.RED, 2.2)
    p.curve(f, 0.16, 4.1, S.RED, 2.2)
    p.point(-1, -2, "H", "below-left")
    p.point(1, 2, "T", "above-right")
    return p.svg("Graph von f mit Hochpunkt H(-1|-2) und Tiefpunkt T(1|2)")


def fig_flaeche():
    f = lambda x: (4 - x * x) / (x * x)
    p = S.Plot((-0.6, 4.8), (-1.6, 3.6), w=520, h=320)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.area(f, 1, 2, S.ORANGE, 0.35)
    p.area(f, 2, 4, S.GREEN, 0.3)
    p.curve(f, 0.75, 4.7, S.RED, 2.2)
    return p.svg("Graph von f mit den beiden Flächenstücken zwischen x gleich 1 und x gleich 4")


# --------------------------------------- Extrempunkte mit der Quotientenregel ----
Q.q(r'Gegeben ist $f(x) = \dfrac{x^2+1}{x}$. Bestimme $f^{\prime}(x)$ mit der Quotientenregel.',
    [r'$f^{\prime}(x) = \dfrac{x^2-1}{x^2}$', r'$f^{\prime}(x) = \dfrac{x^2+1}{x^2}$', r'$f^{\prime}(x) = 2x$', r'$f^{\prime}(x) = \dfrac{3x^2+1}{x^2}$'],
    [r'Quotientenregel: $f^{\prime}(x) = \dfrac{u^{\prime} \cdot v - u \cdot v^{\prime}}{v^2}$ mit $u = x^2+1$ und $v = x$.',
     r'$f^{\prime}(x) = \dfrac{2x \cdot x - (x^2+1) \cdot 1}{x^2} = \dfrac{2x^2 - x^2 - 1}{x^2} = \dfrac{x^2-1}{x^2}$',
     r'Falle: Zähler und Nenner getrennt ableiten ($2x$) oder im Zähler ein Plus setzen ($3x^2+1$).'])

Q.q(r'An welchen Stellen kann $f(x) = \dfrac{x^2+1}{x}$ Extrempunkte haben?',
    [r'$x = -1$ und $x = 1$', r'$x = 0$', r'nur $x = 1$', r'$x = -1$, $x = 0$ und $x = 1$'],
    [r'$f^{\prime}(x) = \dfrac{x^2-1}{x^2} = 0$: ein Bruch ist null, wenn der Zähler null ist.',
     r'$x^2 - 1 = 0$, also $x = 1$ oder $x = -1$.',
     r'$x = 0$ ist die Polstelle - dort ist $f$ gar nicht definiert, ein Extrempunkt ist unmöglich.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = \dfrac{x^2+1}{x}$ an der Stelle $x = 1$ und seine Art.',
    [r'Tiefpunkt $T(1 \mid 2)$', r'Hochpunkt $H(1 \mid 2)$', r'Tiefpunkt $T(1 \mid 0)$', r'Hochpunkt $H(1 \mid -2)$'],
    [r'$f(1) = \dfrac{1+1}{1} = 2$',
     r'$f^{\prime}(x) = 1 - \dfrac{1}{x^2}$, also $f^{\prime\prime}(x) = \dfrac{2}{x^3}$ und $f^{\prime\prime}(1) = 2 > 0$: Tiefpunkt.',
     r'Falle: $y$-Wert nicht ausrechnen ($T(1 \mid 0)$) - der $y$-Wert kommt aus $f$, nicht aus $f^{\prime}$.'])

Q.q(r'Gegeben ist $g(x) = \dfrac{x^2}{x-1}$. Bestimme $g^{\prime}(x)$.',
    [r'$g^{\prime}(x) = \dfrac{x^2 - 2x}{(x-1)^2}$', r'$g^{\prime}(x) = \dfrac{x^2 - 2x}{x-1}$', r'$g^{\prime}(x) = 2x$', r'$g^{\prime}(x) = \dfrac{3x^2 - 2x}{(x-1)^2}$'],
    [r'$u = x^2$, $u^{\prime} = 2x$, $v = x - 1$, $v^{\prime} = 1$.',
     r'$g^{\prime}(x) = \dfrac{2x(x-1) - x^2 \cdot 1}{(x-1)^2} = \dfrac{2x^2 - 2x - x^2}{(x-1)^2} = \dfrac{x^2 - 2x}{(x-1)^2}$',
     r'Falle: den Nenner nicht quadrieren oder $u \cdot v^{\prime}$ addieren statt subtrahieren.'])

Q.q(r'Welche Extrempunkte hat $g(x) = \dfrac{x^2}{x-1}$?',
    [r'$H(0 \mid 0)$ und $T(2 \mid 4)$', r'$T(0 \mid 0)$ und $H(2 \mid 4)$', r'nur $T(2 \mid 4)$', r'$H(0 \mid 0)$, $T(2 \mid 4)$ und ein Tiefpunkt bei $x = 1$'],
    [r'Zähler von $g^{\prime}$: $x^2 - 2x = x(x-2) = 0$, also $x = 0$ oder $x = 2$.',
     r'$g(0) = 0$ und $g(2) = \dfrac{4}{1} = 4$.',
     r'$g^{\prime\prime}(x) = \dfrac{2}{(x-1)^3}$: $g^{\prime\prime}(0) = -2 < 0$ (Hochpunkt), $g^{\prime\prime}(2) = 2 > 0$ (Tiefpunkt).',
     r'Bei $x = 1$ ist eine Polstelle, kein Extrempunkt. Der Hochpunkt liegt unter dem Tiefpunkt - bei Polstellen ist das normal.'])

Q.q(r'Für eine gebrochenrationale Funktion gilt $f^{\prime}(x) = \dfrac{x^2 - 9}{(x^2+3)^2}$. Welche Aussage über die Extremstellen stimmt?',
    [r'Hochstelle bei $x = -3$, Tiefstelle bei $x = 3$', r'Tiefstelle bei $x = -3$, Hochstelle bei $x = 3$', r'Extremstellen bei $x = \pm\sqrt{3}$', r'keine Extremstellen, weil der Nenner nie null wird'],
    [r'Nullstellen des Zählers: $x^2 - 9 = 0$, also $x = -3$ und $x = 3$. Der Nenner ist immer positiv.',
     r'Vorzeichen von $f^{\prime}$: für $x < -3$ positiv, zwischen $-3$ und $3$ negativ, für $x > 3$ positiv.',
     r'Bei $x = -3$ wechselt $f^{\prime}$ von $+$ nach $-$ (Hochstelle), bei $x = 3$ von $-$ nach $+$ (Tiefstelle).'])

Q.q(r'Die Stückkosten eines Produkts (in Euro) hängen von der Losgröße $x$ ab: $K(x) = \dfrac{x^2 + 100}{x}$ für $x > 0$. Für welche Losgröße sind die Stückkosten minimal, und wie hoch sind sie dann?',
    [r'$x = 10$, minimale Stückkosten $20$ Euro', r'$x = 100$, minimale Stückkosten $101$ Euro', r'$x = 10$, minimale Stückkosten $10$ Euro', r'$x = 20$, minimale Stückkosten $25$ Euro'],
    [r'$K(x) = x + \dfrac{100}{x}$, also $K^{\prime}(x) = 1 - \dfrac{100}{x^2} = \dfrac{x^2 - 100}{x^2}$.',
     r'$x^2 - 100 = 0$ ergibt $x = 10$ (nur $x > 0$ ist sinnvoll).',
     r'$K(10) = 10 + \dfrac{100}{10} = 20$; $K^{\prime\prime}(x) = \dfrac{200}{x^3} > 0$, also ein Minimum.',
     r'Probe mit dem GTR: $K(20) = 25$ und $K(5) = 25$ sind beide größer als $20$.'])

# ---------------------------------------------------- Wendepunkte mit dem GTR ----
Q.q(r'Für $f(x) = \dfrac{x^2+1}{x}$ liefert der GTR $f^{\prime\prime}(x) = \dfrac{2}{x^3}$. Hat der Graph von $f$ Wendepunkte?',
    [r'Nein - $f^{\prime\prime}$ hat keine Nullstelle; der Krümmungswechsel bei $x = 0$ liegt an der Polstelle, nicht an einem Wendepunkt.',
     r'Ja, $W(0 \mid 0)$, weil $f^{\prime\prime}$ dort das Vorzeichen wechselt.',
     r'Ja, $W(1 \mid 2)$, weil dort $f^{\prime}(1) = 0$ ist.',
     r'Ja, bei $x = -1$ und $x = 1$.'],
    [r'Wendepunkt: $f^{\prime\prime}(x) = 0$ mit Vorzeichenwechsel. Der Zähler $2$ wird nie null.',
     r'Zwar ist $f^{\prime\prime} < 0$ für $x < 0$ und $f^{\prime\prime} > 0$ für $x > 0$, aber $x = 0$ gehört nicht zum Definitionsbereich.',
     r'$x = \pm 1$ sind die Extremstellen ($f^{\prime} = 0$), keine Wendestellen.'])

Q.q(r'Für $f(x) = \dfrac{4x}{x^2+1}$ liefert der GTR die Nullstellen von $f^{\prime\prime}$: $x = 0$, $x = \sqrt{3}$ und $x = -\sqrt{3}$, jeweils mit Vorzeichenwechsel. Wie lauten die Wendepunkte?',
    [r'$W_1(0 \mid 0)$, $W_2(\sqrt{3} \mid \sqrt{3})$, $W_3(-\sqrt{3} \mid -\sqrt{3})$', r'nur $W(0 \mid 0)$', r'$W_1(0 \mid 0)$, $W_2(\sqrt{3} \mid 0)$, $W_3(-\sqrt{3} \mid 0)$', r'$W_1(1 \mid 2)$ und $W_2(-1 \mid -2)$'],
    [r'Die $y$-Werte kommen aus $f$: $f(0) = 0$.',
     r'$f(\sqrt{3}) = \dfrac{4\sqrt{3}}{3+1} = \sqrt{3} \approx 1{,}73$ und $f(-\sqrt{3}) = -\sqrt{3}$.',
     r'$(1 \mid 2)$ und $(-1 \mid -2)$ sind die Extrempunkte von $f$, nicht die Wendepunkte.'])

Q.q(r'Der GTR zeigt für $f(x) = \dfrac{4x}{x^2+1}$: $f^{\prime\prime}(x) < 0$ für $0 < x < \sqrt{3}$ und $f^{\prime\prime}(x) > 0$ für $x > \sqrt{3}$. Was bedeutet das für den Graphen?',
    [r'Für $0 < x < \sqrt{3}$ ist der Graph rechtsgekrümmt, für $x > \sqrt{3}$ linksgekrümmt; bei $x = \sqrt{3}$ liegt ein Wendepunkt.',
     r'Für $0 < x < \sqrt{3}$ ist der Graph linksgekrümmt, für $x > \sqrt{3}$ rechtsgekrümmt; bei $x = \sqrt{3}$ liegt ein Wendepunkt.',
     r'$f$ fällt für $0 < x < \sqrt{3}$ und steigt für $x > \sqrt{3}$.',
     r'$f$ hat bei $x = \sqrt{3}$ ein Minimum.'],
    [r'$f^{\prime\prime} < 0$ bedeutet Rechtskrümmung, $f^{\prime\prime} > 0$ Linkskrümmung.',
     r'Wechselt das Vorzeichen von $f^{\prime\prime}$, wechselt die Krümmung: Wendepunkt.',
     r'Über Steigen und Fallen entscheidet $f^{\prime}$, nicht $f^{\prime\prime}$.'])

# ------------------------------------------------------------- Wertebereich ----
Q.q(r'Der Graph von $f(x) = \dfrac{x^2+1}{x}$ hat den Hochpunkt $H(-1 \mid -2)$ und den Tiefpunkt $T(1 \mid 2)$. Bestimme den Wertebereich.',
    [r'$W = \{y \mid y \leq -2 \text{ oder } y \geq 2\}$', r'$W = \mathbb{R}$', r'$W = \{y \mid -2 \leq y \leq 2\}$', r'$W = \{y \mid y \geq 2\}$'],
    [r'Rechter Ast ($x > 0$): kommt von $+\infty$ (Polstelle), fällt bis $T(1 \mid 2)$ und steigt wieder nach $+\infty$ - Werte $y \geq 2$.',
     r'Linker Ast ($x < 0$): punktsymmetrisch dazu - Werte $y \leq -2$.',
     r'Werte zwischen $-2$ und $2$ werden nie angenommen: Die Polstelle reißt den Wertebereich auf.'],
    fig=fig_hyperbel(), figcap=r'Graph von $f(x) = \dfrac{x^2+1}{x}$ mit $H$ und $T$')

Q.q(r'Bestimme den Wertebereich von $f(x) = \dfrac{1}{x^2} + 1$.',
    [r'$W = \{y \mid y > 1\}$', r'$W = \{y \mid y \geq 1\}$', r'$W = \{y \mid y > 0\}$', r'$W = \mathbb{R} \setminus \{1\}$'],
    [r'$\dfrac{1}{x^2}$ ist für jedes $x \neq 0$ positiv und wird beliebig groß (Pol bei $x = 0$) und beliebig klein (für $x \to \pm\infty$).',
     r'Also $f(x) > 1$ für alle $x$; die Asymptote $y = 1$ wird nicht erreicht.',
     r'Falle: $y \geq 1$ - der Wert $1$ selbst wird nie angenommen.'])

Q.q(r'$f(x) = \dfrac{4x}{x^2+1}$ hat den Hochpunkt $H(1 \mid 2)$ und den Tiefpunkt $T(-1 \mid -2)$; für $x \to \pm\infty$ gilt $f(x) \to 0$. Wertebereich?',
    [r'$W = \{y \mid -2 \leq y \leq 2\}$', r'$W = \{y \mid y \leq -2 \text{ oder } y \geq 2\}$', r'$W = \mathbb{R}$', r'$W = \{y \mid -2 < y < 2\}$'],
    [r'$f$ ist auf ganz $\mathbb{R}$ definiert (Nenner $x^2 + 1 > 0$), es gibt keine Polstelle.',
     r'Der größte Wert ist $2$ (Hochpunkt), der kleinste $-2$ (Tiefpunkt) - beide werden angenommen.',
     r'Falle: $-2 < y < 2$ - die Extremwerte gehören dazu, nur die Asymptote $y = 0$ wäre ausgeschlossen, sie liegt aber im Inneren.'])

# ------------------------------------------------------------------ Flächen ----
Q.q(r'Berechne $\displaystyle\int_1^2 \dfrac{1}{x^2}\,dx$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'$\ln 2$', r'$\dfrac{7}{24}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$, Stammfunktion $F(x) = \dfrac{x^{-1}}{-1} = -\dfrac{1}{x}$.',
     r'$\left[-\dfrac{1}{x}\right]_1^2 = -\dfrac{1}{2} - (-1) = \dfrac{1}{2}$',
     r'Falle: $\ln$ gehört zu $\dfrac{1}{x}$, nicht zu $\dfrac{1}{x^2}$; beim Exponenten $-2$ wird zu $-1$ erhöht, nicht zu $-3$ erniedrigt.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = \dfrac{x^2+1}{x^2}$?',
    [r'$F(x) = x - \dfrac{1}{x}$', r'$F(x) = x + \dfrac{1}{x}$', r'$F(x) = \dfrac{\frac{1}{3}x^3 + x}{\frac{1}{3}x^3}$', r'$F(x) = -\dfrac{2}{x^3}$'],
    [r'Erst vereinfachen: $f(x) = \dfrac{x^2}{x^2} + \dfrac{1}{x^2} = 1 + x^{-2}$.',
     r'Summandenweise: $F(x) = x + \dfrac{x^{-1}}{-1} = x - \dfrac{1}{x}$',
     r'Probe: $F^{\prime}(x) = 1 + \dfrac{1}{x^2}$. Zähler und Nenner getrennt zu integrieren ist falsch.'])

Q.q(r'Berechne den Inhalt der Fläche zwischen dem Graphen von $f(x) = \dfrac{x^2+1}{x^2}$ und der $x$-Achse über dem Intervall $[1;\,3]$.',
    [r'$A = \dfrac{8}{3} \approx 2{,}67$', r'$A = \dfrac{4}{3}$', r'$A = 2$', r'$A = \dfrac{10}{3}$'],
    [r'$f(x) > 0$ auf $[1;\,3]$, also $A = \displaystyle\int_1^3 \left(1 + \dfrac{1}{x^2}\right) dx$.',
     r'$\left[x - \dfrac{1}{x}\right]_1^3 = \left(3 - \dfrac{1}{3}\right) - (1 - 1) = \dfrac{8}{3}$',
     r'Kontrolle mit dem GTR: $\displaystyle\int_1^3 f(x)\,dx \approx 2{,}667$.'])

Q.q(r'Der Graph von $f(x) = \dfrac{x^3+1}{x^2}$ schließt mit der $x$-Achse und den Geraden $x = 1$ und $x = 2$ eine Fläche ein. Berechne ihren Inhalt.',
    [r'$A = 2$', r'$A = \dfrac{3}{2}$', r'$A = 1$', r'$A = \dfrac{5}{2}$'],
    [r'Vereinfachen: $f(x) = \dfrac{x^3}{x^2} + \dfrac{1}{x^2} = x + x^{-2}$, positiv auf $[1;\,2]$.',
     r'$F(x) = \dfrac{1}{2}x^2 - \dfrac{1}{x}$, also $A = F(2) - F(1) = \left(2 - \dfrac{1}{2}\right) - \left(\dfrac{1}{2} - 1\right) = \dfrac{3}{2} + \dfrac{1}{2} = 2$',
     r'Falle: $F(1) = -\dfrac{1}{2}$ nicht vergessen - die untere Grenze liefert hier keinen Nullwert.'])

# ------------------------------------------------- Untersuchung und Anwendung ----
Q.q(r'Die Konzentration eines Wirkstoffs im Blut (in mg/l) wird durch $c(t) = \dfrac{10t}{t^2+4}$ beschrieben ($t$ in Stunden nach der Einnahme). Wann ist die Konzentration am höchsten, und wie hoch ist sie?',
    [r'nach $2$ Stunden, $c = 2{,}5$ mg/l', r'nach $4$ Stunden, $c = 2$ mg/l', r'nach $2$ Stunden, $c = 5$ mg/l', r'nach $1$ Stunde, $c = 2$ mg/l'],
    [r'Quotientenregel: $c^{\prime}(t) = \dfrac{10(t^2+4) - 10t \cdot 2t}{(t^2+4)^2} = \dfrac{40 - 10t^2}{(t^2+4)^2}$',
     r'Zähler null: $40 - 10t^2 = 0$, also $t^2 = 4$ und $t = 2$ (nur $t > 0$ sinnvoll).',
     r'$c(2) = \dfrac{20}{8} = 2{,}5$; vorher steigt $c$ ($c^{\prime} > 0$), danach fällt $c$: Maximum.',
     r'Probe: $c(1) = 2$ und $c(4) = 2$ sind kleiner als $2{,}5$.'])

Q.q(r'Welche Aussage über $f(x) = \dfrac{x^2+1}{x}$ trifft zu?',
    [r'$f$ hat keine Nullstellen und ist punktsymmetrisch zum Ursprung.', r'$f$ hat die Nullstellen $x = -1$ und $x = 1$.', r'$f$ ist achsensymmetrisch zur $y$-Achse.', r'$f$ hat die Nullstelle $x = 0$.'],
    [r'Nullstellen: Zähler $x^2 + 1 = 0$ hat keine Lösung, denn $x^2 + 1 \geq 1$.',
     r'$f(-x) = \dfrac{x^2+1}{-x} = -f(x)$: punktsymmetrisch zum Ursprung.',
     r'$x = 0$ ist die Polstelle (Nenner null), keine Nullstelle.'])

Q.q(r'Welchen Inhalt hat die Fläche, die der Graph von $f(x) = \dfrac{4 - x^2}{x^2}$ im Intervall $[1;\,4]$ mit der $x$-Achse einschließt?',
    [r'$A = 2$', r'$A = 0$', r'$A = 1$', r'$A = -1$'],
    [r'Nullstelle im Intervall: $4 - x^2 = 0$, also $x = 2$. Die Fläche besteht aus zwei Teilen.',
     r'$f(x) = 4x^{-2} - 1$, Stammfunktion $F(x) = -\dfrac{4}{x} - x$.',
     r'$\displaystyle\int_1^2 f(x)\,dx = F(2) - F(1) = -4 - (-5) = 1$ und $\displaystyle\int_2^4 f(x)\,dx = F(4) - F(2) = -5 - (-4) = -1$.',
     r'$A = 1 + |{-1}| = 2$. Falle: das Gesamtintegral $\displaystyle\int_1^4 f(x)\,dx = 0$ ist nicht die Fläche.'],
    fig=fig_flaeche(), figcap=r'Graph von $f(x) = \dfrac{4 - x^2}{x^2}$: oberhalb und unterhalb der $x$-Achse')


def check():
    import math
    import sympy as sp
    from fractions import Fraction as F
    x = sp.symbols('x', real=True)
    t = sp.symbols('t', positive=True)
    z = lambda a, b: sp.simplify(a - b) == 0
    # Q1-3: f = (x^2+1)/x
    f = (x**2 + 1) / x
    assert z(sp.diff(f, x), (x**2 - 1) / x**2)
    assert z(sp.diff(x**2 + 1, x) / sp.diff(x, x), 2 * x) and z((2 * x * x + (x**2 + 1)) / x**2, (3 * x**2 + 1) / x**2)
    assert sorted(sp.solve(x**2 - 1, x)) == [-1, 1]
    assert f.subs(x, 1) == 2 and z(sp.diff(f, x, 2), 2 / x**3) and sp.diff(f, x, 2).subs(x, 1) == 2
    assert f.subs(x, -1) == -2 and sp.diff(f, x, 2).subs(x, -1) == -2
    # Q4-5: g = x^2/(x-1)
    g = x**2 / (x - 1)
    assert z(sp.diff(g, x), (x**2 - 2 * x) / (x - 1)**2)
    assert z((2 * x * (x - 1) + x**2) / (x - 1)**2, (3 * x**2 - 2 * x) / (x - 1)**2)
    assert sorted(sp.solve(x**2 - 2 * x, x)) == [0, 2] and g.subs(x, 0) == 0 and g.subs(x, 2) == 4
    assert z(sp.diff(g, x, 2), 2 / (x - 1)**3) and sp.diff(g, x, 2).subs(x, 0) == -2 and sp.diff(g, x, 2).subs(x, 2) == 2
    # Q6: sign pattern of (x^2-9)/(x^2+3)^2
    d = (x**2 - 9) / (x**2 + 3)**2
    assert sorted(sp.solve(x**2 - 9, x)) == [-3, 3] and sp.solve(x**2 + 3, x) == []
    assert d.subs(x, -4) > 0 and d.subs(x, 0) < 0 and d.subs(x, 4) > 0
    # Q7: K = (x^2+100)/x
    K = (x**2 + 100) / x
    assert z(sp.diff(K, x), (x**2 - 100) / x**2) and K.subs(x, 10) == 20 and K.subs(x, 20) == 25 and K.subs(x, 5) == 25
    assert K.subs(x, 100) == 101 and z(sp.diff(K, x, 2), 200 / x**3)
    # Q8: f'' = 2/x^3 has no zero
    assert sp.solve(sp.diff(f, x, 2), x) == []
    assert sp.diff(f, x, 2).subs(x, -2) < 0 and sp.diff(f, x, 2).subs(x, 2) > 0
    # Q9-10, Q13: h = 4x/(x^2+1)
    h = 4 * x / (x**2 + 1)
    h2 = sp.diff(h, x, 2)
    assert set(sp.solve(h2, x)) == {0, sp.sqrt(3), -sp.sqrt(3)}
    assert h.subs(x, sp.sqrt(3)) == sp.sqrt(3) and h.subs(x, -sp.sqrt(3)) == -sp.sqrt(3) and h.subs(x, 0) == 0
    assert abs(math.sqrt(3) - 1.73) < 0.005
    assert sorted(sp.solve(sp.diff(h, x), x)) == [-1, 1] and h.subs(x, 1) == 2 and h.subs(x, -1) == -2
    assert h2.subs(x, 1) < 0 and h2.subs(x, 3) > 0
    assert sp.limit(h, x, sp.oo) == 0 and sp.limit(h, x, -sp.oo) == 0
    # Q11: range of f - f(x) >= 2 for x > 0 (AM-GM) and the limits at the pole
    assert sp.limit(f, x, 0, '+') == sp.oo and sp.limit(f, x, 0, '-') == -sp.oo
    assert all(f.subs(x, v) >= 2 for v in (F(1, 10), F(1, 2), 1, 3, 10)) and z(f.subs(x, -x), -f)
    # Q12: 1/x^2 + 1 > 1, limit 1
    k = 1 / x**2 + 1
    assert sp.limit(k, x, sp.oo) == 1 and all(k.subs(x, v) > 1 for v in (F(1, 10), 1, 10))
    # Q14: int_1^2 x^-2
    assert sp.integrate(1 / x**2, (x, 1, 2)) == F(1, 2)
    assert F(-1, 24) + F(1, 3) == F(7, 24) and sp.integrate(1 / x, (x, 1, 2)) == sp.log(2)
    # Q15: antiderivative of (x^2+1)/x^2
    assert z(sp.diff(x - 1 / x, x), (x**2 + 1) / x**2) and z(sp.diff(1 + x**-2, x), -2 / x**3)
    # Q16: int_1^3 (x^2+1)/x^2 = 8/3, distractors
    assert sp.integrate((x**2 + 1) / x**2, (x, 1, 3)) == F(8, 3)
    assert (3 + F(1, 3)) - 2 == F(4, 3) and 3 - 1 == 2 and 3 + F(1, 3) == F(10, 3) and abs(8 / 3 - 2.667) < 0.0005
    # Q17: int_1^2 (x^3+1)/x^2 = 2
    assert sp.integrate((x**3 + 1) / x**2, (x, 1, 2)) == 2
    assert F(4, 2) - F(1, 2) == F(3, 2) and (2 + F(1, 2)) - (F(1, 2) + 1) == 1 and 2 + F(1, 2) == F(5, 2)
    # Q18: c(t) = 10t/(t^2+4)
    c = 10 * t / (t**2 + 4)
    assert z(sp.diff(c, t), (40 - 10 * t**2) / (t**2 + 4)**2) and sp.solve(sp.diff(c, t), t) == [2]
    assert c.subs(t, 2) == F(5, 2) and c.subs(t, 1) == 2 and c.subs(t, 4) == 2
    assert sp.diff(c, t).subs(t, 1) > 0 and sp.diff(c, t).subs(t, 3) < 0
    # Q19: no zeros, point symmetry
    assert sp.solve(x**2 + 1, x) == [] and z(f.subs(x, -x), -f)
    # Q20: (4-x^2)/x^2 on [1;4]
    m = (4 - x**2) / x**2
    Fm = -4 / x - x
    assert z(sp.diff(Fm, x), m) and sp.solve(4 - x**2, x) == [-2, 2]
    assert sp.integrate(m, (x, 1, 2)) == 1 and sp.integrate(m, (x, 2, 4)) == -1 and sp.integrate(m, (x, 1, 4)) == 0
    assert Fm.subs(x, 1) == -5 and Fm.subs(x, 2) == -4 and Fm.subs(x, 4) == -5


Q.verify(check)
Q.save()
