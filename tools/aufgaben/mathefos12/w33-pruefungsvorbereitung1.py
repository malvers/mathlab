#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 33 (Prüfungsvorbereitung): Prüfungsvorbereitung I -
Analysis und Vektorrechnung im Stil der schriftlichen FHR-Prüfung Mathematik (Sachsen),
gemischt über LB 1 bis LB 4. Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=33, slug='pruefungsvorbereitung1', thema='Prüfungsvorbereitung I', lb='Prüfungsvorbereitung',
          blurb='Analysis und Vektorrechnung im Stil der FHR-Prüfung',
          comment='Blocks: Vektorrechnung (1-5), Kurvendiskussion ganzrational (6-8), Extremalaufgaben (9-11), Integral und Fläche (12-14), gebrochenrationale Funktionen (15-17), e-Funktionen (18-20). GTR ohne CAS.')

# --------------------------------------------------------- Vektorrechnung ----
Q.q(r'Wie liegen die Geraden $g\!: \vec x = ' + vec(1, 0, 2) + r' + s \cdot ' + vec(2, 1, -1) + r'$ und $h\!: \vec x = ' + vec(3, 1, 1) + r' + t \cdot ' + vec(-4, -2, 2) + r'$ zueinander?',
    [r'$g$ und $h$ sind identisch.', r'$g$ und $h$ sind echt parallel.', r'$g$ und $h$ schneiden sich in einem Punkt.', r'$g$ und $h$ sind windschief.'],
    [r'Richtungsvektoren: $' + vec(-4, -2, 2) + r' = -2 \cdot ' + vec(2, 1, -1) + r'$, also parallel.',
     r'Punktprobe: Liegt der Stützpunkt $(3|1|1)$ von $h$ auf $g$? $' + vec(3, 1, 1) + ' - ' + vec(1, 0, 2) + ' = ' + vec(2, 1, -1) + r'$, das ist $1 \cdot$ Richtungsvektor - ja.',
     r'Parallel und ein gemeinsamer Punkt: identisch. Ohne Punktprobe hätte man nur „parallel“ sagen können.'])

Q.q(r'Unter welchem Winkel schneiden sich zwei Geraden mit den Richtungsvektoren $\vec u = ' + vec(1, 2, 2) + r'$ und $\vec v = ' + vec(2, -1, 2) + r'$?',
    [r'$\varphi \approx 63{,}6^\circ$', r'$\varphi \approx 26{,}4^\circ$', r'$\varphi = 90^\circ$', r'$\varphi \approx 116{,}4^\circ$'],
    [r'$\cos\varphi = \dfrac{|\vec u \cdot \vec v|}{|\vec u| \cdot |\vec v|}$ mit $\vec u \cdot \vec v = 2 - 2 + 4 = 4$, $|\vec u| = |\vec v| = 3$',
     r'$\cos\varphi = \dfrac{4}{9} \Rightarrow \varphi = \cos^{-1}\!\left(\dfrac{4}{9}\right) \approx 63{,}6^\circ$',
     r'Der Schnittwinkel liegt immer zwischen $0^\circ$ und $90^\circ$; $116{,}4^\circ$ wäre der Nebenwinkel.'])

Q.q(r'Die Ebene $E$ geht durch $P(1|0|0)$ und wird von $\vec u = ' + vec(1, 1, 0) + r'$ und $\vec v = ' + vec(0, 1, 1) + r'$ aufgespannt. Wie lautet ihre Koordinatengleichung?',
    [r'$E\!: x - y + z = 1$', r'$E\!: x + y + z = 1$', r'$E\!: x - y + z = 0$', r'$E\!: x + y - z = 1$'],
    [r'Normalenvektor mit dem Vektorprodukt: $\vec n = \vec u \times \vec v = ' + vec(r'1 \cdot 1 - 0 \cdot 1', r'0 \cdot 0 - 1 \cdot 1', r'1 \cdot 1 - 1 \cdot 0') + ' = ' + vec(1, -1, 1) + '$',
     r'Ansatz $x - y + z = d$, Punkt $P$ einsetzen: $1 - 0 + 0 = 1$, also $d = 1$.',
     r'Probe: $\vec n \cdot \vec u = 1 - 1 + 0 = 0$ und $\vec n \cdot \vec v = 0 - 1 + 1 = 0$.'])

