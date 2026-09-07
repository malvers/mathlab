#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 50: Sinusfunktion vertieft - Amplitude, Periode, Verschiebung.
Deck: tools/pptx/build_sinus2_mathe11.py - Quiz: HTML/mathetest11-sinus2.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-sinus2", "Amplitude, Periode, Verschiebung", kw=50)

# ---------------------------------------------------------------- AFB I ----
s.task("Der Pegel im Hafen", 1,
       r"Der Wasserstand in einem Hafen schwankt mit den Gezeiten. Er wird beschrieben durch $h(t) = 1{,}5 \cdot \sin\left(\dfrac{\pi}{6}t\right) + 4$, mit $t$ in Stunden nach Mitternacht und $h$ in Metern.",
       [r"Gib Amplitude und Mittellage an. Zwischen welchen Werten schwankt der Pegel?",
        r"Berechne die Periode. Was bedeutet sie für den Hafen?",
        r"Berechne $h(0)$, $h(3)$ und $h(9)$ und benenne, was jeder Wert beschreibt.",
        r"Wie lange dauert es vom Hoch- zum Niedrigwasser, und um wie viel sinkt der Pegel dabei?"],
       solution=[
        r"Der Faktor vor dem Sinus ist die **Amplitude**: $a = 1{,}5$ m. Die angehängte $4$ ist die **Mittellage**. Der Sinus läuft zwischen $-1$ und $1$, also schwankt der Pegel zwischen $4 - 1{,}5 = 2{,}5$ m und $4 + 1{,}5 = 5{,}5$ m.",
        r"Periode $T = \dfrac{2\pi}{b}$ mit $b = \dfrac{\pi}{6}$, also $T = \dfrac{2\pi \cdot 6}{\pi} = 12$ Stunden. Alle $12$ Stunden wiederholt sich der Pegelverlauf — im Hafen gibt es also zweimal am Tag Hoch- und Niedrigwasser.",
        r"$h(0) = 1{,}5 \cdot \sin 0 + 4 = 4$ m: um Mitternacht steht der Pegel in der Mittellage. $h(3) = 1{,}5 \cdot \sin\dfrac{\pi}{2} + 4 = 1{,}5 + 4 = 5{,}5$ m: um $3$ Uhr ist **Hochwasser**. $h(9) = 1{,}5 \cdot \sin\dfrac{3\pi}{2} + 4 = -1{,}5 + 4 = 2{,}5$ m: um $9$ Uhr ist **Niedrigwasser**.",
        r"Vom Hoch- zum Niedrigwasser vergeht eine **halbe** Periode, also $6$ Stunden. Der Pegel sinkt dabei von $5{,}5$ m auf $2{,}5$ m, das sind $3$ m — genau die **doppelte Amplitude**."],
       falle=r"Die Amplitude ist der Abstand zur Mittellage, nicht der gesamte Hub. Zwischen tiefstem und höchstem Stand liegen $2a = 3$ m, die Amplitude ist aber $1{,}5$ m.")

# --------------------------------------------------------------- AFB II ----
s.task("Wie lang ist der Tag?", 2,
       r"Die Tageslänge an einem Ort in Deutschland lässt sich näherungsweise beschreiben durch $L(t) = 4 \cdot \sin\left(\dfrac{2\pi}{365}(t - 80)\right) + 12$. Dabei zählt $t$ die Tage ab dem $1$. Januar, und $L$ ist die Tageslänge in Stunden.",
       [r"Bestimme Amplitude, Mittellage und Periode und deute alle drei im Sachzusammenhang.",
        r"Wie lang ist der längste, wie lang der kürzeste Tag nach diesem Modell?",
        r"An welchen Tagen ist die Tageslänge genau $12$ Stunden? Rechne die Werte in Kalenderdaten um.",
        r"Berechne die Tageslänge am $21$. Juni, also für $t = 172$. Passt das Ergebnis zu b)?"],
       solution=[
        r"Amplitude $a = 4$ Stunden: so weit weicht die Tageslänge höchstens vom Mittel ab. Mittellage $d = 12$ Stunden: das ist die mittlere Tageslänge über das Jahr. Periode $T = \dfrac{2\pi}{2\pi/365} = 365$ Tage — der Verlauf wiederholt sich jährlich.",
        r"Der Sinus wird höchstens $1$ und mindestens $-1$. Längster Tag: $12 + 4 = 16$ Stunden. Kürzester Tag: $12 - 4 = 8$ Stunden.",
        r"$L(t) = 12$ verlangt $\sin\left(\dfrac{2\pi}{365}(t - 80)\right) = 0$, also $\dfrac{2\pi}{365}(t - 80) = 0$ oder $= \pi$. Daraus $t = 80$ und $t - 80 = 182{,}5$, also $t = 262{,}5$. Der Tag $80$ ist der $21$. März, der Tag $262$ bis $263$ der $20$. bis $21$. September — die beiden **Tagundnachtgleichen**.",
        r"$\dfrac{2\pi}{365}(172 - 80) = \dfrac{2\pi \cdot 92}{365} \approx 1{,}5837$. Der Sinus davon ist $\approx 0{,}9999$, also $L(172) \approx 4 \cdot 0{,}9999 + 12 \approx 16{,}0$ Stunden. Das passt zu b): der $21$. Juni ist praktisch genau der längste Tag, denn $80 + \dfrac{365}{4} \approx 171$."],
       falle=r"Die $80$ steht im Term mit Minus und verschiebt nach **rechts**, also in den März. Wer sie als Verschiebung nach links liest, legt den längsten Tag in den Winter.")

