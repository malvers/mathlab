#!/usr/bin/env python3
"""Exercises OS Mathe 7 (Realschule), week 24 / KW 9 (LB 4): constructing parallelograms,
kites and trapezoids - plan figure, order of steps, construction description, how many
given parts are needed, solvability. Plan: HTML/svp/mathe/mathe7.html."""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os7
from osfig import vieleck

Q = os7(nr=24, slug='vierecke-konstruieren', thema='Vierecke konstruieren', lb='LB 4',
        blurb='Planfigur, Konstruktionsschritte, Konstruktionsbeschreibung, Lösbarkeit',
        comment='Blocks: plan figure and description (1, 10, 19-20), steps (2-6, 9, 11), needed parts (13-18), solvability (7-8, 12).')

r = math.radians
PARA = [(0, 0), (5, 0), (5 + 3 * math.cos(r(60)), 3 * math.sin(r(60))), (3 * math.cos(r(60)), 3 * math.sin(r(60)))]
fig_plan = vieleck(PARA, names=['A', 'B', 'C', 'D'], sides=[(0, 'a'), (1, 'b'), (2, 'c'), (3, 'd')], angles=[(0, 'α')],
                   label='Planfigur Parallelogramm')

# ------------------------------------------------------- plan figure, description ----
Q.q(r'Was ist eine Planfigur?',
    [r'eine Skizze der gesuchten Figur, in der die gegebenen Stücke markiert sind', r'die fertige, genaue Konstruktion',
     r'eine Liste der Werkzeuge', r'ein Foto der Figur'],
    [r'Vor dem Konstruieren skizziert man die Figur grob.',
     r'Die gegebenen Seiten und Winkel werden farbig markiert.',
     r'So erkennt man, womit man anfangen kann.'])

Q.q(r'Was gehört in eine Konstruktionsbeschreibung?',
    [r'die einzelnen Schritte in der richtigen Reihenfolge', r'nur das Ergebnis', r'die Farbe der Stifte', r'der Flächeninhalt'],
    [r'Jemand anderes soll die Konstruktion nachmachen können.',
     r'Beispiel: „1. Strecke AB mit 5 cm. 2. Winkel 60° an A antragen. …“',
     r'Kurze, genaue Sätze in der richtigen Reihenfolge.'])

Q.q(r'In der Planfigur ist der Winkel $\alpha$ bei A eingezeichnet. Zwischen welchen Seiten liegt er?',
    [r'zwischen $a$ und $d$', r'zwischen $a$ und $b$', r'zwischen $c$ und $d$', r'zwischen $b$ und $c$'],
    [r'An der Ecke A treffen zwei Seiten zusammen.',
     r'Das sind $a = \overline{AB}$ und $d = \overline{DA}$.',
     r'$\alpha$ liegt zwischen $a$ und $d$.'],
    fig=fig_plan, figcap=r'Planfigur eines Parallelogramms ABCD')

Q.q(r'Nach der Konstruktion eines Parallelogramms misst Lea: $\overline{CD}$ ist genau so lang wie $\overline{AB}$. Was zeigt das?',
    [r'Die Probe passt: Gegenseiten im Parallelogramm sind gleich lang.', r'Sie hat falsch konstruiert.',
     r'Das Viereck ist ein Quadrat.', r'Das ist Zufall.'],
    [r'Im Parallelogramm sind gegenüberliegende Seiten gleich lang.',
     r'Die Messung bestätigt die Konstruktion.',
     r'Messen ist eine gute Probe.'])

# -------------------------------------------------------------------------- steps ----
Q.q(r'Ein Parallelogramm mit $a = 5$ cm, $b = 3$ cm und $\alpha = 60°$ soll konstruiert werden. Womit beginnt man?',
    [r'mit der Strecke $\overline{AB}$ von 5 cm', r'mit der Diagonalen', r'mit dem Punkt C', r'mit einem Kreis um C'],
    [r'Man beginnt mit einem gegebenen Stück, an das man anbauen kann.',
     r'$a = \overline{AB} = 5$ cm ist gegeben.',
     r'Dann an A den Winkel 60° antragen.'])

