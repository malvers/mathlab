#!/usr/bin/env python3
"""Training sheet 2 of 2, Gymnasium class 10: sine function - solutions, graphs, models.
Built for a pupil's error pattern (29.10.2026): missing second solution and + k*2pi, interval bounds
added to the angle, zeros of sin x taken for those of a shifted function, inner and outer shift
swapped, the midline read off at the minimum, the period of a Ferris wheel taken as 2 x top height,
"c = midpoint of lowest and highest point", zigzag instead of a wave, reasons without a counterexample.
No plan row: the sheet stands on its own (back='')."""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from quiz import Quiz  # noqa: E402
import svgfig as S  # noqa: E402

PI = math.pi

Q = Quiz(id='mathegy10-training-sinus-2',
         file='mathetestgy10-sinus-training-2.html',
         title='Aufgaben · Sinusfunktion: Lösungen, Graphen, Modelle',
         subtitle='Gymnasium · Klasse 10 · Training 2 von 2 · 20 Aufgaben: alle Lösungen, Lösungen im Intervall, '
                  'Nullstellen, Gleichung am Graphen, Riesenrad und Temperatur, Begründen · genau eine Antwort pro Aufgabe',
         dash_sub='Gymnasium · Klasse 10 · Training Sinus 2 · Live-Auswertung: anonyme Einzelscores + '
                  'Gruppenleistung pro Aufgabe',
         back='',
         comment='Blocks: all solutions (1-5), interval and zeros (6-9), graphs (10-13), Ferris wheel (14-17), '
                 'temperature (18), reasoning (19-20).')


# ------------------------------------------------------------- figures ----
def pi_ticks(p, ticks):
    ay = p.Y(0)
    for u, lab in ticks:
        p.line(p.X(u), ay - 3.5, p.X(u), ay + 3.5, S.INK, 1.1)
        p.text(p.X(u), ay + 17, lab, 12.5, S.MUTED, 'middle', family=S.MATH, halo=S.PAPER)


def fig_shifted():
    """y = sin(x - pi/2) + 2."""
    p = S.Plot((-PI - 0.3, 3 * PI + 0.4), (-0.6, 3.6), w=560, h=250, pad=(40, 22, 18, 34))
    p.grid(xstep=PI / 2, ystep=1)
    p.axes(xticks=False, ystep=1, origin=None, defer_labels=True)
    p.curve(lambda x: math.sin(x - PI / 2) + 2, -PI - 0.3, 3 * PI + 0.4, S.RED, 2.3)
    pi_ticks(p, [(-PI, '−π'), (-PI / 2, '−π/2'), (PI / 2, 'π/2'), (PI, 'π'), (3 * PI / 2, '3π/2'),
                 (2 * PI, '2π'), (5 * PI / 2, '5π/2'), (3 * PI, '3π')])
    p.draw_labels()
    return p.svg('Graph einer verschobenen Sinusfunktion')


def fig_period():
    """y = 3 sin(x / 2): maxima at pi and 5pi."""
    p = S.Plot((-0.5, 6 * PI + 0.6), (-3.6, 3.7), w=560, h=250, pad=(40, 22, 18, 34))
    p.grid(xstep=PI, ystep=1)
    p.axes(xticks=False, ystep=1, origin=None, defer_labels=True)
    p.curve(lambda x: 3 * math.sin(x / 2), -0.5, 6 * PI + 0.6, S.RED, 2.3)
    pi_ticks(p, [(k * PI, lab) for k, lab in
                 [(1, 'π'), (2, '2π'), (3, '3π'), (4, '4π'), (5, '5π'), (6, '6π')]])
    p.draw_labels()
    return p.svg('Graph einer gestreckten Sinusfunktion')


def fig_shapes():
    """A sine wave next to a zigzag through the same five points."""
    p = S.Plot((-0.3, 2 * PI + 0.4), (-1.4, 1.5), w=560, h=230, pad=(40, 22, 18, 34))
    p.axes(xticks=False, ystep=1, origin=None)
    pts = [(0, 0), (PI / 2, 1), (PI, 0), (3 * PI / 2, -1), (2 * PI, 0)]
    for a, b in zip(pts, pts[1:]):
        p.seg(a, b, S.MUTED, 1.8, dash='6 4')
    p.curve(math.sin, 0, 2 * PI, S.RED, 2.4)
    for u, v in pts:
        p.point(u, v, None, color=S.INK, size=3.6)
    pi_ticks(p, [(PI / 2, 'π/2'), (PI, 'π'), (3 * PI / 2, '3π/2'), (2 * PI, '2π')])
    p.legend(p.X(4.6), p.Y(1.35), [('Sinuskurve', S.RED, 'line'), ('Zickzack', S.MUTED, 'dash')])
    return p.svg('Sinuskurve und Zickzack durch dieselben Punkte')


