#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 21 (LB 2): Wiederholung der Differenzialrechnung
fuer Klausur 2 - quer durch LB 2, andere Funktionen als in den Wochen 11 bis 20.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12

Q = fos12(nr=21, slug='ka2', thema='Wiederholung Differenzialrechnung', lb='LB 2',
          blurb='Grenzwert, Ableitungsregeln, Tangente, Kurvendiskussion, Scharen, Extremalaufgaben',
          comment='Blocks: Grenzwert und Differenzenquotient (1-4), Ableitungsregeln (5-9), Tangente und Normale (10-12), Kurvendiskussion (13-16), Schar und Steckbrief (17-18), Extremalaufgaben (19-20). Klausurvorbereitung, GTR ohne CAS.')

# ------------------------------------- Grenzwert und Differenzenquotient ----
Q.q(r'Wie verhält sich $f(x) = 2x^4 - 3x$ für $x \to \pm\infty$?',
    [r'beide Male $f(x) \to +\infty$', r'beide Male $f(x) \to -\infty$',
     r'$f(x) \to +\infty$ bzw. $f(x) \to -\infty$', r'$f(x) \to 2$'],
    [r'Entscheidend ist der Term höchsten Grades $2x^4$.',
     r'Gerader Grad und positiver Leitkoeffizient: der Graph steigt auf beiden Seiten nach oben.',
     r'Probe: $f(10) = 20000 - 30 = 19970$ und $f(-10) = 20000 + 30 = 20030$.'])

Q.q(r'Berechne die mittlere Änderungsrate von $f(x) = x^2$ im Intervall von $x = 1$ bis $x = 3$.',
    [r'$4$', r'$8$', r'$2$', r'$6$'],
    [r'Differenzenquotient: $\dfrac{f(3) - f(1)}{3 - 1}$',
     r'$= \dfrac{9 - 1}{2} = \dfrac{8}{2} = 4$',
     r'$8$ wäre nur der Zähler — durch die Intervalllänge darf man nicht vergessen zu teilen.'])

Q.q(r'Bestimme mit der h-Methode die Ableitung von $f(x) = x^2$ an der Stelle $x_0 = 2$.',
    [r'$f^{\prime}(2) = 4$', r'$f^{\prime}(2) = 2$', r'$f^{\prime}(2) = 4 + h$', r'$f^{\prime}(2) = 0$'],
    [r'$\dfrac{f(2+h) - f(2)}{h} = \dfrac{(2+h)^2 - 4}{h} = \dfrac{4h + h^2}{h}$',
     r'Kürzen: $= 4 + h$',
     r'Grenzübergang $h \to 0$ liefert $f^{\prime}(2) = 4$. Das $h$ muss am Ende verschwinden.'])

Q.q(r'Ein Fahrzeug legt nach $t$ Sekunden den Weg $s(t) = 4t^2$ (in Metern) zurück. Wie groß ist die Momentangeschwindigkeit nach $3$ Sekunden?',
    [r'$24\,\mathrm{m/s}$', r'$12\,\mathrm{m/s}$', r'$36\,\mathrm{m/s}$', r'$8\,\mathrm{m/s}$'],
    [r'Die Momentangeschwindigkeit ist die Ableitung des Weges: $s^{\prime}(t) = 8t$.',
     r'$s^{\prime}(3) = 24\,\mathrm{m/s}$',
     r'$12\,\mathrm{m/s}$ wäre die Durchschnittsgeschwindigkeit über die ersten $3$ Sekunden: $\dfrac{36\,\mathrm{m}}{3\,\mathrm{s}}$.'])

# ------------------------------------------------------ Ableitungsregeln ----
Q.q(r'Leite ab: $f(x) = 3x^4 - 2x^3 + 5x - 7$.',
    [r'$f^{\prime}(x) = 12x^3 - 6x^2 + 5$', r'$f^{\prime}(x) = 12x^3 - 6x^2 + 5x$',
     r'$f^{\prime}(x) = 12x^3 - 6x^2 + 5 - 7$', r'$f^{\prime}(x) = 3x^3 - 2x^2 + 5$'],
    [r'Summen- und Faktorregel, dann gliedweise die Potenzregel.',
     r'$3x^4 \to 12x^3$, $-2x^3 \to -6x^2$, $5x \to 5$, $-7 \to 0$.',
     r'Die Konstante $-7$ fällt weg: eine waagerechte Gerade hat überall den Anstieg $0$.'])

