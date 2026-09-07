#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 2: der Logarithmus - Begriff, Rechengesetze, Anwendungen.
Deck: tools/pptx/build_logarithmus_mathe11.py - Quiz: HTML/mathetest11-logarithmus.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-logarithmus", "Der Logarithmus", kw=2)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Speicher wächst", 1,
       r"Ein Forschungsprojekt speichert heute $2$ Gigabyte Daten, und die Datenmenge verdoppelt sich jedes Jahr. Nach $t$ Jahren sind es $D(t) = 2 \cdot 2^t$ Gigabyte.",
       [r"Nach wie vielen Jahren sind $64$ Gigabyte erreicht? Schreibe den Rechenweg als Logarithmus auf.",
        r"Nach wie vielen Jahren ist ein Terabyte, also $1\,024$ Gigabyte, voll?",
        r"Berechne $\log_2 1$ und deute das Ergebnis im Sachzusammenhang.",
        r"Warum ist $\log_2 100$ keine ganze Zahl? Zwischen welchen beiden ganzen Zahlen liegt der Wert, und wie groß ist er ungefähr?"],
       solution=[
        r"$2 \cdot 2^t = 64$ ergibt $2^t = 32$. Vorgelesen: welcher Exponent macht aus $2$ die Zahl $32$? Das ist $\log_2 32 = 5$, denn $2^5 = 32$. Nach **$5$ Jahren** sind $64$ Gigabyte erreicht.",
        r"$2 \cdot 2^t = 1\,024$ ergibt $2^t = 512$. Wegen $2^9 = 512$ ist $t = \log_2 512 = 9$. Nach **$9$ Jahren** ist ein Terabyte voll.",
        r"$\log_2 1 = 0$, denn $2^0 = 1$. Im Sachzusammenhang: nach null Jahren hat sich die Datenmenge noch gar nicht vervielfacht, es sind noch die $2$ Gigabyte vom Start. Dieser Wert gilt für **jede** Basis: $\log_a 1 = 0$.",
        r"$100$ ist keine Zweierpotenz. Wegen $2^6 = 64$ und $2^7 = 128$ liegt $\log_2 100$ zwischen $6$ und $7$, näher an $7$. Genauer ist $\log_2 100 \approx 6{,}64$: Probe mit $2^{6{,}64} \approx 99{,}7$."],
       falle=r"$\log_2 32$ ist nicht $\dfrac{32}{2} = 16$. Der Logarithmus fragt nach dem **Exponenten**, nicht nach einem Quotienten — die Probe $2^{16} = 65\,536$ zeigt den Unterschied sofort.")

# --------------------------------------------------------------- AFB II ----
s.task("Wie stark war das Beben?", 2,
       r"Die bei einem Erdbeben frei werdende Energie hängt von der Magnitude $M$ ab: $E(M) = E_0 \cdot 10^{1{,}5M}$, wobei $E_0$ eine feste Bezugsenergie ist.",
       [r"Um welchen Faktor unterscheidet sich die Energie eines Bebens der Stärke $7$ von der eines Bebens der Stärke $5$?",
        r"Zeige allgemein, dass der Energiefaktor nur von der **Differenz** der Magnituden abhängt. Welches Logarithmengesetz steckt dahinter?",
        r"Ein Beben setzt die $100$-fache Energie eines anderen frei. Um wie viel unterscheiden sich die Magnituden?",
        r"Erkläre, warum man für Erdbeben eine logarithmische Skala benutzt und nicht die Energie selbst."],
       solution=[
        r"$\dfrac{E(7)}{E(5)} = \dfrac{E_0 \cdot 10^{10{,}5}}{E_0 \cdot 10^{7{,}5}} = 10^{10{,}5 - 7{,}5} = 10^3 = 1\,000$. Zwei Stufen auf der Skala bedeuten die **tausendfache** Energie.",
        r"$\dfrac{E(M_2)}{E(M_1)} = \dfrac{10^{1{,}5M_2}}{10^{1{,}5M_1}} = 10^{1{,}5(M_2 - M_1)}$. Beim Teilen von Potenzen mit gleicher Basis werden die Exponenten subtrahiert — logarithmiert ist das genau das Gesetz $\log\dfrac{a}{b} = \log a - \log b$. Der Faktor hängt also nur von $M_2 - M_1$ ab, nicht davon, ob man bei $3$ oder bei $7$ startet.",
        r"$10^{1{,}5 \Delta M} = 100 = 10^2$ verlangt $1{,}5 \Delta M = 2$, also $\Delta M = \dfrac{2}{1{,}5} = \dfrac{4}{3} \approx 1{,}33$. Ein Unterschied von nur rund $1{,}3$ Stufen bedeutet die hundertfache Energie.",
        r"Die Energien liegen um viele Zehnerpotenzen auseinander — zwischen einem kaum spürbaren und einem zerstörerischen Beben liegt leicht der Faktor eine Milliarde. Auf einer linearen Skala wären fast alle Beben nicht unterscheidbar, weil sie am unteren Rand kleben würden. Der Logarithmus macht aus Faktoren Abstände: gleiche Schritte auf der Skala bedeuten immer denselben Energie**faktor**, und die Zahlen bleiben handlich."],
       falle=r"Magnitude $6$ ist nicht „doppelt so stark“ wie Magnitude $3$. Auf einer logarithmischen Skala darf man Werte nicht ins Verhältnis setzen, sondern nur **voneinander abziehen**.")

