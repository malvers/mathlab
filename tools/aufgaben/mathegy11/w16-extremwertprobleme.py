#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 16 / KW 51 (LB 1): optimisation problems - objective
function, constraint, domain, boundary values. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=16, slug='extremwertprobleme', thema='Extremwertprobleme', lb='LB 1',
         blurb='Zielfunktion, Nebenbedingung, Definitionsbereich, Randwerte',
         comment='Blocks: method (1-4), numbers and rectangles (5-10), boxes and cross sections (11-15), economics and other contexts (16-20).')

# ------------------------------------------------------------------ method ----
Q.q(r'Was ist bei einem Extremwertproblem die Zielfunktion?',
    [r'Die Funktion der Größe, die maximal oder minimal werden soll.', r'Die Gleichung, die zwei Variablen verknüpft.',
     r'Die Ableitung der Nebenbedingung.', r'Die Funktion, deren Nullstellen gesucht sind.'],
    [r'Beispiel: Flächeninhalt $A = x \cdot y$ soll maximal werden.',
     r'Die Nebenbedingung, z. B. $2x + 2y = 20$, macht daraus eine Funktion einer Variablen.'])

Q.q(r'Wozu dient die Nebenbedingung?',
    [r'Eine Variable durch die andere auszudrücken, damit die Zielfunktion nur noch von einer abhängt.',
     r'Den Extremwert zu berechnen.', r'Die zweite Ableitung zu ersetzen.', r'Sie wird nicht gebraucht.'],
    [r'Mit zwei Variablen lässt sich nicht einfach ableiten.',
     r'Nach einer Variablen umstellen und einsetzen.'])

Q.q(r'Warum muss man bei Extremwertproblemen die Randwerte des Definitionsbereichs prüfen?',
    [r'Das größte bzw. kleinste Ergebnis kann am Rand liegen statt im lokalen Extremum.', r'Weil dort immer das Maximum liegt.',
     r'Weil die Ableitung am Rand null ist.', r'Das ist nicht nötig.'],
    [r'$f^{\prime} = 0$ findet nur lokale Extrema im Inneren.',
     r'Gefragt ist aber meist das globale Extremum.'])

Q.q(r'Man hat für den maximalen Flächeninhalt $x = 5$ gefunden. Was gehört noch zur Antwort?',
    [r'Die fehlende Seitenlänge und der Flächeninhalt selbst, mit Einheiten.', r'Nichts, $x = 5$ ist die Antwort.',
     r'Die Nullstellen der Zielfunktion.', r'Der Grenzwert der Zielfunktion.'],
    [r'Gefragt ist meist nach den Maßen und dem Extremwert.',
     r'Also $y$ aus der Nebenbedingung und $A$ aus der Zielfunktion berechnen.'])

# ---------------------------------------------------- numbers and rectangles ----
Q.q(r'Ein Rechteck hat den Umfang 20 cm. Wie groß ist sein Flächeninhalt höchstens?',
    [r'25 cm²', r'20 cm²', r'24 cm²', r'100 cm²'],
    [r'$2x + 2y = 20 \Rightarrow y = 10 - x$, $A(x) = x(10 - x) = 10x - x^2$',
     r'$A^{\prime}(x) = 10 - 2x = 0 \Rightarrow x = 5$, $y = 5$',
     r'$A = 25$ cm²: Das Quadrat ist optimal.'])

Q.q(r'Zwei positive Zahlen haben die Summe 10. Wie groß ist ihr Produkt höchstens?',
    [r'25', r'24', r'10', r'50'],
    [r'$P(x) = x(10 - x)$',
     r'$P^{\prime}(x) = 10 - 2x = 0 \Rightarrow x = 5$; $P = 25$'])

Q.q(r'Zwei Zahlen unterscheiden sich um 8. Wie klein kann ihr Produkt werden?',
    [r'−16', r'0', r'−8', r'16'],
    [r'$P(x) = x(x + 8) = x^2 + 8x$',
     r'$P^{\prime}(x) = 2x + 8 = 0 \Rightarrow x = -4$; die Zahlen sind −4 und 4.',
     r'$P = -16$'])

Q.q(r'An einer Mauer soll mit 40 m Zaun ein rechteckiges Beet eingezäunt werden (drei Seiten Zaun). Wie groß wird die Fläche höchstens?',
    [r'200 m²', r'100 m²', r'400 m²', r'160 m²'],
    [r'Parallel zur Mauer $x$, zwei Seiten $y$: $x + 2y = 40$.',
     r'$A(y) = (40 - 2y) \cdot y$, $A^{\prime}(y) = 40 - 4y = 0 \Rightarrow y = 10$, $x = 20$',
     r'$A = 200$ m²'])

