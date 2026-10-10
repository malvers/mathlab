#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 7 / KW 40 (LB 1): Sachaufgaben mit rechtwinkligen
Dreiecken - Leiter, Steigung, Dach, Spannseil. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=7, slug='sachaufgaben-dreiecke', thema='Sachaufgaben: Steigung, Leiter, Dach', lb='LB 1',
        blurb='Leiter, Rampe und Straße, Dachneigung und Sparren, Spannseil, Höhen aus Winkeln',
        comment='Calculator in DEG, values rounded. Blocks: ladder (1-2), slope in percent and degrees (3-5, 15, 17), roof (6-7), rope and kite (8-10), heights from angles (11-14, 16, 19-20), method (18).')

# ------------------------------------------------------------------ Leiter ----
Q.q(r'Eine 6 m lange Leiter lehnt mit $70^\circ$ zum Boden an einer Wand. Wie hoch reicht sie (gerundet)?',
    [r'5,64 m', r'2,05 m', r'16,48 m', r'6,39 m'],
    [r'Die Leiter ist die Hypotenuse, die Höhe die Gegenkathete des Winkels am Boden.',
     r'$h = 6 \cdot \sin 70^\circ \approx 5{,}64$ m'])

Q.q(r'Wie weit steht der Fuß dieser Leiter (6 m, $70^\circ$) von der Wand entfernt (gerundet)?',
    [r'2,05 m', r'5,64 m', r'2,18 m', r'1,00 m'],
    [r'Der Abstand ist die Ankathete: $6 \cdot \cos 70^\circ \approx 2{,}05$ m'])

# --------------------------------------------------------------- Steigung ----
Q.q(r'Eine Straße hat 10 % Steigung. Wie groß ist der Steigungswinkel (gerundet)?',
    [r'$5{,}71^\circ$', r'$10^\circ$', r'$9^\circ$', r'$84{,}29^\circ$'],
    [r'10 % heißt: 10 m Höhe auf 100 m waagerechter Strecke, $\tan \alpha = 0{,}1$.',
     r'$\alpha = \tan^{-1}(0{,}1) \approx 5{,}71^\circ$'])

Q.q(r'Eine Straße steigt mit 8 % auf 2 km waagerechter Strecke. Wie viele Höhenmeter sind das?',
    [r'160 m', r'16 m', r'80 m', r'1600 m'],
    [r'$0{,}08 \cdot 2000 = 160$ m'])

Q.q(r'Eine Rollstuhlrampe darf höchstens 6 % steigen und soll 0,5 m Höhe überwinden. Wie lang muss sie waagerecht mindestens sein (gerundet)?',
    [r'8,33 m', r'3 m', r'0,03 m', r'12 m'],
    [r'$\dfrac{0{,}5}{x} = 0{,}06$',
     r'$x = 0{,}5 : 0{,}06 \approx 8{,}33$ m'])

# ------------------------------------------------------------------- Dach ----
Q.q(r'Ein Haus ist 10 m breit, der First liegt 3,5 m über dem Dachboden in der Mitte. Wie groß ist die Dachneigung (gerundet)?',
    [r'$35{,}0^\circ$', r'$19{,}3^\circ$', r'$70{,}0^\circ$', r'$55{,}0^\circ$'],
    [r'Halbe Hausbreite: 5 m.',
     r'$\tan \alpha = \dfrac{3{,}5}{5} = 0{,}7$, also $\alpha \approx 35{,}0^\circ$.'])

Q.q(r'Wie lang ist ein Sparren dieses Daches (halbe Breite 5 m, Höhe 3,5 m, gerundet)?',
    [r'6,10 m', r'8,5 m', r'3,57 m', r'37,25 m'],
    [r'$s = \sqrt{25 + 12{,}25} = \sqrt{37{,}25} \approx 6{,}10$ m'])

# -------------------------------------------------------- Seil und Drachen ----
Q.q(r'Ein 12 m hoher Mast wird mit einem Seil gesichert, das 5 m vom Mastfuß im Boden verankert ist. Wie lang ist das Seil?',
    [r'13 m', r'17 m', r'10,9 m', r'169 m'],
    [r'$s = \sqrt{144 + 25} = \sqrt{169} = 13$ m'])

Q.q(r'Welchen Winkel bildet dieses Seil mit dem Boden (gerundet)?',
    [r'$67{,}38^\circ$', r'$22{,}62^\circ$', r'$45^\circ$', r'$2{,}4^\circ$'],
    [r'$\tan \alpha = \dfrac{12}{5} = 2{,}4$',
     r'$\alpha \approx 67{,}38^\circ$'])

Q.q(r'Die Schnur eines Drachens ist 50 m lang und gespannt, sie bildet mit dem Boden $40^\circ$. Wie hoch fliegt der Drachen über der Hand (gerundet)?',
    [r'32,14 m', r'38,30 m', r'41,95 m', r'59,59 m'],
    [r'$h = 50 \cdot \sin 40^\circ \approx 32{,}14$ m'])

# ----------------------------------------------------- Höhen über Winkel ----
Q.q(r'Ein Baum wirft einen 15 m langen Schatten, die Sonnenstrahlen fallen unter $35^\circ$ ein. Wie hoch ist der Baum (gerundet)?',
    [r'10,50 m', r'8,60 m', r'21,42 m', r'12,29 m'],
    [r'$\tan 35^\circ = \dfrac{h}{15}$',
     r'$h = 15 \cdot \tan 35^\circ \approx 10{,}50$ m'])

