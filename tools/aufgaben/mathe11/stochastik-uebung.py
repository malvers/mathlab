#!/usr/bin/env python3
"""Textaufgaben Mathe 11, KW 18: Uebung Stochastik - Pfade, Vierfeldertafel, Erwartungswert.
Deck: tools/pptx/build_stochastik_uebung_mathe11.py - Quiz: HTML/mathetest11-stochastik-uebung.html"""
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
from textaufgaben import Sheet

s = Sheet("mathe11-stochastik-uebung", "Übung Stochastik", kw=18)

# ---------------------------------------------------------------- AFB I ----
s.task("Die Losbox beim Schulfest", 1,
       r"Am Stand der Klasse 11 steht eine Losbox mit $10$ Losen, davon sind $4$ Gewinne. Wer ein Los zieht, behält es, es wird also **nicht zurückgelegt**.",
       [r"Wie groß ist die Wahrscheinlichkeit, mit einem Los zu gewinnen? Wie groß ist die für eine Niete?",
        r"Jemand zieht zwei Lose nacheinander. Wie groß ist die Wahrscheinlichkeit für zwei Gewinne?",
        r"Wie groß ist die Wahrscheinlichkeit für genau einen Gewinn bei zwei Losen?",
        r"Wie groß ist die Wahrscheinlichkeit für mindestens einen Gewinn bei zwei Losen? Rechne über das Gegenereignis und prüfe mit b) und c)."],
       solution=[
        r"Günstige durch mögliche: $P(\text{Gewinn}) = \dfrac{4}{10} = 0{,}4$. Gegenereignis: $P(\text{Niete}) = 1 - 0{,}4 = 0{,}6$.",
        r"Nach dem ersten Gewinn sind nur noch $9$ Lose da, davon $3$ Gewinne. Pfadregel: $\dfrac{4}{10} \cdot \dfrac{3}{9} = \dfrac{12}{90} = \dfrac{2}{15} \approx 0{,}133$.",
        r"Zwei Pfade: erst Gewinn, dann Niete, oder umgekehrt. $\dfrac{4}{10} \cdot \dfrac{6}{9} + \dfrac{6}{10} \cdot \dfrac{4}{9} = \dfrac{24}{90} + \dfrac{24}{90} = \dfrac{48}{90} = \dfrac{8}{15} \approx 0{,}533$.",
        r"Gegenereignis „keine Gewinne“: $\dfrac{6}{10} \cdot \dfrac{5}{9} = \dfrac{30}{90} = \dfrac{1}{3}$. Also $P(\text{mindestens einer}) = 1 - \dfrac{1}{3} = \dfrac{2}{3}$. Probe: $\dfrac{2}{15} + \dfrac{8}{15} = \dfrac{10}{15} = \dfrac{2}{3}$, und alle drei Fälle zusammen $\dfrac{2}{15} + \dfrac{8}{15} + \dfrac{5}{15} = 1$."],
       falle=r"Falle in b): mit Zurücklegen rechnen, also $0{,}4 \cdot 0{,}4 = 0{,}16$. Das Los bleibt aber draußen, die zweite Stufe hat andere Zahlen.")