Q.q(r'Unter dem Graphen von $f(x) = 9 - x^2$ liegt ein Rechteck mit Ecken $(\pm u \mid 0)$ und $(\pm u \mid f(u))$. Für welches $u$ ist es am größten?',
    [r'$u = \sqrt{3}$', r'$u = 3$', r'$u = \dfrac{3}{2}$', r'$u = 1$'],
    [r'$A(u) = 2u \cdot (9 - u^2) = 18u - 2u^3$',
     r'$A^{\prime}(u) = 18 - 6u^2 = 0 \Rightarrow u^2 = 3$',
     r'Größter Inhalt: $A = 2\sqrt{3} \cdot 6 = 12\sqrt{3} \approx 20{,}8$'])

Q.q(r'Ein Rechteck im ersten Quadranten hat eine Ecke im Ursprung und die gegenüberliegende Ecke auf der Geraden $y = 6 - 2x$. Wie groß ist es höchstens?',
    [r'4,5', r'6', r'9', r'3'],
    [r'$A(x) = x(6 - 2x) = 6x - 2x^2$',
     r'$A^{\prime}(x) = 6 - 4x = 0 \Rightarrow x = 1{,}5$, $y = 3$',
     r'$A = 4{,}5$'])

# ----------------------------------------------- boxes and cross sections ----
Q.q(r'Aus einem quadratischen Karton (12 cm Seitenlänge) werden an den Ecken Quadrate der Seite $x$ ausgeschnitten und die Ränder hochgeklappt. Welches Volumen hat die Schachtel?',
    [r'$V(x) = x(12 - 2x)^2$', r'$V(x) = x^2(12 - x)$', r'$V(x) = (12 - x)^3$', r'$V(x) = 12x(12 - 2x)$'],
    [r'Grundfläche: Quadrat mit Seite $12 - 2x$.',
     r'Höhe: $x$.'])

Q.q(r'Welcher Definitionsbereich ist für die Schachtel sinnvoll?',
    [r'$0 < x < 6$', r'$0 < x < 12$', r'$x > 0$', r'$x \in \mathbb{R}$'],
    [r'$x$ muss positiv sein.',
     r'$12 - 2x > 0$, also $x < 6$.'])

Q.q(r'Für welches $x$ wird das Volumen der Schachtel maximal, und wie groß ist es?',
    [r'$x = 2$: 128 cm³', r'$x = 6$: 0 cm³', r'$x = 3$: 108 cm³', r'$x = 4$: 64 cm³'],
    [r'$V^{\prime}(x) = (12 - 2x)^2 - 4x(12 - 2x) = (12 - 2x)(12 - 6x)$',
     r'Im Definitionsbereich: $x = 2$.',
     r'$V(2) = 2 \cdot 8^2 = 128$'])

Q.q(r'Aus einem 30 cm breiten Blech wird eine Regenrinne mit rechteckigem Querschnitt gebogen (Ränder je $x$ cm hoch). Wann ist der Querschnitt am größten?',
    [r'Bei $x = 7{,}5$ cm: 112,5 cm²', r'Bei $x = 10$ cm: 100 cm²', r'Bei $x = 15$ cm: 0 cm²', r'Bei $x = 5$ cm: 100 cm²'],
    [r'$A(x) = x(30 - 2x)$',
     r'$A^{\prime}(x) = 30 - 4x = 0 \Rightarrow x = 7{,}5$',
     r'$A = 7{,}5 \cdot 15 = 112{,}5$'])

Q.q(r'Ein Quader mit quadratischer Grundfläche hat die Kantenlängensumme 48 cm. Wie groß ist sein Volumen höchstens?',
    [r'64 cm³', r'48 cm³', r'72 cm³', r'216 cm³'],
    [r'$8a + 4h = 48 \Rightarrow h = 12 - 2a$; $V(a) = a^2(12 - 2a)$',
     r'$V^{\prime}(a) = 24a - 6a^2 = 0 \Rightarrow a = 4$, $h = 4$',
     r'$V = 64$ cm³: wieder ein Würfel.'])

# ------------------------------------------- economics and other contexts ----
Q.q(r'Ein Gewinn wird durch $G(x) = -2x^2 + 120x - 1000$ beschrieben. Wie groß ist der höchste Gewinn?',
    [r'800', r'1000', r'30', r'1800'],
    [r'$G^{\prime}(x) = -4x + 120 = 0 \Rightarrow x = 30$',
     r'$G(30) = -1800 + 3600 - 1000 = 800$'])

