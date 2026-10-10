#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 7 / KW 40 (LB 1): multiplying and dividing fractions and
decimals, reciprocal, squares, calculator sense. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from quiz import os6

Q = os6(nr=7, slug='multiplizieren-dividieren', thema='Multiplizieren und Dividieren', lb='LB 1',
        blurb='Brüche und Dezimalzahlen multiplizieren und dividieren, Kehrwert, Quadrate',
        comment='Blocks: fractions (1-10), decimals (11-14), word problems and number sense (15-20).')

# --------------------------------------------------------------- fractions ----
Q.q(r'Berechne $\dfrac{2}{3} \cdot \dfrac{4}{5}$.',
    [r'$\dfrac{8}{15}$', r'$\dfrac{6}{8}$', r'$\dfrac{8}{5}$', r'$\dfrac{10}{12}$'],
    [r'Bruch mal Bruch: Zähler mal Zähler, Nenner mal Nenner.',
     r'$\dfrac{2 \cdot 4}{3 \cdot 5} = \dfrac{8}{15}$',
     r'Beim Multiplizieren braucht man keinen Hauptnenner.'])

Q.q(r'Berechne $\dfrac{3}{4} \cdot \dfrac{2}{9}$ und kürze.',
    [r'$\dfrac{1}{6}$', r'$\dfrac{5}{13}$', r'$\dfrac{27}{8}$', r'$\dfrac{6}{13}$'],
    [r'$\dfrac{3 \cdot 2}{4 \cdot 9} = \dfrac{6}{36}$',
     r'Mit 6 kürzen.',
     r'$\dfrac{6}{36} = \dfrac{1}{6}$ – oder schon vor dem Ausrechnen über Kreuz kürzen.'])

Q.q(r'Berechne $6 \cdot \dfrac{2}{3}$.',
    [r'4', r'$\dfrac{12}{18}$', r'$\dfrac{8}{3}$', r'$6\tfrac{2}{3}$'],
    [r'Natürliche Zahl mal Bruch: nur den Zähler malnehmen.',
     r'$\dfrac{6 \cdot 2}{3} = \dfrac{12}{3}$',
     r'$\dfrac{12}{3} = 4$'])

Q.q(r'Berechne $\left(\dfrac{2}{3}\right)^2$.',
    [r'$\dfrac{4}{9}$', r'$\dfrac{4}{6}$', r'$\dfrac{2}{9}$', r'$\dfrac{4}{3}$'],
    [r'Quadrieren heißt: mit sich selbst malnehmen.',
     r'$\dfrac{2}{3} \cdot \dfrac{2}{3} = \dfrac{2 \cdot 2}{3 \cdot 3}$',
     r'$= \dfrac{4}{9}$'])

Q.q(r'Was ist der Kehrwert von $\dfrac{3}{8}$?',
    [r'$\dfrac{8}{3}$', r'0,375', r'$1\tfrac{3}{8}$', r'$\dfrac{3}{80}$'],
    [r'Beim Kehrwert tauschen Zähler und Nenner die Plätze.',
     r'$\dfrac{3}{8} \to \dfrac{8}{3}$',
     r'Probe: $\dfrac{3}{8} \cdot \dfrac{8}{3} = 1$.'])

Q.q(r'Rechne im Kopf: $45 : \dfrac{1}{2}$',
    [r'90', r'22,5', r'45,5', r'$\dfrac{2}{45}$'],
    [r'Durch einen Bruch teilen heißt: mit dem Kehrwert malnehmen.',
     r'$45 : \dfrac{1}{2} = 45 \cdot 2$',
     r'$= 90$. Anschaulich: In 45 passt ein Halb 90-mal.'])

