#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 5 / KW 38 (LB 1): lineare Funktionen - Eigenschaften,
Darstellung, direkte Proportionalitaet. Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=5, slug='lineare-funktionen', thema='Lineare Funktionen', lb='LB 1',
          blurb='Anstieg und Achsenabschnitt, direkte Proportionalität, Anwendungen',
          comment='Blocks: Anstieg und Achsenabschnitt (1-7), direkte Proportionalitaet (8-12), Anwendungen (13-20).')

# ------------------------------------------- Anstieg und Achsenabschnitt ----
Q.q(r'Welchen Anstieg hat die Gerade $f(x) = 3x - 2$?',
    [r'$m = 3$', r'$m = -2$', r'$m = 2$', r'$m = \dfrac{3}{2}$'],
    [r'In der Form $f(x) = mx + n$ ist $m$ der Anstieg.',
     r'Hier also $m = 3$.',
     r'$-2$ ist der $y$-Achsenabschnitt.'])

Q.q(r'Wo schneidet $f(x) = 3x - 2$ die $y$-Achse?',
    [r'bei $(0|-2)$', r'bei $(0|3)$', r'bei $(-2|0)$', r'bei $\left(\dfrac{2}{3}\,\middle|\,0\right)$'],
    [r'Die $y$-Achse wird bei $x = 0$ geschnitten.',
     r'$f(0) = -2$, also im Punkt $(0|-2)$.',
     r'$\left(\dfrac{2}{3}\,\middle|\,0\right)$ ist dagegen der Schnittpunkt mit der $x$-Achse.'])

Q.q(r'Eine Gerade verläuft durch $A(1|2)$ und $B(4|11)$. Wie groß ist ihr Anstieg?',
    [r'$m = 3$', r'$m = \dfrac{1}{3}$', r'$m = 9$', r'$m = -3$'],
    [r'Anstieg: $m = \dfrac{y_B - y_A}{x_B - x_A}$',
     r'$m = \dfrac{11 - 2}{4 - 1} = \dfrac{9}{3} = 3$',
     r'Wer Zähler und Nenner vertauscht, erhält $\dfrac{1}{3}$.'])

Q.q(r'Wie verläuft der Graph von $f(x) = -2x + 5$?',
    [r'Er fällt, denn der Anstieg ist negativ.', r'Er steigt, denn der Achsenabschnitt ist positiv.',
     r'Er ist waagerecht.', r'Er ist senkrecht.'],
    [r'Das Vorzeichen des Anstiegs entscheidet über Steigen und Fallen.',
     r'$m = -2 < 0$, der Graph fällt.',
     r'Pro Schritt nach rechts geht es um $2$ nach unten.'])

Q.q(r'Welche Gerade ist parallel zu $y = 2x + 1$?',
    [r'$y = 2x - 4$', r'$y = -2x + 1$', r'$y = \dfrac{1}{2}x + 1$', r'$y = x + 2$'],
    [r'Parallele Geraden haben denselben Anstieg.',
     r'Nur $y = 2x - 4$ hat ebenfalls $m = 2$.',
     r'Der Achsenabschnitt darf sich unterscheiden, sonst wären die Geraden identisch.'])

Q.q(r'Was lässt sich über $f(x) = 4$ sagen?',
    [r'Der Graph ist eine waagerechte Gerade mit dem Anstieg $0$.',
     r'Der Graph ist eine senkrechte Gerade.',
     r'Der Anstieg ist $4$.',
     r'Es ist keine Funktion.'],
    [r'Der Term lässt sich als $f(x) = 0 \cdot x + 4$ schreiben.',
     r'Der Anstieg ist also $0$, der Graph verläuft waagerecht auf der Höhe $4$.',
     r'Eine senkrechte Gerade wäre dagegen keine Funktion — sie bestünde den Senkrechtentest nicht.'])

Q.q(r'Berechne die Nullstelle von $f(x) = 3x - 9$.',
    [r'$x = 3$', r'$x = -3$', r'$x = 9$', r'$x = \dfrac{1}{3}$'],
    [r'Nullstelle heißt $f(x) = 0$.',
     r'$3x - 9 = 0$ ergibt $3x = 9$, also $x = 3$.',
     r'Probe: $f(3) = 9 - 9 = 0$.'])

# ------------------------------------------------ direkte Proportionalität ----
Q.q(r'Woran erkennt man eine direkte Proportionalität?',
    [r'Der Graph ist eine Gerade durch den Ursprung, der Term hat die Form $y = k \cdot x$.',
     r'Der Graph ist eine Gerade mit beliebigem Achsenabschnitt.',
     r'Der Graph ist eine Parabel.',
     r'Der Quotient $\dfrac{x}{y}$ ist nicht konstant.'],
    [r'Bei direkter Proportionalität gehört zum doppelten $x$ der doppelte $y$-Wert.',
     r'Das geht nur, wenn der Graph durch den Ursprung verläuft, also $n = 0$ ist.',
     r'Kennzeichen: der Quotient $\dfrac{y}{x}$ ist für alle Wertepaare gleich und heißt Proportionalitätsfaktor $k$.'])

