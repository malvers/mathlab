#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 15: Baumdiagramme, Pfadregeln, mit und ohne Zuruecklegen.
Deck: tools/pptx/build_baumdiagramme_mathe11.py - Quiz: HTML/mathetest11-baumdiagramme.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-baumdiagramme", "Baumdiagramme und Pfadregeln", kw=15)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Kugelschale", 1,
       r"In einer Schale liegen $3$ rote und $5$ blaue Kugeln. Es wird zweimal gezogen, und die erste Kugel wird **zurückgelegt**.",
       [r"Zeichne das Baumdiagramm im Kopf und gib die Wahrscheinlichkeiten der ersten Stufe an. Warum sind die der zweiten Stufe genauso groß?",
        r"Berechne die Wahrscheinlichkeit, zweimal Rot zu ziehen.",
        r"Berechne die Wahrscheinlichkeit, genau eine rote Kugel zu ziehen.",
        r"Berechne die Wahrscheinlichkeit für mindestens eine rote Kugel — einmal über die Pfade und einmal über das Gegenereignis."],
       solution=[
        r"Erste Stufe: $P(\text{rot}) = \dfrac{3}{8}$ und $P(\text{blau}) = \dfrac{5}{8}$. Weil die Kugel zurückgelegt wird, liegen vor dem zweiten Zug wieder dieselben $8$ Kugeln in der Schale — die zweite Stufe trägt an jedem Ast dieselben Wahrscheinlichkeiten.",
        r"Pfadmultiplikation entlang des Pfades rot-rot: $P = \dfrac{3}{8} \cdot \dfrac{3}{8} = \dfrac{9}{64} \approx 0{,}141$.",
        r"„Genau eine rot“ gehört zu **zwei** Pfaden: rot-blau und blau-rot. Jeder hat die Wahrscheinlichkeit $\dfrac{3}{8} \cdot \dfrac{5}{8} = \dfrac{15}{64}$. Pfadaddition: $P = \dfrac{15}{64} + \dfrac{15}{64} = \dfrac{30}{64} = \dfrac{15}{32} \approx 0{,}469$.",
        r"Über die Pfade: rot-rot, rot-blau und blau-rot, also $\dfrac{9}{64} + \dfrac{15}{64} + \dfrac{15}{64} = \dfrac{39}{64}$. Über das Gegenereignis „keine rote“, also blau-blau: $P = 1 - \dfrac{5}{8} \cdot \dfrac{5}{8} = 1 - \dfrac{25}{64} = \dfrac{39}{64} \approx 0{,}609$. Beide Wege führen zum selben Ergebnis, der zweite braucht nur einen Pfad."],
       falle=r"Die beiden Pfade für „genau eine rot“ dürfen nicht zu einem zusammengefasst werden. Wer nur $\dfrac{15}{64}$ angibt, halbiert die Wahrscheinlichkeit — rot-blau und blau-rot sind verschiedene Ausgänge.")

# --------------------------------------------------------------- AFB II ----
s.task("Dieselbe Schale, ohne Zurücklegen", 2,
       r"Dieselbe Schale mit $3$ roten und $5$ blauen Kugeln. Jetzt wird die erste Kugel **nicht** zurückgelegt.",
       [r"Gib die Wahrscheinlichkeiten der zweiten Stufe an, getrennt für die beiden Äste der ersten Stufe.",
        r"Berechne die Wahrscheinlichkeit für zweimal Rot und für genau eine rote Kugel.",
        r"Berechne die Wahrscheinlichkeit für mindestens eine rote Kugel.",
        r"Vergleiche mit den Ergebnissen aus Aufgabe 1. Erkläre, warum die eine Wahrscheinlichkeit kleiner und die andere größer wird."],
       solution=[
        r"Nach dem ersten Zug liegen nur noch $7$ Kugeln in der Schale. War die erste rot, bleiben $2$ rote und $5$ blaue: $\dfrac{2}{7}$ und $\dfrac{5}{7}$. War die erste blau, bleiben $3$ rote und $4$ blaue: $\dfrac{3}{7}$ und $\dfrac{4}{7}$.",
        r"Zweimal rot: $\dfrac{3}{8} \cdot \dfrac{2}{7} = \dfrac{6}{56} = \dfrac{3}{28} \approx 0{,}107$. Genau eine rot: $\dfrac{3}{8} \cdot \dfrac{5}{7} + \dfrac{5}{8} \cdot \dfrac{3}{7} = \dfrac{15}{56} + \dfrac{15}{56} = \dfrac{30}{56} = \dfrac{15}{28} \approx 0{,}536$.",
        r"Über das Gegenereignis: $P = 1 - \dfrac{5}{8} \cdot \dfrac{4}{7} = 1 - \dfrac{20}{56} = \dfrac{36}{56} = \dfrac{9}{14} \approx 0{,}643$.",
        r"Zweimal Rot wird **kleiner**: $\dfrac{3}{28} \approx 0{,}107$ statt $\dfrac{9}{64} \approx 0{,}141$. Nach der ersten roten Kugel ist eine rote weniger da, die zweite Rote wird unwahrscheinlicher. Mindestens eine Rote wird dagegen **größer**: $\dfrac{9}{14} \approx 0{,}643$ statt $\dfrac{39}{64} \approx 0{,}609$. Nach einer blauen Kugel steigt der Anteil der roten in der Restschale von $\dfrac{3}{8}$ auf $\dfrac{3}{7}$ — beim zweiten Zug ist Rot also wahrscheinlicher geworden."],
       falle=r"Ohne Zurücklegen ändert sich **beides**: die Anzahl der günstigen und die Gesamtzahl. Wer nur den Nenner von $8$ auf $7$ setzt und den Zähler stehen lässt, rechnet auf dem roten Ast mit $\dfrac{3}{7}$ statt $\dfrac{2}{7}$.")

