#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 18 / KW 1 (LB 3): Satz des Thales, Beweis,
„wenn-dann“-Form, Umkehrung, Thaleskreis. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=18, slug='thales', thema='Satz des Thales', lb='LB 3',
        blurb='Satz und Beweis, wenn-dann-Form, Umkehrung, Thaleskreis',
        comment='Blocks: statement and wenn-dann form (1, 4-5, 20), proof (6-8), angles (2-3, 13-15, 19), constructions and context (9-12, 16-18).')

# ------------------------------------------------------------------ Satz ----
Q.q(r'Was besagt der Satz des Thales?',
    [r'Liegt $C$ auf dem Halbkreis über $\overline{AB}$, dann hat das Dreieck $ABC$ bei $C$ einen rechten Winkel.',
     r'Jedes Dreieck hat einen rechten Winkel.',
     r'Liegt $C$ auf dem Halbkreis über $\overline{AB}$, dann ist das Dreieck $ABC$ gleichseitig.',
     r'Die Winkelsumme im Dreieck beträgt $360^\circ$.'],
    [r'$\overline{AB}$ ist ein Durchmesser, $C$ ein weiterer Punkt auf dem Kreis.',
     r'Dann ist der Winkel $\gamma$ bei $C$ immer $90^\circ$, egal wo $C$ auf dem Kreis liegt.'])

Q.q(r'$\overline{AB}$ ist ein Durchmesser eines Kreises, $C$ liegt auf dem Kreis. Wie groß ist der Winkel $\gamma$ bei $C$?',
    [r'$90^\circ$', r'$180^\circ$', r'$60^\circ$', r'Das hängt von der Lage von $C$ ab.'],
    [r'Satz des Thales: Der Winkel im Halbkreis ist ein rechter Winkel.'])

Q.q(r'In einem Thalesdreieck mit dem rechten Winkel bei $C$ ist $\alpha = 35^\circ$. Wie groß ist $\beta$?',
    [r'$55^\circ$', r'$35^\circ$', r'$145^\circ$', r'$65^\circ$'],
    [r'$\gamma = 90^\circ$',
     r'$\beta = 180^\circ - 90^\circ - 35^\circ = 55^\circ$'])

Q.q(r'Was ist im Satz des Thales die Voraussetzung (der „wenn“-Teil)?',
    [r'$C$ liegt auf dem Kreis mit dem Durchmesser $\overline{AB}$.', r'Der Winkel bei $C$ ist $90^\circ$.',
     r'Das Dreieck $ABC$ ist gleichschenklig.', r'Der Kreis hat den Radius $\overline{AB}$.'],
    [r'Wenn $C$ auf dem Kreis mit Durchmesser $\overline{AB}$ liegt (Voraussetzung),',
     r'dann ist $\gamma = 90^\circ$ (Behauptung).'])

Q.q(r'Wie lautet die Umkehrung des Satzes des Thales?',
    [r'Wenn das Dreieck $ABC$ bei $C$ rechtwinklig ist, dann liegt $C$ auf dem Kreis mit Durchmesser $\overline{AB}$.',
     r'Wenn $C$ nicht auf dem Kreis liegt, dann ist das Dreieck rechtwinklig.',
     r'Wenn $\gamma = 90^\circ$ ist, dann ist $\alpha = \beta$.',
     r'Wenn $C$ auf dem Kreis liegt, dann ist $\gamma = 90^\circ$.'],
    [r'Bei der Umkehrung werden „wenn“- und „dann“-Teil vertauscht.',
     r'Die letzte Antwort ist der Satz selbst, nicht seine Umkehrung.'])

# ------------------------------------------------------------------ Beweis ----
Q.q(r'Im Beweis zieht man die Strecke vom Mittelpunkt $M$ zu $C$. Warum sind dann die Dreiecke $AMC$ und $MBC$ gleichschenklig?',
    [r'Weil $\overline{MA}$, $\overline{MB}$ und $\overline{MC}$ Radien und damit gleich lang sind.',
     r'Weil jedes Dreieck im Kreis gleichschenklig ist.',
     r'Weil $\overline{AB}$ doppelt so lang wie $\overline{MC}$ ist.',
     r'Weil $\gamma = 90^\circ$ ist.'],
    [r'$M$ ist der Mittelpunkt, $A$, $B$ und $C$ liegen auf dem Kreis.',
     r'Also sind alle drei Strecken zu $M$ Radien.',
     r'Die letzte Antwort wäre ein Zirkelschluss: $90^\circ$ soll ja erst bewiesen werden.'])