# --------------------------------------------------------------- AFB II ----
s.task("Bremsen in der Fahrradwerkstatt", 2,
       r"Eine Fahrradwerkstatt wertet die Inspektionen eines Monats aus: $200$ Räder wurden geprüft, darunter $120$ E-Bikes. Bei $30$ E-Bikes und bei $10$ der übrigen Räder musste die Bremse repariert werden.",
       [r"Lege eine Vierfeldertafel an (E-Bike / kein E-Bike, Bremse defekt / in Ordnung) und fülle alle Felder samt Randsummen.",
        r"Wie groß ist die Wahrscheinlichkeit, dass ein zufällig gewähltes Rad einen Bremsdefekt hat? Wie groß ist sie, wenn man weiß, dass es ein E-Bike ist? Und wenn es keines ist?",
        r"Sind die Merkmale „E-Bike“ und „Bremsdefekt“ stochastisch unabhängig? Rechne nach und deute das Ergebnis.",
        r"Der Werkstattleiter sagt: „Drei von vier Rädern mit Bremsdefekt sind E-Bikes, also hat jedes E-Bike zu $75\,\%$ einen Bremsdefekt.“ Prüfe beide Teile der Aussage."],
       solution=[
        r"E-Bike und defekt $30$, E-Bike und in Ordnung $120 - 30 = 90$; kein E-Bike und defekt $10$, kein E-Bike und in Ordnung $80 - 10 = 70$. Randsummen: $120$ E-Bikes und $80$ andere, $40$ defekt und $160$ in Ordnung, gesamt $200$.",
        r"$P(\text{defekt}) = \dfrac{40}{200} = 0{,}2$. Mit Bedingung immer Teilmenge durch Bedingung: $P(\text{defekt} \mid \text{E-Bike}) = \dfrac{30}{120} = 0{,}25$ und $P(\text{defekt} \mid \text{kein E-Bike}) = \dfrac{10}{80} = 0{,}125$.",
        r"Unabhängig hieße $P(\text{E-Bike} \cap \text{defekt}) = P(\text{E-Bike}) \cdot P(\text{defekt})$. Links: $\dfrac{30}{200} = 0{,}15$. Rechts: $0{,}6 \cdot 0{,}2 = 0{,}12$. Ungleich, also **abhängig**. Deutung: Bei E-Bikes ist ein Bremsdefekt doppelt so wahrscheinlich wie bei anderen Rädern ($0{,}25$ gegen $0{,}125$), sie sind schwerer und schneller.",
        r"Erster Teil: $P(\text{E-Bike} \mid \text{defekt}) = \dfrac{30}{40} = 0{,}75$, das stimmt. Zweiter Teil: gemeint ist $P(\text{defekt} \mid \text{E-Bike}) = \dfrac{30}{120} = 0{,}25$, also $25\,\%$, nicht $75\,\%$. Die Bedingung wurde umgedreht: „unter den Defekten“ ist etwas anderes als „unter den E-Bikes“."],
       falle=r"Die beiden bedingten Wahrscheinlichkeiten $P(A \mid B)$ und $P(B \mid A)$ haben denselben Zähler $30$, aber verschiedene Nenner. Wer sie vertauscht, rechnet richtig und antwortet falsch.")

# -------------------------------------------------------------- AFB III ----
s.task("Ist das Glücksrad fair?", 3,
       r"Am Nachbarstand dreht man für $1$ € Einsatz ein Glücksrad mit $10$ gleich großen Feldern: Auf einem Feld steht „$5$ €“, auf zwei Feldern „$2$ €“, die übrigen sieben sind Nieten. Ein Mitschüler behauptet: **„Das Spiel ist fair, im Schnitt bekommt man seinen Euro zurück.“**",
       [r"Berechne den Erwartungswert des Gewinns (Auszahlung minus Einsatz) und prüfe die Behauptung.",
        r"Am Abend wurde $300$-mal gedreht. Welchen Überschuss kann der Stand erwarten? Ist dieser Betrag sicher?",
        r"Wie müsste der Hauptgewinn geändert werden, damit das Spiel fair ist? Und alternativ der Einsatz?",
        r"Eine Mitschülerin hat $10$-mal gespielt und $3$ € Plus gemacht. Sie sagt: „Deine Rechnung stimmt nicht.“ Beurteile."],
       solution=[
        r"Jede Auszahlung mal ihre Wahrscheinlichkeit: $0{,}1 \cdot 5 + 0{,}2 \cdot 2 + 0{,}7 \cdot 0 = 0{,}5 + 0{,}4 = 0{,}9$ €. Abzüglich Einsatz: $0{,}9 - 1 = -0{,}10$ €. Der Erwartungswert ist **nicht** null, das Spiel ist nicht fair: Im Schnitt verliert man $10$ Cent pro Drehung.",
        r"$300 \cdot 0{,}10 = 30$ €. Das ist der langfristige Durchschnitt, kein Versprechen: An einem Abend können fünf Hauptgewinne fallen oder gar keiner. Bei $300$ Drehungen liegt der Überschuss aber mit hoher Wahrscheinlichkeit in der Nähe von $30$ €, bei $10$ Drehungen wäre fast alles möglich.",
        r"Fair heißt Erwartungswert der Auszahlung gleich Einsatz. Hauptgewinn $x$: $0{,}1 \cdot x + 0{,}4 = 1$, also $0{,}1 x = 0{,}6$ und $x = 6$ €. Probe: $0{,}6 + 0{,}4 = 1$. Alternativ den Einsatz auf die erwartete Auszahlung senken: $0{,}90$ € pro Drehung.",
        r"Beides passt zusammen. Bei $10$ Spielen erwartet man $-1$ €, aber ein einziger Hauptgewinn dreht das Vorzeichen: $5 + 4 \cdot 2 = 13$ € Auszahlung bei $10$ € Einsatz ergibt genau $+3$ €. Der Erwartungswert beschreibt den Durchschnitt über sehr viele Spiele, nicht das Ergebnis von zehn. Erst bei hunderten Drehungen wird das Minus sichtbar, und genau darauf verlässt sich der Stand."],
       falle=r"Falle in a): die $0{,}90$ € als Gewinn anzusehen. Das ist die Auszahlung. Der Gewinn ist Auszahlung minus Einsatz, sonst wäre jedes Spiel mit Auszahlung fair.")


