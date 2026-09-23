#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 10 / KW 45 (LB 1): Wiederholung fuer Klausur 1 -
Grundlagen und lineare Zusammenhaenge, andere Aufgaben als in den Wochen 2 bis 9.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=10, slug='ka1', thema='Wiederholung für Klausur 1', lb='LB 1',
          blurb='Terme, Potenzen, Prozente, Funktionen, Geraden, Gleichungen und Ungleichungen',
          comment='Blocks: Terme und Potenzen (1-5), Prozente und Formeln (6-9), Funktionen und Geraden (10-15), Gleichungen und Ungleichungen (16-20).')

# --------------------------------------------------- Terme und Potenzen ----
Q.q(r'Vereinfache: $5a - (3a + 2)$.',
    [r'$2a - 2$', r'$2a + 2$', r'$8a + 2$', r'$2a$'],
    [r'Das Minus vor der Klammer dreht beide Vorzeichen um.',
     r'$5a - 3a - 2 = 2a - 2$',
     r'Probe mit $a = 1$: $5 - 5 = 0$ und $2 - 2 = 0$.'])

Q.q(r'Multipliziere aus: $(x - 5)(x + 5)$.',
    [r'$x^2 - 25$', r'$x^2 + 25$', r'$x^2 - 10x - 25$', r'$x^2 - 10x + 25$'],
    [r'Dritte binomische Formel: $(a-b)(a+b) = a^2 - b^2$.',
     r'$x^2 - 25$',
     r'Probe mit $x = 6$: $1 \cdot 11 = 11$ und $36 - 25 = 11$.'])

Q.q(r'Multipliziere aus: $(2a + 3)^2$.',
    [r'$4a^2 + 12a + 9$', r'$4a^2 + 9$', r'$4a^2 + 6a + 9$', r'$2a^2 + 12a + 9$'],
    [r'Erste binomische Formel mit $2a$ und $3$.',
     r'$(2a)^2 + 2 \cdot 2a \cdot 3 + 3^2 = 4a^2 + 12a + 9$',
     r'Probe mit $a = 1$: $25$ und $4 + 12 + 9 = 25$.'])

Q.q(r'Vereinfache: $\dfrac{x^6}{x^2}$ für $x \neq 0$.',
    [r'$x^4$', r'$x^3$', r'$x^8$', r'$x^{12}$'],
    [r'Exponenten subtrahieren: $6 - 2 = 4$.',
     r'$x^4$',
     r'Probe mit $x = 2$: $\dfrac{64}{4} = 16 = 2^4$.'])

Q.q(r'Vereinfache: $\left(2x^3\right)^3$.',
    [r'$8x^9$', r'$6x^9$', r'$8x^6$', r'$2x^9$'],
    [r'Jeder Faktor wird potenziert: $2^3 \cdot \left(x^3\right)^3$.',
     r'$= 8 \cdot x^9$',
     r'Probe mit $x = 1$: $2^3 = 8$.'])

# ----------------------------------------------- Prozente und Formeln ----
Q.q(r'Berechne $35\,\%$ von $240$ €.',
    [r'$84$ €', r'$68$ €', r'$840$ €', r'$96$ €'],
    [r'$0{,}35 \cdot 240$',
     r'$= 84$ €',
     r'Überschlag: $10\,\%$ sind $24$ €, also sind $35\,\%$ etwas mehr als $80$ €.'])

Q.q(r'Ein Wert steigt von $50$ auf $65$. Um wie viel Prozent ist er gestiegen?',
    [r'um $30\,\%$', r'um $15\,\%$', r'um $23{,}1\,\%$', r'um $130\,\%$'],
    [r'Zuwachs: $15$, bezogen auf den Anfangswert $50$.',
     r'$\dfrac{15}{50} = 0{,}3$, also $30\,\%$.',
     r'$23{,}1\,\%$ entstünde beim falschen Bezug auf den Endwert $65$.'])

Q.q(r'Nach $25\,\%$ Rabatt kostet ein Gerät $90$ €. Wie hoch war der Listenpreis?',
    [r'$120$ €', r'$112{,}50$ €', r'$115$ €', r'$135$ €'],
    [r'Der Rabattpreis entspricht dem Faktor $0{,}75$.',
     r'$x \cdot 0{,}75 = 90$, also $x = \dfrac{90}{0{,}75} = 120$ €.',
     r'Probe: $120 \cdot 0{,}75 = 90$ €.'])