Q.q(r'Wie weit ist der Punkt $P(3|1|5)$ von der Ebene $E\!: 2x - y + 2z = 3$ entfernt?',
    [r'$d = 4$', r'$d = 12$', r'$d = \dfrac{4}{3}$', r'$d = 5$'],
    [r'Lotgerade durch $P$ in Richtung $\vec n = ' + vec(2, -1, 2) + r'$: $\vec x = ' + vec(3, 1, 5) + r' + t \cdot ' + vec(2, -1, 2) + '$',
     r'In $E$ einsetzen: $2(3 + 2t) - (1 - t) + 2(5 + 2t) = 3 \Rightarrow 15 + 9t = 3 \Rightarrow t = -\dfrac{4}{3}$',
     r'Abstand $= |t| \cdot |\vec n| = \dfrac{4}{3} \cdot 3 = 4$. Lotfußpunkt: $F\!\left(\dfrac{1}{3}\middle|\dfrac{7}{3}\middle|\dfrac{7}{3}\right)$. $12$ ist nur der Zähler $|2 \cdot 3 - 1 + 2 \cdot 5 - 3|$ ohne Division durch $|\vec n|$.'])

Q.q(r'Berechne den Flächeninhalt des Dreiecks $ABC$ mit $A(1|0|0)$, $B(0|2|0)$ und $C(0|0|2)$.',
    [r'$A_\triangle = \sqrt{6} \approx 2{,}45$', r'$A_\triangle = 2\sqrt{6} \approx 4{,}90$', r'$A_\triangle = 12$', r'$A_\triangle = 4$'],
    [r'$\overrightarrow{AB} = ' + vec(-1, 2, 0) + r'$, $\overrightarrow{AC} = ' + vec(-1, 0, 2) + r'$, Vektorprodukt: $\overrightarrow{AB} \times \overrightarrow{AC} = ' + vec(4, 2, 2) + '$',
     r'$|\overrightarrow{AB} \times \overrightarrow{AC}| = \sqrt{16 + 4 + 4} = \sqrt{24} = 2\sqrt{6}$ ist die Parallelogrammfläche.',
     r'Dreieck: die Hälfte, $A_\triangle = \sqrt{6} \approx 2{,}45$.'])

# ------------------------------------------- Kurvendiskussion ganzrational ----
Q.q(r'Bestimme die Extrempunkte des Graphen von $f(x) = x^3 - 3x^2$.',
    [r'$H(0|0)$ und $T(2|-4)$', r'$T(0|0)$ und $H(2|-4)$', r'$H(0|0)$ und $T(2|4)$', r'nur $W(1|-2)$'],
    [r'$f^{\prime}(x) = 3x^2 - 6x = 3x(x - 2) = 0 \Rightarrow x = 0$ oder $x = 2$',
     r'$f^{\prime\prime}(x) = 6x - 6$: $f^{\prime\prime}(0) = -6 < 0$ (Hochpunkt), $f^{\prime\prime}(2) = 6 > 0$ (Tiefpunkt)',
     r'$f(0) = 0$, $f(2) = 8 - 12 = -4$, also $H(0|0)$ und $T(2|-4)$.'])

Q.q(r'Wie lautet die Gleichung der Wendetangente an den Graphen von $f(x) = x^3 - 3x^2$?',
    [r'$y = -3x + 1$', r'$y = -3x - 2$', r'$y = 3x - 5$', r'$y = -2$'],
    [r'$f^{\prime\prime}(x) = 6x - 6 = 0 \Rightarrow x_W = 1$, $f(1) = -2$, $f^{\prime\prime\prime}(x) = 6 \ne 0$: Wendepunkt $W(1|-2)$',
     r'Anstieg der Tangente: $m = f^{\prime}(1) = 3 - 6 = -3$',
     r'$y = -3(x - 1) - 2 = -3x + 1$. Falle: $-2$ ist der Funktionswert, nicht der $y$-Achsenabschnitt.'])

