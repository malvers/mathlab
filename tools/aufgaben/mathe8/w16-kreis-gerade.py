#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 16 / KW 51 (LB 3): Kreis und Gerade -
Sehne, Sekante, Tangente, Passante; regelmäßige Kreisornamente. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=16, slug='kreis-gerade', thema='Kreis und Gerade, Kreisornamente', lb='LB 3',
        blurb='Radius, Sehne, Sekante, Tangente, Passante, Rosetten und Mandalas',
        comment='Blocks: terms at the circle (1-5, 16-17), distance and position of a line (6-8, 20), tangents (9-11, 18), ornaments and angles (12-15, 19).')

# ------------------------------------------------------------ Begriffe ----
Q.q(r'Ein Kreis hat den Radius 4,5 cm. Wie groß ist sein Durchmesser?',
    [r'9 cm', r'2,25 cm', r'4,5 cm', r'14,1 cm'],
    [r'Der Durchmesser ist doppelt so lang wie der Radius.',
     r'$d = 2 \cdot 4{,}5 = 9$, also 9 cm.'])

Q.q(r'Wie heißt eine Strecke, die zwei Punkte eines Kreises verbindet?',
    [r'Sehne', r'Tangente', r'Radius', r'Passante'],
    [r'Eine Sehne verbindet zwei Kreispunkte.',
     r'Die längste Sehne ist der Durchmesser.'])

Q.q(r'Wie heißt eine Gerade, die einen Kreis in zwei Punkten schneidet?',
    [r'Sekante', r'Tangente', r'Passante', r'Sehne'],
    [r'Lateinisch secare heißt schneiden.',
     r'Das Stück der Sekante innerhalb des Kreises ist eine Sehne.'])

Q.q(r'Wie heißt eine Gerade, die mit einem Kreis genau einen Punkt gemeinsam hat?',
    [r'Tangente', r'Sekante', r'Passante', r'Durchmesser'],
    [r'Lateinisch tangere heißt berühren.',
     r'Der gemeinsame Punkt heißt Berührungspunkt.'])

Q.q(r'Wie heißt eine Gerade, die einen Kreis gar nicht trifft?',
    [r'Passante', r'Tangente', r'Sekante', r'Sehne'],
    [r'Die Passante „geht vorbei“.',
     r'Ihr Abstand vom Mittelpunkt ist größer als der Radius.'])

# --------------------------------------------- Abstand und Lage der Geraden ----
Q.q(r'Ein Kreis hat den Radius 5 cm. Eine Gerade hat vom Mittelpunkt den Abstand 3 cm. Was ist die Gerade?',
    [r'eine Sekante', r'eine Tangente', r'eine Passante', r'ein Durchmesser'],
    [r'Abstand kleiner als der Radius: Die Gerade läuft durch das Kreisinnere.',
     r'Sie schneidet den Kreis in zwei Punkten.'])

Q.q(r'Ein Kreis hat den Radius 5 cm. Eine Gerade hat vom Mittelpunkt den Abstand 5 cm. Was ist die Gerade?',
    [r'eine Tangente', r'eine Sekante', r'eine Passante', r'eine Sehne'],
    [r'Abstand gleich dem Radius: Die Gerade berührt den Kreis in genau einem Punkt.'])

Q.q(r'Ein Kreis hat den Radius 5 cm. Eine Gerade hat vom Mittelpunkt den Abstand 7 cm. Wie viele gemeinsame Punkte gibt es?',
    [r'keinen', r'einen', r'zwei', r'unendlich viele'],
    [r'Abstand größer als der Radius: Die Gerade verläuft ganz außerhalb.',
     r'Sie ist eine Passante.'])

# --------------------------------------------------------------- Tangenten ----
Q.q(r'Welchen Winkel bilden eine Tangente und der Radius zum Berührungspunkt?',
    [r'$90^\circ$', r'$45^\circ$', r'$180^\circ$', r'$60^\circ$'],
    [r'Die Tangente steht senkrecht auf dem Berührungsradius.',
     r'So konstruiert man sie auch: Senkrechte zum Radius im Kreispunkt.'])

Q.q(r'Wie viele Tangenten kann man von einem Punkt außerhalb eines Kreises an den Kreis legen?',
    [r'2', r'1', r'0', r'unendlich viele'],
    [r'Von außen kann man den Kreis links und rechts berühren.',
     r'Es gibt genau zwei Tangenten; ihre Berührungspunkte findet man mit dem Thaleskreis.'])

Q.q(r'Wie viele Tangenten an einen Kreis sind parallel zu einer vorgegebenen Geraden?',
    [r'2', r'1', r'4', r'keine'],
    [r'Die beiden Tangenten berühren den Kreis an gegenüberliegenden Enden eines Durchmessers.',
     r'Dieser Durchmesser steht senkrecht auf der vorgegebenen Richtung.'])

