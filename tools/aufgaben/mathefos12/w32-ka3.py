#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 32 (LB 3 + LB 4): Wiederholung für Klausur 3 -
Integralrechnung, gebrochenrationale und e-Funktionen im Prüfungsformat.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec
from svgfig import Plot

Q = fos12(nr=32, slug='ka3', thema='Wiederholung für Klausur 3', lb='LB 3 + LB 4',
          blurb='Integralrechnung, gebrochenrationale und e-Funktionen im Prüfungsformat',
          comment='Blocks: Integralrechnung (1-7), gebrochenrationale Funktionen (8-13), e-Funktionen (14-20). GTR ohne CAS, Distraktoren aus typischen Klausurfehlern.')

# ------------------------------------------------------- Integralrechnung ----
Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 3x^2 - 4x + 1$?',
    [r'$F(x) = x^3 - 2x^2 + x$', r'$F(x) = 6x - 4$', r'$F(x) = x^3 - 4x^2 + x$', r'$F(x) = 3x^3 - 2x^2 + x$'],
    [r'Grundintegral: $\int x^n\,dx = \dfrac{x^{n+1}}{n+1} + C$, gliedweise anwenden.',
     r'$\int 3x^2\,dx = x^3$, $\int 4x\,dx = 2x^2$, $\int 1\,dx = x$, also $F(x) = x^3 - 2x^2 + x$.',
     r'Probe durch Ableiten: $F^{\prime}(x) = 3x^2 - 4x + 1 = f(x)$. $6x - 4$ ist die Ableitung, nicht die Stammfunktion.'])

Q.q(r'Berechne $\int_0^3 (x^2 - 2x + 3)\,dx$.',
    [r'$9$', r'$27$', r'$6$', r'$3$'],
    [r'Stammfunktion: $F(x) = \dfrac{x^3}{3} - x^2 + 3x$',
     r'Hauptsatz: $F(3) - F(0) = (9 - 9 + 9) - 0 = 9$',
     r'Falle: $f(3) = 6$ ist der Funktionswert, nicht das Integral.'])

Q.q(r'Der Graph von $f(x) = 4 - x^2$ schließt mit der $x$-Achse eine Fläche ein. Wie groß ist sie?',
    [r'$\dfrac{32}{3} \approx 10{,}67$', r'$\dfrac{16}{3} \approx 5{,}33$', r'$16$', r'$32$'],
    [r'Nullstellen: $4 - x^2 = 0 \Rightarrow x = -2$ und $x = 2$; dazwischen liegt der Graph über der Achse.',
     r'$\int_{-2}^{2} (4 - x^2)\,dx = \left[4x - \dfrac{x^3}{3}\right]_{-2}^{2} = \left(8 - \dfrac{8}{3}\right) - \left(-8 + \dfrac{8}{3}\right) = \dfrac{32}{3}$',
     r'$\dfrac{16}{3}$ wäre nur die Hälfte (von $0$ bis $2$) - die untere Grenze nicht vergessen.'])

p = Plot((-0.6, 2.4), (-1.5, 3.4), w=460, h=300)
p.axes(xstep=1, ystep=1, xlabel="x", ylabel="y")
p.area(lambda x: x * x - 1, 0, 1)
p.area(lambda x: x * x - 1, 1, 2)
p.curve(lambda x: x * x - 1, -0.6, 2.1)
p.point(1, 0, "1", "below")
p.point(2, 0, "2", "below")
FIG_SIGN = p.svg()

