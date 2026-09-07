#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 10: Matrizen - Begriff, Format, spezielle Matrizen, Darstellung A*x = b.
Deck: tools/pptx/build_matrizen_mathe11.py - Quiz: HTML/mathetest11-matrizen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-matrizen", "Matrizen: Begriff und Darstellung", kw=10)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Müsli-Manufaktur", 1,
       r"Eine kleine Manufaktur füllt drei Müslisorten in $500$-g-Packungen. Rezept je Packung in Gramm: **Frucht**: $300$ Haferflocken, $50$ Nüsse, $150$ Trockenfrüchte, keine Schokolade. **Nuss**: $300$ Haferflocken, $150$ Nüsse, $50$ Trockenfrüchte, keine Schokolade. **Schoko**: $350$ Haferflocken, $50$ Nüsse, keine Trockenfrüchte, $100$ Schokostücke.",
       [r"Schreibe die Rezepte als Matrix $Z$: Zeilen sind die Sorten, Spalten die Zutaten in der genannten Reihenfolge. Welches Format hat $Z$, wie viele Einträge?",
        r"Was bedeuten die Einträge $z_{23}$ und $z_{32}$ im Sachzusammenhang? Warum darf man die beiden Indizes nicht vertauschen?",
        r"Bilde $Z^\mathsf{T}$. Welches Format hat die transponierte Matrix, und was steht jetzt in einer Zeile? Ist eine der beiden Matrizen quadratisch?",
        r"Ein Bioladen bestellt $20$ Packungen Frucht, $10$ Packungen Nuss und $30$ Packungen Schoko. Schreibe die Bestellung als Spaltenvektor $\vec{n}$ und gib sein Format an. Welche Zeilensumme hat jede Zeile von $Z$, und warum?"],
       solution=[
        r"$Z = \begin{pmatrix} 300 & 50 & 150 & 0 \\ 300 & 150 & 50 & 0 \\ 350 & 50 & 0 & 100 \end{pmatrix}$. Drei Zeilen (Sorten), vier Spalten (Zutaten): Format $3 \times 4$, also $3 \cdot 4 = 12$ Einträge. Zeilen zuerst, Spalten danach.",
        r"$z_{23}$: Zeile $2$, Spalte $3$, also Sorte Nuss, Zutat Trockenfrüchte: $50$ g. $z_{32}$: Zeile $3$, Spalte $2$, also Sorte Schoko, Zutat Nüsse: ebenfalls $50$ g. Die Zahl ist zufällig dieselbe, die Bedeutung nicht. Der erste Index ist immer die Zeile; vertauscht man ihn, landet man bei einer anderen Sorte und einer anderen Zutat.",
        r"$Z^\mathsf{T} = \begin{pmatrix} 300 & 300 & 350 \\ 50 & 150 & 50 \\ 150 & 50 & 0 \\ 0 & 0 & 100 \end{pmatrix}$, Format $4 \times 3$. Jetzt ist jede Zeile eine **Zutat** und zeigt, wie viel davon in jede der drei Sorten geht, etwa Zeile $4$: Schokostücke nur in Sorte $3$. Keine der beiden ist quadratisch, dafür müssten Zeilen- und Spaltenzahl gleich sein.",
        r"$\vec{n} = \begin{pmatrix} 20 \\ 10 \\ 30 \end{pmatrix}$, Format $3 \times 1$: eine Zeile je Sorte, in derselben Reihenfolge wie die Zeilen von $Z$. Jede Zeile von $Z$ hat die Summe $500$: $300 + 50 + 150 + 0 = 500$, $300 + 150 + 50 + 0 = 500$, $350 + 50 + 0 + 100 = 500$, denn jede Packung wiegt $500$ g. Die Zeilensumme ist die Probe für das Rezept."],
       falle=r"Falle in c): beim Transponieren wandert $z_{23} = 50$ an die Stelle $(3, 2)$ und $z_{32} = 50$ an die Stelle $(2, 3)$. Dass hier beide $50$ sind, ist Zufall; $z_{13} = 150$ steht danach an der Stelle $(3, 1)$.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Kioskkasse", 2,
       r"Am Schulkiosk ist der Bondrucker ausgefallen. Im Kassenbuch stehen nur die Stückzahlen und die Tageseinnahmen: **Montag** $4$ Kaffee, $6$ Brötchen, $2$ Croissants, zusammen $20{,}80$ €. **Dienstag** $5$ Kaffee, $3$ Brötchen, $4$ Croissants, zusammen $23{,}30$ €. **Mittwoch** $2$ Kaffee, $8$ Brötchen, $3$ Croissants, zusammen $20{,}00$ €. Die Preise $k$, $b$, $c$ sind unbekannt.",
       [r"Stelle das lineare Gleichungssystem für die drei Preise auf.",
        r"Schreibe es in der Form $A \cdot \vec{x} = \vec{b}$. Gib $A$, $\vec{x}$ und $\vec{b}$ mit ihren Formaten an. Wofür stehen die Zeilen, wofür die Spalten von $A$?",
        r"Gib die erweiterte Koeffizientenmatrix an. Erkläre, warum man die Unbekannten dabei weglassen darf und was passiert, wenn man in einer Zeile die Reihenfolge der Spalten vertauscht.",
        r"Die Kioskleiterin meint, die Preise seien $2{,}50$ €, $1{,}20$ € und $1{,}80$ €. Prüfe das durch Einsetzen in **alle** drei Gleichungen."],
       solution=[
        r"$4k + 6b + 2c = 20{,}80$, $\quad 5k + 3b + 4c = 23{,}30$, $\quad 2k + 8b + 3c = 20{,}00$. Jede Zeile ist ein Tag, jeder Summand ist Stückzahl mal Preis.",
        r"$A = \begin{pmatrix} 4 & 6 & 2 \\ 5 & 3 & 4 \\ 2 & 8 & 3 \end{pmatrix}$ mit Format $3 \times 3$, $\vec{x} = \begin{pmatrix} k \\ b \\ c \end{pmatrix}$ und $\vec{b} = \begin{pmatrix} 20{,}80 \\ 23{,}30 \\ 20{,}00 \end{pmatrix}$, beide $3 \times 1$. Zeilen von $A$: die Tage (Gleichungen). Spalten von $A$: die Produkte (Unbekannte), Spalte $1$ gehört zu $k$, Spalte $2$ zu $b$, Spalte $3$ zu $c$. Drei Spalten, drei Unbekannte.",
        r"$\begin{pmatrix} 4 & 6 & 2 & 20{,}80 \\ 5 & 3 & 4 & 23{,}30 \\ 2 & 8 & 3 & 20{,}00 \end{pmatrix}$, Format $3 \times 4$. Die Unbekannten stecken in der **Spaltenposition**: Spalte $1$ heißt immer $k$, Spalte $2$ immer $b$, also braucht man die Buchstaben nicht mitzuschreiben. Genau deshalb darf man die Spaltenreihenfolge in **einer** Zeile nicht vertauschen: dann stünde die Kaffeezahl in der Brötchenspalte, und die Zeile beschreibt einen anderen Tag, den es nie gab. Zeilen darf man vertauschen, das ändert nur die Reihenfolge der Tage.",
        r"Montag: $4 \cdot 2{,}50 + 6 \cdot 1{,}20 + 2 \cdot 1{,}80 = 10 + 7{,}20 + 3{,}60 = 20{,}80$. Dienstag: $5 \cdot 2{,}50 + 3 \cdot 1{,}20 + 4 \cdot 1{,}80 = 12{,}50 + 3{,}60 + 7{,}20 = 23{,}30$. Mittwoch: $2 \cdot 2{,}50 + 8 \cdot 1{,}20 + 3 \cdot 1{,}80 = 5 + 9{,}60 + 5{,}40 = 20{,}00$. Alle drei stimmen, die Preise passen zum Kassenbuch. Ob es die **einzigen** passenden Preise sind, klärt erst das Lösungsverfahren der nächsten Woche."],
       falle=r"Falle in b): $\vec{b}$ ist die rechte Seite, nicht der Brötchenpreis $b$. Zwei Dinge, die zufällig denselben Buchstaben tragen; der Pfeil macht den Unterschied.")

