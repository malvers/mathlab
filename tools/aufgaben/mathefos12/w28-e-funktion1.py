#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 28 (LB 4): Exponentialfunktionen zur Basis e I - Definitionsbereich,
Kurvenverlauf, Asymptote, Exponentialgleichungen durch Exponentenvergleich, Achsenschnittpunkte.
Plan: HTML/svp/mathe/mathefos12.html."""
import math
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=28, slug='e-funktion1', thema='e-Funktionen I', lb='LB 4',
          blurb='Kurvenverlauf, Asymptote, Exponentialgleichungen durch Exponentenvergleich',
          comment='Blocks: die Zahl e (1-4), Kurvenverlauf und Asymptote (5-10), Exponentialgleichungen (11-16), Achsenschnittpunkte und Anwendungen (17-20). GTR ohne CAS.')


# ------------------------------------------------------------- figures ----
def fig_saettigung():
    f = lambda x: 3 - math.exp(-x)
    p = S.Plot((-2.4, 5.2), (-2.6, 4.2), w=520, h=320)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.seg((-2.4, 3), (5.2, 3), S.MUTED, 1.3, dash="6 4")
    p.curve(f, -1.75, 5.1, S.RED, 2.2)
    p.point(0, 2, "P", "above-left")
    return p.svg("Graph von f mit der waagerechten Asymptote y gleich 3 und dem Punkt P(0|2)")


# ------------------------------------------------------------ die Zahl e ----
Q.q(r'Welcher Näherungswert gehört zur Eulerschen Zahl $e$?',
    [r'$e \approx 2{,}718$', r'$e \approx 3{,}142$', r'$e \approx 2{,}5$', r'$e \approx 1{,}618$'],
    [r'$e = 2{,}71828\ldots$ ist wie $\pi$ eine irrationale Zahl.',
     r'$3{,}142$ ist $\pi$, $1{,}618$ der Goldene Schnitt.',
     r'Auf dem GTR: $e^1$ eintippen.'])

Q.q(r'Welche Aussage über $f(x) = e^{x}$ ist richtig?',
    [r'$f$ ist für alle $x \in \mathbb{R}$ definiert, und alle Funktionswerte sind positiv.',
     r'$f$ hat die Nullstelle $x = 0$.',
     r'$f$ ist nur für $x > 0$ definiert.',
     r'$f(0) = 0$'],
    [r'Eine Potenz mit positiver Basis ist immer positiv: $e^{x} > 0$ für jedes $x$.',
     r'$f(0) = e^0 = 1$, der Graph schneidet die $y$-Achse bei $1$ und die $x$-Achse nie.',
     r'Der Definitionsbereich ist $\mathbb{R}$ - auch negative Exponenten sind erlaubt: $e^{-1} = \dfrac{1}{e}$.'])

Q.q(r'Berechne mit dem GTR: $e^{2} \approx$',
    [r'$7{,}389$', r'$5{,}437$', r'$4{,}718$', r'$6{,}581$'],
    [r'$e^2 = e \cdot e \approx 2{,}718 \cdot 2{,}718 \approx 7{,}389$',
     r'Falle: $2 \cdot e \approx 5{,}437$ oder $e + 2 \approx 4{,}718$ sind keine Potenzen.',
     r'$2^{e} \approx 6{,}581$ hat Basis und Exponent vertauscht.'])

Q.q(r'Vereinfache $e^{x} \cdot e^{2}$.',
    [r'$e^{x+2}$', r'$e^{2x}$', r'$2 \cdot e^{x}$', r'$e^{2x+2}$'],
    [r'Potenzgesetz: gleiche Basis, Exponenten addieren: $e^{x} \cdot e^{2} = e^{x+2}$.',
     r'$e^{2x}$ wäre $(e^{x})^2 = e^{x} \cdot e^{x}$.',
     r'Dieses Gesetz braucht man beim Exponentenvergleich ständig.'])

# ------------------------------------------- Kurvenverlauf und Asymptote ----
Q.q(r'Bestimme den Definitionsbereich von $f(x) = e^{2x-1}$.',
    [r'$D = \mathbb{R}$', r'$D = \{x \mid x > 0\}$', r'$D = \{x \mid x \geq 0{,}5\}$', r'$D = \mathbb{R} \setminus \{0{,}5\}$'],
    [r'Der Exponent $2x - 1$ darf jede reelle Zahl sein - auch negativ oder null.',
     r'Also $D = \mathbb{R}$. Einschränkungen gibt es erst bei Brüchen, Wurzeln oder $\ln$.'])

Q.q(r'Beschreibe das Monotonieverhalten von $f(x) = e^{-0{,}5x+1}$.',
    [r'$f$ ist auf ganz $\mathbb{R}$ streng monoton fallend.', r'$f$ ist auf ganz $\mathbb{R}$ streng monoton wachsend.', r'$f$ fällt für $x < 2$ und wächst für $x > 2$.', r'$f$ wächst nur für $x > 2$.'],
    [r'$f(x) = e^{ax+b}$ mit $a = -0{,}5 < 0$: Wächst $x$, wird der Exponent kleiner, also auch $f(x)$.',
     r'Die Nullstelle des Exponenten ($x = 2$) ist keine Extremstelle - dort ist $f(2) = e^0 = 1$, mehr nicht.',
     r'Probe: $f(0) = e^1 \approx 2{,}72$, $f(2) = 1$, $f(4) = e^{-1} \approx 0{,}37$.'])

Q.q(r'Wie verhält sich $f(x) = e^{2x-1}$ für $x \to -\infty$ und für $x \to +\infty$?',
    [r'$x \to -\infty$: $f(x) \to 0$; $x \to +\infty$: $f(x) \to +\infty$', r'$x \to -\infty$: $f(x) \to -\infty$; $x \to +\infty$: $f(x) \to +\infty$', r'$x \to -\infty$: $f(x) \to +\infty$; $x \to +\infty$: $f(x) \to 0$', r'$x \to -\infty$: $f(x) \to e^{-1}$; $x \to +\infty$: $f(x) \to +\infty$'],
    [r'Für $x \to -\infty$ geht der Exponent gegen $-\infty$, und $e^{\text{sehr negativ}}$ ist fast null: $f(x) \to 0$.',
     r'Für $x \to +\infty$ wächst der Exponent, $f(x) \to +\infty$.',
     r'$f(x)$ wird nie negativ - $-\infty$ ist unmöglich. $e^{-1}$ ist nur der Wert bei $x = 0$.'])

Q.q(r'Welche Asymptote hat der Graph von $f(x) = e^{x} + 2$?',
    [r'$y = 2$', r'$y = 0$', r'$x = 2$', r'$y = -2$'],
    [r'Für $x \to -\infty$ gilt $e^{x} \to 0$, also $f(x) \to 0 + 2 = 2$.',
     r'Die Asymptote ist die waagerechte Gerade $y = 2$; der Graph von $e^{x}$ wurde um $2$ nach oben verschoben.',
     r'Falle: $y = 0$ gilt nur für $e^{x}$ ohne Verschiebung.'])

Q.q(r'Gegeben ist $f(x) = 3 - e^{-x}$. Welche Aussage zur Asymptote stimmt?',
    [r'$y = 3$; der Graph nähert sich ihr für $x \to +\infty$.', r'$y = 3$; der Graph nähert sich ihr für $x \to -\infty$.', r'$y = 0$', r'$y = 2$'],
    [r'Für $x \to +\infty$ wird $-x$ sehr negativ, $e^{-x} \to 0$ und $f(x) \to 3$.',
     r'Für $x \to -\infty$ wächst $e^{-x}$ über alle Grenzen, $f(x) \to -\infty$.',
     r'$y = 2$ ist nur der Schnittpunkt mit der $y$-Achse: $f(0) = 3 - 1 = 2$.'],
    fig=fig_saettigung(), figcap=r'Graph von $f(x) = 3 - e^{-x}$ mit Asymptote (gestrichelt)')

Q.q(r'Welche Funktion ist streng monoton fallend und hat die Asymptote $y = -1$?',
    [r'$f(x) = e^{-x} - 1$', r'$f(x) = e^{x} - 1$', r'$f(x) = 1 - e^{x}$', r'$f(x) = -e^{-x} - 1$'],
    [r'$e^{-x}$ ist fallend; $-1$ verschiebt den Graphen nach unten: Asymptote $y = -1$.',
     r'$e^{x} - 1$ ist wachsend; $1 - e^{x}$ ist fallend, hat aber die Asymptote $y = 1$.',
     r'$-e^{-x} - 1$ hat die Asymptote $y = -1$, ist aber wachsend (das Minus vor $e^{-x}$ spiegelt).'])

# ---------------------------------------------------- Exponentialgleichungen ----
Q.q(r'Löse $e^{x+1} = e^{4}$.',
    [r'$x = 3$', r'$x = 5$', r'$x = 4$', r'$x = \ln 4$'],
    [r'Gleiche Basis $e$ auf beiden Seiten: Exponentenvergleich $x + 1 = 4$.',
     r'$x = 3$; Probe: $e^{3+1} = e^4$.'])

Q.q(r'Löse $e^{2x} = 1$.',
    [r'$x = 0$', r'$x = \dfrac{1}{2}$', r'$x = 1$', r'keine Lösung'],
    [r'$1 = e^{0}$, also $e^{2x} = e^{0}$ und $2x = 0$.',
     r'$x = 0$. Falle: $1$ ist nicht $e^{1}$, sondern $e^{0}$.'])

Q.q(r'Löse $3 \cdot e^{2x-1} - 3 = 0$.',
    [r'$x = \dfrac{1}{2}$', r'$x = 1$', r'$x = 0$', r'$x = -\dfrac{1}{2}$'],
    [r'Umstellen: $3 \cdot e^{2x-1} = 3$, also $e^{2x-1} = 1 = e^{0}$.',
     r'Exponentenvergleich: $2x - 1 = 0$, also $x = \dfrac{1}{2}$.',
     r'Probe: $3 \cdot e^{0} - 3 = 0$.'])

Q.q(r'Löse $e^{3x} = e^{x+4}$.',
    [r'$x = 2$', r'$x = 4$', r'$x = 1$', r'$x = -2$'],
    [r'Exponentenvergleich: $3x = x + 4$.',
     r'$2x = 4$, also $x = 2$. Probe: $e^{6} = e^{6}$.'])

Q.q(r'Löse $e^{x} = 5$.',
    [r'$x = \ln 5 \approx 1{,}609$', r'$x = \dfrac{5}{e} \approx 1{,}839$', r'$x = e^{5} \approx 148{,}4$', r'$x = \lg 5 \approx 0{,}699$'],
    [r'$5$ ist keine Potenz von $e$ - daher der natürliche Logarithmus: $x = \ln 5$.',
     r'$\ln 5 \approx 1{,}609$; Probe: $e^{1{,}609} \approx 5$.',
     r'Falle: $\lg$ (Basis $10$) statt $\ln$ (Basis $e$).'])

Q.q(r'Löse $2 \cdot e^{0{,}5x} = 8$.',
    [r'$x = 2 \ln 4 \approx 2{,}773$', r'$x = \ln 4 \approx 1{,}386$', r'$x = 2 \ln 8 \approx 4{,}159$', r'$x = \dfrac{\ln 4}{2} \approx 0{,}693$'],
    [r'Erst durch $2$ teilen: $e^{0{,}5x} = 4$.',
     r'Logarithmieren: $0{,}5x = \ln 4$, also $x = 2 \ln 4 \approx 2{,}773$.',
     r'Fallen: nicht durch $2$ teilen ($\ln 8$) oder den Faktor $0{,}5$ vergessen bzw. falsch herum verrechnen.'])

# --------------------------------------- Achsenschnittpunkte und Anwendungen ----
Q.q(r'Wo schneidet der Graph von $f(x) = e^{2x-1}$ die $y$-Achse?',
    [r'$S_y(0 \mid e^{-1}) \approx (0 \mid 0{,}368)$', r'$S_y(0 \mid 1)$', r'$S_y(0 \mid e) \approx (0 \mid 2{,}718)$', r'$S_y(0 \mid -1)$'],
    [r'$y$-Achse: $x = 0$ einsetzen: $f(0) = e^{2 \cdot 0 - 1} = e^{-1} = \dfrac{1}{e}$.',
     r'$e^{-1} \approx 0{,}368$. Falle: $e^{0} = 1$ gilt nur, wenn der ganze Exponent null ist.'])

Q.q(r'Wo schneidet der Graph von $f(x) = e^{x} - 2$ die $x$-Achse?',
    [r'$S_x(\ln 2 \mid 0) \approx (0{,}693 \mid 0)$', r'$S_x(2 \mid 0)$', r'$S_x(0 \mid -1)$', r'Der Graph schneidet die $x$-Achse nicht.'],
    [r'$x$-Achse: $f(x) = 0$, also $e^{x} - 2 = 0$ und $e^{x} = 2$.',
     r'$x = \ln 2 \approx 0{,}693$.',
     r'$e^{x}$ allein hat keine Nullstelle, aber $e^{x} - 2$ schon. $(0 \mid -1)$ ist der Schnittpunkt mit der $y$-Achse.'])

Q.q(r'Ein Kapital wächst nach $K(t) = 5000 \cdot e^{0{,}03t}$ ($K$ in Euro, $t$ in Jahren). Nach welcher Zeit hat es sich verdoppelt?',
    [r'$t = \dfrac{\ln 2}{0{,}03} \approx 23{,}1$ Jahre', r'$t = \dfrac{2}{0{,}03} \approx 66{,}7$ Jahre', r'$t = \dfrac{1}{0{,}03} \approx 33{,}3$ Jahre', r'$t = \ln 2 \approx 0{,}69$ Jahre'],
    [r'Verdoppelt: $5000 \cdot e^{0{,}03t} = 10000$, also $e^{0{,}03t} = 2$.',
     r'Logarithmieren: $0{,}03t = \ln 2$, also $t = \dfrac{\ln 2}{0{,}03} \approx 23{,}1$.',
     r'Falle: $e^{0{,}03t} = 2$ heißt nicht $0{,}03t = 2$ - auf der rechten Seite steht $\ln 2$, nicht $2$.'])

Q.q(r'Ein Bauteil kühlt nach $T(t) = 20 + 60 \cdot e^{-0{,}1t}$ ab ($T$ in Grad Celsius, $t$ in Minuten). Wann ist es auf $20$ Grad Celsius abgekühlt?',
    [r'nie - $y = 20$ ist die Asymptote, es gilt $T(t) > 20$ für alle $t$', r'nach $10$ Minuten', r'nach $60$ Minuten', r'nach etwa $6{,}9$ Minuten'],
    [r'$T(t) = 20$ hieße $60 \cdot e^{-0{,}1t} = 0$ - eine Potenz von $e$ ist aber nie null.',
     r'Der Graph nähert sich der Umgebungstemperatur $20$ nur an; $T(0) = 80$.',
     r'Nach $10 \ln 2 \approx 6{,}9$ Minuten ist erst die Hälfte des Temperaturüberschusses abgebaut ($T = 50$).'])


def check():
    import math
    import sympy as sp
    x, t = sp.symbols('x t', real=True)
    E = math.e
    assert abs(E - 2.718) < 0.0005 and abs(math.pi - 3.142) < 0.0005 and abs((1 + 5 ** 0.5) / 2 - 1.618) < 0.0005
    assert E ** 0 == 1 and E ** -1 == 1 / E
    assert abs(E ** 2 - 7.389) < 0.0005 and abs(2 * E - 5.437) < 0.0005 and abs(E + 2 - 4.718) < 0.0005 and abs(2 ** E - 6.581) < 0.0005
    assert sp.simplify(sp.exp(x) * sp.exp(2) - sp.exp(x + 2)) == 0 and sp.simplify(sp.exp(x) ** 2 - sp.exp(2 * x)) == 0
    # Q6: monotone falling, values
    f6 = sp.exp(-0.5 * x + 1)
    assert sp.diff(f6, x).subs(x, 0) < 0 and sp.diff(f6, x).subs(x, 5) < 0
    assert abs(float(f6.subs(x, 0)) - 2.72) < 0.005 and f6.subs(x, 2) == 1 and abs(float(f6.subs(x, 4)) - 0.37) < 0.005
    # Q7: limits of e^(2x-1)
    f7 = sp.exp(2 * x - 1)
    assert sp.limit(f7, x, -sp.oo) == 0 and sp.limit(f7, x, sp.oo) == sp.oo and f7.subs(x, 0) == sp.exp(-1)
    # Q8-9: asymptotes
    assert sp.limit(sp.exp(x) + 2, x, -sp.oo) == 2
    f9 = 3 - sp.exp(-x)
    assert sp.limit(f9, x, sp.oo) == 3 and sp.limit(f9, x, -sp.oo) == -sp.oo and f9.subs(x, 0) == 2
    # Q10: monotonicity and asymptote of the four candidates
    cands = {'a': sp.exp(-x) - 1, 'b': sp.exp(x) - 1, 'c': 1 - sp.exp(x), 'd': -sp.exp(-x) - 1}
    falling = {k: bool(sp.diff(v, x).subs(x, 0) < 0) for k, v in cands.items()}
    asym = {k: min(sp.limit(v, x, sp.oo), sp.limit(v, x, -sp.oo), key=lambda L: abs(L) if L.is_finite else sp.oo) for k, v in cands.items()}
    assert falling == {'a': True, 'b': False, 'c': True, 'd': False}
    assert asym['a'] == -1 and asym['b'] == -1 and asym['c'] == 1 and asym['d'] == -1
    # Q11-16: equations
    assert sp.solve(sp.exp(x + 1) - sp.exp(4), x) == [3]
    assert sp.solve(sp.exp(2 * x) - 1, x) == [0]
    assert sp.solve(3 * sp.exp(2 * x - 1) - 3, x) == [sp.Rational(1, 2)]
    assert sp.solve(sp.exp(3 * x) - sp.exp(x + 4), x) == [2]
    assert abs(math.log(5) - 1.609) < 0.0005 and abs(5 / E - 1.839) < 0.0005 and abs(E ** 5 - 148.4) < 0.05 and abs(math.log10(5) - 0.699) < 0.0005
    assert abs(E ** 1.609 - 5) < 0.005
    assert abs(2 * math.log(4) - 2.773) < 0.0005 and abs(2 * E ** (0.5 * 2 * math.log(4)) - 8) < 1e-9
    assert abs(math.log(4) - 1.386) < 0.0005 and abs(2 * math.log(8) - 4.159) < 0.0005 and abs(math.log(4) / 2 - 0.693) < 0.0005
    # Q17-18
    assert abs(E ** -1 - 0.368) < 0.0005 and abs(math.log(2) - 0.693) < 0.0005 and E ** math.log(2) - 2 < 1e-9
    # Q19: doubling time
    assert abs(math.log(2) / 0.03 - 23.1) < 0.05 and abs(2 / 0.03 - 66.7) < 0.05 and abs(1 / 0.03 - 33.3) < 0.05
    assert abs(5000 * E ** (0.03 * math.log(2) / 0.03) - 10000) < 1e-6
    # Q20: cooling
    T = 20 + 60 * sp.exp(-0.1 * t)
    assert sp.limit(T, t, sp.oo) == 20 and T.subs(t, 0) == 80 and sp.solve(T - 20, t) == []
    assert abs(10 * math.log(2) - 6.9) < 0.05 and abs(20 + 60 * E ** (-0.1 * 10 * math.log(2)) - 50) < 1e-9


Q.verify(check)
Q.save()
