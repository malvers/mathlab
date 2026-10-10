#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 39 / KW 25 (Wahlpflichtbereich 1 Das Fahrrad):
Übersetzungsverhältnis, Entfaltung, Trittfrequenz und Geschwindigkeit. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=39, slug='fahrrad-uebersetzung', thema='Das Fahrrad: Übersetzung und Geschwindigkeit', lb='WB 1',
        blurb='Kettenblatt und Ritzel, Weg pro Kurbelumdrehung, Trittfrequenz, Geschwindigkeit',
        comment='Blocks: gear ratio (1-2, 4-5, 8-9, 12, 17-18, 20), distance per crank turn (3, 11, 19), speed from cadence (6-7, 10, 15), speed and time (13-14, 16).')

# ---------------------------------------------------------- Übersetzung ----
Q.q(r'Das Kettenblatt hat 44 Zähne, das Ritzel 11 Zähne. Wie groß ist die Übersetzung?',
    [r'4', r'0,25', r'33', r'55'],
    [r'Übersetzung $= \dfrac{\text{Zähne Kettenblatt}}{\text{Zähne Ritzel}} = \dfrac{44}{11}$',
     r'$= 4$'])

Q.q(r'Was bedeutet die Übersetzung 4?',
    [r'Bei einer Kurbelumdrehung dreht sich das Hinterrad 4-mal.', r'Das Hinterrad dreht sich 4-mal langsamer als die Kurbel.',
     r'Man muss 4-mal so stark treten.', r'Das Fahrrad hat 4 Gänge.'],
    [r'Die Kette bewegt pro Kurbelumdrehung 44 Zähne weiter.',
     r'Das Ritzel mit 11 Zähnen dreht sich dabei $44 : 11 = 4$-mal, und mit ihm das Hinterrad.'])

Q.q(r'Bei Übersetzung 4 und 2,2 m Radumfang: Welchen Weg legt das Rad bei einer Kurbelumdrehung zurück?',
    [r'8,8 m', r'2,2 m', r'0,55 m', r'6,2 m'],
    [r'4 Radumdrehungen zu je 2,2 m',
     r'$4 \cdot 2{,}2 = 8{,}8$ m; dieser Weg heißt Entfaltung.'])

Q.q(r'Kettenblatt 34 Zähne, Ritzel 17 Zähne. Wie groß ist die Übersetzung?',
    [r'2', r'0,5', r'17', r'51'],
    [r'$34 : 17 = 2$'])

Q.q(r'Welche Übersetzung wählt man am Berg?',
    [r'eine kleine: kleines Kettenblatt, großes Ritzel', r'eine große: großes Kettenblatt, kleines Ritzel',
     r'immer Übersetzung 4', r'Die Übersetzung spielt keine Rolle.'],
    [r'Bei kleiner Übersetzung kommt man pro Kurbelumdrehung weniger weit.',
     r'Dafür braucht man weniger Kraft pro Tritt.'])

Q.q(r'Trittfrequenz 80 Umdrehungen pro Minute, Übersetzung 3, Radumfang 2,1 m. Wie schnell fährt man (gerundet)?',
    [r'30,2 km/h', r'504 km/h', r'8,4 km/h', r'25,2 km/h'],
    [r'Weg pro Minute: $80 \cdot 3 \cdot 2{,}1 = 504$ m',
     r'Pro Stunde: $504 \cdot 60 = 30\,240$ m $\approx 30{,}2$ km'])

Q.q(r'Welche Formel liefert die Geschwindigkeit in Metern pro Minute?',
    [r'$v = \text{Trittfrequenz} \cdot \text{Übersetzung} \cdot \text{Radumfang}$',
     r'$v = \text{Trittfrequenz} + \text{Übersetzung} + \text{Radumfang}$',
     r'$v = \dfrac{\text{Radumfang}}{\text{Übersetzung}}$',
     r'$v = \text{Übersetzung} \cdot \text{Raddurchmesser}$'],
    [r'Kurbelumdrehungen pro Minute mal Radumdrehungen pro Kurbelumdrehung mal Weg pro Radumdrehung.'])

Q.q(r'Mit dem Kettenblatt 48 kann man die Ritzel 16 oder 12 wählen. Mit welchem fährt man bei gleicher Trittfrequenz schneller?',
    [r'mit Ritzel 12 (Übersetzung 4)', r'mit Ritzel 16 (Übersetzung 3)', r'mit beiden gleich schnell', r'mit Ritzel 16 (Übersetzung 4)'],
    [r'$48 : 16 = 3$ und $48 : 12 = 4$',
     r'Größere Übersetzung, mehr Weg pro Tritt.'])

Q.q(r'Ein Rad hat vorn 3 Kettenblätter und hinten 8 Ritzel. Wie viele Gangkombinationen gibt es?',
    [r'24', r'11', r'5', r'38'],
    [r'Jedes Kettenblatt mit jedem Ritzel: $3 \cdot 8 = 24$',
     r'Manche Kombinationen sind fast gleich oder ungünstig, gezählt werden aber alle.'])