# ------------------------------------------------------- all solutions ----
Q.q(r'Bestimme alle Lösungen von $\sin(x) = \dfrac{1}{2}$ ($k \in \mathbb{Z}$).',
    [r'$x = \dfrac{\pi}{6} + k \cdot 2\pi$ oder $x = \dfrac{5\pi}{6} + k \cdot 2\pi$',
     r'$x = \dfrac{\pi}{6} + k \cdot 2\pi$',
     r'$x = \dfrac{\pi}{6}$ oder $x = \dfrac{5\pi}{6}$',
     r'$x = \dfrac{\pi}{6} + k \cdot 2\pi$ oder $x = \dfrac{7\pi}{6} + k \cdot 2\pi$'],
    [r'Grundlösung aus der Tabelle: $\sin\left(\dfrac{\pi}{6}\right) = \dfrac{1}{2}$.',
     r'Zweite Lösung in derselben Runde: $\sin(\pi - x) = \sin(x)$, also $\pi - \dfrac{\pi}{6} = \dfrac{5\pi}{6}$.',
     r'Nach jeder ganzen Runde wiederholt sich alles: $+ k \cdot 2\pi$ an beide Lösungen.'])

Q.q(r'Welche Winkel im Intervall $[0;\,2\pi)$ erfüllen $\sin(x) = \dfrac{\sqrt{3}}{2}$?',
    [r'$\dfrac{\pi}{3}$ und $\dfrac{2\pi}{3}$', r'$\dfrac{\pi}{3}$ und $\dfrac{4\pi}{3}$',
     r'$\dfrac{\pi}{6}$ und $\dfrac{5\pi}{6}$', r'$\dfrac{\pi}{3}$ und $\dfrac{5\pi}{3}$'],
    [r'$\sin\left(\dfrac{\pi}{3}\right) = \dfrac{\sqrt{3}}{2}$ (Tabelle: $60^\circ$).',
     r'Zweite Lösung: $\pi - \dfrac{\pi}{3} = \dfrac{2\pi}{3}$. Beide liegen oben (1. und 2. Quadrant), wo der Sinus positiv ist.',
     r'$\dfrac{\pi}{6}$ und $\dfrac{5\pi}{6}$ gehören zu $\sin(x) = \dfrac{1}{2}$.'])

Q.q(r'Welche Winkel im Intervall $[0;\,2\pi)$ erfüllen $\sin(x) = -\dfrac{1}{2}$?',
    [r'$\dfrac{7\pi}{6}$ und $\dfrac{11\pi}{6}$', r'$\dfrac{\pi}{6}$ und $\dfrac{5\pi}{6}$',
     r'$\dfrac{5\pi}{6}$ und $\dfrac{7\pi}{6}$', r'$\dfrac{7\pi}{6}$ und $\dfrac{5\pi}{3}$'],
    [r'Negativer Sinus heißt: unten, also 3. und 4. Quadrant.',
     r'Bezugswinkel ist $\dfrac{\pi}{6}$, denn $\sin\left(\dfrac{\pi}{6}\right) = \dfrac{1}{2}$.',
     r'3. Quadrant: $\pi + \dfrac{\pi}{6} = \dfrac{7\pi}{6}$. 4. Quadrant: $2\pi - \dfrac{\pi}{6} = \dfrac{11\pi}{6}$.'])

Q.q(r'Welcher Winkel hat denselben Sinuswert wie $\dfrac{2\pi}{9}$?',
    [r'$\dfrac{7\pi}{9}$', r'$\dfrac{11\pi}{9}$', r'$-\dfrac{2\pi}{9}$', r'$\dfrac{16\pi}{9}$'],
    [r'Es gilt immer $\sin(\pi - x) = \sin(x)$: Die Sinuskurve ist symmetrisch zu $x = \dfrac{\pi}{2}$.',
     r'$\pi - \dfrac{2\pi}{9} = \dfrac{9\pi}{9} - \dfrac{2\pi}{9} = \dfrac{7\pi}{9}$.',
     r'$\dfrac{16\pi}{9} = 2\pi - \dfrac{2\pi}{9}$ hätte denselben Kosinuswert, aber den negativen Sinuswert.'])

