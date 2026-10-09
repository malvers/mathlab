#!/usr/bin/env python3
"""Exercises GY Mathe 11 GK, week 27 / KW 12 (LB 3): relative position of two lines - parallel,
identical, intersecting, skew; intersection points. Plan: HTML/svp/mathe/mathegy11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import gy11, vec


def line(name, p, u, par='t'):
    return name + r'\colon \vec{x} = ' + vec(*p) + ' + ' + par + r' \cdot ' + vec(*u)


Q = gy11(nr=27, slug='lage-geraden', thema='Lagebeziehungen von Geraden', lb='LB 3',
         blurb='parallel, identisch, schneidend, windschief; Schnittpunkte',
         comment='Blocks: the four cases (1-4), parallel or identical (5-7), intersecting or skew (8-14), method and context (15-20).')

# --------------------------------------------------------------- four cases ----
Q.q(r'Welche Lagebeziehungen können zwei Geraden im Raum haben?',
    [r'identisch, parallel, schneidend, windschief', r'nur parallel oder schneidend', r'identisch, parallel, senkrecht', r'schneidend oder windschief'],
    [r'In der Ebene gibt es nur drei Fälle.',
     r'Im Raum kommt „windschief“ hinzu.'])

Q.q(r'Was bedeutet „windschief“?',
    [r'Die Geraden sind nicht parallel und haben keinen gemeinsamen Punkt.', r'Die Geraden schneiden sich unter einem spitzen Winkel.',
     r'Die Geraden sind parallel, aber verschieden.', r'Die Geraden sind identisch.'],
    [r'Sie „gehen aneinander vorbei“, wie zwei Straßen auf verschiedenen Ebenen einer Kreuzung.'])

Q.q(r'Gibt es windschiefe Geraden in der Ebene?',
    [r'Nein, zwei nicht parallele Geraden in der Ebene schneiden sich immer.', r'Ja, immer wenn sie verschiedene Anstiege haben.',
     r'Ja, wenn sie senkrecht sind.', r'Nur bei Geraden durch den Ursprung.'],
    [r'Windschiefe Geraden brauchen die dritte Dimension.'])

Q.q(r'Am Würfel: Welche zwei Kanten sind windschief?',
    [r'Eine Kante der Grundfläche und eine nicht parallele Kante der Deckfläche', r'Zwei gegenüberliegende Kanten der Grundfläche',
     r'Zwei Kanten mit gemeinsamer Ecke', r'Zwei senkrechte Kanten'],
    [r'Kanten der Grund- und der Deckfläche liegen in parallelen Ebenen und treffen sich nie.',
     r'Sind sie nicht parallel, sind sie windschief.'])

# ---------------------------------------------------- parallel or identical ----
Q.q(r'Was zeigt man zuerst, um die Lage zweier Geraden zu bestimmen?',
    [r'Ob die Richtungsvektoren Vielfache voneinander sind.', r'Ob die Stützvektoren gleich sind.',
     r'Ob die Geraden durch den Ursprung gehen.', r'Ob die Richtungsvektoren gleich lang sind.'],
    [r'Kollineare Richtungsvektoren: parallel oder identisch.',
     r'Sonst: schneidend oder windschief.'])

Q.q(r'Wie liegen $' + line('g', (1, 0, 0), (1, 1, 0)) + '$ und $' + line('h', (0, 1, 0), (2, 2, 0), 's') + '$?',
    [r'Parallel und verschieden', r'Identisch', r'Schneidend', r'Windschief'],
    [r'$' + vec(2, 2, 0) + r' = 2 \cdot ' + vec(1, 1, 0) + '$: parallel oder identisch.',
     r'Liegt $(0 \mid 1 \mid 0)$ auf $g$? Aus $x$: $t = -1$, dann $y = -1 \neq 1$. Nein, also parallel.'])

Q.q(r'Wie liegen $' + line('g', (1, 0, 2), (2, 1, 0)) + '$ und $' + line('h', (3, 1, 2), (4, 2, 0), 's') + '$?',
    [r'Identisch', r'Parallel und verschieden', r'Schneidend', r'Windschief'],
    [r'Die Richtungsvektoren sind kollinear.',
     r'$(3 \mid 1 \mid 2)$ liegt auf $g$ für $t = 1$: identisch.'])

# --------------------------------------------------- intersecting or skew ----
Q.q(r'Bestimme den Schnittpunkt von $' + line('g', (1, 1, 0), (1, 0, 1)) + '$ und $' + line('h', (2, 0, 1), (0, 1, 0), 's') + '$.',
    [r'$S(2 \mid 1 \mid 1)$', r'$S(1 \mid 1 \mid 0)$', r'$S(2 \mid 0 \mid 1)$', r'Sie schneiden sich nicht.'],
    [r'Gleichsetzen: $1 + t = 2$, $1 = s$, $t = 1$.',
     r'Alle drei Gleichungen passen mit $t = 1$, $s = 1$.',
     r'Einsetzen in $g$: $(2 \mid 1 \mid 1)$.'])

Q.q(r'Bestimme den Schnittpunkt von $' + line('g', (0, 0, 0), (1, 2, 3)) + '$ und $' + line('h', (2, 0, 0), (-1, 2, 3), 's') + '$.',
    [r'$S(1 \mid 2 \mid 3)$', r'$S(2 \mid 0 \mid 0)$', r'$S(0 \mid 0 \mid 0)$', r'Sie schneiden sich nicht.'],
    [r'$t = 2 - s$, $2t = 2s$, $3t = 3s$.',
     r'Aus der zweiten: $t = s$, also $t = s = 1$; die dritte passt.'])

Q.q(r'Wie liegen $' + line('g', (1, 2, 0), (1, 0, 1)) + '$ und $' + line('h', (3, 0, 4), (0, 1, 1), 's') + '$?',
    [r'Windschief', r'Schneidend', r'Parallel', r'Identisch'],
    [r'Nicht kollinear. Gleichsetzen: $1 + t = 3$, also $t = 2$; $2 = s$; $t = 4 + s$.',
     r'Dritte Gleichung: $2 = 6$ ist falsch: kein Schnittpunkt.',
     r'Nicht parallel und kein Schnittpunkt: windschief.'])

Q.q(r'Bestimme den Schnittpunkt von $' + line('g', (1, 2, 3), (1, 0, 0)) + '$ und $' + line('h', (0, 2, 3), (0, 1, 0), 's') + '$.',
    [r'$S(0 \mid 2 \mid 3)$', r'$S(1 \mid 2 \mid 3)$', r'$S(1 \mid 3 \mid 3)$', r'Sie schneiden sich nicht.'],
    [r'$1 + t = 0$, $2 = 2 + s$, $3 = 3$',
     r'$t = -1$, $s = 0$: Schnittpunkt ist der Stützpunkt von $h$.'])

Q.q(r'Beim Gleichsetzen zweier Geraden entstehen drei Gleichungen für zwei Unbekannte. Was ist zu tun?',
    [r'Mit zwei Gleichungen $t$ und $s$ bestimmen und die dritte prüfen.', r'Eine Gleichung weglassen.',
     r'Das System ist immer unlösbar.', r'Eine dritte Unbekannte einführen.'],
    [r'Erfüllt die Lösung auch die dritte Gleichung: Schnittpunkt.',
     r'Sonst: kein gemeinsamer Punkt.'])

Q.q(r'Für welches $a$ schneiden sich $' + line('g', (0, 0, 0), (1, 1, 0)) + '$ und $' + line('h', (2, 0, 'a'), (0, 1, 0), 's') + '$?',
    [r'$a = 0$', r'$a = 2$', r'$a = 1$', r'Für jedes $a$'],
    [r'$t = 2$, $t = s$, $0 = a$.',
     r'Nur für $a = 0$ ist die dritte Gleichung erfüllbar.'])

Q.q(r'Das Gleichungssystem beim Gleichsetzen zweier nicht paralleler Geraden hat keine Lösung. Wie liegen die Geraden?',
    [r'Windschief', r'Parallel', r'Identisch', r'Schneidend'],
    [r'Nicht parallel schließt parallel und identisch aus.',
     r'Kein gemeinsamer Punkt schließt schneidend aus.'])

# -------------------------------------------------------- method and context ----
Q.q(r'Zwei parallele, verschiedene Geraden werden gleichgesetzt. Was ergibt das Gleichungssystem?',
    [r'Keine Lösung', r'Genau eine Lösung', r'Unendlich viele Lösungen', r'Die Lösung $t = s = 0$'],
    [r'Parallele verschiedene Geraden haben keinen gemeinsamen Punkt.'])

Q.q(r'Zwei identische Geraden werden gleichgesetzt. Was ergibt das Gleichungssystem?',
    [r'Unendlich viele Lösungen', r'Keine Lösung', r'Genau eine Lösung', r'Einen Widerspruch'],
    [r'Jeder Punkt ist gemeinsam.'])

Q.q(r'Sind $' + vec(2, -4, 6) + '$ und $' + vec(-1, 2, -3) + '$ kollinear?',
    [r'Ja, der erste ist das $(-2)$-Fache des zweiten.', r'Nein, die Vorzeichen sind verschieden.',
     r'Ja, aber nur in der $xy$-Ebene.', r'Nein, sie sind verschieden lang.'],
    [r'$-2 \cdot (-1) = 2$, $-2 \cdot 2 = -4$, $-2 \cdot (-3) = 6$',
     r'Entgegengesetzte Richtung ist ebenfalls kollinear.'])

Q.q(r'Zwei Flugzeuge fliegen auf windschiefen Bahnen. Was folgt?',
    [r'Sie können nicht zusammenstoßen, weil sich die Bahnen nicht treffen.', r'Sie stoßen sicher zusammen.',
     r'Sie stoßen zusammen, wenn sie gleich schnell sind.', r'Ihre Bahnen sind parallel.'],
    [r'Windschiefe Bahnen haben keinen gemeinsamen Punkt.'])

Q.q(r'Zwei Flugzeuge fliegen auf Bahnen, die sich schneiden. Stoßen sie zusammen?',
    [r'Nur wenn beide zur selben Zeit im Schnittpunkt sind.', r'Ja, immer.', r'Nein, nie.', r'Nur wenn die Bahnen senkrecht sind.'],
    [r'Der Bahnparameter ist die Zeit.',
     r'Kollision nur, wenn im Schnittpunkt $t = s$ gilt.'])

Q.q(r'Welcher Ablauf entscheidet die Lage zweier Geraden vollständig?',
    [r'Richtungsvektoren kollinear? Ja: Punktprobe (identisch/parallel). Nein: Gleichsetzen (schneidend/windschief).',
     r'Nur Stützvektoren vergleichen.', r'Nur gleichsetzen und die Zahl der Lösungen zählen, ohne Richtungsvektoren.', r'Die Längen der Richtungsvektoren vergleichen.'],
    [r'Zwei Fragen genügen: Sind sie parallel? Haben sie gemeinsame Punkte?'])


def check():
    import sympy as sp
    V = lambda *c: sp.Matrix(c)
    t, s, a = sp.symbols('t s a')
    meet = lambda p, u, q, v: sp.solve(list(V(*p) + t * V(*u) - V(*q) - s * V(*v)), [t, s], dict=True)
    assert V(2, 2, 0) == 2 * V(1, 1, 0) and sp.solve(list(V(1, 0, 0) + t * V(1, 1, 0) - V(0, 1, 0)), t) == []
    assert V(4, 2, 0) == 2 * V(2, 1, 0) and V(1, 0, 2) + 1 * V(2, 1, 0) == V(3, 1, 2)
    m = meet((1, 1, 0), (1, 0, 1), (2, 0, 1), (0, 1, 0))
    assert m == [{t: 1, s: 1}] and V(1, 1, 0) + V(1, 0, 1) == V(2, 1, 1)
    m = meet((0, 0, 0), (1, 2, 3), (2, 0, 0), (-1, 2, 3))
    assert m == [{t: 1, s: 1}]
    assert meet((1, 2, 0), (1, 0, 1), (3, 0, 4), (0, 1, 1)) == []
    m = meet((1, 2, 3), (1, 0, 0), (0, 2, 3), (0, 1, 0))
    assert m == [{t: -1, s: 0}]
    eqs = list(t * V(1, 1, 0) - V(2, 0, a) - s * V(0, 1, 0))
    assert sp.solve(eqs, [t, s, a]) == {t: 2, s: 2, a: 0}
    assert V(2, -4, 6) == -2 * V(-1, 2, -3)


Q.verify(check)
Q.save()
