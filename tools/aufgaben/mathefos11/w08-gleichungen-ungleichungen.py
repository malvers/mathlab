#!/usr/bin/env python3
"""Aufgaben FO Mathe 11, Woche 8 / KW 41 (LB 1): lineare Gleichungen und
Ungleichungen, Loesungsmengen in der Symbolik der Mengenlehre.
Plan: HTML/svp/mathe/mathefos11.html."""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from quiz import fos11

Q = fos11(nr=8, slug='gleichungen-ungleichungen', thema='Lineare Gleichungen und Ungleichungen', lb='LB 1',
          blurb='Äquivalenzumformungen, Sonderfälle, Ungleichungen, Lösungsmengen',
          comment='Blocks: lineare Gleichungen (1-7), Sonderfaelle und Umformungen (8-11), Ungleichungen (12-17), Anwendungen (18-20).')

# ----------------------------------------------------- lineare Gleichungen ----
Q.q(r'Löse: $5x - 3 = 12$.',
    [r'$x = 3$', r'$x = 1{,}8$', r'$x = 15$', r'$x = 9$'],
    [r'$+3$ auf beiden Seiten: $5x = 15$.',
     r'Durch $5$ teilen: $x = 3$.',
     r'Probe: $5 \cdot 3 - 3 = 12$.'])

Q.q(r'Löse: $4\,(x - 2) = 2x + 6$.',
    [r'$x = 7$', r'$x = 1$', r'$x = 2$', r'$x = 14$'],
    [r'Klammer ausmultiplizieren: $4x - 8 = 2x + 6$.',
     r'$2x = 14$, also $x = 7$.',
     r'Probe: $4 \cdot 5 = 20$ und $14 + 6 = 20$.'])

Q.q(r'Löse: $\dfrac{x}{3} + 2 = 5$.',
    [r'$x = 9$', r'$x = 21$', r'$x = 1$', r'$x = 15$'],
    [r'Zuerst $-2$: $\dfrac{x}{3} = 3$.',
     r'Dann mit $3$ multiplizieren: $x = 9$.',
     r'$21$ käme heraus, wenn man gleich mit $3$ multipliziert, ohne die $2$ mitzunehmen.'])

Q.q(r'Löse: $\dfrac{2x - 1}{5} = 3$.',
    [r'$x = 8$', r'$x = 7$', r'$x = 15$', r'$x = 2$'],
    [r'Mit $5$ multiplizieren — der ganze Zähler: $2x - 1 = 15$.',
     r'$2x = 16$, also $x = 8$.',
     r'Probe: $\dfrac{16 - 1}{5} = 3$.'])

Q.q(r'Löse: $3\,(x + 1) - 2\,(x - 4) = 12$.',
    [r'$x = 1$', r'$x = 5$', r'$x = -1$', r'$x = 23$'],
    [r'Ausmultiplizieren, Vorzeichen beachten: $3x + 3 - 2x + 8 = 12$.',
     r'Zusammenfassen: $x + 11 = 12$, also $x = 1$.',
     r'Probe: $3 \cdot 2 - 2 \cdot (-3) = 6 + 6 = 12$.'])

Q.q(r'Löse: $0{,}5x + 1{,}5 = 4$.',
    [r'$x = 5$', r'$x = 2{,}5$', r'$x = 11$', r'$x = 8$'],
    [r'$-1{,}5$: $0{,}5x = 2{,}5$.',
     r'Durch $0{,}5$ teilen ist dasselbe wie mit $2$ malnehmen: $x = 5$.',
     r'Probe: $2{,}5 + 1{,}5 = 4$.'])

Q.q(r'Wie schreibt man die Lösung von $5x - 3 = 12$ als Lösungsmenge?',
    [r'$L = \{3\}$', r'$L = 3$', r'$L = \{x = 3\}$', r'$L = \{5;\,3\}$'],
    [r'Die Lösungsmenge ist eine Menge, ihre Elemente stehen in geschweiften Klammern.',
     r'Hier enthält sie genau ein Element: $L = \{3\}$.',
     r'Die Gleichung selbst gehört nicht in die Menge, nur der Zahlenwert.'])

# --------------------------------------- Sonderfälle und Umformungen ----
Q.q(r'Wie lautet die Lösungsmenge von $2\,(x + 3) = 2x + 6$?',
    [r'$L = \mathbb{R}$', r'$L = \{\}$', r'$L = \{0\}$', r'$L = \{6\}$'],
    [r'Links ausmultiplizieren: $2x + 6 = 2x + 6$.',
     r'Beide Seiten sind für jedes $x$ gleich — eine wahre Aussage ohne $x$.',
     r'Jede reelle Zahl ist Lösung, also $L = \mathbb{R}$.'])

