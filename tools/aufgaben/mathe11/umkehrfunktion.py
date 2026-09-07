#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 1: Umkehrfunktionen, Wurzelfunktion, Spiegelung an y = x.
Deck: tools/pptx/build_umkehrfunktion_mathe11.py - Quiz: HTML/mathetest11-umkehrfunktion.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-umkehrfunktion", "Umkehrfunktionen", kw=1)

# ---------------------------------------------------------------- AFB I ----
s.task("Grad Celsius und Grad Fahrenheit", 1,
       r"In den USA wird die Temperatur in Grad Fahrenheit angegeben. Die Umrechnung leistet $F(c) = 1{,}8c + 32$, wobei $c$ die Temperatur in Grad Celsius ist.",
       [r"Rechne $20\ ^\circ$C und $-10\ ^\circ$C in Grad Fahrenheit um.",
        r"Bestimme die Umkehrfunktion $F^{-1}$, die aus Fahrenheit wieder Celsius macht.",
        r"Ein Wetterbericht meldet $95\ ^\circ$F und in der Nacht $32\ ^\circ$F. Rechne beides in Grad Celsius um.",
        r"Bei welcher Temperatur zeigen beide Skalen dieselbe Zahl? Was bedeutet dieser Punkt für die Graphen von $F$ und $F^{-1}$?"],
       solution=[
        r"$F(20) = 1{,}8 \cdot 20 + 32 = 36 + 32 = 68\ ^\circ$F. $F(-10) = -18 + 32 = 14\ ^\circ$F.",
        r"Ansatz $y = 1{,}8c + 32$, nach $c$ auflösen: $y - 32 = 1{,}8c$, also $c = \dfrac{y - 32}{1{,}8}$. Nach dem Umbenennen der Variablen: $F^{-1}(x) = \dfrac{x - 32}{1{,}8}$.",
        r"$F^{-1}(95) = \dfrac{95 - 32}{1{,}8} = \dfrac{63}{1{,}8} = 35\ ^\circ$C. $F^{-1}(32) = \dfrac{0}{1{,}8} = 0\ ^\circ$C — der Gefrierpunkt. Probe: $F(35) = 63 + 32 = 95$ und $F(0) = 32$.",
        r"Gesucht ist $c$ mit $F(c) = c$: $1{,}8c + 32 = c$ ergibt $0{,}8c = -32$ und damit $c = -40$. Bei $-40$ zeigen beide Skalen dieselbe Zahl. Grafisch ist das der Schnittpunkt mit der Winkelhalbierenden $y = x$, und weil $F^{-1}$ die Spiegelung von $F$ an dieser Geraden ist, liegt der Punkt $(-40 \mid -40)$ auf **beiden** Graphen."],
       falle=r"Beim Auflösen wird zuerst die $32$ abgezogen und **danach** durch $1{,}8$ geteilt. Wer zuerst teilt, erhält $\dfrac{x}{1{,}8} - 32$ und liegt bei $95\ ^\circ$F um mehr als $17$ Grad daneben.")

# --------------------------------------------------------------- AFB II ----
s.task("Wie lange fällt der Stein?", 2,
       r"Beim freien Fall gilt näherungsweise $h(t) = 5t^2$: nach $t$ Sekunden ist der Stein $h$ Meter gefallen. Gesucht ist die Umkehrung — aus der Fallhöhe soll die Fallzeit werden.",
       [r"Berechne die Fallhöhe nach $2$ und nach $3$ Sekunden.",
        r"Stelle die Umkehrfunktion $t(h)$ auf. Welchen Definitionsbereich musst du für $h$ wählen, und warum darf nur eine der beiden Wurzeln genommen werden?",
        r"Von einer Brücke fällt ein Stein $80$ m tief. Wie lange dauert das?",
        r"Warum ist $h$ auf ganz $\mathbb{R}$ **nicht** umkehrbar? Erkläre mit dem Graphen und sage, welche Einschränkung die Umkehrung möglich macht."],
       solution=[
        r"$h(2) = 5 \cdot 4 = 20$ m und $h(3) = 5 \cdot 9 = 45$ m.",
        r"$h = 5t^2$ nach $t$ auflösen: $t^2 = \dfrac{h}{5}$, also $t = \sqrt{\dfrac{h}{5}}$. Der Definitionsbereich ist $h \geq 0$, denn unter der Wurzel darf nichts Negatives stehen und eine negative Fallhöhe gibt es nicht. Die zweite rechnerische Lösung $t = -\sqrt{\dfrac{h}{5}}$ entfällt, weil die Zeit nach dem Loslassen nicht negativ ist.",
        r"$t = \sqrt{\dfrac{80}{5}} = \sqrt{16} = 4$ Sekunden. Probe: $h(4) = 5 \cdot 16 = 80$ m.",
        r"Auf ganz $\mathbb{R}$ ist $h$ eine nach oben geöffnete Parabel: $h(-2) = 20$ und $h(2) = 20$ liefern denselben Wert. Zu einer Höhe gehören also zwei Stellen, und die Spiegelung an $y = x$ ergäbe eine liegende Parabel, die den Senkrechten-Test nicht besteht. Erst die Einschränkung auf $t \geq 0$ macht $h$ streng monoton steigend — und nur dann existiert eine Umkehrfunktion."],
       falle=r"Die Umkehrung von $5t^2$ ist $\sqrt{\dfrac{h}{5}}$, nicht $\dfrac{\sqrt{h}}{5}$. Bei $h = 80$ ergäbe das $1{,}79$ statt $4$ Sekunden — die Probe entlarvt es sofort.")

