#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 11 / KW 46 (LB 1): poles, axis-parallel asymptotes,
investigating functions in context with CAS. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=11, slug='polstellen-asymptoten', thema='Polstellen, Asymptoten, Funktionsuntersuchung', lb='LB 1',
         blurb='Polstellen, achsenparallele Asymptoten, Untersuchung im Sachzusammenhang',
         comment='Blocks: poles and gaps (1-6), horizontal asymptotes (7-9), mixed investigation (10-13), context with CAS (14-20).')

# ---------------------------------------------------------- poles and gaps ----
Q.q(r'Wo hat $f(x) = \dfrac{1}{x - 2}$ eine Polstelle?',
    [r'Bei $x = 2$', r'Bei $x = -2$', r'Bei $x = 0$', r'Bei $x = 1$'],
    [r'Der Nenner wird bei $x = 2$ null, der Zähler nicht.',
     r'Dort wachsen die Funktionswerte betragsmäßig über alle Grenzen.'])

Q.q(r'Welche senkrechte Asymptote hat der Graph von $f(x) = \dfrac{3}{x + 4}$?',
    [r'$x = -4$', r'$x = 4$', r'$y = 3$', r'$y = 0$'],
    [r'Nenner null: $x + 4 = 0 \Rightarrow x = -4$.',
     r'Senkrechte Asymptoten haben die Form $x = \ldots$'])

Q.q(r'Was hat $f(x) = \dfrac{x + 1}{x^2 - 1}$ an den Stellen $x = 1$ und $x = -1$?',
    [r'Bei 1 eine Polstelle, bei −1 eine behebbare Lücke.', r'Bei beiden eine Polstelle.',
     r'Bei 1 eine Lücke, bei −1 eine Polstelle.', r'Bei beiden eine Nullstelle.'],
    [r'$x^2 - 1 = (x - 1)(x + 1)$, also $f(x) = \dfrac{1}{x - 1}$ für $x \neq -1$.',
     r'Bei −1 kürzt sich der Faktor weg: Lücke. Bei 1 bleibt der Nenner null: Pol.'])

Q.q(r'Wie verhält sich der Graph von $f(x) = \dfrac{1}{x^2}$ an der Polstelle 0?',
    [r'Polstelle ohne Vorzeichenwechsel: von beiden Seiten nach $+\infty$.', r'Polstelle mit Vorzeichenwechsel.',
     r'Es ist keine Polstelle, sondern eine Lücke.', r'Von beiden Seiten nach $-\infty$.'],
    [r'$x^2$ ist für $x \neq 0$ positiv, also auch $\dfrac{1}{x^2}$.',
     r'Beide Äste gehen nach oben.'])

Q.q(r'Gib den Definitionsbereich von $f(x) = \dfrac{x}{x^2 - 9}$ an.',
    [r'$\mathbb{R} \setminus \{-3;\,3\}$', r'$\mathbb{R} \setminus \{9\}$', r'$\mathbb{R} \setminus \{0\}$', r'$(3;\,\infty)$'],
    [r'$x^2 - 9 = 0 \Leftrightarrow x = \pm 3$',
     r'Diese beiden Zahlen werden ausgeschlossen.'])

Q.q(r'Bestimme Nullstelle und Polstelle von $f(x) = \dfrac{x - 2}{x + 5}$.',
    [r'Nullstelle 2, Polstelle −5', r'Nullstelle −5, Polstelle 2', r'Nullstelle −2, Polstelle 5', r'Nullstelle 2, keine Polstelle'],
    [r'Nullstelle: Zähler null, Nenner nicht: $x = 2$.',
     r'Polstelle: Nenner null, Zähler nicht: $x = -5$.'])

# --------------------------------------------------- horizontal asymptotes ----
Q.q(r'Welche waagerechte Asymptote hat $f(x) = \dfrac{2x}{x - 1}$?',
    [r'$y = 2$', r'$y = 0$', r'$x = 1$', r'$y = -2$'],
    [r'Zähler- und Nennergrad sind gleich.',
     r'Quotient der Leitkoeffizienten: $\dfrac{2}{1} = 2$.'])

Q.q(r'Welche Asymptoten hat $f(x) = \dfrac{2}{x - 3} + 1$?',
    [r'$x = 3$ und $y = 1$', r'$x = -3$ und $y = 1$', r'$x = 3$ und $y = 2$', r'$x = 1$ und $y = 3$'],
    [r'Polstelle bei $x = 3$.',
     r'Für $x \to \pm\infty$ geht $\dfrac{2}{x - 3} \to 0$, also $f(x) \to 1$.',
     r'Der Graph von $\dfrac{2}{x}$, verschoben um 3 nach rechts und 1 nach oben.'])

