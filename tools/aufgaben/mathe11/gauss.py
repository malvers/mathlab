#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 11: Gauss-Verfahren - drei Gleichungen, drei Unbekannte, ohne Hilfsmittel.
Deck: tools/pptx/build_gauss_mathe11.py - Quiz: HTML/mathetest11-gauss.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-gauss", "Das Gauß-Verfahren", kw=11)

# ---------------------------------------------------------------- AFB I ----
s.task("Bälle für den Sportverein", 1,
       r"Ein Sportgeschäft liefert an drei Vereine, auf den Lieferscheinen fehlen die Einzelpreise. **Verein 1**: $1$ Fußball, $1$ Handball, $1$ Volleyball für $75$ €. **Verein 2**: $2$ Fußbälle, $1$ Handball, $3$ Volleybälle für $145$ €. **Verein 3**: $1$ Fußball, $2$ Handbälle, $3$ Volleybälle für $140$ €. Die Preise heißen $f$, $h$, $v$.",
       [r"Stelle das Gleichungssystem auf und schreibe die erweiterte Koeffizientenmatrix.",
        r"Bringe das System mit dem Gauß-Verfahren auf Stufenform. Notiere zu jedem Schritt die Zeilenumformung.",
        r"Berechne die drei Preise durch Rückwärtseinsetzen und mache die Probe in allen drei Ausgangsgleichungen.",
        r"Ein vierter Verein bestellt $5$ Fußbälle, $4$ Handbälle und $6$ Volleybälle. Was kostet das?"],
       solution=[
        r"$f + h + v = 75$, $\quad 2f + h + 3v = 145$, $\quad f + 2h + 3v = 140$. Erweiterte Koeffizientenmatrix: $\begin{pmatrix} 1 & 1 & 1 & 75 \\ 2 & 1 & 3 & 145 \\ 1 & 2 & 3 & 140 \end{pmatrix}$.",
        r"Zeile 2 minus $2 \cdot$ Zeile 1: $-h + v = -5$. Zeile 3 minus Zeile 1: $h + 2v = 65$. Jetzt die neue Zeile 3 plus die neue Zeile 2: $3v = 60$. Stufenform: $f + h + v = 75$, $\quad -h + v = -5$, $\quad 3v = 60$, als Matrix $\begin{pmatrix} 1 & 1 & 1 & 75 \\ 0 & -1 & 1 & -5 \\ 0 & 0 & 3 & 60 \end{pmatrix}$.",
        r"Von unten: $3v = 60$, also $v = 20$. Dann $-h + 20 = -5$, also $h = 25$. Dann $f + 25 + 20 = 75$, also $f = 30$. Probe in den **Ausgangsgleichungen**: $30 + 25 + 20 = 75$; $60 + 25 + 60 = 145$; $30 + 50 + 60 = 140$. Ein Fußball kostet $30$ €, ein Handball $25$ €, ein Volleyball $20$ €.",
        r"$5 \cdot 30 + 4 \cdot 25 + 6 \cdot 20 = 150 + 100 + 120 = 370$ €."],
       falle=r"Falle in c): die Probe in den umgeformten Zeilen sagt nichts, dort stimmt es auch nach einem Rechenfehler. Immer in die drei Ausgangsgleichungen einsetzen.")

