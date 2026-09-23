#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 26 (LB 4): Gebrochenrationale Funktionen II - Quotientenregel,
Schnittpunkte mit den Koordinatenachsen, Monotonie, Symmetrie.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=26, slug='gebrochenrational2', thema='Gebrochenrationale Funktionen II', lb='LB 4',
          blurb='Quotientenregel, Achsenschnittpunkte, Monotonie, Symmetrie',
          comment='Blocks: Quotientenregel (1-7), Schnittpunkte mit den Achsen (8-11), Monotonie (12-15), Symmetrie (16-18), Anwendung und Transfer (19-20). GTR ohne CAS.')


# ------------------------------------------------------------- figures ----
def fig_stueckkosten():
    k = lambda x: (2 * x + 50) / x
    p = S.Plot((-1.5, 42), (-3, 32), w=520, h=320)
    p.axes(5, 5, xlabel="x", ylabel="k")
    p.seg((-1.5, 2), (42, 2), S.MUTED, 1.3, dash="6 4")
    p.curve(k, 1.7, 41.5, S.RED, 2.2)
    return p.svg("Stückkostenkurve, streng monoton fallend, mit der Asymptote k gleich 2")


# --------------------------------------------------------- Quotientenregel ----
Q.q(r'Wie lautet die Quotientenregel für $f(x) = \dfrac{u(x)}{v(x)}$?',
    [r'$f^{\prime}(x) = \dfrac{u^{\prime} \cdot v - u \cdot v^{\prime}}{v^2}$',
     r'$f^{\prime}(x) = \dfrac{u^{\prime} \cdot v + u \cdot v^{\prime}}{v^2}$',
     r'$f^{\prime}(x) = \dfrac{u^{\prime}}{v^{\prime}}$',
     r'$f^{\prime}(x) = \dfrac{u \cdot v^{\prime} - u^{\prime} \cdot v}{v^2}$'],
    [r'Im Zähler steht „Ableitung des Zählers mal Nenner minus Zähler mal Ableitung des Nenners“.',
     r'Im Nenner steht der ursprüngliche Nenner im Quadrat.',
     r'Die Reihenfolge im Zähler ist wichtig: Anders als bei der Produktregel darf man hier nicht tauschen - sonst dreht sich das Vorzeichen um.'])

Q.q(r'Leite $f(x) = \dfrac{1}{x}$ mit der Quotientenregel ab.',
    [r'$f^{\prime}(x) = -\dfrac{1}{x^2}$', r'$f^{\prime}(x) = \dfrac{1}{x^2}$', r'$f^{\prime}(x) = 0$', r'$f^{\prime}(x) = -\dfrac{1}{2x}$'],
    [r'$u = 1$, $u^{\prime} = 0$, $v = x$, $v^{\prime} = 1$.',
     r'$f^{\prime}(x) = \dfrac{0 \cdot x - 1 \cdot 1}{x^2} = -\dfrac{1}{x^2}$',
     r'Probe mit der Potenzregel: $x^{-1}$ abgeleitet ist $-1 \cdot x^{-2}$. Falle: $u^{\prime} = 0$ macht die Ableitung nicht null.'])

Q.q(r'Leite $f(x) = \dfrac{x}{x+1}$ ab.',
    [r'$f^{\prime}(x) = \dfrac{1}{(x+1)^2}$', r'$f^{\prime}(x) = \dfrac{1}{x+1}$', r'$f^{\prime}(x) = \dfrac{2x+1}{(x+1)^2}$', r'$f^{\prime}(x) = 1$'],
    [r'$u = x$, $u^{\prime} = 1$, $v = x+1$, $v^{\prime} = 1$.',
     r'$f^{\prime}(x) = \dfrac{1 \cdot (x+1) - x \cdot 1}{(x+1)^2} = \dfrac{x + 1 - x}{(x+1)^2} = \dfrac{1}{(x+1)^2}$',
     r'Falle: Zähler und Nenner einzeln ableiten ergäbe $\dfrac{1}{1} = 1$ - das ist keine Regel.'])

