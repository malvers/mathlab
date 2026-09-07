#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 22: Monte-Carlo-Methode - Flaeche durch Abzaehlen, pi schaetzen.
Deck: tools/pptx/build_montecarlo_mathe11.py - Quiz: HTML/mathetest11-montecarlo.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-montecarlo", "Die Monte-Carlo-Methode", kw=22)

# ---------------------------------------------------------------- AFB I ----
s.task("Pi aus Zufallspunkten", 1,
       r"In ein Quadrat mit der Seitenlänge $1$ wird ein Viertelkreis mit Radius $1$ gelegt. Dann werden zufällig Punkte gleichmäßig über das Quadrat gestreut und die Treffer im Viertelkreis gezählt.",
       [r"Berechne den theoretischen Anteil der Viertelkreisfläche an der Quadratfläche.",
        r"Bei $1\,000$ Punkten liegen $782$ im Viertelkreis. Welchen Schätzwert für $\pi$ liefert das?",
        r"Wie weit liegt dieser Schätzwert vom wahren Wert entfernt?",
        r"Die Genauigkeit wächst etwa mit $\dfrac{1}{\sqrt{n}}$. Wie viele Punkte bräuchte man, um $\pi$ auf zwei Nachkommastellen zu bestimmen?"],
       solution=[
        r"Quadratfläche $1 \cdot 1 = 1$, Viertelkreisfläche $\dfrac{\pi \cdot 1^2}{4} = \dfrac{\pi}{4}$. Der Anteil ist also $\dfrac{\pi}{4} \approx 0{,}7854$ — rund $78{,}5\,\%$ der Punkte sollten im Viertelkreis landen.",
        r"Trefferanteil $\dfrac{782}{1\,000} = 0{,}782$. Weil dieser Anteil ungefähr $\dfrac{\pi}{4}$ ist, gilt $\pi \approx 4 \cdot 0{,}782 = 3{,}128$.",
        r"$\pi \approx 3{,}14159$, die Abweichung beträgt also rund $0{,}0136$. Schon die erste Nachkommastelle stimmt, die zweite nicht mehr.",
        r"Der Fehler im **Anteil** ist etwa $\dfrac{1}{\sqrt{n}}$; für $\pi$ wird er mit $4$ multipliziert. Verlangt ist $\dfrac{4}{\sqrt{n}} \approx 0{,}01$, also $\sqrt{n} \approx 400$ und damit $n \approx 160\,000$ Punkte. Für zwei Stellen ist das schon ein erheblicher Aufwand."],
       falle=r"Der Trefferanteil ist $\dfrac{\pi}{4}$, nicht $\pi$. Wer die Multiplikation mit $4$ vergisst, erhält $0{,}782$ und hält es für einen misslungenen Versuch.")

# --------------------------------------------------------------- AFB II ----
s.task("Wie groß ist der Teich?", 2,
       r"Auf einem rechteckigen Grundstück von $40$ m mal $30$ m liegt ein Teich mit unregelmäßigem Rand. Seine Fläche lässt sich nicht mit einer Formel berechnen, deshalb wird ein Luftbild mit zufällig gesetzten Punkten ausgewertet.",
       [r"Erkläre, warum sich die Teichfläche aus dem Anteil der Punkte im Teich ergibt.",
        r"Von $500$ Punkten liegen $137$ im Teich. Schätze die Teichfläche.",
        r"Eine zweite Serie mit ebenfalls $500$ Punkten ergibt $145$ Treffer. Berechne diese Schätzung und die Schätzung aus allen $1\,000$ Punkten zusammen.",
        r"Warum ist die Schätzung aus $1\,000$ Punkten verlässlicher als jede der beiden einzelnen? Gib die ungefähre Genauigkeit an."],
       solution=[
        r"Die Punkte sind gleichmäßig über das Grundstück verteilt, also ist die Chance, in einem bestimmten Bereich zu landen, proportional zu dessen Fläche. Der Anteil der Treffer schätzt daher den Flächenanteil des Teichs, und die gesuchte Fläche ist Grundstücksfläche mal Trefferanteil.",
        r"Grundstück: $40 \cdot 30 = 1\,200\ \mathrm{m^2}$. Trefferanteil $\dfrac{137}{500} = 0{,}274$. Schätzung: $1\,200 \cdot 0{,}274 = 328{,}8\ \mathrm{m^2}$.",
        r"Zweite Serie: $\dfrac{145}{500} = 0{,}29$ und $1\,200 \cdot 0{,}29 = 348\ \mathrm{m^2}$. Zusammen: $\dfrac{137 + 145}{1\,000} = \dfrac{282}{1\,000} = 0{,}282$ und $1\,200 \cdot 0{,}282 = 338{,}4\ \mathrm{m^2}$.",
        r"Beide Einzelserien liegen fast $20\ \mathrm{m^2}$ auseinander — allein durch Zufallsschwankung. Mehr Punkte bedeuten weniger Streuung: die Genauigkeit wächst mit $\dfrac{1}{\sqrt{n}}$, also von $\dfrac{1}{\sqrt{500}} \approx 0{,}045$ auf $\dfrac{1}{\sqrt{1\,000}} \approx 0{,}032$. Auf die Fläche bezogen sind das rund $\pm 38\ \mathrm{m^2}$ — die Schätzung von $338\ \mathrm{m^2}$ sollte man also auf etwa $340\ \mathrm{m^2}$ runden und keine Nachkommastelle angeben."],
       falle=r"Die vielen Nachkommastellen des Taschenrechners täuschen Genauigkeit vor. $328{,}8\ \mathrm{m^2}$ suggeriert Zentimeter, dabei ist nicht einmal die Zehnerstelle gesichert.")