Q.q(r'Der Graph einer ganzrationalen Funktion 3. Grades ist punktsymmetrisch zum Ursprung und hat den Hochpunkt $H(1|2)$. Wie lautet die Funktionsgleichung?',
    [r'$f(x) = -x^3 + 3x$', r'$f(x) = x^3 - 3x$', r'$f(x) = -x^3 + 3x^2$', r'$f(x) = x^3 + x$'],
    [r'Punktsymmetrie: nur ungerade Potenzen, Ansatz $f(x) = ax^3 + bx$ mit $f^{\prime}(x) = 3ax^2 + b$.',
     r'Bedingungen: $f(1) = a + b = 2$ und $f^{\prime}(1) = 3a + b = 0 \Rightarrow 2a = -2 \Rightarrow a = -1$, $b = 3$',
     r'Probe: $f^{\prime\prime}(1) = -6 < 0$, also wirklich ein Hochpunkt. $x^3 - 3x$ hätte dort einen Tiefpunkt.'])

# ------------------------------------------------------- Extremalaufgaben ----
Q.q(r'Ein rechteckiges Beet soll mit $40\,\mathrm{m}$ Zaun eingefasst werden. Welche Zielfunktion beschreibt den Flächeninhalt in Abhängigkeit von der Seitenlänge $x$?',
    [r'$A(x) = x \cdot (20 - x)$', r'$A(x) = x \cdot (40 - x)$', r'$A(x) = x \cdot (40 - 2x)$', r'$A(x) = 2x + 2(20 - x)$'],
    [r'Nebenbedingung Umfang: $2x + 2y = 40 \Rightarrow y = 20 - x$',
     r'Hauptbedingung Fläche: $A = x \cdot y = x \cdot (20 - x)$ mit $0 < x < 20$',
     r'$40 - x$ vergisst die Halbierung, $2x + 2(20 - x)$ ist der Umfang (konstant $40$).'])

Q.q(r'An einer Mauer soll mit $60\,\mathrm{m}$ Zaun ein rechteckiges Gehege abgegrenzt werden - die Mauer bildet eine Seite. Welche Maße liefern die größte Fläche?',
    [r'$15\,\mathrm{m} \times 30\,\mathrm{m}$, $A = 450\,\mathrm{m^2}$', r'$15\,\mathrm{m} \times 15\,\mathrm{m}$, $A = 225\,\mathrm{m^2}$', r'$20\,\mathrm{m} \times 20\,\mathrm{m}$, $A = 400\,\mathrm{m^2}$', r'$30\,\mathrm{m} \times 30\,\mathrm{m}$, $A = 900\,\mathrm{m^2}$'],
    [r'Zaun für drei Seiten: $2x + y = 60 \Rightarrow y = 60 - 2x$; $A(x) = x(60 - 2x) = 60x - 2x^2$',
     r'$A^{\prime}(x) = 60 - 4x = 0 \Rightarrow x = 15$; $A^{\prime\prime}(x) = -4 < 0$: Maximum',
     r'$y = 60 - 30 = 30$, $A = 15 \cdot 30 = 450\,\mathrm{m^2}$. Das Quadrat ist hier nicht optimal.'])