Q.q(r'Wie viele Lösungen hat $\sin(x) = 1$ im Intervall $[0;\,2\pi]$?',
    [r'genau eine', r'genau zwei', r'genau drei', r'keine'],
    [r'$\sin(x) = 1$ heißt: ganz oben auf dem Einheitskreis, am Hochpunkt der Kurve.',
     r'Das ist nur bei $x = \dfrac{\pi}{2}$ der Fall. Die Gerade $y = 1$ berührt die Kurve dort nur.',
     r'Darum stimmt „jede Gleichung $\sin(x) = c$ hat genau zwei Lösungen“ nicht.'])

# ---------------------------------------------------- interval and zeros ----
Q.q(r'Welche Winkel im Intervall $[2\pi;\,4\pi]$ haben denselben Sinuswert wie $\dfrac{\pi}{4}$?',
    [r'$\dfrac{9\pi}{4}$ und $\dfrac{11\pi}{4}$', r'$\dfrac{9\pi}{4}$ und $\dfrac{17\pi}{4}$',
     r'$\dfrac{9\pi}{4}$ und $\dfrac{15\pi}{4}$', r'$\dfrac{3\pi}{4}$ und $\dfrac{9\pi}{4}$'],
    [r'Alles in Vierteln: Das Intervall geht von $\dfrac{8\pi}{4}$ bis $\dfrac{16\pi}{4}$, eine Runde ist $\dfrac{8\pi}{4}$.',
     r'Familie 1: $\dfrac{\pi}{4} + \dfrac{8\pi}{4} = \dfrac{9\pi}{4}$ passt, $\dfrac{17\pi}{4}$ ist schon zu groß.',
     r'Familie 2: $\pi - \dfrac{\pi}{4} = \dfrac{3\pi}{4}$ (zu klein), $+ \dfrac{8\pi}{4}$ ergibt $\dfrac{11\pi}{4}$ (passt).',
     r'Falle: Die Intervallgrenzen $2\pi$ und $4\pi$ nicht einfach addieren, verschoben wird nur um ganze Runden.'])

Q.q(r'Bestimme die Nullstellen von $g(x) = \sin\left(\dfrac{\pi}{2}(x - 1)\right)$ im Intervall $[0;\,5]$.',
    [r'$1$, $3$ und $5$', r'nur $\pi$', r'$1$ und $3$', r'$2$ und $4$'],
    [r'$\sin(z) = 0$ genau für $z = k\pi$. Hier ist $z$ die ganze Klammer: $\dfrac{\pi}{2}(x - 1) = k\pi$.',
     r'Durch $\pi$ teilen, mal 2: $x - 1 = 2k$, also $x = 1 + 2k$.',
     r'Im Intervall: $k = 0, 1, 2$ ergibt $x = 1, 3, 5$. Das $\pi$ ist die Nullstelle von $\sin(x)$, nicht von $g$.'])

Q.q(r'Welche Gleichung muss man lösen, um die Nullstellen von $f(x) = \sin\left(\dfrac{\pi}{4}(x + 2)\right)$ zu finden?',
    [r'$\dfrac{\pi}{4}(x + 2) = k\pi$', r'$x = k\pi$', r'$x + 2 = k\pi$', r'$\dfrac{\pi}{4} x = k\pi$'],
    [r'Der Sinus ist null, wenn sein ganzes Argument ein Vielfaches von $\pi$ ist.',
     r'Das Argument ist hier die ganze Klammer $\dfrac{\pi}{4}(x + 2)$.',
     r'Lösen ergibt $x + 2 = 4k$, also $x = 4k - 2$, zum Beispiel $-2$, $2$, $6$.'])

Q.q(r'Bestimme die kleinste positive Nullstelle von $f(x) = \sin\left(2\left(x - \dfrac{\pi}{6}\right)\right)$.',
    [r'$\dfrac{\pi}{6}$', r'$\dfrac{\pi}{2}$', r'$\pi$', r'$\dfrac{2\pi}{3}$'],
    [r'$2\left(x - \dfrac{\pi}{6}\right) = k\pi$, also $x - \dfrac{\pi}{6} = \dfrac{k\pi}{2}$ und $x = \dfrac{\pi}{6} + \dfrac{k\pi}{2}$.',
     r'$k = 0$ ergibt $\dfrac{\pi}{6}$, das ist positiv und die kleinste. ($k = 1$ ergibt $\dfrac{2\pi}{3}$, $k = -1$ ergibt $-\dfrac{\pi}{3}$.)'])

