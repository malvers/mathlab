#!/usr/bin/env python3
"""Aufgaben OS Mathe 10 (Realschule), Woche 15 / KW 50: Vorbereitung Klassenarbeit 2 –
Funktionale Zusammenhänge (LB 2 gemischt). Plan: HTML/svp/mathe/mathe10.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os10

Q = os10(nr=15, slug='ka2', thema='Klassenarbeit 2: Funktionale Zusammenhänge', lb='KA 2',
         blurb='gemischte Aufgaben zu Potenz-, Exponential- und Sinusfunktionen zur Vorbereitung auf die Klassenarbeit',
         comment='Blocks: power functions (1-5), exponential functions (6-10), sine functions (11-16), function types and comparison (17-20).')

# ------------------------------------------------------ Potenzfunktionen ----
Q.q(r'Berechne $f(-3)$ für $f(x) = x^3$.',
    [r'$-27$', r'27', r'$-9$', r'9'],
    [r'$(-3)^3 = (-3) \cdot (-3) \cdot (-3) = -27$'])

Q.q(r'Berechne $f(0{,}5)$ für $f(x) = \dfrac{1}{x}$.',
    [r'2', r'0,5', r'0,2', r'5'],
    [r'$\dfrac{1}{0{,}5} = 2$ – durch einen halben teilen heißt verdoppeln.'])

Q.q(r'Welche Funktion ist achsensymmetrisch zur y-Achse?',
    [r'$y = \dfrac{1}{x^2}$', r'$y = x^3$', r'$y = \dfrac{1}{x}$', r'$y = 2^x$'],
    [r'Achsensymmetrie zur y-Achse: $f(-x) = f(x)$.', r'$\dfrac{1}{(-x)^2} = \dfrac{1}{x^2}$ – bei den anderen ändert sich der Wert.'])

Q.q(r'Der Graph von $y = a \cdot x^2$ geht durch $(-2 \mid 12)$. Bestimme $a$.',
    [r'3', r'$-3$', r'6', r'$-6$'],
    [r'$12 = a \cdot (-2)^2 = 4a$', r'$a = 3$'])

Q.q(r'Für welche $x$ ist $y = x^{-1}$ nicht definiert?',
    [r'für $x = 0$', r'für $x < 0$', r'für $x = 1$', r'für $x > 0$'],
    [r'$x^{-1} = \dfrac{1}{x}$', r'Durch null kann man nicht teilen.'])

# -------------------------------------------------- Exponentialfunktionen ----
Q.q(r'2000 € werden 4 Jahre lang zu 2,5 % mit Zinseszins angelegt. Wie hoch ist das Guthaben dann (gerundet)?',
    [r'2207,63 €', r'2200,00 €', r'2205,00 €', r'2050,00 €'],
    [r'$2000 \cdot 1{,}025^4 \approx 2000 \cdot 1{,}10381 \approx 2207{,}63$ €',
     r'Ohne Zinseszins: $2000 + 4 \cdot 50 = 2200$ €.'])

Q.q(r'Cäsium-137 hat eine Halbwertszeit von etwa 30 Jahren. Wie viel bleibt von 100 g nach 90 Jahren?',
    [r'12,5 g', r'25 g', r'33,3 g', r'10 g'],
    [r'90 Jahre sind drei Halbwertszeiten.', r'$100 \cdot 0{,}5^3 = 12{,}5$ g'])

Q.q(r'Ein Bestand nimmt jährlich um 15 % ab. Wie heißt der Faktor?',
    [r'0,85', r'0,15', r'1,15', r'$-0{,}15$'],
    [r'Es bleiben $85\,\%$ übrig.'])

Q.q(r'Eine Messreihe lautet 400, 360, 324, … Um wie viel Prozent nimmt der Wert pro Schritt ab?',
    [r'um 10 %', r'um 40 %', r'um 36 %', r'um 0,9 %'],
    [r'$\dfrac{360}{400} = 0{,}9$ und $\dfrac{324}{360} = 0{,}9$', r'Faktor $0{,}9$: Abnahme um $10\,\%$ pro Schritt.'])

Q.q(r'Der Graph von $y = c \cdot a^x$ geht durch $(0 \mid 3)$ und $(1 \mid 6)$. Wie lautet die Gleichung?',
    [r'$y = 3 \cdot 2^x$', r'$y = 6 \cdot 3^x$', r'$y = 3 + 3x$', r'$y = 2 \cdot 3^x$'],
    [r'Bei $x = 0$: $c = 3$.', r'Bei $x = 1$: $3 \cdot a = 6$, also $a = 2$.'])

# --------------------------------------------------------- Sinusfunktionen ----
Q.q(r'Wie viel sind $45^\circ$ im Bogenmaß?',
    [r'$\dfrac{\pi}{4}$', r'$\dfrac{\pi}{2}$', r'$\dfrac{\pi}{8}$', r'45'],
    [r'$45^\circ$ ist ein Viertel von $180^\circ$: $\dfrac{\pi}{4}$.'])

Q.q(r'Welche Periode hat $y = 3 \sin(4x)$?',
    [r'$\dfrac{\pi}{2}$', r'$\dfrac{2\pi}{3}$', r'$8\pi$', r'$\dfrac{\pi}{4}$'],
    [r'Periode $= \dfrac{2\pi}{4} = \dfrac{\pi}{2}$', r'Der Faktor 3 ist die Amplitude, nicht die Periode.'])

Q.q(r'Welche Amplitude hat $y = 0{,}5 \sin(2x)$?',
    [r'0,5', r'2', r'1', r'$\pi$'],
    [r'Die Amplitude ist der Faktor vor dem Sinus.'])

Q.q(r'Welchen Wert hat $\sin \pi$?',
    [r'0', r'1', r'$-1$', r'3,14'],
    [r'$\pi$ entspricht $180^\circ$: der Punkt $(-1 \mid 0)$ am Einheitskreis hat die y-Koordinate 0.'])

Q.q(r'Der Wasserstand an einem Hafen schwankt zwischen 1 m bei Ebbe und 5 m bei Flut. Wie groß ist die Amplitude?',
    [r'2 m', r'4 m', r'3 m', r'5 m'],
    [r'Die Mittellinie liegt bei $\dfrac{1 + 5}{2} = 3$ m.', r'Amplitude: Abstand der Mittellinie zum höchsten Stand, $5 - 3 = 2$ m.'])

Q.q(r'Hochwasser ist um 6:00 Uhr und das nächste um 18:24 Uhr. Wie lang ist die Periode?',
    [r'12 h 24 min', r'6 h 12 min', r'24 h', r'18 h 24 min'],
    [r'Von Hochwasser zu Hochwasser vergeht eine volle Periode: von 6:00 bis 18:24 Uhr sind es 12 h 24 min.'])

# -------------------------------------------- Funktionstypen und Vergleich ----
Q.q(r'Ein Handytarif kostet 10 € Grundgebühr plus 0,09 € pro Minute. Welcher Funktionstyp beschreibt die Kosten?',
    [r'linear', r'quadratisch', r'exponentiell', r'periodisch'],
    [r'$K(t) = 0{,}09 t + 10$: jede Minute kostet gleich viel dazu.', r'Gerade mit Anstieg 0,09 und y-Achsenabschnitt 10.'])

Q.q(r'Welcher Graph geht durch $(0 \mid 1)$ und hat die x-Achse als Asymptote?',
    [r'$y = 2^x$', r'$y = x^2$', r'$y = \dfrac{1}{x}$', r'$y = \sin x$'],
    [r'$2^0 = 1$, und für sehr kleine $x$ nähert sich $2^x$ der Null.', r'$y = \dfrac{1}{x}$ hat zwar Asymptoten, ist aber bei $x = 0$ gar nicht definiert.'])

Q.q(r'Welcher Wert ist für $x = 5$ größer: $x^2$ oder $2^x$?',
    [r'$2^x$, denn $32 > 25$', r'$x^2$, denn $25 > 10$', r'beide sind gleich', r'$x^2$, denn $25 > 2^5$'],
    [r'$5^2 = 25$ und $2^5 = 32$.', r'Auf lange Sicht wächst die Exponentialfunktion schneller als jede Potenzfunktion.'])

Q.q(r'Eine Lampe beleuchtet in 2 m Abstand mit 900 Lux. Die Beleuchtungsstärke nimmt mit dem Quadrat des Abstands ab. Wie groß ist sie in 6 m Abstand?',
    [r'100 Lux', r'300 Lux', r'150 Lux', r'2700 Lux'],
    [r'Der Abstand wird verdreifacht, die Beleuchtungsstärke sinkt auf $\dfrac{1}{3^2} = \dfrac{1}{9}$.', r'$900 : 9 = 100$ Lux'])


def check():
    from math import pi
    R = lambda x, n=2: round(x, n)
    assert (-3) ** 3 == -27 and 1 / 0.5 == 2
    assert 12 / (-2) ** 2 == 3
    assert R(2000 * 1.025 ** 4) == 2207.63 and 2000 + 4 * 50 == 2200
    assert 100 * 0.5 ** 3 == 12.5
    assert 360 / 400 == 0.9 and 324 / 360 == 0.9
    assert 6 / 3 == 2
    assert R(2 * pi / 4) == R(pi / 2)
    assert (1 + 5) / 2 == 3 and 5 - 3 == 2
    assert (18 * 60 + 24) - 6 * 60 == 12 * 60 + 24
    assert 5 ** 2 == 25 and 2 ** 5 == 32
    assert 900 / (6 / 2) ** 2 == 100


Q.verify(check)
Q.save()
