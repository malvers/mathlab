#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 14: Matrizenoperationen und grosse LGS mit CAS - Abschluss LB 4.
Deck: tools/pptx/build_cas_lgs_mathe11.py - Quiz: HTML/mathetest11-cas-lgs.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-cas-lgs", "Rechnen mit Matrizen", kw=14)

# ---------------------------------------------------------------- AFB I ----
s.task("Zwei Filialen, zwei Wochen", 1,
       r"Ein Betrieb führt die verkauften Stückzahlen zweier Produkte in zwei Filialen als Matrix. Zeilen sind die Filialen, Spalten die Produkte. Woche 1: $A = \begin{pmatrix} 12 & 8 \\ 5 & 15 \end{pmatrix}$, Woche 2: $B = \begin{pmatrix} 10 & 14 \\ 7 & 9 \end{pmatrix}$.",
       [r"Berechne $A + B$ und sage, was der Eintrag oben rechts bedeutet.",
        r"Berechne $B - A$ und deute die Vorzeichen.",
        r"Berechne $1{,}5 \cdot A$. In welcher Situation wäre diese Rechnung sinnvoll?",
        r"Warum lässt sich $A$ nicht zu einer Matrix mit drei Spalten addieren?"],
       solution=[
        r"$A + B = \begin{pmatrix} 22 & 22 \\ 12 & 24 \end{pmatrix}$. Addiert wird eintragsweise. Der Eintrag oben rechts, $22$, ist die Gesamtzahl des zweiten Produkts, die in der ersten Filiale in beiden Wochen verkauft wurde: $8 + 14$.",
        r"$B - A = \begin{pmatrix} -2 & 6 \\ 2 & -6 \end{pmatrix}$. Ein **negativer** Eintrag bedeutet einen Rückgang von Woche 1 auf Woche 2, ein positiver einen Zuwachs. Filiale 1 verkaufte zwei Stück weniger vom ersten und sechs mehr vom zweiten Produkt; in Filiale 2 ist es genau umgekehrt.",
        r"$1{,}5 \cdot A = \begin{pmatrix} 18 & 12 \\ 7{,}5 & 22{,}5 \end{pmatrix}$. Bei der Multiplikation mit einer Zahl wird **jeder** Eintrag multipliziert. Sinnvoll wäre das etwa als Hochrechnung: „wir erwarten die anderthalbfache Menge“. Die halben Stück zeigen, dass es eine Prognose ist und keine Zählung.",
        r"Addiert werden darf nur bei **gleichem Format**. Die Addition geschieht Position für Position, und zu den Einträgen der dritten Spalte gäbe es in $A$ gar keinen Partner. $A$ ist eine $2 \times 2$-Matrix, die andere eine $2 \times 3$-Matrix — die Summe ist nicht definiert."],
       falle=r"Das Format wird **Zeilen mal Spalten** gelesen. Eine $2 \times 3$-Matrix hat zwei Zeilen und drei Spalten, nicht umgekehrt — bei der Addition entscheidet genau diese Reihenfolge.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Futtermischung", 2,
       r"Aus vier Komponenten soll eine Futtermischung von $100$ kg entstehen. Die Preise je Kilogramm sind $3$, $5$, $8$ und $12$ €, der Proteingehalt beträgt $0{,}1$, $0{,}2$, $0{,}3$ und $0{,}5$ kg je Kilogramm. Die Mischung soll $620$ € kosten und $24$ kg Protein enthalten, und von der vierten Komponente sind genau $10$ kg vorgeschrieben.",
       [r"Stelle das Gleichungssystem für die Mengen $a$, $b$, $c$ und $d$ auf.",
        r"Das CAS liefert $a = 20$, $b = 40$, $c = 30$, $d = 10$. Mache die Probe in allen vier Gleichungen.",
        r"Deute die Lösung: Welche Komponente dominiert, und wie teuer ist die Mischung je Kilogramm?",
        r"Der Kunde fordert nun $25$ kg Protein statt $24$ kg, alles andere bleibt. Das CAS gibt $a = -10$, $b = 90$, $c = 10$, $d = 10$ aus. Prüfe und beurteile."],
       solution=[
        r"Menge: $a + b + c + d = 100$. Preis: $3a + 5b + 8c + 12d = 620$. Protein: $0{,}1a + 0{,}2b + 0{,}3c + 0{,}5d = 24$. Vorgabe: $d = 10$. Das sind vier Gleichungen für vier Unbekannte.",
        r"Menge: $20 + 40 + 30 + 10 = 100$. Preis: $60 + 200 + 240 + 120 = 620$ €. Protein: $2 + 8 + 9 + 5 = 24$ kg. Vorgabe: $d = 10$. Alle vier Gleichungen sind erfüllt.",
        r"Mit $40$ kg dominiert die zweite Komponente, zusammen mit der dritten macht sie $70\,\%$ der Mischung aus. Der Preis je Kilogramm ist $\dfrac{620}{100} = 6{,}20$ €, der Proteinanteil $\dfrac{24}{100} = 24\,\%$.",
        r"Probe: $-10 + 90 + 10 + 10 = 100$; $-30 + 450 + 80 + 120 = 620$; $-1 + 18 + 3 + 5 = 25$. Rechnerisch ist die Lösung also **richtig**. Sachlich ist sie unmöglich: eine Menge von $-10$ kg gibt es nicht. Das CAS rechnet, ohne den Sachzusammenhang zu kennen — die geforderte Kombination aus Menge, Preis und Protein ist mit diesen vier Komponenten nicht herstellbar. Der Kunde muss eine Vorgabe lockern, etwa den Preis erhöhen oder die Vorgabe für $d$ aufgeben."],
       falle=r"„Das CAS hat gerechnet, also stimmt es“ gilt nur mathematisch. Nichtnegative Mengen, ganze Stückzahlen und Höchstgrenzen stehen in keiner Gleichung — sie müssen von Hand geprüft werden.")

