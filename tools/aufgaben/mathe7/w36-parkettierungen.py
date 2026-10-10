#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 36 / KW 22 (WB 3 Parkettierungen): tilings with
polygons - angle condition at a vertex, regular and semi-regular tilings (Kepler 1619),
every triangle and quadrilateral tiles, tiling a room, pentagon tilings (complete since
2017) and the aperiodic hat tile (2023). Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from decimal import Decimal as D
from math import ceil
from quiz import os7
from osfig import parkett_sechseck

Q = os7(nr=36, slug='parkettierungen', thema='Parkettierungen aus Vielecken', lb='WB 3',
        blurb='lückenlos auslegen, Winkel an einer Ecke, regelmäßige Vielecke, Fliesen berechnen',
        comment='Blocks: idea (1-2, 18), regular polygons (3-9, 12), any triangle and quadrilateral (10-11), tiling a room (13-15), research and history (16-17, 19-20).')

inner = lambda n: F(180 * (n - 2), n)

# --------------------------------------------------------------------------- idea ----
Q.q(r'Was ist eine Parkettierung?',
    [r'eine lückenlose Auslegung der Ebene mit Figuren, die sich nicht überlappen', r'ein Muster aus Kreisen',
     r'eine Zeichnung mit dem Lineal', r'ein Holzfußboden aus Brettern verschiedener Länge'],
    [r'Die Figuren bedecken die Fläche vollständig.',
     r'Es gibt keine Lücken.',
     r'Und keine Figur liegt auf einer anderen.'])

Q.q(r'Welche Bedingung muss an jeder Ecke einer Parkettierung erfüllt sein?',
    [r'Die Winkel, die dort zusammenkommen, ergeben genau 360°.', r'Es treffen sich genau 4 Ecken.',
     r'Die Winkel ergeben 180°.', r'Alle Winkel sind rechte Winkel.'],
    [r'Um einen Punkt herum ist ein Vollwinkel: 360°.',
     r'Weniger: Es bleibt eine Lücke. Mehr: Die Figuren überlappen.',
     r'Also genau 360°.'])

Q.q(r'Warum kann man mit Kreisen keine Parkettierung legen?',
    [r'Zwischen den Kreisen bleiben immer Lücken.', r'Kreise sind zu groß.', r'Kreise haben zu viele Ecken.',
     r'Doch, das geht.'],
    [r'Kreise berühren sich höchstens in einzelnen Punkten.',
     r'Dazwischen bleiben gebogene Dreiecke frei.',
     r'Das ist keine lückenlose Auslegung.'])

# ------------------------------------------------------------------ regular polygons ----
Q.q(r'Wie viele gleichseitige Dreiecke treffen in einem Dreiecksparkett an einer Ecke zusammen?',
    [r'6', r'3', r'4', r'8'],
    [r'Jeder Winkel im gleichseitigen Dreieck ist 60°.',
     r'$360° : 60° = 6$',
     r'Sechs Dreiecke an jeder Ecke.'])

Q.q(r'Wie viele Quadrate treffen in einem Quadratparkett an einer Ecke zusammen?',
    [r'4', r'3', r'6', r'2'],
    [r'Jeder Winkel im Quadrat ist 90°.',
     r'$360° : 90° = 4$',
     r'Wie beim Karopapier.'])

Q.q(r'Wie viele regelmäßige Sechsecke treffen sich an jeder Ecke des Parketts?',
    [r'3', r'6', r'4', r'2'],
    [r'Jeder Innenwinkel des regelmäßigen Sechsecks ist 120°.',
     r'$360° : 120° = 3$',
     r'Drei Sechsecke an jeder Ecke – wie bei Bienenwaben.'],
    fig=parkett_sechseck(), figcap=r'Parkett aus regelmäßigen Sechsecken')

Q.q(r'Kann man mit regelmäßigen Fünfecken allein lückenlos parkettieren?',
    [r'Nein, 108° passen nicht in 360°.', r'Ja, wie mit Sechsecken.', r'Ja, wenn man sie dreht.', r'Nur auf runden Flächen.'],
    [r'Innenwinkel des regelmäßigen Fünfecks: $(5 - 2) \cdot 180° : 5 = 108°$.',
     r'$3 \cdot 108° = 324°$ (Lücke), $4 \cdot 108° = 432°$ (Überlappung).',
     r'360 ist kein Vielfaches von 108: Es geht nicht.'])

