#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 37 / KW 23 (WB 3 Parkettierungen): tilings with
pictorial motifs after M. C. Escher - template method by translation and half-turn, area
stays, perimeter changes, colouring (four colour theorem 1976), Penrose tilings (1974),
kaleidocycles. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os7

Q = os7(nr=37, slug='escher', thema='Parkette nach M. C. Escher', lb='WB 3',
        blurb='Schablonen durch Verschieben und Drehen, Flächeninhalt und Umfang, Färben, berühmte Parkette',
        comment='Blocks: Escher and his sources (1-2, 7), template method (3-6, 14-15, 18), area and perimeter (8, 10-11, 17, 20), symmetry, colours and more (9, 12-13, 16, 19).')

# ---------------------------------------------------------------- Escher, sources ----
Q.q(r'Wer war M. C. Escher?',
    [r'ein niederländischer Grafiker (1898–1972), berühmt für seine Parkette aus Tieren', r'ein deutscher Fußballtrainer',
     r'ein griechischer Mathematiker der Antike', r'der Erfinder des Tangrams'],
    [r'Maurits Cornelis Escher lebte von 1898 bis 1972.',
     r'Er schuf Drucke mit unmöglichen Bauwerken und Parkettierungen.',
     r'Seine Vögel, Fische und Echsen füllen die Fläche lückenlos.'])

Q.q(r'Wo sah Escher maurische Fliesenmuster, die ihn zu seinen Parketten anregten?',
    [r'in der Alhambra in Granada (Spanien)', r'im Kölner Dom', r'im Eiffelturm', r'in den Pyramiden von Gizeh'],
    [r'Escher besuchte die Alhambra 1922 und noch einmal 1936.',
     r'Dort zeichnete er viele geometrische Fliesenmuster ab.',
     r'Danach begann er, Parkette mit Figuren zu entwerfen.'])

Q.q(r'Auf welchem Grundparkett beruht Eschers Druck „Reptilien“ (1943), bei dem Echsen aus der Zeichnung kriechen?',
    [r'auf einem Parkett aus Sechsecken', r'auf einem Parkett aus Kreisen', r'auf einem Parkett aus Fünfecken', r'auf gar keinem Parkett'],
    [r'An jeder Ecke treffen sich drei Echsen – wie drei Sechsecke.',
     r'Jede Echse ist ein verändertes Sechseck.',
     r'Die Veränderungen sind Drehungen um die Ecken.'])

# ------------------------------------------------------------------ template method ----
Q.q(r'Aus einem Quadrat wird an einer Seite ein Stück ausgeschnitten und an der gegenüberliegenden Seite wieder angesetzt. Was passiert mit dem Flächeninhalt?',
    [r'Er bleibt gleich.', r'Er wird größer.', r'Er wird kleiner.', r'Er verdoppelt sich.'],
    [r'Was auf der einen Seite fehlt, kommt auf der anderen dazu.',
     r'Es wird nichts weggenommen und nichts hinzugefügt.',
     r'Der Flächeninhalt bleibt gleich.'])

Q.q(r'Mit welcher Bewegung wird das ausgeschnittene Stück dabei an die gegenüberliegende Seite gebracht?',
    [r'mit einer Verschiebung', r'mit einer Spiegelung', r'mit einer Streckung', r'gar nicht, es wird weggeworfen'],
    [r'Das Stück wird geradlinig über das Quadrat geschoben.',
     r'Es wird dabei nicht gedreht und nicht umgeklappt.',
     r'Das ist eine Verschiebung.'])

Q.q(r'Warum lässt sich die so veränderte Schablone wieder lückenlos auslegen?',
    [r'Die Ausbuchtung der einen Seite passt genau in die Einbuchtung der Nachbarkachel.', r'Weil sie größer ist.',
     r'Weil sie rund ist.', r'Das geht nur zufällig.'],
    [r'Gegenüberliegende Seiten haben jetzt genau dieselbe Form.',
     r'Legt man Kacheln nebeneinander, greifen sie ineinander wie Puzzleteile.',
     r'Das Grundparkett aus Quadraten bleibt im Hintergrund erhalten.'])