Q.q(r'Berechne $\dfrac{3}{5} : \dfrac{3}{10}$.',
    [r'2', r'$\dfrac{9}{50}$', r'$\dfrac{1}{2}$', r'$\dfrac{6}{15}$'],
    [r'Mit dem Kehrwert malnehmen: $\dfrac{3}{5} \cdot \dfrac{10}{3}$',
     r'$= \dfrac{30}{15}$',
     r'$= 2$. Probe: $2 \cdot \dfrac{3}{10} = \dfrac{6}{10} = \dfrac{3}{5}$.'])

Q.q(r'Berechne $\dfrac{2}{7} : 4$.',
    [r'$\dfrac{1}{14}$', r'$\dfrac{8}{7}$', r'$\dfrac{1}{7}$', r'$\dfrac{8}{28}$'],
    [r'Durch 4 teilen heißt mit $\dfrac{1}{4}$ malnehmen.',
     r'$\dfrac{2}{7} \cdot \dfrac{1}{4} = \dfrac{2}{28}$',
     r'$= \dfrac{1}{14}$'])

Q.q(r'Rechne im Kopf: $0{,}4^2$',
    [r'0,16', r'0,8', r'1,6', r'0,016'],
    [r'$0{,}4 \cdot 0{,}4$: zuerst ohne Komma $4 \cdot 4 = 16$.',
     r'Beide Faktoren haben zusammen 2 Nachkommastellen.',
     r'$0{,}4^2 = 0{,}16$'])

Q.q(r'Was ist $\dfrac{3}{4}$ von 120 €?',
    [r'90 €', r'30 €', r'160 €', r'40 €'],
    [r'„von“ heißt mal: $\dfrac{3}{4} \cdot 120$',
     r'Ein Viertel von 120 € sind 30 €.',
     r'Drei Viertel sind $3 \cdot 30 = 90$ €.'])

# ---------------------------------------------------------------- decimals ----
Q.q(r'Rechne im Kopf: $0{,}6 \cdot 0{,}12$',
    [r'0,072', r'0,72', r'7,2', r'0,0072'],
    [r'Ohne Komma: $6 \cdot 12 = 72$',
     r'Nachkommastellen: 1 + 2 = 3',
     r'$0{,}6 \cdot 0{,}12 = 0{,}072$'])

Q.q(r'Berechne $4{,}5 \cdot 0{,}2$.',
    [r'0,9', r'9', r'0,09', r'4,7'],
    [r'Ohne Komma: $45 \cdot 2 = 90$',
     r'Zusammen 2 Nachkommastellen: 0,90',
     r'$= 0{,}9$'])

Q.q(r'Berechne $3{,}6 : 0{,}4$.',
    [r'9', r'0,9', r'90', r'1,44'],
    [r'Komma bei beiden Zahlen um eine Stelle nach rechts verschieben.',
     r'$3{,}6 : 0{,}4 = 36 : 4$',
     r'$= 9$'])

Q.q(r'Berechne $2{,}35 \cdot 100$.',
    [r'235', r'23,5', r'2,3500', r'0,0235'],
    [r'Mal 100: Das Komma rückt um zwei Stellen nach rechts.',
     r'$2{,}35 \to 23{,}5 \to 235$',
     r'$2{,}35 \cdot 100 = 235$'])

# ---------------------------------------------- word problems, number sense ----
Q.q(r'Ein Liter Apfelsaft kostet 1,40 €. Was kosten 2,5 Liter?',
    [r'3,50 €', r'3,90 €', r'3,40 €', r'0,56 €'],
    [r'$2{,}5 \cdot 1{,}40$',
     r'2 Liter kosten 2,80 €, ein halber Liter 0,70 €.',
     r'Zusammen 3,50 €.'])

Q.q(r'Wie viele Gläser mit je 0,25 Liter kann man aus einer 1,5-Liter-Flasche füllen?',
    [r'6', r'4', r'5', r'60'],
    [r'$1{,}5 : 0{,}25$',
     r'Komma um zwei Stellen verschieben: $150 : 25 = 6$',
     r'Oder: 4 Gläser pro Liter, also $1{,}5 \cdot 4 = 6$.'])

