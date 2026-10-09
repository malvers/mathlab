#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 36 / KW 22 (LB 4): expected value, variance and standard
deviation of binomially distributed random variables. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11

Q = gy11(nr=36, slug='erwartungswert-sigma', thema='Erwartungswert, Varianz und Standardabweichung', lb='LB 4',
         blurb='E(X) = n·p, V(X) = n·p·(1 − p), σ; Deutung am Histogramm',
         comment='Blocks: formulas (1-6), contexts (7-11), working backwards (12-13), meaning and histogram (14-20).')

# -------------------------------------------------------------------- formulas ----
Q.q(r'$X$ ist binomialverteilt mit $n = 50$ und $p = 0{,}2$. Bestimme $E(X)$.',
    [r'$E(X) = 10$', r'$E(X) = 8$', r'$E(X) = 0{,}2$', r'$E(X) = 40$'],
    [r'$E(X) = n \cdot p = 50 \cdot 0{,}2$'])

Q.q(r'Mit denselben Werten: Bestimme die Varianz $V(X)$.',
    [r'$V(X) = 8$', r'$V(X) = 10$', r'$V(X) = 0{,}16$', r'$V(X) = 2{,}83$'],
    [r'$V(X) = n \cdot p \cdot (1 - p) = 50 \cdot 0{,}2 \cdot 0{,}8$'])

Q.q(r'Mit denselben Werten: Bestimme die Standardabweichung $\sigma$.',
    [r'$\sigma \approx 2{,}83$', r'$\sigma = 8$', r'$\sigma = 64$', r'$\sigma \approx 3{,}16$'],
    [r'$\sigma = \sqrt{V(X)} = \sqrt{8} \approx 2{,}83$'])

Q.q(r'$n = 100$, $p = 0{,}5$. Bestimme $E(X)$ und $\sigma$.',
    [r'$E(X) = 50$, $\sigma = 5$', r'$E(X) = 50$, $\sigma = 25$', r'$E(X) = 25$, $\sigma = 5$', r'$E(X) = 50$, $\sigma = 0{,}5$'],
    [r'$E(X) = 100 \cdot 0{,}5 = 50$',
     r'$\sigma = \sqrt{100 \cdot 0{,}5 \cdot 0{,}5} = \sqrt{25} = 5$'])

Q.q(r'$n = 20$, $p = 0{,}05$. Bestimme $E(X)$.',
    [r'$E(X) = 1$', r'$E(X) = 0{,}05$', r'$E(X) = 20$', r'$E(X) = 0{,}95$'],
    [r'$20 \cdot 0{,}05 = 1$'])

Q.q(r'Welchen Erwartungswert hat ein einzelnes Bernoulli-Experiment ($n = 1$)?',
    [r'$E(X) = p$', r'$E(X) = 1$', r'$E(X) = 0{,}5$', r'$E(X) = 1 - p$'],
    [r'$E(X) = 0 \cdot (1 - p) + 1 \cdot p = p$'])

# -------------------------------------------------------------------- contexts ----
Q.q(r'Ein Würfel wird 60-mal geworfen. Wie viele Sechsen erwartet man?',
    [r'10', r'6', r'60', r'1'],
    [r'$60 \cdot \dfrac{1}{6} = 10$'])

Q.q(r'Wie groß ist dabei die Standardabweichung der Anzahl der Sechsen?',
    [r'etwa 2,89', r'etwa 8,33', r'10', r'etwa 1,67'],
    [r'$V(X) = 60 \cdot \dfrac{1}{6} \cdot \dfrac{5}{6} = \dfrac{50}{6} \approx 8{,}33$',
     r'$\sigma = \sqrt{8{,}33} \approx 2{,}89$'])

Q.q(r'Ein Test hat 20 Fragen mit je 4 Antworten. Wie viele richtige Antworten erwartet man beim Raten?',
    [r'5', r'4', r'10', r'15'],
    [r'$20 \cdot \dfrac{1}{4} = 5$'])

Q.q(r'2 % der Bauteile sind fehlerhaft. Wie viele fehlerhafte erwartet man unter 1000?',
    [r'20', r'2', r'200', r'980'],
    [r'$1000 \cdot 0{,}02 = 20$'])

Q.q(r'Wie groß ist dabei die Standardabweichung?',
    [r'etwa 4,43', r'etwa 19,6', r'20', r'etwa 0,14'],
    [r'$\sigma = \sqrt{1000 \cdot 0{,}02 \cdot 0{,}98} = \sqrt{19{,}6} \approx 4{,}43$'])

Q.q(r'Eine Münze wird 400-mal geworfen. Bestimme $E(X)$ und $\sigma$ für die Anzahl Kopf.',
    [r'$E(X) = 200$, $\sigma = 10$', r'$E(X) = 200$, $\sigma = 100$', r'$E(X) = 200$, $\sigma = 20$', r'$E(X) = 100$, $\sigma = 10$'],
    [r'$E(X) = 400 \cdot 0{,}5 = 200$',
     r'$V(X) = 400 \cdot 0{,}25 = 100$, $\sigma = \sqrt{100} = 10$'])


# ------------------------------------------------------------ working backwards ----
Q.q(r'Eine binomialverteilte Zufallsgröße hat $n = 40$ und $E(X) = 12$. Wie groß ist $p$?',
    [r'$p = 0{,}3$', r'$p = 0{,}12$', r'$p = 3{,}33$', r'$p = 0{,}4$'],
    [r'$n \cdot p = 12 \Rightarrow p = \dfrac{12}{40}$'])

