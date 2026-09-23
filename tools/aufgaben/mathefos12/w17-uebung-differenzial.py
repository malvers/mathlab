#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 17 (Übung, kurze Woche vor Weihnachten): gemischter
Übungszirkel über LB 2 bis hierher - Ableitungsregeln, Kettenregel, Tangente und Normale,
Nullstellen, Extrempunkte - plus vier Mathe-Rätsel zum Jahresausklang.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=17, slug='uebung-differenzial', thema='Übung Differenzialrechnung', lb='Übung',
          blurb='Ableiten, Tangenten, Extrempunkte gemischt, dazu Mathe-Rätsel',
          comment='Blocks: Ableitungsregeln (1-6), Tangente und Normale (7-10), Nullstellen und Extrema (11-16), Mathe-Rätsel zum Jahresausklang (17-20). Alles ohne CAS.')

# ------------------------------------------------------- Ableitungsregeln ----
Q.q(r'Bestimme die Ableitung von $f(x) = 3x^4 - 2x^2 + 5$.',
    [r'$f^{\prime}(x) = 12x^3 - 4x$', r'$f^{\prime}(x) = 12x^3 - 4x + 5$', r'$f^{\prime}(x) = 12x^4 - 4x^2$', r'$f^{\prime}(x) = 3x^3 - 2x$'],
    [r'Potenzregel gliedweise: $(x^n)^{\prime} = n \cdot x^{n-1}$, Faktoren bleiben stehen.',
     r'$3 \cdot 4x^3 - 2 \cdot 2x^1 + 0 = 12x^3 - 4x$',
     r'Falle: die Konstante $5$ fällt weg, sie hat die Ableitung $0$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = (2x - 3)^5$.',
    [r'$f^{\prime}(x) = 10\,(2x - 3)^4$', r'$f^{\prime}(x) = 5\,(2x - 3)^4$', r'$f^{\prime}(x) = 10\,(2x - 3)^5$', r'$f^{\prime}(x) = 2\,(2x - 3)^4$'],
    [r'Kettenregel: äußere Ableitung mal innere Ableitung.',
     r'Äußere: $5\,(2x - 3)^4$, innere: $(2x - 3)^{\prime} = 2$',
     r'$f^{\prime}(x) = 5\,(2x - 3)^4 \cdot 2 = 10\,(2x - 3)^4$',
     r'Falle: die innere Ableitung $2$ vergessen ergibt $5\,(2x - 3)^4$.'])

Q.q(r'Gegeben ist $f(x) = \dfrac{1}{4}x^4 - x^3$. Wie lautet die zweite Ableitung $f^{\prime\prime}(x)$?',
    [r'$f^{\prime\prime}(x) = 3x^2 - 6x$', r'$f^{\prime\prime}(x) = x^3 - 3x^2$', r'$f^{\prime\prime}(x) = 3x^2 - 3x$', r'$f^{\prime\prime}(x) = 6x - 6$'],
    [r'Erste Ableitung: $f^{\prime}(x) = \dfrac{1}{4} \cdot 4x^3 - 3x^2 = x^3 - 3x^2$',
     r'Noch einmal ableiten: $f^{\prime\prime}(x) = 3x^2 - 6x$',
     r'$6x - 6$ wäre schon die dritte Ableitung.'])

Q.q(r'Berechne $f^{\prime}(1)$ für $f(x) = (x^2 + 1)^3$.',
    [r'$f^{\prime}(1) = 24$', r'$f^{\prime}(1) = 12$', r'$f^{\prime}(1) = 8$', r'$f^{\prime}(1) = 48$'],
    [r'Kettenregel: $f^{\prime}(x) = 3\,(x^2 + 1)^2 \cdot 2x = 6x\,(x^2 + 1)^2$',
     r'$f^{\prime}(1) = 6 \cdot 1 \cdot (1 + 1)^2 = 6 \cdot 4 = 24$',
     r'Fallen: ohne innere Ableitung $3 \cdot 2^2 = 12$; der Funktionswert $f(1) = 2^3 = 8$ ist kein Anstieg.'])

Q.q(r'Welchen Anstieg hat der Graph von $f(x) = 2x^3 - 5x$ an der Stelle $x = -1$?',
    [r'$m = 1$', r'$m = -11$', r'$m = 3$', r'$m = -1$'],
    [r'Der Anstieg ist der Wert der Ableitung: $f^{\prime}(x) = 6x^2 - 5$',
     r'$f^{\prime}(-1) = 6 \cdot (-1)^2 - 5 = 6 - 5 = 1$',
     r'Fallen: $(-1)^2 = +1$, nicht $-1$ (sonst $-11$); $f(-1) = 3$ ist der Funktionswert, nicht der Anstieg.'])

Q.q(r'Bestimme die Ableitung von $f(x) = (3x - 1)^2$.',
    [r'$f^{\prime}(x) = 18x - 6$', r'$f^{\prime}(x) = 6x - 2$', r'$f^{\prime}(x) = 18x - 1$', r'$f^{\prime}(x) = 9x - 3$'],
    [r'Kettenregel: $f^{\prime}(x) = 2\,(3x - 1) \cdot 3 = 6\,(3x - 1) = 18x - 6$',
     r'Probe über Ausmultiplizieren: $f(x) = 9x^2 - 6x + 1$, also $f^{\prime}(x) = 18x - 6$. Passt.',
     r'Falle: ohne innere Ableitung $3$ käme $6x - 2$ heraus.'])

# ---------------------------------------------------- Tangente und Normale ----
Q.q(r'Wie lautet die Gleichung der Tangente an den Graphen von $f(x) = x^2 - 3x + 1$ im Punkt mit $x = 2$?',
    [r'$t(x) = x - 3$', r'$t(x) = x - 1$', r'$t(x) = 2x - 5$', r'$t(x) = -x + 1$'],
    [r'Berührpunkt: $f(2) = 4 - 6 + 1 = -1$, also $P(2|-1)$.',
     r'Anstieg: $f^{\prime}(x) = 2x - 3$, $f^{\prime}(2) = 1$',
     r'Tangente: $t(x) = 1 \cdot (x - 2) + (-1) = x - 3$',
     r'Falle: $t(x) = x - 1$ hat den richtigen Anstieg, geht aber nicht durch $P$ ($t(2) = 1 \neq -1$).'])

Q.q(r'Unter welchem Winkel $\alpha$ steigt der Graph von $f(x) = x^3$ an der Stelle $x = 1$ (Steigungswinkel gegen die $x$-Achse)?',
    [r'$\alpha \approx 71{,}6^\circ$', r'$\alpha = 45^\circ$', r'$\alpha \approx 18{,}4^\circ$', r'$\alpha = 60^\circ$'],
    [r'$f^{\prime}(x) = 3x^2$, also Anstieg $m = f^{\prime}(1) = 3$.',
     r'Steigungswinkel: $\tan\alpha = m = 3 \Rightarrow \alpha = \arctan 3 \approx 71{,}6^\circ$',
     r'Falle: $\arctan\dfrac{1}{3} \approx 18{,}4^\circ$ wäre der Winkel zur $y$-Achse.'])

Q.q(r'An welcher Stelle hat der Graph von $f(x) = x^2 - 4x + 7$ eine Tangente, die parallel zur Geraden $y = 2x + 1$ verläuft?',
    [r'$x = 3$', r'$x = 1$', r'$x = 2$', r'$x = 6$'],
    [r'Parallel heißt gleicher Anstieg: $f^{\prime}(x) = 2$',
     r'$f^{\prime}(x) = 2x - 4 = 2 \Rightarrow 2x = 6 \Rightarrow x = 3$',
     r'Falle: $x = 2$ ist die Stelle mit waagerechter Tangente ($f^{\prime}(2) = 0$), $x = 6$ entsteht, wenn man am Ende nicht durch $2$ teilt.'])

Q.q(r'Wie lautet die Normale an den Graphen von $f(x) = x^2$ im Punkt $P(1|1)$?',
    [r'$n(x) = -\dfrac{1}{2}x + \dfrac{3}{2}$', r'$n(x) = -2x + 3$', r'$n(x) = \dfrac{1}{2}x + \dfrac{1}{2}$', r'$n(x) = -\dfrac{1}{2}x + 1$'],
    [r'Tangentenanstieg: $f^{\prime}(x) = 2x$, $f^{\prime}(1) = 2$',
     r'Normalenanstieg: $m_n = -\dfrac{1}{m_t} = -\dfrac{1}{2}$',
     r'$n(x) = -\dfrac{1}{2}(x - 1) + 1 = -\dfrac{1}{2}x + \dfrac{3}{2}$; Probe: $n(1) = 1$. Passt.',
     r'Falle: $-2x + 3$ hat den negativen Tangentenanstieg statt des negativen Kehrwerts.'])

# ------------------------------------------------ Nullstellen und Extrema ----
Q.q(r'Bestimme alle Nullstellen von $f(x) = x^3 - 4x$.',
    [r'$x_1 = 0$, $x_2 = 2$, $x_3 = -2$', r'$x_1 = 2$, $x_2 = -2$', r'$x_1 = 0$, $x_2 = 4$', r'$x_1 = 0$, $x_2 = 2$'],
    [r'$x$ ausklammern: $f(x) = x\,(x^2 - 4) = x\,(x - 2)(x + 2)$',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$, $x = 2$, $x = -2$',
     r'Falle: wer durch $x$ dividiert, verliert die Nullstelle $x = 0$.'])

Q.q(r'$f(x) = x^3 - 3x^2 + 4$ hat die Nullstellen $x = -1$ und $x = 2$. Welche Aussage ist richtig?',
    [r'Bei $x = 2$ berührt der Graph die $x$-Achse (doppelte Nullstelle), bei $x = -1$ schneidet er sie.',
     r'Bei $x = -1$ berührt der Graph die $x$-Achse, bei $x = 2$ schneidet er sie.',
     r'Der Graph schneidet die $x$-Achse an beiden Stellen.',
     r'Der Graph berührt die $x$-Achse an beiden Stellen.'],
    [r'Linearfaktoren: $f(x) = (x + 1)(x - 2)^2$, Probe durch Ausmultiplizieren: $(x + 1)(x^2 - 4x + 4) = x^3 - 3x^2 + 4$.',
     r'$x = 2$ hat die Vielfachheit $2$ (gerade): Berühren ohne Vorzeichenwechsel.',
     r'$x = -1$ hat die Vielfachheit $1$ (ungerade): Schneiden mit Vorzeichenwechsel.'])

Q.q(r'Bestimme die Extrempunkte von $f(x) = x^3 - 3x$.',
    [r'Hochpunkt $H(-1|2)$, Tiefpunkt $T(1|-2)$', r'Hochpunkt $H(1|-2)$, Tiefpunkt $T(-1|2)$', r'Hochpunkt $H(-1|0)$, Tiefpunkt $T(1|0)$', r'nur ein Tiefpunkt $T(1|-2)$'],
    [r'Notwendig: $f^{\prime}(x) = 3x^2 - 3 = 0 \Rightarrow x = \pm 1$',
     r'Hinreichend: $f^{\prime\prime}(x) = 6x$; $f^{\prime\prime}(-1) = -6 < 0$ (Hochpunkt), $f^{\prime\prime}(1) = 6 > 0$ (Tiefpunkt)',
     r'Funktionswerte: $f(-1) = -1 + 3 = 2$, $f(1) = 1 - 3 = -2$',
     r'Merkregel: $f^{\prime\prime} < 0$ - der Graph ist dort rechtsgekrümmt, das ist ein Hochpunkt.'])

Q.q(r'Welche Extrempunkte hat $f(x) = x^4 - 8x^2$?',
    [r'ein Hochpunkt $H(0|0)$ und zwei Tiefpunkte $T_{1,2}(\pm 2|-16)$', r'ein Tiefpunkt $T(0|0)$ und zwei Hochpunkte $H_{1,2}(\pm 2|-16)$', r'nur zwei Tiefpunkte $T_{1,2}(\pm 2|-16)$', r'drei Tiefpunkte bei $x = 0$ und $x = \pm 2$'],
    [r'$f^{\prime}(x) = 4x^3 - 16x = 4x\,(x^2 - 4) = 0 \Rightarrow x = 0$ oder $x = \pm 2$',
     r'$f^{\prime\prime}(x) = 12x^2 - 16$: $f^{\prime\prime}(0) = -16 < 0$ (Hochpunkt), $f^{\prime\prime}(\pm 2) = 32 > 0$ (Tiefpunkte)',
     r'$f(0) = 0$, $f(\pm 2) = 16 - 32 = -16$',
     r'Der Graph ist achsensymmetrisch (nur gerade Exponenten) - die beiden Tiefpunkte liegen spiegelbildlich.'])

Q.q(r'Für $f(x) = x^3$ gilt $f^{\prime}(0) = 0$. Welche Aussage ist richtig?',
    [r'$f^{\prime}(0) = 0$ ist nur die notwendige Bedingung - $f$ hat bei $x = 0$ keinen Extrempunkt, sondern einen Sattelpunkt.',
     r'Der Graph hat bei $x = 0$ einen Tiefpunkt, weil $f^{\prime}(0) = 0$ gilt.',
     r'Der Graph hat bei $x = 0$ einen Hochpunkt, weil $f^{\prime\prime}(0) = 0$ gilt.',
     r'$f^{\prime}(0) = 0$ ist die hinreichende Bedingung für einen Extrempunkt.'],
    [r'$f^{\prime}(x) = 3x^2 \geq 0$ für alle $x$: der Graph steigt überall, kein Vorzeichenwechsel von $f^{\prime}$.',
     r'$f^{\prime\prime}(x) = 6x$, $f^{\prime\prime}(0) = 0$ - die hinreichende Bedingung $f^{\prime\prime}(x_0) \neq 0$ ist nicht erfüllt.',
     r'Waagerechte Tangente ohne Extremum: Sattelpunkt $S(0|0)$.'])

Q.q(r'Der Gewinn eines Betriebs hängt von der Stückzahl $x$ ab: $G(x) = -2x^2 + 120x - 1000$ (in €). Bei welcher Stückzahl ist der Gewinn maximal, und wie groß ist er?',
    [r'$x = 30$, $G_{\max} = 800$ €', r'$x = 60$, $G_{\max} = 800$ €', r'$x = 30$, $G_{\max} = 1800$ €', r'$x = 15$, $G_{\max} = 350$ €'],
    [r'$G^{\prime}(x) = -4x + 120 = 0 \Rightarrow x = 30$',
     r'$G^{\prime\prime}(x) = -4 < 0$: Maximum.',
     r'$G(30) = -2 \cdot 900 + 3600 - 1000 = 800$',
     r'Falle: die Fixkosten $1000$ am Ende vergessen ergibt $1800$.'])

# ------------------------------------------ Mathe-Rätsel zum Jahresausklang ----
Q.q(r'Rätsel: Am 1. Weihnachtstag bekommst du 1 Geschenk, am 2. Tag $1 + 2$ Geschenke, am 3. Tag $1 + 2 + 3$ Geschenke und so weiter bis zum 12. Tag. Wie viele Geschenke sind es insgesamt?',
    [r'$364$', r'$78$', r'$156$', r'$312$'],
    [r'Tag $n$ bringt die Dreieckszahl $D_n = \dfrac{n\,(n + 1)}{2}$: $1,\ 3,\ 6,\ 10,\ 15,\ 21,\ 28,\ 36,\ 45,\ 55,\ 66,\ 78$.',
     r'Summe: $1 + 3 + 6 + \dots + 78 = 364$ - fast ein Geschenk für jeden Tag des Jahres.',
     r'Formel: $\dfrac{n\,(n + 1)(n + 2)}{6} = \dfrac{12 \cdot 13 \cdot 14}{6} = 364$',
     r'Falle: $78$ ist nur das Paket vom 12. Tag.'])

Q.q(r'Rätsel: Zwei gleich lange Kerzen werden gleichzeitig angezündet. Die erste ist nach $4$ Stunden abgebrannt, die zweite nach $6$ Stunden. Nach welcher Zeit ist die zweite Kerze doppelt so lang wie die erste?',
    [r'nach $3$ Stunden', r'nach $2$ Stunden', r'nach $2{,}4$ Stunden', r'nach $3{,}5$ Stunden'],
    [r'Länge in Anteilen der Anfangslänge: $L_1(t) = 1 - \dfrac{t}{4}$, $L_2(t) = 1 - \dfrac{t}{6}$ (lineare Funktionen).',
     r'Bedingung $L_2 = 2 \cdot L_1$: $1 - \dfrac{t}{6} = 2 - \dfrac{t}{2} \Rightarrow \dfrac{t}{2} - \dfrac{t}{6} = 1 \Rightarrow \dfrac{t}{3} = 1$',
     r'$t = 3$; Probe: $L_1(3) = \dfrac{1}{4}$, $L_2(3) = \dfrac{1}{2}$. Passt.'])

Q.q(r'Rätsel: Die Ziffernsumme einer zweistelligen Zahl ist $12$. Vertauscht man die beiden Ziffern, wird die Zahl um $36$ größer. Wie heißt die Zahl?',
    [r'$48$', r'$84$', r'$39$', r'$57$'],
    [r'Zahl $10a + b$ mit $a + b = 12$; vertauscht: $10b + a$.',
     r'$(10b + a) - (10a + b) = 9\,(b - a) = 36 \Rightarrow b - a = 4$',
     r'Mit $a + b = 12$: $b = 8$, $a = 4$, also $48$. Probe: $84 - 48 = 36$. Passt.',
     r'Falle: $84$ hat die richtigen Ziffern, wird beim Vertauschen aber kleiner.'])

Q.q(r'Rätsel: Bei der Weihnachtsfeier stößt jede Person mit jeder anderen genau einmal an. Es klirrt $66$-mal. Wie viele Personen feiern mit?',
    [r'$12$', r'$11$', r'$33$', r'$13$'],
    [r'Bei $n$ Personen gibt es $\dfrac{n\,(n - 1)}{2}$ Paare.',
     r'$\dfrac{n\,(n - 1)}{2} = 66 \Rightarrow n^2 - n - 132 = 0 \Rightarrow n = \dfrac{1 + \sqrt{1 + 528}}{2} = \dfrac{1 + 23}{2} = 12$',
     r'Probe: $\dfrac{12 \cdot 11}{2} = 66$. Passt; $11$ Personen ergäben nur $55$ Paare.'])


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x = sp.symbols('x')
    d = sp.diff
    eq = lambda a, b: sp.simplify(a - b) == 0
    # 1
    assert eq(d(3*x**4 - 2*x**2 + 5, x), 12*x**3 - 4*x)
    # 2
    assert eq(d((2*x - 3)**5, x), 10*(2*x - 3)**4)
    # 3
    f3 = sp.Rational(1, 4)*x**4 - x**3
    assert eq(d(f3, x), x**3 - 3*x**2) and eq(d(f3, x, 2), 3*x**2 - 6*x) and eq(d(f3, x, 3), 6*x - 6)
    # 4
    f4 = (x**2 + 1)**3
    assert d(f4, x).subs(x, 1) == 24 and 3 * 2**2 == 12 and f4.subs(x, 1) == 8
    # 5
    f5 = 2*x**3 - 5*x
    assert d(f5, x).subs(x, -1) == 1 and 6*(-1) - 5 == -11 and f5.subs(x, -1) == 3
    # 6
    assert eq(d((3*x - 1)**2, x), 18*x - 6) and eq(sp.expand((3*x - 1)**2), 9*x**2 - 6*x + 1)
    # 7
    f7 = x**2 - 3*x + 1
    assert f7.subs(x, 2) == -1 and d(f7, x).subs(x, 2) == 1
    t7 = 1*(x - 2) - 1
    assert eq(t7, x - 3) and (x - 1).subs(x, 2) == 1 and eq(2*(x - 2) - 1, 2*x - 5)
    # 8
    assert d(x**3, x).subs(x, 1) == 3
    assert abs(math.degrees(math.atan(3)) - 71.6) < 0.05 and abs(math.degrees(math.atan(1/3)) - 18.4) < 0.05
    # 9
    assert sp.solve(sp.Eq(d(x**2 - 4*x + 7, x), 2), x) == [3] and sp.solve(d(x**2 - 4*x + 7, x), x) == [2]
    # 10
    assert d(x**2, x).subs(x, 1) == 2 and F(-1, 2) == -1 / F(2)
    n10 = F(-1, 2) * (x - 1) + 1
    assert eq(n10, sp.Rational(-1, 2)*x + sp.Rational(3, 2)) and n10.subs(x, 1) == 1
    # 11
    assert sorted(sp.solve(x**3 - 4*x, x)) == [-2, 0, 2]
    # 12
    assert eq(sp.expand((x + 1)*(x - 2)**2), x**3 - 3*x**2 + 4)
    assert sp.roots(x**3 - 3*x**2 + 4) == {2: 2, -1: 1}
    # 13
    f13 = x**3 - 3*x
    assert sorted(sp.solve(d(f13, x), x)) == [-1, 1]
    assert d(f13, x, 2).subs(x, -1) == -6 and d(f13, x, 2).subs(x, 1) == 6
    assert f13.subs(x, -1) == 2 and f13.subs(x, 1) == -2
    # 14
    f14 = x**4 - 8*x**2
    assert sorted(sp.solve(d(f14, x), x)) == [-2, 0, 2]
    assert d(f14, x, 2).subs(x, 0) == -16 and d(f14, x, 2).subs(x, 2) == 32 and d(f14, x, 2).subs(x, -2) == 32
    assert f14.subs(x, 2) == -16 and f14.subs(x, -2) == -16
    # 15
    assert d(x**3, x).subs(x, 0) == 0 and d(x**3, x, 2).subs(x, 0) == 0
    # 16
    G = -2*x**2 + 120*x - 1000
    assert sp.solve(d(G, x), x) == [30] and d(G, x, 2) == -4
    assert G.subs(x, 30) == 800 and (G + 1000).subs(x, 30) == 1800
    assert G.subs(x, 60) == -2*3600 + 7200 - 1000 and G.subs(x, 15) == -450 + 1800 - 1000  # 350
    assert G.subs(x, 15) == 350
    # 17
    tri = [n * (n + 1) // 2 for n in range(1, 13)]
    assert tri == [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 66, 78]
    assert sum(tri) == 364 and 12 * 13 * 14 // 6 == 364 and tri[-1] == 78
    # 18
    L1 = lambda t: 1 - F(t, 4)
    L2 = lambda t: 1 - F(t, 6)
    assert L2(3) == 2 * L1(3) and L1(3) == F(1, 4) and L2(3) == F(1, 2)
    t = sp.symbols('t')
    assert sp.solve(sp.Eq(1 - t/6, 2*(1 - t/4)), t) == [3]
    # 19
    a, b = 4, 8
    assert a + b == 12 and (10*b + a) - (10*a + b) == 36 and 9 * (b - a) == 36 and 10*a + b == 48
    # 20
    assert 12 * 11 // 2 == 66 and 11 * 10 // 2 == 55 and math.isqrt(1 + 528) == 23
    n = sp.symbols('n')
    assert 12 in sp.solve(n**2 - n - 132, n)


Q.verify(check)
Q.save()