Q.q(r'Man multipliziert 8 mit 0,5. Welche Aussage stimmt?',
    [r'Das Ergebnis ist kleiner als 8.', r'Das Ergebnis ist größer als 8.',
     r'Malnehmen macht immer größer.', r'Das Ergebnis ist 8,5.'],
    [r'$8 \cdot 0{,}5 = 4$',
     r'Mal 0,5 heißt: die Hälfte nehmen.',
     r'Wer mit einer Zahl kleiner als 1 malnimmt, bekommt ein kleineres Ergebnis.'])

Q.q(r'Ein Gemüsebeet ist 2,4 m lang und 1,5 m breit. Wie groß ist seine Fläche?',
    [r'3,6 m²', r'7,8 m²', r'3,9 m²', r'36 m²'],
    [r'Flächeninhalt Rechteck: Länge mal Breite.',
     r'$2{,}4 \cdot 1{,}5$: ohne Komma $24 \cdot 15 = 360$, dann 2 Nachkommastellen.',
     r'3,60 m² = 3,6 m². (7,8 m wäre der Umfang.)'])

Q.q(r'Lea tippt $4{,}8 \cdot 0{,}25$ in den Taschenrechner und liest 12 ab. Was zeigt der Überschlag?',
    [r'12 ist falsch; etwa $5 \cdot 0{,}25 = 1{,}25$, genau 1,2.', r'12 ist richtig.',
     r'12 ist falsch; etwa $5 \cdot 25 = 125$.', r'12 ist falsch; genau 0,12.'],
    [r'Überschlag: $4{,}8 \approx 5$ und $5 \cdot 0{,}25 = 1{,}25$.',
     r'Genau: $48 \cdot 25 = 1200$, drei Nachkommastellen: 1,200.',
     r'Lea hat wohl ein Komma vergessen. Richtig ist 1,2.'])

Q.q(r'Ein Stück Stoff ist $\dfrac{3}{4}$ m lang. Es wird in 3 gleich lange Teile geschnitten. Wie lang ist ein Teil?',
    [r'$\dfrac{1}{4}$ m', r'$\dfrac{9}{4}$ m', r'$\dfrac{1}{3}$ m', r'$\dfrac{1}{12}$ m'],
    [r'$\dfrac{3}{4} : 3 = \dfrac{3}{4} \cdot \dfrac{1}{3}$',
     r'$= \dfrac{3}{12} = \dfrac{1}{4}$',
     r'Ein Teil ist $\dfrac{1}{4}$ m = 25 cm lang.'])


def check():
    assert F(2, 3) * F(4, 5) == F(8, 15)
    assert F(3, 4) * F(2, 9) == F(1, 6) == F(6, 36)
    assert 6 * F(2, 3) == 4
    assert F(2, 3) ** 2 == F(4, 9)
    assert 1 / F(3, 8) == F(8, 3) and F(3, 8) * F(8, 3) == 1
    assert 45 / F(1, 2) == 90
    assert F(3, 5) / F(3, 10) == 2
    assert F(2, 7) / 4 == F(1, 14)
    assert D('0.4') ** 2 == D('0.16')
    assert F(3, 4) * 120 == 90
    assert D('0.6') * D('0.12') == D('0.072')
    assert D('4.5') * D('0.2') == D('0.9')
    assert D('3.6') / D('0.4') == 9
    assert D('2.35') * 100 == 235
    assert D('2.5') * D('1.40') == D('3.5')
    assert D('1.5') / D('0.25') == 6
    assert 8 * D('0.5') == 4
    assert D('2.4') * D('1.5') == D('3.6') and 2 * (D('2.4') + D('1.5')) == D('7.8')
    assert D('4.8') * D('0.25') == D('1.2') and 5 * D('0.25') == D('1.25')
    assert F(3, 4) / 3 == F(1, 4) and F(3, 12) == F(1, 4) != F(1, 3)


Q.verify(check)
Q.save()