Q.q(r'Wie lautet die Lösungsmenge von $3x + 5 = 3x - 1$?',
    [r'$L = \{\}$', r'$L = \mathbb{R}$', r'$L = \{0\}$', r'$L = \{-2\}$'],
    [r'$3x$ auf beiden Seiten abziehen: $5 = -1$.',
     r'Das ist eine falsche Aussage, die gar nicht mehr von $x$ abhängt.',
     r'Es gibt also keine Lösung: $L = \{\}$, geschrieben auch $L = \emptyset$.'])

Q.q(r'Welche Umformung ist KEINE Äquivalenzumformung?',
    [r'Beide Seiten mit $x$ multiplizieren, ohne $x \neq 0$ zu sichern.',
     r'Auf beiden Seiten $7$ addieren.',
     r'Beide Seiten durch $3$ teilen.',
     r'Die beiden Seiten vertauschen.'],
    [r'Addieren, Subtrahieren und das Vertauschen der Seiten ändern die Lösungsmenge nie.',
     r'Multiplizieren und Dividieren nur mit einer Zahl, die sicher nicht null ist.',
     r'Die Multiplikation mit $x$ kann Scheinlösungen hinzufügen, die Division durch $x$ kann Lösungen verlieren.'])

Q.q(r'Beim Lösen von $\dfrac{6}{x} = 3$ gilt welche Vorbemerkung?',
    [r'$x \neq 0$, denn der Nenner darf nicht null werden.',
     r'$x > 3$, sonst wird der Bruch zu klein.',
     r'$x$ muss ganzzahlig sein.',
     r'Es ist keine Vorbemerkung nötig.'],
    [r'Vor dem Rechnen wird der Definitionsbereich geklärt.',
     r'Der Nenner $x$ darf nicht null sein, sonst ist der Term nicht definiert.',
     r'Die Lösung $x = 2$ liegt im Definitionsbereich und ist damit gültig.'])

# --------------------------------------------------------- Ungleichungen ----
Q.q(r'Löse: $x + 3 < 7$.',
    [r'$x < 4$', r'$x > 4$', r'$x < 10$', r'$x > -4$'],
    [r'$-3$ auf beiden Seiten.',
     r'$x < 4$',
     r'Beim Addieren und Subtrahieren bleibt das Ungleichheitszeichen stehen.'])

Q.q(r'Löse: $-2x > 6$.',
    [r'$x < -3$', r'$x > -3$', r'$x > 3$', r'$x < 3$'],
    [r'Durch $-2$ teilen.',
     r'Beim Teilen durch eine negative Zahl kippt das Zeichen um.',
     r'$x < -3$. Probe mit $x = -4$: $8 > 6$ stimmt; mit $x = 0$ wäre $0 > 6$ falsch.'])

Q.q(r'Löse: $3x - 1 \geq 8$.',
    [r'$x \geq 3$', r'$x \leq 3$', r'$x \geq \dfrac{7}{3}$', r'$x \geq 9$'],
    [r'$+1$: $3x \geq 9$.',
     r'Durch $3$ teilen, positive Zahl, das Zeichen bleibt: $x \geq 3$.',
     r'Probe mit $x = 3$: $8 \geq 8$ ist wahr, die Grenze gehört dazu.'])

Q.q(r'Löse: $4 - x \leq 1$.',
    [r'$x \geq 3$', r'$x \leq 3$', r'$x \geq -3$', r'$x \leq 5$'],
    [r'$-4$ auf beiden Seiten: $-x \leq -3$.',
     r'Mit $-1$ multiplizieren, das Zeichen kippt: $x \geq 3$.',
     r'Probe mit $x = 3$: $1 \leq 1$ stimmt.'])

Q.q(r'Wie schreibt man die Lösung von $3x - 1 \geq 8$ als Lösungsmenge?',
    [r'$L = \{x \in \mathbb{R} \mid x \geq 3\}$', r'$L = \{3\}$',
     r'$L = \{x \in \mathbb{R} \mid x > 3\}$', r'$L = \mathbb{R}$'],
    [r'Eine Ungleichung hat in der Regel unendlich viele Lösungen.',
     r'Sie werden beschrieben, nicht aufgezählt: $L = \{x \in \mathbb{R} \mid x \geq 3\}$.',
     r'Gelesen: alle reellen $x$, für die $x \geq 3$ gilt. Weil $\geq$ dasteht, gehört die $3$ dazu.'])

Q.q(r'Löse die Doppelungleichung $-1 < 2x + 1 < 5$.',
    [r'$-1 < x < 2$', r'$-1 < x < 5$', r'$0 < x < 3$', r'$-2 < x < 4$'],
    [r'Auf allen drei Teilen $-1$ rechnen: $-2 < 2x < 4$.',
     r'Alle drei Teile durch $2$ teilen: $-1 < x < 2$.',
     r'Probe mit $x = 0$: $-1 < 1 < 5$ stimmt.'])

