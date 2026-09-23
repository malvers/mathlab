#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 31 (LB 4): Abschluss LB 4 und Wiederholung Analysis -
gebrochenrationale und e-Funktionen im Prüfungsformat, Integralrechnung, Kurvendiskussion
ganzrational. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12
import svgfig as S

Q = fos12(nr=31, slug='analysis-wiederholung', thema='Abschluss LB 4 und Wiederholung Analysis', lb='LB 4',
          blurb='gebrochenrationale und e-Funktionen im Prüfungsformat, Integralrechnung',
          comment='Blocks: Komplexaufgabe gebrochenrational (1-5), Komplexaufgabe e-Funktion (6-10), Integralrechnung (11-15), Kurvendiskussion ganzrational (16-20). GTR ohne CAS, typische Prüfungsfehler in den Distraktoren.')


# ------------------------------------------------------------- figures ----
def fig_gebrochen():
    f = lambda x: (x * x - 1) / (x * x - 4)
    p = S.Plot((-5.4, 5.4), (-4.4, 5.4), w=520, h=340)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.seg((-2, -4.4), (-2, 5.4), S.MUTED, 1.4, dash="6 4")
    p.seg((2, -4.4), (2, 5.4), S.MUTED, 1.4, dash="6 4")
    p.seg((-5.4, 1), (5.4, 1), S.MUTED, 1.4, dash="6 4")
    p.curve(f, -5.3, -2.18, S.RED, 2.2)
    p.curve(f, -1.82, 1.82, S.RED, 2.2)
    p.curve(f, 2.18, 5.3, S.RED, 2.2)
    p.point(0, 0.25, "H", "above-right")
    return p.svg("Graph mit den Asymptoten x gleich minus 2, x gleich 2 und y gleich 1")


def fig_ganzrational():
    f = lambda x: x ** 3 - 3 * x + 2
    p = S.Plot((-2.8, 2.4), (-2.5, 5.5), w=520, h=330)
    p.axes(1, 1, xlabel="x", ylabel="y")
    p.curve(f, -2.2, 2.05, S.RED, 2.2)
    p.point(-1, 4, "H", "above-right")
    p.point(1, 0, "T", "below-right")
    p.point(0, 2, "W", "above-right")
    return p.svg("Graph von f mit Hochpunkt, Tiefpunkt und Wendepunkt")


# ---------------------------------- Komplexaufgabe: gebrochenrationale Funktion ----
Q.q(r'Gegeben ist $f(x) = \dfrac{x^2-1}{x^2-4}$. Bestimme den Definitionsbereich und die Nullstellen.',
    [r'$D = \mathbb{R} \setminus \{-2;\,2\}$, Nullstellen $x = -1$ und $x = 1$',
     r'$D = \mathbb{R} \setminus \{-1;\,1\}$, Nullstellen $x = -2$ und $x = 2$',
     r'$D = \mathbb{R} \setminus \{-2;\,2\}$, Nullstellen $x = -2$ und $x = 2$',
     r'$D = \mathbb{R}$, Nullstellen $x = -1$ und $x = 1$'],
    [r'Nenner null: $x^2 - 4 = 0$ ergibt $x = \pm 2$, also $D = \mathbb{R} \setminus \{-2;\,2\}$.',
     r'Zähler null: $x^2 - 1 = 0$ ergibt $x = \pm 1$; beide liegen in $D$, sind also echte Nullstellen.',
     r'Prüfungsfehler: Zähler und Nenner vertauschen. Der Nenner liefert die Definitionslücken, der Zähler die Nullstellen.'])

Q.q(r'Welche achsenparallelen Asymptoten hat der Graph von $f(x) = \dfrac{x^2-1}{x^2-4}$?',
    [r'$x = -2$, $x = 2$ und $y = 1$', r'$x = -2$, $x = 2$ und $y = 0$', r'nur $y = 1$', r'$x = -1$, $x = 1$ und $y = 1$'],
    [r'An den Polstellen $x = \pm 2$ stehen die senkrechten Asymptoten - der Bruch lässt sich nicht kürzen, also sind es wirklich Polstellen.',
     r'Zählergrad und Nennergrad sind beide $2$, die Leitkoeffizienten beide $1$: waagerechte Asymptote $y = \dfrac{1}{1} = 1$.',
     r'Prüfungsfehler: $y = 0$ ansetzen. Das gilt nur, wenn der Zählergrad kleiner ist als der Nennergrad.'],
    fig=fig_gebrochen(), figcap=r'Graph von $f(x) = \dfrac{x^2-1}{x^2-4}$ mit seinen drei Asymptoten')

