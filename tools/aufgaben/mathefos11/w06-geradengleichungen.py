#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 6 / KW 39 (LB 1): Geradengleichungen aus gegebenen
Bedingungen, Schnittwinkel mit der x-Achse.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=6, slug='geradengleichungen', thema='Geradengleichungen und Schnittwinkel', lb='LB 1',
          blurb='Geraden aus Punkt und Anstieg, aus zwei Punkten, Schnittwinkel mit der x-Achse',
          comment='Blocks: aus Punkt und Anstieg (1-6), aus zwei Punkten (7-12), Schnittwinkel (13-17), Anwendungen (18-20).')

# ----------------------------------------------- aus Punkt und Anstieg ----
Q.q(r'Wie lautet die Gleichung der Geraden durch $P(2|5)$ mit dem Anstieg $m = 3$?',
    [r'$y = 3x - 1$', r'$y = 3x + 5$', r'$y = 3x + 1$', r'$y = 3x - 5$'],
    [r'Ansatz $y = 3x + n$, dann den Punkt einsetzen.',
     r'$5 = 3 \cdot 2 + n$, also $n = -1$.',
     r'$y = 3x - 1$. Probe: bei $x = 2$ ergibt sich $5$.'])

Q.q(r'Wie lautet die Gerade durch $P(0|4)$ mit $m = -2$?',
    [r'$y = -2x + 4$', r'$y = -2x - 4$', r'$y = 4x - 2$', r'$y = -2x$'],
    [r'Der Punkt liegt auf der $y$-Achse, sein $y$-Wert ist also direkt der Achsenabschnitt.',
     r'$n = 4$',
     r'$y = -2x + 4$.'])

Q.q(r'Wie lautet die Gerade durch $P(1|-2)$ mit $m = \dfrac{1}{2}$?',
    [r'$y = \dfrac{1}{2}x - 2{,}5$', r'$y = \dfrac{1}{2}x - 2$',
     r'$y = \dfrac{1}{2}x - 1{,}5$', r'$y = \dfrac{1}{2}x + 2{,}5$'],
    [r'$-2 = \dfrac{1}{2} \cdot 1 + n$',
     r'$n = -2 - 0{,}5 = -2{,}5$',
     r'$y = \dfrac{1}{2}x - 2{,}5$.'])

Q.q(r'Liegt der Punkt $Q(3|7)$ auf der Geraden $y = 2x + 1$?',
    [r'Ja, denn $2 \cdot 3 + 1 = 7$.', r'Nein, denn $2 \cdot 3 + 1 = 6$.',
     r'Nein, denn der Anstieg passt nicht.', r'Das lässt sich ohne Zeichnung nicht entscheiden.'],
    [r'Die Punktprobe setzt die Koordinaten in die Gleichung ein.',
     r'Links steht $7$, rechts $2 \cdot 3 + 1 = 7$.',
     r'Beide Seiten stimmen überein, der Punkt liegt also auf der Geraden.'])

Q.q(r'Eine Gerade mit dem Anstieg $m = -\dfrac{1}{3}$ geht durch $P(6|1)$. Wie groß ist ihr $y$-Achsenabschnitt?',
    [r'$n = 3$', r'$n = -1$', r'$n = 1$', r'$n = -3$'],
    [r'$1 = -\dfrac{1}{3} \cdot 6 + n$',
     r'$1 = -2 + n$, also $n = 3$.',
     r'Die Gerade lautet $y = -\dfrac{1}{3}x + 3$.'])

Q.q(r'Wie lautet die Gerade, die parallel zu $y = 3x + 2$ verläuft und durch $P(1|1)$ geht?',
    [r'$y = 3x - 2$', r'$y = 3x + 2$', r'$y = -3x + 4$', r'$y = x + 2$'],
    [r'Parallel bedeutet denselben Anstieg: $m = 3$.',
     r'$1 = 3 \cdot 1 + n$ ergibt $n = -2$.',
     r'$y = 3x - 2$.'])

# ------------------------------------------------------ aus zwei Punkten ----
Q.q(r'Wie lautet die Gerade durch $A(1|3)$ und $B(3|7)$?',
    [r'$y = 2x + 1$', r'$y = 2x - 1$', r'$y = \dfrac{1}{2}x + 2{,}5$', r'$y = 4x - 1$'],
    [r'Anstieg: $m = \dfrac{7-3}{3-1} = 2$.',
     r'Punkt $A$ einsetzen: $3 = 2 + n$, also $n = 1$.',
     r'$y = 2x + 1$. Probe mit $B$: $2 \cdot 3 + 1 = 7$.'])

Q.q(r'Wie lautet die Gerade durch $A(-2|4)$ und $B(2|0)$?',
    [r'$y = -x + 2$', r'$y = x + 6$', r'$y = -x - 2$', r'$y = -2x$'],
    [r'$m = \dfrac{0 - 4}{2 - (-2)} = \dfrac{-4}{4} = -1$',
     r'$B$ einsetzen: $0 = -2 + n$, also $n = 2$.',
     r'$y = -x + 2$. Probe mit $A$: $2 + 2 = 4$.'])

