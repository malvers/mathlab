#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 24 / KW 9 (LB 4): zentrische Streckung,
Streckfaktor, maßstäbliches Vergrößern und Verkleinern. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=24, slug='zentrische-streckung', thema='Zentrische Streckung', lb='LB 4',
        blurb='Streckzentrum, Streckfaktor, Eigenschaften, Maßstab, Bildpunkte im Koordinatensystem',
        comment='Blocks: stretch factor and lengths (1-3, 6, 14, 20), properties (4-5, 13, 15), scale (7-9, 16-19), coordinates (10-12).')

# ------------------------------------------------------------ Streckfaktor ----
Q.q(r'Eine Strecke ist 4 cm lang. Sie wird mit dem Faktor $k = 3$ zentrisch gestreckt. Wie lang ist die Bildstrecke?',
    [r'12 cm', r'7 cm', r'1,3 cm', r'4 cm'],
    [r'Alle Längen werden mit $k$ multipliziert.',
     r'$4 \cdot 3 = 12$, also 12 cm.'])

Q.q(r'Was bewirkt eine zentrische Streckung mit $k = 0{,}5$?',
    [r'eine Verkleinerung auf die Hälfte', r'eine Vergrößerung auf das Doppelte',
     r'eine Verschiebung um 0,5 cm', r'gar keine Veränderung'],
    [r'Für $0 < k < 1$ wird verkleinert.',
     r'Alle Strecken werden halb so lang.'])

Q.q(r'Ein Punkt $P$ ist 2 cm vom Streckzentrum $Z$ entfernt. Wie weit ist der Bildpunkt $P’$ bei $k = 2{,}5$ von $Z$ entfernt?',
    [r'5 cm', r'4,5 cm', r'0,8 cm', r'2,5 cm'],
    [r'$\overline{ZP’} = k \cdot \overline{ZP}$',
     r'$2{,}5 \cdot 2 = 5$, also 5 cm.',
     r'$P’$ liegt auf dem Strahl von $Z$ durch $P$.'])

Q.q(r'Wie liegen Original- und Bildstrecke bei einer zentrischen Streckung zueinander?',
    [r'parallel', r'senkrecht', r'immer auf derselben Geraden', r'Sie schneiden sich im Zentrum.'],
    [r'Eine zentrische Streckung ist geradentreu und parallelentreu.',
     r'Jede Bildstrecke ist parallel zu ihrer Originalstrecke (oder liegt auf derselben Geraden durch $Z$).'])

Q.q(r'Was passiert bei einer zentrischen Streckung mit den Winkeln einer Figur?',
    [r'Sie bleiben gleich groß.', r'Sie werden mit $k$ multipliziert.', r'Sie werden mit $k^2$ multipliziert.', r'Sie werden halbiert.'],
    [r'Die zentrische Streckung ist winkeltreu.',
     r'Deshalb sind Original und Bild ähnlich: gleiche Form, andere Größe.'])

Q.q(r'Ein Punkt ist 4 cm vom Zentrum entfernt, sein Bildpunkt 10 cm. Wie groß ist der Streckfaktor?',
    [r'$k = 2{,}5$', r'$k = 0{,}4$', r'$k = 6$', r'$k = 14$'],
    [r'$k = \dfrac{\overline{ZP’}}{\overline{ZP}} = \dfrac{10}{4}$',
     r'$k = 2{,}5$'])

# ------------------------------------------------------------------- Maßstab ----
Q.q(r'Eine Wanderkarte hat den Maßstab 1 : 25 000. Auf der Karte misst ein Weg 4 cm. Wie lang ist er in Wirklichkeit?',
    [r'1 km', r'10 km', r'100 m', r'6,25 km'],
    [r'$4 \cdot 25\,000 = 100\,000$ cm',
     r'100 000 cm = 1000 m = 1 km'])

Q.q(r'Ein Bauplan hat den Maßstab 1 : 50. Eine Wand ist 6 m lang. Wie lang ist sie im Plan?',
    [r'12 cm', r'1,2 cm', r'30 cm', r'3 cm'],
    [r'6 m = 600 cm',
     r'$600 : 50 = 12$, also 12 cm.'])

Q.q(r'Ein Käfer ist 7 mm lang. Er wird im Maßstab 2 : 1 gezeichnet. Wie lang ist die Zeichnung?',
    [r'14 mm', r'3,5 mm', r'9 mm', r'21 mm'],
    [r'2 : 1 bedeutet: 2 mm in der Zeichnung entsprechen 1 mm in Wirklichkeit, also Vergrößerung mit $k = 2$.',
     r'$7 \cdot 2 = 14$ mm'])

# ---------------------------------------------------- Koordinatensystem ----
Q.q(r'Streckzentrum ist der Ursprung, $k = 2$. Welcher Bildpunkt gehört zu $P(2 \mid 3)$?',
    [r'$P’(4 \mid 6)$', r'$P’(4 \mid 3)$', r'$P’(2 \mid 6)$', r'$P’(4 \mid 5)$'],
    [r'Bei Zentrum im Ursprung werden beide Koordinaten mit $k$ multipliziert.',
     r'$(2 \cdot 2 \mid 2 \cdot 3) = (4 \mid 6)$'])