Q.q(r'Leite $f(x) = \dfrac{2x-1}{x+3}$ ab.',
    [r'$f^{\prime}(x) = \dfrac{7}{(x+3)^2}$', r'$f^{\prime}(x) = \dfrac{-5}{(x+3)^2}$', r'$f^{\prime}(x) = \dfrac{2}{1} = 2$', r'$f^{\prime}(x) = \dfrac{4x+5}{(x+3)^2}$'],
    [r'$u^{\prime} = 2$ und $v^{\prime} = 1$.',
     r'$f^{\prime}(x) = \dfrac{2(x+3) - (2x-1) \cdot 1}{(x+3)^2} = \dfrac{2x + 6 - 2x + 1}{(x+3)^2} = \dfrac{7}{(x+3)^2}$',
     r'Falle: das Minus nur vor die Klammer schreiben und $-1$ stehen lassen - dann kommt $5$ statt $7$ heraus.'])

Q.q(r'Leite $f(x) = \dfrac{1}{x^2+1}$ ab.',
    [r'$f^{\prime}(x) = \dfrac{-2x}{(x^2+1)^2}$', r'$f^{\prime}(x) = \dfrac{2x}{(x^2+1)^2}$', r'$f^{\prime}(x) = \dfrac{1}{2x}$', r'$f^{\prime}(x) = \dfrac{-2x}{x^2+1}$'],
    [r'$u = 1$, $u^{\prime} = 0$, $v = x^2+1$, $v^{\prime} = 2x$.',
     r'$f^{\prime}(x) = \dfrac{0 \cdot (x^2+1) - 1 \cdot 2x}{(x^2+1)^2} = \dfrac{-2x}{(x^2+1)^2}$',
     r'Falle: den Nenner nicht quadrieren. Das Minus kommt aus dem $-u \cdot v^{\prime}$ der Regel.'])

Q.q(r'Woraus lässt sich die Quotientenregel herleiten?',
    [r'aus der Produktregel und der Kettenregel, indem man $\dfrac{u}{v}$ als $u \cdot v^{-1}$ schreibt',
     r'aus der Summenregel allein',
     r'aus der Potenzregel allein',
     r'gar nicht - sie ist ein eigenständiges Axiom'],
    [r'$\dfrac{u}{v} = u \cdot v^{-1}$. Produktregel: $u^{\prime} \cdot v^{-1} + u \cdot (v^{-1})^{\prime}$.',
     r'Kettenregel: $(v^{-1})^{\prime} = -v^{-2} \cdot v^{\prime}$, also insgesamt $\dfrac{u^{\prime}}{v} - \dfrac{u \cdot v^{\prime}}{v^2}$.',
     r'Auf den Hauptnenner $v^2$ gebracht ergibt das $\dfrac{u^{\prime} v - u v^{\prime}}{v^2}$ - die Quotientenregel.'])

Q.q(r'Leite $f(x) = \dfrac{x^2+3}{x-1}$ ab.',
    [r'$f^{\prime}(x) = \dfrac{x^2-2x-3}{(x-1)^2}$', r'$f^{\prime}(x) = \dfrac{x^2-2x+3}{(x-1)^2}$', r'$f^{\prime}(x) = \dfrac{2x}{1} = 2x$', r'$f^{\prime}(x) = \dfrac{3x^2-2x+3}{(x-1)^2}$'],
    [r'$u = x^2+3$, $u^{\prime} = 2x$, $v = x-1$, $v^{\prime} = 1$.',
     r'$f^{\prime}(x) = \dfrac{2x(x-1) - (x^2+3)}{(x-1)^2} = \dfrac{2x^2 - 2x - x^2 - 3}{(x-1)^2} = \dfrac{x^2-2x-3}{(x-1)^2}$',
     r'Falle: $-(x^2+3)$ wird zu $-x^2-3$, nicht zu $-x^2+3$.'])

# ------------------------------------------- Schnittpunkte mit den Achsen ----
Q.q(r'Bestimme die Nullstellen von $f(x) = \dfrac{x^2-4}{x+3}$.',
    [r'$x = -2$ und $x = 2$', r'$x = -3$', r'$x = 4$', r'$f$ hat keine Nullstellen'],
    [r'Ein Bruch ist genau dann null, wenn der Zähler null ist und der Nenner nicht.',
     r'$x^2 - 4 = 0$ ergibt $x = 2$ und $x = -2$; der Nenner ist dort $5$ bzw. $1$, also nicht null.',
     r'Falle: $x = -3$ ist die Polstelle. Dort ist $f$ überhaupt nicht definiert.'])