Q.q(r'Eine oben offene Schachtel mit quadratischer Grundfläche (Seite $x$) soll $500\,\mathrm{cm^3}$ fassen und möglichst wenig Material verbrauchen. Welche Maße sind optimal?',
    [r'$x = 10\,\mathrm{cm}$, $h = 5\,\mathrm{cm}$', r'$x = h \approx 7{,}94\,\mathrm{cm}$', r'$x = 5\,\mathrm{cm}$, $h = 20\,\mathrm{cm}$', r'$x = 20\,\mathrm{cm}$, $h = 1{,}25\,\mathrm{cm}$'],
    [r'Nebenbedingung: $x^2 h = 500 \Rightarrow h = \dfrac{500}{x^2}$; Oberfläche ohne Deckel: $O = x^2 + 4xh = x^2 + \dfrac{2000}{x}$',
     r'$O^{\prime}(x) = 2x - \dfrac{2000}{x^2} = 0 \Rightarrow x^3 = 1000 \Rightarrow x = 10$; $O^{\prime\prime}(x) = 2 + \dfrac{4000}{x^3} > 0$: Minimum',
     r'$h = \dfrac{500}{100} = 5\,\mathrm{cm}$, $O = 100 + 200 = 300\,\mathrm{cm^2}$. Der Würfel wäre nur bei geschlossener Schachtel optimal.'])

# ------------------------------------------------------ Integral und Fläche ----
Q.q(r'Berechne $\int_{-1}^{2} (3x^2 - 2x)\,dx$.',
    [r'$6$', r'$2$', r'$4$', r'$12$'],
    [r'Stammfunktion: $F(x) = x^3 - x^2$',
     r'$F(2) - F(-1) = (8 - 4) - (-1 - 1) = 4 + 2 = 6$',
     r'Falle: $F(-1) = (-1)^3 - (-1)^2 = -2$, nicht $0$ und nicht $+2$.'])

Q.q(r'Der Graph von $f(x) = x^2 - 4x + 3$ schließt mit der $x$-Achse zwischen seinen Nullstellen eine Fläche ein. Wie groß ist sie?',
    [r'$A = \dfrac{4}{3}$', r'$A = -\dfrac{4}{3}$', r'$A = \dfrac{2}{3}$', r'$A = \dfrac{8}{3}$'],
    [r'Nullstellen: $x^2 - 4x + 3 = (x - 1)(x - 3) = 0 \Rightarrow x = 1$, $x = 3$; dazwischen ist $f < 0$.',
     r'$\int_1^3 (x^2 - 4x + 3)\,dx = \left[\dfrac{x^3}{3} - 2x^2 + 3x\right]_1^3 = 0 - \dfrac{4}{3} = -\dfrac{4}{3}$',
     r'Flächeninhalt ist der Betrag: $A = \dfrac{4}{3}$. Ein negativer Flächeninhalt ist nie richtig.'])

Q.q(r'Die Graphen von $f(x) = -x^2 + 4$ und $g(x) = x + 2$ begrenzen eine Fläche. Wie groß ist sie?',
    [r'$A = 4{,}5$', r'$A = 9$', r'$A = 2{,}25$', r'$A = 3$'],
    [r'Schnittstellen: $-x^2 + 4 = x + 2 \Rightarrow x^2 + x - 2 = 0 \Rightarrow x = -2$ oder $x = 1$; dazwischen liegt $f$ oben.',
     r'$A = \int_{-2}^{1} (-x^2 - x + 2)\,dx = \left[-\dfrac{x^3}{3} - \dfrac{x^2}{2} + 2x\right]_{-2}^{1} = \dfrac{7}{6} - \left(-\dfrac{10}{3}\right) = \dfrac{27}{6} = 4{,}5$',
     r'Kontrolle mit dem GTR (numerisches Integral): $4{,}5$.'])

# ---------------------------------------------- gebrochenrationale Funktionen ----
Q.q(r'Welche waagerechte Asymptote hat der Graph von $f(x) = \dfrac{3x^2 - 3}{x^2 - 4}$?',
    [r'$y = 3$', r'$y = 0$', r'$y = \dfrac{3}{4}$', r'$y = -\dfrac{3}{4}$'],
    [r'Zählergrad $=$ Nennergrad $= 2$: Für $x \to \pm\infty$ strebt $f(x)$ gegen den Quotienten der Leitkoeffizienten.',
     r'$y = \dfrac{3}{1} = 3$. Polstellen bei $x = \pm 2$, Nullstellen bei $x = \pm 1$.',
     r'$\dfrac{3}{4}$ ist $f(0)$, der $y$-Achsenabschnitt - kein Grenzwert.'])

