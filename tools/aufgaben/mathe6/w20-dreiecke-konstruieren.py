#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 20 / KW 3 (LB 3): constructing triangles - congruence
theorems sss, sws, wsw, SsW, triangle inequality, side-angle relation, existence and
uniqueness. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os6
from osfig import vieleck

Q = os6(nr=20, slug='dreiecke-konstruieren', thema='Dreiecke konstruieren', lb='LB 3',
        blurb='Kongruenzsätze, Dreiecksungleichung, Seiten-Winkel-Beziehung, Lösbarkeit',
        comment='Blocks: triangle inequality (1-3, 18-19), congruence theorems (4-8, 13-17, 20), side-angle relation and existence (9-12).')


def tri(alpha, beta, c=6.0):
    gamma = 180 - alpha - beta
    b = c * math.sin(math.radians(beta)) / math.sin(math.radians(gamma))
    return [(0, 0), (c, 0), (b * math.cos(math.radians(alpha)), b * math.sin(math.radians(alpha)))]


def ok(a, b, c):
    return a + b > c and a + c > b and b + c > a


# ------------------------------------------------------- triangle inequality ----
Q.q(r'Mit welchen drei Seitenlängen lässt sich ein Dreieck zeichnen?',
    [r'4 cm, 5 cm und 8 cm', r'2 cm, 3 cm und 6 cm', r'3 cm, 4 cm und 7 cm', r'1 cm, 1 cm und 3 cm'],
    [r'Dreiecksungleichung: Zwei Seiten zusammen müssen länger sein als die dritte.',
     r'$4 + 5 = 9 > 8$ – das klappt.',
     r'$2 + 3 < 6$, $3 + 4 = 7$ (nur eine flache Strecke) und $1 + 1 < 3$ klappen nicht.'])

Q.q(r'Bei welchen Seitenlängen gibt es KEIN Dreieck?',
    [r'3 cm, 5 cm und 9 cm', r'5 cm, 5 cm und 9 cm', r'6 cm, 7 cm und 8 cm', r'4 cm, 4 cm und 4 cm'],
    [r'Prüfe immer die beiden kürzeren Seiten gegen die längste.',
     r'$3 + 5 = 8$, das ist kürzer als 9.',
     r'Die beiden kurzen Seiten reichen nicht bis zueinander.'])

Q.q(r'Zwei Seiten eines Dreiecks sind 5 cm und 8 cm lang. Welche Länge kann die dritte Seite haben?',
    [r'10 cm', r'2 cm', r'13 cm', r'14 cm'],
    [r'Die dritte Seite muss länger sein als $8 - 5 = 3$ cm.',
     r'Und kürzer als $8 + 5 = 13$ cm.',
     r'Von den Angeboten passt nur 10 cm.'])

Q.q(r'Von zu Hause zur Schule sind es 3 km Luftlinie, von der Schule zum Sportplatz 2 km. Wie weit ist es höchstens von zu Hause zum Sportplatz (Luftlinie)?',
    [r'5 km', r'1 km', r'6 km', r'2,5 km'],
    [r'Zu Hause, Schule und Sportplatz bilden ein Dreieck oder liegen auf einer Linie.',
     r'Die dritte Strecke ist höchstens so lang wie die beiden anderen zusammen.',
     r'Höchstens $3 + 2 = 5$ km, mindestens $3 - 2 = 1$ km.'])

Q.q(r'Ein gleichschenkliges Dreieck hat eine Basis von 10 cm. Wie lang muss jeder Schenkel sein?',
    [r'länger als 5 cm', r'länger als 10 cm', r'genau 10 cm', r'beliebig lang'],
    [r'Die beiden Schenkel zusammen müssen länger als die Basis sein.',
     r'$2 \cdot s > 10$ cm',
     r'Also $s > 5$ cm.'])

# --------------------------------------------------------- congruence theorems ----
Q.q(r'Von einem Dreieck kennt man alle drei Seiten. Nach welchem Kongruenzsatz ist es eindeutig konstruierbar?',
    [r'sss', r'sws', r'wsw', r'SsW'],
    [r'Gegeben sind drei Seiten: s, s, s.',
     r'Wenn die Dreiecksungleichung erfüllt ist, gibt es genau ein Dreieck (bis auf die Lage).',
     r'Kongruenzsatz sss.'])

Q.q(r'Gegeben sind zwei Seiten und der Winkel, den sie einschließen. Welcher Kongruenzsatz passt?',
    [r'sws', r'sss', r'wsw', r'SsW'],
    [r'Der Winkel liegt zwischen den beiden Seiten.',
     r'Seite – Winkel – Seite.',
     r'Kongruenzsatz sws.'])