Q.q(r'Bestimme die Nullstellen von $f(x) = \dfrac{x^2-9}{x-3}$.',
    [r'nur $x = -3$', r'$x = -3$ und $x = 3$', r'nur $x = 3$', r'$f$ hat keine Nullstellen'],
    [r'Zähler null: $x^2 - 9 = 0$ liefert $x = 3$ und $x = -3$.',
     r'Aber $D = \mathbb{R} \setminus \{3\}$ - bei $x = 3$ wird auch der Nenner null.',
     r'Es bleibt nur $x = -3$. Bei $x = 3$ liegt eine hebbare Lücke, keine Nullstelle.'])

Q.q(r'Wo schneidet der Graph von $f(x) = \dfrac{2x-1}{x+3}$ die $y$-Achse?',
    [r'$S_y\left(0 \mid -\dfrac{1}{3}\right)$', r'$S_y\left(0 \mid \dfrac{1}{3}\right)$', r'$S_y(0 \mid 2)$', r'$S_y\left(0 \mid -\dfrac{1}{2}\right)$'],
    [r'Für den $y$-Achsenabschnitt setzt man $x = 0$ ein.',
     r'$f(0) = \dfrac{2 \cdot 0 - 1}{0 + 3} = \dfrac{-1}{3} = -\dfrac{1}{3}$',
     r'Falle: das Minus im Zähler verlieren. Der Wert $2$ wäre der Grenzwert im Unendlichen.'])

Q.q(r'Warum hat der Graph von $f(x) = \dfrac{x+1}{x}$ keinen Schnittpunkt mit der $y$-Achse?',
    [r'weil $x = 0$ nicht zum Definitionsbereich gehört', r'weil der Zähler bei $x = 0$ nicht null wird', r'weil $f(0) = 1$ ist', r'weil $f$ punktsymmetrisch ist'],
    [r'Ein $y$-Achsenabschnitt ist der Funktionswert an der Stelle $x = 0$.',
     r'Hier ist $D = \mathbb{R} \setminus \{0\}$: An der Stelle $x = 0$ liegt eine Polstelle, der Graph läuft dort an der $y$-Achse entlang ins Unendliche.',
     r'Merke: Genau eine Polstelle bei $x = 0$ verhindert den Schnittpunkt mit der $y$-Achse.'])

# ------------------------------------------------------------------ Monotonie ----
Q.q(r'Untersuche die Monotonie von $f(x) = \dfrac{x}{x+1}$ mit $f^{\prime}(x) = \dfrac{1}{(x+1)^2}$.',
    [r'auf $]-\infty;\,-1[$ und auf $]-1;\,\infty[$ jeweils streng monoton steigend',
     r'auf ganz $\mathbb{R}$ streng monoton fallend',
     r'auf $]-\infty;\,-1[$ fallend, auf $]-1;\,\infty[$ steigend',
     r'konstant, denn $f^{\prime}$ hat keine Nullstelle'],
    [r'$(x+1)^2 > 0$ für jedes $x \neq -1$, also ist $f^{\prime}(x) > 0$ auf dem ganzen Definitionsbereich.',
     r'Positive Ableitung bedeutet streng monoton steigend.',
     r'Wichtig: Die Polstelle $x = -1$ zerschneidet den Definitionsbereich - man gibt beide Teilintervalle getrennt an.'])

Q.q(r'Für $f(x) = \dfrac{3x}{x^2+1}$ gilt $f^{\prime}(x) = \dfrac{3 - 3x^2}{(x^2+1)^2}$. Auf welchem Intervall ist $f$ streng monoton steigend?',
    [r'auf $]-1;\,1[$', r'auf $]-\infty;\,-1[$ und $]1;\,\infty[$', r'auf ganz $\mathbb{R}$', r'auf $]0;\,\infty[$'],
    [r'Der Nenner $(x^2+1)^2$ ist immer positiv - es entscheidet der Zähler $3 - 3x^2 = 3(1-x^2)$.',
     r'$3(1-x^2) > 0$ gilt genau für $-1 < x < 1$.',
     r'Probe: $f^{\prime}(0) = 3 > 0$ und $f^{\prime}(2) = \dfrac{-9}{25} < 0$.'])