# -------------------------------------------------------------- AFB III ----
s.task("Die Fahrzeitentabelle", 3,
       r"Ein Lieferdienst notiert die Fahrzeiten in Minuten zwischen vier Stationen $A$, $B$, $C$, $D$ als Matrix, Zeile = Start, Spalte = Ziel: $F = \begin{pmatrix} 0 & 12 & 20 & 15 \\ 12 & 0 & 8 & 25 \\ 20 & 8 & 0 & 10 \\ 15 & 25 & 10 & 0 \end{pmatrix}$. Ein Praktikant hat dazu vier Behauptungen aufgeschrieben. Prüfe jede mit Begründung oder Gegenbeispiel.",
       [r"„$F$ ist symmetrisch, denn $F^\mathsf{T} = F$. Symmetrische Matrizen sind Diagonalmatrizen, also ist $F$ eine Diagonalmatrix.“",
        r"„Auf der Hauptdiagonale stehen nur Nullen, also ist $F$ die Nullmatrix.“ Erkläre außerdem, warum die Diagonale hier zwingend aus Nullen besteht.",
        r"„Wegen $F^\mathsf{T} = F$ genügt es, die Einträge oberhalb der Hauptdiagonale zu speichern.“ Wie viele Zahlen sind das bei $4$ Stationen, wie viele bei $n$ Stationen, wie viele bei $50$?",
        r"Im Berufsverkehr dauert die Fahrt von $A$ nach $B$ weiter $12$ Minuten, zurück aber $18$. Ist die neue Matrix noch symmetrisch? Was bedeutet $F^\mathsf{T}$ dann im Sachzusammenhang, und wie viele Zahlen muss man jetzt speichern?"],
       solution=[
        r"Der erste Teil stimmt: Spiegeln an der Hauptdiagonale ändert nichts, zum Beispiel $f_{12} = f_{21} = 12$ und $f_{34} = f_{43} = 10$, also $F^\mathsf{T} = F$. Der Schluss ist falsch: symmetrisch heißt nur $f_{ij} = f_{ji}$; eine Diagonalmatrix verlangt, dass **außerhalb** der Diagonale nur Nullen stehen. $F$ hat dort lauter Fahrzeiten ungleich null. Richtig ist die Umkehrung: jede Diagonalmatrix ist symmetrisch, denn außerhalb der Diagonale steht überall $0 = 0$.",
        r"Falsch. Die Nullmatrix hat **überall** Nullen, $F$ nur auf der Diagonale. Die Diagonale muss hier aus Nullen bestehen, weil $f_{ii}$ die Fahrzeit von einer Station zu sich selbst ist, und die ist $0$. Eine Matrix mit Nullen auf der Diagonale und Werten daneben ist also weder Null- noch Diagonalmatrix, sie hat einfach keinen besonderen Namen.",
        r"Richtig. Die Diagonale ist bekannt (Nullen), die untere Hälfte ist das Spiegelbild der oberen. Bei $4$ Stationen liegen oberhalb der Diagonale $3 + 2 + 1 = 6$ Einträge statt $16$. Allgemein: $n^2$ Einträge, davon $n$ auf der Diagonale, die Hälfte des Rests liegt oben: $\dfrac{n^2 - n}{2} = \dfrac{n(n - 1)}{2}$. Für $n = 50$: $\dfrac{50 \cdot 49}{2} = 1\,225$ Zahlen statt $2\,500$, nicht einmal die Hälfte.",
        r"Nein: jetzt ist $f_{12} = 12$, aber $f_{21} = 18$, also $F^\mathsf{T} \neq F$. Transponieren vertauscht Zeile und Spalte, also **Start und Ziel**: $F^\mathsf{T}$ ist die Tabelle der **Rückfahrten**. Ohne Symmetrie braucht man alle Einträge außerhalb der Diagonale, bei $4$ Stationen $16 - 4 = 12$, allgemein $n(n - 1)$, bei $50$ Stationen $2\,450$. Die Symmetrie war eine Annahme des Modells (Hin- und Rückweg gleich lang), keine Eigenschaft von Matrizen."],
       falle=r"„Symmetrisch, also diagonal“ verwechselt Bedingung und Folge. Die Einheitsmatrix ist beides, das verleitet dazu. Aber symmetrisch ist eine viel schwächere Eigenschaft.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    import sympy as sp
    # AFB I: recipe matrix, indices, transpose, row sums
    Z = sp.Matrix([[300, 50, 150, 0], [300, 150, 50, 0], [350, 50, 0, 100]])
    assert Z.shape == (3, 4) and Z.rows * Z.cols == 12
    assert Z[1, 2] == 50 and Z[2, 1] == 50 and Z[0, 2] == 150
    ZT = Z.T
    assert ZT.shape == (4, 3) and ZT == sp.Matrix([[300, 300, 350], [50, 150, 50], [150, 50, 0], [0, 0, 100]])
    assert ZT[2, 1] == Z[1, 2] and ZT[1, 2] == Z[2, 1] and ZT[2, 0] == 150
    assert all(sum(Z.row(i)) == 500 for i in range(3))
    assert sp.Matrix([20, 10, 30]).shape == (3, 1)
    # AFB II: kiosk system, the proposed prices satisfy every row, and they are the only ones
    A = sp.Matrix([[4, 6, 2], [5, 3, 4], [2, 8, 3]])
    b = sp.Matrix([F(2080, 100), F(2330, 100), F(2000, 100)])
    x = sp.Matrix([F(250, 100), F(120, 100), F(180, 100)])
    assert A.shape == (3, 3) and b.shape == (3, 1) and A.row_join(b).shape == (3, 4)
    assert A * x == b and A.det() != 0
    assert 10 + F(720, 100) + F(360, 100) == F(2080, 100)
    assert F(1250, 100) + F(360, 100) + F(720, 100) == F(2330, 100)
    assert 5 + F(960, 100) + F(540, 100) == 20
    # AFB III: travel-time matrix
    Fm = sp.Matrix([[0, 12, 20, 15], [12, 0, 8, 25], [20, 8, 0, 10], [15, 25, 10, 0]])
    assert Fm.T == Fm and Fm[0, 1] == Fm[1, 0] == 12 and Fm[2, 3] == Fm[3, 2] == 10
    assert not Fm.is_diagonal() and not Fm.is_zero_matrix and all(Fm[i, i] == 0 for i in range(4))
    assert 3 + 2 + 1 == 6 and 4 * 4 == 16
    upper = lambda n: n * (n - 1) // 2
    assert upper(4) == 6 and upper(50) == 1225 and 50 * 50 == 2500 and 1225 < 2500 / 2
    assert 16 - 4 == 12 and 4 * 3 == 12 and 50 * 49 == 2450
    G = Fm.copy(); G[1, 0] = 18
    assert G.T != G and G[0, 1] == 12 and G[1, 0] == 18


s.verify(check)
s.save()
