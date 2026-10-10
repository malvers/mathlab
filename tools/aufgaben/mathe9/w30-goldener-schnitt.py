#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 30 / KW 16 (Wahlpflichtbereich 1 Goldener Schnitt):
Teilungsverhältnis, Gleichung x² + x − 1 = 0, Zahl Φ, Konstruktion. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=30, slug='goldener-schnitt', thema='Goldener Schnitt: Teilungsverhältnis', lb='WB 1',
        blurb='Major und Minor, die Gleichung x² + x − 1 = 0, die Zahl Φ, Konstruktion mit Zirkel und Lineal',
        comment='Phi = (1 + sqrt 5)/2 = 1.618..., values rounded. Blocks: definition (1, 19), the number phi (2, 8-9, 16), dividing segments (3-4, 10-12, 20), the quadratic equation (5-7), Fibonacci (13-15), construction after Euclid (17-18).')

# ------------------------------------------------------------ Definition ----
Q.q(r'Eine Strecke ist im Goldenen Schnitt geteilt, wenn …',
    [r'… sich die ganze Strecke zum größeren Teil verhält wie der größere zum kleineren Teil.',
     r'… beide Teile gleich lang sind.',
     r'… der größere Teil doppelt so lang ist wie der kleinere.',
     r'… der kleinere Teil ein Drittel der Strecke ist.'],
    [r'Mit dem größeren Teil $M$ (Major) und dem kleineren $m$ (Minor): $\dfrac{M + m}{M} = \dfrac{M}{m}$.'])

Q.q(r'Wie groß ist die Goldene Zahl $\Phi$ ungefähr?',
    [r'1,618', r'1,414', r'3,142', r'0,5'],
    [r'$\Phi = \dfrac{1 + \sqrt{5}}{2} \approx 1{,}618$',
     r'1,414 ist $\sqrt{2}$, das Seitenverhältnis von DIN-Papier.'])

Q.q(r'Eine 10 cm lange Strecke wird im Goldenen Schnitt geteilt. Wie lang ist der größere Teil (gerundet)?',
    [r'6,18 cm', r'3,82 cm', r'5 cm', r'16,18 cm'],
    [r'Major $= \dfrac{10}{\Phi} \approx 10 \cdot 0{,}618 = 6{,}18$ cm'])

Q.q(r'Wie lang ist dann der kleinere Teil (gerundet)?',
    [r'3,82 cm', r'6,18 cm', r'4 cm', r'2,36 cm'],
    [r'$10 - 6{,}18 = 3{,}82$ cm',
     r'Probe: $6{,}18 : 3{,}82 \approx 1{,}618$'])

# --------------------------------------------------------------- Gleichung ----
Q.q(r'Eine Strecke der Länge 1 wird im Goldenen Schnitt geteilt, der größere Teil heißt $x$. Welche Gleichung gilt?',
    [r'$x^2 + x - 1 = 0$', r'$x^2 - x - 1 = 0$', r'$x^2 = 1$', r'$2x - 1 = 0$'],
    [r'$\dfrac{1}{x} = \dfrac{x}{1 - x}$',
     r'Über Kreuz multiplizieren: $1 - x = x^2$, also $x^2 + x - 1 = 0$.'])

Q.q(r'Löse $x^2 + x - 1 = 0$. Welche Lösung ist die Länge des größeren Teils (gerundet)?',
    [r'$x \approx 0{,}618$', r'$x \approx -1{,}618$', r'$x \approx 1{,}618$', r'$x = 0{,}5$'],
    [r'$x = -0{,}5 \pm \sqrt{0{,}25 + 1} = -0{,}5 \pm \sqrt{1{,}25}$',
     r'$x \approx 0{,}618$ oder $x \approx -1{,}618$'])

Q.q(r'Warum gehört die Lösung $x \approx -1{,}618$ nicht zur geteilten Strecke?',
    [r'Eine Länge kann nicht negativ sein.', r'Weil sie größer als 1 ist.', r'Weil sie keine Lösung der Gleichung ist.', r'Weil man nur ganze Zahlen nimmt.'],
    [r'Beide Zahlen erfüllen die Gleichung.',
     r'Im Sachzusammenhang ist aber nur eine positive Länge sinnvoll.'])

Q.q(r'Welche Beziehung gilt für $\Phi \approx 1{,}618$?',
    [r'$\dfrac{1}{\Phi} = \Phi - 1$', r'$\dfrac{1}{\Phi} = \Phi + 1$', r'$\dfrac{1}{\Phi} = 2\Phi$', r'$\dfrac{1}{\Phi} = \Phi$'],
    [r'$\dfrac{1}{1{,}618} \approx 0{,}618 = 1{,}618 - 1$',
     r'Das folgt aus $\Phi^2 = \Phi + 1$ nach Division durch $\Phi$.'])

Q.q(r'Wie groß ist $\Phi^2$ ungefähr?',
    [r'2,618', r'3,236', r'2,236', r'1,272'],
    [r'$\Phi^2 = \Phi + 1 \approx 2{,}618$'])

Q.q(r'Eine 1 m lange Leiste soll im Goldenen Schnitt markiert werden. Wo liegt die Marke vom einen Ende aus (größerer Teil, gerundet)?',
    [r'bei 61,8 cm', r'bei 50 cm', r'bei 38,2 cm', r'bei 66,7 cm'],
    [r'$100 \cdot 0{,}618 = 61{,}8$ cm',
     r'Vom anderen Ende aus gemessen liegt sie bei 38,2 cm.'])

Q.q(r'Der größere Teil einer im Goldenen Schnitt geteilten Strecke ist 8 cm. Wie lang ist die ganze Strecke (gerundet)?',
    [r'12,94 cm', r'13 cm', r'4,94 cm', r'16 cm'],
    [r'Ganze : Major $= \Phi$',
     r'$8 \cdot 1{,}618 \approx 12{,}94$ cm'])

