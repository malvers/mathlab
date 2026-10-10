#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 19 / KW 2 (LB 3): angle sum in the triangle, classifying
triangles by angles and by sides. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys, math
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os6
from osfig import vieleck

Q = os6(nr=19, slug='dreiecke', thema='Dreiecke: Innenwinkelsatz und Einteilung', lb='LB 3',
        blurb='Innenwinkelsumme 180°, spitz-, recht- und stumpfwinklig, gleichschenklig und gleichseitig',
        comment='Blocks: angle sum (1-4, 12-14, 17-18, 20), classifying (5-10, 15-16), reasons (11, 19).')


def tri(alpha, beta, c=6.0):
    """Triangle A, B, C (counter-clockwise) with angles alpha at A and beta at B."""
    gamma = 180 - alpha - beta
    b = c * math.sin(math.radians(beta)) / math.sin(math.radians(gamma))
    return [(0, 0), (c, 0), (b * math.cos(math.radians(alpha)), b * math.sin(math.radians(alpha)))]


ABC = ['A', 'B', 'C']

# ---------------------------------------------------------------- angle sum ----
Q.q(r'Wie groß ist der Winkel $\gamma$?',
    [r'70°', r'80°', r'110°', r'60°'],
    [r'Die Innenwinkel eines Dreiecks ergeben zusammen 180°.',
     r'$\alpha + \beta = 50° + 60° = 110°$',
     r'$\gamma = 180° - 110° = 70°$'],
    fig=vieleck(tri(50, 60), names=ABC, angles=[(0, '50°'), (1, '60°'), (2, 'γ')]), figcap=r'Dreieck ABC')

Q.q(r'Wie groß ist der Winkel $\beta$?',
    [r'55°', r'65°', r'45°', r'145°'],
    [r'Bei $A$ ist ein rechter Winkel: 90°.',
     r'$90° + 35° = 125°$',
     r'$\beta = 180° - 125° = 55°$'],
    fig=vieleck(tri(90, 55), names=ABC, angles=[(1, 'β'), (2, '35°')], right=[0]), figcap=r'Rechtwinkliges Dreieck ABC')

Q.q(r'In einem gleichschenkligen Dreieck ist jeder Basiswinkel 40° groß. Wie groß ist der Winkel an der Spitze?',
    [r'100°', r'140°', r'40°', r'80°'],
    [r'Die beiden Basiswinkel sind gleich groß: zusammen 80°.',
     r'Für die Spitze bleiben $180° - 80°$.',
     r'Also 100°.'])

Q.q(r'Wie groß ist jeder Winkel in einem gleichseitigen Dreieck?',
    [r'60°', r'90°', r'45°', r'180°'],
    [r'Alle drei Seiten sind gleich lang, also auch alle drei Winkel gleich groß.',
     r'$180° : 3$',
     r'$= 60°$'])

# --------------------------------------------------------------- classifying ----
Q.q(r'Ein Dreieck hat die Winkel 30°, 60° und 90°. Wie heißt es nach seinen Winkeln?',
    [r'rechtwinklig', r'spitzwinklig', r'stumpfwinklig', r'gleichseitig'],
    [r'Entscheidend ist der größte Winkel.',
     r'Er ist genau 90°.',
     r'Also ist das Dreieck rechtwinklig.'])

Q.q(r'Ein Dreieck hat die Winkel 20°, 40° und 120°. Wie heißt es nach seinen Winkeln?',
    [r'stumpfwinklig', r'spitzwinklig', r'rechtwinklig', r'gleichschenklig'],
    [r'Der größte Winkel ist 120°.',
     r'Er ist größer als 90°: ein stumpfer Winkel.',
     r'Also ist das Dreieck stumpfwinklig.'])

Q.q(r'Ein Dreieck hat die Winkel 50°, 60° und 70°. Wie heißt es nach seinen Winkeln?',
    [r'spitzwinklig', r'stumpfwinklig', r'rechtwinklig', r'gleichseitig'],
    [r'Alle drei Winkel sind kleiner als 90°.',
     r'Alle sind spitze Winkel.',
     r'Also ist das Dreieck spitzwinklig.'])

