#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 5 / KW 38 (LB 1): Formeln umstellen,
Sachprobleme mit Gleichungen. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=5, slug='formeln-umstellen', thema='Formeln umstellen und Sachprobleme', lb='LB 1',
        blurb='Formeln nach einer Größe umstellen, Sachaufgaben mit Gleichungen lösen',
        comment='Blocks: rearranging formulas and using them (1-13, 19), word problems with one equation (14-18, 20).')

# ----------------------------------------------------------- Umstellen ----
Q.q(r'Stelle die Umfangsformel des Rechtecks $u = 2 \cdot (a + b)$ nach $b$ um.',
    [r'$b = \dfrac{u}{2} - a$', r'$b = \dfrac{u - a}{2}$', r'$b = u - 2a$', r'$b = 2u - a$'],
    [r'Durch 2 teilen: $\dfrac{u}{2} = a + b$',
     r'$a$ subtrahieren: $b = \dfrac{u}{2} - a$'])

Q.q(r'Ein Rechteck hat den Umfang 26 cm und die Seite $a = 8$ cm. Wie lang ist $b$?',
    [r'5 cm', r'9 cm', r'10 cm', r'18 cm'],
    [r'$b = \dfrac{u}{2} - a = \dfrac{26}{2} - 8$',
     r'$b = 13 - 8 = 5$, also 5 cm.'])

Q.q(r'Stelle $A = \dfrac{g \cdot h}{2}$ nach $h$ um.',
    [r'$h = \dfrac{2A}{g}$', r'$h = \dfrac{A}{2g}$', r'$h = 2A - g$', r'$h = \dfrac{g}{2A}$'],
    [r'Mit 2 multiplizieren: $2A = g \cdot h$',
     r'Durch $g$ teilen: $h = \dfrac{2A}{g}$'])

Q.q(r'Ein Dreieck hat den Flächeninhalt 24 cm² und die Grundseite 8 cm. Wie groß ist die Höhe?',
    [r'6 cm', r'3 cm', r'1,5 cm', r'96 cm'],
    [r'$h = \dfrac{2A}{g} = \dfrac{2 \cdot 24}{8}$',
     r'$h = \dfrac{48}{8} = 6$, also 6 cm.'])

Q.q(r'Stelle $s = v \cdot t$ nach der Zeit $t$ um.',
    [r'$t = \dfrac{s}{v}$', r'$t = s \cdot v$', r'$t = \dfrac{v}{s}$', r'$t = s - v$'],
    [r'$t$ ist mit $v$ multipliziert.',
     r'Umkehrung: durch $v$ teilen, $t = \dfrac{s}{v}$.'])

Q.q(r'Ein Bus fährt im Mittel 70 km pro Stunde. Wie lange braucht er für 210 km?',
    [r'3 h', r'0,3 h', r'140 h', r'2 h 30 min'],
    [r'$t = \dfrac{s}{v} = \dfrac{210}{70}$',
     r'$t = 3$, also 3 Stunden.'])

Q.q(r'Stelle die Volumenformel $V = a \cdot b \cdot c$ nach $c$ um.',
    [r'$c = \dfrac{V}{a \cdot b}$', r'$c = V - a \cdot b$', r'$c = \dfrac{a \cdot b}{V}$', r'$c = V \cdot a \cdot b$'],
    [r'$c$ ist mit dem Produkt $a \cdot b$ multipliziert.',
     r'Durch $a \cdot b$ teilen: $c = \dfrac{V}{a \cdot b}$'])

Q.q(r'Ein quaderförmiges Becken ist 10 m lang und 8 m breit und fasst 120 m³. Wie tief ist es?',
    [r'1,5 m', r'12 m', r'15 m', r'0,67 m'],
    [r'$c = \dfrac{V}{a \cdot b} = \dfrac{120}{10 \cdot 8}$',
     r'$c = \dfrac{120}{80} = 1{,}5$, also 1,5 m.'])

