#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 25: Jahresrueckblick ueber vier Lernbereiche, Ausblick auf Klasse 12.
Deck: tools/pptx/build_jahresrueckblick_mathe11.py - Quiz: HTML/mathetest11-jahresrueckblick.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-jahresrueckblick", "Jahresrückblick", kw=25)

# ---------------------------------------------------------------- AFB I ----
s.task("Vier Lernbereiche in vier Aufgaben", 1,
       r"Einmal quer durch das Jahr: **(1)** Löse $3(x - 4) = 2x + 1$. **(2)** Untersuche $f(x) = x^2 - 6x + 5$. **(3)** Löse das System $2x + y = 7$ und $x - y = 2$. **(4)** Ein Würfel wird zweimal geworfen.",
       [r"Löse Gleichung (1) und mache die Probe.",
        r"Bestimme für (2) den Scheitelpunkt und die Nullstellen.",
        r"Löse das Gleichungssystem (3).",
        r"Berechne für (4) die Wahrscheinlichkeit, dass beide Würfe eine gerade Zahl zeigen, und die für mindestens eine Sechs."],
       solution=[
        r"Klammer zuerst: $3x - 12 = 2x + 1$, sortieren $x = 13$. Probe: links $3(13 - 4) = 3 \cdot 9 = 27$, rechts $2 \cdot 13 + 1 = 27$ — stimmt.",
        r"Scheitel: $x_S = -\dfrac{-6}{2} = 3$ und $f(3) = 9 - 18 + 5 = -4$, also $S(3 \mid -4)$. Nullstellen über Vieta: gesucht sind zwei Zahlen mit Summe $6$ und Produkt $5$, das sind $1$ und $5$. Der Scheitel liegt genau in der Mitte zwischen ihnen.",
        r"Addieren beider Gleichungen beseitigt $y$: $3x = 9$, also $x = 3$ und aus der zweiten Gleichung $y = 1$. Probe: $2 \cdot 3 + 1 = 7$ und $3 - 1 = 2$.",
        r"Beide gerade: $\dfrac{3}{6} \cdot \dfrac{3}{6} = \dfrac{1}{4}$. Mindestens eine Sechs über das Gegenereignis: $1 - \left(\dfrac{5}{6}\right)^2 = 1 - \dfrac{25}{36} = \dfrac{11}{36} \approx 0{,}306$."],
       falle=r"Der Scheitel liegt immer **mittig zwischen den Nullstellen**, hier bei $\dfrac{1 + 5}{2} = 3$. Diese Beziehung ist eine kostenlose Kontrolle für beide Rechnungen.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Schülerfirma rechnet ab", 2,
       r"Eine Schülerfirma verkauft ein Produkt. Der Gewinn bei $x$ verkauften Stück beträgt $G(x) = -0{,}2x^2 + 12x - 100$ Euro. Für die Herstellung werden zwei Rohstoffe gebraucht: insgesamt $30$ Einheiten für die geplante Menge, und die Kostenrechnung ergibt $2a + 5b = 105$ Euro.",
       [r"Bei welcher Stückzahl ist der Gewinn am größten, und wie hoch ist er?",
        r"Bestimme die Gewinnschwelle und die Gewinngrenze.",
        r"Löse das System $a + b = 30$ und $2a + 5b = 105$ für die beiden Rohstoffmengen.",
        r"Welche Lernbereiche des Jahres stecken in dieser einen Aufgabe? Ordne jedem Teil einen zu."],
       solution=[
        r"$x_S = -\dfrac{12}{2 \cdot (-0{,}2)} = \dfrac{12}{0{,}4} = 30$. Gewinn dort: $G(30) = -0{,}2 \cdot 900 + 360 - 100 = -180 + 260 = 80$ €. Das Maximum liegt bei **$30$ Stück mit $80$ € Gewinn**.",
        r"$-0{,}2x^2 + 12x - 100 = 0$, mal $-5$ ergibt $x^2 - 60x + 500 = 0$. pq-Formel: $x_{1,2} = 30 \pm \sqrt{900 - 500} = 30 \pm 20$. Also $x = 10$ und $x = 50$: Gewinn wird zwischen $10$ und $50$ verkauften Stück gemacht. Probe: $G(10) = -20 + 120 - 100 = 0$ und $G(50) = -500 + 600 - 100 = 0$.",
        r"Aus der ersten Gleichung $a = 30 - b$, eingesetzt: $2(30 - b) + 5b = 105$, also $60 + 3b = 105$ und $b = 15$. Damit $a = 15$. Probe: $15 + 15 = 30$ und $30 + 75 = 105$.",
        r"Teil a) und b) gehören zu **Lernbereich 3**, den Funktionen: Scheitelpunkt als Extremwert und Nullstellen als Gewinnschwelle. Teil b) braucht zusätzlich die quadratische Gleichung aus **Lernbereich 2**. Teil c) ist ein lineares Gleichungssystem und damit **Lernbereich 4**. Fehlt nur die Stochastik aus **Lernbereich 1** — sie käme ins Spiel, sobald man nach der Wahrscheinlichkeit fragt, dass ein Stück fehlerhaft ist."],
       falle=r"Die Frage entscheidet, welche Stelle der Parabel gebraucht wird: der **Scheitel** für den größten Gewinn, die **Nullstellen** für die Gewinnzone. Beides zu verwechseln kostet in jeder Klassenarbeit Punkte.")