# -------------------------------------------------------------- AFB III ----
s.task("Ist die Umkehrfunktion der Kehrwert?", 3,
       r"Ein Mitschüler sagt: **„Die $-1$ in $f^{-1}$ ist doch ein Exponent, also ist $f^{-1}(x)$ dasselbe wie $\dfrac{1}{f(x)}$.“** Untersucht wird $f(x) = 2x + 6$.",
       [r"Bestimme $f^{-1}$ und berechne $f^{-1}(10)$ sowie $\dfrac{1}{f(10)}$. Vergleiche.",
        r"Prüfe an $x = 5$, welche der beiden Vorschriften die Eigenschaft „macht $f$ rückgängig“ erfüllt.",
        r"Untersuche, ob $g(x) = x^2$ umkehrbar ist. Gib gegebenenfalls eine Einschränkung an, die es möglich macht.",
        r"Beurteile die Behauptung. Nenne das grafische Kriterium, mit dem man einer Funktion ansieht, ob sie umkehrbar ist."],
       solution=[
        r"Aus $y = 2x + 6$ folgt $x = \dfrac{y - 6}{2}$, also $f^{-1}(x) = \dfrac{x - 6}{2}$. Damit $f^{-1}(10) = \dfrac{4}{2} = 2$. Dagegen $f(10) = 26$ und $\dfrac{1}{f(10)} = \dfrac{1}{26} \approx 0{,}038$. Die beiden Werte haben nichts miteinander zu tun.",
        r"$f(5) = 16$. Die Umkehrfunktion muss zurückführen: $f^{-1}(16) = \dfrac{10}{2} = 5$ — sie leistet genau das. Der Kehrwert dagegen: $\dfrac{1}{f(16)} = \dfrac{1}{38}$, also weit von $5$ entfernt. Nur $f^{-1}$ erfüllt $f^{-1}(f(x)) = x$.",
        r"Auf ganz $\mathbb{R}$ ist $g$ nicht umkehrbar: $g(3) = g(-3) = 9$, zum Wert $9$ gehören zwei Stellen. Schränkt man auf $x \geq 0$ ein, ist $g$ streng monoton steigend und umkehrbar mit $g^{-1}(x) = \sqrt{x}$ für $x \geq 0$.",
        r"Die Behauptung ist falsch: die $-1$ ist hier **kein** Exponent, sondern ein Symbol für die Umkehrung. Grafisch gilt: eine Funktion ist genau dann umkehrbar, wenn jede **waagerechte** Gerade den Graphen höchstens einmal trifft. Dann liefert die Spiegelung an $y = x$ wieder einen Funktionsgraphen; andernfalls entsteht ein Gebilde mit zwei Werten an einer Stelle."],
       falle=r"$f^{-1}$ und $\dfrac{1}{f}$ sehen ähnlich aus und sind völlig verschieden. Merkhilfe: $f^{-1}$ **tauscht die Achsen**, $\dfrac{1}{f}$ rechnet nur mit den Werten weiter.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    Fh = lambda c: F(18, 10) * c + 32
    Fi = lambda x: (F(x) - 32) / F(18, 10)
    assert Fh(20) == 68 and Fh(-10) == 14
    assert Fi(95) == 35 and Fi(32) == 0 and Fh(35) == 95 and Fh(0) == 32
    assert Fh(F(-40)) == -40
    assert F(63, 1) / F(18, 10) == 35
    wrong = F(95) / F(18, 10) - 32
    assert abs(float(wrong) - 20.777) < 1e-3 and 35 - float(wrong) > 14
    h = lambda t: 5 * t ** 2
    assert h(2) == 20 and h(3) == 45 and h(4) == 80 and h(-2) == 20
    assert math.sqrt(80 / 5) == 4.0 and abs(math.sqrt(80) / 5 - 1.7889) < 1e-4
    # inverse vs reciprocal
    f = lambda x: 2 * x + 6
    fi = lambda x: F(x - 6, 2)
    assert fi(10) == 2 and f(10) == 26 and abs(1 / 26 - 0.03846) < 1e-5
    assert f(5) == 16 and fi(16) == 5 and f(16) == 38
    assert all(fi(f(x)) == x for x in range(-5, 6))
    assert 3 ** 2 == 9 == (-3) ** 2


s.verify(check)
s.save()
