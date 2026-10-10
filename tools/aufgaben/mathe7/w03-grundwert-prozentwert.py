#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 3 / KW 36 (LB 1): base value, percentage and
percent value; computing the percent value with the rule of three and with W = G * p %.
Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os7

Q = os7(nr=3, slug='grundwert-prozentwert', thema='Grundwert, Prozentwert, Prozentsatz', lb='LB 1',
        blurb='die drei Größen erkennen, Prozentwert mit Dreisatz und Formel berechnen',
        comment='Blocks: naming the quantities (1-5), computing W (6-14), everyday (15-20).')

W = lambda G, p: F(str(G)) * F(str(p)) / 100

# ------------------------------------------------------ naming the quantities ----
Q.q(r'Von 25 Personen tragen 40 % eine Brille. Welche Zahl ist der Grundwert?',
    [r'25', r'40', r'10', r'100'],
    [r'Der Grundwert ist das Ganze, von dem man ausgeht.',
     r'Hier: alle 25 Personen.',
     r'Der Grundwert entspricht immer 100 %.'])

Q.q(r'Von 25 Personen tragen 40 % eine Brille. Was ist der Prozentsatz?',
    [r'40 %', r'25 %', r'10 %', r'100 %'],
    [r'Der Prozentsatz ist die Angabe mit dem Zeichen %.',
     r'Er sagt, wie viele Hundertstel vom Ganzen gemeint sind.',
     r'Hier: 40 %.'])

Q.q(r'Von 25 Personen tragen 40 % eine Brille. Was ist hier der Prozentwert?',
    [r'die Anzahl der Personen mit Brille, also 10', r'25', r'40', r'die Personen ohne Brille'],
    [r'Der Prozentwert ist der Teil vom Grundwert.',
     r'Er hat dieselbe Einheit wie der Grundwert: Personen.',
     r'40 % von 25 sind 10 Personen.'])

Q.q(r'Ein Fahrrad kostet 480 €. Der Händler gibt 15 % Rabatt, das sind 72 €. Was sind die 72 €?',
    [r'der Prozentwert', r'der Grundwert', r'der Prozentsatz', r'der neue Preis'],
    [r'Grundwert: 480 € (das Ganze, 100 %).',
     r'Prozentsatz: 15 %.',
     r'Prozentwert: 72 € – der Rabatt in Euro. Der neue Preis wäre 408 €.'])

Q.q(r'Welche Größe entspricht immer 100 %?',
    [r'der Grundwert', r'der Prozentwert', r'der Prozentsatz', r'keine'],
    [r'Prozente beziehen sich auf ein Ganzes.',
     r'Dieses Ganze heißt Grundwert.',
     r'Grundwert $\hat{=}$ 100 %.'])

# --------------------------------------------------------------- computing W ----
Q.q(r'Berechne 40 % von 25 Personen.',
    [r'10', r'15', r'4', r'65'],
    [r'10 % von 25 sind 2,5.',
     r'40 % sind viermal so viel.',
     r'$4 \cdot 2{,}5 = 10$ Personen'])

Q.q(r'Berechne 15 % von 480 €.',
    [r'72 €', r'48 €', r'32 €', r'408 €'],
    [r'10 % sind 48 €, 5 % sind 24 €.',
     r'15 % = 10 % + 5 %',
     r'$48 + 24 = 72$ €'])

Q.q(r'Berechne 8 % von 350 €.',
    [r'28 €', r'2,80 €', r'43,75 €', r'35 €'],
    [r'$W = G \cdot \dfrac{p}{100} = 350 \cdot \dfrac{8}{100}$',
     r'$= 3{,}5 \cdot 8$',
     r'$= 28$ €'])

Q.q(r'Berechne 35 % von 60 kg.',
    [r'21 kg', r'25 kg', r'35 kg', r'17,1 kg'],
    [r'1 % von 60 kg sind 0,6 kg.',
     r'$35 \cdot 0{,}6$',
     r'$= 21$ kg'])

Q.q(r'Berechne 4 % von 1250 Personen.',
    [r'50', r'5', r'500', r'12,5'],
    [r'1 % von 1250 sind 12,5.',
     r'$4 \cdot 12{,}5$',
     r'$= 50$ Personen'])

Q.q(r'Berechne 2,5 % von 800 €.',
    [r'20 €', r'200 €', r'2 €', r'32 €'],
    [r'1 % von 800 € sind 8 €.',
     r'$2{,}5 \cdot 8$',
     r'$= 20$ €'])