Q.q(r'Stelle $F = 1{,}8 \cdot C + 32$ nach $C$ um.',
    [r'$C = \dfrac{F - 32}{1{,}8}$', r'$C = \dfrac{F}{1{,}8} - 32$', r'$C = 1{,}8 \cdot F - 32$', r'$C = \dfrac{F + 32}{1{,}8}$'],
    [r'Zuerst 32 subtrahieren: $F - 32 = 1{,}8 \cdot C$',
     r'Dann durch 1,8 teilen: $C = \dfrac{F - 32}{1{,}8}$',
     r'Reihenfolge: Was zuletzt dazukam (plus 32), wird zuerst rückgängig gemacht.'])

Q.q(r'In New York zeigt das Thermometer 77 °F. Wie viel Grad Celsius sind das? Nutze $C = \dfrac{F - 32}{1{,}8}$.',
    [r'25 °C', r'10,8 °C', r'60,6 °C', r'106,6 °C'],
    [r'$C = \dfrac{77 - 32}{1{,}8} = \dfrac{45}{1{,}8}$',
     r'$C = 25$, also 25 °C.'])

Q.q(r'Stelle die Prozentformel $W = \dfrac{G \cdot p}{100}$ nach dem Grundwert $G$ um.',
    [r'$G = \dfrac{W \cdot 100}{p}$', r'$G = \dfrac{W \cdot p}{100}$', r'$G = \dfrac{100}{W \cdot p}$', r'$G = W \cdot p \cdot 100$'],
    [r'Mit 100 multiplizieren: $W \cdot 100 = G \cdot p$',
     r'Durch $p$ teilen: $G = \dfrac{W \cdot 100}{p}$'])

Q.q(r'Eine Ermäßigung von 15 % macht 18 € aus. Wie hoch war der ursprüngliche Preis?',
    [r'120 €', r'2,70 €', r'270 €', r'33 €'],
    [r'$W = 18$ €, $p = 15$, gesucht ist $G$.',
     r'$G = \dfrac{18 \cdot 100}{15} = \dfrac{1800}{15} = 120$, also 120 €.'])

Q.q(r'Ein Wasserkocher hat die Leistung $P = 2300$ W bei der Spannung $U = 230$ V. Berechne die Stromstärke aus $P = U \cdot I$.',
    [r'10 A', r'529 000 A', r'0,1 A', r'2070 A'],
    [r'Umstellen: $I = \dfrac{P}{U}$',
     r'$I = \dfrac{2300}{230} = 10$, also 10 A.'])

# --------------------------------------------------------- Sachprobleme ----
Q.q(r'Drei aufeinanderfolgende natürliche Zahlen haben die Summe 72. Wie heißt die kleinste?',
    [r'23', r'24', r'22', r'21'],
    [r'Zahlen: $n$, $n + 1$, $n + 2$',
     r'$3n + 3 = 72$, also $3n = 69$ und $n = 23$.',
     r'Probe: $23 + 24 + 25 = 72$'])

Q.q(r'Ein Handwerker berechnet 45 € Anfahrt und 38 € pro Arbeitsstunde. Die Rechnung lautet 254 €. Wie lange hat er gearbeitet?',
    [r'5,5 h', r'6,7 h', r'7,9 h', r'4,5 h'],
    [r'$45 + 38x = 254$',
     r'$38x = 209$',
     r'$x = 209 : 38 = 5{,}5$, also 5,5 Stunden.'])

Q.q(r'Ein Rechteck ist 3 cm länger als breit und hat den Umfang 34 cm. Wie breit ist es?',
    [r'7 cm', r'10 cm', r'8,5 cm', r'14 cm'],
    [r'Breite $x$, Länge $x + 3$.',
     r'$2 \cdot (x + x + 3) = 34$, also $4x + 6 = 34$.',
     r'$4x = 28$, $x = 7$. Das Rechteck ist 7 cm breit und 10 cm lang.'])

