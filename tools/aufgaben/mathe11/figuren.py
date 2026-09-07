#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 39: ebene Figuren, Koerper, Skalieren - Abschluss LB 2.
Deck: tools/pptx/build_figuren_mathe11.py - Quiz: HTML/mathetest11-figuren.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-figuren", "Figuren und Körper", kw=39)

# ---------------------------------------------------------------- AFB I ----
s.task("Rasen und Beet", 1,
       r"Ein rechteckiger Garten ist $12$ m lang und $8$ m breit. Mitten darin liegt ein kreisrundes Blumenbeet mit Radius $2$ m, der Rest ist Rasen.",
       [r"Berechne die Fläche des Gartens.",
        r"Berechne die Fläche des Beetes exakt und gerundet auf eine Nachkommastelle.",
        r"Wie groß ist die Rasenfläche? Rasensamen reicht für $25\ \mathrm{m^2}$ je Packung — wie viele Packungen werden gebraucht?",
        r"Der Garten wird eingezäunt. Wie lang wird der Zaun? Ein Nachbargarten ist ebenfalls rechteckig, hat denselben Zaun, aber eine Seite von $15$ m. Berechne seine Breite und seine Fläche."],
       solution=[
        r"$A = a \cdot b = 12 \cdot 8 = 96\ \mathrm{m^2}$.",
        r"$A = \pi r^2 = \pi \cdot 2^2 = 4\pi\ \mathrm{m^2}$, das sind rund $12{,}6\ \mathrm{m^2}$.",
        r"$96 - 4\pi \approx 96 - 12{,}566 = 83{,}4\ \mathrm{m^2}$. Wegen $83{,}4 : 25 = 3{,}34$ reichen drei Packungen nicht, es werden **vier** gebraucht — bei Material wird immer aufgerundet.",
        r"$U = 2(a + b) = 2(12 + 8) = 40$ m. Für den Nachbargarten gilt $2(15 + b) = 40$, also $15 + b = 20$ und $b = 5$ m. Seine Fläche: $15 \cdot 5 = 75\ \mathrm{m^2}$ — bei **gleichem Zaun** über $20\ \mathrm{m^2}$ weniger Garten."],
       falle=r"Aus $U = 40$ m und $a = 15$ m folgt nicht $b = 40 - 15 = 25$ m. Der Umfang zählt jede Seite **doppelt**, deshalb wird erst halbiert und dann abgezogen.")

# --------------------------------------------------------------- AFB II ----
s.task("Das Getreidesilo", 2,
       r"Ein Silo besteht aus einem Zylinder mit Radius $3$ m und Höhe $8$ m, darauf sitzt ein Kegel mit demselben Radius und $4$ m Höhe. Es gilt $V_{\text{Zyl}} = \pi r^2 h$ und $V_{\text{Kegel}} = \dfrac{1}{3}\pi r^2 h$.",
       [r"Berechne das Volumen des zylindrischen Teils exakt und gerundet.",
        r"Berechne das Volumen des Kegels und das Gesamtvolumen des Silos.",
        r"Wie hoch müsste ein reiner Zylinder mit demselben Radius sein, damit er genauso viel fasst? Was fällt am Vergleich mit der Kegelhöhe auf?",
        r"Der Zylindermantel soll gestrichen werden, $1$ Liter Farbe reicht für $8\ \mathrm{m^2}$. Wie viele Liter werden gebraucht? Es gilt $M = 2\pi r h$."],
       solution=[
        r"$V_{\text{Zyl}} = \pi \cdot 3^2 \cdot 8 = 72\pi\ \mathrm{m^3} \approx 226{,}2\ \mathrm{m^3}$.",
        r"$V_{\text{Kegel}} = \dfrac{1}{3}\pi \cdot 9 \cdot 4 = 12\pi\ \mathrm{m^3} \approx 37{,}7\ \mathrm{m^3}$. Zusammen: $72\pi + 12\pi = 84\pi\ \mathrm{m^3} \approx 263{,}9\ \mathrm{m^3}$.",
        r"Gesucht ist $h$ mit $9\pi h = 84\pi$, also $h = \dfrac{84}{9} = \dfrac{28}{3} \approx 9{,}33$ m. Der Kegel von $4$ m Höhe bringt also nur $\dfrac{4}{3}$ m zusätzliche Zylinderhöhe — genau **ein Drittel**, weil ein Kegel ein Drittel des Zylinders gleicher Grundfläche und Höhe fasst.",
        r"$M = 2\pi \cdot 3 \cdot 8 = 48\pi\ \mathrm{m^2} \approx 150{,}8\ \mathrm{m^2}$. Wegen $150{,}8 : 8 = 18{,}85$ werden **$19$ Liter** gebraucht."],
       falle=r"Der Mantel ist $2\pi r h$, nicht $\pi r^2 h$. Ein Volumen hat die Einheit $\mathrm{m^3}$, eine Fläche $\mathrm{m^2}$ — die Einheit verrät den Fehler sofort.")

