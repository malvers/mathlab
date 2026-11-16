#!/usr/bin/env python3
"""Leistungstest 1 Mathe 11 (BGY26), Mo 23.11.2026 - Teil A online as multiple choice.

Doc, 16.11.2026: "Weisst du was, entscheide du. Be creative." - Teil A runs on js/quiz-engine.js with
Mission Control, Teil B is the bonus on paper (derive the pq formula, +2 BE). The 20 questions are the
7 tasks of the paper test (pool mathe11-lt1-uebung.json, numbers 1, 3, 8, 12, 19, 23, 25) cut into
single steps, one BE each: AFB I 10, AFB II 6, AFB III 4 = 50/30/20 %. Distractors are the typical
slips (sign turned, second solution lost, not divided by 3 first, root wrong, L = {} where it fits).
Formelsammlung yes, calculator no - every number is checked for hand calculation below.
The paper version (fallback, Erwartungshorizont) lives outside the repo: OneDrive MATH BGY 11/Leistungstest 1.
Copied from ka1-vertiefung.py (exercise sheet); the test settings come from the subclass Test.

    python3 tools/aufgaben/mathe11-quiz/lt1-quadratisch.py
"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..'))
from fractions import Fraction as F
import math
import sympy as sp
from quiz import Quiz

# Grade: Teil A (20 BE) + Teil B bonus (0-2 BE), the BGY 11 key stays on 20 BE (Doc: "10% mehr Punkte").
# Mission Control grades A + B as a share of A + partB = 22 with the page's scale (svp/leistungstest.html
# gradeAB: whole percent rounded half up). This percent scale on 22 gives exactly the thresholds of the
# BGY 11 key on 20 BE - 19/16/13/9/5 BE - checked for every score 0..22 in check_scale().
PART_B = 2
SCALE = [[86, 1], [73, 2], [59, 3], [41, 4], [23, 5], [0, 6]]


class Test(Quiz):
    """A test instead of an exercise sheet: button "Abgeben", solutions only after it, code required,
    Teil B on paper, the scale above."""
    def _js_block(self, qs):
        L = super()._js_block(qs)
        a = "  submitLabel: 'Auswertung',   /* Uebungsblatt: der Knopf heisst Auswertung */\n"
        b = "  solutions: 'always',  /* Loesung pro Aufgabe sofort aufklappbar */\n"
        assert L.count(a) == 1 and L.count(b) == 1, 'quiz.py: exercise-sheet lines changed'
        cfg = ('  requireCode: true,   /* Code vom Zettel, wie in Mission Control */\n'
               '  partB: %d,   /* Teil B: Bonus auf Papier, Doc traegt ihn in Mission Control ein */\n'
               '  gradeScale: %s,   /* = BGY-11-Schluessel auf 20 BE (19/16/13/9/5), Bonus obendrauf, siehe lt1-quadratisch.py */\n'
               % (PART_B, str(SCALE).replace(' ', '')))
        return L.replace(a, '').replace(b, cfg)

    def _expected(self, qs):
        exp = super()._expected(qs)
        del exp['submitLabel'], exp['solutions']
        exp.update(requireCode=True, partB=PART_B, gradeScale=SCALE)
        return exp


Q = Test(id='mathe11-lt1-quadratisch',
         file='mathetest11-lt1-quadratisch.html',
         title='Leistungstest 1 · Quadratische Gleichungen',
         subtitle='Berufliches Gymnasium · Klasse 11 · Mo 23.11.2026 · Teil A: 20 Fragen, je 1 BE, genau eine Antwort '
                  'pro Frage · Formelsammlung erlaubt, kein Taschenrechner · Teil B (Bonus, +2 BE) auf Papier',
         dash_sub='BGY26 · Klasse 11 · Leistungstest 1 · Teil A online (20 BE), Teil B Bonus auf Papier (+2 BE)',
         back='svp/mathe/mathe11.html',
         comment='Aus den 7 Aufgaben des Papiertests: 1-2 Aufgabe 1, 3-4 Aufgabe 2, 5-7 Aufgabe 3, 8-10 Aufgabe 4 '
                 '(AFB I), 11-13 Aufgabe 5, 14-16 Aufgabe 6 (AFB II), 17-20 Aufgabe 7 (AFB III).')

AFB = ['I'] * 10 + ['II'] * 6 + ['III'] * 4
TASK = [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 7]
CM2 = r'\ \mathrm{cm^2}'

# ------------------------------------------------ Aufgabe 1 (pool 1): without the formula ----
Q.q(r'Löse ohne pq-Formel: $x^2 - 9x = 0$',
    [r'$L = \{0;\ 9\}$', r'$L = \{9\}$', r'$L = \{-9;\ 0\}$', r'$L = \{-3;\ 3\}$'],
    [r'Kein absolutes Glied, also $x$ ausklammern: $x(x - 9) = 0$',
     r'Ein Produkt ist null, wenn ein Faktor null ist: $x = 0$ oder $x - 9 = 0$, also $x = 9$',
     r'Falle: durch $x$ teilen. Dann geht die Lösung $x = 0$ verloren.'])

Q.q(r'Löse ohne pq-Formel: $3x^2 - 48 = 0$',
    [r'$L = \{-4;\ 4\}$', r'$L = \{4\}$', r'$L = \{-16;\ 16\}$', r'$L = \{\,\}$'],
    [r'$3x^2 - 48 = 0 \quad | +48$, dann $3x^2 = 48 \quad | :3$',
     r'$x^2 = 16$, die Wurzel hat zwei Vorzeichen: $x = 4$ oder $x = -4$',
     r'Falle: die negative Lösung vergessen, die Wurzel nicht ziehen, oder beim Umstellen $x^2 = -16$ rechnen.'])

# ------------------------------------------------ Aufgabe 2 (pool 3): a square on the left ----
Q.q(r'Die Gleichung $(x + 3)^2 = 16$ soll ohne Ausmultiplizieren gelöst werden. Welcher Ansatz ist richtig?',
    [r'$x + 3 = 4$ oder $x + 3 = -4$', r'nur $x + 3 = 4$', r'$x + 3 = 16$ oder $x + 3 = -16$', r'$x^2 + 9 = 16$'],
    [r'In der Klammer steht eine Zahl, deren Quadrat $16$ ist: $4$ oder $-4$',
     r'Falle: nur $+4$ (eine Lösung fehlt), die Wurzel vergessen ($\pm 16$), oder $(x + 3)^2 = x^2 + 9$ - da fehlt das Glied $6x$.'])

Q.q(r'Welche Lösungsmenge hat $(x + 3)^2 = 16$?',
    [r'$L = \{-7;\ 1\}$', r'$L = \{1\}$', r'$L = \{-1;\ 7\}$', r'$L = \{-19;\ 13\}$'],
    [r'$x + 3 = 4 \Rightarrow x = 1$ und $x + 3 = -4 \Rightarrow x = -7$',
     r'Probe: $(1 + 3)^2 = 16$ ✓ und $(-7 + 3)^2 = (-4)^2 = 16$ ✓',
     r'Falle: $\{-1;\ 7\}$ hat die Vorzeichen verdreht, $\{-19;\ 13\}$ kommt aus $x + 3 = \pm 16$.'])

# ------------------------------------------------ Aufgabe 3 (pool 8): normal form first ----
Q.q(r'Die Gleichung $3x^2 + 6x - 24 = 0$ soll mit der pq-Formel gelöst werden. Welche Werte setzt man für $p$ und $q$ ein?',
    [r'$p = 2$, $q = -8$', r'$p = 6$, $q = -24$', r'$p = -2$, $q = 8$', r'$p = 2$, $q = -24$'],
    [r'Die pq-Formel braucht die Normalform, vor $x^2$ muss $1$ stehen: $3x^2 + 6x - 24 = 0 \quad | :3$',
     r'$x^2 + 2x - 8 = 0$, also $p = 2$ und $q = -8$',
     r'Falle: nicht erst durch $3$ geteilt ($p = 6$, $q = -24$), nur teilweise geteilt, oder die Vorzeichen verdreht.'])

Q.q(r'Welche Zahl steht beim Lösen von $3x^2 + 6x - 24 = 0$ mit der pq-Formel unter der Wurzel?',
    [r'$9$', r'$-7$', r'$33$', r'$12$'],
    [r'Normalform $x^2 + 2x - 8 = 0$, also $p = 2$, $q = -8$',
     r'Unter der Wurzel: $\left(\dfrac{2}{2}\right)^2 - (-8) = 1 + 8 = 9$',
     r'Falle: $1 - 8 = -7$ (Vorzeichen von $q$), $3^2 + 24 = 33$ (nicht durch $3$ geteilt), $2^2 + 8 = 12$ ($p$ nicht halbiert).'])

Q.q(r'Welche Lösungsmenge hat $3x^2 + 6x - 24 = 0$?',
    [r'$L = \{-4;\ 2\}$', r'$L = \{-2;\ 4\}$', r'$L = \{2\}$', r'$L = \{\,\}$'],
    [r'$x_{1,2} = -1 \pm \sqrt{9} = -1 \pm 3$, also $x_1 = 2$ und $x_2 = -4$',
     r'Probe: $3 \cdot 2^2 + 6 \cdot 2 - 24 = 12 + 12 - 24 = 0$ ✓ und $3 \cdot 16 - 24 - 24 = 0$ ✓',
     r'Falle: $\{-2;\ 4\}$ hat die Vorzeichen verdreht, und $L = \{\,\}$ kommt von $\sqrt{1 - 8}$.'])

# ------------------------------------------------ Aufgabe 4 (pool 12): the discriminant ----
Q.q(r'Bestimme mit der Diskriminante, wie viele Lösungen $x^2 - 6x + 5 = 0$ hat.',
    [r'$D = 4$, also zwei Lösungen', r'$D = 14$, also zwei Lösungen', r'$D = -4$, also keine Lösung',
     r'$D = 31$, also zwei Lösungen'],
    [r'$p = -6$, $q = 5$: $D = (-3)^2 - 5 = 9 - 5 = 4 > 0$, also zwei Lösungen',
     r'Falle: $9 + 5 = 14$ (Vorzeichen von $q$), $5 - 9 = -4$ (verdreht), $36 - 5 = 31$ ($p$ nicht halbiert).'])

Q.q(r'Bestimme mit der Diskriminante, wie viele Lösungen $x^2 + 8x + 16 = 0$ hat.',
    [r'$D = 0$, also genau eine Lösung', r'$D = 0$, also keine Lösung', r'$D = 32$, also zwei Lösungen',
     r'$D = 48$, also zwei Lösungen'],
    [r'$p = 8$, $q = 16$: $D = 4^2 - 16 = 0$, also genau eine Lösung',
     r'Kontrolle: $x^2 + 8x + 16 = (x + 4)^2$, nur $x = -4$ macht das null',
     r'Falle: $D = 0$ heißt nicht „keine Lösung“, unter der Wurzel steht dann $0$ und $\pm 0$ gibt eine Lösung.'])

Q.q(r'Bestimme mit der Diskriminante, wie viele Lösungen $x^2 - 4x + 7 = 0$ hat.',
    [r'$D = -3$, also keine Lösung', r'$D = 3$, also zwei Lösungen', r'$D = 11$, also zwei Lösungen',
     r'$D = 9$, also zwei Lösungen'],
    [r'$p = -4$, $q = 7$: $D = (-2)^2 - 7 = 4 - 7 = -3 < 0$, also keine Lösung',
     r'Falle: $7 - 4 = 3$ (verdreht), $4 + 7 = 11$ (Vorzeichen von $q$), $16 - 7 = 9$ ($p$ nicht halbiert).'])

# ------------------------------------------------ Aufgabe 5 (pool 19): zeros of a parabola ----
Q.q(r'Für die Nullstellen von $f(x) = -x^2 + 6x - 5$ wird die Gleichung $f(x) = 0$ mit $-1$ multipliziert. Welche Gleichung entsteht?',
    [r'$x^2 - 6x + 5 = 0$', r'$x^2 + 6x - 5 = 0$', r'$x^2 + 6x + 5 = 0$', r'$x^2 - 6x - 5 = 0$'],
    [r'Mal $(-1)$ dreht das Vorzeichen jedes Gliedes: $-x^2 \to x^2$, $6x \to -6x$, $-5 \to 5$',
     r'Falle: nur ein oder zwei Glieder umgedreht.'])

Q.q(r'Welche Nullstellen hat $f(x) = -x^2 + 6x - 5$?',
    [r'$x_1 = 1$ und $x_2 = 5$', r'$x_1 = -5$ und $x_2 = -1$', r'nur $x = 5$', r'$x_{1,2} = 3 \pm \sqrt{14}$'],
    [r'$x^2 - 6x + 5 = 0$, $p = -6$, $q = 5$: $x_{1,2} = 3 \pm \sqrt{9 - 5} = 3 \pm 2$',
     r'$x_1 = 5$, $x_2 = 1$. Probe: $f(1) = -1 + 6 - 5 = 0$ ✓ und $f(5) = -25 + 30 - 5 = 0$ ✓',
     r'Falle: $-5$ und $-1$ lösen $x^2 + 6x + 5 = 0$, und $3 \pm \sqrt{14}$ kommt aus $x^2 - 6x - 5 = 0$.'])

Q.q(r'In welchem Punkt schneidet der Graph von $f(x) = -x^2 + 6x - 5$ die $y$-Achse?',
    [r'$S_y(0 \mid -5)$', r'$S_y(0 \mid 5)$', r'$S_y(-5 \mid 0)$', r'$S_y(1 \mid 0)$'],
    [r'Auf der $y$-Achse ist $x = 0$: $f(0) = -0^2 + 6 \cdot 0 - 5 = -5$',
     r'Falle: $x$ und $y$ vertauscht, oder die Nullstelle $(1 \mid 0)$ mit dem $y$-Achsenabschnitt verwechselt.'])

# ------------------------------------------------ Aufgabe 6 (pool 23): the rectangle ----
Q.q(r'Ein Rechteck hat den Umfang $26$ cm und den Flächeninhalt $40' + CM2 + r'$. Welcher Ansatz für die Seiten $a$ und $b$ ist richtig?',
    [r'$a + b = 13$ und $a \cdot b = 40$', r'$a + b = 26$ und $a \cdot b = 40$', r'$2a + 2b = 40$ und $a \cdot b = 26$',
     r'$4a = 26$ und $a^2 = 40$'],
    [r'Umfang: $2a + 2b = 26 \quad | :2$, also $a + b = 13$',
     r'Fläche: $a \cdot b = 40$',
     r'Falle: den Umfang nicht halbiert, Umfang und Fläche vertauscht, oder ein Quadrat angenommen.'])

Q.q(r'Ein Rechteck hat den Umfang $26$ cm und den Flächeninhalt $40' + CM2 + r'$. Welche quadratische Gleichung gilt für eine Seite $a$?',
    [r'$a^2 - 13a + 40 = 0$', r'$a^2 + 13a + 40 = 0$', r'$a^2 - 26a + 40 = 0$', r'$a^2 - 13a - 40 = 0$'],
    [r'$a + b = 13$, also $b = 13 - a$, eingesetzt in $a \cdot b = 40$: $a(13 - a) = 40$',
     r'$13a - a^2 = 40 \quad | +a^2 - 13a$, also $a^2 - 13a + 40 = 0$',
     r'Falle: beim Umstellen ein Vorzeichen verloren, oder mit $a + b = 26$ gerechnet.'])

Q.q(r'Ein Rechteck hat den Umfang $26$ cm und den Flächeninhalt $40' + CM2 + r'$. Wie lang sind seine Seiten?',
    [r'$8$ cm und $5$ cm', r'$10$ cm und $4$ cm', r'$20$ cm und $2$ cm', r'$-8$ cm und $-5$ cm'],
    [r'$a^2 - 13a + 40 = 0$: $a_{1,2} = \dfrac{13}{2} \pm \sqrt{\dfrac{169}{4} - \dfrac{160}{4}} = \dfrac{13}{2} \pm \dfrac{3}{2}$, also $8$ und $5$',
     r'Probe: $2 \cdot 8 + 2 \cdot 5 = 26$ ✓ und $8 \cdot 5 = 40$ ✓',
     r'Falle: $10 \cdot 4$ und $20 \cdot 2$ sind auch $40$, haben aber den Umfang $28$ und $44$. Eine Länge ist nie negativ.'])

# ------------------------------------------------ Aufgabe 7 (pool 25): exactly one solution ----
Q.q(r'Die Gleichung $x^2 + px + 9 = 0$ soll genau eine Lösung haben. Welche Bedingung muss gelten?',
    [r'$\left(\dfrac{p}{2}\right)^2 - 9 = 0$', r'$\left(\dfrac{p}{2}\right)^2 - 9 > 0$',
     r'$\left(\dfrac{p}{2}\right)^2 + 9 = 0$', r'$p^2 - 9 = 0$'],
    [r'Genau eine Lösung heißt: Die Diskriminante ist $0$',
     r'Mit $q = 9$: $D = \left(\dfrac{p}{2}\right)^2 - 9 = 0$',
     r'Falle: $D > 0$ gibt zwei Lösungen, $+9$ hat das Vorzeichen von $q$ verdreht, $p^2 - 9$ vergisst das Halbieren.'])

Q.q(r'Für welche Werte von $p$ hat $x^2 + px + 9 = 0$ genau eine Lösung?',
    [r'$p = 6$ oder $p = -6$', r'nur $p = 6$', r'$p = 3$ oder $p = -3$', r'$p = 18$ oder $p = -18$'],
    [r'$\left(\dfrac{p}{2}\right)^2 - 9 = 0 \quad | +9$, also $\dfrac{p^2}{4} = 9 \quad | \cdot 4$',
     r'$p^2 = 36$, die Wurzel hat zwei Vorzeichen: $p = 6$ oder $p = -6$',
     r'Falle: das negative Vorzeichen vergessen, $\dfrac{p}{2} = \pm 3$ nicht verdoppelt, oder $\dfrac{p}{2} = \pm 9$ ohne Wurzel.'])

Q.q(r'Die Gleichung $x^2 + px + 9 = 0$ hat für einen positiven Wert von $p$ genau eine Lösung. Welche Lösungsmenge hat sie dann?',
    [r'$L = \{-3\}$', r'$L = \{3\}$', r'$L = \{-3;\ 3\}$', r'$L = \{\,\}$'],
    [r'Der positive Wert ist $p = 6$: $x^2 + 6x + 9 = (x + 3)^2 = 0$',
     r'Nur $x = -3$ macht die Klammer null, also $L = \{-3\}$',
     r'Falle: Vorzeichen verdreht ($\{3\}$), eine zweite Lösung erfunden, oder „$D = 0$ heißt keine Lösung“.'])

Q.q(r'Die Gleichung $x^2 + px + 9 = 0$ hat auch für einen negativen Wert von $p$ genau eine Lösung. Welche Lösungsmenge hat sie dann?',
    [r'$L = \{3\}$', r'$L = \{-3\}$', r'$L = \{-3;\ 3\}$', r'$L = \{\,\}$'],
    [r'Der negative Wert ist $p = -6$: $x^2 - 6x + 9 = (x - 3)^2 = 0$',
     r'Nur $x = 3$ macht die Klammer null, also $L = \{3\}$',
     r'Probe: $3^2 - 6 \cdot 3 + 9 = 9 - 18 + 9 = 0$ ✓'])


# ----------------------------------------------------------- numbers check ----
x, a, p = sp.symbols('x a p')
S = lambda e, v=x: sorted(sp.solve(e, v))
Sr = lambda e, v=x: sorted(s for s in sp.solve(e, v) if s.is_real)
def D(P, Q): return F(P, 2) ** 2 - Q

def check_scale():
    """The page's percent scale on 22 = the BGY 11 key on 20 BE (units rule of punktetabelle.html), for 0..22."""
    def bgy11_on_20(pts):                  # quiz-engine unitsMark with BGY11_SCALE, total 20, bonus may exceed 20
        for th, g in [(95, 1), (80, 2), (65, 3), (45, 4), (25, 5)]:
            if pts >= math.ceil(round(th / 100 * 20, 9)):
                return g
        return 6
    def mission_control(pts, mx=20 + PART_B):   # svp/leistungstest.html gradeAB with a percent scale
        pct = math.floor(pts * 100 / mx + 0.5 + 1e-9)
        return next(g for th, g in SCALE if pct >= th)
    assert [bgy11_on_20(s) for s in (19, 16, 13, 9, 5, 4)] == [1, 2, 3, 4, 5, 6]
    for pts in range(0, 20 + PART_B + 1):
        assert mission_control(pts) == bgy11_on_20(pts), (pts, mission_control(pts), bgy11_on_20(pts))

