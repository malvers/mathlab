#!/usr/bin/env python3
"""Exercises OS Mathe 6, week 35 / KW 21 (LB 5): "if - then" and "the more - the more"
statements about assignments and figures, converse and counterexample, presenting figures
and solids in the environment, packaging. Plan: HTML/svp/mathe/mathe6.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from fractions import Fraction as F
from quiz import os6

Q = os6(nr=35, slug='wenn-dann-je-desto', thema='Wenn–dann, je–desto und Präsentation', lb='LB 5',
        blurb='Aussagen über Zuordnungen und Figuren, Umkehrung, Gegenbeispiel, Formen in der Umwelt',
        comment='Blocks: je-desto (1-2, 8-9, 11-12), wenn-dann, converse, counterexample (3-7, 10, 19), shapes and presentation (13-18, 20).')

# ------------------------------------------------------------------ je-desto ----
Q.q(r'Welche Aussage beschreibt eine indirekt proportionale Zuordnung?',
    [r'Je mehr Personen mithelfen, desto kürzer dauert die Arbeit.', r'Je mehr Hefte man kauft, desto mehr bezahlt man.',
     r'Je länger man wandert, desto weiter kommt man.', r'Je größer ein Quadrat ist, desto größer ist sein Umfang.'],
    [r'Indirekt proportional: mehr auf der einen Seite, weniger auf der anderen.',
     r'Doppelt so viele Personen brauchen nur halb so lange.',
     r'Die anderen drei Aussagen sind „je mehr, desto mehr“.'])

Q.q(r'Ein Auto fährt gleichmäßig. Welche Aussage über „Fahrzeit → Weg“ ist am genauesten?',
    [r'Je länger es fährt, desto weiter kommt es – doppelte Zeit, doppelter Weg.', r'Je länger es fährt, desto langsamer wird es.',
     r'Je länger es fährt, desto kürzer wird der Weg.', r'Fahrzeit und Weg haben nichts miteinander zu tun.'],
    [r'Bei gleichem Tempo ist die Zuordnung direkt proportional.',
     r'„Je – desto“ allein sagt nur, dass beides wächst.',
     r'Der Zusatz „doppelte Zeit, doppelter Weg“ macht die Proportionalität deutlich.'])

Q.q(r'Die Seite eines Quadrats wird verdoppelt. Welche Aussage stimmt?',
    [r'Der Umfang verdoppelt sich, der Flächeninhalt vervierfacht sich.', r'Umfang und Flächeninhalt verdoppeln sich.',
     r'Der Umfang vervierfacht sich, der Flächeninhalt verdoppelt sich.', r'Beide bleiben gleich.'],
    [r'Seite 3 cm: Umfang 12 cm, Flächeninhalt 9 cm².',
     r'Seite 6 cm: Umfang 24 cm, Flächeninhalt 36 cm².',
     r'Seite → Umfang ist direkt proportional, Seite → Flächeninhalt nicht.'])

Q.q(r'Bei Brüchen mit gleichem Zähler gilt: Je größer der Nenner, desto …',
    [r'kleiner der Bruch.', r'größer der Bruch.', r'gleich bleibt der Bruch.', r'größer der Zähler.'],
    [r'Vergleiche $\dfrac{1}{2}$, $\dfrac{1}{3}$, $\dfrac{1}{10}$.',
     r'Je mehr Teile, desto kleiner ist jedes Teil.',
     r'Also: je größer der Nenner, desto kleiner der Bruch.'])

Q.q(r'Prismen mit gleicher Grundfläche: Je höher das Prisma, desto größer das Volumen. Welche Art von Zuordnung ist „Höhe → Volumen“?',
    [r'direkt proportional', r'indirekt proportional', r'nicht proportional', r'mehrdeutig'],
    [r'$V = G \cdot h$ mit festem $G$.',
     r'Doppelte Höhe, doppeltes Volumen.',
     r'Also direkt proportional mit dem Faktor $G$.'])

Q.q(r'Tim sagt: „Je älter ein Mensch, desto größer ist er.“ Was stimmt?',
    [r'Das stimmt nur bis zum Ende des Wachstums.', r'Das stimmt immer.', r'Das ist indirekt proportional.',
     r'Das ist direkt proportional.'],
    [r'Bis etwa zum 18. Lebensjahr wächst man meistens.',
     r'Danach bleibt die Größe ungefähr gleich, im Alter schrumpft man sogar etwas.',
     r'„Je – desto“-Aussagen gelten oft nur in einem Bereich.'])

# ------------------------------------------- wenn-dann, converse, counterexample ----
Q.q(r'„Wenn ein Viereck ein Quadrat ist, dann ist es auch …“ Welche Ergänzung ist richtig?',
    [r'ein Rechteck.', r'ein Trapez ohne rechte Winkel.', r'ein Dreieck.', r'ein Drachenviereck mit vier verschiedenen Seiten.'],
    [r'Ein Quadrat hat vier rechte Winkel.',
     r'Das reicht schon für ein Rechteck.',
     r'Jedes Quadrat ist also ein Rechteck.'])

Q.q(r'Ist die Umkehrung wahr: „Wenn ein Viereck ein Rechteck ist, dann ist es ein Quadrat“?',
    [r'Nein, ein Rechteck mit 6 cm × 3 cm ist kein Quadrat.', r'Ja, immer.',
     r'Ja, weil beide vier Ecken haben.', r'Nein, weil Rechtecke keine rechten Winkel haben.'],
    [r'Die Umkehrung vertauscht „wenn“ und „dann“.',
     r'Ein Gegenbeispiel reicht, um eine Aussage zu widerlegen.',
     r'6 cm × 3 cm: vier rechte Winkel, aber nicht vier gleiche Seiten.'])

Q.q(r'„Wenn eine Zahl durch 4 teilbar ist, dann ist sie auch durch 2 teilbar.“ Was stimmt?',
    [r'Die Aussage ist wahr, die Umkehrung ist falsch.', r'Die Aussage und die Umkehrung sind wahr.',
     r'Die Aussage ist falsch.', r'Beide sind falsch.'],
    [r'$4 = 2 \cdot 2$: Jedes Vielfache von 4 ist auch ein Vielfaches von 2.',
     r'Umkehrung: „Wenn durch 2 teilbar, dann durch 4 teilbar.“',
     r'Gegenbeispiel 6: durch 2 teilbar, aber nicht durch 4.'])

Q.q(r'Welche Zahl ist ein Gegenbeispiel zu „Jede ungerade Zahl ist eine Primzahl“?',
    [r'9', r'7', r'2', r'13'],
    [r'Gesucht ist eine ungerade Zahl, die keine Primzahl ist.',
     r'$9 = 3 \cdot 3$',
     r'9 ist ungerade, aber keine Primzahl – die Aussage ist falsch.'])

Q.q(r'„Wenn ein Dreieck zwei gleich große Winkel hat, dann ist es …“',
    [r'gleichschenklig.', r'rechtwinklig.', r'stumpfwinklig.', r'unmöglich.'],
    [r'Gleich große Winkel liegen gleich langen Seiten gegenüber.',
     r'Also hat das Dreieck zwei gleich lange Seiten.',
     r'Es ist gleichschenklig.'])

Q.q(r'Wenn man eine positive Zahl mit einer Zahl zwischen 0 und 1 multipliziert, dann …',
    [r'wird das Ergebnis kleiner als die Zahl.', r'wird das Ergebnis größer.', r'bleibt die Zahl gleich.', r'ist das Ergebnis immer 0.'],
    [r'$8 \cdot 0{,}5 = 4$, $8 \cdot \dfrac{3}{4} = 6$',
     r'Man nimmt nur einen Teil der Zahl.',
     r'Das Ergebnis ist kleiner.'])

Q.q(r'„Wenn es regnet, ist die Straße nass.“ Die Straße ist nass. Folgt daraus, dass es regnet?',
    [r'Nein, die Straße kann auch aus einem anderen Grund nass sein.', r'Ja, immer.',
     r'Ja, weil Regen nass macht.', r'Nein, weil Straßen nie nass sind.'],
    [r'Die Aussage sagt nur, was bei Regen passiert.',
     r'Eine Kehrmaschine oder ein Rasensprenger macht die Straße auch nass.',
     r'Aus der Folge kann man nicht auf den Grund schließen.'])

# ------------------------------------------------- shapes and presentation ----
Q.q(r'Welche Form haben die großen Pyramiden von Gizeh in Ägypten?',
    [r'Pyramiden mit quadratischer Grundfläche', r'Kegel', r'Dreiecksprismen', r'Pyramiden mit dreieckiger Grundfläche'],
    [r'Von oben sieht man ein Quadrat.',
     r'Vier dreieckige Seitenflächen treffen sich in der Spitze.',
     r'Also quadratische Pyramiden.'])

Q.q(r'Ein klassischer Fußball ist aus Fünfecken und Sechsecken genäht. Wie viele Fünfecke sind es?',
    [r'12', r'20', r'6', r'32'],
    [r'Die schwarzen Flächen sind Fünfecke, die weißen Sechsecke.',
     r'Es sind 12 Fünfecke und 20 Sechsecke.',
     r'Zusammen 32 Flächen – ein abgestumpftes Ikosaeder.'])

Q.q(r'Bienenwaben bestehen aus Sechsecken. Schon Pappos von Alexandria (um 300) vermutete, warum; bewiesen hat es Thomas Hales 1999. Was ist der Grund?',
    [r'Sechsecke füllen die Fläche lückenlos und brauchen dabei am wenigsten Wand.',
     r'Sechsecke sind die einzigen Vielecke mit sechs Ecken.', r'Bienen können nur bis sechs zählen.',
     r'Kreise würden noch weniger Wachs brauchen und passen lückenlos.'],
    [r'Lückenlos passen nur gleichseitige Dreiecke, Quadrate und Sechsecke.',
     r'Von diesen hat das Sechseck bei gleicher Fläche den kleinsten Umfang.',
     r'Kreise lassen Lücken. Die Bienen sparen also Wachs.'])

Q.q(r'Welche Verpackung für 1 Liter braucht weniger Material: ein Würfel mit 10 cm Kante oder ein Quader mit 20 cm × 10 cm × 5 cm?',
    [r'der Würfel (600 cm² statt 700 cm²)', r'der Quader (500 cm² statt 600 cm²)', r'beide gleich viel', r'Das kann man nicht berechnen.'],
    [r'Beide fassen $1000$ cm³ = 1 Liter.',
     r'Würfel: $6 \cdot 10 \cdot 10 = 600$ cm². Quader: $2 \cdot (200 + 100 + 50) = 700$ cm².',
     r'Der Würfel spart Material – gut für die Umwelt.'])

Q.q(r'Was gehört NICHT auf ein gutes Plakat zur Präsentation?',
    [r'möglichst viel kleiner Text', r'eine große, gut lesbare Überschrift', r'Bilder und Skizzen', r'die Quellen der Bilder'],
    [r'Ein Plakat wird aus einigen Metern Entfernung gelesen.',
     r'Wenig Text, große Schrift und klare Bilder helfen dabei.',
     r'Lange Texte in kleiner Schrift liest niemand.'])

Q.q(r'Du verwendest für deine Präsentation ein Foto aus dem Internet. Was ist wichtig?',
    [r'die Quelle angeben und prüfen, ob man das Bild verwenden darf', r'das Foto ohne Angabe benutzen',
     r'das Foto möglichst klein machen', r'den Namen des Fotos ändern'],
    [r'Bilder gehören denen, die sie gemacht haben.',
     r'Man darf sie nicht einfach als eigene ausgeben.',
     r'Quelle angeben – und Bilder mit freier Lizenz bevorzugen.'])

Q.q(r'Welche Fliesen kann man NICHT lückenlos auf einem Boden verlegen, wenn alle Fliesen gleich sind?',
    [r'regelmäßige Fünfecke', r'Quadrate', r'gleichseitige Dreiecke', r'regelmäßige Sechsecke'],
    [r'Um einen Punkt herum müssen die Winkel genau 360° ergeben.',
     r'Quadrat 90° (4 ·), Dreieck 60° (6 ·), Sechseck 120° (3 ·) – passt.',
     r'Fünfeck 108°: 3 · 108° = 324°, 4 · 108° = 432° – es bleibt eine Lücke oder es überlappt.'])


def check():
    assert (4 * 3, 3 * 3) == (12, 9) and (4 * 6, 6 * 6) == (24, 36) and 24 == 2 * 12 and 36 == 4 * 9
    assert F(1, 2) > F(1, 3) > F(1, 10)
    assert 8 * F(1, 2) == 4 and 8 * F(3, 4) == 6
    assert all(n % 2 == 0 for n in range(0, 100, 4)) and 6 % 2 == 0 and 6 % 4 != 0
    assert 9 % 2 == 1 and 9 % 3 == 0
    assert 6 * 10 * 10 == 600 and 2 * (20 * 10 + 20 * 5 + 10 * 5) == 700 and 20 * 10 * 5 == 1000
    inner = lambda n: F(180 * (n - 2), n)
    assert inner(3) * 6 == 360 and inner(4) * 4 == 360 and inner(6) * 3 == 360
    assert inner(5) == 108 and 3 * 108 < 360 < 4 * 108
    assert 12 + 20 == 32 and 60 - 90 + 32 == 2


Q.verify(check)
Q.save()