Q.q(r'Ein Handytarif kostet 4,99 € im Monat und 0,09 € pro Gesprächsminute. Die Rechnung beträgt 9,49 €. Wie viele Minuten wurde telefoniert?',
    [r'50 min', r'105 min', r'45 min', r'161 min'],
    [r'$4{,}99 + 0{,}09x = 9{,}49$',
     r'$0{,}09x = 4{,}50$',
     r'$x = 4{,}50 : 0{,}09 = 50$'])

Q.q(r'Welche Reihenfolge ist beim Lösen einer Sachaufgabe mit einer Gleichung sinnvoll?',
    [r'Variable festlegen, Gleichung aufstellen, lösen, Ergebnis am Text prüfen',
     r'Gleichung lösen, Variable festlegen, Gleichung aufstellen, Antwort schreiben',
     r'Zahlen aus dem Text addieren, Antwort schreiben',
     r'Ergebnis raten, Gleichung aufstellen, Variable festlegen'],
    [r'Modell bilden: festlegen, wofür die Variable steht, und die Gleichung aufstellen.',
     r'Im Modell arbeiten: die Gleichung lösen.',
     r'Deuten: Passt das Ergebnis zum Text? Dann Antwortsatz.'])

Q.q(r'Ein Sparbuch mit 800 € bringt in einem Jahr 12 € Zinsen. Berechne den Zinssatz mit $p = \dfrac{100 \cdot Z}{K}$.',
    [r'1,5 %', r'0,015 %', r'66,7 %', r'9,6 %'],
    [r'$p = \dfrac{100 \cdot 12}{800} = \dfrac{1200}{800}$',
     r'$p = 1{,}5$, also 1,5 %.'])

Q.q(r'Ich bin 4 Jahre älter als mein Bruder. Zusammen sind wir 30 Jahre alt. Wie alt bin ich?',
    [r'17 Jahre', r'13 Jahre', r'15 Jahre', r'19 Jahre'],
    [r'Bruder $x$, ich $x + 4$.',
     r'$x + x + 4 = 30$, also $2x = 26$ und $x = 13$.',
     r'Ich bin $13 + 4 = 17$ Jahre alt.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    u, a, b, A, g, h, s, v, t, V, c, Fa, C, W, G, p = sp.symbols('u a b A g h s v t V c Fa C W G p')
    assert sp.solve(sp.Eq(u, 2*(a + b)), b) == [u/2 - a]
    assert F(26, 2) - 8 == 5
    assert sp.solve(sp.Eq(A, g*h/2), h) == [2*A/g]
    assert F(2 * 24, 8) == 6
    assert sp.solve(sp.Eq(s, v*t), t) == [s/v]
    assert F(210, 70) == 3
    assert sp.solve(sp.Eq(V, a*b*c), c) == [V/(a*b)]
    assert F(120, 10 * 8) == F('1.5')
    assert sp.simplify(sp.solve(sp.Eq(Fa, sp.Rational(9, 5)*C + 32), C)[0] - (Fa - 32) / sp.Rational(9, 5)) == 0
    assert (77 - 32) / F('1.8') == 25 and round(77 / 1.8 - 32, 1) == 10.8 and round((77 + 32) / 1.8, 1) == 60.6 and F('1.8') * 77 - 32 == F('106.6')
    assert sp.solve(sp.Eq(W, G*p/100), G) == [100*W/p]
    assert F(18 * 100, 15) == 120 and F(18 * 15, 100) == F('2.7')
    assert F(2300, 230) == 10 and 2300 * 230 == 529000
    assert 23 + 24 + 25 == 72
    assert F(254 - 45, 38) == F('5.5') and round(254 / 38, 1) == 6.7 and round(299 / 38, 1) == 7.9
    assert 2 * (7 + 10) == 34
    assert (F('9.49') - F('4.99')) / F('0.09') == 50 and int(F('9.49') / F('0.09')) == 105 and round((9.49 + 4.99) / 0.09) == 161
    assert F(100 * 12, 800) == F('1.5') and F(100 * 800, 12) > 6000
    assert 13 + 17 == 30 and 17 - 13 == 4


Q.verify(check)
Q.save()