Q.q(r'Leite ab: $f(x) = \sqrt{x}$ für $x > 0$.',
    [r'$f^{\prime}(x) = \dfrac{1}{2\sqrt{x}}$', r'$f^{\prime}(x) = \dfrac{1}{2}\sqrt{x}$',
     r'$f^{\prime}(x) = 2\sqrt{x}$', r'$f^{\prime}(x) = \dfrac{1}{\sqrt{x}}$'],
    [r'Als Potenz schreiben: $f(x) = x^{1/2}$.',
     r'Potenzregel: $f^{\prime}(x) = \tfrac{1}{2}\,x^{-1/2}$',
     r'Zurückschreiben: $f^{\prime}(x) = \dfrac{1}{2\sqrt{x}}$.'])

Q.q(r'Leite ab: $f(x) = \dfrac{1}{x^2}$ für $x \neq 0$.',
    [r'$f^{\prime}(x) = -\dfrac{2}{x^3}$', r'$f^{\prime}(x) = \dfrac{2}{x^3}$',
     r'$f^{\prime}(x) = -\dfrac{1}{2x}$', r'$f^{\prime}(x) = -\dfrac{2}{x}$'],
    [r'Als Potenz: $f(x) = x^{-2}$.',
     r'Potenzregel: $f^{\prime}(x) = -2x^{-3}$',
     r'Also $f^{\prime}(x) = -\dfrac{2}{x^3}$. Der Exponent wird um $1$ kleiner, aus $-2$ wird $-3$.'])

Q.q(r'Leite ab: $f(x) = (2x - 5)^4$.',
    [r'$f^{\prime}(x) = 8(2x-5)^3$', r'$f^{\prime}(x) = 4(2x-5)^3$',
     r'$f^{\prime}(x) = 8(2x-5)^4$', r'$f^{\prime}(x) = 2(2x-5)^3$'],
    [r'Kettenregel: äußere mal innere Ableitung.',
     r'Äußere: $4(2x-5)^3$, innere: $2$.',
     r'$f^{\prime}(x) = 4(2x-5)^3 \cdot 2 = 8(2x-5)^3$. Wer die innere Ableitung vergisst, landet bei $4(2x-5)^3$.'])

Q.q(r'Bestimme die zweite Ableitung von $f(x) = x^5 - 2x^3$.',
    [r'$f^{\prime\prime}(x) = 20x^3 - 12x$', r'$f^{\prime\prime}(x) = 5x^4 - 6x^2$',
     r'$f^{\prime\prime}(x) = 20x^3 - 6x$', r'$f^{\prime\prime}(x) = 60x^2 - 12$'],
    [r'Erste Ableitung: $f^{\prime}(x) = 5x^4 - 6x^2$',
     r'Noch einmal ableiten: $f^{\prime\prime}(x) = 20x^3 - 12x$',
     r'$60x^2 - 12$ wäre schon die dritte Ableitung.'])

# ------------------------------------------------------ Tangente, Normale ----
Q.q(r'Wie lautet die Tangente an $f(x) = x^2$ im Punkt $P(3|9)$?',
    [r'$y = 6x - 9$', r'$y = 6x + 9$', r'$y = 9x - 18$', r'$y = 3x$'],
    [r'Anstieg: $f^{\prime}(x) = 2x$, also $m = f^{\prime}(3) = 6$.',
     r'Punktprobe in $y = 6x + n$: $9 = 18 + n$, also $n = -9$.',
     r'Tangente: $y = 6x - 9$. Probe: bei $x = 3$ ergibt sich $9$.'])

Q.q(r'Wie lautet der Anstieg der Normalen an $f(x) = x^2$ im Punkt $P(3|9)$?',
    [r'$-\dfrac{1}{6}$', r'$6$', r'$-6$', r'$\dfrac{1}{6}$'],
    [r'Die Normale steht senkrecht auf der Tangente.',
     r'Für senkrechte Geraden gilt $m_1 \cdot m_2 = -1$.',
     r'Aus $m_{\text{Tangente}} = 6$ folgt $m_{\text{Normale}} = -\dfrac{1}{6}$.'])