Q.q(r'Kann man mit regelmäßigen Achtecken allein parkettieren?',
    [r'Nein, 135° passen nicht in 360°.', r'Ja.', r'Ja, mit 4 Achtecken an jeder Ecke.', r'Nur mit sehr kleinen Achtecken.'],
    [r'Innenwinkel des regelmäßigen Achtecks: 135°.',
     r'$2 \cdot 135° = 270°$, $3 \cdot 135° = 405°$.',
     r'Es bleibt immer eine Lücke oder es überlappt.'])

Q.q(r'Ein beliebtes Fliesenmuster besteht aus regelmäßigen Achtecken und Quadraten. Was trifft an jeder Ecke zusammen?',
    [r'zwei Achtecke und ein Quadrat', r'vier Achtecke', r'ein Achteck und zwei Quadrate', r'drei Quadrate'],
    [r'$135° + 135° + 90° = 360°$',
     r'Zwei Achtecke lassen eine 90°-Lücke.',
     r'Genau dort passt ein Quadrat hinein.'])

Q.q(r'Mit welchen regelmäßigen Vielecken allein kann man lückenlos parkettieren?',
    [r'nur mit gleichseitigen Dreiecken, Quadraten und regelmäßigen Sechsecken', r'mit allen regelmäßigen Vielecken',
     r'nur mit Quadraten', r'mit Dreiecken, Quadraten, Fünfecken und Sechsecken'],
    [r'Der Innenwinkel muss ein Teiler von 360° sein.',
     r'60°, 90° und 120° passen; 108°, 135°, 140° … nicht.',
     r'Ab dem Siebeneck ist der Winkel größer als 120° und kleiner als 180°: Es passen weniger als 3, aber mehr als 2.'])

Q.q(r'Warum füllen Bienen ihre Waben mit Sechsecken und nicht mit Quadraten?',
    [r'Sechsecke brauchen bei gleicher Fläche weniger Wand (Wachs).', r'Quadrate lassen Lücken.',
     r'Sechsecke sind größer.', r'Bienen können keine Quadrate bauen.'],
    [r'Auch Quadrate und Dreiecke parkettieren lückenlos.',
     r'Von diesen drei hat das Sechseck bei gleicher Fläche den kleinsten Umfang.',
     r'So sparen die Bienen Wachs (bewiesen von Thomas Hales 1999).'])

# -------------------------------------------------- any triangle and quadrilateral ----
Q.q(r'Kann man mit jedem beliebigen, gleichen Dreieck parkettieren?',
    [r'Ja, zwei Dreiecke ergeben ein Parallelogramm, und Parallelogramme parkettieren.', r'Nein, nur mit gleichseitigen.',
     r'Nein, nur mit rechtwinkligen.', r'Nur mit gleichschenkligen.'],
    [r'Ein Dreieck und seine gedrehte Kopie bilden ein Parallelogramm.',
     r'Parallelogramme lassen sich in Streifen lückenlos legen.',
     r'An jeder Ecke liegen $\alpha$, $\beta$, $\gamma$ je zweimal: $2 \cdot 180° = 360°$.'])

Q.q(r'Kann man mit jedem beliebigen, gleichen Viereck parkettieren?',
    [r'Ja, an jeder Ecke kommen alle vier Winkel einmal zusammen: 360°.', r'Nein, nur mit Rechtecken.',
     r'Nein, nur mit Quadraten.', r'Nur mit Trapezen.'],
    [r'Die Winkelsumme im Viereck ist 360°.',
     r'Man dreht das Viereck abwechselnd um die Seitenmitten.',
     r'So liegen an jeder Ecke $\alpha + \beta + \gamma + \delta = 360°$.'])

# ---------------------------------------------------------------------- tiling a room ----
Q.q(r'Ein Bad ist 3 m lang und 2 m breit. Wie viele quadratische Fliesen mit 20 cm Seitenlänge braucht man für den Boden?',
    [r'150', r'30', r'600', r'15'],
    [r'Längs: $300 : 20 = 15$ Fliesen, quer: $200 : 20 = 10$ Fliesen.',
     r'$15 \cdot 10 = 150$',
     r'Oder: $6 \text{ m}^2 : 0{,}04 \text{ m}^2 = 150$.'])