# ----------------------------------------------------------- Ornamente ----
Q.q(r'Du trägst den Radius mit dem Zirkel immer wieder auf dem Kreis ab. Wie oft passt er genau herum?',
    [r'6-mal', r'3-mal', r'2-mal', r'etwa 6,28-mal'],
    [r'Mittelpunkt und zwei benachbarte Punkte bilden ein gleichseitiges Dreieck mit Winkel $60^\circ$ am Mittelpunkt.',
     r'$360^\circ : 60^\circ = 6$, so entsteht die sechsblättrige Rosette.',
     r'6,28 wäre der Umfang geteilt durch den Radius, gemessen entlang des Bogens.'])

Q.q(r'Für ein regelmäßiges Achteck teilst du den Kreis in gleiche Mittelpunktswinkel. Wie groß ist einer?',
    [r'$45^\circ$', r'$40^\circ$', r'$60^\circ$', r'$135^\circ$'],
    [r'$360^\circ : 8 = 45^\circ$',
     r'$135^\circ$ ist der Innenwinkel des Achtecks an einer Ecke.'])

Q.q(r'Ein Mandala besteht aus 12 gleichen Kreisausschnitten. Wie groß ist der Winkel eines Ausschnitts?',
    [r'$30^\circ$', r'$12^\circ$', r'$36^\circ$', r'$24^\circ$'],
    [r'$360^\circ : 12 = 30^\circ$'])

Q.q(r'Ein Papierkreis wird dreimal nacheinander mittig gefaltet. In wie viele gleiche Ausschnitte ist er danach eingeteilt?',
    [r'8', r'6', r'3', r'9'],
    [r'Jedes Falten halbiert: $2 \cdot 2 \cdot 2 = 8$.',
     r'Ein Faltschnitt wiederholt sich deshalb 8-mal im Kreis.'])

Q.q(r'Ein Punkt $P$ ist 3 cm vom Mittelpunkt eines Kreises mit Radius 4 cm entfernt. Wo liegt $P$?',
    [r'innerhalb des Kreises', r'auf dem Kreis', r'außerhalb des Kreises', r'Das lässt sich nicht sagen.'],
    [r'Alle Kreispunkte haben den Abstand 4 cm vom Mittelpunkt.',
     r'3 cm ist weniger: $P$ liegt innen.'])

Q.q(r'Welche Sehne geht durch den Mittelpunkt des Kreises?',
    [r'der Durchmesser', r'der Radius', r'die Tangente', r'jede Sekante'],
    [r'Eine Sehne durch den Mittelpunkt ist ein Durchmesser.',
     r'Der Radius hat nur einen Endpunkt auf dem Kreis.'])

Q.q(r'Wie konstruierst du die Tangente in einem Kreispunkt $B$?',
    [r'Senkrechte zum Radius $\overline{MB}$ durch $B$', r'Parallele zum Radius $\overline{MB}$ durch $B$',
     r'Gerade durch $M$ und $B$', r'Mittelsenkrechte von $\overline{MB}$'],
    [r'Die Tangente steht senkrecht auf dem Berührungsradius.',
     r'Also: Radius $\overline{MB}$ zeichnen, in $B$ die Senkrechte errichten.'])

Q.q(r'Ein Fahrradrad hat 36 gleichmäßig verteilte Speichen. Wie groß ist der Winkel zwischen zwei benachbarten Speichen?',
    [r'$10^\circ$', r'$36^\circ$', r'$5^\circ$', r'$12^\circ$'],
    [r'$360^\circ : 36 = 10^\circ$'])

Q.q(r'Ein Rad steht auf einer ebenen Straße. Was ist die Straße, gesehen als Gerade, für den Radkreis?',
    [r'eine Tangente', r'eine Sekante', r'eine Passante', r'ein Durchmesser'],
    [r'Rad und Straße haben genau einen gemeinsamen Punkt, den Aufstandspunkt.',
     r'Die Speiche zum Aufstandspunkt steht senkrecht auf der Straße.'])


def check():
    assert 2 * 4.5 == 9
    r = 5
    pos = lambda d: 'Sekante' if d < r else ('Tangente' if d == r else 'Passante')
    assert pos(3) == 'Sekante' and pos(5) == 'Tangente' and pos(7) == 'Passante'
    assert 360 / 60 == 6
    assert 360 / 8 == 45 and (8 - 2) * 180 / 8 == 135
    assert 360 / 12 == 30
    assert 2 ** 3 == 8
    assert 3 < 4
    assert 360 / 36 == 10


Q.verify(check)
Q.save()