Q.q(r'Unter welchem Winkel schneidet der Graph von $f(x) = x^2 - 4$ die $x$-Achse an der Stelle $x = 2$?',
    [r'$\approx 76{,}0^\circ$', r'$\approx 14{,}0^\circ$', r'$45^\circ$', r'$\approx 63{,}4^\circ$'],
    [r'Der Schnittwinkel folgt aus dem Anstieg: $\tan\alpha = f^{\prime}(2)$.',
     r'$f^{\prime}(x) = 2x$, also $f^{\prime}(2) = 4$ und $\tan\alpha = 4$.',
     r'$\alpha = \arctan 4 \approx 76{,}0^\circ$. $14{,}0^\circ$ wäre der Winkel zur $y$-Achse.'])

# ------------------------------------------------------ Kurvendiskussion ----
Q.q(r'Bestimme die Extrempunkte von $f(x) = x^3 - 3x^2$.',
    [r'Hochpunkt $H(0|0)$ und Tiefpunkt $T(2|-4)$', r'Tiefpunkt $T(0|0)$ und Hochpunkt $H(2|-4)$',
     r'nur ein Tiefpunkt $T(2|-4)$', r'Hochpunkt $H(0|0)$ und Tiefpunkt $T(3|0)$'],
    [r'$f^{\prime}(x) = 3x^2 - 6x = 3x(x-2)$, also $x = 0$ oder $x = 2$.',
     r'$f^{\prime\prime}(x) = 6x - 6$: $f^{\prime\prime}(0) = -6 < 0$ ergibt einen Hochpunkt, $f^{\prime\prime}(2) = 6 > 0$ einen Tiefpunkt.',
     r'$f(0) = 0$ und $f(2) = 8 - 12 = -4$.'])

Q.q(r'Bestimme den Wendepunkt von $f(x) = x^3 - 3x^2$.',
    [r'$W(1|-2)$', r'$W(1|0)$', r'$W(0|0)$', r'$W(2|-4)$'],
    [r'$f^{\prime\prime}(x) = 6x - 6 = 0$ liefert $x = 1$.',
     r'$f^{\prime\prime\prime}(x) = 6 \neq 0$, es ist also wirklich ein Wendepunkt.',
     r'$f(1) = 1 - 3 = -2$, somit $W(1|-2)$.'])

Q.q(r'Bestimme die Nullstellen von $f(x) = x^4 - 8x^2$.',
    [r'$x_1 = 0$ (doppelt), $x_{2,3} = \pm 2\sqrt{2}$', r'$x_1 = 0$, $x_2 = 8$',
     r'$x_{1,2} = \pm 2\sqrt{2}$', r'$x_1 = 0$ (doppelt), $x_2 = 8$'],
    [r'$x^2$ ausklammern: $f(x) = x^2\,(x^2 - 8)$',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x^2 = 0$ ergibt die doppelte Nullstelle $x = 0$.',
     r'$x^2 = 8$ ergibt $x = \pm\sqrt{8} = \pm 2\sqrt{2} \approx \pm 2{,}83$.'])

Q.q(r'Welche Symmetrie hat der Graph von $f(x) = x^4 - 8x^2$?',
    [r'achsensymmetrisch zur $y$-Achse', r'punktsymmetrisch zum Ursprung',
     r'achsensymmetrisch zur $x$-Achse', r'keine der genannten Symmetrien'],
    [r'Es kommen nur gerade Exponenten vor.',
     r'Also gilt $f(-x) = (-x)^4 - 8(-x)^2 = x^4 - 8x^2 = f(x)$.',
     r'Das ist genau die Bedingung für Achsensymmetrie zur $y$-Achse.'])