Q.q(r'Wie groß ist die Fläche, die der Graph von $f(x) = x^2 - 1$ im Intervall $[0;\,2]$ mit der $x$-Achse einschließt?',
    [r'$A = 2$', r'$A = \dfrac{2}{3}$', r'$A = \dfrac{4}{3}$', r'$A = 1$'],
    [r'Nullstelle im Intervall: $x = 1$. Links davon liegt der Graph unter, rechts über der Achse - zwei Teilflächen.',
     r'$\int_0^1 (x^2 - 1)\,dx = \left[\dfrac{x^3}{3} - x\right]_0^1 = -\dfrac{2}{3}$, also Teilfläche $\dfrac{2}{3}$; $\int_1^2 (x^2 - 1)\,dx = \left(\dfrac{8}{3} - 2\right) - \left(\dfrac{1}{3} - 1\right) = \dfrac{4}{3}$',
     r'$A = \dfrac{2}{3} + \dfrac{4}{3} = 2$. Wer nur $\int_0^2$ rechnet, bekommt $\dfrac{2}{3}$ - die Flächen heben sich teilweise auf.'],
    fig=FIG_SIGN, figcap=r'Graph von $f(x) = x^2 - 1$ mit den beiden Teilflächen über $[0;\,1]$ und $[1;\,2]$')

Q.q(r'Für welche obere Grenze $b > 1$ gilt $\int_1^b 2x\,dx = 15$?',
    [r'$b = 4$', r'$b = \sqrt{15} \approx 3{,}87$', r'$b = 8$', r'$b = 16$'],
    [r'$\int_1^b 2x\,dx = \left[x^2\right]_1^b = b^2 - 1$',
     r'$b^2 - 1 = 15 \Rightarrow b^2 = 16 \Rightarrow b = 4$ (da $b > 1$).',
     r'$\sqrt{15}$ erhält, wer die untere Grenze $1$ vergisst.'])

Q.q(r'Die Graphen von $f(x) = x^2$ und $g(x) = 2x$ schließen eine Fläche ein. Wie groß ist sie?',
    [r'$\dfrac{4}{3}$', r'$\dfrac{8}{3}$', r'$4$', r'$\dfrac{2}{3}$'],
    [r'Schnittstellen: $x^2 = 2x \Rightarrow x(x - 2) = 0 \Rightarrow x = 0$ oder $x = 2$; dazwischen ist $g$ oben.',
     r'$A = \int_0^2 (2x - x^2)\,dx = \left[x^2 - \dfrac{x^3}{3}\right]_0^2 = 4 - \dfrac{8}{3} = \dfrac{4}{3}$',
     r'Immer „obere minus untere Funktion“; $\dfrac{8}{3}$ ist nur $\int_0^2 x^2\,dx$.'])

Q.q(r'In ein Rückhaltebecken fließt Wasser mit der Rate $v(t) = 20 - 2t$ (in $\mathrm{m^3/h}$, $t$ in Stunden, $0 \le t \le 10$). Wie viel Wasser fließt in den ersten $5$ Stunden zu?',
    [r'$75\,\mathrm{m^3}$', r'$100\,\mathrm{m^3}$', r'$10\,\mathrm{m^3}$', r'$50\,\mathrm{m^3}$'],
    [r'Die Rate ist eine Änderungsrate - die Gesamtmenge ist das Integral: $\int_0^5 (20 - 2t)\,dt$',
     r'$= \left[20t - t^2\right]_0^5 = 100 - 25 = 75$, also $75\,\mathrm{m^3}$.',
     r'$100$ wäre $20 \cdot 5$ (als ob die Rate konstant bliebe), $10$ ist nur $v(5)$.'])

# ---------------------------------------------- gebrochenrationale Funktionen ----
Q.q(r'Welchen Definitionsbereich hat $f(x) = \dfrac{x + 1}{x^2 - 4}$?',
    [r'$D = \mathbb{R} \setminus \{-2;\,2\}$', r'$D = \mathbb{R} \setminus \{2\}$', r'$D = \mathbb{R} \setminus \{-1\}$', r'$D = \mathbb{R} \setminus \{4\}$'],
    [r'Der Nenner darf nicht null werden: $x^2 - 4 = 0 \Rightarrow x = -2$ oder $x = 2$.',
     r'Die Nullstelle des Zählers ($x = -1$) schränkt den Definitionsbereich nicht ein.',
     r'Beide Nennernullstellen sind Polstellen, denn der Zähler ist dort ungleich null.'])

