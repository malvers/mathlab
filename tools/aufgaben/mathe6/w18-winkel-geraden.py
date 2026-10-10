#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 18 / KW 1 (LB 3): angles at intersecting lines and at
parallels cut by a line - supplementary, vertical, corresponding, alternate angles.
Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os6
from osfig import geradenkreuz, parallelen

Q = os6(nr=18, slug='winkel-geraden', thema='Winkel an Geraden', lb='LB 3',
        blurb='Nebenwinkel, Scheitelwinkel, Stufenwinkel und Wechselwinkel',
        comment='Blocks: crossing lines (1-5, 12-16, 20), parallels (6-11, 17-19).')

# ----------------------------------------------------------- crossing lines ----
Q.q(r'Wie groß ist der Winkel $\beta$?',
    [r'130°', r'50°', r'40°', r'310°'],
    [r'$\beta$ und der 50°-Winkel liegen nebeneinander an einer Geraden: Nebenwinkel.',
     r'Nebenwinkel ergänzen sich zu 180°.',
     r'$\beta = 180° - 50° = 130°$'],
    fig=geradenkreuz(50, {0: '50°', 1: 'β'}), figcap=r'Zwei Geraden schneiden sich.')

Q.q(r'Wie groß ist der Winkel $\gamma$?',
    [r'70°', r'110°', r'20°', r'140°'],
    [r'$\gamma$ liegt dem 70°-Winkel genau gegenüber: Scheitelwinkel.',
     r'Scheitelwinkel sind gleich groß.',
     r'$\gamma = 70°$'],
    fig=geradenkreuz(70, {0: '70°', 2: 'γ'}), figcap=r'Zwei Geraden schneiden sich.')

Q.q(r'Zwei Geraden schneiden sich, ein Winkel misst 38°. Wie groß sind die anderen drei Winkel?',
    [r'142°, 38° und 142°', r'38°, 38° und 38°', r'52°, 38° und 52°', r'142°, 142° und 142°'],
    [r'Die beiden Nachbarn sind Nebenwinkel: $180° - 38° = 142°$.',
     r'Gegenüber liegt der Scheitelwinkel: 38°.',
     r'Probe: $38° + 142° + 38° + 142° = 360°$.'])

Q.q(r'Zu welcher Summe ergänzen sich Nebenwinkel?',
    [r'180°', r'90°', r'360°', r'Sie sind gleich groß.'],
    [r'Nebenwinkel liegen zusammen an einer Geraden.',
     r'Zusammen bilden sie einen gestreckten Winkel.',
     r'Ein gestreckter Winkel hat 180°.'])

Q.q(r'Ein Winkel ist dreimal so groß wie sein Nebenwinkel. Wie groß ist er?',
    [r'135°', r'45°', r'120°', r'60°'],
    [r'Nebenwinkel: 1 Teil, der Winkel: 3 Teile. Zusammen 4 Teile = 180°.',
     r'1 Teil: $180° : 4 = 45°$',
     r'Der Winkel: $3 \cdot 45° = 135°$'])

Q.q(r'Wie groß sind alle vier Winkel an einer Kreuzung zweier Geraden zusammen?',
    [r'360°', r'180°', r'90°', r'Das hängt vom Winkel ab.'],
    [r'Die vier Winkel füllen einmal ganz um den Schnittpunkt herum.',
     r'Das ist ein Vollwinkel.',
     r'Zusammen 360°, egal wie die Geraden liegen.'])

Q.q(r'Der Winkel $\angle ABC$ wird mit drei Punkten bezeichnet. Wo liegt sein Scheitel?',
    [r'im Punkt $B$', r'im Punkt $A$', r'im Punkt $C$', r'zwischen $A$ und $C$'],
    [r'Bei drei Buchstaben steht der Scheitel immer in der Mitte.',
     r'Die Schenkel gehen von $B$ durch $A$ und von $B$ durch $C$.',
     r'Der Scheitel ist $B$.'])

Q.q(r'Ein Winkel an einer Geradenkreuzung ist ein rechter Winkel. Was gilt für die anderen drei?',
    [r'Alle sind rechte Winkel.', r'Zwei sind spitz, einer ist recht.', r'Alle sind stumpf.', r'Sie haben zusammen 180°.'],
    [r'Nebenwinkel: $180° - 90° = 90°$.',
     r'Scheitelwinkel: ebenfalls 90°.',
     r'Die Geraden stehen senkrecht aufeinander: vier rechte Winkel.'])

Q.q(r'Warum sind Scheitelwinkel immer gleich groß?',
    [r'Beide ergänzen denselben Nebenwinkel zu 180°.', r'Weil sie nebeneinander liegen.',
     r'Weil alle Winkel an einer Kreuzung gleich groß sind.', r'Weil sie zusammen 180° ergeben.'],
    [r'Nennen wir die Scheitelwinkel $\alpha$ und $\gamma$, dazwischen liegt $\beta$.',
     r'$\alpha + \beta = 180°$ und $\gamma + \beta = 180°$.',
     r'Also muss $\alpha = \gamma$ sein – ein kleiner Beweis.'])

Q.q(r'Zwei Nebenwinkel unterscheiden sich um 40°. Wie groß ist der kleinere?',
    [r'70°', r'40°', r'110°', r'90°'],
    [r'Zusammen sind sie 180°, der größere ist 40° größer.',
     r'Ohne den Unterschied bleiben $180° - 40° = 140°$ für zwei gleiche Teile.',
     r'Der kleinere: $140° : 2 = 70°$, der größere 110°.'])

