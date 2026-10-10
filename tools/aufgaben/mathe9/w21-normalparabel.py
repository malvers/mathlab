#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 21 / KW 4 (LB 3): die Normalparabel y = x² -
Wertetabelle, Graph, Definitions- und Wertebereich, Symmetrie. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=21, slug='normalparabel', thema='Die Normalparabel', lb='LB 3',
        blurb='y = x², Wertetabelle und Graph, Scheitelpunkt, Symmetrie, Definitions- und Wertebereich',
        comment='Blocks: values and points (1, 5-6, 10, 17-18), properties (2-4, 11-14, 19-20), context (7-9), growth pattern (15-16). Rule of thumb in 8-9 from driving school.')

# --------------------------------------------------------------- Werte ----
Q.q(r'Welchen Funktionswert hat $f(x) = x^2$ an der Stelle $x = -3$?',
    [r'9', r'−9', r'−6', r'6'],
    [r'$(-3)^2 = (-3) \cdot (-3) = 9$'])

Q.q(r'Welche Koordinaten hat der Scheitelpunkt der Normalparabel $y = x^2$?',
    [r'$S(0 \mid 0)$', r'$S(1 \mid 1)$', r'$S(0 \mid 1)$', r'Sie hat keinen Scheitelpunkt.'],
    [r'Der kleinste Funktionswert ist 0, er wird bei $x = 0$ angenommen.'])

Q.q(r'Zu welcher Geraden ist die Normalparabel symmetrisch?',
    [r'zur $y$-Achse', r'zur $x$-Achse', r'zur Geraden $y = x$', r'zu keiner Geraden'],
    [r'$(-x)^2 = x^2$: Zu $x$ und $-x$ gehört derselbe Wert.',
     r'Der Graph ist deshalb spiegelsymmetrisch zur $y$-Achse.'])

Q.q(r'Welchen Definitions- und Wertebereich hat $f(x) = x^2$?',
    [r'$D$: alle Zahlen, $W$: alle $y \geq 0$', r'$D$: alle $x \geq 0$, $W$: alle Zahlen',
     r'$D$ und $W$: alle Zahlen', r'$D$: alle Zahlen, $W$: alle $y > 0$'],
    [r'Jede Zahl kann man quadrieren.',
     r'Quadrate sind nie negativ, 0 wird bei $x = 0$ erreicht.'])

Q.q(r'Welcher Punkt liegt auf der Normalparabel?',
    [r'$(-4 \mid 16)$', r'$(-4 \mid -16)$', r'$(16 \mid 4)$', r'$(4 \mid 8)$'],
    [r'$(-4)^2 = 16$',
     r'$(16 \mid 4)$ liegt auf der gespiegelten Kurve, nicht auf der Parabel.'])

Q.q(r'Welcher Wert gehört in der Wertetabelle von $y = x^2$ zu $x = 1{,}5$?',
    [r'2,25', r'3', r'1,25', r'2,5'],
    [r'$1{,}5^2 = 1{,}5 \cdot 1{,}5 = 2{,}25$'])

# ---------------------------------------------------------------- Kontext ----
Q.q(r'Der Flächeninhalt eines Quadrats ist $A(a) = a^2$. Wie groß ist er für $a = 7$ cm?',
    [r'49 cm²', r'14 cm²', r'28 cm²', r'7 cm²'],
    [r'$A = 7^2 = 49$ cm²',
     r'Der Flächeninhalt hängt quadratisch von der Seitenlänge ab.'])

Q.q(r'Eine Faustregel der Fahrschule sagt: Bremsweg in m $= \left(\dfrac{v}{10}\right)^2$ ($v$ in km/h). Wie lang ist der Bremsweg bei 50 km/h?',
    [r'25 m', r'5 m', r'50 m', r'10 m'],
    [r'$\left(\dfrac{50}{10}\right)^2 = 5^2 = 25$ m'])

Q.q(r'Wie ändert sich der Bremsweg nach dieser Faustregel, wenn man doppelt so schnell fährt?',
    [r'Er wird 4-mal so lang.', r'Er wird doppelt so lang.', r'Er bleibt gleich.', r'Er wird 8-mal so lang.'],
    [r'$\left(\dfrac{2v}{10}\right)^2 = 4 \cdot \left(\dfrac{v}{10}\right)^2$',
     r'Bei 100 km/h: 100 m statt 25 m.'])

Q.q(r'Für welche $x$ gilt $x^2 = 49$?',
    [r'$x = 7$ und $x = -7$', r'nur $x = 7$', r'$x = 24{,}5$', r'für kein $x$'],
    [r'$7^2 = 49$ und $(-7)^2 = 49$.',
     r'Die waagerechte Gerade $y = 49$ schneidet die Parabel zweimal.'])