Q.q(r'Welche Zuordnung ist direkt proportional?',
    [r'$y = 0{,}8x$', r'$y = 2x + 3$', r'$y = \dfrac{6}{x}$', r'$y = x^2$'],
    [r'Gesucht ist die Form $y = k \cdot x$ ohne Summanden.',
     r'$y = 0{,}8x$ hat den Proportionalitätsfaktor $k = 0{,}8$.',
     r'$y = \dfrac{6}{x}$ ist umgekehrt proportional, $y = 2x + 3$ hat einen Achsenabschnitt.'])

Q.q(r'$3\,\mathrm{kg}$ einer Ware kosten $7{,}50$ €. Was kosten $5\,\mathrm{kg}$?',
    [r'$12{,}50$ €', r'$11{,}25$ €', r'$15{,}00$ €', r'$4{,}50$ €'],
    [r'Preis pro Kilogramm: $\dfrac{7{,}50}{3} = 2{,}50$ €.',
     r'$5 \cdot 2{,}50 = 12{,}50$ €',
     r'Kontrolle über den Dreisatz: mehr Ware, entsprechend mehr Geld.'])

Q.q(r'Eine Wertetabelle enthält die Paare $(2|5)$, $(4|10)$ und $(6|15)$. Wie lautet der Proportionalitätsfaktor?',
    [r'$k = 2{,}5$', r'$k = 0{,}4$', r'$k = 3$', r'$k = 5$'],
    [r'$k = \dfrac{y}{x}$, und dieser Quotient muss für alle Paare gleich sein.',
     r'$\dfrac{5}{2} = \dfrac{10}{4} = \dfrac{15}{6} = 2{,}5$',
     r'Der Term lautet also $y = 2{,}5x$.'])

Q.q(r'Warum ist $y = 2x + 3$ NICHT direkt proportional?',
    [r'Weil der Graph nicht durch den Ursprung geht: zu $x = 0$ gehört $y = 3$.',
     r'Weil der Anstieg zu groß ist.',
     r'Weil der Graph keine Gerade ist.',
     r'Weil $y$ mit wachsendem $x$ zunimmt.'],
    [r'Bei direkter Proportionalität muss zum $x$-Wert $0$ auch der $y$-Wert $0$ gehören.',
     r'Hier ist $y(0) = 3$.',
     r'Probe: Verdoppelt man $x$ von $1$ auf $2$, wächst $y$ von $5$ auf $7$ — also nicht aufs Doppelte.'])

# -------------------------------------------------------- Anwendungen ----
Q.q(r'Ein Taxi verlangt $3{,}50$ € Grundgebühr und $2{,}20$ € je Kilometer. Wie lautet die Kostenfunktion?',
    [r'$K(x) = 2{,}20x + 3{,}50$', r'$K(x) = 3{,}50x + 2{,}20$',
     r'$K(x) = 5{,}70x$', r'$K(x) = 2{,}20x$'],
    [r'Die Grundgebühr fällt einmal an, sie ist der Achsenabschnitt.',
     r'Der Kilometerpreis ist der Anstieg.',
     r'$K(x) = 2{,}20x + 3{,}50$. Probe: bei $0$ Kilometern kostet es $3{,}50$ €.'])

Q.q(r'Was kostet die Fahrt aus der vorigen Aufgabe über $12\,\mathrm{km}$?',
    [r'$29{,}90$ €', r'$26{,}40$ €', r'$46{,}20$ €', r'$68{,}40$ €'],
    [r'$K(12) = 2{,}20 \cdot 12 + 3{,}50$',
     r'$= 26{,}40 + 3{,}50 = 29{,}90$ €',
     r'$26{,}40$ € wäre der Fahrpreis ohne die Grundgebühr.'])

Q.q(r'Ein Betrieb hat die Kostenfunktion $K(x) = 0{,}50x + 20$ (in €). Wie viele Einheiten kann er für $60$ € herstellen?',
    [r'$80$ Einheiten', r'$120$ Einheiten', r'$40$ Einheiten', r'$160$ Einheiten'],
    [r'Gleichung: $0{,}50x + 20 = 60$.',
     r'$0{,}50x = 40$, also $x = 80$.',
     r'Probe: $0{,}50 \cdot 80 + 20 = 60$ €.'])

Q.q(r'Tarif A kostet $K_A(x) = 0{,}30x + 12$, Tarif B kostet $K_B(x) = 0{,}50x + 6$. Bei welcher Menge sind beide gleich teuer?',
    [r'bei $x = 30$', r'bei $x = 18$', r'bei $x = 90$', r'bei $x = 9$'],
    [r'Gleichsetzen: $0{,}30x + 12 = 0{,}50x + 6$.',
     r'$6 = 0{,}20x$, also $x = 30$.',
     r'Probe: beide ergeben $21$ €. Darunter ist B günstiger, darüber A.'])