# ---------------------------------------------------------- numbers check ----
def check():
    from fractions import Fraction as F
    # AFB I: 10 Lose, 4 Gewinne, ohne Zuruecklegen
    assert F(4, 10) == F(2, 5) and float(F(4, 10)) == 0.4 and 1 - 0.4 == 0.6
    both = F(4, 10) * F(3, 9)
    one = F(4, 10) * F(6, 9) + F(6, 10) * F(4, 9)
    none = F(6, 10) * F(5, 9)
    assert both == F(2, 15) and F(12, 90) == F(2, 15) and abs(float(both) - 0.133) < 0.001
    assert one == F(8, 15) and F(48, 90) == F(8, 15) and F(24, 90) * 2 == F(48, 90) and abs(float(one) - 0.533) < 0.001
    assert none == F(1, 3) and F(30, 90) == F(1, 3) and 1 - none == F(2, 3)
    assert both + one == F(2, 3) and F(10, 15) == F(2, 3) and both + one + none == 1
    assert F(2, 15) + F(8, 15) + F(5, 15) == 1 and abs(0.4 * 0.4 - 0.16) < 1e-12
    # AFB II: Vierfeldertafel
    assert 120 - 30 == 90 and 200 - 120 == 80 and 80 - 10 == 70 and 30 + 10 == 40 and 90 + 70 == 160 and 40 + 160 == 200
    assert F(40, 200) == F(1, 5) and F(30, 120) == F(1, 4) and F(10, 80) == F(1, 8)
    assert float(F(40, 200)) == 0.2 and float(F(30, 120)) == 0.25 and float(F(10, 80)) == 0.125
    assert F(30, 200) == F(3, 20) and float(F(30, 200)) == 0.15 and abs(0.6 * 0.2 - 0.12) < 1e-12 and F(3, 20) != F(3, 25)
    assert F(1, 4) == 2 * F(1, 8) and F(30, 40) == F(3, 4) and float(F(30, 40)) == 0.75
    # AFB III: Gluecksrad 1x5, 2x2, 7 Nieten, Einsatz 1
    assert 1 + 2 + 7 == 10
    payout = F(1, 10) * 5 + F(2, 10) * 2 + F(7, 10) * 0
    assert payout == F(9, 10) and float(payout) == 0.9 and payout - 1 == F(-1, 10)
    assert 300 * F(1, 10) == 30 and 10 * F(-1, 10) == -1
    x = (1 - F(4, 10)) / F(1, 10)
    assert x == 6 and F(1, 10) * 6 + F(4, 10) == 1
    assert 5 + 4 * 2 == 13 and 13 - 10 == 3


s.verify(check)
s.save()
