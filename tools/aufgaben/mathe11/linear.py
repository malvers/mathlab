#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 41: lineare Funktionen, Anstieg und Achsenabschnitt.
Deck: tools/pptx/build_linear_mathe11.py - Quiz: HTML/mathetest11-linear.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-linear", "Lineare Funktionen", kw=41)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Kerze brennt ab", 1,
       r"Eine Kerze wird angezündet und brennt gleichmäßig ab. Nach $4$ Stunden ist sie noch $18$ cm hoch, nach $10$ Stunden noch $9$ cm.",
       [r"Berechne den Anstieg und sage in Worten, was er bedeutet.",
        r"Stelle die Funktionsgleichung $h(t) = mt + n$ auf. Wie hoch war die Kerze am Anfang?",
        r"Nach welcher Zeit ist die Kerze abgebrannt?",
        r"Wann ist die Kerze noch genau $6$ cm hoch? Gib den im Sachzusammenhang sinnvollen Definitionsbereich an."],
       solution=[
        r"$m = \dfrac{9 - 18}{10 - 4} = \dfrac{-9}{6} = -1{,}5$. Die Kerze wird je Stunde um $1{,}5$ cm kürzer; das Minuszeichen zeigt die Abnahme.",
        r"Einsetzen von $P(4 \mid 18)$ in $h(t) = -1{,}5t + n$: $18 = -6 + n$, also $n = 24$. Damit $h(t) = -1{,}5t + 24$. Der Achsenabschnitt $n = 24$ ist die **Anfangshöhe** von $24$ cm. Probe mit dem zweiten Punkt: $h(10) = -15 + 24 = 9$.",
        r"Nullstelle: $-1{,}5t + 24 = 0$ ergibt $1{,}5t = 24$, also $t = 16$. Nach **$16$ Stunden** ist die Kerze abgebrannt.",
        r"$-1{,}5t + 24 = 6$ ergibt $1{,}5t = 18$, also $t = 12$ Stunden. Sinnvoll ist $D = \{t \mid 0 \leq t \leq 16\}$ — davor brennt die Kerze nicht, danach ist nichts mehr da."],
       falle=r"Beim Anstieg müssen oben und unten dieselbe Reihenfolge stehen. $\dfrac{9 - 18}{10 - 4}$ und $\dfrac{18 - 9}{4 - 10}$ ergeben beide $-1{,}5$; gemischt kommt $+1{,}5$ heraus, und die Kerze würde wachsen.")

# --------------------------------------------------------------- AFB II ----
s.task("Zwei Becken", 2,
       r"In einer Halle stehen zwei Becken. **Becken A** enthält $300$ Liter und läuft mit $20$ Litern je Minute leer. **Becken B** enthält $60$ Liter und wird mit $30$ Litern je Minute gefüllt.",
       [r"Stelle für beide Becken die Funktionsgleichung auf und benenne Anstieg und Achsenabschnitt.",
        r"Nach welcher Zeit enthalten beide gleich viel Wasser? Wie viel ist das?",
        r"Wann ist Becken A leer, und wie viel steht dann in Becken B?",
        r"Untersuche die Gesamtmenge $A(t) + B(t)$. Ist sie konstant? Erkläre das Ergebnis mit den beiden Anstiegen."],
       solution=[
        r"$A(t) = -20t + 300$: Anstieg $-20$ Liter je Minute (Abfluss), Achsenabschnitt $300$ Liter (Anfangsmenge). $B(t) = 30t + 60$: Anstieg $+30$ Liter je Minute (Zufluss), Achsenabschnitt $60$ Liter.",
        r"$-20t + 300 = 30t + 60$ ergibt $240 = 50t$, also $t = 4{,}8$ Minuten. Füllmenge: $A(4{,}8) = 300 - 96 = 204$ Liter, und $B(4{,}8) = 144 + 60 = 204$ Liter — die Probe stimmt.",
        r"$-20t + 300 = 0$ ergibt $t = 15$ Minuten. Dann enthält B: $30 \cdot 15 + 60 = 510$ Liter.",
        r"$A(t) + B(t) = (-20t + 300) + (30t + 60) = 10t + 360$. Die Summe ist **nicht** konstant, sondern wächst um $10$ Liter je Minute. Der Grund: der Zufluss von B ist um $10$ Liter je Minute größer als der Abfluss von A. Nur bei gleich großen, entgegengesetzten Anstiegen bliebe die Summe gleich."],
       falle=r"Aus „das eine läuft aus, das andere voll“ folgt nicht, dass sich beides ausgleicht. Erst der Vergleich der **Beträge** der Anstiege, hier $20$ gegen $30$, entscheidet.")