Q.q(r'Untersuche $f(x) = \dfrac{x^2-1}{x^2-4}$ auf Symmetrie und bestimme den $y$-Achsenabschnitt.',
    [r'achsensymmetrisch zur $y$-Achse, $S_y(0 \mid 0{,}25)$',
     r'punktsymmetrisch zum Ursprung, $S_y(0 \mid 0{,}25)$',
     r'achsensymmetrisch zur $y$-Achse, $S_y(0 \mid -0{,}25)$',
     r'achsensymmetrisch zur $y$-Achse, $S_y(0 \mid 4)$'],
    [r'$x$ kommt nur in geraden Potenzen vor: $f(-x) = \dfrac{x^2-1}{x^2-4} = f(x)$, also Achsensymmetrie.',
     r'$f(0) = \dfrac{0-1}{0-4} = \dfrac{-1}{-4} = 0{,}25$',
     r'Prüfungsfehler: Minus durch Minus ergibt Plus - der Wert ist positiv.'])

Q.q(r'Für $f(x) = \dfrac{x^2-1}{x^2-4}$ liefert die Quotientenregel $f^{\prime}(x) = \dfrac{-6x}{(x^2-4)^2}$. Bestimme den Extrempunkt.',
    [r'Hochpunkt $H(0 \mid 0{,}25)$', r'Tiefpunkt $T(0 \mid 0{,}25)$', r'Hochpunkt $H(0 \mid -0{,}25)$', r'Extrempunkte bei $x = -2$ und $x = 2$'],
    [r'$f^{\prime}(x) = 0$: Der Nenner ist positiv, also muss $-6x = 0$ sein, das heißt $x = 0$.',
     r'Vorzeichen von $f^{\prime}$: $f^{\prime}(-1) = \dfrac{6}{9} > 0$ und $f^{\prime}(1) = -\dfrac{6}{9} < 0$ - Wechsel von Plus nach Minus, also Hochpunkt.',
     r'$f(0) = 0{,}25$, also $H(0 \mid 0{,}25)$.',
     r'Prüfungsfehler: $x = \pm 2$ als Extremstellen angeben - dort ist $f$ gar nicht definiert.'])

Q.q(r'Wie verläuft der Graph von $f(x) = \dfrac{x^2-1}{x^2-4}$ zwischen den beiden Polstellen?',
    [r'Er kommt von $-\infty$, steigt bis zum Hochpunkt $H(0 \mid 0{,}25)$ und fällt wieder nach $-\infty$.',
     r'Er kommt von $+\infty$, fällt bis zum Tiefpunkt und steigt wieder nach $+\infty$.',
     r'Er verläuft ganz oberhalb der Asymptote $y = 1$.',
     r'Er ist auf dem ganzen Intervall streng monoton steigend.'],
    [r'Für $x$ knapp unter $2$ ist der Zähler positiv ($\approx 3$) und der Nenner klein und negativ, also $f(x) \to -\infty$.',
     r'Wegen der Achsensymmetrie gilt dasselbe knapp über $-2$.',
     r'Dazwischen liegt der Hochpunkt $H(0 \mid 0{,}25)$ - Probe: $f(1{,}9) \approx -6{,}7$ und $f(-1{,}9) \approx -6{,}7$.'])

# --------------------------------------------- Komplexaufgabe: e-Funktion ----
Q.q(r'Gegeben ist $f(x) = (x+1) \cdot e^{-x}$. Bestimme $f^{\prime}(x)$.',
    [r'$f^{\prime}(x) = -x \cdot e^{-x}$', r'$f^{\prime}(x) = e^{-x}$', r'$f^{\prime}(x) = (x+2) \cdot e^{-x}$', r'$f^{\prime}(x) = -e^{-x}$'],
    [r'Produktregel mit $u = x+1$, $u^{\prime} = 1$, $v = e^{-x}$, $v^{\prime} = -e^{-x}$.',
     r'$f^{\prime}(x) = 1 \cdot e^{-x} + (x+1) \cdot (-e^{-x}) = (1 - x - 1) \cdot e^{-x} = -x \cdot e^{-x}$',
     r'Prüfungsfehler: die innere Ableitung $-1$ vergessen - dann bleibt $(x+2) \cdot e^{-x}$ stehen.'])

