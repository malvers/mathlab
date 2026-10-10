#!/usr/bin/env python3
"""Aufgaben OS Mathe 8 (Realschule), Woche 25 / KW 10 (LB 4): ähnliche Figuren,
Hauptähnlichkeitssatz, Höhen über Schatten. Plan: HTML/svp/mathe/mathe8.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os8

Q = os8(nr=25, slug='aehnliche-figuren', thema='Ähnliche Figuren', lb='LB 4',
        blurb='Ähnlichkeit, Hauptähnlichkeitssatz, fehlende Seiten, Höhen über Schatten',
        comment='Blocks: definition and main theorem (1-4, 8, 15-17, 20), sides (5-7, 13-14, 18), shadows and context (9-12, 19). Problem 11 after the Thales anecdote in Plutarch.')

# --------------------------------------------------- Begriff und Satz ----
Q.q(r'Wann heißen zwei Figuren zueinander ähnlich?',
    [r'wenn sie in allen Winkeln übereinstimmen und alle Seiten im gleichen Verhältnis stehen',
     r'wenn sie gleich groß sind', r'wenn sie denselben Umfang haben', r'wenn sie gleich viele Ecken haben'],
    [r'Ähnliche Figuren haben dieselbe Form, aber möglicherweise eine andere Größe.',
     r'Man kann die eine durch zentrisches Strecken (und Bewegen) aus der anderen erhalten.'])

Q.q(r'Wie lautet der Hauptähnlichkeitssatz für Dreiecke?',
    [r'Wenn zwei Dreiecke in zwei Winkeln übereinstimmen, dann sind sie ähnlich.',
     r'Wenn zwei Dreiecke in zwei Seiten übereinstimmen, dann sind sie ähnlich.',
     r'Wenn zwei Dreiecke ähnlich sind, dann sind sie gleich groß.',
     r'Wenn zwei Dreiecke einen gleichen Winkel haben, dann sind sie ähnlich.'],
    [r'Stimmen zwei Winkel überein, dann wegen der Winkelsumme auch der dritte.',
     r'Gleiche Winkel genügen bei Dreiecken für die Ähnlichkeit.'])

Q.q(r'Dreieck 1 hat die Winkel $40^\circ$ und $60^\circ$, Dreieck 2 die Winkel $60^\circ$ und $80^\circ$. Sind sie ähnlich?',
    [r'Ja, beide haben die Winkel $40^\circ$, $60^\circ$ und $80^\circ$.', r'Nein, die angegebenen Winkel sind verschieden.',
     r'Nein, man braucht Seitenlängen.', r'Nur wenn sie gleich groß sind.'],
    [r'Dritter Winkel in Dreieck 1: $180^\circ - 40^\circ - 60^\circ = 80^\circ$.',
     r'Dritter Winkel in Dreieck 2: $180^\circ - 60^\circ - 80^\circ = 40^\circ$.',
     r'Gleiche Winkel: Die Dreiecke sind ähnlich.'])

Q.q(r'Dreieck 1 hat die Winkel $50^\circ$ und $70^\circ$, Dreieck 2 die Winkel $50^\circ$ und $50^\circ$. Sind sie ähnlich?',
    [r'Nein, die Winkel sind $50^\circ, 70^\circ, 60^\circ$ und $50^\circ, 50^\circ, 80^\circ$.', r'Ja, beide haben einen Winkel von $50^\circ$.',
     r'Ja, alle Dreiecke sind ähnlich.', r'Das lässt sich nicht entscheiden.'],
    [r'Dritte Winkel: $60^\circ$ und $80^\circ$.',
     r'Die Winkel stimmen nicht überein, also sind die Dreiecke nicht ähnlich.'])

# ---------------------------------------------------------------- Seiten ----
Q.q(r'Ein Dreieck hat die Seiten 3 cm, 4 cm und 5 cm. In einem ähnlichen Dreieck ist die kürzeste Seite 6 cm lang. Wie lang sind die anderen?',
    [r'8 cm und 10 cm', r'7 cm und 8 cm', r'12 cm und 15 cm', r'6 cm und 6 cm'],
    [r'$k = 6 : 3 = 2$',
     r'$4 \cdot 2 = 8$ und $5 \cdot 2 = 10$'])

Q.q(r'Zwei Dreiecke sind ähnlich. Zur Seite $a = 4$ cm gehört $a’ = 10$ cm, zur Seite $b = 6$ cm gehört $b’$. Wie lang ist $b’$?',
    [r'15 cm', r'12 cm', r'2,4 cm', r'16 cm'],
    [r'$k = \dfrac{10}{4} = 2{,}5$',
     r'$b’ = 2{,}5 \cdot 6 = 15$ cm',
     r'12 cm entsteht, wenn man 6 cm addiert statt zu multiplizieren.'])

Q.q(r'Welches Rechteck ist ähnlich zu einem Rechteck mit 4 cm × 6 cm?',
    [r'6 cm × 9 cm', r'6 cm × 8 cm', r'5 cm × 7 cm', r'8 cm × 10 cm'],
    [r'Ähnlich heißt: gleiches Seitenverhältnis.',
     r'$\dfrac{4}{6} = \dfrac{6}{9}$, beide gleich $\dfrac{2}{3}$, mit $k = 1{,}5$.',
     r'$5 \times 7$ entsteht durch Addieren von 1, das ändert die Form.'])

Q.q(r'Welche Figuren sind immer zueinander ähnlich?',
    [r'alle Quadrate', r'alle Rechtecke', r'alle Rauten', r'alle gleichschenkligen Dreiecke'],
    [r'Alle Quadrate haben rechte Winkel und das Seitenverhältnis 1 : 1.',
     r'Rechtecke, Rauten und gleichschenklige Dreiecke können verschieden geformt sein.'])

# ---------------------------------------------------------- Schatten ----
Q.q(r'Ein 2 m langer Stab wirft einen 1,5 m langen Schatten. Ein Baum wirft zur selben Zeit einen 12 m langen Schatten. Wie hoch ist der Baum?',
    [r'16 m', r'9 m', r'18 m', r'13,5 m'],
    [r'Die Sonnenstrahlen sind parallel, Stab- und Baumdreieck sind ähnlich.',
     r'$k = 12 : 1{,}5 = 8$',
     r'Höhe: $2 \cdot 8 = 16$ m'])

Q.q(r'Eine 1,80 m große Person wirft einen 2,40 m langen Schatten, ein Turm zur selben Zeit einen 30 m langen. Wie hoch ist der Turm?',
    [r'22,5 m', r'40 m', r'29,4 m', r'18 m'],
    [r'$\dfrac{h}{30} = \dfrac{1{,}80}{2{,}40}$',
     r'$h = 30 \cdot 0{,}75 = 22{,}5$ m'])

Q.q(r'Thales soll die Höhe der Cheops-Pyramide über Schatten bestimmt haben (überliefert von Plutarch). Ein 1 m langer Stab wirft 1,5 m Schatten, die Pyramide (bis zur Mitte gemessen) 219 m. Wie hoch ist sie nach dieser Rechnung?',
    [r'146 m', r'328,5 m', r'220 m', r'109,5 m'],
    [r'Ähnliche Dreiecke: $\dfrac{h}{219} = \dfrac{1}{1{,}5}$',
     r'$h = 219 : 1{,}5 = 146$ m',
     r'Die Pyramide war ursprünglich etwa 146,6 m hoch.'])

Q.q(r'In ein Dreieck wird eine Strecke parallel zu einer Seite gezeichnet. Warum ist das abgeschnittene kleine Dreieck zum großen ähnlich?',
    [r'Es hat dieselben Winkel: einen gemeinsamen Winkel und zwei Stufenwinkel an Parallelen.',
     r'Weil es kleiner ist.', r'Weil es dieselbe Grundseite hat.', r'Weil jedes Teildreieck ähnlich ist.'],
    [r'Der Winkel an der gemeinsamen Spitze ist gleich.',
     r'An den Parallelen sind die Stufenwinkel gleich groß.',
     r'Nach dem Hauptähnlichkeitssatz genügen zwei gleiche Winkel.'])

Q.q(r'Im großen Dreieck ist eine Seite 12 cm lang, die entsprechende Seite im ähnlichen kleinen Dreieck 9 cm. Eine andere Seite des großen Dreiecks misst 8 cm. Wie lang ist die entsprechende kleine Seite?',
    [r'6 cm', r'5 cm', r'10,7 cm', r'3 cm'],
    [r'$k = \dfrac{9}{12} = 0{,}75$',
     r'$8 \cdot 0{,}75 = 6$ cm'])

Q.q(r'DIN A4 (210 mm × 297 mm) und DIN A3 (297 mm × 420 mm) sind ähnlich. Wie groß ist der Streckfaktor von A4 zu A3 ungefähr?',
    [r'1,41', r'2', r'1,5', r'0,71'],
    [r'$420 : 297 \approx 1{,}414$ und $297 : 210 \approx 1{,}414$',
     r'Der Faktor ist $\sqrt{2}$: Zwei A4-Blätter ergeben ein A3-Blatt.'])

Q.q(r'Sind ein Rechteck mit 2 cm × 3 cm und eines mit 3 cm × 4 cm ähnlich?',
    [r'Nein, $\dfrac{2}{3} \neq \dfrac{3}{4}$.', r'Ja, beide Seiten sind um 1 cm gewachsen.',
     r'Ja, alle Rechtecke sind ähnlich.', r'Ja, weil alle Winkel $90^\circ$ sind.'],
    [r'Gleiche Winkel genügen bei Vierecken nicht.',
     r'Das Seitenverhältnis muss gleich sein: $\dfrac{2}{3} \approx 0{,}67$, $\dfrac{3}{4} = 0{,}75$.'])

Q.q(r'„Wenn zwei Dreiecke ähnlich sind, dann …“ – wie geht der Satz richtig weiter?',
    [r'… stimmen sie in allen Winkeln überein.', r'… sind sie gleich groß.',
     r'… haben sie denselben Umfang.', r'… sind sie gleichseitig.'],
    [r'Ähnliche Figuren haben dieselbe Form, also dieselben Winkel.',
     r'Größe und Umfang können sich unterscheiden.'])

Q.q(r'Zwei gleichschenklige Dreiecke haben beide an der Spitze einen Winkel von $40^\circ$. Sind sie ähnlich?',
    [r'Ja, beide haben die Winkel $40^\circ$, $70^\circ$ und $70^\circ$.', r'Nein, die Schenkel können verschieden lang sein.',
     r'Nur wenn die Basis gleich lang ist.', r'Nein, gleichschenklige Dreiecke sind nie ähnlich.'],
    [r'Basiswinkel: $(180^\circ - 40^\circ) : 2 = 70^\circ$.',
     r'Gleiche Winkel: Die Dreiecke sind ähnlich.'])

Q.q(r'Welches Dreieck ist ähnlich zu einem Dreieck mit den Seiten 5 cm, 7 cm und 9 cm?',
    [r'7,5 cm, 10,5 cm, 13,5 cm', r'6 cm, 8 cm, 10 cm', r'10 cm, 14 cm, 16 cm', r'5 cm, 7 cm, 10 cm'],
    [r'Alle Seiten müssen mit demselben Faktor multipliziert werden.',
     r'$5 \cdot 1{,}5 = 7{,}5$, $7 \cdot 1{,}5 = 10{,}5$, $9 \cdot 1{,}5 = 13{,}5$'])

Q.q(r'Mit dem Försterdreieck (gleichschenklig-rechtwinklig) peilt eine Försterin die Baumspitze an. Sie steht 18 m vom Baum entfernt, ihre Augen sind 1,60 m hoch. Wie hoch ist der Baum?',
    [r'19,60 m', r'18 m', r'16,40 m', r'28,8 m'],
    [r'Bei $45^\circ$ ist die Höhe über Augenhöhe so groß wie der Abstand: 18 m.',
     r'Dazu die Augenhöhe: $18 + 1{,}60 = 19{,}60$ m.'])

Q.q(r'Wann sind zwei ähnliche Figuren sogar kongruent?',
    [r'wenn der Streckfaktor $k = 1$ ist', r'wenn der Streckfaktor $k = 2$ ist', r'wenn sie gleiche Winkel haben', r'immer'],
    [r'Kongruent heißt deckungsgleich: gleiche Form und gleiche Größe.',
     r'Das ist der Spezialfall der Ähnlichkeit mit $k = 1$.'])


def check():
    from fractions import Fraction as F
    assert 180 - 40 - 60 == 80 and 180 - 60 - 80 == 40
    assert 180 - 50 - 70 == 60 and 180 - 50 - 50 == 80
    k = F(6, 3)
    assert 4 * k == 8 and 5 * k == 10
    assert F(10, 4) * 6 == 15
    assert F(4, 6) == F(6, 9) and F(4, 6) != F(5, 7)
    assert F(12, F('1.5')) * 2 == 16
    assert 30 * F('1.8') / F('2.4') == F('22.5')
    assert 219 / F('1.5') == 146
    assert F(9, 12) * 8 == 6
    assert round(420 / 297, 3) == 1.414 and round(297 / 210, 3) == 1.414
    assert F(2, 3) != F(3, 4)
    assert (180 - 40) / 2 == 70
    assert [x * F('1.5') for x in (5, 7, 9)] == [F('7.5'), F('10.5'), F('13.5')]
    assert 18 + F('1.6') == F('19.6')


Q.verify(check)
Q.save()
