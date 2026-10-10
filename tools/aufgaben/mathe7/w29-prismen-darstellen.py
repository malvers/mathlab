#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 29 / KW 15 (LB 4): representing right prisms -
recognising base and lateral faces, nets, oblique drawings, two-view drawings (plan and
elevation), side views. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os7
from osfig import dachprisma, prisma

Q = os7(nr=29, slug='prismen-darstellen', thema='Prismen darstellen', lb='LB 4',
        blurb='Grundfläche und Mantel, Körpernetz, Schrägbild, Zweitafelbild, Seitenansichten',
        comment='Blocks: recognising prisms (1-3, 14-15, 17), nets (4-5, 16, 19), oblique drawing (11, 13, 20), two-view drawings and views (6-10, 12, 18).')

fig_dach = dachprisma(4, 3, 6, label='liegendes Dreiecksprisma')
cap_dach = r'Liegendes Dreiecksprisma (vorne das Dreieck)'
TRAPEZ = [(0, 0), (6, 0), (4.5, 3), (1.5, 3)]

# -------------------------------------------------------------- recognising prisms ----
Q.q(r'Woran erkennt man ein gerades Prisma?',
    [r'zwei deckungsgleiche, parallele Grundflächen und rechteckige Seitenflächen', r'eine Spitze oben',
     r'nur gekrümmte Flächen', r'genau sechs gleiche Quadrate'],
    [r'Grund- und Deckfläche sind gleich und liegen parallel.',
     r'Die Seitenflächen stehen senkrecht darauf und sind Rechtecke.',
     r'Pyramide und Kegel haben eine Spitze – sie sind keine Prismen.'])

Q.q(r'Welche Flächen sind beim abgebildeten Prisma die Grundflächen?',
    [r'die beiden Dreiecke vorne und hinten', r'die untere Rechteckfläche', r'die beiden schrägen Rechtecke', r'Es hat keine Grundfläche.'],
    [r'Die Grundflächen sind die beiden deckungsgleichen, parallelen Flächen.',
     r'Hier sind es die Dreiecke vorne und hinten.',
     r'Auch wenn das Prisma liegt, bleiben die Dreiecke die Grundflächen.'],
    fig=fig_dach, figcap=cap_dach)

Q.q(r'Ein Prisma hat ein Fünfeck als Grundfläche. Wie viele Seitenflächen hat es?',
    [r'5', r'7', r'10', r'2'],
    [r'An jeder Seite der Grundfläche steht eine Seitenfläche.',
     r'Ein Fünfeck hat 5 Seiten.',
     r'Also 5 Seitenflächen (dazu 2 Grundflächen = 7 Flächen).'])

Q.q(r'Wie viele Kanten hat ein Prisma mit einem Sechseck als Grundfläche?',
    [r'18', r'12', r'6', r'24'],
    [r'Grundfläche: 6 Kanten, Deckfläche: 6 Kanten.',
     r'Dazu 6 Kanten von unten nach oben.',
     r'$6 + 6 + 6 = 18$'])

Q.q(r'Wie viele Ecken hat ein Prisma mit einem Sechseck als Grundfläche?',
    [r'12', r'6', r'18', r'8'],
    [r'Unten 6 Ecken.',
     r'Oben noch einmal 6 Ecken.',
     r'Zusammen 12.'])

Q.q(r'Welche Form hat die Grundfläche des abgebildeten Prismas?',
    [r'Trapez', r'Rechteck', r'Dreieck', r'Raute'],
    [r'Die Grundfläche ist vorne in wahrer Größe zu sehen.',
     r'Unten lang, oben kurz, oben und unten parallel.',
     r'Das ist ein Trapez.'],
    fig=prisma(TRAPEZ, 5, label='Prisma mit Trapez als Grundfläche'), figcap=r'Ein gerades Prisma')

# ----------------------------------------------------------------------------- nets ----
Q.q(r'Aus welchen Flächen besteht das Netz eines Dreiecksprismas?',
    [r'2 Dreiecke und 3 Rechtecke', r'3 Dreiecke und 2 Rechtecke', r'1 Dreieck und 3 Rechtecke', r'5 Rechtecke'],
    [r'Zwei Grundflächen: Dreiecke.',
     r'Drei Seitenflächen: Rechtecke.',
     r'Zusammen 5 Flächen.'])

Q.q(r'Ein Prisma hat ein rechtwinkliges Dreieck mit 3 cm, 4 cm und 5 cm als Grundfläche und ist 10 cm hoch. Welche Maße hat der Mantel, wenn man ihn als ein Rechteck abwickelt?',
    [r'12 cm × 10 cm', r'5 cm × 10 cm', r'12 cm × 12 cm', r'6 cm × 10 cm'],
    [r'Die drei Seitenflächen liegen im Netz nebeneinander.',
     r'Zusammen sind sie so breit wie der Umfang: $3 + 4 + 5 = 12$ cm.',
     r'Und so hoch wie das Prisma: 10 cm.'])

Q.q(r'Wie viele Flächen hat das Netz eines Sechseckprismas?',
    [r'8', r'6', r'12', r'7'],
    [r'2 Sechsecke als Grund- und Deckfläche.',
     r'6 Rechtecke als Seitenflächen.',
     r'Zusammen 8 Flächen.'])

Q.q(r'Ein Prisma ist 8 cm hoch, seine Grundfläche ist ein Quadrat mit 3 cm Seitenlänge. Welche Maße hat jede Seitenfläche?',
    [r'3 cm × 8 cm', r'3 cm × 3 cm', r'8 cm × 8 cm', r'12 cm × 8 cm'],
    [r'Jede Seitenfläche steht auf einer Quadratseite.',
     r'Breite 3 cm, Höhe 8 cm.',
     r'Vier solche Rechtecke bilden den Mantel (12 cm × 8 cm).'])