Q.q(r'Was gilt für $f(x) = \ln x$ in der Nähe von 0?',
    [r'Für $x \to 0$ von rechts gilt $f(x) \to -\infty$; die $y$-Achse ist senkrechte Asymptote.',
     r'$f(0) = 0$', r'$f(x) \to 0$', r'$f(x) \to \infty$'],
    [r'$\ln 0{,}01 \approx -4{,}6$, $\ln 0{,}000\,01 \approx -11{,}5$',
     r'Die Werte fallen ohne Grenze.'])

# --------------------------------------------------- mixed investigation ----
Q.q(r'Welche Extrempunkte hat $f(x) = x + \dfrac{1}{x}$?',
    [r'$T(1 \mid 2)$ und $H(-1 \mid -2)$', r'$H(1 \mid 2)$ und $T(-1 \mid -2)$', r'Nur $T(1 \mid 2)$', r'Keine'],
    [r'$f^{\prime}(x) = 1 - \dfrac{1}{x^2} = 0 \Rightarrow x = \pm 1$',
     r'$f^{\prime\prime}(x) = \dfrac{2}{x^3}$: positiv bei 1 (Tiefpunkt), negativ bei −1 (Hochpunkt).',
     r'Kurios: Der Hochpunkt liegt tiefer als der Tiefpunkt, dazwischen ist der Pol.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = \dfrac{x^2 + 1}{x}$?',
    [r'Punktsymmetrie zum Ursprung', r'Achsensymmetrie zur $y$-Achse', r'Keine', r'Beide'],
    [r'$f(-x) = \dfrac{x^2 + 1}{-x} = -f(x)$'])

Q.q(r'Gib den Wertebereich von $f(x) = \dfrac{1}{x^2 + 1}$ an.',
    [r'$(0;\,1]$', r'$[0;\,1]$', r'$(0;\,\infty)$', r'$\mathbb{R}$'],
    [r'Der Nenner ist mindestens 1, also $f(x) \leq 1$ mit Gleichheit bei $x = 0$.',
     r'$f(x) > 0$ immer, und für $x \to \pm\infty$ kommt $f$ der 0 beliebig nahe, erreicht sie aber nicht.'])

Q.q(r'Das CAS liefert für $f^{\prime}(x) = 0$ die Lösung $x \approx 1{,}37$. Was ist noch zu tun, bevor man von einem Extremum spricht?',
    [r'Die hinreichende Bedingung prüfen, z. B. Vorzeichenwechsel von $f^{\prime}$ oder $f^{\prime\prime}(1{,}37) \neq 0$.',
     r'Nichts, $f^{\prime} = 0$ reicht.', r'Prüfen, ob $f(1{,}37) = 0$ ist.', r'Den Grenzwert für $x \to \infty$ bestimmen.'],
    [r'$f^{\prime}(x_0) = 0$ ist nur notwendig.',
     r'Erst mit Vorzeichenwechsel oder $f^{\prime\prime}(x_0) \neq 0$ ist das Extremum gesichert.'])

# -------------------------------------------------------- context with CAS ----
Q.q(r'Die Stückkosten eines Betriebs sind $k(x) = \dfrac{200 + 5x}{x}$ (in €, $x$ in Stück). Was passiert bei sehr großen Stückzahlen?',
    [r'Sie nähern sich 5 € pro Stück.', r'Sie nähern sich 0 €.', r'Sie wachsen über alle Grenzen.', r'Sie nähern sich 200 € pro Stück.'],
    [r'$k(x) = \dfrac{200}{x} + 5$',
     r'Die Fixkosten verteilen sich auf immer mehr Stück: $\dfrac{200}{x} \to 0$.'])

Q.q(r'Die Konzentration eines Medikaments ist $c(t) = 10t\,e^{-0{,}5t}$ ($t$ in h). Wann ist sie am größten?',
    [r'Nach 2 Stunden', r'Nach 1 Stunde', r'Nach 5 Stunden', r'Nach 10 Stunden'],
    [r'$c^{\prime}(t) = 10e^{-0{,}5t} - 5t\,e^{-0{,}5t} = 10e^{-0{,}5t}(1 - 0{,}5t)$',
     r'$c^{\prime}(t) = 0 \Rightarrow t = 2$; davor positiv, danach negativ.'])

Q.q(r'Wie groß ist die höchste Konzentration $c(2)$ für $c(t) = 10t\,e^{-0{,}5t}$ ungefähr?',
    [r'etwa 7,36', r'etwa 20', r'etwa 2,72', r'etwa 10'],
    [r'$c(2) = 20\,e^{-1} = \dfrac{20}{e}$',
     r'$\dfrac{20}{2{,}718} \approx 7{,}36$'])

Q.q(r'Bei welcher Zeit hat $c(t) = 10t\,e^{-0{,}5t}$ seine Wendestelle, und was bedeutet sie?',
    [r'$t = 4$: Dort nimmt die Konzentration am stärksten ab.', r'$t = 2$: höchste Konzentration.',
     r'$t = 4$: Dort ist die Konzentration null.', r'$t = 0$: Beginn der Einnahme.'],
    [r'$c^{\prime\prime}(t) = 10e^{-0{,}5t}(0{,}25t - 1) = 0 \Rightarrow t = 4$',
     r'Nach dem Maximum fällt $c$; in der Wendestelle ist die Abnahmerate am größten.'])

Q.q(r'Was gilt für $c(t) = 10t\,e^{-0{,}5t}$ langfristig?',
    [r'$c(t) \to 0$', r'$c(t) \to 10$', r'$c(t) \to \infty$', r'$c(t) \to 5$'],
    [r'Die Exponentialfunktion im Nenner wächst schneller als $10t$.',
     r'Das Medikament wird vollständig abgebaut.'])

Q.q(r'Ein Bestand wächst logistisch nach $N(t) = \dfrac{1000}{1 + 9e^{-t}}$. Bei welchem Bestand wächst er am schnellsten?',
    [r'Bei 500', r'Bei 100', r'Bei 1000', r'Bei 900'],
    [r'Logistisches Wachstum hat seine Wendestelle bei der halben Sättigungsgrenze.',
     r'Sättigung 1000, also schnellstes Wachstum bei 500 (zur Zeit $t = \ln 9 \approx 2{,}2$).'])

Q.q(r'Worauf kommt es bei einer Funktionsuntersuchung im Sachzusammenhang an?',
    [r'Nur die Eigenschaften untersuchen, nach denen gefragt ist, und sie im Sachzusammenhang deuten.',
     r'Immer alle Eigenschaften in fester Reihenfolge abarbeiten.', r'Nur mit dem CAS zeichnen, nichts rechnen.',
     r'Den Definitionsbereich ignorieren.'],
    [r'Der Lehrplan betont: keine routinemäßige Kurvendiskussion.',
     r'Sinnvoll ist auch der Definitionsbereich aus dem Sachzusammenhang, z. B. $t \geq 0$.'])


def check():
    import sympy as sp
    x = sp.symbols('x', real=True)
    t = sp.symbols('t', positive=True)
    d = lambda e, n=1: sp.diff(e, x, n)
    assert sp.limit(1 / (x - 2), x, 2, '+') == sp.oo
    assert sp.simplify((x + 1) / (x ** 2 - 1) - 1 / (x - 1)) == 0
    assert sp.limit((x + 1) / (x ** 2 - 1), x, -1) == -sp.Rational(1, 2)
    assert sorted(sp.solve(x ** 2 - 9, x)) == [-3, 3]
    assert sp.solve(x - 2, x) == [2] and sp.solve(x + 5, x) == [-5]
    assert sp.limit(2 * x / (x - 1), x, sp.oo) == 2 and sp.limit(2 / (x - 3) + 1, x, sp.oo) == 1
    assert abs(sp.log(0.01) + 4.6) < 0.01 and abs(sp.log(0.00001) + 11.5) < 0.02
    f = x + 1 / x
    assert sorted(sp.solve(d(f), x)) == [-1, 1] and d(f, 2).subs(x, 1) == 2 and d(f, 2).subs(x, -1) == -2
    assert f.subs(x, 1) == 2 and f.subs(x, -1) == -2
    g = (x ** 2 + 1) / x
    assert sp.simplify(g.subs(x, -x) + g) == 0
    assert sp.limit(200 / x + 5, x, sp.oo) == 5
    c = 10 * t * sp.exp(-t / 2)
    assert sp.solve(sp.diff(c, t), t) == [2] and abs(float(c.subs(t, 2)) - 7.36) < 0.01
    assert sp.solve(sp.diff(c, t, 2), t) == [4] and sp.limit(c, t, sp.oo) == 0
    N = 1000 / (1 + 9 * sp.exp(-t))
    w = sp.solve(sp.diff(N, t, 2), t)
    assert len(w) == 1 and sp.simplify(w[0] - sp.log(9)) == 0 and sp.simplify(N.subs(t, w[0])) == 500


Q.verify(check)
Q.save()