Q.q(r'Es gilt $E(X) = 6$ und $V(X) = 4{,}2$. Bestimme $p$ und $n$.',
    [r'$p = 0{,}3$, $n = 20$', r'$p = 0{,}7$, $n = 20$', r'$p = 0{,}3$, $n = 6$', r'$p = 0{,}6$, $n = 10$'],
    [r'$\dfrac{V(X)}{E(X)} = 1 - p = \dfrac{4{,}2}{6} = 0{,}7$, also $p = 0{,}3$.',
     r'$n = \dfrac{6}{0{,}3} = 20$'])

# --------------------------------------------------------- meaning and histogram ----
Q.q(r'Was bedeutet $E(X) = 10$ bei 60 Würfen eines Würfels?',
    [r'Im Mittel über viele Serien von 60 Würfen gibt es 10 Sechsen.', r'Bei 60 Würfen gibt es sicher 10 Sechsen.',
     r'Genau 10 Sechsen sind am wahrscheinlichsten und haben über 50 %.', r'Es gibt höchstens 10 Sechsen.'],
    [r'Der Erwartungswert ist ein Mittelwert auf lange Sicht.',
     r'$P(X = 10)$ selbst ist nur etwa 0,14.'])

Q.q(r'Welches Intervall ist die $\sigma$-Umgebung um den Erwartungswert für $n = 100$, $p = 0{,}5$?',
    [r'$[45;\,55]$', r'$[40;\,60]$', r'$[49;\,51]$', r'$[25;\,75]$'],
    [r'$E(X) = 50$, $\sigma = 5$',
     r'$[50 - 5;\,50 + 5]$'])

Q.q(r'Was zeigt eine größere Standardabweichung im Histogramm?',
    [r'Die Balken verteilen sich breiter um den Erwartungswert.', r'Der höchste Balken liegt weiter rechts.',
     r'Alle Balken sind höher.', r'Das Histogramm ist symmetrisch.'],
    [r'$\sigma$ misst die Streuung um $E(X)$.'])

Q.q(r'Für festes $n$: Bei welchem $p$ ist die Varianz am größten?',
    [r'Bei $p = 0{,}5$', r'Bei $p = 1$', r'Bei $p = 0$', r'Bei $p = 0{,}1$'],
    [r'$p(1 - p)$ ist eine nach unten geöffnete Parabel mit Scheitel bei $p = 0{,}5$.',
     r'Bei $p = 0$ oder $p = 1$ gibt es gar keine Streuung.'])

Q.q(r'Was passiert mit $E(X)$ und $\sigma$, wenn man $n$ vervierfacht (gleiches $p$)?',
    [r'$E(X)$ vervierfacht sich, $\sigma$ verdoppelt sich.', r'Beide vervierfachen sich.', r'Beide verdoppeln sich.', r'$E(X)$ verdoppelt sich, $\sigma$ vervierfacht sich.'],
    [r'$E(X) = n \cdot p$ wächst linear mit $n$.',
     r'$\sigma = \sqrt{n \cdot p (1 - p)}$ wächst mit $\sqrt{n}$, also $\sqrt{4} = 2$.'])

Q.q(r'Welche Einheit hat $\sigma$, wenn $X$ die Anzahl defekter Teile zählt?',
    [r'Dieselbe wie $X$: Stück', r'Stück²', r'Prozent', r'Keine, $\sigma$ ist immer eine Wahrscheinlichkeit'],
    [r'Die Varianz hat „Stück²“, die Wurzel daraus wieder „Stück“.',
     r'Deshalb deutet man $\sigma$ und nicht $V(X)$ im Sachzusammenhang.'])


def check():
    from fractions import Fraction as F
    from math import comb, sqrt
    E = lambda n, p: n * p
    V = lambda n, p: n * p * (1 - p)
    assert E(50, F(1, 5)) == 10 and V(50, F(1, 5)) == 8 and abs(sqrt(8) - 2.83) < 0.005
    assert E(100, F(1, 2)) == 50 and V(100, F(1, 2)) == 25
    assert E(20, F(1, 20)) == 1
    assert E(60, F(1, 6)) == 10 and abs(sqrt(V(60, F(1, 6))) - 2.89) < 0.005 and abs(float(V(60, F(1, 6))) - 8.33) < 0.005
    assert E(20, F(1, 4)) == 5 and E(1000, F(1, 50)) == 20 and abs(sqrt(V(1000, F(1, 50))) - 4.43) < 0.005
    assert E(400, F(1, 2)) == 200 and V(400, F(1, 2)) == 100
    assert F(12, 40) == F(3, 10)
    q = F(42, 10) / 6
    assert q == F(7, 10) and F(6) / (1 - q) == 20
    p10 = comb(60, 10) * F(1, 6) ** 10 * F(5, 6) ** 50
    assert abs(float(p10) - 0.137) < 0.001
    assert max((p * (1 - p), p) for p in [F(i, 100) for i in range(101)])[1] == F(1, 2)
    assert E(400, F(3, 10)) == 4 * E(100, F(3, 10)) and V(400, F(3, 10)) == 4 * V(100, F(3, 10))


Q.verify(check)
Q.save()