# --------------------------------------------------------------- AFB II ----
s.task("Der vermessene Brückenbogen", 2,
       r"Ein Brückenbogen hat die Form einer Parabel $f(x) = ax^2 + bx + c$; $x$ ist der Abstand vom linken Auflager, $f(x)$ die Höhe des Bogens über der Fahrbahn, beides in Metern. Ein Vermessungstrupp misst drei Punkte: bei $x = 2$ ist der Bogen $3{,}6$ m hoch, bei $x = 5$ genau $7{,}5$ m und bei $x = 12$ genau $9{,}6$ m.",
       [r"Stelle aus den drei Messpunkten ein lineares Gleichungssystem für $a$, $b$ und $c$ auf.",
        r"Löse es mit dem Gauß-Verfahren. Tipp: nach dem Eliminieren von $c$ lassen sich die beiden Zeilen durch $3$ bzw. $10$ teilen.",
        r"Wie weit spannt der Bogen (Abstand der beiden Auflager), und wie hoch ist er in der Mitte?",
        r"Was bedeutet das Ergebnis $c = 0$ im Sachzusammenhang? Erkläre, warum drei Messpunkte nötig sind, indem du eine zweite Funktion angibst, die nur durch die ersten beiden Punkte geht."],
       solution=[
        r"Einsetzen der Punkte: $4a + 2b + c = 3{,}6$, $\quad 25a + 5b + c = 7{,}5$, $\quad 144a + 12b + c = 9{,}6$. Drei Unbekannte, drei Gleichungen, die Unbekannten sind die Koeffizienten, nicht $x$.",
        r"Zeile 2 minus Zeile 1: $21a + 3b = 3{,}9$, geteilt durch $3$: $7a + b = 1{,}3$. Zeile 3 minus Zeile 1: $140a + 10b = 6$, geteilt durch $10$: $14a + b = 0{,}6$. Neue Zeile 3 minus neue Zeile 2: $7a = -0{,}7$, also $a = -0{,}1$. Rückwärts: $b = 1{,}3 - 7 \cdot (-0{,}1) = 2$ und $c = 3{,}6 - 4 \cdot (-0{,}1) - 2 \cdot 2 = 0$. Also $f(x) = -0{,}1x^2 + 2x$. Probe: $f(2) = -0{,}4 + 4 = 3{,}6$; $f(5) = -2{,}5 + 10 = 7{,}5$; $f(12) = -14{,}4 + 24 = 9{,}6$.",
        r"Auflager sind die Nullstellen: $-0{,}1x^2 + 2x = x \cdot (-0{,}1x + 2) = 0$, also $x = 0$ oder $x = 20$. Spannweite $20$ m. Die Mitte liegt aus Symmetriegründen bei $x = 10$: $f(10) = -10 + 20 = 10$ m Höhe.",
        r"$c = f(0) = 0$: am linken Auflager, bei $x = 0$, hat der Bogen die Höhe $0$, er beginnt auf Fahrbahnhöhe. Das passt zur Messanordnung. Drei Unbekannte brauchen drei unabhängige Gleichungen; mit zwei Punkten bleibt eine Wahlfreiheit. Beispiel: die Gerade $g(x) = 1{,}3x + 1$ (also $a = 0$) geht durch $(2 \mid 3{,}6)$ und $(5 \mid 7{,}5)$, denn $2{,}6 + 1 = 3{,}6$ und $6{,}5 + 1 = 7{,}5$, aber nicht durch $(12 \mid 9{,}6)$, denn $g(12) = 16{,}6$. Erst der dritte Punkt legt $a$ fest."],
       falle=r"Falle in a): $x$ ist hier keine Unbekannte, sondern eine gemessene Zahl. Unbekannt sind $a$, $b$, $c$; wer nach $x$ auflösen will, hat das Problem nicht verstanden.")