Q.q(r'Berechne 120 % von 45.',
    [r'54', r'37,5', r'5,4', r'165'],
    [r'120 % ist mehr als das Ganze: 100 % + 20 %.',
     r'100 %: 45, 20 %: 9',
     r'$45 + 9 = 54$'])

Q.q(r'Dreisatz: 100 % entsprechen 320 €. Welcher Betrag gehört zu 17 %?',
    [r'54,40 €', r'3,20 €', r'17 €', r'188,24 €'],
    [r'100 % → 320 €',
     r'1 % → 3,20 €',
     r'17 % → $17 \cdot 3{,}20 = 54{,}40$ €'])

Q.q(r'Mit welcher Formel berechnet man den Prozentwert $W$ aus dem Grundwert $G$ und dem Prozentsatz $p\,\%$?',
    [r'$W = G \cdot \dfrac{p}{100}$', r'$W = \dfrac{G}{p}$', r'$W = G + p$', r'$W = \dfrac{p}{G} \cdot 100$'],
    [r'$p\,\%$ bedeutet $\dfrac{p}{100}$.',
     r'„$p\,\%$ von $G$“ heißt: $G$ mal $\dfrac{p}{100}$.',
     r'Also $W = G \cdot \dfrac{p}{100}$, kurz $W = G \cdot p\,\%$.'])

# --------------------------------------------------------------------- everyday ----
Q.q(r'Ein Handy-Akku fasst 4000 mAh. Er ist noch zu 65 % geladen. Wie viel Ladung ist noch im Akku?',
    [r'2600 mAh', r'1400 mAh', r'650 mAh', r'3935 mAh'],
    [r'$W = 4000 \cdot \dfrac{65}{100}$',
     r'$= 40 \cdot 65$',
     r'$= 2600$ mAh'])

Q.q(r'Bei einer Umfrage unter 1200 Personen sagen 45 %, dass sie täglich Rad fahren. Wie viele Personen sind das?',
    [r'540', r'450', r'660', r'54'],
    [r'10 % von 1200 sind 120, 5 % sind 60.',
     r'45 % = 4 · 10 % + 5 %',
     r'$480 + 60 = 540$ Personen'])

Q.q(r'Milch hat 3,5 % Fett. Wie viel Gramm Fett sind in 1000 g Milch?',
    [r'35 g', r'3,5 g', r'350 g', r'0,35 g'],
    [r'1 % von 1000 g sind 10 g.',
     r'$3{,}5 \cdot 10$',
     r'$= 35$ g Fett'])

Q.q(r'Auf einen Nettopreis von 200 € kommen 19 % Mehrwertsteuer. Wie viel Steuer ist das?',
    [r'38 €', r'19 €', r'238 €', r'3,80 €'],
    [r'1 % von 200 € sind 2 €.',
     r'$19 \cdot 2$',
     r'$= 38$ € Mehrwertsteuer, der Endpreis ist 238 €.'])

Q.q(r'Ein Getränk enthält 12 % Fruchtsaft. Wie viel Fruchtsaft ist in einer 750-ml-Flasche?',
    [r'90 ml', r'75 ml', r'120 ml', r'62,5 ml'],
    [r'10 % von 750 ml sind 75 ml, 2 % sind 15 ml.',
     r'12 % = 10 % + 2 %',
     r'$75 + 15 = 90$ ml'])

Q.q(r'Auf einem Prozentstreifen entsprechen 100 % genau 80 €. Welcher Betrag steht bei 25 %?',
    [r'20 €', r'25 €', r'40 €', r'60 €'],
    [r'25 % ist ein Viertel des Streifens.',
     r'$80 : 4$',
     r'= 20 €'])


def check():
    assert W(25, 40) == 10 and W(480, 15) == 72 and 480 - 72 == 408
    assert W(350, 8) == 28 and W(60, 35) == 21 and W(1250, 4) == 50 and W(800, '2.5') == 20
    assert W(45, 120) == 54 and W(320, 17) == F('54.4')
    assert W(4000, 65) == 2600 and W(1200, 45) == 540 and W(1000, '3.5') == 35
    assert W(200, 19) == 38 and W(750, 12) == 90 and W(80, 25) == 20


Q.verify(check)
Q.save()