# -------------------------------------------------------------- AFB III ----
s.task("Größeres b, längere Periode?", 3,
       r"Ein Mitschüler behauptet: **„In $f(x) = \sin(bx)$ macht ein größeres $b$ die Periode größer — mehr $b$, mehr Welle.“** Außerdem meint er, $g(x) = -4\sin x$ habe die Amplitude $-4$.",
       [r"Vergleiche $\sin x$ und $\sin(2x)$: Wo liegen jeweils die ersten drei Nullstellen, und wie groß ist die Periode?",
        r"Begründe die Formel $T = \dfrac{2\pi}{b}$ und erkläre, was $b$ mit dem Graphen macht.",
        r"Wechselstrom aus der Steckdose wird durch $u(t) = 325 \cdot \sin(100\pi t)$ beschrieben, $t$ in Sekunden. Bestimme Amplitude, Periode und Frequenz. Warum spricht man trotzdem von $230$ Volt?",
        r"Beurteile beide Behauptungen und formuliere je einen Merksatz zu $a$ und zu $b$."],
       solution=[
        r"$\sin x$ hat Nullstellen bei $0$, $\pi$, $2\pi$ und die Periode $2\pi$. $\sin(2x)$ wird null, wenn $2x = 0$, $\pi$, $2\pi$ ist, also bei $0$, $\dfrac{\pi}{2}$, $\pi$ — die Periode ist $\pi$. Das größere $b$ **halbiert** die Periode, die Behauptung ist falsch.",
        r"Der Sinus durchläuft eine volle Schwingung, während sein Argument von $0$ bis $2\pi$ läuft. Hier ist das Argument $bx$, also muss $bx$ den Wert $2\pi$ erreichen: $x = \dfrac{2\pi}{b}$. Ein großes $b$ lässt das Argument schneller wachsen und **staucht** den Graphen in $x$-Richtung; ein $b$ zwischen $0$ und $1$ zieht ihn auseinander.",
        r"Amplitude $325$ Volt, das ist der Scheitelwert. Periode: $T = \dfrac{2\pi}{100\pi} = 0{,}02$ s. Frequenz: $f = \dfrac{1}{T} = 50$ Hertz, also $50$ Schwingungen je Sekunde. Die $230$ Volt sind nicht der Scheitelwert, sondern der **Effektivwert** $\dfrac{325}{\sqrt{2}} \approx 229{,}8$ Volt — die Spannung, die als Gleichspannung dieselbe Leistung brächte.",
        r"Beide Behauptungen sind falsch. Merksatz zu $a$: **$a$ streckt in der Höhe**, die Amplitude ist $|a|$; ein negatives $a$ spiegelt den Graphen an der Mittellage, macht ihn aber nicht kleiner. Merksatz zu $b$: **$b$ staucht in der Breite**, und zwar umgekehrt proportional — doppeltes $b$ heißt halbe Periode."],
       falle=r"$a$ und $b$ wirken in verschiedene Richtungen und gegenläufig. $a$ wirkt direkt auf die Höhe, $b$ **umgekehrt** auf die Breite — deshalb steht $b$ im Nenner der Periodenformel.")


# ---------------------------------------------------------- numbers check ----
def check():
    import math
    h = lambda t: 1.5 * math.sin(math.pi / 6 * t) + 4
    assert abs(h(0) - 4) < 1e-12 and abs(h(3) - 5.5) < 1e-12 and abs(h(9) - 2.5) < 1e-12
    assert abs(2 * math.pi / (math.pi / 6) - 12) < 1e-12
    assert abs(h(12) - h(0)) < 1e-9 and 4 - 1.5 == 2.5 and 4 + 1.5 == 5.5
    assert 5.5 - 2.5 == 3 == 2 * 1.5 and 12 / 2 == 6
    L = lambda t: 4 * math.sin(2 * math.pi / 365 * (t - 80)) + 12
    assert abs(2 * math.pi / (2 * math.pi / 365) - 365) < 1e-9
    assert abs(L(80) - 12) < 1e-12 and abs(L(262.5) - 12) < 1e-9
    assert abs(365 / 2 - 182.5) < 1e-12 and 80 + 182.5 == 262.5
    arg = 2 * math.pi * 92 / 365
    assert abs(arg - 1.583708) < 1e-5 and abs(math.sin(arg) - 0.99992) < 1e-4
    assert abs(L(172) - 15.9997) < 1e-3 and abs(80 + 365 / 4 - 171.25) < 1e-9
    assert 12 + 4 == 16 and 12 - 4 == 8
    # alternating current
    assert abs(2 * math.pi / (100 * math.pi) - 0.02) < 1e-15 and abs(1 / 0.02 - 50) < 1e-12
    assert abs(325 / math.sqrt(2) - 229.81) < 1e-2
    assert abs(2 * math.pi / 2 - math.pi) < 1e-12


s.verify(check)
s.save()
