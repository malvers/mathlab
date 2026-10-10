#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 10 / KW 45 (LB 2): Potenzfunktionen mit
negativen Exponenten, y = 1/x und y = 1/x². Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=10, slug='potenzfunktionen-negativ', thema='Potenzfunktionen mit negativen Exponenten', lb='LB 2',
         blurb='Hyperbeln, Definitionsbereich, Symmetrie, Asymptoten, umgekehrte Proportionalität',
         comment='Blocks: values and notation (1-2, 9, 14), domain, symmetry, asymptotes (3-8, 15-16, 19-20), parameter and context (10-13, 17-18).')

Q.q(r'Gegeben ist $f(x) = \dfrac{1}{x}$. Berechne $f(4)$.',
    [r'0,25', r'4', r'$-4$', r'0,4'],
    [r'$f(4) = \dfrac{1}{4} = 0{,}25$'])

Q.q(r'Gegeben ist $f(x) = x^{-2}$. Berechne $f(-2)$.',
    [r'0,25', r'$-0{,}25$', r'$-4$', r'4'],
    [r'$x^{-2} = \dfrac{1}{x^2}$', r'$f(-2) = \dfrac{1}{(-2)^2} = \dfrac{1}{4} = 0{,}25$ – das Quadrat ist positiv.'])

Q.q(r'Für welche Zahlen ist $y = \dfrac{1}{x}$ definiert?',
    [r'für alle Zahlen außer 0', r'nur für positive Zahlen', r'für alle Zahlen', r'nur für ganze Zahlen'],
    [r'Durch 0 kann man nicht teilen.', r'Jede andere Zahl darf eingesetzt werden, auch negative und Brüche.'])