Q.q(r'Wie geht es weiter, nachdem $\overline{AB}$ = 5 cm gezeichnet und an A der Winkel 60° angetragen wurde?',
    [r'Auf dem freien Schenkel von A aus 3 cm abtragen, das ergibt D.', r'Von B aus 5 cm abtragen.',
     r'Die Mitte von $\overline{AB}$ suchen.', r'Einen Kreis um A mit 5 cm zeichnen.'],
    [r'$d = \overline{AD}$ ist so lang wie $b$, also 3 cm.',
     r'D liegt auf dem freien Schenkel des Winkels.',
     r'Danach fehlt nur noch C.'])

Q.q(r'Wie findet man beim Parallelogramm zuletzt den Punkt C?',
    [r'Parallele zu $\overline{AB}$ durch D und Parallele zu $\overline{AD}$ durch B schneiden sich in C.',
     r'C ist die Mitte von $\overline{BD}$.', r'C liegt immer senkrecht über B.', r'C liegt auf $\overline{AB}$.'],
    [r'Gegenüberliegende Seiten sind parallel.',
     r'Zwei Parallelen schneiden sich im gesuchten Punkt.',
     r'Ebenso möglich: Kreis um B mit $b$ und Kreis um D mit $a$.'])

Q.q(r'Ein Trapez mit $a \parallel c$, $a = 7$ cm, $c = 4$ cm und der Höhe $h = 3$ cm wird gezeichnet. Wo liegt die Seite $c$?',
    [r'auf einer Parallelen zu $a$ im Abstand 3 cm', r'senkrecht zu $a$', r'auf derselben Geraden wie $a$', r'im Abstand 4 cm zu $a$'],
    [r'$a$ und $c$ sind parallel.',
     r'Ihr Abstand ist die Höhe $h$.',
     r'Also: Parallele zu $a$ im Abstand 3 cm, darauf liegt $c$.'])

Q.q(r'Für ein Drachenviereck sind die Diagonalen $e = 8$ cm (Symmetrieachse) und $f = 6$ cm gegeben. Was muss man außerdem wissen?',
    [r'an welcher Stelle $f$ die Diagonale $e$ schneidet', r'nichts, das reicht immer', r'den Umfang', r'die Farbe des Drachens'],
    [r'$f$ steht senkrecht auf $e$ und wird von $e$ halbiert.',
     r'Aber $f$ kann weiter oben oder weiter unten liegen.',
     r'Erst mit dem Schnittpunkt ist der Drachen eindeutig.'])

Q.q(r'Womit zeichnet man genau eine Parallele zu einer Geraden?',
    [r'mit dem Geodreieck (Parallelen-Linien)', r'mit dem Zirkel allein', r'mit dem Radiergummi', r'freihand'],
    [r'Das Geodreieck hat parallele Hilfslinien.',
     r'Man legt eine Hilfslinie auf die Gerade und zeichnet an der Kante.',
     r'Auch zweimaliges Senkrecht-Zeichnen geht.'])

Q.q(r'Ein Parallelogramm mit $a = 6$ cm, $b = 4$ cm und der Diagonalen $e = \overline{AC} = 8$ cm soll konstruiert werden. Welches Teildreieck konstruiert man zuerst?',
    [r'das Dreieck ABC nach sss', r'das Dreieck ABD nach sws', r'das Dreieck ACD nach wsw', r'gar keins'],
    [r'Im Dreieck ABC kennt man alle drei Seiten: $a = 6$, $b = 4$, $e = 8$.',
     r'Das geht nach sss.',
     r'D findet man danach mit Parallelen oder Kreisen.'])

# --------------------------------------------------------------------- needed parts ----
Q.q(r'Wie viele Stücke braucht man im Allgemeinen, um ein ganz beliebiges Viereck eindeutig zu konstruieren?',
    [r'5', r'3', r'4', r'8'],
    [r'Eine Diagonale teilt das Viereck in zwei Dreiecke.',
     r'Für das erste Dreieck braucht man 3 Stücke, für das zweite 2 weitere (eine Seite ist gemeinsam).',
     r'Zusammen 5 Stücke.'])