Q.q(r'Ein Dreieck hat die Seiten 5 cm, 5 cm und 7 cm. Wie heißt es nach seinen Seiten?',
    [r'gleichschenklig', r'gleichseitig', r'unregelmäßig', r'rechtwinklig'],
    [r'Zwei Seiten sind gleich lang: die Schenkel.',
     r'Die dritte Seite (7 cm) ist die Basis.',
     r'Also ist es gleichschenklig.'])

Q.q(r'Ein Dreieck hat die Seiten 4 cm, 5 cm und 6 cm. Wie heißt es nach seinen Seiten?',
    [r'unregelmäßig', r'gleichschenklig', r'gleichseitig', r'rechtwinklig'],
    [r'Keine zwei Seiten sind gleich lang.',
     r'Es ist weder gleichschenklig noch gleichseitig.',
     r'Man nennt es unregelmäßig.'])

Q.q(r'Kann ein Dreieck zwei rechte Winkel haben?',
    [r'Nein, dann wären schon zwei Winkel zusammen 180°.', r'Ja, beim Quadrat.',
     r'Ja, wenn der dritte Winkel 0° ist, ist das erlaubt.', r'Nur bei gleichseitigen Dreiecken.'],
    [r'$90° + 90° = 180°$',
     r'Für den dritten Winkel bliebe nichts übrig.',
     r'Die beiden Seiten wären parallel und würden sich nie treffen: kein Dreieck.'])

Q.q(r'Kann ein Dreieck zwei stumpfe Winkel haben?',
    [r'Nein, zwei stumpfe Winkel sind zusammen schon mehr als 180°.', r'Ja, wenn der dritte Winkel klein genug ist.',
     r'Ja, bei stumpfwinkligen Dreiecken.', r'Nur bei gleichschenkligen Dreiecken.'],
    [r'Ein stumpfer Winkel ist größer als 90°.',
     r'Zwei davon ergeben mehr als 180°.',
     r'Das ist mehr als die ganze Winkelsumme: unmöglich.'])

Q.q(r'Welche Aussage stimmt?',
    [r'Jedes gleichseitige Dreieck ist auch gleichschenklig.', r'Jedes gleichschenklige Dreieck ist auch gleichseitig.',
     r'Ein gleichseitiges Dreieck kann rechtwinklig sein.', r'Ein rechtwinkliges Dreieck kann nie gleichschenklig sein.'],
    [r'Gleichschenklig heißt: mindestens zwei Seiten sind gleich lang.',
     r'Beim gleichseitigen Dreieck sind es sogar drei.',
     r'Die gleichseitigen Dreiecke sind eine Teilmenge der gleichschenkligen. (Ein 45°–45°–90°-Dreieck ist rechtwinklig und gleichschenklig.)'])

# ------------------------------------------------------------ angle sum, more ----
Q.q(r'In einem Dreieck stehen die Winkel im Verhältnis $\alpha : \beta : \gamma = 1 : 2 : 3$. Wie groß ist $\gamma$?',
    [r'90°', r'60°', r'30°', r'120°'],
    [r'Zusammen sind es $1 + 2 + 3 = 6$ Teile.',
     r'Ein Teil: $180° : 6 = 30°$',
     r'$\gamma = 3 \cdot 30° = 90°$'])

Q.q(r'Ein gleichschenkliges Dreieck hat an der Spitze einen Winkel von 50°. Wie groß ist jeder Basiswinkel?',
    [r'65°', r'130°', r'50°', r'75°'],
    [r'Für die beiden Basiswinkel bleiben $180° - 50° = 130°$.',
     r'Sie sind gleich groß.',
     r'$130° : 2 = 65°$'])

Q.q(r'In einem Dreieck ist $\alpha = 47°$ und $\beta$ ist doppelt so groß wie $\alpha$. Wie groß ist $\gamma$?',
    [r'39°', r'86°', r'94°', r'43°'],
    [r'$\beta = 2 \cdot 47° = 94°$',
     r'$\alpha + \beta = 141°$',
     r'$\gamma = 180° - 141° = 39°$'])

