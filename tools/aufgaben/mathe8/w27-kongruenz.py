#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 27 / KW 12 (LB 4): Kongruenz als Spezialfall
der Ähnlichkeit, Kongruenzsätze, Übung zur Ähnlichkeit. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=27, slug='kongruenz', thema='Kongruenz als Spezialfall der Ähnlichkeit', lb='LB 4',
        blurb='Kongruenzsätze, Kongruenz und Ähnlichkeit, Bewegungen, Übung',
        comment='Blocks: congruence and similarity (1, 7, 14-17, 20), congruence theorems (2-6, 18), mappings (8-9), triangles (10-13), similarity practice (19).')

# -------------------------------------------------- Kongruent und ähnlich ----
Q.q(r'Was bedeutet „kongruent“?',
    [r'deckungsgleich: gleiche Form und gleiche Größe', r'gleiche Form, beliebige Größe',
     r'gleicher Flächeninhalt, beliebige Form', r'gleicher Umfang'],
    [r'Kongruente Figuren kann man genau aufeinanderlegen.',
     r'Sie sind ähnlich mit dem Streckfaktor $k = 1$.'])

Q.q(r'Welche Angaben legen ein Dreieck nicht bis auf Kongruenz fest?',
    [r'drei Winkel', r'drei Seiten', r'zwei Seiten und der eingeschlossene Winkel', r'eine Seite und die beiden anliegenden Winkel'],
    [r'Mit drei Winkeln liegt nur die Form fest, nicht die Größe.',
     r'Man erhält ähnliche, aber nicht unbedingt kongruente Dreiecke.'])

Q.q(r'Ein Dreieck soll aus $a = 4$ cm, $b = 5$ cm und $c = 6$ cm konstruiert werden. Welcher Kongruenzsatz sagt, dass es eindeutig ist?',
    [r'SSS', r'SWS', r'WSW', r'SsW'],
    [r'Drei Seiten gegeben: Seite-Seite-Seite.',
     r'Die Dreiecksungleichung ist erfüllt: $4 + 5 > 6$.'])

Q.q(r'Gegeben sind $a$, $b$ und der Winkel $\gamma$ zwischen ihnen. Welcher Kongruenzsatz passt?',
    [r'SWS', r'SSS', r'WSW', r'SsW'],
    [r'Zwei Seiten und der von ihnen eingeschlossene Winkel: Seite-Winkel-Seite.'])

Q.q(r'Gegeben sind die Seite $c$ und die beiden Winkel $\alpha$ und $\beta$ an ihren Enden. Welcher Kongruenzsatz passt?',
    [r'WSW', r'SWS', r'SSS', r'SsW'],
    [r'Eine Seite und die beiden anliegenden Winkel: Winkel-Seite-Winkel.'])

Q.q(r'Was verlangt der Kongruenzsatz SsW?',
    [r'zwei Seiten und den Winkel, der der größeren Seite gegenüberliegt', r'zwei Seiten und den eingeschlossenen Winkel',
     r'zwei Seiten und den Winkel gegenüber der kleineren Seite', r'drei Seiten'],
    [r'Das große S steht für die größere Seite.',
     r'Liegt der Winkel der kleineren Seite gegenüber, kann es zwei verschiedene Dreiecke geben.'])

Q.q(r'Welche Aussage ist richtig?',
    [r'Kongruente Figuren sind immer ähnlich, ähnliche nicht immer kongruent.',
     r'Ähnliche Figuren sind immer kongruent.',
     r'Kongruente Figuren sind nie ähnlich.',
     r'Kongruenz und Ähnlichkeit bedeuten dasselbe.'],
    [r'Kongruenz ist der Spezialfall der Ähnlichkeit mit $k = 1$.',
     r'Ein Dreieck und sein doppelt so großes Bild sind ähnlich, aber nicht kongruent.'])

# ------------------------------------------------------------ Abbildungen ----
Q.q(r'Welche Abbildungen erzeugen immer ein kongruentes Bild?',
    [r'Verschiebung, Drehung und Spiegelung', r'nur die Spiegelung',
     r'jede zentrische Streckung', r'keine Abbildung'],
    [r'Diese Bewegungen ändern weder Längen noch Winkel.',
     r'Deshalb sind Original und Bild deckungsgleich.'])

Q.q(r'Bei welcher Abbildung entsteht im Allgemeinen kein kongruentes Bild?',
    [r'zentrische Streckung mit $k = 2$', r'Drehung um $90^\circ$', r'Spiegelung an einer Geraden', r'Verschiebung um 3 cm'],
    [r'Bei $k = 2$ werden alle Strecken doppelt so lang.',
     r'Das Bild ist ähnlich, aber nicht kongruent.'])

# ----------------------------------------------------------------- Dreiecke ----
Q.q(r'Lässt sich aus den Seiten 3 cm, 4 cm und 8 cm ein Dreieck konstruieren?',
    [r'Nein, denn $3 + 4 < 8$.', r'Ja, aus drei Seiten geht es immer.', r'Ja, es wird rechtwinklig.', r'Nein, weil 8 gerade ist.'],
    [r'Dreiecksungleichung: Zwei Seiten zusammen müssen länger sein als die dritte.',
     r'$3 + 4 = 7$ ist kürzer als 8, die Seiten treffen sich nicht.'])

