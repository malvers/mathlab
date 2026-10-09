#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 18 / KW 1 (LB 1): finding function equations by regression -
choosing a model, reading results, limits of a model. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=18, slug='regression', thema='Funktionsgleichungen durch Regression', lb='LB 1',
         blurb='Modelltyp wählen, Regression deuten, Grenzen des Modells',
         comment='Blocks: choosing the model type (1-6), exact models from data (7-11), reading regression results (12-16), limits of models (17-20).')

# ------------------------------------------------- choosing the model type ----
Q.q(r'Messwerte wachsen in gleichen Zeitschritten immer um denselben Betrag. Welcher Modelltyp passt?',
    [r'Linear', r'Exponentiell', r'Quadratisch', r'Sinusförmig'],
    [r'Konstante Differenzen kennzeichnen lineares Wachstum.'])

Q.q(r'Messwerte wachsen in gleichen Zeitschritten immer um denselben Faktor. Welcher Modelltyp passt?',
    [r'Exponentiell', r'Linear', r'Quadratisch', r'Logarithmisch'],
    [r'Konstante Quotienten kennzeichnen exponentielles Wachstum.'])

Q.q(r'Bei den Werten 1, 2, 5, 10, 17 sind die Differenzen 1, 3, 5, 7. Welcher Modelltyp passt?',
    [r'Quadratisch', r'Linear', r'Exponentiell', r'Kubisch'],
    [r'Die Differenzen der Differenzen sind konstant (2).',
     r'Das kennzeichnet eine quadratische Funktion.'])

Q.q(r'Der Tagesverlauf der Wassertiefe in einem Hafen soll modelliert werden. Welcher Typ ist geeignet?',
    [r'$f(t) = a \sin(b(t - c)) + d$', r'$f(t) = at + b$', r'$f(t) = a \cdot e^{kt}$', r'$f(t) = at^2 + bt + c$'],
    [r'Ebbe und Flut wiederholen sich periodisch.',
     r'Periodische Vorgänge beschreibt man mit Sinusfunktionen (Kl. 10).'])

Q.q(r'Ein Getränk kühlt auf Raumtemperatur ab. Welcher Modelltyp passt am besten?',
    [r'$T(t) = T_R + a \cdot e^{-kt}$ mit Raumtemperatur $T_R$', r'$T(t) = at + b$', r'$T(t) = a \cdot e^{kt}$ mit $k > 0$', r'$T(t) = at^2$'],
    [r'Die Temperatur nähert sich der Raumtemperatur, unterschreitet sie aber nicht.',
     r'Beschränkter Zerfall: Exponentialfunktion mit Asymptote $T_R$.'])

Q.q(r'Was macht eine Regression?',
    [r'Sie bestimmt die Parameter eines gewählten Funktionstyps so, dass er möglichst gut zu den Messpunkten passt.',
     r'Sie findet immer eine Funktion, die exakt durch alle Punkte geht.', r'Sie wählt den richtigen Funktionstyp selbst aus.',
     r'Sie berechnet Nullstellen.'],
    [r'Den Typ wählt man selbst, das CAS passt die Parameter an.',
     r'Gütemaß: Die Summe der quadrierten Abweichungen wird möglichst klein (Methode der kleinsten Quadrate).'])

# ----------------------------------------------- exact models from data ----
Q.q(r'Welche lineare Funktion geht durch $(1 \mid 3)$, $(2 \mid 5)$ und $(3 \mid 7)$?',
    [r'$y = 2x + 1$', r'$y = 3x$', r'$y = x + 2$', r'$y = 2x + 3$'],
    [r'Anstieg: $\dfrac{5 - 3}{2 - 1} = 2$.',
     r'$3 = 2 \cdot 1 + n \Rightarrow n = 1$'])

Q.q(r'Welche Exponentialfunktion passt zu $(0 \mid 2)$, $(1 \mid 6)$, $(2 \mid 18)$?',
    [r'$y = 2 \cdot 3^x$', r'$y = 3 \cdot 2^x$', r'$y = 2 + 4x$', r'$y = 6^x$'],
    [r'Startwert $a = 2$.',
     r'Faktor pro Schritt: $\dfrac{6}{2} = \dfrac{18}{6} = 3$.'])

Q.q(r'Welche Funktion passt zu $(0 \mid 1)$, $(1 \mid 2)$, $(2 \mid 5)$, $(3 \mid 10)$?',
    [r'$y = x^2 + 1$', r'$y = 2^x$', r'$y = 3x + 1$', r'$y = x^3 + 1$'],
    [r'Differenzen 1, 3, 5: quadratisch.',
     r'Probe: $3^2 + 1 = 10$.'])

Q.q(r'Eine Gerade geht durch $(2 \mid 10)$ und $(6 \mid 22)$. Wie lautet sie?',
    [r'$y = 3x + 4$', r'$y = 3x$', r'$y = 4x + 2$', r'$y = 2x + 6$'],
    [r'$m = \dfrac{22 - 10}{6 - 2} = 3$',
     r'$10 = 3 \cdot 2 + n \Rightarrow n = 4$'])

Q.q(r'Ein Bestand ist 200, 240, 288 in aufeinanderfolgenden Jahren. Wie groß ist das jährliche Wachstum?',
    [r'20 %', r'40 %', r'2 %', r'24 %'],
    [r'$\dfrac{240}{200} = \dfrac{288}{240} = 1{,}2$',
     r'Wachstumsfaktor 1,2 bedeutet 20 % Zunahme pro Jahr.'])