Q.q(r'Wie viele Stücke braucht man für ein Parallelogramm?',
    [r'3', r'5', r'2', r'1'],
    [r'Gegenüberliegende Seiten sind gleich lang und parallel.',
     r'Es reichen zum Beispiel $a$, $b$ und $\alpha$.',
     r'Also 3 Stücke.'])

Q.q(r'Wie viele Stücke braucht man für ein Quadrat?',
    [r'1', r'2', r'4', r'3'],
    [r'Alle Seiten sind gleich lang, alle Winkel 90°.',
     r'Die Seitenlänge legt alles fest.',
     r'1 Stück.'])

Q.q(r'Wie viele Stücke braucht man für ein Rechteck?',
    [r'2', r'1', r'3', r'4'],
    [r'Alle Winkel sind 90°.',
     r'Länge und Breite genügen.',
     r'2 Stücke.'])

Q.q(r'Wie viele Stücke braucht man im Allgemeinen für ein Trapez?',
    [r'4', r'3', r'5', r'2'],
    [r'Ein Paar Seiten ist parallel – das spart ein Stück gegenüber dem allgemeinen Viereck.',
     r'Zum Beispiel $a$, $b$, $c$ und $\alpha$.',
     r'Also 4 Stücke.'])

Q.q(r'Wie viele Stücke braucht man für eine Raute?',
    [r'2', r'1', r'3', r'4'],
    [r'Alle Seiten sind gleich lang: eine Seitenlänge.',
     r'Dazu ein Winkel, sonst ist die Form nicht festgelegt.',
     r'Also 2 Stücke, zum Beispiel $a$ und $\alpha$.'])

# --------------------------------------------------------------------- solvability ----
Q.q(r'Ein Parallelogramm mit $a = 3$ cm, $b = 2$ cm und der Diagonalen $e = 6$ cm soll konstruiert werden. Was ergibt sich?',
    [r'Es ist nicht konstruierbar, denn $3 + 2 < 6$.', r'genau ein Parallelogramm', r'zwei Parallelogramme', r'ein Rechteck'],
    [r'Die Diagonale bildet mit $a$ und $b$ ein Dreieck.',
     r'Dreiecksungleichung: $a + b$ muss größer als $e$ sein.',
     r'$3 + 2 = 5 < 6$: kein Dreieck, also kein Parallelogramm.'])

Q.q(r'Eine Raute soll mit $a = 4$ cm und $\alpha = 50°$ konstruiert werden. Wie viele verschiedene Rauten gibt es (bis auf die Lage)?',
    [r'genau eine', r'keine', r'zwei', r'unendlich viele'],
    [r'Seite AB = 4 cm, an A den Winkel 50°, darauf 4 cm abtragen.',
     r'Der Rest folgt aus den Parallelen.',
     r'Die Raute ist eindeutig bestimmt.'])

Q.q(r'Ein Trapez soll mit $a = 6$ cm, $c = 8$ cm und $h = 3$ cm konstruiert werden. Gibt es nur eines?',
    [r'Nein, $c$ kann auf der Parallelen verschoben werden; es fehlt ein Stück.', r'Ja, genau eines.',
     r'Nein, es gibt gar keines, weil $c$ länger als $a$ ist.', r'Ja, ein Rechteck.'],
    [r'Für ein Trapez braucht man 4 Stücke, hier sind nur 3 gegeben.',
     r'$c$ liegt auf der Parallelen im Abstand 3 cm, aber wo genau?',
     r'Dass $c$ länger als $a$ ist, stört nicht: Man nennt dann einfach die längere Seite $a$.'])


def check():
    pts = PARA
    assert abs(math.dist(pts[2], pts[3]) - math.dist(pts[0], pts[1])) < 1e-12
    assert 3 + 2 < 6 and 6 + 4 > 8 and 6 + 8 > 4 and 4 + 8 > 6
    assert 3 + 2 == 5


Q.verify(check)
Q.save()