Q.q(r'Ein Stück wird an einer Seite ausgeschnitten und um die Mitte derselben Seite gedreht wieder angesetzt. Welche Bewegung ist das?',
    [r'eine halbe Drehung (um 180°)', r'eine Verschiebung', r'eine Spiegelung', r'eine Vergrößerung'],
    [r'Der Drehpunkt ist die Seitenmitte.',
     r'Das Stück wird um 180° herumgedreht.',
     r'So kann man auch eine einzelne Seite verändern.'])

Q.q(r'Funktioniert die Schablonen-Methode auch mit einem Parallelogramm statt einem Quadrat?',
    [r'Ja, auch Parallelogramme parkettieren, und Gegenseiten lassen sich gleich verändern.', r'Nein, nur mit Quadraten.',
     r'Nein, Parallelogramme parkettieren nicht.', r'Nur, wenn es ein Rechteck ist.'],
    [r'Parallelogramme lassen sich lückenlos in Streifen legen.',
     r'Gegenüberliegende Seiten sind parallel und gleich lang.',
     r'Also kann man sie genauso wie beim Quadrat verändern.'])

Q.q(r'Funktioniert die Methode mit Drehungen um die Seitenmitten auch mit einem beliebigen Dreieck?',
    [r'Ja, jedes Dreieck parkettiert, und jede Seite kann um ihre Mitte verändert werden.', r'Nein, nur mit gleichseitigen.',
     r'Nein, Dreiecke parkettieren nicht.', r'Nur mit rechtwinkligen.'],
    [r'Jedes Dreieck lässt sich durch Drehen um die Seitenmitten lückenlos legen.',
     r'Ein Stück wird an einer Seitenhälfte ausgeschnitten und an die andere Hälfte gedreht.',
     r'Die Nachbarn passen genau ineinander.'])

Q.q(r'Was muss beim Verändern einer Schablone beachtet werden, damit sie parkettiert?',
    [r'Jedes ausgeschnittene Stück wird an der passenden Stelle wieder angesetzt.', r'Man darf nur runde Stücke ausschneiden.',
     r'Man muss möglichst viel wegschneiden.', r'Die Schablone muss symmetrisch sein.'],
    [r'Fehlende Stücke ergäben Lücken.',
     r'Zusätzliche Stücke ergäben Überlappungen.',
     r'Darum: ausschneiden und genau gegenüber (oder gedreht) wieder ankleben.'])

# --------------------------------------------------------------- area and perimeter ----
Q.q(r'Eine Vogel-Kachel entsteht aus einem Quadrat mit 4 cm Seitenlänge. Wie groß ist der Flächeninhalt des Vogels?',
    [r'16 cm²', r'8 cm²', r'32 cm²', r'Das kann man nicht sagen.'],
    [r'Beim Verändern wurde nur verschoben.',
     r'Der Flächeninhalt bleibt wie beim Quadrat.',
     r'$4 \cdot 4 = 16$ cm²'])

Q.q(r'Was passiert meistens mit dem Umfang, wenn man aus einem Quadrat eine Escher-Figur macht?',
    [r'Er wird größer, weil die Ränder krummer und länger werden.', r'Er bleibt immer gleich.', r'Er wird kleiner.',
     r'Er wird null.'],
    [r'Der Flächeninhalt bleibt gleich.',
     r'Die gerade Seite wird durch eine geschwungene Linie ersetzt.',
     r'Eine geschwungene Linie zwischen denselben Punkten ist länger.'])

Q.q(r'Ein Escher-Parkett besteht aus 8 · 6 Kacheln, jede aus einem Quadrat mit 3 cm Seitenlänge. Wie groß ist die ganze Fläche?',
    [r'432 cm²', r'144 cm²', r'48 cm²', r'864 cm²'],
    [r'Eine Kachel: $3 \cdot 3 = 9$ cm²',
     r'Anzahl: $8 \cdot 6 = 48$ Kacheln',
     r'$48 \cdot 9 = 432$ cm²'])