Q.q(r'Gegeben ist $f^{\prime}(x) = \dfrac{x^2-2x-3}{(x-1)^2}$ mit $D = \mathbb{R} \setminus \{1\}$. Bestimme die Monotonieintervalle von $f$.',
    [r'steigend auf $]-\infty;\,-1[$ und $]3;\,\infty[$, fallend auf $]-1;\,1[$ und $]1;\,3[$',
     r'steigend auf $]-1;\,3[$, fallend sonst',
     r'steigend auf $]-\infty;\,1[$, fallend auf $]1;\,\infty[$',
     r'steigend auf $]-\infty;\,-3[$ und $]1;\,\infty[$, fallend auf $]-3;\,1[$'],
    [r'Der Nenner $(x-1)^2$ ist positiv - es entscheidet der Zähler $x^2 - 2x - 3 = (x+1)(x-3)$.',
     r'Das Produkt ist positiv für $x < -1$ und für $x > 3$, dazwischen negativ.',
     r'Probe: $f^{\prime}(-2) = \dfrac{5}{9} > 0$, $f^{\prime}(0) = -3 < 0$, $f^{\prime}(4) = \dfrac{5}{9} > 0$.',
     r'Falle: die Polstelle $x = 1$ vergessen - das fallende Stück zerfällt in zwei Intervalle.'])

Q.q(r'Für eine Funktion gilt $f^{\prime}(x) = \dfrac{-5}{(x-2)^2}$ mit $D = \mathbb{R} \setminus \{2\}$. Welche Aussage stimmt?',
    [r'$f$ ist auf beiden Teilintervallen streng monoton fallend und hat keine Extremstellen',
     r'$f$ hat bei $x = 2$ einen Tiefpunkt',
     r'$f$ ist streng monoton steigend',
     r'$f$ hat bei $x = 2$ eine Extremstelle, weil $f^{\prime}$ dort nicht definiert ist'],
    [r'$(x-2)^2 > 0$, also ist $f^{\prime}(x) = \dfrac{-5}{(x-2)^2} < 0$ für jedes $x \neq 2$.',
     r'Negative Ableitung überall bedeutet: überall streng monoton fallend.',
     r'Extremstellen brauchen $f^{\prime}(x) = 0$. Der Zähler $-5$ wird nie null, und bei $x = 2$ ist $f$ gar nicht definiert.'])

# ------------------------------------------------------------------ Symmetrie ----
Q.q(r'Untersuche $f(x) = \dfrac{x^2+1}{x^2-4}$ auf Symmetrie.',
    [r'achsensymmetrisch zur $y$-Achse', r'punktsymmetrisch zum Ursprung', r'weder noch', r'achsensymmetrisch zur Geraden $x = 2$'],
    [r'$f(-x) = \dfrac{(-x)^2+1}{(-x)^2-4} = \dfrac{x^2+1}{x^2-4} = f(x)$',
     r'$f(-x) = f(x)$ bedeutet Achsensymmetrie zur $y$-Achse.',
     r'Merkregel: Kommt $x$ nur in geraden Potenzen vor, ist der Graph achsensymmetrisch.'])

Q.q(r'Untersuche $f(x) = \dfrac{x}{x^2-1}$ auf Symmetrie.',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur $y$-Achse', r'weder noch', r'punktsymmetrisch zum Punkt $(1 \mid 0)$'],
    [r'$f(-x) = \dfrac{-x}{(-x)^2-1} = \dfrac{-x}{x^2-1} = -f(x)$',
     r'$f(-x) = -f(x)$ bedeutet Punktsymmetrie zum Ursprung.',
     r'Probe mit Zahlen: $f(2) = \dfrac{2}{3}$ und $f(-2) = -\dfrac{2}{3}$.'])

