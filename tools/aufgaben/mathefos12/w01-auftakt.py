#!/usr/bin/env python3
"""Aufgaben FO Mathe 12, Woche 1 (Rückblick): Grundlagen-Check aus Klasse 11 -
lineare und quadratische Funktionen, Potenz- und Exponentialfunktionen, Gleichungen,
Baumdiagramm, Vierfeldertafel und bedingte Wahrscheinlichkeit.
Plan: HTML/svp/mathe/mathefos12.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos12, vec, dec

Q = fos12(nr=1, slug='auftakt', thema='Rückblick Klasse 11', lb='Rückblick',
          blurb='Funktionen, Gleichungen und Wahrscheinlichkeiten aus Klasse 11',
          comment='Blocks: Lineare Funktionen (1-4), Quadratische Funktionen (5-9), Potenz- und Exponentialfunktionen, Gleichungen (10-14), Wahrscheinlichkeit (15-20). Alles ohne CAS.')

# ------------------------------------------------------ Lineare Funktionen ----
Q.q(r'Eine Gerade verläuft durch die Punkte $A(1|3)$ und $B(3|7)$. Wie lautet ihre Funktionsgleichung?',
    [r'$f(x) = 2x + 1$', r'$f(x) = 2x - 1$', r'$f(x) = 0{,}5x + 2{,}5$', r'$f(x) = 4x - 1$'],
    [r'Anstieg: $m = \dfrac{\Delta y}{\Delta x} = \dfrac{7 - 3}{3 - 1} = \dfrac{4}{2} = 2$',
     r'Punkt $A$ einsetzen: $3 = 2 \cdot 1 + n$, also $n = 1$.',
     r'Probe mit $B$: $2 \cdot 3 + 1 = 7$. Passt.',
     r'Falle: $\Delta x$ durch $\Delta y$ geteilt ergibt den Kehrwert $0{,}5$.'])

Q.q(r'Bestimme die Nullstelle der Funktion $f(x) = 3x - 12$.',
    [r'$x = 4$', r'$x = -4$', r'$x = 12$', r'$x = 3$'],
    [r'Nullstelle: $f(x) = 0$, also $3x - 12 = 0$.',
     r'$3x = 12$, also $x = 4$.',
     r'Probe: $3 \cdot 4 - 12 = 0$.'])

Q.q(r'Unter welchem Winkel schneidet die Gerade $f(x) = 0{,}5x + 1$ die $x$-Achse?',
    [r'$\alpha \approx 26{,}6^\circ$', r'$\alpha \approx 63{,}4^\circ$', r'$\alpha = 30^\circ$', r'$\alpha = 45^\circ$'],
    [r'Für den Schnittwinkel mit der $x$-Achse gilt $\tan\alpha = m$.',
     r'$\tan\alpha = 0{,}5$, also $\alpha = \tan^{-1}(0{,}5) \approx 26{,}6^\circ$',
     r'Falle: $\sin\alpha = 0{,}5$ würde $30^\circ$ liefern - es ist aber der Tangens.'])

Q.q(r'Berechne den Schnittpunkt der Geraden $g\colon y = 2x - 1$ und $h\colon y = -x + 5$.',
    [r'$S(2|3)$', r'$S(3|2)$', r'$S(6|11)$', r'$S(-2|-5)$'],
    [r'Gleichsetzen: $2x - 1 = -x + 5$',
     r'$3x = 6$, also $x = 2$; einsetzen: $y = 2 \cdot 2 - 1 = 3$',
     r'Probe in $h$: $-2 + 5 = 3$. Passt, also $S(2|3)$.'])

# ------------------------------------------------- Quadratische Funktionen ----
Q.q(r'Bestimme die Nullstellen von $f(x) = x^2 - 5x + 6$.',
    [r'$x_1 = 2$, $x_2 = 3$', r'$x_1 = -2$, $x_2 = -3$', r'$x_1 = 1$, $x_2 = 6$', r'$x_1 = -1$, $x_2 = 6$'],
    [r'$p$-$q$-Formel mit $p = -5$, $q = 6$: $x_{1,2} = \dfrac{5}{2} \pm \sqrt{\dfrac{25}{4} - 6} = \dfrac{5}{2} \pm \dfrac{1}{2}$',
     r'$x_1 = 2$, $x_2 = 3$',
     r'Probe über die Linearfaktoren: $(x - 2)(x - 3) = x^2 - 5x + 6$. Passt.'])

Q.q(r'Bestimme den Scheitelpunkt der Parabel $f(x) = x^2 - 4x + 1$.',
    [r'$S(2|-3)$', r'$S(-2|13)$', r'$S(2|1)$', r'$S(4|1)$'],
    [r'Scheitelstelle: $x_S = -\dfrac{b}{2a} = -\dfrac{-4}{2} = 2$',
     r'$y_S = f(2) = 4 - 8 + 1 = -3$, also $S(2|-3)$.',
     r'Falle: das Vorzeichen in $-\dfrac{b}{2a}$ vergessen liefert $x_S = -2$.'])

Q.q(r'Schreibe $f(x) = 2(x - 3)^2 + 1$ in der Form $f(x) = ax^2 + bx + c$.',
    [r'$f(x) = 2x^2 - 12x + 19$', r'$f(x) = 2x^2 - 12x + 10$', r'$f(x) = 2x^2 + 12x + 19$', r'$f(x) = 2x^2 - 6x + 19$'],
    [r'Binomische Formel: $(x - 3)^2 = x^2 - 6x + 9$',
     r'Mal $2$ und plus $1$: $2x^2 - 12x + 18 + 1 = 2x^2 - 12x + 19$',
     r'Falle: die $2$ muss auch mit der $9$ multipliziert werden ($18$, nicht $9$).'])

Q.q(r'Löse die Gleichung $x^2 + 2x - 8 = 0$.',
    [r'$x_1 = 2$, $x_2 = -4$', r'$x_1 = -2$, $x_2 = 4$', r'$x_1 = 1$, $x_2 = -8$', r'keine reelle Lösung'],
    [r'$p = 2$, $q = -8$: $x_{1,2} = -1 \pm \sqrt{1 + 8} = -1 \pm 3$',
     r'$x_1 = 2$, $x_2 = -4$',
     r'Falle: unter der Wurzel steht $1 - (-8) = 9$, nicht $1 - 8$.'])

Q.q(r'Der Gewinn eines Betriebs hängt von der Stückzahl $x$ ab: $G(x) = -x^2 + 40x - 300$ (in Euro). Wie groß ist der maximale Gewinn?',
    [r'$100$ Euro', r'$400$ Euro', r'$20$ Euro', r'$500$ Euro'],
    [r'Nach unten geöffnete Parabel, das Maximum liegt im Scheitel: $x_S = -\dfrac{40}{2 \cdot (-1)} = 20$',
     r'$G(20) = -400 + 800 - 300 = 100$',
     r'Falle: $20$ ist die Stückzahl, nicht der Gewinn; $400$ entsteht, wenn man die $-300$ vergisst.'])

# ------------------------------- Potenz- und Exponentialfunktionen, Gleichungen ----
Q.q(r'Bestimme alle Nullstellen von $f(x) = x^3 - 4x$.',
    [r'$x = 0$, $x = 2$, $x = -2$', r'$x = 2$, $x = -2$', r'$x = 0$, $x = 4$', r'$x = 0$, $x = 2$'],
    [r'Ausklammern: $x^3 - 4x = x\,(x^2 - 4) = x\,(x - 2)(x + 2)$',
     r'Nullprodukt: $x = 0$ oder $x = 2$ oder $x = -2$',
     r'Falle: durch $x$ dividieren lässt die Nullstelle $x = 0$ verschwinden.'])

Q.q(r'Vereinfache $(2x^3)^2$.',
    [r'$4x^6$', r'$2x^6$', r'$4x^5$', r'$2x^5$'],
    [r'Potenzgesetz: $(a \cdot b)^n = a^n \cdot b^n$ und $(x^m)^n = x^{m \cdot n}$',
     r'$(2x^3)^2 = 2^2 \cdot x^{3 \cdot 2} = 4x^6$',
     r'Falle: Exponenten werden hier multipliziert, nicht addiert.'])

Q.q(r'Gegeben ist $f(x) = 3 \cdot 2^x$. Berechne $f(4)$.',
    [r'$48$', r'$24$', r'$1296$', r'$81$'],
    [r'Erst die Potenz, dann der Faktor: $2^4 = 16$',
     r'$f(4) = 3 \cdot 16 = 48$',
     r'Falle: $(3 \cdot 2)^4 = 1296$ wäre falsch geklammert.'])

Q.q(r'Löse die Exponentialgleichung $5 \cdot 2^x = 80$.',
    [r'$x = 4$', r'$x = 16$', r'$x = 3$', r'$x = 5$'],
    [r'Erst durch $5$ teilen: $2^x = 16$',
     r'$16 = 2^4$, Exponentenvergleich: $x = 4$',
     r'Probe: $5 \cdot 2^4 = 5 \cdot 16 = 80$.'])

Q.q(r'Ein Kapital von $2000$ Euro wird $5$ Jahre lang mit $3\,\%$ pro Jahr verzinst (Zinseszins). Wie hoch ist das Kapital danach?',
    [r'$\approx 2318{,}55$ Euro', r'$2300{,}00$ Euro', r'$\approx 2251{,}02$ Euro', r'$\approx 2388{,}10$ Euro'],
    [r'Wachstumsfaktor $q = 1 + \dfrac{3}{100} = 1{,}03$',
     r'$K_5 = 2000 \cdot 1{,}03^5 \approx 2000 \cdot 1{,}1593 \approx 2318{,}55$',
     r'Falle: $2300$ Euro wären einfache Zinsen ohne Zinseszins ($5 \cdot 60$ Euro).'])

# ---------------------------------------------------------- Wahrscheinlichkeit ----
Q.q(r'Für zwei Ereignisse gilt $P(A) = 0{,}4$, $P(B) = 0{,}5$ und $P(A \cap B) = 0{,}2$. Welche Aussage ist richtig?',
    [r'$A$ und $B$ sind stochastisch unabhängig, denn $P(A) \cdot P(B) = P(A \cap B)$.',
     r'$A$ und $B$ sind abhängig, denn $P(A) \neq P(B)$.',
     r'$A$ und $B$ sind unvereinbar, denn $P(A \cap B) < P(A)$.',
     r'$P(A \cup B) = 0{,}9$'],
    [r'Multiplikationsregel: $P(A) \cdot P(B) = 0{,}4 \cdot 0{,}5 = 0{,}2 = P(A \cap B)$, also unabhängig.',
     r'Unvereinbar hieße $P(A \cap B) = 0$.',
     r'$P(A \cup B) = P(A) + P(B) - P(A \cap B) = 0{,}4 + 0{,}5 - 0{,}2 = 0{,}7$'])

Q.q(r'In einer Urne liegen $3$ rote und $2$ blaue Kugeln. Es werden zwei Kugeln ohne Zurücklegen gezogen. Wie groß ist die Wahrscheinlichkeit, dass beide rot sind?',
    [r'$\dfrac{3}{10}$', r'$\dfrac{9}{25}$', r'$\dfrac{6}{25}$', r'$\dfrac{3}{5}$'],
    [r'Pfadregel: $P(rr) = \dfrac{3}{5} \cdot \dfrac{2}{4}$ - nach dem ersten Zug liegen nur noch $4$ Kugeln in der Urne.',
     r'$P(rr) = \dfrac{6}{20} = \dfrac{3}{10}$',
     r'Falle: $\dfrac{3}{5} \cdot \dfrac{3}{5} = \dfrac{9}{25}$ gilt nur mit Zurücklegen.'])

Q.q(r'Ein Basketballspieler trifft einen Freiwurf mit der Wahrscheinlichkeit $0{,}2$. Er wirft dreimal. Wie groß ist die Wahrscheinlichkeit für mindestens einen Treffer?',
    [r'$0{,}488$', r'$0{,}6$', r'$0{,}512$', r'$0{,}008$'],
    [r'Gegenereignis: kein Treffer in drei Würfen, $P = 0{,}8^3 = 0{,}512$',
     r'$P(\text{mindestens ein Treffer}) = 1 - 0{,}512 = 0{,}488$',
     r'Falle: $3 \cdot 0{,}2 = 0{,}6$ addiert die Pfade falsch; $0{,}2^3$ wäre „drei Treffer“.'])

Q.q(r'Von $200$ Befragten sind $120$ Frauen. $90$ Personen nutzen eine Lern-App, darunter $60$ Frauen. Wie viele Männer nutzen die App nicht?',
    [r'$50$', r'$30$', r'$60$', r'$110$'],
    [r'Vierfeldertafel: Männer gesamt $200 - 120 = 80$',
     r'Männer mit App: $90 - 60 = 30$',
     r'Männer ohne App: $80 - 30 = 50$'])

Q.q(r'Gleiche Befragung: $200$ Personen, $120$ Frauen, $90$ App-Nutzer, darunter $60$ Frauen. Eine zufällig gewählte Person nutzt die App. Mit welcher Wahrscheinlichkeit ist es eine Frau?',
    [r'$\dfrac{2}{3} \approx 0{,}67$', r'$\dfrac{1}{2}$', r'$0{,}3$', r'$0{,}45$'],
    [r'Bedingte Wahrscheinlichkeit: $P(F \mid A) = \dfrac{P(F \cap A)}{P(A)} = \dfrac{60}{90}$',
     r'$= \dfrac{2}{3} \approx 0{,}67$',
     r'Falle: $\dfrac{60}{120} = \dfrac{1}{2}$ wäre $P(A \mid F)$ - die Bedingung steht im Nenner.'])

Q.q(r'Zwei Maschinen fertigen ein Bauteil: $M_1$ liefert $60\,\%$ der Stücke mit $2\,\%$ Ausschuss, $M_2$ liefert $40\,\%$ mit $5\,\%$ Ausschuss. Ein Stück ist Ausschuss. Mit welcher Wahrscheinlichkeit stammt es von $M_2$?',
    [r'$0{,}625$', r'$0{,}4$', r'$0{,}05$', r'$0{,}375$'],
    [r'Baumdiagramm: $P(\text{Ausschuss}) = 0{,}6 \cdot 0{,}02 + 0{,}4 \cdot 0{,}05 = 0{,}012 + 0{,}02 = 0{,}032$',
     r'$P(M_2 \mid \text{Ausschuss}) = \dfrac{0{,}4 \cdot 0{,}05}{0{,}032} = \dfrac{0{,}02}{0{,}032} = 0{,}625$',
     r'$0{,}375$ wäre der Anteil von $M_1$ am Ausschuss.'])


def check():
    from fractions import Fraction as F
    from math import atan, degrees, sqrt, isclose
    # 1: line through A(1|3), B(3|7)
    m = F(7 - 3, 3 - 1); n = 3 - m * 1
    assert m == 2 and n == 1 and m * 3 + n == 7 and F(2, 4) == F(1, 2) and 3 - F(1, 2) == F(5, 2)
    # 2
    assert 3 * 4 - 12 == 0
    # 3
    assert abs(degrees(atan(0.5)) - 26.6) < 0.05 and abs(degrees(atan(2)) - 63.4) < 0.05
    # 4
    assert 2 * 2 - 1 == 3 and -2 + 5 == 3 and 2 * 6 - 1 == 11
    # 5
    assert 2 ** 2 - 5 * 2 + 6 == 0 and 3 ** 2 - 5 * 3 + 6 == 0 and F(5, 2) + F(1, 2) == 3 and F(25, 4) - 6 == F(1, 4)
    assert 1 ** 2 - 5 * 1 + 6 != 0 and 6 ** 2 - 5 * 6 + 6 != 0
    # 6
    assert -(-4) / (2 * 1) == 2 and 2 ** 2 - 4 * 2 + 1 == -3 and (-2) ** 2 + 8 + 1 == 13 and 4 ** 2 - 16 + 1 == 1
    # 7
    import sympy as sp
    x = sp.symbols('x')
    assert sp.expand(2 * (x - 3) ** 2 + 1 - (2 * x ** 2 - 12 * x + 19)) == 0
    # 8
    assert 2 ** 2 + 2 * 2 - 8 == 0 and (-4) ** 2 + 2 * (-4) - 8 == 0 and -1 + 3 == 2 and -1 - 3 == -4
    assert (-2) ** 2 + 2 * (-2) - 8 != 0 and 1 + 2 - 8 != 0
    # 9
    assert -40 / (2 * -1) == 20 and -20 ** 2 + 40 * 20 - 300 == 100 and -20 ** 2 + 40 * 20 == 400
    # 10
    assert all(v ** 3 - 4 * v == 0 for v in (0, 2, -2)) and 4 ** 3 - 4 * 4 != 0
    # 11
    assert sp.expand((2 * x ** 3) ** 2 - 4 * x ** 6) == 0
    # 12
    assert 3 * 2 ** 4 == 48 and 3 * 2 * 4 == 24 and 6 ** 4 == 1296 and 3 ** 4 == 81
    # 13
    assert 5 * 2 ** 4 == 80 and 80 / 5 == 16
    # 14
    assert isclose(round(2000 * 1.03 ** 5, 2), 2318.55) and 2000 + 5 * 60 == 2300
    assert isclose(round(2000 * 1.03 ** 4, 2), 2251.02) and isclose(round(2000 * 1.03 ** 6, 2), 2388.10)
    assert abs(1.03 ** 5 - 1.1593) < 0.00005
    # 15
    assert isclose(0.4 * 0.5, 0.2) and isclose(0.4 + 0.5 - 0.2, 0.7)
    # 16
    assert F(3, 5) * F(2, 4) == F(3, 10) and F(3, 5) * F(3, 5) == F(9, 25) and F(3, 5) * F(2, 5) == F(6, 25)
    # 17
    assert isclose(0.8 ** 3, 0.512) and isclose(1 - 0.8 ** 3, 0.488) and isclose(0.2 ** 3, 0.008)
    # 18
    assert 200 - 120 == 80 and 90 - 60 == 30 and 80 - 30 == 50
    # 19
    assert F(60, 90) == F(2, 3) and abs(2 / 3 - 0.67) < 0.005 and F(60, 120) == F(1, 2) and F(60, 200) == F(3, 10) and F(90, 200) == F(9, 20)
    # 20
    pa = 0.6 * 0.02 + 0.4 * 0.05
    assert isclose(pa, 0.032) and isclose(0.4 * 0.05 / pa, 0.625) and isclose(0.6 * 0.02 / pa, 0.375)


Q.verify(check)
Q.save()