Q.q(r'Bestimme den Extrempunkt von $f(x) = (x+1) \cdot e^{-x}$ und seine Art. Es gilt $f^{\prime\prime}(x) = (x-1) \cdot e^{-x}$.',
    [r'Hochpunkt $H(0 \mid 1)$', r'Tiefpunkt $T(0 \mid 1)$', r'Hochpunkt $H(-1 \mid 0)$', r'Hochpunkt $H(0 \mid 0)$'],
    [r'$f^{\prime}(x) = -x \cdot e^{-x} = 0$: $e^{-x}$ ist nie null, also $x = 0$.',
     r'$f(0) = (0+1) \cdot e^{0} = 1$',
     r'$f^{\prime\prime}(0) = (0-1) \cdot 1 = -1 < 0$, also ein Hochpunkt $H(0 \mid 1)$.',
     r'Prüfungsfehler: $x = -1$ ist die Nullstelle von $f$, nicht die Extremstelle.'])

Q.q(r'Wie verhält sich $f(x) = (x+1) \cdot e^{-x}$ für $x \to +\infty$ und für $x \to -\infty$?',
    [r'$f(x) \to 0$ für $x \to +\infty$, $f(x) \to -\infty$ für $x \to -\infty$; waagerechte Asymptote $y = 0$',
     r'$f(x) \to +\infty$ für $x \to +\infty$, $f(x) \to 0$ für $x \to -\infty$',
     r'$f(x) \to 0$ auf beiden Seiten; waagerechte Asymptote $y = 0$',
     r'$f(x) \to 1$ für $x \to +\infty$; waagerechte Asymptote $y = 1$'],
    [r'Für $x \to +\infty$ fällt $e^{-x}$ stärker, als $x+1$ wächst: $f(10) = 11 \cdot e^{-10} \approx 0{,}0005$.',
     r'Für $x \to -\infty$ ist $x+1$ stark negativ und $e^{-x}$ riesig: $f(-5) = -4 \cdot e^{5} \approx -594$.',
     r'Die Asymptote $y = 0$ gibt es also nur auf der rechten Seite - das gehört in die Antwort.'])

Q.q(r'Löse die Gleichung $e^{x^2} = e^{4x-3}$ durch Exponentenvergleich.',
    [r'$x = 1$ und $x = 3$', r'$x = 3$', r'$x = -1$ und $x = -3$', r'$x = 0$ und $x = 4$'],
    [r'Gleiche Basis, also dürfen die Exponenten gleichgesetzt werden: $x^2 = 4x - 3$.',
     r'$x^2 - 4x + 3 = 0$; nach Vieta ist die Summe $4$ und das Produkt $3$, also $x = 1$ und $x = 3$.',
     r'Probe für $x = 1$: $e^{1} = e^{4-3} = e^{1}$. Prüfungsfehler: nur eine der beiden Lösungen angeben.'])

Q.q(r'Bestimme den Wendepunkt von $f(x) = (x+1) \cdot e^{-x}$ mit $f^{\prime\prime}(x) = (x-1) \cdot e^{-x}$.',
    [r'$W(1 \mid 2e^{-1}) \approx W(1 \mid 0{,}736)$', r'$W(1 \mid 0)$', r'$W(0 \mid 1)$', r'$W(-1 \mid 0)$'],
    [r'$(x-1) \cdot e^{-x} = 0$ ergibt $x = 1$, denn $e^{-x} \neq 0$.',
     r'Vorzeichenwechsel: $f^{\prime\prime}(0) = -1 < 0$, $f^{\prime\prime}(2) = e^{-2} > 0$ - die Krümmung wechselt wirklich.',
     r'$y$-Wert aus $f$: $f(1) = 2 \cdot e^{-1} \approx 0{,}736$.',
     r'Prüfungsfehler: den $y$-Wert aus $f^{\prime\prime}$ ablesen - er kommt immer aus $f$.'])