# -------------------------------------------------------------- AFB III ----
s.task("Doppelt so groß, doppelt so viel?", 3,
       r"Eine Mitschülerin behauptet: **„Wenn ich alle Maße einer Verpackung verdopple, passt doppelt so viel hinein — und ich brauche doppelt so viel Karton.“**",
       [r"Prüfe die Behauptung an einem Würfel mit $10$ cm Kantenlänge, der auf $20$ cm vergrößert wird. Vergleiche Volumen und Oberfläche.",
        r"Begründe allgemein: Werden alle Maße mit dem Faktor $k$ multipliziert, womit werden dann Flächen und Volumen multipliziert?",
        r"Eine Pizza mit $20$ cm Durchmesser kostet $6$ €, eine mit $40$ cm kostet $22$ €. Welche ist je Quadratzentimeter günstiger?",
        r"Beurteile die Behauptung. Erkläre damit, warum Großpackungen je Liter weniger Verpackung brauchen."],
       solution=[
        r"Kleiner Würfel: $V = 10^3 = 1\,000\ \mathrm{cm^3}$, Oberfläche $6 \cdot 10^2 = 600\ \mathrm{cm^2}$. Großer Würfel: $V = 20^3 = 8\,000\ \mathrm{cm^3}$, Oberfläche $6 \cdot 20^2 = 2\,400\ \mathrm{cm^2}$. Das Volumen wird **achtmal**, die Oberfläche **viermal** so groß — beides nicht doppelt.",
        r"In jeder Flächenformel stehen zwei Längen als Faktoren, in jeder Volumenformel drei. Aus $k$-mal so langen Kanten wird also $k^2$-mal so viel Fläche und $k^3$-mal so viel Volumen. Für $k = 2$: $k^2 = 4$ und $k^3 = 8$, wie in a).",
        r"Kleine Pizza: $A = \pi \cdot 10^2 = 100\pi \approx 314{,}2\ \mathrm{cm^2}$, also $\dfrac{600}{314{,}2} \approx 1{,}91$ Cent je $\mathrm{cm^2}$. Große Pizza: $A = \pi \cdot 20^2 = 400\pi \approx 1\,256{,}6\ \mathrm{cm^2}$, also $\dfrac{2\,200}{1\,256{,}6} \approx 1{,}75$ Cent je $\mathrm{cm^2}$. Die große Pizza ist günstiger, obwohl sie fast das Vierfache kostet — sie enthält viermal so viel.",
        r"Die Behauptung ist doppelt falsch: das Volumen wächst mit $k^3$, die Oberfläche nur mit $k^2$. Der Karton wächst also **langsamer** als der Inhalt. Deshalb braucht eine Großpackung je Liter weniger Material — beim Würfel oben: $0{,}6\ \mathrm{cm^2}$ je $\mathrm{cm^3}$ gegenüber $0{,}3\ \mathrm{cm^2}$ je $\mathrm{cm^3}$, also nur noch die Hälfte."],
       falle=r"„Doppelt so groß“ ist zweideutig. Gemeint sein kann die doppelte Kantenlänge oder das doppelte Volumen — für doppeltes Volumen müssten die Kanten nur mit $\sqrt[3]{2} \approx 1{,}26$ wachsen.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    from fractions import Fraction as F
    # garden
    assert 12 * 8 == 96
    beet = math.pi * 4
    assert abs(beet - 12.5664) < 1e-4 and abs(round(beet, 1) - 12.6) < 1e-9
    rasen = 96 - beet
    assert abs(rasen - 83.4336) < 1e-4 and abs(round(rasen, 1) - 83.4) < 1e-9
    assert math.ceil(rasen / 25) == 4 and abs(rasen / 25 - 3.337) < 0.01
    assert 2 * (12 + 8) == 40 and (40 // 2) - 15 == 5 and 15 * 5 == 75 and 96 - 75 == 21
    # silo
    assert math.pi * 9 * 8 == math.pi * 72 and abs(72 * math.pi - 226.19) < 0.01
    assert F(1, 3) * 9 * 4 == 12 and abs(12 * math.pi - 37.70) < 0.01
    assert 72 + 12 == 84 and abs(84 * math.pi - 263.89) < 0.01
    assert F(84, 9) == F(28, 3) and abs(F(28, 3) - 9.333) < 0.001 and F(28, 3) - 8 == F(4, 3)
    mantel = 2 * math.pi * 3 * 8
    assert abs(mantel - 48 * math.pi) < 1e-12 and abs(mantel - 150.796) < 0.01
    assert math.ceil(mantel / 8) == 19 and abs(mantel / 8 - 18.85) < 0.01
    # scaling
    assert 10 ** 3 == 1000 and 20 ** 3 == 8000 and 8000 / 1000 == 8
    assert 6 * 10 ** 2 == 600 and 6 * 20 ** 2 == 2400 and 2400 / 600 == 4
    assert abs(600 / (math.pi * 100) - 1.9099) < 1e-3
    assert abs(2200 / (math.pi * 400) - 1.7507) < 1e-3
    assert 2200 / (math.pi * 400) < 600 / (math.pi * 100)
    assert 600 / 1000 == 0.6 and 2400 / 8000 == 0.3
    assert abs(2 ** (1 / 3) - 1.2599) < 1e-4


s.verify(check)
s.save()