# --------------------------------------------------- Schar und Steckbrief ----
Q.q(r'Die Schar $f_a(x) = x^3 - a\,x$ hat für $a > 0$ welche Extremstellen?',
    [r'$x = \pm\sqrt{\dfrac{a}{3}}$', r'$x = \pm\sqrt{3a}$', r'$x = \pm\dfrac{a}{3}$', r'nur $x = 0$'],
    [r'$f_a^{\prime}(x) = 3x^2 - a = 0$',
     r'Umstellen: $x^2 = \dfrac{a}{3}$, also $x = \pm\sqrt{\dfrac{a}{3}}$.',
     r'Probe mit $a = 3$: Extremstellen bei $x = \pm 1$, und $f_3^{\prime}(x) = 3x^2 - 3$ ist dort tatsächlich null.'])

Q.q(r'Gesucht ist eine Parabel $f(x) = ax^2 + bx + c$ mit $f(0) = 1$, $f^{\prime}(0) = 0$ und $f(1) = 3$. Wie lautet sie?',
    [r'$f(x) = 2x^2 + 1$', r'$f(x) = x^2 + 2x + 1$', r'$f(x) = 3x^2 + 1$', r'$f(x) = 2x^2 + x$'],
    [r'$f(0) = c = 1$; wegen $f^{\prime}(x) = 2ax + b$ und $f^{\prime}(0) = b = 0$.',
     r'$f(1) = a + b + c = 3$ wird damit zu $a + 1 = 3$, also $a = 2$.',
     r'$f(x) = 2x^2 + 1$. Probe: $f(1) = 3$ und der Scheitel liegt bei $x = 0$.'])

# --------------------------------------------------------- Extremalaufgabe ----
Q.q(r'Ein Rechteck hat den Umfang $40$ m. Für welche Seitenlängen wird sein Flächeninhalt maximal?',
    [r'$10\,\mathrm{m} \times 10\,\mathrm{m}$ mit $A = 100\,\mathrm{m^2}$',
     r'$15\,\mathrm{m} \times 5\,\mathrm{m}$ mit $A = 75\,\mathrm{m^2}$',
     r'$20\,\mathrm{m} \times 20\,\mathrm{m}$ mit $A = 400\,\mathrm{m^2}$',
     r'$12\,\mathrm{m} \times 8\,\mathrm{m}$ mit $A = 96\,\mathrm{m^2}$'],
    [r'Nebenbedingung: $2a + 2b = 40$, also $b = 20 - a$.',
     r'Zielfunktion: $A(a) = a\,(20 - a) = 20a - a^2$, Ableitung $A^{\prime}(a) = 20 - 2a = 0$ ergibt $a = 10$.',
     r'$A^{\prime\prime}(a) = -2 < 0$, es ist ein Maximum: $10 \times 10$ mit $100\,\mathrm{m^2}$. Unter allen Rechtecken gleichen Umfangs gewinnt das Quadrat.'])

Q.q(r'Der Gewinn eines Betriebes beträgt $G(x) = -x^2 + 40x - 100$ (in €, bei $x$ Stück). Bei welcher Stückzahl ist der Gewinn maximal, und wie hoch ist er?',
    [r'$x = 20$ Stück mit $G = 300$ €', r'$x = 20$ Stück mit $G = 700$ €',
     r'$x = 40$ Stück mit $G = 100$ €', r'$x = 10$ Stück mit $G = 200$ €'],
    [r'$G^{\prime}(x) = -2x + 40 = 0$ liefert $x = 20$.',
     r'$G^{\prime\prime}(x) = -2 < 0$, also ein Maximum.',
     r'$G(20) = -400 + 800 - 100 = 300$ €.'])