Q.q(r'Gegeben sind eine Seite und die beiden Winkel, die an ihr anliegen. Welcher Kongruenzsatz passt?',
    [r'wsw', r'sws', r'sss', r'SsW'],
    [r'Die Seite liegt zwischen den beiden Winkeln.',
     r'Winkel – Seite – Winkel.',
     r'Kongruenzsatz wsw.'])

Q.q(r'Gegeben sind zwei Seiten und der Winkel, der der längeren Seite gegenüberliegt. Welcher Kongruenzsatz passt?',
    [r'SsW', r'sws', r'wsw', r'sss'],
    [r'Der Winkel liegt nicht zwischen den Seiten, sondern einer Seite gegenüber.',
     r'Das große S zeigt: Es muss die größere Seite sein.',
     r'Kongruenzsatz SsW.'])

Q.q(r'Gegeben sind nur die drei Winkel 50°, 60° und 70°. Ist das Dreieck eindeutig bestimmt?',
    [r'Nein, die Form steht fest, die Größe aber nicht.', r'Ja, nach dem Satz www.',
     r'Ja, weil die Winkelsumme 180° ist.', r'Nein, solche Winkel gibt es in keinem Dreieck.'],
    [r'Es gibt kleine und große Dreiecke mit genau diesen Winkeln.',
     r'Sie sehen gleich aus, sind aber nicht deckungsgleich.',
     r'„www“ ist kein Kongruenzsatz – es fehlt mindestens eine Seite.'])

Q.q(r'Was bedeutet es, dass zwei Dreiecke kongruent sind?',
    [r'Sie sind deckungsgleich: Man kann das eine genau auf das andere legen.', r'Sie haben nur denselben Flächeninhalt.',
     r'Sie haben nur dieselben Winkel.', r'Sie liegen nebeneinander.'],
    [r'Kongruent heißt deckungsgleich.',
     r'Alle Seiten und alle Winkel stimmen überein.',
     r'Ausschneiden und auflegen – sie passen genau.'])

Q.q(r'Ein Dreieck soll nach sss mit $a = 4$ cm, $b = 5$ cm und $c = 6$ cm konstruiert werden. Wie geht es nach dem Zeichnen von $c = \overline{AB}$ weiter?',
    [r'Kreis um $A$ mit 5 cm und Kreis um $B$ mit 4 cm; der Schnittpunkt ist $C$.',
     r'Kreis um $A$ mit 4 cm und Kreis um $B$ mit 5 cm; der Schnittpunkt ist $C$.',
     r'An $A$ einen Winkel von 60° antragen.', r'Die Mitte von $\overline{AB}$ suchen.'],
    [r'$b = \overline{AC}$ ist die Seite gegenüber von $B$; sie geht von $A$ aus.',
     r'$a = \overline{BC}$ geht von $B$ aus.',
     r'Also Kreis um $A$ mit $r = 5$ cm und um $B$ mit $r = 4$ cm.'])

Q.q(r'Ein Dreieck mit $a = 4$ cm, $b = 6$ cm und $\gamma = 50°$ soll konstruiert werden. Womit beginnt man sinnvoll?',
    [r'mit dem Winkel $\gamma$ am Punkt $C$, dann $a$ und $b$ auf seinen Schenkeln abtragen',
     r'mit der Seite $c$', r'mit einem Kreis um $A$ mit 50 mm', r'mit dem Winkel $\alpha$'],
    [r'$\gamma$ liegt bei $C$, zwischen den Seiten $a$ und $b$: Kongruenzsatz sws.',
     r'Zuerst den Winkel zeichnen, dann auf den Schenkeln 4 cm und 6 cm abmessen.',
     r'Die Endpunkte $B$ und $A$ verbinden: Das ist die Seite $c$.'])

Q.q(r'Gegeben sind $b = 4$ cm, $c = 6$ cm und $\gamma = 70°$. Wie viele verschiedene Dreiecke gibt es (bis auf die Lage)?',
    [r'genau eins', r'zwei', r'keins', r'unendlich viele'],
    [r'$\gamma$ liegt der Seite $c$ gegenüber.',
     r'$c = 6$ cm ist die größere der beiden Seiten.',
     r'Nach SsW ist das Dreieck eindeutig: genau eins.'])

Q.q(r'Warum gilt SsW nur, wenn der Winkel der größeren Seite gegenüberliegt?',
    [r'Liegt er der kleineren Seite gegenüber, kann es zwei verschiedene Dreiecke geben.',
     r'Weil sonst die Winkelsumme größer als 180° wäre.', r'Weil man kleinere Seiten nicht messen kann.',
     r'Das stimmt nicht, SsW gilt immer.'],
    [r'Beim Konstruieren schneidet der Kreis den freien Schenkel dann manchmal zweimal.',
     r'Beide Schnittpunkte ergeben ein passendes Dreieck.',
     r'Das Dreieck ist dann nicht eindeutig bestimmt.'])

