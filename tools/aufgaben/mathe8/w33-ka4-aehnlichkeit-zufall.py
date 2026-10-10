#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 33 / KW 19: Vorbereitung Klassenarbeit 4
(LB 4 Ähnlichkeit, LB 5 zufällige Ereignisse). Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=33, slug='ka4-aehnlichkeit-zufall', thema='Vorbereitung Klassenarbeit 4: Ähnlichkeit und Zufall', lb='KA 4',
        blurb='gemischte Wiederholung zu Streckung, Ähnlichkeit, k² und k³, Baumdiagramm und Zählen',
        comment='Mixed review of LB 4 (1-10) and LB 5 (11-20).')

# ------------------------------------------------------------- Ähnlichkeit ----
Q.q(r'Eine Strecke von 2,5 cm wird mit $k = 4$ zentrisch gestreckt. Wie lang ist die Bildstrecke?',
    [r'10 cm', r'6,5 cm', r'0,625 cm', r'1,5 cm'],
    [r'$2{,}5 \cdot 4 = 10$ cm'])

Q.q(r'Eine Karte hat den Maßstab 1 : 200 000. Zwei Orte liegen auf der Karte 3 cm auseinander. Wie weit sind sie wirklich entfernt?',
    [r'6 km', r'60 km', r'600 m', r'66,7 km'],
    [r'$3 \cdot 200\,000 = 600\,000$ cm',
     r'600 000 cm = 6000 m = 6 km'])

Q.q(r'Eine 6 cm lange Strecke hat nach einer zentrischen Streckung die Länge 4,5 cm. Wie groß ist $k$?',
    [r'$k = 0{,}75$', r'$k = 1{,}33$', r'$k = 1{,}5$', r'$k = -1{,}5$'],
    [r'$k = \dfrac{4{,}5}{6} = 0{,}75$, eine Verkleinerung.'])

Q.q(r'Zwei Dreiecke sind ähnlich. Zu $a = 6$ cm gehört $a’ = 9$ cm, zu $c = 8$ cm gehört $c’$. Wie lang ist $c’$?',
    [r'12 cm', r'11 cm', r'5,3 cm', r'10 cm'],
    [r'$k = 9 : 6 = 1{,}5$',
     r'$c’ = 1{,}5 \cdot 8 = 12$ cm'])

Q.q(r'Ein 1,5 m langer Stab wirft einen 2 m langen Schatten, ein Fahnenmast zur selben Zeit einen 16 m langen. Wie hoch ist der Mast?',
    [r'12 m', r'21,3 m', r'15,5 m', r'8 m'],
    [r'$k = 16 : 2 = 8$',
     r'$1{,}5 \cdot 8 = 12$ m'])

Q.q(r'Dreieck 1 hat die Winkel $35^\circ$ und $75^\circ$, Dreieck 2 die Winkel $70^\circ$ und $75^\circ$. Sind sie ähnlich?',
    [r'Ja, beide haben die Winkel $35^\circ$, $70^\circ$ und $75^\circ$.', r'Nein, $35^\circ \neq 70^\circ$.',
     r'Nur wenn die Seiten gleich sind.', r'Man kann es nicht entscheiden.'],
    [r'Dritte Winkel: $180^\circ - 35^\circ - 75^\circ = 70^\circ$ und $180^\circ - 70^\circ - 75^\circ = 35^\circ$.',
     r'Hauptähnlichkeitssatz: ähnlich.'])

Q.q(r'Eine Figur wird mit $k = 2{,}5$ vergrößert. Wie viel Mal so groß wird ihr Flächeninhalt?',
    [r'6,25-mal', r'2,5-mal', r'5-mal', r'15,625-mal'],
    [r'$k^2 = 2{,}5^2 = 6{,}25$'])

Q.q(r'Ein Körper wird mit $k = 0{,}5$ verkleinert. Wie ändert sich sein Volumen?',
    [r'Es wird ein Achtel so groß.', r'Es wird halb so groß.', r'Es wird ein Viertel so groß.', r'Es bleibt gleich.'],
    [r'$k^3 = 0{,}5^3 = 0{,}125 = \dfrac{1}{8}$'])

Q.q(r'Im Grundriss 1 : 50 hat ein Bad 12 cm² Fläche. Wie groß ist es wirklich?',
    [r'3 m²', r'6 m²', r'0,6 m²', r'30 m²'],
    [r'Flächenfaktor $50^2 = 2500$',
     r'$12 \cdot 2500 = 30\,000$ cm² = 3 m²'])

Q.q(r'Zwei ähnliche Figuren mit $k = 1$ – wie nennt man sie?',
    [r'kongruent', r'zentrisch', r'parallel', r'symmetrisch'],
    [r'Ähnlich mit gleicher Größe heißt deckungsgleich, also kongruent.'])

# ------------------------------------------------------------------- Zufall ----
Q.q(r'Wie groß ist die Wahrscheinlichkeit, mit einem Würfel mindestens eine 5 zu werfen?',
    [r'$\dfrac{1}{3}$', r'$\dfrac{1}{6}$', r'$\dfrac{5}{6}$', r'$\dfrac{1}{2}$'],
    [r'Günstig: 5 und 6.',
     r'$P = \dfrac{2}{6} = \dfrac{1}{3}$'])