# ------------------------------------------------------- Integralrechnung ----
Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 2x^3 - 6x + 5$?',
    [r'$F(x) = \dfrac{1}{2}x^4 - 3x^2 + 5x$', r'$F(x) = \dfrac{1}{2}x^4 - 3x^2$', r'$F(x) = 6x^2 - 6$', r'$F(x) = 2x^4 - 6x^2 + 5x$'],
    [r'Summandenweise: Exponent um $1$ erhöhen und durch den neuen Exponenten teilen.',
     r'$2x^3 \to \dfrac{2}{4}x^4 = \dfrac{1}{2}x^4$, $-6x \to -3x^2$, $5 \to 5x$.',
     r'Probe: $F^{\prime}(x) = 2x^3 - 6x + 5$. Prüfungsfehler: die Konstante $5$ vergessen oder statt zu integrieren abzuleiten ($6x^2-6$).'])

Q.q(r'Berechne $\displaystyle\int_{-1}^{2} (3x^2+2)\,dx$.',
    [r'$15$', r'$9$', r'$12$', r'$6$'],
    [r'Stammfunktion: $F(x) = x^3 + 2x$.',
     r'$F(2) = 8 + 4 = 12$ und $F(-1) = -1 - 2 = -3$.',
     r'$\displaystyle\int_{-1}^{2} (3x^2+2)\,dx = 12 - (-3) = 15$',
     r'Prüfungsfehler: die untere Grenze mit falschem Vorzeichen abziehen - $12 - 3 = 9$ ist der häufigste Klausurfehler.'])

Q.q(r'Welchen Inhalt hat die Fläche, die der Graph von $f(x) = x^2-9$ mit der $x$-Achse einschließt?',
    [r'$A = 36$', r'$A = -36$', r'$A = 18$', r'$A = 0$'],
    [r'Nullstellen als Grenzen: $x^2 - 9 = 0$ ergibt $x = -3$ und $x = 3$.',
     r'Auf $[-3;\,3]$ liegt der Graph unterhalb der $x$-Achse, also $A = \left|\displaystyle\int_{-3}^{3} (x^2-9)\,dx\right|$.',
     r'$F(x) = \dfrac{1}{3}x^3 - 9x$, $F(3) = 9 - 27 = -18$, $F(-3) = -9 + 27 = 18$, also das Integral $-18 - 18 = -36$.',
     r'$A = 36$. Prüfungsfehler: ein negativer Flächeninhalt - der Betrag gehört dazu.'])

Q.q(r'Die Graphen von $f(x) = x^2$ und $g(x) = x+2$ schließen eine Fläche ein. Wie groß ist sie?',
    [r'$A = 4{,}5$', r'$A = 2{,}5$', r'$A = 9$', r'$A = 1{,}5$'],
    [r'Schnittstellen: $x^2 = x + 2$, also $x^2 - x - 2 = 0$ mit $x = -1$ und $x = 2$.',
     r'Auf $[-1;\,2]$ verläuft die Gerade oben: $A = \displaystyle\int_{-1}^{2} \left(x + 2 - x^2\right) dx$.',
     r'$F(x) = \dfrac{1}{2}x^2 + 2x - \dfrac{1}{3}x^3$; $F(2) = 2 + 4 - \dfrac{8}{3} = \dfrac{10}{3}$ und $F(-1) = \dfrac{1}{2} - 2 + \dfrac{1}{3} = -\dfrac{7}{6}$.',
     r'$A = \dfrac{10}{3} + \dfrac{7}{6} = \dfrac{27}{6} = 4{,}5$. Prüfungsfehler: „oben minus unten“ vertauschen - dann kommt $-4{,}5$ heraus.'])