Q.q(r'Zwei Dreiecke sind kongruent. Im ersten ist $\alpha = 50^\circ$ und $\beta = 60^\circ$. Wie groß ist der dritte Winkel im zweiten Dreieck?',
    [r'$70^\circ$', r'$50^\circ$', r'$60^\circ$', r'$110^\circ$'],
    [r'Kongruente Dreiecke stimmen in allen Winkeln überein.',
     r'$180^\circ - 50^\circ - 60^\circ = 70^\circ$'])

Q.q(r'Die Höhe zerlegt ein gleichschenkliges Dreieck in zwei Teildreiecke. Was gilt für sie?',
    [r'Sie sind kongruent.', r'Sie sind ähnlich mit $k = 2$.', r'Sie haben verschiedene Flächeninhalte.', r'Sie sind gleichseitig.'],
    [r'Beide haben die Höhe als gemeinsame Seite, gleich lange Schenkel und einen rechten Winkel.',
     r'Nach SsW sind sie kongruent; das Dreieck ist achsensymmetrisch.'])

Q.q(r'Eine Diagonale teilt ein Parallelogramm in zwei Dreiecke. Was gilt?',
    [r'Die beiden Dreiecke sind kongruent.', r'Die beiden Dreiecke sind nur ähnlich.',
     r'Ein Dreieck ist doppelt so groß.', r'Die Dreiecke sind rechtwinklig.'],
    [r'Gegenüberliegende Seiten des Parallelogramms sind gleich lang.',
     r'Mit der gemeinsamen Diagonale sind alle drei Seiten gleich: SSS.'])

Q.q(r'Ein Plan hat den Maßstab 1 : 1. Was gilt für Plan und Wirklichkeit?',
    [r'Sie sind kongruent.', r'Der Plan ist doppelt so groß.', r'Der Plan ist halb so groß.', r'Sie sind nicht ähnlich.'],
    [r'1 : 1 heißt $k = 1$: alle Längen stimmen überein.'])

Q.q(r'Zwei ähnliche Dreiecke haben ein Paar entsprechender Seiten, die gleich lang sind. Was folgt?',
    [r'Die Dreiecke sind kongruent.', r'Die Dreiecke sind nicht ähnlich.', r'Die übrigen Seiten sind doppelt so lang.', r'Nichts.'],
    [r'Aus $a’ = k \cdot a$ und $a’ = a$ folgt $k = 1$.',
     r'Ähnlich mit $k = 1$ heißt kongruent.'])

Q.q(r'Zwei Dreiecke stimmen in allen drei Winkeln überein. Was kann man sicher sagen?',
    [r'Sie sind ähnlich.', r'Sie sind kongruent.', r'Sie sind gleich groß.', r'Sie sind gleichseitig.'],
    [r'Gleiche Winkel bedeuten gleiche Form.',
     r'Über die Größe sagen Winkel nichts aus.'])

Q.q(r'Dreieck 1 hat die Seiten 5 cm, 6 cm, 7 cm, Dreieck 2 die Seiten 10 cm, 12 cm, 14 cm. Was gilt?',
    [r'Sie sind ähnlich, aber nicht kongruent.', r'Sie sind kongruent.', r'Sie sind weder ähnlich noch kongruent.', r'Sie haben denselben Flächeninhalt.'],
    [r'Alle Seiten sind verdoppelt: $k = 2$.',
     r'Ähnlich ja, kongruent nein; der Flächeninhalt ist 4-mal so groß.'])

Q.q(r'Ein Dreieck soll aus $b = 5$ cm, $c = 6$ cm und $\alpha = 50^\circ$ konstruiert werden. Womit beginnst du sinnvoll?',
    [r'Seite $c = \overline{AB}$ zeichnen, in $A$ den Winkel $\alpha$ antragen', r'Den Umkreis zeichnen',
     r'Die Höhe $h_c$ zeichnen', r'Den Winkel $\gamma$ berechnen'],
    [r'$\alpha$ liegt zwischen $b$ und $c$ (SWS).',
     r'$c$ zeichnen, in $A$ den Winkel antragen, auf dem freien Schenkel $b = 5$ cm abtragen, $C$ mit $B$ verbinden.'])

Q.q(r'Zwei ähnliche Figuren haben die Flächeninhalte 18 cm² und 50 cm². Wie groß ist der Streckfaktor von der kleinen zur großen?',
    [r'$k = \dfrac{5}{3}$', r'$k = \dfrac{25}{9}$', r'$k = 32$', r'$k = \dfrac{9}{25}$'],
    [r'$k^2 = \dfrac{50}{18} = \dfrac{25}{9}$',
     r'$k = \dfrac{5}{3}$'])

Q.q(r'Was gilt immer für zwei kongruente Figuren?',
    [r'Sie haben denselben Flächeninhalt und denselben Umfang.', r'Sie liegen an derselben Stelle.',
     r'Sie sind gleichseitig.', r'Sie haben verschiedene Flächeninhalte.'],
    [r'Deckungsgleiche Figuren stimmen in allen Längen und Winkeln überein.',
     r'Also auch in Umfang und Flächeninhalt.'])


def check():
    from fractions import Fraction as F
    assert 4 + 5 > 6 and 4 + 6 > 5 and 5 + 6 > 4
    assert 3 + 4 < 8
    assert 180 - 50 - 60 == 70
    assert [2 * s for s in (5, 6, 7)] == [10, 12, 14]
    assert F(50, 18) == F(25, 9) and F(5, 3) ** 2 == F(25, 9)


Q.verify(check)
Q.save()