# -------------------------------------------------------------- AFB III ----
s.task("Drei Dünger, ein Rezept?", 3,
       r"Eine Gärtnerei mischt aus drei Düngern $100$ kg Blumendünger. Die Gehalte in Prozent, jeweils Stickstoff (N), Phosphor (P), Kalium (K): **Dünger A** $20 / 10 / 10$, **Dünger B** $10 / 10 / 20$, **Dünger C** $15 / 10 / 15$. Die Mischung soll $16$ kg N, $10$ kg P und $14$ kg K enthalten. Der Gärtner behauptet: **„Drei Gleichungen, drei Unbekannte, also gibt es genau eine Rezeptur.“** Die Mengen heißen $a$, $b$, $c$ in kg.",
       [r"Stelle die Gleichungen für N, P und K auf. Was fällt an der P-Gleichung auf?",
        r"Führe das Gauß-Verfahren durch. Was steht in der letzten Zeile?",
        r"Beurteile die Behauptung. Gib zwei verschiedene brauchbare Rezepturen an und begründe an der Zusammensetzung von C, warum es nicht genau eine gibt.",
        r"Ein Kunde wünscht stattdessen $18$ kg N, $10$ kg P und $14$ kg K. Zeige mit dem Gauß-Verfahren, was passiert, und erkläre das Ergebnis am Düngerregal."],
       solution=[
        r"N: $0{,}2a + 0{,}1b + 0{,}15c = 16$, P: $0{,}1a + 0{,}1b + 0{,}1c = 10$, K: $0{,}1a + 0{,}2b + 0{,}15c = 14$. Die P-Gleichung ist mal $10$ genau $a + b + c = 100$, die Massenbilanz: alle drei Dünger haben $10\,\%$ Phosphor, also hat jede $100$-kg-Mischung automatisch $10$ kg P. Mit $20$ multipliziert werden die anderen beiden ganzzahlig: $4a + 2b + 3c = 320$ und $2a + 4b + 3c = 280$.",
        r"Zeile 1: $a + b + c = 100$. Zeile 2 minus $4 \cdot$ Zeile 1: $-2b - c = -80$, also $2b + c = 80$. Zeile 3 minus $2 \cdot$ Zeile 1: $2b + c = 80$. Die beiden neuen Zeilen sind gleich, ihre Differenz ergibt $0 = 0$. Eine wahre, aber leere Aussage: die dritte Gleichung war überflüssig, das System hat **unendlich viele** Lösungen.",
        r"Die Behauptung ist falsch: drei Gleichungen sind nur dann drei Bedingungen, wenn keine aus den anderen folgt. Aus $2b + c = 80$ folgt $b = 40 - \dfrac{c}{2}$ und $a = 100 - b - c = 60 - \dfrac{c}{2}$. Für $c = 0$: $a = 60$, $b = 40$. Für $c = 20$: $a = 50$, $b = 30$. Probe für die zweite: N $10 + 3 + 3 = 16$, K $5 + 6 + 3 = 14$, Masse $100$. Grund: C ist genau das **Mittel aus A und B**, $\dfrac{20 + 10}{2} = 15$, $\dfrac{10 + 10}{2} = 10$, $\dfrac{10 + 20}{2} = 15$. Also wirken $20$ kg C wie $10$ kg A plus $10$ kg B, und C bringt keine neue Bedingung ins Spiel. Brauchbar sind alle $c$ von $0$ bis $80$ kg; bei $c = 80$ ist $b = 0$.",
        r"Rechte Seiten jetzt $360$, $100$, $280$. Zeile 2 minus $4 \cdot$ Zeile 1: $2b + c = 40$. Zeile 3 minus $2 \cdot$ Zeile 1: $2b + c = 80$. Differenz: $0 = 40$, eine falsche Aussage, **keine Lösung**. Am Regal sieht man warum: in jedem der drei Dünger machen N und K zusammen $30\,\%$ aus. $100$ kg Mischung enthalten also immer genau $30$ kg N plus K, egal wie man mischt. Gewünscht sind $18 + 14 = 32$ kg, das kann keine Rezeptur leisten. Der Widerspruch im Gauß-Verfahren ist die Rechenform dieser Sachgrenze."],
       falle=r"Drei Gleichungen sind nicht automatisch drei unabhängige Bedingungen. Erst die letzte Zeile der Stufenform verrät, ob genau eine, keine oder unendlich viele Lösungen dastehen.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    import sympy as sp
    # AFB I: ball prices via Gauss, unique solution
    A = sp.Matrix([[1, 1, 1], [2, 1, 3], [1, 2, 3]]); b = sp.Matrix([75, 145, 140])
    sol = A.LUsolve(b)
    assert list(sol) == [30, 25, 20] and A.det() != 0
    M = A.row_join(b)
    M[1, :] = M[1, :] - 2 * M[0, :]; M[2, :] = M[2, :] - M[0, :]
    assert list(M[1, :]) == [0, -1, 1, -5] and list(M[2, :]) == [0, 1, 2, 65]
    M[2, :] = M[2, :] + M[1, :]
    assert list(M[2, :]) == [0, 0, 3, 60]
    assert 60 // 3 == 20 and -(-5) + 20 == 25 and 75 - 25 - 20 == 30
    assert 30 + 25 + 20 == 75 and 60 + 25 + 60 == 145 and 30 + 50 + 60 == 140
    assert 5 * 30 + 4 * 25 + 6 * 20 == 370
    # AFB II: parabola through three points
    P = sp.Matrix([[4, 2, 1], [25, 5, 1], [144, 12, 1]]); h = sp.Matrix([F(36, 10), F(75, 10), F(96, 10)])
    a, bb, c = P.LUsolve(h)
    assert (a, bb, c) == (F(-1, 10), 2, 0)
    assert 21 * a + 3 * bb == F(39, 10) and 140 * a + 10 * bb == 6
    assert 7 * a + bb == F(13, 10) and 14 * a + bb == F(6, 10) and 7 * a == F(-7, 10)
    f = lambda x: a * x ** 2 + bb * x + c
    assert f(2) == F(36, 10) and f(5) == F(75, 10) and f(12) == F(96, 10)
    assert f(0) == 0 and f(20) == 0 and f(10) == 10
    g = lambda x: F(13, 10) * x + 1
    assert g(2) == F(36, 10) and g(5) == F(75, 10) and g(12) == F(166, 10) and F(75 - 36, 30) == F(13, 10)
    # AFB III: fertiliser, dependent columns -> infinitely many, then contradiction
    N = sp.Matrix([[F(2, 10), F(1, 10), F(15, 100)], [F(1, 10), F(1, 10), F(1, 10)], [F(1, 10), F(2, 10), F(15, 100)]])
    assert N.det() == 0 and N.rank() == 2
    assert 20 * N.row(0) == sp.Matrix([[4, 2, 3]]) and 20 * N.row(2) == sp.Matrix([[2, 4, 3]])
    assert N.col(2) == (N.col(0) + N.col(1)) / 2          # C is the mean of A and B
    aug = sp.Matrix([[1, 1, 1, 100], [4, 2, 3, 320], [2, 4, 3, 280]])
    aug[1, :] = aug[1, :] - 4 * aug[0, :]; aug[2, :] = aug[2, :] - 2 * aug[0, :]
    assert list(aug[1, :]) == [0, -2, -1, -80] and list(aug[2, :]) == [0, 2, 1, 80]
    t = sp.symbols("t")
    for cc in (0, 20, 80):
        bb_ = 40 - F(cc, 2); aa_ = 60 - F(cc, 2)
        assert aa_ + bb_ + cc == 100 and 4 * aa_ + 2 * bb_ + 3 * cc == 320 and 2 * aa_ + 4 * bb_ + 3 * cc == 280
    assert (60 - F(20, 2), 40 - F(20, 2)) == (50, 30) and 10 + 3 + 3 == 16 and 5 + 6 + 3 == 14
    # aug was row-reduced in place above - solve the ORIGINAL system, not the reduced one
    orig = sp.Matrix([[1, 1, 1], [4, 2, 3], [2, 4, 3]])
    assert sp.linsolve((orig, sp.Matrix([100, 320, 280])), sp.symbols("a b c")) != sp.EmptySet
    bad = sp.Matrix([[1, 1, 1], [4, 2, 3], [2, 4, 3]]); rhs = sp.Matrix([100, 360, 280])
    assert sp.linsolve((bad, rhs), sp.symbols("a b c")) == sp.EmptySet
    assert 360 - 4 * 100 == -40 and 280 - 2 * 100 == 80 and 80 - 40 == 40
    assert F(30, 100) * 100 == 30 and 18 + 14 == 32 and 32 > 30


s.verify(check)
s.save()