# ------------------------------------------------------------------- oblique drawing ----
Q.q(r'Wie zeichnet man im Schrägbild die nach hinten laufenden Kanten?',
    [r'unter 45° und auf die Hälfte verkürzt', r'senkrecht nach oben', r'in wahrer Länge waagerecht', r'gar nicht'],
    [r'Vorderfläche in wahrer Größe.',
     r'Tiefenkanten schräg unter 45°.',
     r'Und auf die Hälfte verkürzt, damit der Körper natürlich wirkt.'])

Q.q(r'Wie zeichnet man verdeckte Kanten in Schrägbild und Zweitafelbild?',
    [r'gestrichelt', r'dick', r'gar nicht', r'doppelt'],
    [r'Verdeckte Kanten sieht man in Wirklichkeit nicht.',
     r'Man zeichnet sie trotzdem, damit der Körper klar wird.',
     r'Sie werden gestrichelt.'])

Q.q(r'Ein Quader ist 6 cm breit, 4 cm tief und 3 cm hoch. Wie lang zeichnet man im Schrägbild die Tiefenkanten?',
    [r'2 cm', r'4 cm', r'3 cm', r'8 cm'],
    [r'Die Tiefe ist 4 cm.',
     r'Tiefenkanten werden halbiert.',
     r'$4 : 2 = 2$ cm'])

# ------------------------------------------------------- two-view drawings and views ----
Q.q(r'Was zeigt der Grundriss in einem Zweitafelbild?',
    [r'die Ansicht von oben', r'die Ansicht von vorn', r'die Ansicht von rechts', r'das Körpernetz'],
    [r'Ein Zweitafelbild besteht aus zwei Ansichten.',
     r'Der Grundriss ist der Blick von oben.',
     r'Der Aufriss ist der Blick von vorn.'])

Q.q(r'Was zeigt der Aufriss in einem Zweitafelbild?',
    [r'die Ansicht von vorn', r'die Ansicht von oben', r'die Ansicht von unten', r'ein Schrägbild'],
    [r'Aufriss: Man schaut von vorn auf den Körper.',
     r'Er wird über dem Grundriss gezeichnet.',
     r'Zusammen beschreiben beide Ansichten den Körper.'])

Q.q(r'Wie liegen Grundriss und Aufriss im Zweitafelbild zueinander?',
    [r'Der Aufriss steht über dem Grundriss, zusammengehörige Punkte liegen senkrecht übereinander.',
     r'Sie liegen nebeneinander und sind gedreht.', r'Der Grundriss steht über dem Aufriss.',
     r'Sie werden übereinander gezeichnet und überlappen sich.'],
    [r'Zwischen beiden Ansichten liegt die Rissachse.',
     r'Ordnungslinien verbinden zusammengehörige Punkte senkrecht.',
     r'So kann man Längen von einer Ansicht in die andere übertragen.'])

Q.q(r'Was sieht man beim abgebildeten liegenden Dreiecksprisma im Aufriss (von vorn) und im Grundriss (von oben)?',
    [r'Aufriss: ein Dreieck; Grundriss: ein Rechteck', r'Aufriss: ein Rechteck; Grundriss: ein Dreieck',
     r'beide Male ein Dreieck', r'beide Male ein Quadrat'],
    [r'Von vorn sieht man die dreieckige Grundfläche.',
     r'Von oben sieht man die beiden Dachflächen nebeneinander.',
     r'Zusammen ergeben sie ein Rechteck (mit der Firstlinie in der Mitte).'],
    fig=fig_dach, figcap=cap_dach)

Q.q(r'Ein Prisma mit einem regelmäßigen Sechseck als Grundfläche steht aufrecht auf dem Tisch. Wie sieht sein Grundriss aus?',
    [r'wie ein Sechseck', r'wie ein Rechteck', r'wie ein Dreieck', r'wie ein Kreis'],
    [r'Von oben schaut man genau auf die Deckfläche.',
     r'Sie ist deckungsgleich mit der Grundfläche.',
     r'Der Grundriss ist das Sechseck.'])

Q.q(r'Wie sieht das abgebildete liegende Dreiecksprisma von rechts aus?',
    [r'wie ein Rechteck', r'wie ein Dreieck', r'wie ein Trapez', r'wie ein Kreis'],
    [r'Von rechts schaut man auf die rechte Dachfläche.',
     r'Sie ist so lang wie das Prisma und so hoch wie die schräge Dreiecksseite.',
     r'Man sieht ein Rechteck.'],
    fig=fig_dach, figcap=cap_dach)


Q.q(r'Ein Würfel mit 3 cm Kantenlänge steht gerade vor dir. Wie sehen Grundriss und Aufriss aus?',
    [r'beide als Quadrat mit 3 cm Seitenlänge', r'Grundriss Quadrat, Aufriss Dreieck', r'beide als Rechteck 3 cm × 1,5 cm',
     r'Grundriss Kreis, Aufriss Quadrat'],
    [r'Von oben sieht man die Deckfläche: ein Quadrat.',
     r'Von vorn sieht man die Vorderfläche: auch ein Quadrat.',
     r'Im Zweitafelbild wird nicht verkürzt – beide sind 3 cm × 3 cm.'])

def check():
    assert 5 + 2 == 7 and 6 * 3 == 18 and 2 * 6 == 12 and 2 + 6 == 8
    assert 3 + 4 + 5 == 12 and 3 ** 2 + 4 ** 2 == 5 ** 2 and 4 * 3 == 12 and 4 / 2 == 2
    assert TRAPEZ[2][1] == TRAPEZ[3][1] and TRAPEZ[0][1] == TRAPEZ[1][1]


Q.verify(check)
Q.save()
