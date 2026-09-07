#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 51: Uebungszirkel - Funktionstyp erkennen, vergleichen, beurteilen.
Deck: tools/pptx/build_funktionen_vertiefung_mathe11.py - Quiz: HTML/mathetest11-funktionen-vertiefung.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-funktionen-vertiefung", "Welcher Funktionstyp passt?", kw=51)

# ---------------------------------------------------------------- AFB I ----
s.task("Vier Messreihen aus dem Betrieb", 1,
       r"Aus vier Anlagen liegen Messreihen vor, jeweils für $x = 0, 1, 2, 3$. **A**: $5$, $8$, $11$, $14$. **B**: $2$, $6$, $18$, $54$. **C**: $0$, $2$, $8$, $18$. **D**: $0$, $1$, $0$, $-1$, und weiter $0$, $1$, $0$, $-1$.",
       [r"Bestimme für jede Reihe den Funktionstyp. Beschreibe den Prüfgriff, den du benutzt.",
        r"Gib für A und B die Funktionsgleichung an und prüfe sie am letzten Wert.",
        r"Gib für C die Funktionsgleichung an. Wie zeigt die Tabelle, dass C nicht linear ist?",
        r"Welche Reihe hat bei $x = 10$ den größten Wert? Berechne alle drei."],
       solution=[
        r"Prüfgriff: erst die **Differenzen** benachbarter Werte bilden, dann die **Quotienten**. A hat die Differenzen $3$, $3$, $3$ — konstant, also **linear**. B hat die Quotienten $3$, $3$, $3$ — konstant, also **exponentiell**. C hat die Differenzen $2$, $6$, $10$, die selbst wieder die Differenz $4$ haben — zweite Differenzen konstant, also **quadratisch**. D wiederholt sich mit der Periode $4$, ist also **periodisch**.",
        r"A: Startwert $5$, Zuwachs $3$, also $f(x) = 3x + 5$. Probe: $f(3) = 9 + 5 = 14$. B: Startwert $2$, Faktor $3$, also $g(x) = 2 \cdot 3^x$. Probe: $g(3) = 2 \cdot 27 = 54$.",
        r"C: die Werte sind $0$, $2$, $8$, $18$, also das Doppelte von $0$, $1$, $4$, $9$. Damit $h(x) = 2x^2$. Probe: $h(3) = 2 \cdot 9 = 18$. Linear wäre C nur bei konstanten Differenzen; hier wachsen sie von $2$ über $6$ auf $10$, die Reihe wird also immer steiler.",
        r"$f(10) = 30 + 5 = 35$. $g(10) = 2 \cdot 3^{10} = 2 \cdot 59\,049 = 118\,098$. $h(10) = 2 \cdot 100 = 200$. Die exponentielle Reihe B liegt weit vorn — obwohl sie bei $x = 0$ mit $2$ den kleinsten Startwert aller drei hatte."],
       falle=r"Bei $x = 0$ und $x = 1$ sehen alle drei Reihen harmlos aus. Erst der Blick auf **mehrere** Schritte trennt die Typen; ein einzelner Zuwachs sagt gar nichts.")

# --------------------------------------------------------------- AFB II ----
s.task("Vom Text zum Modell", 2,
       r"Drei Situationen sollen als Funktion beschrieben werden. **(1)** Ein Vertrag kostet $5$ € Grundgebühr im Monat und zusätzlich $12$ € je Monat für das Datenpaket. **(2)** Eine Bakterienkultur startet mit $500$ Bakterien und verdoppelt sich alle $3$ Stunden. **(3)** Ein quadratisches Bild wird vergrößert; gefragt ist die Bildfläche in Abhängigkeit von der Seitenlänge.",
       [r"Ordne jeder Situation den Funktionstyp zu und nenne das Signalwort im Text, das ihn verrät.",
        r"Stelle für alle drei Situationen die Funktionsgleichung auf.",
        r"Wie viele Bakterien sind nach $12$ Stunden da?",
        r"Vergleiche die Kultur nach $24$ Stunden mit einem linearen Modell, das „alle $3$ Stunden $500$ Bakterien mehr“ annimmt. Erkläre die Größenordnung des Unterschieds."],
       solution=[
        r"(1) **linear** — „je Monat derselbe Betrag“, also immer derselbe Zuwachs. (2) **exponentiell** — „verdoppelt sich“, also immer derselbe Faktor. (3) **quadratisch** — die Fläche eines Quadrats ist die Seitenlänge mal sich selbst.",
        r"(1) $K(m) = 12m + 5$ mit $m$ in Monaten. (2) $B(t) = 500 \cdot 2^{\frac{t}{3}}$ mit $t$ in Stunden; der Exponent $\dfrac{t}{3}$ zählt die Verdopplungsschritte. (3) $A(a) = a^2$ mit $a$ als Seitenlänge.",
        r"In $12$ Stunden liegen $\dfrac{12}{3} = 4$ Verdopplungen: $B(12) = 500 \cdot 2^4 = 500 \cdot 16 = 8\,000$ Bakterien.",
        r"In $24$ Stunden liegen $8$ Verdopplungen: $B(24) = 500 \cdot 2^8 = 500 \cdot 256 = 128\,000$. Das lineare Modell ergibt $500 + 8 \cdot 500 = 4\,500$. Der Unterschied ist mehr als das $28$-fache. Grund: linear kommt achtmal derselbe Betrag dazu, exponentiell wird achtmal **verdoppelt** — der Zuwachs wächst dort mit dem Bestand mit."],
       falle=r"„Verdoppelt sich alle $3$ Stunden“ heißt $2^{t/3}$, nicht $2^{3t}$. Eine Probe bei $t = 3$ muss genau $1\,000$ ergeben; $2^{9}$ läge um das Fünfhundertfache daneben.")