Q.q(r'Nach welchem Kongruenzsatz ist das Dreieck durch die markierten Stücke bestimmt?',
    [r'wsw', r'sws', r'sss', r'SsW'],
    [r'Gegeben: die Seite $c = 5$ cm und die Winkel 40° und 60° an ihren Enden.',
     r'Die Seite liegt zwischen den beiden Winkeln.',
     r'Winkel – Seite – Winkel: wsw.'],
    fig=vieleck(tri(40, 60, 5), names=['A', 'B', 'C'], angles=[(0, '40°'), (1, '60°')], sides=[(0, 'c = 5 cm')]),
    figcap=r'Gegebene Stücke eines Dreiecks')

# -------------------------------------------- side-angle relation, existence ----
Q.q(r'In einem Dreieck ist $a = 7$ cm, $b = 5$ cm und $c = 4$ cm. Welcher Winkel ist am größten?',
    [r'$\alpha$', r'$\beta$', r'$\gamma$', r'Alle sind gleich groß.'],
    [r'Der längeren Seite liegt der größere Winkel gegenüber.',
     r'Die längste Seite ist $a = 7$ cm.',
     r'Ihr gegenüber liegt $\alpha$.'])

Q.q(r'In einem Dreieck ist $\beta = 80°$ und $\gamma = 40°$. Welche Seite ist am kürzesten?',
    [r'$c$', r'$a$', r'$b$', r'Alle sind gleich lang.'],
    [r'$\alpha = 180° - 80° - 40° = 60°$',
     r'Der kleinste Winkel ist $\gamma = 40°$.',
     r'Ihm gegenüber liegt die kürzeste Seite $c$.'])

Q.q(r'Gegeben sind $c = 5$ cm, $\alpha = 95°$ und $\beta = 85°$. Was ergibt die Konstruktion?',
    [r'kein Dreieck, die Schenkel treffen sich nicht', r'genau ein Dreieck', r'zwei Dreiecke', r'ein gleichschenkliges Dreieck'],
    [r'$\alpha + \beta = 180°$',
     r'Für $\gamma$ bleibt nichts übrig.',
     r'Die freien Schenkel laufen parallel: kein Dreieck.'])


Q.q(r'Ein Dreieck wird nach sws mit $a = 6$ cm, $b = 6$ cm und $\gamma = 60°$ konstruiert. Was für ein Dreieck entsteht?',
    [r'ein gleichseitiges Dreieck', r'ein rechtwinkliges Dreieck', r'ein stumpfwinkliges Dreieck', r'kein Dreieck'],
    [r'$a = b$: Das Dreieck ist gleichschenklig, $\alpha$ und $\beta$ sind gleich groß.',
     r'$\alpha = \beta = (180° - 60°) : 2 = 60°$',
     r'Alle Winkel sind 60°, also sind auch alle Seiten gleich lang: gleichseitig.'])

def check():
    assert ok(4, 5, 8) and not ok(2, 3, 6) and not ok(3, 4, 7) and not ok(1, 1, 3)
    assert not ok(3, 5, 9) and ok(5, 5, 9) and ok(6, 7, 8) and ok(4, 4, 4)
    assert ok(5, 8, 10) and not ok(5, 8, 2) and not ok(5, 8, 13) and not ok(5, 8, 14)
    assert 3 + 2 == 5 and 3 - 2 == 1
    assert ok(10, 5.01, 5.01) and not ok(10, 5, 5)
    p = tri(40, 60, 5)
    assert abs(math.dist(p[0], p[1]) - 5) < 1e-12
    sides = {'a': 7, 'b': 5, 'c': 4}
    assert max(sides, key=sides.get) == 'a'
    angles = {'alpha': 180 - 80 - 40, 'beta': 80, 'gamma': 40}
    assert min(angles, key=angles.get) == 'gamma' and angles['alpha'] == 60
    assert 95 + 85 == 180
    assert (180 - 60) / 2 == 60
    # SsW with the angle opposite the shorter side: a = 5, c = 4, gamma = 40 gives two triangles
    s = 5 * math.sin(math.radians(40)) / 4
    a1 = math.degrees(math.asin(s))
    assert s < 1 and a1 + 40 < 180 and (180 - a1) + 40 < 180
    # b = 4, c = 6, gamma = 70: beta from the sine rule, only the acute solution fits
    sb = 4 * math.sin(math.radians(70)) / 6
    assert (180 - math.degrees(math.asin(sb))) + 70 > 180


Q.verify(check)
Q.save()
