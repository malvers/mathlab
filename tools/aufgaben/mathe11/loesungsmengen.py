#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 12: die drei Faelle beim LGS, Loesungsmengen aufschreiben und deuten.
Deck: tools/pptx/build_loesungsmengen_mathe11.py - Quiz: HTML/mathetest11-loesungsmengen.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-loesungsmengen", "Keine, eine, unendlich viele", kw=12)

# ---------------------------------------------------------------- AFB I ----
s.task("Drei Systeme aus dem Übungszirkel", 1,
       r"Im Übungszirkel liegen drei Systeme mit je zwei Gleichungen. **(1)** $x + y = 10$ und $2x - y = 2$. **(2)** $x + y = 10$ und $2x + 2y = 14$. **(3)** $x + y = 10$ und $3x + 3y = 30$.",
       [r"Löse System (1) und deute das Ergebnis geometrisch.",
        r"Untersuche System (2). Was passiert beim Rechnen, und wie lautet die Lösungsmenge?",
        r"Untersuche System (3) und gib die Lösungsmenge an.",
        r"Woran sieht man den Fall schon an den Koeffizienten, ohne zu rechnen?"],
       solution=[
        r"Addieren der beiden Gleichungen beseitigt $y$: $3x = 12$, also $x = 4$ und damit $y = 6$. Lösungsmenge $L = \{(4 \mid 6)\}$. Geometrisch sind es zwei Geraden, die sich in genau einem Punkt schneiden.",
        r"Die zweite Gleichung halbiert ergibt $x + y = 7$. Zusammen mit $x + y = 10$ folgt durch Subtraktion $0 = -3$ — eine **falsche** Aussage. Es gibt keine Lösung, also $L = \{\}$. Geometrisch sind die Geraden **parallel** und verschieden.",
        r"Die zweite Gleichung durch $3$ geteilt ergibt wieder $x + y = 10$. Die zweite Gleichung sagt also nichts Neues, es bleibt eine Gleichung mit zwei Unbekannten. Für jedes $x$ passt $y = 10 - x$: $L = \{(x \mid 10 - x) \mid x \in \mathbb{R}\}$. Geometrisch fallen die beiden Geraden **zusammen**.",
        r"Man vergleicht die Verhältnisse der Koeffizienten. Bei (2) ist $\dfrac{2}{1} = \dfrac{2}{1}$ für die linken Seiten, aber $\dfrac{14}{10} \neq 2$ für die rechte — gleiche Richtung, verschobene Lage, also parallel. Bei (3) stimmt auch das Verhältnis der rechten Seiten, $\dfrac{30}{10} = 3$ — dieselbe Gerade. Bei (1) sind die linken Verhältnisse schon verschieden, $\dfrac{2}{1} \neq \dfrac{-1}{1}$, also genau ein Schnittpunkt."],
       falle=r"Ein System hat nie zwei oder fünf Lösungen. Kommt beim Rechnen etwas anderes heraus als **keine**, **eine** oder **unendlich viele**, steckt ein Rechenfehler drin.")

# --------------------------------------------------------------- AFB II ----
s.task("Die Erdmischung", 2,
       r"Eine Gärtnerei mischt aus drei Erdsorten $x$, $y$ und $z$ (in Sack) eine Charge. Es gilt: $x + y + z = 60$ Sack insgesamt, $2x + 3y + 4z = 190$ Einheiten Nährstoff und $3x + 4y + 5z = 250$ Einheiten Volumen.",
       [r"Bringe das System mit dem Gauß-Verfahren auf Stufenform.",
        r"Welcher der drei Fälle liegt vor? Gib die Lösungsmenge mit einem Parameter an.",
        r"Alle drei Mengen müssen null oder positiv sein. Welche Werte darf der Parameter annehmen?",
        r"Gib eine konkrete Lösung an und mache die Probe in allen drei Gleichungen. Warum ist die Aufgabe unterbestimmt?"],
       solution=[
        r"Zweite Zeile minus zweimal die erste: $y + 2z = 70$. Dritte Zeile minus dreimal die erste: $y + 2z = 70$. Die Stufenform lautet also $x + y + z = 60$, $y + 2z = 70$ und in der dritten Zeile $0 = 0$.",
        r"Die dritte Zeile ist eine **wahre** Aussage ohne Information — es gibt unendlich viele Lösungen. Mit $z$ als Parameter: $y = 70 - 2z$ und $x = 60 - y - z = 60 - (70 - 2z) - z = z - 10$. Also $L = \{(z - 10 \mid 70 - 2z \mid z) \mid z \in \mathbb{R}\}$.",
        r"$x \geq 0$ verlangt $z \geq 10$. $y \geq 0$ verlangt $70 - 2z \geq 0$, also $z \leq 35$. Und $z \geq 0$ ist damit schon erfüllt. Sachlich sinnvoll ist also $10 \leq z \leq 35$.",
        r"Für $z = 20$: $y = 70 - 40 = 30$ und $x = 20 - 10 = 10$. Probe: $10 + 30 + 20 = 60$; $20 + 90 + 80 = 190$; $30 + 120 + 100 = 250$ — alle drei stimmen. Unterbestimmt ist die Aufgabe, weil die dritte Gleichung keine neue Information enthält: sie ist die Summe aus der ersten und der zweiten. Drei Gleichungen bedeuten nicht automatisch drei **unabhängige** Bedingungen."],
       falle=r"Bei unendlich vielen Lösungen ist die Antwort nicht „unlösbar“, sondern eine Lösungs**schar**. Erst der Sachzusammenhang engt sie ein — hier auf $26$ ganzzahlige Mischungen.")