Q.q(r'Untersuche $f(x) = \dfrac{x+1}{x^2}$ auf Symmetrie.',
    [r'weder achsen- noch punktsymmetrisch', r'achsensymmetrisch zur $y$-Achse', r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur $x$-Achse'],
    [r'$f(-x) = \dfrac{-x+1}{(-x)^2} = \dfrac{1-x}{x^2}$',
     r'Das ist weder $f(x) = \dfrac{1+x}{x^2}$ noch $-f(x) = \dfrac{-1-x}{x^2}$.',
     r'Gegenbeispiel genügt: $f(1) = 2$, $f(-1) = 0$. Wäre der Graph symmetrisch, müsste $0 = 2$ oder $0 = -2$ gelten.'])

# ------------------------------------------------------ Anwendung und Transfer ----
Q.q(r'Ein Betrieb hat Fixkosten von $50$ € je Tag und $2$ € Materialkosten je Stück. Die Stückkosten sind $k(x) = \dfrac{2x+50}{x}$ (in €, $x > 0$). Was sagt die Ableitung über den Verlauf?',
    [r'$k^{\prime}(x) = -\dfrac{50}{x^2} < 0$: Die Stückkosten fallen streng monoton, ein Minimum gibt es nicht.',
     r'$k^{\prime}(x) = \dfrac{50}{x^2} > 0$: Die Stückkosten steigen streng monoton.',
     r'$k^{\prime}(x) = \dfrac{2x - 50}{x^2}$: Bei $x = 25$ sind die Stückkosten minimal.',
     r'$k^{\prime}(x) = 2$: Die Stückkosten wachsen gleichmäßig.'],
    [r'Quotientenregel: $k^{\prime}(x) = \dfrac{2 \cdot x - (2x+50) \cdot 1}{x^2} = \dfrac{2x - 2x - 50}{x^2} = -\dfrac{50}{x^2}$.',
     r'Der Zähler $-50$ wird nie null, also gibt es keine Extremstelle.',
     r'Probe: $k(10) = 7$, $k(25) = 4$, $k(50) = 3$ - die Kurve fällt und nähert sich der Asymptote $k = 2$.'],
    fig=fig_stueckkosten(), figcap=r'Stückkosten $k(x) = \dfrac{2x+50}{x}$ mit der Asymptote $k = 2$')

Q.q(r'Für welchen Wert von $a$ hat $f(x) = \dfrac{x^2+a}{x-2}$ die Nullstelle $x = 3$?',
    [r'$a = -9$', r'$a = 9$', r'$a = -3$', r'$a = -6$'],
    [r'Eine Nullstelle des Bruchs ist eine Nullstelle des Zählers: $3^2 + a = 0$.',
     r'$9 + a = 0$, also $a = -9$.',
     r'Probe: $f(x) = \dfrac{x^2-9}{x-2}$ und $f(3) = \dfrac{0}{1} = 0$. Der Nenner ist bei $x = 3$ gleich $1$, also nicht null - die Nullstelle zählt wirklich.'])


def check():
    import sympy as sp
    from fractions import Fraction as F
    x = sp.symbols('x', real=True)
    z = lambda a, b: sp.simplify(a - b) == 0
    # Q2: 1/x
    assert z(sp.diff(1 / x, x), -1 / x**2)
    # Q3: x/(x+1)
    f3 = x / (x + 1)
    assert z(sp.diff(f3, x), 1 / (x + 1)**2)
    assert z((1 * (x + 1) + x * 1) / (x + 1)**2, (2 * x + 1) / (x + 1)**2)  # distractor from the sign mistake
    # Q4: (2x-1)/(x+3)
    f4 = (2 * x - 1) / (x + 3)
    assert z(sp.diff(f4, x), 7 / (x + 3)**2)
    assert z(sp.expand(2 * (x + 3) - (2 * x - 1)), 7) and z(sp.expand(2 * (x + 3) - 2 * x - 1), 5)
    assert z((2 * (x + 3) + (2 * x - 1)) / (x + 3)**2, (4 * x + 5) / (x + 3)**2)
    # Q5: 1/(x^2+1)
    assert z(sp.diff(1 / (x**2 + 1), x), -2 * x / (x**2 + 1)**2)
    # Q6: Herleitung u*v^-1
    u, v = sp.Function('u')(x), sp.Function('v')(x)
    assert z(sp.diff(u / v, x), sp.diff(u, x) / v - u * sp.diff(v, x) / v**2)
    # Q7: (x^2+3)/(x-1)
    f7 = (x**2 + 3) / (x - 1)
    assert z(sp.diff(f7, x), (x**2 - 2 * x - 3) / (x - 1)**2)
    assert z(sp.expand(2 * x * (x - 1) - (x**2 + 3)), x**2 - 2 * x - 3)
    assert z(sp.expand(2 * x * (x - 1) - x**2 + 3), x**2 - 2 * x + 3)
    # Q8: Nullstellen von (x^2-4)/(x+3)
    assert sorted(sp.solve(x**2 - 4, x)) == [-2, 2]
    assert (x + 3).subs(x, 2) == 5 and (x + 3).subs(x, -2) == 1
    # Q9: (x^2-9)/(x-3) - x=3 drops out
    assert sorted(sp.solve(x**2 - 9, x)) == [-3, 3] and sp.solve(x - 3, x) == [3]
    assert sp.limit((x**2 - 9) / (x - 3), x, 3) == 6  # removable gap, not a zero
    assert ((x**2 - 9) / (x - 3)).subs(x, -3) == 0
    # Q10: y-Achsenabschnitt von (2x-1)/(x+3)
    assert f4.subs(x, 0) == F(-1, 3) and sp.limit(f4, x, sp.oo) == 2
    # Q11: (x+1)/x bei x=0 nicht definiert
    assert sp.solve(x, x) == [0] and sp.limit((x + 1) / x, x, 0, '+') == sp.oo
    # Q12: f' = 1/(x+1)^2 > 0
    d12 = sp.diff(f3, x)
    assert all(d12.subs(x, w) > 0 for w in (-5, -2, 0, 3)) and sp.solve(sp.numer(sp.together(d12)), x) == []
    # Q13: 3x/(x^2+1)
    f13 = 3 * x / (x**2 + 1)
    d13 = sp.diff(f13, x)
    assert z(d13, (3 - 3 * x**2) / (x**2 + 1)**2)
    assert sorted(sp.solve(3 - 3 * x**2, x)) == [-1, 1]
    assert d13.subs(x, 0) == 3 and d13.subs(x, 2) == F(-9, 25) and d13.subs(x, -2) < 0
    assert d13.subs(x, sp.Rational(1, 2)) > 0
    # Q14: f' = (x^2-2x-3)/(x-1)^2
    d14 = (x**2 - 2 * x - 3) / (x - 1)**2
    assert z(x**2 - 2 * x - 3, (x + 1) * (x - 3)) and sorted(sp.solve(x**2 - 2 * x - 3, x)) == [-1, 3]
    assert d14.subs(x, -2) == F(5, 9) and d14.subs(x, 0) == -3 and d14.subs(x, 4) == F(5, 9)
    assert d14.subs(x, 2) < 0 and d14.subs(x, -5) > 0 and d14.subs(x, 5) > 0
    # Q15: f' = -5/(x-2)^2
    d15 = -5 / (x - 2)**2
    assert all(d15.subs(x, w) < 0 for w in (-3, 0, 1, 3, 10)) and sp.solve(sp.Integer(-5), x) == []
    # Q16-18: Symmetrie
    s16 = (x**2 + 1) / (x**2 - 4)
    assert z(s16.subs(x, -x), s16)
    s17 = x / (x**2 - 1)
    assert z(s17.subs(x, -x), -s17) and s17.subs(x, 2) == F(2, 3) and s17.subs(x, -2) == F(-2, 3)
    s18 = (x + 1) / x**2
    assert not z(s18.subs(x, -x), s18) and not z(s18.subs(x, -x), -s18)
    assert s18.subs(x, 1) == 2 and s18.subs(x, -1) == 0
    # Q19: k(x) = (2x+50)/x
    k = (2 * x + 50) / x
    dk = sp.diff(k, x)
    assert z(dk, -50 / x**2) and all(dk.subs(x, w) < 0 for w in (1, 10, 25, 50))
    assert k.subs(x, 10) == 7 and k.subs(x, 25) == 4 and k.subs(x, 50) == 3 and sp.limit(k, x, sp.oo) == 2
    assert z((2 * x - 50) / x**2, (2 * x - 50) / x**2) and sp.solve(2 * x - 50, x) == [25]
    # Q20: a bestimmen
    a = sp.symbols('a')
    assert sp.solve(sp.Eq(3**2 + a, 0), a) == [-9]
    assert ((x**2 - 9) / (x - 2)).subs(x, 3) == 0 and (x - 2).subs(x, 3) == 1
    assert ((x**2 + 9) / (x - 2)).subs(x, 3) == 18


Q.verify(check)
Q.save()