# ------------------------------------------------------------ Anwendungen ----
Q.q(r'Eine Klassenkasse enthält $85$ €. Für jede Person kostet ein Ausflug $6{,}50$ €. Für wie viele Personen reicht das Geld höchstens?',
    [r'für $13$ Personen', r'für $14$ Personen', r'für $12$ Personen', r'für $78$ Personen'],
    [r'Ungleichung: $6{,}50\,n \leq 85$.',
     r'$n \leq \dfrac{85}{6{,}50} \approx 13{,}08$',
     r'Personen sind ganzzahlig, also höchstens $13$; das kostet $84{,}50$ €.'])

Q.q(r'Tarif A kostet $0{,}40$ € je Einheit, Tarif B kostet $8$ € Grundgebühr und $0{,}20$ € je Einheit. Ab welcher Menge ist B günstiger?',
    [r'ab mehr als $40$ Einheiten', r'ab mehr als $20$ Einheiten',
     r'ab mehr als $80$ Einheiten', r'B ist nie günstiger'],
    [r'Ungleichung: $0{,}20x + 8 < 0{,}40x$.',
     r'$8 < 0{,}20x$, also $x > 40$.',
     r'Bei genau $40$ Einheiten kosten beide $16$ € — darüber lohnt sich B.'])

Q.q(r'In einer Prüfung sind $60$ Punkte erreichbar. Zum Bestehen braucht man mindestens $45\,\%$. Wie viele Punkte sind das mindestens?',
    [r'$27$ Punkte', r'$26$ Punkte', r'$45$ Punkte', r'$15$ Punkte'],
    [r'$0{,}45 \cdot 60 = 27$',
     r'Die Bedingung lautet also $P \geq 27$.',
     r'Weil genau $27$ Punkte die Grenze sind und $\geq$ gilt, reichen sie aus.'])


def check():
    from fractions import Fraction as F
    import sympy as sp
    x = sp.Symbol('x', real=True)
    n = sp.Symbol('n', real=True)
    sol = lambda e: sp.solve(e, x)
    assert sol(5 * x - 3 - 12) == [3] and 5 * 3 - 3 == 12
    assert sol(4 * (x - 2) - (2 * x + 6)) == [7] and 4 * (7 - 2) == 20 == 2 * 7 + 6
    assert sol(x / 3 + 2 - 5) == [9] and F(9, 3) + 2 == 5
    assert sol((2 * x - 1) / 5 - 3) == [8] and F(2 * 8 - 1, 5) == 3
    assert sol(3 * (x + 1) - 2 * (x - 4) - 12) == [1]
    assert 3 * (1 + 1) - 2 * (1 - 4) == 12
    assert sol(F(1, 2) * x + F(3, 2) - 4) == [5] and F(1, 2) * 5 + F(3, 2) == 4
    # Sonderfaelle
    assert sp.simplify(2 * (x + 3) - (2 * x + 6)) == 0            # immer wahr
    assert sp.simplify((3 * x + 5) - (3 * x - 1)) == 6            # nie null -> keine Loesung
    assert sol(6 / x - 3) == [2]
    # Ungleichungen
    assert sp.solveset(x + 3 < 7, x, sp.S.Reals) == sp.Interval.open(-sp.oo, 4)
    assert sp.solveset(-2 * x > 6, x, sp.S.Reals) == sp.Interval.open(-sp.oo, -3)
    assert -2 * (-4) > 6 and not (-2 * 0 > 6)
    assert sp.solveset(3 * x - 1 >= 8, x, sp.S.Reals) == sp.Interval(3, sp.oo)
    assert 3 * 3 - 1 == 8
    assert sp.solveset(4 - x <= 1, x, sp.S.Reals) == sp.Interval(3, sp.oo) and 4 - 3 == 1
    # Doppelungleichung als Schnitt der beiden einzelnen Loesungsmengen pruefen
    links = sp.solveset(-1 < 2 * x + 1, x, sp.S.Reals)
    rechts = sp.solveset(2 * x + 1 < 5, x, sp.S.Reals)
    assert links.intersect(rechts) == sp.Interval.open(-1, 2)
    assert -1 < 2 * 0 + 1 < 5
    # Anwendungen
    assert F(85, 1) / F(650, 100) == F(170, 13) and abs(float(F(170, 13)) - 13.08) < 0.005
    assert F(650, 100) * 13 == F(169, 2) and abs(float(F(169, 2)) - 84.5) < 1e-9
    assert F(650, 100) * 14 > 85
    assert sp.solveset(F(20, 100) * x + 8 < F(40, 100) * x, x, sp.S.Reals) == sp.Interval.open(40, sp.oo)
    assert F(20, 100) * 40 + 8 == 16 == F(40, 100) * 40
    assert F(45, 100) * 60 == 27


Q.verify(check)
Q.save()