Q.q(r'Für Verschnitt plant man 10 % mehr Fliesen ein. Wie viele kauft man statt 150?',
    [r'165', r'160', r'150', r'15'],
    [r'10 % von 150 sind 15.',
     r'$150 + 15 = 165$',
     r'Man kauft 165 Fliesen.'])

Q.q(r'Ein Flur hat 4,5 m². Sechseckige Fliesen haben je 0,05 m². Wie viele Fliesen braucht man mindestens (ohne Verschnitt)?',
    [r'90', r'225', r'9', r'45'],
    [r'Fläche durch Fläche einer Fliese.',
     r'$4{,}5 : 0{,}05$',
     r'$= 90$ Fliesen'])

# ------------------------------------------------------------- research and history ----
Q.q(r'Johannes Kepler beschrieb 1619 Parkette aus verschiedenen regelmäßigen Vielecken, bei denen jede Ecke gleich aussieht. Wie viele solche „archimedischen“ Parkette gibt es?',
    [r'8', r'3', r'11', r'unendlich viele'],
    [r'Neben den 3 regelmäßigen Parketten (nur eine Sorte) gibt es Mischungen.',
     r'Beispiel: Achteck, Achteck, Quadrat oder Sechseck, Dreieck, Sechseck, Dreieck.',
     r'Kepler fand in „Harmonices Mundi“ alle 8 solche Parkette.'])

Q.q(r'Gibt es überhaupt Fünfecke, mit denen man lückenlos parkettieren kann?',
    [r'Ja, aber keine regelmäßigen; man kennt genau 15 Arten (vollständig bewiesen 2017).', r'Nein, mit Fünfecken geht es nie.',
     r'Ja, jedes Fünfeck parkettiert.', r'Nur das regelmäßige Fünfeck.'],
    [r'Regelmäßige Fünfecke scheitern an den 108°-Winkeln.',
     r'Mit unregelmäßigen, gleichen Fünfecken geht es manchmal – zum Beispiel mit „Hausfünfecken“.',
     r'Die 15. Art wurde 2015 gefunden; 2017 bewies Michaël Rao, dass es keine weitere gibt.'])

Q.q(r'2023 stellten der Hobby-Forscher David Smith und drei Mathematiker die „Hut“-Kachel vor. Was ist besonders an ihr?',
    [r'Sie füllt die Ebene lückenlos, aber das Muster wiederholt sich nie.', r'Sie ist ein Kreis.',
     r'Sie kann keine Parkettierung bilden.', r'Sie ist das erste Quadrat mit fünf Ecken.'],
    [r'Normale Parkette wiederholen sich: Man kann sie verschieben und sie passen wieder.',
     r'Mit der „Hut“-Kachel allein entsteht ein Parkett ohne jede Wiederholung.',
     r'Mathematiker hatten lange nach so einer „Einstein“-Kachel (ein Stein) gesucht.'])

Q.q(r'Welche Anordnung von regelmäßigen Vielecken passt NICHT lückenlos um eine Ecke?',
    [r'ein Quadrat, ein Sechseck und ein Achteck', r'drei Dreiecke und zwei Quadrate', r'zwei Achtecke und ein Quadrat',
     r'zwei Dreiecke und zwei Sechsecke'],
    [r'Winkel addieren: $90° + 120° + 135° = 345°$ – es bleibt eine Lücke.',
     r'$3 \cdot 60° + 2 \cdot 90° = 360°$, $2 \cdot 135° + 90° = 360°$, $2 \cdot 60° + 2 \cdot 120° = 360°$',
     r'Nur die erste Anordnung passt nicht.'])


def check():
    assert inner(3) == 60 and 360 / 60 == 6 and inner(4) == 90 and 360 / 90 == 4 and inner(6) == 120 and 360 / 120 == 3
    assert inner(5) == 108 and 3 * 108 < 360 < 4 * 108 and inner(8) == 135 and 2 * 135 < 360 < 3 * 135
    assert 2 * inner(8) + inner(4) == 360
    assert [n for n in range(3, 50) if 360 % inner(n) == 0] == [3, 4, 6]
    assert (300 // 20) * (200 // 20) == 150 and 150 * D('1.1') == 165 and D('4.5') / D('0.05') == 90
    assert inner(4) + inner(6) + inner(8) == 345
    assert 3 * inner(3) + 2 * inner(4) == 360 and 2 * inner(3) + 2 * inner(6) == 360


Q.verify(check)
Q.save()