# ---------------------------------------------------------------- parallels ----
Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\alpha$?',
    [r'60°', r'120°', r'30°', r'90°'],
    [r'Die beiden Winkel liegen an den Parallelen in gleicher Lage: Stufenwinkel.',
     r'Stufenwinkel an geschnittenen Parallelen sind gleich groß.',
     r'$\alpha = 60°$'],
    fig=parallelen(60, {0: '60°'}, {0: 'α'}), figcap=r'g ist parallel zu h.')

Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\beta$?',
    [r'65°', r'115°', r'25°', r'130°'],
    [r'Beide Winkel liegen zwischen den Parallelen, aber auf verschiedenen Seiten der schneidenden Geraden.',
     r'Das sind Wechselwinkel. Wechselwinkel an geschnittenen Parallelen sind gleich groß.',
     r'$\beta = 65°$'],
    fig=parallelen(65, {2: '65°'}, {0: 'β'}), figcap=r'g ist parallel zu h.')

Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\delta$?',
    [r'70°', r'110°', r'20°', r'140°'],
    [r'Der Scheitelwinkel des 70°-Winkels liegt an $g$ links unten und ist ebenfalls 70° groß.',
     r'$\delta$ ist dessen Stufenwinkel an $h$.',
     r'$\delta = 70°$'],
    fig=parallelen(70, {0: '70°'}, {2: 'δ'}), figcap=r'g ist parallel zu h.')

Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\varepsilon$?',
    [r'110°', r'70°', r'20°', r'180°'],
    [r'Der Stufenwinkel des 70°-Winkels an $h$ liegt rechts oben und ist 70° groß.',
     r'$\varepsilon$ ist sein Nebenwinkel.',
     r'$\varepsilon = 180° - 70° = 110°$'],
    fig=parallelen(70, {0: '70°'}, {1: 'ε'}), figcap=r'g ist parallel zu h.')

Q.q(r'$g$ und $h$ sind parallel. Wie groß ist $\varphi$?',
    [r'50°', r'130°', r'40°', r'230°'],
    [r'Der Nebenwinkel des 130°-Winkels an $g$ (rechts oben) ist $180° - 130° = 50°$.',
     r'$\varphi$ ist sein Stufenwinkel an $h$.',
     r'$\varphi = 50°$'],
    fig=parallelen(50, {1: '130°'}, {0: 'φ'}), figcap=r'g ist parallel zu h.')

Q.q(r'Wie heißen zwei Winkel an geschnittenen Parallelen, die auf derselben Seite der schneidenden Geraden in gleicher Lage liegen?',
    [r'Stufenwinkel', r'Wechselwinkel', r'Scheitelwinkel', r'Nebenwinkel'],
    [r'Man kann den einen Winkel entlang der schneidenden Geraden auf den anderen verschieben.',
     r'Sie liegen wie Stufen einer Treppe übereinander.',
     r'Das sind Stufenwinkel.'])

Q.q(r'Wie heißen zwei Winkel, die zwischen den Parallelen auf verschiedenen Seiten der schneidenden Geraden liegen und gleich groß sind?',
    [r'Wechselwinkel', r'Stufenwinkel', r'Nebenwinkel', r'Scheitelwinkel'],
    [r'Sie wechseln die Seite der schneidenden Geraden.',
     r'Ihre Schenkel bilden ein „Z“.',
     r'Das sind Wechselwinkel.'])

Q.q(r'Ein Paar Stufenwinkel an den Geraden $g$ und $h$ misst 72° und 75°. Was folgt daraus?',
    [r'$g$ und $h$ sind nicht parallel.', r'$g$ und $h$ sind parallel.',
     r'Man hat falsch gemessen, Stufenwinkel sind immer gleich.', r'Die Winkel sind Nebenwinkel.'],
    [r'Stufenwinkel sind nur an geschnittenen Parallelen gleich groß.',
     r'Hier sind sie verschieden.',
     r'Also können $g$ und $h$ nicht parallel sein – sie schneiden sich irgendwo.'])

Q.q(r'Mit einer Geometriesoftware zieht Ali an der schneidenden Geraden durch zwei Parallelen. Was bleibt immer gleich?',
    [r'Ein Winkel und sein Stufenwinkel sind immer gleich groß.', r'Alle Winkel bleiben immer 60°.',
     r'Nebenwinkel bleiben immer gleich groß.', r'Gar nichts, alles ändert sich.'],
    [r'Beim Ziehen ändern sich die Winkelgrößen.',
     r'Die Beziehungen bleiben aber: Stufenwinkel gleich, Wechselwinkel gleich, Nebenwinkel zusammen 180°.',
     r'So entdeckt man eine Vermutung, die man dann begründet.'])

Q.q(r'Ein gerades Bahngleis kreuzt zwei parallele Straßen. An der ersten Straße beträgt der spitze Winkel 40°. Wie groß ist der spitze Winkel an der zweiten Straße?',
    [r'40°', r'140°', r'50°', r'80°'],
    [r'Die Straßen sind die Parallelen, das Gleis ist die schneidende Gerade.',
     r'Der spitze Winkel an der zweiten Straße ist ein Stufenwinkel.',
     r'Er ist ebenfalls 40° groß.'])


def check():
    assert 180 - 50 == 130
    assert 70 == 70 and 180 - 38 == 142 and 38 + 142 + 38 + 142 == 360
    assert 3 * (180 / 4) == 135
    assert 180 - 90 == 90
    assert (180 - 40) / 2 == 70 and 70 + 40 == 110
    a = 70
    top = {0: a, 1: 180 - a, 2: a, 3: 180 - a}
    bottom = dict(top)
    assert bottom[2] == 70 and bottom[1] == 110
    a = 65
    assert {0: a, 2: a}[2] == {0: a, 2: a}[0] == 65
    assert 72 != 75
    assert 180 - 130 == 50


Q.verify(check)
Q.save()