Q.q(r'Im Dreieck sind $\overline{AC}$ und $\overline{BC}$ gleich lang. Wie groß ist der Winkel $\gamma$ an der Spitze?',
    [r'36°', r'72°', r'108°', r'54°'],
    [r'Das Dreieck ist gleichschenklig mit der Basis $\overline{AB}$.',
     r'Also sind beide Basiswinkel 72° groß: zusammen 144°.',
     r'$\gamma = 180° - 144° = 36°$'],
    fig=vieleck(tri(72, 72, 4), names=ABC, angles=[(0, '72°'), (2, 'γ')]),
    figcap=r'Gleichschenkliges Dreieck ABC')

Q.q(r'Lina misst in einem Dreieck die Winkel 58°, 64° und 62°. Was stimmt?',
    [r'Sie hat sich vermessen, die Summe ist 184°.', r'Alles stimmt, das Dreieck ist spitzwinklig.',
     r'Das Dreieck ist gleichschenklig.', r'Das Dreieck ist stumpfwinklig.'],
    [r'$58° + 64° + 62° = 184°$',
     r'Die Winkelsumme im Dreieck muss genau 180° sein.',
     r'Mindestens eine Messung ist also ungenau.'])

Q.q(r'Mit welcher Hilfslinie zeigt man, dass die Innenwinkel eines Dreiecks zusammen 180° ergeben?',
    [r'mit einer Parallelen zu einer Seite durch die gegenüberliegende Ecke',
     r'mit einer zweiten, gleich großen Dreiecksseite', r'mit einem Kreis um eine Ecke', r'mit einer Diagonalen'],
    [r'Zeichne durch $C$ die Parallele zu $\overline{AB}$.',
     r'An der Parallelen entstehen Wechselwinkel zu $\alpha$ und $\beta$.',
     r'$\alpha$, $\gamma$ und $\beta$ liegen dort zusammen an einer Geraden: 180°.'])

Q.q(r'Zerlegt man ein Viereck durch eine Diagonale in zwei Dreiecke, kann man seine Winkelsumme bestimmen. Wie groß ist sie?',
    [r'360°', r'180°', r'270°', r'720°'],
    [r'Jedes der zwei Dreiecke hat die Winkelsumme 180°.',
     r'Zusammen bilden ihre Winkel genau die Winkel des Vierecks.',
     r'$2 \cdot 180° = 360°$'])

Q.q(r'Ein Dachgiebel ist ein gleichschenkliges Dreieck. Die Dachflächen sind um 45° geneigt (Basiswinkel). Wie groß ist der Winkel am First?',
    [r'90°', r'45°', r'135°', r'60°'],
    [r'Zwei Basiswinkel: $2 \cdot 45° = 90°$',
     r'Für den First bleiben $180° - 90°$.',
     r'$= 90°$, ein rechter Winkel.'])


def check():
    for a, b in ((50, 60), (90, 55), (72, 72)):
        p = tri(a, b)
        ang = lambda u, v, w: math.degrees(math.acos(((v[0]-u[0])*(w[0]-u[0]) + (v[1]-u[1])*(w[1]-u[1])) /
                                                    (math.dist(u, v) * math.dist(u, w))))
        assert abs(ang(p[0], p[1], p[2]) - a) < 1e-9 and abs(ang(p[1], p[0], p[2]) - b) < 1e-9
    assert 180 - 50 - 60 == 70 and 180 - 90 - 35 == 55
    assert 180 - 2 * 40 == 100 and 180 / 3 == 60
    assert max(30, 60, 90) == 90 and max(20, 40, 120) > 90 and max(50, 60, 70) < 90
    assert 90 + 90 == 180 and 91 + 91 > 180
    assert 3 * 180 / 6 == 90
    assert (180 - 50) / 2 == 65
    assert 180 - 47 - 2 * 47 == 39
    assert 180 - 2 * 72 == 36
    assert 58 + 64 + 62 == 184
    assert 2 * 180 == 360 and 180 - 2 * 45 == 90


Q.verify(check)
Q.save()