# --------------------------------------------------------------- graphs ----
Q.q(r'Welche Gleichung gehört zum abgebildeten Graphen?',
    [r'$y = \sin\left(x - \dfrac{\pi}{2}\right) + 2$', r'$y = \sin\left(x + \dfrac{\pi}{2}\right) + 2$',
     r'$y = \sin(x + 2) - \dfrac{\pi}{2}$', r'$y = \sin\left(x - \dfrac{\pi}{2}\right) + 1$'],
    [r'Mittellinie: $\dfrac{\text{Max} + \text{Min}}{2} = \dfrac{3 + 1}{2} = 2$, also $+2$ außen. Nicht am Tiefpunkt 1 ablesen.',
     r'Die Kurve schneidet die Mittellinie von unten nach oben bei $x = \dfrac{\pi}{2}$: Dort startet der Sinus.',
     r'Start um $\dfrac{\pi}{2}$ nach rechts verschoben, also $x - \dfrac{\pi}{2}$ innen. Innen links/rechts, außen oben/unten.'],
    fig=fig_shifted(), figcap=r'Graph zu Aufgabe 10')

Q.q(r'Lies am Graphen der Funktion $f(x) = 3 \sin(b x)$ die Periodenlänge $p$ ab und bestimme $b$.',
    [r'$p = 4\pi$, $b = \dfrac{1}{2}$', r'$p = 4\pi$, $b = 2$', r'$p = 2\pi$, $b = 1$', r'$p = \pi$, $b = 2$'],
    [r'Hochpunkte bei $x = \pi$ und $x = 5\pi$: $p = 5\pi - \pi = 4\pi$.',
     r'$b = \dfrac{2\pi}{4\pi} = \dfrac{2}{4} = \dfrac{1}{2}$. Probe: $\dfrac{1}{2} \cdot 4\pi = 2\pi$.'],
    fig=fig_period(), figcap=r'Graph zu Aufgabe 11')

Q.q(r'Welche Wertetabelle gehört zu $f(x) = \sin\left(x + \dfrac{\pi}{2}\right) + 1$ für $x = 0;\ \dfrac{\pi}{2};\ \pi;\ \dfrac{3\pi}{2};\ 2\pi$?',
    [r'$2;\ 1;\ 0;\ 1;\ 2$', r'$1;\ 2;\ 1;\ 0;\ 1$', r'$0;\ 1;\ 2;\ 1;\ 0$', r'$1;\ 0;\ 1;\ 2;\ 1$'],
    [r'Erst innen rechnen: $x + \dfrac{\pi}{2}$ ergibt $\dfrac{\pi}{2};\ \pi;\ \dfrac{3\pi}{2};\ 2\pi;\ \dfrac{5\pi}{2}$.',
     r'Sinus davon: $1;\ 0;\ -1;\ 0;\ 1$.',
     r'Plus 1: $2;\ 1;\ 0;\ 1;\ 2$. So eine Tabelle ist der sicherste Weg zu einer Skizze.'])

Q.q(r'Welche Beschreibung passt zur Form einer Sinuskurve?',
    [r'oben und unten flach, an der Mittellinie am steilsten', r'überall gleich steil, wie ein Zickzack',
     r'oben und unten am steilsten, an der Mittellinie flach', r'oben spitz und unten rund'],
    [r'An Hoch- und Tiefpunkt dreht die Kurve um, dort ist sie für einen Moment waagerecht.',
     r'Beim Durchgang durch die Mittellinie ändert sich der Wert am schnellsten.',
     r'Eine Skizze mit geraden Strichen (Dreieck, Zickzack) ist darum keine Sinuskurve.'],
    fig=fig_shapes(), figcap=r'Rot: Sinuskurve, grau: Zickzack durch dieselben Punkte')

# ---------------------------------------------------------- Ferris wheel ----
WHEEL = r'Ein Riesenrad: tiefster Punkt 1 m, höchster Punkt 41 m über dem Boden, eine Umdrehung dauert 80 s, bei $t = 0$ ist die Gondel ganz unten. Modell: $h(t) = a \sin(b(t - c)) + d$. '