Q.q(r'Berechne $\displaystyle\int_0^1 e^{-2x}\,dx$.',
    [r'$\dfrac{1}{2}\left(1 - e^{-2}\right) \approx 0{,}432$', r'$1 - e^{-2} \approx 0{,}865$', r'$\dfrac{1}{2}\left(e^{-2} - 1\right) \approx -0{,}432$', r'$-2\left(1 - e^{-2}\right) \approx -1{,}73$'],
    [r'Stammfunktion: $F(x) = \dfrac{1}{-2} \cdot e^{-2x} = -\dfrac{1}{2} \cdot e^{-2x}$.',
     r'$F(1) - F(0) = -\dfrac{1}{2}e^{-2} + \dfrac{1}{2} = \dfrac{1}{2}\left(1 - e^{-2}\right) \approx 0{,}432$',
     r'Prüfungsfehler: den Faktor $\dfrac{1}{a}$ weglassen oder mit $a$ multiplizieren statt zu teilen.'])

# ------------------------------------------- Kurvendiskussion ganzrational ----
Q.q(r'Bestimme die Nullstellen von $f(x) = x^3 - 3x + 2$ und ihre Vielfachheit.',
    [r'$x = 1$ (doppelt) und $x = -2$ (einfach)', r'$x = -1$ (doppelt) und $x = 2$ (einfach)', r'$x = 0$, $x = 1$ und $x = -2$', r'$x = 1$, $x = 2$ und $x = 3$'],
    [r'Raten: $f(1) = 1 - 3 + 2 = 0$, also ist $x = 1$ eine Nullstelle.',
     r'Polynomdivision durch $(x-1)$ ergibt $x^2 + x - 2 = (x-1)(x+2)$.',
     r'Zerlegt: $f(x) = (x-1)^2 (x+2)$ - bei $x = 1$ berührt der Graph die Achse, bei $x = -2$ schneidet er sie.'])

Q.q(r'Bestimme die Extrempunkte von $f(x) = x^3 - 3x + 2$.',
    [r'$H(-1 \mid 4)$ und $T(1 \mid 0)$', r'$T(-1 \mid 4)$ und $H(1 \mid 0)$', r'$H(-1 \mid 0)$ und $T(1 \mid 4)$', r'nur $T(1 \mid 0)$'],
    [r'$f^{\prime}(x) = 3x^2 - 3 = 3(x^2-1) = 0$ ergibt $x = -1$ und $x = 1$.',
     r'$f(-1) = -1 + 3 + 2 = 4$ und $f(1) = 1 - 3 + 2 = 0$.',
     r'$f^{\prime\prime}(x) = 6x$: $f^{\prime\prime}(-1) = -6 < 0$ (Hochpunkt), $f^{\prime\prime}(1) = 6 > 0$ (Tiefpunkt).',
     r'Prüfungsfehler: Hoch- und Tiefpunkt vertauschen - das Vorzeichen von $f^{\prime\prime}$ entscheidet.'],
    fig=fig_ganzrational(), figcap=r'Graph von $f(x) = x^3 - 3x + 2$ mit $H$, $T$ und $W$')

Q.q(r'Bestimme den Wendepunkt von $f(x) = x^3 - 3x + 2$ und beschreibe die Krümmung.',
    [r'$W(0 \mid 2)$; links davon rechtsgekrümmt, rechts davon linksgekrümmt',
     r'$W(0 \mid 2)$; links davon linksgekrümmt, rechts davon rechtsgekrümmt',
     r'$W(0 \mid 0)$; Krümmungswechsel von rechts nach links',
     r'$W(2 \mid 4)$; Krümmungswechsel von links nach rechts'],
    [r'$f^{\prime\prime}(x) = 6x = 0$ ergibt $x = 0$; Vorzeichenwechsel ist sicher, denn $6x$ ist eine Gerade.',
     r'$f(0) = 2$, also $W(0 \mid 2)$.',
     r'$f^{\prime\prime}(-1) = -6 < 0$: rechtsgekrümmt. $f^{\prime\prime}(1) = 6 > 0$: linksgekrümmt.'])

Q.q(r'Für welchen Wert von $a$ hat der Graph von $f(x) = x^3 + a\,x^2 - 9x$ die Wendestelle $x = 1$?',
    [r'$a = -3$', r'$a = 3$', r'$a = -6$', r'$a = 9$'],
    [r'$f^{\prime}(x) = 3x^2 + 2a\,x - 9$ und $f^{\prime\prime}(x) = 6x + 2a$.',
     r'Bedingung $f^{\prime\prime}(1) = 0$: $6 + 2a = 0$, also $a = -3$.',
     r'Probe: Für $a = -3$ ist $f^{\prime\prime}(x) = 6x - 6$, und das ist bei $x = 1$ null mit Vorzeichenwechsel.',
     r'Prüfungsfehler: die Bedingung $f^{\prime}(1) = 0$ benutzen - die gehört zu einer waagerechten Tangente, nicht zu einer Wendestelle.'])