def check():
    assert len(AFB) == len(TASK) == len(Q.questions) == 20
    assert (AFB.count('I'), AFB.count('II'), AFB.count('III')) == (10, 6, 4)
    check_scale()
    # 1, 2
    assert S(x**2 - 9*x) == [0, 9] and S(3*x**2 - 48) == [-4, 4] and S(x**2 - 16) == [-4, 4]
    assert Sr(3*x**2 + 48) == []                                      # x^2 = -16 has no solution
    # 3, 4
    assert S((x + 3)**2 - 16) == [-7, 1] and sp.expand((x + 3)**2) != x**2 + 9
    assert sorted([16 - 3, -16 - 3]) == [-19, 13] and S((x - 3)**2 - 16) == [-1, 7]
    # 5-7
    assert sp.expand((3*x**2 + 6*x - 24) / 3) == x**2 + 2*x - 8
    assert D(2, -8) == 9 and D(2, 8) == -7 and D(6, -24) == 33 and F(2)**2 + 8 == 12
    assert S(3*x**2 + 6*x - 24) == [-4, 2] and S(x**2 - 2*x - 8) == [-2, 4] and Sr(x**2 + 2*x + 8) == []
    assert 3 * 4 + 12 - 24 == 0 and 3 * 16 - 24 - 24 == 0
    # 8-10: D right, and every distractor is its named slip
    assert D(-6, 5) == 4 and 9 + 5 == 14 and 5 - 9 == -4 and 36 - 5 == 31 and len(S(x**2 - 6*x + 5)) == 2
    assert D(8, 16) == 0 and 16 + 16 == 32 and 64 - 16 == 48 and S(x**2 + 8*x + 16) == [-4]
    assert D(-4, 7) == -3 and 7 - 4 == 3 and 4 + 7 == 11 and 16 - 7 == 9 and Sr(x**2 - 4*x + 7) == []
    # 11-13
    assert sp.expand(-1 * (-x**2 + 6*x - 5)) == x**2 - 6*x + 5
    assert S(-x**2 + 6*x - 5) == [1, 5] and D(-6, 5) == 4
    assert S(x**2 + 6*x + 5) == [-5, -1] and S(x**2 - 6*x - 5) == [3 - sp.sqrt(14), 3 + sp.sqrt(14)]
    assert (-x**2 + 6*x - 5).subs(x, 0) == -5
    # 14-16
    assert S(a*(13 - a) - 40, a) == [5, 8] and sp.expand(-(a*(13 - a) - 40)) == a**2 - 13*a + 40
    assert D(-13, 40) == F(9, 4) and F(169, 4) - F(160, 4) == F(9, 4)
    assert 2*8 + 2*5 == 26 and 8*5 == 40 and 10*4 == 40 and 2*(10 + 4) == 28 and 20*2 == 40 and 2*(20 + 2) == 44
    assert S(a**2 + 13*a + 40, a) == [-8, -5]                          # the sign slip gives the negative lengths
    # 17-20
    assert S(sp.Rational(1, 4) * p**2 - 9, p) == [-6, 6] and S((p / 2)**2 - 9, p) == [-6, 6]
    assert S(p**2 - 9, p) == [-3, 3] and S(p / 2 - 9, p) == [18]
    assert S(x**2 + 6*x + 9) == [-3] and S(x**2 - 6*x + 9) == [3] and 9 - 18 + 9 == 0
    # by hand (Doc: no calculator): every quadratic of a question has small integer coefficients, integer p and q,
    # a square under the root (or 0 or negative) and integer or half solutions
    for e, v in ((x**2 - 9*x, x), (3*x**2 - 48, x), ((x + 3)**2 - 16, x), (3*x**2 + 6*x - 24, x),
                 (x**2 - 6*x + 5, x), (x**2 + 8*x + 16, x), (x**2 - 4*x + 7, x), (-x**2 + 6*x - 5, x),
                 (a*(13 - a) - 40, a), (x**2 + 6*x + 9, x), (x**2 - 6*x + 9, x)):
        P = sp.Poly(sp.expand(e), v)
        lead, b, c0 = P.all_coeffs()
        assert all(abs(k) <= 50 for k in (lead, b, c0))
        pp, qq = sp.Rational(b, lead), sp.Rational(c0, lead)
        assert pp.is_integer and qq.is_integer
        d = (pp / 2)**2 - qq
        if d >= 0:
            r = sp.sqrt(d)
            assert r.is_rational and r.q <= 2 and r.p <= 20
            assert all(s.q <= 2 and abs(s) <= 20 for s in (-pp / 2 + r, -pp / 2 - r))


Q.verify(check)
Q.save()