Q.q(r'Stelle $U = 2\pi r$ nach $r$ um.',
    [r'$r = \dfrac{U}{2\pi}$', r'$r = \dfrac{2\pi}{U}$', r'$r = U - 2\pi$', r'$r = 2\pi U$'],
    [r'$r$ steht im Produkt mit $2\pi$.',
     r'Also durch $2\pi$ teilen: $r = \dfrac{U}{2\pi}$.',
     r'Einheitenkontrolle: eine Länge geteilt durch eine reine Zahl bleibt eine Länge.'])

# --------------------------------------------- Funktionen und Geraden ----
Q.q(r'Berechne die Nullstelle von $f(x) = -3x + 6$.',
    [r'$x = 2$', r'$x = -2$', r'$x = 6$', r'$x = 3$'],
    [r'$-3x + 6 = 0$',
     r'$-3x = -6$, also $x = 2$.',
     r'Probe: $f(2) = -6 + 6 = 0$.'])

Q.q(r'Welchen Anstieg hat die Gerade durch $A(2|1)$ und $B(5|10)$?',
    [r'$m = 3$', r'$m = \dfrac{1}{3}$', r'$m = 9$', r'$m = -3$'],
    [r'$m = \dfrac{10 - 1}{5 - 2} = \dfrac{9}{3}$',
     r'$m = 3$',
     r'Zähler ist die Änderung von $y$, Nenner die von $x$ — nicht vertauschen.'])

Q.q(r'Wie lautet die Gerade durch $P(0|5)$ mit dem Anstieg $m = -1$?',
    [r'$y = -x + 5$', r'$y = -x - 5$', r'$y = 5x - 1$', r'$y = x + 5$'],
    [r'Der Punkt liegt auf der $y$-Achse, also ist $n = 5$.',
     r'$y = -x + 5$',
     r'Probe: $f(0) = 5$ und $f(5) = 0$.'])

Q.q(r'Liegt der Punkt $Q(4|-6)$ auf der Geraden $y = -2x + 2$?',
    [r'Ja, denn $-2 \cdot 4 + 2 = -6$.', r'Nein, denn $-2 \cdot 4 + 2 = -10$.',
     r'Nein, denn der $y$-Wert ist negativ.', r'Das lässt sich nur zeichnerisch entscheiden.'],
    [r'Punktprobe: die Koordinaten einsetzen.',
     r'$-2 \cdot 4 + 2 = -8 + 2 = -6$',
     r'Beide Seiten stimmen überein, $Q$ liegt auf der Geraden.'])

Q.q(r'Welche Gerade ist parallel zu $y = -4x + 1$?',
    [r'$y = -4x - 7$', r'$y = 4x + 1$', r'$y = -\dfrac{1}{4}x + 1$', r'$y = -x + 4$'],
    [r'Parallele Geraden haben denselben Anstieg.',
     r'Gesucht ist also wieder $m = -4$.',
     r'Nur der Achsenabschnitt darf sich unterscheiden.'])

Q.q(r'Unter welchem Winkel schneidet $y = \dfrac{1}{2}x - 3$ die $x$-Achse?',
    [r'$\approx 26{,}6^\circ$', r'$\approx 63{,}4^\circ$', r'$30^\circ$', r'$\approx 0{,}5^\circ$'],
    [r'$\tan\alpha = m = \dfrac{1}{2}$',
     r'$\alpha = \arctan 0{,}5 \approx 26{,}6^\circ$',
     r'$63{,}4^\circ$ gehört zum Anstieg $2$ — die beiden Winkel ergänzen sich zu $90^\circ$.'])

# ------------------------------------------ Gleichungen und Ungleichungen ----
Q.q(r'Löse: $7x + 2 = 3x + 18$.',
    [r'$x = 4$', r'$x = 5$', r'$x = 2$', r'$x = 20$'],
    [r'$3x$ abziehen: $4x + 2 = 18$.',
     r'$4x = 16$, also $x = 4$.',
     r'Probe: $28 + 2 = 30$ und $12 + 18 = 30$.'])

Q.q(r'Löse: $\dfrac{x - 3}{4} = 2$.',
    [r'$x = 11$', r'$x = 5$', r'$x = 8$', r'$x = -5$'],
    [r'Mit $4$ multiplizieren: $x - 3 = 8$.',
     r'$x = 11$',
     r'Probe: $\dfrac{11 - 3}{4} = 2$.'])