Q.q(r'Welchen Tiefpunkt hat der Graph von $f(x) = \dfrac{x^2 + 4}{x}$?',
    [r'$T(2|4)$', r'$T(-2|-4)$', r'$T(2|0)$', r'$T(4|5)$'],
    [r'Quotientenregel: $f^{\prime}(x) = \dfrac{2x \cdot x - (x^2 + 4) \cdot 1}{x^2} = \dfrac{x^2 - 4}{x^2} = 0 \Rightarrow x = \pm 2$',
     r'$f^{\prime\prime}(x) = \dfrac{8}{x^3}$: $f^{\prime\prime}(2) = 1 > 0$ Tiefpunkt, $f^{\prime\prime}(-2) < 0$ Hochpunkt',
     r'$f(2) = \dfrac{8}{2} = 4$, also $T(2|4)$; $H(-2|-4)$ ist der Hochpunkt - nicht verwechseln.'])

Q.q(r'Berechne $\int_1^2 \dfrac{1}{x^2}\,dx$.',
    [r'$\dfrac{1}{2}$', r'$-\dfrac{1}{2}$', r'$\ln 2 \approx 0{,}69$', r'$\dfrac{3}{2}$'],
    [r'$\dfrac{1}{x^2} = x^{-2}$, Stammfunktion nach dem Grundintegral: $\dfrac{x^{-1}}{-1} = -\dfrac{1}{x}$',
     r'$\left[-\dfrac{1}{x}\right]_1^2 = -\dfrac{1}{2} - (-1) = \dfrac{1}{2}$',
     r'Kontrolle mit dem GTR: $0{,}5$. $\ln 2$ wäre $\int_1^2 \dfrac{1}{x}\,dx$.'])

# ---------------------------------------------------------- e-Funktionen ----
Q.q(r'Bestimme die Ableitung von $f(x) = (2x - 1) \cdot e^{x}$.',
    [r'$f^{\prime}(x) = (2x + 1)\,e^{x}$', r'$f^{\prime}(x) = 2e^{x}$', r'$f^{\prime}(x) = (2x - 1)\,e^{x}$', r'$f^{\prime}(x) = (2x - 3)\,e^{x}$'],
    [r'Produktregel: $u = 2x - 1$, $u^{\prime} = 2$, $v = e^{x}$, $v^{\prime} = e^{x}$',
     r'$f^{\prime}(x) = 2e^{x} + (2x - 1)e^{x} = (2x + 1)\,e^{x}$',
     r'$e^{x}$ ausklammern und die Klammern zusammenfassen - $2e^{x}$ allein vergisst den zweiten Summanden.'])

Q.q(r'Welchen Extrempunkt hat der Graph von $f(x) = (2x - 1) \cdot e^{x}$?',
    [r'Tiefpunkt $T(-0{,}5|-2e^{-0{,}5})$, $-2e^{-0{,}5} \approx -1{,}21$', r'Hochpunkt $H(-0{,}5|-2e^{-0{,}5})$', r'Tiefpunkt $T(0{,}5|0)$', r'Tiefpunkt $T(-0{,}5|0)$'],
    [r'$f^{\prime}(x) = (2x + 1)\,e^{x} = 0 \Rightarrow x = -0{,}5$ (da $e^{x} > 0$)',
     r'$f^{\prime\prime}(x) = (2x + 3)\,e^{x}$, $f^{\prime\prime}(-0{,}5) = 2e^{-0{,}5} > 0$: Tiefpunkt',
     r'$f(-0{,}5) = -2 \cdot e^{-0{,}5} \approx -1{,}21$. $x = 0{,}5$ ist die Nullstelle, nicht die Extremstelle.'])