Q.q(r'Mit Übersetzung 2,5 und 2,2 m Radumfang will man 25 km/h fahren. Welche Trittfrequenz braucht man ungefähr?',
    [r'etwa 76 pro Minute', r'etwa 90 pro Minute', r'etwa 4,5 pro Minute', r'etwa 115 pro Minute'],
    [r'25 km/h = 25 000 m in 60 min, also etwa 416,7 m pro Minute.',
     r'Pro Kurbelumdrehung: $2{,}5 \cdot 2{,}2 = 5{,}5$ m',
     r'$416{,}7 : 5{,}5 \approx 76$'])

Q.q(r'Kettenblatt 42, Ritzel 21, Radumfang 2,1 m. Wie groß ist die Entfaltung?',
    [r'4,2 m', r'2,1 m', r'1,05 m', r'8,4 m'],
    [r'Übersetzung: $42 : 21 = 2$',
     r'Entfaltung: $2 \cdot 2{,}1 = 4{,}2$ m'])

Q.q(r'Mit dem Kettenblatt 42 werden die Ritzel 14 und 28 verglichen. Welche Übersetzungen ergeben sich?',
    [r'3 und 1,5', r'1,5 und 3', r'3 und 0,67', r'28 und 14'],
    [r'$42 : 14 = 3$',
     r'$42 : 28 = 1{,}5$'])

Q.q(r'Ein Rad fährt 5 m pro Sekunde. Wie viel km/h sind das?',
    [r'18 km/h', r'5 km/h', r'300 km/h', r'1,4 km/h'],
    [r'In einer Stunde: $5 \cdot 3600 = 18\,000$ m = 18 km',
     r'Merke: m/s mal 3,6 ergibt km/h.'])

Q.q(r'Wie lange braucht man für 10 km bei 20 km/h?',
    [r'30 Minuten', r'2 Stunden', r'20 Minuten', r'50 Minuten'],
    [r'$t = \dfrac{10}{20} = 0{,}5$ h = 30 min'])

Q.q(r'Trittfrequenz 90 pro Minute, Entfaltung 6 m. Wie schnell fährt man?',
    [r'32,4 km/h', r'54 km/h', r'15 km/h', r'5,4 km/h'],
    [r'$90 \cdot 6 = 540$ m pro Minute',
     r'$540 \cdot 60 = 32\,400$ m pro Stunde = 32,4 km/h'])

Q.q(r'Eine Tour: 2 Stunden mit 20 km/h, dann 1 Stunde mit 14 km/h. Wie groß ist die Durchschnittsgeschwindigkeit?',
    [r'18 km/h', r'17 km/h', r'16 km/h', r'34 km/h'],
    [r'Strecke: $2 \cdot 20 + 1 \cdot 14 = 54$ km in 3 Stunden',
     r'$54 : 3 = 18$ km/h; 17 km/h wäre der Mittelwert der beiden Geschwindigkeiten, der die Zeiten nicht berücksichtigt.'])

Q.q(r'Welche Kombination ergibt den größten Gang?',
    [r'großes Kettenblatt und kleines Ritzel', r'kleines Kettenblatt und großes Ritzel',
     r'großes Kettenblatt und großes Ritzel', r'kleines Kettenblatt und kleines Ritzel'],
    [r'Die Übersetzung ist groß, wenn der Zähler (Kettenblatt) groß und der Nenner (Ritzel) klein ist.'])

Q.q(r'Mit einem Kettenblatt mit 42 Zähnen soll die Übersetzung 3,5 entstehen. Wie viele Zähne braucht das Ritzel?',
    [r'12', r'14', r'147', r'10'],
    [r'$42 : z = 3{,}5$',
     r'$z = 42 : 3{,}5 = 12$'])

Q.q(r'Die Entfaltung beträgt 7,5 m. Wie weit kommt man mit 1000 Kurbelumdrehungen?',
    [r'7,5 km', r'750 m', r'75 km', r'133 m'],
    [r'$1000 \cdot 7{,}5 = 7500$ m = 7,5 km'])

Q.q(r'Das Kettenblatt mit 40 Zähnen macht eine Umdrehung. Wie oft dreht sich ein Ritzel mit 16 Zähnen?',
    [r'2,5-mal', r'0,4-mal', r'24-mal', r'56-mal'],
    [r'Die Kette transportiert 40 Zähne.',
     r'Das Ritzel braucht 16 Zähne pro Umdrehung: $40 : 16 = 2{,}5$'])


def check():
    from fractions import Fraction as F
    assert F(44, 11) == 4 and 4 * F('2.2') == F('8.8') and F(34, 17) == 2
    assert round(80 * 3 * 2.1 * 60 / 1000, 1) == 30.2
    assert F(48, 16) == 3 and F(48, 12) == 4 and 3 * 8 == 24
    assert round(25000 / 60 / (2.5 * 2.2)) == 76
    assert F(42, 21) * F('2.1') == F('4.2') and F(42, 14) == 3 and F(42, 28) == F('1.5')
    assert 5 * 3600 == 18000 and F(10, 20) * 60 == 30
    assert F(90 * 6 * 60, 1000) == F('32.4')
    assert F(2 * 20 + 14, 3) == 18 and F(20 + 14, 2) == 17
    assert 42 / F('3.5') == 12 and 1000 * F('7.5') == 7500 and F(40, 16) == F('2.5')


Q.verify(check)
Q.save()
