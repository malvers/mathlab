#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 4: Wiederholung vor Klassenarbeit 2 - LB 3 bis zum Logarithmus.
Deck: tools/pptx/build_ka2_mathe11.py - Quiz: HTML/mathetest11-ka2.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-ka2", "Wiederholung vor Klassenarbeit 2", kw=4)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Taxifahrt", 1,
       r"Ein Taxi berechnet $3{,}90$ € Grundpreis und $2{,}20$ € je gefahrenem Kilometer. Die Kosten für $x$ Kilometer sind $K(x) = 2{,}20x + 3{,}90$.",
       [r"Was kostet eine Fahrt über $12$ km?",
        r"Bestätige den Anstieg $2{,}20$ aus den beiden Fahrten über $5$ km und über $15$ km.",
        r"Bestimme die Umkehrfunktion $K^{-1}$ und sage, was sie im Sachzusammenhang beantwortet.",
        r"Wie weit kommt man mit $25$ €? Mache die Probe mit $K$."],
       solution=[
        r"$K(12) = 2{,}20 \cdot 12 + 3{,}90 = 26{,}40 + 3{,}90 = 30{,}30$ €.",
        r"$K(5) = 11 + 3{,}90 = 14{,}90$ € und $K(15) = 33 + 3{,}90 = 36{,}90$ €. Anstieg: $m = \dfrac{36{,}90 - 14{,}90}{15 - 5} = \dfrac{22}{10} = 2{,}20$ — das ist der Preis je Kilometer.",
        r"Aus $y = 2{,}20x + 3{,}90$ folgt $x = \dfrac{y - 3{,}90}{2{,}20}$, also $K^{-1}(x) = \dfrac{x - 3{,}90}{2{,}20}$. Sie beantwortet die umgekehrte Frage: **wie viele Kilometer** bekommt man für einen gegebenen Betrag?",
        r"$K^{-1}(25) = \dfrac{25 - 3{,}90}{2{,}20} = \dfrac{21{,}10}{2{,}20} \approx 9{,}59$ km. Probe: $K(9{,}59) = 21{,}098 + 3{,}90 \approx 25{,}00$ €. Bezahlen kann man also knapp $9{,}6$ Kilometer."],
       falle=r"Der Grundpreis wird zuerst abgezogen und **danach** geteilt. $\dfrac{25}{2{,}20} - 3{,}90 \approx 7{,}47$ km wäre um mehr als zwei Kilometer zu wenig.")

# --------------------------------------------------------------- AFB II ----
s.task("Vier Familien, vier Fragen", 2,
       r"In der Klassenarbeit kommen alle vier Funktionsfamilien vor. **(1)** Ein Teich steht $120$ cm hoch und verliert täglich $4$ cm. **(2)** Ein Ball fliegt gemäß $h(t) = -5t^2 + 20t$, mit $t$ in Sekunden und $h$ in Metern. **(3)** Ein Guthaben wächst mit $6\,\%$ im Jahr. **(4)** Ein Messwert schwankt gemäß $f(t) = 3 \cdot \sin\left(\dfrac{\pi}{4}t\right) + 7$.",
       [r"Ordne jeder Situation ihren Funktionstyp zu und stelle für (1) die Funktionsgleichung auf. Wann ist der Teich leer?",
        r"Bestimme für (2) die maximale Höhe und die Flugdauer.",
        r"Nach wie vielen Jahren hat sich das Guthaben in (3) verdoppelt? Vergleiche mit der Faustregel.",
        r"Bestimme für (4) Periode und Wertebereich."],
       solution=[
        r"(1) linear, (2) quadratisch, (3) exponentiell, (4) periodisch. Für den Teich: $p(t) = 120 - 4t$ mit $t$ in Tagen. Nullstelle: $4t = 120$, also $t = 30$ — nach $30$ Tagen ist er leer.",
        r"Scheitel: $t_S = -\dfrac{20}{2 \cdot (-5)} = 2$ Sekunden, Höhe $h(2) = -20 + 40 = 20$ m. Flugdauer bis zum Aufkommen: $-5t^2 + 20t = 0$, ausklammern zu $-5t(t - 4) = 0$, also $t = 0$ oder $t = 4$. Der Ball ist **$4$ Sekunden** unterwegs und erreicht $20$ m Höhe.",
        r"$1{,}06^t = 2$, beide Seiten logarithmieren: $t = \dfrac{\lg 2}{\lg 1{,}06} = \dfrac{0{,}30103}{0{,}025306} \approx 11{,}9$ Jahre. Die Faustregel liefert $\dfrac{70}{6} \approx 11{,}7$ Jahre — knapp daneben und ohne Rechner zu haben. Der Startbetrag spielt keine Rolle, er kürzt sich heraus.",
        r"Periode: $T = \dfrac{2\pi}{\pi/4} = 8$. Die Amplitude ist $3$, die Mittellage $7$, also schwankt der Messwert zwischen $7 - 3 = 4$ und $7 + 3 = 10$. Wertebereich: $4 \leq f(t) \leq 10$."],
       falle=r"Bei (2) ist der Scheitel nach $2$ Sekunden, die Flugdauer aber $4$ Sekunden. Wer beides verwechselt, halbiert die Flugzeit — die Frage entscheidet, ob der Scheitel oder die Nullstelle gebraucht wird.")