# -------------------------------------------------------------- AFB III ----
s.task("Drei Würfe, eine Sechs?", 3,
       r"Ein Mitschüler behauptet: **„Ein Wurf mit dem Würfel gibt mit Wahrscheinlichkeit $\dfrac{1}{6}$ eine Sechs. Bei drei Würfen sind es also $3 \cdot \dfrac{1}{6} = \dfrac{1}{2}$ für mindestens eine Sechs.“**",
       [r"Berechne die richtige Wahrscheinlichkeit über das Gegenereignis.",
        r"Erkläre, warum das Addieren der Einzelwahrscheinlichkeiten hier falsch ist.",
        r"Führe seine Regel weiter: Was ergäbe sie für $6$ und für $12$ Würfe? Vergleiche jeweils mit dem richtigen Wert.",
        r"Beurteile die Behauptung. Wann darf man Wahrscheinlichkeiten addieren?"],
       solution=[
        r"Gegenereignis ist „keine einzige Sechs“, also dreimal hintereinander eine der fünf anderen Zahlen: $\left(\dfrac{5}{6}\right)^3 = \dfrac{125}{216}$. Damit $P(\text{mindestens eine Sechs}) = 1 - \dfrac{125}{216} = \dfrac{91}{216} \approx 0{,}421$ — deutlich weniger als die behaupteten $0{,}5$.",
        r"Die drei Ereignisse „Sechs im ersten Wurf“, „Sechs im zweiten“ und „Sechs im dritten“ schließen sich **nicht** gegenseitig aus: es können auch zwei oder drei Sechsen fallen. Beim Addieren werden diese Fälle mehrfach gezählt. Die Pfadaddition gilt nur für Pfade, die zu verschiedenen Ausgängen gehören.",
        r"Seine Regel gäbe bei $6$ Würfen $6 \cdot \dfrac{1}{6} = 1$, also **sichere** Sechs. Richtig ist $1 - \left(\dfrac{5}{6}\right)^6 \approx 0{,}665$. Bei $12$ Würfen ergäbe seine Regel $2$ — eine Wahrscheinlichkeit größer als $1$ ist unmöglich, damit widerlegt sich die Regel selbst. Richtig sind hier $1 - \left(\dfrac{5}{6}\right)^{12} \approx 0{,}888$.",
        r"Die Behauptung ist falsch. Addieren darf man nur Wahrscheinlichkeiten von Ereignissen, die sich **gegenseitig ausschließen** — also verschiedene Pfade im Baum. Bei „mindestens“-Fragen ist fast immer das Gegenereignis der kürzeste Weg: statt vieler Pfade zählt man den einen, in dem nichts eintritt, und zieht ihn von $1$ ab. Nebenbei zeigt die Rechnung: auch bei vielen Würfen bleibt die Wahrscheinlichkeit unter $1$, sicher wird eine Sechs nie."],
       falle=r"Wahrscheinlichkeiten über $1$ sind das sicherste Zeichen für einen Denkfehler. Ein Blick auf die Größenordnung fängt ihn ab, bevor man weiterrechnet.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    r, b = F(3, 8), F(5, 8)
    assert r + b == 1
    assert r * r == F(9, 64) and abs(float(r * r) - 0.1406) < 1e-4
    assert 2 * r * b == F(15, 32) and abs(float(2 * r * b) - 0.4688) < 1e-4
    assert r * r + 2 * r * b == F(39, 64) and 1 - b * b == F(39, 64)
    assert abs(float(F(39, 64)) - 0.6094) < 1e-4
    # without replacement
    rr = F(3, 8) * F(2, 7)
    assert rr == F(3, 28) and abs(float(rr) - 0.1071) < 1e-4
    one = F(3, 8) * F(5, 7) + F(5, 8) * F(3, 7)
    assert one == F(15, 28) and abs(float(one) - 0.5357) < 1e-4
    at_least = 1 - F(5, 8) * F(4, 7)
    assert at_least == F(9, 14) and abs(float(at_least) - 0.6429) < 1e-4
    assert rr < F(9, 64) and at_least > F(39, 64)
    assert F(3, 7) > F(3, 8)
    # dice
    p3 = 1 - F(5, 6) ** 3
    assert F(5, 6) ** 3 == F(125, 216) and p3 == F(91, 216) and abs(float(p3) - 0.4213) < 1e-4
    assert p3 < F(1, 2)
    p6 = 1 - F(5, 6) ** 6
    assert abs(float(p6) - 0.6651) < 1e-4 and 6 * F(1, 6) == 1
    p12 = 1 - F(5, 6) ** 12
    assert abs(float(p12) - 0.8878) < 1e-4 and 12 * F(1, 6) == 2 > 1


s.verify(check)
s.save()