# --------------------------------------------- reading regression results ----
Q.q(r'Das CAS liefert für eine lineare Regression das Bestimmtheitsmaß $r^2 = 0{,}98$. Was bedeutet das?',
    [r'Das lineare Modell beschreibt die Daten sehr gut.', r'Das Modell trifft 98 % der Punkte exakt.',
     r'Das Modell ist ungeeignet.', r'Der Anstieg ist 0,98.'],
    [r'$r^2$ liegt zwischen 0 und 1.',
     r'Je näher an 1, desto weniger streuen die Punkte um das Modell.'])

Q.q(r'Eine Regression liefert $y = 1{,}5x + 2$. Welchen Wert sagt das Modell für $x = 10$ voraus?',
    [r'17', r'15', r'12', r'3,5'],
    [r'$1{,}5 \cdot 10 + 2 = 17$'])

Q.q(r'Eine exponentielle Regression liefert $y = 3 \cdot 2^x$. Welchen Wert erwartet man für $x = 4$?',
    [r'48', r'24', r'14', r'1296'],
    [r'$2^4 = 16$',
     r'$3 \cdot 16 = 48$'])

Q.q(r'Ein Zerfall wird durch $N(t) = 100 \cdot 0{,}5^{\frac{t}{8}}$ beschrieben ($t$ in Tagen). Wie groß ist die Halbwertszeit?',
    [r'8 Tage', r'0,5 Tage', r'50 Tage', r'4 Tage'],
    [r'Nach $t = 8$ ist der Exponent 1: $N(8) = 100 \cdot 0{,}5 = 50$.',
     r'Die Hälfte ist nach 8 Tagen erreicht.'])

Q.q(r'Was ist ein Residuum?',
    [r'Die Abweichung zwischen Messwert und Modellwert an einer Stelle.', r'Der Startwert des Modells.',
     r'Die Steigung der Regressionsgeraden.', r'Ein Messfehler des Geräts.'],
    [r'Residuum = gemessen minus berechnet.',
     r'Die Regression macht die Summe der quadrierten Residuen möglichst klein.'])

# ------------------------------------------------------- limits of models ----
Q.q(r'Eine lineare Regression beschreibt das Wachstum eines Kindes von 2 bis 10 Jahren gut. Warum sollte man damit nicht die Größe mit 40 Jahren vorhersagen?',
    [r'Das Modell gilt nur im Bereich der Daten; weit außerhalb (Extrapolation) ist es unzuverlässig.',
     r'Weil lineare Funktionen für große $x$ nicht definiert sind.', r'Weil $r^2$ dann negativ wird.', r'Man darf es, das Modell gilt immer.'],
    [r'Menschen wachsen nicht lebenslang gleichmäßig.',
     r'Vorhersagen weit außerhalb der Messdaten sind riskant.'])

Q.q(r'Durch 5 Messpunkte geht immer genau eine ganzrationale Funktion höchstens vierten Grades. Warum ist sie trotzdem oft kein gutes Modell?',
    [r'Sie folgt auch den Messschwankungen und schwingt zwischen und außerhalb der Punkte stark.', r'Weil sie nicht durch alle Punkte geht.',
     r'Weil ganzrationale Funktionen nie Modelle sein können.', r'Weil das CAS sie nicht berechnen kann.'],
    [r'Ein gutes Modell gibt den Trend wieder, nicht jede Zufallsschwankung.',
     r'Man spricht von Überanpassung.'])

Q.q(r'Ein Wachstum wird exponentiell modelliert. Welche Grenze des Modells ist typisch?',
    [r'Reale Bestände wachsen nicht unbegrenzt; irgendwann wird das Wachstum gebremst.', r'Exponentialfunktionen haben Polstellen.',
     r'Exponentielle Modelle können nur fallen.', r'Es gibt keine Grenzen.'],
    [r'Platz, Nahrung oder Markt sind begrenzt.',
     r'Dann passt beschränktes oder logistisches Wachstum besser.'])

Q.q(r'Ein Modell $y = a \cdot e^{kx}$ hat $a = 5$ und $k = 0{,}2$. Welchen Wert liefert es für $x = 5$?',
    [r'etwa 13,6', r'etwa 5,0', r'etwa 6,0', r'etwa 27,2'],
    [r'$5 \cdot e^{0{,}2 \cdot 5} = 5e$',
     r'$5 \cdot 2{,}718 \approx 13{,}6$'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    data = [1, 2, 5, 10, 17]
    diffs = [b - a for a, b in zip(data, data[1:])]
    assert diffs == [1, 3, 5, 7] and len({b - a for a, b in zip(diffs, diffs[1:])}) == 1
    assert all((2 * v + 1) == w for v, w in ((1, 3), (2, 5), (3, 7)))
    assert all(2 * 3 ** v == w for v, w in ((0, 2), (1, 6), (2, 18)))
    assert all(v ** 2 + 1 == w for v, w in ((0, 1), (1, 2), (2, 5), (3, 10)))
    assert sp.Rational(22 - 10, 6 - 2) == 3 and 10 - 3 * 2 == 4
    assert sp.Rational(240, 200) == sp.Rational(288, 240) == sp.Rational(6, 5)
    assert sp.Rational(3, 2) * 10 + 2 == 17 and 3 * 2 ** 4 == 48
    assert 100 * sp.Rational(1, 2) ** sp.Rational(8, 8) == 50
    assert abs(float(5 * sp.exp(sp.Rational(1, 5) * 5)) - 13.59) < 0.01


Q.verify(check)
Q.save()