# -------------------------------------------------------------- AFB III ----
s.task("Für immer sechs Zentimeter im Jahr?", 3,
       r"Ein Mitschüler rechnet: **„Meine Schwester ist mit $6$ Jahren $120$ cm groß und wächst $6$ cm im Jahr. Mit $30$ ist sie also $2{,}64$ m groß.“** Zur Prüfung liegen Messwerte vor: mit $6$ Jahren $120$ cm, mit $8$ Jahren $132$ cm, mit $10$ Jahren $144$ cm, mit $12$ Jahren $155$ cm.",
       [r"Stelle sein lineares Modell als Funktionsgleichung auf und bestätige seine Zahl für das Alter $30$.",
        r"Prüfe an den Messwerten, ob das Wachstum wirklich linear ist. Welches Kriterium benutzt du?",
        r"Bis zu welchem Alter beschreibt das Modell die Messwerte gut? Wo beginnt es zu haken?",
        r"Beurteile die Rechnung und formuliere, woran man erkennt, dass ein lineares Modell seine Grenze erreicht hat."],
       solution=[
        r"Mit dem Alter $t$ und dem Startwert bei $t = 6$: $h(t) = 120 + 6(t - 6)$, ausmultipliziert $h(t) = 6t + 84$. Für $t = 30$: $h(30) = 180 + 84 = 264$ cm, also $2{,}64$ m. Die Rechnung ist **in sich** richtig.",
        r"Kriterium: bei gleichen Schritten in $x$ müssen die Zuwächse in $y$ gleich sein. Von $6$ auf $8$ Jahre: $+12$ cm, von $8$ auf $10$: $+12$ cm, von $10$ auf $12$: nur noch $+11$ cm. Die ersten beiden Schritte passen zu $6$ cm im Jahr, der dritte nicht mehr ganz.",
        r"Bis etwa $10$ Jahre trifft das Modell genau: $h(8) = 132$ und $h(10) = 144$ stimmen mit den Messwerten überein. Bei $12$ Jahren sagt das Modell $156$ cm voraus, gemessen sind $155$ cm — die Abweichung beginnt, und sie wächst danach weiter, weil das Wachstum im Erwachsenenalter aufhört.",
        r"Die Rechnung ist rechnerisch korrekt, aber das Modell ist außerhalb seines Gültigkeitsbereichs benutzt. Ein lineares Modell endet dort, wo die Zuwächse nicht mehr konstant sind — erkennbar an den Differenzen in der Messreihe, an einer natürlichen Schranke (ein Mensch wächst nicht unbegrenzt) und an offensichtlich unsinnigen Werten bei großer Extrapolation."],
       falle=r"Eine Formel prüft nicht, ob sie noch passt. Sie liefert für $t = 100$ brav $684$ cm — der Sachverstand muss den Definitionsbereich setzen, nicht der Rechner.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    m = F(9 - 18, 10 - 4)
    assert m == F(-3, 2) and F(18 - 9, 4 - 10) == m
    h = lambda t: m * t + 24
    assert h(4) == 18 and h(10) == 9 and h(0) == 24
    assert F(24) / F(3, 2) == 16 and h(16) == 0
    assert F(18) / F(3, 2) == 12 and h(12) == 6
    A = lambda t: -20 * t + 300
    B = lambda t: 30 * t + 60
    t = F(240, 50)
    assert t == F(24, 5) and A(t) == 204 and B(t) == 204 and float(t) == 4.8
    assert F(300, 20) == 15 and A(15) == 0 and B(15) == 510
    assert A(0) + B(0) == 360 and A(1) + B(1) == 370 and (A(5) + B(5)) - (A(0) + B(0)) == 50
    g = lambda t: 6 * t + 84
    assert g(6) == 120 and g(30) == 264 and g(8) == 132 and g(10) == 144 and g(12) == 156
    assert 132 - 120 == 12 and 144 - 132 == 12 and 155 - 144 == 11
    assert g(12) - 155 == 1 and g(100) == 684


s.verify(check)
s.save()