# -------------------------------------------------------------- AFB III ----
s.task("Drei Gleichungen, drei Unbekannte, eine Lösung?", 3,
       r"Ein Mitschüler behauptet: **„Wenn ich genauso viele Gleichungen habe wie Unbekannte, gibt es immer genau eine Lösung.“**",
       [r"Widerlege die Behauptung mit dem System aus Aufgabe 2.",
        r"Ändere in diesem System die rechte Seite der dritten Gleichung von $250$ auf $251$ und rechne erneut. Was ergibt sich?",
        r"Woran erkennt man in der Stufenform, welcher der drei Fälle vorliegt?",
        r"Beurteile die Behauptung und deute alle drei Fälle geometrisch, wenn jede Gleichung eine Ebene im Raum beschreibt."],
       solution=[
        r"Das System aus Aufgabe 2 hat drei Gleichungen und drei Unbekannte, aber unendlich viele Lösungen — etwa $(10 \mid 30 \mid 20)$ und $(0 \mid 50 \mid 10)$, beide erfüllen alle drei Gleichungen. Ein Gegenbeispiel genügt, die Behauptung ist falsch.",
        r"Die ersten beiden Schritte sind dieselben: $y + 2z = 70$ aus der zweiten Zeile, aber nun $y + 2z = 71$ aus der dritten. Die Differenz ergibt $0 = 1$ — eine falsche Aussage. Jetzt ist $L = \{\}$, das System hat **keine** Lösung. Eine einzige geänderte Ziffer kippt den Fall.",
        r"Man liest die letzte Zeile: Steht dort $0 = 0$, gibt es unendlich viele Lösungen. Steht dort $0 = c$ mit $c \neq 0$, gibt es keine. Bleiben für jede Unbekannte eine eigene Stufe, also drei echte Stufen, gibt es genau eine Lösung.",
        r"Die Behauptung ist falsch. Jede Gleichung beschreibt eine Ebene. **Genau eine Lösung**: die drei Ebenen treffen sich in einem Punkt. **Unendlich viele**: sie schneiden sich in einer gemeinsamen Geraden, oder zwei Ebenen fallen zusammen. **Keine Lösung**: es gibt keinen Punkt, der auf allen dreien liegt — etwa bei parallelen Ebenen oder wenn die drei Schnittgeraden ein Prisma bilden."],
       falle=r"Gleich viele Gleichungen wie Unbekannte garantiert nichts. Entscheidend ist, ob die Gleichungen **unabhängig** sind — eine Gleichung, die die Summe zweier anderer ist, zählt nicht mit.")


# ---------------------------------------------------------- numbers check ----
def check():
    import sympy as sp
    x, y, z = sp.symbols("x y z")
    assert sp.solve([x + y - 10, 2 * x - y - 2], [x, y]) == {x: 4, y: 6}
    assert sp.solve([x + y - 10, 2 * x + 2 * y - 14], [x, y]) == []
    assert 14 / 2 == 7 and 7 - 10 == -3 and 30 / 3 == 10
    sol3 = sp.solve([x + y - 10, 3 * x + 3 * y - 30], [x, y])
    assert sol3 == {x: 10 - y}
    # the soil mix
    eqs = [x + y + z - 60, 2 * x + 3 * y + 4 * z - 190, 3 * x + 4 * y + 5 * z - 250]
    sol = sp.solve(eqs, [x, y, z], dict=True)
    assert len(sol) == 1 and sol[0][x] == z - 10 and sol[0][y] == 70 - 2 * z
    for zz in (10, 20, 35):
        xx, yy = zz - 10, 70 - 2 * zz
        assert xx + yy + zz == 60 and 2 * xx + 3 * yy + 4 * zz == 190
        assert 3 * xx + 4 * yy + 5 * zz == 250 and xx >= 0 and yy >= 0
    assert (20 - 10, 70 - 40) == (10, 30)
    assert (0, 50, 10) == (10 - 10, 70 - 2 * 10, 10)
    assert 35 - 10 + 1 == 26                    # integer parameter values 10..35
    # third row is the sum of the first two
    assert (1 + 2, 1 + 3, 1 + 4, 60 + 190) == (3, 4, 5, 250)
    # one digit changed -> contradiction
    assert sp.solve([x + y + z - 60, 2 * x + 3 * y + 4 * z - 190,
                     3 * x + 4 * y + 5 * z - 251], [x, y, z]) == []
    assert 251 - 250 == 1 and 71 - 70 == 1


s.verify(check)
s.save()