Q.q(r'Streckzentrum ist der Ursprung, $k = 0{,}5$. Welcher Bildpunkt gehört zu $P(-4 \mid 6)$?',
    [r'$P’(-2 \mid 3)$', r'$P’(-8 \mid 12)$', r'$P’(2 \mid -3)$', r'$P’(-3{,}5 \mid 6{,}5)$'],
    [r'Beide Koordinaten halbieren.',
     r'$(-4 \cdot 0{,}5 \mid 6 \cdot 0{,}5) = (-2 \mid 3)$'])

Q.q(r'Streckzentrum ist $Z(1 \mid 1)$, $k = 3$. Welcher Bildpunkt gehört zu $P(3 \mid 2)$?',
    [r'$P’(7 \mid 4)$', r'$P’(9 \mid 6)$', r'$P’(6 \mid 3)$', r'$P’(5 \mid 3)$'],
    [r'Von $Z$ nach $P$: 2 nach rechts, 1 nach oben.',
     r'Mal 3: 6 nach rechts, 3 nach oben, wieder von $Z$ aus.',
     r'$P’(1 + 6 \mid 1 + 3) = (7 \mid 4)$; $(9 \mid 6)$ wäre falsch, weil das Zentrum nicht im Ursprung liegt.'])

Q.q(r'Welcher Punkt bleibt bei einer zentrischen Streckung immer an seiner Stelle?',
    [r'das Streckzentrum', r'der Ursprung', r'jeder Eckpunkt', r'kein Punkt'],
    [r'Für $Z$ gilt $\overline{ZZ’} = k \cdot 0 = 0$.',
     r'Das Zentrum ist ein Fixpunkt.'])

Q.q(r'Ein Dreieck hat den Umfang 12 cm. Es wird mit $k = 1{,}5$ gestreckt. Welchen Umfang hat das Bilddreieck?',
    [r'18 cm', r'27 cm', r'13,5 cm', r'8 cm'],
    [r'Jede Seite wird 1,5-mal so lang, also auch ihre Summe.',
     r'$12 \cdot 1{,}5 = 18$ cm'])

Q.q(r'Was entsteht bei einer zentrischen Streckung mit $k = 1$?',
    [r'eine Figur, die mit dem Original übereinstimmt', r'eine doppelt so große Figur',
     r'ein einzelner Punkt', r'eine gespiegelte Figur'],
    [r'Alle Abstände vom Zentrum bleiben gleich.',
     r'Jeder Punkt ist sein eigener Bildpunkt.'])

Q.q(r'Ein Modellauto hat den Maßstab 1 : 18. Das echte Auto ist 4,5 m lang. Wie lang ist das Modell?',
    [r'25 cm', r'81 cm', r'2,5 cm', r'4 cm'],
    [r'4,5 m = 450 cm',
     r'$450 : 18 = 25$ cm'])

Q.q(r'Eine Modelleisenbahn der Spur H0 hat den Maßstab 1 : 87. Eine Modell-Lok ist 15 cm lang. Wie lang ist das Original?',
    [r'13,05 m', r'1,305 m', r'5,8 m', r'130,5 m'],
    [r'$15 \cdot 87 = 1305$ cm',
     r'1305 cm = 13,05 m'])

Q.q(r'Ein Beamer wirft ein 2 cm breites Bild als 1,6 m breites Bild an die Wand. Mit welchem Faktor wird vergrößert?',
    [r'$k = 80$', r'$k = 8$', r'$k = 0{,}8$', r'$k = 800$'],
    [r'Gleiche Einheiten: 1,6 m = 160 cm.',
     r'$k = 160 : 2 = 80$'])

Q.q(r'Ein Foto im Format 9 cm × 13 cm wird ähnlich auf 18 cm × 26 cm vergrößert. Wie groß ist der Streckfaktor?',
    [r'$k = 2$', r'$k = 4$', r'$k = 9$', r'$k = 13$'],
    [r'$18 : 9 = 2$ und $26 : 13 = 2$',
     r'Beide Seiten werden verdoppelt, die Bilder sind ähnlich.'])

Q.q(r'Eine Strecke wird zuerst mit $k = 2$ und das Bild danach mit $k = 3$ gestreckt (gleiches Zentrum). Welcher Streckfaktor ersetzt beide Schritte?',
    [r'$k = 6$', r'$k = 5$', r'$k = 1{,}5$', r'$k = 9$'],
    [r'Erst wird jede Länge verdoppelt, dann verdreifacht.',
     r'Insgesamt: $2 \cdot 3 = 6$'])


def check():
    from fractions import Fraction as F
    assert 4 * 3 == 12 and F('2.5') * 2 == 5 and F(10, 4) == F('2.5')
    assert 4 * 25000 == 100000 and 100000 / 100 / 1000 == 1
    assert 600 / 50 == 12 and 7 * 2 == 14
    assert (2 * 2, 2 * 3) == (4, 6) and (F(-4, 2), F(6, 2)) == (-2, 3)
    Z, P = (1, 1), (3, 2)
    assert (Z[0] + 3 * (P[0] - Z[0]), Z[1] + 3 * (P[1] - Z[1])) == (7, 4)
    assert 12 * F('1.5') == 18
    assert 450 / 18 == 25 and 15 * 87 == 1305
    assert 160 / 2 == 80 and 18 / 9 == 26 / 13 == 2 and 2 * 3 == 6


Q.verify(check)
Q.save()