Q.q(r'Ein Fahrzeug fährt gleichmäßig. Der Weg-Zeit-Graph verläuft durch $(0|0)$ und $(2|150)$, wobei $x$ in Stunden und $y$ in Kilometern gemessen wird. Wie schnell fährt es?',
    [r'$75\,\mathrm{km/h}$', r'$150\,\mathrm{km/h}$', r'$300\,\mathrm{km/h}$', r'$2\,\mathrm{km/h}$'],
    [r'Die Geschwindigkeit ist der Anstieg des Weg-Zeit-Graphen.',
     r'$m = \dfrac{150 - 0}{2 - 0} = 75$',
     r'Also $75\,\mathrm{km/h}$. Weil der Graph durch den Ursprung geht, ist der Weg direkt proportional zur Zeit.'])

Q.q(r'Ein Wassertank enthält $200$ Liter und wird mit $15$ Litern je Minute geleert. Wie lautet die Funktion für den Inhalt nach $t$ Minuten?',
    [r'$V(t) = 200 - 15t$', r'$V(t) = 200 + 15t$', r'$V(t) = 15t$', r'$V(t) = 15 - 200t$'],
    [r'Der Anfangsinhalt $200$ ist der Achsenabschnitt.',
     r'Geleert heißt abnehmend, der Anstieg ist also negativ: $-15$.',
     r'$V(t) = 200 - 15t$.'])

Q.q(r'Wann ist der Tank aus der vorigen Aufgabe leer?',
    [r'nach etwa $13{,}3$ Minuten', r'nach $15$ Minuten', r'nach $200$ Minuten', r'nach etwa $7{,}5$ Minuten'],
    [r'Leer bedeutet $V(t) = 0$: $200 - 15t = 0$.',
     r'$15t = 200$, also $t = \dfrac{200}{15} = \dfrac{40}{3} \approx 13{,}3$ Minuten.',
     r'Die Nullstelle der linearen Funktion beantwortet hier die Sachfrage.'])

Q.q(r'Bei der Kostenfunktion $K(x) = 4x + 250$ eines Betriebes — was bedeutet die Zahl $250$?',
    [r'die Fixkosten, die auch ohne Produktion anfallen', r'die Kosten je Stück',
     r'die maximale Stückzahl', r'den Gewinn je Stück'],
    [r'Der Achsenabschnitt ist der Funktionswert bei $x = 0$.',
     r'$K(0) = 250$ € fallen also an, wenn gar nichts produziert wird: Miete, Versicherung, Grundgebühren.',
     r'Die $4$ sind dagegen die variablen Kosten je Stück.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x, t = sp.symbols('x t')
    f = 3 * x - 2
    assert f.subs(x, 0) == -2 and sp.solve(f, x) == [F(2, 3)]
    assert F(11 - 2, 4 - 1) == 3 and F(4 - 1, 11 - 2) == F(1, 3)
    assert (-2 * x + 5).coeff(x) == -2
    assert (2 * x + 1).coeff(x) == 2 and (2 * x - 4).coeff(x) == 2
    assert sp.Integer(4).coeff(x) == 0 if hasattr(sp.Integer(4), 'coeff') else True
    assert sp.solve(3 * x - 9, x) == [3] and (3 * x - 9).subs(x, 3) == 0
    # direkte Proportionalitaet
    assert F(750, 100) / 3 == F(5, 2) and 5 * F(5, 2) == F(25, 2)
    assert abs(float(F(25, 2)) - 12.5) < 1e-9
    assert F(5, 2) == F(10, 4) == F(15, 6)
    assert (2 * x + 3).subs(x, 0) == 3 and (2 * x + 3).subs(x, 1) == 5 and (2 * x + 3).subs(x, 2) == 7
    assert 2 * 5 != 7
    # Anwendungen
    K = F(220, 100) * x + F(350, 100)
    assert K.subs(x, 0) == F(350, 100) and K.subs(x, 12) == F(2990, 100)
    assert F(220, 100) * 12 == F(2640, 100) and F(2640, 100) + F(350, 100) == F(2990, 100)
    assert sp.solve(sp.Eq(F(1, 2) * x + 20, 60), x) == [80] and F(1, 2) * 80 + 20 == 60
    a = F(3, 10) * x + 12; b = F(5, 10) * x + 6
    assert sp.solve(sp.Eq(a, b), x) == [30] and a.subs(x, 30) == 21 and b.subs(x, 30) == 21
    assert a.subs(x, 10) > b.subs(x, 10) and a.subs(x, 50) < b.subs(x, 50)
    assert F(150 - 0, 2 - 0) == 75
    V = 200 - 15 * t
    assert V.subs(t, 0) == 200 and sp.solve(V, t) == [F(40, 3)] and abs(float(F(40, 3)) - 13.3) < 0.04
    assert (4 * x + 250).subs(x, 0) == 250


Q.verify(check)
Q.save()
