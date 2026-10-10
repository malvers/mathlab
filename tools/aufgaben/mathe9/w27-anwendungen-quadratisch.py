#!/usr/bin/env python3
"""Aufgaben OS Mathe 9 (Realschule), Woche 27 / KW 12 (LB 3): Nullstellen, Schnittpunkte
von Parabel und Gerade, Anwendungen quadratischer Gleichungen. Plan: HTML/svp/mathe/mathe9.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import os9

Q = os9(nr=27, slug='anwendungen-quadratisch', thema='Nullstellen, Schnittpunkte, Anwendungen', lb='LB 3',
        blurb='Nullstellen von Parabeln, Schnittpunkte mit Geraden und Parabeln, Wurf, Brücke, Flächen, Gewinn',
        comment='Blocks: zeros (1-2, 16, 20), intersections (3-6, 12), throw and fall (7-8, 15, 17), geometry (9-11, 19), numbers, braking and profit (13-14, 18). Braking rule of thumb from driving school.')

# ----------------------------------------------------------- Nullstellen ----
Q.q(r'Welche Nullstellen hat $y = x^2 - 2x - 3$?',
    [r'$x = 3$ und $x = -1$', r'$x = -3$ und $x = 1$', r'$x = 1 \pm 3$', r'keine'],
    [r'$x = 1 \pm \sqrt{1 + 3} = 1 \pm 2$'])

Q.q(r'Welche Nullstellen hat $y = x^2 - 4x + 5$?',
    [r'keine', r'$x = 1$ und $x = 5$', r'$x = 2$', r'$x = -1$ und $x = 5$'],
    [r'$D = 4 - 5 = -1 < 0$',
     r'Der Scheitel $(2 \mid 1)$ liegt über der $x$-Achse.'])

# ------------------------------------------------------------ Schnittpunkte ----
Q.q(r'In welchen Punkten schneiden sich $y = x^2$ und $y = x + 2$?',
    [r'$(2 \mid 4)$ und $(-1 \mid 1)$', r'$(-2 \mid 4)$ und $(1 \mid 1)$', r'$(2 \mid 4)$', r'Sie schneiden sich nicht.'],
    [r'Gleichsetzen: $x^2 = x + 2$, also $x^2 - x - 2 = 0$.',
     r'$x = 2$ oder $x = -1$; $y$ aus der Geraden: 4 und 1.'])

Q.q(r'In welchen Punkten schneiden sich $y = x^2 - 1$ und $y = 2x + 2$?',
    [r'$(3 \mid 8)$ und $(-1 \mid 0)$', r'$(-3 \mid 8)$ und $(1 \mid 0)$', r'$(3 \mid 8)$', r'$(1 \mid 4)$ und $(0 \mid 2)$'],
    [r'$x^2 - 1 = 2x + 2$, also $x^2 - 2x - 3 = 0$.',
     r'$x = 3$ oder $x = -1$, dazu $y = 8$ und $y = 0$.'])

Q.q(r'Wie viele gemeinsame Punkte haben $y = x^2$ und $y = 2x - 1$?',
    [r'genau einen, $(1 \mid 1)$: Die Gerade ist eine Tangente.', r'zwei', r'keinen', r'unendlich viele'],
    [r'$x^2 - 2x + 1 = 0$, also $(x - 1)^2 = 0$.',
     r'Nur $x = 1$: Die Gerade berührt die Parabel.'])

Q.q(r'Wie viele gemeinsame Punkte haben $y = x^2 + 2$ und $y = x$?',
    [r'keinen', r'einen', r'zwei', r'drei'],
    [r'$x^2 - x + 2 = 0$: $D = 0{,}25 - 2 < 0$',
     r'Die Gerade verläuft unterhalb der Parabel.'])

# --------------------------------------------------------------------- Wurf ----
Q.q(r'Ein Ball wird geworfen: $h(t) = -5t^2 + 20t + 1{,}8$ (in m, $t$ in s). Wie hoch fliegt er höchstens?',
    [r'21,8 m nach 2 s', r'20 m nach 2 s', r'1,8 m nach 0 s', r'21,8 m nach 4 s'],
    [r'$h(t) = -5(t^2 - 4t) + 1{,}8 = -5(t - 2)^2 + 20 + 1{,}8$',
     r'Scheitel $(2 \mid 21{,}8)$'])

Q.q(r'Wann landet dieser Ball ($h(t) = -5t^2 + 20t + 1{,}8$) auf dem Boden (gerundet)?',
    [r'nach 4,09 s', r'nach 4 s', r'nach 2 s', r'nach 21,8 s'],
    [r'$h(t) = 0$, durch $-5$ teilen: $t^2 - 4t - 0{,}36 = 0$',
     r'$t = 2 + \sqrt{4 + 0{,}36} \approx 4{,}09$ s (die negative Lösung entfällt).'])

# ------------------------------------------------------------- Geometrie ----
Q.q(r'Ein Brückenbogen wird durch $y = -0{,}01x^2 + 4$ beschrieben (in m). Wie weit ist er gespannt?',
    [r'40 m', r'20 m', r'4 m', r'400 m'],
    [r'$-0{,}01x^2 + 4 = 0$, also $x^2 = 400$.',
     r'$x = \pm 20$: Spannweite 40 m.'])

Q.q(r'Mit 40 m Zaun soll an einer Mauer ein Rechteck eingezäunt werden (drei Seiten Zaun). Welche größte Fläche ist möglich?',
    [r'200 m² mit 10 m × 20 m', r'100 m² mit 10 m × 10 m', r'400 m² mit 20 m × 20 m', r'192 m² mit 12 m × 16 m'],
    [r'Seiten $x$, $x$ und $40 - 2x$: $A(x) = x \cdot (40 - 2x) = -2x^2 + 40x$.',
     r'$A(x) = -2(x - 10)^2 + 200$: Maximum bei $x = 10$ m.'])

Q.q(r'Ein Rechteck hat 48 cm² Flächeninhalt, eine Seite ist 2 cm länger als die andere. Wie lang sind die Seiten?',
    [r'6 cm und 8 cm', r'4 cm und 12 cm', r'5 cm und 7 cm', r'8 cm und 10 cm'],
    [r'$x \cdot (x + 2) = 48$, also $x^2 + 2x - 48 = 0$.',
     r'$x = -1 \pm 7$; die positive Lösung ist $x = 6$.'])

Q.q(r'In welchen Punkten schneiden sich $y = x^2$ und $y = -x^2 + 2x + 4$?',
    [r'$(2 \mid 4)$ und $(-1 \mid 1)$', r'$(-2 \mid 4)$ und $(1 \mid 1)$', r'$(0 \mid 4)$', r'Sie schneiden sich nicht.'],
    [r'$x^2 = -x^2 + 2x + 4$, also $2x^2 - 2x - 4 = 0$ und $x^2 - x - 2 = 0$.',
     r'$x = 2$ oder $x = -1$'])

Q.q(r'Das Quadrat einer Zahl, vermehrt um ihr Dreifaches, ergibt 10. Welche Zahlen kommen in Frage?',
    [r'2 und −5', r'−2 und 5', r'nur 2', r'1 und 10'],
    [r'$x^2 + 3x - 10 = 0$',
     r'$x = -1{,}5 \pm \sqrt{2{,}25 + 10} = -1{,}5 \pm 3{,}5$'])

Q.q(r'Faustregel der Fahrschule: Anhalteweg $= \left(\dfrac{v}{10}\right)^2 + 3 \cdot \dfrac{v}{10}$ (in m, $v$ in km/h). Bei welcher Geschwindigkeit beträgt er 40 m?',
    [r'bei 50 km/h', r'bei 40 km/h', r'bei 80 km/h', r'bei 63 km/h'],
    [r'Mit $u = \dfrac{v}{10}$: $u^2 + 3u - 40 = 0$',
     r'$u = -1{,}5 + \sqrt{2{,}25 + 40} = 5$, also $v = 50$ km/h.'])

Q.q(r'Ein Brunnenstrahl folgt $y = -0{,}5x^2 + 2x$ (in m). Wie hoch steigt er, und wo trifft er wieder auf?',
    [r'2 m hoch, trifft bei $x = 4$ m auf', r'4 m hoch, trifft bei $x = 2$ m auf', r'2 m hoch, trifft bei $x = 2$ m auf', r'1 m hoch, trifft bei $x = 4$ m auf'],
    [r'Nullstellen: $x \cdot (-0{,}5x + 2) = 0$, also $x = 0$ oder $x = 4$.',
     r'Scheitel in der Mitte bei $x = 2$: $y = -2 + 4 = 2$ m'])

Q.q(r'Wie viele gemeinsame Punkte haben $y = x^2 - 4$ und $y = -4$?',
    [r'einen, den Scheitel $(0 \mid -4)$', r'zwei', r'keinen', r'vier'],
    [r'$x^2 - 4 = -4$, also $x^2 = 0$.',
     r'Die Gerade berührt die Parabel im Scheitel.'])

Q.q(r'Beim freien Fall gilt $s = 4{,}9t^2$ (in m). Wann hat ein Stein 19,6 m zurückgelegt?',
    [r'nach 2 s', r'nach 4 s', r'nach 1,4 s', r'nach 96 s'],
    [r'$t^2 = 19{,}6 : 4{,}9 = 4$',
     r'$t = 2$ s'])

Q.q(r'Der Gewinn ist $G(x) = -2x^2 + 24x - 54$. Für welche Stückzahlen $x$ ist der Gewinn null?',
    [r'$x = 3$ und $x = 9$', r'$x = -3$ und $x = -9$', r'$x = 6$', r'$x = 12$ und $x = 27$'],
    [r'Durch $-2$ teilen: $x^2 - 12x + 27 = 0$',
     r'$x = 6 \pm 3$; dazwischen macht die Firma Gewinn.'])

Q.q(r'Ein Bild ist 20 cm × 30 cm groß. Ein überall gleich breiter Rahmen soll die Gesamtfläche auf 1000 cm² bringen. Wie breit ist der Rahmen (gerundet)?',
    [r'3,51 cm', r'5 cm', r'2,5 cm', r'16 cm'],
    [r'$(20 + 2x)(30 + 2x) = 1000$, also $4x^2 + 100x - 400 = 0$ und $x^2 + 25x - 100 = 0$.',
     r'$x = -12{,}5 + \sqrt{156{,}25 + 100} \approx 3{,}51$ cm'])

Q.q(r'Wo schneidet die Parabel $y = (x - 2)^2 - 1$ die $y$-Achse?',
    [r'bei $(0 \mid 3)$', r'bei $(0 \mid -1)$', r'bei $(2 \mid -1)$', r'bei $(0 \mid 4)$'],
    [r'$x = 0$: $y = (-2)^2 - 1 = 3$'])


def check():
    import sympy as sp
    x = sp.symbols('x')
    s = lambda e: sorted(sp.solve(e, x), key=lambda v: complex(v).real)
    assert s(x**2 - 2*x - 3) == [-1, 3] and all(not v.is_real for v in sp.solve(x**2 - 4*x + 5, x))
    assert s(x**2 - x - 2) == [-1, 2] and s(x**2 - 2*x - 3) == [-1, 3] and s(x**2 - 2*x + 1) == [1]
    assert all(not v.is_real for v in sp.solve(x**2 - x + 2, x))
    h = -5*x**2 + 20*x + sp.Rational(9, 5)
    assert h.subs(x, 2) == sp.Rational(109, 5) and round(float(max(sp.solve(h, x))), 2) == 4.09
    assert s(-sp.Rational(1, 100)*x**2 + 4) == [-20, 20]
    A = x*(40 - 2*x)
    assert sp.solve(sp.diff(A, x), x) == [10] and A.subs(x, 10) == 200
    assert s(x*(x + 2) - 48) == [-8, 6] and s(x**2 - (-x**2 + 2*x + 4)) == [-1, 2] and s(x**2 + 3*x - 10) == [-5, 2]
    assert s(x**2 + 3*x - 40) == [-8, 5]
    assert s(-sp.Rational(1, 2)*x**2 + 2*x) == [0, 4] and (-sp.Rational(1, 2)*x**2 + 2*x).subs(x, 2) == 2
    assert s(x**2) == [0] and s(sp.Rational(49, 10)*x**2 - sp.Rational(196, 10)) == [-2, 2]
    assert s(-2*x**2 + 24*x - 54) == [3, 9]
    assert round(float(max(sp.solve((20 + 2*x)*(30 + 2*x) - 1000, x))), 2) == 3.51
    assert (0 - 2)**2 - 1 == 3


Q.verify(check)
Q.save()