Q.q(r'Aus einem Quadrat mit 5 cm Seitenlänge wird oben ein Stück mit 3 cm² ausgeschnitten und unten angesetzt, links eines mit 2 cm² und rechts angesetzt. Wie groß ist die Kachel?',
    [r'25 cm²', r'20 cm²', r'30 cm²', r'15 cm²'],
    [r'Jedes ausgeschnittene Stück wird wieder angesetzt.',
     r'Es geht nichts verloren und es kommt nichts dazu.',
     r'Also bleiben es $5 \cdot 5 = 25$ cm².'])

Q.q(r'Auf ein Blatt (21 cm × 29,7 cm) sollen ganze Quadratkacheln mit 3 cm Seitenlänge gezeichnet werden. Wie viele passen höchstens nebeneinander und untereinander?',
    [r'63', r'69', r'70', r'54'],
    [r'Quer: $21 : 3 = 7$ Kacheln.',
     r'Längs: $29{,}7 : 3 = 9{,}9$, also 9 ganze Kacheln.',
     r'$7 \cdot 9 = 63$'])

# ------------------------------------------------------ symmetry, colours and more ----
Q.q(r'Ein Escher-Parkett aus Vögeln wird um genau eine Kachel verschoben. Was passiert?',
    [r'Das Muster passt wieder genau auf sich selbst.', r'Es entstehen Lücken.', r'Die Vögel werden größer.',
     r'Die Vögel drehen sich um.'],
    [r'Alle Kacheln sind gleich und liegen in Reihen.',
     r'Eine Verschiebung um eine Kachel bringt jeden Vogel auf den Platz eines anderen.',
     r'Das Parkett ist verschiebungssymmetrisch.'])

Q.q(r'Wie viele Farben braucht man mindestens, damit beim Schachbrettmuster benachbarte Quadrate verschieden gefärbt sind?',
    [r'2', r'1', r'3', r'4'],
    [r'Mit einer Farbe hätten Nachbarn dieselbe Farbe.',
     r'Abwechselnd schwarz und weiß reicht.',
     r'Also 2 Farben.'])

Q.q(r'Wie viele Farben reichen immer, um eine Landkarte so zu färben, dass benachbarte Länder verschiedene Farben haben?',
    [r'4', r'2', r'3', r'Es gibt keine feste Zahl.'],
    [r'Diese Vermutung ist über 100 Jahre alt.',
     r'1976 bewiesen Kenneth Appel und Wolfgang Haken den Vierfarbensatz.',
     r'4 Farben reichen immer (3 reichen manchmal nicht).'])

Q.q(r'Der Mathematiker Roger Penrose fand 1974 Parkette aus nur zwei Kachelformen mit einer Besonderheit. Welcher?',
    [r'Das Muster wiederholt sich nie.', r'Die Kacheln sind Kreise.', r'Es gibt Lücken.', r'Man braucht nur eine einzige Kachel.'],
    [r'Normale Parkette kann man verschieben, sodass sie auf sich selbst passen.',
     r'Penrose-Parkette haben keine solche Verschiebung.',
     r'Sie wiederholen sich nie – trotzdem gibt es keine Lücken.'])

Q.q(r'Aus Eschers Motiven werden auch „Kaleidozyklen“ gebastelt. Aus welchen Körpern besteht ein solcher Ring, den man immer weiter drehen kann?',
    [r'aus Tetraedern (dreiseitigen Pyramiden)', r'aus Kugeln', r'aus Würfeln', r'aus Zylindern'],
    [r'Mehrere Tetraeder werden an Kanten beweglich verbunden.',
     r'Der Ring lässt sich wie ein Kaleidoskop immer weiter durchdrehen.',
     r'Bekannt wurden sie durch ein Buch von Doris Schattschneider und Wallace Walker (1977).'])


def check():
    assert 4 * 4 == 16 and 8 * 6 * 3 * 3 == 432 and 5 * 5 + 3 - 3 + 2 - 2 == 25
    assert 21 // 3 == 7 and int(29.7 // 3) == 9 and 7 * 9 == 63


Q.verify(check)
Q.save()