Q.q(WHEEL + r'Bestimme $a$, $d$ und die Periodenlänge $p$.',
    [r'$a = 20$, $d = 21$, $p = 80$', r'$a = 40$, $d = 21$, $p = 80$',
     r'$a = 20$, $d = 20$, $p = 80$', r'$a = 20$, $d = 21$, $p = 82$'],
    [r'$a = \dfrac{41 - 1}{2} = 20$ (Radius), $d = \dfrac{41 + 1}{2} = 21$ (Höhe der Achse).',
     r'$p$ ist die Zeit für eine Umdrehung und steht im Text: $p = 80$ s. Mit den Höhen hat $p$ nichts zu tun.'])

Q.q(WHEEL + r'Welcher Wert gehört zu $c$?',
    [r'$c = 20$', r'$c = 21$', r'$c = 40$', r'$c = 80$'],
    [r'Bei $t = c$ ist der Sinus auf der Mittellinie und steigt, wie $\sin$ bei $0$.',
     r'Die Gondel startet unten. Auf Achsenhöhe und nach oben unterwegs ist sie nach einer Vierteldrehung.',
     r'$\dfrac{80}{4} = 20$, also $c = 20$. $21$ ist die Höhe $d$, kein Zeitpunkt.'])

Q.q(WHEEL + r'Bestimme $b$.',
    [r'$\dfrac{\pi}{40}$', r'$40\pi$', r'$\dfrac{\pi}{80}$', r'$\dfrac{2\pi}{41}$'],
    [r'$b = \dfrac{2\pi}{p} = \dfrac{2\pi}{80} = \dfrac{\pi}{40}$.',
     r'$40\pi$ wäre der Kehrwert. Probe: $\dfrac{\pi}{40} \cdot 80 = 2\pi$.'])

Q.q(r'Das Riesenrad hat das Modell $h(t) = 20 \sin\left(\dfrac{\pi}{40}(t - 20)\right) + 21$. In welcher Höhe ist die Gondel nach 30 s?',
    [r'$10\sqrt{2} + 21 \approx 35{,}1$ m', r'$31$ m', r'$5\pi + 21 \approx 36{,}7$ m', r'$41$ m'],
    [r'Klammer: $30 - 20 = 10$. Mal $b$: $\dfrac{\pi}{40} \cdot 10 = \dfrac{\pi}{4}$.',
     r'Sinus: $\sin\left(\dfrac{\pi}{4}\right) = \dfrac{\sqrt{2}}{2}$.',
     r'$20 \cdot \dfrac{\sqrt{2}}{2} + 21 = 10\sqrt{2} + 21 \approx 35{,}1$ m. Den Sinus nicht weglassen: $20 \cdot \dfrac{\pi}{4}$ wäre falsch.'])

# ----------------------------------------------------------- temperature ----
Q.q(r'Ein Temperaturmodell lautet $T(t) = 4 \sin\left(\dfrac{\pi}{12}(t - 10)\right) + 14$ ($t$ in Stunden). Um 13 Uhr misst man 18 °C. Wie gut passt das Modell?',
    [r'Modell $\approx 16{,}8$ °C, die Messung liegt etwa $1{,}2$ °C darüber',
     r'Modell $18$ °C, keine Abweichung', r'Modell $14$ °C, die Messung liegt $4$ °C darüber',
     r'Modell $\approx 17{,}1$ °C, die Messung liegt etwa $0{,}9$ °C darüber'],
    [r'$T(13) = 4 \sin\left(\dfrac{\pi}{12} \cdot 3\right) + 14 = 4 \sin\left(\dfrac{\pi}{4}\right) + 14$.',
     r'$4 \cdot \dfrac{\sqrt{2}}{2} + 14 = 2\sqrt{2} + 14 \approx 16{,}8$ °C.',
     r'Beurteilen heißt Zahlen nennen: $18 - 16{,}8 = 1{,}2$ °C Abweichung, das Modell passt hier recht gut.'])

# ------------------------------------------------------------- reasoning ----
Q.q(r'Welche Begründung zeigt richtig, dass ein Vorgang periodisch ist?',
    [r'Das Stück von $x = 0$ bis $x = 2$ wiederholt sich nach der festen Länge $p = 2$ immer wieder genau gleich.',
     r'Der Graph bleibt immer konstant.', r'Der Graph hat einen Hochpunkt und einen Tiefpunkt.',
     r'Der Graph geht abwechselnd nach oben und nach unten.'],
    [r'Periodisch heißt: $f(x + p) = f(x)$ für alle $x$, mit einer festen Länge $p$.',
     r'Zur Begründung gehören das Stück, das sich wiederholt, und die Länge $p$.',
     r'„Konstant“ heißt waagerecht gleich bleibend, das ist etwas anderes. Auf und ab allein reicht nicht: Die Abstände müssen immer gleich sein.'])