Q.q(r'Der kleinere Teil ist 5 cm lang. Wie lang ist der größere Teil (gerundet)?',
    [r'8,09 cm', r'3,09 cm', r'10 cm', r'7,5 cm'],
    [r'Major : Minor $= \Phi$',
     r'$5 \cdot 1{,}618 \approx 8{,}09$ cm'])

# ------------------------------------------------------------- Fibonacci ----
Q.q(r'Teilt man zwei aufeinanderfolgende Fibonacci-Zahlen, z. B. 21 : 13, durcheinander, erhält man ungefähr …',
    [r'1,615, nahe bei $\Phi$', r'2', r'1,5', r'3,142'],
    [r'$21 : 13 \approx 1{,}6154$',
     r'Je größer die Zahlen, desto näher liegt der Quotient bei $\Phi$.'])

Q.q(r'Die Fibonacci-Folge beginnt mit 1, 1, 2, 3, 5, 8, 13, 21, 34, 55. Welche Zahl kommt als Nächstes?',
    [r'89', r'76', r'110', r'68'],
    [r'Jede Zahl ist die Summe der beiden vorigen: $34 + 55 = 89$.'])

Q.q(r'Wie groß ist $89 : 55$ auf drei Nachkommastellen?',
    [r'1,618', r'1,600', r'1,625', r'0,618'],
    [r'$89 : 55 = 1{,}61818\ldots$'])

Q.q(r'Welcher Term gibt $\Phi$ genau an?',
    [r'$\dfrac{1 + \sqrt{5}}{2}$', r'$\dfrac{1 + \sqrt{2}}{2}$', r'$\sqrt{5} - 1$', r'$\dfrac{\sqrt{5}}{2}$'],
    [r'Aus $\Phi^2 - \Phi - 1 = 0$ mit der Lösungsformel: $\Phi = 0{,}5 + \sqrt{0{,}25 + 1} = \dfrac{1 + \sqrt{5}}{2}$.'])

# ------------------------------------------------------------ Konstruktion ----
Q.q(r'Konstruktion nach Euklid: Über $\overline{AB}$ wird in $B$ eine Senkrechte errichtet. Wie lang wählt man $\overline{BC}$?',
    [r'halb so lang wie $\overline{AB}$', r'so lang wie $\overline{AB}$', r'doppelt so lang wie $\overline{AB}$', r'ein Drittel von $\overline{AB}$'],
    [r'Dann zeichnet man den Kreis um $C$ durch $B$ und den Kreis um $A$ durch den Schnittpunkt mit $\overline{AC}$.',
     r'Dieser zweite Kreis teilt $\overline{AB}$ im Goldenen Schnitt.'])

Q.q(r'Bei dieser Konstruktion ist $\overline{AB} = 10$ cm und $\overline{BC} = 5$ cm. Wie lang ist $\overline{AC}$, und wie lang wird der größere Teil (gerundet)?',
    [r'$\overline{AC} \approx 11{,}18$ cm, größerer Teil $\approx 6{,}18$ cm', r'$\overline{AC} = 15$ cm, größerer Teil 10 cm',
     r'$\overline{AC} \approx 11{,}18$ cm, größerer Teil $\approx 5{,}59$ cm', r'$\overline{AC} = 5$ cm, größerer Teil 5 cm'],
    [r'Pythagoras: $\overline{AC} = \sqrt{100 + 25} = \sqrt{125} \approx 11{,}18$ cm',
     r'Davon wird $\overline{BC} = 5$ cm abgezogen: $11{,}18 - 5 = 6{,}18$ cm.'])

Q.q(r'Wie nannte Euklid die Teilung, die wir heute Goldenen Schnitt nennen?',
    [r'Teilung im äußeren und mittleren Verhältnis', r'Teilung in der Mitte', r'Drittelung', r'göttliche Zahl'],
    [r'Quelle: Euklid, Elemente, Buch VI.',
     r'Der Name „Goldener Schnitt“ ist erst im 19. Jahrhundert üblich geworden.'])

Q.q(r'Ein Rechteck hat die kurze Seite 10 cm und ist ein Goldenes Rechteck. Wie lang ist die lange Seite (gerundet)?',
    [r'16,18 cm', r'6,18 cm', r'15 cm', r'20 cm'],
    [r'lang : kurz $= \Phi$',
     r'$10 \cdot 1{,}618 \approx 16{,}18$ cm'])


def check():
    from math import sqrt
    phi = (1 + sqrt(5)) / 2
    R = lambda v, n=2: round(v, n)
    assert R(phi, 3) == 1.618 and R(10 / phi) == 6.18 and R(10 - 10 / phi) == 3.82
    x = (-1 + sqrt(5)) / 2
    assert abs(x * x + x - 1) < 1e-12 and R(x, 3) == 0.618 and R((-1 - sqrt(5)) / 2, 3) == -1.618
    assert abs(1 / phi - (phi - 1)) < 1e-12 and R(phi ** 2, 3) == 2.618 and abs(phi ** 2 - phi - 1) < 1e-12
    assert R(100 / phi, 1) == 61.8 and R(8 * phi) == 12.94 and R(5 * phi) == 8.09
    fib = [1, 1]
    while len(fib) < 11:
        fib.append(fib[-1] + fib[-2])
    assert fib[-1] == 89 and R(21 / 13, 3) == 1.615 and R(89 / 55, 3) == 1.618
    assert R(sqrt(125)) == 11.18 and R(sqrt(125) - 5) == 6.18 and R(10 * phi) == 16.18


Q.verify(check)
Q.save()