Q.q(r'Löse: $5 - 2x \geq 1$.',
    [r'$x \leq 2$', r'$x \geq 2$', r'$x \leq 3$', r'$x \geq -2$'],
    [r'$-5$: $-2x \geq -4$.',
     r'Durch $-2$ teilen, das Zeichen kippt: $x \leq 2$.',
     r'Probe mit $x = 2$: $1 \geq 1$ stimmt; mit $x = 3$ wäre $-1 \geq 1$ falsch.'])

Q.q(r'Löse: $\dfrac{8}{x - 1} = 2$.',
    [r'$x = 5$', r'$x = 3$', r'$x = 17$', r'$x = 4$'],
    [r'Definitionsbereich: $x \neq 1$.',
     r'Mit $x-1$ multiplizieren: $8 = 2\,(x-1)$, also $x - 1 = 4$.',
     r'$x = 5$. Probe: $\dfrac{8}{4} = 2$.'])

Q.q(r'Ein Handwerker berechnet $45$ € Anfahrt und $38$ € je Stunde. Für welche Arbeitszeit bleibt die Rechnung unter $200$ €?',
    [r'für weniger als etwa $4{,}08$ Stunden', r'für weniger als $5$ Stunden',
     r'für weniger als etwa $5{,}26$ Stunden', r'für weniger als $3$ Stunden'],
    [r'Ungleichung: $38t + 45 < 200$.',
     r'$38t < 155$, also $t < \dfrac{155}{38} \approx 4{,}08$.',
     r'Bei $4$ Stunden sind es $197$ €, bei $5$ Stunden schon $235$ €.'])


def check():
    from fractions import Fraction as F
    from math import atan, degrees
    import sympy as sp
    x, a = sp.symbols('x a')
    xr = sp.Symbol('xr', real=True)
    # Terme und Potenzen
    assert sp.expand(5 * a - (3 * a + 2)) == 2 * a - 2 and 5 - 5 == 0 == 2 - 2
    assert sp.expand((x - 5) * (x + 5)) == x ** 2 - 25 and (6 - 5) * (6 + 5) == 11 == 36 - 25
    assert sp.expand((2 * a + 3) ** 2) == 4 * a ** 2 + 12 * a + 9 and 5 ** 2 == 25 == 4 + 12 + 9
    assert sp.simplify(x ** 6 / x ** 2 - x ** 4) == 0 and F(64, 4) == 16 == 2 ** 4
    assert sp.expand((2 * x ** 3) ** 3) == 8 * x ** 9
    # Prozente und Formeln
    assert F(35, 100) * 240 == 84 and F(10, 100) * 240 == 24
    assert F(65 - 50, 50) == F(3, 10) and abs(float(F(15, 65)) - 0.231) < 0.0005
    assert F(90, 1) / F(75, 100) == 120 and 120 * F(75, 100) == 90
    U, r = sp.symbols('U r')
    assert sp.solve(sp.Eq(U, 2 * sp.pi * r), r) == [U / (2 * sp.pi)]
    # Funktionen und Geraden
    assert sp.solve(-3 * x + 6, x) == [2]
    assert F(10 - 1, 5 - 2) == 3
    assert (-x + 5).subs(x, 0) == 5 and sp.solve(-x + 5, x) == [5]
    assert (-2 * x + 2).subs(x, 4) == -6
    assert (-4 * x + 1).coeff(x) == -4 and (-4 * x - 7).coeff(x) == -4
    assert abs(degrees(atan(0.5)) - 26.6) < 0.05 and abs(degrees(atan(2)) - 63.4) < 0.05
    assert abs(degrees(atan(0.5)) + degrees(atan(2)) - 90) < 1e-9
    # Gleichungen und Ungleichungen
    assert sp.solve(sp.Eq(7 * x + 2, 3 * x + 18), x) == [4] and 7 * 4 + 2 == 30 == 3 * 4 + 18
    assert sp.solve(sp.Eq((x - 3) / 4, 2), x) == [11] and F(11 - 3, 4) == 2
    assert sp.solveset(5 - 2 * xr >= 1, xr, sp.S.Reals) == sp.Interval(-sp.oo, 2)
    assert 5 - 2 * 2 == 1 and 5 - 2 * 3 == -1
    assert sp.solve(sp.Eq(8 / (x - 1), 2), x) == [5] and F(8, 4) == 2
    assert sp.solveset(38 * xr + 45 < 200, xr, sp.S.Reals) == sp.Interval.open(-sp.oo, F(155, 38))
    assert abs(float(F(155, 38)) - 4.08) < 0.005 and 38 * 4 + 45 == 197 and 38 * 5 + 45 == 235


Q.verify(check)
Q.save()