Q.q(r'Ein Medikament wird mit der Rate $r(t) = 6e^{-0{,}5t}$ (in mg pro Stunde, $t$ in Stunden) abgebaut. Wie viel mg werden in den ersten $4$ Stunden abgebaut?',
    [r'$12\,(1 - e^{-2}) \approx 10{,}38\,\mathrm{mg}$', r'$12e^{-2} \approx 1{,}62\,\mathrm{mg}$', r'$24\,\mathrm{mg}$', r'$6\,(1 - e^{-2}) \approx 5{,}19\,\mathrm{mg}$'],
    [r'Abgebaute Menge $= \int_0^4 6e^{-0{,}5t}\,dt$ mit Stammfunktion $\dfrac{6}{-0{,}5}\,e^{-0{,}5t} = -12e^{-0{,}5t}$',
     r'$\left[-12e^{-0{,}5t}\right]_0^4 = -12e^{-2} - (-12) = 12\,(1 - e^{-2}) \approx 10{,}38$',
     r'$24$ wäre $6 \cdot 4$ (konstante Rate); $5{,}19$ entsteht, wenn man nicht durch $-0{,}5$ teilt.'])


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x, t = sp.symbols('x t')
    M = sp.Matrix
    # 1 identische Geraden
    assert M([-4, -2, 2]) == -2 * M([2, 1, -1]) and M([3, 1, 1]) - M([1, 0, 2]) == M([2, 1, -1])
    # 2 Schnittwinkel
    u, v = M([1, 2, 2]), M([2, -1, 2])
    assert u.dot(v) == 4 and u.norm() == 3 and v.norm() == 3
    phi = math.degrees(math.acos(4 / 9))
    assert abs(phi - 63.6) < 0.05 and abs(180 - phi - 116.4) < 0.05 and abs(90 - phi - 26.4) < 0.05
    # 3 Koordinatengleichung
    n = M([1, 1, 0]).cross(M([0, 1, 1]))
    assert n == M([1, -1, 1]) and n.dot(M([1, 0, 0])) == 1 and n.dot(M([1, 1, 0])) == 0 and n.dot(M([0, 1, 1])) == 0
    # 4 Abstand Punkt-Ebene
    tt = sp.symbols('tt')
    sol = sp.solve(2 * (3 + 2 * tt) - (1 - tt) + 2 * (5 + 2 * tt) - 3, tt)
    assert sol == [-sp.Rational(4, 3)] and abs(sol[0]) * 3 == 4
    assert abs(2 * 3 - 1 + 2 * 5 - 3) == 12 and F(12, 3) == 4 and abs(2 * 3 - 1 + 2 * 5) / 3 == 5
    Fp = M([3, 1, 5]) + sol[0] * M([2, -1, 2])
    assert Fp == M([sp.Rational(1, 3), sp.Rational(7, 3), sp.Rational(7, 3)]) and 2 * Fp[0] - Fp[1] + 2 * Fp[2] == 3
    # 5 Dreiecksfläche
    c = M([-1, 2, 0]).cross(M([-1, 0, 2]))
    assert c == M([4, 2, 2]) and c.norm() == sp.sqrt(24) and sp.sqrt(24) == 2 * sp.sqrt(6)
    assert abs(6 ** 0.5 - 2.45) < 0.005 and abs(2 * 6 ** 0.5 - 4.90) < 0.005 and (4 + 2 + 2) / 2 == 4
    # 6 Extrempunkte
    f6 = x**3 - 3 * x**2
    assert sorted(sp.solve(sp.diff(f6, x), x)) == [0, 2] and sp.diff(f6, x, 2).subs(x, 0) == -6 and sp.diff(f6, x, 2).subs(x, 2) == 6
    assert f6.subs(x, 2) == -4
    # 7 Wendetangente
    assert sp.solve(sp.diff(f6, x, 2), x) == [1] and f6.subs(x, 1) == -2 and sp.diff(f6, x).subs(x, 1) == -3
    assert sp.expand(-3 * (x - 1) - 2) == -3 * x + 1
    # 8 Funktionsgleichung
    a, b = sp.symbols('a b')
    s8 = sp.solve([a + b - 2, 3 * a + b], [a, b])
    assert s8 == {a: -1, b: 3} and sp.diff(-x**3 + 3 * x, x, 2).subs(x, 1) == -6 and sp.diff(x**3 - 3 * x, x, 2).subs(x, 1) == 6
    # 9 Zielfunktion
    assert sp.expand(x * (20 - x)) == sp.expand(x * ((40 - 2 * x) / 2))
    # 10 Gehege
    A = x * (60 - 2 * x)
    assert sp.solve(sp.diff(A, x), x) == [15] and A.subs(x, 15) == 450 and 60 - 2 * 15 == 30
    assert 15 * 15 == 225 and 20 * 20 == 400 and 30 * 30 == 900 and sp.diff(A, x, 2) == -4
    # 11 Schachtel
    O = x**2 + 2000 / x
    assert sp.solve(sp.diff(O, x), x)[0] == 10 and sp.Rational(500, 100) == 5 and O.subs(x, 10) == 300
    assert sp.diff(O, x, 2).subs(x, 10) > 0 and abs(500 ** (1 / 3) - 7.94) < 0.005
    assert 5 * 5 * 20 == 500 and abs(20 * 20 * 1.25 - 500) < 1e-9
    # 12 Integral
    assert sp.integrate(3 * x**2 - 2 * x, (x, -1, 2)) == 6 and (-1) ** 3 - (-1) ** 2 == -2
    # 13 Fläche zwischen Nullstellen
    assert sorted(sp.solve(x**2 - 4 * x + 3, x)) == [1, 3] and sp.integrate(x**2 - 4 * x + 3, (x, 1, 3)) == -sp.Rational(4, 3)
    # 14 Fläche zwischen zwei Graphen
    assert sorted(sp.solve(-x**2 + 4 - (x + 2), x)) == [-2, 1]
    assert sp.integrate(-x**2 - x + 2, (x, -2, 1)) == sp.Rational(9, 2)
    F14 = -x**3 / 3 - x**2 / 2 + 2 * x
    assert F14.subs(x, 1) == sp.Rational(7, 6) and F14.subs(x, -2) == -sp.Rational(10, 3)
    # 15 Asymptote
    f15 = (3 * x**2 - 3) / (x**2 - 4)
    assert sp.limit(f15, x, sp.oo) == 3 and f15.subs(x, 0) == sp.Rational(3, 4)
    # 16 Tiefpunkt
    f16 = (x**2 + 4) / x
    assert sp.simplify(sp.diff(f16, x) - (x**2 - 4) / x**2) == 0 and sorted(sp.solve(sp.diff(f16, x), x)) == [-2, 2]
    assert sp.simplify(sp.diff(f16, x, 2) - 8 / x**3) == 0 and f16.subs(x, 2) == 4 and f16.subs(x, -2) == -4
    # 17 Integral 1/x^2
    assert sp.integrate(1 / x**2, (x, 1, 2)) == sp.Rational(1, 2) and abs(math.log(2) - 0.69) < 0.005
    # 18 Produktregel
    f18 = (2 * x - 1) * sp.exp(x)
    assert sp.simplify(sp.diff(f18, x) - (2 * x + 1) * sp.exp(x)) == 0
    # 19 Tiefpunkt
    assert sp.solve(sp.diff(f18, x), x) == [-sp.Rational(1, 2)]
    assert sp.simplify(sp.diff(f18, x, 2) - (2 * x + 3) * sp.exp(x)) == 0 and sp.diff(f18, x, 2).subs(x, -sp.Rational(1, 2)) > 0
    assert abs(-2 * math.exp(-0.5) - (-1.21)) < 0.005 and f18.subs(x, sp.Rational(1, 2)) == 0
    # 20 Medikament
    val = sp.integrate(6 * sp.exp(-t / 2), (t, 0, 4))
    assert sp.simplify(val - 12 * (1 - sp.exp(-2))) == 0
    assert abs(12 * (1 - math.exp(-2)) - 10.38) < 0.005 and abs(12 * math.exp(-2) - 1.62) < 0.005
    assert 6 * 4 == 24 and abs(6 * (1 - math.exp(-2)) - 5.19) < 0.005


Q.verify(check)
Q.save()