Q.q(r'Gegeben ist $f(x) = \dfrac{x^2 - 1}{x - 1}$. Welche Aussage über die Stelle $x = 1$ ist richtig?',
    [r'Bei $x = 1$ hat $f$ eine hebbare Definitionslücke; der Graph ist die Gerade $y = x + 1$ ohne den Punkt $(1|2)$.',
     r'Bei $x = 1$ hat $f$ eine Polstelle mit senkrechter Asymptote $x = 1$.',
     r'$f$ ist bei $x = 1$ definiert, denn $x^2 - 1$ ist dort ebenfalls $0$.',
     r'Bei $x = 1$ hat der Graph eine Nullstelle.'],
    [r'Zähler faktorisieren: $x^2 - 1 = (x - 1)(x + 1)$, also $f(x) = x + 1$ für $x \ne 1$.',
     r'Zähler und Nenner sind bei $x = 1$ beide null - kürzbar, also Lücke statt Polstelle.',
     r'Trotzdem gilt $1 \notin D$: Der Punkt $(1|2)$ fehlt im Graphen.'])

Q.q(r'Welche Asymptoten hat der Graph von $f(x) = \dfrac{2x + 3}{x - 1}$?',
    [r'senkrecht $x = 1$, waagerecht $y = 2$', r'senkrecht $x = -1$, waagerecht $y = 2$', r'senkrecht $x = 1$, waagerecht $y = 3$', r'senkrecht $x = 1$, waagerecht $y = -3$'],
    [r'Senkrechte Asymptote an der Polstelle: Nenner $x - 1 = 0 \Rightarrow x = 1$.',
     r'Verhalten im Unendlichen: Zähler- und Nennergrad gleich, also $y = \dfrac{2}{1} = 2$ (Quotient der Leitkoeffizienten).',
     r'Kontrolle mit dem GTR: $f(1000) \approx 2{,}005$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = \dfrac{x}{x^2 + 1}$.',
    [r'$f^{\prime}(x) = \dfrac{1 - x^2}{(x^2 + 1)^2}$', r'$f^{\prime}(x) = \dfrac{x^2 - 1}{(x^2 + 1)^2}$', r'$f^{\prime}(x) = \dfrac{1}{2x}$', r'$f^{\prime}(x) = \dfrac{3x^2 + 1}{(x^2 + 1)^2}$'],
    [r'Quotientenregel: $f^{\prime} = \dfrac{u^{\prime} v - u v^{\prime}}{v^2}$ mit $u = x$, $v = x^2 + 1$.',
     r'$f^{\prime}(x) = \dfrac{1 \cdot (x^2 + 1) - x \cdot 2x}{(x^2 + 1)^2} = \dfrac{1 - x^2}{(x^2 + 1)^2}$',
     r'Falle: Die Reihenfolge im Zähler ist „$u^{\prime} v$ minus $u v^{\prime}$“ - vertauscht ergibt das falsche Vorzeichen.'])

Q.q(r'Welchen Hochpunkt hat der Graph von $f(x) = \dfrac{x}{x^2 + 1}$? (Es gilt $f^{\prime}(x) = \dfrac{1 - x^2}{(x^2 + 1)^2}$.)',
    [r'$H(1|0{,}5)$', r'$H(-1|-0{,}5)$', r'$H(0|0)$', r'$H(1|1)$'],
    [r'$f^{\prime}(x) = 0 \Leftrightarrow 1 - x^2 = 0 \Leftrightarrow x = 1$ oder $x = -1$.',
     r'Vorzeichenwechsel: $f^{\prime}(0) = 1 > 0$, $f^{\prime}(2) = -\dfrac{3}{25} < 0$, also bei $x = 1$ von $+$ nach $-$: Hochpunkt.',
     r'$f(1) = \dfrac{1}{2}$, also $H(1|0{,}5)$; bei $x = -1$ liegt der Tiefpunkt $T(-1|-0{,}5)$.'])

Q.q(r'Die Stückkosten eines Produkts betragen $k(x) = 0{,}5x + \dfrac{200}{x}$ (in €, $x$ = Stückzahl, $x > 0$). Bei welcher Stückzahl sind sie minimal?',
    [r'$x = 20$, Stückkosten $20$ €', r'$x = 400$, Stückkosten $200{,}50$ €', r'$x = 10$, Stückkosten $25$ €', r'$x = 40$, Stückkosten $25$ €'],
    [r'$k^{\prime}(x) = 0{,}5 - \dfrac{200}{x^2} = 0 \Rightarrow x^2 = 400 \Rightarrow x = 20$ (da $x > 0$).',
     r'$k^{\prime\prime}(x) = \dfrac{400}{x^3} > 0$: Minimum. $k(20) = 10 + 10 = 20$ €.',
     r'Probe: $k(10) = 25$ und $k(40) = 25$ sind beide größer.'])

# ---------------------------------------------------------- e-Funktionen ----
Q.q(r'Bestimme die Ableitung von $f(x) = e^{2x}$.',
    [r'$f^{\prime}(x) = 2e^{2x}$', r'$f^{\prime}(x) = e^{2x}$', r'$f^{\prime}(x) = 2x\,e^{2x}$', r'$f^{\prime}(x) = 2e^{x}$'],
    [r'Kettenregel: äußere Ableitung $e^{2x}$ mal innere Ableitung $(2x)^{\prime} = 2$.',
     r'$f^{\prime}(x) = 2e^{2x}$',
     r'Bei $e^{ax + b}$ kommt immer nur der Faktor $a$ davor - der Exponent bleibt unverändert.'])

Q.q(r'Löse die Gleichung $3 \cdot e^{2x - 1} - 3 = 0$.',
    [r'$x = \dfrac{1}{2}$', r'$x = 1$', r'$x = 0$', r'$x = \dfrac{1 + \ln 3}{2} \approx 1{,}05$'],
    [r'Umstellen: $3 \cdot e^{2x - 1} = 3 \Rightarrow e^{2x - 1} = 1$',
     r'Exponentenvergleich mit $1 = e^{0}$: $2x - 1 = 0 \Rightarrow x = \dfrac{1}{2}$',
     r'Probe: $3 \cdot e^{0} - 3 = 0$. Wer erst durch $3$ teilt und dann trotzdem $\ln 3$ rechnet, landet bei $1{,}05$.'])

Q.q(r'Der Wert einer Maschine sinkt nach $W(t) = 20\,000 \cdot e^{-0{,}2t}$ (in €, $t$ in Jahren). Nach welcher Zeit ist der Wert auf die Hälfte gesunken?',
    [r'$t = 5 \ln 2 \approx 3{,}47$ Jahre', r'$t = 5$ Jahre', r'$t = 2{,}5$ Jahre', r'$t = 10 \ln 2 \approx 6{,}93$ Jahre'],
    [r'Ansatz: $20\,000 \cdot e^{-0{,}2t} = 10\,000 \Rightarrow e^{-0{,}2t} = 0{,}5$',
     r'Logarithmieren: $-0{,}2t = \ln 0{,}5 = -\ln 2 \Rightarrow t = \dfrac{\ln 2}{0{,}2} = 5 \ln 2 \approx 3{,}47$',
     r'Probe mit dem GTR: $20\,000 \cdot e^{-0{,}2 \cdot 3{,}47} \approx 9\,996$.'])

Q.q(r'Bestimme die Ableitung von $f(x) = x \cdot e^{-x}$.',
    [r'$f^{\prime}(x) = (1 - x)\,e^{-x}$', r'$f^{\prime}(x) = -e^{-x}$', r'$f^{\prime}(x) = (1 + x)\,e^{-x}$', r'$f^{\prime}(x) = -x\,e^{-x}$'],
    [r'Produktregel: $u = x$, $u^{\prime} = 1$, $v = e^{-x}$, $v^{\prime} = -e^{-x}$ (Kettenregel).',
     r'$f^{\prime}(x) = 1 \cdot e^{-x} + x \cdot (-e^{-x}) = (1 - x)\,e^{-x}$',
     r'Das Minus aus der inneren Ableitung von $-x$ nicht vergessen.'])

Q.q(r'Welchen Extrempunkt hat der Graph von $f(x) = x \cdot e^{-x}$?',
    [r'Hochpunkt $H(1|e^{-1})$, $e^{-1} \approx 0{,}37$', r'Tiefpunkt $T(1|e^{-1})$', r'Hochpunkt $H(0|0)$', r'Hochpunkt $H(-1|-e)$'],
    [r'$f^{\prime}(x) = (1 - x)\,e^{-x} = 0 \Rightarrow x = 1$, denn $e^{-x} > 0$ für alle $x$.',
     r'Vorzeichenwechsel: $f^{\prime}(0) = 1 > 0$, $f^{\prime}(2) = -e^{-2} < 0$, also Hochpunkt.',
     r'$f(1) = 1 \cdot e^{-1} \approx 0{,}37$, also $H(1|e^{-1})$.'])

Q.q(r'Welche Funktion ist eine Stammfunktion von $f(x) = 4e^{2x + 1}$?',
    [r'$F(x) = 2e^{2x + 1}$', r'$F(x) = 8e^{2x + 1}$', r'$F(x) = 4e^{2x + 1}$', r'$F(x) = \dfrac{4e^{2x + 2}}{2x + 2}$'],
    [r'Regel: $\int e^{ax + b}\,dx = \dfrac{1}{a}\,e^{ax + b} + C$, hier $a = 2$.',
     r'$F(x) = 4 \cdot \dfrac{1}{2}\,e^{2x + 1} = 2e^{2x + 1}$',
     r'Probe: $F^{\prime}(x) = 2 \cdot 2e^{2x + 1} = 4e^{2x + 1}$. Beim Integrieren wird durch $a$ geteilt, beim Ableiten mit $a$ multipliziert.'])

Q.q(r'Ein Ölfleck wächst mit der Rate $r(t) = 2e^{0{,}5t}$ (in $\mathrm{m^2/h}$, $t$ in Stunden). Um wie viel $\mathrm{m^2}$ vergrößert er sich in den ersten $2$ Stunden?',
    [r'$4e - 4 \approx 6{,}87\,\mathrm{m^2}$', r'$2e \approx 5{,}44\,\mathrm{m^2}$', r'$4e \approx 10{,}87\,\mathrm{m^2}$', r'$e - 1 \approx 1{,}72\,\mathrm{m^2}$'],
    [r'Zuwachs = Integral der Rate: $\int_0^2 2e^{0{,}5t}\,dt$',
     r'Stammfunktion: $\dfrac{2}{0{,}5}\,e^{0{,}5t} = 4e^{0{,}5t}$, also $\left[4e^{0{,}5t}\right]_0^2 = 4e^{1} - 4e^{0} = 4e - 4 \approx 6{,}87$',
     r'$2e$ ist nur die Rate zur Zeit $t = 2$; $4e$ entsteht, wenn man die untere Grenze vergisst.'])


def check():
    from fractions import Fraction as F
    import math
    import sympy as sp
    x, t = sp.symbols('x t')
    e = math.e
    # 1 Stammfunktion
    assert sp.simplify(sp.diff(x**3 - 2*x**2 + x, x) - (3*x**2 - 4*x + 1)) == 0
    assert sp.simplify(sp.diff(x**3 - 4*x**2 + x, x) - (3*x**2 - 4*x + 1)) != 0
    # 2 bestimmtes Integral
    assert sp.integrate(x**2 - 2*x + 3, (x, 0, 3)) == 9 and (3**2 - 2*3 + 3) == 6
    # 3 Fläche 4 - x^2
    assert sp.integrate(4 - x**2, (x, -2, 2)) == sp.Rational(32, 3) and sp.integrate(4 - x**2, (x, 0, 2)) == sp.Rational(16, 3)
    assert abs(32 / 3 - 10.67) < 0.005 and abs(16 / 3 - 5.33) < 0.005
    # 4 Vorzeichenwechsel
    assert sp.integrate(x**2 - 1, (x, 0, 1)) == -sp.Rational(2, 3) and sp.integrate(x**2 - 1, (x, 1, 2)) == sp.Rational(4, 3)
    assert F(2, 3) + F(4, 3) == 2 and sp.integrate(x**2 - 1, (x, 0, 2)) == sp.Rational(2, 3)
    # 5 obere Grenze
    assert sp.integrate(2*x, (x, 1, 4)) == 15 and abs(15 ** 0.5 - 3.87) < 0.005
    # 6 zwei Graphen
    assert sp.integrate(2*x - x**2, (x, 0, 2)) == sp.Rational(4, 3) and sp.integrate(x**2, (x, 0, 2)) == sp.Rational(8, 3)
    # 7 Zufluss
    assert sp.integrate(20 - 2*t, (t, 0, 5)) == 75 and 20 * 5 == 100 and 20 - 2 * 5 == 10
    # 8 Definitionsbereich
    assert sorted(sp.solve(x**2 - 4, x)) == [-2, 2]
    # 9 Lücke
    assert sp.cancel((x**2 - 1) / (x - 1)) == x + 1 and (1 + 1) == 2
    # 10 Asymptoten
    assert sp.limit((2*x + 3) / (x - 1), x, sp.oo) == 2 and abs((2*1000 + 3) / (1000 - 1) - 2.005) < 0.001
    # 11 Quotientenregel
    f11 = x / (x**2 + 1)
    assert sp.simplify(sp.diff(f11, x) - (1 - x**2) / (x**2 + 1)**2) == 0
    # 12 Hochpunkt
    assert sorted(sp.solve(1 - x**2, x)) == [-1, 1] and f11.subs(x, 1) == sp.Rational(1, 2)
    d11 = sp.diff(f11, x)
    assert d11.subs(x, 0) == 1 and d11.subs(x, 2) == -sp.Rational(3, 25) and d11.subs(x, 2) < 0
    # 13 Stückkosten
    k = sp.Rational(1, 2) * x + 200 / x
    assert sp.solve(sp.diff(k, x), x) == [-20, 20] and k.subs(x, 20) == 20 and k.subs(x, 10) == 25 and k.subs(x, 40) == 25
    assert sp.diff(k, x, 2).subs(x, 20) > 0 and abs(k.subs(x, 400) - 200.5) < 1e-9
    # 14 Ableitung e^{2x}
    assert sp.simplify(sp.diff(sp.exp(2*x), x) - 2*sp.exp(2*x)) == 0
    # 15 Exponentialgleichung
    assert sp.solveset(3 * sp.exp(2*x - 1) - 3, x, domain=sp.S.Reals) == {sp.Rational(1, 2)} and abs((1 + math.log(3)) / 2 - 1.05) < 0.005
    # 16 Halbwertszeit
    assert abs(5 * math.log(2) - 3.47) < 0.005 and abs(10 * math.log(2) - 6.93) < 0.005
    assert abs(20000 * math.exp(-0.2 * 3.47) - 9996) < 5
    # 17 Produktregel
    f17 = x * sp.exp(-x)
    assert sp.simplify(sp.diff(f17, x) - (1 - x) * sp.exp(-x)) == 0
    # 18 Extrempunkt
    assert sp.solve(sp.diff(f17, x), x) == [1] and abs(math.exp(-1) - 0.37) < 0.005
    assert sp.diff(f17, x).subs(x, 0) == 1 and sp.diff(f17, x).subs(x, 2) < 0
    # 19 Stammfunktion e^{2x+1}
    assert sp.simplify(sp.diff(2 * sp.exp(2*x + 1), x) - 4 * sp.exp(2*x + 1)) == 0
    # 20 Ölfleck
    val = sp.integrate(2 * sp.exp(t / 2), (t, 0, 2))
    assert sp.simplify(val - (4 * sp.E - 4)) == 0
    assert abs(4 * e - 4 - 6.87) < 0.005 and abs(2 * e - 5.44) < 0.005 and abs(4 * e - 10.87) < 0.005 and abs(e - 1 - 1.72) < 0.005


Q.verify(check)
Q.save()