# -------------------------------------------------------------- AFB III ----
s.task("Was davon trägt bis Klasse 12?", 3,
       r"Ein Mitschüler sagt: **„In Klasse 12 kommt sowieso alles neu, das Zeug aus der 11 kann ich vergessen.“** In Klasse 12 lernt man unter anderem die **Ableitung**: für $f(x) = x^2 - 6x + 5$ ist $f'(x) = 2x - 6$, und an einer Extremstelle ist die Ableitung null.",
       [r"Berechne die Nullstelle von $f'$ und vergleiche sie mit dem Scheitelpunkt aus Aufgabe 1.",
        r"Wende dasselbe auf die Gewinnfunktion $G(x) = -0{,}2x^2 + 12x - 100$ an; ihre Ableitung ist $G'(x) = -0{,}4x + 12$. Vergleiche mit deinem Ergebnis aus Aufgabe 2.",
        r"Welche Werkzeuge aus Klasse 11 brauchst du, um mit einer Ableitung überhaupt etwas anfangen zu können? Nenne mindestens drei.",
        r"Beurteile die Aussage."],
       solution=[
        r"$2x - 6 = 0$ ergibt $x = 3$ — genau die Scheitelstelle aus Aufgabe 1. Das neue Verfahren liefert dasselbe Ergebnis wie die bekannte Formel $x_S = -\dfrac{b}{2a}$, nur allgemeiner: es funktioniert auch für Funktionen, die keine Parabeln sind.",
        r"$-0{,}4x + 12 = 0$ ergibt $x = \dfrac{12}{0{,}4} = 30$ — dieselbe Stückzahl wie in Aufgabe 2. Auch hier bestätigt die Ableitung, was der Scheitel schon gesagt hat.",
        r"Erstens **Gleichungen lösen**: die Ableitung nützt nichts, wenn man $f'(x) = 0$ nicht auflösen kann — und das ist oft eine quadratische Gleichung. Zweitens **Termumformungen**: Klammern, Potenzen, Brüche, sonst kommt man beim Ableiten selbst nicht weit. Drittens der **Funktionsbegriff** samt Definitionsbereich, Nullstellen und Monotonie — die Ableitung beantwortet Fragen über eine Funktion, die man erst einmal verstehen muss. Dazu kommen Exponentialfunktion und Logarithmus, die in Klasse 12 abgeleitet werden.",
        r"Die Aussage ist falsch. Klasse 12 bringt neue **Fragen**, beantwortet sie aber mit den Werkzeugen aus Klasse 11. Wer quadratische Gleichungen nicht sicher löst, scheitert nicht am Ableiten, sondern an der Zeile danach. Und wie die beiden Rechnungen zeigen, ist das Neue oft die Verallgemeinerung des Bekannten: der Scheitel war der Spezialfall, die Ableitung ist die allgemeine Methode."],
       falle=r"„Neues Verfahren, neues Ergebnis“ ist ein Trugschluss. Wenn Ableitung und Scheitelformel verschiedene Stellen liefern, ist nicht die Mathematik uneins — dann steckt ein Rechenfehler drin.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    import sympy as sp
    x = sp.symbols("x")
    assert sp.solve(3 * (x - 4) - (2 * x + 1), x) == [13]
    assert 3 * (13 - 4) == 27 and 2 * 13 + 1 == 27
    f = lambda t: t ** 2 - 6 * t + 5
    assert f(3) == -4 and sp.solve(x ** 2 - 6 * x + 5, x) == [1, 5]
    assert F(1 + 5, 2) == 3 and -(-6) / 2 == 3
    y = sp.symbols("y")
    assert sp.solve([2 * x + y - 7, x - y - 2], [x, y]) == {x: 3, y: 1}
    assert F(3, 6) * F(3, 6) == F(1, 4) and 1 - F(5, 6) ** 2 == F(11, 36)
    assert abs(float(F(11, 36)) - 0.3056) < 1e-4
    # student company
    G = lambda t: -0.2 * t ** 2 + 12 * t - 100
    assert -12 / (2 * -0.2) == 30 and abs(G(30) - 80) < 1e-9
    assert sp.solve(x ** 2 - 60 * x + 500, x) == [10, 50]
    assert abs(G(10)) < 1e-9 and abs(G(50)) < 1e-9 and 900 - 500 == 400
    a, b = sp.symbols("a b")
    assert sp.solve([a + b - 30, 2 * a + 5 * b - 105], [a, b]) == {a: 15, b: 15}
    assert 15 + 15 == 30 and 2 * 15 + 5 * 15 == 105
    # derivative agrees with the vertex
    fp = sp.diff(x ** 2 - 6 * x + 5, x)
    assert fp == 2 * x - 6 and sp.solve(fp, x) == [3]
    Gp = sp.diff(sp.Rational(-1, 5) * x ** 2 + 12 * x - 100, x)
    assert sp.solve(Gp, x) == [30] and abs(12 / 0.4 - 30) < 1e-12


s.verify(check)
s.save()