Q.q(r'Bei einem Preis von $p(x) = 100 - 2x$ € pro Stück werden $x$ Stück verkauft. Bei welcher Menge ist der Erlös am größten?',
    [r'25 Stück (Erlös 1250 €)', r'50 Stück (Erlös 0 €)', r'20 Stück (Erlös 1200 €)', r'100 Stück'],
    [r'$E(x) = x \cdot (100 - 2x)$',
     r'$E^{\prime}(x) = 100 - 4x = 0 \Rightarrow x = 25$; $E = 25 \cdot 50 = 1250$'])

Q.q(r'Zwei positive Zahlen haben das Produkt 16. Wie klein kann ihre Summe sein?',
    [r'8', r'16', r'10', r'17'],
    [r'$S(x) = x + \dfrac{16}{x}$',
     r'$S^{\prime}(x) = 1 - \dfrac{16}{x^2} = 0 \Rightarrow x = 4$',
     r'$S = 4 + 4 = 8$'])

Q.q(r'Für $x + 2y = 12$ mit positiven $x$, $y$ soll $x \cdot y$ maximal werden. Welche Werte ergeben sich?',
    [r'$x = 6$, $y = 3$, Produkt 18', r'$x = 4$, $y = 4$, Produkt 16', r'$x = 3$, $y = 4{,}5$, Produkt 13,5', r'$x = 12$, $y = 0$, Produkt 0'],
    [r'$x = 12 - 2y$, $P(y) = (12 - 2y)y$',
     r'$P^{\prime}(y) = 12 - 4y = 0 \Rightarrow y = 3$, $x = 6$'])

Q.q(r'Wie prüft man, ob $x = 2$ für $V(x) = x(12 - 2x)^2$ wirklich ein Maximum liefert?',
    [r'$V^{\prime\prime}(2) < 0$ zeigen oder mit den Randwerten $V(0) = V(6) = 0$ vergleichen.', r'$V(2) > 0$ zeigen.',
     r'$V^{\prime}(2) = 0$ zeigen, das reicht.', r'Gar nicht, es ist immer ein Maximum.'],
    [r'$V^{\prime\prime}(x) = 24x - 96$, $V^{\prime\prime}(2) = -48 < 0$.',
     r'Oder: Im Inneren gibt es nur diesen kritischen Punkt, an den Rändern ist $V = 0$.'])


def check():
    import sympy as sp
    x, y, u = sp.symbols('x y u', positive=True)
    opt = lambda f, v: sp.solve(sp.diff(f, v), v)
    A = x * (10 - x)
    assert opt(A, x) == [5] and A.subs(x, 5) == 25
    z = sp.symbols('z', real=True)
    assert sp.solve(sp.diff(z * (z + 8), z), z) == [-4] and (-4) * 4 == -16
    W = (40 - 2 * y) * y
    assert opt(W, y) == [10] and W.subs(y, 10) == 200
    R = 2 * u * (9 - u ** 2)
    assert opt(R, u) == [sp.sqrt(3)] and sp.simplify(R.subs(u, sp.sqrt(3)) - 12 * sp.sqrt(3)) == 0
    assert abs(float(12 * sp.sqrt(3)) - 20.78) < 0.01
    T = x * (6 - 2 * x)
    assert opt(T, x) == [sp.Rational(3, 2)] and T.subs(x, sp.Rational(3, 2)) == sp.Rational(9, 2)
    V = x * (12 - 2 * x) ** 2
    assert sp.factor(sp.diff(V, x)) == sp.factor((12 - 2 * x) * (12 - 6 * x))
    assert [s for s in opt(V, x) if s < 6] == [2] and V.subs(x, 2) == 128
    assert sp.diff(V, x, 2).subs(x, 2) == -48
    C = x * (30 - 2 * x)
    assert opt(C, x) == [sp.Rational(15, 2)] and C.subs(x, sp.Rational(15, 2)) == sp.Rational(225, 2)
    Q8 = x ** 2 * (12 - 2 * x)
    assert opt(Q8, x) == [4] and Q8.subs(x, 4) == 64
    G = -2 * x ** 2 + 120 * x - 1000
    assert opt(G, x) == [30] and G.subs(x, 30) == 800
    E = x * (100 - 2 * x)
    assert opt(E, x) == [25] and E.subs(x, 25) == 1250
    S = x + 16 / x
    assert opt(S, x) == [4] and S.subs(x, 4) == 8
    P = (12 - 2 * y) * y
    assert opt(P, y) == [3] and P.subs(y, 3) == 18


Q.verify(check)
Q.save()