# -------------------------------------------------------------- AFB III ----
s.task("Darf man den Logarithmus aufteilen?", 3,
       r"Eine Mitschülerin rechnet: **„$\log(a + b) = \log a + \log b$ — der Logarithmus wird einfach auf beide Summanden verteilt.“** Alle Logarithmen haben hier die Basis $10$.",
       [r"Prüfe die Behauptung mit $a = b = 10$. Rechne beide Seiten aus.",
        r"Welche Verknüpfung darf man tatsächlich aufteilen? Prüfe dein Gesetz an denselben Zahlen.",
        r"Prüfe außerdem $\log\dfrac{a}{b}$ und $\log(a^n)$ an geeigneten Zahlen deiner Wahl.",
        r"Beurteile die Behauptung. Woher kommt dieser Fehler, und wie merkt man sich die richtigen Gesetze?"],
       solution=[
        r"Linke Seite: $\log(10 + 10) = \log 20 \approx 1{,}301$. Rechte Seite: $\log 10 + \log 10 = 1 + 1 = 2$. Die beiden Werte sind verschieden, die Behauptung ist **falsch**.",
        r"Aufteilen darf man das **Produkt**: $\log(a \cdot b) = \log a + \log b$. Probe: $\log(10 \cdot 10) = \log 100 = 2$ und $\log 10 + \log 10 = 2$ — hier stimmt es. Der Grund: beim Multiplizieren von Potenzen werden die Exponenten addiert, und der Logarithmus ist genau der Exponent.",
        r"$\log\dfrac{a}{b} = \log a - \log b$: mit $a = 1\,000$ und $b = 10$ ist $\log 100 = 2$ und $3 - 1 = 2$. $\log(a^n) = n \cdot \log a$: mit $a = 10$ und $n = 3$ ist $\log 1\,000 = 3$ und $3 \cdot 1 = 3$. Beide Gesetze bestätigen sich.",
        r"Die Behauptung ist falsch. Der Fehler entsteht durch Übertragung des Distributivgesetzes, das für die Multiplikation gilt, aber nicht für den Logarithmus — der ist keine Multiplikation, sondern eine Umkehrfunktion. Merkhilfe: der Logarithmus **senkt jede Rechenart um eine Stufe**. Aus Multiplikation wird Addition, aus Division Subtraktion, aus Potenzieren Multiplikation. Für die Addition gibt es keine Stufe darunter — deshalb lässt sich $\log(a + b)$ überhaupt nicht zerlegen."],
       falle=r"Für Summen im Logarithmus gibt es kein Gesetz. Wer eines erfindet, macht aus $\log 20 \approx 1{,}30$ eine $2$ — und liegt bei jeder Anwendung um den Faktor $5$ daneben.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    lg2 = lambda x: math.log(x, 2)
    D = lambda t: 2 * 2 ** t
    assert D(5) == 64 and D(9) == 1024
    assert lg2(32) == 5 and lg2(512) == 9 and lg2(1) == 0
    assert 2 ** 16 == 65536
    assert 2 ** 6 == 64 and 2 ** 7 == 128 and 6 < lg2(100) < 7
    assert abs(lg2(100) - 6.6439) < 1e-4 and abs(2 ** 6.64 - 99.7) < 0.2
    # earthquakes
    E = lambda M: 10 ** (1.5 * M)
    assert abs(E(7) / E(5) - 1000) < 1e-6 and 1.5 * 7 == 10.5 and 1.5 * 5 == 7.5
    assert abs(F(2, 1) / F(15, 10) - F(4, 3)) < 1e-12 and abs(float(F(4, 3)) - 1.3333) < 1e-4
    assert abs(E(5 + 4 / 3) / E(5) - 100) < 1e-6
    # log laws
    assert abs(math.log10(20) - 1.30103) < 1e-5 and math.log10(10) == 1
    assert abs(math.log10(100) - 2) < 1e-12
    assert abs(math.log10(1000) - math.log10(10) - 2) < 1e-12
    assert abs(math.log10(10 ** 3) - 3 * math.log10(10)) < 1e-12
    assert abs(2 / math.log10(20) - 1.5372) < 1e-4


s.verify(check)
s.save()