Q.q(r'Wie lautet die Gerade durch $A(0|3)$ und $B(4|3)$?',
    [r'$y = 3$', r'$y = 3x$', r'$x = 3$', r'$y = 4x + 3$'],
    [r'$m = \dfrac{3-3}{4-0} = 0$ — beide Punkte liegen gleich hoch.',
     r'Der Graph ist eine waagerechte Gerade auf der Höhe $3$.',
     r'$y = 3$.'])

Q.q(r'Warum lässt sich die Gerade durch $A(2|1)$ und $B(2|5)$ nicht in der Form $y = mx + n$ schreiben?',
    [r'Weil sie senkrecht verläuft und damit keine Funktion ist.',
     r'Weil ihr Anstieg null ist.',
     r'Weil beide Punkte denselben $y$-Wert haben.',
     r'Weil sie nicht durch den Ursprung geht.'],
    [r'Beide Punkte haben dieselbe $x$-Koordinate, die Gerade verläuft also senkrecht.',
     r'Im Anstiegsbruch stünde im Nenner $2 - 2 = 0$ — durch null darf man nicht teilen.',
     r'Ihre Gleichung lautet $x = 2$; dem Wert $x = 2$ sind unendlich viele $y$ zugeordnet, also ist es keine Funktion.'])

Q.q(r'Wo schneidet die Gerade durch $A(1|3)$ und $B(3|7)$ die $x$-Achse?',
    [r'bei $x = -0{,}5$', r'bei $x = 0{,}5$', r'bei $x = -1$', r'bei $x = 1$'],
    [r'Die Gerade lautet $y = 2x + 1$.',
     r'Nullstelle: $2x + 1 = 0$, also $x = -\dfrac{1}{2}$.',
     r'Probe: $2 \cdot (-0{,}5) + 1 = 0$.'])

Q.q(r'Wo schneiden sich die Geraden $y = 2x + 1$ und $y = -x + 7$?',
    [r'in $S(2|5)$', r'in $S(5|2)$', r'in $S(2|3)$', r'in $S(3|7)$'],
    [r'Gleichsetzen: $2x + 1 = -x + 7$.',
     r'$3x = 6$, also $x = 2$.',
     r'Einsetzen in eine der beiden Gleichungen: $y = 5$, also $S(2|5)$.'])

# ------------------------------------------------------- Schnittwinkel ----
Q.q(r'Unter welchem Winkel schneidet die Gerade $y = x + 2$ die $x$-Achse?',
    [r'$45^\circ$', r'$30^\circ$', r'$60^\circ$', r'$90^\circ$'],
    [r'Für den Schnittwinkel gilt $\tan\alpha = m$.',
     r'$\tan\alpha = 1$ ergibt $\alpha = 45^\circ$.',
     r'Anschaulich: ein Schritt nach rechts, ein Schritt nach oben.'])

Q.q(r'Unter welchem Winkel schneidet die Gerade $y = \sqrt{3}\,x$ die $x$-Achse?',
    [r'$60^\circ$', r'$30^\circ$', r'$45^\circ$', r'$\approx 1{,}7^\circ$'],
    [r'$\tan\alpha = \sqrt{3}$',
     r'Aus der Formelsammlung: $\tan 60^\circ = \sqrt{3}$.',
     r'$\tan 30^\circ = \dfrac{1}{\sqrt{3}}$ wäre der flachere Fall.'])

Q.q(r'Unter welchem Winkel schneidet $y = 2x - 3$ die $x$-Achse?',
    [r'$\approx 63{,}4^\circ$', r'$\approx 26{,}6^\circ$', r'$\approx 71{,}6^\circ$', r'$2^\circ$'],
    [r'$\tan\alpha = 2$',
     r'$\alpha = \arctan 2 \approx 63{,}4^\circ$',
     r'$26{,}6^\circ$ ist der Winkel zur $y$-Achse, die beiden ergänzen sich zu $90^\circ$.'])

Q.q(r'Welchen Anstieg hat eine Gerade, die die $x$-Achse unter $30^\circ$ schneidet?',
    [r'$m = \dfrac{1}{\sqrt{3}} \approx 0{,}577$', r'$m = \sqrt{3} \approx 1{,}732$',
     r'$m = 30$', r'$m = 0{,}5$'],
    [r'Aus $\tan\alpha = m$ folgt $m = \tan 30^\circ$.',
     r'$\tan 30^\circ = \dfrac{1}{\sqrt{3}} \approx 0{,}577$',
     r'$\sqrt{3}$ gehört zu $60^\circ$ — die beiden Werte werden gern verwechselt.'])