Q.q(r'Eine Urne enthält 4 rote und 6 grüne Kugeln. Wie groß ist P(grün) beim einmaligen Ziehen?',
    [r'$\dfrac{3}{5}$', r'$\dfrac{2}{5}$', r'$\dfrac{6}{4}$', r'$\dfrac{1}{6}$'],
    [r'$\dfrac{6}{10} = \dfrac{3}{5}$'])

Q.q(r'Eine Münze wird zweimal geworfen. Wie groß ist die Wahrscheinlichkeit für mindestens einmal Zahl?',
    [r'$\dfrac{3}{4}$', r'$\dfrac{1}{2}$', r'$\dfrac{1}{4}$', r'1'],
    [r'Gegenereignis: zweimal Kopf, $\dfrac{1}{4}$.',
     r'$1 - \dfrac{1}{4} = \dfrac{3}{4}$'])

Q.q(r'Zwei Würfel werden geworfen. Wie groß ist die Wahrscheinlichkeit für einen Pasch (zwei gleiche Augenzahlen)?',
    [r'$\dfrac{1}{6}$', r'$\dfrac{1}{36}$', r'$\dfrac{1}{12}$', r'$\dfrac{1}{3}$'],
    [r'Paschs: (1|1) bis (6|6), also 6 von 36 Paaren.',
     r'$\dfrac{6}{36} = \dfrac{1}{6}$'])

Q.q(r'Aus der Urne mit 4 roten und 6 grünen Kugeln werden zwei ohne Zurücklegen gezogen. Wie groß ist P(rot, rot)?',
    [r'$\dfrac{2}{15}$', r'$\dfrac{4}{25}$', r'$\dfrac{1}{6}$', r'$\dfrac{2}{5}$'],
    [r'$\dfrac{4}{10} \cdot \dfrac{3}{9} = \dfrac{12}{90} = \dfrac{2}{15}$'])

Q.q(r'Dieselbe Urne, aber mit Zurücklegen. Wie groß ist jetzt P(rot, rot)?',
    [r'$\dfrac{4}{25}$', r'$\dfrac{2}{15}$', r'$\dfrac{4}{5}$', r'$\dfrac{8}{10}$'],
    [r'$\dfrac{4}{10} \cdot \dfrac{4}{10} = \dfrac{16}{100} = \dfrac{4}{25}$'])

Q.q(r'Ein Spieler trifft mit Wahrscheinlichkeit 0,7. Er wirft zweimal. Wie groß ist die Wahrscheinlichkeit für keinen Treffer?',
    [r'0,09', r'0,3', r'0,49', r'0,6'],
    [r'Fehlwurf: $1 - 0{,}7 = 0{,}3$',
     r'$0{,}3 \cdot 0{,}3 = 0{,}09$'])

Q.q(r'Auf wie viele Arten können sich 3 Personen in einer Reihe aufstellen?',
    [r'6', r'3', r'9', r'27'],
    [r'$3! = 3 \cdot 2 \cdot 1 = 6$'])

Q.q(r'Ein Fahrradschloss hat 4 Ringe mit je 10 Ziffern. Wie groß ist die Wahrscheinlichkeit, den Code zufällig zu treffen?',
    [r'$\dfrac{1}{10\,000}$', r'$\dfrac{1}{40}$', r'$\dfrac{4}{10}$', r'$\dfrac{1}{5040}$'],
    [r'Es gibt $10^4 = 10\,000$ Codes.',
     r'$P = \dfrac{1}{10\,000}$'])

Q.q(r'Bei 200 Würfen fiel 38-mal eine Eins. Wie groß ist die relative Häufigkeit?',
    [r'0,19', r'0,38', r'0,167', r'38'],
    [r'$\dfrac{38}{200} = 0{,}19$',
     r'Zum Vergleich: $\dfrac{1}{6} \approx 0{,}167$.'])


def check():
    from fractions import Fraction as F
    assert F('2.5') * 4 == 10 and 3 * 200000 == 600000
    assert F('4.5') / 6 == F('0.75') and F(9, 6) * 8 == 12 and F(16, 2) * F('1.5') == 12
    assert 180 - 35 - 75 == 70 and 180 - 70 - 75 == 35
    assert F('2.5') ** 2 == F('6.25') and F('0.5') ** 3 == F(1, 8)
    assert 12 * 50 ** 2 == 30000
    assert F(2, 6) == F(1, 3) and F(6, 10) == F(3, 5) and 1 - F(1, 4) == F(3, 4)
    assert F(6, 36) == F(1, 6)
    assert F(4, 10) * F(3, 9) == F(2, 15) and F(4, 10) ** 2 == F(4, 25)
    assert F('0.3') ** 2 == F('0.09')
    assert 3 * 2 * 1 == 6 and 10 ** 4 == 10000
    assert F(38, 200) == F('0.19')


Q.verify(check)
Q.save()