# -------------------------------------------------------------- AFB III ----
s.task("Reihenfolge egal?", 3,
       r"Ein Mitschüler sagt: **„Matrizen multipliziert man wie Zahlen, die Reihenfolge ist doch egal.“** Untersucht wird das an $A = \begin{pmatrix} 1 & 2 \\ 0 & 1 \end{pmatrix}$ und $B = \begin{pmatrix} 1 & 0 \\ 3 & 1 \end{pmatrix}$.",
       [r"Berechne $A \cdot B$.",
        r"Berechne $B \cdot A$ und vergleiche mit a).",
        r"In der Computergrafik beschreiben Matrizen Drehungen und Verschiebungen. Was folgt aus deinem Ergebnis für die Reihenfolge solcher Schritte?",
        r"Beurteile die Behauptung. Welche Rechengesetze gelten für Matrizen trotzdem?"],
       solution=[
        r"Zeile mal Spalte: oben links $1 \cdot 1 + 2 \cdot 3 = 7$, oben rechts $1 \cdot 0 + 2 \cdot 1 = 2$, unten links $0 \cdot 1 + 1 \cdot 3 = 3$, unten rechts $0 \cdot 0 + 1 \cdot 1 = 1$. Also $A \cdot B = \begin{pmatrix} 7 & 2 \\ 3 & 1 \end{pmatrix}$.",
        r"$B \cdot A = \begin{pmatrix} 1 & 2 \\ 3 & 7 \end{pmatrix}$: oben links $1 \cdot 1 + 0 \cdot 0 = 1$, oben rechts $1 \cdot 2 + 0 \cdot 1 = 2$, unten links $3 \cdot 1 + 1 \cdot 0 = 3$, unten rechts $3 \cdot 2 + 1 \cdot 1 = 7$. Die beiden Ergebnisse sind **verschieden**, die Behauptung ist widerlegt.",
        r"Die Reihenfolge der Schritte ändert das Ergebnis. Erst drehen und dann verschieben führt an eine andere Stelle als erst verschieben und dann drehen — beim Drehen wandert die vorher gesetzte Verschiebung mit. Genau deshalb ist in der Grafikprogrammierung die Reihenfolge der Matrizen festgelegt und nicht beliebig.",
        r"Die Behauptung ist falsch: die Matrizenmultiplikation ist **nicht kommutativ**. Es gelten aber das **Assoziativgesetz** $(A \cdot B) \cdot C = A \cdot (B \cdot C)$ und das **Distributivgesetz** $A \cdot (B + C) = A \cdot B + A \cdot C$ — beim Umformen darf man also Klammern verschieben und ausmultiplizieren, nur eben die Faktoren nicht vertauschen."],
       falle=r"Auch die Formate müssen zusammenpassen: bei $A \cdot B$ braucht $A$ so viele Spalten, wie $B$ Zeilen hat. Deshalb kann $A \cdot B$ definiert sein und $B \cdot A$ überhaupt nicht.")


# ---------------------------------------------------------- numbers check ----
def check():
    import sympy as sp
    from fractions import Fraction as F
    A = sp.Matrix([[12, 8], [5, 15]])
    B = sp.Matrix([[10, 14], [7, 9]])
    assert A + B == sp.Matrix([[22, 22], [12, 24]]) and 8 + 14 == 22
    assert B - A == sp.Matrix([[-2, 6], [2, -6]])
    assert sp.Rational(3, 2) * A == sp.Matrix([[18, 12], [sp.Rational(15, 2), sp.Rational(45, 2)]])
    # feed mix
    a, b, c, d = sp.symbols("a b c d")
    eqs = [a + b + c + d - 100, 3 * a + 5 * b + 8 * c + 12 * d - 620,
           sp.Rational(1, 10) * a + sp.Rational(2, 10) * b + sp.Rational(3, 10) * c
           + sp.Rational(5, 10) * d - 24, d - 10]
    sol = sp.solve(eqs, [a, b, c, d], dict=True)[0]
    assert (sol[a], sol[b], sol[c], sol[d]) == (20, 40, 30, 10)
    assert 20 + 40 + 30 + 10 == 100 and 60 + 200 + 240 + 120 == 620
    assert F(1, 10) * 20 + F(2, 10) * 40 + F(3, 10) * 30 + F(5, 10) * 10 == 24
    assert F(620, 100) == F(31, 5) and F(24, 100) == F(6, 25) and 40 + 30 == 70
    eqs2 = eqs[:2] + [sp.Rational(1, 10) * a + sp.Rational(2, 10) * b
                      + sp.Rational(3, 10) * c + sp.Rational(5, 10) * d - 25, d - 10]
    sol2 = sp.solve(eqs2, [a, b, c, d], dict=True)[0]
    assert (sol2[a], sol2[b], sol2[c], sol2[d]) == (-10, 90, 10, 10)
    assert -10 + 90 + 10 + 10 == 100 and -30 + 450 + 80 + 120 == 620
    assert F(1, 10) * -10 + F(2, 10) * 90 + F(3, 10) * 10 + F(5, 10) * 10 == 25
    # matrix products do not commute
    M = sp.Matrix([[1, 2], [0, 1]])
    N = sp.Matrix([[1, 0], [3, 1]])
    assert M * N == sp.Matrix([[7, 2], [3, 1]]) and N * M == sp.Matrix([[1, 2], [3, 7]])
    assert M * N != N * M
    P = sp.Matrix([[2, 1], [1, 0]])
    assert (M * N) * P == M * (N * P) and M * (N + P) == M * N + M * P


s.verify(check)
s.save()