# -------------------------------------------------------------- AFB III ----
s.task("Einfach logarithmieren?", 3,
       r"Eine Mitschülerin sagt: **„Wenn ich eine Gleichung nicht lösen kann, logarithmiere ich einfach beide Seiten — das geht immer.“** Geprüft wird an drei Gleichungen: $2^x = 10$, $x^2 = 10$ und $x + 3 = 10$.",
       [r"Wende ihr Verfahren auf $2^x = 10$ an. Führt es zum Ziel?",
        r"Wende es auf $x^2 = 10$ an. Was kommt heraus, und welche Lösung fehlt?",
        r"Wende es auf $x + 3 = 10$ an. Was beobachtest du?",
        r"Beurteile ihr Verfahren. Formuliere, wann Logarithmieren der richtige Schritt ist und wann nicht."],
       solution=[
        r"$\lg\left(2^x\right) = \lg 10$ ergibt $x \cdot \lg 2 = 1$, also $x = \dfrac{1}{\lg 2} \approx 3{,}3219$. Hier führt es zum Ziel, denn das Logarithmengesetz $\lg(a^x) = x \cdot \lg a$ holt das $x$ **aus dem Exponenten heraus**. Probe: $2^{3{,}3219} \approx 10$.",
        r"$\lg\left(x^2\right) = \lg 10$ ergibt $2 \cdot \lg x = 1$, also $\lg x = 0{,}5$ und $x = 10^{0{,}5} = \sqrt{10} \approx 3{,}162$. Das ist eine richtige Lösung, aber die zweite fehlt: auch $x = -\sqrt{10}$ erfüllt $x^2 = 10$. Der Logarithmus ist für negative Zahlen nicht definiert, deshalb kann er diese Lösung gar nicht liefern.",
        r"$\lg(x + 3) = \lg 10 = 1$ ergibt $x + 3 = 10$ und damit $x = 7$. Es funktioniert, ist aber ein Umweg: das Logarithmieren wird sofort wieder rückgängig gemacht. Zerlegen darf man $\lg(x + 3)$ **nicht**, für Summen gibt es kein Gesetz.",
        r"Das Verfahren ist nicht falsch, aber auch nicht immer sinnvoll. Logarithmieren ist der richtige Schritt genau dann, wenn die Unbekannte **im Exponenten** steht und sich die Basen nicht angleichen lassen. Steht die Unbekannte in der Basis, führt die Wurzel schneller zum Ziel und verliert keine Lösung. Steht sie in einer Summe, bringt Logarithmieren gar nichts. Und immer gilt: vorher die Potenz isolieren, hinterher die Probe machen."],
       falle=r"Logarithmieren kann Lösungen **verlieren**, weil der Logarithmus nur für positive Zahlen definiert ist. Bei geraden Exponenten muss die negative Lösung von Hand ergänzt werden.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    K = lambda x: F(22, 10) * x + F(39, 10)
    assert K(12) == F(303, 10) and K(5) == F(149, 10) and K(15) == F(369, 10)
    assert (K(15) - K(5)) / 10 == F(22, 10)
    Ki = lambda y: (F(y) - F(39, 10)) / F(22, 10)
    assert abs(float(Ki(25)) - 9.5909) < 1e-4 and abs(float(K(Ki(25))) - 25) < 1e-9
    assert abs(25 / 2.2 - 3.9 - 7.4636) < 1e-3
    # four families
    p = lambda t: 120 - 4 * t
    assert p(30) == 0 and F(120, 4) == 30
    h = lambda t: -5 * t ** 2 + 20 * t
    assert -20 / (2 * -5) == 2 and h(2) == 20 and h(0) == 0 and h(4) == 0
    td = math.log10(2) / math.log10(1.06)
    assert abs(math.log10(1.06) - 0.0253059) < 1e-6 and abs(td - 11.8957) < 1e-3
    assert abs(70 / 6 - 11.6667) < 1e-3 and abs(1.06 ** td - 2) < 1e-9
    f = lambda t: 3 * math.sin(math.pi / 4 * t) + 7
    assert abs(2 * math.pi / (math.pi / 4) - 8) < 1e-12 and abs(f(8) - f(0)) < 1e-9
    assert abs(f(2) - 10) < 1e-12 and abs(f(6) - 4) < 1e-12
    # logarithmise everything?
    assert abs(1 / math.log10(2) - 3.32193) < 1e-5 and abs(2 ** (1 / math.log10(2)) - 10) < 1e-9
    assert abs(10 ** 0.5 - math.sqrt(10)) < 1e-12 and abs(math.sqrt(10) - 3.16228) < 1e-5
    assert abs((-math.sqrt(10)) ** 2 - 10) < 1e-9
    assert math.log10(10) == 1 and 10 - 3 == 7


s.verify(check)
s.save()