# -------------------------------------------------------------- AFB III ----
s.task("Passt genau, also stimmt es?", 3,
       r"Eine Mitschülerin hat drei Messpunkte $(1 \mid 2)$, $(2 \mid 4)$ und $(3 \mid 8)$ und sagt: **„Die Werte verdoppeln sich, also ist es $f(x) = 2^x$ — die Funktion trifft alle drei Punkte genau, damit ist das Modell bewiesen.“** Ein Mitschüler schlägt $g(x) = x^2 - x + 2$ vor.",
       [r"Prüfe, ob auch $g$ alle drei Messpunkte trifft.",
        r"Berechne $f(4)$ und $g(4)$ sowie $f(10)$ und $g(10)$. Wie weit laufen die Modelle auseinander?",
        r"Wie könnte man entscheiden, welches Modell das richtige ist? Nenne zwei verschiedene Wege.",
        r"Beurteile die Aussage der Mitschülerin. Was beweist eine perfekte Übereinstimmung mit den Daten, und was nicht?"],
       solution=[
        r"$g(1) = 1 - 1 + 2 = 2$, $g(2) = 4 - 2 + 2 = 4$, $g(3) = 9 - 3 + 2 = 8$. Auch $g$ trifft **alle drei** Punkte genau. Zwei völlig verschiedene Funktionstypen passen also gleich gut zu den Daten.",
        r"$f(4) = 16$ gegenüber $g(4) = 16 - 4 + 2 = 14$ — der Unterschied beginnt. $f(10) = 1\,024$ gegenüber $g(10) = 100 - 10 + 2 = 92$: das exponentielle Modell liefert mehr als das Elffache. Je weiter man geht, desto größer wird der Abstand.",
        r"Erstens **mehr Messwerte** erheben, besonders außerhalb des bisherigen Bereichs: schon der Punkt bei $x = 4$ trennt die Modelle. Zweitens **Sachwissen** heranziehen: Vermehren sich die Objekte durch Teilung, spricht das für ein exponentielles Modell; hängt die Größe von einer Fläche ab, eher für ein quadratisches. Die Mathematik allein kann das nicht entscheiden.",
        r"Die Aussage ist falsch. Dass eine Funktion die Daten trifft, zeigt nur, dass sie **nicht widerlegt** ist — bewiesen ist damit nichts. Durch endlich viele Punkte passen immer unendlich viele Funktionen. Ein Modell wird glaubwürdig durch neue, vorher nicht benutzte Messwerte und durch einen sachlichen Grund für genau diesen Zusammenhang."],
       falle=r"Je weniger Punkte, desto mehr Modelle passen. Drei Punkte lassen sich immer exakt durch eine quadratische Funktion legen — das ist kein Befund, sondern eine Selbstverständlichkeit.")


# ---------------------------------------------------------- numbers check ----
def check():
    A = [5, 8, 11, 14]
    B = [2, 6, 18, 54]
    C = [0, 2, 8, 18]
    diff = lambda L: [L[i + 1] - L[i] for i in range(len(L) - 1)]
    assert diff(A) == [3, 3, 3]
    assert [B[i + 1] // B[i] for i in range(3)] == [3, 3, 3]
    assert diff(C) == [2, 6, 10] and diff(diff(C)) == [4, 4]
    f = lambda x: 3 * x + 5
    g = lambda x: 2 * 3 ** x
    h = lambda x: 2 * x ** 2
    assert [f(x) for x in range(4)] == A and [g(x) for x in range(4)] == B
    assert [h(x) for x in range(4)] == C
    assert f(10) == 35 and g(10) == 118098 and h(10) == 200 and 3 ** 10 == 59049
    # models from text
    K = lambda m: 12 * m + 5
    Bk = lambda t: 500 * 2 ** (t / 3)
    assert K(0) == 5 and K(1) == 17
    assert Bk(3) == 1000 and Bk(12) == 8000 and Bk(24) == 128000
    assert 2 ** 4 == 16 and 2 ** 8 == 256
    lin = 500 + 8 * 500
    assert lin == 4500 and 128000 / 4500 > 28 and 128000 / 4500 < 29
    assert 500 * 2 ** 9 == 256000                     # the 2^(3t) blunder at t=3
    # two models, three points
    e = lambda x: 2 ** x
    q = lambda x: x ** 2 - x + 2
    assert all(e(x) == q(x) for x in (1, 2, 3))
    assert e(4) == 16 and q(4) == 14 and e(10) == 1024 and q(10) == 92
    assert e(10) / q(10) > 11


s.verify(check)
s.save()