Q.q(r'Im Teildreieck $AMC$ ist der Basiswinkel bei $A$ gleich $40^\circ$. Wie groß ist der Winkel bei $C$ in diesem Teildreieck?',
    [r'$40^\circ$', r'$50^\circ$', r'$100^\circ$', r'$90^\circ$'],
    [r'$AMC$ ist gleichschenklig mit der Basis $\overline{AC}$.',
     r'Basiswinkel sind gleich groß: auch $40^\circ$.'])

Q.q(r'Im Beweis nennt man die Basiswinkel $\alpha$ und $\beta$. Für das große Dreieck gilt $\alpha + \beta + (\alpha + \beta) = 180^\circ$. Was folgt daraus?',
    [r'$\alpha + \beta = 90^\circ$', r'$\alpha = \beta$', r'$\alpha + \beta = 180^\circ$', r'$\alpha = 90^\circ$'],
    [r'Der Winkel bei $C$ setzt sich aus $\alpha$ und $\beta$ zusammen.',
     r'$2 \cdot (\alpha + \beta) = 180^\circ$, also $\alpha + \beta = 90^\circ$.',
     r'Das ist genau der Winkel bei $C$: Er ist ein rechter Winkel.'])

# ---------------------------------------------------- Thaleskreis anwenden ----
Q.q(r'Die Strecke $\overline{AB}$ ist 10 cm lang. Welchen Radius hat der Thaleskreis über $\overline{AB}$?',
    [r'5 cm', r'10 cm', r'20 cm', r'3,14 cm'],
    [r'$\overline{AB}$ ist der Durchmesser.',
     r'$r = 10 : 2 = 5$, also 5 cm.'])

Q.q(r'Wo liegt der Mittelpunkt des Thaleskreises über $\overline{AB}$?',
    [r'im Mittelpunkt der Strecke $\overline{AB}$', r'im Punkt $A$', r'auf der Mittelsenkrechten, 5 cm über $\overline{AB}$', r'im Punkt $C$'],
    [r'$\overline{AB}$ ist ein Durchmesser, sein Mittelpunkt ist der Kreismittelpunkt.',
     r'Man findet ihn mit der Mittelsenkrechten von $\overline{AB}$.'])

Q.q(r'Du sollst ein rechtwinkliges Dreieck mit der Hypotenuse $c = 8$ cm konstruieren. Was hilft?',
    [r'ein Halbkreis mit Radius 4 cm über $c$', r'ein Kreis mit Radius 8 cm um $A$',
     r'ein gleichseitiges Dreieck über $c$', r'die Winkelhalbierende bei $A$'],
    [r'Die Hypotenuse liegt dem rechten Winkel gegenüber.',
     r'Jeder Punkt $C$ auf dem Thaleskreis über $c$ (Radius 4 cm) liefert einen rechten Winkel.'])

Q.q(r'Von einem Punkt $P$ außerhalb eines Kreises mit Mittelpunkt $M$ sollen die Tangenten gezeichnet werden. Welcher Hilfskreis liefert die Berührungspunkte?',
    [r'der Thaleskreis über $\overline{PM}$', r'ein Kreis um $P$ mit dem Radius des Kreises',
     r'ein Kreis um $M$ mit dem Radius $\overline{PM}$', r'der Thaleskreis über einem Durchmesser des Kreises'],
    [r'Im Berührungspunkt $B$ ist der Winkel zwischen Radius $\overline{MB}$ und Tangente $\overline{PB}$ ein rechter.',
     r'$B$ liegt also auf dem Thaleskreis über $\overline{PM}$; er schneidet den Kreis in den zwei Berührungspunkten.'])

Q.q(r'$C$ liegt innerhalb des Thaleskreises über $\overline{AB}$ (nicht auf $\overline{AB}$). Wie ist der Winkel bei $C$?',
    [r'stumpf, größer als $90^\circ$', r'genau $90^\circ$', r'spitz, kleiner als $90^\circ$', r'genau $180^\circ$'],
    [r'Rückt $C$ vom Kreis nach innen, werden die Schenkel des Winkels weiter.',
     r'Der Winkel ist größer als $90^\circ$.'])