Q.q(r'Behauptung: „Für jede Zahl $c$ mit $-2 \le c \le 2$ hat $2\sin(x) = c$ im Intervall $[0;\,2\pi)$ genau zwei Lösungen.“ Welche Antwort widerlegt sie?',
    [r'Gegenbeispiel $c = 2$: $2\sin(x) = 2$ gilt nur für $x = \dfrac{\pi}{2}$, also nur eine Lösung.',
     r'Der Sinus ist periodisch, also gibt es unendlich viele Lösungen.',
     r'$c$ kann auch negativ sein.',
     r'Die Behauptung ist wahr, denn eine waagerechte Gerade schneidet die Kurve immer zweimal.'],
    [r'Eine Aussage „für jede Zahl …“ ist durch ein einziges Gegenbeispiel widerlegt.',
     r'$c = 2$ bedeutet $\sin(x) = 1$: Das gilt nur am Hochpunkt $x = \dfrac{\pi}{2}$.',
     r'Genauso $c = -2$: nur $x = \dfrac{3\pi}{2}$. Unendlich viele Lösungen gibt es nur auf ganz $\mathbb{R}$, nicht im Intervall.'])


def check():
    s, r, pi = math.sin, math.sqrt, math.pi
    near = lambda a, b: abs(a - b) < 1e-9
    assert near(s(pi / 6), 0.5) and near(s(5 * pi / 6), 0.5) and not near(s(7 * pi / 6), 0.5)
    assert near(s(pi / 3), r(3) / 2) and near(s(2 * pi / 3), r(3) / 2) and not near(s(4 * pi / 3), r(3) / 2)
    assert near(s(7 * pi / 6), -0.5) and near(s(11 * pi / 6), -0.5)
    assert near(s(7 * pi / 9), s(2 * pi / 9)) and not near(s(16 * pi / 9), s(2 * pi / 9))
    grid = [k / 7200 * 2 * pi for k in range(7201)]
    assert sum(1 for x in grid if abs(s(x) - 1) < 1e-12) == 1
    target = s(pi / 4)
    sols = [k * pi / 4 for k in range(8, 17) if near(s(k * pi / 4), target)]
    assert sols == [9 * pi / 4, 11 * pi / 4], sols
    g = lambda x: s(pi / 2 * (x - 1))
    assert all(near(g(x), 0) for x in (1, 3, 5)) and not near(g(pi), 0)
    f8 = lambda x: s(pi / 4 * (x + 2))
    assert all(near(f8(x), 0) for x in (-2, 2, 6))
    f9 = lambda x: s(2 * (x - pi / 6))
    assert near(f9(pi / 6), 0) and near(f9(2 * pi / 3), 0) and near(f9(-pi / 3), 0)
    assert not any(near(f9(x), 0) for x in [k / 1000 * pi / 6 for k in range(1, 1000)])
    f10 = lambda x: s(x - pi / 2) + 2
    assert near(f10(pi / 2), 2) and near(f10(pi), 3) and near(f10(0), 1)
    f11 = lambda x: 3 * s(x / 2)
    assert near(f11(pi), 3) and near(f11(5 * pi), 3) and near(2 * pi / (4 * pi), 0.5)
    f12 = lambda x: s(x + pi / 2) + 1
    assert [round(f12(x), 9) for x in (0, pi / 2, pi, 3 * pi / 2, 2 * pi)] == [2, 1, 0, 1, 2]
    a, d, p = (41 - 1) / 2, (41 + 1) / 2, 80
    assert (a, d) == (20, 21)
    h = lambda t: 20 * s(pi / 40 * (t - 20)) + 21
    assert near(h(0), 1) and near(h(40), 41) and near(h(20), 21) and near(h(80), 1)
    assert near(2 * pi / p, pi / 40)
    assert near(h(30), 10 * r(2) + 21) and round(h(30), 1) == 35.1 and round(5 * pi + 21, 1) == 36.7
    T = lambda t: 4 * s(pi / 12 * (t - 10)) + 14
    assert round(T(13), 1) == 16.8 and round(18 - T(13), 1) == 1.2 and round(4 * pi / 4 + 14, 1) == 17.1


Q.verify(check)
Q.save()