Q.q(r'Welche Symmetrie hat der Graph von $y = \dfrac{1}{x}$?',
    [r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur y-Achse', r'achsensymmetrisch zur x-Achse', r'keine'],
    [r'$\dfrac{1}{-x} = -\dfrac{1}{x}$', r'Die beiden Äste liegen im I. und III. Quadranten und gehen durch eine halbe Drehung ineinander über.'])

Q.q(r'Welche Symmetrie hat der Graph von $y = \dfrac{1}{x^2}$?',
    [r'achsensymmetrisch zur y-Achse', r'punktsymmetrisch zum Ursprung', r'achsensymmetrisch zur x-Achse', r'keine'],
    [r'$\dfrac{1}{(-x)^2} = \dfrac{1}{x^2}$', r'Beide Äste liegen oberhalb der x-Achse, spiegelbildlich zur y-Achse.'])

Q.q(r'Was passiert mit $y = \dfrac{1}{x}$, wenn $x$ sehr groß wird?',
    [r'$y$ nähert sich 0, wird aber nie 0.', r'$y$ wird ebenfalls sehr groß.', r'$y$ wird genau 0.', r'$y$ wird negativ.'],
    [r'$\dfrac{1}{100} = 0{,}01$, $\dfrac{1}{1\,000\,000} = 0{,}000\,001$', r'Die x-Achse ist eine Asymptote: der Graph kommt ihr beliebig nahe, ohne sie zu erreichen.'])

Q.q(r'Was passiert mit $y = \dfrac{1}{x}$, wenn $x$ von rechts immer näher an 0 heranrückt?',
    [r'$y$ wird beliebig groß.', r'$y$ nähert sich 0.', r'$y$ nähert sich 1.', r'$y$ wird negativ.'],
    [r'$\dfrac{1}{0{,}1} = 10$, $\dfrac{1}{0{,}001} = 1000$', r'Der Graph schmiegt sich an die y-Achse – auch sie ist eine Asymptote.'])

Q.q(r'Welche y-Werte nimmt $y = \dfrac{1}{x^2}$ an?',
    [r'nur positive Zahlen', r'alle Zahlen außer 0', r'alle Zahlen größer oder gleich 0', r'nur negative Zahlen'],
    [r'$x^2$ ist für $x \neq 0$ positiv, also auch $\dfrac{1}{x^2}$.', r'Der Wert 0 wird nie erreicht.'])

Q.q(r'Wie schreibt man $\dfrac{1}{x^3}$ als Potenz?',
    [r'$x^{-3}$', r'$-x^3$', r'$x^{\frac{1}{3}}$', r'$3^{-x}$'],
    [r'Ein negativer Exponent bedeutet den Kehrwert: $x^{-n} = \dfrac{1}{x^n}$.'])

Q.q(r'Für eine Strecke von 120 km braucht man bei der Geschwindigkeit $v$ die Zeit $t = \dfrac{120}{v}$. Wie lange dauert die Fahrt mit 40 km/h?',
    [r'3 h', r'4800 h', r'80 h', r'0,3 h'],
    [r'$t = \dfrac{120}{40} = 3$, also 3 Stunden.'])

Q.q(r'Was passiert bei $t = \dfrac{120}{v}$ mit der Fahrzeit, wenn man doppelt so schnell fährt?',
    [r'Sie halbiert sich.', r'Sie verdoppelt sich.', r'Sie viertelt sich.', r'Sie bleibt gleich.'],
    [r'Zeit und Geschwindigkeit sind umgekehrt proportional.', r'$\dfrac{120}{2v} = \dfrac{1}{2} \cdot \dfrac{120}{v}$'])

Q.q(r'Die Helligkeit einer Lampe nimmt mit dem Quadrat des Abstands ab: $H = \dfrac{k}{d^2}$. Wie ändert sich die Helligkeit, wenn man den Abstand verdoppelt?',
    [r'Sie wird ein Viertel so groß.', r'Sie wird halb so groß.', r'Sie wird doppelt so groß.', r'Sie bleibt gleich.'],
    [r'$\dfrac{k}{(2d)^2} = \dfrac{k}{4 d^2} = \dfrac{1}{4} \cdot \dfrac{k}{d^2}$'])

Q.q(r'Der Graph von $y = \dfrac{a}{x}$ geht durch $(2 \mid 3)$. Bestimme $a$.',
    [r'6', r'1,5', r'5', r'0,67'],
    [r'Einsetzen: $3 = \dfrac{a}{2}$', r'$a = 3 \cdot 2 = 6$'])

Q.q(r'Welcher Punkt liegt auf dem Graphen von $y = \dfrac{1}{x^2}$?',
    [r'$(0{,}5 \mid 4)$', r'$(0{,}5 \mid 2)$', r'$(-2 \mid -0{,}25)$', r'$(2 \mid 4)$'],
    [r'$\dfrac{1}{0{,}5^2} = \dfrac{1}{0{,}25} = 4$', r'Bei $(-2 \mid -0{,}25)$ stimmt das Vorzeichen nicht: der Graph liegt ganz oberhalb der x-Achse.'])

Q.q(r'Wie verhält sich $y = \dfrac{1}{x}$ für $x > 0$?',
    [r'Die Funktion fällt.', r'Die Funktion steigt.', r'Sie ist konstant.', r'Sie fällt erst und steigt dann.'],
    [r'$x = 1 \to 1$, $x = 2 \to 0{,}5$, $x = 4 \to 0{,}25$', r'Je größer $x$, desto kleiner $y$.'])

Q.q(r'Wie verhält sich $y = \dfrac{1}{x^2}$ für $x < 0$?',
    [r'Die Funktion steigt.', r'Die Funktion fällt.', r'Sie ist konstant.', r'Sie fällt erst und steigt dann.'],
    [r'$x = -3 \to \dfrac{1}{9}$, $x = -2 \to \dfrac{1}{4}$, $x = -1 \to 1$', r'Von links nach rechts werden die Werte größer – Spiegelbild des fallenden rechten Astes.'])

Q.q(r'Rechtecke sollen alle 24 cm² Fläche haben. Wie breit ist eines, das 8 cm lang ist?',
    [r'3 cm', r'16 cm', r'192 cm', r'32 cm'],
    [r'$b = \dfrac{24}{a}$ – Länge und Breite sind umgekehrt proportional.', r'$b = \dfrac{24}{8} = 3$ cm'])

Q.q(r'Die Schallintensität einer Schallquelle nimmt mit dem Quadrat des Abstands ab. Auf welchen Bruchteil sinkt sie beim dreifachen Abstand?',
    [r'auf ein Neuntel', r'auf ein Drittel', r'auf ein Sechstel', r'auf ein Siebenundzwanzigstel'],
    [r'$\dfrac{1}{3^2} = \dfrac{1}{9}$'])

Q.q(r'Welcher Graph geht durch $(1 \mid 1)$ und $(-1 \mid 1)$ und liegt ganz oberhalb der x-Achse?',
    [r'$y = \dfrac{1}{x^2}$', r'$y = \dfrac{1}{x}$', r'$y = x^3$', r'$y = -x^2$'],
    [r'$y = \dfrac{1}{x}$ hat bei $x = -1$ den Wert $-1$, ebenso $y = x^3$.', r'$y = -x^2$ liegt unterhalb der x-Achse. Nur $\dfrac{1}{x^2}$ passt.'])

Q.q(r'Wie heißt der Graph von $y = \dfrac{1}{x}$?',
    [r'Hyperbel', r'Parabel', r'Gerade', r'Kreis'],
    [r'Graphen der Potenzfunktionen mit negativen ganzzahligen Exponenten heißen Hyperbeln.',
     r'Sie bestehen aus zwei getrennten Ästen, weil $x = 0$ fehlt.'])


def check():
    from fractions import Fraction as F
    assert F(1, 4) == F(1, 4) and 1 / 4 == 0.25
    assert 1 / (-2) ** 2 == 0.25
    assert all(F(1, -x) == -F(1, x) for x in range(1, 6))
    assert all(F(1, (-x) ** 2) == F(1, x ** 2) for x in range(1, 6))
    assert 1 / 0.1 == 10
    assert 120 / 40 == 3 and 120 / 80 == 1.5
    assert F(1, 2 ** 2) == F(1, 4)
    assert 3 * 2 == 6
    assert 1 / 0.5 ** 2 == 4 and 1 / 2 ** 2 == 0.25
    assert [F(1, x) for x in (1, 2, 4)] == sorted([F(1, x) for x in (1, 2, 4)], reverse=True)
    assert [F(1, x * x) for x in (-3, -2, -1)] == sorted([F(1, x * x) for x in (-3, -2, -1)])
    assert 24 / 8 == 3
    assert F(1, 3 ** 2) == F(1, 9)


Q.verify(check)
Q.save()