# -------------------------------------------------------------- AFB III ----
s.task("Mit genug Punkten geht alles", 3,
       r"Ein Mitschüler sagt: **„Mit genügend Zufallspunkten bekomme ich $\pi$ auf beliebig viele Stellen — und das schneller als mit jeder Formel.“**",
       [r"Wie viele Punkte bräuchte er für vier Nachkommastellen? Rechne mit der Genauigkeit $\dfrac{4}{\sqrt{n}}$.",
        r"Wie viele für sechs Nachkommastellen? Beurteile die Größenordnung.",
        r"Vergleiche mit dem Streifenverfahren aus der Vorwoche: dort halbiert sich der Fehler beim Verdoppeln der Streifen. Was bedeutet der Unterschied?",
        r"Beurteile die Aussage. Wofür ist die Monte-Carlo-Methode dann wirklich das Mittel der Wahl?"],
       solution=[
        r"$\dfrac{4}{\sqrt{n}} \approx 0{,}0001$ verlangt $\sqrt{n} \approx 40\,000$, also $n \approx 1{,}6 \cdot 10^9$ — rund **anderthalb Milliarden** Punkte für vier Stellen.",
        r"$\dfrac{4}{\sqrt{n}} \approx 0{,}000001$ verlangt $\sqrt{n} \approx 4 \cdot 10^6$, also $n \approx 1{,}6 \cdot 10^{13}$. Das sind zehntausendmal so viele Punkte wie in a) — jede zusätzliche Stelle kostet den Faktor $100$. Selbst mit schnellen Rechnern ist das keine sinnvolle Methode, um $\pi$ zu bestimmen.",
        r"Beim Streifenverfahren sinkt der Fehler proportional zu $\dfrac{1}{n}$, bei Monte Carlo nur mit $\dfrac{1}{\sqrt{n}}$. Für zehnfache Genauigkeit braucht das eine zehnmal so viele Schritte, das andere hundertmal so viele. In einer Dimension ist das Streifenverfahren dem Zufall also deutlich überlegen.",
        r"Die Aussage ist falsch, jedenfalls für $\pi$: dafür gibt es Reihenformeln, die mit wenigen Schritten viele Stellen liefern. Der Vorteil von Monte Carlo liegt anderswo. Erstens bei **komplizierten Gebieten**, deren Rand sich nicht durch eine Formel beschreiben lässt — wie der Teich in Aufgabe 2. Zweitens bei Problemen mit **vielen Größen** gleichzeitig: dort wächst der Aufwand des Streifenverfahrens explosionsartig, während die $\dfrac{1}{\sqrt{n}}$-Genauigkeit von Monte Carlo unabhängig von der Zahl der Größen bleibt. Genau deshalb steckt das Verfahren in Grafikprogrammen und Finanzmodellen."],
       falle=r"„Mehr Rechenzeit hilft immer“ stimmt nur, wenn man die Größenordnung kennt. Der Faktor $100$ je zusätzlicher Stelle macht aus einer Sekunde schnell ein Jahr.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    assert abs(math.pi / 4 - 0.7854) < 1e-4
    assert F(782, 1000) == F(391, 500) and abs(4 * 0.782 - 3.128) < 1e-12
    assert abs(3.128 - math.pi) < 0.0137 and abs(3.128 - math.pi) > 0.0135
    assert abs(4 / math.sqrt(160000) - 0.01) < 1e-12 and 400 ** 2 == 160000
    # pond
    assert 40 * 30 == 1200
    assert F(137, 500) == F(137, 500) and abs(1200 * 137 / 500 - 328.8) < 1e-9
    assert abs(1200 * 145 / 500 - 348) < 1e-9 and 137 + 145 == 282
    assert abs(1200 * 282 / 1000 - 338.4) < 1e-9 and 348 - 328.8 > 19
    assert abs(1 / math.sqrt(500) - 0.0447) < 1e-4 and abs(1 / math.sqrt(1000) - 0.0316) < 1e-4
    assert abs(1200 / math.sqrt(1000) - 37.95) < 0.05
    # how many points for more digits
    n4 = (4 / 0.0001) ** 2
    n6 = (4 / 0.000001) ** 2
    assert abs(n4 - 1.6e9) < 1 and abs(n6 - 1.6e13) < 1e5 and abs(n6 / n4 - 10000) < 1e-6
    assert abs((4 / 0.001) ** 2 * 100 - n4) < 1e-3           # one more digit costs 100x


s.verify(check)
s.save()