Q.q(r'Wie verhält sich $y = x^2$ für $x < 0$?',
    [r'fallend', r'steigend', r'konstant', r'mal steigend, mal fallend'],
    [r'Beispiel: $x = -3, -2, -1$ ergibt $y = 9, 4, 1$.',
     r'Wenn $x$ wächst, wird $y$ kleiner, bis zum Scheitel.'])

Q.q(r'Welche Nullstelle hat $y = x^2$?',
    [r'$x = 0$', r'$x = 1$', r'$x = 0$ und $x = 1$', r'keine'],
    [r'$x^2 = 0$ gilt nur für $x = 0$.',
     r'Die Parabel berührt die $x$-Achse im Scheitelpunkt.'])

Q.q(r'Kann $y = x^2$ einen negativen Wert annehmen?',
    [r'Nein, Quadrate sind nie negativ.', r'Ja, für negative $x$.', r'Ja, für $x$ zwischen 0 und 1.', r'Ja, für $x = -1$.'],
    [r'Minus mal minus ergibt plus, plus mal plus auch.',
     r'Für $0 < x < 1$ wird $x^2$ kleiner als $x$, bleibt aber positiv.'])

Q.q(r'Welche Aussage über $f(x) = x^2$ stimmt?',
    [r'$f(x)$ und $f(-x)$ sind immer gleich.', r'$f(-x) = -f(x)$', r'$f(x) = 2x$', r'$f(2) = 2$'],
    [r'$(-x)^2 = x^2$, das ist die Achsensymmetrie.'])

# ------------------------------------------------------------ Wachstum ----
Q.q(r'Ist $y = x^2$ eine lineare Funktion?',
    [r'Nein, die Zunahmen 1, 3, 5, 7, … sind nicht gleich.', r'Ja, der Graph ist eine Gerade.',
     r'Ja, weil sie durch den Ursprung geht.', r'Nein, weil sie negative Werte hat.'],
    [r'Für $x = 0, 1, 2, 3, 4$ ist $y = 0, 1, 4, 9, 16$.',
     r'Bei einer linearen Funktion wären die Zunahmen gleich groß.'])

Q.q(r'Um wie viel wachsen die Quadratzahlen 0, 1, 4, 9, 16, 25, … jeweils?',
    [r'um die ungeraden Zahlen 1, 3, 5, 7, 9', r'immer um 2', r'immer um 4', r'um die geraden Zahlen 2, 4, 6, 8'],
    [r'$1 - 0 = 1$, $4 - 1 = 3$, $9 - 4 = 5$, …',
     r'Allgemein: $(x + 1)^2 - x^2 = 2x + 1$.'])

Q.q(r'Liegt der Punkt $(0{,}5 \mid 0{,}25)$ auf der Normalparabel?',
    [r'Ja, denn $0{,}5^2 = 0{,}25$.', r'Nein, denn $0{,}5^2 = 1$.', r'Nein, denn $0{,}5 \cdot 2 = 1$.', r'Nur ungefähr.'],
    [r'$0{,}5 \cdot 0{,}5 = 0{,}25$'])

Q.q(r'In welchen Punkten schneidet die Gerade $y = 4$ die Normalparabel?',
    [r'$(-2 \mid 4)$ und $(2 \mid 4)$', r'nur $(2 \mid 4)$', r'$(4 \mid 16)$', r'$(-4 \mid 4)$ und $(4 \mid 4)$'],
    [r'$x^2 = 4$, also $x = 2$ oder $x = -2$.'])

Q.q(r'Was bedeutet „$y = x^2$ ist für $x < 0$ fallend“?',
    [r'Wenn $x$ größer wird, wird $y$ kleiner.', r'Die $y$-Werte sind negativ.',
     r'Wenn $x$ größer wird, wird $y$ größer.', r'Die Parabel liegt unter der $x$-Achse.'],
    [r'Fallend beschreibt die Richtung der Änderung, nicht das Vorzeichen der Werte.'])

Q.q(r'Wie heißt der Graph der Funktion $y = x^2$?',
    [r'Normalparabel', r'Hyperbel', r'Normalgerade', r'Kreis'],
    [r'Er ist die „normale“ Parabel, aus der alle anderen durch Strecken und Verschieben entstehen.'])


def check():
    f = lambda x: x * x
    assert f(-3) == 9 and f(-4) == 16 and f(1.5) == 2.25 and f(7) == 49
    assert (50 / 10) ** 2 == 25 and (100 / 10) ** 2 == 4 * 25
    assert f(7) == f(-7) == 49 and [f(x) for x in (-3, -2, -1)] == [9, 4, 1]
    assert [f(x + 1) - f(x) for x in range(5)] == [1, 3, 5, 7, 9]
    assert f(0.5) == 0.25 and f(2) == f(-2) == 4


Q.verify(check)
Q.save()