def check():
    from fractions import Fraction as F
    from math import sqrt, atan, degrees, isclose
    import sympy as sp
    x, a, h = sp.symbols('x a h')
    d = lambda e, v=x: sp.diff(e, v)
    # Verhalten im Unendlichen
    f1 = 2 * x ** 4 - 3 * x
    assert sp.limit(f1, x, sp.oo) is sp.oo and sp.limit(f1, x, -sp.oo) is sp.oo
    assert f1.subs(x, 10) == 19970 and f1.subs(x, -10) == 20030
    # Differenzenquotient und h-Methode
    assert F(3 ** 2 - 1 ** 2, 3 - 1) == 4 and 3 ** 2 - 1 ** 2 == 8
    assert sp.simplify(((2 + h) ** 2 - 4) / h - (4 + h)) == 0
    assert sp.limit(((2 + h) ** 2 - 4) / h, h, 0) == 4 and d(x ** 2).subs(x, 2) == 4
    s = 4 * x ** 2
    assert d(s) == 8 * x and d(s).subs(x, 3) == 24 and F(int(s.subs(x, 3)), 3) == 12
    # Ableitungsregeln
    assert d(3 * x ** 4 - 2 * x ** 3 + 5 * x - 7) == 12 * x ** 3 - 6 * x ** 2 + 5
    assert sp.simplify(d(sp.sqrt(x)) - 1 / (2 * sp.sqrt(x))) == 0
    assert sp.simplify(d(1 / x ** 2) - (-2 / x ** 3)) == 0
    assert sp.simplify(d((2 * x - 5) ** 4) - 8 * (2 * x - 5) ** 3) == 0
    f5 = x ** 5 - 2 * x ** 3
    assert d(f5) == 5 * x ** 4 - 6 * x ** 2 and sp.expand(d(f5, x).diff(x)) == 20 * x ** 3 - 12 * x
    assert sp.expand(d(d(d(f5)))) == 60 * x ** 2 - 12
    # Tangente und Normale
    assert d(x ** 2).subs(x, 3) == 6 and 9 - 6 * 3 == -9 and 6 * 3 - 9 == 9
    assert F(-1, 6) * 6 == -1
    # Schnittwinkel
    g = x ** 2 - 4
    assert g.subs(x, 2) == 0 and d(g).subs(x, 2) == 4
    assert abs(degrees(atan(4)) - 76.0) < 0.05 and abs(90 - degrees(atan(4)) - 14.0) < 0.05
    # Kurvendiskussion x^3 - 3x^2
    f = x ** 3 - 3 * x ** 2
    assert sp.solve(d(f), x) == [0, 2] and sp.factor(d(f)) == 3 * x * (x - 2)
    assert d(d(f)).subs(x, 0) == -6 and d(d(f)).subs(x, 2) == 6
    assert f.subs(x, 0) == 0 and f.subs(x, 2) == -4
    assert sp.solve(d(d(f)), x) == [1] and d(d(d(f))) == 6 and f.subs(x, 1) == -2
    # Nullstellen und Symmetrie x^4 - 8x^2
    p = x ** 4 - 8 * x ** 2
    assert sp.factor(p) == x ** 2 * (x ** 2 - 8)
    assert sorted(sp.solve(p, x), key=str) == sorted([0, 2 * sp.sqrt(2), -2 * sp.sqrt(2)], key=str)
    assert abs(2 * sqrt(2) - 2.83) < 0.005 and sp.simplify(p.subs(x, -x) - p) == 0
    # Schar und Steckbrief
    fa = x ** 3 - a * x
    assert sp.solve(sp.diff(fa, x), x) == [-sp.sqrt(3) * sp.sqrt(a) / 3, sp.sqrt(3) * sp.sqrt(a) / 3]
    assert sp.simplify(sp.sqrt(sp.Rational(3, 3)) - 1) == 0 and sp.diff(fa.subs(a, 3), x).subs(x, 1) == 0
    A_, B_, C_ = sp.symbols('A_ B_ C_')
    par = A_ * x ** 2 + B_ * x + C_
    sol = sp.solve([par.subs(x, 0) - 1, sp.diff(par, x).subs(x, 0), par.subs(x, 1) - 3], [A_, B_, C_])
    assert sol == {A_: 2, B_: 0, C_: 1}
    # Extremalaufgaben
    A = lambda v: v * (20 - v)
    assert sp.solve(sp.diff(x * (20 - x), x), x) == [10] and A(10) == 100 and A(15) == 75 and A(12) == 96
    assert 2 * 10 + 2 * 10 == 40 and 2 * 15 + 2 * 5 == 40 and 2 * 12 + 2 * 8 == 40
    G = lambda v: -v ** 2 + 40 * v - 100
    assert sp.solve(sp.diff(-x ** 2 + 40 * x - 100, x), x) == [20] and G(20) == 300 and G(40) == -100 and G(10) == 200


Q.verify(check)
Q.save()
