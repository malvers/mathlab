#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 24: Exkurs das unendlich Grosse - Hilberts Hotel, Cantor.
Deck: tools/pptx/build_unendlich_mathe11.py - Quiz: HTML/mathetest11-unendlich.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-unendlich", "Das unendlich Große", kw=24)

# ---------------------------------------------------------------- AFB I ----
s.task("Immer noch ein Zimmer frei", 1,
       r"Hilberts Hotel hat unendlich viele Zimmer, nummeriert mit $1$, $2$, $3$ und so weiter. **Alle** Zimmer sind belegt. Trotzdem soll niemand abgewiesen werden.",
       [r"Ein neuer Gast kommt. Gib eine Umzugsregel an, nach der er ein Zimmer bekommt, und sage, welches Zimmer frei wird.",
        r"Nun kommen $5$ Gäste auf einmal. Gib die Regel an.",
        r"Ein Bus mit unendlich vielen Gästen fährt vor. Gib eine Regel an, mit der auch sie alle unterkommen.",
        r"Warum funktioniert keiner dieser Tricks in einem Hotel mit $100$ Zimmern?"],
       solution=[
        r"Jeder Gast aus Zimmer $n$ zieht in Zimmer $n + 1$. Jeder behält genau ein Zimmer, niemand teilt sich eines, und **Zimmer $1$** wird frei. Möglich ist das, weil es zu jeder Nummer eine nächste gibt — ein letztes Zimmer, aus dem jemand hinausfiele, existiert nicht.",
        r"Jeder Gast aus Zimmer $n$ zieht in Zimmer $n + 5$. Dann sind die Zimmer $1$ bis $5$ frei, also genau fünf.",
        r"Jeder Gast aus Zimmer $n$ zieht in Zimmer $2n$. Danach sind alle **geraden** Zimmer belegt und alle **ungeraden** frei — davon gibt es unendlich viele. Der $k$-te Businsasse bekommt Zimmer $2k - 1$.",
        r"Bei $100$ Zimmern gibt es ein letztes. Die Regel $n \to n + 1$ würde den Gast aus Zimmer $100$ nach Zimmer $101$ schicken, das es nicht gibt — er stünde auf der Straße. Genau diese fehlende Obergrenze ist das Besondere am unendlichen Hotel."],
       falle=r"Der Trick ist kein Zaubern: es wird **niemand doppelt einquartiert** und niemand vergessen. Jede Regel muss eine Zuordnung sein, bei der verschiedene Gäste verschiedene Zimmer bekommen.")

# --------------------------------------------------------------- AFB II ----
s.task("Gleich viele, obwohl weniger?", 2,
       r"Zwei unendliche Mengen heißen **gleich mächtig**, wenn sich ihre Elemente vollständig paarweise zuordnen lassen — jedem Element der einen genau eines der anderen, ohne Rest auf beiden Seiten.",
       [r"Gib eine Zuordnung an, die zeigt, dass es genauso viele gerade natürliche Zahlen gibt wie natürliche Zahlen überhaupt.",
        r"Zeige dasselbe für die Quadratzahlen.",
        r"Die ganzen Zahlen lassen sich in der Reihenfolge $0$, $1$, $-1$, $2$, $-2$, $3$, $-3$, … aufzählen. An welcher Stelle steht $100$, an welcher $-100$?",
        r"Ein Mitschüler sagt: „Die geraden Zahlen sind doch nur die Hälfte der natürlichen, also müssen es weniger sein.“ Nimm Stellung."],
       solution=[
        r"Die Zuordnung $n \to 2n$ ordnet $1 \to 2$, $2 \to 4$, $3 \to 6$ und so weiter. Jede natürliche Zahl bekommt genau eine gerade Zahl, und jede gerade Zahl wird genau einmal getroffen — sie ist ja $2n$ für genau ein $n$. Also sind beide Mengen gleich mächtig.",
        r"Die Zuordnung $n \to n^2$ ordnet $1 \to 1$, $2 \to 4$, $3 \to 9$, $4 \to 16$. Auch hier wird jede Quadratzahl genau einmal getroffen. Obwohl die Quadratzahlen in jedem Anfangsstück immer dünner werden — unter den ersten $100$ Zahlen sind nur $10$ Quadratzahlen — sind es insgesamt gleich viele.",
        r"Die $0$ steht an Stelle $1$. Danach folgt jede positive Zahl $n$ an Stelle $2n$ und jede negative Zahl $-n$ an Stelle $2n + 1$. Also steht $100$ an Stelle $200$ und $-100$ an Stelle $201$. Weil jede ganze Zahl irgendwann drankommt, sind auch die ganzen Zahlen gleich mächtig zu den natürlichen — man nennt solche Mengen **abzählbar**.",
        r"Sein Schluss überträgt eine Regel für endliche Mengen auf unendliche, wo sie nicht gilt. Bei endlichen Mengen ist eine echte Teilmenge immer kleiner; bei unendlichen kann sie gleich mächtig sein — genau das ist die Definition von unendlich. „Die Hälfte“ ist hier keine sinnvolle Aussage, weil man nicht zählen, sondern nur **zuordnen** kann. Und die Zuordnung $n \to 2n$ funktioniert lückenlos."],
       falle=r"Gleich mächtig heißt nicht „gleich dicht“. Die Quadratzahlen werden immer seltener und sind trotzdem gleich mächtig zu allen natürlichen Zahlen — Dichte und Mächtigkeit sind zwei verschiedene Dinge.")