Q.q(r'Eine Gerade hat den Anstieg $m = -1$. Welchen Winkel schließt sie mit der positiven $x$-Achse ein?',
    [r'$135^\circ$', r'$-45^\circ$ und damit keinen sinnvollen Winkel', r'$45^\circ$', r'$90^\circ$'],
    [r'$\tan\alpha = -1$ liefert zunächst $-45^\circ$.',
     r'Winkel zur positiven $x$-Achse werden gegen den Uhrzeigersinn gemessen: $180^\circ - 45^\circ = 135^\circ$.',
     r'Die Gerade fällt also unter $45^\circ$ — der Neigungswinkel selbst ist $45^\circ$.'])

# --------------------------------------------------------- Anwendungen ----
Q.q(r'Eine Rampe hat eine Steigung von $6\,\%$. Unter welchem Winkel steigt sie an?',
    [r'$\approx 3{,}4^\circ$', r'$\approx 6{,}0^\circ$', r'$\approx 0{,}06^\circ$', r'$\approx 34{,}0^\circ$'],
    [r'$6\,\%$ Steigung bedeutet $6\,\mathrm{m}$ Höhe auf $100\,\mathrm{m}$ Länge, also $m = 0{,}06$.',
     r'$\alpha = \arctan 0{,}06 \approx 3{,}4^\circ$',
     r'Prozentangabe und Gradzahl sind nicht dasselbe — bei kleinen Winkeln liegen sie nur zufällig nah beieinander.'])

Q.q(r'Ein Dach steigt auf $4\,\mathrm{m}$ waagerechter Strecke um $3\,\mathrm{m}$ an. Wie groß ist der Neigungswinkel?',
    [r'$\approx 36{,}9^\circ$', r'$\approx 53{,}1^\circ$', r'$\approx 48{,}6^\circ$', r'$75^\circ$'],
    [r'$m = \dfrac{3}{4} = 0{,}75$',
     r'$\alpha = \arctan 0{,}75 \approx 36{,}9^\circ$',
     r'$53{,}1^\circ$ wäre der Winkel an der Spitze, also der Rest zu $90^\circ$.'])

Q.q(r'Ein Weg trägt das Schild „$12\,\%$ Steigung“. Um wie viele Meter steigt er auf $250\,\mathrm{m}$ waagerechter Strecke?',
    [r'$30\,\mathrm{m}$', r'$12\,\mathrm{m}$', r'$3\,\mathrm{m}$', r'$300\,\mathrm{m}$'],
    [r'$12\,\%$ bedeutet den Anstieg $m = 0{,}12$.',
     r'$0{,}12 \cdot 250 = 30$',
     r'Der Weg gewinnt also $30\,\mathrm{m}$ an Höhe.'])


def check():
    from fractions import Fraction as F
    from math import atan, degrees, tan, radians, sqrt
    import sympy as sp
    x = sp.Symbol('x')
    line = lambda m, n: m * x + n
    # aus Punkt und Anstieg
    assert sp.solve(sp.Eq(3 * 2 + sp.Symbol('n'), 5), sp.Symbol('n')) == [-1]
    assert line(3, -1).subs(x, 2) == 5
    assert line(-2, 4).subs(x, 0) == 4
    assert line(F(1, 2), F(-5, 2)).subs(x, 1) == -2
    assert line(2, 1).subs(x, 3) == 7
    assert line(F(-1, 3), 3).subs(x, 6) == 1
    assert line(3, -2).subs(x, 1) == 1
    # aus zwei Punkten
    assert F(7 - 3, 3 - 1) == 2 and line(2, 1).subs(x, 1) == 3 and line(2, 1).subs(x, 3) == 7
    assert F(0 - 4, 2 + 2) == -1 and line(-1, 2).subs(x, 2) == 0 and line(-1, 2).subs(x, -2) == 4
    assert F(3 - 3, 4 - 0) == 0
    assert sp.solve(line(2, 1), x) == [F(-1, 2)] and line(2, 1).subs(x, F(-1, 2)) == 0
    assert sp.solve(sp.Eq(line(2, 1), line(-1, 7)), x) == [2] and line(2, 1).subs(x, 2) == 5
    # Schnittwinkel
    assert abs(degrees(atan(1)) - 45) < 1e-9
    assert abs(degrees(atan(sqrt(3))) - 60) < 1e-9 and abs(tan(radians(30)) - 1 / sqrt(3)) < 1e-12
    assert abs(degrees(atan(2)) - 63.4) < 0.05 and abs(90 - degrees(atan(2)) - 26.6) < 0.05
    assert abs(1 / sqrt(3) - 0.577) < 0.0005 and abs(sqrt(3) - 1.732) < 0.0005
    assert abs(degrees(atan(-1)) + 45) < 1e-9 and 180 - 45 == 135
    # Anwendungen
    assert abs(degrees(atan(0.06)) - 3.4) < 0.05
    assert F(3, 4) == F(75, 100) and abs(degrees(atan(0.75)) - 36.9) < 0.05
    assert abs(90 - degrees(atan(0.75)) - 53.1) < 0.05
    assert F(12, 100) * 250 == 30


Q.verify(check)
Q.save()