Q.q(r'Ein Flugzeug steigt unter $12^\circ$ und legt dabei 3 km Flugstrecke zurück. Welche Höhe gewinnt es (gerundet)?',
    [r'624 m', r'638 m', r'2934 m', r'250 m'],
    [r'Die Flugstrecke ist die Hypotenuse.',
     r'$h = 3000 \cdot \sin 12^\circ \approx 624$ m'])

Q.q(r'Eine Rolltreppe überwindet 6 m Höhe bei $30^\circ$ Neigung. Wie lang ist sie?',
    [r'12 m', r'3 m', r'10,39 m', r'6,93 m'],
    [r'$\sin 30^\circ = \dfrac{6}{s}$',
     r'$s = \dfrac{6}{0{,}5} = 12$ m'])

Q.q(r'Aus 40 m Entfernung sieht man die Turmspitze unter $52^\circ$. Die Augen sind 1,60 m hoch. Wie hoch ist der Turm (gerundet)?',
    [r'52,8 m', r'51,2 m', r'32,9 m', r'65,0 m'],
    [r'Höhe über Augenhöhe: $40 \cdot \tan 52^\circ \approx 51{,}20$ m',
     r'Dazu die Augenhöhe: $51{,}20 + 1{,}60 \approx 52{,}8$ m'])

Q.q(r'Welchem Winkel entspricht eine Steigung von 100 %?',
    [r'$45^\circ$', r'$90^\circ$', r'$100^\circ$', r'$60^\circ$'],
    [r'100 %: Höhe gleich waagerechte Strecke, $\tan \alpha = 1$.',
     r'$\alpha = 45^\circ$; eine senkrechte Wand hätte keine endliche Prozentangabe.'])

Q.q(r'Eine Seilbahn ist 1200 m lang und überwindet 300 m Höhe. Wie groß ist ihr mittlerer Neigungswinkel (gerundet)?',
    [r'$14{,}48^\circ$', r'$14{,}04^\circ$', r'$75{,}52^\circ$', r'$25^\circ$'],
    [r'Die Seillänge ist die Hypotenuse: $\sin \alpha = \dfrac{300}{1200} = 0{,}25$',
     r'$\alpha \approx 14{,}48^\circ$; mit $\tan^{-1}$ hätte man fälschlich die Seillänge als waagerecht angenommen.'])

Q.q(r'Eine Treppenstufe ist 17 cm hoch und 29 cm tief. Wie steil ist die Treppe (gerundet)?',
    [r'$30{,}38^\circ$', r'$59{,}62^\circ$', r'$35{,}87^\circ$', r'$17^\circ$'],
    [r'$\tan \alpha = \dfrac{17}{29}$',
     r'$\alpha \approx 30{,}38^\circ$'])

Q.q(r'Was ist bei einer Sachaufgabe zu rechtwinkligen Dreiecken meist der erste Schritt?',
    [r'eine Skizze mit dem rechtwinkligen Dreieck und den bekannten Größen', r'sofort den Sinus ausrechnen',
     r'alle Zahlen addieren', r'den Taschenrechner auf RAD stellen'],
    [r'In der Skizze erkennt man Hypotenuse, Gegen- und Ankathete.',
     r'Dann wählt man die passende Beziehung.'])

Q.q(r'Um die Breite eines Flusses zu bestimmen, misst man am Ufer 50 m entlang und peilt unter $60^\circ$ einen Baum genau gegenüber dem Startpunkt an. Wie breit ist der Fluss (gerundet)?',
    [r'86,6 m', r'43,3 m', r'28,9 m', r'100 m'],
    [r'Am Startpunkt ist ein rechter Winkel, 50 m ist die Ankathete des $60^\circ$-Winkels.',
     r'$b = 50 \cdot \tan 60^\circ \approx 86{,}6$ m'])

Q.q(r'Eine Rutsche ist oben 2,5 m hoch und hat $35^\circ$ Neigung. Wie lang ist die Rutschfläche (gerundet)?',
    [r'4,36 m', r'3,57 m', r'1,43 m', r'3,05 m'],
    [r'$\sin 35^\circ = \dfrac{2{,}5}{s}$',
     r'$s = \dfrac{2{,}5}{\sin 35^\circ} \approx 4{,}36$ m'])


def check():
    from math import sin, cos, tan, asin, atan, degrees as d, radians as r, sqrt, isclose
    R = lambda v, n=2: round(v, n)
    assert R(6 * sin(r(70))) == 5.64 and R(6 * cos(r(70))) == 2.05
    assert R(d(atan(0.1))) == 5.71 and R(0.08 * 2000) == 160 and R(0.5 / 0.06) == 8.33
    assert R(d(atan(0.7)), 1) == 35.0 and R(sqrt(37.25)) == 6.10
    assert sqrt(169) == 13 and R(d(atan(2.4))) == 67.38
    assert R(50 * sin(r(40))) == 32.14 and R(15 * tan(r(35))) == 10.50
    assert round(3000 * sin(r(12))) == 624 and isclose(6 / sin(r(30)), 12)
    assert R(40 * tan(r(52)) + 1.6, 1) == 52.8
    assert isclose(d(atan(1)), 45) and R(d(asin(0.25))) == 14.48 and R(d(atan(0.25))) == 14.04
    assert R(d(atan(17 / 29))) == 30.38
    assert R(50 * tan(r(60)), 1) == 86.6 and R(2.5 / sin(r(35))) == 4.36


Q.verify(check)
Q.save()