Q.q(r'$C$ liegt außerhalb des Thaleskreises über $\overline{AB}$. Wie ist der Winkel bei $C$?',
    [r'spitz, kleiner als $90^\circ$', r'genau $90^\circ$', r'stumpf, größer als $90^\circ$', r'genau $0^\circ$'],
    [r'Rückt $C$ vom Kreis nach außen, sieht man $\overline{AB}$ unter einem kleineren Winkel.',
     r'Der Winkel ist kleiner als $90^\circ$.'])

Q.q(r'$\overline{AB}$ ist Durchmesser, $C$ liegt auf dem Kreis und der Winkel bei $A$ ist $62^\circ$. Wie groß ist der Winkel bei $B$?',
    [r'$28^\circ$', r'$62^\circ$', r'$118^\circ$', r'$38^\circ$'],
    [r'Thales: $\gamma = 90^\circ$',
     r'$\beta = 180^\circ - 90^\circ - 62^\circ = 28^\circ$'])

Q.q(r'Wann lebte Thales von Milet, nach dem der Satz benannt ist?',
    [r'um 600 vor Christus', r'um 1600 nach Christus', r'um 300 nach Christus', r'um 1900 nach Christus'],
    [r'Thales von Milet war ein griechischer Philosoph und Mathematiker, etwa 624 bis 546 vor Christus.',
     r'Der Satz war schon den Babyloniern bekannt; der Beweis wird traditionell Thales zugeschrieben.'])

Q.q(r'Ein rechtwinkliges Dreieck hat die Hypotenuse 13 cm. Welchen Radius hat sein Umkreis?',
    [r'6,5 cm', r'13 cm', r'26 cm', r'4,3 cm'],
    [r'Nach der Umkehrung des Thalessatzes ist die Hypotenuse ein Durchmesser des Umkreises.',
     r'$r = 13 : 2 = 6{,}5$, also 6,5 cm.'])

Q.q(r'Ein Rechteck ist so gezeichnet, dass alle Ecken auf einem Kreis liegen. Was sind seine Diagonalen?',
    [r'Durchmesser des Kreises', r'Tangenten an den Kreis', r'Radien des Kreises', r'Passanten'],
    [r'An jeder Ecke ist ein rechter Winkel.',
     r'Nach der Umkehrung des Thalessatzes ist die gegenüberliegende Diagonale ein Durchmesser.'])

Q.q(r'$C$ liegt auf dem Thaleskreis genau über dem Mittelpunkt $M$ von $\overline{AB}$. Wie groß sind $\alpha$ und $\beta$?',
    [r'beide $45^\circ$', r'beide $60^\circ$', r'$30^\circ$ und $60^\circ$', r'beide $90^\circ$'],
    [r'Dann ist $\overline{AC} = \overline{BC}$, das Dreieck ist gleichschenklig-rechtwinklig.',
     r'$\alpha = \beta = (180^\circ - 90^\circ) : 2 = 45^\circ$'])

Q.q(r'Welche Aussage ist falsch?',
    [r'Jedes Dreieck mit allen Ecken auf einem Kreis ist rechtwinklig.',
     r'Jedes Dreieck, dessen eine Seite ein Durchmesser des Umkreises ist, ist rechtwinklig.',
     r'Die Hypotenuse eines rechtwinkligen Dreiecks ist ein Durchmesser seines Umkreises.',
     r'Ein Thaleskreis hat seinen Mittelpunkt in der Mitte der Hypotenuse.'],
    [r'Jedes Dreieck hat einen Umkreis, auf dem alle Ecken liegen, z. B. auch ein gleichseitiges Dreieck.',
     r'Rechtwinklig ist es nur, wenn eine Seite ein Durchmesser ist.'])


def check():
    assert 180 - 90 - 35 == 55
    al, be = 40, 50
    assert al + be + (al + be) == 180 and al + be == 90
    assert 10 / 2 == 5 and 8 / 2 == 4
    assert 180 - 90 - 62 == 28
    assert 624 - 546 == 78 and 546 < 600 < 624
    assert 13 / 2 == 6.5
    assert (180 - 90) / 2 == 45


Q.verify(check)
Q.save()