Q.q(r'Der Graph von $f(x) = x^3 - 3x + 2$ und die Gerade $y = 2$ schließen zwei Flächenstücke ein. Wie groß ist die Gesamtfläche?',
    [r'$A = 4{,}5$', r'$A = 0$', r'$A = 2{,}25$', r'$A = 9$'],
    [r'Schnittstellen: $x^3 - 3x + 2 = 2$, also $x^3 - 3x = 0$ und $x(x^2-3) = 0$ mit $x = 0$, $x = \sqrt{3}$ und $x = -\sqrt{3}$.',
     r'Differenzfunktion $d(x) = x^3 - 3x$ mit $D(x) = \dfrac{1}{4}x^4 - \dfrac{3}{2}x^2$.',
     r'$\displaystyle\int_0^{\sqrt{3}} d(x)\,dx = D(\sqrt{3}) - D(0) = \dfrac{9}{4} - \dfrac{9}{2} = -\dfrac{9}{4}$; aus Symmetriegründen ist das linke Stück ebenso groß.',
     r'$A = 2 \cdot \dfrac{9}{4} = 4{,}5$. Prüfungsfehler: beide Integrale addieren statt ihre Beträge - dann kommt $0$ heraus.'])


def check():
    import math
    import sympy as sp
    from fractions import Fraction as F
    x, a = sp.symbols('x a', real=True)
    E = sp.exp
    z = lambda p, q: sp.simplify(p - q) == 0
    # ---- Q1-5: f = (x^2-1)/(x^2-4)
    f = (x**2 - 1) / (x**2 - 4)
    assert sorted(sp.solve(x**2 - 4, x)) == [-2, 2] and sorted(sp.solve(x**2 - 1, x)) == [-1, 1]
    assert sp.cancel(f) == f  # cannot be cancelled, so these are real poles
    assert sp.limit(f, x, sp.oo) == 1 and sp.limit(f, x, -sp.oo) == 1
    assert z(f.subs(x, -x), f) and f.subs(x, 0) == F(1, 4)
    d = sp.diff(f, x)
    assert z(d, -6 * x / (x**2 - 4)**2) and sp.solve(d, x) == [0]
    assert d.subs(x, -1) == F(6, 9) and d.subs(x, 1) == F(-6, 9)
    assert sp.limit(f, x, 2, '-') == -sp.oo and sp.limit(f, x, -2, '+') == -sp.oo
    assert sp.limit(f, x, 2, '+') == sp.oo and sp.limit(f, x, -2, '-') == sp.oo
    assert abs(float(f.subs(x, F(19, 10))) + 6.7) < 0.05 and abs(float(f.subs(x, F(-19, 10))) + 6.7) < 0.05
    assert (x**2 - 1).subs(x, F(19, 10)) > 0
    # ---- Q6-10: g = (x+1) e^-x
    g = (x + 1) * E(-x)
    assert z(sp.diff(g, x), -x * E(-x)) and z(sp.diff(g, x, 2), (x - 1) * E(-x))
    assert z(1 * E(-x) + (x + 1) * E(-x), (x + 2) * E(-x))  # distractor: inner derivative forgotten
    assert sp.solve(sp.diff(g, x), x) == [0] and g.subs(x, 0) == 1
    assert sp.diff(g, x, 2).subs(x, 0) == -1 and sp.solve(g, x) == [-1]
    assert sp.limit(g, x, sp.oo) == 0 and sp.limit(g, x, -sp.oo) == -sp.oo
    assert abs(float(g.subs(x, 10)) - 0.0005) < 0.00005 and abs(float(g.subs(x, -5)) + 594) < 1
    assert sp.solve(sp.Eq(x**2, 4 * x - 3), x) == [1, 3] and 1 + 3 == 4 and 1 * 3 == 3
    assert sp.solve(sp.diff(g, x, 2), x) == [1] and z(g.subs(x, 1), 2 * E(-1))
    assert abs(2 * math.exp(-1) - 0.736) < 0.0005
    assert sp.diff(g, x, 2).subs(x, 0) < 0 and sp.diff(g, x, 2).subs(x, 2) > 0
    # ---- Q11-15: Integralrechnung
    assert z(sp.diff(x**4 / 2 - 3 * x**2 + 5 * x, x), 2 * x**3 - 6 * x + 5)
    assert z(sp.diff(2 * x**3 - 6 * x + 5, x), 6 * x**2 - 6)
    assert sp.integrate(3 * x**2 + 2, (x, -1, 2)) == 15
    Fq = x**3 + 2 * x
    assert Fq.subs(x, 2) == 12 and Fq.subs(x, -1) == -3 and 12 - 3 == 9
    assert sp.integrate(x**2 - 9, (x, -3, 3)) == -36 and abs(-36) == 36
    F13 = x**3 / 3 - 9 * x
    assert F13.subs(x, 3) == -18 and F13.subs(x, -3) == 18
    assert sorted(sp.solve(x**2 - 9, x)) == [-3, 3]
    assert sorted(sp.solve(sp.Eq(x**2, x + 2), x)) == [-1, 2]
    assert sp.integrate(x + 2 - x**2, (x, -1, 2)) == F(9, 2) and F(9, 2) == F(27, 6)
    F14 = x**2 / 2 + 2 * x - x**3 / 3
    assert F14.subs(x, 2) == F(10, 3) and F14.subs(x, -1) == F(-7, 6)
    assert z(sp.integrate(E(-2 * x), (x, 0, 1)), (1 - E(-2)) / 2)
    assert abs(float((1 - math.exp(-2)) / 2) - 0.432) < 0.0005
    assert abs(1 - math.exp(-2) - 0.865) < 0.0005 and abs(-2 * (1 - math.exp(-2)) + 1.73) < 0.005
    assert z(sp.diff(-E(-2 * x) / 2, x), E(-2 * x))
    # ---- Q16-20: k = x^3 - 3x + 2
    k = x**3 - 3 * x + 2
    assert z(sp.factor(k), (x - 1)**2 * (x + 2)) and sorted(set(sp.solve(k, x))) == [-2, 1]
    assert sp.expand((x - 1) * (x + 2)) == x**2 + x - 2
    dk = sp.diff(k, x)
    assert z(dk, 3 * x**2 - 3) and sorted(sp.solve(dk, x)) == [-1, 1]
    assert k.subs(x, -1) == 4 and k.subs(x, 1) == 0
    assert sp.diff(k, x, 2).subs(x, -1) == -6 and sp.diff(k, x, 2).subs(x, 1) == 6
    assert sp.solve(sp.diff(k, x, 2), x) == [0] and k.subs(x, 0) == 2
    # Q19: Parameter a
    p = x**3 + a * x**2 - 9 * x
    assert z(sp.diff(p, x, 2), 6 * x + 2 * a) and sp.solve(sp.diff(p, x, 2).subs(x, 1), a) == [-3]
    assert sp.solve(sp.diff(p, x).subs(x, 1), a) == [3]  # distractor from using f prime = 0
    # Q20: area between k and the line y = 2
    dd = k - 2
    assert z(dd, x**3 - 3 * x) and set(sp.solve(dd, x)) == {0, sp.sqrt(3), -sp.sqrt(3)}
    D20 = x**4 / 4 - sp.Rational(3, 2) * x**2
    assert z(sp.diff(D20, x), dd)
    assert sp.integrate(dd, (x, 0, sp.sqrt(3))) == F(-9, 4)
    assert sp.integrate(dd, (x, -sp.sqrt(3), 0)) == F(9, 4)
    assert sp.integrate(dd, (x, -sp.sqrt(3), sp.sqrt(3))) == 0
    assert 2 * F(9, 4) == F(9, 2) and float(F(9, 2)) == 4.5
    assert D20.subs(x, sp.sqrt(3)) == F(-9, 4) and D20.subs(x, 0) == 0


Q.verify(check)
Q.save()