# -------------------------------------------------------------- AFB III ----
s.task("Passen alle reellen Zahlen ins Hotel?", 3,
       r"Nachdem alles abzählbar schien, taucht die Frage auf: Lassen sich auch alle reellen Zahlen zwischen $0$ und $1$ durchnummerieren? Angenommen, es gäbe eine solche Liste, die mit diesen vier Zahlen beginnt: $z_1 = 0{,}1234\ldots$, $z_2 = 0{,}5678\ldots$, $z_3 = 0{,}1111\ldots$, $z_4 = 0{,}9999\ldots$",
       [r"Lies die vier Ziffern auf der Diagonalen ab: die erste Nachkommastelle von $z_1$, die zweite von $z_2$ und so weiter.",
        r"Bilde eine neue Zahl, indem du jede dieser Ziffern um $1$ erhöhst (aus $9$ wird $1$). Wie beginnt sie?",
        r"Begründe, warum diese neue Zahl in der ganzen Liste nicht vorkommen kann.",
        r"Welchen Schluss zieht man daraus? Beurteile die Aussage „unendlich ist unendlich, da gibt es keine Unterschiede“."],
       solution=[
        r"Die Diagonalziffern sind $1$ (erste Stelle von $z_1$), $6$ (zweite von $z_2$), $1$ (dritte von $z_3$) und $9$ (vierte von $z_4$).",
        r"Erhöht ergibt das $2$, $7$, $2$ und $1$. Die neue Zahl beginnt also mit $d = 0{,}2721\ldots$",
        r"$d$ kann nicht $z_1$ sein, denn an der **ersten** Stelle steht bei $d$ eine $2$ und bei $z_1$ eine $1$. Sie kann nicht $z_2$ sein, denn an der zweiten Stelle unterscheiden sie sich, und so weiter: nach Konstruktion weicht $d$ von der $n$-ten Zahl an der $n$-ten Stelle ab. $d$ ist also von **jeder** Zahl der Liste verschieden — obwohl die Liste angeblich alle enthielt.",
        r"Die Annahme, es gäbe eine vollständige Liste, führt zum Widerspruch. Also lassen sich die reellen Zahlen zwischen $0$ und $1$ **nicht** abzählen: sie sind überabzählbar und damit von größerer Mächtigkeit als die natürlichen Zahlen. Die Aussage „unendlich ist unendlich“ ist damit widerlegt — es gibt mindestens zwei verschieden große Unendlichkeiten. Anders gesagt: in Hilberts Hotel bekommt jeder Bus mit abzählbar vielen Gästen ein Zimmer, aber die reellen Zahlen zwischen $0$ und $1$ passen nicht hinein."],
       falle=r"Das Verfahren beweist nicht, dass **diese** Liste unvollständig ist, sondern dass **jede** Liste es sein muss. Der Widerspruch entsteht unabhängig davon, welche Zahlen jemand aufschreibt.")


# ---------------------------------------------------------- numbers check ----
def check():
    # Hilbert's hotel: the shift rules are injective and leave the right rooms free
    assert len({n + 1 for n in range(1, 1000)}) == 999 and 1 not in {n + 1 for n in range(1, 1000)}
    frei5 = set(range(1, 1000)) - {n + 5 for n in range(1, 1000)}
    assert frei5 == {1, 2, 3, 4, 5}
    belegt = {2 * n for n in range(1, 500)}
    assert all(b % 2 == 0 for b in belegt) and len(belegt) == 499
    assert all((2 * k - 1) not in belegt for k in range(1, 500))
    # countability
    assert len({2 * n for n in range(1, 1000)}) == 999
    assert len({n ** 2 for n in range(1, 1000)}) == 999
    assert len([n for n in range(1, 101) if int(n ** 0.5 + 1e-9) ** 2 == n]) == 10
    stelle = lambda z: 1 if z == 0 else (2 * z if z > 0 else 2 * (-z) + 1)
    assert stelle(0) == 1 and stelle(100) == 200 and stelle(-100) == 201
    assert len({stelle(z) for z in range(-500, 501)}) == 1001
    # Cantor's diagonal
    liste = ["1234", "5678", "1111", "9999"]
    diag = [int(liste[i][i]) for i in range(4)]
    assert diag == [1, 6, 1, 9]
    neu = [(d + 1) if d != 9 else 1 for d in diag]
    assert neu == [2, 7, 2, 1]
    assert all(neu[i] != diag[i] for i in range(4))
    assert "".join(map(str, neu)) == "2721"


s.verify(check)
s.save()
